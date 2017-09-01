package au.org.ala.merit
import au.com.bytecode.opencsv.CSVReader
import com.vividsolutions.jts.geom.Geometry
import com.vividsolutions.jts.geom.GeometryCollection
import com.vividsolutions.jts.geom.GeometryFactory
import com.vividsolutions.jts.geom.Point
import grails.converters.JSON
import org.apache.commons.lang.StringUtils
import org.geotools.geojson.geom.GeometryJSON
import org.grails.plugins.csv.CSVMapReader
import org.joda.time.DateTime

import java.text.DecimalFormat
import java.text.SimpleDateFormat
/**
 * Handles data import into ecodata.
 */
class ImportService {

    static int INSTITUTION_DIFFERENCE_THRESHOLD = 4
    public static final List CSV_HEADERS = ['Program', 'Round Name', 'GMS Round Name', 'Grant ID', 'Grant External ID', 'Sub-project ID', 'Grant Name', 'Grant Description', 'Grantee Organisation Legal Name', 'Grant Original Approved Amount', 'Grant Current Grant Funding (Ex. GST)', 'Start', 'Finish', 'Location Description']

    private static final String PROJECTS_CACHE_KEY = 'ImportService-AllProjects'

    static outputDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ssZ")
    static inputDateFormat = new SimpleDateFormat("dd/MM/yyyy")
    static shortInputDateFormat = new SimpleDateFormat("dd/MM/yy")

    /** The current format location data is supplied in */
    def locationRegExp = /lat. = ([\-0-9\.]*)\nlong. = ([\-0-9\.]*)\nLocation Description = (.*)lat\. =.*/

    def reportService
    def projectService
    def siteService
    def metadataService
    def cacheService
    def activityService
    def webService
    def grailsApplication
    def userService
    def documentService
    def roleEditor = "editor"
    def roleAdmin = "admin"
    def roleGrantManager = "caseManager"

    /**
     * Looks for columns "Grant ID","Sub-project ID","Recipient email 1","Recipient email 2","Grant manager email" and
     * creates project admin roles for recipient emails 1 & 2, and the case manager role for Grant manager email
     * @param csv
     * @return
     */
    def importUserPermissionsCsv(InputStream csv) {
        def results = [success:false, validationErrors:[], message:""]


        if (!csv) {
            results.message = "Invalid file - stream empty!"
            return results
        }

        def reader = new InputStreamReader(csv)
        try {

            def line = 0
            new CSVMapReader(reader).each { map ->

                line++

                // Convenience closure
                def logError = { msg ->
                    results.validationErrors << [line: line, message: msg]
                }

                def getUserName = { field ->
                    def name = map[field]?.trim()
                    if (name && name == "0") {
                        name = ""
                    }
                    return name
                }

                def grantId = map["Grant ID"]?.trim()
                if (!grantId) {
                    logError("Missing grant id")
                    return
                }

                def externalId = getExternalIdFromProjectMap(map)

                def project = findProjectByGrantAndExternalId(grantId, externalId)
                if (!project) {
                    logError("Invalid grant id '${grantId}' (ExternalID=${externalId}) - No project found")
                    return
                }

                def admin1 = getUserName("Recipient email 1")
                def admin1Id = null

                if (admin1) {
                    admin1Id = userService.checkEmailExists(admin1)
                    if (!admin1Id) {
                        logError("User name ${admin1} does not exist! (Recepient email 1)")
                        return
                    }
                }

                def admin2 = getUserName("Recipient email 2")
                def admin2Id = null
                if (admin2) {
                    admin2Id = userService.checkEmailExists(admin2)
                    if (!admin2Id) {
                        logError("User name ${admin2} does not exist! (Recepient email 2)")
                        return
                    }
                }

                def caseManager = getUserName("Grant manager email")
                def caseManagerId = null
                if (caseManager) {
                    caseManagerId = userService.checkEmailExists(caseManager)
                    if (!caseManagerId) {
                        logError("User name ${caseManager} does not exist (caseManager)!")
                        return
                    }
                }

                if (!admin1Id && !admin2Id && !caseManagerId) {
                    logError("No user ids have been specified!")
                    return
                }

                if (admin1Id) {
                    if (!userService.isUserAdminForProject(admin1Id, project.projectId)) {
                        def ret = userService.addUserAsRoleToProject(admin1Id, project.projectId, roleAdmin)
                        if (ret?.error) {
                            logError("Error occurred applying admin role to ${admin1} for project ${project.projectId}: ${ret.error}")
                        }
                    } else {
                        logError("Warning: User ${admin1} is already admin for grant id ${grantId} - skipping")
                    }
                }

                if (admin2Id) {
                    if (!userService.isUserAdminForProject(admin2Id, project.projectId)) {
                        def ret = userService.addUserAsRoleToProject(admin2Id, project.projectId, roleAdmin)
                        if (ret?.error) {
                            logError("Error occurred applying admin role to ${admin2} for project ${project.projectId}: ${ret.error}")
                        }
                    } else {
                        logError("Warning: User ${admin2} is already admin for grant id ${grantId} - skipping")
                    }
                }

                if (caseManagerId) {
                    if (!userService.isUserCaseManagerForProject(caseManagerId, project.projectId)) {
                        def ret = userService.addUserAsRoleToProject(caseManagerId, project.projectId, roleGrantManager)
                        if (ret?.error) {
                            logError("Error occurred applying caseManager role to ${caseManager} for project ${project.projectId}: ${ret.error}")
                        }

                    } else {
                        logError("Warning: User ${caseManager} is already case manager for grant id ${grantId} - skipping")
                    }
                }

            }

        } catch (Exception ex) {
            results.message = ex.message
        } finally {
            if (reader) {
                reader.close()
            }
        }

        return results
    }

    /**
     * Validates and imports project, site and institution data supplied by the GMS as a CSV file.
     */
    def importProjectsByCsv(InputStream csv,  importWithErrors = false) {
        CSVReader csvReader = new CSVReader(new InputStreamReader(csv, 'Cp1252'));
        def headerIndexes = validateHeader(csvReader.readNext());

        if (headerIndexes.missing) {
            return [success:false, error:"Invalid CSV file - missing header fields: ${headerIndexes.missing}"]
        }

        def results = [success:false, validationErrors:[]]

        def projectsCreated = 0, projectsUpdated = 0, sitesCreated = 0, sitesUpdated = 0, ignored = 0

        // Clear the cache before importing to ensure we get fresh data. (in particular because I keep dropping the database)
        cacheService.clear(PROJECTS_CACHE_KEY)

        String[] csvLine = csvReader.readNext();
        // Used to detect duplicate grantIds (as it is used as the key)
        def grantIds = []
        while (csvLine) {
            // This is to handle blank lines and subheadings which have appeared in the latest version
            if (csvLine.size() < CSV_HEADERS.size()) {
                log.warn("CSV line encountered with too few columns: ${csvLine}")
                csvLine = csvReader.readNext()
                continue
            }
            def grantId = csvLine[headerIndexes['Grant ID']]
            // This is to handle duplicate header columns and other formatting lines which appear through the latest version
            if (grantId.size() != 12) {
                log.debug("Invalid line encountered: ${csvLine}")
                csvLine = csvReader.readNext()
                continue
            }

            def project = validateProjectDetails(findHeaderColumns(headerIndexes, csvLine), grantIds)
            grantIds << "${project.grantId}-${project.externalId}"
            if (project.errors.size() > 0 || project.warnings.size() > 0) {
                writeErrors(results.validationErrors, project.errors, project.warnings, csvLine)
            }
            if (project.errors.size() == 0 || importWithErrors) {
                project.remove('errors')
                project.remove('warnings')
                def status = importProject(project)
                if (status.project == 'created') {
                    projectsCreated++
                }
                else if (status.project == 'updated') {
                    projectsUpdated++
                }
                if (status.site == 'created') {
                    sitesCreated++
                }
                else if (status.site == 'updated') {
                    sitesUpdated++
                }

            }
            else {
                ignored++
            }

            csvLine = csvReader.readNext()
        }
        results.projectsCreated = projectsCreated
        results.projectsUpdated = projectsUpdated
        results.sitesCreated = sitesCreated
        results.sitesUpdated = sitesUpdated
        results.ignored = ignored

        // Clear the cache again to free up memory and also in case old project data has been cached.
        cacheService.clear(PROJECTS_CACHE_KEY)
        println "Created: ${results.projectsCreated}, Updated: ${results.projectsUpdated}, Errors: ${ignored}"
        return results

    }

    def getExternalIdFromProjectMap(Map projectDetails) {
        def subProjectID = projectDetails['Sub-project ID']
        def externalID = projectDetails['Grant External ID']
        if (subProjectID) {
            return subProjectID
        } else {
            if (!externalID.equalsIgnoreCase('Not Provided')) {
                return externalID
            }
        }
        return null
    }

    def validateProjectDetails(projectDetails, grantIds) {

        def project = [:]
        def errors = []
        def warnings = []
        project.errors = errors
        project.warnings = warnings

        CSV_HEADERS.each {
            if (!projectDetails[it]) {
                if (it == 'Grant ID' || it == 'Grant Name') {
                    errors.add("No value for '${it}'")
                }
                else if (it != 'Sub-project ID' && it != 'Location Description') {
                    warnings.add("No value for '${it}'")
                }
            }
        }

        project.name = projectDetails['Grant Name']
        project.description = projectDetails['Grant Description']


        project.grantId = projectDetails['Grant ID']
        project.externalId = getExternalIdFromProjectMap(projectDetails)

        def funding = projectDetails['Grant Original Approved Amount']
        try {
            project.funding = new DecimalFormat('$##,###.##').parse(funding)
        }
        catch (Exception e) {
            errors.add("Unable to parse funding: "+funding)
        }
        if (projectDetails['Grantee Organisation Legal Name']) {
            project.organisationName = projectDetails['Grantee Organisation Legal Name']
        }
        else {
            project.organisationName = "Not specified"
        }

        def startDate = projectDetails['Start']
        try {

            if (startDate) {
                project.plannedStartDate = convertDate(startDate)
            }
        }
        catch (Exception e) {
            errors.add("Unable to parse Start Date: ${startDate}")
        }
        def endDate = projectDetails['Finish']

        try {
            if (endDate) {
                project.plannedEndDate = convertDate(endDate);
            }
        }
        catch (Exception e) {
            errors.add("Unable to parse Finish Date: ${endDate}")
        }

        if (grantIds.contains(project.grantId+'-'+project.externalId)) {
            errors.add("Duplicate Grant ID detected: '${project.grantId}-${project.externalId}'")
        }

        if (projectDetails['Application Location Desc']) {
            def locationData = (projectDetails['Application Location Desc'] =~ locationRegExp)
            if (!locationData) {
                errors.add("'Application Location Desc' doesn't match the expected format")
            }
            else {
                project.site = [:]
                project.site.lat = locationData.group(1)
                project.site.lon = locationData.group(2)
                project.site.description = locationData.group(3)
                project.site.name = 'Unnamed site'

            }
        }

        def program = projectDetails['Program']?.trim()
        def roundName = projectDetails['Round Name']?.trim()


        def matchedProgram = metadataService.programsModel().programs.find{ it.name.equalsIgnoreCase(program) }

        if (!matchedProgram) {
            warnings.add("'Program' does not match a valid program name: ${program}")
        }
        else {
            project.associatedProgram = matchedProgram.name
            def subprogram = matchedProgram.subprograms.find {it.name == roundName}
            if (!subprogram) {
                warnings.add("'Round Name' does not match a valid subprogram name: ${roundName}")
            }
            else {
                project.associatedSubProgram = subprogram.name
            }
        }

        return project
    }

    def convertDate(date) {


        if (date && date.isInteger()) {
            final long DAYS_FROM_1900_TO_1970 = 25567
            // Date is number of days since 1900
            long days = date as Long
            long millisSince1970 = (days - DAYS_FROM_1900_TO_1970) * 24l * 60l * 60l * 1000l
            return outputDateFormat.format(new Date(millisSince1970))
        }
        else {

            try {
                def format = date.length() == 10 ? inputDateFormat : shortInputDateFormat
                outputDateFormat.format(format.parse(date))
            }
            catch (Exception e) {
                throw e
            }
        }
    }

    def importProject(project, reload = true) {

        def status = [:]

        // Remove the site from the project as it will be saved separately.
        def site = project.remove('site')

        // The GrantID and External ID are not necessarily unique individually.
        def p = findProjectByGrantAndExternalId(project.grantId, project.externalId)
        if (p) {
            if (!reload) {
                status.project = 'existing'
                return status
            }
            project.projectId = p.projectId
            status.project = 'updated'
        }
        else {
            status.project = 'created'
        }

        def result = projectService.update(project.projectId?:'', project)

        // If a project was created the ID will be returned, otherwise use the value retrieved by the original query.
        def projectId = result.resp.projectId?:project.projectId
        project.projectId = projectId


        if (false && site && site.description) {

            // Get the project details, including any related sites.
            p = projectService.get(projectId)

            def s = findProjectSiteByDescription(p, site.description)


            def siteDetails = [:]
            siteDetails.name = site.name
            siteDetails.description = site.description
            siteDetails.extent = siteService.siteExtentFromPoint(site.lat, site.lon)

            // Under the current data import arrangements each project has one site.
            if (!s) {
                siteDetails.projects = [projectId]
                siteService.create(siteDetails)
                status.site = 'created'
            }
            else {
                siteDetails.siteId = s.siteId
                siteService.update(s.siteId, siteDetails)
                status.site = 'updated'
            }
        }
        status

        // TODO not creating missing institutions in the collectory at this time.
//        def institution = metadataService.getInstitutionByName(project.organisationName)
//        if (!institution) {
//            def potentialMatches = matchInstitution(project.organisationName)
//        }

    }

    def findProjectByGrantAndExternalId(grantId, externalId) {
        Map resp = projectService.search(grantId:grantId, externalId:externalId)
        if (resp?.resp?.projects) {
            if (resp.resp.projects.size() ==1) {
                return resp.resp.projects[0]
            }
            else {
                log.warn("Multiple projects found with the same grant and external id! ${grantId}, ${externalId}")
            }

        }
        return null
    }

    def findProjectsByOriginalProjectId(projectId) {
        def allProjects = cacheService.get(PROJECTS_CACHE_KEY) { [projects:projectService.list(true)] }
        return allProjects.projects.findAll{it.originalProjectId == projectId}
    }

    def findProjectByGrantId(grantId) {
        // Cache projects temporarily to avoid this query.
        def allProjects = cacheService.get(PROJECTS_CACHE_KEY) { [projects:projectService.list(true)] }
        return allProjects.projects.find{it.grantId?.equalsIgnoreCase(grantId)}
    }

    def allProjectsWithGrantId(grantId) {
        def allProjects = cacheService.get(PROJECTS_CACHE_KEY) { [projects:projectService.list(true)] }
        return allProjects.projects.findAll{it.grantId?.equalsIgnoreCase(grantId)}
    }

    def findProjectSiteByDescription(project, description) {
        return project.sites?.find{it.description?.equalsIgnoreCase(description)}
    }

    def findProjectSiteByName(project, name) {
        return project.sites?.find{it.name?.equalsIgnoreCase(name)}
    }

    def matchInstitution(String institutionName) {

        def lowerCaseName = institutionName.toLowerCase()
        return metadataService.institutionList().findAll({StringUtils.getLevenshteinDistance(it.name.toLowerCase(), lowerCaseName) < INSTITUTION_DIFFERENCE_THRESHOLD})
    }


    private def writeErrors(results, errors, warnings, String[] line) {
        def errorLine = []
        errorLine << errors.join('\n')
        errorLine << warnings.join('\n')

        line.each{
            // The truncation is because the CSV file is slow because of the large amount of repetition in the
            // location cells in particular
            errorLine << it.substring(0, Math.min(it.length(), 100)).replaceAll('\n', ' ').replaceAll('"', "'")
        }

        results << errorLine
    }

    private def validateHeader(String[] headerTokens) {

        def suppliedHeaders = headerTokens as List
        def missingHeaders = []
        def headerIndicies = [:]
        CSV_HEADERS.each{
            int index = suppliedHeaders.indexOf(it)
            if (index < 0) {
                missingHeaders << it
            }
            headerIndicies << [(it):index]
        }
        if (missingHeaders.size() > 0) {
            headerIndicies.missing = missingHeaders
        }
        headerIndicies

    }

    private def findHeaderColumns(headerDetails, String[] csvLine) {

        def projectDetails = [:]
        headerDetails.each {key, value ->
            projectDetails << [(key):csvLine[value]]

        }
        projectDetails
    }



    /** Constants used by the MERI plan import */
    final int GRANT_ID_COLUMN = 0
    final int SUB_PROJECT_ID_COLUMN = 1
    final int OUTPUT_COLUMN = 3


    /**
     * Validates and imports project plan data as supplied by DOE.
     */
    def importPlansByCsv(InputStream csv,  overwriteActivities = false) {

        cacheService.clear(PROJECTS_CACHE_KEY)

        CSVReader csvReader = new CSVReader(new InputStreamReader(csv, 'Cp1252'));

        String[] csvLine = csvReader.readNext();

        def useSubProject = false
        if (csvLine[SUB_PROJECT_ID_COLUMN]?.trim() == 'Sub-project ID') {
            useSubProject = true
        }

        def stageOffsets = findStageOffsets(csvLine)
        def allHeaders = csvLine
        // Used to detect duplicate grantIds (as it is used as the key)
        def grantIds = []

        csvLine = csvReader.readNext()

        def failedPlans = [:]
        def successPlans = [:]
        while (csvLine) {

            def grantId = csvLine[GRANT_ID_COLUMN]
            if (grantId) {
                grantId = grantId.split()[0]
            }
            def subProject = ''
            if (useSubProject) {
                subProject = csvLine[SUB_PROJECT_ID_COLUMN]
            }

            def id = [grantId:grantId, externalId:subProject]

            if (!grantIds.contains(id)) {

                def results = parsePlan(grantId, subProject, csvLine, stageOffsets, overwriteActivities, allHeaders)
                if (!results.error && !results.activities) {
                    results = [error:"No activities defined for project with grant id = ${grantId}"]
                }
                else if (!results.error) {
                    def projectId = results.remove('projectId')
                    def importResults = importPlan(projectId, results)
                    results << [importStatus:importResults]
                    if (results.importStatus?.resp?.status == 200) {
                        results.success = true
                    }
                }
                if (!results.success) {
                    failedPlans[id] = results
                }
                else {
                    successPlans[id] = results
                }
                grantIds << id
            }
            else {
                log.error("Duplicate Grant ID detected: "+grantId)
            }
            csvLine = csvReader.readNext();

        }

        cacheService.clear(PROJECTS_CACHE_KEY)

        return [failedCount:failedPlans.size(), successCount:successPlans.size(), failed:failedPlans, succeeded:successPlans]
    }


    def importPlan(projectId, planDetails) {

        def project = [projectId:[type:'guid', id:projectId]]
        project.activities = planDetails.activities
        project.outputTargets = planDetails.outputTargets
        project.timeline = planDetails.timeline
        project.planStatus = "approved"

        def url = grailsApplication.config.ecodata.baseUrl + 'external/v1/projectActivities'

        def results = webService.doPost(url, project)
        results
    }

    def findStageOffsets(headerLine) {
        int offset = 0

        def stageOffsets = []

        while (offset < headerLine.length && headerLine[offset]) {
            if (headerLine[offset] == 'Stage') {
                stageOffsets << offset
            }
            offset++
        }

        stageOffsets


    }

    def parsePlan(grantId, externalId, String[] csvLine, stageOffsets, overwriteActivities, allHeaders) {

        // Column headers: (as this is more or less a once off load..)

        // Project ID	Project title	Project description	Theme 1 outputs: # ha to be revegetated	Theme 1 description: Vegetation description	Theme 1 description: Current condition	Theme 1 description: Intended condition	Theme 1 description: method used for assessment of condition	Theme 2 outputs: #ha to be protected	Theme 2 description: Vegetation description	Theme 2 description: current condition	Theme 2 description: intended condition	Theme 2 description: method for assessment	Theme 3 outputs: #ha to be managed	Theme 3 outputs: invasive spp managed	Theme 3 description: other	non-theme outputs: # plants planted	non-theme outputs: #kg seed sown	non-theme description: % survival rate for plants	non-theme description: #canopy species planted	non-theme description: #understorey spp planted	non-theme description: #ground layer spp planted	non-theme outputs: #km fenced	non-theme description: other	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11type	Activity 11 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Activity 12 type	Activity 12 description	Activity 13 type	Activity 13 description	Activity 14 type	Activity 14 description	Activity 15 type	Activity 15 description	Activity 16 type	Activity 16 description	Activity 17 type	Activity 17 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Activity 12 type	Activity 12 description	Activity 13 type	Activity 13 description	Activity 14 type	Activity 14 description	Activity 15 type	Activity 15 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Activity 12 type	Activity 12 description	Activity 13 type	Activity 13 description	Activity 14 type	Activity 14 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Activity 12 type	Activity 12 description	Activity 13 type	Activity 13 description	Activity 14 type	Activity 14 description	Activity 15 type	Activity 15 description	Activity 16 type	Activity 16 description	Activity 17 type	Activity 17 description	Activity 18 type	Activity 18 description	Activity 19 type	Activity 19 description	Activity 20 type	Activity 20 description
        int stageNum = 0

        try {
            def project = null
            if (externalId) {
                project = findProjectByGrantAndExternalId(grantId, externalId)
            }
            else {
                project = findProjectByGrantId(grantId)
            }

            if (!project) {
                return [error:"No project with grant id = ${grantId}, external id = ${externalId}"]
            }
            def existingActivities = activityService.activitiesForProject(project.projectId)
            if (existingActivities) {
                if (!overwriteActivities) {
                    return [error:"Project with grant id = ${grantId} already has activities defined.  Not importing."]
                }
                else {
                    existingActivities.each { activityService.delete(it.activityId) }
                }
            }

            def timeline = []
            def activities = []

            while (stageNum < stageOffsets.size()) {

                def startOffset = stageOffsets[stageNum]
                def endOffset = stageNum < stageOffsets.size()-1 ? stageOffsets[stageNum+1] : csvLine.length

                def stageDetails = readStage(csvLine[startOffset..<endOffset], project)
                if (stageDetails.finished) {
                    log.warn("Grant ${grantId} finished at stage ${stageNum}")
                    break
                }
                if (stageDetails.error) {
                    return [error:stageDetails.error]
                }
                timeline << stageDetails.stage
                if (stageDetails.activities) {
                    activities.addAll(stageDetails.activities)
                }
                stageNum++

            }
            def outputs = readOutputs(project, csvLine[OUTPUT_COLUMN..<stageOffsets[0]], activities, allHeaders[OUTPUT_COLUMN..<stageOffsets[0]])

            return [timeline:timeline, activities:activities, outputTargets:outputs, projectId:project.projectId]
        }
        catch (Exception e) {
            e.printStackTrace()
            return [error:"Error importing project with grantId = ${grantId}, stage=${stageNum+1}, error=${e.getMessage()}"]
        }

    }

    def readOutputs(project, outputDetails, activities, outputHeaders) {
        if (project.associatedProgram.startsWith('Biodiversity Fund') && project.associatedSubProgram == 'Round 1') {
            return readBioFundOutputs(outputDetails, activities)
        }
        else {
            return readCFOCOutputs(outputDetails, outputHeaders, activities)
        }
    }

    def readCFOCOutputs(outputDetails, outputHeaders, activities) {
        def headers=['Revegetation ha':[outputLabel: 'Revegetation Details', scoreName: 'areaOfWorks' , scoreLabel: 'Area of works', units:'Ha'],
                'Weed treatment: area treated ha':[outputLabel: 'Weed Treatment Details', scoreName: 'areaTreatedHa' , scoreLabel: 'Total area treated (Ha)', units:'Ha'],
                'Seed Collected Kg':[outputLabel: 'Seed Collection Details', scoreName: 'seedCollectedKg' , scoreLabel: 'Seed collected (Kg)', units:'Kg'],
                'Length of Fence km':[outputLabel: 'Fence Details', scoreName: 'lengthOfFence' , scoreLabel: 'Total length of fence', units:'Km'],
                'Total participants not employed':[outputLabel: 'Participant Information', scoreName: 'totalParticipants' , scoreLabel: 'Total No. of participants', units:''],
                'number Of Indigenous Participants':[outputLabel: 'Participant Information', scoreName: 'numberOfIndigenousParticipants' , scoreLabel: 'No of indigenous participants', units:''],
                'number Of Community Groups':[],
                'Area of fire Ha':[outputLabel: 'Fire Information', scoreName: 'areaOfFireHa' , scoreLabel: 'Area of burn (Ha)', units:'Ha'],
                'Fire reason':[],
                'Access Management Method':[],
                'number Of Installations':[],
                'Number events':[],
                'Event purpose':[],
                'Number events':[],
                'Event purpose':[],
                'Works Implementation Planning-Sites':[],
                'Works Implementation Planning-Outputs':[],
                'number On Country Visits':[],
                'number Of Indigenous Participants':[]]

        def agHeaders = [
                'Entities adopt sus land management practices':[outputLabel:'Management Practice Change Details', scoreName:'totalEntitiesAdoptingChange', scoreLabel:'Farming entities adopting sustainable practice change', units:''],
                'Area Sus ag adopted Ha':[outputLabel:'Management Practice Change Details', scoreName:'benefitAreaHa', scoreLabel:'Area of land changed to sustainable practices', units:'Ha'],
                'Participants engaged':[outputLabel:'Participant Information', scoreName:'totalParticipantsNew', scoreLabel:'Total No. of unique participants attending project events', units:''],
                'No. of community participation and engagement events':[outputLabel:'Event Details', scoreName:'eventTopics', scoreLabel:'Number of Community Participation and Engagement events', units:''],
                'Revegetation: Area of works Ha':[outputLabel: 'Revegetation Details', scoreName: 'areaOfWorks' , scoreLabel: 'Area of works', units:'Ha'],
                'Revegetation: Number of plants planted':[outputLabel: 'Revegetation Details', scoreName: 'totalNumberPlanted' , scoreLabel: 'Number of plants planted', units:''],
                'Revegetation: Kgs of seed sown Kg':[outputLabel: 'Revegetation Details', scoreName: 'totalSeedSownKg' , scoreLabel: 'Kgs of seed sown', units:'kg'],
                'Seed collected Kg':[outputLabel: 'Seed Collection Details', scoreName: 'seedCollectedKg' , scoreLabel: 'Seed collected (Kg)', units:'Kg'],
                'Site Preparation: total area treated Ha':[outputLabel:'Site Preparation Actions', scoreName:'preparationAreaTotal', scoreLabel:'Total area prepared for follow-up treatment actions', units:'Ha'],
                'Site Preperation: total area treated Ha':[outputLabel:'Site Preparation Actions', scoreName:'preparationAreaTotal', scoreLabel:'Total area prepared for follow-up treatment actions', units:'Ha'],
                'Weed treatment: Total area treated Ha':[outputLabel:'Weed Treatment Details', scoreName:'areaTreatedHa', scoreLabel:'Total area treated (Ha)', units:'Ha'],
                'Pest/disease: No. of individual animals killed/removed':[outputLabel:'Pest Management Details', scoreName:'pestAnimalsTreatedNo', scoreLabel:'No. of individual animals killed/removed', units:''],
                'Pest/disease: Area covered by pest treatment Ha':[outputLabel:'Pest Management Details', scoreName:'areaTreatedForPests', scoreLabel:'Area covered by pest treatment (Ha)', units:'Ha'],
                'Fire Management: Area of burn Ha':[outputLabel:'Fire Information', scoreName:'areaOfFireHa', scoreLabel:'Area of burn (Ha)', units:'Ha'],
                'Conservation Grazing Management: Area managed with stock Ha':[outputLabel:'Stock Management Details', scoreName:'areaOfStockManagmentHa', scoreLabel:'Area managed with stock (Ha)', units:'Ha'],
                'Area managed with stock Ha':[outputLabel:'Stock Management Details', scoreName:'areaOfStockManagmentHa', scoreLabel:'Area managed with stock (Ha)', units:'Ha'],
                'Erosion area treated Ha':[outputLabel:'Erosion Management Details', scoreName:'erosionAreaTreated', scoreLabel:'Erosion area treated (Ha)', units:'Ha'],
                'Erosion: Length of stream/coastline treated Km':[outputLabel:'Erosion Management Details', scoreName:'erosionLength', scoreLabel:'Length of stream/coastline treated (m)', units:'metres'],
                'Weight of debris removed Tonnes':[outputLabel:'Debris Removal Details', scoreName:'debrisWeightTonnes', scoreLabel:'Weight of debris removed (Tonnes)', units:'Tonnes'],
                'Volume of debris removed m3':[outputLabel:'Debris Removal Details', scoreName:'debrisVolumeM3', scoreLabel:'Volume of debris removed (m3)', units:'m3'],



        ]

        def outputs = []
        outputDetails.eachWithIndex { target, i ->

            def header = outputHeaders[i]?.trim()

            if (agHeaders[header]) {
                addOutput(outputs, agHeaders[header], target)
            }
            else if (headers[header]) {
                addOutput(outputs, headers[header], target)
            }
            else if (header == 'Theme 2') {
                def hasWeedTreatment = activities.find{it.type == 'Weed Treatment'}
                def hasPests = activities.find{it.type == 'Pest and Disease Management'}
                if (hasWeedTreatment) {
                    addOutput(outputs, [outputLabel:'Weed Treatment Details', scoreName:'areaTreatedHa', scoreLabel:'Total area treated (Ha)', units:'Ha'], target)
                }
                if (hasPests) {
                    addOutput(outputs, [outputLabel:'Pest Management Details', scoreName:'areaTreatedForPests', scoreLabel:'Area covered by pest treatment (Ha)', units:'Ha'], target)
                }
            }
            else if (header.equalsIgnoreCase('Project description') ||
                    header.equalsIgnoreCase('Sub-project') ||
                    header.equalsIgnoreCase('Project title') ||
                    header.equalsIgnoreCase('Funding ($)')) {
                // Do nothing, some of the spreadsheets have different formats.
            }
            else {
                throw new Exception("unmatched output target: ${target}, index: ${i}")
            }
        }
        outputs
    }

    def readBioFundOutputs(outputDetails, activities) {

        def revegOutcome = ''
        def outputs = []

        int offset = 0

        def theme1Reveg = outputDetails[offset++]


        def theme1Desc = outputDetails[offset++]
        if (theme1Desc) {
            revegOutcome += "Theme 1 vegetation description: ${theme1Desc}\n"
        }
        def theme1CurrentCondition = outputDetails[offset++]
        if (theme1CurrentCondition) {
            revegOutcome += "Theme 1 vegetation current condition: ${theme1CurrentCondition}\n"
        }
        def theme1TargetCondition = outputDetails[offset++]
        if (theme1TargetCondition) {
            revegOutcome += "Theme 1 vegetation target condition: ${theme1TargetCondition}\n"
        }
        def theme1AssessmentMethod = outputDetails[offset++]

        if (theme1AssessmentMethod) {
            revegOutcome += "Theme 1 vegetation assessment method: ${theme1AssessmentMethod}\n"
        }
        def theme2Reveg = outputDetails[offset++]

        // Same again, a bunch of text for theme 2 this time.
        def theme2Desc = outputDetails[offset++]
        if (theme2Desc) {
            revegOutcome += "Theme 2 vegetation description: ${theme2Desc}\n"
        }
        def theme2CurrentCondition = outputDetails[offset++]
        if (theme2CurrentCondition) {
            revegOutcome += "Theme 2 vegetation current condition: ${theme2CurrentCondition}\n"
        }
        def theme2TargetCondition = outputDetails[offset++]
        if (theme2TargetCondition) {
            revegOutcome += "Theme 2 vegetation target condition: ${theme2TargetCondition}\n"
        }
        def theme2AssessmentMethod = outputDetails[offset++]

        if (theme2AssessmentMethod) {
            revegOutcome += "Theme 2 vegetation assessment method: ${theme2AssessmentMethod}\n"
        }

        def hasWeedTreatment = activities.find{it.type == 'Weed Treatment'}
        def hasPests = activities.find{it.type == 'Pest and Disease Management'}

        def theme3Description = ''
        // Theme 3 area
        def theme3Area = outputDetails[offset++]


        // Now species lists, text & number???  for theme 3.
        def invasiveSpeciesManaged = outputDetails[offset++]
        if (invasiveSpeciesManaged) {
            theme3Description += "Invasive species managed: ${invasiveSpeciesManaged}\n"
        }
        def theme3OtherOutcome = outputDetails[offset++]
        if (theme3OtherOutcome) {
            theme3Description += "Theme 3 other outcomes: ${theme3OtherOutcome}"
        }

        if (hasWeedTreatment) {
            addOutput(outputs, [outputLabel: 'Weed Treatment Details', scoreName: 'areaTreatedHa' , scoreLabel: 'Total area treated (Ha)', units:'Ha'], theme3Area)
            outputs << [outputLabel:'Weed Treatment Details', outcomeTarget:theme3Description]

        }
        if (hasPests) {
            addOutput(outputs, [outputLabel: 'Pest Management Details', scoreName: 'areaTreatedForPests' , scoreLabel: 'Area covered by pest treatment (Ha)', units:'Ha'], theme3Area)
            outputs << [outputLabel:'Pest Management Details', outcomeTarget:theme3Description]

        }

        addOutput(outputs, [outputLabel: 'Revegetation Details', scoreName: 'totalNumberPlanted' , scoreLabel: 'Number of plants planted', units:''], outputDetails[offset++])
        addOutput(outputs, [outputLabel: 'Revegetation Details', scoreName: 'totalSeedSownKg' , scoreLabel: 'Kgs of seed sown', units:'kg'], outputDetails[offset++])


        def survivalRate = outputDetails[offset++]
        if (survivalRate) {
            revegOutcome += "% survival rate for plants: ${survivalRate}\n"
        }

        def numberCanopySpeciesPlanted = outputDetails[offset++]
        if (numberCanopySpeciesPlanted) {
            revegOutcome += "# canopy species planted: ${numberCanopySpeciesPlanted}\n"
        }

        def numberUnderstorySpeciesPlanted = outputDetails[offset++]
        if (numberUnderstorySpeciesPlanted) {
            revegOutcome += "# understorey species planted: ${numberUnderstorySpeciesPlanted}\n"
        }
        def numberGroundLayerSpeciesPlanted = outputDetails[offset++]
        if (numberGroundLayerSpeciesPlanted) {
            revegOutcome += "# ground layer species planted: ${numberGroundLayerSpeciesPlanted}\n"
        }

        addOutput(outputs, [outputLabel: 'Fence Details', scoreName: 'lengthOfFence' , scoreLabel: 'Total length of fence', units:'Km',], outputDetails[offset++])

        // Now an "other"???
        def other = ''
        other << "Other outcomes: ${outputDetails[offset++]}"
        other << "Other outcomes: ${outputDetails[offset++]}"

        outputs << [outputLabel:'Outcomes', outcomeTarget:other]

        def totalReveg = 0
        if (theme1Reveg && theme1Reveg.isInteger()) {
            totalReveg += theme1Reveg as Integer
        }
        if (theme2Reveg && theme2Reveg.isInteger()) {
            totalReveg += theme2Reveg as Integer
        }
        addOutput(outputs, [outputLabel: 'Revegetation Details', scoreName: 'areaOfWorks' , scoreLabel: 'Area of works', units:'Ha'], totalReveg)

        outputs << [outputLabel:'Revegetation Details', outcomeTarget:revegOutcome]

        outputs
    }

    def addOutput(outputs, output, target) {
        if (target) {
            output.target = target
            outputs << output
        }
    }

    def readStage(stageDetails, project) {

        def validActivities = metadataService.activitiesModel().activities

        def results = [:]
        int offset = 0
        def stage = [:]

        def stageNum = stageDetails[offset++]
        if (!stageNum) {

            return [finished:true]
        }
        stage.name = 'Stage '+ stageNum
        def fromDate = stageDetails[offset++]
        if (fromDate.equalsIgnoreCase('Commencement')) {
            fromDate = project.plannedStartDate

            if (!fromDate) {
                stage.fromDate = convertDate('01/07/2012')
            }
            else {
                stage.fromDate = fromDate
            }
        }
        else {
            stage.fromDate = convertDate(fromDate)
        }

        stage.toDate = convertDate(stageDetails[offset++])

        results.stage = stage

        def unmatchedActivities = []
        // Assume at least one activity

        int i = 0
        def activities = []
        while (offset < stageDetails.size()) {

            def activity = [:]

            def activityType = stageDetails[offset++]?.trim()
            def activityDescription = stageDetails[offset++]?.trim()
            if (activityType) {
                activity.type = matchActivity(validActivities, activityType)
                if (!activity.type) {
                    unmatchedActivities << activityType
                }

                activity.description = activityDescription
                activity.plannedStartDate = stage.fromDate
                activity.plannedEndDate = stage.toDate
                activity.progress = 'planned'
                activity.sequence = i
                activities << activity
            }
            else if (activityDescription) { // There are spots in the spreadsheets containing blanks that have activities following.
                results.error = "Description without activity type at offset ${offset-1} of ${stage.name}"
            }
            i++
        }
        if (unmatchedActivities) {
            results.error = "Unmatched activity type(s) supplied ${unmatchedActivities}"
        }
        results.activities = activities

        results
    }

    def matchActivity(validActivities, activityType) {


        activityType = activityType ? activityType.trim() : ''

        // Default unspecified site assessments to the DoE site assessment.
        if (activityType.equalsIgnoreCase('Site Assessment')) {
            activityType = 'Vegetation Assessment - Biodiversity Fund (DoE)'
        }
        def match = validActivities.find {it.name.equalsIgnoreCase(activityType)}
        match = match?match.name:null


        if (!match) {

            if (activityType.equalsIgnoreCase('Administration') ||
                    activityType.equalsIgnoreCase('Project administratoon') ||
                    activityType.equalsIgnoreCase('Adminit') ||
                    activityType.equalsIgnoreCase('Adminitration') ||
                    activityType.equalsIgnoreCase('Administratoin') ||
                    activityType.equalsIgnoreCase('Project Administraton') ||
                    activityType.equalsIgnoreCase('Project administratio') ||
                    activityType.equalsIgnoreCase('Poorject administration') ||
                    activityType.equalsIgnoreCase('Project adminisration') ||
                    activityType.equalsIgnoreCase('ProProject Administration') ||
                    activityType.equalsIgnoreCase('Ptroject Administration')) {
                match = 'Project Administration'
            }
            else if (activityType.equalsIgnoreCase('Project Employment') ||
                    activityType.equalsIgnoreCase('Indigenous Employment and Enterprise')) {
                match ='Indigenous Employment & Enterprise'
            }
            else if (activityType.equalsIgnoreCase('Site planning') ||
                    activityType.equalsIgnoreCase('Sie Planning') ||
                    activityType.equalsIgnoreCase('Works implentation planning') ||
                    activityType.equalsIgnoreCase('Works Implementation plannng') ||
                    activityType.equalsIgnoreCase('Work implementation Planning') ) {
                match = 'Works Implementation Planning'
            }
            else if (activityType.equalsIgnoreCase('Grazing Management')) {
                match = 'Conservation Grazing Management'
            }
            else if (activityType.equalsIgnoreCase('Weed Infestation & Monitoring') ||
                    activityType.equalsIgnoreCase('Weed Infestation and Monitoring') ||
                    activityType.equalsIgnoreCase('Weed mapping and monitoring') ||
                    activityType.equalsIgnoreCase('Weed mapping and monitorig')) {
                match = 'Weed Mapping & Monitoring'
            }
            else if (activityType.equalsIgnoreCase('Install/construct erosion control structure')) {
                match = 'Erosion Management'
            }
            else if (activityType.equalsIgnoreCase('Pest Management') ||
                    activityType.equalsIgnoreCase('Pest Animal management') ||
                    activityType.equalsIgnoreCase('Pest management') ||
                    activityType.equalsIgnoreCase('Pest  management') ||
                    activityType.equalsIgnoreCase('Pest nad Disease Management') ||
                    activityType.equalsIgnoreCase('Pest  management') ||
                    activityType.equalsIgnoreCase('Pest and Disease Mangement') ||
                    activityType.equalsIgnoreCase('Pest and Disease Managment') ||
                    activityType.equalsIgnoreCase('pest and disease managemnet')) {
                match = 'Pest and Disease Management'
            }
            else if (activityType.equalsIgnoreCase('BioCondition Site Assessment (v2.1)')) {
                match = 'Vegetation Assessment - BioCondition (QLD)'
            }
            else if (activityType.endsWith('Biodiversity Fund')) {
                match = 'Vegetation Assessment - Biodiversity Fund (DoE)'
            }
            else if (activityType.equalsIgnoreCase('Infrastructure Works')) {
                match = 'Infrastructure Establishment'
            }
            else if (activityType.equalsIgnoreCase('Site Assessment - Bushland Condition Monitoring') ||
                    activityType.equalsIgnoreCase('Site Assessment - Bushland Condition Monitoring (SA)')) {
                match = 'Vegetation Assessment - Bushland Condition Monitoring (SA)'
            }
            else if (activityType.equalsIgnoreCase('Site Preperation') ||
                    activityType.equalsIgnoreCase('Site preparation (e.g. including propagation for planting).') ||
                    activityType.equalsIgnoreCase('Site preparation (e.g. including propagation for planting).') ||
                    activityType.equalsIgnoreCase('Site preparation (e.g. including propagation for planting).') ||
                    activityType.equalsIgnoreCase('Site preparation (e.g. includes propagation for planting).') ||
                    activityType.equalsIgnoreCase('Site preparation (e.g. includes propagation for planting') ||
                    activityType.equalsIgnoreCase('Site Preparation (e.g. include propagation of planting).') ||
                    activityType.equalsIgnoreCase('Site preparation (e.g. includes propagation for planting)') ||
                    activityType.equalsIgnoreCase('Site Preparation (e.g. includes propagation for planting).') ||
                    activityType.equalsIgnoreCase('Site Preparation (e.g. includes propagation  for planting).') ||
                    activityType.equalsIgnoreCase('Site preperation (e.g. includes propagation for planting).') ||
                    activityType.equalsIgnoreCase('Site Preparatiom') ||
                    activityType.startsWith('Site Preparation') ||
                    activityType.startsWith('Site  preparation') ||
                    activityType.equalsIgnoreCase('Site preparartion')) {
                match = 'Site Preparation'
            }
            else if (activityType.equalsIgnoreCase('community participation and development') ||
                    activityType.equalsIgnoreCase('Community Participation and Enagement') ||
                    activityType.equalsIgnoreCase('Community Participation and Engagment') ||
                    activityType.equalsIgnoreCase('Commommunity Participation and Engagement') ||
                    activityType.equalsIgnoreCase('Community Partiicipation and Engagement') ||
                    activityType.equalsIgnoreCase('Community Participation and Enagagement') ||
                    activityType.equalsIgnoreCase('Community Engagement and Participation') ||
                    activityType.equalsIgnoreCase('Community Participation an Engagement') ||
                    activityType.equalsIgnoreCase('Community Participation') ||
                    activityType.equalsIgnoreCase('Community paqrticipation and engagement') ||
                    activityType.equalsIgnoreCase('Community paticipation and development') ||
                    activityType.equalsIgnoreCase('Community Participation and Engegement') ||
                    activityType.equalsIgnoreCase('Communiy Particpation and Engagement')) {
                match = 'Community Participation and Engagement'
            }
            else if (activityType.equalsIgnoreCase('Site Assessment') ||
                     activityType.equalsIgnoreCase('Site Assesment')  ||
                    activityType.equalsIgnoreCase('Site Assesment')  ||
                    activityType.equalsIgnoreCase('Site Assesent')  ||
                    activityType.equalsIgnoreCase('Site Assessments')  ||
                    activityType.equalsIgnoreCase('Site assessmenet') ||
                    activityType.equalsIgnoreCase('Site assessment (e.g. includes general monitoring).') ||
                    activityType.equalsIgnoreCase('Site Assesssment') ||
                    activityType.equalsIgnoreCase('Site Assessmnet') ||
                    activityType.equalsIgnoreCase('Site assessment (e.g. includes general monitoring)') ||
                    activityType.equalsIgnoreCase('Site assessment � Biodiversity Fund (DoE)') ||
                    activityType.equalsIgnoreCase('Site assessment (e,g. inlcudes general monitoring).') ||
                    activityType.equalsIgnoreCase('Site assessment � Biodiversity Fund (DoE)') ||
                    activityType.equalsIgnoreCase('Site assessment (e.g. inlcludes general monitoring).') ||
                    activityType.equalsIgnoreCase('Site assessement') ||
                    activityType.equalsIgnoreCase('Site assessment � Biodiversity Fund (DoE)') ||
                    activityType.equalsIgnoreCase('Site assessment �  Biodiversity Fund (DoE)') ||
                    activityType.equalsIgnoreCase('Site assessment (e.g. include general monitoring).') ||
                    activityType.equalsIgnoreCase('Site assessment (e.g. general monitoring).') ||
                    activityType.equalsIgnoreCase('Site assessment �  Biodiversity Fund (DoE)') ||
                    activityType.equalsIgnoreCase('Site assessment(e.g. includes general monitoring)') ||
                    activityType.equalsIgnoreCase('Site Assessent') ||
                    activityType.equalsIgnoreCase('(1-26) Site Assessment') ||
                    activityType.startsWith('Site assessment (e.g. includes general monitoring)') ||
                    activityType.equalsIgnoreCase('Site Assesmment') ||
                    activityType.equalsIgnoreCase('site asessment') ||
                    activityType.equalsIgnoreCase('Site assessment (e.g. inlcudes general monitoring).') ||
                    activityType.endsWith('(DoE)')) {
                match = 'Vegetation Assessment - Biodiversity Fund (DoE)'
            }
            else if (activityType.equalsIgnoreCase('Pest animal assessment')) {
                match = 'Pest animal survey'
            }
            else if (activityType.equalsIgnoreCase('Revegetaion') ||
                    activityType.equalsIgnoreCase('Rvegetation') ||
                    activityType.equalsIgnoreCase('revegetation\'')) {
                match = 'Revegetation'
            }
            else if (activityType.equalsIgnoreCase('Site Assessment � TasVeg') ||
                     activityType.endsWith('TasVeg')) {
                match = 'Vegetation Assessment - TasVeg (TAS)'
            }
            else if (activityType.equalsIgnoreCase('Fauna (Biological Survey)') ||
                    activityType.equalsIgnoreCase('Fauna (bioligical) survey') ||
                    activityType.equalsIgnoreCase('Fauna  (biological) Survey') ||
                    activityType.equalsIgnoreCase('Fauna (Biological) Surveys') ||
                    activityType.equalsIgnoreCase('Flora (biologiocal) survey') ||
                    activityType.equalsIgnoreCase('fauna survey')) {
                match = 'Fauna (biological) survey'
            }
            else if (activityType.equalsIgnoreCase('Training and Skill development') ||
                    activityType.equalsIgnoreCase('Training and Skills Planning') ||
                    activityType.equalsIgnoreCase('Training Skills and Development')) {
                match = 'Training and Skills Development'
            }
            else if (activityType.equalsIgnoreCase('Fence')) {
                match = 'Fencing'
            }
            else if (activityType.equalsIgnoreCase('Site Assessment - Habitat Hectares')) {
                match = 'Vegetation Assessment - Habitat Hectares (VIC)'
            }
            else if (activityType.equalsIgnoreCase('Outcomes , Evaluation and Learning') ||
                     activityType.startsWith('Outcomes, Evaluation and Learning') ||
                     activityType.startsWith('Outcomes, Evalation and Learning')) {
                match = 'Outcomes, Evaluation and Learning'
            }
            else if (activityType.equalsIgnoreCase('Weeed Treatment') ||
                    activityType.equalsIgnoreCase('Weed Tratement') ||
                    activityType.equalsIgnoreCase('weed treatement')) {
                match = 'Weed Treatment'
            }
            else if (activityType.equalsIgnoreCase('Flora (Biological) Surverys') ||
                    activityType.equalsIgnoreCase('Flora (biological ) survey')) {
                match = 'Flora (biological) survey'
            }

        }


        return match

    }


    def gmsImport(InputStream csv, status, preview, charEncoding = 'Cp1252') {

        def action = preview?{rows -> mapProjectRows(rows, status)}:{rows -> importAll(rows, status)}

        def result = [:]
        cacheService.clear(PROJECTS_CACHE_KEY)
        def reader = new InputStreamReader(csv, charEncoding)
        try {
            def mapper = new GmsMapper(metadataService.activitiesModel(), metadataService.programsModel(), metadataService.organisationList()?.list, metadataService.getOutputTargetScores())
            def first = true
            def prevGrantId = null
            def prevExternalId = null
            def projectRows = []
            new CSVMapReader(reader).eachWithIndex { rowMap, i ->

                def currentGrantId = rowMap[GmsMapper.GRANT_ID_COLUMN]
                def currentExternalId = rowMap[GmsMapper.EXTERNAL_ID_COLUMN]
                // We have read all the details for a project.
                if (((currentGrantId != prevGrantId) || (currentExternalId != prevExternalId)) && prevGrantId) {

                    action(projectRows)

                    projectRows = []
                }
                rowMap.index = (i+2) // accounts for 1-based index of Excel and the column header row.
                projectRows << rowMap
                prevGrantId = currentGrantId
                prevExternalId = currentExternalId
                if (first) {
                    def errors = mapper.validateHeaders(projectRows)
                    status << [grantId:'Column Headers', externalId:'', success:errors.size() == 0, errors:errors]
                    first = false
                }

            }
            // import the last project
            action(projectRows)


        }
        catch (Exception e) {
            def message = 'Error processing projects: '+e.getMessage()
            log.error(message, e)
            result.error = message

        }
        result
    }

    def mapProjectRows(projectRows, status) {

        def mapper = new GmsMapper(metadataService.activitiesModel(), metadataService.programsModel(), metadataService.organisationList()?.list, metadataService.getOutputTargetScores())
        def projectDetails = mapper.mapProject(projectRows)
        def grantId = projectDetails.project.grantId?:'<not mapped>'
        def externalId = projectDetails.project.externalId?:'<not mapped>'

        status << [grantId:grantId, externalId:externalId, success:projectDetails.errors.size() == 0, errors:projectDetails.errors]
    }

    def importAll(projectRows, status) {

        def mapper = new GmsMapper(metadataService.activitiesModel(), metadataService.programsModel(), metadataService.organisationList()?.list, metadataService.getOutputTargetScores())
        def projectDetails = mapper.mapProject(projectRows)

        def grantId = projectDetails.project.grantId?:'<not mapped>'
        def externalId = projectDetails.project.externalId?:'<not mapped>'
        if (!projectDetails.error) {

            def adminEmail = projectDetails.project.remove('adminEmail')
            def grantManagerEmail = projectDetails.project.remove('grantManagerEmail')            
            def grantManagerEmail2 = projectDetails.project.remove('grantManagerEmail2')
            def applicantEmail = projectDetails.project.remove('applicantEmail')
            def adminEmail2 = projectDetails.project.remove('adminEmail2')
            def editorEmail = projectDetails.project.remove('editorEmail')
            def editorEmail2 = projectDetails.project.remove('editorEmail2')

            def result = importProject(projectDetails.project, false) // Do not overwrite existing projects because of the impacts to sites / activities etc.

            if (result.project == 'existing') {
                status << [grantId:grantId, externalId:externalId, success:false, errors:['Project already exists in MERIT, skipping']]
                return
            }

            def projectId = projectDetails.project.projectId

            addUser(adminEmail, roleAdmin, projectId, projectDetails.errors)
            addUser(applicantEmail, roleAdmin, projectId, projectDetails.errors)
            addUser(adminEmail2, roleAdmin, projectId, projectDetails.errors)
            addUser(grantManagerEmail, roleGrantManager, projectId, projectDetails.errors)
            addUser(grantManagerEmail2, roleGrantManager, projectId, projectDetails.errors)
            addUser(editorEmail, roleEditor, projectId, projectDetails.errors)
            addUser(editorEmail2, roleEditor, projectId, projectDetails.errors)


            def sites = projectDetails.sites
            sites.each { site ->
                def created = false
                if (site.kmlUrl) {
                    def sitesCreated = []

                    try {
                        def kml = webService.get(site.kmlUrl, false)
                        sitesCreated = siteService.createSitesFromKml(kml, projectId)
                    }
                    catch (Exception e) {
                        log.error("Unable to create sites from ${site.kmlUrl}, message: ${e.getMessage()}", e)
                    }
                    if (!sitesCreated) {
                        status << [grantId:grantId, externalId:externalId, success:false, errors:["Unable to create sites from ${site.kmlUrl}"]]
                        return
                    }
                }
                if (!created) {
                    siteService.createSiteFromPoint(projectDetails.project.projectId, site.name, site.description, site.lat, site.lon)
                }
            }

            def activities = projectDetails.activities
            activities.each { activity ->
                activity.projectId = projectDetails.project.projectId
                activityService.update('', activity)
            }

            projectService.generateProjectStageReports(projectId)

            status << [projectId:projectDetails.project.projectId, grantId:grantId, externalId:externalId, success:projectDetails.errors.size() == 0, errors:projectDetails.errors]

        }
        else {
            status << [grantId:grantId, externalId:externalId, success:false, errors:projectDetails.errors]

        }
    }

    def addUser(email, role, projectId, errors) {
        if (email) {
            def userId = userService.checkEmailExists(email)
            if (userId) {
                userService.addUserAsRoleToProject(userId, projectId, role)
            } else {
                errors << "${email} is not registered with the ALA"
            }
        }
    }

    def populateAggregrateProjectData(InputStream csv, preview, charEncoding = 'Cp1252') {


        def result = [errors:[], activities : []]
        cacheService.clear(PROJECTS_CACHE_KEY)
        def reader = new InputStreamReader(csv, charEncoding)
        try {

            def prevGrantId = null
            def prevExternalId = null
            def projectRows = []

            new CSVMapReader(reader).eachWithIndex { rowMap, i ->

                def currentGrantId = rowMap[GmsMapper.GRANT_ID_COLUMN]
                def currentExternalId = rowMap[GmsMapper.EXTERNAL_ID_COLUMN]
                // We have read all the details for a project.
                if (((currentGrantId != prevGrantId) || (currentExternalId != prevExternalId)) && prevGrantId) {

                    def activity = importProjectProgress(projectRows, result.errors, preview)
                    if (activity) {
                        result.activities << activity
                        result.errors << "SUCCESS for ${prevGrantId}"
                    }
                    else {
                        result.errors << "*********Import FAILED for ${prevGrantId} - see above for errors ****************"
                    }
                    result.errors << "            =================================================="
                    projectRows = []
                }
                rowMap.index = (i+2) // accounts for 1-based index of Excel and the column header row.
                projectRows << rowMap
                prevGrantId = currentGrantId
                prevExternalId = currentExternalId
            }
            // import the last project
            def activity = importProjectProgress(projectRows, result.errors, preview)
            if (activity) {
                result.activities << activity
                result.errors << "SUCCESS for ${prevGrantId}"
            }
            else {
                result.errors << "*********Import FAILED for ${prevGrantId} - see above for errors ****************"
            }

        }
        catch (Exception e) {
            def message = 'Error processing projects: '+e.getMessage()
            log.error(message, e)
            result.errors << message

        }
        result

    }

    static def SUMMARY_OUTPUT_NAME = 'Upload of historical summary reporting data'
    static def SUMMARY_ACTIVITY_NAME = 'Upload of historical summary reporting data'

    private def importProjectProgress(projectRows, errors, preview) {


        def activitiesModel = metadataService.activitiesModel()
        def mapper = new GmsMapper(activitiesModel, [:], [], metadataService.getOutputTargetScores(), true)
        def projectDetails = mapper.mapProject(projectRows)

        //errors.addAll(projectDetails.errors)

        // Get the project id from the grant / external id.
        def project = findProjectByGrantAndExternalId(projectDetails.project.grantId, projectDetails.project.externalId)

        if (!project) {
            errors << "No project with Grant Id: ${projectDetails.project.grantId}, External Id: ${projectDetails.project.externalId}"
            return [:]
        }

        // Get the project details so we have access to the sites and activities for the project.
        project = projectService.get(project.projectId, 'all')


        def startDate, endDate
        if (projectDetails.plannedStartDate && projectDetails.plannedEndDate) {
            startDate = projectDetails.plannedStartDate
            endDate = projectDetails.plannedEndDate
        }
        else {
            // Get the timeline from the project.
            if (project.timeline) {
                def stage1 = project.timeline.find{it.name=='Stage 1'}

                if (!stage1) {
                    errors << "Could not find stage 1 for project with Grant Id: ${project.grantId}, External Id: ${project.externalId}, using project dates"
                    startDate = project.plannedStartDate
                    endDate = project.plannedEndDate
                }
                startDate = stage1.fromDate
                endDate = stage1.toDate
            }
            else {
                errors << "No timeline for project with Grant Id: ${project.grantId}, External Id: ${project.externalId}"
                startDate = project.plannedStartDate
                endDate = project.plannedEndDate
            }
        }

        def siteId = ''

        if (!project.sites) {
            errors << "No sites for project with Grant Id: ${project.grantId}, External Id: ${project.externalId}"
        }
        else {
            // Find a sensible site to attach to our new activity
            def site = project.sites.find{it.name.startsWith('Project area')}
            if (!site) {
                site = project.sites[0]
            }
            siteId = site?.siteId
        }

        // Create our dodgy import activity in first stage, ignore targets.
        def activity = [projectId:project.projectId,
                        siteId:siteId,
                        description:SUMMARY_ACTIVITY_NAME,
                        type:SUMMARY_ACTIVITY_NAME,
                        plannedStartDate:startDate,
                        plannedEndDate:endDate,
                        startDate:startDate,
                        endDate:endDate,
                        progress:'finished',
                        publicationStatus:'published' ]

        // Update other activities in the stage to finished and approved.
        def existingActivities = project.activities?.findAll {it.plannedEndDate >= startDate && it.plannedEndDate <= endDate}

        def notPlannedCount = 0
        def submitApprovedCount = 0
        existingActivities.each {
            if (it.progress != 'planned') {
                notPlannedCount++
            }
            if (it.publicationStatus == 'pendingApproval' || it.publicationStatus == 'approved') {
               submitApprovedCount++
            }
        }

        if (notPlannedCount > 0) {
            errors << "Warn: project ${project.grantId}, ${project.externalId} has ${notPlannedCount} activities that are not in the 'planned' state"
        }
        if (submitApprovedCount > 0) {
            errors << "Warn: project ${project.grantId}, ${project.externalId} has submitted or approved stages"
        }
        def outputTargets = projectDetails.project.outputTargets


        def values = []
        outputTargets.each { target ->

            if (!target.progressToDate) {
                errors << "No delivery information for ${project.grantId}, ${target.label}"
                return
            }

            // we know our special output has a flat mapping structure
            values << [scoreId: target.scoreId, scoreLabel: target.scoreLabel, score:target.progressToDate]
        }

        if (!values) {
            errors << "No scores defined for ${project.grantId}"
            return
        }

        def output = [ name:SUMMARY_OUTPUT_NAME, data:[scores:values] ]

        activity.outputs = [output]

        // No point creating the activity if there is no data for it.
        if (!preview && values) {
            activityService.update('', activity)
            existingActivities.each{activityService.delete(it.activityId)}
        }

        return activity
    }

    def doNlpMigration(InputStream projects, boolean preview) {

        cacheService.clear(PROJECTS_CACHE_KEY)
        def reader = new InputStreamReader(projects, 'Cp1252')
        def errors = []
        def results = []
        try {
            new CSVMapReader(reader).eachWithIndex { rowMap, i ->

                def grantId = rowMap['Grant ID']?.trim()
                def externalId = rowMap['Current External ID']?.trim()
                def migrate = rowMap['Migrate shell to NLP'] == 'Y'
                if (migrate) {

                    def project = findProjectByGrantAndExternalId(grantId, externalId)
                    if (project) {

                        def alreadyMigrated = findProjectsByOriginalProjectId(project.projectId)

                        if (alreadyMigrated) {
                            errors << "Project ${grantId}, ${externalId} has already been migrated"
                        }
                        else {
                            def config = [name: rowMap['NLP Project name'],
                                          migrateSites:rowMap['Migrate Sites to NLP'] == 'Y',
                                          migrateGrantManagers:rowMap['Migrate Grant Manager'] == 'Y',
                                          migrateEditors:rowMap['Migrate Editor'] == 'Y' ,
                                          migrateAdmins:rowMap['Migrate Admin'] == 'Y',
                                          migrateDocuments:rowMap['Migrate attachments to NLP'] == 'Y',
                                          migrateActivities:rowMap['Migrate activities to NLP'] == 'Y',
                                          funding:rowMap['Funding'] as Long,
                                          preview: preview]
                            results << migrateToNlp(project.projectId, config)
                        }
                    }
                    else {
                        errors << "Unable to find existing project with Grant ID=${grantId}, External ID=${externalId}"
                    }
                }
                else {
                    errors << "Project ${grantId}, ${externalId} specified as not to migrate"
                }

            }
        }
        catch (Exception e) {
            log.error("Error processing projects to migrate to the NLP", e)
            errors << e.message
        }
        return [errors: errors, results: results]
    }

    private static def NLP_CHANGE_OVER_DATE = '2014-12-31T14:00:00Z';
    private def migrateToNlp(projectId, config) {
        def project = projectService.get(projectId, 'all')

        def sites = project.remove('sites')
        def activities = project.remove('activities')
        def documents = project.remove('documents')
        def users = projectService.getMembersForProjectId(projectId)

        project.remove('projectId')
        project.remove('outputTargets')
        def timeline = project.remove('timeline')

        def oldPrjTimeline = []
        def newPrjTimeline = []
        int newStage = 1
        timeline.each {
            if (it.toDate <= NLP_CHANGE_OVER_DATE) {
                oldPrjTimeline << it
            }
            else {
                it.name = "Stage ${newStage}"
                newPrjTimeline << it
                newStage ++
            }
        }

        def toUpdate = [name:'[C4OC] '+project.name, plannedEndDate:NLP_CHANGE_OVER_DATE, timeline:oldPrjTimeline]
        if (!config.preview) {
            projectService.update(projectId, toUpdate)
        }
        // New project.
        project.timeline = newPrjTimeline
        project.name = config.name?:project.name
        project.originalProjectId = projectId // In case we need this later.
        project.grantId = 'to be assigned'
        project.externalId = 'to be assigned'
        project.funding = config.funding?:0
        project.plannedStartDate = NLP_CHANGE_OVER_DATE
        project.associatedProgram = 'National Landcare Programme'
        project.associatedSubProgram = 'Regional Funding'

        // Save the new project.
        def newId = 'Temp New ID'
        if (!config.preview) {
            newId = projectService.update('', project).resp.projectId
        }

        def sitesToUpdate = []
        if (config.migrateSites) {
            // Add the existing sites to the new project.
            sitesToUpdate = sites.collect{it.siteId}
            if (!config.preview) {
                siteService.updateProjectAssociations([projectId: newId, sites: sitesToUpdate])
            }
        }

        def migratedUsers = []
        // Add existing users to new projects
        users.each {
            if ((it.role == 'caseManager' && config.migrateGrantManagers) ||
                    (it.role == 'editor' && config.migrateEditors) ||
                    (it.role == 'admin' && config.migrateAdmins)) {

                migratedUsers << it
                if (!config.preview) {
                    userService.addUserAsRoleToProject(it.userId, newId, it.role)
                }
            }
        }

        def docsToCopy = []
        if (config.migrateDocuments) {
            documents.each { document ->
                document.documentId = ''
                document.projectId = newId
                document.remove('url')
                document.remove('thumbnailUrl')
                docsToCopy << document
                if (!config.preview) {
                    documentService.updateDocument(document)
                }
            }
        }

        def activitiesToUpdate = []

        if (config.migrateActivities) {
            def nlpActivities = []
            activities.each {
                if (it.plannedEndDate >= NLP_CHANGE_OVER_DATE) {
                    nlpActivities << it
                }
            }
            activitiesToUpdate = nlpActivities.collect{it.activityId}
            if (!config.preview) {
                activityService.bulkUpdateActivities(activitiesToUpdate, [projectId: newId])
            }
        }
        [origProject:toUpdate, newProject:project, sites:sitesToUpdate, activities:activitiesToUpdate, documents:docsToCopy]
    }

    /**
     * Bulk imports sites for many projects.  The supplied shapefile must have attributes GRANT_ID and EXTERNAL_I
     */
    def bulkImportSites(shapefile) {
        def result =  siteService.uploadShapefile(shapefile)

        cacheService.clear(PROJECTS_CACHE_KEY)

        def errors = []
        def sites = []
        if (!result.error && result.content.size() > 1) {
            def now = DateUtils.displayFormat(new DateTime())
            def projectsWithSites = [:]
            def content = result.content
            def shapeFileId = content.remove('shp_id')

            def shapes = content.collect { key, value ->
                [id: (key), attributes: (value)]
            }

            def grantIdAttribute = "GRANT_ID"
            def backupGrantIdAttribute = "APP_ID"
            def externalIdAttribute = "EXTERNAL_I"
            def siteNameAttribute = "SITE_NAME"
            def siteDescriptionAttribute = "SITE_DESCR"

            shapes.each { shape ->

                def grantId = shape.attributes[grantIdAttribute]
                // Often we receive shapefiles with an APP_ID but no GRANT_ID.
                if (!grantId) {
                    grantId = shape.attributes[backupGrantIdAttribute]
                }
                def externalId = shape.attributes[externalIdAttribute]


                if (!grantId && !externalId) {
                    errors << "Shape is missing GRANT_ID and EXTERNAL_I attributes: ${shape.attributes}"
                    return
                }

                def project = findProjectByGrantAndExternalId(grantId, externalId)

                if (!project) {
                    errors << "No project found with grant id=${grantId} and external id=${externalId}"
                }
                else {
                    def projectDetails = projectsWithSites[project.projectId]
                    if (!projectDetails) {
                        projectDetails = projectService.get(project.projectId, 'all')
                        projectsWithSites[project.projectId] = projectDetails
                        if (!projectDetails.sites) {
                            projectDetails.sites = []
                        }
                    }
                    int siteNumber = projectDetails.sites ? projectDetails.sites.size() +1 : 1
                    def name = shape.attributes[siteNameAttribute]?:"${project.grantId} - Site ${siteNumber}"
                    def description = shape.attributes[siteDescriptionAttribute] ?: "Imported on ${now}"
                    def siteExternalId = shapeFileId+'-'+shape.id

                    def resp = siteService.createSiteFromUploadedShapefile(shapeFileId, shape.id, siteExternalId, name, description, project.projectId)
                    if (resp?.resp.siteId) {
                        projectDetails.sites << [siteId:resp.resp.siteId, name:name, description:description]
                        sites << name
                    }
                    else {
                        errors << resp
                    }
                }
            }
            return [success:true, message:[errors:errors, sites:sites]]

        }
        else {
            return [success:false, message:"Invalid shapefile: ${result.error}"]
        }
    }

    /**
     * Bulk imports sites for many projects.  The supplied shapefile must have attributes GRANT_ID and EXTERNAL_I
     */
    def bulkImportESPSites(shapefile) {
        def result =  siteService.uploadShapefile(shapefile)

        cacheService.clear(PROJECTS_CACHE_KEY)

        def errors = []
        def sites = []
        if (!result.error && result.content.size() > 1) {
            def now = DateUtils.displayFormat(new DateTime())
            def projectsWithSites = [:]
            def content = result.content
            def shapeFileId = content.remove('shp_id')

            def shapes = content.collect { key, value ->
                [id: (key), attributes: (value)]
            }

            def grantIdAttribute = "GRANT_ID"
            def backupGrantIdAttribute = "APP_ID"
            def externalIdAttribute = "PropertyID"
            def siteNameAttribute = "SITE_DESC"
            def siteDescriptionAttribute = "SITE_DESC"
            def siteTypeAttribute = "SITE_TYPE"

            shapes.each { shape ->

                def grantId = shape.attributes[grantIdAttribute]
                // Often we receive shapefiles with an APP_ID but no GRANT_ID.
                if (!grantId) {
                    grantId = shape.attributes[backupGrantIdAttribute]
                }
                def externalId = shape.attributes[externalIdAttribute]


                if (!grantId && !externalId) {
                    errors << "Shape is missing GRANT_ID and EXTERNAL_I attributes: ${shape.attributes}"
                    return
                }

                def project = findProjectByGrantAndExternalId(grantId, externalId)

                if (!project) {
                    project = createESPProject(grantId, externalId)
                    projectsWithSites[project.projectId] = project
                }

                def projectDetails = projectsWithSites[project.projectId]
                if (!projectDetails.sites) {
                    projectDetails.sites = []
                }

                int siteNumber = projectDetails.sites ? projectDetails.sites.size() +1 : 1
                def name = shape.attributes[siteNameAttribute]?:"${project.grantId} - Site ${siteNumber}"
                def description = shape.attributes[siteDescriptionAttribute] ?: "Imported on ${now}"
                def siteExternalId = shapeFileId+'-'+shape.id

                def resp = siteService.createSiteFromUploadedShapefile(shapeFileId, shape.id, siteExternalId, name, description, project.projectId)

                if (resp?.resp.siteId) {
                    projectDetails.sites << [siteId:resp.resp.siteId, name:name, description:description]
                    sites << name

                    String type = shape.attributes[siteDescriptionAttribute]
                    String activityType = type.toUpperCase().startsWith("P") ? "ESP PMU or Zone reporting" : "ESP SMU Reporting"

                    projectDetails.reports.each { report ->
                        Map activity = [
                                projectId:project.projectId,
                                plannedStartDate: report.fromDate,
                                plannedEndDate: report.toDate,
                                startDate: report.fromDate,
                                endDate: report.toDate,
                                type:activityType,
                                progress: ActivityService.PROGRESS_PLANNED,
                                name:description+" Report",
                                siteId:resp.resp.siteId
                        ]
                        activityService.create(activity)
                    }
                }
                else {
                    errors << resp
                }
            }
            projectsWithSites.each { projectId, value ->
                Map prj = projectService.get(projectId)

                prj.sites.each { site ->
                    siteService.addPhotoPoint(site.siteId, createPhotoPoint(site))
                }

                Map siteCoords = createProjectArea(prj.sites)
                String projectAreaSiteName = "Project area for "+prj.name
                Map projectArea = [extent: [source: 'drawn', geometry: siteCoords], projects: [projectId], name: projectAreaSiteName, description: projectAreaSiteName, externalId:'', type:'projectArea', visibility:'private']
                siteService.create(projectArea)

                prj = projectService.get(projectId)
                createActivities(prj)
            }

            return [success:true, message:[errors:errors, sites:sites]]

        }
        else {
            return [success:false, message:"Invalid shapefile: ${result.error}"]
        }
    }

    /**
     * Create photopoint for site
     * @param site
     */
    private Map createPhotoPoint(Map site) {
        Map photopoint = null
        if (site && site.extent && site.extent.geometry) {
            String json = ([type:site.extent.geometry.type, coordinates:site.extent.geometry.coordinates] as JSON).toString()
            Geometry geometry = new GeometryJSON().read(json)
            Point centroid = geometry.centroid

            photopoint = [
                    name : "${site.name} photo point",
                    geometry : [
                            bearing : 0,
                            coordinates : [centroid.y, centroid.x],
                            decimalLongitude : centroid.x,
                            decimalLatitude : centroid.y,
                            type : "Point"
                    ],
                    type : "photopoint"
            ]

        }
        photopoint
    }

    private Map createProjectArea(List<Map> sites) {
        Geometry[] geom = sites.collect { site ->
            String json = ([type:site.extent.geometry.type, coordinates:site.extent.geometry.coordinates] as JSON).toString()
            new GeometryJSON().read(json)
        }.toArray(new Geometry[sites.size()])

        StringWriter out = new StringWriter()
        new GeometryJSON().write(new GeometryCollection(geom, new GeometryFactory()).convexHull(), out)

        println out.toString()

        return JSON.parse(out.toString())
    }

    private Map createESPProject(String grantId, String externalId) {
        Map project = [
                grantId:grantId,
                externalId:externalId,
                plannedStartDate:'2016-06-30T14:00:00Z',
                plannedEndDate: '2018-06-30T14:00:00Z',
                associatedProgram:"Environmental Stewardship",
                associatedSubProgram:"ESP Test",
                description:"ESP online reporting test",
                name:"ESP - "+externalId,
                planStatus:'approved']
        projectService.update('', project)
        project = findProjectByGrantAndExternalId(grantId, externalId)
        projectService.generateProjectStageReports(project.projectId)
        project = projectService.get(project.projectId)


        project
    }

    private void createActivities(Map project) {
        String projectAreaId = project.sites.find{it.type == 'projectArea'}.siteId
        List activitiesToCreate = [
                [
                        type:'ESP Species',
                        name:'Species Sightings for '+project.externalId,
                        siteId:projectAreaId
                ],
                [
                        type:'ESP Overview',
                        name:'Submission report for '+project.externalId,
                        siteId:null
                ]

        ]

        // Create standard reports
        project.reports.each { report ->
            activitiesToCreate.each { activityType ->
                Map activity = [
                        siteId:activityType.siteId,
                        projectId:project.projectId,
                        plannedStartDate: report.fromDate,
                        plannedEndDate: report.toDate,
                        type:activityType.type,
                        progress: ActivityService.PROGRESS_PLANNED,
                        name:activityType.name]
                activityService.create(activity)

            }

        }
    }

}
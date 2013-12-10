package au.org.ala.fieldcapture
import au.com.bytecode.opencsv.CSVReader
import org.apache.commons.lang.StringUtils

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

    def projectService, siteService, metadataService, cacheService, activityService, webService, grailsApplication


    /**
     * Validates and imports project, site and institution data supplied by the GMS as a CSV file.
     */
    def importProjectsByCsv(InputStream csv,  importWithErrors = false) {
        CSVReader csvReader = new CSVReader(new InputStreamReader(csv));
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
            grantIds << project.grantId
            if (project.errors.size() > 0 || project.warnings.size() > 0) {
                writeErrors(results.validationErrors, project.errors, project.warnings, csvLine)
            }
            if (project.errors.size() == 0 || importWithErrors) {
                project.remove('errors')
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
                else {
                    warnings.add("No value for '${it}'")
                }
            }
        }

        project.name = projectDetails['Grant Name']
        project.description = projectDetails['Grant Description']


        project.grantId = projectDetails['Grant ID']
        def subProjectID = projectDetails['Sub-project ID']
        def externalID = projectDetails['Grant External ID']
        if (subProjectID) {
            project.externalProjectId = subProjectID
        }
        else {
            if (externalID != 'Not Provided') {
                project.externalProjectId = externalID
            }
        }

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

        try {
            def startDate = projectDetails['Start']
            if (startDate) {
                project.plannedStartDate = convertDate(startDate)
            }
        }
        catch (Exception e) {
            errors.add("Unable to parse Finish Date: ${endDate}")
        }
        try {
            def endDate = projectDetails['Finish']
            if (endDate) {
                project.plannedEndDate = convertDate(endDate);
            }
        }
        catch (Exception e) {
            errors.add("Unable to parse Finish Date: ${endDate}")
        }

        if (grantIds.contains(project.grantId)) {
            errors.add("Duplicate Grant ID detected: '$project.grantId'")
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

        def program = projectDetails['Program']
        def roundName = projectDetails['Round Name']


        def matchedProgram = metadataService.programsModel().programs.find{ it.name == program}

        if (!matchedProgram) {
            warnings.add("'Program' does not match a valid program name: ${program}")
        }
        else {
            project.associatedProgram = matchedProgram.name
            def subprogram = program.subprograms.find {it.name == roundName}
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
        try {
            def format = date.length() == 10 ? inputDateFormat : shortInputDateFormat
            outputDateFormat.format(format.parse(date))
        }
        catch (Exception e) {
            throw e
        }
    }

    def importProject(project) {

        def status = [:]

        // Remove the site from the project as it will be saved separately.
        def site = project.remove('site')

        // The Grant ID is the only best key we can use from the SEWPAC data.
        def p = findProjectByGrantAndExternalId(project.grantId, project.externalProjectId)
        if (p) {
            project.projectId = p.projectId
            status.project = 'updated'
        }
        else {
            status.project = 'created'
        }

        def result = projectService.update(project.projectId?:'', project)

        // If a project was created the ID will be returned, otherwise use the value retrieved by the original query.
        def projectId = result.resp.projectId?:project.projectId


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

    def findProjectByGrantAndExternalId(grantId, externalProjectId) {
        // Cache projects temporarily to avoid this query.
        def allProjects = cacheService.get(PROJECTS_CACHE_KEY) { [projects:projectService.list(true)] }
        return allProjects.projects.find{it.grantId?.equalsIgnoreCase(grantId) && it.externalProjectId?.equalsIgnoreCase(externalProjectId)}
    }

    def findProjectByGrantIdAndName(grantId, name) {
        // Cache projects temporarily to avoid this query.
        def allProjects = cacheService.get(PROJECTS_CACHE_KEY) { [projects:projectService.list(true)] }
        return allProjects.projects.find{it.grantId?.equalsIgnoreCase(grantId) && it.name?.equalsIgnoreCase(name)}
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
    final int OUTPUT_COLUMN = 3


    /**
     * Validates and imports project plan data as supplied by DOE.
     */
    def importPlansByCsv(InputStream csv,  overwriteActivities = false) {

        cacheService.clear(PROJECTS_CACHE_KEY)

        CSVReader csvReader = new CSVReader(new InputStreamReader(csv, 'UTF-8'));

        String[] csvLine = csvReader.readNext();

        def stageOffsets = findStageOffsets(csvLine)
        // Used to detect duplicate grantIds (as it is used as the key)
        def grantIds = []

        csvLine = csvReader.readNext()

        def plans = [:]
        while (csvLine) {

            def grantId = csvLine[GRANT_ID_COLUMN]
            if (grantId) {
                grantId = grantId.split()[0]
            }

            if (!grantIds.contains(grantId)) {

                def results = parsePlan(grantId, csvLine, stageOffsets, overwriteActivities)
                if (!results.error && !results.activities) {
                    results = [error:"No activities defined for project with grant id = ${grantId}"]
                }
                else if (!results.error) {
                    def importResults = importPlan(grantId, results)
                    results << [importStatus:importResults]
                }
                plans[grantId] = results
                grantIds << grantId
            }
            else {
                log.error("Duplicate Grant ID detected: "+grantId)
            }
            csvLine = csvReader.readNext();

        }

        cacheService.clear(PROJECTS_CACHE_KEY)

        return plans
    }


    def importPlan(grantId, planDetails) {

        def project = [projectId:[type:'grantId', id:grantId]]
        project.activities = planDetails.activities
        project.outputTargets = planDetails.outputs
        project.timeline = planDetails.timeline

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

    def parsePlan(grantId, String[] csvLine, stageOffsets, overwriteActivities) {

        // Column headers: (as this is more or less a once off load..)

        // Project ID	Project title	Project description	Theme 1 outputs: # ha to be revegetated	Theme 1 description: Vegetation description	Theme 1 description: Current condition	Theme 1 description: Intended condition	Theme 1 description: method used for assessment of condition	Theme 2 outputs: #ha to be protected	Theme 2 description: Vegetation description	Theme 2 description: current condition	Theme 2 description: intended condition	Theme 2 description: method for assessment	Theme 3 outputs: #ha to be managed	Theme 3 outputs: invasive spp managed	Theme 3 description: other	non-theme outputs: # plants planted	non-theme outputs: #kg seed sown	non-theme description: % survival rate for plants	non-theme description: #canopy species planted	non-theme description: #understorey spp planted	non-theme description: #ground layer spp planted	non-theme outputs: #km fenced	non-theme description: other	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11type	Activity 11 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Activity 12 type	Activity 12 description	Activity 13 type	Activity 13 description	Activity 14 type	Activity 14 description	Activity 15 type	Activity 15 description	Activity 16 type	Activity 16 description	Activity 17 type	Activity 17 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Activity 12 type	Activity 12 description	Activity 13 type	Activity 13 description	Activity 14 type	Activity 14 description	Activity 15 type	Activity 15 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Activity 12 type	Activity 12 description	Activity 13 type	Activity 13 description	Activity 14 type	Activity 14 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Stage	Stage start date	Stage end date	Activity 1 type	Activity 1 description	Activity 2 type	Activity 2 description	Activity 3 type	Activity 3 description	Activity 4 type	Activity 4 description	Activity 5 type	Activity 5 description	Activity 6 type	Activity 6 description	Activity 7 type	Activity 7 description	Activity 8 type	Activity 8 description	Activity 9 type	Activity 9 description	Activity 10 type	Activity 10 description	Activity 11 type	Activity 11 description	Activity 12 type	Activity 12 description	Activity 13 type	Activity 13 description	Activity 14 type	Activity 14 description	Activity 15 type	Activity 15 description	Activity 16 type	Activity 16 description	Activity 17 type	Activity 17 description	Activity 18 type	Activity 18 description	Activity 19 type	Activity 19 description	Activity 20 type	Activity 20 description

        try {
            // need name also.....
            def project = findProjectByGrantIdAndName(grantId, '')

            if (!project) {
                return [error:"No project with grant id = ${grantId}"]
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

            int stageNum = 0
            def timeline = []
            def activities = []
            def outputs = readOutputs(project, csvLine[OUTPUT_COLUMN..<stageOffsets[0]])

            while (stageNum < stageOffsets.size()) {

                def startOffset = stageOffsets[stageNum]
                def endOffset = stageNum < stageOffsets.size()-1 ? stageOffsets[stageNum+1] : csvLine.length

                def stageDetails = readStage(csvLine[startOffset..<endOffset], project)
                if (stageDetails.error) {
                    return [error:stageDetails.error]
                }
                timeline << stageDetails.stage
                if (stageDetails.activities) {
                    activities.addAll(stageDetails.activities)
                }
                stageNum++

            }
            return [timeline:timeline, activities:activities, outputs:outputs]
        }
        catch (Exception e) {
            e.printStackTrace()
            return [error:"Error importing project with grantId = ${grantId}, error=${e.getMessage()}"]
        }

    }

    def readOutputs(project, outputDetails) {
        if (project.associatedProgram.startsWith('Biodiversity Fund')) {
            return readBioFundOutputs(outputDetails)
        }
        else if (project.associatedProgram.startsWith('Caring')) {
            return readCFOCOutputs(outputDetails)
        }
    }

    def readCFOCOutputs(outputDetails) {
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

    }

    def readBioFundOutputs(outputDetails) {

        def theme1 = 'Biodiverse plantings'
        def theme2 = 'Protecting and enhancing existing native vegetation'
        def theme3 = 'Managing invasive species in a connected landscape'

        // This is essentially just a big lookup table.
        def outputs = []

        int offset = 0

        addOutput(outputs, [outputLabel: 'Revegetation Details', scoreName: 'areaOfWorks' , scoreLabel: 'Area of works', units:'Ha', theme:theme1], outputDetails[offset++])
        // Not sure what to do with the textual based descriptions, methods & outcomes.
        offset+=4
        addOutput(outputs, [outputLabel: 'Revegetation Details', scoreName: 'areaOfWorks' , scoreLabel: 'Area of works', units:'Ha', theme:theme2], outputDetails[offset++])
        // Same again, a bunch of text for theme 2 this time.
        offset+=4

        // Theme 3 area
        addOutput(outputs, [outputLabel: 'Weed Treatment Details', scoreName: 'areaTreatedHa' , scoreLabel: 'Total area treated (Ha)', units:'Ha', theme:theme3], outputDetails[offset++])

        // Now species lists, text & number???  for theme 3.
        offset+=2
        addOutput(outputs, [outputLabel: 'Revegetation Details', scoreName: 'totalNumberPlanted' , scoreLabel: 'Number of plants planted', units:''], outputDetails[offset++])
        addOutput(outputs, [outputLabel: 'Revegetation Details', scoreName: 'totalSeedSownKg' , scoreLabel: 'Kgs of seed sown', units:'kg'], outputDetails[offset++])

        addOutput(outputs, [outputLabel: 'Missing output', scoreName: 'survivalRate' , scoreLabel: '% survival rate for plants', units:'%'], outputDetails[offset++])
        addOutput(outputs, [outputLabel: 'Missing output', scoreName: 'numberCanopySpeciesPlanted' , scoreLabel: '# canopy species planted', units:''], outputDetails[offset++])
        addOutput(outputs, [outputLabel: 'Missing output', scoreName: 'numberUnderstorySpeciesPlanted' , scoreLabel: '# understory species planted', units:''], outputDetails[offset++])
        addOutput(outputs, [outputLabel: 'Missing output', scoreName: 'numberGroundLayerSpeciesPlanted' , scoreLabel: '# ground layer species planted', units:''], outputDetails[offset++])

        addOutput(outputs, [outputLabel: 'Fence Details', scoreName: 'lengthOfFence' , scoreLabel: 'Total length of fence', units:'Km',], outputDetails[offset++])

        // Now an "other"???

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

        stage.name = 'Stage '+stageDetails[offset++]
        def fromDate = stageDetails[offset++]
        if (fromDate == 'Commencement') {
            fromDate = project.startDate
            if (!fromDate) {
                fromDate = '01/07/2012'
            }
        }
        stage.fromDate = convertDate(fromDate)
        stage.toDate = convertDate(stageDetails[offset++])

        results.stage = stage

        def unmatchedActivities = []
        // Assume at least one activity

        def activities = []
        while (offset < stageDetails.size() && stageDetails[offset]) {

            def activity = [:]

            def activityType = stageDetails[offset++]
            activity.type = matchActivity(validActivities, activityType)
            if (!activity.type) {
                unmatchedActivities << activityType
            }

            activity.description = stageDetails[offset++]
            activity.plannedStartDate = stage.fromDate
            activity.plannedEndDate = stage.toDate
            activity.progress = 'planned'
            activities << activity
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
            activityType = 'Site Assessment - Biodiversity Fund (DoE)'
        }
        def match = validActivities.find {it.name.equalsIgnoreCase(activityType)}
        match = match?match.name:null


        if (!match) {

            if (activityType.equalsIgnoreCase('Administration')) {
                match = 'Project Administration'
            }
            else if (activityType.equalsIgnoreCase('Project Employment')) {
                match ='Indigenous Employment & Enterprise'
            }
            else if (activityType.equalsIgnoreCase('Site planning')) {
                match = 'Works Implementation Planning'
            }
            else if (activityType.equalsIgnoreCase('Grazing Management')) {
                match = 'Conservation Grazing Management'
            }
            else if (activityType.equalsIgnoreCase('Weed Infestation & Monitoring')) {
                match = 'Weed Mapping & Monitoring'
            }
            else if (activityType.equalsIgnoreCase('Install/construct erosion control structure')) {
                match = 'Erosion Management'
            }
            else if (activityType.equalsIgnoreCase('Pest Management')) {
                match = 'Pest and Disease Management'
            }
            else if (activityType.equalsIgnoreCase('BioCondition Site Assessment (v2.1)')) {
                match = 'Site Assessment - BioCondition (QLD)'
            }
            else if (activityType.endsWith('Biodiversity Fund')) {
                match = 'Site Assessment - Biodiversity Fund (DoE)'
            }
            else if (activityType.equalsIgnoreCase('Infrastructure Works')) {
                match = 'Infrastructure Establishment'
            }
            else if (activityType.equalsIgnoreCase('Site Assessment - Bushland Condition Monitoring')) {
                match = 'Site Assessment - Bushland Condition Monitoring (SA)'
            }
            else if (activityType.equalsIgnoreCase('Site Preperation')) {
                match = 'Site Preparation'
            }
            else if (activityType.equalsIgnoreCase('Site Assessment') ||
                     activityType.equalsIgnoreCase('Site Assesment')  ||
                     activityType.equalsIgnoreCase('Site Assessmnet')) {
                match = 'Site Assessment - Biodiversity Fund (DoE)'
            }
        }


        return match

    }

}

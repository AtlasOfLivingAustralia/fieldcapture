package au.org.ala.merit
import au.com.bytecode.opencsv.CSVReader
import au.org.ala.merit.reports.ReportGenerationOptions
import com.vividsolutions.jts.geom.Geometry
import com.vividsolutions.jts.geom.GeometryCollection
import com.vividsolutions.jts.geom.GeometryFactory
import com.vividsolutions.jts.geom.Point
import grails.converters.JSON
import org.apache.commons.lang.StringUtils
import org.geotools.geojson.geom.GeometryJSON
import org.grails.plugins.csv.CSVMapReader
import org.joda.time.DateTime
import org.springframework.web.multipart.MultipartFile

import java.text.DecimalFormat
import java.text.SimpleDateFormat
/**
 * Handles data import into ecodata.
 */
class ImportService {

    public static final List CSV_HEADERS = ['Program', 'Round Name', 'GMS Round Name', 'Grant ID', 'Grant External ID', 'Sub-project ID', 'Grant Name', 'Grant Description', 'Grantee Organisation Legal Name','ABN', 'Grant Original Approved Amount', 'Grant Current Grant Funding (Ex. GST)', 'Start', 'Finish', 'Location Description']

    private static final String PROJECTS_CACHE_KEY = 'ImportService-AllProjects'

    def projectService
    def siteService
    def metadataService
    def cacheService
    def activityService
    def webService
    def userService
    def roleEditor = "editor"
    def roleAdmin = "admin"
    def roleGrantManager = "caseManager"
    def programService
    def managementUnitService

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

    def findProjectByGrantId(grantId) {
        Map resp = projectService.search(grantId:grantId)
        if (resp?.resp?.projects) {
            if (resp.resp.projects.size() ==1) {
                return resp.resp.projects[0]
            }
            else {
                log.warn("Multiple projects found with the same grant id! ${grantId}")
            }

        }
        return null
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

    def gmsImport(InputStream csv, List status, preview, charEncoding = 'Cp1252') {

        Map programs = [:].withDefault{name ->
            Map program = programService.getByName(name)
            program?.programId
        }
        Map managementUnits = [:].withDefault{name ->
            Map mu = managementUnitService.getByName(name)
            mu?.managementUnitId
        }
        def mapper = new GmsMapper(metadataService.activitiesModel(), metadataService.programsModel(), metadataService.organisationList()?.list, metadataService.getOutputTargetScores(), programs, managementUnits)

        def action = preview?{rows -> mapProjectRows(rows, status, mapper)}:{rows -> importAll(rows, status, mapper)}

        def result = [:]
        cacheService.clear(PROJECTS_CACHE_KEY)
        def reader = new InputStreamReader(csv, charEncoding)
        try {

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

    def mapProjectRows(projectRows, List status, GmsMapper mapper) {

        def projectDetails = mapper.mapProject(projectRows)
        def grantId = projectDetails.project.grantId?:'<not mapped>'
        def externalId = projectDetails.project.externalId?:'<not mapped>'

        status << [grantId:grantId, externalId:externalId, success:projectDetails.errors.size() == 0, errors:projectDetails.errors]
    }

    def importAll(projectRows, List status, GmsMapper mapper) {

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

            // Apply any program permission to the new project if required.
            if (projectDetails.project.managementUnitId) {
                List members = managementUnitService.getMembersOfManagementUnit(projectDetails.project.managementUnitId)
                members?.each { member ->
                    userService.addUserAsRoleToProject(member.userId, projectId, member.role)
                }
            }

            def sites = projectDetails.sites
            sites.each { site ->
                def created = false
                if (site.kmlUrl) {
                    def sitesCreated = []

                    try {
                        String kml = webService.get(site.kmlUrl, false)
                        sitesCreated = siteService.createSitesFromKml(new ByteArrayInputStream(kml.getBytes('UTF-8')), projectId)
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

            projectService.generateProjectStageReports(projectId, new ReportGenerationOptions())

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

    /**
     * Bulk imports sites for many projects.  The supplied shapefile must have attributes GRANT_ID and EXTERNAL_I
     */
    def bulkImportSites(MultipartFile shapefile) {
        Map result = siteService.uploadShapefile(shapefile)

        cacheService.clear(PROJECTS_CACHE_KEY)

        def errors = []
        def sites = []
        if (!result.error && result.resp.size() > 1) {
            def now = DateUtils.displayFormat(new DateTime())
            def projectsWithSites = [:]
            def content = result.resp
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

                    def resp = siteService.createSiteFromUploadedShapefile(shapeFileId, shape.id, siteExternalId, name, description, project.projectId, false)
                    if (resp?.siteId) {
                        projectDetails.sites << [siteId:resp.siteId, name:name, description:description]
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

            def grantIdAttribute = "Grant_ID"
            def backupGrantIdAttribute = "APP_ID"
            def externalIdAttribute = "Name_Site"
            def siteNameAttribute = "Name_Site"
            def siteDescriptionAttribute = "SITE_DESC"
            def siteTypeAttribute = "SITE_TYPE"

            shapes.each { shape ->

                def grantId = shape.attributes[grantIdAttribute]
                // Often we receive shapefiles with an APP_ID but no GRANT_ID.
                if (!grantId) {
                    grantId = shape.attributes[backupGrantIdAttribute]
                }
                def externalId = shape.attributes[externalIdAttribute]

                if (grantId && !grantId.endsWith("G")) {
                    grantId+="G"
                }

                if (!grantId && !externalId) {
                    errors << "Shape is missing GRANT_ID and EXTERNAL_I attributes: ${shape.attributes}"
                    return
                }

                // Looks like the external ids aren't going to match for the ESP import...
                def project = findProjectByGrantId(grantId)
                if (!project) {
                    println "No project found with grantId=${grantId}  - ${shape.attributes['Status']}, ${shape.attributes['Note']}"
                    errors << "No project found with grantId=${grantId} - ${shape.attributes['Status']}, ${shape.attributes['Note']}"
                    return
                }

                // Make sure we have all sites & activities that have already been created.
                if (!projectsWithSites[project.projectId]) {
                    project = projectService.get(project.projectId, 'all')
                    if (!project.sites) {
                        project.sites = []
                    }
                    projectsWithSites[project.projectId] = project
                }
                else {
                    project = projectsWithSites[project.projectId]
                }


                int siteNumber = project.sites ? project.sites.size() +1 : 1
                def name = shape.attributes[siteNameAttribute]?:"${project.grantId} - Site ${siteNumber}"
                def description = shape.attributes[siteDescriptionAttribute] ?: "Imported on ${now}"
                def siteExternalId = shape.attributes[externalIdAttribute] ?: name

                if (project.sites.find{it.name == name}) {
                    errors << "Already processed site: ${name}"
                    return
                }
                // Else create the site.
                def resp = siteService.createSiteFromUploadedShapefile(shapeFileId, shape.id, siteExternalId, name, description, project.projectId)

                if (resp?.resp.siteId) {
                    project.sites << [siteId:resp.resp.siteId, name:name, description:description]
                    sites << name

                    String type = shape.attributes[siteDescriptionAttribute]
                    String activityType = type.toUpperCase().startsWith("P") ? "ESP PMU or Zone reporting" : "ESP SMU Reporting"

                    // Create the specific activity type for the site.
                    project.reports.each { report ->
                        String endDate = DateUtils.format(DateUtils.parse(report.toDate).minusDays(1))
                        if (endDate > project.plannedEndDate) {
                            endDate = project.plannedEndDate
                        }
                        Map activity = [
                                projectId:project.projectId,
                                plannedStartDate: report.fromDate,
                                plannedEndDate: endDate,
                                startDate: report.fromDate,
                                endDate: endDate,
                                type:activityType,
                                progress: ActivityService.PROGRESS_PLANNED,
                                description:description+" Report",
                                siteId:resp.resp.siteId
                        ]
                        activityService.create(activity)
                    }
                }
                else {
                    errors << resp
                }
            }
            projectsWithSites.each { projectId, prj ->

                // Re-query the project to get details for all of the sites.
                prj = projectService.get(prj.projectId, 'all')
                prj.sites?.each { site ->
                    if (!site.poi || site.poi.size() == 0) {
                        siteService.addPhotoPoint(site.siteId, createPhotoPoint(site))
                    }
                }
                if (!prj.sites?.find{it.type == 'projectArea'}) {
                    Map siteCoords = createProjectArea(prj.sites)
                    String projectAreaSiteName = "Project area for "+prj.name
                    Map projectArea = [extent: [source: 'drawn', geometry: siteCoords], projects: [projectId], name: projectAreaSiteName, description: projectAreaSiteName, externalId:'', type:'projectArea', visibility:'private']
                    siteService.create(projectArea)

                    // Re-query the project to pick up the new project area site.
                    prj = projectService.get(prj.projectId, 'all')
                }
                createActivities(prj)

                projectService.update(projectId, [planStatus:ProjectService.PLAN_APPROVED])
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


    private void createActivities(Map project) {
        String projectAreaId = project.sites.find{it.type == 'projectArea'}.siteId
        List activitiesToCreate = [
                [
                        type:'ESP Species',
                        description:'Species Sightings for '+project.externalId,
                        siteId:projectAreaId
                ],
                [
                        type:'ESP Overview',
                        description:'Submission report for '+project.externalId,
                ]

        ]

        // Create standard reports
        project.reports.each { report ->
            activitiesToCreate.each { activityType ->
                String endDate = DateUtils.format(DateUtils.parse(report.toDate).minusDays(1))
                if (endDate > project.plannedEndDate) {
                    endDate = project.plannedEndDate
                }
                if (!project.activities.find{it.type == activityType && it.plannedStartDate == report.fromDate && it.plannedEndDate == endDate}) {
                    Map activity = [
                            projectId       : project.projectId,
                            plannedStartDate: report.fromDate,
                            plannedEndDate  : endDate,
                            startDate       : report.fromDate,
                            endDate         : endDate,
                            type            : activityType.type,
                            progress        : ActivityService.PROGRESS_PLANNED,
                            description     : activityType.description]
                    if (activityType.siteId) {
                        activity.siteId = activityType.siteId
                    }

                    activityService.create(activity)
                }

            }

        }
    }

}

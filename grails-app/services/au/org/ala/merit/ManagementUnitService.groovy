package au.org.ala.merit

import au.org.ala.merit.reports.ReportConfig
import au.org.ala.merit.reports.ReportGenerationOptions
import au.org.ala.merit.reports.ReportOwner
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.codehaus.groovy.grails.web.json.JSONArray
import org.joda.time.DateTime
import org.joda.time.DateTimeZone

class ManagementUnitService {

    private static final String MU_DOCUMENT_FILTER = "className:au.org.ala.ecodata.ManagementUnit"
    private static final String MU_MAP_PATH = "managementUnit/managementUnitSiteMap"

    GrailsApplication grailsApplication
    WebService webService
    MetadataService metadataService
    UserService userService
    SearchService searchService
    DocumentService documentService
    ReportService reportService
    ProjectService projectService

    Map get(String id) {
        String url = "${grailsApplication.config.ecodata.baseUrl}managementUnit/$id"
        Map mu = webService.getJson(url)

        boolean isAdmin = userService.isUserAdminForManagementUnit(userService.getCurrentUserId(), id)
        Map documentSearchParameters = [managementUnitId:id]
        if (!isAdmin) {
            documentSearchParameters['public'] = true
        }
        else {
            mu.reports = reportService.findReportsForManagementUnit(id)
        }

        Map results = documentService.search(documentSearchParameters)
        if (results && results.documents) {
            List categorisedDocs = results.documents.split{it.type == DocumentService.TYPE_LINK}

            mu.links = new JSONArray(categorisedDocs[0])
            mu.documents = new JSONArray(categorisedDocs[1])
        }
        mu
    }

    List get(String[] ids) {
        String url = "${grailsApplication.config.ecodata.baseUrl}managementUnits"
        Map result  = webService.doPost(url,[managementUnitIds:ids])
        List mues
        if(result.resp){
            mues = result.resp
            //handle states of site
            //Some sites may be across multi states
            mues.each {
                if (it.site?.state){
                    if (it.site.state instanceof Collection)
                        it.state = it.site.state[0]
                    else
                        it.state = it.site.state
                }
            }
        }else if(result.error){
            log.error(result.error)
        }
        mues
    }


    Map getByName(String name) {

        String encodedName = URLEncoder.encode(name, 'UTF-8')
        String url = "${grailsApplication.config.ecodata.baseUrl}managementUnit/findByName?name=$encodedName"
        Map mu = webService.getJson(url)

        if(mu && mu.statusCode == 404) {
            mu = [:]
        }

        return mu
    }

    String validate(Map props, String managementUnitId) {
        String error = null
        boolean creating = !managementUnitId

        if (!creating) {
            Map existingMu = get(managementUnitId)
            if (existingMu?.error) {
                return "invalid managementUnitId"
            }
        }

        if (creating && !props?.description) {
            //error, no description
            return "description is missing"
        }

        if (props.containsKey("name")) {
            Map existingMu = getByName(props.name)
            if ((existingMu as Boolean) && (creating || existingMu?.managementUnitId != managementUnitId)) {
                return "name is not unique"
            }
        } else if (creating) {
            //error, no project name
            return "name is missing"
        }

        error
    }

    Map update(String id, Map mu) {
        Map result = [:]

        def error = validate(mu, id)
        if (error) {
            result.error = error
            result.detail = ''
        } else {
            String url = "${grailsApplication.config.ecodata.baseUrl}managementUnit/$id"
            result = webService.doPost(url, mu)
        }
        result

    }

    Map getBlogs(String id){
        Map mu =get(id)
        return mu?.blog?:[]
    }

    /**
     * Get scores of each program in the given management unit
     * @param managementUnitId
     * @param programIds
     * @param approvedActivitiesOnly
     * @return [programId: serviceScores]
     */
    Map serviceScores(String managementUnitId, Map programGroups, boolean approvedActivitiesOnly = true) { List<Map> allServices = metadataService.getProjectServices()
        List scoreIds = allServices.collect{it.scores?.collect{score -> score.scoreId}}.flatten()

        def results = [:]

        for(Map.Entry programGroup in programGroups) {
            List programIdFacets = programGroup.value.collect{"programId:${it.programId}"}
            List facets = ["managementUnitId:${managementUnitId}"] + programIdFacets
            Map scoreResults = reportService.targetsForScoreIds(scoreIds, facets, approvedActivitiesOnly)

            List deliveredServices = []
            allServices.each { Map service ->
                Map copy = [:]
                copy.putAll(service)
                copy.scores = []
                service.scores?.each { score ->
                    Map copiedScore = [:]
                    copiedScore.putAll(score)
                    Map result = scoreResults?.scores?.find{it.scoreId == score.scoreId}

                    copiedScore.target = result?.target ?: 0
                    copiedScore.result = result?.result ?: [result:0, count:0]

                    // We only want to report on services that are going to be delivered by this program.
                    if (copiedScore.target) {
                        copy.scores << copiedScore
                    }

                }
                if (copy.scores) {
                    deliveredServices << copy
                }

            }

            results[programGroup.key]=deliveredServices
        }
        results

    }


    void regenerateReports(String id, List<String> managementUnitReportCategories = null, List<String> projectReportCategories = null) {
        Map managementUnit = get(id)

        regenerateManagementUnitReports(managementUnit, managementUnitReportCategories)
        regenerateProjectReports(managementUnit, projectReportCategories)
    }

    private void regenerateManagementUnitReports(Map managementUnit, List<String> reportCategories = null) {

        List managementUnitReportConfig = managementUnit.config?.managementUnitReports
        ReportOwner owner = new ReportOwner(
                id:[managementUnitId:managementUnit.managementUnitId],
                name:managementUnit.name,
                periodStart:managementUnit.startDate,
                periodEnd:managementUnit.endDate
        )
        List toRegenerate = managementUnitReportConfig.findAll{it.category in reportCategories}
        toRegenerate?.each {
            ReportConfig reportConfig = new ReportConfig(it)
            List relevantReports = managementUnit.reports?.findAll{it.category == reportConfig.category}
            reportService.regenerateReports(relevantReports, reportConfig, owner)
        }
    }

    private void regenerateProjectReports(Map managementUnit, List<String> reportCategories = null) {

        List projectReportConfig = managementUnit.config?.projectReports
        List toRegenerate = projectReportConfig.findAll{it.category in reportCategories}

        Map projects = getProjects(managementUnit.managementUnitId)
        toRegenerate?.each {
            projects?.projects?.each{ project ->
                project.reports = reportService.getReportsForProject(project.projectId)
                projectService.generateProjectReports(it, project, new ReportGenerationOptions())
            }
        }
    }

    Map getProjects(String id) {
        String url = "${grailsApplication.config.ecodata.baseUrl}managementUnit/$id/projects?view=flat"
        Map resp = webService.getJson(url)
        return resp
    }

    Map submitReport(String programId, String reportId) {
        Map reportData = setupReportLifeCycleChange(programId, reportId)
        return reportService.submitReport(reportId, reportData.reportActivities, reportData.managementUnit, reportData.members, EmailTemplate.RLP_CORE_SERVCIES_REPORT_SUBMITTED_EMAIL_TEMPLATE)
    }

    Map approveReport(String programId, String reportId, String reason) {
        Map reportData = setupReportLifeCycleChange(programId, reportId)
        return reportService.approveReport(reportId, reportData.reportActivities, reason, reportData.managementUnit, reportData.members, EmailTemplate.RLP_CORE_SERVICES_REPORT_APPROVED_EMAIL_TEMPLATE)
    }

    def rejectReport(String programId, String reportId, String reason, String category) {
        Map reportData = setupReportLifeCycleChange(programId, reportId)

        return reportService.rejectReport(reportId, reportData.reportActivities, reason, reportData.managementUnit, reportData.members, EmailTemplate.RLP_CORE_SERVICES_REPORT_RETURNED_EMAIL_TEMPLATE)
    }

    /**
     * Performs the common setup required for a report lifecycle state change (e.g. submit/approve/return)
     * @param managementUnitId the ID of the program that owns the report
     * @param reportId The report about to undergo a change.
     * @return a Map with keys [program, reportActivities, programMembers]
     */
    private Map setupReportLifeCycleChange(String managementUnitId, String reportId) {
        Map managementUnit = get(managementUnitId)
        List members = getMembersOfManagementUnit(managementUnitId)
        Map report = reportService.get(reportId)
        // All MU reports are of type "Single Activity" at the moment.
        List reportActivities = [report.activityId]

        [managementUnit:managementUnit, reportActivities:reportActivities, members:members]
    }


    List getMembersOfManagementUnit(String managementUnitId) {
        Map resp = userService.getMembersOfManagementUnit(managementUnitId)

        resp?.members ?: []
    }

    /**
     * Adds a user with the supplied role to the identified management unit.
     * Adds the same user with the same role to all of the management unit's projects.
     *
     * @param userId the id of the user to add permissions for.
     * @param managementUnitId the management unit to add permissions for.
     * @param role the role to assign to the user.
     */
    def addUserAsRoleToManagementUnit(String userId, String managementUnitId, String role) {
        Map resp = userService.addUserAsRoleToManagementUnit(userId, managementUnitId, role)
        Map projects = getProjects(managementUnitId)
        projects?.projects?.each { project ->
            if (project.isMERIT) {
                userService.addUserAsRoleToProject(userId, project.projectId, role)
            }
        }
        resp
    }

    /**
     * Removes the user access with the supplied role from the identified management unit.
     * Removes the same user from all of the management unit's projects.
     *
     * @param userId the id of the user to remove permissions for.
     * @param managementUnitId the management unit to remove permissions for.

     */
    def removeUserWithRoleFromManagementUnit(String userId, String managementUnitId, String role) {
        userService.removeUserWithRoleFromManagementUnit(userId, managementUnitId, role)
        Map projects = getProjects(managementUnitId)
        projects?.projects?.each { project ->
            if (project.isMERIT) {
                userService.removeUserWithRole(project.projectId, userId, role)
            }
        }
    }

    /**
     * Retrieves all management units as a geojson FeatureCollection with each
     * feature containing a type property that can be used to colour the map.
     */
    Map managementUnitFeatures() {
        String url = "${grailsApplication.config.ecodata.baseUrl}${MU_MAP_PATH}"
        // This is a very slow call as all MU features are simplified and intersected with each other to
        // build a collection ready for mapping.  Hence the 30 second timeout.  Caching has been applied to
        // the controller.
        webService.getJson2(url, 30000)
    }
    /**
     * Download reports of a management unit
     * @param id
     * @return
     */
    def downloadReports(String id){
        String url = "${grailsApplication.config.ecodata.baseUrl}" + "managementunit/"+id+"/report"
        webService.getJson(url)
    }
    /**
     * Download [all] management unit reports in a given period
     * @param startDate
     * @param endDate
     * @param emails for sending email to user
     * @return
     */
    def generateReports(String startDate, String endDate, Map extras = null){
        // Convert to ISO 8601 date format
        String format = 'yyyy-MM-dd'

        // The end date is the last day of the period (e.g. 2020-06-30) but reports will end at midnight of the next day (e.g. 2020-07-01T00:00:00)
        // so add a day or two to achieve this.
        DateTime start = DateUtils.parseDisplayDate(startDate, format).plusDays(2)
        DateTime end =  DateUtils.parseDisplayDate(endDate, format).plusDays(2)
        String isoStartDate = DateUtils.format(start.withZone(DateTimeZone.UTC))
        String isoEndDate = DateUtils.format(end.withZone(DateTimeZone.UTC))

        String url = "${grailsApplication.config.ecodata.baseUrl}" + "managementunit/generateReportsInPeriod?startDate=${isoStartDate}&endDate=${isoEndDate}"

        url += '&' + extras.collect { k,v -> "$k=$v" }.join('&')
        def resp = webService.getJson(url)
        return resp
    }
}

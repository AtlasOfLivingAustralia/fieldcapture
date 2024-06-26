package au.org.ala.merit

import au.org.ala.merit.config.EmailTemplate
import au.org.ala.merit.config.ReportConfig
import au.org.ala.merit.reports.ReportGenerationOptions
import au.org.ala.merit.reports.ReportOwner
import grails.core.GrailsApplication
import grails.plugin.cache.Cacheable
import groovy.util.logging.Slf4j
import org.grails.web.json.JSONArray

@Slf4j
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
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}managementUnit/$id"
        Map mu = webService.getJson(url)

        // If the user is an admin for a management unit or has the FC_READ_ONLY role, they are allowed
        // to view the reports and all documents.
        boolean hasExtendedAccess = userService.isUserAdminForManagementUnit(userService.getCurrentUserId(), id) || userService.userHasReadOnlyAccess()

        Map documentSearchParameters = [managementUnitId:id]
        if (!hasExtendedAccess) {
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
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}managementUnits"
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
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}managementUnit/findByName?name=$encodedName"
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
            if (!id) {
                // Assign the MERIT hubId to the management unit when craeting a new management unit
                mu.hubId = SettingService.hubConfig?.hubId
            }
            String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}managementUnit/$id"
            result = webService.doPost(url, mu)
        }
        result

    }

    Map getBlogs(String id){
        Map mu =get(id)
        return mu?.blog?:[]
    }




    void regenerateReports(String id, List<String> managementUnitReportCategories = null, List<String> projectReportCategories = null) {
        Map managementUnit = get(id)

        regenerateManagementUnitReports(managementUnit, managementUnitReportCategories)
        regenerateProjectReports(managementUnit, projectReportCategories)
    }

    private void regenerateManagementUnitReports(Map managementUnit, List<String> reportCategories) {
        if (!reportCategories) {
            log.info("No categories specified for management unit reports. Skipping regeneration.")
            return
        }
        List managementUnitReportConfig = managementUnit.config?.managementUnitReports?.collect{new ReportConfig(it)}
        ReportOwner owner = new ReportOwner(
                id:[managementUnitId:managementUnit.managementUnitId],
                name:managementUnit.name,
                periodStart:managementUnit.startDate,
                periodEnd:managementUnit.endDate
        )
        reportService.regenerateAll(managementUnit.reports, managementUnitReportConfig, owner, reportCategories)
    }

    private void regenerateProjectReports(Map managementUnit, List<String> reportCategories = null) {

        Map projects = getProjects(managementUnit.managementUnitId)
        projects?.projects?.each{ project ->
            project.reports = reportService.getReportsForProject(project.projectId)
            if (projectService.canBulkRegenerateReports(project)) {
                projectService.generateProjectStageReports(project.projectId, new ReportGenerationOptions(), reportCategories)
            }
        }
    }

    Map getProjects(String id) {
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}managementUnit/$id/projects?view=flat"
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

    def rejectReport(String programId, String reportId, String reason, List categories) {
        Map reportData = setupReportLifeCycleChange(programId, reportId)

        return reportService.rejectReport(reportId, reportData.reportActivities, reason, categories, reportData.managementUnit, reportData.members, EmailTemplate.RLP_CORE_SERVICES_REPORT_RETURNED_EMAIL_TEMPLATE)
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
     *
     * @param userId the id of the user to add permissions for.
     * @param managementUnitId the management unit to add permissions for.
     * @param role the role to assign to the user.
     */
    Map addUserAsRoleToManagementUnit(String userId, String managementUnitId, String role) {
        userService.addUserAsRoleToManagementUnit(userId, managementUnitId, role)
    }

    /**
     * Removes the user access with the supplied role from the identified management unit.
     *
     * @param userId the id of the user to remove permissions for.
     * @param managementUnitId the management unit to remove permissions for.

     */
    def removeUserWithRoleFromManagementUnit(String userId, String managementUnitId, String role) {
        userService.removeUserWithRoleFromManagementUnit(userId, managementUnitId, role)
    }

    /**
     * Retrieves all management units as a geojson FeatureCollection with each
     * feature containing a type property that can be used to colour the map.
     */
    @Cacheable('managementUnitMap')
    Map managementUnitFeatures() {
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}${MU_MAP_PATH}"
        // This is a very slow call as all MU features are simplified and intersected with each other to
        // build a collection ready for mapping.  Hence the 30 second timeout.
        webService.getJson2(url, 30000)
    }
    /**
     * Download reports of a management unit
     * @param id
     * @return
     */
    def downloadReports(String id){
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}" + "managementunit/"+id+"/report"
        webService.getJson(url)
    }

    def cancelReport(String managementUnitId, String reportId, String reason) {
        Map reportData = setupReportLifeCycleChange(managementUnitId, reportId)

        return reportService.cancelReport(reportId, reportData.reportActivities, reason, reportData.organisation, reportData.members)
    }

    def unCancelReport(String managementUnitId, Map reportDetails) {
        Map reportData = setupReportLifeCycleChange(managementUnitId, reportDetails.reportId)

        Map result = reportService.unCancelReport(reportDetails.reportId, reportDetails.activityIds, reportDetails.reason, reportData.organisation, reportData.members)

        result
    }
}

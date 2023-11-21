package au.org.ala.merit

import au.org.ala.merit.config.EmailTemplate
import au.org.ala.merit.config.ReportConfig
import au.org.ala.merit.reports.ReportOwner
import org.joda.time.Period

/**
 * Extends the plugin OrganisationService to provide Green Army reporting capability.
 */
class OrganisationService {


    def grailsApplication,webService, metadataService, projectService, userService, searchService, activityService, emailService, reportService, documentService
    AbnLookupService abnLookupService

    private static def APPROVAL_STATUS = ['unpublished', 'pendingApproval', 'published']

    public static Comparator<String> APPROVAL_STATUS_COMPARATOR = {a,b -> APPROVAL_STATUS.indexOf(a) <=> APPROVAL_STATUS.indexOf(b)}

    // This is the behaviour we want for green army.  it may be extendible to other programs (e.g.
    // biodiversity fund has a stage report and end of project report)
    private static def GREEN_ARMY_REPORT_CONFIG = [
            [type: 'Performance expectations framework - self assessment worksheet', period: Period.years(1), bulkEditable: true, businessDaysToCompleteReport:5, adhoc:true]
    ]

    def get(String id, view = '') {

        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}organisation/$id?view=$view"
        Map organisation = webService.getJson(url)

        if (view != 'flat') {
            organisation.reports = getReportsForOrganisation(organisation, getReportConfig(id))
        }
        organisation
    }

    def list() {
        metadataService.organisationList()
    }

    Map findOrgByAbn(String abnNumber) {
        return list().list.find({ it.abn == abnNumber }) as Map
    }

    String checkExistingAbnNumber(String organisationId, String abnNumber) {
        String error = null
        // We are allowing a blank ABN for now, this rule may change
        if (abnNumber) {
            Map organisation = findOrgByAbn(abnNumber)

            if (organisation && organisation.organisationId != organisationId) {
                error = "Abn Number is not unique"
            }
        }

        return error
    }

    Map update(String id, Map organisation) {
        Map result = [:]
        String abn = organisation.abn

        String error = null
        if (organisation.organisationId && organisation.organisationId != id) {
            // We don't want to update the organisationId
            error = 'Invalid organisationId supplied'
        }
        else {
            error = checkExistingAbnNumber(id,abn)
        }
        if (error) {
            result.error = error
            result.detail = error
        }
        else {
            if (!id) {
                // Assign the MERIT hubId to the organisation when creating a new organisation
                organisation.hubId = SettingService.hubConfig?.hubId
                id = ''
            }
            def url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}organisation/$id"
            result = webService.doPost(url, organisation)
            metadataService.clearOrganisationList()
            result

        }
        return result
    }

    void regenerateReports(String id, List<String> organisationReportCategories = null) {
        Map organisation = get(id)

        regenerateOrganisationReports(organisation, organisationReportCategories)
    }

    private void regenerateOrganisationReports(Map organisation, List<String> reportCategories = null) {

        ReportOwner owner = new ReportOwner(
            id:[organisationId:organisation.organisationId],
            name:organisation.name
        )
        List organisationReportConfig = organisation.config?.organisationReports?.collect{new ReportConfig(it)}
        reportService.regenerateAll(organisation.reports, organisationReportConfig, owner, reportCategories)
    }

    def isUserAdminForOrganisation(organisationId) {
        def userIsAdmin

        if (!userService.user) {
            return false
        }
        if (userService.userIsSiteAdmin()) {
            userIsAdmin = true
        } else {
            userIsAdmin = userService.isUserAdminForOrganisation(userService.user.userId, organisationId)
        }

        userIsAdmin
    }

    def isUserGrantManagerForOrganisation(organisationId) {
        def userIsAdmin

        if (!userService.user) {
            return false
        }
        if (userService.userIsSiteAdmin()) {
            userIsAdmin = true
        } else {
            userIsAdmin = userService.isUserGrantManagerForOrganisation(userService.user.userId, organisationId)
        }

        userIsAdmin
    }

    /**
     * Get the list of users (members) who have any level of permission for the requested organisationId
     *
     * @param organisationId the organisationId of interest.
     */
    def getMembersOfOrganisation(organisationId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/getMembersForOrganisation/${organisationId}"
        webService.getJson(url)
    }

    /**
     * Adds a user with the supplied role to the identified organisation.
     *
     * @param userId the id of the user to add permissions for.
     * @param organisationId the organisation to add permissions for.
     * @param role the role to assign to the user.
     */
    def addUserAsRoleToOrganisation(String userId, String organisationId, String role) {
        userService.addUserAsRoleToOrganisation(userId, organisationId, role)
    }

    /**
     * Removes the user access with the supplied role from the identified organisation.
     *
     * @param userId the id of the user to remove permissions for.
     * @param organisationId the organisation to remove permissions for.

     */
    def removeUserWithRoleFromOrganisation(String userId, String organisationId, String role) {
        userService.removeUserWithRoleFromOrganisation(userId, organisationId, role)
    }

    def search(Integer offset = 0, Integer max = 100, String searchTerm = null, String sort = null) {
        Map params = [
                offset:offset,
                max:max,
                query:searchTerm,
                fq:"className:au.org.ala.ecodata.Organisation"
        ]
        if (sort) {
            params.sort = sort
        }
        def results = searchService.fulltextSearch(
                params, false
        )
        results
    }

    /** May be useful to make this configurable per org or something? */
    def getReportConfig(organisationId) {
        return GREEN_ARMY_REPORT_CONFIG
    }

    def getSupportedAdHocReports(projectId) {
        def adHocReports = getReportConfig(null).findAll{it.adhoc}
        if (userService.userIsSiteAdmin() || projectService.isUserCaseManagerForProject(userService.getUser()?.userId, projectId)) {
            return adHocReports.collect{it.type}
        }
        return adHocReports.findAll{!it.grantManagerOnly}.collect{it.type}
    }

    /**
     * Returns all activities of the specified type that are being undertaken by projects that are run
     * by this organisation (or that have a service provider relationship with this organisation).
     *
     * @param organisation the organisation - must include a project attribute that contains the projects
     * @param activityTypes the types of activities to return.
     * @return the activities that were found.
     */
    List findActivitiesForOrganisation(organisation, List activityTypes) {
        if (!organisation.projects) {
            return
        }

        def startDate = organisation.projects.min { it.plannedStartDate }.plannedStartDate
        def endDate = organisation.projects.max { it.plannedEndDate }.plannedEndDate

        def projectIds = organisation.projects.collect { it.projectId }
        def criteria = [type: activityTypes, projectId: projectIds, dateProperty:'plannedEndDate', startDate : startDate, endDate: endDate]

        def response = activityService.search(criteria)
        List activities = response?.resp?.activities ?: []

        return activities
    }

    /**
     * Returns a list of pseudo activities that represent the reports that are required to be
     * completed by this organisation.  Note that the pseduo activities aren't in the database, instead they
     * are derived from the existence of reports to be completed by projects related to the organisation.
     * @param organisation the organisation - must include a project attribute that contains the projects
     * @param reportConf defines the activity type and grouping period for the bulk reports.
     * @return the reports that need to be completed.
     */
    def getReportsForOrganisation(organisation, reportConf) {

        reportService.findReportsForOrganisation(organisation.organisationId)
    }

    Map submitReport(String organisationId, String reportId) {
        Map reportData = setupReportLifeCycleChange(organisationId, reportId)
        return reportService.submitReport(reportId, reportData.reportActivities, reportData.organisation, reportData.members, EmailTemplate.ORGANISATION_REPORT_SUBMITTED_EMAIL_TEMPLATE)
    }

    Map approveReport(String organisationId, String reportId, String reason) {
        Map reportData = setupReportLifeCycleChange(organisationId, reportId)
        return reportService.approveReport(reportId, reportData.reportActivities, reason, reportData.organisation, reportData.members, EmailTemplate.ORGANISATION_REPORT_APPROVED_EMAIL_TEMPLATE)
    }

    def rejectReport(String organisationId, String reportId, String reason, List categories) {
        Map reportData = setupReportLifeCycleChange(organisationId, reportId)

        return reportService.rejectReport(reportId, reportData.reportActivities, reason, categories, reportData.organisation, reportData.members, EmailTemplate.ORGANISATION_REPORT_RETURNED_EMAIL_TEMPLATE)
    }

    def cancelReport(String organisationId, String reportId, String reason) {
        Map reportData = setupReportLifeCycleChange(organisationId, reportId)

        return reportService.cancelReport(reportId, reportData.reportActivities, reason, reportData.organisation, reportData.members)
    }

    /**
     * Performs the common setup required for a report lifecycle state change (e.g. submit/approve/return)
     * @param organisationId the ID of the program that owns the report
     * @param reportId The report about to undergo a change.
     * @return a Map with keys [organisation, reportActivities, programMembers]
     */
    private Map setupReportLifeCycleChange(String organisationId, String reportId) {
        Map organisation = get(organisationId)
        List members = getMembersOfOrganisation(organisationId)
        Map report = reportService.get(reportId)
        // All MU reports are of type "Single Activity" at the moment.
        List reportActivities = [report.activityId]

        [organisation:organisation, reportActivities:reportActivities, members:members]
    }

    Map getAbnDetails(String abnNumber){
        Map result
        result = abnLookupService.lookupOrganisationNameByABN(abnNumber)
        if (result.abn == ''){
            result.error = "invalid"
        }else{
            result = [abn: result.abn, name: result.entityName]
        }
        return result
    }

}

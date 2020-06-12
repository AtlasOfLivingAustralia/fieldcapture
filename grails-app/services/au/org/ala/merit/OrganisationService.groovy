package au.org.ala.merit

import org.joda.time.DateTime
import org.joda.time.DateTimeConstants
import org.joda.time.DateTimeZone
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

    /** Overrides the parent to add Green Army reports to the results */
    def get(String id, view = '') {

        String url = "${grailsApplication.config.ecodata.baseUrl}organisation/$id?view=$view"
        Map organisation = webService.getJson(url)

        def projects = []
        def resp = projectService.search(organisationId: id, isMERIT:true, view:'enhanced')
        if (resp?.resp?.projects) {
            projects += resp.resp.projects
        }
        resp = projectService.search(orgIdSvcProvider: id, isMERIT:true, view:'enhanced')
        if (resp?.resp?.projects) {
            projects += resp.resp.projects.findAll{!projects.find{project -> project.projectId == it.projectId} }
        }
        organisation.projects = projects
        if (view != 'flat') {
            organisation.reports = getReportsForOrganisation(organisation, getReportConfig(id))
        }
        organisation
    }

    def getByName(orgName) {
        // The result of the service call will be a JSONArray if it's successful
        return list().list.find({ it.name == orgName })
    }

    def getNameFromId(orgId) {
        // The result of the service call will be a JSONArray if it's successful
        return orgId ? list().list.find({ it.organisationId == orgId })?.name : ''
    }

    def list() {
        metadataService.organisationList()
    }
    Map getOrgByAbn(String abnNumber){
        return list().list.find({ it.abn == abnNumber }) as Map
    }

    String checkExistingAbnNumber(String organisationId, String abnNumber){
        String error = null
        boolean creating = !organisationId

        Map orgList = getOrgByAbn(abnNumber)

        if (orgList == null){
            error
        }else{
            if (!creating){
                if(orgList.organisationId == organisationId && orgList.abn == abnNumber) {
                    error
                }else if (orgList.organisationId != organisationId && orgList.abn == abnNumber) {
                    error = "Abn Number is not unique"
                }
            }else{
                if (orgList.abn == abnNumber){
                    error = "Abn Number is not unique"
                }
            }
        }
        return error
    }

    def update(id, organisation) {
        def result = [:]
        String abn = organisation.abn
        String orgId = organisation.organisationId
        def error = checkExistingAbnNumber(orgId,abn)
        if (error){
            result.error = error
            result.detail = error
        }else{
            def url = "${grailsApplication.config.ecodata.baseUrl}organisation/$id"
            result = webService.doPost(url, organisation)
            metadataService.clearOrganisationList()
            result

        }
        return result
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
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/getMembersForOrganisation/${organisationId}"
        webService.getJson(url)
    }

    /**
     * Adds a user with the supplied role to the identified organisation.
     * Adds the same user with the same role to all of the organisation's projects.
     *
     * @param userId the id of the user to add permissions for.
     * @param organisationId the organisation to add permissions for.
     * @param role the role to assign to the user.
     */
    def addUserAsRoleToOrganisation(String userId, String organisationId, String role) {

        def organisation = get(organisationId, 'flat')
        def resp = userService.addUserAsRoleToOrganisation(userId, organisationId, role)
        organisation.projects.each { project ->
            if (project.isMERIT) {
                userService.addUserAsRoleToProject(userId, project.projectId, role)
            }
        }
        resp
    }

    /**
     * Removes the user access with the supplied role from the identified organisation.
     * Removes the same user from all of the organisation's projects.
     *
     * @param userId the id of the user to remove permissions for.
     * @param organisationId the organisation to remove permissions for.

     */
    def removeUserWithRoleFromOrganisation(String userId, String organisationId, String role) {
        def organisation = get(organisationId, 'flat')
        userService.removeUserWithRoleFromOrganisation(userId, organisationId, role)
        organisation.projects.each { project ->
            if (project.isMERIT) {
                userService.removeUserWithRole(project.projectId, userId, role)
            }
        }
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

    def calculateDueDate(reportConfig, DateTime monthEndDate) {
        if (!reportConfig.businessDaysToCompleteReport) {
            return monthEndDate
        }
        int i = 0
        def dueDate = monthEndDate.withZone(DateTimeZone.default).minusDays(1) // The date range for reports is UTC and goes to the fist millisecond of the new month.
        while (i<reportConfig.businessDaysToCompleteReport) {

            dueDate = dueDate.plusDays(1)
            if (dueDate.getDayOfWeek() < DateTimeConstants.SATURDAY) {
                i++
            }
        }
        return dueDate.withZone(DateTimeZone.UTC)
    }

    Map submitReport(String organisationId, String reportId) {

        Map organisation = get(organisationId)
        Map resp = reportService.submit(reportId)

        Map report = reportService.get(reportId)

        if (!resp.error) {
            emailService.sendOrganisationReportSubmittedEmail(organisationId, [organisation:organisation, report:report])
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

    Map approveReport(String organisationId, String reportId, String reason) {
        Map organisation = get(organisationId)
        Map resp = reportService.approve(reportId, reason)

        Map report = reportService.get(reportId)

        if (!resp.error) {
            emailService.sendOrganisationReportApprovedEmail(organisationId, [organisation:organisation, report:report, reason: reason])
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

    def rejectReport(String organisationId, String reportId, String reason, String category) {
        Map organisation = get(organisationId)
        Map resp = reportService.reject(reportId, category, reason)

        Map report = reportService.get(reportId)

        if (!resp.error) {
            emailService.sendOrganisationReportRejectedEmail(organisationId, [organisation:organisation, report:report, reason:reason])
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

    Map getAbnDetails(String abnNumber){
        Map result
        result = abnLookupService.lookupOrganisationNameByABN(abnNumber)
        if (result.abn == ''){
            result.error = "invalid"
        }else if (result.error == "Failed calling web service"){
            result.error = result.error
        }else{
            result = [abn: result.abn, name: result.entityName]
        }
        return result
    }

}

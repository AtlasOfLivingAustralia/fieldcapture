package au.org.ala.merit

import org.joda.time.DateTime
import org.joda.time.DateTimeConstants
import org.joda.time.DateTimeZone
import org.joda.time.Period


/**
 * Extends the plugin OrganisationService to provide Green Army reporting capability.
 */
class OrganisationService extends au.org.ala.fieldcapture.OrganisationService {


    private static def APPROVAL_STATUS = ['unpublished', 'pendingApproval', 'published']

    public static Comparator<String> APPROVAL_STATUS_COMPARATOR = {a,b -> APPROVAL_STATUS.indexOf(a) <=> APPROVAL_STATUS.indexOf(b)}

    // This is the behaviour we want for green army.  it may be extendible to other programs (e.g.
    // biodiversity fund has a stage report and end of project report)
    private static def GREEN_ARMY_REPORT_CONFIG = [
            [type: 'Performance expectations framework - self assessment worksheet', period: Period.years(1), bulkEditable: true, businessDaysToCompleteReport:5, adhoc:true]
    ]

    def activityService, emailService, reportService, groovyPageRenderer, documentService

    /** Overrides the parent to add Green Army reports to the results */
    def get(String id, view = '') {

        def organisation = super.get(id, 'flat')

        def projects = []
        def resp = projectService.search(organisationId: id, view:'enhanced')
        if (resp?.resp?.projects) {
            projects += resp.resp.projects
        }
        resp = projectService.search(orgIdSvcProvider: id, view:'enhanced')
        if (resp?.resp?.projects) {
            projects += resp.resp.projects.findAll{!projects.find{project -> project.projectId == it.projectId} }
        }
        organisation.projects = projects
        if (view != 'flat') {
            organisation.reports = getReportsForOrganisation(organisation, getReportConfig(id))
        }
        organisation
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

        // Create a PDF & document also.
        Map model = reportService.performanceReportModel(reportId)
        String reportDoc = groovyPageRenderer.render(view:'/report/performanceReportView', model:model)
        def doc = [name:model.report.name, organisationId:model.organisationId, reportId:reportId, saveAs:'pdf', type:'pdf', role:'report',filename:organisation.name + ' - ' + model.report.name, readOnly:true, public:false]
        documentService.createTextDocument(doc, reportDoc)

        if (!resp.error) {
            emailService.sendOrganisationReportSubmittedEmail(organisationId, [organisation:organisation])
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

    Map approveReport(String organisationId, String reportId, String reason) {
        Map organisation = get(organisationId)
        Map resp = reportService.approve(reportId, reason)

        if (!resp.error) {
            emailService.sendOrganisationReportApprovedEmail(organisationId, [organisation:organisation])
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

    def rejectReport(String organisationId, String reportId, String reason, String category) {
        Map organisation = get(organisationId)
        Map resp = reportService.reject(reportId, category, reason)

        if (!resp.error) {
            emailService.sendOrganisationReportRejectedEmail(organisationId, [organisation:organisation])
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

}

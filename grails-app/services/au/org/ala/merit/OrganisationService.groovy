package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils
import org.joda.time.DateTime
import org.joda.time.DateTimeConstants
import org.joda.time.DateTimeZone
import org.joda.time.Interval
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
            [type: 'Green Army - Monthly project status report', period: Period.months(1), bulkEditable: true, businessDaysToCompleteReport:5],
            [type: 'Green Army - Quarterly project report', period: Period.months(3), bulkEditable: false, businessDaysToCompleteReport:10],
            [type: 'Green Army - Site Visit Checklist', period: Period.months(1), bulkEditable: false, adhoc: true, grantManagerOnly:true],
            [type: 'Green Army - Desktop Audit Checklist', period: Period.months(1), bulkEditable: false, adhoc: true, grantManagerOnly:true],
            [type: 'Green Army - Change or Absence of Team Supervisor', period: Period.months(1), bulkEditable: false, adhoc: true]
    ]

    def activityService, messageSource, emailService

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

        def activities = findActivitiesForOrganisation(organisation, reportConf.collect {it.type})
        if (!activities) {
            return []
        }

        def reports = []
        def activitiesByType = activities.groupBy {it.type}

        reportConf.each { conf ->
            def activitiesOfType = activitiesByType[conf.type]
            if (!activitiesOfType) {
                return
            }
            def firstActivityByEndDate = activitiesOfType.min{it.plannedEndDate}.plannedEndDate
            def startDate = DateUtils.alignToPeriod(DateUtils.parse(firstActivityByEndDate), conf.period)

            Map<Interval, List> activitiesByPeriod = DateUtils.groupByDateRange(activitiesOfType, {it.plannedEndDate}, conf.period, startDate)

            activitiesByPeriod.each { interval, activitiesInInterval ->

                if (activitiesInInterval) {
                    def publicationStatus = activitiesInInterval.min(APPROVAL_STATUS_COMPARATOR).publicationStatus
                    def approvalStatus = messageSource.getMessage("report.publicationStatus."+publicationStatus, null, "Report not submitted", Locale.default)
                    def finishedCount = activitiesInInterval.count { it.progress == 'finished' }

                    def report = [type: conf.type, programme:'Green Army - Green Army Round 1',
                                  plannedStartDate: DateUtils.format(interval.start), plannedEndDate: DateUtils.format(interval.end), dueDate: DateUtils.format(calculateDueDate(conf, interval.end)),
                                  count: activitiesInInterval.size(), finishedCount:finishedCount, publicationStatus:publicationStatus,
                                  approvalStatus:approvalStatus, bulkEditable: conf.bulkEditable, activities:activitiesInInterval]
                    report.description = activityService.defaultDescription(report)
                    reports << report
                }
            }
        }

        reports

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

    def submitReport(organisationId, activityIds) {
        def resp = activityService.search([activityId:activityIds])
        def organisation = get(organisationId, 'flat')
        def activities = resp?.resp?.activities?:[]
        def readyForSubmit = activities.findAll{it.complete}.size() == activityIds.size()

        if (!readyForSubmit) {
            return [error:'All activities must be finished, deferred or cancelled']
        }

        resp = activityService.submitActivitiesForPublication(activityIds)
        if (!resp.error) {
            emailService.sendGreenArmyReportSubmittedEmail(organisationId, [organisation:organisation])
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

    def approveReport(organisationId, activityIds) {
        def resp = activityService.search([activityId:activityIds])
        def organisation = get(organisationId, 'flat')
        def activities = resp?.resp?.activities?:[]
        def readyForApproval = activities.findAll{it.complete && it.publicationStatus == 'pendingApproval'}.size() == activityIds.size()

        if (!readyForApproval) {
            return [error:'All activities must be complete and submitted for approval']
        }

        resp = activityService.approveActivitiesForPublication(activityIds)
        if (!resp.error) {
            emailService.sendGreenArmyReportApprovedEmail(organisationId, [organisation:organisation])
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

    def rejectReport(organisationId, activityIds) {
        def resp = activityService.search([activityId:activityIds])
        def organisation = get(organisationId, 'flat')
        def activities = resp?.resp?.activities?:[]
        def readyForApproval = activities.findAll{it.complete}.size() == activityIds.size()

        if (!readyForApproval) {
            return [error:'All activities must be complete']
        }

        resp = activityService.rejectActivitiesForPublication(activityIds)
        if (!resp.error) {
            emailService.sendGreenArmyReportRejectedEmail(organisationId, [organisation:organisation])
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

}

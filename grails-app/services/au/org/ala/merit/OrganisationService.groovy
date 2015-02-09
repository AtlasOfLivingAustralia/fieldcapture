package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils
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
            [type: 'Green Army - Monthly project status report', period: Period.months(1), bulkEditable: true],
            [type: 'Green Army - Quarterly project report', period: Period.months(3), bulkEditable: false],
            [type: 'Green Army - Site Visit Checklist', period: Period.months(1), bulkEditable: false, adhoc: true, grantManagerOnly:true],
            [type: 'Green Army - Desktop Audit Checklist', period: Period.months(1), bulkEditable: false, adhoc: true, grantManagerOnly:true],
            [type: 'Green Army - Change or Absence of Team Supervisor', period: Period.months(1), bulkEditable: false, adhoc: true]
    ]

    def activityService, messageSource, userService

    /** Overrides the parent to add Green Army reports to the results */
    def get(String id, view = '') {

        def organisation = super.get(id, view)


        organisation.reports = getReportsForOrganisation(organisation, getReportConfig(id))
        organisation
    }

    /** May be useful to make this configurable per org or something? */
    def getReportConfig(organisationId) {
        return GREEN_ARMY_REPORT_CONFIG
    }

    def getSupportedAdHocReports(projectId) {
        def adHocReports = getReportConfig(null).findAll{it.adhoc}
        if (projectService.isOfficerOrHigher() || projectService.isUserCaseManagerForProject(userService.getUser()?.userId, projectId)) {
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
                    def publicationStatus = activitiesInInterval.min(APPROVAL_STATUS_COMPARATOR)
                    def approvalStatus = messageSource.getMessage("report.publicationStatus."+publicationStatus, null, "Report not submitted", Locale.default)
                    def finishedCount = activitiesInInterval.count { it.progress == 'finished' }

                    def report = [type: conf.type, programme:'Green Army - Green Army Round 1',
                                  plannedStartDate: DateUtils.format(interval.start), plannedEndDate: DateUtils.format(interval.end), dueDate: DateUtils.format(interval.end + Period.days(7)),
                                  count: activitiesInInterval.size(), finishedCount:finishedCount,
                                  approvalStatus:approvalStatus, bulkEditable: conf.bulkEditable, activities:activitiesInInterval]
                    report.description = activityService.defaultDescription(report)
                    reports << report
                }
            }
        }

        reports

    }

}

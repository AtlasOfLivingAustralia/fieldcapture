package au.org.ala.merit

import au.org.ala.fieldcapture.ActivityService
import au.org.ala.fieldcapture.DateUtils
import org.joda.time.Interval
import org.joda.time.Period


/**
 * Extends the plugin OrganisationService to provide Green Army reporting capability.
 */
class OrganisationService extends au.org.ala.fieldcapture.OrganisationService {

    def activityService

    /** Overrides the parent to add Green Army reports to the results */
    def get(String id, view = '') {

        def organisation = super.get(id, view)

        // This is the behaviour we want for green army.  it may be extendible to other programs (e.g.
        // biodiversity fund has a stage report and end of project report)
        def reportConf = [
                [type: 'Green Army - Monthly project status report', period: Period.months(1)],
                [type: 'Green Army - Quarterly project report', period: Period.months(3)]]
        organisation.reports = getReportsForOrganisation(organisation, reportConf)
        organisation
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
        def criteria = [type: activityTypes, projectId: projectIds, plannedStartDate : startDate, plannedEndDate: endDate]

        def response = activityService.search(criteria)

        response.resp?.activities
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

            Map<Interval, List> activitiesByPeriod = DateUtils.groupByDateRange(activities, {it.plannedEndDate}, conf.period)

            activitiesByPeriod.each { interval, activitiesInInterval ->


                def progress = activitiesInInterval.max(ActivityService.PROGRESS_COMPARATOR)

                def report = [type: conf.type, plannedStartDate: DateUtils.format(interval.start), plannedEndDate: DateUtils.format(interval.end), count: activitiesInInterval.size(), progress: progress]
                report.description = activityService.defaultDescription(report)
                reports << report
            }
        }

        reports

    }

}

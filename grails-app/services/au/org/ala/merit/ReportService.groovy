package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils
import org.joda.time.Interval


class ReportService {

    def grailsApplication
    def webService
    def userService

    /**
     * This method supports automatically creating reporting activities for a project that re-occur at defined intervals.
     * e.g. a stage report once every 6 months or a green army monthly report once per month.
     * Activities will only be created when no reporting activity of the correct type exists within each period.
     * @param projectId identifies the project.
     * @param config List of [type:<activity type>, period:<period that must have a reporting activity>
     * @return
     */
    def regenerateStageReportsForProject(projectId, config) {

        def project = get(projectId, 'all')

        def startDate = DateUtils.parse(project.plannedStartDate)
        def endDate = DateUtils.parse(project.plannedEndDate)


        def toCreate = []
        def toDelete = []
        config.each {

            def periodStartDate = startDate
            def periodEndDate = endDate
            def activitiesOfType = project.activities.findAll {activity -> activity.type == it.type}
            if (activitiesOfType) {
                def firstActivityEndDate = DateUtils.parse(activitiesOfType.min{it.plannedEndDate}.plannedEndDate)
                periodStartDate = startDate < firstActivityEndDate ? startDate : firstActivityEndDate

                def lastActivityEndDate = DateUtils.parse(activitiesOfType.max{it.plannedEndDate}.plannedEndDate)
                periodEndDate = endDate > lastActivityEndDate ? endDate : lastActivityEndDate

            }

            periodStartDate = DateUtils.alignToPeriod(periodStartDate, it.period)

            def existingActivitiesByPeriod = DateUtils.groupByDateRange(activitiesOfType, {it.plannedEndDate}, it.period, periodStartDate, periodEndDate)

            def gaps = []
            existingActivitiesByPeriod.each { interval, activities ->
                if (interval.isBefore(startDate) || interval.isAfter(endDate)) {
                    toDelete += activities
                }
                else if (!activities) {
                    gaps << interval;
                }
            }

            gaps.each { Interval period ->
                // Subtract a day from the end date so the activity is displayed as 01/01/2014-31/01/2014 etc
                // If the period end date is after the project end date, use the project end date.
                def end = period.end.isBefore(endDate) ? period.end.minusDays(1) : endDate
                def activity = [type:it.type, plannedStartDate:DateUtils.format(period.start), plannedEndDate:DateUtils.format(end), projectId:projectId]
                activity.description = activityService.defaultDescription(activity)
                toCreate << activity
            }
        }
        return [create:toCreate, delete:toDelete]

    }

    def getReportsForProject(String projectId) {
        webService.getJson(grailsApplication.config.ecodata.baseUrl+"project/${projectId}/reports")
    }

    def submit(String reportId) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/submit/${reportId}", [:])
    }

    def approve(String reportId) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/approve/${reportId}", [:])
    }

    def reject(String reportId) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/returnForRework/${reportId}", [:])
    }

    def findReportsForUser(String userId) {

        def reports = webService.doPost(grailsApplication.config.ecodata.baseUrl+"user/${userId}/reports", [:])


        if (reports.resp && !reports.error) {
            return reports.resp.projectReports.groupBy{it.projectId}
        }

    }

    def doSomethingWithReports(allReports) {

        def interestingReportsByProject = [:]
        def reportsByProject = allReports.groupBy{it.projectId}

        reportsByProject.each {projectId, reports ->
            if (!projectId) {// Organisation reports
                return
            }
            interestingReportsByProject[projectId] = doSomethingWithASingleProjectsReports(reports)

        }
        interestingReportsByProject
    }

    List doSomethingWithASingleProjectsReports(reports) {

        def interestingReports = []


        reports.each { report ->

            if (report.isCurrent || report.isDue || report.isOverdue) {
                interestingReports << report
            }


        }
        interestingReports.sort{it.toDate}

    }
}

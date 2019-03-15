package au.org.ala.merit.command

import au.org.ala.merit.ActivityService
import au.org.ala.merit.DateUtils
import au.org.ala.merit.ReportService
import au.org.ala.merit.reports.Reef2050PlanActionReportConfig
import grails.converters.JSON
import grails.validation.Validateable

import javax.persistence.Transient

/**
 * The Reef2050PlanActionReportSummaryCommand is responsible for returning a List of available report configurations
 * for the Reef 2050 Plan Action report.  Each configuration represents a different time period.
 */
@Validateable
class Reef2050PlanActionReportSummaryCommand {
    @Transient
    ActivityService activityService

    boolean approvedActivitiesOnly = true

    List<Reef2050PlanActionReportConfig> reportSummary() {

        List availableReports = []
        // These represent the previous versions of the reef 2050 report.
        availableReports << new Reef2050PlanActionReportConfig(type: Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_ACTIVITY_TYPE, periodEnd: '2017-06-30T14:00:00Z')
        availableReports << new Reef2050PlanActionReportConfig(type: Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_ACTIVITY_TYPE, periodEnd: '2017-12-31T13:00:00Z')
        availableReports << new Reef2050PlanActionReportConfig(type: Reef2050PlanActionReportConfig.SETTINGS_TEXT_REPORT, periodEnd: '2018-06-30T14:00:00Z')

        List moreReports = available2018Reports()
        availableReports.addAll(moreReports)

        // Sort by newest first
        availableReports = availableReports.sort{it.periodEnd}.reverse()

        availableReports
    }

    private List<Reef2050PlanActionReportConfig> available2018Reports() {
        Map searchCriteria =
                [type    : Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE,
                 progress: ActivityService.PROGRESS_FINISHED]
        if (approvedActivitiesOnly) {
            searchCriteria.publicationStatus = ReportService.REPORT_APPROVED
        }

        List availableReports = []

        Map resp = null
        JSON.use("nullSafe") {
            resp = activityService.search(searchCriteria)
        }
        List activities = resp?.resp?.activities
        if (activities) {
            List reportDates = activities.collect { it.plannedEndDate }.unique().sort()
            reportDates.each {
                availableReports << new Reef2050PlanActionReportConfig(type: Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE, periodEnd: it)
            }
        }
        availableReports
    }


}

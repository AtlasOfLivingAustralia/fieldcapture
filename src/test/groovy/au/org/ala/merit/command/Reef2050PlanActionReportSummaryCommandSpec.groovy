package au.org.ala.merit.command

import au.org.ala.merit.ActivityService
import au.org.ala.merit.PublicationStatus
import au.org.ala.merit.reports.Reef2050PlanActionReportConfig
import grails.converters.JSON
import grails.testing.spring.AutowiredTest
import spock.lang.Specification

class Reef2050PlanActionReportSummaryCommandSpec extends Specification implements AutowiredTest{

    Reef2050PlanActionReportSummaryCommand command
    ActivityService activityService

    def setup() {
        command = new Reef2050PlanActionReportSummaryCommand()
        activityService = Mock(ActivityService)
        command.activityService = activityService

        JSON.createNamedConfig("nullSafe", { })
    }

    def "The summary command will default to finding data for approved activities only"() {

        expect:
        command.validate() == true
        command.approvedActivitiesOnly == true
    }

    def "The 3 legacy report and the 2020/2021 report will always be returned"() {

        when:
        List reports = command.reportSummary()

        then:
        1 * activityService.search( [type    : Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE,
                                     progress: ActivityService.PROGRESS_FINISHED, publicationStatus: PublicationStatus.APPROVED]) >> [reports:[]]
        reports.size() == 3
    }

    def "The new format reports will be returned if there is appropriate activity data for them"() {
        when:
        List reports = command.reportSummary()

        then:
        1 * activityService.search( [type    : Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE,
                                     progress: ActivityService.PROGRESS_FINISHED, publicationStatus: PublicationStatus.APPROVED]) >> [resp:[activities:[[plannedEndDate:'2018-07-01T00:00:00Z']]]]
        reports.size() == 4
    }

    def "The project End Date Reef 2050 Plan Action Reporting 2018 Stage 3 Report"() {

        when:
        List reports = command.reportSummary()

        then:
        1 * activityService.search( [type    : Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE,
                                     progress: ActivityService.PROGRESS_FINISHED, publicationStatus: PublicationStatus.APPROVED]) >> [reports:[]]

        and:
        reports[0].periodStart == null
        reports[0].periodEnd == "2018-06-30T14:00:00Z"
        reports[0].type == "settings"
    }


}

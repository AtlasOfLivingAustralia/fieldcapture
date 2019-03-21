package au.org.ala.merit.command

import au.org.ala.merit.ActivityService
import au.org.ala.merit.ReportService
import au.org.ala.merit.reports.Reef2050PlanActionReportConfig
import grails.converters.JSON
import grails.test.mixin.TestMixin
import grails.test.mixin.support.GrailsUnitTestMixin
import spock.lang.Specification

@TestMixin(GrailsUnitTestMixin)
class Reef2050PlanActionReportSummaryCommandSpec extends Specification {

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

    def "The three legacy reports will always be returned"() {

        when:
        List reports = command.reportSummary()

        then:
        1 * activityService.search( [type    : Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE,
                                     progress: ActivityService.PROGRESS_FINISHED, publicationStatus: ReportService.REPORT_APPROVED]) >> [reports:[]]
        reports.size() == 3
    }

    def "The new format reports will be returned if there is appropriate activity data for them"() {
        when:
        List reports = command.reportSummary()

        then:
        1 * activityService.search( [type    : Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE,
                                     progress: ActivityService.PROGRESS_FINISHED, publicationStatus: ReportService.REPORT_APPROVED]) >> [resp:[activities:[[plannedEndDate:'2018-07-01T00:00:00Z']]]]
        reports.size() == 4
    }



}

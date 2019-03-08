package au.org.ala.merit.command

import au.org.ala.merit.ActivityService
import au.org.ala.merit.ProjectService
import au.org.ala.merit.ReportService
import au.org.ala.merit.UserService
import grails.converters.JSON
import grails.test.mixin.TestMixin
import grails.test.mixin.support.GrailsUnitTestMixin
import spock.lang.Specification

@TestMixin(GrailsUnitTestMixin)
class Reef2050PlanActionReportCommandSpec extends Specification {

    Reef2050PlanActionReportCommand command
    ActivityService activityService
    ReportService reportService
    ProjectService projectService
    UserService userService

    def setup() {

        command = new Reef2050PlanActionReportCommand()
        activityService = Mock(ActivityService)
        command.activityService = activityService
        reportService = Mock(ReportService)
        command.reportService = reportService
        projectService = Mock(ProjectService)
        command.projectService = projectService
        userService = Mock(UserService)
        command.userService = userService

        JSON.createNamedConfig("nullSafe", { })
    }

    def "The command needs a periodEnd and type to be valid"() {
        expect:
        command.validate() == false

        when:
        command = new Reef2050PlanActionReportCommand(periodEnd: "2018-01-01T00:00:00Z")

        then:
        command.validate() == false

        when:
        command = new Reef2050PlanActionReportCommand(type:Reef2050PlanActionReportCommand.REEF_2050_PLAN_ACTION_REPORTING_ACTIVITY_TYPE)

        then:
        command.validate() == false


        when:
        command = new Reef2050PlanActionReportCommand(periodEnd: "2018-01-01T00:00:00Z", type:Reef2050PlanActionReportCommand.REEF_2050_PLAN_ACTION_REPORTING_ACTIVITY_TYPE)

        then:
        command.validate() == true

    }

    def "The command produces the appropriate report for the config"() {
        when:
        command.periodEnd = "2018-01-01T00:00:00Z"
        command.type = Reef2050PlanActionReportCommand.REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE
        Map reportModel = command.produceReport()

        then:
        1 * activityService.search({ config -> config.type == command.type}) >> [resp:[activities:[]]]
        1 * reportService.runActivityReport(_) >> [resp:[results:[:]]]

    }

}

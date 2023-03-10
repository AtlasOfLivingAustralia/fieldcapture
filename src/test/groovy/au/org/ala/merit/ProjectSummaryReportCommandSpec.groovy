package au.org.ala.merit

import au.org.ala.ecodata.forms.ActivityFormService
import au.org.ala.merit.command.ProjectSummaryReportCommand
import spock.lang.Specification

class ProjectSummaryReportCommandSpec extends Specification {

    ProjectService projectService = Mock(ProjectService)
    ProjectSummaryReportCommand command = new ProjectSummaryReportCommand()
    UserService userService = Mock(UserService)
    ActivityFormService activityFormService = Mock(ActivityFormService)
    ActivityService activityService = Mock(ActivityService)
    ReportService reportService = Mock(ReportService)

    void setup() {
        command.projectService = projectService
        command.userService = userService
        command.activityFormService = activityFormService
        command.activityService = activityService
        command.reportService = reportService
    }

    void "The project summary report can accept dates for the report"() {
        setup:
        command.id = "p1"
        command.sections = ["Section 1"]
        command.fromDate = "2020-01-01T14:00:00Z"
        command.toDate = "2020-04-01T14:00:00Z"

        when:
        Map model = command()

        then:
        1 * projectService.get(command.id, 'all') >> [projectId:command.id]
        0 * activityFormService.findActivityForm(_,_)
        model.project == [projectId:command.id]
        model.role == "MERIT user"
        model.content == command.sections


    }

    void "The project summary report will infer dates from stage names if supplied"() {
        setup:
        command.id = "p1"
        command.sections = ["Section 1"]
        command.fromStage = "Stage 1"
        command.toStage = "Stage 3"
        List reports = [
                [name:"Stage 1", fromDate:"2017-06-01T14:00:00Z", toDate:"2018-01-01T13:00:00Z"],
                [name:"Stage 2", fromDate:"2018-01-01T13:00:00Z", toDate:"2018-06-01T14:00:00Z"],
                [name:"Stage 3", fromDate:"2018-06-01T14:00:00Z", toDate:"2019-01-01T14:00:00Z"]
        ]
        Map project = [projectId:command.id, reports:reports]

        when:
        Map model = command()

        then:
        1 * projectService.get(command.id, 'all') >> project
        0 * activityFormService.findActivityForm(_,_)
        model.project == project
        model.role == "MERIT user"
        model.content == command.sections


    }

    def "The latest stage report can be found and used in the report"() {
        setup:
        command.id = "p1"
        command.sections = ["Stage report"]
        command.fromStage = "Stage 1"
        command.toStage = "Stage 3"
        List reports = [
                [name:"Stage 1", fromDate:"2017-06-01T14:00:00Z", toDate:"2018-01-01T13:00:00Z"],
                [name:"Stage 2", fromDate:"2018-01-01T13:00:00Z", toDate:"2018-06-01T14:00:00Z"],
                [name:"Stage 3", fromDate:"2018-06-01T14:00:00Z", toDate:"2019-01-01T14:00:00Z"]
        ]
        List activities = [
                [activityId:"a1", description:"a1", type:ActivityService.FINAL_REPORT_ACTIVITY_TYPE, plannedStartDate:"2017-06-01T14:00:00Z", plannedEndDate:"2018-01-01T13:00:00Z", formVersion:2],
                [activityId:"a2", description:"a2", type:ActivityService.REDUCED_STAGE_REPORT_ACTIVITY_TYPE, plannedStartDate:"2018-06-01T14:00:00Z", plannedEndDate:"2019-01-01T13:00:00Z", formVersion:1]
        ]
        Map project = [projectId:command.id, reports:reports, activities:activities]

        when:
        Map model = command()

        then:
        1 * projectService.get(command.id, 'all') >> project
        1 * activityFormService.findActivityForm(ActivityService.REDUCED_STAGE_REPORT_ACTIVITY_TYPE,1) >> [name:ActivityService.REDUCED_STAGE_REPORT_ACTIVITY_TYPE, sections:[]]
        1 * activityFormService.findActivityForm(ActivityService.FINAL_REPORT_ACTIVITY_TYPE,2) >> [name:ActivityService.FINAL_REPORT_ACTIVITY_TYPE, sections:[]]

        2 * activityService.isDeferredOrCancelled(_) >> false
        1 * reportService.findReportForDate("2018-01-01T13:00:00Z", project.reports) >> project.reports[0]
        1 * reportService.findReportForDate("2019-01-01T13:00:00Z", project.reports) >> project.reports[2]

        model.project == project
        model.role == "MERIT user"
        model.content == command.sections
    }
}

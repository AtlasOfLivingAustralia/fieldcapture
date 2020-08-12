package au.org.ala.merit

import au.org.ala.merit.command.ProjectSummaryReportCommand
import spock.lang.Specification

class ProjectSummaryReportCommandSpec extends Specification {

    ProjectService projectService = Mock(ProjectService)
    ProjectSummaryReportCommand command = new ProjectSummaryReportCommand()
    UserService userService = Mock(UserService)
    MetadataService metadataService = Mock(MetadataService)

    void setup() {
        command.projectService = projectService
        command.userService = userService
        command.metadataService = metadataService
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
        1 * metadataService.activitiesModel() >> [:]
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
        1 * metadataService.activitiesModel() >> [:]
        model.project == project
        model.role == "MERIT user"
        model.content == command.sections


    }
}

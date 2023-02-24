package au.org.ala.merit.command

import au.org.ala.merit.AuditService
import au.org.ala.merit.MetadataService
import au.org.ala.merit.ProjectService
import grails.testing.spring.AutowiredTest
import org.apache.http.HttpStatus
import spock.lang.Specification


class MeriPlanReportCommandSpec extends Specification implements AutowiredTest{

    ProjectService projectService = Mock(ProjectService)
    MetadataService metadataService = Mock(MetadataService)

    Closure doWithSpring() {{ ->
        command MeriPlanReportCommand
    }}

    MeriPlanReportCommand command
    def setup() {
        command = new MeriPlanReportCommand(projectService: projectService, metadataService: metadataService)
    }

    def "The model can be created from a project id"() {
        setup:
        String projectId = 'p1'

        when:
        command.id = projectId
        Map result = command.meriPlanReportModel()

        then:
        1 * projectService.get(projectId, _) >> [projectId:projectId]
        1 * projectService.getProgramConfiguration([projectId:projectId]) >> [meriPlanTemplate:'rlp']
        0 * projectService.getApprovedMeriPlanProject(_)

        result.project.projectId == projectId
        result.meriPlanTemplate == '/project/rlpView'

    }

    def "The model can be created from a document id"() {
        setup:
        String projectId = 'p1'
        String documentId = 'd1'

        when:
        command.id = projectId
        command.documentId = documentId
        Map result = command.meriPlanReportModel()

        then:
        0 * projectService.get(projectId, _)
        1 * projectService.getApprovedMeriPlanProject(documentId) >> [project:["projectId":"p1"],referenceDocument:"ref123", "projectId":projectId]
        1 * projectService.getProgramConfiguration([projectId:projectId]) >> [meriPlanTemplate:'rlp']

        result.project.projectId == projectId
        result.meriPlanTemplate == '/project/rlpView'
    }

    def "the id must be supplied as it is used for authorization"() {
        when:
        Map result = command.meriPlanReportModel()

        then:
        result.statusCode == HttpStatus.SC_UNPROCESSABLE_ENTITY
        result.error != null
    }

    def "an error will be returned if the project cannot be found"() {
        when:
        command.id = 'p1'
        Map result = command.meriPlanReportModel()

        then:
        1 * projectService.get('p1', _) >> null
        result.statusCode == HttpStatus.SC_NOT_FOUND
        result.error != null
    }

    def "an error will be returned if the document cannot be found if supplied"() {
        when:
        command.id = 'p1'
        command.documentId = 'm1'
        Map result = command.meriPlanReportModel()

        then:
        1 * projectService.getApprovedMeriPlanProject('m1') >> [:]

        result.statusCode == HttpStatus.SC_NOT_FOUND
        result.error != null
    }

    def "checks to ensure it's not using the old MeriPlan template"() {
        setup:
        String projectId = 'p1'

        when:
        command.id = projectId
        Map result = command.meriPlanReportModel()

        then:
        1 * projectService.get(projectId, _) >> [projectId:projectId]
        1 * projectService.getProgramConfiguration([projectId:projectId]) >> [meriPlanTemplate:MeriPlanReportCommand.RLP_MERI_PLAN_TEMPLATE]
        0 * projectService.getApprovedMeriPlanProject(_)

        result.project.projectId == projectId
        result.meriPlanTemplate != '/project/meriPlanView'

    }
}

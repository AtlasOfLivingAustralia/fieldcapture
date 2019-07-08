package au.org.ala.merit.command

import au.org.ala.merit.AuditService
import au.org.ala.merit.MetadataService
import au.org.ala.merit.ProjectService
import grails.test.mixin.TestMixin
import grails.test.mixin.support.GrailsUnitTestMixin
import org.apache.http.HttpStatus
import spock.lang.Specification


@TestMixin(GrailsUnitTestMixin)
class MeriPlanReportCommandSpec extends Specification {

    ProjectService projectService = Mock(ProjectService)
    MetadataService metadataService = Mock(MetadataService)
    AuditService auditService = Mock(AuditService)

    MeriPlanReportCommand command
    def setup() {
        command = new MeriPlanReportCommand(projectService: projectService, metadataService: metadataService, auditService: auditService)
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
        0 * auditService.getAuditMessage(_)

        result.project.projectId == projectId
        result.meriPlanTemplate == '/project/rlpView'

    }

    def "The model can be created from an audit message id"() {
        setup:
        String projectId = 'p1'
        String messageId = 'm1'

        when:
        command.id = projectId
        command.messageId = messageId
        Map result = command.meriPlanReportModel()

        then:
        0 * projectService.get(projectId, _)
        1 * auditService.getAuditMessage(messageId) >> [message:[entity:[projectId:projectId]], success:true]
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

    def "an error will be returned if the audit message cannot be found if supplied"() {
        when:
        command.id = 'p1'
        command.messageId = 'm1'
        Map result = command.meriPlanReportModel()

        then:
        1 * auditService.getAuditMessage('m1') >> [success:false]

        result.statusCode == HttpStatus.SC_NOT_FOUND
        result.error != null
    }
}

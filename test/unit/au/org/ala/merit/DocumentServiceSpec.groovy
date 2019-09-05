package au.org.ala.merit

import grails.test.mixin.TestFor
import spock.lang.Specification


/**
 * Tests the document service.
 */
@TestFor(DocumentService)
class DocumentServiceSpec extends Specification {

    UserService userService = Mock(UserService)
    WebService webService = Mock(WebService)

    def setup() {
        service.userService = userService
        service.webService = webService
    }


    def "only project members can edit or delete project documents"() {
        setup:
        Map document = [documentId:'d1', projectId:'p1']
        String userId = '1234'

        when:
        boolean canEdit = service.canEdit(document)
        boolean canDelete = service.canDelete(document.documentId)

        then:
        canEdit == false
        canDelete == false
        2 * webService.getJson(_) >> [documentId:'d1', projectId:'p2']
        2 * userService.getCurrentUserId() >> userId
        2 * userService.canUserEditProject(userId, 'p2') >> false

        when:
        canEdit = service.canEdit(document)
        canDelete = service.canDelete(document.documentId)

        then:
        canEdit == true
        canDelete == true
        2 * webService.getJson(_) >> [documentId:'d1', projectId:'p2']
        2 * userService.getCurrentUserId() >> userId
        2 * userService.canUserEditProject(userId, 'p2') >> true
    }

    def "only program members can edit or delete program documents"() {
        setup:
        Map document = [documentId:'d1', programId:'p1']
        String userId = '1234'

        when:
        boolean canEdit = service.canEdit(document)
        boolean canDelete = service.canDelete(document.documentId)

        then:
        canEdit == false
        canDelete == false
        2 * webService.getJson(_) >> [documentId:'d1', programId:'p2']
        2 * userService.getCurrentUserId() >> userId
        2 * userService.canUserEditProgramReport(userId, 'p2') >> false

        when:
        canEdit = service.canEdit(document)
        canDelete = service.canDelete(document.documentId)

        then:
        canEdit == true
        canDelete == true
        2 * webService.getJson(_) >> [documentId:'d1', programId:'p2']
        2 * userService.getCurrentUserId() >> userId
        2 * userService.canUserEditProgramReport(userId, 'p2') >> true
    }

    def "only organisation members can edit or delete an organisation document"() {
        setup:
        Map document = [documentId:'d1', organisationId:'o1']
        String userId = '1234'

        when:
        boolean canEdit = service.canEdit(document)
        boolean canDelete = service.canDelete(document.documentId)

        then:
        canEdit == false
        canDelete == false
        2 * webService.getJson(_) >> [documentId:'d1', organisationId:'o2']
        2 * userService.getCurrentUserId() >> userId
        2 * userService.isUserAdminForOrganisation(userId, 'o2') >> false

        when:
        canEdit = service.canEdit(document)
        canDelete = service.canDelete(document.documentId)

        then:
        canEdit == true
        canDelete == true
        2 * webService.getJson(_) >> [documentId:'d1', organisationId:'o2']
        2 * userService.getCurrentUserId() >> userId
        2 * userService.isUserAdminForOrganisation(userId, 'o2') >> true
    }

    def "only FC_ADMINS edit or delete a read only document, regardless of ownership"() {
        setup:
        Map document = [documentId:'d1', projectId:'p1']

        when:
        boolean canEdit = service.canEdit(document)
        boolean canDelete = service.canDelete(document.documentId)

        then:
        canEdit == false
        canDelete == false
        2 * webService.getJson(_) >> [documentId:'d1', projectId:'p2', readOnly:true]
        2 * userService.userIsAlaOrFcAdmin() >> false

        when:
        canEdit = service.canEdit(document)
        canDelete = service.canDelete(document.documentId)

        then:
        canEdit == true
        canDelete == true
        2 * webService.getJson(_) >> [documentId:'d1', projectId:'p2', readOnly:true]
        2 * userService.userIsAlaOrFcAdmin() >> true
    }

    def "editors and admins are allowed to create a read only document, but not edit it"() {
        Map document = [readOnly:true, projectId:'p1']
        String userId = 'u1'

        when:
        boolean canEdit = service.canEdit(document)

        then:
        canEdit == true
        1 * userService.getCurrentUserId() >> userId
        1 * userService.canUserEditProject(userId, document.projectId) >> true
    }

    def "users can edit an activity document if they can edit the project associated with the activity"(boolean canEditActivity) {
        setup:
        Map document = [documentId:'d1', activityId:'a1']
        String userId = 'u1'

        when:
        boolean canEdit = service.canEdit(document)
        boolean canDelete = service.canDelete(document.documentId)

        then:
        canEdit == canEditActivity
        canDelete == canEditActivity
        2 * webService.getJson(_) >> [documentId:'d1', activityId:document.activityId]
        2 * userService.getCurrentUserId() >> userId
        2 * userService.canUserEditActivity(userId, document.activityId) >> canEditActivity

        where:
        canEditActivity | _
        true | _
        false | _

    }
}

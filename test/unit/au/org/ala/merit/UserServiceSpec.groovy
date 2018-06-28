package au.org.ala.merit

import au.org.ala.web.AuthService
import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(UserService)
class UserServiceSpec extends Specification {

    def webService = Mock(WebService)
    def authService = Mock(AuthService)


    def setup() {
        def grailsApplication = [:]
        grailsApplication.config = [ecodata:[baseUrl:"/"], security:[cas:[officerRole:'FC_OFFICER', adminRole:'FC_ADMIN', alaAdminRole:'ADMIN']]]
        service.grailsApplication = grailsApplication
        service.webService = webService
        service.authService = authService

        authService.userInRole(_) >> false
    }

    def "ACL checks should be delegated to appropriate web service calls"(String role, String entityType, String url) {

        setup:
        String userId = '1'
        String entityId = '2'

        when:
        service.checkRole(userId, role, entityId, entityType)

        then:
        1 * webService.getJson(url) >> [:]

        where:
        role                           | entityType          | url
        RoleService.PROJECT_ADMIN_ROLE | UserService.PROGRAM | "/permissions/getUserRolesForUserId/1"
        RoleService.GRANT_MANAGER_ROLE | UserService.PROGRAM | "/permissions/getUserRolesForUserId/1"
        RoleService.GRANT_MANAGER_ROLE | UserService.PROJECT | "/permissions/isUserCaseManagerForProject?projectId=2&userId=1"
        RoleService.PROJECT_ADMIN_ROLE | UserService.PROJECT | "/permissions/isUserAdminForProject?projectId=2&userId=1"
        RoleService.PROJECT_EDITOR_ROLE | UserService.PROJECT | "/permissions/canUserEditProject?projectId=2&userId=1"

    }
}

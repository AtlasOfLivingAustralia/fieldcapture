package au.org.ala.merit

import au.org.ala.web.AuthService
import grails.plugin.cache.GrailsCacheManager
import grails.plugin.cache.ehcache.GrailsEhcacheCache
import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(UserService)
class UserServiceSpec extends Specification {

    def webService = Mock(WebService)
    def authService = Mock(AuthService)
    def grailsCacheManager = Mock(GrailsCacheManager)


    def setup() {
        def grailsApplication = [:]
        grailsApplication.config = [ecodata:[baseUrl:"/"], security:[cas:[officerRole:'FC_OFFICER', adminRole:'FC_ADMIN', alaAdminRole:'ADMIN']]]
        service.grailsApplication = grailsApplication
        service.webService = webService
        service.authService = authService
        service.grailsCacheManager = grailsCacheManager

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


    def "The result of a failed user lookup should not be cached"() {
        // This is to avoid the situation where someone attempts to add a new user to a project before they register their account.
        // If this result is cached, even once they register they won't be able to be added until the cache expires.
        setup:
        String email = "test@test.com"

        GrailsEhcacheCache cache = Mock(GrailsEhcacheCache)
        cache.getAllKeys() >> [[simpleKey:email]]
        grailsCacheManager.getCache(_) >> cache

        when:
        Map result = service.checkEmailExists(email)

        then:
        1 * authService.getUserForEmailAddress(email) >> null
        result == null
        1 * cache.evict([simpleKey:email])

    }


    def "A locked account should be presented to the user the same as one that does not exist"() {
        // This spec is just testing that the email lookup fails for locked accounts.  The actual enforcement of
        // this belongs in ecodata.

        // This is to avoid the situation where someone attempts to add a new user to a project before they register their account.
        // If this result is cached, even once they register they won't be able to be added until the cache expires.
        setup:
        String email = "test@test.com"
        GrailsEhcacheCache cache = Mock(GrailsEhcacheCache)
        grailsCacheManager.getCache(_) >> cache

        when:
        Map result = service.checkEmailExists(email)

        then:
        1 * authService.getUserForEmailAddress(email) >> [userId:'test', locked:true]
        result == null

    }

    def "can Edit Program Blog "() {
        // This is to avoid the situation where someone attempts to add a new user to a project before they register their account.
        // If this result is cached, even once they register they won't be able to be added until the cache expires.
        setup:
        String userId = '1'
        String programId = '2'

        when:
        boolean result = service.canEditProgramBlog(userId,programId)

        then:
        3 * webService.getJson(_) >> [:]

        result == false

    }




}

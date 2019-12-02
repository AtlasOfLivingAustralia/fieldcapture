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
    def activityService = Mock(ActivityService)


    def setup() {
        def grailsApplication = [:]
        grailsApplication.config = [ecodata:[baseUrl:"/"], security:[cas:[officerRole:'FC_OFFICER', adminRole:'FC_ADMIN', alaAdminRole:'ADMIN', readOnlyOfficerRole:'FC_READ_ONLY']]]
        service.grailsApplication = grailsApplication
        service.webService = webService
        service.authService = authService
        service.grailsCacheManager = grailsCacheManager
        service.activityService = activityService

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

    def "An activity can be edited if the associated project can be edited"() {
        setup:
        String activityId = "a1"
        String userId = "u1"
        String projectId = "p1"

        when:
        boolean canEdit = service.canUserEditActivity(userId, activityId)

        then:
        canEdit == true

        and:
        1 * activityService.get(activityId) >> [projectId:projectId, activityId:activityId]

        and:
        1 * webService.getJson({it.endsWith("permissions/canUserEditProject?projectId=${projectId}&userId=${userId}")}) >> [userIsEditor:true]

    }

    def "An activity cannot be edited if it is not associated with a project"() {
        setup:
        String activityId = "a1"
        String userId = "u1"

        when:
        boolean canEdit = service.canUserEditActivity(userId, activityId)

        then:
        canEdit == false

        and:
        1 * activityService.get(activityId) >> [activityId:activityId]

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


    def "Only authorized users should be able to view non-public program information"(boolean readOnlyRole, boolean fcOfficerRole, boolean fcAdminRole, String programEditorRole, boolean expectedResult) {
        setup:
        String userId = 'u1'
        String programId = 'p1'
        Map programRole = [:]
        if (programEditorRole) {
            programRole = [entityId:programId, entityType:'au.org.ala.ecodata.Program', userId:userId, accessLevel:programEditorRole]
        }

        when:
        boolean canView = service.canUserViewNonPublicProgramInformation(userId, programId)
        println canView

        then:
        canView == expectedResult

        _ * authService.userInRole('FC_READ_ONLY') >> readOnlyRole
        _ * authService.userInRole('FC_OFFICER') >> fcOfficerRole
        _ * authService.userInRole('FC_ADMIN') >> fcAdminRole
        _ * webService.getJson("/permissions/getUserRolesForUserId/${userId}") >> [roles:[programRole]]


        where:
        readOnlyRole | fcOfficerRole | fcAdminRole | programEditorRole | expectedResult
        false        | false         | false       | 'editor'         | true
        false        | false         | false       | 'admin'          | true
        false        | false         | false       | null             | false
        true         | false         | false       | null             | true
        false        | true          | false       | null             | true
        false        | false         | true        | null             | true

    }

    def "We can retrieve a list of management units a user has roles associated with"() {
        setup:
        String userId = 'u1'

        when:
        service.getManagementUnitsForUserId(userId)

        then:
        1 * webService.getJson("/managementUnit/findAllForUser/${userId}")
    }

}

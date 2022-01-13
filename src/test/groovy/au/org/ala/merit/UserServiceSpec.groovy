package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import au.org.ala.web.AuthService
import grails.plugin.cache.CustomCacheKeyGenerator
import grails.plugin.cache.GrailsCache
import grails.plugin.cache.GrailsConcurrentMapCacheManager
import grails.testing.services.ServiceUnitTest
import grails.testing.web.GrailsWebUnitTest
import org.apache.http.HttpStatus
import org.grails.plugin.cache.GrailsCacheManager
import org.joda.time.DateTimeUtils
import spock.lang.Specification

/**
 * Tests the UserService.
 * We are implementing GrailsWe
 */
class UserServiceSpec extends Specification implements ServiceUnitTest<UserService>, GrailsWebUnitTest {

    def webService = Mock(WebService)
    def authService = Mock(AuthService)
    def activityService = Mock(ActivityService)
    def settingService = Mock(SettingService)
    def projectService = Mock(ProjectService)

    @Override
    Closure doWithSpring() {{ ->
        grailsCacheManager(GrailsConcurrentMapCacheManager)
        customCacheKeyGenerator(CustomCacheKeyGenerator)
    }}

    def setup() {
        grailsApplication.config.ecodata.baseUrl = "/"
        grailsApplication.config.security.cas = [ alaAdminRole:'ADMIN' ]
        service.grailsApplication = grailsApplication
        service.webService = webService
        service.authService = authService
        service.activityService = activityService
        service.cacheService = new CacheService()
        service.settingService = settingService
        service.roleService = new RoleService()
        service.projectService = projectService
        authService.userInRole(_) >> false
    }

    def cleanup() {
        DateTimeUtils.setCurrentMillisSystem()
    }

    def "ACL project checks should be delegated to appropriate web service calls"(String role, String url) {

        setup:
        String userId = '1'
        String entityId = '2'

        when:
        service.checkRole(userId, role, entityId, UserService.PROJECT )

        then:
        1 * webService.getJson(url) >> [:]

        where:
        role                            | url
        RoleService.GRANT_MANAGER_ROLE  | "/permissions/isUserCaseManagerForProject?projectId=2&userId=1"
        RoleService.PROJECT_ADMIN_ROLE  | "/permissions/isUserAdminForProject?projectId=2&userId=1"
        RoleService.PROJECT_EDITOR_ROLE | "/permissions/canUserEditProject?projectId=2&userId=1"
    }

    def "ACL checks for management units should be delegated to appropriate web service calls for management units and programs"(String role, String entityType, String userRole, boolean expectedResult) {

        setup:
        String userId = '1'
        String entityId = '2'
        Map result = [roles:[]]
        if (userRole) {
            result.roles << [role:userRole, entityId:entityId, entityType:entityType]
        }
        int expectedNumberOfCalls = (role == RoleService.PROJECT_EDITOR_ROLE && userRole != RoleService.PROJECT_ADMIN_ROLE) ? 2 : 1

        when:
        boolean actualResult = service.checkRole(userId, role, entityId, entityType)

        then:
        expectedNumberOfCalls * webService.getJson("/permissions/getUserRolesForUserId/${userId}") >> result
        actualResult == expectedResult

        where:
        role                            | entityType                 | userRole                        | expectedResult
        RoleService.PROJECT_ADMIN_ROLE  | UserService.MANAGEMENTUNIT | null                            | false
        RoleService.PROJECT_EDITOR_ROLE | UserService.MANAGEMENTUNIT | null                            | false
        RoleService.GRANT_MANAGER_ROLE  | UserService.MANAGEMENTUNIT | null                            | false
        RoleService.PROJECT_ADMIN_ROLE  | UserService.MANAGEMENTUNIT | RoleService.PROJECT_EDITOR_ROLE | false
        RoleService.PROJECT_EDITOR_ROLE | UserService.MANAGEMENTUNIT | RoleService.PROJECT_EDITOR_ROLE | true
        RoleService.GRANT_MANAGER_ROLE  | UserService.MANAGEMENTUNIT | RoleService.PROJECT_EDITOR_ROLE | false
        RoleService.PROJECT_ADMIN_ROLE  | UserService.MANAGEMENTUNIT | RoleService.PROJECT_ADMIN_ROLE  | true
        RoleService.PROJECT_EDITOR_ROLE | UserService.MANAGEMENTUNIT | RoleService.PROJECT_ADMIN_ROLE  | true
        RoleService.GRANT_MANAGER_ROLE  | UserService.MANAGEMENTUNIT | RoleService.PROJECT_ADMIN_ROLE  | false
        RoleService.PROJECT_ADMIN_ROLE  | UserService.MANAGEMENTUNIT | RoleService.GRANT_MANAGER_ROLE  | false
        RoleService.PROJECT_EDITOR_ROLE | UserService.MANAGEMENTUNIT | RoleService.GRANT_MANAGER_ROLE  | false
        RoleService.GRANT_MANAGER_ROLE  | UserService.MANAGEMENTUNIT | RoleService.GRANT_MANAGER_ROLE  | true
        RoleService.PROJECT_ADMIN_ROLE  | UserService.PROGRAM        | null                            | false
        RoleService.PROJECT_EDITOR_ROLE | UserService.PROGRAM        | null                            | false
        RoleService.GRANT_MANAGER_ROLE  | UserService.PROGRAM        | null                            | false
        RoleService.PROJECT_ADMIN_ROLE  | UserService.PROGRAM        | RoleService.PROJECT_EDITOR_ROLE | false
        RoleService.PROJECT_EDITOR_ROLE | UserService.PROGRAM        | RoleService.PROJECT_EDITOR_ROLE | true
        RoleService.GRANT_MANAGER_ROLE  | UserService.PROGRAM        | RoleService.PROJECT_EDITOR_ROLE | false
        RoleService.PROJECT_ADMIN_ROLE  | UserService.PROGRAM        | RoleService.PROJECT_ADMIN_ROLE  | true
        RoleService.PROJECT_EDITOR_ROLE | UserService.PROGRAM        | RoleService.PROJECT_ADMIN_ROLE  | true
        RoleService.GRANT_MANAGER_ROLE  | UserService.PROGRAM        | RoleService.PROJECT_ADMIN_ROLE  | false
        RoleService.PROJECT_ADMIN_ROLE  | UserService.PROGRAM        | RoleService.GRANT_MANAGER_ROLE  | false
        RoleService.PROJECT_EDITOR_ROLE | UserService.PROGRAM        | RoleService.GRANT_MANAGER_ROLE  | false
        RoleService.GRANT_MANAGER_ROLE  | UserService.PROGRAM        | RoleService.GRANT_MANAGER_ROLE  | true

    }


    def "The result of a failed user lookup should not be cached"() {
        // This is to avoid the situation where someone attempts to add a new user to a project before they register their account.
        // If this result is cached, even once they register they won't be able to be added until the cache expires.
        setup:
        String email = "test@test.com"

        // Mock the cache manager for this test so we can ensure the call to clear the cache was made.
        GrailsCache cache = Mock(GrailsCache)
        cache.getAllKeys() >> [[simpleKey:email]]
        GrailsCacheManager cacheManager = Mock(GrailsCacheManager)
        cacheManager.getCache(_) >> cache
        service.grailsCacheManager = cacheManager

        when:
        String result = service.checkEmailExists(email)

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

        when:
        String result = service.checkEmailExists(email)

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
        canEdit

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
        !canEdit

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

        !result

    }


    def "Only authorized users should be able to view non-public program information"(boolean readOnlyRole, boolean fcOfficerRole, boolean fcAdminRole, String programEditorRole, boolean expectedResult) {
        setup:
        String userId = 'u1'
        String programId = 'p1'
        Map programRole = [:]
        if (programEditorRole) {
            programRole = [entityId:programId, entityType:'au.org.ala.ecodata.Program', userId:userId, accessLevel:programEditorRole]
        }
        HubSettings hubSettings = new HubSettings(userPermissions:[])

        if (readOnlyRole) {
            hubSettings.userPermissions << [userId:userId, role:RoleService.PROJECT_READ_ONLY_ROLE]
        }
        if (fcOfficerRole) {
            hubSettings.userPermissions << [userId:userId, role:RoleService.GRANT_MANAGER_ROLE]
        }
        if (fcAdminRole) {
            hubSettings.userPermissions << [userId:userId, role:RoleService.PROJECT_ADMIN_ROLE]
        }
        SettingService.setHubConfig(hubSettings)

        when:
        boolean canView = service.canUserViewNonPublicProgramInformation(userId, programId)
        println canView

        then:
        canView == expectedResult
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

    def "The user service can test if the logged in user is an ALA admin"() {

        when:
        service.userIsAlaAdmin()

        then:
        1 * authService.userInRole(service.grailsApplication.config.security.cas.alaAdminRole)

    }

    def "This retrieves the lists of HUB users"() {
        setup:
        String hubId = '00cf9ffd-e30c-45f8-99db-abce8d05c0d8'

        when:
        service.getByHub(hubId)

        then:
        1 * webService.getJson({it.endsWith("permissions/getByHub/${hubId}")},300000) >> [data:[[role:'officer', displayName:null, userName:null, userId:130205], [role:'siteAdmin', displayName:null, userName:null, userId:129333]]]

    }

    def "This inserts a user into HUB"() {
        setup:
        String userId = '129333'
        String role = 'siteAdmin'
        Map params = [userId:'129333', role: 'siteAdmin']
        HubSettings hubSettings = new HubSettings(userPermissions:[],hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)

        when:
        def result = service.addUserToHub(params)

        then:
        result == null

    }

    def "This converts a MERIT role to Ecodata AccessLevel"() {
        setup:
        String role = 'siteAdmin'

        when:
        def result = service.convertHubRoleToAccesLevel(role)

        then:
        result == 'admin'

    }

    def "This converts a Ecodata AccessLevel to a HUB role"() {
        setup:
        def results = [data:[[role:'admin', displayName:null, userName:null, userId:'129333'],[role:'caseManager', displayName:null, userName:null, userId:'130205']]]

        when:
        def results2 = service.convertAccessLevelToHubRole(results)

        then:
        results2.size() > 0

    }

    def "This removes a user from HUB"() {
        setup:
        String userId = '129333'
        String role = 'siteAdmin'
        Map param = [userId: 129333, entityId: '00cf9ffd-e30c-45f8-99db-abce8d05c0d8', role: 'siteAdmin', expiryDate: '2022-06-01T00:00:00Z']
        HubSettings hubSettings = new HubSettings(userPermissions:[],hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)

        when:
        def result = service.removeHubUser(param)

        then:
        result == null

    }

    def "This validates if user who have a role on any existing MERIT project cannot be assigned the Read Only role in the HUB"() {
        setup:
        String userId = '129333'
        String entityId = '11111'
        String role = 'siteReadOnly'
        Map params = [userId:userId, role: role, entityId:entityId]
        HubSettings hubSettings = new HubSettings(hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)

        when:
        def result = service.saveHubUser(params)

        then:
        1 * webService.getJson({it.endsWith("permissions/doesUserHaveHubProjects?userId=${userId}&entityId=${entityId}")}) >> [[accessLevel:[code:'100', name:'admin'], project:[associatedProgram:'Green Army', projectId:'fd0289c5-ac99-44de-8538-6eb361c1a51a', status:'Active']]]
        result == [error:'User have a role on an existing MERIT project, cannot be assigned the Site Read Only role.']

    }

    def "This validates if user who doesn't have a role on any existing MERIT project can be assigned the Read Only role in the HUB"() {
        setup:
        String userId = '129333'
        String role = 'siteReadOnly'
        String entityId = '11111'
        Map params = [userId:userId, role: role, entityId:entityId]
        HubSettings hubSettings = new HubSettings(hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)

        when:
        def result = service.saveHubUser(params)

        then:
        1 * webService.getJson({it.endsWith("permissions/doesUserHaveHubProjects?userId=${userId}&entityId=${entityId}")}) >> []

        result == null

    }

    def "This validates if user can be assigned a role in the HUB"() {
        setup:
        String userId = '129333'
        String role = 'siteAdmin'
        String entityId = '11111'
        Map params = [userId:userId, role: role, entityId:entityId]
        HubSettings hubSettings = new HubSettings(hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)

        when:
        def result = service.saveHubUser(params)

        then:
        1 * webService.getJson({it.endsWith("permissions/doesUserHaveHubProjects?userId=${userId}&entityId=${entityId}")}) >> []
        result == null

    }

    def "record user login"() {

        setup: "The code uses the current time, so we mock it so we can test.  This is undone in the cleanup"
        String mockedNow = "2021-01-01T00:00:00Z"
        DateTimeUtils.setCurrentMillisFixed(DateUtils.parse(mockedNow).toInstant().millis)

        when:
        boolean result = service.recordUserLogin("u1", "h1")

        then:
        1 * webService.doPost({it.endsWith("/user/recordUserLogin")}, [userId:"u1", hubId:"h1", loginTime:mockedNow]) >> [statusCode: HttpStatus.SC_OK]
        result
    }

    def "This retrieves the lists of HUB users, support pagination"() {
        setup:
        String hubId = '00cf9ffd-e30c-45f8-99db-abce8d05c0d8'
        int pageStart= 0
        int pageSize = 10

        when:
        def resp = service.getMembersForHubPerPage(hubId, pageStart, pageSize)

        then:
        1 * webService.getJson({it.endsWith("permissions/getMembersForHubPerPage?hubId=${hubId}&offset=${pageStart}&max=${pageSize}")}) >> [totalNbrOfAdmins: 1, data:[[userId: '1', role: 'admin']], count:1]
        resp.data.size() > 0

    }

    def "A grant manager can't be assigned the admin or editor role on a project"(String role) {

        setup: "Mock a user with the grant manager role"
        String userId = 'gm1'
        HubSettings hubSettings = new HubSettings(userPermissions:[])
        hubSettings.userPermissions << [userId:userId, role:RoleService.GRANT_MANAGER_ROLE]
        SettingService.setHubConfig(hubSettings)
        authService.userDetails() >> [userId:"u1"]
        authService.userInRole("ROLE_ADMIN") >> false
        authService.getUserForUserId("gm1") >> new au.org.ala.web.UserDetails(userId:'gm1', firstName:"Merit", lastName:'User')

        when: "We try and add the grant manager as a project admin"
        Map result = service.addUserAsRoleToProject(userId, "p1", role)

        then:
        result.error?.startsWith("User Merit User doesn't have the correct level of system access to be assigned an $role role.")

        where:
        role | _
        RoleService.PROJECT_EDITOR_ROLE | _
        RoleService.PROJECT_ADMIN_ROLE | _

    }

    def "A project admin can't be assigned the grant manager role on a project"() {

        setup: "Mock a user with the grant manager role"
        String addingUserId = 'gm1'
        HubSettings hubSettings = new HubSettings(userPermissions:[])
        hubSettings.userPermissions << [userId:addingUserId, role:RoleService.GRANT_MANAGER_ROLE]
        SettingService.setHubConfig(hubSettings)
        String toAddUserId = 'u1'
        authService.userDetails() >> [userId:addingUserId]
        authService.userInRole("ROLE_ADMIN") >> false
        authService.getUserForUserId("u1") >> new au.org.ala.web.UserDetails(userId:'u1', firstName:"Merit", lastName:'User')

        when: "We try and add the grant manager as a project admin"
        Map result = service.addUserAsRoleToProject(toAddUserId, "p1", RoleService.GRANT_MANAGER_ROLE)

        then:
        result.error?.startsWith("User Merit User doesn't have the correct level of system access to be assigned a grant manager role.")

        where:
        role | _
        RoleService.PROJECT_EDITOR_ROLE | _
        RoleService.PROJECT_ADMIN_ROLE | _

    }

    def "A grant manager can be assigned the grant manager role on a project"() {

        setup: "Mock a user with the grant manager role"
        String userIdToAdd = 'gm1'
        String loggedInUserId = 'u1'
        HubSettings hubSettings = new HubSettings(userPermissions:[])
        hubSettings.userPermissions << [userId:loggedInUserId, role:RoleService.GRANT_MANAGER_ROLE]
        hubSettings.userPermissions << [userId:userIdToAdd, role:RoleService.GRANT_MANAGER_ROLE]

        SettingService.setHubConfig(hubSettings)
        authService.userDetails() >> [userId:loggedInUserId]
        authService.userInRole("ROLE_ADMIN") >> false
        authService.getUserForUserId(userIdToAdd) >> new au.org.ala.web.UserDetails(userId:userIdToAdd, firstName:"Merit", lastName:'User')

        when: "We add the grant manager as a project admin"
        Map result = service.addUserAsRoleToProject(userIdToAdd, "p1", 'caseManager')

        then:
        1 * projectService.isUserAdminForProject(loggedInUserId, 'p1') >> true
        1 * webService.getJson({it.endsWith("permissions/addUserAsRoleToProject?userId=${userIdToAdd}&projectId=p1&role=caseManager")}) >> [statusCode:200]

        !result.error
    }

    def "The userService can retrieve a user's organisation list from ecodata"() {
        setup:
        String userId = 'u1'
        List orgData = [[organisationId:'o1']]

        when:
        List orgs = service.getOrganisationsForUserId(userId)

        then:
        1 * webService.getJson2({it.endsWith("permissions/getOrganisationsForUserId/$userId")}) >> [statusCode:HttpStatus.SC_OK, resp:orgData]

        and:
        orgs == orgData
    }

    def "If an error is encountered retrieving the organisation list, an empty list is returned"() {
        setup:
        String userId = 'u1'

        when:
        List orgs = service.getOrganisationsForUserId(userId)

        then:
        1 * webService.getJson2({it.endsWith("permissions/getOrganisationsForUserId/$userId")}) >> [statusCode:HttpStatus.SC_INTERNAL_SERVER_ERROR, error:"Error retrieving organisation data"]

        and:
        orgs == []
    }

    def "This checks if the user's permission expiry date is expiring 1 month from now"() {
        setup:
        String userId = '123'
        String entityId = '00cf9ffd-e30c-45f8-99db-abce8d05c0d8'

        when:
        def resp = service.doesUserExpiresInAMonth(userId, entityId)

        then:
        1 * webService.getJson({it.endsWith("permissions/doesUserExpiresInAMonth?userId=${userId}&entityId=${entityId}")}) >> [doesUserExpiresInAMonth:true]

        resp == true

    }

}
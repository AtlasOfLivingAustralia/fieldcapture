package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import au.org.ala.web.AuthService
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

class UserControllerSpec extends Specification implements ControllerUnitTest<UserController>{


    UserService userService = Mock(UserService)
    ReportService reportService = Mock(ReportService)
    AuthService authService = Mock(AuthService)

    def setup() {
        controller.userService = userService
        controller.reportService = reportService
    }

    def "the user controller assembles information about the projects and other entities the user has access to"() {

        setup:
        String userId = '1'

        when:
        Map model = controller.index()

        then:
        1 * userService.getUser() >> [userId:userId]
        1 * userService.userIsSiteAdmin() >> false

        1 * userService.getOrganisationsForUserId(userId) >> []
        1 * userService.getProjectsForUserId(userId) >> []
        1 * userService.getStarredProjectsForUserId(userId) >> []
        1 * userService.getProgramsForUserId(userId) >> []
        1 * userService.getManagementUnitsForUserId(userId) >> []

        1 * reportService.findReportsForUser(userId) >> []

        model.allowProjectRecommendation == false
        model.user.userId == userId
        model.memberProjects == []
        model.memberOrganisations == []
        model.memberPrograms == []
        model.memberManagementUnits == []
        model.starredProjects == []

    }

    def "an anonymous user will be redirected to the home page"() {

        when:
        controller.index()

        then:
        1 * userService.getUser() >> null
        response.redirectUrl == "/home"
    }

    def "only site admins are allowed to recommend projects for display on the homepage"(boolean isSiteAdmin, boolean canRecommendProjects) {
        setup:
        String userId = '1'

        when:
        Map model = controller.index()

        then:
        1 * userService.getUser() >> [userId:userId]
        1 * userService.userIsSiteAdmin() >> isSiteAdmin

        model.allowProjectRecommendation == canRecommendProjects

        where:

        isSiteAdmin | canRecommendProjects
        false       | false
        true        | true
    }

    void "Retrieving HUB Users"(){
        setup:
        HubSettings hubSettings = new HubSettings(userPermissions:[], hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)
        String hubId = '00cf9ffd-e30c-45f8-99db-abce8d05c0d8'
        params.id = hubId

        when:
        controller.getMembersOfHub()
        def results = response.getJson()

        then:
        1 * userService.getCurrentUserId() >> [userId:'129333', userName: 'jsalomon']
        1 * userService.userIsAlaOrFcAdmin() >> true
        1 * userService.getByHub(params.id) >> [[userId:'123'],[userId: '456']]

        and:
        results.userId.size() > 0

    }

    void "Adding a HUB User"(){
        setup:
        String userId = '129333'
        params.userId = userId
        String role = 'siteReadOnly'
        params.role = role
        String hubId = '00cf9ffd-e30c-45f8-99db-abce8d05c0d8'
        params.entityId = hubId
        HubSettings hubSettings = new HubSettings(userPermissions:[], hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)
        Map res = [:]

        when:
        controller.addUserToHub()
        def results = response.getJson()

        then:
        1 * userService.userIsAlaOrFcAdmin() >> true
        1 * userService.saveHubUser(userId,role, params.entityId) >> res

        and:
        results == [:]

    }

    void "Adding a HUB User with invalid permission"(){
        setup:
        String userId = '129333'
        params.userId = userId
        String role = 'siteReadOnly'
        params.role = role
        HubSettings hubSettings = new HubSettings(userPermissions:[], hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)

        when:
        controller.addUserToHub()

        then:
        1 * userService.userIsAlaOrFcAdmin() >> false

        and:
        response.status == 403
        response.text == 'Permission denied'

    }

    void "Deleting a HUB Users"(){
        setup:
        String userId = '129333'
        params.userId = userId
        String role = 'siteReadOnly'
        params.role = role
        String hubId = '00cf9ffd-e30c-45f8-99db-abce8d05c0d8'
        params.entityId = hubId
        HubSettings hubSettings = new HubSettings(userPermissions:[], hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)
        Map res = [:]

        when:
        controller.removeUserWithHubRole()
        def results = response.getJson()

        then:
        1 * userService.userIsAlaOrFcAdmin() >> true
        1 * userService.removeHubUser(userId,role,params.entityId) >> res

        and:
        results == [:]

    }

    void "Deleting a HUB User with invalid permission"(){
        setup:
        String userId = '129333'
        params.userId = userId
        String role = 'siteReadOnly'
        params.role = role
        HubSettings hubSettings = new HubSettings(userPermissions:[], hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)

        when:
        controller.removeUserWithHubRole()

        then:
        1 * userService.userIsAlaOrFcAdmin() >> false

        and:
        response.status == 403
        response.text == 'Permission denied'

    }

    void "Retrieving HUB Users, supports pagination"(){
        setup:
        HubSettings hubSettings = new HubSettings(userPermissions:[], hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)
        String hubId = '00cf9ffd-e30c-45f8-99db-abce8d05c0d8'
        params.id = hubId

        when:
        controller.getMembersForHubPaginated()
        def results = response.getJson()

        then:
        1 * userService.getCurrentUserId() >> [userId:'129333', userName: 'jsalomon']
        1 * userService.userIsAlaOrFcAdmin() >> true
        1 * userService.getMembersForHubPerPage(params.id, params.int('start'), params.int('length')) >> [totalNbrOfAdmins: 1, data:[[userId: '1', role: 'admin']], count:1]

        and:
        results.data.size() > 0

    }

}

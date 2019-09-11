package au.org.ala.merit

import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(UserController)
class UserControllerSpec extends Specification {


    UserService userService = Mock(UserService)
    ReportService reportService = Mock(ReportService)

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

}

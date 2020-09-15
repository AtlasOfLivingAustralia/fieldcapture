package au.org.ala.merit

import au.org.ala.web.AuthService
import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(AdminController)
class AdminControllerSpec extends Specification {

    def adminService = Mock(AdminService)
    def authService  = Mock(AuthService)

    def setup(){
        controller.adminService = adminService
        controller.authService = authService
    }

    void "Search User Details using email Address"(){
        setup:
        String email = "test@test.com"
        params.emailAddress = email
        Map userDetails = [userId: "12345", userName: email, firstName: "Test", lastName: "Testing"]

        when:
        controller.searchUser()
        def results = response.getJson()


        then:
        1 * authService.getUserForEmailAddress(email) >> userDetails

        and:
        results.userId == "12345"
        results.emailAddress == "test@test.com"
        results.firstName == "Test"
        results.lastName == "Testing"

    }

    void "Search User Details using wrong email Address"(){
        setup:
        String email = "test@test.com"
        params.emailAddress = email
        Map userDetails = [userId: null, userName: null, firstName: null, lastName: null]

        when:
        controller.searchUser()
        def results = response.getJson()


        then:
        1 * authService.getUserForEmailAddress(email) >> userDetails

        and:
        results.error == "error"
        results.emailAddress == "test@test.com"
    }

    void "Remove user Details from merit with successfully"(){
        setup:
        String userId = "12345"
        params.userId = userId
        Map success = [status:200, error: false]

        when:
        controller.removeUser()
        def results = response.getJson()

        then:
        1 * adminService.deleteUserPermission(userId) >> success

        and:
        results.status == 200
        results.success == "Success"
    }

    void "Unable to remove user when no user found in the database"(){
        setup:
        String userId = "12345"
        params.userId = userId
        Map success = [status:400, error: "No UserPermissions found"]

        when:
        controller.removeUser()
        def results = response.getJson()

        then:
        1 * adminService.deleteUserPermission(userId) >> success

        and:
        results.status == 400
        results.error == "No UserPermissions found"
    }

    void "500 error when there is an issue downloading with db"(){
        setup:
        String userId = "12345"
        params.userId = userId
        Map success = [status:500, error: "Downloading issue"]

        when:
        controller.removeUser()
        def results = response.getJson()

        then:
        1 * adminService.deleteUserPermission(userId) >> success

        and:
        results.status == 500
        results.error == "Downloading issue"
    }
}

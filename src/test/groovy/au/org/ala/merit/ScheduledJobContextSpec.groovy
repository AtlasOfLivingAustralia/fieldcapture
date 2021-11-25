package au.org.ala.merit

import au.org.ala.web.AuthService
import spock.lang.Specification

class ScheduledJobContextSpec extends Specification {

    UserService userService
    AuthService authService

    void setup() {
        // We are using real instances of the UserService and AuthService here as the primary purpose of the
        // ScheduledJobContext is to enable these services to not fail when checks are performed on a thread
        // run as a scheduled task.
        userService = new UserService()
        authService = new AuthService()
        authService.grailsApplication = [config:[security:[cas:[bypass:false]]]]
        userService.authService = authService
    }

    def "The ScheduledJobContext can specify details of a user to return when running on a background thread"() {
        setup:
        def user
        boolean inRole

        when:
        ScheduledJobContext.withUser([name:'test', userid:'test'] ,{
            user = userService.getUser()
            inRole = authService.userInRole("TEST")
        })

        then:
        user.userId == 'test'
        inRole == false

    }

}

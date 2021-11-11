package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.testing.web.GrailsWebUnitTest
import spock.lang.Specification

class LoginRecordingInterceptorSpec extends Specification implements GrailsWebUnitTest {

    LoginRecordingInterceptor interceptor
    UserService userService = Mock(UserService)
    def setup() {
        interceptor = new LoginRecordingInterceptor()
        interceptor.userService = userService
    }

    def cleanup() {
        SettingService.clearHubConfig()
    }

    void "The interceptor will record a user login when it detects a user session for the first time"() {

        setup:
        HubSettings hubSettings = new HubSettings(hubId:"h1")
        SettingService.setHubConfig(hubSettings)

        when:"the interceptor is invoked"
        interceptor.before()

        then:"The interceptor retrieves the userId and delegates to the UserService to record the login"
        1 * userService.getCurrentUserId() >> "u1"
        1 * userService.recordUserLogin("u1", "h1")

        and: "A flag is added to the session to indicate the recording has been completed"
        session.getAttribute(LoginRecordingInterceptor.LOGIN_RECORDED)

    }

    void "The interceptor won't record a user login for an unauthenticated user"() {

        when:"the interceptor is invoked"
        interceptor.before()

        then:"The interceptor attempts to get the userId and finds that it is null"
        1 * userService.getCurrentUserId() >> null

        and: "It then does not attempt to record the login"
        0 * userService.recordUserLogin(_, _)

        and: "No flag is added to the session so the session will continue to be checked"
        !session.getAttribute(LoginRecordingInterceptor.LOGIN_RECORDED)
    }

    void "The interceptor won't record a user login if it cannot identify the Hub"() {
        when:"the interceptor is invoked"
        interceptor.before()

        then:"The interceptor attempts to get the userId and hubId"
        1 * userService.getCurrentUserId() >> "u1"

        and: "It then does not attempt to record the login"
        0 * userService.recordUserLogin(_, _)

        and: "No flag is added to the session so the session will continue to be checked"
        !session.getAttribute(LoginRecordingInterceptor.LOGIN_RECORDED)
    }


    void "The interceptor won't record a user login for a session it has already processed"() {
        when:"the interceptor is invoked"
        session.setAttribute(LoginRecordingInterceptor.LOGIN_RECORDED, true)
        interceptor.before()

        then:"The interceptor does nothing else"
        0 * _

        and: "The flag is unchanged"
        session.getAttribute(LoginRecordingInterceptor.LOGIN_RECORDED)
    }
}

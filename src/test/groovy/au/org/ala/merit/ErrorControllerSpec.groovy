package au.org.ala.merit

import grails.plugin.cookie.CookieService
import grails.testing.web.controllers.ControllerUnitTest
import spock.lang.Specification

class ErrorControllerSpec extends Specification implements ControllerUnitTest<ErrorController> {

    SettingService settingService = Mock(SettingService)
    CookieService cookieService = Mock(CookieService)

    def setup() {
        controller.settingService = settingService
        controller.cookieService = cookieService
    }

    def "The controller won't propogate an exception thrown by the settingsService"() {

        when:
        controller.response500()

        then: "The setting service throws and exception during processing"
        1 * cookieService.getCookie(_) >> "merit"
        1 * settingService.loadHubConfig("merit") >> { throw new RuntimeException("Something went wrong") }

        and: "The error page is still rendered"
        view == '/error'

    }
}

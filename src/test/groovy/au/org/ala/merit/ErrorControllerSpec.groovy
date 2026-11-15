package au.org.ala.merit

import grails.testing.web.controllers.ControllerUnitTest
import jakarta.servlet.http.Cookie
import spock.lang.Specification

class ErrorControllerSpec extends Specification implements ControllerUnitTest<ErrorController> {

    SettingService settingService = Mock(SettingService)

    def setup() {
        controller.settingService = settingService
    }

    def "The controller won't propagate an exception thrown by the settingsService"() {

        setup:
        request.setCookies(new Cookie(SettingService.LAST_ACCESSED_HUB, "merit"))

        when:
        controller.response500()

        then: "The setting service throws an exception during processing"
        1 * settingService.loadHubConfig("merit") >> { throw new RuntimeException("Something went wrong") }

        and: "The error page is still rendered"
        view == '/error'

    }
}

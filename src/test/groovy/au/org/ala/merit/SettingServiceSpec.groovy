package au.org.ala.merit

import grails.plugin.cookie.CookieService
import grails.testing.services.ServiceUnitTest
import spock.lang.Specification


class SettingServiceSpec extends Specification implements ServiceUnitTest<SettingService> {

    CookieService cookieService = Mock(CookieService)
    WebService webService = Mock(WebService)
    CacheService cacheService = Stub(CacheService)

    def setup() {
        service.cookieService = cookieService
        service.webService = webService
        service.cacheService = cacheService
        cacheService.get(_, {}) >> {String key, Closure closure -> closure() }
    }

    def "When loading a hub config, the hub is set in the threadlocal and a cookie is added to remember this as the most recently accessed hub"() {
        setup:
        String hub = "merit"

        when:
        service.loadHubConfig(hub)

        then:
        1 * cookieService.setCookie(SettingService.LAST_ACCESSED_HUB, hub, -1, '/', null,false, true)
        1 * webService.getJson({it.endsWith('hub/findByUrlPath/'+hub)}) >> [urlPath:hub]
        SettingService.getHubConfig().urlPath == hub
    }

}

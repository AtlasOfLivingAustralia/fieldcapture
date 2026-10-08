package au.org.ala.merit

import au.org.ala.ecodata.utils.CookieUtils
import groovy.util.logging.Slf4j

@Slf4j
class ErrorController {

    def settingService
    def response404() {
        loadRecentHub()
        render view:'/404'
    }

    def response500() {
        loadRecentHub()
        render view:'/error'
    }

    /**
     * Loads the most recently accessed hub configuration so the error pages have access to the skin. (In the
     * case of a 404 error, the hub may not be available for the current request).
     */
    private void loadRecentHub() {
        try {

            def hub = CookieUtils.getCookieValue(SettingService.LAST_ACCESSED_HUB)
            settingService.loadHubConfig(hub)
        }
        catch(Throwable t) {
            log.error("An error occured during error processing", t)
        }
    }
}

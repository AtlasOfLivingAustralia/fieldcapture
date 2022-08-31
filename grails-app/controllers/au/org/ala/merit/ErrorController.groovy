package au.org.ala.merit

import groovy.util.logging.Slf4j

@Slf4j
class ErrorController {

    def settingService, cookieService
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

            def hub = cookieService.getCookie(SettingService.LAST_ACCESSED_HUB)
            settingService.loadHubConfig(hub)
        }
        catch(Throwable t) {
            log.error("An error occured during error processing", t)
        }
    }
}

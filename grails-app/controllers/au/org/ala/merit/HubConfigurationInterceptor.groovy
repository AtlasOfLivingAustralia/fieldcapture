package au.org.ala.merit

import groovy.transform.CompileStatic

@CompileStatic
class HubConfigurationInterceptor {

    SettingService settingService
    UserService userService

    int order = HIGHEST_PRECEDENCE

    public HubConfigurationInterceptor() {
        matchAll()
    }

    boolean before() {
        if (userService.getCurrentUserId()) {
            request.setAttribute("containerType",  'container-fluid')
        }
        else {
            request.setAttribute("containerType", 'container') // Default to fixed width for most pages.
        }
        log.info("Loading hub config: "+request.getRequestURI())
        settingService.loadHubConfig(params.hub)
        true
    }

    boolean after() { true }

    void afterView() {
        SettingService.clearHubConfig()
    }
}

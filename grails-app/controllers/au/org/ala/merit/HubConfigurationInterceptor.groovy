package au.org.ala.merit

class HubConfigurationInterceptor {

    SettingService settingService
    UserService userService

    int order = 1

    public HubConfigurationInterceptor() {
        matchAll()
    }

    boolean before() {
        if (userService.getCurrentUserId()) {
            request.containerType = 'container-fluid'
        }
        else {
            request.containerType = 'container' // Default to fixed width for most pages.
        }
        settingService.loadHubConfig(params.hub)
        true
    }

    boolean after() { true }

    void afterView() { }
}

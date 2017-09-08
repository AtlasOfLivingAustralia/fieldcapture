package au.org.ala.merit

class HubConfigurationFilters {

    SettingService settingService
    UserService userService

    def filters = {
        all(controller: '*', action: '*') {
            before = {
                if (userService.getCurrentUserId()) {
                    request.containerType = 'container-fluid'
                }
                else {
                    request.containerType = 'container' // Default to fixed width for most pages.
                }
                settingService.loadHubConfig(params.hub)
            }
            after = { Map model ->

            }
            afterView = { Exception e ->
                // The settings are cleared in a servlet filter so they are available during page rendering.
            }
        }
    }
}

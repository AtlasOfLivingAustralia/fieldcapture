package au.org.ala.merit.hub

import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject

/**
 * The configuration for a hub.
 */
class HubSettings extends JSONObject {

    String hubId

    public HubSettings() {
        super()
    }

    public HubSettings(Map settings) {
        super()
        putAll(settings)
        hubId = settings.hubId
    }

    public boolean overridesHomePage() {
        return optString('homePagePath', null) as boolean
    }

    List getUserPermissions() {
        JSONArray permissions = optJSONArray('userPermissions')
        new ArrayList(permissions)
    }

    /**
     * Returns a map [controller: , action: ] based on parsing the homePathPage.  If the homePathPath property
     * isn't set or doesn't match the expected pattern, the default home index page will be returned..
     */
    public Map getHomePageControllerAndAction() {
        if (overridesHomePage()) {
            def regexp = "\\/(.*)\\/(.*)"
            def matcher = (optString('homePagePath', '') =~ regexp)
            if (matcher.matches()) {
                def controller = matcher[0][1]
                def action = matcher[0][2]
                return [controller:controller, action:action]
            }
        }
        return [controller:'home', action:'index']
    }
}

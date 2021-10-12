package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.converters.JSON
import grails.util.Holders
import groovy.text.GStringTemplateEngine
import groovy.util.logging.Slf4j
import org.grails.web.servlet.mvc.GrailsWebRequest
import org.springframework.web.context.request.RequestAttributes

@Slf4j
class SettingService {

    private static ThreadLocal localHubConfig = new ThreadLocal()
    private static final String HUB_LIST_CACHE_KEY = 'hubList'
    private static final String HUB_CACHE_KEY_SUFFIX = '_hub'
    public static final String HUB_CONFIG_ATTRIBUTE_NAME = 'hubConfig'
    public static final String LAST_ACCESSED_HUB = 'recentHub'


    public static void setHubConfig(HubSettings hubSettings) {
        localHubConfig.set(hubSettings)
        GrailsWebRequest.lookup()?.setAttribute(HUB_CONFIG_ATTRIBUTE_NAME, hubSettings, RequestAttributes.SCOPE_REQUEST)
    }

    public static void clearHubConfig() {
        localHubConfig.remove()
    }

    public static HubSettings getHubConfig() {
        return localHubConfig.get()
    }

    def webService, cacheService, cookieService
    def grailsApplication


    public void withHub(String hub, Closure closure) {

        HubSettings previousHub = getHubConfig()

        HubSettings settings = getHubSettings(hub)
        SettingService.setHubConfig(settings)

        try {
            closure()
        }
        finally {
            setHubConfig(previousHub)
        }
    }

    public void withDefaultHub(Closure closure) {
        String hub = Holders.grailsApplication.config.getProperty('app.default.hub', String, 'default')

        withHub(hub, closure)
    }

    /**
     * Checks if there is a configuration defined for the specified hub.
     */
    boolean isValidHub(String hubUrlPath) {
        List hubs = listHubs()
        hubs.find{it.urlPath == hubUrlPath}
    }

    def loadHubConfig(String hub) {
        // Don't want the cookie secure in dev environments as HTTPS is generally not used.
        boolean useSecureCookie = grailsApplication.config.getProperty('server.servlet.session.cookie.secure', Boolean, false)
        if (!hub) {
            hub = grailsApplication.config.getProperty('app.default.hub', String, 'default')
            String previousHub = cookieService.getCookie(LAST_ACCESSED_HUB)
            if (!previousHub) {
                cookieService.setCookie(LAST_ACCESSED_HUB, hub, -1, '/', null, useSecureCookie, true)
            }
        }
        else {
            // Store the most recently accessed hub in a cookie so that 404 errors can be presented with the
            // correct skin.
            cookieService.setCookie(LAST_ACCESSED_HUB, hub, -1, '/', null, useSecureCookie, true)
        }

        def settings = getHubSettings(hub)
        if (!settings) {
            log.warn("no settings returned for hub ${hub}!")
            settings = new HubSettings(
                    title:'Default',
                    skin:'ala2',
                    urlPath:grailsApplication.config.getProperty('app.default.hub', String, 'default'),
                    availableFacets: ['status', 'organisationFacet','associatedProgramFacet','associatedSubProgramFacet','mainThemeFacet','stateFacet','nrmFacet','lgaFacet','mvgFacet','ibraFacet','imcra4_pbFacet','otherFacet', 'gerSubRegionFacet','electFacet'],
                    adminFacets: ['electFacet'],
                    availableMapFacets: ['status', 'organisationFacet','associatedProgramFacet','associatedSubProgramFacet','stateFacet','nrmFacet','lgaFacet','mvgFacet','ibraFacet','imcra4_pbFacet','electFacet']
            )
        }

        SettingService.setHubConfig(settings)
    }

    def getSettingText(SettingPageType type) {
        def key = localHubConfig.get().urlPath + type.key

        get(key)

    }

    def setSettingText(SettingPageType type, String content) {
        def key = localHubConfig.get().urlPath + type.key

        set(key, content)
    }

    private def get(key) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + "setting/ajaxGetSettingTextForKey?key=${key}"
        def res = cacheService.get(key,{ webService.getJson(url) })
        return res?.settingText?:""
    }

    def getJson(key) {
        cacheService.get(key, {
            def settings = get(key)
            return settings ? JSON.parse(settings) : [:]
        })
    }

    private def set(key, settings) {
        cacheService.clear(key)
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + "setting/ajaxSetSettingText/${key}"
        webService.doPost(url, [settingText: settings, key: key])
    }

    /**
     * Allows for basic GString style substitution into a Settings page.  If the saved template text includes
     * ${}, these will be substituted for values in the supplied model
     * @param type identifies the settings page to return.
     * @param substitutionModel values to substitute into the page.
     * @return the settings page after substitutions have been made.
     */
    def getSettingText(SettingPageType type, substitutionModel) {
        String templateText = getSettingText(type)
        GStringTemplateEngine templateEngine = new GStringTemplateEngine();
        return templateEngine.createTemplate(templateText).make(substitutionModel).toString()
    }

    private def projectSettingsKey(projectId) {
        return projectId+'.settings'
    }

    def getProjectSettings(projectId) {
        getJson(projectSettingsKey(projectId))
    }

    def updateProjectSettings(projectId, settings) {
        def key = projectSettingsKey(projectId)
        set(key, (settings as JSON).toString())
    }

    private String hubCacheKey(String prefix) {
        return prefix+HUB_CACHE_KEY_SUFFIX
    }

    HubSettings getHubSettings(String urlPath) {

        cacheService.get(hubCacheKey(urlPath), {
            String url = grailsApplication.config.getProperty('ecodata.baseUrl')+'hub/findByUrlPath/'+urlPath
            Map json = webService.getJson(url)

            json.hubId ? new HubSettings(new HashMap(json)) : null
        })
    }

    void updateHubSettings(HubSettings settings) {
        cacheService.clear(HUB_LIST_CACHE_KEY)
        cacheService.clear(hubCacheKey(settings.urlPath))

        String url = grailsApplication.config.getProperty('ecodata.baseUrl')+'hub/'+(settings.hubId?:'')
        webService.doPost(url, settings)
    }

    List listHubs() {
        cacheService.get(HUB_LIST_CACHE_KEY, {
            String url = grailsApplication.config.getProperty('ecodata.baseUrl') + 'hub/'
            Map resp = webService.getJson(url)
            resp.list ?: []
        })
    }
}

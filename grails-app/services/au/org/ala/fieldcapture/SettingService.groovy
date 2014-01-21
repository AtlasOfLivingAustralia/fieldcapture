package au.org.ala.fieldcapture

import groovy.text.GStringTemplateEngine

class SettingService {

    def webService, cacheService
    def grailsApplication

    def getSettingText(SettingPageType type) {
        String url = grailsApplication.config.ecodata.baseUrl + "setting/ajaxGetSettingTextForKey?key=${type.key}"
        def res = cacheService.get(type.key,{ webService.getJson(url) })
        return res?.settingText?:""
    }

    def setSettingText(SettingPageType type, String content) {
        String url = grailsApplication.config.ecodata.baseUrl + "setting/ajaxSetSettingText/${type.name}"
        webService.doPost(url, [settingText: content, key: type.key])
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

}

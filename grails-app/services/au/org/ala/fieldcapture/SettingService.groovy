package au.org.ala.fieldcapture

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

}

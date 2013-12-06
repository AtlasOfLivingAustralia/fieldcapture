package au.org.ala.fieldcapture

class SettingService {

    def webService
    def grailsApplication

    def getSettingText(SettingPageType type) {
        String url = grailsApplication.config.ecodata.baseUrl + "setting/ajaxGetSettingTextForKey?key=${type.key}"
        return webService.getJson(url)?.settingText
    }

    def setSettingText(SettingPageType type, String content) {
        String url = grailsApplication.config.ecodata.baseUrl + "setting/ajaxSetSettingText/${type.name}"
        webService.doPost(url, [settingText: content, key: type.key])
    }

}

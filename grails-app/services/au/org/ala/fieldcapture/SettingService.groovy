package au.org.ala.fieldcapture

class SettingService {

    def webService
    def grailsApplication

    def getSettingText(SettingPageType type) {
        String url = grailsApplication.config.ecodata.baseUrl + "setting/ajaxGetSettingText/${type.name}"
        return webService.getJson(url)?.settingText
    }

    def setSettingText(SettingPageType type, String content) {
        String url = grailsApplication.config.ecodata.baseUrl + "setting/ajaxSetSettingText/${type.name}"
        webService.doPost(url, [settingText: content])
    }

}

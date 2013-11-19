package au.org.ala.fieldcapture

class SettingService {

    def webService
    def grailsApplication

    def getAboutPageText() {
        String url = grailsApplication.config.ecodata.baseUrl + 'setting/ajaxGetAboutPageText'
        return webService.getJson(url)?.aboutText
    }

    def setAboutPageText(String content) {
        String url = grailsApplication.config.ecodata.baseUrl + 'setting/ajaxSetAboutPageText'
        webService.doPost(url, [aboutText: content])
    }

    def getPageFooterText() {
        String url = grailsApplication.config.ecodata.baseUrl + 'setting/ajaxGetFooterText'
        return webService.getJson(url)?.footerText
    }

    def setPageFooterText(String content) {
        String url = grailsApplication.config.ecodata.baseUrl + 'setting/ajaxSetFooterText'
        webService.doPost(url, [footerText: content])
    }

}

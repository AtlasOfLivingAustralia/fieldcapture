package au.org.ala.fieldcapture

class AuditService {

    def webService
    def grailsApplication

    def getAuditMessagesForProject(String projectId) {
        String url = grailsApplication.config.ecodata.baseUrl + 'audit/ajaxGetAuditMessagesForProject?projectId=' + projectId
        return webService.getJson(url)
    }

    def getAuditMessage(String messageId) {
        String url = grailsApplication.config.ecodata.baseUrl + 'audit/ajaxGetAuditMessage/' + messageId
        return webService.getJson(url)
    }

    def getUserDetails(String userId) {
        String url = grailsApplication.config.ecodata.baseUrl + 'audit/ajaxGetUserDetails/' + userId
        return webService.getJson(url)
    }

}

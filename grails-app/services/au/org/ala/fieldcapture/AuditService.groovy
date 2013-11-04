package au.org.ala.fieldcapture

class AuditService {

    def webService
    def grailsApplication

    def getAuditMessagesForProject(String projectId) {

        String url = grailsApplication.config.ecodata.baseUrl + 'audit/ajaxGetAuditMessagesForProject?projectId=' + projectId
        return webService.getJson(url)

    }
}

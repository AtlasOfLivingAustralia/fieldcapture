package au.org.ala.merit

class AuditService {

    def webService
    def grailsApplication
    def commonService

    def getAuditMessagesForProject(String projectId) {
        String url = grailsApplication.config.ecodata.baseUrl + 'audit/ajaxGetAuditMessagesForProject?projectId=' + projectId
        return webService.getJson(url, 60000)
    }

    def getAuditMessagesForProject(String projectId, int offset, int pageSize, String q) {
        String paramString = commonService.buildUrlParamsFromMap(id:projectId, start:offset, size:pageSize, q:q)
        String url = grailsApplication.config.ecodata.baseUrl + 'audit/getAuditMessagesForProjectPerPage' + paramString
        return webService.getJson(url, 60000)
    }

    def getAuditMessagesForOrganisation(String organisationId) {
        String url = grailsApplication.config.ecodata.baseUrl + 'audit/getAuditMessagesForOrganisation?organisationId=' + organisationId
        return webService.getJson(url, 60000)
    }

    def getAuditMessagesForSettings() {
        String url = grailsApplication.config.ecodata.baseUrl + 'audit/getAuditMessagesForSettings?keyPrefix=merit'
        return webService.getJson(url, 60000)
    }

    def getAuditMessage(String messageId) {
        String url = grailsApplication.config.ecodata.baseUrl + 'audit/ajaxGetAuditMessage/' + messageId
        return webService.getJson(url)
    }

    def getUserDetails(String userId) {
        String url = grailsApplication.config.ecodata.baseUrl + 'audit/ajaxGetUserDetails/' + userId
        return webService.getJson(url)
    }

    Map compareProjectEntity(String projectId, String baselineDate, String beforeDate, String entityPath) {

        Map auditResult = getAuditMessagesForProject(projectId)

        // Holder for the most recent version of the entity recorded in the audit trail during the selected period.
        Map baselineEdit = null
        // Holder for the the most recent version of the enitity recorded in the audit trail before the start of the selected period.
        Map comparisonEdit = null
        // Holder for the most recent copy of the entity that was made before or on the baseline date.
        Map mostRecentEditBeforeOrOnBaselineDate = null

        if (auditResult && auditResult.messages) {

            boolean finished = false
            int i = 0
            while (i < auditResult.messages.size() && !finished) {
                Map message = auditResult.messages[i]
                if (message.entityType == "au.org.ala.ecodata.Project") {

                    if (!baselineEdit && (message.date <= baselineDate && message.date >= beforeDate) && message.entity[entityPath]) {
                        // This is the most recent version of the project entity that falls inside the selected date range.
                        baselineEdit = message
                        mostRecentEditBeforeOrOnBaselineDate = message
                    }
                    else if (baselineEdit && !comparisonEdit && (message.date < beforeDate) && message.entity[entityPath]) {
                        // This is the most recent version of the project entity before the start of the selected date range.
                        comparisonEdit = message
                    }
                    else if (!mostRecentEditBeforeOrOnBaselineDate && message.date < beforeDate && message.entity[entityPath]) {
                        mostRecentEditBeforeOrOnBaselineDate = message
                    }
                }
                if (baselineEdit != null && comparisonEdit != null && mostRecentEditBeforeOrOnBaselineDate != null) {
                    finished = true
                }
                i++
            }
        }
        [baseline: baselineEdit, comparison:comparisonEdit, mostRecentEditBeforeOrOnBaselineDate:mostRecentEditBeforeOrOnBaselineDate]
    }

}

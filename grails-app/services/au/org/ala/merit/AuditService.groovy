package au.org.ala.merit

class AuditService {

    def webService
    def grailsApplication
    def commonService

    def getAuditMessagesForProject(String projectId, int offset = 0, int pageSize = 200, String sort = 'date', String orderBy = 'desc') {
        getAuditMessagesForProject(projectId, offset, pageSize,  sort, orderBy, 'au.org.ala.ecodata.Project' )
    }

    def getAuditMessagesForProject(String projectId, int offset, int pageSize, String sort, String orderBy, String q) {

        String paramString = commonService.buildUrlParamsFromMap(id:projectId, start:offset, size:pageSize, q:q, sort:sort, orderBy:orderBy)
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + 'audit/getAuditMessagesForProjectPerPage' + paramString
        return webService.getJson(url, 60000)
    }

    def getAuditMessagesForOrganisation(String organisationId) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + 'audit/getAuditMessagesForOrganisation?organisationId=' + organisationId
        return webService.getJson(url, 60000)
    }

    def getAuditMessagesForSettings() {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + 'audit/getAuditMessagesForSettings?keyPrefix=merit'
        return webService.getJson(url, 60000)
    }

    def getAuditMessage(String messageId) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + 'audit/ajaxGetAuditMessage/' + messageId
        return webService.getJson(url)
    }

    def getAutoCompareAuditMessage(String id){
        String url = grailsApplication.config.getProperty('ecodata.service.url') + "/audit/getAutoCompareAuditMessage?auditId=${id}";
        return webService.getJson(url);
    }

    def getUserDetails(String userId) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + 'audit/ajaxGetUserDetails/' + userId
        return webService.getJson(url)
    }

    Map compareProjectEntity(String projectId, String baselineDate, String beforeDate, String entityPath) {

        int offset = 0
        int pageSize = 100
        List auditMessages = []

        // Retrieve audit messages in batches until we have all the messages for the project.
        Map auditResult = getAuditMessagesForProject(projectId, offset, pageSize)
        auditMessages.addAll(auditResult.data ?: [])
        while (auditMessages.size() < auditResult.recordsTotal) {
            offset += pageSize
            auditResult = getAuditMessagesForProject(projectId, offset, pageSize)
            auditMessages.addAll(auditResult.data)
        }

        // Holder for the most recent version of the entity recorded in the audit trail during the selected period.
        Map baselineEdit = null
        // Holder for the the most recent version of the entity recorded in the audit trail before the start of the selected period.
        Map comparisonEdit = null
        // Holder for the most recent copy of the entity that was made before or on the baseline date.
        Map mostRecentEditBeforeOrOnBaselineDate = null


        boolean finished = false
        int i = 0
        while (i < auditMessages.size() && !finished) {
            Map message = auditMessages[i]
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

        [baseline: baselineEdit, comparison:comparisonEdit, mostRecentEditBeforeOrOnBaselineDate:mostRecentEditBeforeOrOnBaselineDate]
    }

}

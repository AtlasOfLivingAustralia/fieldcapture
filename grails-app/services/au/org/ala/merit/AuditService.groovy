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
        Map resp = webService.getJson2(url, 60000)
        resp?.resp
    }

    Map searchAuditMessages(Map criteria, Map paginationOptions, String startDate = null, String endDate = null) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + 'audit/search'
        Map params = [criteria: criteria, paginationOptions: paginationOptions]
        if (startDate) {
            params.startDate = startDate
        }
        if (endDate) {
            params.endDate = endDate
        }
        return webService.doPost(url, params)
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
        int pageSize = 1

        // Holder for the most recent version of the entity recorded in the audit trail during the selected period.
        Map baselineEdit = null
        // Holder for the the most recent version of the entity recorded in the audit trail before the start of the selected period.
        Map comparisonEdit = null
        // Holder for the most recent copy of the entity that was made before or on the baseline date.
        Map mostRecentEditBeforeOrOnBaselineDate = null

        Map criteria = [entityId: projectId, entityType: 'au.org.ala.ecodata.Project']
        Map paginationOptions = [max: pageSize, offset: offset, sort: 'date', orderBy: 'desc']

        // Find the most recent version of the project entity that was recorded in the audit trail before the to date.
        Map results = searchAuditMessages(criteria, paginationOptions, null, baselineDate)
        if (!results || results.error) {
            log.error("Error searching for audit messages: ${results?.error}")
            return [error: results?.error, baseline: null, comparison: null, mostRecentEditBeforeOrOnBaselineDate: null]
        }

        if (results.resp.messages && results.resp.messages.size() > 0) {

            Map message = results.resp.messages[0]
            mostRecentEditBeforeOrOnBaselineDate = message
            if (message.date >= beforeDate) {
                baselineEdit = message
            }
            else {
                comparisonEdit = message
            }
        }

        if (!comparisonEdit) {
            results = searchAuditMessages(criteria, paginationOptions, null, beforeDate)
            if (results.resp.messages && results.resp.messages.size() > 0) {
                comparisonEdit = results.resp.messages[0]
            }
        }

        [baseline: baselineEdit, comparison:comparisonEdit, mostRecentEditBeforeOrOnBaselineDate:mostRecentEditBeforeOrOnBaselineDate]
    }



}

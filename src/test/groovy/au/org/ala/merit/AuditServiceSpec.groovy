package au.org.ala.merit

import grails.testing.services.ServiceUnitTest
import spock.lang.Specification

class AuditServiceSpec extends Specification implements ServiceUnitTest<AuditService> {

    WebService webService = Mock(WebService)

    def setup() {
        service.webService = webService
        service.commonService = new CommonService()
    }

    def cleanup() {
    }

    def "compareProjectEntity returns correct baseline, comparison, and mostRecentEditBeforeOrOnBaselineDate"() {
        given:
        String projectId = 'p1'
        String entityPath = 'risks'
        String baselineDate = '2024-06-10T00:00:00Z'
        String beforeDate = '2024-06-01T00:00:00Z'

        Map expectedPaginationOptions = [offset: 0, max: 1, sort: 'date', orderBy: 'desc']
        Map expectedCriteria = [
            entityId: projectId,
            entityType: 'au.org.ala.ecodata.Project'
        ]
        Map message1 = buildProjectAuditMessage('2024-06-12T00:00:00Z', [risk: 'high'])
        Map message2 = buildProjectAuditMessage('2024-03-11T00:00:00Z', [risk: 'medium'])


        webService.getJson2(_, _) >> { String url, int timeout ->
            [resp: [data: messages, recordsTotal: messages.size()]]
        }

        when:
        def result = service.compareProjectEntity(projectId, baselineDate, beforeDate, entityPath)

        then:
        1 * webService.doPost({ it.contains('audit/search') },
                [criteria:expectedCriteria, paginationOptions:expectedPaginationOptions, endDate:baselineDate]) >>
                [resp: [messages: [message1], totalCount: 10]]

        1 * webService.doPost({ it.contains('audit/search') },
                [criteria:expectedCriteria, paginationOptions:expectedPaginationOptions, endDate:beforeDate]) >>
                [resp: [messages: [message2], totalCount: 10]]



        result.baseline.date == '2024-06-12T00:00:00Z'
        result.comparison.date == '2024-03-11T00:00:00Z'
        result.mostRecentEditBeforeOrOnBaselineDate.date == '2024-06-12T00:00:00Z'
        result.baseline.entity[entityPath].risk == 'high'
        result.comparison.entity[entityPath].risk == 'medium'
        result.mostRecentEditBeforeOrOnBaselineDate.entity[entityPath].risk == 'high'
    }



    private int auditMessageId = 1;
    private Map buildProjectAuditMessage(String date, Map risks) {
        String projectId = 'p1'
        return [
            id: auditMessageId++,
            projectId: projectId,
            entityType: 'au.org.ala.ecodata.Project',
            entityId: projectId,
            date: date,
            entity: [projectId: projectId, risks: risks]
        ]
    }
}

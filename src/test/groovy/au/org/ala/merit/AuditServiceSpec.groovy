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

        def messages = [
            buildProjectAuditMessage('2024-06-12T00:00:00Z', [risk: 'high']),
            buildProjectAuditMessage('2024-06-10T00:00:00Z', [risk: 'medium']),
            buildProjectAuditMessage('2024-06-05T00:00:00Z', [risk: 'low']),
            buildProjectAuditMessage('2024-05-30T00:00:00Z', [risk: 'none']),
            buildProjectAuditMessage('2024-05-20T00:00:00Z', [risk: 'none'])
        ]

        webService.getJson2(_, _) >> { String url, int timeout ->
            [resp: [data: messages, recordsTotal: messages.size()]]
        }

        when:
        def result = service.compareProjectEntity(projectId, baselineDate, beforeDate, entityPath)

        then:
        result.baseline.date == '2024-06-10T00:00:00Z'
        result.comparison.date == '2024-05-30T00:00:00Z'
        result.mostRecentEditBeforeOrOnBaselineDate.date == '2024-06-10T00:00:00Z'
        result.baseline.entity[entityPath].risk == 'medium'
        result.comparison.entity[entityPath].risk == 'none'
        result.mostRecentEditBeforeOrOnBaselineDate.entity[entityPath].risk == 'medium'
    }

    def "compareProjectEntity returns correct baseline, comparison, and mostRecentEditBeforeOrOnBaselineDate when multiple pages of data is required"() {
        given:
        String projectId = 'p1'
        String entityPath = 'risks'
        String baselineDate = '2024-06-10T00:00:00Z'
        String beforeDate = '2024-02-04T00:00:00Z'

        def page1 = [
                buildProjectAuditMessage('2024-06-12T00:00:00Z', [risk: 'high']),
                buildProjectAuditMessage('2024-06-10T00:00:00Z', [risk: 'medium']),
                buildProjectAuditMessage('2024-06-05T00:00:00Z', [risk: 'low']),
                buildProjectAuditMessage('2024-05-30T00:00:00Z', [risk: 'none']),
                buildProjectAuditMessage('2024-05-20T00:00:00Z', [risk: 'none']),
                buildProjectAuditMessage('2024-04-12T00:00:00Z', [risk: 'high']),
                buildProjectAuditMessage('2024-04-10T00:00:00Z', [risk: 'medium']),
                buildProjectAuditMessage('2024-04-05T00:00:00Z', [risk: 'low']),
                buildProjectAuditMessage('2024-03-30T00:00:00Z', [risk: 'none']),
                buildProjectAuditMessage('2024-03-20T00:00:00Z', [risk: 'none'])
                ]
        def page2 = [
                buildProjectAuditMessage('2024-02-12T00:00:00Z', [risk: 'high']),
                buildProjectAuditMessage('2024-02-10T00:00:00Z', [risk: 'medium']),
                buildProjectAuditMessage('2024-02-05T00:00:00Z', [risk: 'low']),
                buildProjectAuditMessage('2024-01-30T00:00:00Z', [risk: 'none']),
                buildProjectAuditMessage('2024-01-20T00:00:00Z', [risk: 'none'])
                ]


        when:
        def result = service.compareProjectEntity(projectId, baselineDate, beforeDate, entityPath)

        then:
        1 * webService.getJson2({it.contains("start=0")}, _) >> { String url, int timeout ->
            [resp: [data: page1, recordsTotal: page1.size()+page2.size()]]
        }
        1 * webService.getJson2({ it.contains("start=10")}, _) >> { String url, int timeout ->
            [resp: [data: page2, recordsTotal: page1.size()+page2.size()]]
        }
        result.baseline.date == '2024-06-10T00:00:00Z'
        result.comparison.date == '2024-01-30T00:00:00Z'
        result.mostRecentEditBeforeOrOnBaselineDate.date == '2024-06-10T00:00:00Z'
        result.baseline.entity[entityPath].risk == 'medium'
        result.comparison.entity[entityPath].risk == 'none'
        result.mostRecentEditBeforeOrOnBaselineDate.entity[entityPath].risk == 'medium'
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

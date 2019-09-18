package au.org.ala.merit

import au.org.ala.merit.reports.ReportGenerationOptions
import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(ManagementUnitService)
class ManagementUnitServiceSpec extends Specification {

    ReportService reportService = Mock(ReportService)
    WebService webService = Mock(WebService)
    DocumentService documentService = Mock(DocumentService)
    UserService userService = Mock(UserService)
    ProjectService projectService = Mock(ProjectService)

    def setup() {
        service.reportService = reportService
        service.webService = webService
        service.documentService = documentService
        service.userService = userService
        service.projectService = projectService
    }

    def "when a report is submitted, the management unit service should setup and delegate to the report service"() {

        setup:
        String managementUnitId = 'p1'
        String reportId = 'r1'
        Map managementUnit = [managementUnitId:managementUnitId, name:"Program"]
        Map report = [reportId:reportId, activityId:'a1']
        List roles = []

        when:
        service.submitReport(managementUnitId, reportId)

        then:
        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId")}) >> managementUnit
        1 * userService.getMembersOfManagementUnit(managementUnitId) >> [members:roles]
        1 * reportService.get(reportId) >> report
        1 * reportService.submitReport(reportId, [report.activityId], managementUnit, [],  EmailTemplate.RLP_CORE_SERVCIES_REPORT_SUBMITTED_EMAIL_TEMPLATE)
    }

    def "when a report is approved, the Management Unit service should setup and delegate to the report service"() {

        setup:
        String managementUnitId = 'p1'
        String reportId = 'r1'
        Map managementUnit = [managementUnitId:managementUnitId, name:"Management unit"]
        Map report = [reportId:reportId, activityId:'a1']
        List roles = []
        String reason = 'r1'

        when:
        service.approveReport(managementUnitId, reportId, reason)

        then:
        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId")}) >> managementUnit
        1 * userService.getMembersOfManagementUnit(managementUnitId) >> [members:roles]
        1 * reportService.get(reportId) >> report
        1 * reportService.approveReport(reportId, [report.activityId], reason, managementUnit, [],  EmailTemplate.RLP_CORE_SERVICES_REPORT_APPROVED_EMAIL_TEMPLATE)
    }

    def "when a report is returned, the management unit service should setup and delegate to the report service"() {

        setup:
        String managementUnitId = 'p1'
        String reportId = 'r1'
        Map managementUnit = [managementUnitId:managementUnitId, name:"Management unit"]
        Map report = [reportId:reportId, activityId:'a1']
        List roles = []
        String reason = 'r1'

        when:
        service.rejectReport(managementUnitId, reportId, reason, 'unused')

        then:
        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId")}) >> managementUnit
        1 * userService.getMembersOfManagementUnit(managementUnitId) >> [members:roles]
        1 * reportService.get(reportId) >> report
        1 * reportService.rejectReport(reportId, [report.activityId], reason, managementUnit, [],  EmailTemplate.RLP_CORE_SERVICES_REPORT_RETURNED_EMAIL_TEMPLATE)
    }

    def "No reports will be regenerated if no categories are supplied"() {
        String managementUnitId = 'p1'
        Map managementUnit = [managementUnitId: managementUnitId, name:"Program", config:[
                managementUnitReports:[[category:'c1'], [category:'c2'], [category:'c3']],
                projectReports:[[category:'c4'], [category:'c5'], [category:'c6']],
        ], reports:[]]

        when:
        service.regenerateReports(managementUnitId)

        then:
        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId")}) >> managementUnit
        1 * reportService.findReportsForManagementUnit(managementUnitId) >> managementUnit.reports
        0 * reportService.regenerateReports(_, _, {it.id.managementUnitId == managementUnitId})

        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId/projects?view=flat")}) >> [projects:[[projectId:'p1'], [projectId:'p2']]]
        0 * projectService.generateProjectReports(_, _, _)
    }

    def "the report categories to be regenerated can be restricted by passing a list of the categories"() {
        String managementUnitId = 'p1'
        Map managementUnit = [managementUnitId: managementUnitId, name:"Management Unit", config:[
                managementUnitReports:[[category:'c1'], [category:'c2'], [category:'c3']],
                projectReports:[[category:'c4'], [category:'c5'], [category:'c6']],
        ], reports:[]]

        when:
        service.regenerateReports(managementUnitId, ['c2'], ['c5', 'c6'])

        then:
        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId")}) >> managementUnit
        1 * reportService.findReportsForManagementUnit(managementUnitId) >> managementUnit.reports
        1 * reportService.regenerateReports(_, {it.category == 'c2'}, {it.id.managementUnitId == managementUnitId})
        0 * reportService.regenerateReports(_, _, {it.id.managementUnitId == managementUnitId})

        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId/projects?view=flat")}) >> [projects:[[projectId:'p1'], [projectId:'p2']]]

        1 * projectService.generateProjectReports({it.category == 'c5'}, {it.projectId == 'p1'}, new ReportGenerationOptions())
        1 * projectService.generateProjectReports({it.category == 'c6'}, {it.projectId == 'p1'}, new ReportGenerationOptions())
        1 * projectService.generateProjectReports({it.category == 'c5'}, {it.projectId == 'p2'}, new ReportGenerationOptions())
        1 * projectService.generateProjectReports({it.category == 'c6'}, {it.projectId == 'p2'}, new ReportGenerationOptions())

        0 * projectService.generateProjectReports(_, _, _)
    }

    def "categories that have no reports configuration are ignored by the report generation"() {
        String managementUnitId = 'p1'
        Map managementUnit = [managementUnitId: managementUnitId, name:"Program", config:[
                managementUnitReports:[[category:'c1'], [category:'c2'], [category:'c3']],
                projectReports:[[category:'c4'], [category:'c5'], [category:'c6']],
        ], reports:[]]

        when:
        service.regenerateReports(managementUnitId, ['c5'], ['c1', 'c2'])

        then:
        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId")}) >> managementUnit
        1 * reportService.findReportsForManagementUnit(managementUnitId) >> managementUnit.reports
        0 * reportService.regenerateReports(_, _, {it.id.managementUnitId == managementUnitId})

        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId/projects?view=flat")}) >> [projects:[[projectId:'p1'], [projectId:'p2']]]
        0 * projectService.generateProjectReports(_, _, _)
    }

    def "The management unit service delegates to ecodata to retrieve all management unit sites as a FeatureCollection"() {
        when:
        service.managementUnitFeatures()

        then:
        1 * webService.getJson2({it.endsWith(ManagementUnitService.MU_MAP_PATH)}, _)
    }

}

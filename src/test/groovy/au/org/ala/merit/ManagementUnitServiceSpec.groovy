package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import au.org.ala.merit.reports.ReportGenerationOptions
import grails.testing.services.ServiceUnitTest
import org.apache.http.HttpStatus
import spock.lang.Specification

class ManagementUnitServiceSpec extends Specification implements ServiceUnitTest<ManagementUnitService> {

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
        service.grailsApplication = grailsApplication
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
        service.rejectReport(managementUnitId, reportId, reason, ['unused'])

        then:
        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId")}) >> managementUnit
        1 * userService.getMembersOfManagementUnit(managementUnitId) >> [members:roles]
        1 * reportService.get(reportId) >> report
        1 * reportService.rejectReport(reportId, [report.activityId], reason, ['unused'], managementUnit, [],  EmailTemplate.RLP_CORE_SERVICES_REPORT_RETURNED_EMAIL_TEMPLATE)
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
        1 * userService.isUserAdminForManagementUnit(_, managementUnitId) >> true
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
        1 * userService.isUserAdminForManagementUnit(_, managementUnitId) >> true
        1 * reportService.findReportsForManagementUnit(managementUnitId) >> managementUnit.reports
        1 * reportService.regenerateReports(_, {it.category == 'c2'}, {it.id.managementUnitId == managementUnitId})
        0 * reportService.regenerateReports(_, _, {it.id.managementUnitId == managementUnitId})

        1 * webService.getJson({it.endsWith("/managementUnit/$managementUnitId/projects?view=flat")}) >> [projects:[[projectId:'p1'], [projectId:'p2']]]

        1 * projectService.canRegenerateReports([projectId:'p1', reports:[[reportId:'r1']]]) >> true
        1 * reportService.getReportsForProject('p1') >> [[reportId:'r1']]
        1 * projectService.generateProjectStageReports('p1', new ReportGenerationOptions(), ['c5', 'c6'])

        1 * projectService.canRegenerateReports([projectId:'p2', reports:[[reportId:'r2']]]) >> true
        1 * reportService.getReportsForProject('p2') >> [[reportId:'r2']]
        1 * projectService.generateProjectStageReports('p2', new ReportGenerationOptions(), ['c5', 'c6'])
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
        1 * userService.isUserAdminForManagementUnit(_, managementUnitId) >> true
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

    def "Users without admin permissions should only see public documents and no reports"() {
        setup:
        String muId = 'mu1'
        String userId = 'u1'

        when:
        service.get(muId)

        then:
        1 * userService.getCurrentUserId() >> userId
        1 * userService.isUserAdminForManagementUnit(userId, muId) >> false
        1 * userService.userHasReadOnlyAccess() >> false
        1 * webService.getJson({it.endsWith("/managementUnit/${muId}")}) >> [managementUnitId: muId]
        1 * documentService.search([managementUnitId: muId, public: true]) >> [documents:[], count:0]
        0 * reportService.findReportsForManagementUnit(muId)
    }

    def "The server delegates to the ecodata to produce reports"() {
        setup:
        String startDate = '2020-07-01'
        String endDate = '2020-12-31'
        Map extras = [test:'test']

        when:
        service.generateReports(startDate, endDate, extras)

        then:
        1 * webService.getJson({it.endsWith('/managementunit/generateReportsInPeriod?startDate=2020-07-02T00:00:00Z&endDate=2021-01-01T00:00:00Z&test=test')})
    }

    def "Users with the MERIT siteReadOnly role can retrieve management unit reports and documents"() {
        setup:
        String muId = 'mu1'
        String userId = 'u1'

        when:
        service.get(muId)

        then:
        1 * userService.getCurrentUserId() >> userId
        1 * userService.isUserAdminForManagementUnit(userId, muId) >> false
        1 * userService.userHasReadOnlyAccess() >> true
        1 * webService.getJson({it.endsWith("/managementUnit/${muId}")}) >> [managementUnitId: muId]
        1 * documentService.search([managementUnitId: muId]) >> [documents:[], count:0]
        1 * reportService.findReportsForManagementUnit(muId)
    }

    def "The management unit service will assign the MERIT hubId when creating a new Management Unit"() {
        setup:
        SettingService.setHubConfig(new HubSettings(hubId:"merit"))

        when:
        Map result = service.update("", [name:"test", description:"test"])

        then:
        1 * webService.doPost({it.endsWith('managementUnit/')},  [name:"test", description:"test", hubId:"merit"]) >> [statusCode: HttpStatus.SC_OK, resp:[message:'created']]
        result.statusCode == HttpStatus.SC_OK
    }

    def "The name & description are mandatory when creating a management unit"() {
        setup:
        SettingService.setHubConfig(new HubSettings(hubId:"merit"))

        when:
        Map result = service.update("", [description:"test"])

        then:
        0 * webService._
        result.error

        when:
        result = service.update("", [name:"test"])

        then:
        0 * webService._
        result.error
    }

    def "When an id is supplied to an update, it must be for an existing management unit"() {
        setup:
        String muId = "m1"
        SettingService.setHubConfig(new HubSettings(hubId:"merit"))

        when:
        Map result = service.update(muId, [description:"new description"])

        then:
        1 * webService.getJson({it.endsWith("/managementUnit/$muId")}) >> [managementUnitId:"mu1"]
        1 * webService.doPost({it.endsWith("/managementUnit/$muId")}, [description:"new description"]) >> [statusCode: HttpStatus.SC_OK, resp:[message:'updated']]

        !result.error

        when:
        result = service.update(muId, [description:"new description"])

        then:
        1 * webService.getJson({it.endsWith("/managementUnit/$muId")}) >> [error:'an error', statusCode:HttpStatus.SC_NOT_FOUND]
        0 * webService.doPost(_, _)
        result.error
    }
}

package au.org.ala.merit

import au.org.ala.merit.config.EmailTemplate
import au.org.ala.merit.hub.HubSettings
import au.org.ala.merit.reports.ReportGenerationOptions
import grails.testing.spring.AutowiredTest
import spock.lang.Specification

class ProgramServiceSpec extends Specification implements AutowiredTest{

    Closure doWithSpring() {{ ->
        service ProgramService
    }}

    ProgramService service

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

    def "when a report is submitted, the program service should setup and delegate to the report service"() {

        setup:
        String programId = 'p1'
        String reportId = 'r1'
        Map program = [programId:programId, name:"Program"]
        Map report = [reportId:reportId, activityId:'a1']
        List roles = []

        when:
        service.submitReport(programId, reportId)

        then:
        1 * webService.getJson({it.endsWith("/program/$programId")}) >> program
        1 * userService.getMembersOfProgram(programId) >> [members:roles]
        1 * reportService.get(reportId) >> report
        1 * reportService.submitReport(reportId, [report.activityId], program, [],  EmailTemplate.RLP_CORE_SERVCIES_REPORT_SUBMITTED_EMAIL_TEMPLATE)
    }

    def "when a report is approved, the program service should setup and delegate to the report service"() {

        setup:
        String programId = 'p1'
        String reportId = 'r1'
        Map program = [programId:programId, name:"Program"]
        Map report = [reportId:reportId, activityId:'a1']
        List roles = []
        String reason = 'r1'

        when:
        service.approveReport(programId, reportId, reason)

        then:
        1 * webService.getJson({it.endsWith("/program/$programId")}) >> program
        1 * userService.getMembersOfProgram(programId) >> [members:roles]
        1 * reportService.get(reportId) >> report
        1 * reportService.approveReport(reportId, [report.activityId], reason, program, [],  EmailTemplate.RLP_CORE_SERVICES_REPORT_APPROVED_EMAIL_TEMPLATE)
    }

    def "when a report is returned, the program service should setup and delegate to the report service"() {

        setup:
        String programId = 'p1'
        String reportId = 'r1'
        Map program = [programId:programId, name:"Program"]
        Map report = [reportId:reportId, activityId:'a1']
        List roles = []
        String reason = 'r1'

        when:
        service.rejectReport(programId, reportId, reason, ['unused'])

        then:
        1 * webService.getJson({it.endsWith("/program/$programId")}) >> program
        1 * userService.getMembersOfProgram(programId) >> [members:roles]
        1 * reportService.get(reportId) >> report
        1 * reportService.rejectReport(reportId, [report.activityId], reason, ['unused'], program, roles, EmailTemplate.RLP_CORE_SERVICES_REPORT_RETURNED_EMAIL_TEMPLATE)
    }

    def "No reports will be regenerated if no categories are supplied"() {
        String programId = 'p1'
        Map program = [programId: programId, name:"Program", config:[
                programReports:[[category:'c1'], [category:'c2'], [category:'c3']],
                projectReports:[[category:'c4'], [category:'c5'], [category:'c6']],
        ], reports:[]]

        when:
        service.regenerateReports(programId)

        then:
        1 * webService.getJson({it.endsWith("/program/$programId")}) >> program
        1 * reportService.findReportsForProgram(programId) >> program.reports
        0 * reportService.regenerateReports(_, _, {it.id.programId == programId})

        1 * webService.getJson({it.endsWith("/program/$programId/projects?view=flat")}) >> [projects:[[projectId:'p1'], [projectId:'p2']]]
        0 * projectService.generateProjectReports(_, _, _)
    }

    def "the report categories to be regenerated can be restricted by passing a list of the categories"() {
        String programId = 'p1'
        Map program = [programId: programId, name:"Program", config:[
                programReports:[[category:'c1'], [category:'c2'], [category:'c3']],
                projectReports:[[category:'c4'], [category:'c5'], [category:'c6']],
        ], reports:[]]

        when:
        service.regenerateReports(programId, ['c2'], ['c5', 'c6'])

        then:
        1 * webService.getJson({it.endsWith("/program/$programId")}) >> program
        1 * reportService.findReportsForProgram(programId) >> program.reports
        1 * reportService.regenerateAll([], {it.size() == 3}, {it.id.programId == programId}, ['c2'])

        1 * webService.getJson({it.endsWith("/program/$programId/projects?view=flat")}) >> [projects:[[projectId:'p1'], [projectId:'p2']]]

        1 * projectService.canBulkRegenerateReports([projectId:'p1', reports:[[reportId:'r1']]]) >> true
        1 * reportService.getReportsForProject('p1') >> [[reportId:'r1']]
        1 * projectService.generateProjectStageReports('p1', new ReportGenerationOptions(), ['c5', 'c6'])

        1 * projectService.canBulkRegenerateReports([projectId:'p2', reports:[[reportId:'r2']]]) >> true
        1 * reportService.getReportsForProject('p2') >> [[reportId:'r2']]
        1 * projectService.generateProjectStageReports('p2', new ReportGenerationOptions(), ['c5', 'c6'])
    }

    def "categories that have no reports configuration are ignored by the report generation"() {
        String programId = 'p1'
        Map program = [programId: programId, name:"Program", config:[
                programReports:[[category:'c1'], [category:'c2'], [category:'c3']],
                projectReports:[[category:'c4'], [category:'c5'], [category:'c6']],
        ], reports:[]]

        when:
        service.regenerateReports(programId, ['c5'], ['c1', 'c2'])

        then:
        1 * webService.getJson({it.endsWith("/program/$programId")}) >> program
        1 * reportService.findReportsForProgram(programId) >> program.reports
        0 * reportService.regenerateReports(_, _, {it.id.programId == programId})

        1 * webService.getJson({it.endsWith("/program/$programId/projects?view=flat")}) >> [projects:[[projectId:'p1'], [projectId:'p2']]]
        0 * projectService.generateProjectReports(_, _, _)
    }

    def "Programs can be found in the hierarchy"() {
        setup:
        Map p1 = [programId:'p1']
        Map p2 = [programId:'p2', parent:p1]
        Map p3 = [programId:'p3']

        expect:
        service.isInProgramHierarchy(p1, p1.programId) == true
        service.isInProgramHierarchy(p2, p1.programId) == true
        service.isInProgramHierarchy(p3, p1.programId) == false
        service.isInProgramHierarchy(p1, p2.programId) == false
    }

    def "The program service can return primary and secondary outcomes for a program"() {
        setup:
        List outcomes = [[outcome:"Outcome 1", shortDescription:"o1"], [outcome:"Outcome 2", shortDescription:"o2"], [outcome:"Outcome 3", shortDescription:"o3", type:"primary"],  [outcome:"Outcome 4", shortDescription:"o4", type:"secondary"]]
        Map program = [outcomes:outcomes]

        expect:
        service.getPrimaryOutcomes(program) == [[outcome:"Outcome 1", shortDescription:"o1"], [outcome:"Outcome 2", shortDescription:"o2"], [outcome:"Outcome 3", shortDescription:"o3", type:"primary"]]
        service.getSecondaryOutcomes(program) == [[outcome:"Outcome 1", shortDescription:"o1"], [outcome:"Outcome 2", shortDescription:"o2"], [outcome:"Outcome 4", shortDescription:"o4", type:"secondary"]]
    }

    def "A hubId is added to the program when creating a new program"() {
        setup:
        SettingService.setHubConfig(new HubSettings(hubId:"merit"))

        when:
        service.update("", [name:"Program 1", description:"Program description 1"])

        then:
        1 * webService.getJson({it.endsWith("program/findByName?name=Program+1")}) >> [:]
        1 * webService.doPost({it.endsWith('program/')}, [name:"Program 1", description:"Program description 1", hubId:"merit"])
    }

}

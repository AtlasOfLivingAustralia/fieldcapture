package au.org.ala.merit

import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(ProgramController)
class ProgramControllerSpec extends Specification {

    ProgramService programService = Mock(ProgramService)
    ReportService reportService = Mock(ReportService)
    UserService userService = Mock(UserService)

    String adminUserId = 'admin'
    String editorUserId = 'editor'
    String grantManagerUserId = 'grantManager'

    def setup() {
        controller.programService = programService
        controller.reportService = reportService
    }

    def "when viewing a program report, the model will be customized for program reporting"() {
        setup:
        setupProgramAdmin()
        String programId = 'p1'
        String reportId = 'r1'
        Map program = testProgram(programId, true)

        when:
        controller.viewReport(programId, reportId)

        then:
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.VIEW) >> [:]
        view == '/activity/activityReportView'
        model.context == program
        model.contextViewUrl == '/program/index/'+programId
        model.reportHeaderTemplate == '/program/rlpProgramReportHeader'
    }

    def "when editing a program report, the model will be customized for program reporting"() {
        setup:
        setupProgramAdmin()
        String programId = 'p1'
        String reportId = 'r1'
        Map program = testProgram(programId, true)

        when:
        controller.editReport(programId, reportId)
        then:
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT) >> [editable:true]
        view == '/activity/activityReport'
        model.context == program
        model.contextViewUrl == '/program/index/'+programId
        model.reportHeaderTemplate == '/program/rlpProgramReportHeader'
    }

    def "if a report is not editable, the program controller should present the report view instead"() {
        setup:
        setupProgramAdmin()
        String programId = 'p1'
        String reportId = 'r1'
        Map program = testProgram(programId, true)
        program.config.requiresActivityLocking = true

        when:
        reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT) >> [editable:false]
        controller.editReport(programId, reportId)

        then: "the report activity should not be locked"
        0 * reportService.lockForEditing(_)

        and: "the user should be redirected to the report view"
        response.redirectUrl == '/program/viewReport/'+programId+"?reportId="+reportId+"&attemptedEdit=true"
    }

    def "if the program uses pessimistic locking for reports, the report activity should be locked when the report is edited"() {
        setup:
        setupProgramAdmin()
        String programId = 'p1'
        String reportId = 'r1'
        Map program = testProgram(programId, true)

        when:
        program.config.requiresActivityLocking = true
        controller.editReport(programId, reportId)
        then:
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT) >> [report:program.reports[0], editable:true]
        1 * reportService.lockForEditing(program.reports[0])
        view == '/activity/activityReport'
    }



    private Map testProgram(String id, boolean includeReports) {
        Map program = [programId:id, name:'name', config:[:]]
        if (includeReports) {
            program.reports = [[type:'report1', reportId:'r1', activityId:'a1'], [type:'report1', reportId:'r2', activityId:'a2']]
        }
        programService.get(id) >> program
        userService.getMembersOfProgram() >> [
                [userId:adminUserId, role:RoleService.PROJECT_ADMIN_ROLE],
                [userId:editorUserId, role:RoleService.PROJECT_EDITOR_ROLE],
                [userId:grantManagerUserId, role:RoleService.GRANT_MANAGER_ROLE]]
        return program
    }

    private void setupAnonymousUser() {
        userService.getUser() >> null
        userService.userHasReadOnlyAccess() >> false
        userService.userIsSiteAdmin() >> false
        userService.userIsAlaOrFcAdmin() >> false
    }


    private void setupProgramAdmin() {
        def userId = adminUserId
        userService.getUser() >> [userId:userId]
        userService.userHasReadOnlyAccess() >> false
        userService.userIsSiteAdmin() >> false
        userService.userIsAlaOrFcAdmin() >> false
    }

}

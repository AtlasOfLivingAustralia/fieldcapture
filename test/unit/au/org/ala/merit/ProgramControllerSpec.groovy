package au.org.ala.merit

import au.org.ala.merit.command.SaveReportDataCommand
import grails.test.mixin.TestFor
import org.apache.http.HttpStatus
import spock.lang.Specification

@TestFor(ProgramController)
class ProgramControllerSpec extends Specification {

    ProgramService programService = Mock(ProgramService)
    ManagementUnitService managementUnitService = Mock(ManagementUnitService)
    ReportService reportService = Mock(ReportService)
    UserService userService = Mock(UserService)
    ActivityService activityService = Mock(ActivityService)
    RoleService roleService = Mock(RoleService)
    BlogService blogService = Mock(BlogService)


    String adminUserId = 'admin'
    String editorUserId = 'editor'
    String grantManagerUserId = 'grantManager'

    def setup() {
        controller.programService = programService
        controller.reportService = reportService
        controller.roleService = roleService
        controller.activityService = activityService
        controller.userService = userService
        controller.blogService = blogService
        controller.managementUnitService = managementUnitService

        roleService.getRoles() >> []
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
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.VIEW, null) >> [:]
        view == '/activity/activityReportView'
        model.context == program
        model.contextViewUrl == '/program/index/'+programId
        model.reportHeaderTemplate == '/program/rlpProgramReportHeader'
    }

    def "unauthenticated users should only see the program overview"() {
        setup:
        String programId = 'p1'
        userService.getUser() >> null
        programService.get(programId) >> [programId:programId, name:"test"]
        programService.getProgramProjects(programId) >>[projects:[]]
        userService.getMembersOfProgram(programId) >> [members:[]]
        managementUnitService.get(programId) >> []

        when:
        Map model = controller.index(programId)

        then:
        model.content.size() == 4
        model.content.about.visible == true
        model.content.projects.visible == false
        model.content.sites.visible == false
        model.content.admin.visible == false

    }

    def "program admins should see all program content"() {
        String programId = 'p1'
        userService.getUser() >> [userId:'u1']
        programService.get(programId) >> [programId:programId, name:"test"]
        userService.getMembersOfProgram(programId) >> [members:[[userId:'u1', role:'admin']]]
        programService.getProgramProjects(programId) >>[projects:[]]
        managementUnitService.get(programId) >> []

        when:
        Map model = controller.index(programId)

        then:
        1 * userService.canEditProgramBlog("u1", programId) >> true
        1 * userService.canUserViewNonPublicProgramInformation("u1", programId) >> true

        model.content.size() == 4
        model.content.about.visible == true
        model.content.projects.visible == true
        model.content.sites.visible == true
        model.content.admin.visible == true
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
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> [editable:true]
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
        program.inheritedConfig.requiresActivityLocking = true

        when:
        reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> [editable:false]
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
        program.inheritedConfig.requiresActivityLocking = true
        controller.editReport(programId, reportId)
        then:
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> [report:program.reports[0], editable:true]
        1 * reportService.lockForEditing(program.reports[0])
        view == '/activity/activityReport'
    }

    def "report data shouldn't be saved if the project id of the report doesn't match the project id checked by the annotation"() {
        setup:
        Map props = [
                activityId:'a1',
                activity:[
                        test1:'test'
                ],
                reportId:'r1',
                reportService:reportService,
                activityService: activityService

        ]
        reportService.get(props.reportId) >> [programId:'p2']
        SaveReportDataCommand cmd = new SaveReportDataCommand(props)

        when:
        params.id = 'p1'
        controller.saveReport(cmd)

        then:
        response.json.error != null
        response.json.status == HttpStatus.SC_UNAUTHORIZED
    }

    def "program reports can be regenerated by delegating the service"() {
        when:
        request.method = "POST"
        request.JSON = [programReportCategories:["c1"], projectReportCategories:["c5"]]
        controller.regenerateProgramReports("p1")

        then:
        1 * programService.regenerateReports("p1", ["c1"], ["c5"])


        when:
        request.method = "POST"
        request.JSON = [:]
        controller.regenerateProgramReports("p1")

        then:
        1 * programService.regenerateReports("p1", null, null)

    }

    def "The program controller delegates to the reportService to override the lock on a report"() {
        when:
        controller.overrideLockAndEdit('p1', 'r1')

        then:
        1 * reportService.overrideLock('r1', {it.endsWith('program/viewReport/p1?reportId=r1')})
    }

    def "Get a blog of program"() {

        def programId = 'test_program'
        Map program = [programId:programId]
        program["blog"] = [[
                                   "date" : "2019-08-07T14:00:00Z",
                                   "keepOnTop" : false,
                                   "blogEntryId" : "0",
                                   "title" : "This is a test",
                                   "type" : "Program Stories",
                                   "programId" : "test_program",
                                   "content" : "This is a blog test",
                                   "stockIcon" : "fa-newspaper-o"
                           ]]

        programService.get(programId) >> program
        blogService.getBlog(program) >> program["blog"]
        programService.getProgramProjects(programId) >>[projects:[]]
        managementUnitService.get(programId) >> []



        def userId = adminUserId
        Map user = [userId:userId]
        userService.getUser() >> user

        userService.getMembersOfProgram(programId) >> [members:[
                [userId:adminUserId, role:RoleService.PROJECT_ADMIN_ROLE],
                [userId:editorUserId, role:RoleService.PROJECT_EDITOR_ROLE],
                [userId:grantManagerUserId, role:RoleService.GRANT_MANAGER_ROLE]
        ]]


        when: "Get a program model"

        Map model = controller.index(programId)

        then: "Should be true"

        model.program.blog[0].programId == "test_program"

    }

    def "Testing Add New Sub Program Passing programId"() {
        setup:
        setupProgramAdmin()
        def id = "test_program"
        Map program = createPrograms(id)
        Map expected = [program: [programId:program.programId, parentProgram:program.name, parentProgramId:program.programId]]

        when:
        Map actual = controller.addSubProgram(id)

        then:
        1 * programService.get(id) >> program

        expect:
        expected == actual
    }

    private Map testProgram(String id, boolean includeReports) {
        Map program = [programId:id, name:'name', config:[:], inheritedConfig:[:]]
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

    private static Map createPrograms(String id){
        return [id:id, programId: id, name: "Testing Program Name", description: "Testing Program Description"]
    }
}

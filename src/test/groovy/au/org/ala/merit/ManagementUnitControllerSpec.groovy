package au.org.ala.merit

import au.org.ala.merit.command.SaveReportDataCommand
import org.apache.http.HttpStatus
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

class ManagementUnitControllerSpec extends Specification implements ControllerUnitTest<ManagementUnitController>{

    ManagementUnitService managementUnitService = Mock(ManagementUnitService)
    ReportService reportService = Mock(ReportService)
    UserService userService = Mock(UserService)
    ActivityService activityService = Mock(ActivityService)
    RoleService roleService = Mock(RoleService)
    ProgramService programService = Mock(ProgramService)
    ProjectService projectService = Mock(ProjectService)

    String adminUserId = 'admin'
    String editorUserId = 'editor'
    String grantManagerUserId = 'grantManager'

    def setup() {
        controller.managementUnitService = managementUnitService
        controller.reportService = reportService
        controller.roleService = roleService
        controller.activityService = activityService
        controller.userService = userService
        controller.managementUnitService = managementUnitService
        controller.programService = programService
        controller.projectService = projectService

        roleService.getRoles() >> []
    }

    def "when viewing a management unit report, the model will be customized for management unit reporting"() {
        setup:
        setupManagementUnitAdmin()
        String managementUnitId = 'p1'
        String reportId = 'r1'
        Map managementUnit = testManagementUnit(managementUnitId, true)

        when:
        controller.viewReport(managementUnitId, reportId)

        then:
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.VIEW, null) >> [:]
        view == '/activity/activityReportView'
        model.context == managementUnit
        model.contextViewUrl == '/managementUnit/index/'+managementUnitId
        model.reportHeaderTemplate == '/managementUnit/managementUnitReportHeader'
    }

    def "unauthenticated users should only see the management unit overview"() {
        setup:
        String managementUnitId = 'p1'
        userService.getUser() >> null
        managementUnitService.get(managementUnitId) >> [managementUnitId:managementUnitId, name:"test"]
        managementUnitService.getProjects(managementUnitId) >>[projects:[]]
        userService.getMembersOfManagementUnit(managementUnitId) >> [members:[]]
        managementUnitService.get(managementUnitId) >> []

        when:
        Map model = controller.index(managementUnitId)

        then:
        model.content.size() == 4
        model.content.about.visible == true
        model.content.projects.visible == false
        model.content.sites.visible == false
        model.content.admin.visible == false

    }

    def "management unit admins should see all content"() {
        String managementUnitId = 'p1'
        userService.getUser() >> [userId:'u1']
        managementUnitService.get(managementUnitId) >> [managementUnitId:managementUnitId, name:"test"]
        userService.getMembersOfManagementUnit(managementUnitId) >> [members:[[userId:'u1', role:'admin']]]
        managementUnitService.getProjects(managementUnitId) >>[projects:[]]

        when:
        Map model = controller.index(managementUnitId)

        then:
        1 * userService.canUserEditManagementUnit("u1", managementUnitId) >> true
        1 * userService.isManagementUnitStarredByUser(_, _) >> [isManagementUnitStarredByUser:true]

        model.content.size() == 4
        model.content.about.visible == true
        model.content.projects.visible == true
        model.content.sites.visible == true
        model.content.admin.visible == true
    }

    def "read only users should be able to see the permission access in the admin content"() {
        String managementUnitId = 'p1'
        userService.getUser() >> [userId: 'u1']
        managementUnitService.get(managementUnitId) >> [managementUnitId: managementUnitId, name: "test"]
        userService.getMembersOfManagementUnit(managementUnitId) >> [members:[]]
        managementUnitService.getProjects(managementUnitId) >>[projects:[]]

        when:
        Map model = controller.index(managementUnitId)

        then:
        1 * userService.canUserEditManagementUnit("u1", managementUnitId) >> false
        2 * userService.userHasReadOnlyAccess() >> true

        model.content.size() == 4
        model.content.about.visible == true
        model.content.projects.visible == true
        model.content.sites.visible == true
        model.content.admin.visible == true
    }

    def "programs should be sorted in reverse alphabetical order so the RLP appears first"() {

        setup:
        String managementUnitId = 'p1'
        userService.getUser() >> null
        managementUnitService.get(managementUnitId) >> [managementUnitId:managementUnitId, name:"test"]
        userService.getMembersOfManagementUnit(managementUnitId) >> [members:[[userId:'u1', role:'admin']]]

        when: "There are no projects running in the management unit"
        params.id = managementUnitId
        Map model = controller.index()

        then:
        model.managementUnit.programs == null
        1 * managementUnitService.getProjects(managementUnitId) >> [projects:[]]
        0 * programService.get(_)

        when:
        model = controller.index()

        then:
        1 * managementUnitService.getProjects(managementUnitId) >> [projects:[[programId:'p1'], [programId:'p2'], [programId:'p3']]]
        1 * programService.get(['p1', 'p2', 'p3'] as String[]) >> [[name:'Program 1', programId:'p1'], [name:'Program 2', programId:'p2'], [name:'Program 3', programId:'p3']]
        1 * managementUnitService.serviceScores(managementUnitId, _, true) >> [:]
        model.managementUnit.programs.collect{it.name} == ['Program 3', 'Program 2', 'Program 1']
    }

    def "when editing a management unit report, the model will be customized for management unit reporting"() {
        setup:
        setupManagementUnitAdmin()
        String managementUnitId = 'p1'
        String reportId = 'r1'
        Map program = testManagementUnit(managementUnitId, true)

        when:
        controller.editReport(managementUnitId, reportId)
        then:
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> [editable:true]
        view == '/activity/activityReport'
        model.context == program
        model.contextViewUrl == '/managementUnit/index/'+managementUnitId
        model.reportHeaderTemplate == '/managementUnit/managementUnitReportHeader'
    }

    def "if a report is not editable, the management unit controller should present the report view instead"() {
        setup:
        setupManagementUnitAdmin()
        String managementUnitId = 'p1'
        String reportId = 'r1'
        Map managementUnit = testManagementUnit(managementUnitId, true)
        managementUnit.config.requiresActivityLocking = true

        when:
        reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> [editable:false]
        controller.editReport(managementUnitId, reportId)

        then: "the report activity should not be locked"
        0 * reportService.lockForEditing(_)

        and: "the user should be redirected to the report view"
        response.redirectUrl == '/managementUnit/viewReport/'+managementUnitId+"?reportId="+reportId+"&attemptedEdit=true"
    }

    def "if the management unit uses pessimistic locking for reports, the report activity should be locked when the report is edited"() {
        setup:
        setupManagementUnitAdmin()
        String managementUnitId = 'p1'
        String reportId = 'r1'
        Map managementUnit = testManagementUnit(managementUnitId, true)

        when:
        managementUnit.config.requiresActivityLocking = true
        controller.editReport(managementUnitId, reportId)
        then:
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> [report:managementUnit.reports[0], editable:true]
        1 * reportService.lockForEditing(managementUnit.reports[0])
        view == '/activity/activityReport'
    }

    def "report data shouldn't be saved if the managementUnitId of the report doesn't match the managementUnitId checked by the annotation"() {
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
        reportService.get(props.reportId) >> [managementUnitId:'mu2']
        SaveReportDataCommand cmd = new SaveReportDataCommand(props)

        when:
        request.method = "POST"
        params.id = 'mu1'
        controller.saveReport(cmd)

        then:
        response.json.error != null
        response.json.status == HttpStatus.SC_UNAUTHORIZED
    }

    def "management unit reports can be regenerated by delegating the service with categories"() {
        when:
        request.method = "POST"
        request.JSON = [managementUnitReportCategories:["c1"], projectReportCategories:["c5"]]
        controller.regenerateManagementUnitReports("mu1")

        then:
        1 * managementUnitService.regenerateReports("mu1", ["c1"], ["c5"])

    }

    def "management unit reports can be regenerated by delegating the service without cateogories"() {
        when:
        request.method = "POST"
        request.JSON = [:]
        controller.regenerateManagementUnitReports("mu1")

        then:
        1 * managementUnitService.regenerateReports("mu1", null, null)

    }

    def "The management unit controller delegates to the reportService to override the lock on a report"() {
        when:
        controller.overrideLockAndEdit('p1', 'r1')

        then:
        1 * reportService.overrideLock('r1', {it.endsWith('managementUnit/viewReport/p1?reportId=r1')})
    }

    def "The controller delegates report submission to the management unit service"() {
        setup:
        String muId = 'mu1'
        String reportId = 'r1'
        Map result = [status:200]

        when:
        request.method = "POST"
        params.id = muId
        request.json = [reportId:reportId]
        controller.ajaxSubmitReport()

        then:
        1 * managementUnitService.submitReport(muId, reportId) >> result

        and:
        result.status == 200
    }

    def "The controller delegates report approvals to the management unit service"() {
        setup:
        String muId = 'mu1'
        String reportId = 'r1'
        Map result = [status:200]

        when:
        request.method = "POST"
        params.id = muId
        request.json = [reportId:reportId, reason:"test"]
        controller.ajaxApproveReport()

        then:
        1 * managementUnitService.approveReport(muId, reportId, "test") >> result

        and:
        result.status == 200
    }

    def "The controller delegates report returns to the management unit service"() {
        setup:
        String muId = 'mu1'
        String reportId = 'r1'
        Map result = [status:200]

        when:
        request.method = "POST"
        params.id = muId
        request.json = [reportId:reportId, reason:"test", category:"c1"]
        controller.ajaxRejectReport()

        then:
        1 * managementUnitService.rejectReport(muId, reportId, "test", "c1") >> result

        and:
        result.status == 200
    }

    def "the controller delegates to the managementUnitService to retrieve management unit features"() {
        when:
        controller.managementUnitFeatures()

        then:
        1 * managementUnitService.managementUnitFeatures() >> [type:'FeatureCollection', features:[]]

        and:
        response.json.type == 'FeatureCollection'
        response.json.features == []
    }

    def "The management unit can specify the program groupings for producing the aggregate displays of outcomes, projects and dashboards"() {
        setup:
        Map p1 = [programId:'p1']
        Map p2 = [programId:'p2', parent:p1]
        Map p3 = [programId:'p3']
        Map p4 = [programId:'p4'] // This program will be uncategorized as it doesn't fall into the p1 or p3 hierarchy

        List projects = [[projectId:'p1', programId:'p1'], [projectId:'p2', programId:'p2'], [projectId:'p3', programId:'p3'], [projectId:'p4', programId:'p4']]


        when: "We group the programs by the configured groupings"
        Map<String, List> groupedPrograms = controller.groupPrograms([p1, p2, p3, p4], [p1.programId, p3.programId])

        then:
        1 * programService.isInProgramHierarchy(p1, 'p1') >> true
        1 * programService.isInProgramHierarchy(p2, 'p1') >> true
        1 * programService.isInProgramHierarchy(p3, 'p1') >> false
        1 * programService.isInProgramHierarchy(p3, 'p3') >> true
        1 * programService.isInProgramHierarchy(p4, 'p1') >> false
        1 * programService.isInProgramHierarchy(p4, 'p3') >> false

        and:
        groupedPrograms == ['p1':[p1, p2], 'p3':[p3], 'p4':[p4]]

        when: "We group the projects by the configured groupings"
        Map<String, List> groupedProjects = controller.groupProjects(projects, groupedPrograms)

        then:
        groupedProjects == ['p1':[projects[0], projects[1]], 'p3':[projects[2]], 'p4':[projects[3]]]

    }

    def "The management unit controller supports the display of program outcomes that are targeted by projects in that management unit"() {
        setup:
        String managementUnitId = 'mu1'
        userService.getUser() >> [userId:'u1']
        managementUnitService.get(managementUnitId) >> [managementUnitId:managementUnitId, name:"test"]
        userService.getMembersOfManagementUnit(managementUnitId) >> [members:[[userId:'u1', role:'admin']]]
        managementUnitService.getProjects(managementUnitId) >> [projects:[[projectId:'p1', programId:"program1"]]]
        managementUnitService.serviceScores(managementUnitId, _, _) >> [:]
        projectService.getPrimaryOutcome(_) >> "Outcome 1"
        projectService.getSecondaryOutcomes(_) >> ["Outcome 2", "Outcome 4"]
        Map program = [programId:'program1']
        programService.get(["program1"]) >> [program]

        when:
        Map model = controller.index(managementUnitId)

        then:
        1 * programService.getPrimaryOutcomes(program) >> [[outcome:"Outcome 1", shortDescription:"o1"], [outcome:"Outcome 2", shortDescription:"o2"], [outcome:"Outcome 3", shortDescription:"o3", type:"primary"]]
        1 * programService.getSecondaryOutcomes(program) >> [[outcome:"Outcome 1", shortDescription:"o1"], [outcome:"Outcome 2", shortDescription:"o2"], [outcome:"Outcome 4", shortDescription:"o4", type:"secondary"]]
        1 * userService.canUserEditManagementUnit("u1", managementUnitId) >> true

        model.content.about.displayedPrograms.size() == 1
        model.content.about.displayedPrograms[0].primaryOutcomes == [[outcome:"Outcome 1", shortDescription:"o1", targeted:true], [outcome:"Outcome 2", shortDescription:"o2"], [outcome:"Outcome 3", shortDescription:"o3"]]
        model.content.about.displayedPrograms[0].secondaryOutcomes == [[outcome:"Outcome 1", shortDescription:"o1"], [outcome:"Outcome 2", shortDescription:"o2", targeted:true], [outcome:"Outcome 4", shortDescription:"o4", targeted:true]]

    }

    private Map testManagementUnit(String id, boolean includeReports) {
        Map program = [managementUnitId:id, name:'name', config:[:], config:[:]]
        if (includeReports) {
            program.reports = [[type:'report1', reportId:'r1', activityId:'a1'], [type:'report1', reportId:'r2', activityId:'a2']]
        }
        managementUnitService.get(id) >> program
        userService.getMembersOfManagementUnit() >> [
                [userId:adminUserId, role:RoleService.PROJECT_ADMIN_ROLE],
                [userId:editorUserId, role:RoleService.PROJECT_EDITOR_ROLE],
                [userId:grantManagerUserId, role:RoleService.GRANT_MANAGER_ROLE]]
        return program
    }

    def "The controller delegates to the managementUnitService to produce reports"() {
        setup:
        String fromDate = '01-07-2020'
        String toDate = '31-12-2020'

        when:
        params.fromDate = fromDate
        params.toDate = toDate
        controller.generateReportsInPeriod()

        then:
        1 * userService.getUser() >> [userName:'test@test.com']
        1 * managementUnitService.generateReports(fromDate, toDate, _) >> [status:HttpStatus.SC_OK]
        response.json == [status:HttpStatus.SC_OK]
    }

    def "User adds star to the management unit "() {
        setup:
        String managementUnitId = 'p1'
        String userId = 'u1'
        String act = 'add'
        Map result = [status:200]

        when:
        request.method = "POST"
        params.id = act
        params.managementUnitId = managementUnitId
        controller.starManagementUnit()

        then:
        1 * userService.getCurrentUserId() >> "u1"
        1 * userService.addStarManagementUnitForUser(userId, managementUnitId) >> result
        0 * userService.removeStarManagementUnitForUser(userId, managementUnitId) >> result

        and:
        response.json == [status:HttpStatus.SC_OK]
    }

    def "User removes star from the management unit "() {
        setup:
        String managementUnitId = 'p1'
        String userId = 'u1'
        String act = 'remove'
        Map result = [status:200]

        when:
        request.method = "POST"
        params.id = act
        params.managementUnitId = managementUnitId
        controller.starManagementUnit()

        then:
        1 * userService.getCurrentUserId() >> "u1"
        0 * userService.addStarManagementUnitForUser(userId, managementUnitId) >> result
        1 * userService.removeStarManagementUnitForUser(userId, managementUnitId) >> result

        and:
        response.json == [status:HttpStatus.SC_OK]
    }

    def "the controller can pre-pop the value for some fields in RLP core services annual reporting"() {
        setup:
        Map stubModel = [data:[serviceSubcontracted2020_21:250000,
                               investment2020_21:570855,
                               organisationWorkForceByFinancialYear:
                                       [
                                               [organisationWorkforce2020_21:1, organisationWorkforceType:"Indigenous FTE deployed within the Service Provider's organisation engaged in delivering the Services"],
                                               [organisationWorkforce2020_21:5, organisationWorkforceType:"TOTAL FTE Australian-based-workforce within the Service Provider's organisation engaged in delivering the Services"]
                                       ],
                               subcontractedWorkForceByFinancialYear:
                                       [
                                               [contractWorkforce2020_21:2, contractWorkforceType:"Indigenous FTE deployed on subcontracts to deliver the Services"],
                                               [contractWorkforce2020_21:6, contractWorkforceType:"TOTAL FTE deployed on subcontracts to deliver the Services"]
                                       ]
                              ]

                        ]

        when:
        params.managementUnitId = 'mu01'
        params.startDate = "2020-07-01T13:00:00Z"
        params.endDate = '2021-07-01T13:00:00Z'
        controller.previousReportContents('mu01')

        then:
        1 * reportService.getPreviousReportModel(params) >> stubModel
        println response.json
        response.json.managementUnitId == 'mu01'
        response.json.model.data.serviceSubcontracted2020_21 == 250000
        response.json.model.data.investment2020_21 == 570855
        response.json.model.data.organisationWorkForceByFinancialYear.size() == 2
        response.json.model.data.organisationWorkForceByFinancialYear[0].organisationWorkforce2020_21 == 1
        response.json.model.data.organisationWorkForceByFinancialYear[1].organisationWorkforce2020_21 == 5
        response.json.model.data.subcontractedWorkForceByFinancialYear.size() == 2
        response.json.model.data.subcontractedWorkForceByFinancialYear[0].contractWorkforce2020_21 == 2
        response.json.model.data.subcontractedWorkForceByFinancialYear[1].contractWorkforce2020_21 == 6

    }

    private void setupAnonymousUser() {
        userService.getUser() >> null
        userService.userHasReadOnlyAccess() >> false
        userService.userIsSiteAdmin() >> false
        userService.userIsAlaOrFcAdmin() >> false
    }


    private void setupManagementUnitAdmin() {
        def userId = adminUserId
        userService.getUser() >> [userId:userId]
        userService.userHasReadOnlyAccess() >> false
        userService.userIsSiteAdmin() >> false
        userService.userIsAlaOrFcAdmin() >> false
    }

}

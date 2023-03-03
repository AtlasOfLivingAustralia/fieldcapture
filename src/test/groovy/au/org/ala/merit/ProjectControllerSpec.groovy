package au.org.ala.merit

import au.org.ala.merit.command.MeriPlanReportCommand
import au.org.ala.merit.command.SaveReportDataCommand
import au.org.ala.merit.config.ProgramConfig
import org.apache.http.HttpStatus
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

/**
 * Specification for the ProjectController
 */
class ProjectControllerSpec extends Specification implements ControllerUnitTest<ProjectController>{

    def userServiceStub = Mock(UserService)
    def metadataServiceStub = Stub(MetadataService)
    def projectService = Mock(ProjectService)
    def siteServiceStub = Stub(SiteService)
    def roleServiceStub = Stub(RoleService)
    def activityServiceStub = Stub(ActivityService)
    def commonServiceStub = Stub(CommonService)
    def reportServiceStub = Stub(ReportService)
    def blogService = Stub(BlogService)
    def reportService = Mock(ReportService)
    def activityService = Mock(ActivityService)
    def siteService = Mock(SiteService)

    WebService webService = Mock(WebService)

    ProjectService realProjectService


    void setup() {
        realProjectService = new ProjectService()
        realProjectService.metadataService = metadataServiceStub

        controller.userService = userServiceStub
        controller.metadataService = metadataServiceStub
        controller.projectService = projectService
        controller.siteService = siteServiceStub
        controller.roleService = roleServiceStub
        controller.activityService = activityServiceStub
        controller.commonService = commonServiceStub
        controller.reportService = reportServiceStub
        controller.blogService = blogService
        controller.reportService = reportService
        controller.siteService = siteService
        controller.activityService = activityService
        controller.grailsApplication = grailsApplication
        controller.webService = webService

        projectService.getMembersForProjectId(_) >> []
        projectService.getProgramConfiguration(_) >> new ProgramConfig([requiresActivityLocking: true])
        projectService.getProjectServices(_) >> { project -> realProjectService.getProjectServices(project)}
        metadataServiceStub.organisationList() >> [list:[]]
        userServiceStub.isProjectStarredByUser(_, _) >> [isProjectStarredByUser:true]
        roleServiceStub.getRoles() >> []
        reportServiceStub.getReportsForProject(_) >> []
        activityServiceStub.activitiesForProject(_) >> []
        projectService.grailsApplication = grailsApplication
        realProjectService.grailsApplication = grailsApplication
    }


    def "the program can exclude optional project content"() {

        setup:
        def projectId = '1234'
        projectService.get(projectId, _, _) >> project(projectId)

        when: "we view a project homepage of a project run under a program configured to exclude the MERI Plan and Risks and Threats"
        controller.index(projectId)

        then:
        1 * projectService.getProgramConfiguration(_) >> new ProgramConfig([name:'Test', excludes:['MERI_PLAN', 'RISKS_AND_THREATS']])

        and: "The MERI plan and risks and threats content is not visible"
        view == '/project/index'
        model.projectContent.details.visible == false
        model.projectContent.plan.risksAndThreatsVisible == false
    }

    def "most content is disabled if the user is not logged in"() {

        setup:
        def projectId = '1234'
        projectService.get(projectId, null, _) >> project(projectId)
        projectService.programsModel() >> new ProgramConfig([programs:[[name:'Test']]])
        userServiceStub.getUser() >> null

        when: "retrieving the project index page"
        controller.index(projectId)

        then: "Only the overview and documents tabs are enabled"
        view == '/project/index'
        !model.projectContent.overview.disabled
        !model.projectContent.documents.disabled
        model.projectContent.plan.disabled == true
        model.projectContent.details.disabled == true
        model.projectContent.site.disabled == true
        model.projectContent.dashboard.disabled == true

        and: "the data set summary and admin tabs are not visible"
        model.projectContent.admin.visible == false
        model.projectContent.datasets.visible == false
    }

    def "the admin content should be enabled for project admins"() {
        def projectId = '1234'
        projectService.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]

        Map userDetails = stubProjectAdmin('1234', projectId)

        when: "retrieving the project index page"
        controller.index(projectId)

        then:
        1 * projectService.get(projectId, userDetails, _) >> project(projectId)

        and: "The admin tab is visible"
        view == '/project/index'
        model.projectContent.admin.visible
        !model.projectContent.admin.disabled
    }

    def "the admin content should be enabled for grant managers"() {
        def projectId = '1234'
        projectService.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]

        Map userDetails = stubGrantManager('1234', projectId)

        when: "retrieving the project index page"
        controller.index(projectId)

        then:
        1 * projectService.get(projectId, userDetails, _) >> project(projectId)

        and: "The admin tab is visible"
        view == '/project/index'
        model.projectContent.admin.visible
        !model.projectContent.admin.disabled
    }

    def "meri plan should be visible to read only users"() {
        setup:
        def projectId = '1234'
        projectService.get(projectId, null, _) >> project(projectId)
        projectService.programsModel() >> new ProgramConfig([programs:[[name:'Test']]])
        Map userDetails = stubReadOnly('1234', projectId)

        when: "retrieving the project index page"
        controller.index(projectId)

        then:
        1 * projectService.get(projectId, userDetails, _) >> project(projectId)

        and: "meri plan is visible"
        model.projectContent.details.meriPlanVisibleToUser == true
    }

    def "the admin content should be present for project editors (to edit blog)"() {
        def projectId = '1234'
        projectService.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]
        Map userDetails = stubProjectEditor('1234', projectId)


        when: "retrieving the project index page"
        controller.index(projectId)

        then:
        1 * projectService.get(projectId, userDetails, _) >> project(projectId)

        and: "The admin tab is visible"
        view == '/project/index'
        model.projectContent.admin.visible
    }

    def "the announcements menu shouldn't be shown in RLP projects"() {
        def projectId = '1234'
        Map project = project(projectId)
        project.planStatus = ProjectService.PLAN_APPROVED // The announcements menu items shows only for approved projects
        projectService.getProgramConfiguration(_) >> new ProgramConfig([projectTemplate: ProjectController.RLP_TEMPLATE])
        Map userDetails = stubProjectAdmin('1234', projectId)


        when: "retrieving the project index page"
        controller.index(projectId)

        then:
        1 * projectService.get(projectId, userDetails, _) >> project

        and: "The admin tab does not include the announcements menu item"
        view == '/project/index'
        model.projectContent.admin.showAnnouncementsTab == false
    }

    def "Only grant managers can request to view a template in the non-configured project view"() {
        setup:
        String projectId = '1234'
        userServiceStub.userIsSiteAdmin() >> false
        Map project = project(projectId)

        Map userDetails = stubProjectAdmin('1234', projectId)
        String projectTemplate = 'esp'

        when:
        params.template='index'
        controller.index(projectId)

        then:
        1 *  projectService.get(projectId, userDetails, _) >> project
        1 * projectService.getProgramConfiguration(project) >> new ProgramConfig([projectTemplate: projectTemplate])
        view == "/project/espOverview"
        !model.showAlternateTemplate
    }

    def "if a template is requested that is different to the project default, provide navigation back to the default template view"() {
        setup:
        String projectId = '1234'
        userServiceStub.userIsSiteAdmin() >> true
        Map project = project(projectId)

        Map userDetails = stubGrantManager('1234', projectId)
        String projectTemplate = 'esp'

        when:
        params.template='index'
        controller.index(projectId)

        then:
        1 *  projectService.get(projectId, userDetails, _) >> project
        1 * projectService.getProgramConfiguration(project) >> new ProgramConfig([projectTemplate: projectTemplate])
        model.showAlternateTemplate == true
    }

    def "projects not using the default template shouldn't display navigation back to the default template"() {
        setup:
        String projectId = '1234'
        Map project = project(projectId)

        Map userDetails = stubGrantManager('1234', projectId)
        String projectTemplate = 'rlp'

        when:
        params.template=null
        controller.index(projectId)

        then:
        1 * projectService.get(projectId, userDetails, _) >> project
        1 * projectService.getProgramConfiguration(project) >> new ProgramConfig([projectTemplate: projectTemplate])
        model.showAlternateTemplate == false
    }

    def "when viewing a project report, the model will be customized for project reporting"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'
        stubProjectAdmin('1234', projectId)
        Map project = this.project(projectId, true)
        projectService.get(projectId) >> project
        Map activityReportModel = [editable:true, metaModel:[:], outputModels:[:], activity:[activityId:'a1'], report:[:]]


        when:
        controller.viewReport(projectId, reportId)

        then:
        1 * projectService.doesReportBelongToProject(projectId, reportId) >> true
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.VIEW, null) >> activityReportModel
        1 * projectService.filterOutputModel(activityReportModel.metaModel, project, activityReportModel.activity) >> activityReportModel.metaModel
        1 * projectService.getProgramConfiguration(project) >> new ProgramConfig([requiresActivityLocking: true])

        view == '/activity/activityReportView'
        model.context == project
        model.contextViewUrl == '/project/index/'+projectId
        model.reportHeaderTemplate == '/project/rlpProjectReportHeader'
    }

    def "when editing a project report, the model will be customized for project reporting"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'
        stubProjectAdmin('1234', projectId)
        Map project = this.project(projectId, true)
        projectService.get(projectId) >> project
        Map activityReportModel = [editable:true, metaModel:[:], outputModels:[:], activity:[activityId:'a1'], report:[activityId:'a1', reportId:reportId]]


        when:
        controller.editReport(projectId, reportId)
        then:
        1 * projectService.doesReportBelongToProject(projectId, reportId) >> true
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> activityReportModel
        1 * projectService.filterOutputModel(activityReportModel.metaModel, project, activityReportModel.activity) >> activityReportModel.metaModel
        1 * projectService.getProgramConfiguration(project) >> new ProgramConfig([requiresActivityLocking: true])

        view == '/activity/activityReport'
        model.context == project
        model.contextViewUrl == '/project/index/'+projectId
        model.reportHeaderTemplate == '/project/rlpProjectReportHeader'
        model.saveReportUrl == '/project/saveReport/'+projectId+'?reportId='+reportId
    }

    def "if a report is not editable, the program project should present the report view instead"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'
        stubProjectAdmin('1234', projectId)
        Map project = this.project(projectId, true)
        projectService.get(projectId) >> project
        Map activityReportModel = [editable:false, metaModel:[:], outputModels:[:], activity:[activityId:'a1'], report:[:]]


        when:
        reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> activityReportModel
        controller.editReport(projectId, reportId)

        then: "the report activity should not be locked"
        1 * projectService.doesReportBelongToProject(projectId, reportId) >> true
        // Override the default behaviour from setup
        1 * projectService.getProgramConfiguration(project) >> new ProgramConfig([requiresActivityLocking: true])
        0 * reportService.lockForEditing(_)
        1 * projectService.filterOutputModel(activityReportModel.metaModel, project, activityReportModel.activity) >> activityReportModel.metaModel

        and: "the user should be redirected to the report view"
        response.redirectUrl == '/project/viewReport/'+projectId+"?reportId="+reportId+"&attemptedEdit=true"
    }

    def "if the project uses pessimistic locking for reports, the report activity should be locked when the report is edited"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'
        stubProjectAdmin('1234', projectId)
        Map project = this.project(projectId, true)
        projectService.get(projectId) >> project
        Map activityReportModel = [editable:true, metaModel:[:], outputModels:[:], activity:[activityId:'a1'], report:project.reports[0]]


        when:
        reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> activityReportModel
        projectService.getProgramConfiguration(project) >> new ProgramConfig([requiresActivityLocking: true])
        controller.editReport(projectId, reportId)

        then:
        1 * projectService.doesReportBelongToProject(projectId, reportId) >> true
        1 * reportService.lockForEditing(project.reports[0])
        1 * projectService.filterOutputModel(activityReportModel.metaModel, project, activityReportModel.activity) >> activityReportModel.metaModel

        view == '/activity/activityReport'
    }

    def "if the project uses pessimistic locking for reports, if the user already holds the lock, the lock should not be re-obtained"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'
        stubProjectAdmin('1234', projectId)
        Map project = this.project(projectId, true)
        projectService.get(projectId) >> project
        Map activityReportModel = [editable:true, metaModel:[:], outputModels:[:], activity:[activityId:'a1', lock:'1234'], report:project.reports[0]]


        when:
        reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> activityReportModel
        projectService.getProgramConfiguration(project) >> new ProgramConfig([requiresActivityLocking: true])
        controller.editReport(projectId, reportId)

        then:
        1 * projectService.doesReportBelongToProject(projectId, reportId) >> true
        0 * reportService.lockForEditing(project.reports[0])
        1 * projectService.filterOutputModel(activityReportModel.metaModel, project, activityReportModel.activity) >> activityReportModel.metaModel

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
        reportService.get(props.reportId) >> [projectId:'p2']
        SaveReportDataCommand cmd = new SaveReportDataCommand(props)

        when:
        params.projectId = 'p1'
        controller.saveReport(cmd)

        then:
        response.json.error != null
        response.json.status == HttpStatus.SC_UNAUTHORIZED
    }

    def "Users cannot request to view a report not owned by the project they have access to"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'

        when:
        controller.viewReport(projectId, reportId)

        then:
        1 * projectService.doesReportBelongToProject(projectId, reportId) >> false
        0 * _._

        and:
        response.redirectUrl == '/project/index/'+projectId
    }

    def "Users cannot request to edit a report not owned by the project they have access to"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'

        when:
        controller.editReport(projectId, reportId)

        then:
        1 * projectService.doesReportBelongToProject(projectId, reportId) >> false
        0 * _._

        and:
        response.redirectUrl == '/project/index/'+projectId
    }


    def "Users cannot request to print a report not owned by the project they have access to"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'

        when:
        controller.printableReport(projectId, reportId)

        then:
        1 * projectService.doesReportBelongToProject(projectId, reportId) >> false
        0 * _._

        and:
        response.redirectUrl == '/project/index/'+projectId

    }

    def "Users cannot request a PDF of a report not owned by the project they have access to"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'

        when:
        controller.reportPDF(projectId, reportId)

        then:
        1 * projectService.doesReportBelongToProject(projectId, reportId) >> false
        0 * _._

        and:
        response.redirectUrl == '/project/index/'+projectId

    }

    def "Users cannot request to reset a report not owned by the project they have access to"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'

        when:
        controller.resetReport(projectId, reportId)

        then:
        1 * projectService.doesReportBelongToProject(projectId, reportId) >> false
        0 * _._

        and:
        response.redirectUrl == '/project/index/'+projectId

    }

    def "Users cannot request targets and score data for an activity not owned by the project they have access to"() {
        setup:
        String projectId = 'p1'
        String activityId = 'a1'

        when:
        controller.targetsAndScoresForActivity(projectId, activityId)

        then:
        1 * projectService.doesActivityBelongToProject(projectId, activityId) >> false
        0 * _._

        and:
        response.redirectUrl == '/project/index/'+projectId
    }

    def "Users can request targets and score data for a project / activity combination"() {
        setup:
        String projectId = 'p1'
        String activityId = 'a1'
        Map targetsAndScoresData = [:]

        when:
        controller.targetsAndScoresForActivity(projectId, activityId)

        then:
        1 * projectService.doesActivityBelongToProject(projectId, activityId) >> true
        1 * projectService.targetsAndScoresForActivity(activityId) >> targetsAndScoresData

        and:
        response.json == targetsAndScoresData
    }

    def "Tick targeted project outcomes"() {

        def projectId = '1234'
        Map project = project(projectId)
        project["custom"] = [details :[outcomes:[primaryOutcome:[
                                            assets: ["Ginini Flats Wetland Complex"],
                                            description: "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
                                         ]]]]

        Map userDetails = stubProjectAdmin('1234', projectId)


        when: "build RLP model"

        controller.index(projectId)

        then:
        1 * projectService.get(projectId, userDetails, _) >> project
        1 * projectService.getProgramConfiguration(_) >> new ProgramConfig([
                                                                        projectTemplate: ProjectController.RLP_TEMPLATE,
                                                                        outcomes: [
                                                                                [
                                                                                        "priorities": ["category":"Ramsar"],
                                                                                        "shortDescription":"Ramsar Sites",
                                                                                        "category":"environment",
                                                                                        "outcome":"By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
                                                                                ],
                                                                        ]
        ])

        and: "The project outcomes should be made available to the model"
        model.project.outcomes[0].targeted == true

    }

    def "In RLP projects, only the overview and documents tab are displayed to public users"() {

        setup:
        String projectId = '1234'
        Map project = project(projectId)
        Map userDetails = stubPublicUser()

        when:
        controller.index(projectId)

        then:
        1 * projectService.get(projectId, userDetails, _) >> project
        1 * projectService.getProgramConfiguration(_) >> new ProgramConfig([
                projectTemplate: ProjectController.RLP_TEMPLATE])

        and:
        model.projectContent.serviceDelivery.visible == false
        model.projectContent.site.visible == false
        model.projectContent.details.visible == false
        model.projectContent.admin.visible == false
        model.projectContent.reporting.visible == false
        model.projectContent.datasets.visible == false
        model.projectContent.overview.template == 'rlpOverview'
        model.projectContent.overview.visible == true
        model.projectContent.documents.visible == true
    }

    def "the financial year target exclusion works with numeric and string values"() {
        expect:
        controller.hasFinancialYearTarget([financialYearTarget: 0]) == false
        controller.hasFinancialYearTarget([financialYearTarget: "0"]) == false

        controller.hasFinancialYearTarget([financialYearTarget: "1"]) == true
        controller.hasFinancialYearTarget([financialYearTarget: 2]) == true
    }

    def "the controller delegates to the service to return the MERI plan history for a project"() {
        setup:
        String projectId = 'p1'
        List history = [[id:1, date:'2019-07-01T00:00:00Z', userId: '1234']]

        when:
        controller.approvedMeriPlanHistory(projectId)

        then:
        1 * projectService.approvedMeriPlanHistory(projectId) >> history
        response.json.approvedMeriPlanHistory == history
    }

    def "the controller delegates to a command object to view the MERI plan for a project"() {

        setup:
        String projectId = 'p1'

        when:
        MeriPlanReportCommand meriPlanReportCommand = new MeriPlanReportCommand()
        meriPlanReportCommand.id = projectId
        meriPlanReportCommand.projectService = projectService
        meriPlanReportCommand.metadataService = metadataServiceStub

        controller.viewMeriPlan(meriPlanReportCommand)

        then:
        1 * projectService.get(projectId, _) >> [projectId:projectId]
        model != null
        model.project.projectId == projectId
        view == '/project/meriPlanReport'

    }

    def "the controller will return a 404 if the project cannot be found when attempting a view a MERI plan report"() {
        setup:
        MeriPlanReportCommand meriPlanReportCommand = Mock(MeriPlanReportCommand)

        when:
        controller.viewMeriPlan(meriPlanReportCommand)

        then:
        1 * meriPlanReportCommand.meriPlanReportModel() >> [statusCode: HttpStatus.SC_NOT_FOUND, error:"Not found"]
        response.status == HttpStatus.SC_NOT_FOUND
    }

    def "The project controller delegates to the reportService to override the lock on a report"() {
        when:
        controller.overrideLockAndEdit('p1', 'r1')

        then:
        1 * reportService.overrideLock('r1', {it.endsWith('project/viewReport/p1?reportId=r1')})
    }

    def "The program configuration can customize the project template by excluding content"() {
        setup:
        def projectId = '1234'
        projectService.get(projectId, _, _) >> project(projectId)
        stubProjectAdmin('1234', projectId)

        when: "retrieving the project index page for an original MERIT project"
        controller.index(projectId)

        then: "Only the overview and documents tabs are enabled"
        1 * projectService.getProgramConfiguration(_) >> new ProgramConfig(
                [name:"Test Program", excludes:[
                        ProgramConfig.ProjectContent.SITES.toString(),
                        ProgramConfig.ProjectContent.DOCUMENTS.toString(),
                        ProgramConfig.ProjectContent.RISKS_AND_THREATS.toString(),
                        ProgramConfig.ProjectContent.MERI_PLAN.toString(),
                        ProgramConfig.ProjectContent.DASHBOARD.toString(),
                        ProgramConfig.ProjectContent.DATA_SETS.toString()]])

        view == '/project/index'
        !model.projectContent.overview.disabled
        model.projectContent.documents.visible == false
        model.projectContent.plan.visible == true
        model.projectContent.details.visible == false
        model.projectContent.site.visible == false
        model.projectContent.dashboard.visible == false
        model.projectContent.datasets.visible == false

        when: "retrieving the project index page for an RLP MERIT project"
        controller.index(projectId)

        then: "Only the overview and documents tabs are enabled"
        1 * projectService.getProgramConfiguration(_) >> new ProgramConfig(
                [name:"Test Program", projectTemplate:'rlp', excludes:[
                        ProgramConfig.ProjectContent.SITES.toString(),
                        ProgramConfig.ProjectContent.DOCUMENTS.toString(),
                        ProgramConfig.ProjectContent.RISKS_AND_THREATS.toString(),
                        ProgramConfig.ProjectContent.MERI_PLAN.toString(),
                        ProgramConfig.ProjectContent.DASHBOARD.toString(),
                        ProgramConfig.ProjectContent.DATA_SETS.toString(),
                        ProgramConfig.ProjectContent.REPORTING.toString()
                ]])

        view == '/project/index'
        !model.projectContent.overview.disabled
        model.projectContent.documents.visible == false
        model.projectContent.details.visible == false
        model.projectContent.site.visible == false
        model.projectContent.serviceDelivery.visible == false
        model.projectContent.datasets.visible == false
        model.projectContent.reporting.visible == false
    }

    def "The controller delegates to the projectService to list project priorities and returns a JSON encoded response"() {
        setup:
        List expected = ['p1', 'p2', 'p3']
        String projectId = 'p1'

        when:
        controller.listProjectInvestmentPriorities(projectId)

        then:
        1 * projectService.listProjectInvestmentPriorities(projectId) >> expected

        and:
        response.json == expected

    }

    def "The controller delegates to the reportService to release locks when existing a report"() {
        when:
        controller.exitReport('p1', 'r1')

        then:
        1 * reportService.unlock('r1')
        response.redirectUrl == '/project/index/p1'
    }

    def "the controller can return a list of targets and progress towards those targets for the final report"(boolean approvedDataOnly) {
        setup:
        Map stubResults = [services: [[
              id: 1,
              name: "Service 1",
              scores: [new Score([
                       scoreId: "score-1",
                       label: "score 1",
                       isOutputTarget: true,
                       target: "2",
                       periodTargets:[],
                       result:[result:1]
               ])]
          ],
          [
              id: 2,
              name: "Service 2",
              scores: [new Score([
                       scoreId: "score-2",
                       label: "score 2",
                       isOutputTarget: true,
                       target: "3",
                       periodTargets:[],
                       result:[result:3]
               ])]
          ]]]
        when:
        params.approvedDataOnly = approvedDataOnly
        params.onlyNonZeroTargets = true
        controller.projectTargetsAndScores('p1')

        then:
        1 * projectService.getServiceDashboardData('p1', approvedDataOnly) >> stubResults
        response.json.projectId == 'p1'
        response.json.targets == [[
                scoreId:'score-1',
                service: "Service 1",
                targetMeasure:"score 1",
                projectTarget: 2,
                result:1,
                isOverDelivered: false
            ], [
                scoreId:'score-2',
                 service: "Service 2",
                 targetMeasure:"score 2",
                 projectTarget: 3,
                 result:3,
                 isOverDelivered: false
          ]
        ]

        where:
        approvedDataOnly | _
        true | _
        false | _

    }

    def "Data can be downloaded for a project in xlsx or json format, with json the default"(String inputFormat, String expectedOutputFormat) {
        setup:
        String projectId = 'p1'

        when:
        params.id = projectId
        params.view = inputFormat
        Map result = controller.downloadProjectData()

        then:
        1 * webService.proxyGetRequest(response, {it.endsWith('project/downloadProjectData/'+projectId+'.'+expectedOutputFormat)}, true, true, _)
        result == null

        where:
        inputFormat | expectedOutputFormat
        'json'      | 'json'
        'xlsx'      | 'xlsx'
        ''          | 'json'
    }

    def "If no project id is supplied for a project download, an error is returned"() {
        when:
        controller.downloadProjectData()

        then:
        response.status == HttpStatus.SC_BAD_REQUEST
    }

    def "The ajaxUpdate action requires a POST"() {
        when:
        controller.ajaxUpdate()

        then:
        response.status == HttpStatus.SC_METHOD_NOT_ALLOWED
        0 * projectService._
    }

    def "The project controller doesn't allow project creation as this must be done via the admin import function"() {

        setup:
        userServiceStub.getUser() >> [userId:'u1']

        when: "The ajaxUpdate action is invoked without an id"
        request.method = 'POST'
        request.json = [name:'test project']
        controller.ajaxUpdate()

        then: "an error is returned - unauthorized is used as the pattern is a missing id is treated as a create for similar actions"
        response.status == HttpStatus.SC_UNAUTHORIZED
        0 * projectService._
    }

    def "The planStatus and hubId cannot be updated via the ajaxUpdate action (there are specific workflow actions for the planStatus)"() {
        setup: "The user is a project admin"
        String projectId = 'p1'

        when: "The ajaxUpdate action is invoked including the planStatus attribute"
        request.method = 'POST'
        request.json = [name:'test project', planStatus:'approved', hubId:'newHub']
        controller.ajaxUpdate(projectId)

        then:
        1 * projectService.update(projectId, [name:'test project']) >> [statusCode:HttpStatus.SC_OK, resp:[message:'updated']]
        response.status == HttpStatus.SC_OK
        response.json == [message:'updated']
    }

    def "Grant / project managers can update the project dates from the Reporting tab"() {
        setup:
        String projectId = 'p1'

        when:
        request.method = 'POST'
        request.json = [plannedStartDate:'2022-06-09T14:00:00Z', plannedEndDate:'2024-06-29T14:00:00Z']
        controller.ajaxUpdate(projectId)

        then:
        1 * userServiceStub.userIsSiteAdmin() >> true
        1 * projectService.update(projectId, [plannedStartDate:'2022-06-09T14:00:00Z', plannedEndDate:'2024-06-29T14:00:00Z']) >> [:]
    }

    def "Only admins can update come properties including programId and config"(boolean isGrantManager) {
        setup:
        String projectId = 'p1'
        Map data = ProjectController.ADMIN_ONLY_FIELDS.collectEntries { [(it):it] }

        when:
        request.method = 'POST'
        request.json = data
        controller.ajaxUpdate(projectId)

        then:
        1 * userServiceStub.userIsSiteAdmin() >> isGrantManager
        1 * userServiceStub.userIsAlaOrFcAdmin() >> false
        1 * projectService.update(projectId, [:]) >> [:]

        where:
        isGrantManager | _
        true | _
        false | _

    }

    def "Project managers and admin can update some properties admins cannot"(boolean isGrantManager, boolean isAdmin, int expectedSize) {
        setup:
        String projectId = 'p1'
        Map data = ProjectController.ADMIN_ONLY_FIELDS.collectEntries { [(it):it] }
        data += ProjectController.MANAGER_ONLY_FIELDS.collectEntries { [(it):it] }

        when:
        request.method = 'POST'
        request.json = data
        controller.ajaxUpdate(projectId)

        then:
        userServiceStub.userIsSiteAdmin() >> (isAdmin || isGrantManager)
        userServiceStub.userIsAlaOrFcAdmin() >> isAdmin
        1 * projectService.update(projectId, { it.size() == expectedSize }) >> [:]

        where:
        isGrantManager | isAdmin | expectedSize
        true | false | ProjectController.MANAGER_ONLY_FIELDS.size()
        false | true | ProjectController.MANAGER_ONLY_FIELDS.size() + ProjectController.ADMIN_ONLY_FIELDS.size()
        false | false | 0

    }

    def "The scoresForReport method delegates to the projectService"() {
        setup:
        String projectId = 'p1'
        List scoreIds = ['1', '2', '3']
        String reportId = 'r1'
        Map result =  ['1':1, '2':2, '3':3]

        when:
        params.id = projectId
        params.scoreIds = scoreIds
        params.reportId = reportId

        controller.scoresForReport(projectId)

        then:
        1 * projectService.scoresForReport(projectId, reportId, scoreIds) >> result
        response.json == result
    }

    private Map stubPublicUser() {
        userServiceStub.getUser() >> null
        null
    }

    private Map stubGrantManager(userId, projectId) {
        stubUserPermissions(userId, projectId, true, false, true, true)
        ['userName':null, 'userId':userId, 'class':UserDetails, 'displayName':null, 'isAdmin':false, 'isCaseManager':true, 'isEditor':true, 'hasViewAccess':true]
    }

    private Map stubProjectAdmin(userId, projectId) {
        stubUserPermissions(userId, projectId, true, true, false, true)
        ['userName':null, 'userId':userId, 'class':UserDetails, 'displayName':null, 'isAdmin':true, 'isCaseManager':false, 'isEditor':true, 'hasViewAccess':true]
    }

    private Map stubProjectEditor(userId, projectId) {
        stubUserPermissions(userId, projectId, true, false, false, true)
        ['userName':null, 'userId':userId, 'class':UserDetails, 'displayName':null, 'isAdmin':false, 'isCaseManager':false, 'isEditor':true, 'hasViewAccess':true]
    }

    private Map stubReadOnly(userId, projectId) {
        stubUserPermissions(userId, projectId, false, false, false, true)
        ['userName':null, 'userId':userId, 'class':UserDetails, 'displayName':null, 'isAdmin':false, 'isCaseManager':false, 'isEditor':false, 'hasViewAccess':true]
    }

    private def stubUserPermissions(userId, projectId, editor, admin, grantManager, canView) {
        userServiceStub.getUser() >> [userId:userId]
        projectService.isUserAdminForProject(userId, projectId) >> admin
        projectService.isUserCaseManagerForProject(userId, projectId) >> grantManager
        projectService.canUserEditProject(userId, projectId) >> editor
        projectService.canUserViewProject(userId, projectId) >> canView

    }

    private def project(String projectId, boolean includeReports = false) {
        Map project = [projectId:projectId, associatedProgram:"Test"]

        if (includeReports) {
            project.reports = [[type:'report1', reportId:'r1', activityId:'a1'], [type:'report1', reportId:'r2', activityId:'a2']]
        }
        project
    }
}

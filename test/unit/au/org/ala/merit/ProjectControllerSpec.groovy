package au.org.ala.merit

import au.org.ala.merit.command.MeriPlanReportCommand
import au.org.ala.merit.command.SaveReportDataCommand
import grails.test.mixin.TestFor
import org.apache.http.HttpStatus
import spock.lang.Specification

/**
 * Specification for the ProjectController
 */
@TestFor(ProjectController)
class ProjectControllerSpec extends Specification {

    def userServiceStub = Stub(UserService)
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

        projectService.getMembersForProjectId(_) >> []
        projectService.getProgramConfiguration(_) >> new ProgramConfig([requiresActivityLocking: true])
        projectService.getProjectServices(_) >> { project -> println(project); realProjectService.getProjectServices(project)}
        metadataServiceStub.organisationList() >> [list:[]]
        userServiceStub.getOrganisationIdsForUserId(_) >> []
        userServiceStub.isProjectStarredByUser(_, _) >> [isProjectStarredByUser:true]
        roleServiceStub.getRoles() >> []
        reportServiceStub.getReportsForProject(_) >> []
        activityServiceStub.activitiesForProject(_) >> []

    }


    def "the program can exclude optional project content"() {

        setup:
        def projectId = '1234'
        projectService.get(projectId, _, _) >> project(projectId)
        projectService.programsModel() >> [programs:[[name:'Test', optionalProjectContent:[]]]]

        when: "something"
        controller.index(projectId)

        then: "something"
        view == '/project/index'
        model.projectContent.details.visible == false
        model.projectContent.plan.risksAndThreatsVisible == false
    }

    def "most content is disabled if the user is not logged in"() {

        setup:
        def projectId = '1234'
        projectService.get(projectId, null, _) >> project(projectId)
        projectService.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]
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

        and: "the admin tab is not visible"
        model.projectContent.admin.visible == false
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
        projectService.getProgramConfiguration(_) >> new ProgramConfig([template: ProjectController.RLP_TEMPLATE])
        Map userDetails = stubProjectAdmin('1234', projectId)


        when: "retrieving the project index page"
        controller.index(projectId)

        then:
        1 * projectService.get(projectId, userDetails, _) >> project

        and: "The admin tab does not include the announcements menu item"
        view == '/project/index'
        model.projectContent.admin.showAnnouncementsTab == false
    }


    def "if a template is requested that is different to the project default, provide navigation back to the default template view"() {
        setup:
        String projectId = '1234'
        Map project = project(projectId)

        Map userDetails = stubGrantManager('1234', projectId)
        String projectTemplate = 'esp'

        when:
        params.template='index'
        controller.index(projectId)

        then:
        1 *  projectService.get(projectId, userDetails, _) >> project
        1 * projectService.getProgramConfiguration(project) >> new ProgramConfig([template: projectTemplate])
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
        1 * projectService.getProgramConfiguration(project) >> new ProgramConfig([template: projectTemplate])
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
        1 * projectService.getProgramConfiguration(project) >> new ProgramConfig([requiresActivityLocking: true])
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.VIEW, null) >> activityReportModel
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
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> activityReportModel
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
        // Override the default behaviour from setup
        1 * projectService.getProgramConfiguration(project) >> new ProgramConfig([requiresActivityLocking: true])
        0 * reportService.lockForEditing(_)

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
        1 * reportService.lockForEditing(project.reports[0])
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
        model.projectContent.overview.template == 'rlpOverview'
        model.projectContent.overview.visible == true
        model.projectContent.documents.visible == true
    }


    private Map setupMockServices() {
        Map activityModel = [name:'output', outputs:[]]
        List services = [1,2,3,4,5,6,7,8,9,10].collect{
            String output = 'o'+it
            activityModel.outputs << output
            [id:it, output:output]
        }
        metadataServiceStub.getProjectServices() >> services
        activityModel
    }

    def "for the output report, only outputs matching the project services will be displayed"() {

        setup:
        Map activityModel = setupMockServices()

        grailsApplication.config = [rlp:[servicesReport:'output']]
        Map project = [custom:[details:[serviceIds:[1,2,4]]]]

        Map activityData = [:]

        when:
        Map filteredModel = controller.filterOutputModel(activityModel, project, activityData)

        then:
        filteredModel.outputs == ['o1', 'o2', 'o4']
    }


    def "for the output report, outputs that are not service outputs will always be displayed"() {

        setup:
        Map activityModel = setupMockServices()
        activityModel.outputs << 'non service'

        grailsApplication.config = [rlp:[servicesReport:'output']]
        Map project = [custom:[details:[serviceIds:[1,2,4]]]]

        Map activityData = [:]

        when:
        Map filteredModel = controller.filterOutputModel(activityModel, project, activityData)

        then:
        filteredModel.outputs == ['o1', 'o2', 'o4', 'non service']
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

    private Map stubPublicUser() {
        userServiceStub.getUser() >> null
        null
    }

    private Map stubGrantManager(userId, projectId) {
        stubUserPermissions(userId, projectId, false, false, true, true)
        ['userName':null, 'userId':userId, 'class':UserDetails, 'displayName':null, 'isAdmin':false, 'isCaseManager':true, 'isEditor':false, 'hasViewAccess':true]
    }

    private Map stubProjectAdmin(userId, projectId) {
        stubUserPermissions(userId, projectId, false, true, false, true)
        ['userName':null, 'userId':userId, 'class':UserDetails, 'displayName':null, 'isAdmin':true, 'isCaseManager':false, 'isEditor':false, 'hasViewAccess':true]
    }

    private Map stubProjectEditor(userId, projectId) {
        stubUserPermissions(userId, projectId, true, false, false, true)
        ['userName':null, 'userId':userId, 'class':UserDetails, 'displayName':null, 'isAdmin':false, 'isCaseManager':false, 'isEditor':true, 'hasViewAccess':true]
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

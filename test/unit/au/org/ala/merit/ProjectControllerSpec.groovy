package au.org.ala.merit

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
        projectService.get(projectId, _) >> project(projectId)
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
        projectService.get(projectId, _) >> project(projectId)
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
        projectService.get(projectId, _) >> project(projectId)
        projectService.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]

        stubProjectAdmin('1234', projectId)

        when: "retrieving the project index page"
        controller.index(projectId)

        then: "The admin tab is visible"
        view == '/project/index'
        model.projectContent.admin.visible
        !model.projectContent.admin.disabled
    }

    def "the admin content should be enabled for grant managers"() {
        def projectId = '1234'
        projectService.get(projectId, _) >> project(projectId)
        projectService.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]

        stubGrantManager('1234', projectId)

        when: "retrieving the project index page"
        controller.index(projectId)

        then: "The admin tab is visible"
        view == '/project/index'
        model.projectContent.admin.visible
        !model.projectContent.admin.disabled
    }

    def "the admin content should be present for project editors (to edit blog)"() {
        def projectId = '1234'
        projectService.get(projectId, _) >> project(projectId)
        projectService.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]
        stubProjectEditor('1234', projectId)


        when: "retrieving the project index page"
        controller.index(projectId)

        then: "The admin tab is visible"
        view == '/project/index'
        model.projectContent.admin.visible
    }

    def "the announcements menu shouldn't be shown in RLP projects"() {
        def projectId = '1234'
        Map project = project(projectId)
        project.planStatus = ProjectService.PLAN_APPROVED // The announcements menu items shows only for approved projects
        projectService.get(projectId, _) >> project
        projectService.getProgramConfiguration(_) >> new ProgramConfig([template: ProjectController.RLP_TEMPLATE])
        stubProjectAdmin('1234', projectId)


        when: "retrieving the project index page"
        controller.index(projectId)

        then: "The admin tab does not include the announcements menu item"
        view == '/project/index'
        model.projectContent.admin.showAnnouncementsTab == false
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
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.VIEW) >> activityReportModel
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
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT) >> activityReportModel
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
        reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT) >> activityReportModel
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
        reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT) >> activityReportModel
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

    private def stubGrantManager(userId, projectId) {
        stubUserPermissions(userId, projectId, false, false, true, true)
    }

    private def stubProjectAdmin(userId, projectId) {
        stubUserPermissions(userId, projectId, false, true, false, true)
    }

    private def stubProjectEditor(userId, projectId) {
        stubUserPermissions(userId, projectId, true, false, false, true)
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

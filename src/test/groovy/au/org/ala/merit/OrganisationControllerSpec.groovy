package au.org.ala.merit

import au.org.ala.merit.command.SaveReportDataCommand
import grails.converters.JSON
import org.apache.http.HttpStatus
import org.grails.plugins.excelimport.ExcelImportService
import org.springframework.mock.web.MockMultipartFile
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

class OrganisationControllerSpec extends Specification implements ControllerUnitTest<OrganisationController>{

    def organisationService = Mock(OrganisationService)
    def searchService = Stub(SearchService)
    def documentService = Mock(DocumentService)
    def roleService = Stub(RoleService)
    def userService = Stub(UserService)
    def projectService = Mock(ProjectService)
    def reportService = Mock(ReportService)
    def activityService = Mock(ActivityService)
    def siteService = Mock(SiteService)
    def settingService = Mock(SettingService)

    String adminUserId = 'admin'
    String editorUserId = 'editor'
    String grantManagerUserId = 'grantManager'

    def setup() {
        controller.organisationService = organisationService
        controller.searchService = searchService
        controller.documentService = documentService
        controller.roleService = roleService
        controller.userService = userService
        controller.projectService = projectService
        controller.reportService = reportService
        controller.settingService = settingService
    }

    def "only the organisation projects and sites should be viewable anonymously"() {
        setup:
        setupAnonymousUser()
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg

        when:
        def model = controller.index('id')

        then:
        model.organisation == testOrg
        model.content.projects.visible == true
        model.content.sites.visible == true
        model.content.dashboard.visible == true
        model.content.admin.visible == false
    }

    def "all tabs except the admin tabs are viewable by a user with read only access"() {
        setup:
        setupReadOnlyUser()
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg

        when:
        def model = controller.index('id')

        then:
        model.organisation == testOrg
        model.content.projects.visible == true
        model.content.sites.visible == true
        model.content.dashboard.visible == true
        model.content.admin.visible == false
    }

    def "all tabs are visible to fc admins"() {
        setup:
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg
        setupFcAdmin()

        when:
        def model = controller.index('id')

        then:
        model.organisation == testOrg
        model.content.projects.visible == true
        model.content.sites.visible == true
        model.content.dashboard.visible == true
        model.content.admin.visible == true
    }

    def "all tabs are visible to organisation admins"() {
        setup:
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg
        setupOrganisationAdmin()

        when:
        def model = controller.index('id')

        then:
        model.organisation == testOrg
        model.content.projects.visible == true
        model.content.sites.visible == true
        model.content.dashboard.visible == true
        model.content.admin.visible == true
    }

    def "all tabs expect the admin tab are visible to organisation editors"() {
        setup:
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg
        setupOrganisationEditor()

        when:
        def model = controller.index('id')

        then:
        model.organisation == testOrg
        model.content.projects.visible == true
        model.content.sites.visible == true
        model.content.dashboard.visible == true
        model.content.admin.visible == false
    }

    def "the project tab is the default if there are no reports"() {
        setup:
        def testOrg = testOrganisation(false)
        organisationService.get(_,_) >> testOrg
        setupOrganisationAdmin()

        when:
        def model = controller.index('id')

        then:
        model.content.projects.default == true
        def numDefault = 0
        model.content.each { k, v ->
            if (v.default) {
                numDefault ++
            }
        }
        numDefault == 1
    }

    def "the project tab is the default if the reports are not shown"() {
        setup:
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg
        setupOrganisationEditor()

        when:
        def model = controller.index('id')

        then:
        model.content.projects.default == true
        def numDefault = 0
        model.content.each { k, v ->
            if (v.default) {
                numDefault ++
            }
        }
        numDefault == 1
    }

    def "only the activity report should be available to organisation editors"() {
        setup:
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg
        setupOrganisationEditor()

        when:
        def model = controller.index('id')

        then:
        model.content.dashboard.reports.size() == 1
        model.content.dashboard.reports[0].name == 'dashboard'
    }

    def "all reports should be available to organisation admins"() {
        setup:
        def testOrg = testOrganisation(true)
        testOrg.projects = [[projectId:'1234', associatedProgram:'Program 1']]
        organisationService.get(_,_) >> testOrg
        setupOrganisationAdmin()

        when: "the organisation page is viewed"
        def model = controller.index('id')

        then: "there should only be two reports"
        model.content.dashboard.reports.size() == 2
        model.content.dashboard.reports.find{it.name == 'dashboard'} != null
        model.content.dashboard.reports.find{it.name == 'announcements'} != null


    }

    def "an anonymous user cannot bulk edit project announcements"() {
        setup:
        setupAnonymousUser()
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg

        when:
        params.id = '1234'
        controller.editAnnouncements()

        then:
        response.redirectedUrl == '/organisation/index/1234'
    }

    def "an organisation editor cannot bulk edit project announcements"() {
        setup:
        setupAnonymousUser()
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg

        when:
        setupOrganisationEditor()
        params.id = '1234'
        controller.editAnnouncements()

        then:
        response.redirectedUrl == '/organisation/index/1234'
    }

    def "the organisationId parameter is mandatory to edit organisation announcements"() {
        setup:
        setupOrganisationAdmin()

        when:
        controller.editAnnouncements()

        then:
        response.status == 404
    }

    def "if the organisation does not exist, a 404 should be returned"() {
        setup:
        setupOrganisationAdmin()

        when:
        organisationService.get(_,_) >> [error:'Organisation does not exist']
        params.organisationId = '1234'
        controller.editAnnouncements()

        then:
        response.status == 404
    }

    def "an organisation admin can bulk edit project announcements"() {
        setup:
        def testOrg = testOrganisation('id',true)
        testOrg.projects = [[projectId:'1234', associatedProgram:'Program 1']]
        organisationService.get(_,_) >> testOrg
        setupOrganisationAdmin()
        searchService.allProjects(_,_) >> [results:[hits:[hits:[]]]]

        when:
        params.id = testOrg.organisationId
        def model = controller.editAnnouncements()

        then:
        response.status == 200
        model.events != null
        model.organisation == testOrg
    }

    def "an anonymous user cannot save project announcements"() {
        setup:
        setupAnonymousUser()
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg

        when:
        params.organisationId = '1234'
        controller.saveAnnouncements()

        then:
        response.status == 404
    }

    def "an organisation editor cannot save project announcements"() {
        setup:
        setupAnonymousUser()
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg

        when:
        setupOrganisationEditor()
        params.id = '1234'
        controller.saveAnnouncements()

        then:
        response.status == 403
    }

    def "the organisationId parameter is mandatory to save organisation announcements"() {
        setup:
        setupOrganisationAdmin()

        when:
        controller.saveAnnouncements()

        then:
        response.status == 404
    }

    def "if the organisation does not exist when saving, a 404 should be returned"() {
        setup:
        setupOrganisationAdmin()

        when:
        organisationService.get(_,_) >> [error:'Organisation does not exist']
        params.id = '1234'
        controller.saveAnnouncements()

        then:
        response.status == 404
    }

    def "an organisation admin can save project announcements"() {
        setup:
        def testOrg = testOrganisation('id',true)
        testOrg.projects = [[projectId:'1234', associatedProgram:'Program 1']]
        organisationService.get(_,_) >> testOrg
        projectService.get('1') >> [projectId:'1', custom:[details:[:]]]
        setupOrganisationAdmin()

        def announcements = [[projectId:'1', announcements:[[eventName:'project 1 event2'], [eventName:'project 1 event 2']]]]

        when:
        request.method = 'POST'
        request.json = announcements as JSON
        params.id = testOrg.organisationId
        controller.saveAnnouncements()

        then:
        response.status == 200
        1 * projectService.update(announcements[0].projectId, _)

    }

    def "A blank announcement should be returned for a project with no announcements to make it easier for the user"() {
        setup:
        def testOrg = testOrganisation('id',true)

        organisationService.get(_,_) >> testOrg
        def projects = projectsWithAnnouncements(3)
        projects[1].custom.details.events = []
        projects[0].status = 'completed' // only active projects should have their announcements returned
        testOrg.projects = projects

        setupOrganisationAdmin()

        when:
        params.id = testOrg.organisationId
        def model = controller.editAnnouncements()

        then:
        response.status == 200
        model.projectList.size() == 2
        model.events.size() == 11

    }


    def "The list of announcements for an organisation can be downloaded as a spreadsheet"() {
        setup:
        def testOrg = testOrganisation('id', true)
        organisationService.get(_,_) >> testOrg
        def projectsWithAnnouncements = projectsWithAnnouncements(3)

        searchService.allProjects(_, _) >> [hits:[hits:projectsWithAnnouncements.collect {[_source:it]}]]
        setupOrganisationAdmin()

        when:
        params.id = testOrg.organisationId
        controller.downloadAnnouncementsTemplate()

        then:
        response.status == 200
        response.getHeader('Content-Disposition').startsWith('attachment; filename="announcements')
        response.contentType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        // Spreadsheet contents is tested in the AnnouncementsMapperSpec
    }
    def "Populate abn name if the user provide the correct abn number otherwise it will return invalid"(){
        setup:
        params.method="GET"
        params.abn = "11111111111"
        String abn = params.abn
        controller.prepopulateAbn() >> params
        Map map = [abn:"11111111111", name:"Test Name"]

        when:
        controller.prepopulateAbn()


        then:
        1 * organisationService.getAbnDetails(abn) >> map

        and:
        response.status == 200
        response.contentType == 'application/json;charset=UTF-8'
        response.getJson().name == "Test Name"
        response.getJson().abn == "11111111111"

    }


    def "announcements can be bulk uploaded"() {
        setup:
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg
        controller.setExcelImportService(new ExcelImportService())
        setupOrganisationAdmin()
        request.addFile(new MockMultipartFile('announcementsTemplate', getClass().getResourceAsStream('/announcements.xlsx')))

        when:
        params.format = 'json'
        params.id = testOrg.organisationId
        controller.bulkUploadAnnouncements()

        then:
        response.status == 200
        response.contentType == 'application/json;charset=UTF-8'
        response.json.size() == 10
    }

    def "when editing a organisation report, the model will be customized for organisation reporting"() {
        setup:
        setupOrganisationAdmin()
        String organisationId = 'id'
        String reportId = 'r1'
        Map program = testOrganisation(organisationId,true)

        when:
        params.id = organisationId
        params.reportId = reportId
        // Normally grails would use dependency injection for this but that doesn't happen in controller unit tests
        // So we are faking it via params.
        params.reportService = reportService
        params.organisationService = organisationService
        controller.editOrganisationReport()

        then:
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> [editable:true, report:[reportId:reportId, organisationId:organisationId]]
        view == '/activity/activityReport'
        model.context == program
        model.contextViewUrl == '/organisation/index/'+organisationId
        model.reportHeaderTemplate == '/organisation/organisationReportHeader'
    }

    def "if a report is not editable, the organisation controller should present the report view instead"() {
        setup:
        setupOrganisationAdmin()
        String organisationId = 'p1'
        String reportId = 'r1'
        Map organisation = testOrganisation(organisationId, true)
        organisation.config.requiresActivityLocking = true

        when:
        params.id = organisationId
        params.reportId = reportId
        // Normally grails would use dependency injection for this but that doesn't happen in controller unit tests
        // So we are faking it via params.
        params.reportService = reportService
        params.organisationService = organisationService
        controller.editOrganisationReport()

        then: "the report activity should not be locked"
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> [editable:false, report:[reportId:reportId, organisationId:organisationId]]
        0 * reportService.lockForEditing(_)

        and: "the user should be redirected to the report view"
        response.redirectUrl == '/organisation/viewReport/'+organisationId+"?reportId="+reportId+"&attemptedEdit=true"
    }

    def "if the organisation uses pessimistic locking for reports, the report activity should be locked when the report is edited"() {
        setup:
        setupOrganisationAdmin()
        String organisationId = 'p1'
        String reportId = 'r1'
        Map organisation = testOrganisation(organisationId, true)

        when:
        organisation.config.requiresActivityLocking = true
        params.id = organisationId
        params.reportId = reportId
        // Normally grails would use dependency injection for this but that doesn't happen in controller unit tests
        // So we are faking it via params.
        params.reportService = reportService
        params.organisationService = organisationService
        controller.editOrganisationReport()

        then:
        1 * reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, null) >> [report:organisation.reports[0], editable:true]
        1 * reportService.lockForEditing(organisation.reports[0]) >> [locked:true]
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
        reportService.get(props.reportId) >> [organisationId:'o1']
        SaveReportDataCommand cmd = new SaveReportDataCommand(props)

        when:
        request.method = "POST"
        params.id = 'o2'
        controller.saveReport(cmd)

        then:
        response.json.error != null
        response.json.status == HttpStatus.SC_UNAUTHORIZED
    }

    def "report data can be saved"() {
        setup:
        String organisationId = 'o1'
        String reportId = 'r1'
        String activityId = 'a1'
        Map props = [
                activityId:activityId,
                activity:[
                        test1:'test'
                ],
                reportId:reportId,
                reportService:reportService,
                activityService: activityService

        ]
        reportService.get(props.reportId) >> [organisationId:organisationId, reportId:reportId, activityId:props.activityId]

        when:
        request.method = "POST"
        params.id = organisationId
        params.reportId = reportId
        params.activityId = props.activityId
        params.activity = props
        // Normally grails would use dependency injection for this but that doesn't happen in controller unit tests
        params.reportService = reportService
        params.activityService = activityService
        params.siteService = siteService

        controller.saveReport()

        then:
        1 * activityService.get(activityId) >> [activityId:activityId]
        1 * activityService.update(activityId, props) >> [success:true]
        response.json.success == true

    }

    def "Reports can be marked as Not Required"() {
        setup:
        String organisationId = "o1"
        Map data = [
            reportId:'r1',
            reason:'Test reason'
        ]
        when:
        request.method = "POST"
        params.id = organisationId
        request.JSON = data
        controller.ajaxCancelReport()

        then:
        1 * organisationService.cancelReport(organisationId, data.reportId, data.reason) >> [success:true]
        response.json == [success:true]
    }

    private Map testOrganisation(String id="", boolean includeReports) {
        Map org = [organisationId:id, name:'name', description:'description', config:[:], inheritedConfig:[:]]
        if (includeReports) {
            org.reports = [[type:'report1', reportId:'r1', activityId:'a1', organisationId:id], [type:'report1', reportId:'r2', activityId:'a2', organisationId:id]]
        }
        organisationService.get(id) >> org
        userService.getMembersOfProgram() >> [
            [userId:adminUserId, role:RoleService.PROJECT_ADMIN_ROLE],
            [userId:editorUserId, role:RoleService.PROJECT_EDITOR_ROLE],
            [userId:grantManagerUserId, role:RoleService.GRANT_MANAGER_ROLE]]
        return org
    }

    private void setupAnonymousUser() {
        userService.getUser() >> null
        userService.userHasReadOnlyAccess() >> false
        userService.userIsSiteAdmin() >> false
        userService.userIsAlaOrFcAdmin() >> false
        organisationService.getMembersOfOrganisation(_) >> [[userId:'1234', role:RoleService.PROJECT_ADMIN_ROLE]]
    }

    private void setupFcAdmin() {
        userService.getUser() >> [userId:'1345']
        userService.userHasReadOnlyAccess() >> false
        userService.userIsSiteAdmin() >> true
        userService.userIsAlaOrFcAdmin() >> true
        organisationService.getMembersOfOrganisation(_) >> []
    }

    private void setupReadOnlyUser() {
        userService.getUser() >> [userId:'1345']
        userService.userHasReadOnlyAccess() >> true
        userService.userIsSiteAdmin() >> false
        userService.userIsAlaOrFcAdmin() >> false
        organisationService.getMembersOfOrganisation(_) >> []
    }

    private void setupOrganisationAdmin() {
        def userId = '1234'
        userService.getUser() >> [userId:userId]
        userService.userHasReadOnlyAccess() >> false
        userService.userIsSiteAdmin() >> false
        userService.userIsAlaOrFcAdmin() >> false
        organisationService.getMembersOfOrganisation(_) >> [[userId:userId, role:RoleService.PROJECT_ADMIN_ROLE]]
        organisationService.isUserAdminForOrganisation(_) >> true
    }

    private void setupOrganisationEditor() {
        def userId = '1234'
        userService.getUser() >> [userId:userId]
        userService.userHasReadOnlyAccess() >> false
        userService.userIsSiteAdmin() >> false
        userService.userIsAlaOrFcAdmin() >> false
        organisationService.getMembersOfOrganisation(_) >> [[userId:userId, role:RoleService.PROJECT_EDITOR_ROLE]]
    }

    private List projectsWithAnnouncements(projectCount) {
        List projects = []
        def annoucementsCount = 0
        for (int i=0; i<projectCount; i++) {
            projects << [status:'active', projectId:'project'+i, name:'Project '+i, grantId:'Grant '+i, custom:[details:[events:buildAnnouncements(10, annoucementsCount)]]]
            annoucementsCount+=10
        }
        return projects
    }

    private def buildAnnouncements(howMany, startIndex) {
        def announcements = []
        for (int i=startIndex; i<howMany+startIndex; i++) {
            announcements << [projectId:'project'+i, grantId:'Grant '+i, name:'Project '+i, eventName:'Event '+i, eventDescription:'Description '+i, eventDate:"2015-06-${i%30+1}T00:00:00Z".toString(), funding:i, grantAnnouncementDate:"2015-${i%12+1}-${i%28+1}T00:00:00Z".toString(), eventType:'Non-funding op']
        }
        announcements
    }

}

package au.org.ala.merit

import au.org.ala.fieldcapture.ActivityService
import au.org.ala.fieldcapture.CommonService
import au.org.ala.fieldcapture.MetadataService
import au.org.ala.fieldcapture.RoleService
import au.org.ala.fieldcapture.SiteService
import au.org.ala.fieldcapture.UserService
import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * Specification for the ProjectController
 */
@TestFor(ProjectController)
class ProjectControllerSpec extends Specification {

    def userServiceStub = Stub(UserService)
    def metadataServiceStub = Stub(MetadataService)
    def projectServiceStub = Stub(ProjectService)
    def siteServiceStub = Stub(SiteService)
    def roleServiceStub = Stub(RoleService)
    def activityServiceStub = Stub(ActivityService)
    def commonServiceStub = Stub(CommonService)
    def reportServiceStub = Stub(ReportService)


    void setup() {
        controller.userService = userServiceStub
        controller.metadataService = metadataServiceStub
        controller.projectService = projectServiceStub
        controller.siteService = siteServiceStub
        controller.roleService = roleServiceStub
        controller.activityService = activityServiceStub
        controller.commonService = commonServiceStub
        controller.reportService = reportServiceStub
        projectServiceStub.getMembersForProjectId(_) >> []
        metadataServiceStub.organisationList() >> [list:[]]
        userServiceStub.getOrganisationIdsForUserId(_) >> []
        userServiceStub.isProjectStarredByUser(_, _) >> [isProjectStarredByUser:true]
        roleServiceStub.getRoles() >> []
        reportServiceStub.getReportsForProject(_) >> []

    }


    def "the program can exclude optional project content"() {

        setup:
        def projectId = '1234'
        projectServiceStub.get(projectId, _) >> [projectId:projectId, associatedProgram:"Test"]
        projectServiceStub.programsModel() >> [programs:[[name:'Test', optionalProjectContent:[]]]]

        when: "something"
        controller.index(projectId)

        then: "something"
        view == '/project/index'
        model.projectContent.details.visible == false
        model.projectContent.risksAndThreats.visible == false
    }

    def "most content is disabled if the user is not logged in"() {

        setup:
        def projectId = '1234'
        projectServiceStub.get(projectId, _) >> [projectId:projectId, associatedProgram:"Test"]
        projectServiceStub.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]
        userServiceStub.getUser() >> null

        when: "retrieving the project index page"
        controller.index(projectId)

        then: "Only the overview and documents tabs are enabled"
        view == '/project/index'
        !model.projectContent.overview.disabled
        !model.projectContent.documents.disabled
        model.projectContent.plan.disabled == true
        model.projectContent.details.disabled == true
        model.projectContent.risksAndThreats.disabled == true
        model.projectContent.site.disabled == true
        model.projectContent.dashboard.disabled == true

        and: "the admin tab is not visible"
        model.projectContent.admin.visible == false
    }

    def "the admin content should be enabled for project admins"() {
        def projectId = '1234'
        projectServiceStub.get(projectId, _) >> [projectId:projectId, associatedProgram:"Test"]
        projectServiceStub.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]

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
        projectServiceStub.get(projectId, _) >> [projectId:projectId, associatedProgram:"Test"]
        projectServiceStub.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]

        stubGrantManager('1234', projectId)

        when: "retrieving the project index page"
        controller.index(projectId)

        then: "The admin tab is visible"
        view == '/project/index'
        model.projectContent.admin.visible
        !model.projectContent.admin.disabled
    }

    def "the admin content should be not present for project editors"() {
        def projectId = '1234'
        projectServiceStub.get(projectId, _) >> [projectId:projectId, associatedProgram:"Test"]
        projectServiceStub.programsModel() >> [programs:[[name:'Test', optionalProjectContent:['Risks and Threats', 'MERI Plan']]]]
        stubProjectEditor('1234', projectId)


        when: "retrieving the project index page"
        controller.index(projectId)

        then: "The admin tab is not visible"
        view == '/project/index'
        !model.projectContent.admin.visible
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
        projectServiceStub.isUserAdminForProject(userId, projectId) >> admin
        projectServiceStub.isUserCaseManagerForProject(userId, projectId) >> grantManager
        projectServiceStub.canUserEditProject(userId, projectId) >> editor
        projectServiceStub.canUserViewProject(userId, projectId) >> canView

    }
}

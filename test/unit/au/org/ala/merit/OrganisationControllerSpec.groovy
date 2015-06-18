package au.org.ala.merit

import au.org.ala.fieldcapture.DocumentService
import au.org.ala.fieldcapture.RoleService
import au.org.ala.fieldcapture.SearchService
import au.org.ala.fieldcapture.UserService
import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(OrganisationController)
class OrganisationControllerSpec extends Specification {

    def organisationService = Mock(au.org.ala.fieldcapture.OrganisationService)
    def searchService = Mock(SearchService)
    def documentService = Mock(DocumentService)
    def roleService = Stub(RoleService)
    def userService = Stub(UserService)

    def setup() {
        controller.organisationService = organisationService
        controller.searchService = searchService
        controller.documentService = documentService
        controller.roleService = roleService
        controller.userService = userService

    }

    def "only the organisation projects should be viewable anonymously"() {
        setup:
        setupAnonymousUser()
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg

        when:
        def model = controller.index('id')

        then:
        model.organisation == testOrg
        model.content.projects.visible == true
        model.content.sites.visible == false
        model.content.dashboard.visible == false
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
        model.content.reporting.visible == true
        model.content.projects.visible == true
        model.content.sites.visible == false // Disabled until we have content
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
        model.content.reporting.visible == true
        model.content.projects.visible == true
        model.content.sites.visible == false // Disabled until we have content
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
        model.content.reporting.visible == true
        model.content.projects.visible == true
        model.content.sites.visible == false // Disabled until we have content.
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
        model.content.reporting.visible == false
        model.content.projects.visible == true
        model.content.sites.visible == false // Disabled until we have content.
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
        model.content.dashboard.reports[0].name == 'outputs'
    }

    def "all reports should be available to organisation admins"() {
        setup:
        def testOrg = testOrganisation(true)
        organisationService.get(_,_) >> testOrg
        setupOrganisationAdmin()

        when:
        def model = controller.index('id')

        then:
        model.content.dashboard.reports.size() == 3
        model.content.dashboard.reports.find{it.name == 'outputs'} != null
        model.content.dashboard.reports.find{it.name == 'announcements'} != null
        model.content.dashboard.reports.find{it.name == 'greenArmy'} != null

    }

    private Map testOrganisation(boolean includeReports) {
        def org = [organisationId:'id', name:'name', description:'description']
        if (includeReports) {
            org.reports = [[type:'report1'], [type:'report1']]
        }
        return org
    }

    private void setupAnonymousUser() {
        userService.getUser() >> null
        userService.userHasReadOnlyAccess() >> false
        userService.userIsAlaOrFcAdmin() >> false
        organisationService.getMembersOfOrganisation(_) >> []
    }

    private void setupFcAdmin() {
        userService.getUser() >> [userId:'1345']
        userService.userHasReadOnlyAccess() >> false
        userService.userIsAlaOrFcAdmin() >> true
        organisationService.getMembersOfOrganisation(_) >> []
    }

    private void setupReadOnlyUser() {
        userService.getUser() >> [userId:'1345']
        userService.userHasReadOnlyAccess() >> true
        userService.userIsAlaOrFcAdmin() >> false
        organisationService.getMembersOfOrganisation(_) >> []
    }

    private void setupOrganisationAdmin() {
        def userId = '1234'
        userService.getUser() >> [userId:userId]
        userService.userHasReadOnlyAccess() >> false
        userService.userIsAlaOrFcAdmin() >> false
        organisationService.getMembersOfOrganisation(_) >> [[userId:userId, role:RoleService.PROJECT_ADMIN_ROLE]]
    }

    private void setupOrganisationEditor() {
        def userId = '1234'
        userService.getUser() >> [userId:userId]
        userService.userHasReadOnlyAccess() >> false
        userService.userIsAlaOrFcAdmin() >> false
        organisationService.getMembersOfOrganisation(_) >> [[userId:userId, role:RoleService.PROJECT_EDITOR_ROLE]]
    }

}

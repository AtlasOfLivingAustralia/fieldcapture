package au.org.ala.merit

import au.com.bytecode.opencsv.CSVReader
import au.org.ala.merit.hub.HubSettings
import au.org.ala.web.AuthService
import grails.plugins.csv.CSVReaderUtils
import grails.web.http.HttpHeaders
import org.apache.http.HttpStatus
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

class AdminControllerSpec extends Specification implements ControllerUnitTest<AdminController>{

    AdminService adminService = Mock(AdminService)
    AuthService authService  = Mock(AuthService)
    SettingService settingService = Mock(SettingService)
    UserService userService = Mock(UserService)
    RoleService roleService = Mock(RoleService)
    DocumentService documentService = Mock(DocumentService)
    ProjectService projectService = Mock(ProjectService)

    def setup(){
        controller.adminService = adminService
        controller.authService = authService
        controller.settingService = settingService
        controller.userService = userService
        controller.roleService = roleService
        controller.documentService = documentService
        controller.projectService = projectService
    }

    void "Search User Details using email Address"(){
        setup:
        String email = "test@test.com"
        params.emailAddress = email
        Map userDetails = [userId: "12345", userName: "userTest", firstName: "Test", lastName: "Testing", email:email]

        when:
        controller.searchUserDetails()
        def results = response.getJson()


        then:
        1 * authService.getUserForEmailAddress(email) >> userDetails

        and:
        results.userId == "12345"
        results.emailAddress == "test@test.com"
        results.firstName == "Test"
        results.lastName == "Testing"

    }

    void "Search User Details using wrong email Address"(){
        setup:
        String email = "test@test.com"
        params.emailAddress = email
        Map userDetails = [userId: null, userName: null, firstName: null, lastName: null]

        when:
        controller.searchUserDetails()
        def results = response.getJson()


        then:
        1 * authService.getUserForEmailAddress(email) >> userDetails

        and:
        results.error == "error"
        results.emailAddress == "test@test.com"
    }

    void "Remove user Details from merit with successfully"(){
        setup:
        String userId = "12345"
        params.userId = userId
        Map success = [resp: [status:200, error: false]]

        when:
        request.method = "POST"
        controller.removeUserDetails()
        Map results = response.getJson()

        then:
        1 * adminService.deleteUserPermission(userId) >> success

        and:
        results.status == 200
        results.success == "Success"
    }

    void "Unable to remove user when no user found in the database"(){
        setup:
        String userId = "12345"
        params.userId = userId
        Map success = [resp: [ status:400, error: "No UserPermissions found"]]

        when:
        request.method = "POST"
        controller.removeUserDetails()
        Map results = response.getJson()

        then:
        1 * adminService.deleteUserPermission(userId) >> success

        and:
        results.status == 400
        results.error == "No UserPermissions found"
    }

    void "500 error when there is an issue downloading with db"(){
        setup:
        String userId = "12345"
        params.userId = userId
        Map success = [resp: [ status:500, error: "Downloading issue"]]

        when:
        request.method = "POST"
        controller.removeUserDetails()
        Map results = response.getJson()

        then:
        1 * adminService.deleteUserPermission(userId) >> success

        and:
        results.status == 500
        results.error == "Downloading issue"
    }

    def "The AdminController can download an example CSV for MERIT import"() {
        when:
        controller.meritImportCSVTemplate()
        CSVReader reader = CSVReaderUtils.toCsvReader(response.text,[:])
        List<String[]> lines = reader.readAll()

        then:
        response.header(HttpHeaders.CONTENT_DISPOSITION) == 'attachment; filename="merit-project-import.csv"'
        response.contentType == 'text/csv'
        lines.size() == 4
    }

    def "The AdminController configures navigation and settings based on the setting being edited"(String setting, String returnTo, String expectedReturnUrl, String expectedReturnLabel) {
        setup:
        String content = "test"

        when:
        params.returnTo = returnTo
        controller.editSettingText(setting)

        then:
        view == '/admin/editTextAreaSetting'
        model.textValue == content
        model.returnUrl == expectedReturnUrl
        model.returnLabel == expectedReturnLabel
        1 * settingService.getSettingText(_) >> content

        where:

        setting    | returnTo | expectedReturnUrl | expectedReturnLabel
        'about'    | 'about' | '/home/about'     | 'About'
        'help'     | 'help' | '/home/help'      | 'Help'
        'contacts' | 'contacts' | '/home/contacts' | 'Contacts'
        'rlpMeriDeclaration' | 'staticPage' | '/admin/staticPages' | 'Static pages'

    }

    def "If an invalid setting name is supplied, the AdminController will return and error"() {
        when:
        controller.editSettingText("invalid")

        then:
        response.status == HttpStatus.SC_NOT_FOUND
        0 * settingService._
    }

    void "Retriever HUB Roles"(){
        setup:
        HubSettings hubSettings = new HubSettings(hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)
        List roles = RoleService.MERIT_HUB_ROLES
        Boolean hubFlg = true

        when:
        def results = controller.createUserHubPermission()

        then:
        1 * userService.getUser() >> [userId:'129333', userName: 'jsalomon']

        and:
        view == '/admin/createUserHubPermission'
        model.roles == roles
        model.hubId == '00cf9ffd-e30c-45f8-99db-abce8d05c0d8'
        model.hubFlg == true

    }

    void "The controller can setup the model for managing help documents"() {
        setup:
        List documents = [[documentId:'1', title:'Test Document', labels:['Test Category']]]
        HubSettings hubSettings = new HubSettings(hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)

        when:
        Map model = controller.manageHelpDocuments()

        then:
        1 * documentService.findAllHelpDocuments(hubSettings.hubId, null) >> documents
        model.categories == ['Test Category']
        model.documents == documents
        model.hubId == hubSettings.hubId
        model.category == null

    }

    void "manageTags should return a list of tags"() {
        given:
        List tags = [[termId: "1", name: "Tag1"], [termId: "2", name: "Tag2"]]
        projectService.getProjectTags() >> tags

        when:
        def model = controller.manageTags()

        then:
        model.tags == tags
    }

    void "updateTag should return an error if termId is missing"() {
        given:
        request.JSON = [:]

        when:
        request.method = "POST"
        controller.updateTag()

        then:
        response.status == HttpStatus.SC_BAD_REQUEST
    }

    void "updateTag should call projectService.updateProjectTag with valid input"() {
        given:
        Map tag = [termId: "1", term: "UpdatedTag"]
        request.JSON = tag

        when:
        request.method = "POST"
        controller.updateTag()
        def response = response.json

        then:
        1 * projectService.updateProjectTag(tag) >> [success: true]
        response.success == true
    }

    void "addTag should return an error if term is missing"() {
        given:
        request.JSON = [:]

        when:
        request.method = "POST"
        controller.addTag()

        then:
        response.status == HttpStatus.SC_BAD_REQUEST
    }

    void "addTag should call projectService.addProjectTag with valid input"() {
        given:
        Map tag = [term: "NewTag"]
        request.JSON = tag

        when:
        request.method = "POST"
        controller.addTag()
        def response = response.json

        then:
        1 * projectService.addProjectTag(tag) >> [success: true]
        response.success == true
    }

    void "deleteTag should return an error if termId is missing"() {
        given:
        request.JSON = [:]

        when:
        request.method = "POST"
        controller.deleteTag()

        then:
        response.status == HttpStatus.SC_BAD_REQUEST
    }

    void "deleteTag should call projectService.deleteProjectTag with valid input"() {
        given:
        Map tag = [termId: "1"]
        request.JSON = tag

        when:
        request.method = "POST"
        controller.deleteTag()
        def response = response.json

        then:
        1 * projectService.deleteProjectTag(tag) >> [success: true]
        response.success == true
    }

}


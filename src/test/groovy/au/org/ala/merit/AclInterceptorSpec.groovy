package au.org.ala.merit


import grails.core.GrailsApplication
import grails.core.GrailsClass
import grails.testing.web.GrailsWebUnitTest
import grails.testing.web.interceptor.InterceptorUnitTest
import grails.web.http.HttpHeaders
import org.apache.http.HttpStatus
import spock.lang.Specification

class AclInterceptorSpec extends Specification implements GrailsWebUnitTest {

    AclInterceptor aclInterceptor
    def setup() {
        aclInterceptor = new AclInterceptor()
        aclInterceptor.roleService = Mock(RoleService)
        aclInterceptor.userService = Mock(UserService)
    }

    def "The before method applies a role check if the @PreAuthorise annotation is used on a method"() {

        setup:
        GrailsApplication grailsApp = Mock(GrailsApplication)
        GrailsClass grailsClass = Mock(GrailsClass)
        aclInterceptor.grailsApplication = grailsApp
        aclInterceptor.webRequest.controllerName = "ProjectController"
        aclInterceptor.webRequest.actionName = "viewReport"
        params.id = "p1"

        when: "The interceptor is invoked"
        aclInterceptor.before()

        then:
        1 * aclInterceptor.grailsApplication.getArtefactByLogicalPropertyName("Controller", _) >> grailsClass
        1 * aclInterceptor.roleService.getAugmentedRoles() >> []
        1 * grailsClass.getClazz() >> ProjectController.class
        1 * aclInterceptor.userService.getCurrentUserId() >> "test"

    }

    def "This verifies that a user with read only access can view or download a report"() {
        setup:
        GrailsApplication grailsApp = Mock(GrailsApplication)
        GrailsClass grailsClass = Mock(GrailsClass)
        aclInterceptor.grailsApplication = grailsApp
        aclInterceptor.webRequest.controllerName = "ProjectController"
        aclInterceptor.webRequest.actionName = "viewReport"
        params.id = "p1"

        when: "The interceptor is invoked"
        boolean canView = aclInterceptor.before()

        then:
        1 * aclInterceptor.grailsApplication.getArtefactByLogicalPropertyName("Controller", _) >> grailsClass
        1 * aclInterceptor.roleService.getAugmentedRoles() >> ["alaAdmin","siteAdmin","officer","siteReadOnly","readOnly"]
        1 * grailsClass.getClazz() >> ProjectController.class
        1 * aclInterceptor.userService.getCurrentUserId() >> "test"
        1 * aclInterceptor.userService.userIsAlaOrFcAdmin() >> false
        1 * aclInterceptor.userService.checkRole("test", "readOnly", "p1", UserService.PROJECT ) >> false
        1 * aclInterceptor.userService.userHasReadOnlyAccess() >> true


        canView == true
    }

    def "Returns an error message if the read only access conditions aren't satisfied"() {
        setup:
        GrailsApplication grailsApp = Mock(GrailsApplication)
        GrailsClass grailsClass = Mock(GrailsClass)
        aclInterceptor.grailsApplication = grailsApp
        aclInterceptor.webRequest.controllerName = "ProjectController"
        aclInterceptor.webRequest.actionName = "viewReport"
        params.id = "p1"

        when: "The interceptor is invoked"
        boolean canView = aclInterceptor.before()

        then:
        1 * aclInterceptor.grailsApplication.getArtefactByLogicalPropertyName("Controller", _) >> grailsClass
        1 * aclInterceptor.roleService.getAugmentedRoles() >> ["alaAdmin","siteAdmin","officer","siteReadOnly","readOnly"]
        1 * grailsClass.getClazz() >> ProjectController.class
        1 * aclInterceptor.userService.getCurrentUserId() >> "test"
        1 * aclInterceptor.userService.userIsAlaOrFcAdmin() >> false
        1 * aclInterceptor.userService.checkRole("test", "readOnly", "p1", UserService.PROJECT ) >> false
        1 * aclInterceptor.userService.userHasReadOnlyAccess() >> false


        canView == false
        response.status == HttpStatus.SC_MOVED_TEMPORARILY
        response.getHeader(HttpHeaders.LOCATION).endsWith('/project/index/p1')
    }


    def "This checks an editor access level"() {
        setup:
        GrailsApplication grailsApp = Mock(GrailsApplication)
        GrailsClass grailsClass = Mock(GrailsClass)
        aclInterceptor.grailsApplication = grailsApp
        aclInterceptor.webRequest.controllerName = "ProjectController"
        aclInterceptor.webRequest.actionName = "editReport"
        params.id = "p1"

        when: "The interceptor is invoked"
        boolean canView = aclInterceptor.before()

        then:
        1 * aclInterceptor.grailsApplication.getArtefactByLogicalPropertyName("Controller", _) >> grailsClass
        1 * aclInterceptor.roleService.getAugmentedRoles() >> ["alaAdmin","siteAdmin","officer","siteReadOnly","readOnly"]
        1 * grailsClass.getClazz() >> ProjectController.class
        1 * aclInterceptor.userService.getCurrentUserId() >> "test"
        1 * aclInterceptor.userService.userIsAlaOrFcAdmin() >> false
        1 * aclInterceptor.userService.checkRole("test", "editor", "p1", UserService.PROJECT ) >> false


        canView == false
        response.status == HttpStatus.SC_MOVED_TEMPORARILY
        response.getHeader(HttpHeaders.LOCATION).endsWith('/project/index/p1')
    }

    def "This checks an officer access level"() {
        setup:
        GrailsApplication grailsApp = Mock(GrailsApplication)
        GrailsClass grailsClass = Mock(GrailsClass)
        aclInterceptor.grailsApplication = grailsApp
        aclInterceptor.webRequest.controllerName = "ProjectController"
        aclInterceptor.webRequest.actionName = "approvedMeriPlanHistory"
        params.id = "p1"

        when: "The interceptor is invoked"
        boolean canView = aclInterceptor.before()

        then:
        1 * aclInterceptor.grailsApplication.getArtefactByLogicalPropertyName("Controller", _) >> grailsClass
        1 * aclInterceptor.roleService.getAugmentedRoles() >> ["alaAdmin","siteAdmin","officer","siteReadOnly","readOnly"]
        1 * grailsClass.getClazz() >> ProjectController.class
        1 * aclInterceptor.userService.getCurrentUserId() >> "test"
        1 * aclInterceptor.userService.userIsSiteAdmin() >> false


        canView == false
        response.status == HttpStatus.SC_MOVED_TEMPORARILY
        response.getHeader(HttpHeaders.LOCATION).endsWith('/project/index/p1')
    }

    def "This checks a siteReadOnly access level"() {
        setup:
        GrailsApplication grailsApp = Mock(GrailsApplication)
        GrailsClass grailsClass = Mock(GrailsClass)
        aclInterceptor.grailsApplication = grailsApp
        aclInterceptor.webRequest.controllerName = "ManagementUnitController"
        aclInterceptor.webRequest.actionName = "generateReportsInPeriod"
        params.id = "p1"

        when: "The interceptor is invoked"
        boolean canView = aclInterceptor.before()

        then:
        1 * aclInterceptor.grailsApplication.getArtefactByLogicalPropertyName("Controller", _) >> grailsClass
        1 * aclInterceptor.roleService.getAugmentedRoles() >> ["alaAdmin","siteAdmin","officer","siteReadOnly","readOnly"]
        1 * grailsClass.getClazz() >> ManagementUnitController.class
        1 * aclInterceptor.userService.getCurrentUserId() >> "test"
        1 * aclInterceptor.userService.userIsAlaOrFcAdmin() >> false
        1 * aclInterceptor.userService.userHasReadOnlyAccess() >> false



        canView == false
        response.status == HttpStatus.SC_MOVED_TEMPORARILY
        response.getHeader(HttpHeaders.LOCATION).endsWith('/project/index/p1')
    }

    def "This checks a siteAdmin access level"() {
        setup:
        GrailsApplication grailsApp = Mock(GrailsApplication)
        GrailsClass grailsClass = Mock(GrailsClass)
        aclInterceptor.grailsApplication = grailsApp
        aclInterceptor.webRequest.controllerName = "ProjectController"
        aclInterceptor.webRequest.actionName = "ajaxValidateProjectDates"
        params.id = "p1"

        when: "The interceptor is invoked"
        boolean canView = aclInterceptor.before()

        then:
        1 * aclInterceptor.grailsApplication.getArtefactByLogicalPropertyName("Controller", _) >> grailsClass
        1 * aclInterceptor.roleService.getAugmentedRoles() >> ["alaAdmin","siteAdmin","officer","siteReadOnly","readOnly"]
        1 * grailsClass.getClazz() >> ProjectController.class
        1 * aclInterceptor.userService.getCurrentUserId() >> "test"
        1 * aclInterceptor.userService.userIsAlaOrFcAdmin() >> false



        canView == false
        response.status == HttpStatus.SC_MOVED_TEMPORARILY
        response.getHeader(HttpHeaders.LOCATION).endsWith('/project/index/p1')
    }

    def "This checks an admin access level, user with non-admin access will not be able to pass authentication check"() {
        setup:
        GrailsApplication grailsApp = Mock(GrailsApplication)
        GrailsClass grailsClass = Mock(GrailsClass)
        aclInterceptor.grailsApplication = grailsApp
        aclInterceptor.webRequest.controllerName = "ProjectController"
        aclInterceptor.webRequest.actionName = "viewMeriPlan"
        params.id = "p1"

        when: "The interceptor is invoked"
        boolean canView = aclInterceptor.before()

        then:
        1 * aclInterceptor.grailsApplication.getArtefactByLogicalPropertyName("Controller", _) >> grailsClass
        1 * aclInterceptor.roleService.getAugmentedRoles() >> ["alaAdmin","siteAdmin","officer","siteReadOnly","readOnly"]
        1 * grailsClass.getClazz() >> ProjectController.class
        1 * aclInterceptor.userService.getCurrentUserId() >> "test"
        1 * aclInterceptor.userService.userIsAlaOrFcAdmin() >> false



        canView == false
        response.status == HttpStatus.SC_MOVED_TEMPORARILY
        response.getHeader(HttpHeaders.LOCATION).endsWith('/project/index/p1')
    }

}
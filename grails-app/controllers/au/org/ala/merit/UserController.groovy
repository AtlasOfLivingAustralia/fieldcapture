package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.apache.http.HttpStatus
import org.grails.web.json.JSONArray

import static org.apache.http.HttpStatus.SC_BAD_REQUEST
import static org.apache.http.HttpStatus.SC_FORBIDDEN
import static org.apache.http.HttpStatus.SC_INTERNAL_SERVER_ERROR

/**
 * Extends the UserController to add report information.
 */
@Slf4j
class UserController {

    ReportService reportService
    def userService, authService, projectService, organisationService

    /**
     * Default view for user controller - show user dashboard page.
     *
     * @return
     */
    def index() {
        def user = userService.getUser()
        if (!user) {
            flash.message = "User Profile Error: user not logged in."
            redirect(controller: 'home', model: [error: flash.message])
        } else {
            log.debug('Viewing my dashboard :  ' + user)
            def userData = assembleUserData(user)
            return userData
        }
    }

    protected Map assembleUserData(user) {
        def memberOrganisations = userService.getOrganisationsForUserId(user.userId)
        def memberProjects = userService.getProjectsForUserId(user.userId)
        def starredProjects = userService.getStarredProjectsForUserId(user.userId)
        def programs = userService.getProgramsForUserId(user.userId)?.sort({it.name})
        def managementUnits = userService.getManagementUnitsForUserId(user.userId)?.sort({it.name})

        Map userData = [
                user: user,
                memberProjects: memberProjects,
                memberOrganisations:memberOrganisations,
                memberPrograms:programs,
                memberManagementUnits:managementUnits,
                starredProjects: starredProjects]

        def reportsByProject = reportService.findReportsForUser(user.userId)

        userData.memberProjects = userData.memberProjects.findAll{it.project.isMERIT == true}
        def projects = userData.memberProjects
        projects.each { project ->
            project.project.reports = reportsByProject[project.project.projectId]? new JSONArray(reportsByProject[project.project.projectId]):new JSONArray()
        }

        userData.allowProjectRecommendation = userService.userIsSiteAdmin()
        userData
    }

    // webservices

    /**
     * Add userId with role to requested projectId
     *
     * @return
     */
    def addUserAsRoleToProject() {
        String userId = params.userId
        String projectId = params.entityId
        String role = params.role

        if (userId && projectId && role) {
            Map response = userService.addUserAsRoleToProject(userId, projectId, role)
            if (response.error) {
                render status: 400, text: response.error
            } else {
                render response as JSON
            }
        } else {
            render status:400, text: 'Required params not provided: userId, role, projectId'
        }
    }

    def addUserAsRoleToOrganisation() {
        String userId = params.userId
        String organisationId = params.entityId
        String role = params.role

        if (userId && organisationId && role) {
            Map result = organisationService.addUserAsRoleToOrganisation(userId, organisationId, role) as JSON
            if (result.error) {
                render status:400, text: result.error
            }
            else {
                render result as JSON
            }
        } else {
            render status:400, text: 'Required params not provided: userId, role, projectId'
        }
    }

    /**
     * Remove userId with role from requested projectId
     *
     * @return
     */
    def removeUserWithRoleFromProject() {
        String userId = params.userId
        String role = params.role
        String projectId = params.entityId
        def adminUser = authService.userDetails()

        if (adminUser && projectId && role && userId) {
            if (projectService.isUserAdminForProject(adminUser.userId, projectId)) {
                render userService.removeUserWithRole(projectId, userId, role) as JSON
            } else {
                render status:403, text: 'Permission denied'
            }
        } else {
            render status:400, text: 'Required params not provided: userId, projectId, role'
        }
    }

    /**
     * Remove userId with role from requested organisationId
     *
     * @return
     */
    def removeUserWithRoleFromOrganisation() {
        String userId = params.userId
        String role = params.role
        String organisationId = params.entityId
        def adminUser = authService.userDetails()

        if (adminUser && organisationId && role && userId) {
            if (organisationService.isUserAdminForOrganisation(organisationId)) {
                render userService.removeUserWithRoleFromOrganisation(organisationId, userId, role) as JSON
            } else {
                render status:403, text: 'Permission denied'
            }
        } else {
            render status:400, text: 'Required params not provided: userId, organisationId, role'
        }
    }

    /**
     * Check if an email address exists in AUTH and return the userId (number) if true,
     * otherwise return an empty String
     *
     * @return userId
     */
    def checkEmailExists() {
        String email = params.email

        if (email) {
            render userService.checkEmailExists(email) ?: ""
        } else {
            render status:400, text: 'Required param not provided: email'
        }
    }

    def getMembersOfProgram(String id) {
        String userId = userService.getCurrentUserId()

        if (id && userId) {
            if (userService.userIsSiteAdmin() || userService.isUserAdminForProgram(userId, id) || userService.isUserGrantManagerForProgram(userId, id)) {
                Map result = userService.getMembersOfProgram(id)
                List members = result?.members ?: []
                render members as JSON
            } else {
                render status: 403, text: 'Permission denied'
            }
        } else if (userId) {
            render status: 400, text: 'Required params not provided: id'
        } else if (id) {
            render status: 403, text: 'User not logged-in or does not have permission'
        } else {
            render status: 500, text: 'Unexpected error'
        }
    }

    def getMembersOfManagementUnit(String id) {
        String userId = userService.getCurrentUserId()

        if (id && userId) {
            if (userService.userIsSiteAdmin() || userService.isUserAdminForManagementUnit(userId, id) || userService.isUserGrantManagerForManagementUnit(userId, id) ||
                    userService.userHasReadOnlyAccess()) {
                Map result = userService.getMembersOfManagementUnit(id)
                List members = result?.members ?: []
                render members as JSON
            } else {
                render status: 403, text: 'Permission denied'
            }
        } else if (userId) {
            render status: 400, text: 'Required params not provided: id'
        } else if (id) {
            render status: 403, text: 'User not logged-in or does not have permission'
        } else {
            render status: 500, text: 'Unexpected error'
        }
    }

    def getMembersOfHub() {
        def adminUserId = userService.getCurrentUserId()
        HubSettings hubSettings = SettingService.getHubConfig()

        if (adminUserId) {
            if (userService.userIsAlaOrFcAdmin()) {
                def results = userService.getByHub(params.id)
                render results as JSON
            } else {
                render status: 403, text: 'Permission denied'
            }
        } else if (!adminUserId) {
            render status: 400, text: 'Required params not provided: id'
        }  else {
            render status: 500, text: 'Unexpected error'
        }
    }

    def getMembersForHubPaginated() {

        String hubId = params.id
        String email = params.get('search[value]')
        def adminUserId = userService.getCurrentUserId()

        def userDetails = authService.getUserForEmailAddress(email)
        String userId = userDetails?.userId ?: email
        if (hubId && adminUserId) {
            if (userService.userIsAlaOrFcAdmin()) {
                def results = userService.getMembersForHubPerPage(hubId, params.int('start'), params.int('length'), userId)
                asJson results

            } else {
                response.sendError(SC_FORBIDDEN, 'Permission denied')
            }
        } else if (adminUserId && hubId) {
            response.sendError(SC_BAD_REQUEST, 'Required params not provided: id')
        } else {
            response.sendError(SC_INTERNAL_SERVER_ERROR, 'Unexpected error')
        }
    }

    def asJson(json) {
        render(contentType: 'application/json', text: json as JSON)
    }

    def addUserToHub() {
        String userId = params.userId
        String role = params.role

        if (userId && role) {
            if (userService.userIsAlaOrFcAdmin()) {
                Map response = userService.saveHubUser(params)
                if (response.error) {
                    render status: 400, text: response.error
                } else {
                    render response as JSON
                }
            } else {
                render status:403, text: 'Permission denied'
            }
        } else {
            render status:400, text: 'Required params not provided: userId, role'
        }
    }

    def removeUserWithHubRole() {
        String userId = params.userId
        String hubId = params.entityId

        if (hubId && userId) {
            if (userService.userIsAlaOrFcAdmin()) {
                Map response = userService.removeHubUser(params)
                if (response.error) {
                    render status: 400, text: response.error
                } else {
                    flash.message = "user was removed."
                    render response as JSON
                }
            } else {
                render status:403, text: 'Permission denied'
            }
        } else {
            render status:400, text: 'Required params not provided: userId, projectId, role'
        }
    }




}

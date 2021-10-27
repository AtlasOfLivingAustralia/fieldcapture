package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.grails.web.json.JSONArray

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
            println response
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
            if (userService.userIsSiteAdmin() || userService.isUserAdminForManagementUnit(userId, id) || userService.isUserGrantManagerForManagementUnit(userId, id)) {
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
        println params: params
        String hubId = params.id
        def adminUserId = userService.getCurrentUserId()

        if (hubId && adminUserId) {
            if (authService.userInRole(grailsApplication.config.getProperty('security.cas.adminRole'))) {
                /* HubSettings can't be used to reflect list values as it caches the results
                HubSettings hubSettings = SettingService.getHubConfig()
                render hubSettings.userPermissions as JSON*/
                def results = userService.getByHub(hubId)
                render results as JSON
            } else {
                render status: 403, text: 'Permission denied'
            }
        } else if (adminUserId) {
            render status: 400, text: 'Required params not provided: id'
        } else if (projectId) {
            render status: 403, text: 'User not logged-in or does not have permission'
        } else {
            render status: 500, text: 'Unexpected error'
        }
    }

    def addUserToHub() {
        String userId = params.userId
        String hubId = params.entityId
        String role = params.role
        def adminUser = authService.userDetails()

        if (userId && hubId && role) {
            Map response = userService.addUserToHub(userId, hubId, role)
            if (response.error) {
                render status: 400, text: response.error
            } else {
                render response as JSON
            }
        } else {
            render status:400, text: 'Required params not provided: userId, role, projectId'
        }
    }

    def removeUserWithHubRole() {
        String userId = params.userId
        String role = params.role
        String hubId = params.entityId
        def adminUser = authService.userDetails()

        if (adminUser && hubId && role && userId) {
            if (authService.userInRole(grailsApplication.config.getProperty('security.cas.adminRole'))) {
                render userService.removeHubUser(hubId, userId, role) as JSON
            } else {
                render status:403, text: 'Permission denied'
            }
        } else {
            render status:400, text: 'Required params not provided: userId, projectId, role'
        }
    }




}

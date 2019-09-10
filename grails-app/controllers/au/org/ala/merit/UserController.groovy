package au.org.ala.merit

import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONArray

/**
 * Extends the UserController to add report information.
 */
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
     * Get a list of projects and roles for a given userId
     *
     * @return
     */
    def viewPermissionsForUserId() {
        String userId = params.userId

        if (authService.userDetails() && (authService.userInRole(grailsApplication.config.security.cas.alaAdminRole) || authService.userInRole(grailsApplication.config.security.cas.officerRole)) && userId) {
            render userService.getProjectsForUserId(userId) as JSON
        } else if (!userId) {
            render status:400, text: 'Required params not provided: userId, role, projectId'
        } else {
            render status:403, text: 'Permission denied'
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
            render userService.checkEmailExists(email)
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




}

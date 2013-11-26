package au.org.ala.fieldcapture

import grails.converters.JSON

/**
 * Controller to display User page (My Profile) as well as some webservices
 */
class UserController {
    def userService, authService, projectService

    /**
     * Default view for user controller - show user dashboard page.
     *
     * @return
     */
    def index() {
        def user = userService.getUser()
        if (!user) {
            [error: "Logged in user not found (user = null)"]
        } else {
            log.debug('Viewing my dashboard :  ' + user)
            assembleUserData(user)
        }
    }

    private assembleUserData(user) {
        def recentEdits = userService.getRecentEditsForUserId(user.userId)
        def memberProjects = userService.getProjectsForUserId(user.userId)
        def starredProjects = userService.getStarredProjectsForUserId(user.userId)
        [user: user, recentEdits: recentEdits, memberProjects: memberProjects, starredProjects: starredProjects]
    }

    @PreAuthorise(accessLevel = 'admin', redirectController = "home", projectIdParam = "projectId")
    def show(String id) {
        if (id) {
            def user = userService.getUserForUserId(id)

            if (user) {
                render view: "index", model: assembleUserData(user)
            } else {
                flash.message = "No user found for id: ${id}"
                redirect(controller: 'home')
            }
        } else {
            flash.message = "No user id specified"
            forward(controller: 'home')
        }
    }

    // webservices

    /**
     * Add userId with role to requested projectId
     *
     * @return
     */
    def addUserAsRoleToProject() {
        String userId = params.userId
        String projectId = params.projectId
        String role = params.role
        //def user = authService.userDetails()

        if (userId && projectId && role) {
            if (role == 'caseManager' && !userService.userIsSiteAdmin()) {
                render status:403, text: 'Permission denied - ADMIN role required'
            } else if (projectService.isUserAdminForProject(userId, projectId)) {
                render userService.addUserAsRoleToProject(userId, projectId, role) as JSON
            } else {
                render status:403, text: 'Permission denied'
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
    def removeUserWithRole() {
        String userId = params.userId
        String role = params.role
        String projectId = params.projectId

        if (projectId && role && userId) {
            render userService.removeUserWithRole(projectId, userId, role) as JSON
        } else {
            render status:400, text: 'Required params not provided: userId, projectId, role'
        }
    }

    /**
     * Get a list of projects and roles for a given userId
     *
     * @return
     */
    def viewPermissionsForUserId() {
        String userId = params.userId

        if (authService.userDetails() && (authService.userInRole(grailsApplication.config.security.cas.alaAdminRole) || authService.userInRole(grailsApplication.config.security.cas.adminRole)) && userId) {
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

}

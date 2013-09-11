package au.org.ala.fieldcapture

import grails.converters.JSON

/**
 * Controller to display User page (My Profile) as well as some webservices
 */
class UserController {
    def userService, authService

    def index() {
        def user = userService.getUser()
        if (!user) {
            [error: "Logged in user not found (user = null)"]
        } else {
            log.debug('Viewing my dashboard :  ' + user)
            def recentEdits = userService.getRecentEditsForUserId(user.userId)
            def memberProjects = userService.getProjectsForUserId(user.userId)
            def starredProjects = userService.getStarredProjectsForUserId(user.userId)
            [user: user, recentEdits: recentEdits, memberProjects: memberProjects, starredProjects: starredProjects]
        }
    }

    // webservices

    /**
     *
     *
     * @return
     */
    def addUserAsRoleToProject() {
        String userId = params.userId
        String projectId = params.projectId
        String role = params.role
        def user = authService.userDetails()

        if (user && (authService.userInRole("ROLE_ADMIN") || authService.userInRole("ROLE_FC_ADMIN")) && userId && projectId && role) {
            render userService.addUserAsRoleToProject(userId, projectId, role) as JSON
        } else {
            render status:400, text: 'Required params not provided: userId, role, projectId'
        }
    }

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

    def viewPermissionsForUserId() {
        String userId = params.userId

        if (authService.userDetails() && (authService.userInRole("ROLE_ADMIN") || authService.userInRole("ROLE_FC_ADMIN")) && userId) {
            render userService.getProjectsForUserId(userId) as JSON
        } else if (!userId) {
            render status:400, text: 'Required params not provided: userId, role, projectId'
        } else {
            render status:403, text: 'Permission denied'
        }
    }

}

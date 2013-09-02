package au.org.ala.fieldcapture

import grails.converters.JSON

class UserController {
    def userService

    def index() {
        def user = userService.getUser()
        log.debug('Viewing my dashboard :  ' + user)
        def recentProjects = userService.getRecentProjectsForUserId(user.userId)
        def memberProjects = userService.getProjectsForUserId(user.userId)
        [user: user, recentProjects: recentProjects, memberProjects: memberProjects]
    }

    // webservices

    def isProjectStarredByUser() {
        String userId = params.userId
        String projectId = params.projectId

        if (userId && projectId) {
            render userService.isProjectStarredByUser(userId, projectId)
        } else {
            render status:400, text: 'Required params not provided: userId, projectId'
        }
    }
}

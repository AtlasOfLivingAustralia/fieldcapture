package au.org.ala.fieldcapture

import grails.converters.JSON

/**
 * Controller to display User page (My Profile) as well as some webservices
 */
class UserController {
    def userService

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


}

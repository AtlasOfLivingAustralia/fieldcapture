package au.org.ala.merit

import org.codehaus.groovy.grails.web.json.JSONArray

/**
 * Extends the UserController to add report information.
 */
class UserController extends au.org.ala.fieldcapture.UserController {

    ReportService reportService

    protected Map assembleUserData(user) {

        def userData = super.assembleUserData(user)
        def reportsByProject = reportService.findReportsForUser(user.userId)

        userData.memberProjects = userData.memberProjects.findAll{it.project.isMERIT == true}
        def projects = userData.memberProjects
        projects.each { project ->
            project.project.reports = reportsByProject[project.project.projectId]? new JSONArray(reportsByProject[project.project.projectId]):new JSONArray()
        }

        userData.allowProjectRecommendation = userService.userIsSiteAdmin()
        userData
    }


}

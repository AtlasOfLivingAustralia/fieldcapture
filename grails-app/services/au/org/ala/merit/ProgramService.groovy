package au.org.ala.merit
/**
 * Extends the plugin ProgramService to provide Green Army reporting capability.
 */
class ProgramService {


    def grailsApplication, webService, metadataService, projectService, userService, searchService, activityService, emailService, reportService, documentService

    /** Overrides the parent to add Green Army reports to the results */
    def get(String id, view = '') {

        String url = "${grailsApplication.config.ecodata.baseUrl}program/$id?view=$view"
        Map program = webService.getJson(url)

        def projects = []
        def resp = projectService.search(programId: id, isMERIT:true, view:'enhanced')
        if (resp?.resp?.projects) {
            projects += resp.resp.projects
        }

        program.projects = projects
        program
    }

    def update(id, Program) {
        def url = "${grailsApplication.config.ecodata.baseUrl}program/$id"
        def result = webService.doPost(url, Program)
        result
    }

    def isUserAdminForProgram(ProgramId) {
        def userIsAdmin

        if (!userService.user) {
            return false
        }
        if (userService.userIsSiteAdmin()) {
            userIsAdmin = true
        } else {
            userIsAdmin = userService.isUserAdminForProgram(userService.user.userId, ProgramId)
        }

        userIsAdmin
    }

    def isUserGrantManagerForProgram(ProgramId) {
        def userIsAdmin

        if (!userService.user) {
            return false
        }
        if (userService.userIsSiteAdmin()) {
            userIsAdmin = true
        } else {
            userIsAdmin = userService.isUserGrantManagerForProgram(userService.user.userId, ProgramId)
        }

        userIsAdmin
    }

    /**
     * Get the list of users (members) who have any level of permission for the requested ProgramId
     *
     * @param ProgramId the ProgramId of interest.
     */
    def getMembersOfProgram(ProgramId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/getMembersForProgram/${ProgramId}"
        webService.getJson(url)
    }

    /**
     * Adds a user with the supplied role to the identified Program.
     * Adds the same user with the same role to all of the Program's projects.
     *
     * @param userId the id of the user to add permissions for.
     * @param ProgramId the Program to add permissions for.
     * @param role the role to assign to the user.
     */
    def addUserAsRoleToProgram(String userId, String ProgramId, String role) {

        def Program = get(ProgramId, 'flat')
        def resp = userService.addUserAsRoleToProgram(userId, ProgramId, role)
        Program.projects.each { project ->
            if (project.isMERIT) {
                userService.addUserAsRoleToProject(userId, project.projectId, role)
            }
        }
        resp
    }

    /**
     * Removes the user access with the supplied role from the identified Program.
     * Removes the same user from all of the Program's projects.
     *
     * @param userId the id of the user to remove permissions for.
     * @param ProgramId the Program to remove permissions for.

     */
    def removeUserWithRoleFromProgram(String userId, String ProgramId, String role) {
        def Program = get(ProgramId, 'flat')
        userService.removeUserWithRoleFromProgram(userId, ProgramId, role)
        Program.projects.each { project ->
            if (project.isMERIT) {
                userService.removeUserWithRole(project.projectId, userId, role)
            }
        }
    }

    def search(Integer offset = 0, Integer max = 100, String searchTerm = null, String sort = null) {
        Map params = [
                offset:offset,
                max:max,
                query:searchTerm,
                fq:"className:au.org.ala.ecodata.Program"
        ]
        if (sort) {
            params.sort = sort
        }
        def results = searchService.fulltextSearch(
                params, false
        )
        results
    }

}

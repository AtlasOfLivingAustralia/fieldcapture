package au.org.ala.merit


import au.org.ala.web.AuthService
import grails.converters.JSON

/**
 * Processes requests relating to programs
 */
class ProgramController {

    static allowedMethods = [ajaxDelete: "POST", delete: "POST", ajaxUpdate: "POST"]

    def programService, searchService, documentService, userService, roleService, commonService, webService
    ProjectService projectService
    AuthService authService

    // Simply forwards to the list view
    def list() {}

    def index(String id) {
        def program = programService.get(id)

        if (!program || program.error) {
            programNotFound(id, program)
        } else {
            def roles = roleService.getRoles()
            // Get dashboard information for the response.

            Map members = userService.getMembersOfProgram(id).members ?: [:]
            def user = userService.getUser()
            def userId = user?.userId

            String orgRole = members.find { it.userId == userId }

            [program  : program,
             //dashboard     : dashboard,
             roles         : roles,
             user          : user,
             isAdmin       : orgRole?.role == RoleService.PROJECT_ADMIN_ROLE,
             isGrantManager: orgRole?.role == RoleService.GRANT_MANAGER_ROLE,
             content       : content(program)]
        }
    }

    protected Map content(Map program) {

        def user = userService.getUser()
        def members =[] //programService.getMembersOfOrganisation(program.programId)
        def role = members.find { it.userId == user?.userId } ?: [:]
        def hasAdminAccess = userService.userIsAlaOrFcAdmin() || role.role == RoleService.PROJECT_ADMIN_ROLE

        def hasViewAccess = hasAdminAccess || userService.userHasReadOnlyAccess() || role.role == RoleService.PROJECT_EDITOR_ROLE

        Map result = projectService.search(programId:program.programId)
        List projects = result.resp?.projects


        [about   : [label: 'Management Unit', visible: true, stopBinding: false, type: 'tab'],
         projects: [label: 'Work Order', visible: true, stopBinding: false, type:'tab', projects:projects],
         sites   : [label: 'Sites', visible: true, stopBinding: true, type:'tab'],
         admin   : [label: 'Admin', visible: hasAdminAccess, type: 'tab']]
    }

    def create() {
        [program: [:], isNameEditable:true]
    }

    def edit(String id) {
        Map program = programService.get(id)


        if (!program || program.error) {
            programNotFound(id, program)
        } else {
            [program: program, isNameEditable:true]
        }
    }

    def delete(String id) {
        if (userService.isUserAdminForProgram(id)) {
            programService.update(id, [status: 'deleted'])
        } else {
            flash.message = 'You do not have permission to perform that action'
        }
        redirect action: 'list'
    }

    def ajaxDelete(String id) {

        if (userService.isUserAdminForProgram(id)) {
            def result = programService.update(id, [status: 'deleted'])

            respond result
        } else {
            render status: 403, text: 'You do not have permission to perform that action'
        }
    }

    def ajaxUpdate() {
        def programDetails = request.JSON

        def documents = programDetails.remove('documents')
        def links = programDetails.remove('links')

        String programId = programDetails?.programId ?: ''
        Map result = programService.update(programId, programDetails)

        programId = programId ?: result.resp?.programId
        if (documents && !result.error) {
            documents.each { doc ->
                doc.programId = programId
                documentService.saveStagedImageDocument(doc)
            }
        }
        if (links && !result.error) {
            links.each { link ->
                link.programId = programId
                documentService.saveLink(link)
            }
        }

        if (result.error) {
            render result as JSON
        } else {
            render result.resp as JSON
        }
    }

    /**
     * Responds with a download of a zipped shapefile containing all sites used by projects run
     * by an organisation.
     * @param id the organisationId of the organisation.
     */
    def downloadShapefile(String id) {

        def userId = userService.getCurrentUserId()

        if (id && userId) {
            if (programService.isUserAdminForOrganisation(id) || programService.isUserGrantManagerForOrganisation(id)) {
                def organisation = programService.get(id)
                def params = [fq: 'organisationFacet:' + organisation.name, query: "docType:project"]

                def url = grailsApplication.config.ecodata.service.url + '/search/downloadShapefile' + commonService.buildUrlParamsFromMap(params)
                def resp = webService.proxyGetRequest(response, url, true, true, 960000)
                if (resp.status != 200) {
                    render view: '/error', model: [error: resp.error]
                }
            } else {
                render status: 403, text: 'Permission denied'
            }
        } else {
            render status: 400, text: 'Missing parameter organisationId'
        }
    }



    /**
     * Redirects to the home page with an error message in flash scope.
     * @param response the response that triggered this method call.
     */
    private void programNotFound(id, response) {
        flash.message = "No program found with id: ${id}"
        if (response?.error) {
            flash.message += "<br/>${response.error}"
        }
        redirect(controller: 'home', model: [error: flash.message])
    }

    def search(Integer offset, Integer max, String searchTerm, String sort) {
        render programService.search(offset, max, searchTerm, sort) as JSON
    }

}

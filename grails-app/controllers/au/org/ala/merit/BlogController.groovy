package au.org.ala.merit

import grails.converters.JSON
import org.geotools.util.UnsupportedImplementationException

import static org.apache.http.HttpStatus.*

class BlogController {

    static allowedMethods = [create: "GET", edit: "GET", update: "POST", delete: "POST"]

    BlogService blogService
    DocumentService documentService
    UserService userService
    ProjectService projectService
    ProgramService programService

    def create() {
        if (params.projectId) {
            render view: 'create', model: [blogEntry: [projectId: params.projectId]]
        } else if (params.programId) {
            render view: 'create', model: [blogEntry: [programId: params.programId]]
        }
    }

    def edit(String id) {
        if (!id) {
            render status: 400, text: "id is a required parameter"
            return
        }
        String projectId = params.projectId
        String programId = params.programId
        if (projectId) {
            if (!authorizedProject(projectId)) {
                flash.message = "You do not have permission to edit the blog"
                if (projectId) {
                    redirect(controller: 'project', action: 'index', id: projectId)
                } else {
                    redirect(controller: 'home', action: 'publicHome')
                }
            } else {
                Map blogEntry = blogService.get(projectId, id)
                render view: 'edit', model: [blogEntry: blogEntry]
            }
        } else if (programId) {
            if (!authorizedProgram(programId)) {
                flash.message = "You do not have permission to edit the blog"
                if (programId) {
                    redirect(controller: 'program', action: 'index', id: programId)
                } else {
                    redirect(controller: 'home', action: 'publicHome')
                }
            } else {
                Map blogEntry = blogService.get(programId, id, BlogType.PROGRAM)
                render view: 'edit', model: [blogEntry: blogEntry]
            }
        }

    }

    private boolean authorizedSite() {
        return userService.userIsSiteAdmin()
    }

    private boolean authorizedProject(String projectId) {
        return projectService.canUserEditProject(userService.user?.userId, projectId)
    }

    private boolean authorizedProgram(String programId) {
        //To check permission on program
        if (userService.isUserGrantManagerForProgram(userService.user?.userId, programId) ||
                userService.isUserEditorForProgram(userService.user?.userId, programId) ||
                userService.isUserAdminForProgram(userService.user?.userId, programId))
            return true;
        else
            return false;
    }

    def update(String id) {
        Map blogEntry = request.JSON
        if (blogEntry.projectId) {
            String projectId = blogEntry.projectId

            if (!authorizedProject(projectId)) {
                render status: SC_UNAUTHORIZED, text: "No permission"
            } else {
                Map image = blogEntry.remove('image')

                def result
                if (image) {
                    image.projectId = blogEntry.projectId
                    image.name = blogEntry.title
                    image.public = true
                    result = documentService.saveStagedImageDocument(image)

                    if (result.statusCode == SC_OK) {
                        blogEntry.imageId = result.resp.documentId
                    }
                }
                result = blogService.update(id, blogEntry)
                Map response = [status: result.status]
                render response as JSON
            }
        } else if (blogEntry.programId) {
            String programId = blogEntry.programId

            if (!authorizedProgram(programId)) {
                render status: SC_UNAUTHORIZED, text: "No permission"
            } else {
                Map image = blogEntry.remove('image')
                def result
                if (image) {
                    image.programId = blogEntry.programId
                    image.name = blogEntry.title
                    image.public = true
                    result = documentService.saveStagedImageDocument(image)

                    if (result.statusCode == SC_OK) {
                        blogEntry.imageId = result.resp.documentId
                    }
                }
                result = blogService.update(id, blogEntry)
                Map response = [status: result.status]
                render response as JSON
            }
        } else {
            if (!authorizedSite()) {
                render status: SC_UNAUTHORIZED, text: "No permission"
            } else {
                throw new UnsupportedOperationException('Function has not been implemented!')
            }
        }


    }

    def delete(String id) {
        if (!id) {
            render status: 400, text: "id is a required parameter"
            return
        }
        if (params.projectId) {
            String projectId = params.projectId
            if (!authorizedProject(projectId)) {
                render status: SC_UNAUTHORIZED, text: "No permission"
            } else {
                def result = blogService.delete(projectId, id, BlogType.PROJECT)
                render result as JSON
            }
        } else if (params.programId) {
            String programId = params.programId
            if (!authorizedProgram(programId)) {
                render status: SC_UNAUTHORIZED, text: "No permission"
            } else {
                def result = blogService.delete(programId, id, BlogType.PROGRAM)
                render result as JSON
            }
        } else { //Delete blog of site
            if (!authorizedSite()) {
                render status: SC_UNAUTHORIZED, text: "No permission"
            } else {
                def result = blogService.delete(null, id, BlogType.SITE)
                render result as JSON
            }
        }
    }
}

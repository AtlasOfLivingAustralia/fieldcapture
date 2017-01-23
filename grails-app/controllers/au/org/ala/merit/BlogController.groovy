package au.org.ala.merit

import au.org.ala.fieldcapture.DocumentService
import au.org.ala.fieldcapture.UserService
import grails.converters.JSON
import org.apache.commons.httpclient.HttpStatus

import static org.apache.commons.httpclient.HttpStatus.*

class BlogController {

    static allowedMethods = [create: "GET", edit: "GET", update: "POST", delete:"POST"]

    BlogService blogService
    DocumentService documentService
    UserService userService
    ProjectService projectService

    def create() {
        render view:'create', model:[blogEntry:[projectId:params.projectId]]
    }

    def edit(String id) {
        if (!id) {
            render status:400, text:"id is a required parameter"
            return
        }
        String projectId = params.projectId
        if (!authorized(projectId)) {
            flash.message = "You do not have permission to edit the blog"
            if (projectId) {
                redirect(controller:'project', action: 'index', id: projectId)
            }
            else {
                redirect(controller:'home', action:'publicHome')
            }
        }
        else {
            Map blogEntry = blogService.get(projectId, id)
            render view: 'edit', model: [blogEntry: blogEntry]
        }
    }

    private boolean authorized(String projectId) {

        if (!projectId) {
            if (!userService.userIsSiteAdmin()) {
                return false
            }
        }
        else {
            if (!projectService.canUserEditProject(userService.user?.userId, projectId)) {
                return false
            }
        }
        return true
    }

    def update(String id) {
        if (!id) {
            render status:400, text:"id is a required parameter"
            return
        }
        Map blogEntry = request.JSON
        String projectId = blogEntry.projectId

        if (!authorized(projectId)) {
            render status: HttpStatus.SC_UNAUTHORIZED, text: "No permission"
        }
        else {
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
            Map response = [status:result.status]
            render response as JSON
        }
    }

    def delete(String id) {
        if (!id) {
            render status:400, text:"id is a required parameter"
            return
        }
        String projectId = params.projectId
        if (!authorized(projectId)) {
            render status: HttpStatus.SC_UNAUTHORIZED, text: "No permission"
        }
        else {
            def result = blogService.delete(params.projectId, id)
            render result as JSON
        }

    }
}

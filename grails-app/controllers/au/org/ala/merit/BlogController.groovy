package au.org.ala.merit

import au.org.ala.fieldcapture.DocumentService
import au.org.ala.fieldcapture.UserService
import grails.converters.JSON
import static org.apache.commons.httpclient.HttpStatus.*

class BlogController {

    BlogService blogService
    DocumentService documentService
    UserService userService
    ProjectService projectService

    def create() {
        render view:'create', model:[blogEntry:[projectId:params.projectId]]
    }

    def edit(String id) {
        String projectId = params.projectId
        Map blogEntry = blogService.get(projectId, id)
        render view:'edit', model:[blogEntry:blogEntry]
    }

    def update(String id) {
        Map blogEntry = request.JSON

        String projectId = blogEntry.projectId
        if (!projectId) {
            if (!userService.userIsSiteAdmin()) {
                render status: 401, text: "You don't have permission to save this blog entry."
                return
            }
        }
        else {

            if (!projectService.isUserAdminForProject(userService.user?.userId, projectId)) {
                render status: 401, text: "You don't have permission to make blog entries for this project."
                return
            }
        }

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

    def delete(String id) {

        def result = blogService.delete(params.projectId, id)

        chain controller: 'admin', action: 'editSiteBlog'
    }
}

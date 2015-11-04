package au.org.ala.merit

import au.org.ala.fieldcapture.DocumentService
import grails.converters.JSON
import static org.apache.commons.httpclient.HttpStatus.*

class BlogController {

    BlogService blogService
    DocumentService documentService

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

        Map image = blogEntry.remove('image')

        def result
        if (image) {
            image.projectId = blogEntry.projectId
            result = documentService.saveStagedImageDocument(image)

            if (result.status == SC_OK) {
                blogEntry.imageUrl = result.content.url
                result = blogService.update(id, blogEntry)
            }
        }
        Map response = [status:result.status]
        render response as JSON
    }
}

package au.org.ala.merit

import grails.converters.JSON
import org.apache.commons.io.FilenameUtils

import static org.apache.http.HttpStatus.SC_BAD_REQUEST
import static org.apache.http.HttpStatus.SC_OK;

class DocumentController {

    def grailsApplication, documentService, webService

    def index() {}

    def createLink() {
        def link = request.JSON
        documentService.saveLink(link)
    }

    def bulkUpdate() {
        def result = [:]
        def documents = request.JSON
        if (!documents || !documents instanceof List) {
            response.status = SC_BAD_REQUEST
            result.error = 'Request body must contain a json array of documents to update'
        }
        else {

            documents.each {
                def resp = documentService.updateDocument(it)
                if (resp.statusCode != SC_OK || result.error) {
                    response.staus = resp.statusCode
                    result.error = 'There was an error performing the update - please try again later'
                }
            }

        }
        render result as JSON
    }

    /**
     * Proxies to the ecodata document controller.
     * @param id the id of the document to update (if not supplied, a create operation will be assumed).
     * @return the result of the update.
     */
    def documentUpdate(String id) {

        def url = grailsApplication.config.ecodata.baseUrl + "document" + (id ? "/" + id : '')
        if (request.respondsTo('getFile')) {
            def f = request.getFile('files')
            def originalFilename = f.getOriginalFilename()
            if(originalFilename){
                def extension = FilenameUtils.getExtension(originalFilename)?.toLowerCase()
                if (extension && !grailsApplication.config.upload.extensions.blacklist.contains(extension)){
                    def result =  webService.postMultipart(url, [document:params.document], f)

                    // This is returned to the browswer as a text response due to workaround the warning
                    // displayed by IE8/9 when JSON is returned from an iframe submit.
                    response.setContentType('text/plain;charset=UTF8')
                    if (result.content) {
                        result = result.content
                    }
                    result = result as JSON
                    render result.toString()
                } else {
                    response.setStatus(SC_BAD_REQUEST)
                    //flag error for extension
                    def error = [error: "Files with the extension '.${extension}' are not permitted.",
                                 statusCode: "400",
                                 detail: "Files with the extension ${extension} are not permitted."] as JSON
                    response.setContentType('text/plain;charset=UTF8')
                    render error.toString()
                }
            } else {
                //flag error for extension
                response.setStatus(SC_BAD_REQUEST)
                def error = [error: "Unable to retrieve the file name.",
                             statusCode: "400",
                             detail: "Unable to retrieve the file name."] as JSON
                response.setContentType('text/plain;charset=UTF8')
                render error.toString()
            }
        } else {
            // This is returned to the browswer as a text response due to workaround the warning
            // displayed by IE8/9 when JSON is returned from an iframe submit.
            def result = documentService.updateDocument(JSON.parse(params.document))
            response.setContentType('text/plain;charset=UTF8')
            def resultAsText = (result as JSON).toString()
            render resultAsText
        }
    }

    /**
     * Proxies to the eco data document controller to delete the document with the supplied id.
     * @param id the id of the document to delete.
     * @return the result of the deletion.
     */
    def deleteDocument(String id) {
        def url = grailsApplication.config.ecodata.baseUrl + "document/" + id
        def responseCode = webService.doDelete(url)
        render status: responseCode
    }

    @PreAuthorise(accessLevel = "siteReadOnly")
    def downloadProjectDataFile() {
        if (!params.id) {
            response.setStatus(400)
            render "A download ID is required"
        } else {
            String fileExtension = params.fileExtension ?: 'xlsx'
            webService.proxyGetRequest(response, "${grailsApplication.config.ecodata.baseUrl}search/downloadProjectDataFile/${params.id}?fileExtension=${fileExtension}", true, true)
        }
    }
}

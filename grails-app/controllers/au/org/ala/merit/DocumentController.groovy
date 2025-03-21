package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.converters.JSON
import grails.core.GrailsApplication
import groovy.json.JsonSlurper
import org.apache.http.HttpStatus
import org.springframework.web.util.UriComponents
import org.springframework.web.util.UriComponentsBuilder
import org.springframework.web.util.UriUtils

import static org.apache.http.HttpStatus.SC_BAD_REQUEST
import static org.apache.http.HttpStatus.SC_OK;

class DocumentController {

    static allowedMethods = [bulkUpdate: 'POST', documentUpdate: 'POST', deleteDocument: 'POST', download: 'GET']

    static final String DOCUMENT_DOWNLOAD_PATH = 'document/download/'

    DocumentService documentService
    WebService webService
    GrailsApplication grailsApplication

    def index() {}

    def createLink() {
        def link = request.JSON
        documentService.saveLink(link)
    }

    @PreAuthorise(accessLevel = "siteAdmin")
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

        if (request.respondsTo('getFile')) {
            def f = request.getFile('files')
            def originalFilename = f.getOriginalFilename()
            if(originalFilename){
                Map document = new JsonSlurper().parseText(params.document)
                if (id) {
                    document.documentId = id
                }
                Map result = documentService.updateDocument(document, f.originalFilename, f.contentType, f.inputStream)
                if (result.statusCode == SC_OK) {
                    if (result.content) {
                        result = result.content
                    }
                    render result as JSON
                }
                else {
                    response.setStatus(result.statusCode)
                    render result as JSON
                }
            } else {
                //flag error for extension
                response.setStatus(SC_BAD_REQUEST)
                def error = [error: "Unable to retrieve the file name.",
                             statusCode: "400",
                             detail: "Unable to retrieve the file name."] as JSON
                render error as JSON
            }
        } else {
            // This is returned to the browswer as a text response due to workaround the warning
            // displayed by IE8/9 when JSON is returned from an iframe submit.
            def result = documentService.updateDocument(JSON.parse(params.document))
            render result as JSON
        }
    }

    /**
     * Proxies to the eco data document controller to delete the document with the supplied id.
     * @param id the id of the document to delete.
     * @return the result of the deletion.
     */
    def deleteDocument(String id) {
        def responseCode = documentService.delete(id)
        render status: responseCode
    }


    /** Downloads a the file attached to a document stored in the ecodata database */
    def download()  {
        final String THUMBNAIL_PREFIX = "thumb_"
        // The Grails population of "path" and "filename" perform URL decoding early and
        // hence will incorrectly detect an encoded ? (%3F) as the query delimiter resulting
        // in files containing a ? not being able to be displayed.
        // Hence we deconstruct the path here to get the path and filename.
        Tuple pathAndFilename = parsePathAndFilenameFromURL(
                request.requestURI, request.getCharacterEncoding())
        String path = pathAndFilename?.getFirst()
        String filename = pathAndFilename?.getSecond()
        if (filename) {
            String originalName = filename
            if (filename.startsWith(THUMBNAIL_PREFIX)) {
                originalName = filename.substring(THUMBNAIL_PREFIX.length())
            }
            Map results = documentService.search(filepath: path, filename: originalName)
            if (results && results.documents) {
                Map document = results.documents[0]

                if (documentService.canView(document)) {
                    String url = buildDownloadUrl(path, filename)
                    webService.proxyGetRequest(response, url, false, true)
                    return null
                }
            }
        }
        response.status = HttpStatus.SC_NOT_FOUND
    }

    protected String buildDownloadUrl(String path, String filename) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + DOCUMENT_DOWNLOAD_PATH
        if (path) {
            url += path + '/'
        }
        url += UriUtils.encodePath(filename, "UTF-8")

        url
    }

    protected Tuple2 parsePathAndFilenameFromURL(String uri, String encoding) {
        UriComponents uriComponents = UriComponentsBuilder.fromUriString(uri).build()
        List pathSegments = uriComponents.getPathSegments()

        String path
        String filename
        // Path segment 0 & 1 will be "document" & "download"
        if (pathSegments.size() == 3) {
            path = null
            filename = pathSegments[2]
        }
        else if (pathSegments.size() == 4) {
            path = pathSegments[2]
            filename = pathSegments[3]
        }
        else {
            return null
        }
        filename = UriUtils.decode(filename, encoding?:"UTF-8")
        new Tuple2(path, filename)
    }

    @PreAuthorise(accessLevel = "siteAdmin")
    def addHubDocumentCategory(String category) {
        if (!category) {
            response.status = SC_BAD_REQUEST
            return
        }
        HubSettings settings = SettingService.getHubConfig()
        if (!settings.helpDocumentCategories) {
            settings.helpDocumentCategories = []
        }
        if (!settings.helpDocumentCategories.contains(category)) {
            settings.helpDocumentCategories.add(category)
            SettingService.updateHubSettings(settings)
        }
        respond settings.helpDocumentCategories
    }
}

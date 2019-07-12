package au.org.ala.merit

import grails.converters.JSON
import org.springframework.cache.annotation.Cacheable

import static org.apache.http.HttpStatus.SC_OK;

/**
 * Proxies to the ecodata DocumentController/DocumentService.
 */
class DocumentService {
    private static final String HELP_DOCUMENTS_CACHE_REGION = 'homePageDocuments'

    public static final String TYPE_LINK = "link"
    public static final String ROLE_LOGO = "logo"

    def webService, grailsApplication

    def get(String id) {
        def url = "${grailsApplication.config.ecodata.baseUrl}document/${id}"
        return webService.getJson(url)
    }

    def delete(String id) {
        def url = "${grailsApplication.config.ecodata.baseUrl}document/${id}"
        return webService.doDelete(url)
    }


    def createTextDocument(doc, content) {
        doc.content = content
        updateDocument(doc)
    }

    @Cacheable(DocumentService.HELP_DOCUMENTS_CACHE_REGION)
    def findAllHelpResources() {
        def url = "${grailsApplication.config.ecodata.baseUrl}document/search"
        def result = webService.doPost(url, [role:'helpResource'])
        if (result.statusCode == SC_OK) {
            return result.resp.documents
        }
        return []
    }

    def updateDocument(doc) {
        def url = "${grailsApplication.config.ecodata.baseUrl}document/${doc.documentId?:''}"

        return webService.doPost(url, doc)
    }

    def updateDocument(doc, contentType, inputStream) {
        def url = grailsApplication.config.ecodata.baseUrl + "document"
        if (doc.documentId) {
            url+="/"+doc.documentId
        }
        def params = [document:doc as JSON]
        return webService.postMultipart(url, params, inputStream, contentType, doc.filename)
    }

    def createDocument(doc, contentType, inputStream) {
        updateDocument(doc, contentType, inputStream)
    }

    def getDocumentsForSite(id) {
        def url = "${grailsApplication.config.ecodata.baseUrl}site/${id}/documents"
        return webService.doPost(url, [:])
    }

    /**
     * This method saves a document that has been staged (the image uploaded, but the document object not
     * created).  The purpose of this is to support atomic create / edits of objects that include document
     * references, e.g. activities containing photo point photos and organisations.
     * @param document the document to save.
     */
    def saveStagedImageDocument(document) {
        def result
        if (!document.documentId) {
            document.remove('url')
            File file = new File(grailsApplication.config.upload.images.path, document.filename)
            if (file.exists()) {
                // Create a new document, supplying the file that was uploaded to the ImageController.
                result = createDocument(document, document.contentType, new FileInputStream(file))
                if (!result.error) {
                    file.delete()
                }
            }
            else {
                result = updateDocument(document)
            }
        }
        else {

            // Just update the document.
            result = updateDocument(document)
        }
        result
    }

    def saveLink(link) {
        link.public = true
        link.type = "link"
        link.externalUrl = link.remove('url')
        updateDocument(link)
    }

    Map search(Map params) {
        def url = "${grailsApplication.config.ecodata.baseUrl}document/search"
        def resp = webService.doPost(url, params)
        if (resp && !resp.error) {
            return resp.resp
        }
        return resp
    }
}

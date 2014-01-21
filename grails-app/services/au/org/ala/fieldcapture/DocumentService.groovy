package au.org.ala.fieldcapture

/**
 * Proxies to the ecodata DocumentController/DocumentService.
 */
class DocumentService {

    def webService, grailsApplication

    def createTextDocument(doc, content) {
        def url = grailsApplication.config.ecodata.baseUrl + "document"
        doc.content = content
        return webService.doPost(url, doc)
    }
}

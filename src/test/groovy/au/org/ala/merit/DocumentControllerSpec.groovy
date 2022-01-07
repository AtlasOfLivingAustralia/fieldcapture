package au.org.ala.merit

import org.apache.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

class DocumentControllerSpec extends Specification implements ControllerUnitTest<DocumentController> {

    DocumentService documentService = Mock(DocumentService)
    WebService webService = Mock(WebService)

    def setup() {
        controller.documentService = documentService
        controller.webService = webService
        controller.grailsApplication = grailsApplication
    }

    def "updates will be delegated to the document service"() {

        setup:
        MockMultipartFile file = new MockMultipartFile("files", "originalTest", "image/png", new byte[0])

        when:
        request.addFile(file)
        request.method = "POST"
        params.document = """{"documentId":"d1", "title":"test"}"""
        controller.documentUpdate("d1")


        then:
        1 * documentService.updateDocument([documentId:'d1', title:'test'], "originalTest", "image/png", _) >> [resp:[:], statusCode: HttpStatus.SC_OK]
        response.json == [resp:[:], statusCode: HttpStatus.SC_OK]
    }

    def "document updates must be POSTs"(String method) {

        when:
        request.method = method
        controller.documentUpdate("d1")

        then:
        response.status == HttpStatus.SC_METHOD_NOT_ALLOWED

        where:

        method | _
        'GET' | _
        'PUT' | _
        'DELETE' | _
        'PATCH' | _
    }

    def "The document controller will ensure a document exists and the user has permission to view it before facilitating the download"() {
        setup:
        Map document = [documentId:'d1']

        when:
        def resp = controller.download("path", "file.txt")

        then:
        1 * documentService.search(filepath:"path", filename:"file.txt") >> [count: 1, documents:[document]]
        1 * documentService.canView(document) >> true
        1 * webService.proxyGetRequest(response, {it.endsWith('document/download/path/file.txt')}, false, false)
        resp == null
    }

    def "The document controller understands the thumbnail prefix assigned to a document path"() {
        setup:
        Map document = [documentId:'d1']

        when:
        def resp = controller.download("path", "thumb_file.png")

        then:
        1 * documentService.search(filepath:"path", filename:"file.png") >> [count: 1, documents:[document]]
        1 * documentService.canView(document) >> true
        1 * webService.proxyGetRequest(response, {it.endsWith('document/download/path/thumb_file.png')}, false, false)
        resp == null
    }

    def "The document controller will return an error if no document matches the path requested for a download"() {

        when:
        controller.download("path", "file.txt")

        then:
        1 * documentService.search(filepath:"path", filename:"file.txt") >> [count: 0, documents:[]]
        0 * documentService._
        0 * webService._
        response.status == HttpStatus.SC_NOT_FOUND
    }

    def "The document controller will return an error if the user cannot view the document associated with the path requested for a download"() {
        setup:
        Map document = [documentId:'d1']

        when:
        controller.download("path", "file.txt")

        then:
        1 * documentService.search(filepath:"path", filename:"file.txt") >> [count: 1, documents:[document]]
        1 * documentService.canView(document) >> false
        0 * webService._
        response.status == HttpStatus.SC_NOT_FOUND
    }

    def "The DocumentController encodes filenames used in URLs as required"() {
        expect:
        controller.buildDownloadUrl("2018-01", "Test with spaces").endsWith("/document/download/2018-01/Test+with+spaces")
        controller.buildDownloadUrl(null, "test").endsWith("/document/download/test")
        controller.buildDownloadUrl(null, "a&test").endsWith("/document/download/a%26test")

    }

}

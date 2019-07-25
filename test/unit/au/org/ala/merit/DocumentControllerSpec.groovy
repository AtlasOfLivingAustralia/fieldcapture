package au.org.ala.merit

import grails.test.mixin.TestFor
import org.apache.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import spock.lang.Specification

@TestFor(DocumentController)
class DocumentControllerSpec extends Specification {

    DocumentService documentService = Mock(DocumentService)
    def setup() {
        controller.documentService = documentService
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

}

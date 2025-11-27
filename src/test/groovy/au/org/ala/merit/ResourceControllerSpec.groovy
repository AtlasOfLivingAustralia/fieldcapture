package au.org.ala.merit

import au.org.ala.ecodata.forms.EcpWebService
import grails.testing.web.controllers.ControllerUnitTest
import org.apache.http.HttpStatus
import spock.lang.Specification

class ResourceControllerSpec extends Specification implements ControllerUnitTest<ResourceController> {

    EcpWebService webService = Mock(EcpWebService)
    CommonService commonService = new CommonService()
    def setup() {
        controller.webService = webService
        controller.commonService = commonService
        grailsApplication.config.grails.serverURL = 'http://localhost'
        grailsApplication.config.pdfgen.baseURL = 'http://pdfgen/'
    }

    void "pdfUrl should call proxyGetRequest for valid absolute URL with valid domain"() {
        given:
        params.file = 'http://valid.com/doc.pdf'

        when:
        controller.pdfUrl()

        then:
        1 * webService.isValidDomain('valid.com') >> true
        1 * webService.proxyGetRequest(_, 'http://pdfgen/api/pdf?docUrl=http%3A%2F%2Fvalid.com%2Fdoc.pdf&cacheable=false', false, false, 10*60*1000) >> [status:200]
    }

    void "pdfUrl should prepend serverURL for non-absolute URL"() {
        given:
        params.file = '/doc.pdf'

        when:
        controller.pdfUrl()

        then:
        1 * webService.proxyGetRequest(_, 'http://pdfgen/api/pdf?docUrl=http%3A%2F%2Flocalhost%2Fdoc.pdf&cacheable=false', false, false, 10*60*1000) >> [status:200]
    }

    void "pdfUrl should render error view for invalid domain"() {
        given:
        params.file = 'http://invalid.com/doc.pdf'
        webService.isValidDomain(_) >> false

        when:
        controller.pdfUrl()

        then:
        response.status == HttpStatus.SC_BAD_REQUEST
        view == '/error'
    }

    void "pdfUrl should render error view for invalid URI"() {
        given:
        params.file = 'http://invalid^url'

        when:
        controller.pdfUrl()

        then:
        response.status == HttpStatus.SC_BAD_REQUEST
        view == '/error'
    }

    void "pdfUrl should render error view if proxyGetRequest returns error"() {
        given:
        params.file = 'http://valid.com/doc.pdf'
        webService.isValidDomain(_) >> true
        webService.proxyGetRequest(_, _, _, _, _) >> [error: "Error generating a PDF"]

        when:
        controller.pdfUrl()

        then:
        response.status == HttpStatus.SC_INTERNAL_SERVER_ERROR
        view == '/error'
    }

    void "pdfUrl should render error view if proxyGetRequest throws exception"() {
        given:
        params.file = 'http://valid.com/doc.pdf'
        webService.isValidDomain(_) >> true
        webService.proxyGetRequest(_, _, _, _, _) >> { throw new RuntimeException("fail") }

        when:
        controller.pdfUrl()

        then:
        view == '/error'
    }
}

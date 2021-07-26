package au.org.ala.merit

import org.apache.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

class DownloadControllerSpec extends Specification implements ControllerUnitTest<DownloadController>{

    WebService webService = Mock(WebService)
    def setup() {
        controller.webService = webService
    }

    def "The download controller proxies requests to ecodata"() {

        when:

        params.id = "uuid1234"
        def resp = controller.get()

        then:
        1 * webService.proxyGetRequest(_, {it.endsWith('download/uuid1234')}, true, true, _) >> [status:HttpStatus.SC_OK]

        and: "We return null to inform grails to not attempt to process a view as we are proxying a response from ecodata"
        resp == null
    }

    def "if no uuid is supplied, an error is returned"() {

        when:
        controller.get()

        then:
        response.status == HttpStatus.SC_BAD_REQUEST
    }

    def "Only some file formats are supported"(String format, boolean expectedFormatToBePassedToEcodata) {
        setup:
        boolean formatPassedToEcodata

        when:
        params.id = "file"
        params.format = format
        controller.get()

        then:
        1 * webService.proxyGetRequest(_, {it.contains('download/file')}, true, true, _) >> {
            resp, url, userId, apiKey, timeout ->
                formatPassedToEcodata = url.endsWith(format)
                [status:HttpStatus.SC_OK]
        }
        formatPassedToEcodata == expectedFormatToBePassedToEcodata

        where:
        format | expectedFormatToBePassedToEcodata
        'xlsx' | true // Most downloads
        'zip'  | true  // Shapefiles
        'json' | true // not used but potentially useful
        'exe'  | false
        'doc'  | false
        'html' | false
    }

}

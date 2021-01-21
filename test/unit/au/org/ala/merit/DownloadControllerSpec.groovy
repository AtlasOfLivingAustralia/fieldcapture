package au.org.ala.merit

import grails.test.mixin.TestFor
import org.apache.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import spock.lang.Specification

@TestFor(DownloadController)
class DownloadControllerSpec extends Specification {

    WebService webService = Mock(WebService)
    def setup() {
        controller.webService = webService
    }

    def "The download controller proxies requests to ecodata"() {

        when:

        params.id = "uuid1234"
        controller.get()

        then:
        1 * webService.proxyGetRequest(_, {it.endsWith('download/uuid1234')}, true, true, _) >> [status:HttpStatus.SC_OK]

    }

    def "if no uuid is supplied, an error is returned"() {

        when:
        controller.get()

        then:
        response.status == HttpStatus.SC_BAD_REQUEST
    }

}

package au.org.ala.merit

import grails.testing.services.ServiceUnitTest
import spock.lang.Specification

import javax.servlet.http.HttpServletResponse

class MonitorServiceSpec extends Specification implements ServiceUnitTest<MonitorService> {

    WebService webService = Mock(WebService)
    HttpServletResponse response = Mock(HttpServletResponse)
    CommonService commonService = new CommonService()
    def setup() {
        service.webService = webService
        service.commonService = commonService
    }

    void "the requestVoucherBarcodeLabels method delegates to the WebService"() {
        setup:
        String projectId = 'p1'
        int numPages = 1

        when:
        service.requestVoucherBarcodeLabels(projectId, numPages, response)

        then:
        1 * webService.proxyGetRequest(response, { it.contains(MonitorService.MONITOR_PLANT_LABEL_PATH)} , WebService.AUTHORIZATION_HEADER_TYPE_USER_BEARER_TOKEN)
    }
}

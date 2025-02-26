package au.org.ala.merit

import au.org.ala.ws.tokens.TokenService
import grails.testing.services.ServiceUnitTest
import spock.lang.Specification
import javax.servlet.http.HttpServletResponse

class BdrServiceSpec extends Specification implements ServiceUnitTest<BdrService> {

    def webService = Mock(WebService)
    def tokenService = Mock(TokenService)
    def commonService = Mock(CommonService)
    def bdrTokenService = Mock(BdrTokenService)
    def response = Mock(HttpServletResponse)

    def setup() {
        service.grailsApplication = grailsApplication
        service.webService = webService
        service.tokenService = tokenService
        service.commonService = commonService
        service.bdrTokenService = bdrTokenService
    }

    def "test downloadProjectDataSet"() {
        given:
        String projectId = "testProjectId"
        String format = "application/json"
        String fileName = "testFile"
        String query = '{"op":"and","args":[{"op":"=","args":[{"property":"https://schema.org/isPartOf","value":"https://linked.data.gov.au/dataset/bdr/testProjectId"}]},{"op":"=","args":[{"property":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","value":"http://www.opengis.net/ont/geosparql#Feature"}]}]}'
        String azureToken = "testAzureToken"
        String bdrBaseUrl = "http://example.com"
        String url = "$bdrBaseUrl/cql?_mediatype=application%2Fjson&_profile=bdr-feature-human&limit=1000&filter=${URLEncoder.encode(query, 'UTF-8')}"
        Map headers = ['Content-Disposition': 'attachment; filename="testFile.json"']

        when:
        service.downloadProjectDataSet(projectId, format, fileName, response)

        then:
        1 * bdrTokenService.getBDRAccessToken() >> azureToken
        1 * webService.proxyGetRequest(response, url, WebService.AUTHORIZATION_HEADER_TYPE_EXTERNAL_TOKEN, readTimeout, azureToken, headers)
    }

    def "test downloadDataSet"() {
        given:
        String projectId = "testProjectId"
        String dataSetId = "testDataSetId"
        String format = "application/json"
        String fileName = "testFile"
        String query = '{"op":"and","args":[{"op":"=","args":[{"property":"nrm-submission","value":"testDataSetId"}]},{"op":"=","args":[{"property":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","value":"http://www.opengis.net/ont/geosparql#Feature"}]}]}'
        String azureToken = "testAzureToken"
        String bdrBaseUrl = "http://example.com"
        String url = "$bdrBaseUrl/cql?_mediatype=application%2Fjson&_profile=bdr-feature-human&limit=1000&filter=${URLEncoder.encode(query, 'UTF-8')}"
        Map headers = ['Content-Disposition': 'attachment; filename="testFile.json"']

        when:
        service.downloadDataSet(projectId, dataSetId, fileName, format, response)

        then:
        1 * bdrTokenService.getBDRAccessToken() >> azureToken
        1 * webService.proxyGetRequest(response, url, WebService.AUTHORIZATION_HEADER_TYPE_EXTERNAL_TOKEN, readTimeout, azureToken, headers)
    }
}
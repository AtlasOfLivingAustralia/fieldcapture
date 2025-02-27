package au.org.ala.merit

import au.org.ala.ws.tokens.TokenService
import grails.converters.JSON
import grails.testing.services.ServiceUnitTest
import org.grails.web.converters.marshaller.json.CollectionMarshaller
import org.grails.web.converters.marshaller.json.MapMarshaller
import spock.lang.Specification
import javax.servlet.http.HttpServletResponse

class BdrServiceSpec extends Specification implements ServiceUnitTest<BdrService> {

    def webService = Mock(WebService)
    def tokenService = Mock(TokenService)
    def commonService = Mock(CommonService)
    def bdrTokenService = Mock(BdrTokenService)
    def response = Mock(HttpServletResponse)

    void setupSpec() {
        JSON.registerObjectMarshaller(new MapMarshaller())
        JSON.registerObjectMarshaller(new CollectionMarshaller())
    }
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
        String azureToken = "testAzureToken"
        String expectedBdrApiUrl = "https://changeMe.org.au/api"
        Map expectedParams = [
                _mediatype: format,
                _profile: "bdr-feature-human",
                limit: 1000,
                filter: (service.projectQuery(projectId) as JSON).toString() ] // Copying and pasting the encoded query doesn't test the query works and makes it less maintainable.
        Map headers = ['Content-Disposition': 'attachment; filename="testFile.json"']

        when:
        service.downloadProjectDataSet(projectId, format, fileName, response)

        then:
        1 * bdrTokenService.getBDRAccessToken() >> azureToken
        1 * webService.proxyGetRequest(response, expectedBdrApiUrl, expectedParams, WebService.AUTHORIZATION_HEADER_TYPE_EXTERNAL_TOKEN, readTimeout, azureToken, headers)
    }

    def "test downloadDataSet"() {
        given:
        String projectId = "testProjectId"
        String dataSetId = "testDataSetId"
        String format = "application/json"
        String fileName = "testFile"
        int readTimeout = 60000
        String azureToken = "testAzureToken"
        String expectedBdrApiUrl = "https://changeMe.org.au/api"
        Map expectedParams = [
                _mediatype: format,
                _profile: "bdr-feature-human",
                limit: 1000,
                filter: (service.dataSetQuery(dataSetId) as JSON).toString() // Copying and pasting the encoded query doesn't test the query works and makes it less maintainable.
        ]
        Map headers = ['Content-Disposition': 'attachment; filename="testFile.json"']

        when:
        service.downloadDataSet(projectId, dataSetId, fileName, format, response)

        then:
        1 * bdrTokenService.getBDRAccessToken() >> azureToken
        1 * webService.proxyGetRequest(response, expectedBdrApiUrl, expectedParams, WebService.AUTHORIZATION_HEADER_TYPE_EXTERNAL_TOKEN, readTimeout, azureToken, headers)
    }
}
package au.org.ala.merit

import grails.testing.web.controllers.ControllerUnitTest
import org.apache.http.HttpStatus
import spock.lang.Specification

class SearchControllerSpec extends Specification implements ControllerUnitTest<SearchController> {

    SearchService searchService = Mock(SearchService)
    WebService webService = Mock(WebService)
    CommonService commonService = Mock(CommonService)

    void setup() {
        controller.searchService = searchService
        controller.webService = webService
        controller.commonService = commonService
    }
    def "The search controller accepts a request to download data and delegates to the SearchService"() {
        when:
        controller.downloadAllData()

        then:
        1 * searchService.downloadAllData(params) >> [status:HttpStatus.SC_OK]

        and:
        response.status == HttpStatus.SC_OK

        and:
        params.downloadUrl.endsWith('download/')
        params.systemEmail == 'merit@ala.org.au'
        params.senderEmail == 'merit@ala.org.au'
    }

    def "The search controller accepts a request to download a shapefile and delegates to the SearchService"() {
        when:
        controller.downloadShapefile()

        then:
        1 * searchService.downloadShapefile(params) >> true

        and:
        response.status == HttpStatus.SC_OK
        response.json.status == HttpStatus.SC_OK

        and:
        params.downloadUrl.endsWith('download/')
        params.systemEmail == 'merit@ala.org.au'
        params.senderEmail == 'merit@ala.org.au'

    }

    def "The search controller accepts a request to download a user data and delegates to ecodata"() {
        when:
        controller.downloadUserData()

        then:
        1 * webService.doPostWithParams({ it.endsWith("search/downloadUserList") }, [:]) >> [status:HttpStatus.SC_OK]
        1 * commonService.buildUrlParamsFromMap(params) >> ""

        and:
        response.json.status == HttpStatus.SC_OK

        and:
        params.downloadUrl.endsWith('download/')
        params.systemEmail == 'merit@ala.org.au'
        params.senderEmail == 'merit@ala.org.au'

    }

    def "The search controller accepts a request to download organisation data and delegates to ecodata"() {
        when:
        controller.downloadOrganisationData()

        then:
        1 * webService.doPostWithParams({ it.endsWith("search/downloadOrganisationData") }, [:]) >> [status:HttpStatus.SC_OK]
        1 * commonService.buildUrlParamsFromMap(params) >> ""

        and:
        response.json.status == HttpStatus.SC_OK

        and:
        params.downloadUrl.endsWith('download/')
        params.systemEmail == 'merit@ala.org.au'
        params.senderEmail == 'merit@ala.org.au'

    }

}

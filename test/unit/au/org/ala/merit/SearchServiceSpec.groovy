package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(SearchService)
class SearchServiceSpec extends Specification {


    WebService webService = Mock(WebService)
    HubSettings hubSettings = new HubSettings(availableFacets:['nameFacet', 'descriptionFacet'])
    CommonService commonService = Mock(CommonService)
    void setup() {
        SettingService.setHubConfig(hubSettings)
        service.webService = webService
        service.commonService = commonService

    }

    void "The search service allProjects method converts params to a GET URL to query ecodata"() {
        setup:
        Map params = [:]
        when:
        service.allProjects(params)

        then:
        1 * commonService.buildUrlParamsFromMap(params) >> "?test"
        1 * webService.getJson2({it.endsWith("/search/elasticHome?test")})
    }

}

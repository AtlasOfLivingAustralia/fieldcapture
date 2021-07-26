package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.core.GrailsApplication
import grails.test.mixin.TestFor
import grails.testing.spring.AutowiredTest
import org.apache.http.HttpStatus
import spock.lang.Specification

class SearchServiceSpec extends Specification implements AutowiredTest{

    Closure doWithSpring() {{ ->
        service SearchService
    }}

    SearchService service

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
        Map response = service.allProjects(params)

        then:
        1 * commonService.buildUrlParamsFromMap(params) >> "?test"
        1 * webService.getJson2({it.endsWith("/search/elasticHome?test")}) >> [statusCode:HttpStatus.SC_OK, resp:[test:"value"]]
        and: "The response from the webService is modified to maintain compatibility with the getJson method"
        response == [test:"value"]

        when: "The web service returns an error"
        response = service.allProjects(params)

        then: "Details of the error are returned"
        1 * commonService.buildUrlParamsFromMap(params) >> "?test"
        1 * webService.getJson2({it.endsWith("/search/elasticHome?test")}) >> [statusCode:HttpStatus.SC_INTERNAL_SERVER_ERROR, error:"an exception was thrown"]
        response == [statusCode:HttpStatus.SC_INTERNAL_SERVER_ERROR, error:"an exception was thrown"]
    }

    void "The search service can optionally reduce the precision of site data"() {
        setup:
        Map params = [:]
        Map geoData = [projects:[
                [geo:stubGeoReponseFromCoordinateList([[25.123, 134.366], [2.33333, 1.007]])]
        ]]

        when:
        Map result = service.allProjectsWithSites(params, null, true)

        then:
        1 * webService.getJson2(_) >> [resp: geoData, status: HttpStatus.SC_OK]

        result.projects.size() == 1
        result.projects[0].geo.size() == 2
        result.projects[0].geo == [[loc:[lat:new BigDecimal("25.1"), lon:new BigDecimal("134.4")]], [loc:[lat:new BigDecimal("2.3"), lon:new BigDecimal("1.0")]]]

        when:
        result = service.allProjectsWithSites(params, null, false)

        then:
        1 * webService.getJson2(_) >> [resp: geoData, status: HttpStatus.SC_OK]
        result == geoData
    }

    def "The service can request a shapefile download from ecodata"() {
        when:
        boolean result = service.downloadShapefile([:])

        then:
        1 * webService.get({it.contains('search/downloadShapefile')}) >> true
        result == true
    }

    private List stubGeoReponseFromCoordinateList(List coords) {
        List results = new ArrayList(coords.size())
        coords.each { List coord ->
            results << [loc:[lat: new BigDecimal(coord[0]), lon: new BigDecimal(coord[1])]]
        }
        results
    }

}

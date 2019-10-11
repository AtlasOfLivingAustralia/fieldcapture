package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.test.mixin.TestFor
import spock.lang.Specification

/** Tests the HomeController */
@TestFor(HomeController)
class HomeControllerSpec extends Specification {

    SearchService searchService = Mock(SearchService)
    HubSettings hubSettings = new HubSettings(availableFacets:['nameFacet', 'descriptionFacet'])

    def setup() {
        controller.searchService = searchService
        SettingService.setHubConfig(hubSettings)
    }

    def "The geoservice method delegates to SearchService.allProjects if the geo param is absent"() {
        setup:
        Map searchResponse = [
                hits: [
                        hits: [[
                                _source:[
                                        name:"project 1",
                                        description:"project 1 description",
                                        organsationName:"Org1",
                                        lastUpdated:"2019-07-01T00:00:00Z",
                                        extraInfo:"Extra info 1"
                                ]
                        ]]
                ]
        ]

        when:
        controller.geoService()

        then:
        1 * searchService.allProjects(params) >> searchResponse

        and: "The query is limited to the data we need to display"
        params.include == ['name', 'description', 'lastUpdated', 'organisationName']

        and:
        Map response = response.json
        response.hits.hits.size() == 1
        response.hits.hits[0]._source.size() == 4
        response.hits.hits[0]._source.name == searchResponse.hits.hits[0]._source.name
        response.hits.hits[0]._source.description == searchResponse.hits.hits[0]._source.description
        response.hits.hits[0]._source.organsationName == searchResponse.hits.hits[0]._source.organsationName
        response.hits.hits[0]._source.lastUpdated == searchResponse.hits.hits[0]._source.lastUpdated
    }


    def "The geoservice method delegates to SearchService.allProjectsWithSites if the geo param is present"() {
        setup:
        Map searchResponse = [
                hits: [
                        hits: [[]]
                ]
        ]

        when:
        params.geo = true
        controller.geoService()

        then:
        1 * searchService.allProjectsWithSites(params) >> searchResponse

        and:
        Map response = response.json
        response == searchResponse
    }


}

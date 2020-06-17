package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.test.mixin.TestFor
import spock.lang.Specification

/** Tests the HomeController */
@TestFor(HomeController)
class HomeControllerSpec extends Specification {

    SearchService searchService = Mock(SearchService)
    UserService userService = Mock(UserService)
    HubSettings hubSettings = new HubSettings(availableFacets:['nameFacet', 'descriptionFacet'])

    def setup() {
        controller.searchService = searchService
        SettingService.setHubConfig(hubSettings)
        controller.userService = userService
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
                                        lastUpdated:"2019-07-01T00:00:00Z"
                                ]
                        ]]
                ]
        ]

        when:
        controller.geoService()

        then:
        1 * searchService.allProjects(params) >> searchResponse

        and: "The query is limited to the data we need to display"
        params.include == ['name', 'description', 'lastUpdated', 'organisationName', 'managementUnitName','managementUnitId', 'programId', 'associatedProgram', 'associatedSubProgram']

        and:
        Map response = response.json
        response.hits.hits.size() == 1
        response.hits.hits[0]._source.size() == 4
        response.hits.hits[0]._source.name == searchResponse.hits.hits[0]._source.name
        response.hits.hits[0]._source.description == searchResponse.hits.hits[0]._source.description
        response.hits.hits[0]._source.organsationName == searchResponse.hits.hits[0]._source.organsationName
        response.hits.hits[0]._source.lastUpdated == searchResponse.hits.hits[0]._source.lastUpdated
    }

    def "The geoservice method delegates to SearchService.allProjects if the geo param is absen when user role is admin"() {
        setup:
        Map searchResponse = [
                hits: [
                        hits: [[
                                       _source:[
                                               name:"project 1",
                                               description:"project 1 description",
                                               organsationName:"Org1",
                                               lastUpdated:"2019-07-01T00:00:00Z",
                                               managementUnitName:'management unit',
                                               managementUnitId:'123',
                                               programId:'1234',
                                               associatedProgram:'associatedProgram',
                                               associatedSubProgram: 'associatedSubProgram',
                                               funding:'0', organisationName:'org name', externalId :'',
                                               plannedEndDate:'2019-07-01T00:00:00Z',
                                               plannedStartDate: '2018-07-01T00:00:00Z',
                                               activities:[siteId: '2121',type: ''],
                                               sites:[siteId: 'siteId', projects:'projectId',
                                               extent:[geometry:'{cmz: ["Tasman temperate rainforests and highland forests", "Tasman temperate forests"]}']

                                       ]
                               ]]
                ]
        ]]
        when:
        controller.geoService()

        then:
        1 * searchService.allProjects(params) >> searchResponse
        1 * userService.userIsAlaOrFcAdmin() >> true

        and: "The query is limited to the data we need to display"
        params.include == ['name', 'managementUnitName', 'managementUnitId', 'programId', 'description', 'associatedProgram', 'associatedSubProgram',
                           'lastUpdated',
                           'funding', 'organisationName', 'externalId', 'plannedEndDate', 'plannedStartDate',
                           'activities.siteId','activities.type','sites.siteId', 'sites.projects', 'sites.extent.geometry']
        and:
        Map response = response.json
        response.hits.hits.size() == 1
        response.hits.hits[0]._source.size() == 16
        response.hits.hits[0]._source.name == searchResponse.hits.hits[0]._source.name
        response.hits.hits[0]._source.description == searchResponse.hits.hits[0]._source.description
        response.hits.hits[0]._source.organsationName == searchResponse.hits.hits[0]._source.organsationName
        response.hits.hits[0]._source.lastUpdated == searchResponse.hits.hits[0]._source.lastUpdated
        response.hits.hits[0]._source.managementUnitName == searchResponse.hits.hits[0]._source.managementUnitName
        response.hits.hits[0]._source.managementUnitId == searchResponse.hits.hits[0]._source.managementUnitId
        response.hits.hits[0]._source.programId==searchResponse.hits.hits[0]._source.programId
        response.hits.hits[0]._source.associatedProgram==searchResponse.hits.hits[0]._source.associatedProgram
        response.hits.hits[0]._source.associatedSubProgram==searchResponse.hits.hits[0]._source.associatedSubProgram
        response.hits.hits[0]._source.funding==searchResponse.hits.hits[0]._source.funding
        response.hits.hits[0]._source.externalId==searchResponse.hits.hits[0]._source.externalId
        response.hits.hits[0]._source.plannedEndDate==searchResponse.hits.hits[0]._source.plannedEndDate
        response.hits.hits[0]._source.plannedStartDate==searchResponse.hits.hits[0]._source.plannedStartDate
        response.hits.hits[0]._source.activities.siteId==searchResponse.hits.hits[0]._source.activities.siteId
        response.hits.hits[0]._source.activities.type==searchResponse.hits.hits[0]._source.activities.type
        response.hits.hits[0]._source.sites.siteId==searchResponse.hits.hits[0]._source.sites.siteId
        response.hits.hits[0]._source.sites.projects==searchResponse.hits.hits[0]._source.sites.projects
        response.hits.hits[0]._source.sites.extent.geometry==searchResponse.hits.hits[0]._source.sites.extent.geometry


    }









    def "The geoservice method delegates to SearchService.allProjectsWithSites if the geo param is present"() {
        setup:
        Map searchResponse = [projects:[[geo:[]]]]

        when:
        params.geo = true
        controller.geoService()

        then:
        1 * searchService.allProjectsWithSites(params, null, false) >> searchResponse

        and:
        Map response = response.json
        response == searchResponse
    }

    def "The geoservice method accepts a heatmap parameter to optionally reduce data precision"() {
        setup:
        Map searchResponse = [projects:[[geo:[]]]]

        when:
        params.geo = true
        params.heatmap = true
        controller.geoService()

        then:
        1 * searchService.allProjectsWithSites(params, null, true) >> searchResponse

        and:
        Map response = response.json
        response == searchResponse
    }


}

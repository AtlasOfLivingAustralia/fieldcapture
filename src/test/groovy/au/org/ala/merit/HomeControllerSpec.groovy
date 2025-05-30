package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import org.joda.time.DateTime
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

import javax.servlet.http.Cookie

/** Tests the HomeController */
class HomeControllerSpec extends Specification implements ControllerUnitTest<HomeController>{

    SearchService searchService = Mock(SearchService)
    UserService userService = Mock(UserService)
    HubSettings hubSettings = new HubSettings(availableFacets:['nameFacet', 'descriptionFacet', 'admin', 'elect'], availableMapFacets:['adminMap'], adminFacets:['admin', 'adminMap'], officerFacets:['elect'])
    SettingService settingService = Mock(SettingService)
    MetadataService metadataService = Mock(MetadataService)
    ActivityService activityService = Mock(ActivityService)
    DocumentService documentService = Mock(DocumentService)

    def setup() {
        controller.searchService = searchService
        SettingService.setHubConfig(hubSettings)
        controller.userService = userService
        controller.settingService = settingService
        controller.metadataService = metadataService
        controller.activityService = activityService
        controller.documentService = documentService
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
        params.include == ['name', 'description', 'lastUpdated', 'associatedOrgs', 'managementUnitName','managementUnitId', 'programId', 'associatedProgram', 'associatedSubProgram']

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
                           'funding', 'associatedOrgs', 'externalId', 'plannedEndDate', 'plannedStartDate',
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

    def "The login method can add an ALA cookie if required"() {
        when:
        Cookie authCookie = new Cookie(HomeController.ALA_AUTH, "me")
        request.setCookies(authCookie)
        controller.login()

        then:
        response.redirectUrl == grailsApplication.config.getProperty('grails.serverURL')


        when:
        response.reset()
        request.setCookies([] as Cookie[])
        controller.login()

        then:
        1 * userService.getUser() >> [userName:'me']
        response.getCookie(HomeController.ALA_AUTH).value == 'me'
        response.redirectUrl == grailsApplication.config.getProperty('grails.serverURL')
    }

    def "MERIT admin and read only users can view admin facets and downloads on the homepage"(boolean admin, boolean readOnly) {
        setup:
        Map resp = [:]
        List activityTypes = []

        when:
        params.fq="status:active"
        controller.projectExplorer()

        then:
        if (admin) {
            1 * userService.userIsAlaOrFcAdmin() >> true
            1 * userService.userIsSiteAdmin() >> true
        }
        else if (readOnly) {
            1 * userService.userIsAlaOrFcAdmin() >> false
            1 * userService.userIsSiteAdmin() >> false
            2 * userService.userHasReadOnlyAccess() >> true
        }
        1 * searchService.HomePageFacets(params) >> resp
        1 * settingService.getSettingText(_) >> "Project explorer description"
        1 * metadataService.activityTypesList() >> activityTypes

        and:
        model.facetsList == ['nameFacet', 'descriptionFacet', 'admin', 'elect']
        model.mapFacets == ['adminMap']
        model.geographicFacets == []
        model.description == "Project explorer description"
        model.results == resp
        model.projectCount == 0
        model.includeDownloads == true
        model.activityTypes == activityTypes

        where:
        admin | readOnly
        true  | false
        false | true
    }

    def "Users without MERIT admin or read only but with the hub officer role cannot view admin facets but can view officer facets and downloads"() {
        setup:
        Map resp = [:]

        when:
        params.fq="status:active"
        controller.projectExplorer()

        then:
        1 * userService.userIsAlaOrFcAdmin() >> false
        1 * userService.userHasReadOnlyAccess() >> false
        2 * userService.userIsSiteAdmin() >> true

        1 * searchService.HomePageFacets(params) >> resp
        1 * settingService.getSettingText(_) >> "Project explorer description"
        0 * metadataService.activityTypesList()

        and:
        model.facetsList == ['nameFacet', 'descriptionFacet', 'elect']
        model.mapFacets == []
        model.geographicFacets == []
        model.description == "Project explorer description"
        model.results == resp
        model.projectCount == 0
        model.includeDownloads == true
        model.activityTypes == null

    }

    def "Users without MERIT admin or read only cannot view admin facets or downloads"() {
        setup:
        Map resp = [:]

        when:
        params.fq="status:active"
        controller.projectExplorer()

        then:
        1 * userService.userIsAlaOrFcAdmin() >> false
        2 * userService.userHasReadOnlyAccess() >> false
        2 * userService.userIsSiteAdmin() >> false
        1 * searchService.HomePageFacets(params) >> resp
        1 * settingService.getSettingText(_) >> "Project explorer description"
        0 * metadataService.activityTypesList()

        and:
        model.facetsList == ['nameFacet', 'descriptionFacet']
        model.mapFacets == []
        model.geographicFacets == []
        model.description == "Project explorer description"
        model.results == resp
        model.projectCount == 0
        model.includeDownloads == false
        model.activityTypes == null

    }


    def "MERIT admin users receive a filtered view of activities to download"(List terms, List expectedActivityTypes) {
        setup:
        Map resp = [facets:[(HomeController.ACTIVITY_TYPE_FACET_NAME):[terms:terms.collect{[term:it]}]]]
        List activityTypes = [[name:'Category 1', list:[[name:'a1'], [name:'a2'], [name:'a3']]], [name:'Category 2', list:[[name:'a4'], [name:'a5'], [name:'a6'], [name:'a7'], [name:'EMSA 1']]]]

        when:
        params.fq="status:active"
        controller.projectExplorer()

        then:
        1 * userService.userIsAlaOrFcAdmin() >> true
        1 * searchService.HomePageFacets(params) >> resp
        1 * settingService.getSettingText(_) >> "Project explorer description"
        1 * metadataService.activityTypesList() >> activityTypes
        1 * activityService.monitoringProtocolForms() >> [[name:"EMSA 1"]]

        and:
        model.includeDownloads == true
        model.activityTypes == expectedActivityTypes

        where:
        terms | expectedActivityTypes
        ['a1', 'a3', 'a4']  | [[name:'Category 1', list:[[name:'a1'], [name:'a3']]], [name:'Category 2', list:[[name:'a4']]]]
        ['a2'] | [[name:'Category 1', list:[[name:'a2']]]]
        ['a5', 'EMSA 1'] | [[name:'Category 2', list:[[name:'a5']]]]
    }

    def "The controller can setup the model for displaying help documents"() {
        setup:
        List documents = [[documentId:'1', title:'Test Document', labels:['Test Category']]]
        HubSettings hubSettings = new HubSettings(hubId:'00cf9ffd-e30c-45f8-99db-abce8d05c0d8')
        SettingService.setHubConfig(hubSettings)
        String category = 'Test Category'

        when:
        Map model = controller.helpDocuments(category)

        then:
        1 * documentService.findAllHelpDocuments(hubSettings.hubId, category) >> documents

        and:
        model.documents == documents
        model.category == category
    }


}

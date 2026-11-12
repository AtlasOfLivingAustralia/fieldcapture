package au.org.ala.merit

import grails.converters.JSON
import grails.testing.web.controllers.ControllerUnitTest
import net.sf.json.JSONNull
import spock.lang.Specification

class SiteControllerSpec extends Specification implements ControllerUnitTest<SiteController>{

    SiteService siteService = Mock(SiteService)
    UserService userService = Mock(UserService)
    ProjectService projectService = Mock(ProjectService)
    SettingService settingService = Mock(SettingService)
    ProjectConfigurationService projectConfigurationService = Mock(ProjectConfigurationService)
    WebService webService = Mock(WebService)
    CommonService commonService = Mock(CommonService)
    ProgramService programService = Mock(ProgramService)

    def setup() {
        controller.siteService = siteService
        controller.userService = userService
        controller.projectService = projectService
        controller.programService = programService
        controller.settingService = settingService
        controller.projectConfigurationService = projectConfigurationService
        controller.webService = webService
        controller.commonService = commonService
        // From Bootstrap.groovy
        JSON.createNamedConfig("nullSafe", { cfg ->
            cfg.registerObjectMarshaller(JSONNull, {return ""})
        })
    }

    def "the site controller can return site data as geojson"() {
        setup:
        String siteId = 's1'
        Map site = [siteId:siteId, name:"Site 1", projects:[[projectId:'p1', name:'Project 1']], extent:[geometry:[type:"Point", coordinates:[1,2]]]]
        Map siteGeoJson = [type:"Feature", geometry:[type:"Point", coordinates:[1,2]], properties:[siteId:siteId, name:"Site 1", projects:[[projectId:'p1', name:'Project 1']]]]

        when:
        controller.geojson(siteId)

        then:
        1 * siteService.get(siteId, [view:SiteService.SITE_VIEW_RAW]) >> site
        1 * userService.getCurrentUserId() >> 'u1'
        1 * projectService.canUserEditProject('u1', 'p1') >> true
        1 * siteService.getSiteGeoJson(siteId) >> [status:200, resp:siteGeoJson]

        response.json == siteGeoJson
    }

    def "When a project already has a project area, when creating a new site the project extent type cannot be selected"() {
        setup:
        Map project = [projectId: 'p1', name: 'project', sites: [[name: 'name', externalId: 'e1', type: 'projectArea']]]

        when:
        params.projectId = 'p1'
        controller.createForProject()

        then:
        1 * projectService.get(project.projectId, 'all') >> project
        1 * projectService.hasProjectArea(project) >> true

        and:
        model.siteTypes.collect { it.value } == ['worksArea', 'surveyArea']
    }


    def "When a project does not have a project area, when creating a new site the project extent type can be selected"() {
        setup:
        Map project = [projectId:'p1', name:'project', sites:[[name:'name', externalId:'e1', type:'worksArea']]]

        when:
        params.projectId = 'p1'
        controller.createForProject()

        then:
        1 * projectService.get(project.projectId, 'all') >> project
        1 * projectService.hasProjectArea(project) >> false

        and:
        model.siteTypes.collect{it.value} == ['worksArea', 'surveyArea', 'projectArea']
    }

    def "When editing a site, if the site is already a project area, project area can be selected as the site type"() {
        setup:
        Map project = [projectId:'p1', name:'project', sites:[[name:'name', externalId:'e1', type:'worksArea']]]
        String siteId = 's1'
        Map site = [siteId:siteId, name:"Site 1", projects:['p1'], type:'projectArea', extent:[geometry:[type:"Point", coordinates:[1,2]]]]

        when:
        params.projectId = 'p1'
        params.id = site.siteId
        Map model = controller.edit()

        then:
        1 * siteService.getRaw(siteId) >> [site:site]
        1 * projectService.canUserEditProject(_, project.projectId) >> true
        2 * projectService.get(project.projectId, 'all') >> project
        0 * projectService.hasProjectArea(project) >> false

        and:
        model.siteTypes.collect{it.value} == ['worksArea', 'surveyArea', 'projectArea']
    }

    def "When editing a site, if the site is not already a project area, project area cannot be selected if the site is assigned to more than 1 project"() {
        setup:
        Map project = [projectId:'p1', name:'project', sites:[[name:'name', externalId:'e1', type:'worksArea']]]
        String siteId = 's1'
        Map site = [siteId:siteId, name:"Site 1", projects:['p1', 'p2'], type:'worksArea', extent:[geometry:[type:"Point", coordinates:[1,2]]]]

        when:
        params.projectId = 'p1'
        params.id = site.siteId
        Map model = controller.edit()

        then:
        1 * siteService.getRaw(siteId) >> [site:site]
        2 * projectService.canUserEditProject(_, _) >> true
        1 * projectService.get(project.projectId, 'all') >> project
        0 * projectService.hasProjectArea(project) >> false

        and:
        model.siteTypes.collect{it.value} == ['worksArea', 'surveyArea']
    }

    def "When editing a site, if the site is not already a project area, project area cannot be selected if the site is not assigned to a project"() {
        setup:
        String siteId = 's1'
        Map site = [siteId:siteId, name:"Site 1", projects:[], type:'worksArea', extent:[geometry:[type:"Point", coordinates:[1,2]]]]

        when:
        params.id = site.siteId
        Map model = controller.edit()

        then:
        1 * siteService.getRaw(siteId) >> [site:site]

        and:
        model.siteTypes.collect{it.value} == ['worksArea', 'surveyArea']
    }

    def "When editing a site, if the site is not already a project area, project area cannot be selected if the project the site is assigned to already has a project area"() {
        setup:
        Map project = [projectId:'p1', name:'project', sites:[[name:'name', externalId:'e1', type:'projectArea']]]
        String siteId = 's1'
        Map site = [siteId:siteId, name:"Site 1", projects:['p1'], type:'worksArea', extent:[geometry:[type:"Point", coordinates:[1,2]]]]

        when:
        params.projectId = 'p1'
        params.id = site.siteId
        Map model = controller.edit()

        then:
        1 * siteService.getRaw(siteId) >> [site:site]
        1 * projectService.canUserEditProject(_, _) >> true
        2 * projectService.get(project.projectId, 'all') >> project
        1 * projectService.hasProjectArea(project) >> true

        and:
        model.siteTypes.collect{it.value} == ['worksArea', 'surveyArea']
    }

    def "When editing a site, if the site is not already a project area, project area can be selected if the project the site is assigned to does not have a project area"() {
        setup:
        Map project = [projectId:'p1', name:'project', sites:[[name:'name', externalId:'e1', type:'projectArea']]]
        String siteId = 's1'
        Map site = [siteId:siteId, name:"Site 1", projects:['p1'], type:'worksArea', extent:[geometry:[type:"Point", coordinates:[1,2]]]]

        when:
        params.projectId = 'p1'
        params.id = site.siteId
        Map model = controller.edit()

        then:
        1 * siteService.getRaw(siteId) >> [site:site]
        1 * projectService.canUserEditProject(_, _) >> true
        2 * projectService.get(project.projectId, 'all') >> project
        1 * projectService.hasProjectArea(project) >> false

        and:
        model.siteTypes.collect{it.value} == ['worksArea', 'surveyArea', 'projectArea']
    }

    def "A user can view a site if they can view any of the projects associated with that site"() {
        setup:
        Map project = [projectId:'p1', name:'project', sites:[[name:'name', externalId:'e1', type:'projectArea']]]
        String siteId = 's1'
        Map site = [siteId:siteId, name:"Site 1", projects:[project]]

        when:
        Map model = controller.index(siteId)

        then:
        1 * siteService.get(siteId) >> site
        1 * userService.getUser() >> [userId:"u1"]
        1 * projectService.canUserViewProject("u1", "p1") >> true
        1 * projectService.get("p1") >> project
        1 * projectConfigurationService.getProjectConfiguration(project) >> [projectTemplate:ProjectController.RLP_TEMPLATE]

        and:
        model.site == site
        model.project == project

    }

    def "regionList returns transformed regions from settingService"() {
        given:
        def layers = [
            [id: 'layer1', name: 'Layer One'],
            [id: 'layer2', name: 'Layer Two']
        ]
        settingService.getJson(_) >> layers

        when:
        controller.regionList()

        then:
        response.json == [regions: [[key: 'layer1', value: 'Layer One'], [key: 'layer2', value: 'Layer Two']]]
    }

    def "regionList falls back to config if settingService returns null"() {
        given:
        settingService.getJson(_) >> null
        def fallbackLayers = [
            [id: 'layerA', name: 'Layer A'],
            [id: 'layerB', name: 'Layer B']
        ]
        controller.grailsApplication.config.sites.known_shapes = fallbackLayers

        when:
        controller.regionList()

        then:
        response.json == [regions: [[key: 'layerA', value: 'Layer A'], [key: 'layerB', value: 'Layer B']]]
    }

    def "downloadShapefile proxies shp download for users with project edit access"() {
        given:
        String siteId = 's1'
        controller.grailsApplication.config.ecodata.baseUrl = 'https://ecodata.example/'

        when:
        controller.downloadShapefile(siteId)

        then:
        1 * siteService.get(siteId) >> [siteId: siteId, projects: [[projectId: 'p1']]]
        1 * userService.getCurrentUserId() >> 'u1'
        1 * projectService.canUserEditProject('u1', 'p1') >> true
        1 * webService.proxyGetRequest(response, 'https://ecodata.example/site/s1.shp', true, true, 960000) >> [status: 200]
        0 * webService.getJson2(_)
        response.redirectedUrl == null
    }

    def "downloadShapefile returns geojson attachment when geojson response is available"() {
        given:
        String siteId = 's1'
        params.format = 'geojson'
        controller.grailsApplication.config.ecodata.baseUrl = 'https://ecodata.example/'

        when:
        controller.downloadShapefile(siteId)

        then:
        1 * siteService.get(siteId) >> [siteId: siteId, projects: [[projectId: 'p1']]]
        1 * userService.getCurrentUserId() >> 'u1'
        1 * projectService.canUserEditProject('u1', 'p1') >> true
        1 * webService.getJson2('https://ecodata.example/site/s1.geojson') >> [statusCode: 200, resp: [type: 'Feature', properties: [name: 'site']]]
        0 * webService.proxyGetRequest(_, _, _, _, _)

        and:
        response.contentType == 'application/octet-stream'
        response.getHeader('Content-Disposition') == 'Attachment;Filename="s1.geojson"'
        response.text.contains('"type":"Feature"')
    }

    def "downloadShapefile redirects to home when user cannot access site"() {
        given:
        String siteId = 's1'
        controller.grailsApplication.config.ecodata.baseUrl = 'https://ecodata.example/'

        when:
        controller.downloadShapefile(siteId)

        then:
        1 * siteService.get(siteId) >> [siteId: siteId, projects: [[projectId: 'p1']]]
        1 * userService.getCurrentUserId() >> 'u1'
        1 * projectService.canUserEditProject('u1', 'p1') >> false
        1 * webService.proxyGetRequest(response, 'https://ecodata.example/site/s1.shp', true, true, 960000) >> [status: 200]
        response.redirectedUrl == '/home/index'
        flash.message == "Access denied: User does not have permission to view site: ${siteId}"
    }

    def "downloadShapefile renders error view when shapefile proxy request fails"() {
        given:
        String siteId = 's1'
        controller.grailsApplication.config.ecodata.baseUrl = 'https://ecodata.example/'

        when:
        controller.downloadShapefile(siteId)

        then:
        1 * siteService.get(siteId) >> [siteId: siteId, projects: [[projectId: 'p1']]]
        1 * userService.getCurrentUserId() >> 'u1'
        1 * projectService.canUserEditProject('u1', 'p1') >> true
        1 * webService.proxyGetRequest(response, 'https://ecodata.example/site/s1.shp', true, true, 960000) >> [status: 500, error: 'Download failed']

        and:
        view == '/error'
        model.error == 'Download failed'
    }
}

package au.org.ala.merit

import grails.converters.JSON
import grails.test.mixin.TestFor
import net.sf.json.JSONNull
import org.apache.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import spock.lang.Specification

@TestFor(SiteController)
class SiteControllerSpec extends Specification {

    SiteService siteService = Mock(SiteService)
    UserService userService = Mock(UserService)
    ProjectService projectService = Mock(ProjectService)

    def setup() {
        controller.siteService = siteService
        controller.userService = userService
        controller.projectService = projectService

        // From Bootstrap.groovy
        JSON.createNamedConfig("nullSafe", { cfg ->
            cfg.registerObjectMarshaller(JSONNull, {return ""})
        })
    }

    def "the site controller accepts a zipped shapefile for upload"() {
        setup:
        MockMultipartFile shapefile = new MockMultipartFile("shapefile", "test.zip", "application/zip", new byte[0])
        String projectId = 'p1'
        String shapefileId = 's1'
        projectService.canUserEditProject(_,_) >> true


        when:
        request.addFile(shapefile)
        params.projectId = projectId
        params.returnTo = "returnTo"

        controller.siteUpload()

        then:
        1 * siteService.uploadShapefile(shapefile) >> [statusCode: HttpStatus.SC_OK, resp:[shp_id:shapefileId, "0":[a1:"v1", a2:"v2"]]]

        view == '/site/upload'
        model.projectId == projectId
        model.shapeFileId == shapefileId
        model.attributeNames == ['a1', 'a2']
        model.shapes == [[id:"0", values:[a1:"v1", a2:"v2"]]]
        model.returnTo == params.returnTo
    }

    def "the site controller checks the user can edit the supplied project before allowing a site upload"() {
        setup:
        projectService.canUserEditProject(_,_) >> false

        when:
        params.projectId = 'p1'
        controller.siteUpload()

        then:
        0 * siteService._
        flash.message != null
        response.redirectUrl != null

    }

    def "the site controller requires valid input to create sites from a shapefile"() {
        setup:

        when:
        request.JSON = [projectId:null]
        controller.createSitesFromShapefile()

        then:
        0 * siteService._
        flash.message != null
        response.redirectUrl != null
    }

    def "the site controller checks the user can edit the supplied project before creating a site from a shapefile"() {
        setup:
        request.JSON = [projectId:'p1', shapeFileId:'s1', sites:[[:]]]

        when:
        projectService.canUserEditProject(_,_) >> false
        controller.createSitesFromShapefile()

        then:
        0 * siteService._
        flash.message != null
        response.redirectUrl != null

    }

    def "the site controller can create a site from a shapefile"() {
        setup:
        Map data = [projectId:'p1', shapeFileId:'s1', sites:[[name:'name', externalId:'e1', id:'0', description:"d"]]]
        request.JSON = data
        projectService.canUserEditProject(_,_) >> true

        when:
        controller.createSitesFromShapefile()

        then:
        1 * siteService.createSiteFromUploadedShapefile(data.shapeFileId, data.sites[0].id, data.sites[0].externalId, data.sites[0].name, data.sites[0].description, data.projectId, false) >> [success:true, siteId:'s1']
        response.json == [progress:[total:1, uploaded:1, finished:true, errors:[]], message:"success"]
    }

}

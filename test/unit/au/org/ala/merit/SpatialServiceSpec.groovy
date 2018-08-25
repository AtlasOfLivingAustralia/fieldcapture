package au.org.ala.merit

import grails.test.mixin.TestFor
import org.apache.http.HttpStatus
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.springframework.mock.web.MockMultipartFile
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification

@TestFor(SpatialService)
class SpatialServiceSpec extends Specification {

    WebService webService = Mock(WebService)
    UserService userService = Mock(UserService)
    GrailsApplication grailsApplication = Mock(GrailsApplication)

    Map config = [spatial:[layersUrl:''], 'api_key':'1234']

    def setup() {

        service.webService = webService
        service.userService = userService
        grailsApplication.getConfig() >> config
        service.grailsApplication = grailsApplication

    }

    def cleanup() {
    }

    void "the service uses the spatial portal API to request an object be deleted"() {
        setup:
        String pid = "1234"

        when:
        Integer status = service.deleteFromSpatialPortal(pid)

        then:
        1 * webService.doDelete("/shape/upload/$pid") >> HttpStatus.SC_OK
        status == HttpStatus.SC_OK
    }

    void "the service can upload a shapefile to the spatial portal for further processing"() {
        setup:
        String userId = "1234"
        Map resp = [shp_id:'1234', "0":[attribute1:'1']]
        userService.getCurrentUserId() >> "1234"
        MultipartFile file = new MockMultipartFile("test", "test.zip", "application/zip", new byte[0])

        when:
        Map result = service.uploadShapefile(file)

        then:
        1 * webService.postMultipart("/shape/upload/shp?user_id=$userId&api_key=${config.api_key}", [:], file) >> [statusCode:HttpStatus.SC_OK, resp:resp]
        result.statusCode == HttpStatus.SC_OK
        result.resp == resp

    }

    void "the service can create objects from a previously uploaded shapefile"() {
        setup:
        String userId = "1234"
        String featureId = "0"
        String shapefileId = "s1"
        String name = "site 1"
        String description = "site description"
        Map resp = [id:1325]
        userService.getCurrentUserId() >> "1234"

        when:
        Map result = service.createObjectFromShapefileFeature(shapefileId, featureId, name, description)

        then:
        1 * webService.doPost("/shape/upload/shp/$shapefileId/$featureId", [user_id:userId, api_key:config.api_key, name:name, description:description]) >> [statusCode:HttpStatus.SC_OK, resp:resp]
        result.statusCode == HttpStatus.SC_OK
        result.resp == resp

    }

    void "the service can return geojson describing an object in the spatial portal"() {
        setup:
        String pid = "1234"

        when:
        Map result = service.objectGeometry(pid)

        then:
        1 * webService.getJson2("/shape/geojson/$pid") >> [statusCode:HttpStatus.SC_OK, resp:[type:"Point", coordinates:[-35, 100]]]
        result.statusCode == HttpStatus.SC_OK
    }
}

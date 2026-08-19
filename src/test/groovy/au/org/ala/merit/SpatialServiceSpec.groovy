package au.org.ala.merit


import grails.testing.spring.AutowiredTest
import org.apache.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification

class SpatialServiceSpec extends Specification implements AutowiredTest{

    Closure doWithSpring() {{ ->
        service SpatialService
    }}

    SpatialService service

    WebService webService = Mock(WebService)
    UserService userService = Mock(UserService)

    def setup() {

        service.webService = webService
        service.userService = userService
        service.grailsApplication = grailsApplication
        grailsApplication.config.spatial.layersUrl= ''
        grailsApplication.config.ecodata.baseUrl= ''
        grailsApplication.config.layers.countries.fid = 'cl22'
        grailsApplication.config.layers.countries.displayNamesForAustralia = ['Australia', 'Commonwealth of Australia']
    }

    def cleanup() {
    }

    void "the service uses the spatial portal API to request an object be deleted"() {
        setup:
        String pid = "1234"

        when:
        Integer status = service.deleteFromSpatialPortal(pid)

        then:
        1 * webService.doDelete("/shape/upload/$pid", true) >> HttpStatus.SC_OK
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
        1 * webService.postMultipart("/shapefile", [:], file, 'files', true) >> [statusCode:HttpStatus.SC_OK, resp:resp]
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
        Map resp = [geoJson:[type:"Point", coordinates:[-35, 100]]]
        userService.getCurrentUserId() >> "1234"

        when:
        Map result = service.createObjectFromShapefileFeature(shapefileId, featureId)

        then:
        1 * webService.getJson2("/shapefile/geojson/$shapefileId/$featureId") >> [statusCode:HttpStatus.SC_OK, resp:resp]
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

    void "isGeometryWithinAustralia returns success when geometry intersects only Australian country names"() {
        given:
        Map shape = [type: 'Point', coordinates: [151.21, -33.87]]

        when:
        Map result = service.isGeometryWithinAustralia(shape)

        then:
        1 * webService.doPost('/intersect/geojson/cl22', shape, true) >> [
                statusCode: org.springframework.http.HttpStatus.OK.value(),
                resp: [[name: 'Australia']]
        ]
        result.success == true
        result.message == 'Geometry is within Australia'
    }

    void "isGeometryWithinAustralia returns failure when geometry intersects a non-Australian country"() {
        given:
        Map shape = [type: 'Polygon', coordinates: [[[151.0, -33.0], [152.0, -33.0], [152.0, -34.0], [151.0, -34.0], [151.0, -33.0]]]]

        when:
        Map result = service.isGeometryWithinAustralia(shape)

        then:
        1 * webService.doPost('/intersect/geojson/cl22', shape, true) >> [
                statusCode: org.springframework.http.HttpStatus.OK.value(),
                resp: [[name: 'Australia'], [name: 'New Zealand']]
        ]
        result.success == false
        result.message == 'Geometry is not within Australia. Intersects with: New Zealand'
    }

    void "isGeometryWithinAustralia returns error response when intersect call fails"() {
        given:
        Map shape = [type: 'Point', coordinates: [100.0, 0.0]]

        when:
        Map result = service.isGeometryWithinAustralia(shape)

        then:
        1 * webService.doPost('/intersect/geojson/cl22', shape, true) >> [
                statusCode: org.springframework.http.HttpStatus.BAD_GATEWAY.value(),
                error: 'spatial service unavailable'
        ]
        result.success == false
        result.message == 'An error occurred while checking if geometry is within Australia: spatial service unavailable'
    }
}

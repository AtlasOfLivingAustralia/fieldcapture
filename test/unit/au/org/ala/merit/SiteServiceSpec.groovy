package au.org.ala.merit

import grails.test.mixin.TestFor
import org.apache.http.HttpStatus
import org.codehaus.groovy.grails.commons.GrailsApplication
import spock.lang.Specification

@TestFor(SiteService)
class SiteServiceSpec extends Specification {

    SpatialService spatialService = Mock(SpatialService)
    WebService webService = Mock(WebService)
    GrailsApplication grailsApplication = Mock(GrailsApplication)
    Map config = [ecodata:[baseUrl:'']]

    def setup() {
        service.spatialService = spatialService
        service.webService = webService
        service.grailsApplication = grailsApplication
        grailsApplication.getConfig() >> config
    }


    def "the site service can create a site out of an uploaded shapefile feature"() {
        setup:
        String shapefileId = "shpId"
        String featureId = "0"
        String externalId = "eId"
        String name = "name"
        String description = "description"
        String projectId = "projectId"
        Map geojson = [type:'Point', coordinates:[-35, 100]]
        int id = 1234

        when:
        Map result = service.createSiteFromUploadedShapefile(shapefileId, featureId, externalId, name, description, projectId)

        then: "the object representing the site is created in the spatial portal"
        1 * spatialService.createObjectFromShapefileFeature(shapefileId, featureId, name, description) >> [statusCode: HttpStatus.SC_OK, resp:[id:id]]
        and: "the geometry is retrieved from the spatial portal for storage with the site"
        1 * spatialService.objectGeometry(Integer.toString(id)) >> [statusCode: HttpStatus.SC_OK, resp:geojson]
        and: "the site is created in ecodata"
        1 * webService.doPost("site/", [extent:[source:'pid', pid:Integer.toString(id), geometry:[type:'Point', coordinates:[-35, 100], pid:Integer.toString(id)]], projects:[projectId], name:name, description:description, externalId:externalId, visibility:'private']) >> [statusCode: HttpStatus.SC_OK, resp:[siteId:'site12']]
        and: "the return value contains the siteId of the new site"
        result.success == true
        result.siteId == 'site12'
    }

    def "the site service can create a site out of an uploaded shapefile feature and remove the feature afterwards"() {
        setup:
        String shapefileId = "shpId"
        String featureId = "0"
        String externalId = "eId"
        String name = "name"
        String description = "description"
        String projectId = "projectId"
        Map geojson = [type:'Point', coordinates:[-35, 100]]
        int id = 1234

        when:
        Map result = service.createSiteFromUploadedShapefile(shapefileId, featureId, externalId, name, description, projectId, false)

        then: "the object representing the site is created in the spatial portal"
        1 * spatialService.createObjectFromShapefileFeature(shapefileId, featureId, name, description) >> [statusCode: HttpStatus.SC_OK, resp:[id:id]]
        and: "the geometry is retrieved from the spatial portal for storage with the site"
        1 * spatialService.objectGeometry(Integer.toString(id)) >> [statusCode: HttpStatus.SC_OK, resp:geojson]
        and: "the feature is removed from the spatial portal after the geometry is retrieved"
        1 * spatialService.deleteFromSpatialPortal(Integer.toString(id)) >> HttpStatus.SC_OK
        and: "the site is created in ecodata as if it was a drawn shape"
        1 * webService.doPost("site/", [extent:[source:'drawn', geometry:[type:'Point', coordinates:[-35, 100]], pid:null], projects:[projectId], name:name, description:description, externalId:externalId, visibility:'private']) >> [statusCode: HttpStatus.SC_OK, resp:[siteId:'site12']]
        and: "the return value contains the siteId of the new site"
        result.success == true
        result.siteId == 'site12'
    }

    def "the site should not be created if retrieving the geometry fails"() {
        setup:
        String shapefileId = "shpId"
        String featureId = "0"
        String externalId = "eId"
        String name = "name"
        String description = "description"
        String projectId = "projectId"
        int id = 1234

        when:
        Map result = service.createSiteFromUploadedShapefile(shapefileId, featureId, externalId, name, description, projectId, false)

        then: "the object representing the site is created in the spatial portal"
        1 * spatialService.createObjectFromShapefileFeature(shapefileId, featureId, name, description) >> [statusCode: HttpStatus.SC_OK, resp:[id:id]]
        and: "an attempt is made to retrieve the site geometry, which fails in this case"
        1 * spatialService.objectGeometry(Integer.toString(id)) >> [statusCode: HttpStatus.SC_INTERNAL_SERVER_ERROR, error:"Failed to retrieve geojson"]
        and: "the feature is removed from the spatial portal as it doesn't have valid geometry"
        1 * spatialService.deleteFromSpatialPortal(Integer.toString(id)) >> HttpStatus.SC_OK
        and: "no site is created in ecodata "
        0 * webService.doPost("site/", _)
        and: "the return value indicates failure"
        result.success == false
        result.siteId == null
        result.error != null
    }

    def "the feature should be deleted from the spatial portal if creating the site fails"() {
        setup:
        String shapefileId = "shpId"
        String featureId = "0"
        String externalId = "eId"
        String name = "name"
        String description = "description"
        String projectId = "projectId"
        Map geojson = [type:'Point', coordinates:[-35, 100]]
        int id = 1234

        when:
        Map result = service.createSiteFromUploadedShapefile(shapefileId, featureId, externalId, name, description, projectId)

        then: "the object representing the site is created in the spatial portal"
        1 * spatialService.createObjectFromShapefileFeature(shapefileId, featureId, name, description) >> [statusCode: HttpStatus.SC_OK, resp:[id:id]]
        and: "the geometry is retrieved from the spatial portal for storage with the site"
        1 * spatialService.objectGeometry(Integer.toString(id)) >> [statusCode: HttpStatus.SC_OK, resp:geojson]
        and: "the site is attempted to be created in ecodata, which fails for this test case"
        1 * webService.doPost("site/", _) >> [statusCode: HttpStatus.SC_INTERNAL_SERVER_ERROR, error:"Failed to create site"]
        and: "the feature is removed from the spatial portal to keep consistency with ecodata"
        1 * spatialService.deleteFromSpatialPortal(Integer.toString(id)) >> HttpStatus.SC_OK

        and: "the return value indicates failure"
        result.success == false
        result.siteId == null
        result.error != null
    }

}

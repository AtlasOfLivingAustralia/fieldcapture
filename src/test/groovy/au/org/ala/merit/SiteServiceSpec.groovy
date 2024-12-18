package au.org.ala.merit

import grails.testing.spring.AutowiredTest
import org.apache.http.HttpStatus
import spock.lang.Specification

class SiteServiceSpec extends Specification implements AutowiredTest{

    Closure doWithSpring() {{ ->
        service SiteService
    }}

    SiteService service

    SpatialService spatialService = Mock(SpatialService)
    WebService webService = Mock(WebService)

    def setup() {
        service.spatialService = spatialService
        service.webService = webService
        service.grailsApplication = grailsApplication
        grailsApplication.config.ecodata.baseUrl = ""
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

        when:
        Map result = service.createSiteFromUploadedShapefile(shapefileId, featureId, externalId, name, description, projectId)

        then: "the object representing the site is created in the spatial portal"
        1 * spatialService.createObjectFromShapefileFeature(shapefileId, featureId) >> [statusCode: HttpStatus.SC_OK, resp:[geoJson: geojson]]
        and: "the site is created in ecodata"
        1 * webService.doPost("site/", [extent:[source:'drawn', geometry:[type:'Point', coordinates:[-35, 100]]], projects:[projectId], name:name, description:description, type:'worksArea', externalId:externalId, visibility:'private']) >> [statusCode: HttpStatus.SC_OK, resp:[siteId:'site12']]
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

        when:
        Map result = service.createSiteFromUploadedShapefile(shapefileId, featureId, externalId, name, description, projectId)

        then: "the object representing the site is created in the spatial portal"
        1 * spatialService.createObjectFromShapefileFeature(shapefileId, featureId) >> [statusCode: HttpStatus.SC_OK, resp:[geoJson:geojson]]
        and: "the site is created in ecodata as if it was a drawn shape"
        1 * webService.doPost("site/", [extent:[source:'drawn', geometry:[type:'Point', coordinates:[-35, 100]]], projects:[projectId], name:name, description:description, type:'worksArea', externalId:externalId, visibility:'private']) >> [statusCode: HttpStatus.SC_OK, resp:[siteId:'site12']]
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
        Map geojson = [type:'Point', coordinates:[-35, 100]]

        when:
        Map result = service.createSiteFromUploadedShapefile(shapefileId, featureId, externalId, name, description, projectId)

        then: "the object representing the site is invalid"
        1 * spatialService.createObjectFromShapefileFeature(shapefileId, featureId) >> [statusCode: HttpStatus.SC_BAD_REQUEST, resp:[error: "Invalid geometry"]]
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

        when:
        Map result = service.createSiteFromUploadedShapefile(shapefileId, featureId, externalId, name, description, projectId)

        then: "the object representing the site is created in the spatial portal"
        1 * spatialService.createObjectFromShapefileFeature(shapefileId, featureId) >> [statusCode: HttpStatus.SC_OK, resp:[geoJson: geojson]]
        and: "the site is attempted to be created in ecodata, which fails for this test case"
        1 * webService.doPost("site/", _) >> [statusCode: HttpStatus.SC_INTERNAL_SERVER_ERROR, error:"Failed to create site"]

        and: "the return value indicates failure"
        result.success == false
        result.siteId == null
        result.error != null
    }

}

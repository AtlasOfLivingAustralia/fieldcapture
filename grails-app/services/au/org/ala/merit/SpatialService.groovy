package au.org.ala.merit

import static java.net.URLEncoder.encode
import grails.core.GrailsApplication
import org.springframework.web.multipart.MultipartFile
import org.springframework.http.HttpStatus

/**
 * This class implements the interface between MERIT and the ALA spatial service.
 */
class SpatialService {

    WebService webService
    GrailsApplication grailsApplication
    UserService userService


    private static final String DELETE_SHAPE_PATH = "/shape/upload"
    private static final String UPLOAD_SHAPE_PATH = "/shape/upload/shp"
    private static final String SHAPE_GEOJSON_PATH = "/shape/geojson"
    private static final String SPATIAL_FEATURES_PATH = "/spatial/features"
    private static final String GEOJSON_INTERSECT_URL_PREFIX = "/intersect/geojson"

    /**
     * Deletes the user uploaded (i.e. not a "known shape") object (site) from the spatial portal
     * @param pid the pid of the site to delete.
     * @return the status code of the delete operation (200 OK if successful)
     */
    Integer deleteFromSpatialPortal(String pid) {
        String url = "${grailsApplication.config.getProperty('spatial.layersUrl')}${DELETE_SHAPE_PATH}/$pid"

        webService.doDelete(url, true)
    }

    /**
     * Uploads a shapefile to the spatial portal for further processing.  The spatial portal will re-project
     * the shapefile to WGS84.  This call needs to be followed by calls to create objects from the features
     * contained in the shapefile.  https://api.ala.org.au/#ws52
     *
     * @return [statusCode:<HTTP status returned from the call>, resp:<the response from the spatial portal>, error:<if there was an error, a message will be here>]
     *
     * For successful calls, the resp field is a Map containing the shp_id of the uploaded shapefile to use in subsequent calls, and keys for each of
     * the features contained in the shapefile.  The value for each of the feature keys is the values of the
     * attributes of that feature. eg. [shp_id: <shapefileId>, "0":[attribute1:<value>, attribute2:<value>, etc], "1":[attribute1:<value>, attribute2:<value>, etc]]]
     */
    Map uploadShapefile(MultipartFile shapefile) {
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}/shapefile"
        webService.postMultipart(url, [:], shapefile, 'files', true)
    }

    /**
     * Creates an object in the "User Uploaded" layer in the ALA Spatial Portal: https://api.ala.org.au/#ws53
     * This call must follow a call to uploadShapefileToSpatialPortal, which returns the shapeFileId that is required by this method.
     * @param shapeFileId The ID of a shapefile previously uploaded to the spatial portal.  This value is obtained during the shapefile upload.
     * @param featureId The ID of a feature from the uploaded shapefile.  This value is obtained during the shapefile upload.
     * @param objectName The name to give the new object in the spatial portal.
     * @param objectDescription The description to give the new object in the spatial portal.
     *
     * @return [statusCode:<HTTP status code returned from the call>, resp:[id:<id of new object in spatial portal>], error:<if there was an error creating the object>]
     * e.g [statusCode:200, resp:[id:12345]] or [statusCode:500, error:"Failed to create object"]
     */
    Map createObjectFromShapefileFeature(String shapeFileId, String featureId) {
        String baseUrl = "${grailsApplication.config.getProperty('ecodata.baseUrl')}/shapefile/geojson"
        String url = "${baseUrl}/${encode(shapeFileId, "UTF-8")}/${encode(featureId, "UTF-8")}"
        webService.getJson2(url)
    }

    /**
     * Returns a shape/object geometry in geojson format
     * @param spatialPortalObjectId the object id in the spatial portal.
     * @return geojson formatted Map.
     */
    Map objectGeometry(String spatialPortalObjectId) {
        String getGeoJsonUrl = "${grailsApplication.config.getProperty('spatial.layersUrl')}${SHAPE_GEOJSON_PATH}"
        webService.getJson2("${getGeoJsonUrl}/${spatialPortalObjectId}")
    }

    List getStateNames() {

        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + SPATIAL_FEATURES_PATH
        String statesLayerId = grailsApplication.config.getProperty('layers.states')
        Map params = [layerId: statesLayerId]

        Map resp = webService.getJson(url, params)
        resp?.resp?.collect{it.name}
    }

    Map getElectoratesWithStates() {
        String electoratesLayerId = grailsApplication.config.getProperty('layers.elect')
        String statesLayerId = grailsApplication.config.getProperty('layers.states')
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + SPATIAL_FEATURES_PATH
        Map params = [layerId: electoratesLayerId, intersectWith: statesLayerId]

        Map resp = webService.getJson(url, params)
        resp?.resp?.collectEntries{[(it.name): it[statesLayerId]?[0]]} // We know each electorate only intersects with one state, so we can just take the first one
    }

    /**
     * Checks if the supplied geometry is within Australia.
     * This is done by checking if the geometry intersects with any country that is not Australia.
     * @param shape - GeoJSON formatted geometry to check.
     * @return
     */
    Map isGeometryWithinAustralia(Map shape) {
        String url = grailsApplication.config.getProperty('spatial.layersUrl')+GEOJSON_INTERSECT_URL_PREFIX
        String fid = grailsApplication.config.getProperty('layers.countries.fid')
        List displayNamesForAustralia = grailsApplication.config.getProperty('layers.countries.displayNamesForAustralia', List)
        Map resp = webService.doPost(url+ "/" + fid, shape, true)
        Map response = [:]
        HttpStatus status = HttpStatus.resolve(resp?.statusCode as int)
        if (status?.is2xxSuccessful()) {
            List intersectingCountries = resp?.resp?.collect{ it.name }
            List nonAustralianCountries = intersectingCountries?.findAll{ it !in displayNamesForAustralia }
            response.success = nonAustralianCountries?.size() == 0
            if (!response.success) {
                response.message = "Geometry is not within Australia. Intersects with: ${nonAustralianCountries.join(', ')}"
            } else {
                response.message = "Geometry is within Australia"
            }
        } else {
            response.success = false
            response.message = "Error checking if geometry is within Australia: ${resp?.error}"
        }

        return response
    }
}

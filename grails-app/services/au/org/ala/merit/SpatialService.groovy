package au.org.ala.merit

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.springframework.web.multipart.MultipartFile

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


    /**
     * Deletes the user uploaded (i.e. not a "known shape") object (site) from the spatial portal
     * @param pid the pid of the site to delete.
     * @return the status code of the delete operation (200 OK if successful)
     */
    Integer deleteFromSpatialPortal(String pid) {
        String url = "${grailsApplication.config.spatial.layersUrl}${DELETE_SHAPE_PATH}/$pid"

        webService.doDelete(url)
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
        String userId = userService.getCurrentUserId()
        String url = "${grailsApplication.config.spatial.layersUrl}${UPLOAD_SHAPE_PATH}?user_id=${userId}&api_key=${grailsApplication.config.api_key}"

        webService.postMultipart(url, [:], shapefile)
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
    Map createObjectFromShapefileFeature(String shapeFileId, String featureId, String objectName, String objectDescription) {
        String baseUrl = "${grailsApplication.config.spatial.layersUrl}${UPLOAD_SHAPE_PATH}"
        String userId = userService.getCurrentUserId()

        Map site = [name:objectName, description: objectDescription, user_id:userId, api_key:grailsApplication.config.api_key]

        String url = "${baseUrl}/${shapeFileId}/${featureId}"

        webService.doPost(url, site)
    }

    /**
     * Returns a shape/object geometry in geojson format
     * @param spatialPortalObjectId the object id in the spatial portal.
     * @return geojson formatted Map.
     */
    Map objectGeometry(String spatialPortalObjectId) {
        String getGeoJsonUrl = "${grailsApplication.config.spatial.layersUrl}${SHAPE_GEOJSON_PATH}"
        webService.getJson2("${getGeoJsonUrl}/${spatialPortalObjectId}")
    }


}

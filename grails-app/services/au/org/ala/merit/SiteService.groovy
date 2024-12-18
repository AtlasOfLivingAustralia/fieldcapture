package au.org.ala.merit

import com.vividsolutions.jts.geom.Geometry
import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.apache.http.HttpStatus
import org.geotools.geojson.geom.GeometryJSON
import org.geotools.kml.v22.KMLConfiguration
import org.geotools.xml.Parser
import org.opengis.feature.simple.SimpleFeature
import org.springframework.web.multipart.MultipartFile

import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream

@Slf4j
class SiteService {

    def webService, grailsApplication, commonService, metadataService, userService, reportService
    def documentService
    SpatialService spatialService

    public static final String SITE_SOURCE_DRAWN = 'drawn'
    public static final String SITE_SOURCE_SPATIAL_PORTAL = 'pid'

    /** A site with the extent derived from the convex hull of a set of geojson features */
    public static final String SITE_TYPE_COMPOUND = 'compound'
    /** A site representing the area in which project activities are being conducted */
    public static final String SITE_TYPE_PROJECT_AREA = 'projectArea'
    /** A site representing an area in which one or more project activities will take place */
    public static final String SITE_TYPE_WORKS_AREA = 'worksArea'
/** A site representing an area in which one or more project surveys will take place */
    public static final String SITE_TYPE_SURVEY_AREA = 'surveyArea'


    static isReadOnly(Map site) {
        site?.type == SITE_TYPE_COMPOUND || PublicationStatus.isReadOnly(site.publicationStatus)
    }

    def projectsForSite(siteId) {
        get(siteId)?.projects
    }

    /**
     * Creates a site extent object from a supplied latitude and longitude in the correct format, and populates the facet metadata for the extent.
     * @param lat the latitude of the point.
     * @param lon the longitude of the point.

     */
    def siteExtentFromPoint(lat, lon) {

        def extent = [:].withDefault{[:]}
        extent.source = 'point'
        extent.geometry.type = 'Point'
        extent.geometry.decimalLatitude = lat
        extent.geometry.decimalLongitude = lon
        extent.geometry.coordinates = [lon, lat]
        extent.geometry.centre = [lon, lat]
        extent.geometry << metadataService.getLocationMetadataForPoint(lat, lon)
        extent
    }

    def getLocationMetadata(site) {
        //log.debug site
        def loc = getFirstPointLocation(site)
        //log.debug "loc = " + loc
        if (loc && loc.geometry?.decimalLatitude && loc.geometry?.decimalLongitude) {
            return metadataService.getLocationMetadataForPoint(loc.geometry.decimalLatitude, loc.geometry.decimalLongitude)
        }
        return null
    }

    /**
     * For each POI on each supplied site, any photo point photo's taken at that location for any of the supplied
     * location will be added to that POI as a "photos" attribute.
     * @param sites the sites to attach photos to
     * @param activities used for photo metadata
     * @param projects restricts the photos to the supplied projects, also used for photo metadata
     * @return the number of photos attached to POIs
     */
    int addPhotoPointPhotosForSites(List<Map> sites, List activities, List projects) {

        long start = System.currentTimeMillis()
        List siteIds = sites.collect{it.siteId}
        List pois = sites.collect{it.poi?it.poi.collect{poi->poi.poiId}:[]}.flatten()
        int count = 0
        if (pois) {


            Map documents = documentService.search(siteId: siteIds)

            if (documents.documents) {

                Map docsByPOI = documents.documents.groupBy{it.poiId}
                sites.each { site->

                    site.poi?.each { poi ->
                        poi.photos = docsByPOI[poi.poiId]
                        poi.photos?.each{ photo ->
                            photo.activity = activities?.find{it.activityId == photo.activityId}
                            photo.projectId = photo.activity?.projectId ?: photo.projectId
                            Map project = projects.find{it.projectId == photo.projectId}
                            if (photo.activity) {

                                if (!project.reports) {
                                    project.reports = reportService.getReportsForProject(photo.projectId)
                                }
                                Map report = reportService.findReportForDate(photo.activity.plannedEndDate, project.reports)
                                photo.stage = report?report.name:''
                            }
                            photo.projectName = project?.name?:''
                            photo.siteName = site.name
                            photo.poiName = poi.name

                        }
                        poi.photos?.sort{it.dateTaken || ''}
                        poi.photos = poi.photos?.findAll{it.projectId} // Remove photos not associated with a supplied project
                        count += poi.photos?poi.photos.size():0
                    }
                }
            }
        }
        long end = System.currentTimeMillis()
        log.debug "Photopoint initialisation took ${(end-start)} millis"
        count
    }

    def injectLocationMetadata(List sites) {
        sites.each { site ->
            injectLocationMetadata(site)
        }
        sites
    }

    def injectLocationMetadata(Object site) {
        def loc = getFirstPointLocation(site)
        if (loc && loc.geometry?.decimalLatitude && loc.geometry?.decimalLongitude) {
            site << metadataService.getLocationMetadataForPoint(loc.geometry.decimalLatitude, loc.geometry.decimalLongitude)
        }
        site
    }

    def getFirstPointLocation(site) {
        site.location?.find {
            it.type == 'locationTypePoint'
        }
    }

    def getSitesFromIdList(ids) {
        def result = []
        ids.each {
            result << get(it)
        }
        result
    }

    def addPhotoPoint(siteId, photoPoint) {
        photoPoint.type = 'photopoint'
        updatePOI(siteId, photoPoint)
    }

    def updatePOI(String siteId, Map poi) {

        if (!siteId) {
            throw new IllegalArgumentException("The siteId parameter cannot be null")
        }
        def url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}site/${siteId}/poi"
        webService.doPost(url, poi)
    }

    int deletePOI(String siteId, String poiId) {
        def url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}site/${siteId}/poi/${poiId}"
        webService.doDelete(url)
    }

    def get(id, Map urlParams = [:]) {
        if (!id) return null
        webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + 'site/' + id +
                commonService.buildUrlParamsFromMap(urlParams))
    }

    def getRaw(id) {
        def site = get(id, [raw:'true'])
        if (!site || site.error) return [:]
        def documents = documentService.getDocumentsForSite(site.siteId).resp?.documents?:[]
        [site: site, documents:documents as JSON]
    }

    def updateRaw(id, values) {

        values.visibility = 'private'

        if (id) {
            update(id, values)
            [status: 'updated']
        } else {
            def resp = create(values)
            [status: 'created', id:resp.resp.siteId]
        }
    }

    def create(body){
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl') + 'site/', body)
    }

    def update(id, body) {
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl') + 'site/' + id, body)
    }

    def updateProjectAssociations(body) {
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl') + 'project/updateSites/' + body.projectId, body)
    }

    /**
     * Delegates to the SpatialService
     * @see SpatialService#uploadShapefile(MultipartFile)
     */
    Map uploadShapefile(MultipartFile shapefile) {
        spatialService.uploadShapefile(shapefile)
    }


    Map getProjectSites(String projectId) {
        webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + "site/projectSites/$projectId")
    }
    /**
     * Creates a site for a specified project from the supplied site data.
     * @param shapeFileId the id of the shapefile in the spatial portal
     * @param featureId the id of the shapefile feature to use (as returned by the spatial portal upload)
     * @param name the name for the site
     * @param description the description for the site
     * @param projectId the project the site should be associated with.
     */
    Map createSiteFromUploadedShapefile(String shapeFileId, String featureId, String externalId, String name, String description, String projectId) {

        Map returnValue
        Map result = spatialService.createObjectFromShapefileFeature(shapeFileId, featureId)

        if (!result.error && !result.resp.error) {
            String source = SITE_SOURCE_DRAWN
            Map geoJson = result.resp.geoJson
            if (geoJson) {
                result = createSite(projectId, name, description, externalId, source, geoJson)
                if (result.statusCode == HttpStatus.SC_OK && result.resp?.siteId) {
                    returnValue = [success:true, siteId:result.resp.siteId]
                }
                else {
                    returnValue = [success:false, error: "Failed to create site in ecodata: ${result.error}"]
                }
            }
            else {
                returnValue = [success:false, error:"Failed to retrieve geometry for feature $featureId of shapefile $shapeFileId"]
            }
        }
        else {
            String detailedError = result.error ?: result.resp.error
            returnValue = [success:false, error:"Failed to create site for: $name", detail:detailedError]
        }
        returnValue
    }

    /**
     * Creates (and saves) a site definition from a name, description and lat/lon.
     * @param projectId the project the site should be associated with.
     * @param name a name for the site.
     * @param description a description of the site.
     * @param lat latitude of the site centroid.
     * @param lon longitude of the site centroid.
     */
    def createSiteFromPoint(projectId, name, description, lat, lon) {
        def site = [name:name, description:description, projects:[projectId]]
        site.extent = siteExtentFromPoint(lat, lon)

        create(site)
    }

    /**
     * Creates sites for a project from the supplied KML.  The Placemark elements in the KML are used to create
     * the sites, other contextual and styling information is ignored.
     * @param kml the KML that defines the sites to be created
     * @param projectId the project the sites will be assigned to.
     */
    def createSitesFromKml(InputStream kml, String projectId) {

        Parser parser = new Parser(new KMLConfiguration())
        SimpleFeature f = parser.parse(kml)

        def placemarks = []
        extractPlacemarks(f, placemarks)

        def sites = []

        placemarks.each { SimpleFeature placemark ->
            def name = placemark.getAttribute('name')
            def description = placemark.getAttribute('description')

            Geometry geom = placemark.getDefaultGeometry()
            Map geojson = JSON.parse(new GeometryJSON().toString(geom))

            sites << createSite(projectId, name, description, null, 'drawn', geojson)

        }
        return sites
    }

    void createSitesFromKmz(String projectId, InputStream kmzIn) {
        ZipInputStream zis = new ZipInputStream(kmzIn)
        while (zis.available()) {
            ZipEntry next = zis.nextEntry
            if (next.name.endsWith('kml')) {
                createSitesFromKml(zis, projectId)
                break
            }
        }
    }

    /**
     * Extracts any features that have a geometry attached, in the case of KML these will likely be placemarks.
     */
    def extractPlacemarks(features, placemarks) {
        if (!features) {
            return
        }
        features.each { SimpleFeature feature ->
            if (feature.getDefaultGeometry()) {
                placemarks << feature
            }
            else {
                extractPlacemarks(feature.getAttribute('Feature'), placemarks)
            }
        }
    }

    private Map createSite(String projectId, String name, String description, String externalId, String source, Map geometry, String geometryPid = null) {

        // Spatial portal is now returning a geojson of type 'Feature' instead of a geometry object
        // support both
        Map siteGeometry = geometry.geometry ? geometry.geometry : geometry
        Map values = [type:'worksArea', extent: [source: source, geometry: siteGeometry], projects: [projectId], name: name, description: description, externalId:externalId, visibility:'private']
        if (geometryPid && !"null".equals(geometryPid)) {
            values.extent.geometry.pid = geometryPid
            values.extent.pid = geometryPid
        }
        return create(values)
    }

    def delete(id) {
        webService.doDelete(grailsApplication.config.getProperty('ecodata.baseUrl') + 'site/' + id)
    }

    def deleteSitesFromProject(String projectId, List siteIds, boolean deleteOrphans = true){
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl') + 'project/deleteSites/' + projectId, [siteIds:siteIds, deleteOrphans:deleteOrphans])
    }

    /**
     * Returns json that describes in a generic fashion the features to be placed on a map that
     * will represent the site's locations.
     *
     * If no extent is defined, returns an empty JSON object.
     *
     * @param site
     */
    def getMapFeatures(site) {
        def featuresMap = [zoomToBounds: true, zoomLimit: 15, highlightOnHover: true, features: []]
        switch (site.extent?.source) {
            case 'point':
                featuresMap.features << site.extent.geometry
                break
            case 'pid':
                featuresMap.features << site.extent.geometry
                break
            case 'drawn' :
                featuresMap.features << site.extent.geometry
                break
            default:
                featuresMap = [:]
        }

        def asJSON = featuresMap as JSON

        log.debug asJSON.toString()

        asJSON
    }

    Map getSiteGeoJson(String siteId) {
        webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + 'site/' + siteId+'.geojson')
    }

    def lookupLocationMetadataForSite(Map site) {
        Map resp = webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl') + 'site/lookupLocationMetadataForSite', site)
        if (resp.resp) {
            return resp.resp
        }
        resp
    }

    /**
     * Creates and or updates photopoints and photos.
     * @param siteId the site to add photopoints and photos to.
     * @param ownerProperties Identifies the entity that the photos are related to.  Will be added to the created document (e.g. activityId:'1235')
     * @param photoPoints
     * @return a Map that contains the success/failure for each photo update.  If the client supplied a "clientId"
     * for the photo it will be used as the key, otherwise it will be the index of the photo in the supplied array.
     */
    Map updatePhotoPoints(String siteId, Map ownerProperties, List photosToUpdate, List photoPointsToCreate) {

        Map result = [:]
        def allPhotos = photosToUpdate?:[]

        // If new photo points were defined, add them to the site.
        if (photoPointsToCreate) {
            photoPointsToCreate.each { photoPoint ->
                def photos = photoPoint.remove('photos')
                result = addPhotoPoint(siteId, photoPoint)

                // Assign the new photopoint poiId to each photo to be attached to the new photopoint.
                if (!result.error) {
                    photos.each { photo ->
                        photo.poiId = result?.resp?.poiId
                        allPhotos << photo
                    }
                }
            }
        }

        allPhotos.eachWithIndex { photo, i ->

            // Used to correlate response with the request, particularly in the case of new documents which
            // do not have a documentId assigned yet.
            String clientId = photo.remove('clientId') ?: i

            photo.putAll(ownerProperties)

            Map docResponse = documentService.saveStagedImageDocument(photo)
            if (!docResponse.error) {
                result[clientId] = docResponse.resp
            }
            else {
                result[clientId] = docResponse.error
            }
        }

        result
    }

    Map validate(Map site) {
        // Check it's OK, valid (no duplicate coordinates or self intersection) and not too many points.
        Map result = [:]
        int recommendedPointCount = grailsApplication.config.getProperty('site.pointWarningThreshold', Integer, 50)
        int count = getPointCount(site)
        if (count > recommendedPointCount) {
            result = [warning:"Consider reducing the number of points in this polygon if this site is to be used in reporting as performance may be affected"]
        }
        result
    }

    int getPointCount(Map site) {
        Map geom = site.extent.geometry

        int count = 0
        switch (geom.type) {
            case 'Point':
                count = 1
                break
            case 'MultiPoint':
            case 'LineString':
                count = geom.coordinates?.size() ?: 0
                break
            case 'Polygon':
            case 'MultiLineString':
                for (List coords: geom.coordinates) {
                    count += coords?.size() ?: 0
                }
                break
            case 'MultiPolygon':
                for (List coords : geom.coordinates) {
                    for (List nestedCoords: coords) {
                        count += nestedCoords?.size() ?: 0
                    }
                }
                break
        }

        count
    }


}
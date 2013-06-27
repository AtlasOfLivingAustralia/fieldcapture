package au.org.ala.fieldcapture

import grails.converters.JSON
import org.codehaus.groovy.grails.web.mapping.LinkGenerator

class SiteService {

    def webService, grailsApplication, commonService, metadataService
    LinkGenerator grailsLinkGenerator
    static locationTypes = [locationTypePoint: 'point', locationTypeDrawn: 'drawn', locationTypePid: 'pid']

    def list() {
        webService.getJson(grailsApplication.config.ecodata.baseUrl + 'site/').list
    }

    def projectsForSite(siteId) {
        get(siteId)?.projects
    }

    def getLocationMetadata(site) {
        //log.debug site
        def loc = getFirstPointLocation(site)
        //log.debug "loc = " + loc
        if (loc && loc.data?.decimalLatitude && loc.data?.decimalLongitude) {
            return metadataService.getLocationMetadataForPoint(loc.data.decimalLatitude, loc.data.decimalLongitude)
        }
        return null
    }

    def injectLocationMetadata(List sites) {
        sites.each { site ->
            injectLocationMetadata(site)
        }
        sites
    }

    def injectLocationMetadata(Object site) {
        def loc = getFirstPointLocation(site)
        if (loc && loc.data?.decimalLatitude && loc.data?.decimalLongitude) {
            site << metadataService.getLocationMetadataForPoint(loc.data.decimalLatitude, loc.data.decimalLongitude)
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

    def get(id, Map urlParams = [:]) {
        webService.getJson(grailsApplication.config.ecodata.baseUrl + 'site/' + id +
                commonService.buildUrlParamsFromMap(urlParams))
    }

    def create(body){
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'site/', body)
    }

    def update(id, body) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'site/' + id, body)
    }

    def delete(id) {
        webService.doDelete(grailsApplication.config.ecodata.baseUrl + 'site/' + id)
    }

    /**
     * Returns json that describes in a generic fashion the features to be placed on a map that
     * will represent the site's locations.
     *
     * @param site
     */
    def getMapFeatures(site) {
        def featuresMap = [zoomToBounds: true, zoomLimit: 12, highlightOnHover: true, features: []]
        site.location.each { loc ->
            def matchedLocType = locationTypes[loc.type]
            def location = [type: matchedLocType, name: loc.name]
            switch (location.type) {
                case 'point':
                    location.latitude = loc.data.decimalLatitude
                    location.longitude = loc.data.decimalLongitude
                    break
                case 'pid':
                    //retrieve from spatial portal services
                    location.polygonUrl = grailsLinkGenerator.link(
                            controller: 'proxy', action: 'geojsonFromPid',
                            params: [pid: loc.data.pid]
                    )
                case 'drawn' :
                    if(loc.data.shapeType =='polygon'){
                        location.type = 'polygon'
                        location.wkt = loc.data.wkt
                        location.geojson = loc.data.geojson
                    } else if(loc.data.shapeType =='circle'){
                        location.type = 'circle'
                        location.decimalLatitude = loc.data.decimalLatitude
                        location.decimalLongitude = loc.data.decimalLongitude
                        location.radius = loc.data.radius
                    } else if(loc.data.shapeType =='rectangle'){
                        location.type = 'rectangle'
                        location.minLat = loc.data.minLat
                        location.minLon = loc.data.minLon
                        location.maxLat = loc.data.maxLat
                        location.maxLon = loc.data.maxLon
                    } else {
                        log.error('Unrecognised shapeType retrieved from DB')
                    }
            }
            featuresMap.features << location
        }
        featuresMap as JSON
    }

    static metaModel() {
        return [domain: 'site',
                model: [
                        [name:'siteName', type:'text', immutable:true],
                        [name:'externalId', type:'text'],
                        [name:'type', type:'text'],
                        [name:'area', type:'text'],
                        [name:'description', type:'text'],
                        [name:'notes', type:'text'],
                        [name:'location', type:'list', itemType: 'Location', itemModel: [
                                [name:'name', type: 'text'],
                                [name:'type', type:'list', itemType:'text', listValues:[
                                        'locationTypeNone','locationTypePoint','locationTypePid','locationTypeUpload',
                                ]],
                                [name:'data', type:'list', itemType:[
                                        [name:'NoneLocation', type:'null'],
                                        [name:'PointLocation', type:'list', itemType:[
                                                [name:'decimalLatitude', type:'latLng'],
                                                [name:'decimalLongitude', type:'latLng'],
                                                [name:'uncertainty', type:'text'],
                                                [name:'precision', type:'text'],
                                                [name:'datum', type:'text']
                                        ]],
                                        [name:'PidLocation', type:'list', itemType:[
                                                [name:'pid', type: 'text']
                                        ]],
                                        [name:'UploadLocation', type:'list', itemType:[
                                                [name:'shape', type: 'text'],
                                                [name:'pid', type: 'text']
                                        ]],
                                        [name:'DrawnLocation', type:'list', itemType:[
                                                [name:'decimalLatitude', type:'latLng'],
                                                [name:'decimalLongitude', type:'latLng'],
                                                [name:'radius', type:'text'],
                                                [name:'wkt', type:'text']
                                        ]]
                                ]]
                            ]
                        ],
                ]
            ]
    }
}
package au.org.ala.fieldcapture

import grails.converters.JSON
import org.codehaus.groovy.grails.web.mapping.LinkGenerator

class SiteService {

    def webService, grailsApplication, commonService, cacheService
    LinkGenerator grailsLinkGenerator

    def list() {
        webService.getJson(grailsApplication.config.ecodata.baseUrl + 'site/').list
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
            site << getLocationMetadataForPoint(loc.data.decimalLatitude, loc.data.decimalLongitude)
        }
        site
    }

    def getFirstPointLocation(site) {
        site.location?.find {
            it.type == 'locationTypePoint'
        }
    }

    def getLocationMetadataForPoint(lat, lng) {
        cacheService.get(lat + ',' + lng, {
            def url = 'http://spatial.ala.org.au/ws/intersect/cl22,cl916/-29.911/132.769'
            def features = webService.getJson(url)
            [state: features.find({it.field == 'cl22'})?.value,
             nrm: features.find({it.field == 'cl916'})?.value]
        })
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

    def update(id, body) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'site/' + id, body)
    }

    def delete(id) {
        webService.doDelete(grailsApplication.config.ecodata.baseUrl + 'site/' + id)
    }

    static locationTypes = [locationTypePoint: 'point', locationTypePolygon: 'polygon', locationTypePid: 'pid']
    /**
     * Returns json that describes in a generic fashion the features to be placed on a map that
     * will represent the site's locations.
     *
     * @param site
     */
    def getMapFeatures(site) {
        def featuresMap = [zoomToBounds: true, zoomLimit: 12, highlightOnHover: true, features: []]
        site.location.each { loc ->
            def location = [type: locationTypes[loc.type], name: loc.name]
            switch (location.type) {
                case 'point':
                    location.latitude = loc.data.decimalLatitude
                    location.longitude = loc.data.decimalLongitude
                    break
                case 'pid':
                    location.polygonUrl = grailsLinkGenerator.link(
                            controller: 'proxy', action: 'geojsonFromPid',
                            params: [pid: loc.data.pid]
                    )
            }
            featuresMap.features << location
        }
        return featuresMap as JSON
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
                                        ]]
                                ]]
                            ]
                        ],
                ]
            ]
    }


}

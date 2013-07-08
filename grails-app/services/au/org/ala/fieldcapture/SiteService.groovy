package au.org.ala.fieldcapture

import grails.converters.JSON
import org.codehaus.groovy.grails.web.mapping.LinkGenerator

class SiteService {

    def webService, grailsApplication, commonService, metadataService
    LinkGenerator grailsLinkGenerator

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
        if (loc && loc.geometry?.decimalLatitude && loc.geometry?.decimalLongitude) {
            return metadataService.getLocationMetadataForPoint(loc.geometry.decimalLatitude, loc.geometry.decimalLongitude)
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

    def updateProjectAssociations(body) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'project/updateSites/' + body.projectId, body)
    }

    def persistSiteExtent(name, geometry) {
        def body = [geojson: geometry, name: name, description:'my description', user_id: '34']
        def resp = webService.doPost("http://spatial-dev.ala.org.au/ws/shape/upload/geojson", body)
        println resp
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
        def featuresMap = [zoomToBounds: true, zoomLimit: 15, highlightOnHover: true, features: []]
        switch (site.extent.source) {
            case 'point':
                featuresMap.features << site.extent.geometry
                break
            case 'pid':
                //retrieve from spatial portal services
                site.extent.geometry.polygonUrl = grailsLinkGenerator.link(
                        controller: 'proxy', action: 'geojsonFromPid',
                        params: [pid: site.extent.geometry.pid]
                )
                featuresMap.features << site.extent.geometry
                break
            case 'drawn' :
                featuresMap.features << site.extent.geometry
        }

        def asJSON = featuresMap as JSON

        println asJSON

        asJSON
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
                        [name:'extent', type:'Location', itemModel: [
                                [name:'name', type: 'text'],
                                [name:'type', type:'list', itemType:'text', listValues:[
                                        'locationTypeNone','locationTypePoint','locationTypePid','locationTypeUpload',
                                ]],
                                [name:'geometry', type:'list', itemType:[
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
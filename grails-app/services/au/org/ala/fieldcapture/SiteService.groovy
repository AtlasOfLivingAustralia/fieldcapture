package au.org.ala.fieldcapture

import grails.converters.JSON
import org.codehaus.groovy.grails.web.mapping.LinkGenerator

class SiteService {

    def webService, grailsApplication
    LinkGenerator grailsLinkGenerator

    static testSites = [:]
    static projects = [:]

    def list() {
        webService.getJson(grailsApplication.config.ecodata.baseUrl + 'site/').list
    }

    def getSitesFromIdList(ids) {
        def result = []
        ids.each {
            result << get(it)
        }
        result
    }

    def getTestProjects() {
        if (!testSites) {
            loadTestSites()
        }
        return projects
    }

    def get(id) {
        webService.getJson(grailsApplication.config.ecodata.baseUrl + 'site/' + id)
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

    static metaView() {
        return [domain: 'site',
                fields: [
                    [field:'siteName', label:'Site name', style:'title'],
                    [field:'externalId', label:'External Id', help:'to do'],
                    [field:'type', label:'Type'],
                    [field:'area', label:'Area (decimal hectares)', help:'to do'],
                    [field:'description', label:'Description'],
                    [field:'notes', label:'Notes'],
                    [field:'decimalLatitude', label:'Latitude']
                    // etc
                ]]
    }

    static dummySites = [
           [site_id: 1,
            site_external_id: '',
            site_name: 'ASH-MACC-A - 2',
            site_type: '',
            site_creation_date: '',
            site_description: '',
            site_habitat: '',
            site_polygon: '',
            site_latitude: '',
            site_longitude: '',
            site_uncertainty: '',
            site_precision: '',
            datum: '',
            site_area: '',
            site_recording_method: '',
            site_land_tenure: '',
            site_protection_mechanism: '',
            site_activities: '',
            activity_description: '',
            media_id: '',
            media_type: '',
            site_notes: ''
           ]
    ]

    def loadTestSites() {
        testSites = [:]
        projects = [:]
        def testFile = new File('/data/fieldcapture/site-test-data.csv')
        testFile.eachCsvLine { tokens ->
            def site = [site_name: tokens[4],
                    site_id: tokens[4].encodeAsMD5(), // base on name for now
                    organisation_name: tokens[1],
                    project_name: tokens[2],
                    latitude: tokens[10],
                    longitude: tokens[9],
                    site_notes: tokens[13],
                    site_comments: tokens[15]
            ]
            if (site.site_name != 'SITE_NAME' && site.site_name != 'Site Name') {
                testSites.put site.site_id, site
                def projectId = site.project_name.encodeAsMD5()
                if (!projects.containsKey(projectId)) {
                    projects.put projectId, [project_name: site.project_name,
                            project_id: projectId, project_sites: []]
                }
                if (site.project_name != '') {
                    projects[projectId].project_sites << site.site_id
                    projects[projectId].latitude = site.latitude
                    projects[projectId].longitude = site.longitude
                }
            }
        }
        //testSites.each { println it }
        println testSites.size() + " sites"
        println projects.size() + " projects"


    }
}

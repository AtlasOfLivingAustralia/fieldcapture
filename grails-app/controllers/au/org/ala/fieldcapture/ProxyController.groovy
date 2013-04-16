package au.org.ala.fieldcapture

import grails.converters.JSON

class ProxyController {

    def webService

    def geojsonFromPid(String pid) {
        log.debug "requesting pid ${pid}"
        def resp = webService.get(grailsApplication.config.spatialLayerServices.baseUrl +
                "geometry/geojson/${pid}")
        //log.debug resp
        render resp as String
    }
}

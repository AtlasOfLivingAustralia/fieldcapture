package au.org.ala.fieldcapture

import grails.converters.JSON

class ProxyController {

    def webService

    def geojsonFromPid(String pid) {
        log.debug "requesting pid ${pid}"
        def resp = webService.get(grailsApplication.config.spatialLayerServices.baseUrl +
                "geometry/${pid}/geojson")
        //log.debug resp
        render resp as String
    }
}

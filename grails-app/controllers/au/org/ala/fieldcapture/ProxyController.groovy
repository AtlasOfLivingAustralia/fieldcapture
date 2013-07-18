package au.org.ala.fieldcapture

import grails.converters.JSON

class ProxyController {

    def webService

    def geojsonFromPid(String pid) {
        def shpUrl = grailsApplication.config.spatialLayerServices.baseUrl + "shape/geojson/${pid}"
        log.debug "requesting pid ${pid} URL: ${shpUrl}"
        def resp = webService.get(shpUrl)
        //log.debug resp
        render resp as String
    }
}

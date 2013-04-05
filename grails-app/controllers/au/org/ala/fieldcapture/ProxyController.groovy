package au.org.ala.fieldcapture

import grails.converters.JSON

class ProxyController {

    def webService

    def geojsonFromPid(String pid) {
        log.debug "requesting pid ${pid}"
        def resp = webService.get("http://spatial-dev.ala.org.au/layers-service/getgeojson?id=${pid}")
        //log.debug resp
        render resp
    }
}

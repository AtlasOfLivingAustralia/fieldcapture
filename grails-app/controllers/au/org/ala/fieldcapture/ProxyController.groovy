package au.org.ala.fieldcapture

class ProxyController {

    def webService

    def geojsonFromPid(String pid) {
        def shpUrl = grailsApplication.config.spatialLayerServices.baseUrl + "shape/geojson/${pid}"
        log.debug "requesting pid ${pid} URL: ${shpUrl}"
        def resp = webService.get(shpUrl)
        //log.debug resp
        render resp as String
    }

    def speciesLists() {
        render webService.get("http://lists.ala.org.au/ws/speciesList")
    }

    def speciesList() {
        render webService.get("http://lists.ala.org.au/ws/speciesList?druid=${params.druid}")
    }
}

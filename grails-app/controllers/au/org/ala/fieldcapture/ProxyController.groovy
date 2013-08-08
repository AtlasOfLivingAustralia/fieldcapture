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
        render webService.get("${grailsApplication.config.lists.baseUrl}/ws/speciesList")
    }

    def speciesList() {
        render webService.get("${grailsApplication.config.lists.baseUrl}/ws/speciesList?druid=${params.druid}")
    }

    def documentUpdate(String id) {
        def body = request.JSON
        //log.debug "body = ${body}"
        def url = grailsApplication.config.ecodata.baseUrl + "document" + (id ? "/" + id : '')
        render webService.doPost(url, body)
    }
}

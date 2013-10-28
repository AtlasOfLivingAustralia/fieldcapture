package au.org.ala.fieldcapture

import grails.converters.JSON

class ProxyController {

    def webService, commonService, projectService

    def geojsonFromPid(String pid) {
        def shpUrl = grailsApplication.config.spatialLayerServices.baseUrl + "shape/geojson/${pid}"
        log.debug "requesting pid ${pid} URL: ${shpUrl}"
        def resp = webService.get(shpUrl, false)
        //log.debug resp
        render resp as String
    }

    def speciesLists() {
        def paramString = commonService.buildUrlParamsFromMap(params)
        render webService.get("${grailsApplication.config.lists.baseURL}/ws/speciesList${paramString}", false)
    }

    def speciesList() {
        render webService.get("${grailsApplication.config.lists.baseURL}/ws/speciesList?druid=${params.druid}", false)
    }

    def speciesItemsForList() {
        render webService.get("${grailsApplication.config.lists.baseURL}/ws/speciesListItems/${params.druid}", false)
    }

    def speciesListPost() {
        def postBody = request.JSON
        def druidParam = (postBody.druid) ? "/${postBody.druid}" : "" // URL part
        def postResponse = webService.doPost("${grailsApplication.config.lists.baseURL}/ws/speciesListPost${druidParam}", postBody)
        if (postResponse.resp && postResponse.resp.druid) {
            def druid = postResponse.resp?.druid?:druid
            postBody.druid = druid
            def result = projectService.update(postBody.projectId, [listId: druid, listReason: postBody.reason])

            if (result.error) {
                render result as JSON
            }
            render postBody as JSON
        } else {
            render status: 500, text: postResponse.error?:"Error calling webservice"
        }
    }

    def documentUpdate(String id) {
        def body = request.JSON
        //log.debug "body = ${body}"
        def url = grailsApplication.config.ecodata.baseUrl + "document" + (id ? "/" + id : '')
        render webService.doPost(url, body)
    }
}

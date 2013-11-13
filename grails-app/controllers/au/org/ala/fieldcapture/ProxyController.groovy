package au.org.ala.fieldcapture

import grails.converters.JSON

class ProxyController {

    def webService, commonService, projectService

    def geojsonFromPid(String pid) {
        def shpUrl = "${grailsApplication.config.spatial.layersUrl}/shape/geojson/${pid}"
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

    /**
     * Proxies to the ecodata document controller.
     * @param id the id of the document to update (if not supplied, a create operation will be assumed).
     * @return the result of the update.
     */
    def documentUpdate(String id) {

        def url = grailsApplication.config.ecodata.baseUrl + "document" + (id ? "/" + id : '')
        def result
        if (request.respondsTo('getFile')) {
            def f = request.getFile('files')

            result =  webService.postMultipart(url, [document:params.document], f)
            render result.content as JSON
        }
        else {
            render webService.doPost(url, JSON.parse(params.document)) as JSON;
        }

    }

    /**
     * Proxies to the ecodata document controller to delete the document with the supplied id.
     * @param id the id of the document to delete.
     * @return the result of the deletion.
     */
    def deleteDocument(String id) {
        println 'deleting doc with id:'+id
        def url = grailsApplication.config.ecodata.baseUrl + "document/" + id
        def responseCode = webService.doDelete(url)
        render status: responseCode
    }
}

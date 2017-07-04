package au.org.ala.merit

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
        render webService.get("${grailsApplication.config.lists.baseURL}/ws/speciesListItems/${params.druid}?includeKVP=true", false)
    }

    def intersect(){
        render webService.get("${grailsApplication.config.spatial.layersUrl}/intersect/${params.layerId}/${params.lat}/${params.lng}", false)
    }

    def features(){
        render webService.get("${grailsApplication.config.spatial.layersUrl}/objects/${params.layerId}", false)
    }

    def feature(){
        render webService.get("${grailsApplication.config.spatial.layersUrl}/object/${params.featureId}", false)
    }

    def speciesProfile(String id) {

        // While the BIE is in the process of being cut over to the new version we have to handle both APIs.
        def url = "${grailsApplication.config.bie.baseURL}/ws/species/shortProfile/${id}"
        Map result = webService.getJson(url)

        render result
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
     * Returns an excel template that can be used to populate a table of data in an output form.
     */
    def excelOutputTemplate() {
        String url =  "${grailsApplication.config.ecodata.baseUrl}metadata/excelOutputTemplate?type=${params.type?.encodeAsURL()}&listName=${params.listName?.encodeAsURL()}"

        webService.proxyGetRequest(response, url)
        return null
    }

    /**
     * Returns an excel template that can be used to populate the bulk activity table
     */
    def excelBulkActivityTemplate() {

        String url =  "${grailsApplication.config.ecodata.baseUrl}metadata/excelBulkActivityTemplate"

        webService.proxyPostRequest(response, url, params)
        return null
    }

    /** Proxies the ALA image service as the development server doesn't support SSL. */
    def getImageInfo(String id) {
        def detailsUrl = "${grailsApplication.config.ala.image.service.url}ws/getImageInfo?id=${id}"
        def result = webService.getJson(detailsUrl) as JSON

        if (params.callback) {
            result = "${params.callback}(${result.toString()})"
            response.setContentType('text/plain;charset=UTF8')

            render result.toString()
        }
        else {
            render result
        }

    }
}

package au.org.ala.fieldcapture

import grails.converters.JSON
import org.apache.commons.io.FilenameUtils

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

    def intersect(){
        render webService.get("${grailsApplication.config.spatial.layersUrl}/intersect/${params.layerId}/${params.lat}/${params.lng}", false)
    }

    def features(){
        render webService.get("${grailsApplication.config.spatial.layersUrl}/objects/${params.layerId}", false)
    }

    def feature(){
        render webService.get("${grailsApplication.config.spatial.layersUrl}/object/${params.featureId}", false)
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
        if (request.respondsTo('getFile')) {
            def f = request.getFile('files')
            def originalFilename = f.getOriginalFilename()
            if(originalFilename){
                def extension = FilenameUtils.getExtension(originalFilename)?.toLowerCase()
                if (extension && !grailsApplication.config.upload.extensions.blacklist.contains(extension)){
                    def result =  webService.postMultipart(url, [document:params.document], f)
                    render result.content as JSON
                } else {
                    response.setStatus(400)
                    //flag error for extension
                    def error = [error: "Files with the extension '.${extension}' are not permitted.",
                    statusCode: "400",
                    detail: "Files with the extension ${extension} are not permitted."]
                    render error
                }
            } else {
                //flag error for extension
                response.setStatus(400)
                def error = [error: "Unable to retrieve the file name.",
                statusCode: "400",
                detail: "Unable to retrieve the file name."]
                render error
            }
        } else {
            render webService.doPost(url, JSON.parse(params.document)) as JSON;
        }
    }

    /**
     * Proxies to the eco data document controller to delete the document with the supplied id.
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

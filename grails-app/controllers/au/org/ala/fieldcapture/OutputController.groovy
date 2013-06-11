package au.org.ala.fieldcapture

import grails.converters.JSON

class OutputController {

    def outputService, activityService, siteService, metadataService

    static ignore = ['action','controller','id']

    def index(String id) {
        def output = outputService.get(id)
        if (!output || output.error) {
            forward(action: 'list', model: [error: output.error])
        } else {
            def activity = activityService.get(output.activityId)
            def site = siteService.get(activity.siteId)
            def modelName = metadataService.getModelName(output.name)
            [output: output, activity: activity, site: site,
                 model: metadataService.getDataModel(modelName)]
        }
    }

    def edit(String id) {
        def output = outputService.get(id)
        if (!output || output.error) {
            forward(action: 'list', model: [error: output.error])
        } else {
            def activity = activityService.get(output.activityId)
            def site = siteService.get(activity.siteId)
            def modelName = metadataService.getModelName(output.name)
            [output: output, activity: activity, site: site,
                    model: metadataService.getDataModel(modelName)]
        }
    }

    def create(String activityId, String outputName) {
        def output = [activityId: activityId, name: outputName]
        def activity = activityService.get(output.activityId)
        def site = siteService.get(activity.siteId)
        def modelName = metadataService.getModelName(output.name)
        render view: 'edit', model:
            [output: output, activity: activity, site: site,
                model: metadataService.getDataModel(modelName)]
    }

    /**
     * Updates existing or creates new output.
     *
     * If id is blank, a new output will be created and added to the activity
     *
     * @param id outputId
     * @return
     */
    def ajaxUpdate(String id) {
        def postBody = request.JSON
        if (!id || id == 'null') { id = ''}
        println "Body: " + postBody
        println "Params:"
        params.each { println it }
        def values = [:]
        // filter params to remove keys in the ignore list
        postBody.each { k, v ->
            if (!(k in ignore)) {
                values[k] = v
            }
        }
        log.debug (values as JSON).toString()
        log.debug "id=${id} class=${id.getClass()}"
        def result = outputService.update(id, (values as JSON).toString())
        log.debug "result is " + result
        if (result.error) {
            render result as JSON
        } else {
            //println "json result is " + (result as JSON)
            render result.resp as JSON
        }
    }

    def verifyTest1() {
        def t1 = new Databindings()
        render "ok"
    }

    def verifyTest2() {
        def t1 = new AttributeMap()
        render "ok"
    }

}

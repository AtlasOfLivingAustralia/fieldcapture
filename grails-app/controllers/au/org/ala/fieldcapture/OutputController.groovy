package au.org.ala.fieldcapture

import grails.converters.JSON

class OutputController {

    def outputService, activityService, siteService

    static ignore = ['action','controller','id']

    def index(String id) {
        def output = outputService.get(id)
        if (!output || output.error) {
            forward(action: 'list', model: [error: output.error])
        } else {
            def activity = activityService.get(output.activityId)
            def site = siteService.get(activity.siteId)
            [output: output, activity: activity, site: site]
        }
    }

    def edit(String id) {
        def output = outputService.get(id)
        if (!output || output.error) {
            forward(action: 'list', model: [error: output.error])
        } else {
            def activity = activityService.get(output.activityId)
            def site = siteService.get(activity.siteId)
            [output: output, activity: activity, site: site]
        }
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
        if (!id) { id = ''}
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
            println "json result is " + (result as JSON)
            render result.resp as JSON
        }
    }

}

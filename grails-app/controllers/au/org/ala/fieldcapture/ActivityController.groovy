package au.org.ala.fieldcapture

import grails.converters.JSON

class ActivityController {

    def activityService, siteService

    static ignore = ['action','controller','id']

    def index(String id) {
        def activity = activityService.get(id)
        if (!activity || activity.error) {
            forward(action: 'list', model: [error: activity.error])
        } else {
            // this will be driven by the meta-model
            // just hard wire for now
            ['startDate','endDate'].each { activity[it] = toSimpleDate activity[it] }
            //todo: ensure there are no control chars (\r\n etc) in the json as
            //todo:     this will break the client-side parser
            def site = siteService.get(activity.siteId)
            [activity: activity, site: site, json: (activity.types as JSON).toString()]
        }
    }

    def edit(String id) {
        def activity = activityService.get(id)
        if (activity) {
            // this will be driven by the meta-model
            // just hard wire for now
            ['startDate','endDate'].each { activity[it] = toSimpleDate activity[it] }
            def site = siteService.get(activity.siteId)
            [activity: activity, site: site, json: (activity as JSON).toString()]
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    /**
     * Updates existing or creates new activity.
     *
     * If id is blank, a new activity will be created and added to the site
     *
     * @param id activityId
     * @return
     */
    def ajaxUpdate(String id) {
        def postBody = request.JSON
        if (!id) { id = ''}
        println "Body: " + postBody
        println "Params:"
        params.each { println it }
        def siteId = params.siteId
        def values = [:]
        // filter params to remove:
        //  1. keys in the ignore list; &
        //  2. keys with dot notation - the controller will automatically marshall these into maps &
        //  3. keys in nested maps with dot notation
        postBody.each { k, v ->
            if (!(k in ignore)) {
                values[k] = v //reMarshallRepeatingObjects(v);
            }
        }
        // this will be driven by the meta-model
        // just hard wire for now
        ['startDate','endDate'].each { values[it] = fromSimpleDate values[it] }
        log.debug (values as JSON).toString()
        log.debug "id=${id} class=${id.getClass()}"
        def result = activityService.update(id, (values as JSON).toString())
        println "result is " + result
        println "json result is " + (result as JSON)
        render result.resp as JSON
    }

    def create(String id) {
        def site = siteService.get(id)
        if (site) {
            render view: 'edit', model:
                    [site: site, activity: [activityId: '', siteId: id]]
        } else {
            forward(action: 'list', model: [error: 'no such site'])
        }
    }

    def ajaxDelete(String id) {
        log.debug "deleting ${id}"
        def respCode = activityService.delete(id)
        def resp = [code: respCode.toString()]
        //log.debug "response = ${resp}"
        render resp as JSON
    }

    def list() {
        // will show a list of activities
        // but for now just go home
        forward(controller: 'home')
    }

    def toSimpleDate = { value ->
        log.debug value
        activityService.convertToSimpleDate(value)
    }

    def fromSimpleDate = { value ->
        activityService.convertFromSimpleDate(value)
    }
}

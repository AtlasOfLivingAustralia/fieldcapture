package au.org.ala.fieldcapture

import grails.converters.JSON

class ActivityController {

    def activityService, siteService, metadataService

    static ignore = ['action','controller','id']

    def index(String id) {
        def activity = activityService.get(id)
        if (!activity || activity.error) {
            forward(action: 'list', model: [error: activity.error])
        } else {
            //todo: ensure there are no control chars (\r\n etc) in the json as
            //todo:     this will break the client-side parser
            def site = siteService.get(activity.siteId)
            [activity: activity, site: site]
        }
    }

    def edit(String id) {
        def activity = activityService.get(id)
        if (activity) {
            def site = siteService.get(activity.siteId)
            log.debug site
            [activity: activity, site: site, json: (activity as JSON).toString(),
                activityTypes: metadataService.activityTypesList()]
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
        log.debug (values as JSON).toString()
        log.debug "id=${id} class=${id.getClass()}"
        def result = activityService.update(id, (values as JSON).toString())
        log.debug "result is " + result
        if (result.error) {
            render result as JSON
        } else {
            println "json result is " + (result as JSON)
            render result.resp as JSON
        }
    }

    def create(String id) {
        def site = siteService.get(id)
        if (site) {
            render view: 'edit', model:
                    [site: site, activity: [activityId: '', siteId: id], create: true,
                     activityTypes: metadataService.activityTypesList()]
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
}

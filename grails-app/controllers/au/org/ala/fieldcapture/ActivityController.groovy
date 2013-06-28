package au.org.ala.fieldcapture

import grails.converters.JSON

class ActivityController {

    def activityService, siteService, projectService, metadataService

    static ignore = ['action','controller','id']

    private Map fatten(model) {
        model.projects = model.activity.projectId ? [projectService.get(model.activity.projectId)] : null
        model.site = model.activity.siteId ? siteService.get(model.activity.siteId) : null
        if (!model.projects && model.site) {
            model.projects = model.site.projects
        }
        model.sites = siteService.list().collect({[name:it.name,siteId:it.siteId]})
        model.projects = projectService.list().collect({[name:it.name,projectId:it.projectId]})
        //map.model = metadataService.getDataModelFromOutputName(output.name)
        model
    }

    def index(String id) {
        def activity = activityService.get(id)
        if (!activity || activity.error) {
            flash.error = activity.error
            redirect(controller: 'home')
        } else {
            //todo: ensure there are no control chars (\r\n etc) in the json as
            //todo:     this will break the client-side parser
            def model = fatten([activity: activity, returnTo: params.returnTo])
            log.debug model
            model
        }
    }

    def edit(String id) {
        def activity = activityService.get(id)
        if (activity) {
            def model = fatten([activity: activity, returnTo: params.returnTo])
            model.activityTypes = metadataService.activityTypesList()
            model
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    def create(String siteId, String projectId) {
        def activity = [activityId: "", siteId: siteId, projectId: projectId]
        def model = fatten([activity: activity, returnTo: params.returnTo, create: true,
                activityTypes: metadataService.activityTypesList()])
        render view: 'edit', model: model
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
        def result = activityService.update(id, values)
        log.debug "result is " + result
        if (result.error) {
            render result as JSON
        } else {
            println "json result is " + (result as JSON)
            render result.resp as JSON
        }
    }

    def delete(String id) {
        log.debug "deleting ${id}"
        def respCode = activityService.delete(id)
        if (params.returnTo) {
            redirect(url: params.returnTo)
        } else {
            redirect(controller: 'home')
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
        log.debug('redirecting to home')
        redirect(controller: 'home')
    }
}

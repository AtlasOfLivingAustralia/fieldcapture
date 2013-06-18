package au.org.ala.fieldcapture

import grails.converters.JSON

class ActivityController {

    def activityService, siteService, projectService, metadataService

    static ignore = ['action','controller','id']

    private Map fatten(activity) {
        def map = [:]
        map.projects = activity.projectId ? [projectService.get(activity.projectId)] : []
        map.site = activity.siteId ? siteService.get(activity.siteId) : [:]
        if (!map.projects && map.site) {
            map.projects = map.site.projects
        }
        //map.model = metadataService.getDataModelFromOutputName(output.name)
        map
    }

    def index(String id) {
        def activity = activityService.get(id)
        if (!activity || activity.error) {
            flash.error = activity.error
            redirect(controller: 'home')
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
            def fat = fatten activity
            [activity: activity, site: fat.site, projects: fat.projects,
                activityTypes: metadataService.activityTypesList(), returnTo: params.returnTo]
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    def create(String siteId, String projectId) {
        def site = siteId ? siteService.get(siteId) : [:]
        def project = projectId ? projectService.get(projectId) : [:]
        def activity = [activityId: '']
        if (site) { activity << [siteId: site.siteId] }
        if (project) { activity << [projectId: project.projectId] }
        render view: 'edit', model:
                [site: site, project: project, activity: activity, create: true,
                 activityTypes: metadataService.activityTypesList(),
                 returnTo: params.returnTo]
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

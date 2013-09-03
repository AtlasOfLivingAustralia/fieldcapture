package au.org.ala.fieldcapture

import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONArray

class ActivityController {

    def activityService, siteService, projectService, metadataService

    static ignore = ['action','controller','id']

    /*private Map fatten(model) {
        // todo: all this needs to be made efficient when we know what we actually need
        model.projects = model.activity.projectId ? [projectService.get(model.activity.projectId)] : null
        model.site = model.activity.siteId ? siteService.get(model.activity.siteId) : null
        if (!model.projects && model.site) {
            model.projects = model.site.projects
        }
        model.sites = siteService.list().collect({[name:it.name,siteId:it.siteId]})
        if (model.projects && !model.site) {
            // change the list of sites to just the sites of this project
            model.sites = siteService.sitesForProject(model.activity.projectId)
        }
        model.projects = projectService.list().collect({[name:it.name,projectId:it.projectId]})
        //map.model = metadataService.getDataModelFromOutputName(output.name)
        model
    }*/

    def index(String id) {
        def activity = activityService.get(id)
        if (!activity || activity.error) {
            flash.error = activity.error
            redirect(controller: 'home')
        } else {
            //todo: ensure there are no control chars (\r\n etc) in the json as
            //todo:     this will break the client-side parser
            def model = [activity: activity, returnTo: params.returnTo]
            model.site = model.activity.siteId ? siteService.get(model.activity.siteId) : null
            model.project = model.activity.projectId ? [projectService.get(model.activity.projectId)] : null
            log.debug model
            model
        }
    }

    def edit(String id) {
        def activity = activityService.get(id)
        if (activity) {
            // pass the activity
            def model = [activity: activity, returnTo: params.returnTo]
            // the activity meta-model
            model.metaModel = metadataService.getActivityModel(activity.type)
            // the array of output models
            model.outputModels = model.metaModel?.outputs?.collectEntries {
                [ it, metadataService.getDataModelFromOutputName(it)] }
            // Add the species lists that are relevant to this activity.
            model.speciesLists = new JSONArray()
            model.project?.speciesLists?.each { list ->
                if (list.purpose == activity.type) {
                    model.speciesLists.add(list)
                }
            }
            // the site
            model.site = model.activity.siteId ? siteService.get(model.activity.siteId) : null
            // the project
            model.project = model.activity.projectId ? projectService.get(model.activity.projectId) : null
            model
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    /**
     * Displays page to create an activity.
     *
     * Depending on where this is called from, either the site or the project or neither is known.
     * If neither is known, then the full list of projects and sites is injected for selection.
     * If project is known (created from a project page) then the list of sites associated with
     * that project is injected. The project cannot be changed.
     * If the site is known (created from a site page) then the list of projects associated with
     * that site is injected. The site cannot be changed.
     *
     * @param siteId may be null
     * @param projectId may be null
     * @return
     */
    def create(String siteId, String projectId) {
        def activity = [activityId: "", siteId: siteId, projectId: projectId]
        def model = [activity: activity, returnTo: params.returnTo, create: true,
                activityTypes: metadataService.activityTypesList()]
        model.project = projectId ? projectService.get(projectId) : null
        model.site = siteId ? siteService.get(siteId) : null
        if (!model.project && !model.site) {
            model.sites = siteService.list().collect({[name:it.name,siteId:it.siteId]})
            model.projects = projectService.list().collect({[name:it.name,projectId:it.projectId]})
        }
        model
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
        log.debug "Body: " + postBody
        log.debug "Params:"
        params.each { log.debug it }

        // remove outputs for now - once output exiting with the activity page is working we
        //  will need to save these separately
        postBody.remove('outputs')

        def siteId = params.siteId
        def values = [:]
        // filter params to remove keys in the ignore list
        postBody.each { k, v ->
            if (!(k in ignore)) {
                values[k] = v
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

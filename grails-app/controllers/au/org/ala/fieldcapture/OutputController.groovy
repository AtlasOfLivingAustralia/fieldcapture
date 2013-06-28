package au.org.ala.fieldcapture

import grails.converters.JSON

class OutputController {

    def outputService, activityService, siteService, metadataService, projectService

    static ignore = ['action','controller','id']

    private Map fatten(output) {
        def map = [activity: activityService.get(output.activityId)]
        map.projects = map.activity.projectId ? [projectService.get(map.activity.projectId)] : []
        map.site = map.activity.siteId ? siteService.get(map.activity.siteId) : [:]
        if (!map.projects && map.site) {
            map.projects = map.site.projects
        }
        map.model = metadataService.getDataModelFromOutputName(output.name)
        map
    }

    def index(String id) {
        def output = outputService.get(id)
        if (!output || output.error) {
            forward(action: 'list', model: [error: output.error])
        } else {
            def fat = fatten output
            [output: output, activity: fat.activity, site: fat.site, projects: fat.projects,
                    model: fat.model, returnTo: params.returnTo]
        }
    }

    def edit(String id) {
        def output = outputService.get(id)
        if (!output || output.error) {
            forward(action: 'list', model: [error: output.error])
        } else {
            def fat = fatten output
            log.debug(fat.projects)
            [output: output, activity: fat.activity, site: fat.site, projects: fat.projects,
             model: fat.model, returnTo: params.returnTo]
        }
    }

    def create(String activityId, String outputName) {
        def output = [activityId: activityId, name: outputName]
        def fat = fatten output
        render view: 'edit', model:
                [output: output, activity: fat.activity, site: fat.site, projects: fat.projects,
                 model: fat.model, returnTo: params.returnTo]
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
        def result = outputService.update(id, values)
        log.debug "result is " + result
        if (result.error) {
            render result as JSON
        } else {
            //println "json result is " + (result as JSON)
            render result.resp as JSON
        }
    }

    def delete(String id) {
        outputService.delete(id);
        if (params.returnTo) {
            redirect url: grailsApplication.config.grails.serverURL + '/' +
                    params.returnTo
        } else {
            redirect controller: 'home'
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

package au.org.ala.merit

import au.org.ala.ecodata.forms.AttributeMap
import au.org.ala.ecodata.forms.Databindings
import grails.converters.JSON

/**
 * As of 10/9/2013 the editing of outputs is done only on the activity edit page.
 *
 * So direct requests to show or edit outputs (such as following links from audit logs)
 * are redirected to the activity controller.
 */
class OutputController {

    def outputService, activityService, siteService, metadataService, projectService

    static ignore = ['action','controller','id']

    def index(String id) {
        def output = outputService.get(id)
        if (!output || output.error) {
            flash.errorMessage = "Output with id = ${id} does not exist."
            redirect(controller: 'home', model: [error: output.error])
        } else {
            redirect controller: 'activity', action: 'edit', id: output.activityId
        }
    }

    def edit(String id) {
        def output = outputService.get(id)
        if (!output || output.error) {
            flash.errorMessage = "Output with id = ${id} does not exist."
            redirect(controller: 'home', model: [error: output.error])
        } else {
            redirect controller: 'activity', action: 'edit', id: output.activityId
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
            redirect url: grailsApplication.config.getProperty('grails.serverURL') + '/' +
                    params.returnTo
        } else {
            redirect controller: 'home'
        }
    }

}

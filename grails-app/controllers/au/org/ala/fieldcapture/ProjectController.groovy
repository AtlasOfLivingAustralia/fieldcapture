package au.org.ala.fieldcapture

import grails.converters.JSON

class ProjectController {

    def projectService, siteService, metadataService, commonService
    static defaultAction = "index"
    static ignore = ['action','controller','id']

    def index(String id) {
        def project = projectService.getRich(id)
        if (!project || project.error) {
            forward(action: 'list', model: [error: project.error])
        } else {
            project.sites?.sort {it.name}
            //todo: ensure there are no control chars (\r\n etc) in the json as
            //todo:     this will break the client-side parser
            [project: project,
                    json: (project.sites as JSON).toString(),
                    activities: projectService.getActivities(project).findAll {!it.assessment},
                    assessments: projectService.getActivities(project).findAll {it.assessment},
                    //activities: project.activities.findAll {!it.assessment},
                    //assessments: project.activities.findAll {it.assessment},
                    mapFeatures: commonService.getMapFeatures(project),
                    organisationName: metadataService.getInstitutionName(project.organisation)]
        }
    }

    def edit(String id) {
        def project = projectService.get(id)
        if (project) {
            [project: project, institutions: metadataService.institutionList()]
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    def create() {
        render view: 'edit', model: [create:true, institutions: metadataService.institutionList()]
    }

    /**
     * Updates existing or creates new output.
     *
     * If id is blank, a new project will be created
     *
     * @param id projectId
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
        def result = projectService.update(id, (values as JSON).toString())
        log.debug "result is " + result
        if (result.error) {
            render result as JSON
        } else {
            //println "json result is " + (result as JSON)
            render result.resp as JSON
        }
    }

    def update(String id) {
        //params.each { println it }
        projectService.update(id, (params as JSON).toString())
        chain action: 'index', id: id
    }

    def delete(String id) {
        projectService.delete(id)
        forward(controller: 'home')
    }

    def list() {
        // will show a list of projects
        // but for now just go home
        forward(controller: 'home')
    }
}

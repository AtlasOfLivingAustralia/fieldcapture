package au.org.ala.fieldcapture

import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.plugins.web.taglib.ApplicationTagLib

class SiteController {

    def siteService, projectService, activityService, metadataService, userService, searchService

    static defaultAction = "index"

    static ignore = ['action','controller','id']

    def search = {
        params.fq = "docType:site"
        def results = searchService.fulltextSearch(params)
        render results as JSON
    }

    def select(){
        // permissions check
        if (!projectService.canUserEditProject(userService.getCurrentUserId(), params.projectId)) {
            flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${params.projectId}"
            redirect(controller:'project', action:'index', id: params.projectId)
        }
        render view: 'select', model: [project:projectService.get(params.projectId)]
    }

    def create(){
        render view: 'edit', model: [create:true]
    }

    def createForProject(){
        def project = projectService.getRich(params.projectId)
        // permissions check
        if (!projectService.canUserEditProject(userService.getCurrentUserId(), params.projectId)) {
            flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${params.projectId}"
            redirect(controller:'project', action:'index', id: params.projectId)
        }
        render view: 'edit', model: [create:true, project:project]
    }

    def draw(){
        //any setup required ?
        println("Set up drawing tool...");
    }

    def index(String id) {
        //log.debug(id)
        def site = siteService.get(id, [view: 'scores'])
        if (site) {
            // inject the metadata model for each activity
            site.activities.each {
                it.model = metadataService.getActivityModel(it.type)
            }
            //siteService.injectLocationMetadata(site)
            [site: site,
             //activities: activityService.activitiesForProject(id),
             mapFeatures: siteService.getMapFeatures(site)]
        } else {
            //forward(action: 'list', model: [error: 'no such id'])
            render 'no such site'
        }
    }

    def edit(String id) {
        def site = siteService.get(id, [raw:'true'])
        if (site) {
            // check user has persmissions to edit - user must have edit access to
            // ALL linked projects to proceed.
            String userId = userService.getCurrentUserId()
            site.projects?.each { projectId ->
                if (!projectService.canUserEditProject(userId, projectId)) {
                    flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${projectId}"
                    redirect(action:'index',id: id)
                }
            }

            if (site.shapePid && !(site.shapePid instanceof JSONArray)) {
                log.debug "converting to array"
                site.shapePid = [site.shapePid] as JSONArray
            }
            [site: site, json: (site as JSON).toString(), meta: siteService.metaModel()
//                    ,projectList: projectService.list(true)
            ]
        } else {
            render 'no such site'
        }
    }

    def ajaxDeleteSitesFromProject(String id){
        def status = siteService.deleteSitesFromProject(id)
        if (status < 400) {
            def result = [status: 'deleted']
            render result as JSON
        } else {
            def result = [status: status]
            render result as JSON
        }
    }

    def ajaxDelete(String id) {
        def status = siteService.delete(id)
        if (status < 400) {
            def result = [status: 'deleted']
            render result as JSON
        } else {
            def result = [status: status]
            render result as JSON
        }
    }

    def update(String id) {

        log.debug("Updating site: " + id)

        //params.each { println it }
        //todo: need to detect 'cleared' values which will be missing from the params
        def values = [:]
        // filter params to remove:
        //  1. keys in the ignore list; &
        //  2. keys with dot notation - the controller will automatically marshall these into maps &
        //  3. keys in nested maps with dot notation
        removeKeysWithDotNotation(params).each { k, v ->
            if (!(k in ignore)) {
                values[k] = reMarshallRepeatingObjects(v);
            }
        }
        //log.debug (values as JSON).toString()
        siteService.update(id, values)
        chain(action: 'index', id:  id)
    }

    def ajaxUpdateProjects() {
        def postBody = request.JSON
        log.debug "Body: " + postBody
        log.debug "Params:"
        params.each { println it }
        //todo: need to detect 'cleared' values which will be missing from the params - implement _destroy
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
        log.debug "values: " + (values as JSON).toString()

        def result = siteService.updateProjectAssociations(values)
        if(result.error){
            response.status = 500
        } else {
            render result as JSON
        }
    }

    def ajaxUpdate(String id) {
        def postBody = request.JSON
        log.debug "Body: " + postBody
        log.debug "Params:"
        params.each { println it }
        //todo: need to detect 'cleared' values which will be missing from the params - implement _destroy
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

        //if its a drawn shape, save and get a PID
        if(values?.extent?.source == 'drawn'){
           def shapePid = siteService.persistSiteExtent(values.name, values.extent.geometry)
           values.extent.geometry.pid = shapePid.resp?.id
        }

        def result = [:]
        // check user has persmissions to edit/update site - user must have 'editor' access to
        // ALL linked projects to proceed.
        String userId = userService.getCurrentUserId()
        values.projects?.each { projectId ->
            if (!projectService.canUserEditProject(userId, projectId)) {
                flash.message = "Error: access denied: User does not have <b>editor</b> permission for projectId ${projectId}"
                result = [status: 'error']
                //render result as JSON
            }
        }

        if (!result) {
            if (id) {
                siteService.update(id, values)
                result = [status: 'updated']
            } else {
                def resp = siteService.create(values)
                result = [status: 'created', id:resp.resp.siteId]
            }
        }

        render result as JSON
    }

    def locationLookup(String id) {
        def md = [:]
        def site = siteService.get(id)
        if (!site || site.error) {
            md = [error: 'no such site']
        } else {
            md = siteService.getLocationMetadata(site)
            if (!md) {
                md = [error: 'no metadata found']
            }
        }
        render md as JSON
    }

    def projectsForSite(String id) {
        def projects = siteService.projectsForSite(id) ?: []
        //log.debug projects
        render projects as JSON
    }

    /**
     * Re-marshalls a map of arrays to an array of maps.
     *
     * Grails marshalling of repeating fields with names in dot notation: eg
     * <pre>
     *     <bs:textField name="shape.pid" label="Shape PID"/>
     *     <bs:textField name="shape.name" label="Shape name"/>
     *     <bs:textField name="shape.pid" label="Shape PID"/>
     *     <bs:textField name="shape.name" label="Shape name"/>
     * </pre>
     * produces a map like:
     *  [name:['shape1','shape2'],pid:['23','24']]
     * while we want:
     *  [[name:'shape1',pid:'23'],[name:'shape2',pid:'24']]
     *
     * We indicate that we want this style of marshalling (the other is also valid) by adding a hidden
     * field data-marshalling='list'.
     *
     * @param value the map to re-marshall
     * @return re-marshalled map
     */
    def reMarshallRepeatingObjects(value) {
        if (!(value instanceof HashMap)) {
            return value
        }
        if (value.handling != 'repeating') {
            return value
        }
        value.remove('handling')
        def list = []
        def len = value.collect({ it.value.size() }).max()
        (0..len-1).each { idx ->
            def newMap = [:]
            value.keySet().each { key ->
                newMap[key] = reMarshallRepeatingObjects(value[key][idx])
            }
            list << newMap
        }
        list
    }

    def removeKeysWithDotNotation(value) {
        if (value instanceof String) {
            return value
        }
        if (value instanceof Object[]) {
            return stripBlankElements(value)
        }
        // assume map for now
        def iter = value.entrySet().iterator()
        while (iter.hasNext()) {
            def entry = iter.next()
            if (entry.key.indexOf('.') >= 0) {
                iter.remove()
            }
            entry.value = removeKeysWithDotNotation(entry.value)
        }
        value
    }

    def stripBlankElements(list) {
        list.findAll {it}
    }

    // debug only
    def features(String id) {
        def site = siteService.get(id)
        if (site) {
            render siteService.getMapFeatures(site)
        } else {
            render 'no such site'
        }
    }
}

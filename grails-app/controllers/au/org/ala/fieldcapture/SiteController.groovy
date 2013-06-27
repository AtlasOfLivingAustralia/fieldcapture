package au.org.ala.fieldcapture

import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.plugins.web.taglib.ApplicationTagLib

class SiteController {

    def siteService, projectService, activityService, metadataService

    static defaultAction = "index"

    static ignore = ['action','controller','id']

    def create(){
        render view: 'edit', model: [create:true]
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
        siteService.update(id, (values as JSON).toString())
        chain(action: 'index', id:  id)
    }

    def ajaxUpdate(String id) {
        def postBody = request.JSON
        println "Body: " + postBody
        println "Params:"
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
        def result = []
        if(id){
            siteService.update(id, (values as JSON).toString())
            result = [status: 'updated']
        } else {
            def resp = siteService.create((values as JSON).toString())
            result = [status: 'created', id:resp.resp.siteId]
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
        log.debug projects
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

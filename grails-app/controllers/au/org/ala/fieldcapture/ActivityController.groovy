package au.org.ala.fieldcapture
import grails.converters.JSON
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.apache.poi.ss.util.CellReference
import org.codehaus.groovy.grails.web.json.JSONArray

class ActivityController {

    def activityService, siteService, projectService, metadataService, userService, excelImportService, webService, grailsApplication, speciesService

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
        if (activity) {
            // permissions check  - can't use annotation as we have to know the projectId in order to redirect to the right page
            if (!projectService.canUserEditProject(userService.getCurrentUserId(), activity.projectId)) {
                flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${activity.projectId}"
                redirect(controller:'project', action:'index', id: activity.projectId)
            }
            // pass the activity
            def model = [activity: activity, returnTo: params.returnTo, projectStages:projectStages()]
            // the activity meta-model
            model.metaModel = metadataService.getActivityModel(activity.type)
            // the array of output models
            model.outputModels = model.metaModel?.outputs?.collectEntries {
                [ it, metadataService.getDataModelFromOutputName(it)] }
            // the site
            model.site = model.activity.siteId ? siteService.get(model.activity.siteId, [view:'brief']) : null
            // the project
            model.project = model.activity.projectId ? projectService.get(model.activity.projectId) : null
            // Add the species lists that are relevant to this activity.
            model.speciesLists = new JSONArray()
            model.project?.speciesLists?.each { list ->
                if (list.purpose == activity.type) {
                    model.speciesLists.add(list)
                }
            }
            model.printView = true
            model.mapFeatures = model.site ? siteService.getMapFeatures(model.site) : "{}"
            model.themes = metadataService.getThemesForProject(model.project)
            model
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    /**
     * A page that simply edits the activity data.
     * @param id activity id
     */
    def edit(String id) {
        def activity = activityService.get(id)
        if (activity) {
            // permissions check
            if (!projectService.canUserEditProject(userService.getCurrentUserId(), activity.projectId)) {
                flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${activity.projectId}"
                redirect(controller:'project', action:'index', id: activity.projectId)
            }
            // pass the activity
            def model = [activity: activity, returnTo: params.returnTo, projectStages:projectStages()]
            // the site
            model.site = model.activity.siteId ? siteService.get(model.activity.siteId, [view:'brief']) : null
            // the project
            model.project = model.activity.projectId ? projectService.get(model.activity.projectId) : null
            model.project?.speciesLists?.each { list ->
                if (list.purpose == activity.type) {
                    model.speciesLists.add(list)
                }
            }
            model.activityTypes = metadataService.activityTypesList()
            model.mapFeatures = model.site ? siteService.getMapFeatures(model.site) : "{}"
            model.themes = metadataService.getThemesForProject(model.project)
            model
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    /**
     * A page for entering output data for an activity. Limited activity data can also be updated.
     * @param id activity id
     */
    def enterData(String id) {
        def activity = activityService.get(id)
        if (activity) {
            // permissions check
            if (!projectService.canUserEditProject(userService.getCurrentUserId(), activity.projectId)) {
                flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${activity.projectId}"
                redirect(controller:'project', action:'index', id: activity.projectId)
            }
            // pass the activity
            if (params.progress) {
                activity.progress = params.progress
            }
            def model = [activity: activity, returnTo: params.returnTo, projectStages:projectStages()]
            // the activity meta-model
            model.metaModel = metadataService.getActivityModel(activity.type)
            // the array of output models
            model.outputModels = model.metaModel?.outputs?.collectEntries {
                [ it, metadataService.getDataModelFromOutputName(it)] }
            // the site
            model.site = model.activity.siteId ? siteService.get(model.activity.siteId, [view:'brief']) : null
            // the project
            model.project = model.activity.projectId ? projectService.get(model.activity.projectId) : null
            // Add the species lists that are relevant to this activity.
            model.speciesLists = new JSONArray()
            model.project?.speciesLists?.each { list ->
                if (list.purpose == activity.type) {
                    model.speciesLists.add(list)
                }
            }
            model.mapFeatures = model.site ? siteService.getMapFeatures(model.site) : "{}"
            model.themes = metadataService.getThemesForProject(model.project)
            model
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    def print(String id) {
        def activity = activityService.get(id)
        if (activity) {
            // permissions check
            if (!projectService.canUserEditProject(userService.getCurrentUserId(), activity.projectId)) {
                flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${activity.projectId}"
                redirect(controller:'project', action:'index', id: activity.projectId)
            }
            // pass the activity
            def model = [activity: activity, returnTo: params.returnTo, projectStages:projectStages()]
            // the activity meta-model
            model.metaModel = metadataService.getActivityModel(activity.type)
            // the array of output models
            model.outputModels = model.metaModel?.outputs?.collectEntries {
                [ it, metadataService.getDataModelFromOutputName(it)] }
            // the site
            model.site = model.activity.siteId ? siteService.get(model.activity.siteId, [view:'brief']) : null
            // the project
            model.project = model.activity.projectId ? projectService.get(model.activity.projectId) : null
            // Add the species lists that are relevant to this activity.
            model.speciesLists = new JSONArray()
            model.project?.speciesLists?.each { list ->
                if (list.purpose == activity.type) {
                    model.speciesLists.add(list)
                }
            }
            model.mapFeatures = model.site ? siteService.getMapFeatures(model.site) : "{}"
            model.themes = metadataService.getThemesForProject(model.project)
            model.printView = true
            render view: 'enterData', model: model
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
    @PreAuthorise(projectIdParam = 'projectId')
    def create(String siteId, String projectId) {
        def activity = [activityId: "", siteId: siteId, projectId: projectId]
        def model = [activity: activity, returnTo: params.returnTo, create: true,
                activityTypes: metadataService.activityTypesList(),
                projectStages:projectStages()]
        model.project = projectId ? projectService.get(projectId) : null
        model.site = siteId ? siteService.get(siteId) : null
        if (projectId) {
            model.themes = metadataService.getThemesForProject(model.project)
        }
        if (!model.project && !model.site) {
            model.sites = siteService.list().collect({[name:it.name,siteId:it.siteId]})
            model.projects = projectService.list().collect({[name:it.name,projectId:it.projectId]})
        }
        model
    }

    /**
     * Updates existing or creates new activity.
     *
     * Also updates/creates any outputs that are passed in the 'outputs' property of the activity.
     * For updates, the activity itself is optional, ie the payload may simply be a list of outputs
     * to update/create.
     *
     * If id is blank, a new activity will be created and added to the site. Outputs are ignored
     * in this case.
     *
     * @param id activityId - may be null or blank
     * @return
     */
    def ajaxUpdate(String id) {
        def postBody = request.JSON
        if (!id) { id = ''}
        //log.debug "Body: " + postBody
        //log.debug "Params:"
        //params.each { log.debug it }

        def values = [:]
        // filter params to remove keys in the ignore list - MEW don't know if this is required
        postBody.each { k, v ->
            if (!(k in ignore)) {
                values[k] = v
            }
        }
        log.debug (values as JSON).toString()

        def result = [:]

        def projectId
        if (id) {
            def activity = activityService.get(id)
            projectId = activity.projectId
        }
        else {
            projectId = values.projectId
        }
        if (!projectId) {
            response.status = 400
            flash.message = "No project id supplied for activity: ${id}"
            result = [status: 400, error: flash.message]
        }

        // check user has permissions to edit/update site - user must have 'editor' access to
        // ALL linked projects to proceed.
        if (!projectService.canUserEditProject(userService.getCurrentUserId(), projectId)) {
            flash.message = "Error: access denied: User does not have <b>editor</b> permission for projectId ${projectId}"
            response.status = 401
            result = [status:401, error: flash.message]
            //render result as JSON
        }

        if (!result) {
            result = activityService.update(id, values)
        }
        //log.debug "result is " + result

        if (result.error) {
            render result as JSON
        } else {
            //log.debug "json result is " + (result as JSON)
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

    def projectStages() {
        return ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5", "Stage 6", "Stage 7", "Stage 8", "Stage 9", "Stage 10"]
    }


    def ajaxUpload() {
        if (request.respondsTo('getFile')) {
            def file = request.getFile('data')
            if (file) {

                def outputName = params.type
                def listName = params.listName

                def model = metadataService.annotatedOutputDataModel(outputName)
                if (listName) {
                    model = model.find { it.name == listName }?.columns
                }
                int index = 0;
                def columnMap = model.collectEntries {
                    def colString = CellReference.convertNumToColString(index++)
                    [(colString):it.name]
                }
                def config = [
                        sheet:outputName,
                        startRow:1,
                        columnMap:columnMap
                ]
                Workbook workbook = WorkbookFactory.create(file.inputStream)

                def data = excelImportService.convertColumnMapConfigManyRows(workbook, config)

                // Do species lookup
                def species = model.find {it.dataType == 'species'}
                if (species) {
                    data.each { row ->
                        def scientificName = row[species.name]

                        def result = speciesService.searchByScientificName(scientificName)
                        if (result) {
                            row[species.name] = [name:result.name, listId:result.listId, guid:result.guid]
                        }
                        else {
                            row[species.name] = [name:scientificName, listId:'unmatched', guid:null]
                        }

                    }
                }

                def result = [status: 200, data:data]

                render result as JSON
            }
        }

        def result = [status: 400, error:'no file found']
        render result as JSON
    }
}

package au.org.ala.merit

import au.org.ala.merit.config.ProgramConfig
import grails.converters.JSON
import grails.core.GrailsApplication
import org.apache.http.HttpStatus
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.apache.poi.ss.util.CellReference

class ActivityController {

    def activityService, siteService, projectService, metadataService, userService, excelImportService, webService, speciesService, documentService, reportService, programService, projectConfigurationService
    GrailsApplication grailsApplication

    static ignore = ['action','controller','id']
    static allowedMethods = [ajaxUnlock:'POST', delete:'POST', ajaxUpdate:'POST', 'ajaxDelete':'POST']

    private Map activityModel(activity, projectId) {
        // pass the activity
        def model = [activity: activity]

        // the site
        model.site = model.activity?.siteId ? siteService.get(model.activity.siteId, [view:'brief']) : null
        model.mapFeatures = model.site ? siteService.getMapFeatures(model.site) : "{}"

        // the project
        model.project = projectId ? projectService.get(model.activity.projectId) : null

        if (model.project) {
            model.speciesConfig = projectService.findSpeciesFieldConfigForActivity(activity.projectId, activity.type)

            model.themes = metadataService.getThemesForProject(model.project)
            Map stageReport = reportService.findReportForDate(activity.plannedEndDate, model.project.reports?:[])
            model.activity.projectStage = stageReport ? stageReport.name : ''
            model.report = stageReport
        }

        model
    }

    private Map activityAndOutputModel(activity, projectId, Integer formVersion = null) {
        def model = activityModel(activity, projectId)
        addOutputModel(model, model.activity.type, formVersion ?: model.activity.formVersion)
        model
    }

    private Map addOutputModel(Map model, String formName, Integer formVersion = null) {
        model.putAll(activityService.getActivityMetadata(formName, formVersion))
    }

    def index(String id) {
        def activity = activityService.get(id)
        if (activity) {
            // permissions check  - can't use annotation as we have to know the projectId in order to redirect to the right page
            if (!projectService.canUserViewProject(userService.getCurrentUserId(), activity.projectId)) {
                flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${activity.projectId}"
                redirect(controller:'project', action:'index', id: activity.projectId)
                return
            }

            Map model = activityAndOutputModel(activity, activity.projectId)
            Map navigationOptions = getNavOptions(params.returnTo,[navigationMode:'stayOnPage'], activity)
            model.putAll(navigationOptions)
            model
        } else {
            flash.message = 'Not found'
            redirect controller:'home'
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
            def userId = userService.getCurrentUserId()
            if (!projectService.canUserEditProject(userId, activity.projectId)) {

                if (projectService.canUserViewProject(userId, activity.projectId)) {
                    chain(action:'index', id:id, model:[editInMerit:true])
                    return
                }

                flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${activity.projectId}"
                redirect(controller:'project', action:'index', id: activity.projectId)
                return
            }
            else if (!activityService.canEditActivity(activity)) {
                chain(action:'index', id:id)
                return
            }
            def model = activityModel(activity, activity.projectId)
            // Need these to decide if output targets need to be removed if an activity type is changed.
            model.project.activities = activityService.activitiesForProject(activity.projectId)
            model.outputTargetMetadata = metadataService.getOutputTargetScores()

            model.activityTypes = metadataService.activityTypesList(model.project?.associatedProgram, model.project?.associatedSubProgram)

            // If changes are made to the programme model or there are special activities, it's possible that
            // the type of the Activity being edited isn't actually in the available activity types list.  In this
            // case we need to add it.
            def typeListContainsActivityType = model.activityTypes?.find{category -> category.list.find{it.name == activity.type}}
            if (!typeListContainsActivityType) {
                model.activityTypes = [[name:'Current Activity', list:[[name:activity.type, description:'The current activity type of the activity being edited']]]] + (model.activityTypes?:[])
            }

            model.hasPhotopointData = activity.documents?.find {it.poiId}
            model.returnTo = buildReturnToUrl(activity, params.returnTo)
            model
        } else {
            forward(controller:'home', action: 'publicHome', model: [error: 'no such id'])
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
            String userId = userService.getCurrentUserId()
            if (!projectService.canUserEditProject(userId, activity.projectId)) {

                if (projectService.canUserViewProject(userId, activity.projectId)) {
                    chain(action:'index', id:id,  model:[editInMerit: true])
                    return
                }

                flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${activity.projectId}"
                redirect(controller:'project', action:'index', id: activity.projectId)
                return
            }
            else if (!activityService.canEditActivity(activity)) {
                chain(action:'index', id:id)
                return
            }
            else if (activity.lock && activity.lock.userId != userId) {
                chain(action:'index', id:id)
            }

            Map model = activityAndOutputModel(activity, activity.projectId, params.getInt('formVersion', null))

            Map programConfig = projectService.getProgramConfiguration(model.project)
            // Temporary until we add this to the program config.
            if (programConfig.requiresActivityLocking == null) {
                programConfig.requiresActivityLocking = programConfig.name == 'Reef 2050 Plan Action Reporting'
            }
            if (programConfig.activityNavigationMode == null) {
                programConfig.activityNavigationMode = (programConfig.name == 'Reef 2050 Plan Action Reporting' || programConfig.name == 'ESP Test') ? 'returnToProject' : 'stayOnPage'
            }

            model.locked = activity.lock != null
            if (!activity.lock && programConfig.requiresActivityLocking) {
                Map result = activityService.lock(activity)
                model.locked = true
            }
            model.earliestStartDate = DateUtils.displayFormat(DateUtils.parse(model.project.plannedStartDate))

            model.putAll(getNavOptions(params.returnTo, programConfig, activity, model.locked))

            model

        } else {
            flash.message = 'Not found'
            redirect controller:'home'
            return
        }
    }

    /**
     * Determines the options available for displaying the activity navigation bar at the bottom of the
     * activity edit/view pages, and whether to return back to the associated project or site, depending
     * on where the activity was first viewed from.
     * @param navContext project or site - activities can be viewed/edited from either a project or site context
     * @param programConfig programs can specify the default action when saving an activity (return to context page or stay on activity page)
     * @param activity the activity being viewed
     * @param holdsLock locking an activity limits the navigation options as the lock needs to be released when leaving the page.
     */
    private Map getNavOptions(String navContext, Map programConfig, Map activity, boolean holdsLock = false) {
        // We don't support activity locking with the stayOnPage navigation model
        // due to difficulties around releasing the lock when using the navigation
        // buttons
        String navigationMode = holdsLock ? 'returnToProject' : programConfig.activityNavigationMode?:'stayOnPage'
        Map options = [navigationMode:navigationMode]
        if (navContext) {
            options.showNav = true
            options.navContext = navContext
            options.returnToUrl = buildReturnToUrl(activity, navContext, holdsLock)
        }
        options
    }

    def print(String id) {
        def activity = activityService.get(id)
        if (activity) {
            // permissions check
            if (!projectService.canUserViewProject(userService.getCurrentUserId(), activity.projectId)) {
                flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${activity.projectId}"
                redirect(controller:'project', action:'index', id: activity.projectId)
            }
            // pass the activity
            def model = activityAndOutputModel(activity, activity.projectId)
            model.printView = true
            render view: 'enterData', model: model
        } else {
            flash.message = 'Not found'
            redirect controller:'home'
            return
        }

    }

    /**
     * Displays page to create an activity in planning mode.
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
    def createPlan(String siteId, String projectId) {
        def activity = [activityId: "", siteId: siteId, projectId: projectId, progress: ActivityService.PROGRESS_PLANNED]
        def model = [activity: activity, returnTo: buildReturnToUrl(activity, params.returnTo, false), create: true]
        model.project = projectId ? projectService.get(projectId) : null

        ProgramConfig config = projectConfigurationService.getProjectConfiguration(model.project)
        if (model.project.programId) {
            model.activityTypes = metadataService.activitiesListByProgramId(model.project?.programId)
        } else {
            model.activityTypes = metadataService.activityTypesList(model.project?.associatedProgram, model.project?.associatedSubProgram)
        }

        model.site = siteId ? siteService.get(siteId) : null
        if (projectId) {
            model.themes = metadataService.getThemesForProject(model.project)
        }
        if (!model.project && !model.site) {
            flash.error = "A projectId is required for this operation"
            redirect(controller:'home', action:'index')
            return
        }

        model
    }

    def ajaxLoadActivityForm(String id) {

        def activity = activityService.get(id)

        if (activity) {
            // permissions check
            def userId = userService.getCurrentUserId()
            if (!projectService.canUserEditProject(userId, activity.projectId)) {

                if (projectService.canUserViewProject(userId, activity.projectId)) {
                    render model:activityAndOutputModel(activity, activity.projectId), view:'_readOnlyTabbedActivity'
                }
                else {
                    render status:401, text:"You don't have permission to view activity with id: ${id}"
                }
            }
            else if (!activityService.canEditActivity(activity)) {
                render model:activityAndOutputModel(activity, activity.projectId), view:'_readOnlyTabbedActivity'
            }
            else {
                render model:activityAndOutputModel(activity, activity.projectId), view:"_tabbedActivity"
            }


        } else {
            render status:404, text:"No activity exists with id: ${id}"
        }

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
        if (!id) {
            id = postBody.remove('activityId')
            if (!id) {id=''}
        }

        List duplicateStages = postBody.remove('duplicateStages')

        Map values = [:]
        // filter params to remove keys in the ignore list - MEW don't know if this is required
        postBody.each { k, v ->
            if (!(k in ignore)) {
                values[k] = v
            }
        }

        Map result = [:]

        String projectId
        Map activity = values
        if (id) {
            activity = activityService.get(id)
            projectId = activity.projectId
        }
        else {
            projectId = values.projectId
        }

        if (!projectId) {
            response.status = HttpStatus.SC_BAD_REQUEST
            flash.message = "No project id supplied for activity: ${id}"
            result = [status: HttpStatus.SC_BAD_REQUEST, error: flash.message]
        }
        // check user has permissions to create or edit the activity.
        else if (!projectService.canUserEditProject(userService.getCurrentUserId(), projectId)) {
            flash.message = "Error: access denied: User does not have <b>editor</b> permission for projectId ${projectId}"
            response.status = HttpStatus.SC_UNAUTHORIZED
            result = [status:HttpStatus.SC_UNAUTHORIZED, error: flash.message]
            //render result as JSON
        }
        else if (!activityService.canEditActivity(activity)) {
            result = [status:HttpStatus.SC_BAD_REQUEST, error: "Project status does not allow activity to be editable."]
        }

        if (!result) {
            def photoPoints = values.remove('photoPoints')
            Map activityResult = activityService.update(id, values)
            if (activityResult.error) {
                result = activityResult
            }
            else {
                result.activity = activityResult.resp
            }

            if (duplicateStages) {
                activityService.duplicateActivity(projectId, duplicateStages, values)
            }

            if (photoPoints) {
                Map photoOwner = [activityId:id ?: result.activityId]
                result.photoPoints = siteService.updatePhotoPoints(photoPoints.siteId, photoOwner, photoPoints.photos, photoPoints.photoPoints)
            }

        }

        render result as JSON
    }

    def ajaxDelete(String id) {
        Map resp
        Map activity = activityService.get(id)
        if (!activity || !projectService.canUserEditProject(userService.getCurrentUserId(), activity.projectId)) {
            response.status = HttpStatus.SC_UNAUTHORIZED
            resp = [status:HttpStatus.SC_UNAUTHORIZED, error: "Unauthorized"]
        }
        else if (!activityService.canEditActivity(activity)) {
            response.status = HttpStatus.SC_BAD_REQUEST
            resp = [status:HttpStatus.SC_BAD_REQUEST, error: "Project status does not allow activity to be editable."]
        }
        else {
            log.debug "deleting activity ${id}"
            def respCode = activityService.delete(id)
            resp = [code: respCode.toString()]
        }

        render resp as JSON
    }

    def ajaxUnlock(String id) {
        // We force the unlock if the user is not logged in, but don't send an email.  This is to catch the
        // scenario where the user exits the page by logging out or lets their session time out before exiting the
        // page.
        Map resp  = activityService.unlock(id, userService.getCurrentUserId() ? false : true )
        render resp as JSON
    }

    def overrideLockAndEdit(String id) {
        Map resp  = activityService.stealLock(id, g.createLink(controller:'activity', action:'index', id:id, absolute: true))
        chain(action:'enterData', id:id)
    }

    /**
     * We deliberately don't have a role check for this method as all it does
     * is release a lock if necessary.
     * @param id the activity what was being edited.
     */
    def exitActivity(String id, String navigateTo) {
        Map activity = activityService.get(id)
        if (!activity) {
            flash.message = 'Not found'
            redirect controller:'home'
            return
        }
        if (activity && activity.lock?.userId == userService.currentUserId) {
            activityService.unlock(id)
        }

        String url = buildReturnToUrl(activity, navigateTo, false, true)
        redirect uri:url
    }

    private String buildReturnToUrl(Map activity, String navContext, boolean holdsLock = false, boolean absolute = false) {
        String url
        if (holdsLock) {
            url = g.createLink(action:'exitActivity', id: activity.activityId, params:[navigateTo:navContext])
        }
        else if (navContext == 'site' && activity.siteId) {
            url = g.createLink(controller:'site', action:'index', id: activity.siteId, absolute: absolute)
        }
        else {
            url = g.createLink(controller:'project', action:'index', id: activity.projectId, absolute: absolute)
        }
        url
    }

    def list() {
        // will show a list of activities
        // but for now just go home
        log.debug('redirecting to home')
        redirect(controller: 'home')
    }

    /* Parse the xlsx output data and pass it back to the client. */
    def ajaxBulkUpload(){
        if (request.respondsTo('getFile')) {
            def file = request.getFile('templateFile')
            if (file) {
                def activityType = params.type
                def activityModel = metadataService.activitiesModel().activities.find { it.name == activityType }
                def outputModels = activityModel.outputs.collect { metadataService.annotatedOutputDataModel(it) }

                int index = 0;
                def columnMap = [:]
                columnMap << [(CellReference.convertNumToColString(index++)):"grantId"]
                columnMap << [(CellReference.convertNumToColString(index++)):"projectName"]
                outputModels.collectEntries { entry ->
                    entry.each{
                        def colString = CellReference.convertNumToColString(index++)
                        columnMap << [(colString):it.name]
                    }
                }

                def config = [
                        sheet:"${activityModel?.outputs?.first()}",
                        startRow:1,
                        columnMap:columnMap
                ]
                Workbook workbook = WorkbookFactory.create(file.inputStream)
                def data = excelImportService.convertColumnMapConfigManyRows(workbook, config)
                def result
                if (!data) {
                    response.status = 400
                    result = [status:400, error:'No data was found that matched the columns in this table, please check the template you used to upload the data. ']
                }
                else {
                    result = [status: 200, data:data]
                }

                // This is returned to the browswer as a text response due to workaround the warning
                // displayed by IE8/9 when JSON is returned from an iframe submit.
                response.setContentType('text/plain;charset=UTF8')
                def resultJson = result as JSON
                render resultJson.toString()
            }
        }
        else {
            response.status = 400
            def result = [status: 400, error:'No file attachment found']
            // This is returned to the browswer as a text response due to workaround the warning
            // displayed by IE8/9 when JSON is returned from an iframe submit.
            response.setContentType('text/plain;charset=UTF8')
            def resultJson = result as JSON
            render resultJson.toString()
        }

    }

    def ajaxUpload() {
        if (request.respondsTo('getFile')) {
            def file = request.getFile('data')
            if (file) {

                def outputName = params.type
                def listName = params.listName
                String activityForm = params.activityForm
                Integer formVersion = params.getInt('formVersion', null)

                def model = metadataService.annotatedOutputDataModel(activityForm, outputName, formVersion)
                if (listName) {
                    model = metadataService.findByName(listName, model)?.columns
                }
                model = model.findAll{!it.computed}
                int index = 0;
                def columnMap = model.collectEntries {
                    def colString = CellReference.convertNumToColString(index++)
                    [(colString):it.name]
                }
                def config = [
                        sheet:sheetNameFromOutput(outputName),
                        startRow:1,
                        columnMap:columnMap
                ]
                Workbook workbook = WorkbookFactory.create(file.inputStream)

                def data = excelImportService.convertColumnMapConfigManyRows(workbook, config)
                data.each { row ->
                    for (entry in row) {
                        if (entry.value instanceof org.joda.time.LocalDate) {
                            //update the type for the datepicker
                            entry.value = entry.value.toDate()

                        }
                    }
                }

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
                // Multiselect correction
                List stringLists = model.findAll {it.dataType == 'stringList'}
                stringLists?.each { dataItem ->
                    data.each { row ->
                        String values = row[dataItem.name]

                        if (values) {
                            // lists are treated as comma separated.  Do a bit of cleanup (trim and remove duplicates).
                            row[dataItem.name] = Arrays.asList(values.split(','))
                            row[dataItem.name] = row[dataItem.name].collect{it?.trim()}.unique()

                        }

                    }
                }


                def result
                if (!data) {
                    response.status = 400
                    result = [status:400, error:'No data was found that matched the columns in this table, please check the template you used to upload the data. ']
                }
                else {
                    result = [status: 200, data:data]
                }

                // This is returned to the browswer as a text response due to workaround the warning
                // displayed by IE8/9 when JSON is returned from an iframe submit.
                response.setContentType('text/plain;charset=UTF8')
                JSON.use("clientSideFormattedDates") {
                    def resultJson = result as JSON
                    render resultJson.toString()
                }
            }
        }
        else {
            response.status = 400
            def result = [status: 400, error:'No file attachment found']
            // This is returned to the browswer as a text response due to workaround the warning
            // displayed by IE8/9 when JSON is returned from an iframe submit.

            response.setContentType('text/plain;charset=UTF8')
            def resultJson = result as JSON
            render resultJson.toString()
        }
    }

    static final int MAX_SHEET_NAME_LENGTH = 31
    public static String sheetNameFromOutput(String name) {
        int prefixLength = 17
        int suffixLength = 11
        String shortName = name
        if (name.size() > MAX_SHEET_NAME_LENGTH) {
            shortName = name[0..prefixLength-1]+'...'+name[-suffixLength..name.size()-1]
        }
        shortName.replaceAll('/', '-')
    }

    /**
     * Returns an excel template that can be used to populate a table of data in an output form.
     */
    def excelOutputTemplate() {

        String url =  "${grailsApplication.config.getProperty('ecodata.baseUrl')}metadata/excelOutputTemplate"

        Map postParams = [listName:params.listName, type:params.type, data:params.data, editMode:params.editMode, allowExtraRows:params.allowExtraRows, autosizeColumns:false, formVersion:params.getInt('formVersion'), activityForm:params.activityForm]

        webService.proxyPostRequest(response, url, postParams)

        return null
    }



    def activitiesWithStage(String id) {
        List reports = reportService.getReportsForProject(id)
        List activities = activityService.activitiesForProject(id)

        if (params.siteId) {
            activities = activities.findAll {it.siteId == params.siteId}
        }
        reports.sort {it.toDate}
        reports.eachWithIndex{ report, i ->
            report.order = i
        }
        activities.each { activity ->
            Map report = reportService.findReportForDate(activity.plannedEndDate, reports)
            activity.stage = report?report.name:''
            activity.stageOrder = report?report.order: 0

        }
        render activities as JSON
    }

}

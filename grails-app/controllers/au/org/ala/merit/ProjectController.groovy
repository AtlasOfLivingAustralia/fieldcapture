package au.org.ala.merit

import au.org.ala.merit.command.MeriPlanReportCommand
import au.org.ala.merit.command.ProjectSummaryReportCommand
import au.org.ala.merit.command.ReportCommand
import au.org.ala.merit.command.SaveReportDataCommand
import au.org.ala.merit.reports.ReportConfig
import au.org.ala.merit.reports.ReportGenerationOptions
import grails.converters.JSON
import org.apache.http.HttpStatus
import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.web.json.JSONObject
import org.joda.time.DateTime

import static ReportService.ReportMode

class ProjectController {

    static allowedMethods =  [listProjectInvestmentPriorities: 'GET']
    static defaultAction = "index"
    static ignore = ['action', 'controller', 'id']
    static String ESP_TEMPLATE = "esp"
    static String RLP_TEMPLATE = "rlp"
    static String MERI_ONLY_TEMPLATE = "meri"
    static String RLP_MERI_PLAN_TEMPLATE = "rlpMeriPlan"
    static String MERI_PLAN_TEMPLATE = "meriPlan"

    def projectService, metadataService, organisationService, commonService, activityService, userService, webService, roleService, grailsApplication
    def siteService, documentService, reportService, blogService, pdfGenerationService

    private def espOverview(Map project, Map user) {

        Map projectArea = null
        if (project.sites) {
            projectArea = project.sites?.find({ it.type == 'projectArea' })
            if (!projectArea) {
                projectArea = project.sites[0]
            }
        }
        boolean isProjectStarredByUser = false
        if (user) {
            isProjectStarredByUser = userService.isProjectStarredByUser(user?.userId ?: "0", project.projectId)?.isProjectStarredByUser
        }
        render model: [
                project: project,
                user:user,
                mapFeatures: commonService.getMapFeatures(project),
                projectArea: projectArea,
                isProjectStarredByUser: isProjectStarredByUser], view: 'espOverview'
    }

    def index(String id) {

        def user = userService.getUser()
        if (user) {
            user = user.properties
            user.isAdmin = projectService.isUserAdminForProject(user.userId, id) ?: false
            user.isCaseManager = projectService.isUserCaseManagerForProject(user.userId, id) ?: false
            user.isEditor = projectService.canUserEditProject(user.userId, id) ?: false
            user.hasViewAccess = projectService.canUserViewProject(user.userId, id) ?: false
        }
        def project = projectService.get(id, user,'all')
        ProgramConfig config
        if (project && !project.error) {
            config = projectService.getProgramConfiguration(project)
        }

        if (!project || project.error || (config?.visibility == 'private' && !user?.hasViewAccess)) {
            flash.message = "Project not found with id: ${id}"
            if (project?.error) {
                flash.message += "<br/>${project.error}"
                log.warn project.error
            }
            redirect(controller: 'home', model: [error: flash.message])
        } else {

            String template = projectTemplate(config, params.template)
            if (template == ESP_TEMPLATE && user?.isEditor) {
                espOverview(project, user)
            } else {
                project.sites?.sort { it.name }
                project.projectSite = project.sites?.find { it.siteId == project.projectSiteId }
                def roles = roleService.getRoles()

                def members = projectService.getMembersForProjectId(id)
                def admins = members.findAll { it.role == "admin" }.collect { it.userName }.join(",")
                // comma separated list of user email addresses

                def programs = projectService.programsModel()
                def content = projectContent(project, user, template, config)

                def model = [project               : project,
                             activities            : project.activities,
                             mapFeatures           : commonService.getMapFeatures(project),
                             isProjectStarredByUser: userService.isProjectStarredByUser(user?.userId ?: "0", project.projectId)?.isProjectStarredByUser,
                             user                  : user,
                             roles                 : roles,
                             admins                : admins,
                             activityTypes         : projectService.activityTypesList(),
                             outputTargetMetadata  : metadataService.getOutputTargetsByOutputByActivity(),
                             organisations         : organisationList(project),
                             programs              : programs,
                             today                 : DateUtils.format(new DateTime()),
                             themes                : config.themes,
                             config                : config,
                             projectContent        : content.model,
                             showAlternateTemplate : template && (template != config.projectTemplate) // If the template has been specified and isn't the default, provide navigation back to the default.
                ]
                render view: content.view, model: model
            }
        }
    }

    protected List organisationList(Map project) {
        List organisations = [[name: project.organisationName, organisationId: project.organisationId]]
        if (project.serviceProviderName) {
            organisations << [name: project.serviceProviderName, organisationId: project.orgIdSvcProvider]
        }

        organisations
    }

    protected Map projectContent(Map project, user, String template, ProgramConfig config) {
        project.themes = new JSONArray(config.themes ?: [])
        project.assets = config.assets ?: []
        project.priorities = new JSONArray(config.priorities ?: [])
        project.outcomes = new JSONArray(config.outcomes ?: [])
        project.hasApprovedOrSubmittedReports = reportService.includesSubmittedOrApprovedReports(project.reports)


        def meriPlanVisible = config.includesContent(ProgramConfig.ProjectContent.MERI_PLAN)
        def risksAndThreatsVisible = config.includesContent(ProgramConfig.ProjectContent.RISKS_AND_THREATS) && user?.hasViewAccess
        def canViewRisks = risksAndThreatsVisible && (user?.hasViewAccess || user?.isEditor)
        def meriPlanEnabled = user?.hasViewAccess || ((project.associatedProgram == 'National Landcare Programme' && project.associatedSubProgram == 'Regional Funding'))
        def meriPlanVisibleToUser = project.planStatus == 'approved' || user?.isAdmin || user?.isCaseManager
        boolean userHasViewAccess = user?.hasViewAccess ?: false

        def publicImages = project.documents.findAll {
            it.public == true && it.thirdPartyConsentDeclarationMade == true && it.type == 'image'
        }
        def blog = blogService.getProjectBlog(project)
        def hasNewsAndEvents = blog.find { it.type == 'News and Events' }
        def hasProjectStories = blog.find { it.type == 'Project Stories' }

        hasNewsAndEvents = hasNewsAndEvents || project.newsAndEvents
        hasProjectStories = hasProjectStories || project.projectStories

        def showAnnouncementsTab = (user?.isAdmin || user?.isCaseManager) && projectService.isMeriPlanSubmittedOrApproved(project)
        List<Map> scores = metadataService.getOutputTargetScores()

        def imagesModel = publicImages.collect {
            [name: it.name, projectName: project.name, url: it.url, thumbnailUrl: it.thumbnailUrl]
        }
        boolean canChangeProjectDates = userService.userIsAlaOrFcAdmin()

        // For validation of project date changes.
        String minimumProjectEndDate = projectService.minimumProjectEndDate(project, config)

        boolean adminTabVisible = user?.isEditor || user?.isAdmin || user?.isCaseManager
        boolean showMeriPlanHistory = config.supportsMeriPlanHistory && userService.userIsSiteAdmin()

        def model = [overview       : [label: 'Overview', visible: true, default: true, type: 'tab', publicImages: imagesModel, displayOutcomes: false, blog: blog, hasNewsAndEvents: hasNewsAndEvents, hasProjectStories: hasProjectStories, canChangeProjectDates: canChangeProjectDates, outcomes:project.outcomes, objectives:config.program?.config?.objectives],
                     documents      : [label: 'Documents', visible: config.includesContent(ProgramConfig.ProjectContent.DOCUMENTS), type: 'tab', user:user, template:'docs', activityPeriodDescriptor:config.activityPeriodDescriptor ?: 'Stage'],
                     details        : [label: 'MERI Plan', default: false, disabled: !meriPlanEnabled, visible: meriPlanVisible, meriPlanVisibleToUser: meriPlanVisibleToUser, risksAndThreatsVisible: canViewRisks, announcementsVisible: true, project:project, type: 'tab', template:'viewMeriPlan', meriPlanTemplate:MERI_PLAN_TEMPLATE+'View', config:config, activityPeriodDescriptor:config.activityPeriodDescriptor ?: 'Stage'],
                     plan           : [label: 'Activities', visible: true, disabled: !user?.hasViewAccess, type: 'tab', template:'projectActivities', grantManagerSettingsVisible:user?.isCaseManager, project:project, reports: project.reports, scores: scores, risksAndThreatsVisible: risksAndThreatsVisible],
                     site           : [label: 'Sites', visible: config.includesContent(ProgramConfig.ProjectContent.SITES), disabled: !user?.hasViewAccess, editable:user?.isEditor, type: 'tab', template:'projectSites'],
                     dashboard      : [label: 'Dashboard', visible: config.includesContent(ProgramConfig.ProjectContent.DASHBOARD), disabled: !user?.hasViewAccess, type: 'tab'],
                     admin          : [label: 'Admin', visible: adminTabVisible, user:user, type: 'tab', template:'projectAdmin', project:project, canChangeProjectDates: canChangeProjectDates, minimumProjectEndDate:minimumProjectEndDate, showMERIActivityWarning:true, showAnnouncementsTab: showAnnouncementsTab, showSpecies:true, meriPlanTemplate:MERI_PLAN_TEMPLATE, showMeriPlanHistory:showMeriPlanHistory, requireMeriPlanApprovalReason:Boolean.valueOf(config.supportsMeriPlanHistory),  config:config, activityPeriodDescriptor:config.activityPeriodDescriptor ?: 'Stage']]

        if (template == MERI_ONLY_TEMPLATE) {
            model = [details:model.details]
        }
        else if (template == RLP_TEMPLATE) {

            // The RLP Project Template doesn't need site details or activities.
            project.sites = new JSONArray(project.sites?.collect{new JSONObject([name:it.name, siteId:it.siteId, lastUpdated:it.lastUpdated, type:it.type, extent:[:]])} ?: [])
            project.remove('activities')
            model.overview.template = 'rlpOverview'

            boolean showOrderNumber = userService.userHasReadOnlyAccess() || userService.userIsSiteAdmin()
            model.overview.showOrderNumber = showOrderNumber

            model.details.meriPlanTemplate = config.meriPlanTemplate ? config.meriPlanTemplate+"View" : RLP_MERI_PLAN_TEMPLATE+'View'

            boolean serviceDeliveryVisible = model.dashboard.visible && userHasViewAccess
            model.serviceDelivery = [label: 'Dashboard', visible: serviceDeliveryVisible, type: 'tab', template: 'rlpServiceDashboard']
            if (model.serviceDelivery.visible) {
                // This can be a slow call so don't make it if the data won't be displayed
                model.serviceDelivery.servicesDashboard = projectService.getServiceDashboardData(project.projectId, false)
            }

            model.site.useAlaMap = true
            model.site.showSiteType = true
            model.site.visible = model.site.visible && userHasViewAccess
            model.details.visible = model.details.visible && userHasViewAccess

            Map reportingTab = [label: 'Reporting', visible:userHasViewAccess, type:'tab', template:'projectReporting', reports:project.reports, stopBinding:true, services: config.services, scores:scores, hideDueDate:true, isAdmin:user?.isAdmin, isGrantManager:user?.isCaseManager]
            if (reportingTab.visible) {
                reportingTab.reportOrder = config?.projectReports?.collect{[category:it.category, description:it.description]} ?: []
                project.reports?.each { Map report ->
                    ReportConfig reportConfig = ((ProgramConfig)config).findProjectReportConfigForReport(report)
                    report.isAdjustable = reportConfig?.isAdjustable()
                }
            }

            Map rlpModel = [overview:model.overview, serviceDelivery: model.serviceDelivery, documents:model.documents, details:model.details, site:model.site, reporting:reportingTab]
            rlpModel.admin = model.admin
            rlpModel.admin.meriPlanTemplate =  config.meriPlanTemplate ?: RLP_MERI_PLAN_TEMPLATE
            rlpModel.admin.projectServices = config.services
            rlpModel.admin.showMERIActivityWarning = false
            rlpModel.admin.allowMeriPlanUpload = false
            rlpModel.admin.showSpecies = false
            rlpModel.admin.hidePrograms = true
            rlpModel.admin.showAnnouncementsTab = false
            rlpModel.admin.risksAndThreatsVisible = risksAndThreatsVisible

            model = buildRLPTargetsModel(rlpModel, project)
        }
        else if (config?.projectTemplate == ESP_TEMPLATE && !user?.hasViewAccess) {
            project.remove('sites')
            project.remove('activities')
            model.overview.datesHidden = true
            model.overview.fundingHidden = true
        }
        else {
            def metrics = projectService.summary(project.projectId)
            model.dashboard.metrics = metrics
        }
        return [view: 'index', model: model]
    }

    private Map buildRLPTargetsModel(Map model, project){
        //Verify project.outcomes (from program config) with primaryOutcome and secondaryOutcomes in project.custom.details.outcomes
        Map primaryOutcome = project.custom?.details?.outcomes?.primaryOutcome
        if (primaryOutcome){
            Map oc =  project.outcomes.find {oc -> oc.outcome == primaryOutcome.description}
            if(oc){
                oc['targeted'] = true
                primaryOutcome['shortDescription'] = oc['shortDescription']
            }

        }

        for(def po : project.custom?.details?.outcomes?.secondaryOutcomes){
            Map oc =  project.outcomes.find {oc -> oc.outcome == po.description}
            if(oc){
                oc['targeted'] = true
                po['shortDescription'] = oc['shortDescription']
            }

        }
        model
    }

    private String projectTemplate(Map config, String template) {
        // Allow FC_OFFICERS and above to select a different reporting template
        if (template && userService.userIsSiteAdmin()) {
            return template
        }
        return config.projectTemplate
    }
    /**
     * Designed for an ajax call - this returns only a template not a full HTML page.
     * @param id the project ID.
     */
    @PreAuthorise
    def projectDashboard(String id) {
        render template: 'dashboard', model: [metrics: projectService.summary(id)]
    }

    @PreAuthorise(accessLevel='siteAdmin')
    def ajaxValidateProjectDates(String id) {
        if (!params.plannedStartDate) {
            render status:400, message:"Invalid date supplied"
            return
        }

        ReportGenerationOptions options = projectService.dateChangeOptions(params)

        try {
            String newStartDate = params.plannedStartDate
            String newEndDate = params.plannedEndDate

            String message = projectService.validateProjectDates(id, newStartDate, newEndDate, options)
            Map result = [valid:message == null, message:message]

            render result as JSON
        }
        catch (Exception e) {
            render status:400, message:"Invalid date supplied"
        }

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
        log.debug "Body: ${postBody}"
        log.debug "Params: ${params}"
        def values = [:]
        // filter params to remove keys in the ignore list
        postBody.each { k, v ->
            if (!(k in ignore)) {
                values[k] = v
            }
        }

        // The rule currently is that anyone is allowed to create a project so we only do these checks for
        // existing projects.
        def userId = userService.getUser()?.userId
        if (id) {
            if (!projectService.canUserEditProject(userId, id)) {
                render status: 401, text: "User ${userId} does not have edit permissions for project ${id}"
                log.debug "user not caseManager"
                return
            }

            if (values.containsKey("planStatus") && values.planStatus =~ /approved/) {
                // check to see if user has caseManager permissions
                if (!projectService.isUserCaseManagerForProject(userId, id)) {
                    render status: 401, text: "User does not have caseManager permissions for project"
                    log.warn "User ${userId} who is not a caseManager attempting to change planStatus for project ${id}"
                    return
                }
            }
        } else if (!userId) {
            render status: 401, text: 'You do not have permission to create a project'
        }


        log.debug "json=" + (values as JSON).toString()
        log.debug "id=${id} class=${id?.getClass()}"
        def projectSite = values.remove("projectSite")
        def documents = values.remove('documents')
        def links = values.remove('links')
        def result = id ? projectService.update(id, values) : projectService.create(values)
        log.debug "result is " + result
        if (documents && !result.error) {
            if (!id) id = result.resp.projectId
            documents.each { doc ->
                doc.projectId = id
                doc.isPrimaryProjectImage = doc.role == 'mainImage'
                if (doc.isPrimaryProjectImage || doc.role == documentService.ROLE_LOGO) doc.public = true
                documentService.saveStagedImageDocument(doc)
            }
        }
        if (links && !result.error) {
            if (!id) id = result.resp.projectId
            links.each { link ->
                link.projectId = id
                documentService.saveLink(link)
            }
        }
        if (projectSite && !result.error) {
            if (!id) id = result.resp.projectId
            if (!projectSite.projects)
                projectSite.projects = [id]
            else if (!projectSite.projects.contains(id))
                projectSite.projects += id
            def siteResult = siteService.updateRaw(values.projectSiteId, projectSite)
            if (siteResult.status == 'error')
                result = [error: 'SiteService failed']
            else if (siteResult.status == 'created') {
                def updateResult = projectService.update(id, [projectSiteId: siteResult.id])
                if (updateResult.error) result = updateResult
            }
        }
        if (result.error) {
            render result as JSON
        } else {
            //println "json result is " + (result as JSON)
            render result.resp as JSON
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def serviceScores(String id) {
        render projectService.getServiceScoresForProject(id) as JSON
    }


    @PreAuthorise
    def update(String id) {
        //params.each { println it }
        projectService.update(id, params)
        chain action: 'index', id: id
    }

    @PreAuthorise(accessLevel = 'admin')
    def delete(String id) {
        projectService.delete(id)
        forward(controller: 'home')
    }

    def species(String id) {
        def project = projectService.get(id, 'brief')
        def activityTypes = metadataService.activityTypesList();
        render view: '/species/select', model: [project: project, activityTypes: activityTypes]
    }

    /**
     * Star or unstar a project for a user
     * Action is determined by the URI endpoint, either: /add | /remove
     *
     * @return
     */
    def starProject() {
        String act = params.id?.toLowerCase() // rest path starProject/add or starProject/remove
        String userId = params.userId
        String projectId = params.projectId

        if (act && userId && projectId) {
            if (act == "add") {
                render userService.addStarProjectForUser(userId, projectId) as JSON
            } else if (act == "remove") {
                render userService.removeStarProjectForUser(userId, projectId) as JSON
            } else {
                render status: 400, text: 'Required endpoint (path) must be one of: add | remove'
            }
        } else {
            render status: 400, text: 'Required params not provided: userId, projectId'
        }
    }

    def getMembersForProjectId() {
        String projectId = params.id
        def adminUserId = userService.getCurrentUserId()

        if (projectId && adminUserId) {
            if (projectService.isUserAdminForProject(adminUserId, projectId) || projectService.isUserCaseManagerForProject(adminUserId, projectId)) {
                render projectService.getMembersForProjectId(projectId) as JSON
            } else {
                render status: 403, text: 'Permission denied'
            }
        } else if (adminUserId) {
            render status: 400, text: 'Required params not provided: id'
        } else if (projectId) {
            render status: 403, text: 'User not logged-in or does not have permission'
        } else {
            render status: 500, text: 'Unexpected error'
        }
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = 'home', redirectAction = 'index')
    def downloadProjectData() {
        String projectId = params.id

        if (!projectId) {
            render status: 400, text: 'Required params not provided: id'
        } else {
            def path = "project/downloadProjectData/${projectId}"

            if (params.view == 'xlsx' || params.view == 'json') {
                path += ".${params.view}"
            } else {
                path += ".json"
            }
            def url = grailsApplication.config.ecodata.baseUrl + path
            webService.proxyGetRequest(response, url, true, true, 120000)
        }
    }

    @PreAuthorise(accessLevel = 'admin', redirectController = 'home', redirectAction = 'index')
    def downloadShapefile(String id) {

        def url = grailsApplication.config.ecodata.baseUrl + "project/${id}.shp"
        def resp = webService.proxyGetRequest(response, url, true, true, 960000)
        if (resp.status != 200) {
            render view: '/error', model: [error: resp.error]
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def projectSitePhotos(String id) {

        Map project = projectService.get(id)
        List activities = activityService.activitiesForProject(id)
        int count = siteService.addPhotoPointPhotosForSites(project.sites ?: [], activities, [project])

        render template: 'sitePhotoPoints', model: [project: project, photoCount:count]

    }

    @PreAuthorise(accessLevel = 'admin')
    def espPhotos(String id) {

        Map project = projectService.get(id)
        List activities = activityService.activitiesForProject(id)
        int count = siteService.addPhotoPointPhotosForSites(project.sites ?: [], activities, [project])

        List activityIds = activities?.collect{it.activityId}
        Map searchResults = documentService.search(activityId:activityIds, role:'surveyImage')
        List documents = searchResults.documents

        render template: 'espPhotos', model: [project: project, photos:documents, photoPointCount:count]

    }

    @PreAuthorise(accessLevel = 'admin')
    def ajaxSubmitReport(String id) {

        def reportDetails = request.JSON

        def result = projectService.submitReport(id, reportDetails)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxApproveReport(String id) {

        def reportDetails = request.JSON

        def result = projectService.approveReport(id, reportDetails)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxRejectReport(String id) {

        def reportDetails = request.JSON

        def result = projectService.rejectReport(id, reportDetails)

        render result as JSON

    }

    /**
     * Deletes all of the activities in the stage.
     * @param id the project id
     */
    @PreAuthorise(accessLevel = 'siteAdmin')
    def ajaxDeleteReportActivities(String id, ReportCommand reportDetails) {

        if (reportDetails.hasErrors()) {
            respond reportDetails.errors, formats: ['json']
        } else {
            Map result = projectService.deleteReportActivities(reportDetails.reportId, reportDetails.activityIds)
            render result as JSON
        }

    }

    @PreAuthorise(accessLevel = 'admin')
    def ajaxSubmitPlan(String id) {
        def result = projectService.submitPlan(id)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxApprovePlan(String id) {
        Map approvalDetails = request.JSON
        def result = projectService.approvePlan(id, approvalDetails)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxRejectPlan(String id) {
        def result = projectService.rejectPlan(id)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxUnlockPlanForCorrection(String id) {
        def result = projectService.unlockPlanForCorrection(id, params.declaration)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxFinishedCorrectingPlan(String id) {
        def result = projectService.finishedCorrectingPlan(id)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'admin')
    def updateProjectDates(String id) {
        def payload = request.getJSON()
        if (!payload.plannedStartDate || !payload.plannedEndDate) {
            render status: 400, text: "Missing parameters plannedStartDate, plannedEndDate"
            return
        }
        def result = projectService.changeProjectDates(id, payload.plannedStartDate, payload.plannedEndDate)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'admin')
    def regenerateStageReports(String id) {

        projectService.generateProjectStageReports(id, new ReportGenerationOptions())
        render status: 200, text: 'ok'
    }

    @PreAuthorise(accessLevel = 'admin')
    def projectReport(String id, ProjectSummaryReportCommand projectSummaryReportCommand) {
        projectSummaryReportCommand()
    }

    @PreAuthorise(accessLevel = 'admin')
    def projectReportPDF(String id) {

        Map reportUrlConfig = [controller: 'report', action: 'projectReportCallback', id: id, absolute: true, params: [fromStage: params.fromStage, toStage: params.toStage, sections: params.sections]]
        Map pdfGenParams = [:]
        if (params.orientation == 'landscape') {
            pdfGenParams.options = '-O landscape'
        }
        boolean result = pdfGenerationService.generatePDF(reportUrlConfig, pdfGenParams, response)
        if (!result) {
            render view: '/error', model: [error: "An error occurred generating the project report."]
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def meriPlanPDF(String id) {
        Map reportUrlConfig = [controller: 'report', action: 'meriPlanReportCallback', id: id, absolute: true]
        boolean result = pdfGenerationService.generatePDF(reportUrlConfig, [:], response)
        if (!result) {
            render view: '/error', model: [error: "An error occurred generating the MERI plan report."]
        }
    }

    /**
     * Accepts a MERI Plan as an attached file and attempts to convert it into a format compatible with
     * MERIT.
     * @param id the id of the project.
     */
    @PreAuthorise(accessLevel = 'admin')
    def uploadMeriPlan(String id) {
        Map result
        if (request.respondsTo('getFile')) {
            def file = request.getFile('meriPlan')
            if (file) {
                Map project = projectService.get(id)
                Map config = projectService.getProgramConfiguration(project)
                MeriPlanMapper mapper = new MeriPlanMapper(config)
                result = mapper.importMeriPlan(file.inputStream)
            }
        }
        if (!result) {
            response.status = HttpStatus.SC_BAD_REQUEST
            result = [status: HttpStatus.SC_BAD_REQUEST, error:'No file attachment found']

        }
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'admin')
    def previewStageReport() {
        String projectId = params.id
        String reportId = params.reportId
        String status = params.status

        if (reportId && projectId && status) {
            def project = projectService.get(projectId, 'all')
            def activities = activityService.activitiesForProject(projectId);
            if (project && !project.error) {
                def report = project.reports?.find { it.reportId == reportId }
                if (report) {
                    def param = [project: project, activities: activities, report: report, status: status]
                    def htmlContent = projectService.createHTMLStageReport(param)
                    render text: htmlContent, contentType: "text", encoding: "UTF-8";
                } else {
                    render status: 400, text: 'Invalid stage'
                }
            } else {
                render status: 400, text: 'Invalid project'
            }
        } else {
            render status: 400, text: 'Required params not provided: id, reportId, status'
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def reportingHistory(String id) {

        def reportingHistory = reportService.getReportingHistoryForProject(id)

        render view: '/report/_reportingHistory', model: [reportingHistory: reportingHistory]
    }

    def mine() {
        forward controller: 'user', action: 'index'
    }

    /**
    * @param id the id of the Project being completed
    * @param q query string to search for
    * @param limit the maximum number of results to return
    * @param output Identity of field for specific configuration.
    * @param dataFieldName Identity of field for specific configuration.
    * @param surveyName Identity of field for specific configuration
    */
    def searchSpecies(String id, String q, Integer limit, String output, String dataFieldName, String surveyName) {

        // Making a separate call to retrieve the config allows the caching annotation to work.
        Map speciesFieldConfig = projectService.findSpeciesFieldConfig(id, surveyName, dataFieldName, output)

        def result = projectService.searchSpecies(speciesFieldConfig, q, limit)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def searchActivities(String id) {

        if (!id) {
            render status:400, error:'Project id must be supplied'
            return
        }
        Map criteria = params.findAll{!ignore.contains(it.key)}
        if (!criteria.projectId) {
            criteria.projectId = id
        }
        Map result = activityService.search(criteria)
        List activities = []
        if (result && result.resp) {
            activities = result.resp.activities ?: []
        }
        render activities as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def editReport(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected for data entry', id)
            return
        }
        if (params.clearCache) {
            metadataService.clearCache()
        }

        Map model = activityReportModel(id, reportId, ReportMode.EDIT, params.getInt('formVersion', null))

        if (!model.editable) {
            redirect action:'viewReport', id:id, params:[reportId:reportId, attemptedEdit:true]
        }
        else {
            if (model.config.requiresActivityLocking) {
                Map result = reportService.lockForEditing(model.report)
                model.locked = true
            }
            model.saveReportUrl = createLink(action:'saveReport', id:id, params:[reportId:model.report.reportId])
            render model:model, view:'/activity/activityReport'
        }
    }

    @PreAuthorise(accessLevel = 'editor')
    def viewReport(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected for data entry', id)
            return
        }
        Map model = activityReportModel(id, reportId, ReportMode.VIEW)

        render view:'/activity/activityReportView', model:model
    }

    @PreAuthorise(accessLevel = 'editor')
    def saveReport(SaveReportDataCommand saveReportDataCommand) {

        Map result
        if (saveReportDataCommand.report?.projectId != params.id) {
            result = [status:HttpStatus.SC_UNAUTHORIZED, error:"You do not have permission to save this report"]
        }
        else {
            result = saveReportDataCommand.save()
        }

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def overrideLockAndEdit(String id, String reportId) {
        reportService.overrideLock(reportId, g.createLink(action:'viewReport', id:id, params:[reportId:reportId], absolute: true))
        chain(action:'editReport', id:id, params:[reportId:reportId])
    }

    @PreAuthorise(accessLevel = 'editor')
    def reportPDF(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected for download', id)
            return
        }

        Map reportUrlConfig = [action: 'viewReportCallback', id: id, params:[reportId:reportId]]

        Map pdfGenParams = [:]
        if (params.orientation) {
            pdfGenParams.orientation = params.orientation
        }
        boolean result = pdfGenerationService.generatePDF(reportUrlConfig, pdfGenParams, response)
        if (!result) {
            render view: '/error', model: [error: "An error occurred generating the project report."]
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def resetReport(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected', id)
            return
        }
        Map result = reportService.reset(reportId)
        render result as JSON
    }

    /**
     * This is designed as a callback from the PDF generation service.  It produces a HTML report that will
     * be converted into PDF.
     * @param id the project id
     */
    def viewReportCallback(String id, String reportId) {

        if (pdfGenerationService.authorizePDF(request)) {
            Map model = activityReportModel(id, reportId, ReportMode.PRINT)

            render view:'/activity/activityReportView', model:model
        }
        else {
            render status:HttpStatus.SC_UNAUTHORIZED
        }
    }

    @PreAuthorise(accessLevel = 'editor')
    def ajaxProjectSites(String id) {
        Map result = projectService.projectSites(id)

        render result as JSON
    }

    private Map activityReportModel(String projectId, String reportId, ReportMode mode, Integer formVersion = null) {

        Map project = projectService.get(projectId)
        List sites = project.remove('sites')
        Map config = projectService.getProgramConfiguration(project)
        Map model = reportService.activityReportModel(reportId, mode, formVersion)
        model.metaModel = filterOutputModel(model.metaModel, project, model.activity)

        model.context = new HashMap(project)
        model.returnTo = g.createLink(action:'index', id:projectId)
        model.contextViewUrl = model.returnTo
        model.reportHeaderTemplate = '/project/rlpProjectReportHeader'
        model.config = config

        if (model.metaModel.supportsSites) {
            if (model.activity.siteId) {
                model.reportSite = sites?.find { it.siteId == model.activity.siteId }
            }

            Map siteData = projectService.projectSites(projectId)
            if (!siteData.error) {
                model.projectArea = siteData.projectArea
                model.features = siteData.features
            }
        }
        model
    }

    /**
     * This method returns project targets as well as the contribution towards those targets from a specific
     * report.  It is used to create a form which allows adjustments to be recorded against approved reports
     * that cannot go through a withdrawal and corrections process.
     */
    @PreAuthorise(accessLevel = 'editor')
    def getProjectTargetsForAdjustmentsReport(String id, String reportId) {
        Map adjustmentsReport = reportService.get(reportId)
        Map originalReport = reportService.get(adjustmentsReport.adjustedReportId)

        List result = projectService.getServiceDataForActivity(id, originalReport.activityId)
        List allTargetMeasures = []
        result.each { service ->
            service.scores?.each { score ->
                if (score.target) {
                    allTargetMeasures << [name:service.name, targetMeasure:score.label, result:score.data?.result, target:score.target, scoreId:score.scoreId, periodTargets:score.periodTargets]
                }

            }
        }
        Map results = [projectId:id, targets:allTargetMeasures]
        render results as JSON
    }

    /**
     * Used by the RLP annual project report to report against missed minimum annual targets.
     * @param id the projectId of the project being reported on.
     */
    @PreAuthorise(accessLevel = 'editor')
    def scoresByFinancialYear(String id) {
        String financialYearEndDate = params.financialYearEndDate
        boolean missedTargetsOnly = params.getBoolean("missedTargetsOnly", false)

        DateTime financialYearStart = DateUtils.alignToFinancialYear(DateUtils.parse(financialYearEndDate))
        String year = financialYearStart.year + "/" + (financialYearStart.year+1)

        List targets = projectService.findMinimumTargets(id, year, missedTargetsOnly)

        boolean onlyNonZeroTargets = params.getBoolean("onlyNonZeroTargets", false)
        if (onlyNonZeroTargets) {
            targets = targets.findAll{hasFinancialYearTarget(it)}
        }
        Map results = [projectId:id, targets:targets]
        render results as JSON
    }

    private boolean hasFinancialYearTarget(Map targetRow) {
        def financialYearTarget = targetRow.financialYearTarget
        financialYearTarget != 0 && financialYearTarget != "0"
    }

    /**
     * If the activity type to be displayed is the RLP Outputs report, only show the outputs that align with
     * services to be delivered by the model.  This method has a side effect of modifying the
     * @param model the model containing the activity metaModel and output templates.
     * @param project the project associated with the report.
     */
    private Map filterOutputModel(Map activityModel, Map project, Map existingActivityData) {

        Map filteredModel = activityModel
        if (activityModel?.name == grailsApplication.config.rlp.servicesReport) {

            List projectServices = projectService.getProjectServices(project)
            List allServices = metadataService.getProjectServices()
            if (projectServices) {

                List projectServiceOutputs = projectServices.collect{it.output}

                filteredModel = new JSONObject(activityModel)
                List existingOutputs = existingActivityData?.outputs?.collect{it.name}
                filteredModel.outputs = activityModel.outputs.findAll({ String output ->
                    boolean isServiceOutput = allServices.find{it.output == output}

                    // Include this output if it's not associated with a service,
                    // Or if it's associated by a service delivered by this project
                    // Or it has previously had data recorded against it (this can happen if the services change after the report has been completed)
                    !isServiceOutput || output in projectServiceOutputs || output in existingOutputs
                })
            }
        }
        filteredModel
    }

    @PreAuthorise(accessLevel ='siteAdmin')
    def adjustReport(String id) {

        Map reportData = request.JSON
        Map project = projectService.get(id)
        if (!project) {
            render status:404
        }
        else {
            Map result = projectService.adjustReport(id, reportData.reportId, reportData.reason)
            render result as JSON
        }
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def createReport(String id) {

        Map report = request.getJSON()
        report.projectId = id

        def response = reportService.create(report)
        if (response.resp.error) {
            flash.message = "Error creating report: ${response.resp.error}"
        }

        chain(action:'index', id: id)

    }

    @PreAuthorise(accessLevel = 'officer')
    def approvedMeriPlanHistory(String id) {
        List approvedPlanSummary = projectService.approvedMeriPlanHistory(id)

        Map result = [approvedMeriPlanHistory:approvedPlanSummary]

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'admin')
    def viewMeriPlan(MeriPlanReportCommand meriPlanReportCommand) {

        // Only grant/project managers can view historical MERI plans.
        if (meriPlanReportCommand.documentId && !userService.userIsSiteAdmin()) {
            render status:HttpStatus.SC_UNAUTHORIZED
        }
        else {
            Map model = meriPlanReportCommand.meriPlanReportModel()
            if (!model.error) {
                render view:'/project/meriPlanReport', model:model
            }
            else {
                render status: HttpStatus.SC_NOT_FOUND
            }
        }
    }

    /**
     * This method returns the investment priorities listed in the primary and secondary outcome sections of the
     * RLP MERI plan into a single list for the purposes of pre-populating one of the RLP outcomes reporting forms.
     * @param id the project id of the project of interest
     * @return a List of outcomes selected in the project MERI plan
     */
    @PreAuthorise(accessLevel = 'editor')
    def listProjectInvestmentPriorities(String id) {
        render projectService.listProjectInvestmentPriorities(id) as JSON
    }

    private def error(String message, String projectId) {
        flash.message = message
        if (projectId) {
            redirect(action: 'index', id: projectId)
        }
        else {
            redirect(controller:'home', action:'publicHome')
        }

    }
}

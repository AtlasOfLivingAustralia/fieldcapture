package au.org.ala.merit

import au.org.ala.merit.command.MeriPlanChangesReportCommand
import au.org.ala.merit.command.MeriPlanReportCommand
import au.org.ala.merit.command.ProjectSummaryReportCommand
import au.org.ala.merit.command.ReportCommand
import au.org.ala.merit.command.SaveReportDataCommand
import au.org.ala.merit.config.ProgramConfig
import au.org.ala.merit.config.ReportConfig
import au.org.ala.merit.reports.ReportLifecycleListener
import au.org.ala.merit.reports.ReportGenerationOptions
import grails.converters.JSON
import grails.core.GrailsApplication
import org.apache.http.HttpStatus
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject
import org.joda.time.DateTime

import static ReportService.ReportMode

class ProjectController {

    static allowedMethods =  [listProjectInvestmentPriorities: 'GET', ajaxUpdate: 'POST']
    static defaultAction = "index"
    static ignore = ['action', 'controller', 'id', 'planStatus', 'hubId', 'projectId', 'isMERIT']
    static final ADMIN_ONLY_FIELDS = ['config', 'programId', 'associatedProgram', 'associatedSubProgram', 'grantId', 'status', 'organisationId', 'orgIdSvcProvider']
    static MANAGER_ONLY_FIELDS = ['plannedStartDate', 'plannedEndDate', 'contractStartDate', 'contractEndDate']

    static String ESP_TEMPLATE = "esp"
    static String RLP_TEMPLATE = "rlp"
    static String MERI_ONLY_TEMPLATE = "meri"
    static String RLP_MERI_PLAN_TEMPLATE = "rlpMeriPlan"
    static String MERI_PLAN_TEMPLATE = "meriPlan"
    static int AGRICULTURE_OUTCOME_START_INDEX = 4;

    def projectService, metadataService, commonService, activityService, userService, webService, roleService
    def siteService, documentService, reportService, blogService
    GrailsApplication grailsApplication
    LockService lockService
    MonitorService monitorService

    private def espOverview(Map project, Map user, ProgramConfig config) {

        Map projectArea = null
        if (project.sites) {
            projectArea = project.sites?.find({ it.type == SiteService.SITE_TYPE_PROJECT_AREA })
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
                isProjectStarredByUser: isProjectStarredByUser,
                config:config], view: 'espOverview'
    }

    /**
     * Programs can be marked as private which will restricts the ability to view the project
     * page to users named in the Project Access section or who have a role on the MERIT hub.
     * An additional flag can control whether users with read only access on the MERIT hub
     * can see the project.
     */
    private static boolean canUserViewProject(def user, Map programConfig) {
        boolean canView = true // By default, even un-authenticated users can view at least the project overview
        if (programConfig?.visibility == 'private') {
            canView = programConfig?.readOnlyUsersCanViewWhenPrivate ? user?.hasViewAccess : user?.isEditor
        }
        canView
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
        Map stateElectorate = projectService.findStateAndElectorateForProject(project.projectId)
        if (stateElectorate) {
            project << stateElectorate
        }
        Map config = null
        if (project && !project.error) {
            config = projectService.getProgramConfiguration(project)
        }

        if (!project || project.error || !canUserViewProject(user, config)) {
            flash.message = "Project not found with id: ${id}"
            if (project?.error) {
                flash.message += "<br/>${project.error}"
                log.warn project.error
            }
            redirect(controller: 'home', model: [error: flash.message])
        } else {

            String template = projectTemplate(config, params.template)
            if (template == ESP_TEMPLATE && user?.isEditor) {
                espOverview(project, user, config)
            } else {
                project.sites?.sort { it.name }
                project.projectSite = project.sites?.find { it.siteId == project.projectSiteId }
                List roles = roleService.getRoles()
                if (config.supportsParatoo) {
                    roles = roles + [RoleService.PROJECT_SURVEYOR_ROLE]
                }

                def members = projectService.getMembersForProjectId(id)
                def admins = members.findAll { it.role == "admin" }.collect { it.userName }.join(",")
                // comma separated list of user email addresses
                boolean meriPlanStatus = projectService.isMeriPlanSubmittedOrApproved(project)
                List<Map> programList = projectService.getProgramList()


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
                             programList           : programList,
                             meriPlanStatus        : meriPlanStatus,
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
        boolean canRegenerateReports = projectService.canRegenerateReports(project)
        boolean hasSubmittedOrApprovedFinalReportInCategory = projectService.hasSubmittedOrApprovedFinalReportInCategory(project)
        def meriPlanVisible = config.includesContent(ProgramConfig.ProjectContent.MERI_PLAN)
        boolean canModifyMeriPlan = config.requireMeritAdminToReturnMeriPlan ?  userService.userIsAlaOrFcAdmin() : user?.isCaseManager
        int outcomeStartIndex = (config.nonAgricultureoOutcomeStartIndex) ?: AGRICULTURE_OUTCOME_START_INDEX;
        def risksAndThreatsVisible = config.includesContent(ProgramConfig.ProjectContent.RISKS_AND_THREATS) && user?.hasViewAccess
        def canViewRisks = risksAndThreatsVisible && (user?.hasViewAccess || user?.isEditor)
        def meriPlanEnabled = user?.hasViewAccess || ((project.associatedProgram == 'National Landcare Programme' && project.associatedSubProgram == 'Regional Funding'))
        def meriPlanVisibleToUser = project.planStatus == 'approved' || user?.isAdmin || user?.isCaseManager || user?.hasViewAccess
        boolean userHasViewAccess = user?.hasViewAccess ?: false
        boolean showMeriPlanComparison = config.supportsMeriPlanComparison

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

        List blogIds = blog.collect{it?.imageId}
        def imagesModel = publicImages.findAll { it?.documentId !in blogIds }.collect{
            [name: it.name, projectName: project.name, url: it.url, thumbnailUrl: it.thumbnailUrl]
        }
        boolean canChangeProjectDates = userService.userIsAlaOrFcAdmin()

        // For validation of project date changes.
        String minimumProjectEndDate = projectService.minimumProjectEndDate(project, config)

        boolean adminTabVisible = user?.isEditor || user?.isAdmin || user?.isCaseManager || user?.hasViewAccess
        boolean showMeriPlanHistory = config.supportsMeriPlanHistory && userService.userIsSiteAdmin()
        boolean datasetsVisible = config.includesContent(ProgramConfig.ProjectContent.DATA_SETS) && userHasViewAccess
        if (datasetsVisible && project.custom?.dataSets) {
            projectService.filterDataSetSummaries(project.custom?.dataSets)
        }
        boolean showExternalIds = userService.userHasReadOnlyAccess() || userService.userIsSiteAdmin()
        def model = [overview       : [label: 'Overview', visible: true, default: true, type: 'tab', publicImages: imagesModel, displayOutcomes: false, blog: blog, hasNewsAndEvents: hasNewsAndEvents, hasProjectStories: hasProjectStories, canChangeProjectDates: canChangeProjectDates, outcomes:project.outcomes, objectives:config.program?.config?.objectives, showExternalIds:showExternalIds],
                     documents      : [label: 'Documents', visible: config.includesContent(ProgramConfig.ProjectContent.DOCUMENTS), type: 'tab', user:user, template:'docs', activityPeriodDescriptor:config.activityPeriodDescriptor ?: 'Stage'],
                     details        : [label: 'MERI Plan', default: false, disabled: !meriPlanEnabled, visible: meriPlanVisible, meriPlanVisibleToUser: meriPlanVisibleToUser, risksAndThreatsVisible: canViewRisks, announcementsVisible: true, project:project, type: 'tab', template:'viewMeriPlan', meriPlanTemplate:MERI_PLAN_TEMPLATE+'View', config:config, activityPeriodDescriptor:config.activityPeriodDescriptor ?: 'Stage'],
                     plan           : [label: 'Activities', visible: true, disabled: !user?.hasViewAccess, type: 'tab', template:'projectActivities', grantManagerSettingsVisible:user?.isCaseManager, project:project, reports: project.reports, scores: scores, risksAndThreatsVisible: risksAndThreatsVisible],
                     site           : [label: 'Sites', visible: config.includesContent(ProgramConfig.ProjectContent.SITES), disabled: !user?.hasViewAccess, editable:user?.isEditor, type: 'tab', template:'projectSites'],
                     dashboard      : [label: 'Dashboard', visible: config.includesContent(ProgramConfig.ProjectContent.DASHBOARD), disabled: !user?.hasViewAccess, type: 'tab'],
                     datasets       : [label: 'Data set summary', visible: datasetsVisible, template: '/project/dataset/dataSets', type:'tab'],
                     admin          : [label: 'Admin', visible: adminTabVisible, user:user, type: 'tab', template:'projectAdmin', project:project, canChangeProjectDates: canChangeProjectDates, minimumProjectEndDate:minimumProjectEndDate, showMERIActivityWarning:true, showAnnouncementsTab: showAnnouncementsTab, showSpecies:true, meriPlanTemplate:MERI_PLAN_TEMPLATE, showMeriPlanHistory:showMeriPlanHistory, requireMeriPlanApprovalReason:Boolean.valueOf(config.supportsMeriPlanHistory),  config:config, activityPeriodDescriptor:config.activityPeriodDescriptor ?: 'Stage', canRegenerateReports: canRegenerateReports, hasSubmittedOrApprovedFinalReportInCategory: hasSubmittedOrApprovedFinalReportInCategory, canModifyMeriPlan: canModifyMeriPlan, showRequestLabels:config.supportsParatoo, outcomeStartIndex:outcomeStartIndex]]

        if (template == MERI_ONLY_TEMPLATE) {
            model = [details:model.details]
        }
        else if (template == RLP_TEMPLATE) {

            // The RLP Project Template doesn't need site details or activities.
            project.sites = new JSONArray(project.sites?.collect{new JSONObject([name:it.name, siteId:it.siteId, lastUpdated:it.lastUpdated, type:it.type, extent:[:], publicationStatus:it.publicationStatus, externalIds:it.externalIds])} ?: [])
            project.remove('activities')

            model.details.meriPlanTemplate = config.meriPlanTemplate ? config.meriPlanTemplate+"View" : RLP_MERI_PLAN_TEMPLATE+'View'

            boolean serviceDeliveryVisible = model.dashboard.visible && userHasViewAccess
            model.serviceDelivery = [label: 'Dashboard', visible: serviceDeliveryVisible, type: 'tab', template: 'rlpServiceDashboard', includeInvoiced:config.supportsOutcomeTargets()]
            if (model.serviceDelivery.visible) {
                // This can be a slow call so don't make it if the data won't be displayed
                model.serviceDelivery.servicesDashboard = projectService.getServiceDashboardData(project.projectId, false)
            }

            model.site.useAlaMap = true
            model.site.showSiteType = true
            model.site.visible = model.site.visible && userHasViewAccess
            model.details.visible = model.details.visible && userHasViewAccess

            boolean reportsVisible = config.includesContent(ProgramConfig.ProjectContent.REPORTING) && userHasViewAccess

            Map reportingTab = [label: 'Reporting', visible:reportsVisible, type:'tab', template:'projectReporting', reports:project.reports, stopBinding:true, services: config.services, scores:scores, hideDueDate:true, isAdmin:user?.isAdmin, isGrantManager:user?.isCaseManager, declarationTemplate:config.getDeclarationTemplate()]
            if (reportingTab.visible) {
                reportingTab.reportOrder = config?.projectReports?.collect{
                    [category:it.category, description:it.description, banner:it.banner, rejectionReasonCategoryOptions:it.rejectionReasonCategoryOptions?:[]]}?.unique({it.category}) ?: []
                project.reports?.each { Map report ->
                    ReportConfig reportConfig = ((ProgramConfig)config).findProjectReportConfigForReport(report)
                    report.isAdjustable = reportConfig?.isAdjustable()
                }
            }

            Map rlpModel = [overview:model.overview, serviceDelivery: model.serviceDelivery, documents:model.documents, details:model.details, site:model.site, reporting:reportingTab, datasets: model.datasets]
            rlpModel.admin = model.admin
            rlpModel.admin.meriPlanTemplate =  config.meriPlanTemplate ?: RLP_MERI_PLAN_TEMPLATE
            rlpModel.admin.meriPlanTemplate =  config.meriPlanTemplate ?: RLP_MERI_PLAN_TEMPLATE
            rlpModel.admin.projectServices = config.services
            rlpModel.admin.showMERIActivityWarning = false
            rlpModel.admin.allowMeriPlanUpload = false
            rlpModel.admin.showSpecies = false
            rlpModel.admin.showAnnouncementsTab = false
            rlpModel.admin.risksAndThreatsVisible = risksAndThreatsVisible
            rlpModel.admin.showMeriPlanComparison = showMeriPlanComparison
            rlpModel.admin.showRequestLabels = config.supportsParatoo && projectService.hasSelectedEmsaModules(project)

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

    @PreAuthorise(accessLevel='caseManager')
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

    /** Creates a list of properties that should be ignored depending on the current user role */
    private List buildIgnoreList() {
        List ignoreList = [] + ignore
        if (!userService.userIsAlaOrFcAdmin()) {
            ignoreList += ADMIN_ONLY_FIELDS
        }
        if (!userService.userIsSiteAdmin())       {
            ignoreList += MANAGER_ONLY_FIELDS
        }
        ignoreList
    }

    /**
     * Updates an existing project.
     * @param id projectId
     */
    @PreAuthorise(accessLevel = 'editor')
    def ajaxUpdate(String id) {

        // Project creation must be done via the admin import function
        if (!id) {
            render status: HttpStatus.SC_UNAUTHORIZED, text: 'You do not have permission to create a project'
            return
        }

        def postBody = request.JSON
        log.debug "Body: ${postBody}"
        log.debug "Params: ${params}"
        def values = [:]
        // filter params to remove keys in the ignore list
        List nonBindingProperties = buildIgnoreList()
        postBody.each { k, v ->
            if (!(k in nonBindingProperties)) {
                values[k] = v
            }
        }

        log.debug "json=" + (values as JSON).toString()
        log.debug "id=${id} class=${id?.getClass()}"
        def projectSite = values.remove("projectSite")
        def documents = values.remove('documents')
        def links = values.remove('links')
        def result = projectService.update(id, values, false)
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
            if (result.resp) {
                render result.resp as JSON
            } else {
                render statusCode:HttpStatus.SC_NOT_MODIFIED, resp:[message:'No modication made']
            }
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def serviceScores(String id) {
        render projectService.getServiceScoresForProject(id) as JSON
    }

    @PreAuthorise(accessLevel = 'siteAdmin')
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
        if (projectId) {
            if (projectService.isUserAdminForProject(adminUserId, projectId) || projectService.isUserCaseManagerForProject(adminUserId, projectId)
            || projectService.canUserViewProject(userService.getCurrentUserId(), projectId)) {
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
            def url = grailsApplication.config.getProperty('ecodata.baseUrl') + path
            webService.proxyGetRequest(response, url, true, true, 120000)
            null
        }
    }

    @PreAuthorise(accessLevel = 'readOnly', redirectController = 'home', redirectAction = 'index')
    def downloadShapefile(String id) {

        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "project/${id}.shp"
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

    @PreAuthorise(accessLevel = 'siteAdmin')
    def ajaxCancelReport(String id) {

        def reportDetails = request.JSON

        def result = projectService.cancelReport(id, reportDetails)

        render result as JSON

    }

    @PreAuthorise(accessLevel = 'siteAdmin')
    def ajaxUnCancelReport(String id) {

        def reportDetails = request.JSON

        def result = projectService.unCancelReport(id, reportDetails)

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


    @PreAuthorise(accessLevel = "admin")
    def lockMeriPlan(String id) {
        Map result = projectService.lockMeriPlanForEditing(id)
        if (result.error) {
            flash.message = "An error occurred while attempting to lock the MERI Plan: ${result.error}"
        }
        redirect action:'index', id:id
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

    @PreAuthorise(accessLevel = 'readOnly')
    def projectReport(String id, ProjectSummaryReportCommand projectSummaryReportCommand) {
        projectSummaryReportCommand()
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
        if (!id || !reportId || !projectService.doesReportBelongToProject(id, reportId)) {
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
                // Don't re-acquire the lock if we already have it, the editable check has already determined that
                // if a lock exists the current user holds it.
                if (!model.activity.lock) {
                    Map result = reportService.lockForEditing(model.report)
                }

                model.locked = true
            }
            model.saveReportUrl = createLink(action:'saveReport', id:id, params:[reportId:model.report.reportId])
            render model:model, view:'/activity/activityReport'
        }
    }

    /** Releases a lock if necessary and redirects to the project page */
    def exitReport(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected for exiting', id)
            return
        }
        reportService.unlock(reportId)
        redirect action: 'index', id:id
    }

    @PreAuthorise(accessLevel = 'readOnly')
    def viewReport(String id, String reportId) {
        if (!id || !reportId || !projectService.doesReportBelongToProject(id, reportId)) {
            error('An invalid report was selected for data entry', id)
            return
        }
        Map model = activityReportModel(id, reportId, ReportMode.VIEW)

        render view:'/activity/activityReportView', model:model
    }

    @PreAuthorise(accessLevel = 'readOnly')
    def printableReport(String id, String reportId) {
        if (!id || !reportId || !projectService.doesReportBelongToProject(id, reportId)) {
            error('An invalid report was selected for printing', id)
            return
        }
        Map model = activityReportModel(id, reportId, ReportMode.PRINT)

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
    def removeMeriPlanEditLock(String id) {
        lockService.unlock(id)
        redirect action:'index', id:id
    }

    @PreAuthorise(accessLevel = 'admin')
    def overrideMeriPlanLockAndEdit(String id) {
        String url = g.createLink(action:'index', id:id)
        projectService.overrideLock(id, url)
        redirect action:'index', id:id

    }
    @PreAuthorise(accessLevel = 'editor')
    def overrideLockAndEdit(String id, String reportId) {
        reportService.overrideLock(reportId, g.createLink(action:'viewReport', id:id, params:[reportId:reportId], absolute: true))
        chain(action:'editReport', id:id, params:[reportId:reportId])
    }

    @PreAuthorise(accessLevel = 'admin')
    def resetReport(String id, String reportId) {
        if (!id || !reportId || !projectService.doesReportBelongToProject(id, reportId)) {
            error('An invalid report was selected', id)
            return
        }
        Map result = reportService.reset(reportId)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'readOnly', redirectController = "home")
    def ajaxProjectSites(String id) {
        Map result = projectService.projectSites(id)

        render result as JSON
    }



    private Map activityReportModel(String projectId, String reportId, ReportMode mode, Integer formVersion = null) {

        Map project = projectService.get(projectId)
        List sites = project.remove('sites')
        Map config = projectService.getProgramConfiguration(project)
        Map model = reportService.activityReportModel(reportId, mode, formVersion)
        ReportLifecycleListener reportData = reportService.reportLifeCycleListener(model.activity.type)

        model.metaModel = projectService.filterOutputModel(model.metaModel, project, model.activity)

        model.outputModels.each { k, v ->
            if (v.scores) {
                Map outputConfig = model.metaModel.outputConfig.find {it.outputName == k}
                if (!outputConfig) {
                    log.warn("Missing outputConfig for "+k)
                }
                else {
                    outputConfig.outputContext = new JSONObject([scores:v.scores])
                    outputConfig.outputContext.putAll(reportData.getOutputData(project, outputConfig, model.report))
                }

            }
        }

        model.context = new HashMap(project)
        model.context.putAll(reportData.getContextData(project, model.report))
        model.returnTo = g.createLink(action:'exitReport', id:projectId, params:[reportId:reportId])
        model.contextViewUrl = g.createLink(action:'index', id:projectId)
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

    @PreAuthorise
    def scoresForReport(String id) {
        List scoreIds = params.getList('scoreIds')
        String reportId = params.get('reportId')

        Map result = projectService.scoresForReport(id, reportId, scoreIds)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def projectTargetsAndScores(String id) {
        boolean approvedDataOnly = params.getBoolean("approvedDataOnly", true)
        Map result = projectService.getServiceDashboardData(id, approvedDataOnly)
        // Transform the result to match that returned by the scoresByFinancialYear method
        List targets = []
        result?.services?.each { Map service ->

            service.scores.each { Score score ->
                targets << [
                        scoreId:score.scoreId,
                        service:service.name,
                        targetMeasure: score.label,
                        projectTarget: score.target,
                        result: score.result?.result ?: 0,
                        isOverDelivered: score.overDelivered
                ]
            }
        }
        boolean onlyNonZeroTargets = params.getBoolean("onlyNonZeroTargets", false)
        if (onlyNonZeroTargets) {
            targets = targets.findAll{hasTarget(it.projectTarget)}
        }
        Map response = [
                projectId: id,
                targets: targets
        ]
        render response as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def targetsAndScoresForActivity(String id, String activityId) {
        if (!id || !activityId || !projectService.doesActivityBelongToProject(id, activityId)) {
            error('An invalid activity was selected', id)
            return
        }
        Map resp = projectService.targetsAndScoresForActivity(activityId)
        render resp as JSON
    }

    private boolean hasTarget(value) {
        if (value instanceof String) {
            return value && value != "0"
        }
        value && value != 0
    }

    private boolean hasFinancialYearTarget(Map targetRow) {
        def financialYearTarget = targetRow.financialYearTarget
        hasTarget(financialYearTarget)
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

    @PreAuthorise(accessLevel = 'admin')
    def viewMeriPlanChanges(MeriPlanChangesReportCommand meriPlanChangesReportCommand) {
        Map model
        // Only grant/project managers can view historical MERI plans.
        if (meriPlanChangesReportCommand.documentId && !userService.userIsSiteAdmin()) {
            render status:HttpStatus.SC_UNAUTHORIZED
        }
        else {
            model = meriPlanChangesReportCommand.meriPlanChangesReportModel()
            if (!model.error) {
                render view:'/project/meriPlanChangesReport', model:model
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
        List investmentPriorities = projectService.listProjectInvestmentPriorities(id)
        investmentPriorities <<  "Other"
        render investmentPriorities as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def projectPrioritiesByOutcomeType(String id) {
        render projectService.projectPrioritiesByOutcomeType(id) as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def monitoringProtocolFormCategories() {
        String MONITORING_TAG = 'survey'
        List<Map> forms = activityService.monitoringProtocolForms()
        forms = forms.findAll{MONITORING_TAG in it.tags}
        List<String> categories = forms?.collect{
            [label:g.message(code:it.category, default:it.category.capitalize()), value:it.category]}?.unique()?.sort({it.label})
        render categories as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def outcomesByScores(String id) {
        List scoreIds = params.getList('scoreIds')
        if (!scoreIds) {
            respond HttpStatus.SC_BAD_REQUEST
        }

        List result = projectService.outcomesByScores(id, scoreIds)
        result = result?.collect {
            List outcomes = new ArrayList(it)  // JSONArray quotes strings when joined so we need to work with a normal List
            String label = new ArrayList(outcomes).join(',')
            [label:label, value:outcomes]
        }
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'admin')
    def requestVoucherBarcodeLabels(String id, Integer pageCount) {
        pageCount = pageCount ?: 1
        monitorService.requestVoucherBarcodeLabels(id, pageCount,  response)
        null
    }

    @PreAuthorise(accessLevel = 'editor')
    def getSpeciesRecordsFromActivity (String activityId) {
        if(!activityId) {
            render status: HttpStatus.SC_BAD_REQUEST, text: [message: 'Activity ID must be supplied'] as JSON
            return
        }

        render projectService.getSpeciesRecordsFromActivity(activityId) as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    /**
     * This method accepts an end date for a financial year and a list of scoreIds and
     * returns the requested aggregate data for the year.
     *
     * This was developed for the SAF Ag Annual report to pull tabular data into
     * the report so also flattens the nested Lists that result from the SET score type
     * into a single list.
     *
     */
    def annualReport(String id) {

        String financialYearEndDate = params.financialYearEndDate
        List scoreIds = params.getList('scoreIds')

        if (!financialYearEndDate || !scoreIds) {
            render status:400, error:'Required parameters not provided'
            return
        }

        DateTime financialYearStart = DateUtils.alignToFinancialYear(DateUtils.parse(financialYearEndDate))
        String year = financialYearStart.year + " - " + (financialYearStart.year+1)


        Map result = projectService.scoresByFinancialYear(id, scoreIds)

        List financialYearData = result?.resp?.find{it.group == year}?.results ?: []

        println financialYearData

        Map reportData = scoreIds.collectEntries { String scoreId ->
            Map scoreResult = financialYearData.find{it.scoreId == scoreId}
            def data = scoreResult?.result

            if (data?.result != null) {
                data = data.result
                if (data instanceof List) {
                    data = data.flatten() // Collate a List of tables from each report into a flat List for display
                }
            }
            else if (data?.groups != null) {
                data = data.groups
                data.each { Map group ->
                    group.result = group.results?[0]?.result
                }
            }

            [(scoreId): data]
        }

        render reportData as JSON
    }

    def spatialFeatures (String layerId) {
        webService.proxyGetRequest(response, grailsApplication.config.getProperty('ecodata.baseUrl') + "spatial/features?layerId=${layerId}", false, true, 120000)
        return null
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

package au.org.ala.merit

import au.org.ala.merit.command.ProjectSummaryReportCommand
import au.org.ala.merit.command.ReportCommand
import grails.converters.JSON
import org.joda.time.DateTime

class ProjectController {

    static defaultAction = "index"
    static ignore = ['action', 'controller', 'id']
    static String ESP_TEMPLATE = "esp"

    def projectService, metadataService, organisationService, commonService, activityService, userService, webService, roleService, grailsApplication
    def siteService, documentService, reportService, blogService


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
        def project = projectService.get(id, 'all')
        def user = userService.getUser()

        if (user) {
            user = user.properties
            user.isAdmin = projectService.isUserAdminForProject(user.userId, id) ?: false
            user.isCaseManager = projectService.isUserCaseManagerForProject(user.userId, id) ?: false
            user.isEditor = projectService.canUserEditProject(user.userId, id) ?: false
            user.hasViewAccess = projectService.canUserViewProject(user.userId, id) ?: false
        }

        String template = projectTemplate(project, user, params.template)

        if (!project || project.error) {
            flash.message = "Project not found with id: ${id}"
            if (project?.error) {
                flash.message += "<br/>${project.error}"
                log.warn project.error
            }
            redirect(controller: 'home', model: [error: flash.message])
        } else {
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

                def content = projectContent(project, user, template)

                def model = [project               : project,
                             activities            : project.activities,
                             mapFeatures           : commonService.getMapFeatures(project),
                             isProjectStarredByUser: userService.isProjectStarredByUser(user?.userId ?: "0", project.projectId)?.isProjectStarredByUser,
                             user                  : user,
                             roles                 : roles,
                             admins                : admins,
                             activityTypes         : projectService.activityTypesList(),
                             metrics               : projectService.summary(id),
                             outputTargetMetadata  : metadataService.getOutputTargetsByOutputByActivity(),
                             organisations         : organisationList(project),
                             programs              : programs,
                             today                 : DateUtils.format(new DateTime()),
                             themes                : metadataService.getThemesForProject(project),
                             projectContent        : content.model,
                             hasCustomTemplate     : projectService.getProgramConfiguration(project)?.projectTemplate
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

    protected Map projectContent(Map project, user, String template) {

        boolean meriView = template == 'meri'
        def meriPlanVisible = metadataService.isOptionalContent('MERI Plan', project.associatedProgram, project.associatedSubProgram)
        def risksAndThreatsVisible = metadataService.isOptionalContent('Risks and Threats', project.associatedProgram, project.associatedSubProgram)
        def canViewRisks = risksAndThreatsVisible && (user?.hasViewAccess || user?.isEditor)
        def meriPlanEnabled = user?.hasViewAccess || ((project.associatedProgram == 'National Landcare Programme' && project.associatedSubProgram == 'Regional Funding'))
        def meriPlanVisibleToUser = project.planStatus == 'approved' || user?.isAdmin || user?.isCaseManager

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
        boolean canChangeProjectDates = projectService.canChangeProjectDates(project)

        boolean adminTabVisible = user?.isEditor || user?.isAdmin || user?.isCaseManager

        def model = [overview       : [label: 'Overview', visible: !meriView, default: !meriView, type: 'tab', publicImages: imagesModel, displayTargets: false, displayOutcomes: false, blog: blog, hasNewsAndEvents: hasNewsAndEvents, hasProjectStories: hasProjectStories, canChangeProjectDates: canChangeProjectDates],
                     documents      : [label: 'Documents', visible: !meriView, type: 'tab', user:user, template:'docs'],
                     details        : [label: 'MERI Plan', default: meriView, disabled: !meriView && !meriPlanEnabled, visible: meriView || meriPlanVisible, meriPlanVisibleToUser: meriView || meriPlanVisibleToUser, risksAndThreatsVisible: canViewRisks, announcementsVisible: !meriView, project:project, type: 'tab', template:'viewMeriPlan'],
                     plan           : [label: 'Activities', visible: !meriView, disabled: !user?.hasViewAccess, type: 'tab', template:'projectActivities', grantManagerSettingsVisible:user?.isCaseManager, project:project, reports: project.reports, scores: scores, risksAndThreatsVisible: !meriView && user?.hasViewAccess && risksAndThreatsVisible],
                     site           : [label: 'Sites', visible: !meriView, disabled: !user?.hasViewAccess, editable:user?.isEditor, type: 'tab', template:'projectSites'],
                     dashboard      : [label: 'Dashboard', visible: !meriView, disabled: !user?.hasViewAccess, type: 'tab'],
                     admin          : [label: 'Admin', visible: !meriView && adminTabVisible, user:user, type: 'tab', template:'projectAdmin', project:project, canChangeProjectDates: canChangeProjectDates, showAnnouncementsTab: showAnnouncementsTab]]

        return [view: 'index', model: model]
    }

    private String projectTemplate(Map project, Map user, String template) {
        if (template) {
            return template
        }
        Map config = projectService.getProgramConfiguration(project)

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

    @PreAuthorise
    def edit(String id) {

        def project = projectService.get(id, 'all')
        // This will happen if we are returning from the organisation create page during an edit workflow.
        if (params.organisationId) {
            project.organisationId = params.organisationId
        }
        def user = userService.getUser()
        def groupedOrganisations = groupOrganisationsForUser(user.userId)

        if (project) {
            def siteInfo = siteService.getRaw(project.projectSiteId)
            [project          : project,
             siteDocuments    : siteInfo.documents ?: '[]',
             site             : siteInfo.site,
             userOrganisations: groupedOrganisations.user ?: [],
             organisations    : groupedOrganisations.other ?: [],
             programs         : metadataService.programsModel()]
        } else {
            forward(action: 'list', model: [error: 'no such id'])
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

        def result = projectService.submitStageReport(id, reportDetails)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxApproveReport(String id) {

        def reportDetails = request.JSON

        def result = projectService.approveStageReport(id, reportDetails)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxRejectReport(String id) {

        def reportDetails = request.JSON

        def result = projectService.rejectStageReport(id, reportDetails)

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
        def result = projectService.approvePlan(id)
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
    def updateProjectStartDate(String id) {
        def payload = request.getJSON()
        if (!payload.plannedStartDate) {
            render status: 400, text: "Missing parameter plannedStartDate"
            return
        }
        def result = projectService.changeProjectStartDate(id, payload.plannedStartDate)
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

        projectService.generateProjectStageReports(id)
        render status: 200, text: 'ok'
    }

    @PreAuthorise(accessLevel = 'admin')
    def projectReport(String id, ProjectSummaryReportCommand projectSummaryReportCommand) {
        projectSummaryReportCommand()
    }

    @PreAuthorise(accessLevel = 'admin')
    def projectReportPDF(String id) {

        String reportUrl = g.createLink(controller: 'report', action: 'projectReportCallback', id: id, absolute: true, params: [fromStage: params.fromStage, toStage: params.toStage, sections: params.sections])
        Map pdfGenParams = [docUrl: reportUrl, cacheable: false]
        if (params.orientation == 'landscape') {
            pdfGenParams.options = '-O landscape'
        }
        String url = grailsApplication.config.pdfgen.baseURL + 'api/pdf' + commonService.buildUrlParamsFromMap(pdfGenParams)
        Map result
        try {
            result = webService.proxyGetRequest(response, url, false, false, 10 * 60 * 1000)
        }
        catch (Exception e) {
            result = [error: e.message]
            log.error("Error generating PDF for project ${id}: ", e)
        }
        if (result.error) {
            render view: '/error', model: [error: "An error occurred generating the project report."]
        }

    }

    @PreAuthorise(accessLevel = 'admin')
    def meriPlanPDF(String id) {
        String reportUrl = g.createLink(controller: 'report', action: 'meriPlanReportCallback', id: id, absolute: true)
        String url = grailsApplication.config.pdfgen.baseURL + 'api/pdf' + commonService.buildUrlParamsFromMap(docUrl: reportUrl, cacheable: false)
        Map result
        try {
            result = webService.proxyGetRequest(response, url, false, false, 10 * 60 * 1000)
        }
        catch (Exception e) {
            log.error("Error generating the PDF of the MERI plan: ", e)
            result = [error: e.message]
        }
        if (result.error) {
            render view: '/error', model: [error: "An error occurred generating the MERI plan report."]
        }
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
}

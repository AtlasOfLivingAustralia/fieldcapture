package au.org.ala.merit

import au.org.ala.merit.command.EditOrganisationReportCommand
import au.org.ala.merit.command.PrintOrganisationReportCommand
import au.org.ala.merit.command.SaveReportDataCommand
import au.org.ala.merit.command.ViewOrganisationReportCommand
import au.org.ala.merit.util.ProjectGroupingHelper
import grails.converters.JSON
import org.apache.http.HttpStatus

/**
 * Extends the plugin OrganisationController to support Green Army project reporting.
 */
class OrganisationController {

    static allowedMethods = [
        ajaxDelete: "POST", delete:"POST", ajaxUpdate: "POST", prepopulateAbn:"GET",
        ajaxApproveReport: "POST", ajaxRejectReport: "POST", ajaxCancelReport: "POST",
        ajaxSubmitReport: "POST"
    ]

    def organisationService, searchService, documentService, userService, roleService, commonService, webService
    def activityService, metadataService, projectService, excelImportService, reportService, pdfConverterService, authService
    SettingService settingService
    ProjectGroupingHelper projectGroupingHelper

    def list() {}

    def index(String id) {
        Map organisation = organisationService.get(id, 'all')

        if (!organisation || organisation.error) {
            organisationNotFound(id, organisation)
        }
        else {
            def roles = roleService.getRoles()
            // Get dashboard information for the response.
            def dashboard = searchService.dashboardReport([fq: 'organisationFacet:' + organisation.name])
            def members = userService.getMembersOfOrganisation(id)
            def user = userService.getUser()
            def userId = user?.userId

            def orgRole = members.find{it.userId == userId}

            if (user) {
                user = user.properties
                user.isAdmin = orgRole?.role == RoleService.PROJECT_ADMIN_ROLE ?: false
                user.isCaseManager = orgRole?.role == RoleService.GRANT_MANAGER_ROLE ?: false
            }

            [organisation: organisation,
             dashboard: dashboard,
             roles:roles,
             user:user,
             isAdmin:orgRole?.role == RoleService.PROJECT_ADMIN_ROLE,
             isGrantManager:orgRole?.role == RoleService.GRANT_MANAGER_ROLE,
             content:content(organisation, orgRole)]
        }
    }

    private boolean canViewOrganisationTargets() {
        userService.userIsSiteAdmin() || userService.userHasReadOnlyAccess()
    }

    private boolean canEditOrganisationTargets() {
        userService.userIsSupportOfficerOrAdmin()
    }

    private boolean canViewAdminTab(Map userOrganisationRole) {
        userService.userIsSiteAdmin() || userOrganisationRole?.role == RoleService.PROJECT_ADMIN_ROLE || userService.userHasReadOnlyAccess()
    }

    private boolean hasEditorAccess(Map userOrganisationRole) {
        userOrganisationRole?.role == RoleService.PROJECT_EDITOR_ROLE
    }

    private boolean hasReadOnlyRole() {
        userService.userHasReadOnlyAccess()
    }


    protected Map content(Map organisation, Map userOrganisationRole) {

        def adminVisible = canViewAdminTab(userOrganisationRole)
        def hasEditorAccess =  adminVisible || hasEditorAccess(userOrganisationRole)
        def reportingVisible = hasEditorAccess || hasReadOnlyRole()

        def dashboardReports = [[name:'dashboard', label:'Activity Outputs']]

        Map availableReportCategories = null
        List services = null
        List targetPeriods = null
        List dashboardData = null
        if (adminVisible) {
            dashboardReports += [name:'announcements', label:'Announcements']
            availableReportCategories = settingService.getJson(SettingPageType.ORGANISATION_REPORT_CONFIG)
            services = organisationService.findApplicableServices(organisation, metadataService.getProjectServices())
            targetPeriods = organisationService.generateTargetPeriods(organisation)
            List scores = services.collect{it.scores}.flatten()
            dashboardData = organisationService.scoresForOrganisation(organisation, scores?.collect{it.scoreId}, !hasEditorAccess)
        }
        boolean hasTargets = services && targetPeriods
        boolean showTargets = hasTargets && canViewOrganisationTargets()
        boolean targetsEditable = canEditOrganisationTargets()

        // This call is used to ensure the organisation funding total is kept up to date as the algorithm
        // for selecting the current total is based on the current date.  The funding total is used when
        // calculating data for the dashboard.
        if (hasTargets) {
            organisationService.checkAndUpdateFundingTotal(organisation)
        }
        List reportOrder = null
        if (reportingVisible) {
            // TODO change me to use the configuration once it's been decided how that
            // is going to work.
            reportOrder = organisation.config?.organisationReports?.collect{[category:it.category, description:it.description, rejectionReasonCategoryOptions:it.rejectionReasonCategoryOptions?:[]]} ?: []
            reportOrder = reportOrder.unique({it.category})

            // We need at least one finished report to show data.
            if (organisation.reports?.find{it.progress == 'finished'}) {
                dashboardReports += [name: 'performanceAssessmentSummary', label: 'Performance Assessment Summary']
                dashboardReports += [name: 'performanceAssessmentComparison', label: 'Performance Assessment Comparison']

            }
        }

        boolean showEditAnnouncements = organisation.projects?.find{Status.isActive(it.status)}

        List adHocReportTypes =[ [type: ReportService.PERFORMANCE_MANAGEMENT_REPORT]]

        // This is a configuration option that controls how we group and display the projects on the
        // management unit page.
        List projects = organisation.projects ?: []
        List programGroups = organisation.config?.programGroups ?: []
        Map projectGroups = projectGroupingHelper.groupProjectsByProgram(projects, programGroups, ["organisationId:"+organisation.organisationId], true)

        [about     : [label: 'About', visible: true, stopBinding: false, type:'tab', default:!reportingVisible, displayedPrograms:projectGroups.displayedPrograms, servicesDashboard:[visible:true]],
         projects : [label: 'Reporting', template:"/shared/projectListByProgram", visible: reportingVisible, stopBinding:true, default:reportingVisible, type: 'tab', reports:organisation.reports, adHocReportTypes:adHocReportTypes, reportOrder:reportOrder, hideDueDate:true, displayedPrograms:projectGroups.displayedPrograms, reportsFirst:true, declarationType:SettingPageType.RDP_REPORT_DECLARATION],
         sites     : [label: 'Sites', visible: reportingVisible, type: 'tab', stopBinding:true, projectCount:organisation.projects?.size()?:0, showShapefileDownload:adminVisible],
         dashboard : [label: 'Dashboard', visible: reportingVisible, stopBinding:true, type: 'tab', template:'dashboard', reports:dashboardReports, dashboardData:dashboardData],
         admin     : [label: 'Admin', visible: adminVisible, type: 'tab', template:'admin', showEditAnnoucements:showEditAnnouncements, availableReportCategories:availableReportCategories, targetPeriods:targetPeriods, services: services, showTargets:showTargets, targetsEditable:targetsEditable]]

    }

    @PreAuthorise(accessLevel = 'siteAdmin')
    def create() {
        [organisation:[:], isNameEditable: true]
    }
    /**
     * this is for the create and edit organisation.  this method will go and get the abn number
     * and name using abn web service.
     * @render result as json format.
     */
    @PreAuthorise(accessLevel = 'admin')
    def prepopulateAbn() {
        Map result=[:]
        Map requestParameter = params
        String abnNumber = requestParameter.abn
        if (abnNumber == null){
            result.error = "invalid"
        }else{
             result = organisationService.getAbnDetails(abnNumber)
        }
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def edit(String id) {

        def organisation = organisationService.get(id, 'all')

        if (!organisation || organisation.error) {
            organisationNotFound(id, organisation)
        }
        else {
            if (organisationService.isUserAdminForOrganisation(id)) {
                organisation.remove('projects')
                organisation.remove('reports')
                [organisation: organisation,
                 isNameEditable   : userService.userIsAlaOrFcAdmin()]
            }
            else {
                flash.message = 'You do not have permission to perform that action'
                chain action: 'index', id:id
            }
        }
    }

    @PreAuthorise(accessLevel = 'siteAdmin')
    def ajaxDelete(String id) {

        def result = organisationService.update(id, [status: 'deleted'])
        respond result

    }

    @PreAuthorise(accessLevel = 'siteAdmin')
    def ajaxCreate() {
        Map organisationDetails = request.JSON
        createOrUpdateOrganisation(null, organisationDetails)
    }

    @PreAuthorise(accessLevel = 'admin')
    def ajaxUpdate(String id) {
        Map organisationDetails = request.JSON
        createOrUpdateOrganisation(id, organisationDetails)
    }

    private void createOrUpdateOrganisation(String organisationId, Map organisationDetails) {
        def originalOrganisation = organisationId ? organisationService.get(organisationId) : null
        def documents = organisationDetails.remove('documents')
        def links = organisationDetails.remove('links')
        def result = organisationService.update(organisationId, organisationDetails)

        organisationId = organisationId?:result.resp?.organisationId
        if (documents && !result.error) {
            documents.each { doc ->
                doc.organisationId = organisationId
                documentService.saveStagedImageDocument(doc)
            }
        }
        if (links && !result.error) {
            links.each { link ->
                link.organisationId = organisationId
                documentService.saveLink(link)
            }
        }

        List existingLinks = links?.findResults { it.documentId }
        List toDeleteLinks = originalOrganisation?.links?.findAll { !existingLinks?.contains(it.documentId) }
        // delete any links that were removed.
        if (toDeleteLinks && !result.error) {
            toDeleteLinks.each { link ->
                if (link.documentId) {
                    documentService.delete(link.documentId)
                }
            }
        }

        if (result.error) {
            render result as JSON
        } else {
            render result.resp as JSON
        }
    }

    /**
     * Responds with a download of a zipped shapefile containing all sites used by projects run
     * by an organisation.
     * @param id the organisationId of the organisation.
     */
    @PreAuthorise(accessLevel = 'admin')
    def downloadShapefile(String id) {

        def userId = userService.getCurrentUserId()

        if (id && userId) {
            if (organisationService.isUserAdminForOrganisation(id) || organisationService.isUserGrantManagerForOrganisation(id)) {
                def organisation = organisationService.get(id)
                def params = [fq: 'organisationFacet:' + organisation.name, query :"docType:project"]

                def path = "search/downloadShapefile"
                def url = grailsApplication.config.getProperty('ecodata.baseUrl') + path + commonService.buildUrlParamsFromMap(params)
                def resp = webService.proxyGetRequest(response, url, true, true,960000)
                if (resp.status != 200) {
                    render view:'/error', model:[error:resp.error]
                }
            }
            else {
                render status: 403, text: 'Permission denied'
            }
        }
        else {
            render status: 400, text: 'Missing parameter organisationId'
        }
    }

    @PreAuthorise(accessLevel = 'admin', projectIdParam = 'entityId')
    def addUserAsRoleToOrganisation() {
        String userId = params.userId
        String organisationId = params.entityId
        String role = params.role

        if (userId && organisationId && role) {
            Map result = organisationService.addUserAsRoleToOrganisation(userId, organisationId, role)
            if (result.error) {
                render status:400, text: result.error
            }
            else {
                render result as JSON
            }
        } else {
            render status:400, text: 'Required params not provided: userId, role, projectId'
        }
    }

    @PreAuthorise(accessLevel = 'admin', projectIdParam = 'entityId')
    def removeUserWithRoleFromOrganisation() {
        String userId = params.userId
        String role = params.role
        String organisationId = params.entityId
        def adminUser = userService.getUser()

        if (adminUser && organisationId && role && userId) {
            if (organisationService.isUserAdminForOrganisation(organisationId)) {
                render organisationService.removeUserWithRoleFromOrganisation(userId, organisationId, role) as JSON
            } else {
                render status:403, text: 'Permission denied'
            }
        } else {
            render status:400, text: 'Required params not provided: userId, organisationId, role'
        }
    }

    /**
     * Redirects to the home page with an error message in flash scope.
     * @param response the response that triggered this method call.
     */
    private void organisationNotFound(id, response) {
        flash.message = "No organisation found with id: ${id}"
        if (response?.error) {
            flash.message += "<br/>${response.error}"
        }
        redirect(controller: 'home', model: [error: flash.message])
    }

    def search(Integer offset, Integer max, String searchTerm, String sort) {

        render organisationService.search(offset, max, searchTerm, sort) as JSON
    }

    /**
     * Presents a page which allows the user to edit the events/announcements for all of the projects managed by
     * this organisation at once.
     */
    @PreAuthorise(accessLevel = 'admin')
    def editAnnouncements(String id) {

        def organisation = id ? organisationService.get(id, 'flat') : null

        if (!organisation || organisation.error) {
            render status:404, text:'Organisation with id "'+id+'" does not exist.'
            return
        }

        if (!userService.userIsAlaOrFcAdmin() && !organisationService.isUserAdminForOrganisation(id)) {
            flash.message = 'Only organisation administrators can perform this action.'
            redirect action:'index', id:id
            return
        }

        def announcements = findOrganisationAnnouncements(organisation)
        def projectList = announcements.collect {[projectId: it.projectId, name: it.name, grantId: it.grantId]}.unique()

        [events: announcements,
         organisation: organisation,
         projectList: projectList
        ]
    }

    private List findOrganisationAnnouncements(organisation) {
        List projects = organisation.projects
        if (!projects) {
            def queryParams = [max: 1500, fq: ['organisationFacet:' + organisation.name]]
            queryParams.query = "docType:project"
            def results = searchService.allProjects(queryParams, queryParams.query)
            projects = results?.hits?.hits?.collect { it._source }
        }

        def announcements = []
        projects.each { project ->
            if (Status.isActive(project.status)) {
                if (project.custom?.details?.events) {
                    project.custom.details.events.each { event ->
                        announcements << [projectId: project.projectId, grantId: project.grantId, name: project.name, planStatus: project.planStatus, eventDate: event.scheduledDate, eventName: event.name, eventType: event.type, eventDescription: event.description, grantAnnouncementDate: event.grantAnnouncementDate, funding: event.funding]
                    }
                } else {
                    // Add a blank row to make it easier to add announcements for that project. (so the user
                    // doesn't have to select the project name which could be from a long list).
                    announcements << [projectId: project.projectId, grantId: project.grantId, name: project.name, planStatus: project.planStatus, eventDate: '', eventName: '', eventDescription: '', eventType: '', funding: '', grantAnnouncementDate:'']
                }
            }
        }
        announcements
    }

    /**
     * Bulk saves the edits to project events/announcements.
     */
    @PreAuthorise(accessLevel = 'admin')
    def saveAnnouncements(String id) {

        def organisation = id ? organisationService.get(id, 'flat') : null

        if (!organisation || organisation.error) {
            def resp = [status:404, text:'Organisation with id "'+id+'" does not exist.']
            respond([status: resp.status], (resp as JSON))
            return
        }

        if (!userService.userIsAlaOrFcAdmin() && !organisationService.isUserAdminForOrganisation(id)) {
            def resp = [status:403, message:'You are not authorized to perform that operation.']
            respond(status: resp.status,(resp as JSON))
            return
        }

        def announcementsByProject = request.JSON
        announcementsByProject.each { project ->
            def projectAnnouncements = project.announcements.collect {[scheduledDate:it.eventDate, name:it.eventName, type:it.eventType, description: it.eventDescription, grantAnnouncementDate:it.grantAnnouncementDate, funding:it.funding]}
            def projectDetails = projectService.get(project.projectId)
            def meriPlan = projectDetails.custom ?: [:]
            if (!meriPlan.details) {
                meriPlan.details = [:]
            }
            meriPlan.details.events = projectAnnouncements
            projectService.update(project.projectId, [custom:meriPlan])
        }
        Object resp = [status:200, message:'success']
        respond(resp)
    }

    @PreAuthorise(accessLevel = 'admin')
    def downloadAnnouncementsTemplate(String id) {

        def organisation = id ? organisationService.get(id, 'flat') : null

        if (!organisation || organisation.error) {
            render status:404, text:'Organisation with id "'+id+'" does not exist.'
            return
        }

        def announcements = findOrganisationAnnouncements(organisation)

        new AnnouncementsMapper(excelImportService).announcementsToExcel(response, announcements)
    }

    @PreAuthorise(accessLevel = 'admin')
    def bulkUploadAnnouncements(String id) {
        if (request.respondsTo('getFile')) {
            def file = request.getFile('announcementsTemplate')
            if (file) {
                def announcements = new AnnouncementsMapper(excelImportService).excelToAnnouncements(file.inputStream)

                respond announcements
                return
            }
        }
        respond status:400, text: 'Missing file'
    }

    @PreAuthorise(accessLevel = 'admin')
    def report(String id) {

        def organisation = organisationService.get(id, 'all')
        if (!organisation) {
            flash.errorMessage = "Organisation with id ${id} does not exist"
            redirect action:'list'
            return
        }

        def activityType = params.type

        if (!activityType) {
            flash.errorMessage = 'No such report'
            redirect action:'index', id:id
            return
        }

        if (!organisationService.isUserAdminForOrganisation(id)) {
            flash.errorMessage = 'You do not have permission to view this page'
            redirect action:'index', id:id
            return
        }

        def activityModel = metadataService.getActivityModel(activityType)
        if (!activityModel || !activityModel.outputs) {
            flash.errorMessage = 'No such report'
            redirect action:'index', id:id
            return
        }
        def outputModels = activityModel.outputs.collect {
            [name:it, annotatedModel:metadataService.annotatedOutputDataModel(activityType, it, null), dataModel:metadataService.getDataModelFromOutputName(it)]
        }

        def criteria = [type:activityType, projectId:organisation.projects.collect{it.projectId}, dateProperty:'plannedEndDate', startDate:params.plannedStartDate, endDate:params.plannedEndDate]

        def activityResp = activityService.search(criteria)
        def activities = activityResp?.resp.activities

        if (!activities) {
            flash.errorMessage = 'No such report'
            redirect action:'index', id:id
            return
        }

        // augment each activity with project name so we can display it.
        activities.each { activity ->
            def project = organisation.projects.find{it.projectId == activity.projectId}
            activity.projectName = project?.name
            activity.grantId = project?.grantId
            activity.externalId = project?.externalId
        }
        activities?.sort{a,b -> (a.plannedEndDate <=> b.plannedEndDate) ?: (a.grantId <=> b.grantId) ?: (a.externalId <=> b.externalId) ?: (a.activityId <=> b.activityId)}

        render view: '/activity/bulkEdit', model:[organisation:organisation, type:activityType,
                       title:activityService.defaultDescription([type:activityType, plannedStartDate:params.plannedStartDate, plannedEndDate:params.plannedEndDate]),
                       activities:activities,
                       outputModels:outputModels]
    }

    @PreAuthorise(accessLevel = 'admin')
    def getAdHocReportTypes(String id) {

        def supportedTypes = organisationService.getSupportedAdHocReports(id)
        render supportedTypes as JSON

    }

    @PreAuthorise(accessLevel = 'readOnly')
    def viewOrganisationReport(ViewOrganisationReportCommand cmd) {
        if (cmd.hasErrors()) {
            error(cmd.errors.toString(), cmd.id)
            return
        }

        if (cmd.report.type == ReportService.PERFORMANCE_MANAGEMENT_REPORT) {
            viewOrEditOrganisationReport(cmd.model, false)
        }
        else {
            render model:cmd.model, view:'/activity/activityReportView'
        }
    }

    @PreAuthorise(accessLevel = 'readOnly')
    def printOrganisationReport(PrintOrganisationReportCommand cmd) {
        if (cmd.hasErrors()) {
            error(cmd.errors.toString(), cmd.id)
            return
        }

        if (cmd.report.type == ReportService.PERFORMANCE_MANAGEMENT_REPORT) {
            viewOrEditOrganisationReport(cmd.model, false)
        }
        else {
            render model:cmd.model, view:'/activity/activityReportView'
        }
    }

    @PreAuthorise(accessLevel = 'editor', redirectController = 'organisation')
    def editOrganisationReport(EditOrganisationReportCommand cmd) {
        if (cmd.hasErrors()) {
            error(cmd.errors.toString(), cmd.id)
            return
        }

        if (cmd.report.type ==  ReportService.PERFORMANCE_MANAGEMENT_REPORT) {
            viewOrEditOrganisationReport(cmd.model, true)
        }
        else {
            cmd.processEdit(this)
        }
    }

    @PreAuthorise(accessLevel = 'editor')
    def saveReport(SaveReportDataCommand saveReportDataCommand) {
        Map result
        if (saveReportDataCommand.report?.organisationId != params.id) {
            result = [status:HttpStatus.SC_UNAUTHORIZED, error:"You do not have permission to save this report: check if the report belongs to this management unit: " + params?.id ]
        }
        else {
            result = saveReportDataCommand.save()
        }

        render result as JSON

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

    private def viewOrEditOrganisationReport(Map cmdModel, Boolean edit) {
        int version = cmdModel.report.toDate < "2017-01-01T00:00:00Z" ? 1 : 2
        Map organisation = organisationService.get(cmdModel.report.organisationId)
        if (organisationService.isUserAdminForOrganisation(cmdModel.report.organisationId)) {
            Map model = reportService.performanceReportModel(cmdModel.report.reportId, version)
            model.state = organisation.state ?: 'Unknown'
            model.organisation = organisation
            if (reportService.excludesNotApproved(model.report)) {
                model.submittingUserName = authService.getUserForUserId(model.report.submittedBy)?.displayName ?: 'Unknown user'
                model.submissionDate = DateUtils.displayFormatWithTime(model.report.dateSubmitted)
                edit = false
            }

            model.printView = (cmdModel.printView) ? cmdModel.printView : false
            String view = edit ? '/report/performanceReport' : '/report/performanceReportView'

            render view: view, model:model
        }
        else {
            flash.message = "You don't have permission to edit the report"
            chain(action:'index', id: report.organisationId)
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def createAdHocReport(String id) {

        Map report = request.getJSON()
        report.organisationId = id
        if (!report.name) {
            report.name = '2016 perf report'
        }

        def response = reportService.create(report)
        if (response.resp.error) {
            flash.message = "Error creating report: ${response.resp.error}"
        }

        chain(action:'index', id: report.organisationId)

    }

    @PreAuthorise(accessLevel = 'admin')
    def ajaxSubmitReport(String id) {

        def reportDetails = request.JSON

        def result = organisationService.submitReport(id, reportDetails.reportId)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxApproveReport(String id) {

        if (!organisationService.isUserGrantManagerForOrganisation(id)) {
            render status:401, message:'No permission to approve report'
            return
        }
        def reportDetails = request.JSON

        def result = organisationService.approveReport(id, reportDetails.reportId, reportDetails.reason)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxRejectReport(String id) {

        if (!organisationService.isUserGrantManagerForOrganisation(id)) {
            render status:401, message:'No permission to reject report'
            return
        }
        def reportDetails = request.JSON

        def result = organisationService.rejectReport(id, reportDetails.reportId, reportDetails.reason, reportDetails.categories)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'siteAdmin')
    def ajaxCancelReport(String id) {

        def reportDetails = request.JSON

        def result = organisationService.cancelReport(id, reportDetails.reportId, reportDetails.reason)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'siteAdmin')
    def ajaxUnCancelReport(String id) {

        def reportDetails = request.JSON

        def result = organisationService.unCancelReport(id, reportDetails)

        render result as JSON

    }

    @PreAuthorise(accessLevel = 'caseManager')
    def regenerateOrganisationReports(String id) {
        Map resp
        if (!id) {
            resp = [status: HttpStatus.SC_NOT_FOUND]
        }
        else {
            Map categoriesToRegenerate = request.JSON
            organisationService.regenerateReports(id, categoriesToRegenerate?.organisationReportCategories)
            resp = [status:HttpStatus.SC_OK]
        }
        render resp as JSON
    }

    private def error(String message, String organisationId) {
        flash.message = message
        if (organisationId) {
            redirect(action: 'index', id: organisationId)
        }
        else {
            redirect(controller:'home', action:'publicHome')
        }

    }

    @PreAuthorise
    def scoresForOrgReport(String id) {
        List scoreIds = params.getList('scoreIds')
        String reportId = params.get('reportId')

        Map result = organisationService.scoresForOrganisationReport(id, reportId, scoreIds)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'admin')
    def generateTargetPeriods(String id) {
        List<Map> result = organisationService.generateTargetPeriods(id)
        render result as JSON
    }
}

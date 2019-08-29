package au.org.ala.merit

import au.org.ala.merit.command.SaveReportDataCommand
import grails.converters.JSON
import org.apache.http.HttpStatus
import static ReportService.ReportMode

/**
 * Processes requests relating to MUs
 */
class ManagementUnitController {

    static allowedMethods = [regenerateManagementUnitReports: "POST", ajaxDelete: "POST", delete: "POST", ajaxUpdate: "POST", saveReport: "POST"]

    def managementUnitService, programService, searchService, documentService, userService, roleService, commonService, webService, siteService

    ProjectService projectService
    ReportService reportService
    ActivityService activityService
    PdfGenerationService pdfGenerationService
    BlogService blogService

    def index(String id) {
        def mu = managementUnitService.get(id)

        if (!mu || mu.error) {
            managementUnitNotFound(id, mu)
        } else {
            def roles = roleService.getRoles()

            List members = userService.getMembersOfManagementUnit(id).members ?: []
            def user = userService.getUser()
            def userId = user?.userId

            Map muRole = members.find { it.userId == userId }

            def mapFeatures = mu.managementUnitSiteId?siteService.getSiteGeoJson(mu.managementUnitSiteId) : null
            if (mapFeatures)
                mu.mapFeatures = mapFeatures

            [managementUnit     : mu,
             roles              : roles,
             user               : user,
             isAdmin            : muRole?.role == RoleService.PROJECT_ADMIN_ROLE,
             isGrantManager     : muRole?.role == RoleService.GRANT_MANAGER_ROLE,
             content            : content(mu, muRole)
             ]
        }
    }

    protected Map content(Map mu, Map userRole) {

        def hasAdminAccess = userService.userIsSiteAdmin() || userRole?.role == RoleService.PROJECT_ADMIN_ROLE
        boolean hasEditAccessOfBlog = userService.canEditManagementUnitBlog(userService.getUser()?.userId, mu.managementUnitId)

        boolean canViewReports = hasAdminAccess || userService.userHasReadOnlyAccess() || userRole?.role == RoleService.PROJECT_EDITOR_ROLE

        Map result = managementUnitService.getProjects(mu.managementUnitId)
        List projects = result?.projects

        List blogs = blogService.getBlog(mu)
        def hasNewsAndEvents = blogs.find { it.type == 'News and Events' }
        def hasManagementUnitStories = blogs.find { it.type == 'Management Unit Stories' }
        def hasPhotos = blogs.find { it.type == 'Photo' }


        List reportOrder = mu.config?.managementUnitReports?.collect{[category:it.category, description:it.description]} ?: []

        // If the program is not visible, there is no point showing the dashboard or sites as both of these rely on
        // data in the search index to produce.

        boolean managementUnitVisible = mu.config?.visibility != 'private'

        List servicesWithScores = null
        if (managementUnitVisible) {
            servicesWithScores = managementUnitService.serviceScores(mu.managementUnitId, !hasAdminAccess)
        }

        //Aggregate all targeted outcomes of projects
        for(Map project in projects){
            //Verify project.outcomes (from program config) with primaryOutcome and secondaryOutcomes in project.custom.details.outcomes
            Map primaryOutcome = project.custom?.details?.outcomes?.primaryOutcome
            if (primaryOutcome){
                Map oc =  mu.outcomes.find {oc -> oc.outcome == primaryOutcome.description}
                if (oc) {
                    oc['targeted'] = true //set program outcomes
                    primaryOutcome.shortDescription = oc['shortDescription']
                }
            }
        }

        [about   : [label: 'Management Unit Overview',visible: true, stopBinding: false, type: 'tab',
                    mu: mu,
                    blog: [blogs: blogs?:[], editable: hasEditAccessOfBlog,
                                  hasNewsAndEvents: hasNewsAndEvents,
                                  hasManagementUnitStories:  hasManagementUnitStories,
                                  hasPhotos: hasPhotos
                    ],
                    servicesDashboard:[visible: managementUnitVisible, planning:false, services:servicesWithScores]],
         projects: [label: 'MU Reporting', visible: canViewReports, stopBinding: false, type:'tab', projects:projects, reports:mu.reports?:[], reportOrder:reportOrder, hideDueDate:true],
         admin   : [label: 'MU Admin', visible: hasAdminAccess, type: 'tab', mu:mu, blog: [editable: hasEditAccessOfBlog]]
        ]

    }

    @PreAuthorise(accessLevel='siteAdmin')
    def create() {
        [managementUnit: [:], isNameEditable:true]
    }

    @PreAuthorise(accessLevel='admin')
    def edit(String id) {
        Map mu = managementUnitService.get(id)

        if (!mu || mu.error) {
            managementUnitNotFound(id, mu)
        } else {
            [mu: mu, isNameEditable:userService.userIsAlaOrFcAdmin()]
        }
    }

    @PreAuthorise(accessLevel='siteAdmin')
    def delete(String id) {
        if (userService.isUserAdminForProgram(id)) {
            programService.update(id, [status: 'deleted'])
        } else {
            flash.message = 'You do not have permission to perform that action'
        }
        redirect action: 'list'
    }

    @PreAuthorise(accessLevel='siteAdmin')
    def ajaxDelete(String id) {

        if (userService.isUserAdminForProgram(id)) {
            def result = programService.update(id, [status: 'deleted'])

            respond result
        } else {
            render status: 403, text: 'You do not have permission to perform that action'
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def ajaxUpdate(String id) {
        def muDetails = request.JSON

        def documents = muDetails.remove('documents')
        def links = muDetails.remove('links')

        String muId = id ?: ''
        Map result = managementUnitService.update(muId, muDetails)

        muId = muId ?: result.resp?.muId
        if (documents && !result.error) {
            documents.each { doc ->
                doc.managementUnitId = muId
                documentService.saveStagedImageDocument(doc)
            }
        }
        if (links && !result.error) {
            links.each { link ->
                link.managementUnitId = muId
                documentService.saveLink(link)
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
    @PreAuthorise(accessLevel='admin')
    def downloadShapefile(String id) {

        def userId = userService.getCurrentUserId()

        if (id && userId) {

            def params = [fq: 'programId:' + id, query: "docType:project"]

            def url = grailsApplication.config.ecodata.service.url + '/search/downloadShapefile' + commonService.buildUrlParamsFromMap(params)
            def resp = webService.proxyGetRequest(response, url, true, true, 960000)
            if (resp.status != 200) {
                render view: '/error', model: [error: resp.error]
            }

        } else {
            render status: 400, text: 'Missing parameter organisationId'
        }
    }



    /**
     * Redirects to the home page with an error message in flash scope.
     * @param response the response that triggered this method call.
     */
    private void managementUnitNotFound(id, response) {
        flash.message = "No management unit found with id: ${id}"
        if (response?.error) {
            flash.message += "<br/>${response.error}"
        }
        redirect(controller: 'home', model: [error: flash.message])
    }

    private def error(String message, String programId) {
        flash.message = message
        if (programId) {
            redirect(action: 'index', id: programId)
        }
        else {
            redirect(controller:'home', action:'publicHome')
        }

    }

    def search(Integer offset, Integer max, String searchTerm, String sort) {
        render programService.search(offset, max, searchTerm, sort) as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def createReport(String id) {

        Map report = request.getJSON()
        report.programId = id

        def response = reportService.create(report)
        if (response.resp.error) {
            flash.message = "Error creating report: ${response.resp.error}"
        }

        chain(action:'index', id: id)

    }

    @PreAuthorise(accessLevel = 'editor')
    def editReport(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected for data entry', id)
            return
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
            model.saveReportUrl = createLink(controller:'managementUnit', action:'saveReport', id:id, params:[reportId:reportId])
            render model:model, view:'/activity/activityReport'
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

    @PreAuthorise(accessLevel = 'editor')
    def overrideLockAndEdit(String id, String reportId) {
        reportService.overrideLock(reportId, g.createLink(action:'viewReport', id:id, params:[reportId:reportId], absolute: true))
        chain(action:'editReport', id:id, params:[reportId:reportId])
    }

    private Map activityReportModel(String managementUnitId, String reportId, ReportMode mode, Integer formVersion = null) {
        Map mu = managementUnitService.get(managementUnitId)
        Map config = mu.config
        Map model = reportService.activityReportModel(reportId, mode, formVersion)

        model.context = mu
        model.returnTo = createLink(action:'index', id:managementUnitId)
        model.contextViewUrl = model.returnTo
        model.reportHeaderTemplate = '/managementUnit/managementUnitReportHeader'
        model.config = config
        model
    }

    @PreAuthorise(accessLevel = 'editor')
    def viewReport(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected for viewing', id)
            return
        }

        Map model = activityReportModel(id, reportId, ReportMode.VIEW)

        render model:model, view:'/activity/activityReportView'
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
    def saveReport(SaveReportDataCommand saveReportDataCommand) {
        Map result
        if (saveReportDataCommand.report?.managementUnitId != params.id) {
            result = [status:HttpStatus.SC_UNAUTHORIZED, error:"You do not have permission to save this report: check if the report belongs to this management unit: " + params?.id ]
        }
        else {
            result = saveReportDataCommand.save()
        }

        render result as JSON

    }

    @PreAuthorise(accessLevel = 'admin')
    def ajaxSubmitReport(String id) {

        def reportDetails = request.JSON

        def result = programService.submitReport(id, reportDetails.reportId)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxApproveReport(String id) {

        def reportDetails = request.JSON

        def result = programService.approveReport(id, reportDetails.reportId, reportDetails.reason)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxRejectReport(String id) {

        def reportDetails = request.JSON

        def result = programService.rejectReport(id, reportDetails.reportId, reportDetails.reason, reportDetails.category)

        render result as JSON
    }


    @PreAuthorise(accessLevel = 'caseManager')
    def regenerateManagementUnitReports(String id) {
        Map resp
        if (!id) {
             resp = [status:HttpStatus.SC_NOT_FOUND]
        }
        else {
            Map categoriesToRegenerate = request.JSON
            managementUnitService.regenerateReports(id, categoriesToRegenerate?.managementUnitReportCategories, categoriesToRegenerate?.projectReportCategories)
            resp = [status:HttpStatus.SC_OK]
        }
        render resp as JSON
    }

    @PreAuthorise(accessLevel = 'admin', projectIdParam = 'entityId')
    def addUserAsRoleToManagementUnit() {
        String userId = params.userId
        String managementUnitId = params.entityId
        String role = params.role

        if (userId && managementUnitId && role) {
            if (role == 'caseManager' && !userService.userIsSiteAdmin()) {
                render status: 403, text: 'Permission denied - Case/Grant Manager role required'
            } else {
                render managementUnitService.addUserAsRoleToManagementUnit(userId, managementUnitId, role) as JSON
            }
        } else {
            render status: 400, text: 'Required params not provided: userId, role, managementUnitId'
        }
    }

    @PreAuthorise(accessLevel = 'admin', projectIdParam = 'entityId')
    def removeUserWithRoleFromManagementUnit() {
        String userId = params.userId
        String role = params.role
        String managementUnitId = params.entityId


        if (managementUnitId && role && userId) {
            if (role == RoleService.GRANT_MANAGER_ROLE && !userService.userIsSiteAdmin()) {
                render status: 403, text: 'Permission denied - Case/Grant Manager role required'
            }
            else {
                render managementUnitService.removeUserWithRoleFromManagementUnit(userId, managementUnitId, role) as JSON
            }
        } else {
            render status: 400, text: 'Required params not provided: userId, organisationId, role'
        }
    }


}

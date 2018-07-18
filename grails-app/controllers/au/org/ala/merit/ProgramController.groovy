package au.org.ala.merit


import grails.converters.JSON
import org.apache.http.HttpStatus
import static ReportService.ReportMode

/**
 * Processes requests relating to programs
 */
class ProgramController {

    static allowedMethods = [ajaxDelete: "POST", delete: "POST", ajaxUpdate: "POST"]

    def programService, searchService, documentService, userService, roleService, commonService, webService, siteService
    ProjectService projectService
    ReportService reportService
    ActivityService activityService
    PdfGenerationService pdfGenerationService

    @PreAuthorise(accessLevel='editor', redirectController='home')
    def index(String id) {
        def program = programService.get(id)

        if (!program || program.error) {
            programNotFound(id, program)
        } else {
            def roles = roleService.getRoles()

            List members = userService.getMembersOfProgram(id).members ?: []
            def user = userService.getUser()
            def userId = user?.userId

            Map programRole = members.find { it.userId == userId }

            [program  : program,
             roles         : roles,
             user          : user,
             isAdmin       : programRole?.role == RoleService.PROJECT_ADMIN_ROLE,
             isGrantManager: programRole?.role == RoleService.GRANT_MANAGER_ROLE,
             content       : content(program, programRole)]
        }
    }

    protected Map content(Map program, Map userRole) {

        def hasAdminAccess = userService.userIsSiteAdmin() || userRole?.role == RoleService.PROJECT_ADMIN_ROLE
        Map result = programService.getProgramProjects(program.programId)
        List projects = result?.projects

        List reportOrder = program.config?.programReports?.collect{it.category} ?: []

        // If the program is not visible, there is no point showing the dashboard or sites as both of these rely on
        // data in the search index to produce.
        boolean programVisible = program.inheritedConfig?.visibility != 'private'
        List servicesWithScores = null
        if (programVisible) {
            servicesWithScores = programService.serviceScores(program.programId, !hasAdminAccess)
        }

        [about   : [label: 'Management Unit Overview', visible: true, stopBinding: false, type: 'tab', servicesDashboard:[visible: programVisible, planning:false, services:servicesWithScores]],
         projects: [label: 'Reporting', visible: true, stopBinding: false, type:'tab', projects:projects, reports:program.reports?:[], reportOrder:reportOrder, hideDueDate:true],
         sites   : [label: 'Sites', visible: programVisible, stopBinding: true, type:'tab'],
         admin   : [label: 'Admin', visible: hasAdminAccess, type: 'tab']]
    }

    @PreAuthorise(accessLevel='siteAdmin')
    def create() {
        [program: [:], isNameEditable:true]
    }

    @PreAuthorise(accessLevel='admin')
    def edit(String id) {
        Map program = programService.get(id)

        if (!program || program.error) {
            programNotFound(id, program)
        } else {
            [program: program, isNameEditable:userService.userIsAlaOrFcAdmin()]
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
        def programDetails = request.JSON

        def documents = programDetails.remove('documents')
        def links = programDetails.remove('links')

        String programId = id ?: ''
        Map result = programService.update(programId, programDetails)

        programId = programId ?: result.resp?.programId
        if (documents && !result.error) {
            documents.each { doc ->
                doc.programId = programId
                documentService.saveStagedImageDocument(doc)
            }
        }
        if (links && !result.error) {
            links.each { link ->
                link.programId = programId
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
    private void programNotFound(id, response) {
        flash.message = "No program found with id: ${id}"
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

        Map model = activityReportModel(id, reportId, ReportMode.EDIT)
        if (reportService.isSubmittedOrApproved(model.report)) {
            redirect action:'viewReport', id:id, params:[reportId:reportId]
        }
        else {
            model.saveReportUrl = createLink(controller:'program', action:'saveReport', id:id, params:[reportId:reportId])
            render model:model, view:'/activity/activityReport'
        }
    }

    private Map activityReportModel(String programId, String reportId, ReportMode mode) {
        Map program = programService.get(programId)
        Map config = program.config
        Map model = reportService.activityReportModel(reportId, mode, config)

        model.context = program
        model.returnTo = createLink(action:'index', id:programId)
        model.contextViewUrl = model.returnTo
        model.reportHeaderTemplate = '/program/rlpProgramReportHeader'

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
    def saveReport(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected for editing', id)
            return
        }

        Map report = reportService.get(reportId)
        if (reportService.isSubmittedOrApproved(report)) {
            response.status = HttpStatus.SC_UNAUTHORIZED
            Map resp = [message:'Submitted or approved reports cannot be modified']
            render resp as JSON
        }
        else {
            Map activityData = request.JSON
            Map result = activityService.update(report.activityId, activityData)

            // TODO handle photopoints, but will have to be adjusted for multi-site
            Map photoPoints = activityData.remove('photoPoints')

            render result as JSON
        }

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
    def regenerateProgramReports(String id) {
        Map resp
        if (!id) {
             resp = [status:HttpStatus.SC_NOT_FOUND]
        }
        else {
            programService.regenerateReports(id)
            resp = [status:HttpStatus.SC_OK]
        }
        render resp as JSON
    }

    @PreAuthorise(accessLevel = 'admin')
    def addUserAsRoleToProgram() {
        String userId = params.userId
        String programId = params.entityId
        String role = params.role

        if (userId && programId && role) {
            if (role == 'caseManager' && !userService.userIsSiteAdmin()) {
                render status: 403, text: 'Permission denied - Case/Grant Manager role required'
            } else {
                render programService.addUserAsRoleToProgram(userId, programId, role) as JSON
            }
        } else {
            render status: 400, text: 'Required params not provided: userId, role, projectId'
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def removeUserWithRoleFromProgram() {
        String userId = params.userId
        String role = params.role
        String programId = params.entityId


        if (programId && role && userId) {
            if (role == RoleService.GRANT_MANAGER_ROLE && !userService.userIsSiteAdmin()) {
                render status: 403, text: 'Permission denied - Case/Grant Manager role required'
            }
            else {
                render programService.removeUserWithRoleFromProgram(userId, programId, role) as JSON
            }
        } else {
            render status: 400, text: 'Required params not provided: userId, organisationId, role'
        }
    }


}

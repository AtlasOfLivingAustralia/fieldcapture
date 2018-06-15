package au.org.ala.merit


import grails.converters.JSON
import org.apache.http.HttpStatus

/**
 * Processes requests relating to programs
 */
@PreAuthorise(accessLevel='admin')
class ProgramController {

    static allowedMethods = [ajaxDelete: "POST", delete: "POST", ajaxUpdate: "POST"]

    def programService, searchService, documentService, userService, roleService, commonService, webService, siteService
    ProjectService projectService
    ReportService reportService
    ActivityService activityService
    ProjectConfigurationService projectConfigurationService

    // Simply forwards to the list view
    def list() {}

    @PreAuthorise(accessLevel='siteAdmin')
    def index(String id) {
        def program = programService.get(id)

        if (!program || program.error) {
            programNotFound(id, program)
        } else {
            def roles = roleService.getRoles()
            // Get dashboard information for the response.

            Map members = userService.getMembersOfProgram(id).members ?: [:]
            def user = userService.getUser()
            def userId = user?.userId

            String orgRole = members.find { it.userId == userId }

            [program  : program,
             roles         : roles,
             user          : user,
             isAdmin       : orgRole?.role == RoleService.PROJECT_ADMIN_ROLE,
             isGrantManager: orgRole?.role == RoleService.GRANT_MANAGER_ROLE,
             content       : content(program)]
        }
    }

    protected Map content(Map program) {

        def user = userService.getUser()
        def members =[] //programService.getMembersOfOrganisation(program.programId)
        def role = members.find { it.userId == user?.userId } ?: [:]
        def hasAdminAccess = userService.userIsAlaOrFcAdmin() || role.role == RoleService.PROJECT_ADMIN_ROLE

        List servicesWithScores = programService.serviceScores(program.programId, !hasAdminAccess)
        def hasViewAccess = hasAdminAccess || userService.userHasReadOnlyAccess() || role.role == RoleService.PROJECT_EDITOR_ROLE

        Map result = projectService.search(programId:program.programId)
        List projects = result.resp?.projects

        List reportOrder = program.config?.programReports?.collect{it.category} ?: []

        [about   : [label: 'Management Unit', visible: true, stopBinding: false, type: 'tab'],
         dashboard: [label: 'Dashboard', visible: true, stopBinding: true, type: 'tab', servicesDashboard:[planning:false, services:servicesWithScores], template:'/project/serviceDashboard'],
         projects: [label: 'Reporting', visible: true, stopBinding: false, type:'tab', projects:projects, reports:program.reports?:[], reportOrder:reportOrder, hideDueDate:true],
         sites   : [label: 'Sites', visible: true, stopBinding: true, type:'tab'],
         admin   : [label: 'Admin', visible: hasAdminAccess, type: 'tab']]
    }

    def create() {
        [program: [:], isNameEditable:true]
    }

    def edit(String id) {
        Map program = programService.get(id)


        if (!program || program.error) {
            programNotFound(id, program)
        } else {
            [program: program, isNameEditable:true]
        }
    }

    def delete(String id) {
        if (userService.isUserAdminForProgram(id)) {
            programService.update(id, [status: 'deleted'])
        } else {
            flash.message = 'You do not have permission to perform that action'
        }
        redirect action: 'list'
    }

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
    def downloadShapefile(String id) {

        def userId = userService.getCurrentUserId()

        if (id && userId) {
            if (programService.isUserAdminForOrganisation(id) || programService.isUserGrantManagerForOrganisation(id)) {
                def organisation = programService.get(id)
                def params = [fq: 'organisationFacet:' + organisation.name, query: "docType:project"]

                def url = grailsApplication.config.ecodata.service.url + '/search/downloadShapefile' + commonService.buildUrlParamsFromMap(params)
                def resp = webService.proxyGetRequest(response, url, true, true, 960000)
                if (resp.status != 200) {
                    render view: '/error', model: [error: resp.error]
                }
            } else {
                render status: 403, text: 'Permission denied'
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

        Map report = reportService.get(reportId)

        Map activity = activityService.get(report.activityId)
        Map model = activityService.getActivityMetadata(activity.type)

        Map program = programService.get(id)
        model.context = program
        model.themes = []
        model.activity = activity
        model.returnTo = createLink(action:'index', id:id)
        model.contextViewUrl = model.returnTo

        Map programConfig = program.config

        // Temporary until we add this to the program config.
        programConfig.requiresActivityLocking = programConfig.requiresActivityLocking
        programConfig.navigationMode = programConfig.navigationMode ?: 'stayOnPage'

        model.locked = activity.lock != null
        if (!activity.lock && programConfig.requiresActivityLocking) {
            Map result = activityService.lock(activity)
            model.locked = true
        }

        model.saveReportUrl = createLink(controller:'program', action:'saveReport', id:id, params:[reportId:report.reportId])

        render model:model, view:'/activity/activityReport'
    }

    @PreAuthorise(accessLevel = 'editor')
    def viewReport(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected for viewing', id)
            return
        }

        Map report = reportService.get(reportId)

        Map activity = activityService.get(report.activityId)
        Map model = activityService.getActivityMetadata(activity.type)

        Map program = programService.get(id)
        model.context = program
        model.themes = []
        model.activity = activity
        model.returnTo = createLink(action:'index', id:id)
        model.contextViewUrl = model.returnTo

        Map programConfig = program.config

        // Temporary until we add this to the program config.
        programConfig.requiresActivityLocking = programConfig.requiresActivityLocking
        programConfig.navigationMode = programConfig.navigationMode ?: 'stayOnPage'

        render model:model, view:'/activity/index'
    }

    @PreAuthorise(accessLevel = 'editor')
    def saveReport(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected for data entry', id)
            return
        }

        Map report = reportService.get(reportId)
        if (reportService.isSubmittedOrApproved(report)) {
            return 'error'
        }

        Map activityData = request.JSON
        Map result = activityService.update(report.activityId, activityData)

        // TODO handle photopoints, but will have to be adjusted for multi-site
        Map photoPoints = activityData.remove('photoPoints')

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


}

package au.org.ala.merit

import au.org.ala.merit.command.PrintProgramReportCommand
import au.org.ala.merit.command.SaveReportDataCommand
import grails.converters.JSON
import org.apache.http.HttpStatus
import static ReportService.ReportMode

/**
 * Processes requests relating to programs
 */
class ProgramController {

    static allowedMethods = [regenerateProgramReports: "POST", listOfAllPrograms:'GET' ,ajaxDelete: "POST", delete: "POST", ajaxUpdate: "POST"]

    def programService, documentService, userService, roleService, commonService, webService, siteService
    ReportService reportService
    ActivityService activityService
    BlogService blogService
    ManagementUnitService managementUnitService

    def index(String id) {
        Map program = [:]
        if (id) {
            program = programService.get(id)
        }

        if (!program || program.error || !userService.userIsSiteAdmin()) {
            programNotFound(id, program)
        } else {
            def roles = roleService.getRoles()

            List members = userService.getMembersOfProgram(id).members ?: []
            def user = userService.getUser()
            def userId = user?.userId

            Map programRole = members.find { it.userId == userId }

            if (user) {
                user = user.properties
                user.isAdmin = programRole?.role == RoleService.PROJECT_ADMIN_ROLE ?: false
                user.isCaseManager = programRole?.role == RoleService.GRANT_MANAGER_ROLE ?: false
            }

            def mapFeatures = program.programSiteId?siteService.getSiteGeoJson(program.programSiteId) : null
            if (mapFeatures)
                program.mapFeatures = mapFeatures

            [program       : program,
             roles         : roles,
             user          : user,
             isAdmin       : programRole?.role == RoleService.PROJECT_ADMIN_ROLE,
             isGrantManager: programRole?.role == RoleService.GRANT_MANAGER_ROLE,
             content       : content(program, programRole)
             ]
        }
    }

    protected Map content(Map program, Map userRole) {
        boolean hasAdminAccess = userService.userIsSiteAdmin() || userRole?.role == RoleService.PROJECT_ADMIN_ROLE
        boolean hasEditAccessOfBlog = userService.canEditProgramBlog(userService.getUser()?.userId, program.programId)

        boolean canViewNonPublicTabs = userService.canUserViewNonPublicProgramInformation(userService.getUser()?.userId, program.programId)
        Map result = programService.getProgramProjects(program.programId)
        List projects = result?.projects
        println projects?.collect{it.projectId}
        println projects?.collect{it.grantId}
        println projects?.collect{it.name}


        List blogs = blogService.getBlog(program)
        def hasNewsAndEvents = blogs.find { it.type == 'News and Events' }
        def hasProgramStories = blogs.find { it.type == 'Program Stories' }
        def hasPhotos = blogs.find { it.type == 'Photo' }

        List reportOrder = program.config?.programReports?.collect{[category:it.category, description:it.description, rejectionReasonCategoryOptions:it.rejectionReasonCategoryOptions?:[]]} ?: []

        // If the program is not visible, there is no point showing the dashboard or sites as both of these rely on
        // data in the search index to produce.
        boolean programVisible = program.inheritedConfig?.visibility != 'private'
        List servicesWithScores = null
        if (programVisible) {
            servicesWithScores = programService.serviceScores(program.programId, !hasAdminAccess)
        }

        // Find the management units that contain projects for this program.
        String[] muIds = projects.collect{it.managementUnitId}.unique()
        if (muIds) {
            List managementUnits = managementUnitService.get(muIds)
            program.managementUnits = managementUnits
        }

        //Aggregate all targeted outcomes of projects
        for(Map project in projects){
            //Verify project.outcomes (from program config) with primaryOutcome and secondaryOutcomes in project.custom.details.outcomes
            Map primaryOutcome = project.custom?.details?.outcomes?.primaryOutcome
            if (primaryOutcome){
                Map oc =  program.outcomes.find {oc -> oc.outcome == primaryOutcome.description}
                if (oc) {
                    oc['targeted'] = true //set program outcomes
                    primaryOutcome.shortDescription = oc['shortDescription']
                }
            }
        }
        [about   : [label: 'Overview',visible: true, stopBinding: false, type: 'tab',
                    program: program,
                    blog: [blogs: blogs?:[], editable: hasEditAccessOfBlog,
                           hasNewsAndEvents: hasNewsAndEvents,
                           hasProgramStories:  hasProgramStories,
                           hasPhotos: hasPhotos
                          ],
                    servicesDashboard:[visible: programVisible, planning:false, services:servicesWithScores]],
         projects: [label: 'Reporting', visible: canViewNonPublicTabs, stopBinding: false, type:'tab', projects:projects, reports:program.reports?:[], reportOrder:reportOrder, hideDueDate:true],
         sites   : [label: 'Sites', visible: canViewNonPublicTabs, stopBinding: true, type:'tab'],
         admin   : [label: 'Admin', visible: hasAdminAccess, type: 'tab',
                    blog: [
                      editable: hasEditAccessOfBlog
                      ]
                   ]]
    }


    @PreAuthorise(accessLevel='siteAdmin')
    def create() {
        [program: [:], isNameEditable: true]
    }

    @PreAuthorise(accessLevel='admin')
    def addSubProgram(String id){
        if (id !=null) {
            Map program = programService.get(id)
            if (!program || program.error) {
                programNotFound(id, program)
            } else {
                [program: [parentProgramId      : program.programId,
                           parentProgramName  : program.name]]
            }
        }
    }

    @PreAuthorise(accessLevel='admin')
    def edit(String id) {
        Map program = programService.get(id)

        List<Map> listOfPrograms = programService.listOfAllPrograms().findAll({it.programId != id})

        if (!program || program.error) {
            programNotFound(id, program)
        } else {
            [program: program, editProgramId: program.programId, allProgram: listOfPrograms, isNameEditable:userService.userIsAlaOrFcAdmin()]
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

        Map result
        String programId = id ?: ''
        result = programService.update(programId, programDetails)
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

            def url = grailsApplication.config.getProperty('ecodata.service.url') + '/search/downloadShapefile' + commonService.buildUrlParamsFromMap(params)
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

        Map model = activityReportModel(id, reportId, ReportMode.EDIT, params.getInt('formVersion', null))

        if (!model.editable) {
            redirect action:'viewReport', id:id, params:[reportId:reportId, attemptedEdit:true]
        }
        else {
            if (model.config.requiresActivityLocking) {
                Map result = reportService.lockForEditing(model.report)
                model.locked = true
            }
            model.saveReportUrl = createLink(controller:'program', action:'saveReport', id:id, params:[reportId:reportId])
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

    private Map activityReportModel(String programId, String reportId, ReportMode mode, Integer formVersion = null) {
        Map program = programService.get(programId)
        Map config = program.inheritedConfig
        Map model = reportService.activityReportModel(reportId, mode, formVersion)

        model.context = program
        model.returnTo = createLink(action:'index', id:programId)
        model.contextViewUrl = model.returnTo
        model.reportHeaderTemplate = '/program/rlpProgramReportHeader'
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

    @PreAuthorise(accessLevel = 'readOnly')
    def printProgramReport(PrintProgramReportCommand cmd) {
        if (cmd.hasErrors()) {
            error(cmd.errors.toString(), cmd.id)
            return
        }

        render model:cmd.model, view:'/activity/activityReportView'

    }

    @PreAuthorise(accessLevel = 'editor')
    def saveReport(SaveReportDataCommand saveReportDataCommand) {
        Map result
        if (saveReportDataCommand.report?.programId != params.id) {
            result = [status:HttpStatus.SC_UNAUTHORIZED, error:"You do not have permission to save this report"]
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

        def result = programService.rejectReport(id, reportDetails.reportId, reportDetails.reason, reportDetails.categories)

        render result as JSON
    }


    @PreAuthorise(accessLevel = 'caseManager')
    def regenerateProgramReports(String id) {
        Map resp
        if (!id) {
             resp = [status:HttpStatus.SC_NOT_FOUND]
        }
        else {
            Map categoriesToRegenerate = request.JSON
            programService.regenerateReports(id, categoriesToRegenerate?.programReportCategories, categoriesToRegenerate?.projectReportCategories)
            resp = [status:HttpStatus.SC_OK]
        }
        render resp as JSON
    }

    @PreAuthorise(accessLevel = 'admin', projectIdParam = 'entityId')
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

    @PreAuthorise(accessLevel = 'admin', projectIdParam = 'entityId')
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

    @PreAuthorise(accessLevel = 'alaAdmin')
    def reindexProjects(String id) {
        Map resp  = programService.reindexProjects(id)
        render resp as JSON
    }


}

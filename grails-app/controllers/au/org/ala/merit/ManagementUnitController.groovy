package au.org.ala.merit

import au.org.ala.merit.command.SaveReportDataCommand
import grails.converters.JSON
import grails.core.GrailsApplication
import grails.plugin.cache.Cacheable
import grails.web.mapping.LinkGenerator
import org.apache.http.HttpStatus

import java.text.DateFormat
import java.text.ParseException
import java.text.SimpleDateFormat

import static ReportService.ReportMode

/**
 * Processes requests relating to MUs
 */
class ManagementUnitController {

    static allowedMethods = [regenerateManagementUnitReports: "POST", ajaxDelete: "POST", delete: "POST", ajaxUpdate: "POST", saveReport: "POST", ajaxSubmitReport: "POST", ajaxApproveReport: "POST", ajaxRejectReport: "POST"]

    def managementUnitService, programService, documentService, userService, roleService, commonService, webService, siteService

    ReportService reportService
    ActivityService activityService
    PdfGenerationService pdfGenerationService
    ProjectService projectService

    GrailsApplication grailsApplication
    LinkGenerator grailsLinkGenerator

    def index(String id) {
        Map mu = [:]
        if (id) {
            mu = managementUnitService.get(id)
        }

        if (!mu || mu.error) {
            managementUnitNotFound(id, mu)
        } else {
            def roles = roleService.getRoles()

            List members = userService.getMembersOfManagementUnit(id).members ?: []
            def user = userService.getUser()
            def userId = user?.userId

            Map muRole = members.find { it.userId == userId }

            Boolean isManagementUnitStarredByUser = false
            if (user && mu) {
                isManagementUnitStarredByUser = userService.isManagementUnitStarredByUser(user?.userId, mu?.managementUnitId)?.isManagementUnitStarredByUser
            }


            def mapFeatures = mu.managementUnitSiteId?siteService.getSiteGeoJson(mu.managementUnitSiteId) : null
            if (mapFeatures)
                mu.mapFeatures = mapFeatures

            [managementUnit     : mu,
             roles              : roles,
             user               : user,
             isAdmin            : muRole?.role == RoleService.PROJECT_ADMIN_ROLE,
             isGrantManager     : muRole?.role == RoleService.GRANT_MANAGER_ROLE,
             content            : content(mu, muRole),
             isManagementUnitStarredByUser: isManagementUnitStarredByUser
             ]
        }
    }

    protected Map content(Map mu, Map userRole) {

        def hasAdminAccess = userService.userIsSiteAdmin() || userRole?.role == RoleService.PROJECT_ADMIN_ROLE || userService.userHasReadOnlyAccess()

        boolean canViewNonPublicTabs = userService.canUserEditManagementUnit(userService.getUser()?.userId, mu.managementUnitId) || userService.userHasReadOnlyAccess()

        Map result = managementUnitService.getProjects(mu.managementUnitId)
        List projects = result?.projects ?: []

        // This is a configuration option that controls how we group and display the projects on the
        // management unit page.
        List programGroups = mu.config?.programGroups ?: []

        // Fetch related programs
        if (projects) {
            // We may be aggregating on a parent program that doesn't directly have any projects (for example
            // all of the projects are under a sub-program)
            String[] programIds = (projects.collect{it.programId} + programGroups).unique()
            List programs = programService.get(programIds)
            // This reverse alphabetical order is to satisfy a request to always
            // display the RLP first.
            mu.programs = programs?.sort{it.name}?.reverse()
            mu.projects = projects
        }

        LinkedHashMap programsByCategory = groupPrograms(mu.programs, programGroups)
        // Now group the projects according to the program configuration.
        Map projectsByCategory = groupProjects(mu.projects, programsByCategory)

        // If the program is not visible, there is no point showing the dashboard or sites as both of these rely on
        // data in the search index to produce.
        boolean managementUnitVisible = mu.config?.visibility != 'private'

        Map servicesWithScores = [:]
        if (managementUnitVisible) {
            // Produce aggregate dashboards for each of the configured program groups
            servicesWithScores = managementUnitService.serviceScores(mu.managementUnitId, programsByCategory, !hasAdminAccess)
        }

        List displayedPrograms = []
        // Aggregate the outcomes addressed by all projects in each program group
        projectsByCategory.each { String programId, List projectsInProgramGroup ->
            Map program = mu.programs.find{it.programId == programId}

            List primaryOutcomes = findTargetedPrimaryOutcomes(program, projectsInProgramGroup)
            List secondaryOutcomes = findTargetedSecondaryOutcomes(program, projectsInProgramGroup)
            displayedPrograms << [program:program, projects: projectsInProgramGroup, servicesWithScores:servicesWithScores[programId], primaryOutcomes:primaryOutcomes, secondaryOutcomes:secondaryOutcomes]
        }

        List reportOrder = mu.config?.managementUnitReports?.collect{[category:it.category, description:it.description, rejectionReasonCategoryOptions:it.rejectionReasonCategoryOptions?:[]]} ?: []

        [about   : [label: 'Management Unit Overview',visible: true, stopBinding: false, type: 'tab',
                    mu: mu,
                    servicesDashboard:[visible: managementUnitVisible],
                    displayedPrograms:displayedPrograms
                    ],
         projects: [label: 'MU Reporting', visible: canViewNonPublicTabs, stopBinding: false, type:'tab', mu:mu, reports: mu.reports, reportOrder:reportOrder, hideDueDate:true, displayedPrograms:displayedPrograms],
         sites   : [label: 'MU Sites', visible: canViewNonPublicTabs, stopBinding: true, type:'tab'],
         admin   : [label: 'MU Admin', visible: hasAdminAccess, type: 'tab', mu:mu]
        ]

    }

    /**
     * This method will group programs based on whether they or a parent program falls into
     * one of the configured program groups.
     * Programs that don't fall into a group will result in the creation of a new group.
     */
    private LinkedHashMap<String, List> groupPrograms(List programs, List programGroups) {
        Map programsByCategory = new LinkedHashMap().withDefault{[]} // LinkedHashMap is to preserve the order specified by programGroups
        // Group programs according to their hierarchy under the configured groups.
        programs?.each { Map program ->
            boolean categorized = false
            programGroups.each { String programId ->
                if (programService.isInProgramHierarchy(program, programId)) {
                    programsByCategory[programId] << program
                    categorized = true
                }
            }
            // This project doesn't fall into a group specified by the config so create a new group for it.
            if (!categorized) {
                programsByCategory[program.programId] << program
            }
        }
        programsByCategory
    }

    private Map<String, List> groupProjects(List projects, Map programsByCategory) {

        Map projectsByCategory = [:].withDefault{[]}
        projects.each { Map project ->
            Map.Entry categoryGroup = programsByCategory.find{ String k, List v ->
                v && v.find{project.programId == it.programId}
            }
            projectsByCategory[categoryGroup.key] << project
        }
        projectsByCategory
    }


    /**
     * Returns a list of program primary outcomes, with an extra entry (targeted) specifying whether any project
     * has targeted that outcome as the primary outcome of the project.
     * @param program the program.
     * @param projects all projects run under the program in the management unit
     */
    private List findTargetedPrimaryOutcomes(Map program, List projects) {
        List outcomes = programService.getPrimaryOutcomes(program).collect{[outcome:it.outcome, shortDescription:it.shortDescription]}
        for(Map project in projects){
            String outcome = projectService.getPrimaryOutcome(project)
            if (outcome){
                Map oc =  outcomes.find {it.outcome == outcome}
                if (oc) {
                    oc['targeted'] = true // at least one project is targeting this outcome as the primary outcome.
                }
            }
        }
        outcomes
    }

    /**
     * Returns a list of program primary outcomes, with an extra entry (targeted) specifying whether any project
     * has targeted that outcome as the primary outcome of the project.
     * @param program the program.
     * @param projects all projects run under the program in the management unit
     */
    private List findTargetedSecondaryOutcomes(Map program, List projects) {
        List outcomes = programService.getSecondaryOutcomes(program).collect{[outcome:it.outcome, shortDescription:it.shortDescription]}
        for(Map project in projects){
            List projectOutcomes = projectService.getSecondaryOutcomes(project)
            outcomes.findAll { it.outcome in projectOutcomes }.each {
                it['targeted'] = true
            }
        }
        outcomes
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

    @PreAuthorise(accessLevel = 'editor', redirectController = 'managementUnit')
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

    @PreAuthorise(accessLevel = 'readOnly', redirectController = 'managementUnit')
    def viewReport(String id, String reportId) {
        if (!id || !reportId) {
            error('An invalid report was selected for viewing', id)
            return
        }

        Map model = activityReportModel(id, reportId, ReportMode.VIEW)

        render model:model, view:'/activity/activityReportView'
    }

    @PreAuthorise(accessLevel = 'readOnly', redirectController = 'managementUnit')
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

        def result = managementUnitService.submitReport(id, reportDetails.reportId)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxApproveReport(String id) {

        def reportDetails = request.JSON

        def result = managementUnitService.approveReport(id, reportDetails.reportId, reportDetails.reason)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxRejectReport(String id) {

        def reportDetails = request.JSON

        def result = managementUnitService.rejectReport(id, reportDetails.reportId, reportDetails.reason, reportDetails.categories)

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

    def managementUnitFeatures() {
        Map featureCollection = managementUnitService.managementUnitFeatures()
        render featureCollection as JSON
    }

    @PreAuthorise(accessLevel='siteReadOnly')
    def generateReportsInPeriod(){

        String startDate = params.fromDate
        String endDate = params.toDate

        try{

            def user = userService.getUser()
            def extras =[:]
            extras.summaryFlag = params.summaryFlag

            String email = user.userName
            extras.put("systemEmail", grailsApplication.config.getProperty('fieldcapture.system.email.address'))
            extras.put("senderEmail", grailsApplication.config.getProperty('fieldcapture.system.email.address'))
            extras.put("email", email)

            String reportDownloadBaseUrl= grailsLinkGenerator.link(controller:'download',action:'get', absolute: true)
            extras.put("reportDownloadBaseUrl", reportDownloadBaseUrl)

            def resp = managementUnitService.generateReports(startDate, endDate,extras)
            render resp as JSON

        }catch (ParseException e){
            def message = [message: 'Error: You need to provide startDate and endDate in the format of yyyy-MM-dd ']
            response.setContentType("application/json")
            render message as JSON
        }catch(Exception e){
            def message = [message: 'Fatal: '+ e.message]
            render message as JSON
        }
    }

    /**
     * Star or unstar a management unit for a user
     * Action is determined by the URI endpoint, either: /add | /remove
     *
     * @return
     */
    def starManagementUnit() {
        String act = params.id?.toLowerCase()
        String userId = userService.getCurrentUserId()
        String managementUnitId = params.managementUnitId

        if (act && userId && managementUnitId) {
            if (act == "add") {
                render userService.addStarManagementUnitForUser(userId, managementUnitId) as JSON
            } else if (act == "remove") {
                render userService.removeStarManagementUnitForUser(userId, managementUnitId) as JSON
            } else {
                render status: 400, text: 'Required endpoint (path) must be one of: add | remove'
            }
        } else {
            render status: 400, text: 'Required params not provided: userId, managementUnitId'
        }
    }

    /**
     * Pre-pops some report field values based from the previous report contents
     * @param managementUnitId
     * @return
     */
    def previousReportContents(String managementUnitId) {
        Map model = reportService.getPreviousReportModel(params)
        Map response = [
                managementUnitId: managementUnitId,
                model: model
        ]
        render response as JSON
    }
}

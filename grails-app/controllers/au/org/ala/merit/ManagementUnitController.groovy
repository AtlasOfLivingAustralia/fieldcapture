package au.org.ala.merit

import au.org.ala.merit.command.EditManagementUnitReportCommand
import au.org.ala.merit.command.PrintManagementUnitReportCommand
import au.org.ala.merit.command.SaveReportDataCommand
import au.org.ala.merit.command.ViewManagementUnitReportCommand
import au.org.ala.merit.util.ProjectGroupingHelper
import grails.converters.JSON
import grails.core.GrailsApplication
import grails.web.mapping.LinkGenerator
import org.apache.http.HttpStatus
import java.text.ParseException

/**
 * Processes requests relating to MUs
 */
class ManagementUnitController {

    static allowedMethods = [regenerateManagementUnitReports: "POST", ajaxDelete: "POST", delete: "POST", ajaxUpdate: "POST", saveReport: "POST", ajaxSubmitReport: "POST", ajaxApproveReport: "POST", ajaxRejectReport: "POST"]

    def managementUnitService, programService, documentService, userService, roleService, commonService, webService, siteService

    ReportService reportService
    ActivityService activityService
    ProjectService projectService
    ProjectGroupingHelper projectGroupingHelper

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
            def user = userService.getUser()
            def userId = user?.userId
            if (user) {
                user = user.properties
                user.isAdmin = userService.isUserAdminForManagementUnit(userId, id)
                user.isGrantManager = userService.isUserGrantManagerForManagementUnit(userId, id)
                user.isEditor = userService.isUserEditorForManagementUnit(userId, id)
                user.hasViewAccess = userService.userHasReadOnlyAccess(userId)
            }

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
             isAdmin            : user?.isAdmin,
             isGrantManager     : user?.isGrantManager,
             content            : content(mu, user),
             isManagementUnitStarredByUser: isManagementUnitStarredByUser
             ]
        }
    }

    protected Map content(Map mu, Map user) {

        def hasAdminOrSiteReadOnlyAccess = user?.isAdmin || userService.userIsSiteAdmin() || user?.hasViewAccess

        // Same as above except also includes the editor role for the management unit
        boolean canViewNonPublicTabs = hasAdminOrSiteReadOnlyAccess || user?.isEditor

        Map result = managementUnitService.getProjects(mu.managementUnitId)
        List projects = result?.projects ?: []

        // This is a configuration option that controls how we group and display the projects on the
        // management unit page.
        List programGroups = mu.config?.programGroups ?: []

        // If the program is not visible, there is no point showing the dashboard or sites as both of these rely on
        // data in the search index to produce.
        boolean managementUnitVisible = mu.config?.visibility != 'private'

        Map projectGroups = projectGroupingHelper.groupProjectsByProgram(projects, programGroups, ["managementUnitId:"+mu.managementUnitId], hasAdminOrSiteReadOnlyAccess)
        mu.programs = projectGroups.programs
        mu.projects = projects
        List displayedPrograms = projectGroups.displayedPrograms

        List reportOrder = mu.config?.managementUnitReports?.collect{[category:it.category, description:it.description, rejectionReasonCategoryOptions:it.rejectionReasonCategoryOptions?:[]]} ?: []

        [about   : [label: 'Management Unit Overview',visible: true, stopBinding: false, type: 'tab',
                    mu: mu,
                    servicesDashboard:[visible: managementUnitVisible],
                    displayedPrograms:displayedPrograms
                    ],
         projects: [label: 'MU Reporting', template:"/shared/projectListByProgram", visible: canViewNonPublicTabs, stopBinding: false, type:'tab', mu:mu, reports: mu.reports, reportOrder:reportOrder, hideDueDate:true, displayedPrograms:displayedPrograms],
         sites   : [label: 'MU Sites', visible: canViewNonPublicTabs, stopBinding: true, type:'tab'],
         admin   : [label: 'MU Admin', visible: hasAdminOrSiteReadOnlyAccess, type: 'tab', mu:mu]
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
    def editReport(EditManagementUnitReportCommand cmd) {
        if (cmd.hasErrors()) {
            error(cmd.errors.toString(), cmd.id)
            return
        }
        cmd.processEdit(this)
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

    @PreAuthorise(accessLevel = 'readOnly', redirectController = 'managementUnit')
    def viewReport(ViewManagementUnitReportCommand cmd) {
        if (cmd.hasErrors()) {
            error(cmd.errors.toString(), cmd.id)
            return
        }

        render model:cmd.model, view:'/activity/activityReportView'
    }

    @PreAuthorise(accessLevel = 'readOnly')
    def printManagementUnitReport(PrintManagementUnitReportCommand cmd) {
        if (cmd.hasErrors()) {
            error(cmd.errors.toString(), cmd.id)
            return
        }

        render model:cmd.model, view:'/activity/activityReportView'

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

package au.org.ala.merit

import au.org.ala.merit.DateUtils
import grails.converters.JSON
import groovy.json.JsonSlurper
import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.apache.poi.ss.util.CellReference
import org.grails.plugins.csv.CSVMapReader
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.joda.time.Duration
import org.joda.time.Interval
import org.joda.time.Period
import org.joda.time.Weeks
import org.joda.time.format.DateTimeFormat
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.multipart.MultipartHttpServletRequest
import pl.touk.excel.export.WebXlsxExporter
import pl.touk.excel.export.XlsxExporter

import java.text.SimpleDateFormat

/**
 * Extends the plugin OrganisationController to support Green Army project reporting.
 */
class OrganisationController {

    static allowedMethods = [ajaxDelete: "POST", delete:"POST", ajaxUpdate: "POST", prepopulateAbn:"GET"]

    def organisationService, searchService, documentService, userService, roleService, commonService, webService
    def activityService, metadataService, projectService, excelImportService, reportService, pdfConverterService, authService
    AbnLookupService abnLookupService

    def list() {}

    def index(String id) {
        def organisation = organisationService.get(id, 'all')

        if (!organisation || organisation.error) {
            organisationNotFound(id, organisation)
        }
        else {
            def roles = roleService.getRoles()
            // Get dashboard information for the response.
            def dashboard = searchService.dashboardReport([fq: 'organisationFacet:' + organisation.name])
            def members = organisationService.getMembersOfOrganisation(id)
            def user = userService.getUser()
            def userId = user?.userId

            def orgRole = members.find{it.userId == userId}

            [organisation: organisation,
             dashboard: dashboard,
             roles:roles,
             user:user,
             isAdmin:orgRole?.role == RoleService.PROJECT_ADMIN_ROLE,
             isGrantManager:orgRole?.role == RoleService.GRANT_MANAGER_ROLE,
             content:content(organisation)]
        }
    }



    protected Map content(organisation) {

        def user = userService.getUser()
        def members = organisationService.getMembersOfOrganisation(organisation.organisationId)
        def orgRole = members.find { it.userId == user?.userId } ?: [:]
        def hasAdminAccess = userService.userIsSiteAdmin() || orgRole.role == RoleService.PROJECT_ADMIN_ROLE

        def reportingVisible = organisation.state && ((organisation.reports && (hasAdminAccess || userService.userHasReadOnlyAccess())) || userService.userIsAlaOrFcAdmin())

        def dashboardReports = [[name:'dashboard', label:'Activity Outputs']]
        if (hasAdminAccess) {
            dashboardReports += [name:'announcements', label:'Announcements']
        }
        if (reportingVisible) {
            // We need at least one finished report to show data.
            if (organisation.reports?.find{it.progress == 'finished'}) {
                dashboardReports += [name: 'performanceAssessmentSummary', label: 'Performance Assessment Summary']
                dashboardReports += [name: 'performanceAssessmentComparison', label: 'Performance Assessment Comparison']

            }
        }

        List adHocReportTypes =[ [type:'Performance Management Framework - Self Assessment']]

        [about     : [label: 'About', visible: true, stopBinding: false, type:'tab'],
         reporting : [label: 'Reporting', visible: reportingVisible, stopBinding:true, template:'/shared/reporting', default:reportingVisible, type: 'tab', reports:organisation.reports, adHocReportTypes:adHocReportTypes],
         projects  : [label: 'Projects', visible: true, default:!reportingVisible, stopBinding:true, type: 'tab', disableProjectCreation:true],
         sites     : [label: 'Sites', visible: true, type: 'tab', stopBinding:true, projectCount:organisation.projects?.size()?:0, showShapefileDownload:hasAdminAccess],
         dashboard : [label: 'Dashboard', visible: true, stopBinding:true, type: 'tab', template:'/shared/dashboard', reports:dashboardReports],
         admin     : [label: 'Admin', visible: hasAdminAccess, type: 'tab', showEditAnnoucements:organisation.projects?.size()]]
    }

    def create() {
        [organisation:[:], isNameEditable: true]
    }
    {}
    def prepopulateAbn(){
        Map requestParameter = params
        String abnNumber = requestParameter.abn
        Map prePopulateAbn = abnLookupService.lookupOrganisationNameByABN(abnNumber)
     //   Map findABNMatch = prePopulateAbn.find {it.abn == abnNumber}
        if (prePopulateAbn.isEmpty()){
            flash.message = 'Please Enter the valid Abn Number'
        }else{
           Map result =  [abn: prePopulateAbn.abn, name: prePopulateAbn.entityName]
            render result as JSON
        }
    }

    def edit(String id) {

        def organisation = organisationService.get(id)

        if (!organisation || organisation.error) {
            organisationNotFound(id, organisation)
        }
        else {
            if (organisationService.isUserAdminForOrganisation(id)) {

                [organisation: organisation,
                 isNameEditable   : userService.userIsAlaOrFcAdmin()]
            }
            else {
                flash.message = 'You do not have permission to perform that action'
                chain action: 'index', id:id
            }
        }
    }

    def delete(String id) {
        if (organisationService.isUserAdminForOrganisation(id)) {
            organisationService.update(id, [status: 'deleted'])
        }
        else {
            flash.message = 'You do not have permission to perform that action'
        }
        redirect action: 'list'
    }

    def ajaxDelete(String id) {

        if (organisationService.isUserAdminForOrganisation(id)) {
            def result = organisationService.update(id, [status: 'deleted'])

            respond result
        }
        else {
            render status:403, text:'You do not have permission to perform that action'
        }
    }

    def ajaxUpdate() {
        def organisationDetails = request.JSON

        def documents = organisationDetails.remove('documents')
        def links = organisationDetails.remove('links')
        def result = organisationService.update(organisationDetails.organisationId?:'', organisationDetails)

        def organisationId = organisationDetails.organisationId?:result.resp?.organisationId
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
            if (organisationService.isUserAdminForOrganisation(id) || organisationService.isUserGrantManagerForOrganisation(id)) {
                def organisation = organisationService.get(id)
                def params = [fq: 'organisationFacet:' + organisation.name, query :"docType:project"]

                def path = "search/downloadShapefile"
                def url = grailsApplication.config.ecodata.baseUrl + path + commonService.buildUrlParamsFromMap(params)
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

    def getMembersForOrganisation(String id) {
        def adminUserId = userService.getCurrentUserId()

        if (id && adminUserId) {
            if (organisationService.isUserAdminForOrganisation(id) || organisationService.isUserGrantManagerForOrganisation(id)) {
                render organisationService.getMembersOfOrganisation(id) as JSON
            } else {
                render status:403, text: 'Permission denied'
            }
        } else if (adminUserId) {
            render status:400, text: 'Required params not provided: id'
        } else if (id) {
            render status:403, text: 'User not logged-in or does not have permission'
        } else {
            render status:500, text: 'Unexpected error'
        }
    }

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
        def queryParams = [max: 1500, fq: ['organisationFacet:' + organisation.name]]
        queryParams.query = "docType:project"
        def results = searchService.allProjects(queryParams, queryParams.query)
        def projects = results?.hits?.hits?.collect { it._source }

        def announcements = []
        projects.each { project ->
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
        announcements

    }

    /**
     * Bulk saves the edits to project events/announcements.
     */
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

    def downloadAnnouncementsTemplate(String id) {

        def organisation = id ? organisationService.get(id, 'flat') : null

        if (!organisation || organisation.error) {
            render status:404, text:'Organisation with id "'+id+'" does not exist.'
            return
        }

        def announcements = findOrganisationAnnouncements(organisation)

        new AnnouncementsMapper(excelImportService).announcementsToExcel(response, announcements)
    }

    def bulkUploadAnnouncements() {
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
            [name:it, annotatedModel:metadataService.annotatedOutputDataModel(it), dataModel:metadataService.getDataModelFromOutputName(it)]
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


    def getAdHocReportTypes(String projectId) {

        def supportedTypes = organisationService.getSupportedAdHocReports(projectId)
        render supportedTypes as JSON

    }

    def viewOrganisationReport(String reportId) {
        viewOrEditOrganisationReport(reportId, false)
    }

    def editOrganisationReport(String reportId) {
        viewOrEditOrganisationReport(reportId, true)
    }

    private def viewOrEditOrganisationReport(String reportId, Boolean edit) {
        Map report = reportService.get(reportId)
        int version = report.toDate < "2017-01-01T00:00:00Z" ? 1 : 2
        Map organisation = organisationService.get(report.organisationId)
        if (organisationService.isUserAdminForOrganisation(report.organisationId)) {
            Map model = reportService.performanceReportModel(reportId, version)
            model.state = organisation.state ?: 'Unknown'
            model.organisation = organisation

            if (reportService.isSubmittedOrApproved(model.report)) {
                model.submittingUserName = authService.getUserForUserId(model.report.submittedBy)?.displayName ?: 'Unknown user'
                model.submissionDate = DateUtils.displayFormatWithTime(model.report.dateSubmitted)
                edit = false
            }
            String view = edit ? '/report/performanceReport' : '/report/performanceReportView'

            render view: view, model:model
        }
        else {
            flash.message = "You don't have permission to edit the report"
            chain(action:'index', id: report.organisationId)
        }
    }

    def performanceReportPDF(String reportId) {
        Map report = reportService.get(reportId)

        if (organisationService.isUserAdminForOrganisation(report.organisationId)) {

            int version = report.toDate < "2017-01-01T00:00:00Z" ? 1 : 2
            Map model = reportService.performanceReportModel(reportId, version)
            model.edit = false

            String page = g.include(controller:'organisation', action:'viewOrganisationReport', id:reportId, params:[reportId:reportId])

            response.setContentType('application/pdf')
            pdfConverterService.convertToPDF(page, response.outputStream)
        }
        else {
            flash.message = "You don't have permission to view the report"
            chain(action:'index', id: report.organisationId)
        }
    }


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

    def ajaxSubmitReport(String id) {

        if (!organisationService.isUserAdminForOrganisation(id)) {
            render status:401, message:'No permission to submit report'
            return
        }
        def reportDetails = request.JSON

        def result = organisationService.submitReport(id, reportDetails.reportId)

        render result as JSON
    }

    def ajaxApproveReport(String id) {

        if (!organisationService.isUserGrantManagerForOrganisation(id)) {
            render status:401, message:'No permission to approve report'
            return
        }
        def reportDetails = request.JSON

        def result = organisationService.approveReport(id, reportDetails.reportId, reportDetails.reason)

        render result as JSON
    }

    def ajaxRejectReport(String id) {

        if (!organisationService.isUserGrantManagerForOrganisation(id)) {
            render status:401, message:'No permission to reject report'
            return
        }
        def reportDetails = request.JSON

        def result = organisationService.rejectReport(id, reportDetails.reportId, reportDetails.reason, reportDetails.category)

        render result as JSON
    }



    private void updateActivities(project, errors, plannedStartDate, plannedEndDate) {
        def activitiesWithDefaultDates = project.activities.findAll {

            if (it.plannedStartDate == project.plannedStartDate && it.plannedEndDate == project.plannedEndDate) {
                return true
            }
            def actStart = DateUtils.parse(it.plannedStartDate)
            def actEnd = DateUtils.parse(it.plannedEndDate)

            return new Duration(actStart, actEnd).isLongerThan(Weeks.weeks(19).toStandardDuration())
        }

        def modifiedActivities = project.activities.findAll {
            !(it.activityId in activitiesWithDefaultDates.collect { a -> a.activityId })
        }

        if (modifiedActivities) {
            errors << "${project.grantId}: Number of activities with non-default dates: ${modifiedActivities.size()}"
        }


        if (modifiedActivities) {
            modifiedActivities.each {
                if (it.plannedStartDate < plannedStartDate) {
                    errors << "${project.grantId}: Activity ${it.description} starts before contract date: ${it.plannedStartDate}, ${plannedStartDate}"
                }
                if (it.plannedEndDate > plannedEndDate) {
                    errors << "${project.grantId}: Activity ${it.description} ends after contract end date: ${it.plannedEndDate}, ${plannedEndDate}"
                }
                if (it.plannedEndDate < plannedStartDate) {
                    errors << "${project.grantId}: Activity ${it.description} ends before contract start date: ${it.plannedEndDate}, ${plannedStartDate}"
                }
            }

        }

        if (activitiesWithDefaultDates) {
            // Update the dates of the works activities that haven't been modified from the original defaults.
            def activityIds = activitiesWithDefaultDates.collect { it.activityId }
            activityService.bulkUpdateActivities(activityIds, [plannedStartDate: plannedStartDate, plannedEndDate: plannedEndDate])
        }
        projectService.createReportingActivitiesForProject(project.projectId, [[period: Period.months(1), type: 'Green Army - Monthly project status report']])
    }
}

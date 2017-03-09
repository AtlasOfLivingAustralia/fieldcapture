package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils
import au.org.ala.fieldcapture.RoleService
import grails.converters.JSON
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
import org.springframework.web.multipart.MultipartHttpServletRequest
import pl.touk.excel.export.WebXlsxExporter
import pl.touk.excel.export.XlsxExporter

import java.text.SimpleDateFormat

/**
 * Extends the plugin OrganisationController to support Green Army project reporting.
 */
class OrganisationController extends au.org.ala.fieldcapture.OrganisationController {

    def activityService, metadataService, projectService, excelImportService, reportService, pdfConverterService, authService


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
        // The dashboards are being temporarily disabled. See #1008.
        /*
        if (reportingVisible) {
            // We need at least one finished report to show data.
            if (organisation.reports?.find{it.progress == 'finished'}) {
                dashboardReports += [name: 'performanceAssessmentSummary', label: 'Performance Assessment Summary']
                dashboardReports += [name: 'performanceAssessmentComparison', label: 'Performance Assessment Comparison']

            }
        }
        */

        [about     : [label: 'About', visible: true, stopBinding: false, type:'tab'],
         reporting : [label: 'Reporting', visible: reportingVisible, stopBinding:true, default:reportingVisible, type: 'tab'],
         projects  : [label: 'Projects', visible: true, default:!reportingVisible, stopBinding:true, type: 'tab', disableProjectCreation:true],
         sites     : [label: 'Sites', visible: true, type: 'tab', stopBinding:true, projectCount:organisation.projects?.size()?:0, showShapefileDownload:hasAdminAccess],
         dashboard : [label: 'Dashboard', visible: true, stopBinding:true, type: 'tab', template:'/shared/dashboard', reports:dashboardReports],
         admin     : [label: 'Admin', visible: hasAdminAccess, type: 'tab', showEditAnnoucements:organisation.projects?.size()]]
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

    def editOrganisationReport(String reportId) {
        Map report = reportService.get(reportId)
        Map organisation = organisationService.get(report.organisationId)
        if (organisationService.isUserAdminForOrganisation(report.organisationId)) {
            Map model = reportService.performanceReportModel(reportId)
            model.state = organisation.state ?: 'Unknown'
            model.organisation = organisation

            boolean edit = params.edit
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

    def performanceReportPDF(String id) {
        Map report = reportService.get(id)

        if (organisationService.isUserAdminForOrganisation(report.organisationId)) {

            Map model = reportService.performanceReportModel(id)
            model.edit = false

            String page = g.include(controller:'organisation', action:'editOrganisationReport', id:id, params:[edit:false, reportId:id])

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

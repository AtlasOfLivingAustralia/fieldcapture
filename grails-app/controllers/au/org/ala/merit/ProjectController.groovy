package au.org.ala.merit

import au.org.ala.fieldcapture.CacheService
import au.org.ala.fieldcapture.PreAuthorise
import grails.converters.JSON

class ProjectController extends au.org.ala.fieldcapture.ProjectController {

    static defaultAction = "index"
    static ignore = ['action','controller','id']

    ReportService reportService
    BlogService blogService
    CacheService cacheService

    /** Overrides the projectContent method in the fieldcapture controller to include the MERI plan and risks and threats content */
    protected Map projectContent(project, user, programs) {
        def meriPlanVisible = metadataService.isOptionalContent('MERI Plan', project.associatedProgram, project.associatedSubProgram)
        def risksAndThreatsVisible = metadataService.isOptionalContent('Risks and Threats', project.associatedProgram, project.associatedSubProgram)
        def canViewRisks = risksAndThreatsVisible && (user?.hasViewAccess || user?.isEditor)
        def meriPlanEnabled = user?.hasViewAccess || ((project.associatedProgram == 'National Landcare Programme' && project.associatedSubProgram == 'Regional Funding'))
        def meriPlanVisibleToUser = project.planStatus == 'approved' || user?.isAdmin || user?.isCaseManager

        def publicImages = project.documents.findAll{it.public == true && it.thirdPartyConsentDeclarationMade == true && it.type == 'image'}
        def blog = blogService.getProjectBlog(project)
        def hasNewsAndEvents = blog.find{it.type == 'News and Events'}
        def hasProjectStories = blog.find{it.type == 'Project Stories'}

        hasNewsAndEvents = hasNewsAndEvents || project.newsAndEvents
        hasProjectStories = hasProjectStories || project.projectStories

        def showAnnouncementsTab = (user?.isAdmin || user?.isCaseManager) && projectService.isMeriPlanSubmittedOrApproved(project)
        List<Map> scores = metadataService.getOutputTargetScores()

        def imagesModel = publicImages.collect {[name:it.name, projectName:project.name, url:it.url, thumbnailUrl:it.thumbnailUrl]}
        boolean canChangeProjectDates = projectService.canChangeProjectDates(project)

        def model = [overview:[label:'Overview', visible: true, default:true, type:'tab', publicImages:imagesModel, displayTargets:false, displayOutcomes:false, blog:blog, hasNewsAndEvents:hasNewsAndEvents, hasProjectStories:hasProjectStories, canChangeProjectDates:canChangeProjectDates],
         documents:[label:'Documents', visible: true, type:'tab'],
         details:[label:'MERI Plan', disabled:!user?.hasViewAccess, disabled:!meriPlanEnabled, visible:meriPlanVisible, meriPlanVisibleToUser:meriPlanVisibleToUser, risksAndThreatsVisible:canViewRisks, type:'tab'],
         plan:[label:'Activities', visible:true, disabled:!user?.hasViewAccess, type:'tab', reports:project.reports, scores:scores],
         risksAndThreats:[label:'Risks and Threats', disabled:!user?.hasViewAccess, visible:user?.hasViewAccess && risksAndThreatsVisible],
         site:[label:'Sites', visible: true, disabled:!user?.hasViewAccess, type:'tab'],
         dashboard:[label:'Dashboard', visible: true, disabled:!user?.hasViewAccess, type:'tab'],
         admin:[label:'Admin', visible:user?.isEditor, type:'tab', canChangeProjectDates: canChangeProjectDates, showAnnouncementsTab:showAnnouncementsTab]]

        return [view:'index', model:model]
    }

    @PreAuthorise(accessLevel = 'admin')
    def projectSitePhotos(String id) {

        Map project = projectService.get(id)
        List activities = activityService.activitiesForProject(id)
        siteService.addPhotoPointPhotosForSites(project.sites?:[], activities, [project])

        render template: 'sitePhotoPoints', model:[project:project]

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

    @PreAuthorise(accessLevel = 'admin')
    def updateProjectStartDate(String id) {
        def payload = request.getJSON()
        if (!payload.plannedStartDate) {
            render status:400, text:"Missing parameter plannedStartDate"
            return
        }
        def result = projectService.changeProjectStartDate(id, payload.plannedStartDate)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'admin')
    def updateProjectDates(String id) {
        def payload = request.getJSON()
        if (!payload.plannedStartDate || !payload.plannedEndDate) {
            render status:400, text:"Missing parameters plannedStartDate, plannedEndDate"
            return
        }
        def result = projectService.changeProjectDates(id, payload.plannedStartDate, payload.plannedEndDate)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'admin')
    def regenerateStageReports(String id) {

        projectService.generateProjectStageReports(id)
        render status:200, text:'ok'
    }

    @PreAuthorise(accessLevel = 'admin')
    def projectReport(String id) {
        String fromStage = params.fromStage
        String toStage = params.toStage

        projectService.projectReportModel(id, fromStage, toStage, params.getList("sections"))
    }

    @PreAuthorise(accessLevel = 'admin')
    def projectReportPDF(String id) {

        String reportUrl = g.createLink(controller:'report', action:'projectReportCallback', id:id, absolute: true, params:[fromStage:params.fromStage, toStage:params.toStage, sections:params.sections])
        String url = grailsApplication.config.pdfgen.baseURL+'api/pdf'+commonService.buildUrlParamsFromMap(docUrl:reportUrl, cacheable:false)
        Map result
        try {
            result = webService.proxyGetRequest(response, url, false, false, 10*60*1000)
        }
        catch (Exception e) {
            result = [error:e.message]
            log.error("Error generating PDF for project ${id}: ",e)
        }
        if (result.error) {
            render view:'/error', model:[error:"An error occurred generating the project report."]
        }

    }

    @PreAuthorise(accessLevel = 'admin')
    def meriPlanPDF(String id) {
        String reportUrl = g.createLink(controller:'report', action:'meriPlanReportCallback', id:id, absolute: true)
        String url = grailsApplication.config.pdfgen.baseURL+'api/pdf'+commonService.buildUrlParamsFromMap(docUrl:reportUrl, cacheable:false)
        Map result
        try {
            result = webService.proxyGetRequest(response, url, false, false, 10*60*1000)
        }
        catch (Exception e) {
            log.error("Error generating the PDF of the MERI plan: ", e)
            result = [error:e.message]
        }
        if (result.error) {
            render view:'/error', model:[error:"An error occurred generating the MERI plan report."]
        }
    }

    @PreAuthorise(accessLevel = 'admin')
	def previewStageReport(){
        String projectId =  params.id
        String reportId = params.reportId
        String status = params.status
		
		if(reportId && projectId && status) {
			def project = projectService.get(projectId, 'all')
			def activities = activityService.activitiesForProject(projectId);
			if (project && !project.error) {
                def report = project.reports?.find{it.reportId == reportId}
                if (report) {
                    def param  = [project: project, activities:activities, report:report, status:status]
                    def htmlContent = projectService.createHTMLStageReport(param)
                    render text: htmlContent, contentType:"text", encoding:"UTF-8";
                }
				else {
					render status:400, text: 'Invalid stage'
				}
			}
			else{
				render status:400, text: 'Invalid project'
			}
		}
		else{
			render status:400, text: 'Required params not provided: id, reportId, status'
		}
	}

    @PreAuthorise(accessLevel = 'admin')
    def reportingHistory(String id) {

        def reportingHistory = reportService.getReportingHistoryForProject(id)

        render view:'/report/_reportingHistory', model:[reportingHistory:reportingHistory]
    }

    def mine() {
        forward controller: 'user', action:'index'
    }

}

package au.org.ala.merit

import au.org.ala.fieldcapture.PreAuthorise
import grails.converters.JSON

class ProjectController extends au.org.ala.fieldcapture.ProjectController {

    static defaultAction = "index"
    static ignore = ['action','controller','id']

    ReportService reportService
    BlogService blogService

    /** Overrides the projectContent method in the fieldcapture controller to include the MERI plan and risks and threats content */
    protected Map projectContent(project, user, programs) {
        def meriPlanVisible = metadataService.isOptionalContent('MERI Plan', project.associatedProgram, project.associatedSubProgram)
        def risksAndThreatsVisible = metadataService.isOptionalContent('Risks and Threats', project.associatedProgram, project.associatedSubProgram)
        def meriPlanEnabled = user?.hasViewAccess || ((project.associatedProgram == 'National Landcare Programme' && project.associatedSubProgram == 'Regional Funding'))
        def meriPlanVisibleToUser = project.planStatus == 'approved' || user?.isAdmin || user?.isCaseManager

        def publicImages = project.documents.findAll{it.public == true && it.thirdPartyConsentDeclarationMade == true && it.type == 'image'}
        def blog = blogService.getProjectBlog(project)
        def hasNewsAndEvents = blog.find{it.type == 'News and Events'}
        def hasProjectStories = blog.find{it.type == 'Project Stories'}

        hasNewsAndEvents = hasNewsAndEvents || project.newsAndEvents
        hasProjectStories = hasProjectStories || project.projectStories

        def showAnnouncementsTab = projectService.isMeriPlanSubmittedOrApproved(project)

        def imagesModel = publicImages.collect {[name:it.name, projectName:project.name, url:it.url]}
        boolean canChangeProjectDates = projectService.canChangeProjectDates(project)

        def model = [overview:[label:'Overview', visible: true, default:true, type:'tab', publicImages:imagesModel, displayTargets:false, displayOutcomes:false, blog:blog, hasNewsAndEvents:hasNewsAndEvents, hasProjectStories:hasProjectStories, canChangeProjectDates:canChangeProjectDates],
         documents:[label:'Documents', visible: true, type:'tab'],
         details:[label:'MERI Plan', disabled:!user?.hasViewAccess, disabled:!meriPlanEnabled, visible:meriPlanVisible, meriPlanVisibleToUser:meriPlanVisibleToUser, type:'tab'],
         plan:[label:'Activities', visible:true, disabled:!user?.hasViewAccess, type:'tab', reports:reportService.getReportsForProject(project.projectId)],
         risksAndThreats:[label:'Risks and Threats', disabled:!user?.hasViewAccess, visible:user?.hasViewAccess && risksAndThreatsVisible],
         site:[label:'Sites', visible: true, disabled:!user?.hasViewAccess, type:'tab'],
         dashboard:[label:'Dashboard', visible: true, disabled:!user?.hasViewAccess, type:'tab'],
         admin:[label:'Admin', visible:(user?.isAdmin || user?.isCaseManager), type:'tab', canChangeProjectDates: canChangeProjectDates, showAnnouncementsTab:showAnnouncementsTab]]

        return [view:'index', model:model]
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
        Map project = projectService.get(id, 'all')
        final int MAX_IMAGES = 6
        List publicImages = project.documents.findAll{it.public == true && it.thirdPartyConsentDeclarationMade == true && it.type == 'image'}
        if (publicImages.size() > MAX_IMAGES) {
            publicImages = publicImages.subList(0, MAX_IMAGES)
        }

        List orderedStageNames = project.reports?.sort{it.toDate}.collect{it.name}

        Map<String, Map<String, Integer>> activityCountByStage = new TreeMap()
        project.reports?.each { Map report ->
            List activities = project.activities?.findAll{it.plannedEndDate > report.fromDate && it.plannedEndDate <= report.toDate}
            Map<String, List> activitiesByProgress = activities?.groupBy{it.progress?it.progress:'planned'}

            activityCountByStage << [(report.name):new TreeMap()]
            activitiesByProgress.each{ status, activityList ->
                activityCountByStage[report.name].put(status, activityList?activityList.size():0)
            }
        }

        Map activitiesModel = metadataService.activitiesModel()
        Set activityModels = new HashSet()
        Map outputModels = [:]
        project.activities?.each { activity ->
            Map activityModel = activitiesModel.activities.find{it.name == activity.type}
            activityModels << activityModel
            activityModel.outputs.each { outputName ->
                outputModels << [(outputName):metadataService.getDataModelFromOutputName(outputName)]

            }
        }

        Map activitiesByStage = [:].withDefault{[]}
        project.activities?.each { activity ->
            if (activityService.isFinished(activity)) {
                Map report = reportService.findReportForDate(activity.plannedEndDate, project.reports)
                if (report && report.name) {
                    activitiesByStage[report.name] << activity
                }
            }
        }
        String role
        if (userService.userIsAlaOrFcAdmin()) {
            role = 'MERIT Administrator and authorised representative of Commonwealth Department of Environment'
        }
        else if (userService.isUserCaseManagerForProject(userService.getCurrentUserId(), id)) {
            role = 'MERIT Grant Manager and authorised representative of Commonwealth Department of Environment'
        }
        else if (userService.isUserAdminForProject(userService.getCurrentUserId(), id)) {
            role = 'MERIT Project Administrator and authorised representative of Commonwealth Department of Environment'
        }
        else {
            role = 'MERIT user'
        }

        Map latestStageReport = project.activities?.findAll {
            it.type == ProjectService.STAGE_REPORT_ACTIVITY_TYPE && reportService.isSubmittedOrApproved(it)
        }?.max { it.plannedEndDate }

        Map stageReportModel = activitiesModel.activities.find {it.name == ProjectService.STAGE_REPORT_ACTIVITY_TYPE}

        List outcomes = project.custom?.details?.objectives?.rows1?.findAll{it.description}

        project.documents = project.documents?.findAll{!(it.role in ['stageReport', 'approval', 'deferReason'])}
        project.documents?.sort{it.stage}

        [project:project, role:role, images:publicImages, activityCountByStage:activityCountByStage, outcomes:outcomes, metrics: projectService.summary(id),
        activityModels:activityModels, orderedStageNames:orderedStageNames, activitiesByStage:activitiesByStage, outputModels:outputModels, stageReportModel:stageReportModel, latestStageReport:latestStageReport]
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

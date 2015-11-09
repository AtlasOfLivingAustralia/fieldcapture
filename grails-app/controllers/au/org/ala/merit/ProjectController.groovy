package au.org.ala.merit

import au.org.ala.fieldcapture.PreAuthorise
import grails.converters.JSON

class ProjectController extends au.org.ala.fieldcapture.ProjectController {

    static defaultAction = "index"
    static ignore = ['action','controller','id']

    def reportService

    /** Overrides the projectContent method in the fieldcapture controller to include the MERI plan and risks and threats content */
    protected Map projectContent(project, user, programs) {
        def program = programs.programs.find{it.name == project.associatedProgram}
        def meriPlanVisible = program?.optionalProjectContent?.contains('MERI Plan')
        def meriPlanEnabled = user?.hasViewAccess || (project.associatedProgram == 'National Landcare Programme' && project.associatedSubProgram == 'Regional Funding')
        def publicImages = project.documents.findAll{it.public == true && it.thirdPartyConsentDeclarationMade == true && it.type == 'image'}
        def blog = project.blog
        def imagesModel = publicImages.collect {[name:it.name, projectName:project.name, url:it.url]}

        def model = [overview:[label:'Overview', visible: true, default:true, type:'tab', /*outcomes:projectService.getProjectOutcomes(project),*/ publicImages:imagesModel, blog:blog],
         documents:[label:'Documents', visible: true, type:'tab'],
         details:[label:'MERI Plan', disabled:!meriPlanEnabled, visible:meriPlanVisible, type:'tab'],
         plan:[label:'Activities', visible:true, disabled:!user?.hasViewAccess, type:'tab', reports:reportService.getReportsForProject(project.projectId)],
         risksAndThreats:[label:'Risks and Threats', disabled:!user?.hasViewAccess, visible:user?.hasViewAccess && program?.optionalProjectContent?.contains('Risks and Threats')],
         site:[label:'Sites', visible: true, disabled:!user?.hasViewAccess, type:'tab'],
         dashboard:[label:'Dashboard', visible: true, disabled:!user?.hasViewAccess, type:'tab'],
         admin:[label:'Admin', visible:(user?.isAdmin || user?.isCaseManager), type:'tab']]

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
	def previewStageReport(){
        String projectId =  params.id
        String stageName = params.stageName
        String status = params.status
		
		if(stageName && projectId && status) {
			def project = projectService.get(projectId, 'all')
			def activities = activityService.activitiesForProject(projectId);
			boolean invalidStage = true;
			if (project && !project.error) {
				project.timeline?.each{
					if(it.name.equals(stageName)){
						def param  = [project: project, activities:activities, stageName:stageName, status:status]
						def htmlContent = projectService.createHTMLStageReport(param)
						invalidStage = false;
						render text: htmlContent, contentType:"text", encoding:"UTF-8";
					}
				}
				if(invalidStage){
					render status:400, text: 'Invalid stage'
				}
			}
			else{
				render status:400, text: 'Invalid project'
			}
		}
		else{
			render status:400, text: 'Required params not provided: id, stageName, status'
		}
	}

    @PreAuthorise(accessLevel = 'admin')
    def reportingHistory(String id) {

        def reportingHistory = reportService.getReportingHistoryForProject(id)

        render view:'/report/_reportingHistory', model:[reportingHistory:reportingHistory]
    }


}

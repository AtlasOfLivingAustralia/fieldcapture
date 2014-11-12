package au.org.ala.merit

import au.org.ala.fieldcapture.PreAuthorise
import grails.converters.JSON

class ProjectController extends au.org.ala.fieldcapture.ProjectController {

    static defaultAction = "index"
    static ignore = ['action','controller','id']

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


}

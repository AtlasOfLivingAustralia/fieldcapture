package au.org.ala.merit.command

import au.org.ala.merit.DocumentService
import au.org.ala.merit.UserService
import au.org.ala.merit.ActivityService
import au.org.ala.merit.BlogService
import au.org.ala.merit.MetadataService
import au.org.ala.merit.ProjectService
import au.org.ala.merit.ReportService
import au.org.ala.merit.SiteService
import grails.validation.Validateable


/**
 * Handles a request for a project summary report.  Assembles data from various services to produce the model
 * required for the report.
 */
@Validateable
class ProjectSummaryReportCommand {

    DocumentService documentService
    ProjectService projectService
    ReportService reportService
    ActivityService activityService
    MetadataService metadataService
    UserService userService
    SiteService siteService
    BlogService blogService

    // Report parameters
    String id
    String fromStage
    String toStage
    List<String> sections


    public Map call() {
        projectReportModel(id, fromStage, toStage, sections)
    }

    Map projectReportModel(String id, String fromStage, String toStage, List contentToInclude) {
        Map project = projectService.get(id, 'all')

        // Determine date range for data to include.
        String fromDate = project.reports?.find { it.name == fromStage }?.fromDate
        String toDate = project.reports?.find { it.name == toStage }?.toDate

        List reportedStages = []

        List<Map> blog = blogService.getProjectBlog(project)
        if (fromDate && toDate) {
            blog = blog.findAll{it.date > fromDate && it.date <= toDate}
        }
        else if (fromDate) {
            blog = blog.findAll{it.date > fromDate}
        }
        else if (toDate) {
            blog = blog.findAll{it.date <= toDate}
        }

        final int MAX_IMAGES = 6
        List publicImages = project.documents.findAll{it.public == true && it.thirdPartyConsentDeclarationMade == true && it.type == 'image'}
        if (publicImages.size() > MAX_IMAGES) {
            publicImages = publicImages.subList(0, MAX_IMAGES)
        }

        Map<String, Map<String, Integer>> activityCountByStage = new TreeMap()
        project.reports?.each { Map report ->
            if (report.fromDate >= fromDate && report.toDate <= toDate) {
                List activities = project.activities?.findAll{it.plannedEndDate > report.fromDate && it.plannedEndDate <= report.toDate}
                Map<String, List> activitiesByProgress = activities?.groupBy{it.progress?it.progress:ActivityService.PROGRESS_PLANNED}

                activityCountByStage << [(report.name):new TreeMap()]
                activitiesByProgress.each{ status, activityList ->
                    activityCountByStage[report.name].put(status, activityList?activityList.size():0)
                }
                reportedStages << report
            }
        }

        List reportedStageNames = reportedStages.collect{it.name}

        Map activitiesModel = metadataService.activitiesModel()
        Set activityModels = new HashSet()
        Map outputModels = [:]

        // Use the final report if available, otherwise fall back to the stage report.
        Map stageReportModel = null
        Map latestStageReport = findStageReport(project.activities, reportedStages)
        if (latestStageReport){
            stageReportModel = activitiesModel.activities.find {it.name == latestStageReport.type}
            if (!activityModels.find{it.name == stageReportModel.name}) {
                activityModels << stageReportModel
            }
        }

        Map activitiesByStage = [:].withDefault{[]}
        project.activities?.each { activity ->
            if (activity.plannedEndDate >= fromDate && activity.plannedEndDate <= toDate) {
                if (activity.siteId) {
                    activity.site = siteService.get(activity.siteId)
                }
                if (activityService.isDeferredOrCancelled(activity)) {
                    Map searchResults = documentService.search([activityId:activity.activityId])
                    Map document = searchResults?.documents?.find{it.role = 'deferReason'}
                    activity.reason = document?.notes
                }
                Map activityModel = activitiesModel.activities.find{it.name == activity.type}
                activityModels << activityModel
                Map report = reportService.findReportForDate(activity.plannedEndDate, project.reports)
                if (report && report.name) {
                    activitiesByStage[report.name] << activity
                }
            }
        }
        activityModels.each { activityModel ->
            activityModel.outputs.each { outputName ->
                outputModels << [(outputName):metadataService.getDataModelFromOutputName(outputName)]

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

        List outcomes = project.custom?.details?.objectives?.rows1?.findAll{it.description}

        project.documents = project.documents?.findAll{!(it.role in ['stageReport', 'approval', 'deferReason']) && (("Stage "+it.stage) in reportedStageNames || !it.stage)}
        project.documents = project.documents?.sort{it.plannedEndDate}.reverse()


        Map risksComparison = [:]
        if (contentToInclude.contains('Project risks changes') || contentToInclude.contains('Project risks')) {
            risksComparison = projectService.compareProjectRisks(id, toDate, fromDate)
        }

        Map metrics = [:]
        if (contentToInclude.contains('Progress against output targets') || contentToInclude.contains('Progress of outputs without targets')) {
            metrics = projectService.summary(id)
        }

        [project:project, content:contentToInclude, role:role, images:publicImages, activityCountByStage:activityCountByStage,
         outcomes:outcomes, metrics: metrics, activityModels:activityModels, orderedStageNames:reportedStageNames,
         activitiesByStage:activitiesByStage, outputModels:outputModels, stageReportModel:stageReportModel,
         latestStageReport:latestStageReport, risksComparison: risksComparison, blog:blog]
    }


    private Map findStageReport(List activities, List reports) {

        List<String> reportTypes = [ActivityService.FINAL_REPORT_ACTIVITY_TYPE, ActivityService.REDUCED_STAGE_REPORT_ACTIVITY_TYPE, ActivityService.STAGE_REPORT_ACTIVITY_TYPE, ActivityService.ALG_FINAL_REPORT, ActivityService.ALG_PROGRESS_REPORT]
        List reportsNewestFirst = reports?.reverse() ?:[]
        reportsNewestFirst.findResult { report ->
            Map activity = null
            if (reportService.isSubmittedOrApproved(report)) {
                activity = reportTypes.findResult { type ->
                    activities?.findAll{it.type == type && it.progress == ActivityService.PROGRESS_FINISHED && it.plannedEndDate > report.fromDate && it.plannedEndDate <= report.toDate}?.max{it.plannedEndDate}
                }
            }
            activity
        }
    }


}

package au.org.ala.merit.command

import au.org.ala.ecodata.forms.ActivityFormService
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
class ProjectSummaryReportCommand implements Validateable {

    static List<String> stageReportTypes = [ActivityService.FINAL_REPORT_ACTIVITY_TYPE, ActivityService.REDUCED_STAGE_REPORT_ACTIVITY_TYPE, ActivityService.STAGE_REPORT_ACTIVITY_TYPE, ActivityService.ALG_FINAL_REPORT, ActivityService.ALG_PROGRESS_REPORT]

    DocumentService documentService
    ProjectService projectService
    ReportService reportService
    ActivityService activityService
    UserService userService
    SiteService siteService
    BlogService blogService
    ActivityFormService activityFormService

    // Report parameters
    String id
    String fromStage
    String toStage
    String fromDate
    String toDate
    List<String> sections


    Map call() {
        Map project = projectService.get(id, 'all')

        if (fromStage && !fromDate) {
            fromDate = project.reports?.find { it.name == fromStage }?.fromDate
        }
        if (toStage && !toDate) {
            toDate = project.reports?.find { it.name == toStage }?.toDate
        }
        projectReportModel(project, fromDate, toDate, sections)
    }

    private List<Map> blog(Map project, String fromDate, String toDate) {
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
        blog
    }

    private List images(Map project) {
        final int MAX_IMAGES = 6
        List publicImages = project.documents.findAll{it.public == true && it.thirdPartyConsentDeclarationMade == true && it.type == 'image'}
        if (publicImages.size() > MAX_IMAGES) {
            publicImages = publicImages.subList(0, MAX_IMAGES)
        }
        publicImages
    }

    private String getUserRole() {
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
        role
    }

    private List documents(Map project, List stageNames) {
        List documents = project.documents?.findAll{!(it.role in ['stageReport', 'approval', 'deferReason']) && (("Stage "+it.stage) in stageNames || !it.stage)}
        documents = documents?.sort{it.plannedEndDate}.reverse()

        documents
    }

    private Map latestStageReport(Map project, List reportedStages) {
        // Use the final report if available, otherwise fall back to the stage report.
        Map stageReportModel = null
        Map latestStageReport = findStageReport(project.activities, reportedStages)
        if (latestStageReport) {
            stageReportModel = activityFormService.findActivityForm(latestStageReport.type, latestStageReport.formVersion)
        }

        [latestStageReport:latestStageReport, stageReportModel: stageReportModel]
    }

    Map projectReportModel(Map project, String fromDate, String toDate, List contentToInclude) {

        Map model = [project:project, role:getUserRole(), content:contentToInclude]

        List reportedStages = []

        if ('Blog' in contentToInclude) {
            model.blog = blog(project, fromDate, toDate)
        }
        if ('Images' in contentToInclude) {
            model.images = images(project)
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

        List activityForms = []
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
                if (!activityForms.find{it.name == activity.type && it.formVersion == activity.formVersion}) {
                    activityForms << activityFormService.findActivityForm(activity.type, activity.formVersion)
                }

                Map report = reportService.findReportForDate(activity.plannedEndDate, project.reports)
                if (report && report.name) {
                    activitiesByStage[report.name] << activity
                }
            }
        }

        if ('Outcomes' in contentToInclude) {
            model.outcomes = project.custom?.details?.objectives?.rows1?.findAll{it.description}
        }

        if ('Supporting documents' in contentToInclude) {
            project.documents = documents(project, reportedStageNames)
        }

        if ('Stage report' in contentToInclude) {
            model.putAll(latestStageReport(project, reportedStages))
        }

        if (('Project risks changes'in contentToInclude) || ('Project risks' in contentToInclude)) {
            model.risksComparison = projectService.compareProjectRisks(id, toDate, fromDate)
        }

        if (contentToInclude.contains('Progress against output targets') || contentToInclude.contains('Progress of outputs without targets')) {
            model.metrics = projectService.summary(id)
        }

        model.putAll([
                activityCountByStage:activityCountByStage,
                activityForms:activityForms,
                orderedStageNames:reportedStageNames,
                activitiesByStage:activitiesByStage])
        model
    }


    private Map findStageReport(List activities, List reports) {

        List reportsNewestFirst = reports?.reverse() ?:[]
        reportsNewestFirst.findResult { report ->
            Map activity = null
            if (reportService.excludesNotApproved(report)) {
                activity = stageReportTypes.findResult { type ->
                    activities?.findAll{it.type == type && it.progress == ActivityService.PROGRESS_FINISHED && it.plannedEndDate > report.fromDate && it.plannedEndDate <= report.toDate}?.max{it.plannedEndDate}
                }
            }
            activity
        }
    }


}

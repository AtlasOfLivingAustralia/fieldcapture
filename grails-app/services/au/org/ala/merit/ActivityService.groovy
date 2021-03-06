package au.org.ala.merit

import au.org.ala.ecodata.forms.ActivityFormService
import au.org.ala.merit.DateUtils
import org.joda.time.DateTime
import org.joda.time.Period
import org.joda.time.format.DateTimeFormat

class ActivityService {

    def webService, grailsApplication, metadataService, reportService, projectService, emailService, userService
    ActivityFormService activityFormService

    public static final String PROGRESS_PLANNED = 'planned'
    public static final String PROGRESS_FINISHED = 'finished'
    public static final String PROGRESS_STARTED = 'started'
    public static final String PROGRESS_DEFERRED = 'deferred'
    public static final String PROGRESS_CANCELLED = 'cancelled'

    static final String FINAL_REPORT_ACTIVITY_TYPE = 'Outcomes, Evaluation and Learning - final report'
    static final String STAGE_REPORT_ACTIVITY_TYPE = 'Progress, Outcomes and Learning - stage report'
    static final String REDUCED_STAGE_REPORT_ACTIVITY_TYPE = 'Stage Report'
    static final String ALG_PROGRESS_REPORT = '25th Anniversary Landcare Grants - Progress Report'
    static final String ALG_FINAL_REPORT = '25th Anniversary Landcare Grants - Final Report'

    private static def PROGRESS = [PROGRESS_PLANNED, PROGRESS_STARTED, PROGRESS_FINISHED, PROGRESS_CANCELLED, PROGRESS_DEFERRED]

    public static Comparator<String> PROGRESS_COMPARATOR = {a,b -> PROGRESS.indexOf(a) <=> PROGRESS.indexOf(b)}

    static dateFormat = "yyyy-MM-dd'T'hh:mm:ssZ"

    def getCommonService() {
        grailsApplication.mainContext.commonService
    }

    def constructName = { act ->
        def date = commonService.simpleDateLocalTime(act.startDate) ?:
            commonService.simpleDateLocalTime(act.endDate)
        def dates = []
        if (act.startDate) {
            dates << commonService.simpleDateLocalTime(act.startDate)
        }
        if (act.endDate) {
            dates << commonService.simpleDateLocalTime(act.endDate)
        }
        def dateRange = dates.join('-')

        act.name = act.type + (dateRange ? ' ' + dateRange : '')
        act
    }

    def list() {
        def resp = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'activity/')
        // inject constructed name
        resp.list.collect(constructName)
    }

    def assessments() {
        def resp = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'assessment/')
        // inject constructed name
        resp.list.collect(constructName)
    }

    def get(id) {
        def activity = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'activity/' + id)
        activity
    }

    def create(activity) {
        update('', activity)
    }

    Map update(String id, Map activity) {

        if (id) {
            // This check is to prevent multiple outputs of the same type being created for an activity.
            Map existingActivity = get(id)

            if (activity.outputs) {
                activity.outputs = new ArrayList(activity.outputs) // If the array is created from a DataBinding, it creates copies when it iterates and we want inline modifcation.
                activity.outputs?.each { output ->
                    def matchingOutput = existingActivity.outputs?.find { it.name == output.name }
                    if (matchingOutput) {
                        if (matchingOutput.outputId != output.outputId) {
                            log.warn("Update for activity: " + id + " contains outputs which have the same type but different IDs")
                        }
                        output.outputId = matchingOutput.outputId
                        println output
                    }
                }
            }

        }
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'activity/' + id+'?lock=true', activity)
    }

    def delete(id) {
        webService.doDelete(grailsApplication.config.ecodata.baseUrl + 'activity/' + id)
    }

    /**
     * Returns a detailed list of all activities associated with a project.
     *
     * Activities can be directly linked to a project, or more commonly, linked
     * via a site that is associated with the project.
     *
     * Main output scores are also included. As is the meta-model for the activity.
     *
     * @param id of the project
     */
    def activitiesForProject(String id) {
        def list = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'activitiesForProject/' + id)?.list
        // inject the metadata model for each activity
        list.each {
            it.model = metadataService.getActivityModel(it.type)
        }
        list
    }

    def submitActivitiesForPublication(activityIds) {
        updatePublicationStatus(activityIds, 'pendingApproval')
    }

    def approveActivitiesForPublication(activityIds) {
        updatePublicationStatus(activityIds, 'published')
    }

    def rejectActivitiesForPublication(activityIds) {
        updatePublicationStatus(activityIds, 'unpublished')
    }

    /**
     * Updates the publicationStatus field of a set of Activities.
     * @param activityIds a List of the activity ids.  Identifies which activities to update.
     * @param status the new value for the publicationStatus field.
     */
    def updatePublicationStatus(activityIds, status) {

        def ids = activityIds.collect{"id=${it}"}.join('&')
        def body = ['publicationStatus':status]
        webService.doPost(grailsApplication.config.ecodata.baseUrl + "activities/?$ids", body)

    }

    /**
     * Soft deletes the activities identified by id.
     * @param activityIds the activities to delete.
     * @return the response from ecodata.
     */
    Map bulkDeleteActivities(List<String> activityIds) {
        bulkUpdateActivities(activityIds, [status:'deleted'])
    }

    def bulkUpdateActivities(activityIds, props) {
        def ids = activityIds.collect{"id=${it}"}.join('&')
        webService.doPost(grailsApplication.config.ecodata.baseUrl + "activities/?$ids", props)
    }

    /** @see au.org.ala.ecodata.ActivityController for a description of the criteria required. */
    def search(criteria) {
        def modifiedCriteria = new HashMap(criteria?:[:])
        // Convert dates to UTC format.
        criteria.each { key, value ->
            if (value instanceof Date) {
                modifiedCriteria[key] = value.format(dateFormat, TimeZone.getTimeZone("UTC"))
            }

        }
        webService.doPost(grailsApplication.config.ecodata.baseUrl+'activity/search/', modifiedCriteria)
    }

    Map lock(String activityId) {
        String path = "lock/lock/"+activityId
        webService.doPost(grailsApplication.config.ecodata.baseUrl+path,[:])
    }

    Map lock(Map activity) {
        lock(activity.activityId)
    }

    Map unlock(String activityId, Boolean force = false) {
        String path = "lock/unlock/"+activityId
        webService.doPost(grailsApplication.config.ecodata.baseUrl+path,[force:force])
    }

    void stealLock(String activityId, String activityUrl) {
        Map activity = get(activityId)
        Map result = [error:'No lock']
        if (activity.lock) {
            result = unlock(activityId, true)
            emailService.sendLockStolenEmail(activity.lock, activityUrl)
        }
        result
    }

    def isReport(activity) {
        def model = metadataService.getActivityModel(activity.type)
        return model.type == 'Report'
    }

    boolean isFinished(activity) {
        return activity?.progress == PROGRESS_FINISHED
    }

    boolean isStarted(activity) {
        return activity?.progress == PROGRESS_STARTED
    }

    boolean isDeferred(Map activity) {
        return activity?.progress == PROGRESS_DEFERRED
    }

    boolean isCancelled(Map activity) {
        return activity?.progress == PROGRESS_CANCELLED
    }

    boolean isStartedOrFinished(activity) {
        return isFinished(activity) || isStarted(activity)
    }

    boolean isDeferredOrCancelled(activity) {
        return isDeferred(activity) || isCancelled(activity)
    }

    /**
     * Returns true if this activity is in an editable state.  Activities contained in approved reports or completed projects
     * are not editable for example.
     */
    boolean canEditActivity(Map activity) {
        projectService.canEditActivity(activity)
    }

    Map getActivityMetadata(String activityType, Integer version = null) {
        activityFormService.getActivityAndOutputMetadata(activityType, version)
    }

    /**
     * Creates a description for the supplied activity based on the activity type and dates.
     */
    String defaultDescription(activity) {
        def start = activity.plannedStartDate
        def end = activity.plannedEndDate

        DateTime startDate = DateUtils.parse(start)
        DateTime endDate = DateUtils.parse(end).minusDays(1)

        Period period = new Period(startDate.toLocalDate(), endDate.toLocalDate())

        def description = DateTimeFormat.forPattern("MMM yyyy").print(endDate)
        if (period.months > 1) {
            description = DateTimeFormat.forPattern("MMM").print(startDate) + ' - ' + description
        }
        "${activity.type} (${description})"

    }

    public Map duplicateActivity(String projectId, List stageNames, Map activityData) {
        Map result
        List reports = reportService.getReportsForProject(projectId)
        stageNames.each { String stage ->
            Map report = reports.find { it.name == stage }
            if (report && !reportService.isSubmittedOrApproved(report)) {
                activityData.plannedStartDate = report.fromDate
                activityData.plannedEndDate = DateUtils.dayBefore(report.toDate)
                log.info("Creating duplicate activity for stage " + stage + " for project " + projectId)
                result = create(activityData)
            }
        }
        result
    }

}

package au.org.ala.merit

import au.org.ala.ecodata.forms.ActivityFormService
import grails.plugin.cache.Cacheable
import groovy.util.logging.Slf4j
import org.joda.time.DateTime
import org.joda.time.Period
import org.joda.time.format.DateTimeFormat

@Slf4j
class ActivityService {

    def webService, grailsApplication, metadataService, reportService, projectService, emailService, userService
    ActivityFormService activityFormService
    LockService lockService

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
    static final String MONITORING_PROTOCOL_FORM_TYPE = 'EMSA'
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
        def resp = webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + 'activity/')
        // inject constructed name
        resp.list.collect(constructName)
    }

    def assessments() {
        def resp = webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + 'assessment/')
        // inject constructed name
        resp.list.collect(constructName)
    }

    def get(id) {
        def activity = webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + 'activity/' + id)
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
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl') + 'activity/' + id+'?lock=true', activity)
    }

    def delete(id) {
        webService.doDelete(grailsApplication.config.getProperty('ecodata.baseUrl') + 'activity/' + id)
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
        def list = webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + 'activitiesForProject/' + id)?.list
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

    def rejectOrUncancelActivitiesForPublication(activityIds) {
        updatePublicationStatus(activityIds, 'unpublished')
    }

    def cancelActivitiesForPublication(activityIds) {
        updatePublicationStatus(activityIds, PROGRESS_CANCELLED)
    }

    /**
     * Updates the publicationStatus field of a set of Activities.
     * @param activityIds a List of the activity ids.  Identifies which activities to update.
     * @param status the new value for the publicationStatus field.
     */
    def updatePublicationStatus(activityIds, status) {

        def ids = activityIds.collect{"id=${it}"}.join('&')
        def body = ['publicationStatus':status]
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl') + "activities/?$ids", body)

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
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl') + "activities/?$ids", props)
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
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl')+'activity/search/', modifiedCriteria)
    }

    Map lock(String activityId) {
       lockService.lock(activityId)
    }

    Map lock(Map activity) {
        lockService.lock(activity.activityId)
    }

    Map unlock(String activityId, Boolean force = false) {
        lockService.unlock(activityId, force)
    }

    void stealLock(String activityId, String activityUrl) {
        Map activity = get(activityId)
        lockService.stealLock(activityId, activity, activityUrl, SettingPageType.ACTIVITY_LOCK_STOLEN_EMAIL_SUBJECT, SettingPageType.ACTIVITY_LOCK_STOLEN_EMAIL)
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
        activityFormService.getActivityAndOutputMetadata(activityType, version, true)
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

        def description = DateTimeFormat.forPattern("MMMM yyyy").print(endDate)
        if (period.months > 1) {
            description = DateTimeFormat.forPattern("MMMM").print(startDate) + ' - ' + description
        }
        "${activity.type} (${description})"

    }

    public Map duplicateActivity(String projectId, List stageNames, Map activityData) {
        Map result
        List reports = reportService.getReportsForProject(projectId)
        stageNames.each { String stage ->
            Map report = reports.find { it.name == stage }
            if (report && !reportService.excludesNotApproved(report)) {
                activityData.plannedStartDate = report.fromDate
                activityData.plannedEndDate = DateUtils.dayBefore(report.toDate)
                log.info("Creating duplicate activity for stage " + stage + " for project " + projectId)
                result = create(activityData)
            }
        }
        result
    }


    /**
     * Returns a list of summary information about the available monitoring
     * protocols.
     *
     * @return List<Map> with keys [externalId:, name:, formVersion: ]
     */
    @Cacheable("monitoringProtocols")
    List<Map> monitoringProtocolForms() {
        Map criteria = [type:MONITORING_PROTOCOL_FORM_TYPE]

        Map resp = activityFormService.searchActivityForms(criteria)
        List<Map> forms = resp?.resp ?: []
        forms = forms.collect{[externalIds:it.externalIds, externalId:it.externalIds?.find{it.idType?.name == "MONITOR_PROTOCOL_GUID"}?.externalId, name:it.name, formVersion:it.formVersion, category:it.category, tags:it.tags]}

        forms
    }

}

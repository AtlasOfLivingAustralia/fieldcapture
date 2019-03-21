package au.org.ala.merit.command

import au.org.ala.merit.ActivityService
import au.org.ala.merit.DateUtils
import au.org.ala.merit.ProjectService
import au.org.ala.merit.ReportService
import au.org.ala.merit.SettingPageType
import au.org.ala.merit.SettingService
import au.org.ala.merit.UserService
import au.org.ala.merit.reports.Reef2050PlanActionReportConfig
import grails.converters.JSON
import grails.validation.Validateable
import org.apache.commons.logging.LogFactory
import org.joda.time.DateTime
import org.joda.time.DateTimeZone

import javax.persistence.Transient
import java.text.DecimalFormat
import java.util.regex.Matcher

@Validateable
class Reef2050PlanActionReportCommand extends Reef2050PlanActionReportConfig {

    private static final log = LogFactory.getLog(Reef2050PlanActionReportCommand)

    @Transient
    ReportService reportService

    @Transient
    ActivityService activityService

    @Transient
    ProjectService projectService

    @Transient
    SettingService settingService

    @Transient
    UserService userService


    String format
    boolean approvedActivitiesOnly = true

    static constraints = {
        activityService nullable: true
        reportService nullable: true
        projectService nullable: true
        userService nullable: true
        format nullable: true
        importFrom Reef2050PlanActionReportConfig
    }

    /**
     * Returns the model required to render the Reef 2050 Plan Action Report.
     */
    Map produceReport(boolean skipUserAccessCheck = false) {

        if (!skipUserAccessCheck) {
            // Only FC_ADMINs can view unapproved Reef 2050 Plan Action reports, however this is also
            // used by the PDF generation callback which doesn't have access to the user context.
            // The PDF callback URL gets produced with the user context though so this check has already
            // been performed.
            approvedActivitiesOnly = userService.userIsAlaOrFcAdmin() ? approvedActivitiesOnly : true
        }

        Map model = [:]
        if (validate()) {

            switch (type) {
                case SETTINGS_TEXT_REPORT:
                    String reportStaticText = settingService.getSettingText(SettingPageType.getForKey(settingsPageKey()))
                    model.reportText = reportStaticText
                    break
                default:
                    model = originalReportModel()
                    break
            }
        }
        else {
            model.errors = errors
        }
        model
    }

    Map originalReportModel() {
        List activities = findActivities()
        List actions = produceActionList(activities)

        DateTime periodEndDate = DateUtils.parse(periodEnd).withZone(DateTimeZone.default)
        DateTime periodStartDate = DateUtils.parse(periodStart()).withZone(DateTimeZone.default)
        String tableClass = type == REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE ? 'action-table-2018' : 'action-table'
        Map model =  [endDate:periodEndDate.minusHours(15).toDate(), startDate:periodStartDate.toDate(), actions: actions, type:type, tableClass:tableClass]
        model.putAll(actionStatusBreakdownByStatusAndTheme())
        model
    }

    /**
     * Returns a List of activities matching the type and period specified by this configurarion
     */
    private List findActivities() {
        Map searchCriteria = [
                type:type,
                dateProperty:'plannedEndDate',
                startDate:periodStart(),
                endDate:periodEnd,
                progress:ActivityService.PROGRESS_FINISHED]

        if (approvedActivitiesOnly) {
            searchCriteria.publicationStatus = ReportService.REPORT_APPROVED
        }

        Map resp
        JSON.use("nullSafe") {
            resp = activityService.search(searchCriteria)
        }
        List activities = []
        if (!resp || resp.error) {
            getErrors().reject("Error finding activities")
        }
        else {
            activities =  resp.resp.activities
        }
        activities

    }

    /** Transforms the activities into a List of Actions for rendering in the report */
    private List produceActionList(List activities) {
        List projectIds = activities.collect{it.projectId}.unique()
        List projects = projectService.search([projectId:projectIds, view:'flat'])?.resp?.projects ?: []

        // Merge into a single list of actions.

        List<Map> allActions = []
        activities.each { activity ->
            Map output = activity.outputs?activity.outputs[0]:[data:[:]]
            List actions = output.data?.actions
            Map project = projects.find{it.projectId == activity.projectId}
            List agencyContacts = output.data.agencyContacts ? output.data.agencyContacts.collect{it.agencyContact}:[]
            List webLinks = output.data.webLinks ? output.data.webLinks.collect{it.webLink}:[]
            Map commonData = [organisationId:project?.organisationId, reportingAgency:project?.organisationName, agencyContacts:agencyContacts, webLinks:webLinks]
            actions = actions.collect{
                if (it.webLinks && it.webLinks instanceof String) {
                    it.webLinks = it.webLinks.split(/(;|,|\n|\s)/)?.findAll{it}
                }
                it.sortableActionId = makeSortableActionId(it)
                commonData+it
            }
            allActions.addAll(actions)
        }
        allActions.sort{it.sortableActionId}
    }

    private Map actionStatusBreakdownByStatusAndTheme() {

        String periodStart = periodStart()
        String format = 'YYYY-MM'
        List dateBuckets = [periodStart, periodEnd]
        Map countByStatus = [type:'HISTOGRAM', label:'Action status', property:'data.actions.status']
        Map dateGroupingConfig = [groups:[type:'date', buckets:dateBuckets, format:format, property:'activity.plannedEndDate'],
                                  childAggregations: [countByStatus, [label:'Action Status By Theme', groups:[type:'discrete', property:'data.actions.theme'], childAggregations: [countByStatus]]]]
        Map activityTypeFilter = [type:'DISCRETE', filterValue: type, property:'activity.type']
        Map config = [filter:activityTypeFilter, childAggregations: [dateGroupingConfig], label:'Action Status by Year']


        List searchCriteriaForReport = ["associatedSubProgramFacet:"+REEF_2050_PLAN_ACTION_REPORTING_ACTIVITY_TYPE]

        Map report = reportService.runActivityReport([fq:searchCriteriaForReport, reportConfig: config, approvedActivitiesOnly:approvedActivitiesOnly])

        Map actionStatus = [label:"Action Status"]
        Map actionStatusByTheme = [:]
        if (!report.error) {
            report = report.resp.results
            String startDateMatcher = DateUtils.format(DateUtils.parse(periodStart).withZone(DateTimeZone.default), format)

            Map reportForYear = report?.groups?.find { it.group.startsWith(startDateMatcher) }
            if (reportForYear) {

                actionStatus.result = reportForYear.results[0]
                reportForYear.results[1]?.groups?.each { group ->
                    actionStatusByTheme[group.group] = [label: group.group + " - Action Status", result: group.results[0]]
                }
            }
        }

        Map actionStatusCounts = actionStatus?.result?.result ?: [:]
        mergeCompletedOrInPlaceCategories(actionStatusCounts)

        actionStatusByTheme.each { k, v ->
            mergeCompletedOrInPlaceCategories(v?.result?.result)
        }
        // The colours are defined here instead of CSS because they need to be supplied as strings to the chart
        // which is generated by a taglib.
        List statuses = [
                [title:"Completed or in place", description:"<strong>are completed or in place</strong> (implementation is full completed OR initial implementation has been completed, but part of the action is ongoing)", countColour:"#4fac52", descriptionColour: "#b8d6af"],
                [title:"On track / Underway", description:"<strong>are on track/underway</strong> (implementation is meeting expected milestones and progress is being made)", countColour:"#BECC48", descriptionColour: "#E2EAB1"],
                [title:"Delayed or limited progress", description:"<strong>are delayed/limited progress</strong> (major implementation milestones have been delayed by less than 6 months, or only superficial progress has been made)", countColour:"#FDCC5B", descriptionColour: "#FDECBA"],
                [title:"Significant delays or no progress", description:"<strong>are significant delays or no progress</strong> (major implementation milestones have been delayed for longer than six months or no progress has been made)", countColour:"#D02431", descriptionColour: "#EAA795"],
                [title:"Not yet due", description:"<strong>are not yet due</strong> (implementation is not yet due to commence)", countColour:"#8C8C8C", descriptionColour: "#CCCCCC"]
        ]

        Map statusColours = [:]
        statuses.each { status ->
            status.count = actionStatusCounts[status.title]?:0
            statusColours[status.title] = status.countColour
        }


        // Fifteen hours are subtracted from the end date to account for both that the reports end on midnight of the next period and may be in UTC timezone.
        // This is so when it is rendered it will display 30 June / 31 December instead of 1 July / 1 January
        [actionStatus:actionStatus, actionStatusByTheme:actionStatusByTheme, status:statuses, statusColours:statusColours]
    }

    /**
     *  Mutates the supplied map, removing "Completed" and "In place" keys, replacing with "Completed or in place"
     *  containing the sum of the values of the removed keys.
     */
    private void mergeCompletedOrInPlaceCategories(Map actionStatusCounts) {
        if (!actionStatusCounts) {
            return
        }
        int completed = actionStatusCounts.remove('Completed') ?: 0
        int inPlace = actionStatusCounts.remove('In place') ?: 0

        actionStatusCounts["Completed or in place"] = completed + inPlace

    }

    /**
     * There is a specific sort required for Actions. In the pre-2018 report, this can be derived from the
     * action id.  In the 2018+ version an explicit sort order had to be included as deriving the order from the
     * id was no longer possible.
     * @param actionId the original action id
     * @return the sortable version of the id.
     */
    private String makeSortableActionId(Map actionData) {

        if (actionData.sortOrder) {
            return actionData.sortOrder
        }
        else {
            String actionId = actionData.actionId

            try {
                Matcher groups = (actionId =~ /(.*?)(\d+)(.*)/)

                if (!groups.lookingAt() || (groups[0].size() != 4)) {
                    log.warn("Action id: " + actionId + " does not match the expected pattern")
                    return actionId
                }
                String sortableActionId = groups[0][1]
                DecimalFormat decimalFormat = new DecimalFormat("000")
                sortableActionId += decimalFormat.format(Integer.parseInt(groups[0][2]))
                if (groups[0].size() == 4) {
                    sortableActionId += groups[0][3]
                }
                return sortableActionId
            }
            catch (Exception e) {
                log.error(e, "Error attempting to match actionId: ${actionId}")
                return actionId
            }
        }

    }

}

package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils
import au.org.ala.fieldcapture.GmsMapper
import grails.converters.JSON
import org.joda.time.DateTime
import org.joda.time.Interval
import org.joda.time.Period

class ReportController extends au.org.ala.fieldcapture.ReportController {

    def activityService

    static defaultAction = "dashboard"


    def gmsExportSummary() {

        if (!params.query) {
            params.query = '*'
        }
        params.type = 'outputSummary'
        def results = searchService.projectReports(params)

        GmsMapper mapper = new GmsMapper()

        response.setContentType('text/csv')
        mapper.toCsv(results.resp, response.getWriter())

        response.getWriter().flush()

    }

    def loadReport() {
        switch (params.report) {
            case 'greenArmy' :
                forward action: 'greenArmyReport', params:params
                break
            default:
                forward action: 'dashboardReport', params:params
                break
        }
    }

    def greenArmyReport() {

        def startDate = new DateTime(2014, 7 , 1, 0, 0)
        def endDate = new DateTime(2015, 7 , 2, 0, 0) // This is a workaround for a UTC vs local time.

        params.dates = buildDateGroupingCriteria(startDate, endDate, Period.months(1))
        def monthlySummary = searchService.report(params)

        // Remove the overflow buckets for now.  TODO may need to make this configurable or check for no data.
        if (monthlySummary.outputData && monthlySummary.outputData[0].group.startsWith("Before")) {
            monthlySummary.outputData.remove(0)
        }

        if (monthlySummary.outputData && monthlySummary.outputData[monthlySummary.outputData.size()-1].group.startsWith("After")) {
            monthlySummary.outputData.remove(monthlySummary.outputData.size()-1)
        }

        params.dates = buildDateGroupingCriteria(startDate, endDate, Period.months(3))
        def quarterlySummary = searchService.report(params)


        def reports = monthlyAndQuarterlyReports(startDate, endDate)
        render view:'_greenArmy', model:[monthlySummary:monthlySummary, quarterlySummary:quarterlySummary, adHocReports:adHocReport(startDate, endDate), monthlyActivities:reports.monthlyReports, quarterlyReports:reports.quarterlyReports, includeOrganisationName:params.includeOrganisationName?:false]

    }

    private List<String> buildDateGroupingCriteria(DateTime startDate, DateTime endDate, Period period) {
        List<String> dateRanges = []

        def date = startDate
        while (date.isBefore(endDate)) {
            dateRanges << DateUtils.format(date)
            date = date.plus(period)
        }
        return dateRanges
    }

    def monthlyAndQuarterlyReports(startDate, endDate) {

        def newParams = [max:1000] + params
        def results = searchService.fulltextSearch(newParams)
        def projects = results.hits?.hits?.collect{it._source}
        def projectIds = projects?.collect{it.projectId}

        def types = ['Green Army - Monthly project status report', 'Green Army - Quarterly project report']
        def criteria = [type: types, projectId: projectIds, dateProperty:'plannedEndDate', startDate : startDate.toDate(), endDate: endDate.toDate()]
        def resp = activityService.search(criteria)
        def activities = resp?.resp?.activities

        activities.each {activity ->
            def project = projects.find{it.projectId == activity.projectId}
            activity.grantId = project?.grantId
            activity.projectName = project?.name
            activity.organisationName = project?.organisationName
        }

        def activitiesByType = activities.groupBy{it.type}

        Map<Interval, List> monthlyActivitiesByPeriod = DateUtils.groupByDateRange(activitiesByType['Green Army - Monthly project status report'], {it.plannedEndDate}, Period.months(1), startDate)
        Map<String, List> activitiesByPeriodFormatted = monthlyActivitiesByPeriod.collectEntries {k,v -> [(DateUtils.formatSingleMonthInterval(k)):v]}

        Map<Interval, List> quarterlyActivitiesByPeriod = DateUtils.groupByDateRange(activitiesByType['Green Army - Quarterly project report'], {it.plannedEndDate}, Period.months(3), startDate)
        int quarter = 1
        def formattedQuarterlyReports = quarterlyActivitiesByPeriod.collectEntries{k,v -> [("Q"+quarter++):v]}
        return [monthlyReports:activitiesByPeriodFormatted, quarterlyReports:formattedQuarterlyReports]
    }


    def adHocReport(startDate, endDate) {

        // Find all activities of type ad hoc report as per the config.
        def newParams = [max:1000] + params
        def results = searchService.fulltextSearch(newParams)
        def projects = results.hits?.hits?.collect{it._source}
        def projectIds = projects?.collect{it.projectId}

        def types = params.adhocReportTypes ?: ['Green Army - Site Visit Checklist', 'Green Army - Desktop Audit Checklist', 'Green Army - Change or Absence of Team Supervisor']
        def criteria = [type: types, projectId: projectIds, dateProperty:'plannedEndDate', startDate : startDate.toDate(), endDate: endDate.toDate()]
        def resp = activityService.search(criteria)

        def activities = resp?.resp?.activities
        def groupedReports = activities.groupBy{it.projectId}

        def adHocReports = groupedReports.collect{k, v -> [projectId:k, grantId:projects.find{it.projectId == k}?.grantId, reports:v]}


        adHocReports

    }

}

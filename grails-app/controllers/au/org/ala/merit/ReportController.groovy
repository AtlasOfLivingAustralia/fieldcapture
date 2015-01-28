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

        Period period = Period.months(1)

        def dateRanges = []

        def date = startDate
        while (date.isBefore(endDate)) {
            dateRanges << DateUtils.format(date)
            date = date.plus(period)
        }

        params.dates = dateRanges

        def results = searchService.report(params)

        // Remove the overflow buckets for now.  TODO may need to make this configurable or check for no data.
        if (results.outputData && results.outputData[0].group.startsWith("Before")) {
            results.outputData.remove(0)
        }

        if (results.outputData && results.outputData[results.outputData.size()-1].group.startsWith("After")) {
            results.outputData.remove(results.outputData.size()-1)
        }

        println results.outputData ? (results.outputData as JSON).toString(true) : '{}'
        render view:'_greenArmy', model:[report:results, adHocReports:adHocReport(startDate, endDate), monthlyActivities:monthlyReports(startDate, endDate)]

    }

    def monthlyReports(startDate, endDate) {

        def newParams = [max:1000] + params
        def results = searchService.fulltextSearch(newParams)
        def projects = results.hits?.hits?.collect{it._source}
        def projectIds = projects?.collect{it.projectId}

        def types = ['Green Army - Monthly project status report']
        def criteria = [type: types, projectId: projectIds, dateProperty:'plannedEndDate', startDate : startDate.toDate(), endDate: endDate.toDate()]
        def resp = activityService.search(criteria)
        def activities = resp?.resp?.activities
        activities.each {activity ->
            def project = projects.find{it.projectId == activity.projectId}
            activity.grantId = project?.grantId
            activity.projectName = project?.name
        }
        Map<Interval, List> activitiesByPeriod = DateUtils.groupByDateRange(activities, {it.plannedEndDate}, Period.months(1), startDate)

        Map<String, List> activitiesByPeriodFormatted = activitiesByPeriod.collectEntries {k,v -> [(DateUtils.formatSingleMonthInterval(k)):v]}

        return activitiesByPeriodFormatted
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

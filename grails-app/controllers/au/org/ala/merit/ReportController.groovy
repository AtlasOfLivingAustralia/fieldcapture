package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils
import au.org.ala.fieldcapture.GmsMapper
import org.joda.time.DateTime
import org.joda.time.Interval
import org.joda.time.Period

class ReportController extends au.org.ala.fieldcapture.ReportController {

    def activityService, projectService, organisationService, commonService, statisticsFactory

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

    def announcementsReport() {

        def newParams = [max:1500] + params
        newParams.query = "docType:project"
        def results = searchService.allProjects(newParams, newParams.query)
        def projects = results.hits?.hits?.findAll{it._source.custom?.details?.events}.collect{it._source}

        def projectIds = projects?.collect{it.projectId}
        def resp = projectService.search([projectId:projectIds, view:'sites'])

        def organisations = organisationService.list()?.list

        def events = []
        resp?.resp?.projects.each { project ->
            if (project?.custom?.details?.events) {
                project.custom.details.events.each { event ->

                    def organisation = project.organisationId?organisations.find{it.organisationId == project.organisationId}:[:]
                    if (event.scheduledDate || event.name) {
                        def announcement = [projectId: project.projectId, grantId: project.grantId, name: project.name, organisationName: project.organisationName, associatedProgram: project.associatedProgram, associatedSubProgram:project.associatedSubProgram, planStatus: project.planStatus, eventDate: event.scheduledDate, eventName: event.name, eventDescription: event.description, type:event.type, funding: event.funding, grantAnnouncementDate:event.grantAnnouncementDate, organisationWebSite:organisation?.url?:'', contact:'']

                        def states = new HashSet()
                        def electorates = new HashSet()
                        def nrms = new HashSet()
                        project.sites.each {
                            if (it.extent?.geometry?.state) {
                                def state = it.extent?.geometry?.state
                                state = g.message(code: 'label.' + state, default: state)
                                states.add(state)
                            }
                            if (it.extent?.geometry?.elect) {
                                def electorate = it.extent?.geometry?.elect
                                electorate = g.message(code: 'label.' + electorate, default: electorate)
                                electorates.add(electorate)
                            }
                            if (it.extent?.geometry?.nrm) {
                                nrms.add(it.extent.geometry.nrm)
                            }
                        }
                        announcement.state = states.join(', ')
                        announcement.electorate = electorates.join(', ')
                        announcement.nrm = nrms.join(',')
                        events << announcement
                    }
                }
            }
        }

        render view:'_announcements', model:[events:events]
    }

    def greenArmyReport() {

        Integer financialYear = params.getInt('financialYear')
        if (!financialYear) {
            financialYear = defaultYearForReport()
        }

        def startDate = new DateTime(financialYear, 7 , 1, 0, 0)
        def endDate = new DateTime(financialYear+1, 7 , 2, 0, 0) // This is a workaround for a UTC vs local time.

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
        render view:'_greenArmy', model:
                [
                 availableYears:availableYears(),
                 financialYear:financialYear,
                 monthlySummary:monthlySummary,
                 quarterlySummary:quarterlySummary,
                 adHocReports:adHocReport(startDate, endDate),
                 monthlyActivities:reports.monthlyReports,
                 quarterlyReports:reports.quarterlyReports,
                 includeOrganisationName:params.includeOrganisationName?:false]

    }

    def outputTargetsReport() {
        def url = grailsApplication.config.ecodata.baseUrl + 'search/targetsReport' + commonService.buildUrlParamsFromMap(params)

        def results = cacheService.get("outputTargets-"+params, {
            webService.getJson(url, 300000)
        })

        def scores = [:]
        def distinctPrograms = new HashSet()
        results.targets.each { program, targets ->
            distinctPrograms.add(program)
            targets.each { score, target ->
                if (!scores[score]) {
                    scores[score] = [:]
                }
                if (!scores[score][program]) {
                    scores[score][program] = [:]
                }
                scores[score][program]['target'] = target
                def programOutputs = results.scores.outputData.find{it.group == program}
                if (programOutputs) {
                    def outputScore = programOutputs.results.find{it.score.label == score}
                    if (outputScore) {
                        if (outputScore.results) {
                            scores[score][program]['value'] = outputScore.results[0].result
                        }
                    }
                }
            }
        }
        def programsArray = new ArrayList(distinctPrograms)
        programsArray.sort()

        def scoresarray = []
        scores.each {score, programs ->
            if (score == 'projectCount') {
                return
            }
            def scoreDetails = [score:score]

            programsArray.each {
                def programTarget = programs[it]
                def target = programTarget?.target?.total ?: ''
                def progressToDate = programTarget?.value ?: ''
                scoreDetails[it+' - Target'] = target
                scoreDetails[it+' - Value'] = progressToDate
            }
            scoresarray << scoreDetails
        }

        render view:'_outputTargets', model:[programs:programsArray, scores:scoresarray]
    }

    private def defaultYearForReport() {
        def now = new DateTime()
        def cutoff = now.minusMonths(7)  // Default to the previous financial year for the first month of the new one.

        return cutoff.year
    }

    private List availableYears() {
        def availableYears = []
        int first = 2014
        int year = first
        int current = DateUtils.currentFinancialYear()
        while (year <= current) {
            availableYears << [label:"${year}/${year+1}", value:year]
            year++
        }
        availableYears
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
        def results = searchService.allProjects(newParams, newParams.query?:"docType:project")
        def projects = results.hits?.hits?.collect{it._source}
        def projectIds = projects?.collect{it.projectId}

        def types = ['Green Army - Monthly project status report', 'Green Army - Quarterly project report']
        def criteria = [type: types, projectId: projectIds, dateProperty:'plannedEndDate', startDate : startDate.toDate(), endDate: endDate.toDate()]
        def resp = activityService.search(criteria)
        def activities = resp?.resp?.activities ?: []

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
        def results = searchService.allProjects(newParams, newParams.query?:"docType:project")
        def projects = results.hits?.hits?.collect{it._source}
        def projectIds = projects?.collect{it.projectId}

        def types = params.adhocReportTypes ?: ['Green Army - Site Visit Checklist', 'Green Army - Desktop Audit Checklist', 'Green Army - Change or Absence of Team Supervisor']
        def criteria = [type: types, projectId: projectIds, dateProperty:'plannedEndDate', startDate : startDate.toDate(), endDate: endDate.toDate()]
        def resp = activityService.search(criteria)

        def activities = resp?.resp?.activities ?: []
        def groupedReports = activities.groupBy{it.projectId}

        def adHocReports = groupedReports.collect{k, v -> [projectId:k, grantId:projects.find{it.projectId == k}?.grantId, reports:v]}


        adHocReports

    }

    def statisticsReport() {
        int exclude = session.lastGroup?:-1
        def statistics = statisticsFactory.randomGroup(exclude)
        session.lastGroup = statistics.group
        render view:'_statistics', layout:'ajax', model:[statistics:statistics.statistics]
    }

}

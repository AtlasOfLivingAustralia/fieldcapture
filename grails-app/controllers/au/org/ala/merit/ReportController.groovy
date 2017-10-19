package au.org.ala.merit

import au.ala.org.ws.security.RequireApiKey
import au.org.ala.merit.command.ProjectSummaryReportCommand
import grails.converters.JSON
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.joda.time.Interval
import org.joda.time.Period
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter

import static au.org.ala.merit.DashboardTagLib.*

class ReportController {

    def webService, cacheService, searchService, metadataService, activityService, projectService, organisationService, commonService, statisticsFactory, reportService, userService

    static defaultAction = "dashboard"

    def loadReport() {
        forward action: params.report+'Report', params:params
    }

    def dashboardReport() {
        render view:'_dashboard', model:processActivityOutputs(params)
    }

    def activityOutputs() {

        def selectedCategory = params.remove('category')
        def model = processActivityOutputs(params)
        model.category = selectedCategory
        render view:'_activityOutputs', model:model
    }

    def processActivityOutputs(params) {

        def defaultCategory = "Not categorized"
        def categories = metadataService.getReportCategories()

        // The _ parameter is appended by jquery ajax calls and will stop the report contents from being cached.
        params.remove("_")
        params.remove('action') // We want the same parameters as the original call so we can use the cache.

        def results = searchService.dashboardReport(params)
        def scores = results.outputData

        def scoresByCategory = scores.groupBy{
            (it.category?:defaultCategory)
        }

        def doubleGroupedScores = [:]
        // Split the scores up into 2 columms for display.
        scoresByCategory.each { category, categoryScores ->

            categoryScores.sort{it.outputType}
            def previousOutput = ""
            def runningHeights = categoryScores.collect {
                def height = estimateHeight(it)
                if (it.outputType != previousOutput) {
                    height += 60 // Account for the output name header, padding etc.
                    previousOutput = it.outputType
                }
                height
            }
            def totalHeight = runningHeights.sum()
            def columns = [[], []]

            def runningHeight = 0
            // Iterating backwards to bias the left hand column.
            for (int i=0 ; i<categoryScores.size(); i++) {

                def idx = runningHeight <= (totalHeight/2) ? 0 : 1
                runningHeight += runningHeights[i]

                columns[idx] << categoryScores[i]
            }


            def columnsGroupedByOutput = [columns[0].groupBy{it.outputType}, columns[1].groupBy{it.outputType}]
            doubleGroupedScores.put(category, columnsGroupedByOutput)
        }
        if (scoresByCategory.keySet().contains(defaultCategory)) {
            categories << defaultCategory
        }

        def sortedCategories = []
        sortedCategories.addAll(categories)
        sortedCategories.sort()

        [categories:categories.sort(), scores:doubleGroupedScores, metadata:results.metadata]

    }



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

        def newParams = params.clone() + [max:1500]
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
                            addGeographicFacets(states, it.extent?.geometry?.state)
                            addGeographicFacets(electorates, it.extent?.geometry?.elect)
                            addGeographicFacets(nrms, it.extent?.geometry?.nrm)
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

    private addGeographicFacets(Set results, def source) {
        if (!source) {
            return
        }
        if (!(source instanceof List)) {
            source = [source]
        }
        source.each { facet ->
            String label = g.message(code: 'label.' + facet, default: facet)
            results.add(label)
        }
    }

    def performanceAssessmentSummaryReport() {

        String organisationId = params.organisationId

        List reports = reportService.findReportsForOrganisation(organisationId)

        reports = reports.findAll{it.progress == ActivityService.PROGRESS_FINISHED}.sort{it.fromDate}.reverse()

        if (reports.size()) {
            int index = 0
            int version = 2
            if (params.year) {
                int year = Integer.parseInt(params.year)
                version = year > 2016 ? 2 : 1
                reports.eachWithIndex{ Map report, int i ->
                    DateTime date = DateUtils.parse(report.toDate)
                    if (date.getYear() == year) {
                        index = i
                    }
                }
            }
            Map model = reportService.performanceReportModel(reports[index].reportId, version)
            model.years = reportYears(reports)
            model.year = params.year
            model.version = version

            if (reports.size() > index) {
                model.previousReport = reports[index+1]
            }
            render view:'_performanceAssessmentSummary', model:model
        }
        else {
            render view:'_noReportData'
        }
    }

    private Map reportForYear(int year, List reports) {
        int index = -1
        reports.eachWithIndex{ Map report, int i ->
            DateTime date = DateUtils.parse(report.toDate)
            if (date.getYear() == year) {
                index = i
            }
        }
        return index >= 0 ? reports[index] : null
    }

    private List reportYears(List reports) {
        List years = []


        reports.each { report ->
            DateTime date = DateUtils.parse(report.toDate)
            if (!years.contains(date.getYear())) {
                years << date.getYear()
            }
        }

        years
    }

    def performanceAssessmentComparisonReport() {

        List years = []
        int firstYear = 2015
        DateTime date = new DateTime()

        while (date.getYear() >= firstYear) {
            years << date.getYear()
            date = date.minusYears(1)
        }

        String organisationId = params.organisationId

        List states = ['', 'ACT / NSW', 'VIC', 'WA / NT', 'SA', 'TAS', 'QLD']

        if (userService.userIsAlaOrFcAdmin() && !organisationId) {
            states = ['', 'ACT',  'NSW', 'VIC', 'WA', 'NT', 'SA', 'TAS', 'QLD']
        }

        String state = params.state ?: ""
        int year = params.year ? Integer.parseInt(params.year) : years[0]

        Map comparison = reportService.performanceReport(year, state)

        Map resultsForState
        if (state == 'ACT / NSW') {
            resultsForState = mergeResults("ACT", "NSW", comparison.resp?.groups)
        }
        else if (state == 'WA / NT') {
            resultsForState = mergeResults("WA", "NT", comparison.resp?.groups)
        }
        else {
            resultsForState = comparison.resp?.groups?.find{it.group == state} ?: [:]
        }

        List reports = []
        String reportId = null
        if (organisationId) {
            reports = reportService.findReportsForOrganisation(organisationId)
            reports = reports.findAll{it.progress == 'finished'}.sort{it.fromDate}.reverse()
            if (reports) {
                Map report = reportForYear(year, reports)
                reportId = report ? report.reportId : ''
            }
        }

        int version = year > 2016 ? 2 : 1
        Map model = reportService.performanceReportModel(reportId, version)
        model.years = reportYears(reports)
        model.results = resultsForState?.results ?: [:]
        model.states = states
        model.years = years
        model.state = state
        model.year = year
        model.version = version
        render view:'_performanceAssessmentComparison', model:model
    }

    private Map mergeResults(String state1, String state2, List results) {
        Map state1Results = results.find{it.group == state1} ?: [:]
        Map state2Results = results.find{it.group == state2} ?: [:]

        Set keys = state1Results.keySet() + state2Results.keySet()

        Map merged = [:]
        keys.each { key ->
            if (state1Results[key] && state2Results[key]) {
                merged[key] = state1Results[key] + state2Results[key]
            }
            else if (state1Results[key]) {
                merged[key] = state1Results[key]
            }
            else if (state2Results[key]) {
                merged[key] = state2Results[key]
            }
        }
        merged

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
        def results = searchService.outputTargetsReport(params)

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
                def programOutputs = results?.scores?.outputData?.groups?.find{it.group == program}
                if (programOutputs) {
                    def outputScore = programOutputs.results.find{it.label == score}
                    if (outputScore) {
                        if (outputScore.result) {
                            scores[score][program]['value'] = outputScore.result
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

    private List availableYears(int first = 2014) {
        def availableYears = []
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

    def update(String id) {
        Map report = request.JSON

        Map result = reportService.update(report)

        render result as JSON
    }

    /**
     * Provides a way for the pdf generation service to callback into MERIT without requiring user credentials.
     * (It uses an IP filter / API Key instead).
     */
    @RequireApiKey
    def projectReportCallback(String id, ProjectSummaryReportCommand projectSummaryReportCommand) {

        Map model = projectSummaryReportCommand()
        model.printable = 'pdf'

        render view:'/project/projectReport', model: model
    }

    /**
     * Provides a way for the pdf generation service to callback into MERIT without requiring user credentials.
     * (It uses an IP filter / API Key instead).
     */
    @RequireApiKey
    def meriPlanReportCallback(String id) {
        Map project = projectService.get(id, 'all')
        render view:'/project/meriPlanReadOnly', model:[project:project, themes:metadataService.getThemesForProject(project), user:[isAdmin:true]]
    }


    private List availablePeriods(int startYear, Period period) {

        List availablePeriods = []
        DateTime first = DateUtils.parse(startYear+"-01-01T00:00:00Z").withZone(DateTimeZone.UTC)
        DateTime now = DateUtils.now().withZone(DateTimeZone.UTC)

        DateTimeFormatter formatter = DateTimeFormat.forPattern("MMM-yyyy").withZone(DateTimeZone.UTC)
        DateTime current = DateUtils.alignToPeriod(now, period)
        while (current.isAfter(first)) {
            DateTime periodStart = current.minus(period)
            String label = formatter.print(periodStart) + " - " + formatter.print(current)
            String value = DateUtils.format(periodStart) + ',' + DateUtils.format(current)
            availablePeriods << [label:label, value:value]

            current = periodStart
        }
        availablePeriods
    }

    def reef2050PlanActionReport() {

        boolean approvedOnly = !(params.includeUnapproved && userService.userIsAlaOrFcAdmin())
        Map model = reportService.reef2050PlanActionReport(approvedOnly)

        Map actionStatusCounts = model.actionStatus?.result?.result ?: [:]
        mergeCompletedOrInPlaceCategories(actionStatusCounts)

        model.actionStatusByTheme.each { k, v ->
            mergeCompletedOrInPlaceCategories(v?.result?.result)
        }
        // The colours are defined here instead of CSS because they need to be supplied as strings to the chart
        // which is generated by a taglib.
        model.status = [
            [title:"Completed or in place", description:"<strong>are completed or in place</strong> (implementation is full completed OR initial implementation has been completed, but part of the action is ongoing)", countColour:"#4fac52", descriptionColour: "#b8d6af"],
            [title:"On track / Underway", description:"<strong>are on track/underway</strong> (implementation is meeting expected milestones and progress is being made)", countColour:"#BECC48", descriptionColour: "#E2EAB1"],
            [title:"Delayed or limited progress", description:"<strong>are delayed/limited progress</strong> (major implementation milestones have been delayed by less than 6 months, or only superficial progress has been made)", countColour:"#FDCC5B", descriptionColour: "#FDECBA"],
            [title:"Significant delays or no progress", description:"<strong>are significant delays or no progress</strong> (major implementation milestones have been delayed for longer than six months or no progress has been made)", countColour:"#D02431", descriptionColour: "#EAA795"],
            [title:"Not yet due", description:"<strong>are not yet due</strong> (implementation is not yet due to commence)", countColour:"#8C8C8C", descriptionColour: "#CCCCCC"]
        ]

        model.statusColours = [:]
        model.status.each { status ->
            status.count = actionStatusCounts[status.title]?:0
            model.statusColours[status.title] = status.countColour
        }

        model
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

}

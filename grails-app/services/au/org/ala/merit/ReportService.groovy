package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils
import grails.converters.JSON
import org.joda.time.Period


class ReportService {

    def grailsApplication
    def webService
    def userService
    def projectService
    def authService
    def searchService
    def commonService
    def documentService
    def metadataService

    private static int DEFAULT_REPORT_DAYS_TO_COMPLETE = 43

    /**
     * This method supports automatically creating reporting activities for a project that re-occur at defined intervals.
     * e.g. a stage report once every 6 months or a green army monthly report once per month.
     * Activities will only be created when no reporting activity of the correct type exists within each period.
     * @param projectId identifies the project.
     * @param config List of [type:<activity type>, period:<period that must have a reporting activity>
     * @return
     */
    def regenerateAllStageReportsForProject(projectId, periodInMonths = 6, alignToCalendar = false) {

        def project = projectService.get(projectId, 'all')
        def programConfig = metadataService.getProgramConfiguration(project.associatedProgram, project.associatedSubProgram)
        def period = Period.months(periodInMonths)

        def reports = getReportsForProject(projectId).sort{it.toDate}

        def startDate = DateUtils.parse(project.plannedStartDate)
        def endDate = DateUtils.parse(project.plannedEndDate)

        def periodStartDate = null
        def stage = 1
        for (int i=reports.size()-1; i>0; i--) {
            if (reports[i].publicationStatus == 'submitted' || reports[i].publicationStatus == 'approved') {
                periodStartDate = reports[i].toDate
                stage = i+1
            }
        }

        if (!periodStartDate) {
            periodStartDate = startDate

            if (alignToCalendar) {
                periodStartDate = DateUtils.alignToPeriod(periodStartDate, period)
            }

        }

        while (periodStartDate < endDate) {
            def periodEndDate = periodStartDate.plus(period)

            def report = [
                    fromDate:DateUtils.format(periodStartDate),
                    toDate:DateUtils.format(periodEndDate),
                    type:'Activity',
                    projectId:projectId,
                    name:'Stage '+stage,
                    description:'Stage '+stage+' for '+project.name
            ]
            if (programConfig.weekDaysToCompleteReport) {
                report.dueDate = DateUtils.format(periodEndDate.plusDays(programConfig.weekDaysToCompleteReport))
            }

            if (reports.size() >= stage) {
                report.reportId = reports[stage-1].reportId
                update(report)
            }
            else {
                create(report)
            }
            stage++
            periodStartDate = periodEndDate
        }

        // Delete any left over reports.
        for (int i=stage-2; i<reports.size(); i++) {
            delete(reports[i].reportId)
        }
    }

    def delete(String reportId) {
        if (!reportId) {
            throw new IllegalArgumentException("Missing parameter reportId")
        }
        webService.doDelete(grailsApplication.config.ecodata.baseUrl+"report/${reportId}")
    }

    def getReportsForProject(String projectId) {
        webService.getJson(grailsApplication.config.ecodata.baseUrl+"project/${projectId}/reports")
    }

    def getReportingHistoryForProject(String projectId) {
        def reports = getReportsForProject(projectId)

        def history = []
        reports.each { report ->

            report.statusChangeHistory.each { change ->
                def changingUser = authService.getUserForUserId(change.changedBy)
                def displayName = changingUser?changingUser.displayName:'unknown'
                history << [name:report.name, date:change.dateChanged, who:displayName, status:change.status]
            }
        }
        history.sort {it.dateChanged}
        history
    }

    def submit(String reportId) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/submit/${reportId}", [:])
    }

    def approve(String reportId) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/approve/${reportId}", [:])
    }

    def reject(String reportId) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/returnForRework/${reportId}", [:])
    }

    def create(report) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/", report)
    }

    def update(report) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/"+report.reportId, report)
    }

    def findReportsForUser(String userId) {

        def reports = webService.doPost(grailsApplication.config.ecodata.baseUrl+"user/${userId}/reports", [:])


        if (reports.resp && !reports.error) {
            return reports.resp.projectReports.groupBy{it.projectId}
        }

    }

    public Number filteredProjectCount(List<String> filter, String searchTerm) {
        def result = searchService.allProjects([fq:filter], searchTerm)
        result?.hits?.total ?: 0
    }

    public Map<String, Number> filteredInvestment(List<String> filter, String searchTerm = null, String investmentType = null) {

        int BATCH_SIZE = 100
        def result = searchService.allProjects([fq:filter], searchTerm)
        BigDecimal dollarsInvested = new BigDecimal(0)
        int count = result?.hits?.total ?: 0
        int matchCount = 0
        int processed = 0
        while (processed < count) {
            result.hits.hits?.each { hit ->

                def budget = hit._source.custom?.details?.budget
                if (budget) {
                    if (investmentType) {
                        def investmentRow = budget.rows.find { it.shortLabel == investmentType }
                        if (investmentRow) {
                            dollarsInvested += (investmentRow.rowTotal as BigDecimal)
                            matchCount++
                        }
                    }
                    else {
                        dollarsInvested += budget.overallTotal as BigDecimal
                        matchCount++
                    }
                }
                processed++

            }
            result = searchService.allProjects([fq:filter, offset:processed, max:BATCH_SIZE])
        }
        [count:matchCount, investment:dollarsInvested]
    }

    public Map<String, Number> getNumericScores(List<String> scores, List<String> filter = null) {

        def results = searchService.reportOnScores(scores,filter)

        Map<String, Number> values = scores.collectEntries { score ->
            def result = results.outputData?.find {it.groupTitle == score}
            def value = 0
            if (result && result.results) {
                value = result.results[0].result
            }
            [(score):(value as Number)]
        }
        values
    }

    public Number getNumericScore(String score, List<String> filter = null) {

        def results = searchService.reportOnScores([score], filter)

        def result = results.outputData?.find {it.groupTitle == score}
        def value = 0
        if (result && result.results) {
            value = result.results[0].result
        }
        value as Number

    }

    public Number filterGroupedScore(String score, String groupToFilter, List<String> filters = null) {
        def results = searchService.reportOnScores([score], filters)
        def value = 0
        if (results.outputData && results.outputData[0].results) {
            def result = results.outputData[0].results.find{it.group == groupToFilter}
            if (result) {
                value = result.result
            }
            else {
                def section = results.outputData[0].results.find{it.result && it.result[groupToFilter]}
                if (section && section.result[groupToFilter]) {
                    value = section.result[groupToFilter]
                }
            }
        }
        value
    }

    public Number outputTarget(String scoreLabel, List<String> filters) {
        def reportParams = [scores:scoreLabel]
        if (filters) {
            reportParams.fq = filters
        }
        def url = grailsApplication.config.ecodata.baseUrl + 'search/targetsReportByScoreLabel' + commonService.buildUrlParamsFromMap(reportParams)
        def results = webService.getJson(url, 300000)
        if (!results || !results.targets) {
            return 0
        }
        BigDecimal result = new BigDecimal(0)
        results.targets.each {k, v ->
            if (v[scoreLabel]) {
                result = result.plus(new BigDecimal(v[scoreLabel].total))
            }
        }
        return result
    }

    def findHomePageNominatedProjects(Integer max = 10, Integer offset = 0, Boolean omitSource = false) {
        Map searchParams = [max:max, offset:offset, sort:'lastUpdated', order:'desc']
        if (omitSource) {
            searchParams.omitSource = true
        }
        def queryString =  "custom.details.caseStudy:true OR promoteOnHomePage:true"
        searchService.allProjects(searchParams, queryString)
    }

    Map findPotentialHomePageImages(Integer max = 10, Integer offset = 0) {

        def projectIds = findHomePageNominatedProjects(10000, 0, true)?.hits.hits.collect{it._id}

        def criteria = [
                type:'image',
                public:true,
                thirdPartyConsentDeclarationMade: true,
                max:max,
                offset:offset,
                projectId:projectIds,
                sort:'dateCreated',
                order:'desc'
        ]
        documentService.search(criteria)
    }

    List homePageImages() {
        def max = 5
        def criteria = [
                type:'image',
                public:true,
                thirdPartyConsentDeclarationMade: true,
                max:1,
                offset:0,
                labels:'hp-y'
        ]

        def count = documentService.search(criteria).count
        criteria.offset = (int)Math.floor(Math.random()*count)
        criteria.max = max
        criteria.offset = Math.min(criteria.offset, count-max)
        def images = documentService.search(criteria).documents ?: []

        def projectIds = images.collect {it.projectId}
        def projects = projectService.search([projectId:projectIds])?.resp?.projects ?: []

        images.collect {[name:it.name, attribution:it.attribution, projectName:projects.find{project -> it.projectId == project.projectId}?.name?:'', url:it.url, projectId:it.projectId]}
    }
}

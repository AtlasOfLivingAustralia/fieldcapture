package au.org.ala.merit

import au.org.ala.merit.reports.ReportConfig
import au.org.ala.merit.reports.ReportGenerator
import au.org.ala.merit.reports.ReportOwner
import grails.converters.JSON
import org.apache.commons.io.FilenameUtils
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.joda.time.Days
import org.joda.time.Interval
import org.joda.time.Period
import org.springframework.cache.annotation.Cacheable

import java.text.DecimalFormat
import java.util.regex.Matcher


class ReportService {

    public static final String REPORT_APPROVED = 'published'
    public static final String REPORT_SUBMITTED = 'pendingApproval'
    public static final String REPORT_NOT_APPROVED = 'unpublished'

    public static final int HOME_PAGE_IMAGE_SIZE = 500

    public static final String REPORT_TYPE_SINGLE_ACTIVITY = 'Single'
    public static final String REPORT_TYPE_STAGE_REPORT = 'Activity'
    public static final String REPORT_TYPE_ADJUSTMENT = 'Adjustment'

    static enum ReportMode {
        VIEW,
        EDIT,
        PRINT
    }

    def grailsApplication
    def webService
    def userService
    def projectService
    def authService
    def searchService
    def commonService
    def documentService
    def metadataService
    def activityService
    def imageService
    def grailsLinkGenerator
    def emailService

    void regenerateReports(List existingReports, ReportConfig reportConfig, ReportOwner reportOwner, int startFromReportIndex) {

        int index = startFromReportIndex
        DateTime latestApprovedReportPeriodEnd = null
        if (index >= 0) {
            latestApprovedReportPeriodEnd = DateUtils.parse(existingReports[index].toDate)
        }
        index++ // Start at the report after the submitted/approved one (or index 0 if none was found)

        int sequenceNo = index + 1
        List reports = new ReportGenerator().generateReports(reportConfig, reportOwner, sequenceNo, latestApprovedReportPeriodEnd)

        for (Map report: reports) {
            // Update or create new reports
            if (existingReports.size() > index) {
                report.reportId = existingReports[index].reportId
                // Only do the update if the report details have changed.
                if (needsRegeneration(report, existingReports[index])) {
                    regenerateReport(report, existingReports[index])
                }
            }
            else {
                log.info("Creating report "+report.name)
                create(report)
            }
            index++

        }

        // Delete any left over reports.
        for (int i=index; i<existingReports.size(); i++) {
            log.info("Deleting report " + existingReports[i].name)
            delete(existingReports[i].reportId)
        }
    }

    void regenerateReport(Map report, Map existingReport) {
        log.info("name: " + existingReport.name + " - " + report.name)
        log.info("fromDate: " + existingReport.fromDate + " - " + report.fromDate)
        log.info("toDate: " + existingReport.toDate + " - " + report.toDate)
        if (isSubmittedOrApproved(existingReport)) {

            boolean approved = isApproved(existingReport)
            String reason = "Changing project start date"
            reject(existingReport.reportId, "Dates change", reason)

            update(report)

            if (report.adjustedBy) {
                Map adjustment = search(adjustedReportId:report.reportId)
                if (adjustment) {
                    // Only update the dates for the adjustment report.
                    regenerateReport([fromDate:report.fromDate, toDate:report.toDate], adjustment)
                }
            }

            submit(existingReport.reportId)
            if (approved) {
                approve(existingReport.reportId, reason)
            }
        }
        else {
            update(report)
        }
    }

    void regenerateReports(List existingReports, ReportConfig reportConfig, ReportOwner reportOwner) {
        // Ensure the reports are sorted in Date order
        existingReports = (existingReports?:[]).sort{it.toDate}

        int index = existingReports.findLastIndexOf {isSubmittedOrApproved(it)}

        regenerateReports(existingReports, reportConfig, reportOwner, index)

    }

    boolean needsRegeneration(Map report1, Map report2) {
        return report1.fromDate != report2.fromDate ||
               report1.toDate != report2.toDate ||
               report1.name != report2.name ||
               report1.description != report2.description ||
               report1.type != report2.type ||
               report1.activityType != report2.activityType ||
               report1.category != report2.category ||
               report1.submissionDate != report2.submissionDate
    }

    /**
     * Returns true if any report in the supplied list has been submitted or approval or approved.
     * @param reports the List of reports to check
     * @return true if any report in the supplied list has been submitted or approval or approved.
     */
    boolean includesSubmittedOrApprovedReports(List reports) {
        return (reports?.find {isSubmittedOrApproved(it)} != null)
    }

    boolean isSubmittedOrApproved(Map report) {
        return report.publicationStatus == REPORT_SUBMITTED || report.publicationStatus == REPORT_APPROVED
    }

    boolean isApproved(Map report) {
        return report.publicationStatus == REPORT_APPROVED
    }

    List search(Map criteria) {
        Map result = webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/search", criteria)
        result?.resp ?: []
    }

    /**
     * Returns the report with the supplied id as a Map.
     * @param reportId the reportId of the report to get.
     */
    Map get(String reportId) {
        if (!reportId) {
            throw new IllegalArgumentException("Missing parameter reportId")
        }
        Map report = webService.getJson(grailsApplication.config.ecodata.baseUrl+"report/${reportId}")
        report
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

    Map lockForEditing(Map report) {
        if (!report.activityId) {
            throw new IllegalArgumentException("No activity associated with the supploied report")
        }
        activityService.lock(report.activityId)
    }

    /**
     * This only works for single activity reports as we check the report progress.
     * @param report the report to check.
     * @return
     */
    boolean hasData(Map report) {
        if (!report.type == REPORT_TYPE_SINGLE_ACTIVITY) {
            throw new IllegalArgumentException("Only reports of type ${REPORT_TYPE_SINGLE_ACTIVITY} can be tested")
        }
        return activityService.isStartedOrFinished([progress:report.progress])
    }
    
    /**
     * Submits a report and sends an email notifying relevant users this action has occurred.
     * @param reportId The id of the report to submit.
     * @param reportActivityIds The ids of the activities associated with the report.
     * @param reportOwner Properties of the entity that "owns" the report (e.g. the Project, Organisation, Program).
     * @param ownerUsersAndRoles Users to be notified of the action.
     * @param emailTemplate The template to use when sending the email
     */
    Map submitReport(String reportId, List reportActivityIds, Map reportOwner, List ownerUsersAndRoles, EmailTemplate emailTemplate) {

        Map validationResult = validateActivites(reportActivityIds)
        if (validationResult.error) {
            return [success:false, error:validationResult.error]
        }

        Map resp = submit(reportId)
        Map report = get(reportId)

        if (!resp.error) {
            activityService.submitActivitiesForPublication(reportActivityIds)
            emailService.sendEmail(emailTemplate, [reportOwner:reportOwner, report:report], ownerUsersAndRoles, RoleService.PROJECT_ADMIN_ROLE)
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }


    Map validateActivites(List reportActivityIds) {
        List allowedStates = [ActivityService.PROGRESS_FINISHED, ActivityService.PROGRESS_DEFERRED, ActivityService.PROGRESS_CANCELLED]
        Map searchResult = activityService.search([activityId:reportActivityIds])

        List activities = searchResult?.resp?.activities
        Map result = [:]
        if (!activities || (activities.size() != reportActivityIds.size())) {
            result.error = 'Invalid activity ids specified '+reportActivityIds
        }
        else if (!activities.every{it.progress in allowedStates}) {
            result.error = 'All activities must be finished, deferred or cancelled'
        }

        return result
    }

    def submit(String reportId) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/submit/${reportId}", [:])
    }

    /**
     * Approves a report and sends an email notifying relevant users this action has occurred.
     * @param reportId The id of the report to approve.
     * @param reportActivityIds The ids of the activities associated with the report.
     * @param reason an optional reason given with the approval
     * @param reportOwner Properties of the entity that "owns" the report (e.g. the Project, Organisation, Program).
     * @param ownerUsersAndRoles Users to be notified of the action.
     * @param emailTemplate The template to use when sending the email
     */
    Map approveReport(String reportId,  List reportActivityIds, String reason, Map reportOwner, List ownerUsersAndRoles, EmailTemplate emailTemplate) {

        Map resp = approve(reportId, reason)
        Map report = get(reportId)

        if (!resp.error) {
            activityService.approveActivitiesForPublication(reportActivityIds)
            emailService.sendEmail(emailTemplate, [reportOwner:reportOwner, report:report, reason:reason], ownerUsersAndRoles, RoleService.GRANT_MANAGER_ROLE)
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

    def approve(String reportId, String reason) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/approve/${reportId}", [comment:reason])
    }

    /**
     * Rejects/returns a report and sends an email notifying relevant users this action has occurred.
     * @param reportId The id of the report to reject.
     * @param reportActivityIds The ids of the activities associated with the report.
     * @param reportOwner Properties of the entity that "owns" the report (e.g. the Project, Organisation, Program).
     * @param ownerUsersAndRoles Users to be notified of the action.
     * @param emailTemplate The template to use when sending the email
     */
    Map rejectReport(String reportId, List reportActivityIds, String reason, Map reportOwner, List ownerUsersAndRoles, EmailTemplate emailTemplate) {

        Map resp = reject(reportId, "", reason)
        Map report = get(reportId)

        if (!resp.error) {
            activityService.rejectActivitiesForPublication(reportActivityIds)
            emailService.sendEmail(emailTemplate, [reportOwner:reportOwner, report:report, reason:reason], ownerUsersAndRoles, RoleService.GRANT_MANAGER_ROLE)
        }
        else {
            return [success:false, error:resp.error]
        }
        return [success:true]
    }

    /**
     * Creates a report to offset the scores produced by the supplied report without having to unapprove the original report and edit the data.
     * @param reportId the report that needs adjustment
     * @param reason the reason for the adjustment.
     * @param config the configuration associated with the project / program the report is for.
     * @return a Map containing the result of the adjustment, including a error key it if failed.
     */
    Map createAdjustmentReport(String reportId, String reason, ProgramConfig config, Map reportOwner, List ownerUsersAndRoles, EmailTemplate emailTemplate) {

        Map result
        Map toAdjust = get(reportId)

        ReportConfig reportConfig = config.findProjectReportConfigForReport(toAdjust)

        if (reportConfig && reportConfig.isAdjustable()) {
            String url = grailsApplication.config.ecodata.baseUrl+"report/adjust/${reportId}"
            result = webService.doPost(url, [comment:reason, adjustmentActivityType:reportConfig.adjustmentActivityType])

            if (result && !result.error) {
                Map adjustmentReport = result.resp
                emailService.sendEmail(emailTemplate, [reportOwner:reportOwner, report:toAdjust, adjustmentReport:adjustmentReport, reason:reason], ownerUsersAndRoles, RoleService.GRANT_MANAGER_ROLE)
            }
            else {
                result = [error:result.error]
            }
        }
        else {
            result = [error:'This report cannot be adjusted']
        }

        return result
    }

    Map scoresForActivity(String projectId, String activityId, List<String> scoreIds = null) {
        Map filter = [type:'discrete', filterValue: activityId, property:'activity.activityId']

        String url =  grailsApplication.config.ecodata.baseUrl+"project/projectMetrics/"+projectId

        Map params = [aggregationConfig: filter, approvedOnly:false, includeTargets: false]
        if (scoreIds) {
            params.scoreIds = scoreIds
        }
        Map report = webService.doPost(url, params)

        if (report.resp && report.resp[0]) {
            // Unpack the grouping information included by the filter.
            report = [scores:report.resp[0]?.results]
        }

        return report
    }


    Map dateHistogramForScores(String projectId, DateTime startDate, DateTime endDate, Period period, String format, List<String> scoreIds) {

        Map dateGrouping = dateHistogramGroup(startDate, endDate, period, format)

        String url =  grailsApplication.config.ecodata.baseUrl+"project/projectMetrics/"+projectId

        Map params = [aggregationConfig: dateGrouping, approvedOnly:false, scoreIds: scoreIds, includeTargets:false]

        Map report = webService.doPost(url, params)

        return report
    }

    Map dateHistogramGroup(DateTime startDate, DateTime endDate, Period period, String format = 'YYYY') {


        DateTime date = startDate
        List dateBuckets = [DateUtils.format(date)]
        while (date.isBefore(endDate)) {
            date = date.plus(period)
            dateBuckets.add(DateUtils.format(date))
        }

        [type:'date', buckets:dateBuckets, format:format, property:'activity.plannedEndDate']

    }

    def reject(String reportId, String category, String reason) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/returnForRework/${reportId}", [comment:reason, category:category])
    }

    def create(report) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/", report)
    }

    def update(report) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/"+report.reportId, report)
    }

    Map reset(String reportId) {
        Map report = get(reportId)
        if (isSubmittedOrApproved(report)) {
            return [success:false, error:"Cannot delete data for an approved or submitted report"]
        }

        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/reset/"+report.reportId, [:])
    }

    def findReportsForUser(String userId) {

        def reports = webService.doPost(grailsApplication.config.ecodata.baseUrl+"user/${userId}/reports", [:])


        if (reports.resp && !reports.error) {
            return reports.resp.projectReports.groupBy{it.projectId}
        }

    }

    def findReportsForOrganisation(String organisationId) {

        def reports = webService.doPost(grailsApplication.config.ecodata.baseUrl+"organisation/${organisationId}/reports", [:])

        if (reports.resp && !reports.error) {
            return reports.resp
        }
        return []
    }

    def findReportsForProgram(String programId) {

        def reports = webService.doPost(grailsApplication.config.ecodata.baseUrl+"program/${programId}/reports", [:])

        if (reports.resp && !reports.error) {
            return reports.resp
        }
        return []
    }

    def findReportsForManagementUnit(String managementUnitId) {

        def reports = webService.doPost(grailsApplication.config.ecodata.baseUrl+"managementUnit/${managementUnitId}/reports", [:])

        if (reports.resp && !reports.error) {
            return reports.resp
        }
        return []
    }

    def findReportPeriodsOfManagmentUnit(){
        int[] reportPeriods = webService.getJson(grailsApplication.config.ecodata.baseUrl+"managementunit/getReportPeriods")

        return reportPeriods

    }




    /**
     * Returns the report that spans the period including the supplied date
     * @param isoDate an ISO8601 formatted date string.
     * @param reports the reports to check.
     */
    Map findReportForDate(String isoDate, List<Map> reports) {
        reports.find{it.fromDate < isoDate && it.toDate >= isoDate}
    }

    Map firstReportWithDataByCriteria(List allReports, Closure criteria) {
        Map firstReportWithData = allReports?.findAll{hasData(it)}.min(criteria)
        Map firstSubmittedOrApprovedReport = allReports?.findAll{isSubmittedOrApproved(it)}.min(criteria)


        [firstReportWithData, firstSubmittedOrApprovedReport].findAll()?.min(criteria)
    }

    Map lastReportWithDataByCriteria(List allReports, Closure criteria) {
        Map lastReportWithData = allReports?.findAll{hasData(it)}.max(criteria)
        Map lastSubmittedOrApprovedReport = allReports?.findAll{isSubmittedOrApproved(it)}.max(criteria)


        [lastReportWithData, lastSubmittedOrApprovedReport].findAll()?.min(criteria)
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

        def result = results.outputData?.find {it.label == score}
        def value = 0
        if (result) {
            value = result.result?.result ?: 0
        }
        value as Number

    }

    public Number filterGroupedScore(String score, String groupToFilter, List<String> filters = null) {
        def results = searchService.reportOnScores([score], filters)
        def value = 0
        if (results.outputData && results.outputData[0].result?.groups) {
            def result = results.outputData[0].result.groups.find{it.group == groupToFilter}
            if (result) {
                value = result.results[0].result
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

    /**
     * Queries ecodata for all output targets and aggregration results from all projects that match the supplied filters for the
     * metrics defined by the supplied scoreIds.
     * @param scoreIds Specifies which scores are of interest.
     * @param filters Query filters to select projects.
     * @param approvedActivitiesOnly true if only approved activities should be included in the results.
     * @return a Map of the form:
     * [
     *  metadata:
     *         project: <number of projects included in the scoring>
     *         sites: <number of sites counted>
     *         activities: <number of activities included in the scoring>
     *         activitiesByType: <map of activity type and count of number of activities of that type>
     *  scores: [
     *      scoreId: <id of the score>
     *           result:
     *             result: <score / sum>
     *             count: <count of number of outputs considered in the result>
     *             label: <score label>
     *      target: <the sum of output targets for this score over all selected projects>
     *
     *  ]
     * ]
     * Note that the metadata only relates to the data used to aggregate any activity data in the scores, not the output targets.
     *
     */
    Map targetsForScoreIds(List<String> scoreIds, List<String> filters, boolean approvedActivitiesOnly = true) {
        Map reportParams = [scoreIds: scoreIds, approvedActivitiesOnly: approvedActivitiesOnly]
        if (filters) {
            reportParams.fq = filters
        }
        def url = grailsApplication.config.ecodata.baseUrl + 'search/targetsReportForScoreIds' + commonService.buildUrlParamsFromMap(reportParams)
        Map results = webService.getJson(url, 300000)
        if (!results || !results.targets || results.error) {
            return [scores:scoreIds.collect{[scoreId:it]}, metadata:[:]]
        }
        List scoresWithTargets = mergeScoresAndTargets(scoreIds, results)
        return [scores:scoresWithTargets, metadata:results.metadata]
    }

    /**
     * Accepts a Map of the form:
     * * [
     *     targets:
     *       (program - subprogram):
     *          (scoreLabel):
     *            scoreId: <Id of the score>
     *            total: <sum of output targets for the score>
     *            count: <number of projects summed>
     *     scores:
     *       metadata:
     *         project: <number of projects included in the scoring>
     *         sites: <number of sites counted>
     *         activities: <number of activities included in the scoring>
     *         activitiesByType: <map of activity type and count of number of activities of that type>
     *       outputData: [ <array of considered scores>
     *           scoreId: <id of the score>
     *           result:
     *             result: <score / sum>
     *             count: <count of number of outputs considered in the result>
     *             label: <score label>
     *       ]
     * ]
     *
     * and returns a list containing the contents of the outputData array with and additional target field
     * which has been matched by score id from the targets key in the Map.
     */
    private List mergeScoresAndTargets(List scoreIds, Map scoresAndTargets) {
        List scoreData = scoresAndTargets.scores?.outputData

        List results = []
        scoreIds.each { scoreId ->
            Map score = scoreData?.find{it.scoreId == scoreId} ?: [scoreId:scoreId]
            scoresAndTargets.targets?.each { program, Map scoreTargets ->
                Map scoreTarget = scoreTargets?.values()?.find { it.scoreId == scoreId }
                score.target = scoreTarget?.total ?: 0
            }
            results << score
        }

        results
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

    Map findPotentialHomePageImages(Integer max = 10, Integer offset = 0, String sort = 'dateCreated') {

        def projectIds = findHomePageNominatedProjects(10000, 0, true)?.hits.hits.collect{it._id}

        def criteria = [
                type:'image',
                "public":true,
                thirdPartyConsentDeclarationMade: true,
                max:max,
                offset:offset,
                projectId:projectIds,
                sort:sort,
                order:'desc'
        ]
        documentService.search(criteria)
    }

    @Cacheable('homePageImages')
    List homePageImages() {
        def max = 5
        def criteria = [
                type:'image',
                "public":true,
                thirdPartyConsentDeclarationMade: true,
                max:1,
                offset:0,
                labels:'hp-y'
        ]

        def count = documentService.search(criteria).count?: max

        criteria.offset = (int)Math.floor(Math.random()*count)
        criteria.max = max
        criteria.offset = Math.min(criteria.offset, count-max)
        def images = documentService.search(criteria).documents ?: []

        def projectIds = images.collect {it.projectId}
        def projects = projectService.search([projectId:projectIds])?.resp?.projects ?: []

        images.each { document ->
            Map thumbDetails = createCustomThumbnail(document)
            if (thumbDetails.thumbnailFile.exists()) {
                document.url = grailsLinkGenerator.link(controller: 'image', id:thumbDetails.fileName)
            }
        }

        images.collect {[name:it.name, attribution:it.attribution, projectName:projects.find{project -> it.projectId == project.projectId}?.name?:'', url:it.url, projectId:it.projectId]}
    }

    private Map createCustomThumbnail(Map document) {
        String thumbName = document.documentId+'-thumb-500.'+FilenameUtils.getExtension(document.filename)
        File homePageThumb = new File(imageService.fullPath(thumbName))
        try {
            if (!homePageThumb.exists() && document.url) {
                imageService.createThumbnail(new URL(document.url).openStream(), homePageThumb, document.contentType, HOME_PAGE_IMAGE_SIZE)
            }
        }
        catch (Exception e) {
            log.warn("Unable to create thumbnail: ${homePageThumb}")
        }

        [thumbnailFile:homePageThumb, fileName:thumbName]
    }

    Map runActivityReport(Map reportConfig) {
        String url =  grailsApplication.config.ecodata.baseUrl+"search/activityReport"
        webService.doPost(url, reportConfig)
    }

    Map performanceReportModel(String id, int version) {
        Map report = null
        if (id) {
            report = get(id)
        }

        String additionalPracticeQuestionV1 = "The regional NRM organisation has met all the expected practices and has additional practices in place."
        String additionalPracticeQuestionV2 = "The regional NRM organisation also has the following additional practices. (please list)"

        String additionalPracticeQuestion = version == 1 ? additionalPracticeQuestionV1 : additionalPracticeQuestionV2

        List themes = ["Regional NRM Organisation Governance", "Australian Government NRM Delivery"]
        List defaultConstraints = ["", "Yes", "No"]
        List constraintsWithNA = ["", "N/A", "Yes", "No"]
        List sections = [
                [title:"1. Organisational Governance",
                 name:"organisationalGovernance",
                 theme:themes[0],
                 questions:[
                         [text:"1.1\tThe regional NRM organisation is complying with governance responsibilities according to its statutory/incorporation or other legal obligations, including Work, Health and Safety obligations.",name:'1_1', constraints:defaultConstraints],
                         [text:"1.2\tThe regional NRM organisation has a process in place for formally reviewing the performance and composition of the regional NRM organisation’s board of directors.",name:'1_2', constraints:defaultConstraints],
                         [text:"1.3\tThe regional NRM organisation has organisational decision making processes that are transparent and communicated regularly with the local community.",name:'1_3', constraints:defaultConstraints],
                         [text:"1.4\tThe regional NRM organisation ensures all staff and board of directors demonstrate Indigenous cultural awareness.",name:'1_4', constraints:constraintsWithNA],
                         [text:"1.5\tThe regional NRM organisation has structures and processes in place to regularly communicate organisational and project performance achievements.",name:'1_5', constraints:defaultConstraints]],
                 additionalPracticeQuestion:[text:"1.6\t${additionalPracticeQuestion}",name:'1_6', constraints:defaultConstraints]],
                [title:"2. Financial Governance",
                 name:"financialGovernance",
                 theme:themes[0],
                 questions:[
                         [text:"2.1\tThe regional NRM organisation is complying with financial responsibilities according to its statutory/incorporation or other legal obligations.",name:'2_1', constraints:defaultConstraints],
                         [text:"2.2\tThe regional NRM organisation is complying with Australian Government NRM contractual obligations for project financial reporting and management, accurately and on time, including acquittal of funding as required.",name:'2_2', constraints:defaultConstraints],
                         [text:"2.3\tThe regional NRM organisation has annual financial reports that are publicly available.",name:'2_3', constraints:defaultConstraints]],
                 additionalPracticeQuestion:[text:"2.4\t${additionalPracticeQuestion}",name:'2_4', constraints:defaultConstraints]],
                [title:"3. Regional NRM plans",
                 theme:themes[1],
                 name:"regionalNRMPlans",
                 questions:[
                         [text:"3.1\tThe regional NRM organisation has a regional NRM plan that provides the strategic direction to NRM activity within the region based on best available scientific, economic and social information.",name:'3_1', constraints:defaultConstraints],
                         [text:"3.2\tThe regional NRM organisation has a regional NRM plan that demonstrates strategic alignment with Australian Government and state/territory NRM policies and priorities.",name:'3_2', constraints:defaultConstraints],
                         [text:"3.3\tThe regional NRM organisation has a regional NRM plan that has been developed with comprehensive and documented participation of the local community.",name:'3_3', constraints:defaultConstraints],
                         [text:"3.4\tThe regional NRM organisation has a regional NRM plan with clear priorities, outcomes and activities to achieve those outcomes.",name:'3_4', constraints:defaultConstraints],
                         [text:"3.5\tThe regional NRM organisation has a regional NRM plan that clearly articulates Indigenous land and sea management aspirations and participation and identifies strategies to implement them.",name:'3_5', constraints:constraintsWithNA]],
                 additionalPracticeQuestion:[text:"3.6\t${additionalPracticeQuestion}",name:'3_6', constraints:defaultConstraints]],
                [title:"4. Local community participation and engagement",
                 theme:themes[1],
                 name:"localCommunityParticipationAndEngagement",
                 questions:[
                         [text:"4.1\tThe regional NRM organisation has a current community participation plan and a current Indigenous participation plan.",name:'4_1', constraints:defaultConstraints],
                         [text:"4.2\tThe regional NRM organisation has an established process in place that allows the local community to participate in priority setting and/or decision making.",name:'4_2', constraints:defaultConstraints],
                         [text:"4.3\tThe regional NRM organisation is actively building the capacity of the local community to participate in NRM through funding support for training, on ground projects and related activities.",name:'4_3', constraints:defaultConstraints],
                         [text:"4.4\tThe regional NRM organisation is actively supporting increased participation of Indigenous people in the planning and delivery of NRM projects and investment.",name:'4_4', constraints:constraintsWithNA]],
                 additionalPracticeQuestion:[text:"4.5\t${additionalPracticeQuestion}",name:'4_5', constraints:defaultConstraints]],
                [title:"5. Monitoring, Evaluation, Reporting and Improvement ",
                 name:"meri",
                 theme:themes[1],
                 questions:[
                         [text:"5.1\tThe regional NRM organisation is providing comprehensive, accurate and timely project MERI plans and MERIT reporting.",name:'5_1', constraints:defaultConstraints],
                         [text:"5.2\tThe regional NRM organisation is implementing processes to ensure that MERI activities are adequately resourced by appropriately skilled and informed staff.",name:'5_2', constraints:defaultConstraints],
                         [text:"5.3\tThe regional NRM organisation is demonstrating and communicating progress towards NRM project outcomes through regular monitoring, evaluation and reporting of project performance and the use of results to guide improved practice.",name:'5_3', constraints:defaultConstraints]],
                 additionalPracticeQuestion:[text:"5.4\t${additionalPracticeQuestion}",name:'5_4', constraints:defaultConstraints]]
        ]

        Map sectionsByTheme = sections.groupBy{it.theme}
        sectionsByTheme.each { String k, List v ->
            v.sort{it.title}
        }

        [themes:themes, sectionsByTheme:sectionsByTheme, report:report]
    }

    Map performanceReport(int year, String state) {
        List scores = [[name:'regionalNRMPlans', property:'regionalNRMPlansOverallRating'],
                       [name:'localCommunityParticipationAndEngagement', property:'localCommunityParticipationAndEngagementOverallRating'],
                       [name:'organisationalGovernance', property:'organisationalGovernanceOverallRating'],
                       [name:'financialGovernance', property:'financialGovernanceOverallRating'],
                       [name:'meri', property:'meriOverallRating']]


        List<Map> aggregations = []
        scores.each {
            aggregations << [type:'HISTOGRAM', label:it.name, property:'data.'+it.property]
        }
        Map filter = state?[type:'DISCRETE', property:'data.state']:[:]
        Map config = [groups:filter, childAggregations: aggregations, label:'Performance assessment by state']

        Map searchCriteria = [type:['Performance Management Framework - Self Assessment', 'Performance Management Framework - Self Assessment v2'], publicationStatus:REPORT_APPROVED, dateProperty:'toDate', 'startDate':(year-1)+'-07-01T10:00:00Z', 'endDate':year+'-07-01T10:00:00Z']

        String url =  grailsApplication.config.ecodata.baseUrl+"report/runReport"

        webService.doPost(url, [searchCriteria: searchCriteria, reportConfig: config])
    }

    /**
     * Overrides a lock for a report.
     * @param reportId the id of the report to override the lock on
     * @param reportUrl a link to view the report - included in an email sent to the lock owner
     * @return
     */
    Map overrideLock(String reportId, String reportUrl) {
        Map report = get(reportId)
        activityService.stealLock(report.activityId, reportUrl)
    }


    Map activityReportModel(String reportId, ReportMode mode, Integer formVersion = null) {
        Map report = get(reportId)

        Map activity = activityService.get(report.activityId)
        Map model = activityService.getActivityMetadata(activity.type, formVersion ?: activity.formVersion)
        model.report = report
        model.activity = activity
        model.themes = []
        model.locked = activity.lock != null

        if (mode == ReportMode.EDIT) {
            model.editable = canEdit(userService.currentUserId, report, activity)
        }
        else if (mode == ReportMode.PRINT) {
            model.printView = true
        }

        model

    }

    private boolean canEdit(String userId, Map report, Map activity) {
        // Submitted or approved reports are not editable.
        if (isSubmittedOrApproved(report)) {
            return false
        }

        // If we are using pessimistic locking, the report is not editable if another user holds a lock on the activity.
        return !activity.lock || (activity.lock.userId == userId)

    }
}

package au.org.ala.merit

import grails.converters.JSON
import org.apache.commons.lang.CharUtils
import org.apache.http.HttpStatus
import org.joda.time.Days
import org.joda.time.Interval
import org.springframework.cache.annotation.Cacheable

import java.text.SimpleDateFormat

class ProjectService  {

    static Closure documentStageComparitor = {a, b ->
        String stageA = a.stage
        String stageB = b.stage
        if (!stageA && !stageB) {
            return 0
        }
        else if (!stageA) {
            return 1
        }
        else if (!stageB) {
            return -1
        }
        else {
            try {
                int stageNumA = Integer.parseInt(stageA)
                int stageNumB = Integer.parseInt(stageB)
                return stageNumA - stageNumB
            }
            catch (NumberFormatException e) {
                return 0
            }

        }
        return a.stage<=>b.stage
    }

    static final String OUTCOMES_OUTPUT_TYPE = 'Outcomes'
    static final String STAGE_OUTCOMES_OUTPUT_TYPE = ''
    static final String COMPLETE = 'completed'

    static dateWithTime = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss")
    static dateWithTimeFormat2 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss")
    static convertTo = new SimpleDateFormat("dd MMM yyyy")

    static final String PLAN_APPROVED = 'approved'
    static final String PLAN_NOT_APPROVED = 'not approved'
    static final String PLAN_SUBMITTED = 'submitted'
    static final String PLAN_UNLOCKED = 'unlocked for correction'

    def webService, grailsApplication, siteService, activityService, emailService, documentService, userService, metadataService, settingService, reportService, auditService, speciesService

    def list(brief = false, citizenScienceOnly = false) {
        def params = brief ? '?brief=true' : ''
        if (citizenScienceOnly) params += (brief ? '&' : '?') + 'citizenScienceOnly=true'
        def resp = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'project/' + params, 30000)
        resp.list
    }

    def get(id, levelOfDetail = "", includeDeleted = false) {

        def params = '?'

        params += levelOfDetail ? "view=${levelOfDetail}&" : ''
        params += "includeDeleted=${includeDeleted}"
        Map project = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'project/' + id + params)
        if (!project.reports) {
            project.reports = reportService.getReportsForProject(id)
        }
        else {
            project.reports.sort ({ it.toDate })
        }
        project

    }

    def getRich(id) {
        get(id, 'rich')
    }

    def getActivities(project) {
        def list = []
        project.sites.each { site ->
            siteService.get(site.siteId)?.activities?.each { act ->
                list << activityService.constructName(act)
            }
        }
        list
    }

    /**
     * Creates a new project and adds the user as a project admin.
     */
    def create(props) {

        def activities = props.remove('selectedActivities')

        // create a project in ecodata
        def result = webService.doPost(grailsApplication.config.ecodata.baseUrl + 'project/', props)
        if (result?.resp?.projectId) {
            def projectId = result.resp.projectId
            // Add the user who created the project as an admin of the project
            userService.addUserAsRoleToProject(userService.getUser().userId, projectId, RoleService.PROJECT_ADMIN_ROLE)
            if (activities) {
                settingService.updateProjectSettings(projectId, [allowedActivities: activities])
            }
        }

        result
    }

    /**
     * This does a 'soft' delete. The record is marked as inactive but not removed from the DB.
     * @param id the record to delete
     * @return the returned status
     */
    def delete(id) {
        webService.doDelete(grailsApplication.config.ecodata.baseUrl + 'project/' + id)
    }

    /**
     * This does a 'hard' delete. The record is removed from the DB.
     * @param id the record to destroy
     * @return the returned status
     */
    def destroy(id) {
        webService.doDelete(grailsApplication.config.ecodata.baseUrl + 'project/' + id + '?destroy=true')
    }

    boolean isComplete(Map project) {
        return COMPLETE.equalsIgnoreCase(project.status)
    }

    /**
     * Retrieves a summary of project metrics (including planned output targets)
     * and groups them by output type.
     * @param id the id of the project to get summary information for.
     * @return TODO document this structure.
     */
    def summary(String id) {
        def scores = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'project/projectMetrics/' + id)

        def scoresWithTargetsByOutput = [:]
        def scoresWithoutTargetsByOutputs = [:]
        if (scores && scores instanceof List) {  // If there was an error, it would be returning a map containing the error.
            // There are some targets that have been saved as Strings instead of numbers.
            scoresWithTargetsByOutput = scores.grep{ it.target && it.target != "0" }.groupBy { it.outputType }
            scoresWithoutTargetsByOutputs = scores.grep{ it.result && it.result.count && (it.result.result || it.result.groups) && (!it.target || it.target == "0") }.groupBy { it.outputType }
        }
        [targets:scoresWithTargetsByOutput, other:scoresWithoutTargetsByOutputs]
    }

    def search(params) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'project/search', params)
    }

    /**
     * Get the list of users (members) who have any level of permission for the requested projectId
     *
     * @param projectId
     * @return
     */
    def getMembersForProjectId(projectId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/getMembersForProject/${projectId}"
        webService.getJson(url)
    }

    /**
     * Does the current user have permission to administer the requested projectId?
     * Checks for the ADMIN role in CAS and then checks the UserPermission
     * lookup in ecodata.
     *
     * @param userId
     * @param projectId
     * @return boolean
     */
    def isUserAdminForProject(userId, projectId) {
        def userIsAdmin

        if (userService.userIsSiteAdmin()) {
            userIsAdmin = true
        } else {
            def url = grailsApplication.config.ecodata.baseUrl + "permissions/isUserAdminForProject?projectId=${projectId}&userId=${userId}"
            userIsAdmin = webService.getJson(url)?.userIsAdmin  // either will be true or false
        }

        userIsAdmin
    }

    /**
     * Does the current user have caseManager permission for the requested projectId?
     *
     * @param userId
     * @param projectId
     * @return
     */
    def isUserCaseManagerForProject(userId, projectId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/isUserCaseManagerForProject?projectId=${projectId}&userId=${userId}"
        webService.getJson(url)?.userIsCaseManager // either will be true or false
    }

    /**
     * Does the current user have permission to view details of the requested projectId?
     * @param userId the user to test.
     * @param the project to test.
     */
    def canUserViewProject(userId, projectId) {

        def userCanView
        if (userService.userIsSiteAdmin() || userService.userHasReadOnlyAccess()) {
            userCanView = true
        }
        else {
            userCanView = canUserEditProject(userId, projectId)
        }
        userCanView
    }

    /**
     * Returns the programs model for use by a particular project.  At the moment, this method just delegates to the metadataservice,
     * however a per organisation programs model is something being discussed.
     */
    def programsModel() {
        metadataService.programsModel()
    }

    /**
     * Returns a filtered list of activities for use by a project
     */
    public List activityTypesList(String projectId) {
        def projectSettings = settingService.getProjectSettings(projectId)
        def activityTypes = metadataService.activityTypesList()

        def allowedActivities = activityTypes
        if (projectSettings?.allowedActivities) {

            allowedActivities = []
            activityTypes.each { category ->
                def matchingActivities = []
                category.list.each { nameAndDescription ->
                    if (nameAndDescription.name in projectSettings.allowedActivities) {
                        matchingActivities << nameAndDescription
                    }
                }
                if (matchingActivities) {
                    allowedActivities << [name:category.name, list:matchingActivities]
                }
            }

        }

        allowedActivities

    }

    def update(String id, Map projectDetails) {
        TimeZone.setDefault(TimeZone.getTimeZone('UTC'))
        projectDetails?.custom?.details?.lastUpdated = new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'")

        def resp = [:]

        Boolean updateActivities = Boolean.valueOf(projectDetails.remove('changeActivityDates'))

        // Changing project dates requires some extra validation and updates to the stage reports.  Only
        // do this check for existing projects for which the planned start and/or end date is being changed
        if (id) {

            String plannedStartDate = projectDetails.remove('plannedStartDate')
            String plannedEndDate = projectDetails.remove('plannedEndDate')


            if (id && (plannedStartDate || plannedEndDate)) {
                def currentProject = get(id)
                if (currentProject.plannedStartDate != plannedStartDate || currentProject.plannedEndDate != plannedEndDate) {
                    resp = changeProjectDates(id, plannedStartDate ?: currentProject.plannedStartDate, plannedEndDate ?: currentProject.plannedEndDate, updateActivities)
                }
            }
        }
        if (projectDetails) {
            resp = updateUnchecked(id, projectDetails)
        }

        return resp
    }

    private updateUnchecked(String id, Map projectDetails) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'project/' + id, projectDetails)
    }

    /**
     * Does the current user have permission to edit the requested projectId?
     * Checks for the ADMIN role in CAS and then checks the UserPermission
     * lookup in ecodata.
     *
     * @param userId
     * @param projectId
     * @return boolean
     */
    def canUserEditProject(userId, projectId) {
        def userCanEdit
        if (userService.userIsSiteAdmin()) {
            userCanEdit = true
        } else {
            def url = grailsApplication.config.ecodata.baseUrl + "permissions/canUserEditProject?projectId=${projectId}&userId=${userId}"
            userCanEdit = webService.getJson(url)?.userIsEditor?:false
        }

        userCanEdit
    }

    def submitPlan(String projectId) {
        def project = get(projectId)

        if (!project.planStatus || project.planStatus == PLAN_NOT_APPROVED) {
            def resp = update(projectId, [planStatus:PLAN_SUBMITTED])
            if (resp.resp && !resp.resp.error) {
                emailService.sendPlanSubmittedEmail(projectId, [project:project])
                return [message:'success']
            }
            else {
                return [error:"Update failed: ${resp?.resp?.error}"]
            }
        }
        return [error:'Invalid plan status']
    }

    def approvePlan(String projectId) {
        def project = get(projectId)
        if (project.planStatus == PLAN_SUBMITTED) {
            def resp = update(projectId, [planStatus:PLAN_APPROVED])
            if (resp.resp && !resp.resp.error) {
                emailService.sendPlanApprovedEmail(projectId, [project:project])
                return [message:'success']
            }
            else {
                return [error:"Update failed: ${resp?.resp?.error}"]
            }
        }
        return [error:'Invalid plan status']

    }

    def rejectPlan(String projectId) {
        def project = get(projectId)
        if (project.planStatus in [PLAN_SUBMITTED, PLAN_APPROVED]) {
            def resp = update(projectId, [planStatus:PLAN_NOT_APPROVED])
            if (resp.resp && !resp.resp.error) {
                emailService.sendPlanRejectedEmail(projectId, [project:project])
                return [message:'success']
            }
            else {
                return [error:"Update failed: ${resp?.resp?.error}"]
            }
        }
        return [error:'Invalid plan status']
    }

    Map unlockPlanForCorrection(String projectId, String approvalText) {
        Map project = get(projectId)
        if (isComplete(project) && project.planStatus == PLAN_APPROVED) {
            Map resp = update(projectId, [planStatus:PLAN_UNLOCKED])

            if (resp.resp && !resp.resp.error) {
                Map doc = [name:"Approval to correct project information for "+project.projectId, projectId:projectId, type:'text', role:'approval',filename:project.projectId+'-correction-approval.txt', readOnly:true, public:false]
                String user = userService.getCurrentUserDisplayName()
                String content = "User ${user} has unlocked project "+project.projectId+" for correction. \nDeclaration:\n"+approvalText
                documentService.createTextDocument(doc, content)

                return [message:'success']
            }
            else {
                return [error:"Update failed: ${resp?.resp?.error}"]
            }
        }
        return [error:'Cannot unlock the plan: invalid project status']
    }

    Map finishedCorrectingPlan(String projectId) {
        Map project = get(projectId)
        if (isComplete(project) && project.planStatus == PLAN_UNLOCKED) {
            Map resp = update(projectId, [planStatus:PLAN_APPROVED])
            if (resp.resp && !resp.resp.error) {
                return [message:'success']
            }
            else {
                return [error:"Update failed: ${resp?.resp?.error}"]
            }
        }
        return [error:'Cannot finish correcting the plan: invalid project status']
    }

    /**
     * Submits a report of the activities performed during a specific time period (a project stage).
     * @param projectId the project the performing the activities.
     * @param stageDetails details of the activities, specifically a list of activity ids.
     */
    def submitStageReport(projectId, stageDetails) {

        def activities = activityService.activitiesForProject(projectId);

        def allowedStates = ['finished', 'deferred', 'cancelled']
        def readyForSubmit = true
        stageDetails.activityIds.each { activityId ->
            def activity = activities.find {it.activityId == activityId}
            if (!allowedStates.contains(activity?.progress)) {
                readyForSubmit = false
            }
        }
        if (!readyForSubmit) {
            return [error:'All activities must be finished, deferred or cancelled']
        }
		
		//generate stage report and attach to the project
		def projectAll = get(projectId, 'all')
		readyForSubmit = false;
        Map report = projectAll.reports?.find{it.reportId == stageDetails.reportId}
        if (!report) {
            return [error:'Invalid stage']
		}
		
		String stageName = stageDetails.stage;
        String stageNum = ''
        if (stageName.indexOf('Stage ') == 0) {
            stageNum = stageName.substring('Stage '.length(), stageName.length())
        }
		def param  = [project: projectAll, activities:activities, report:report, status:"Report submitted"]
		def htmlTxt = createHTMLStageReport(param)
		def dateWithTime = new SimpleDateFormat("yyyy_MM_dd_hh_mm_ss")
		def name = projectAll?.grantId + '_' + stageName + '_' + dateWithTime.format(new Date()) + ".pdf"
		def doc = [name:name, projectId:projectId, saveAs:'pdf', type:'pdf', role:'stageReport',filename:name, readOnly:true, public:false, stage:stageNum]
		documentService.createTextDocument(doc, htmlTxt)
        def result = activityService.submitActivitiesForPublication(stageDetails.activityIds)
        reportService.submit(stageDetails.reportId)
        def project = get(projectId)
        stageDetails.project = project
        if (!result.resp.error) {
            emailService.sendReportSubmittedEmail(projectId, stageDetails)
        }
        result
    }

    /**
     * Approves a submitted stage report.
     * @param projectId the project the performing the activities.
     * @param stageDetails details of the activities, specifically a list of activity ids.
     */
    def approveStageReport(projectId, stageDetails) {
        def result = activityService.approveActivitiesForPublication(stageDetails.activityIds)

        // TODO Send a message to GMS.
        def project = get(projectId, 'all')
        def readableId = project.grantId + (project.externalId?'-'+project.externalId:'')
        def name = "${readableId} ${stageDetails.stage} approval"
        def doc = [name:name, projectId:projectId, type:'text', role:'approval',filename:name, readOnly:true, public:false, reportId:stageDetails.reportId]
        documentService.createTextDocument(doc, (project as JSON).toString())
        stageDetails.project = project
        if (!result.resp.error) {
            emailService.sendReportApprovedEmail(projectId, stageDetails)
        }

        //Update project status to completed
        int published = 0;
        int validActivities = 0
        reportService.approve(stageDetails.reportId, stageDetails.reason)

        // Close the project when the last stage report is approved.
        // Some projects have extra stage reports after the end date due to legacy data so this checks we've got the last stage within the project dates.
        def lastReport = project.reports?.max{it.fromDate < project.plannedEndDate ? it.fromDate : project.plannedStartDate}

        if(lastReport && lastReport.reportId == stageDetails.reportId){
            def values = [:]
            values["status"] = COMPLETE
            update(projectId, values)
        }

        result
    }

    /**
     * Rejects a submitted stage report.
     * @param projectId the project the performing the activities.
     * @param stageDetails details of the activities, specifically a list of activity ids.
     */
    def rejectStageReport(projectId, stageDetails) {
        reportService.reject(stageDetails.reportId, stageDetails.category, stageDetails.reason)
        def result = activityService.rejectActivitiesForPublication(stageDetails.activityIds)

        // TODO Send a message to GMS.  Delete previous approval document (only an issue for withdrawal of approval)?
        def project = get(projectId)
        stageDetails.project = project

        if (!result.resp.error) {
            emailService.sendReportRejectedEmail(projectId, stageDetails)
        }

        result
    }

    /**
     * Deletes the activities associated with a report.
     */
    Map deleteReportActivities(String reportId, List<String> activityIds) {

        Map report = reportService.get(reportId)

        Map result
        if (!reportService.isSubmittedOrApproved(report)) {
            result = activityService.bulkDeleteActivities(activityIds)
        }
        else {
            result = [status:HttpStatus.SC_BAD_REQUEST, error:"Cannot delete submitted or approved stages"]
        }
        return result

    }

    /**
     * This method is used to shift the entire project start and end date without changing the duration.
     * It can only be called for projects in the "planning" phase.
     * @param projectId the ID of the project
     * @param plannedStartDate an ISO 8601 formatted date string describing the new start date of the project.
     * @param updateActivities set to true if existing activities should be modified to fit into the new schedule
     */
    def changeProjectStartDate(String projectId, String plannedStartDate, boolean updateActivities = true) {
        def project = get(projectId)
        Map message
        String validationResult = validateProjectDates(project, plannedStartDate)
        if (validationResult == null) {

            def previousStartDate = DateUtils.parse(project.plannedStartDate)
            def newStartDate = DateUtils.parse(plannedStartDate)

            def daysChanged = Days.daysBetween(previousStartDate, newStartDate).days

            log.info("Updating start date for project ${projectId} from ${project.plannedStartDate} to ${plannedStartDate}, ${daysChanged} days difference")

            def newEndDate = DateUtils.format(DateUtils.parse(project.plannedEndDate).plusDays(daysChanged))

            // The update method in this class treats dates specially and delegates the updates to the changeProjectDates method.
            def resp = updateUnchecked(projectId, [plannedStartDate: plannedStartDate, plannedEndDate: newEndDate])
            generateProjectStageReports(projectId)
            if (resp.resp && !resp.resp.error && updateActivities) {

                def activities = activityService.activitiesForProject(projectId)
                activities.each { activity ->
                    if (!activityService.isReport(activity)) {
                        def newActivityStartDate = DateUtils.format(DateUtils.parse(activity.plannedStartDate).plusDays(daysChanged))
                        def newActivityEndDate = DateUtils.format(DateUtils.parse(activity.plannedEndDate).plusDays(daysChanged))
                        activityService.update(activity.activityId, [activityId: activity.activityId, plannedStartDate: newActivityStartDate, plannedEndDate: newActivityEndDate])
                    }

                }

                message = [message: 'success']
            } else {
                message = [error: "Update failed: ${resp?.resp?.error}"]
            }
        }
        else {
            message = [error: validationResult]
        }

        return message
    }

    /**
     * This method changes a project start and end date
     * It can only be called for projects in the "planning" phase.
     * @param projectId the ID of the project
     * @param plannedStartDate an ISO 8601 formatted date string describing the new start date of the project.
     * * @param plannedStartDate an ISO 8601 formatted date string describing the new end date of the project.
     * @param updateActivities set to true if existing activities should be modified to fit into the new schedule
     */
    def changeProjectDates(String projectId, String plannedStartDate, String plannedEndDate, boolean updateActivities = true) {
        Map response
        def project = get(projectId)
        def previousStartDate = DateUtils.parse(project.plannedStartDate)
        def newStartDate = DateUtils.parse(plannedStartDate)
        def daysStartChanged = Days.daysBetween(previousStartDate, newStartDate).days

        String validationResult = validateProjectDates(project, plannedStartDate)
        if (validationResult == null) {

            def previousEndDate = DateUtils.parse(project.plannedEndDate)
            def newEndDate = DateUtils.parse(plannedEndDate)

            def previousDuration = Days.daysBetween(previousStartDate, previousEndDate).days
            def newDuration = Days.daysBetween(newStartDate, newEndDate).days

            if (newDuration <= 0 || previousDuration <= 0) {
                return [error:"Invalid project dates"]
            }

            def scale = (double)newDuration / (double)previousDuration

            log.info("Updating start date for project ${projectId} from ${project.plannedStartDate} to ${newStartDate}, ${daysStartChanged} days difference")
            log.info("Updating end date for project ${projectId} from ${project.plannedEndDate} to ${newEndDate}")
            log.info("Project duration changing by a factor of ${scale}")

            // The update method in this class treats dates specially and delegates the updates to this method.
            response = updateUnchecked(projectId, [plannedStartDate:plannedStartDate, plannedEndDate:plannedEndDate])

            generateProjectStageReports(projectId)
            if (response.resp && !response.resp.error) {

                if (updateActivities) {
                    def activities = activityService.activitiesForProject(projectId)
                    activities.each { activity ->
                        if (!activityService.isReport(activity)) {
                            def newActivityStartDate = DateUtils.format(DateUtils.parse(activity.plannedStartDate).plusDays(daysStartChanged))
                            def daysToChangeEndDate = (int)Math.round(Math.abs(daysStartChanged) * scale)
                            def newActivityEndDate = DateUtils.format(DateUtils.parse(activity.plannedEndDate).plusDays(daysToChangeEndDate))

                            // Account for any rounding errors that would result in the activity falling outside the project date range.
                            if (newActivityStartDate > newActivityEndDate) {
                                newActivityStartDate = newActivityEndDate
                            }
                            if (newActivityStartDate < plannedStartDate) {
                                newActivityStartDate = plannedStartDate
                            }
                            if (newActivityEndDate > plannedEndDate) {
                                newActivityEndDate = plannedEndDate
                            }
                            activityService.update(activity.activityId, [activityId:activity.activityId, plannedStartDate:newActivityStartDate, plannedEndDate:newActivityEndDate])
                        }
                    }
                }
            }
        }
        else {
            response = [resp:[error: validationResult]]
        }
        response
    }

    boolean isMeriPlanSubmittedOrApproved(Map project) {
        return (project.planStatus == PLAN_SUBMITTED || project.planStatus == PLAN_APPROVED)
    }

    /**
     * Returns null if the project dates can be changed.  Otherwise returns an error message.
     */
    private String validateProjectDates(Map project, String plannedStartDate) {

        String result = null

        if (project.plannedStartDate != plannedStartDate && !canChangeStartDate(project)) {
            result = "Cannot change the start date of a project with submitted or approved reports"
        }
        // Allow FC_ADMINS to change project dates even with an approved plan as they are likely just
        // correcting bad data.
        if (!userService.userIsAlaOrFcAdmin()) {
            if (isMeriPlanSubmittedOrApproved(project)) {
                result = "Cannot change project dates when the MERI plan is approved"
            }
        }
        return result
    }

    /**
     * Returns true if the project dates can be changed.
     * @param project the project to check.
     */
    public boolean canChangeProjectDates(Map project) {
        return canChangeStartDate(project) && !isMeriPlanSubmittedOrApproved(project)
    }

    public boolean canChangeStartDate(project) {
        return !reportService.includesSubmittedOrApprovedReports(project.reports)
    }

    Map getProgramConfiguration(Map project) {
        metadataService.getProgramConfiguration(project.associatedProgram, project.associatedSubProgram)
    }

    def generateProjectStageReports(String projectId) {
        def project = get(projectId)
        def programConfig = getProgramConfiguration(project)

        def period = programConfig.reportingPeriod
        if (period) {
            period = period as Integer
        }

        def alignedToCalendar = programConfig.reportingPeriodAlignedToCalendar ?: false

        reportService.regenerateAllStageReportsForProject(projectId, period, alignedToCalendar)


    }

    def createReportingActivitiesForProject(projectId, config) {
        def result = regenerateReportingActivitiesForProject(projectId, config)
        result.create.each { activity ->
            activityService.create(activity)
        }

        result.delete.each { activity ->
            if (activity.progress != 'planned') {
                log.warn("Attempt to delete non - planned activity ${activity.activityId}, progress: ${activity.progress}")
            }
            else {
                activityService.delete(activity.activityId)
            }
        }
    }

    /**
     * This method supports automatically creating reporting activities for a project that re-occur at defined intervals.
     * e.g. a stage report once every 6 months or a green army monthly report once per month.
     * Activities will only be created when no reporting activity of the correct type exists within each period.
     * @param projectId identifies the project.
     * @param config List of [type:<activity type>, period:<period that must have a reporting activity>
     * @return
     */
    def regenerateReportingActivitiesForProject(projectId, config) {

        def project = get(projectId, 'all')

        def startDate = DateUtils.parse(project.plannedStartDate)
        def endDate = DateUtils.parse(project.plannedEndDate)


        def toCreate = []
        def toDelete = []
        config.each {

            def periodStartDate = startDate
            def periodEndDate = endDate
            def activitiesOfType = project.activities.findAll {activity -> activity.type == it.type}
            if (activitiesOfType) {
                def firstActivityEndDate = DateUtils.parse(activitiesOfType.min{it.plannedEndDate}.plannedEndDate)
                periodStartDate = startDate < firstActivityEndDate ? startDate : firstActivityEndDate

                def lastActivityEndDate = DateUtils.parse(activitiesOfType.max{it.plannedEndDate}.plannedEndDate)
                periodEndDate = endDate > lastActivityEndDate ? endDate : lastActivityEndDate

            }

            periodStartDate = DateUtils.alignToPeriod(periodStartDate, it.period)

            def existingActivitiesByPeriod = DateUtils.groupByDateRange(activitiesOfType, {it.plannedEndDate}, it.period, periodStartDate, periodEndDate)

            def gaps = []
            existingActivitiesByPeriod.each { interval, activities ->
                if (interval.isBefore(startDate) || interval.isAfter(endDate)) {
                    toDelete += activities
                }
                else if (!activities) {
                    gaps << interval;
                }
            }

            gaps.each {Interval period ->
                // Subtract a day from the end date so the activity is displayed as 01/01/2014-31/01/2014 etc
                // If the period end date is after the project end date, use the project end date.
                def end = period.end.isBefore(endDate) ? period.end.minusDays(1) : endDate
                def activity = [type:it.type, plannedStartDate:DateUtils.format(period.start), plannedEndDate:DateUtils.format(end), projectId:projectId]
                activity.description = activityService.defaultDescription(activity)
                toCreate << activity
            }
        }
        return [create:toCreate, delete:toDelete]

    }

    /**
     * Looks for an activity of type FINAL_REPORT_ACTIVITY_TYPE in completed projects only and returns the contents
     * of the Outcomes sections from that activity.
     * @param project the project
     * @return a Map with keys: environmentalOutcomes, economicOutcomes, socialOutcomes
     */
    Map<String, String> getProjectOutcomes(Map project) {
        def outcomes = [:]
        if (isComplete(project)) {
            def activity = project.activities?.find { it.type == ActivityService.FINAL_REPORT_ACTIVITY_TYPE }

            if (activity) {
                outcomes = getOutcomes(activity.activityId, OUTCOMES_OUTPUT_TYPE)
            }
        }
        if (!outcomes) {
            Map activity = project.activities?.max{ reportService.isSubmittedOrApproved(it) ? it.plannedEndDate : ''}

            if (activity) {
                outcomes = getOutcomes(activity.activityId, STAGE_OUTCOMES_OUTPUT_TYPE)
            }
        }
        outcomes

    }

    boolean canEditActivity(Map activity) {
        Map project = get(activity.projectId)
        // We allow activities to be edited if the project has been unlocked for post-aquittal data correction.
        if (isComplete(project)) {
            return project.planStatus == PLAN_UNLOCKED
        }

        // Activities in a submitted or approved report cannot be edited
        Map report = reportService.findReportForDate(activity.plannedEndDate, project.reports)

        return !reportService.isSubmittedOrApproved(report)
    }

    private Map getOutcomes(String activityId, String outputType) {
        Map activity = activityService.get(activity.activityId)
        def outcomeOutput = activity?.outputs?.find { it.name == outputType }

        [environmentalOutcomes: outcomeOutput?.data?.projectEnvironmentalOutcomes,
         economicOutcomes     : outcomeOutput?.data?.projectEconomicOutcomes,
         socialOutcomes       : outcomeOutput?.data?.projectSocialOutcomes]
    }


    def createHTMLStageReport(param) {

        def project = param.project
        def activities = param.activities
        def report = param.report
        def status = param.status

        def stage = ''
        def planned = 0
        def started = 0
        def finished = 0
        def deferred = 0
        def cancelled = 0
        def stageStartDate = ''
        def stageEndDate = ''

        org.codehaus.groovy.runtime.NullObject.metaClass.toString = {return ''}

        def stageName = report.name
        stageStartDate = report.fromDate
        stageEndDate = report.toDate
        stage = "${report.name} : "+convertDate(report.fromDate) +" - " +convertDate(report.toDate)

        activities.each{
            if(dateInSlot(stageStartDate,stageEndDate,it.plannedEndDate)){
                if(it.progress.equals('planned'))
                    planned++
                else if (it.progress.equals('started'))
                    started++
                else if (it.progress.equals('finished'))
                    finished++
                else if (it.progress.equals('deferred'))
                    deferred++
                else if (it.progress.equals('cancelled'))
                    cancelled++
            }
        }

        StringBuilder html = new StringBuilder();
        append(html,"<html lang=\"en-AU\">")
        append(html,"<head>")
        append(html,"<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />")
        append(html,"</head>")

        append(html,'<body>')
        append(html,'<font face="Arial">')
        append(html,'<h1 align="center"><font color="#008080">MERIT STAGE SUMMARY</font></h1>')
        append(html,'<br>')
        append(html,'<h2><font color="">'+stage+'</font></h2></hr>')

        append(html,'<table cellpadding="3" border="0">')
        append(html,'<tr><td>Project Name</td><td>'+project.name+'</td></tr>')
        append(html,'<tr><td>Recipient</td><td>'+project.organisationName+'</td></tr>')
        append(html,'<tr><td>Service Provider</td><td></td></tr>')
        append(html,'<tr><td>Funded by</td><td>'+project.associatedProgram+'</td></tr>')
        append(html,'<tr><td>Funding</td><td>'+project.fundingSource+'</td></tr>')
        append(html,'<tr><td>Project Start</td><td>'+convertDate(project.plannedStartDate)+'</td></tr>')
        append(html,'<tr><td>Project finish</td><td>'+convertDate(project.plannedEndDate)+'</td></tr>')
        append(html,'<tr><td>Grant ID</td><td>'+project.grantId+'</td></tr>')
        append(html,'<tr><td>External ID</td><td>'+project.externalId+'</td></tr>')
        append(html,'</table>')

        append(html,'<br>')
        append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
        append(html,'<br>')
        append(html,'<h2><font color="">Summary</font></h2>')
        append(html,'<h4><font color="">Number of activities:</font></h4>')
        append(html,'<table cellpadding="3" border="0">')
        append(html,'<tr><td>Planned</td><td>'+planned+'</td></tr>')
        append(html,'<tr><td>Started</td><td>'+started+'</td></tr>')
        append(html,'<tr><td>Finished</td><td>'+finished+'</td></tr>')
        append(html,'<tr><td>Deferred</td><td>'+deferred+'</td></tr>')
        append(html,'<tr><td>Cancelled</td><td>'+cancelled+'</td></tr>')
        append(html,'</table>')

        append(html,'<br>')
        append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
        append(html,'<br>')
        append(html,'<h2><font color="">Supporting Documents Attached During This Stage</font></h2>')
        append(html,'<table cellpadding="3" border="0">')
        append(html,'<tr><th>Document name</th></tr>')
        project.documents?.each{
			String name = "Stage ${it.stage}";	
            if("active".equals(it.status) && name.equals(stageName)){
                append(html,"<tr><td>${it.name}</td></tr>")
            }
        }
        append(html,'</table>')
		append(html,'<br>')
		
		// use existing project dashboard calculation to display metrics data.
		append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
		append(html,'<br>')
		append(html,'<h2><font color="">Outputs: Targets Vs Achieved</font></h2>')
		append(html,'<table cellpadding="3" border="0">')
		append(html,'<tr><th>Output type</th><th>Output Target Measure</th><th>Output Achieved (project to date)</th><th>Output Target (whole project)</th></tr>')
		
		def metrics = summary(project.projectId); 			
		metrics?.targets?.each{ k, v->
			v?.each{ data ->
				String units = data.score?.units ? data.score.units : '';
				double total = 0.0;
				data.results?.each { result ->
					total = total + result.result;
				}
				append(html,"<tr><td>${data.score?.outputName}</td><td>${data.score?.label}</td><td>${total}</td><td>${data.target} ${units}</td></tr>")
			}
		}
		append(html,'</table>')
        append(html,'<br>')
        append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
        append(html,'<br>')
        append(html,'<h2><font>Project Outcomes</font></h2>')
        append(html,'<table cellpadding="3" border="0">')
        append(html,'<tr><td>Outcomes</td><td>Project Goals</td></tr>');
        project?.custom?.details?.objectives?.rows1?.each {
            append(html,'<tr><td>'+it.description+'</td>');
            append(html,'<td>'+it.assets?.join(", ")+'</td></tr>');
        }
        append(html,'</table>')

        append(html,'<br>')
        append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
        append(html,'<br>')
        append(html,'<h2><font>Summary of Project Progress and Issues</font></h2>')


        def stageReportActivityModel = metadataService.getActivityModel(ActivityService.STAGE_REPORT_ACTIVITY_TYPE)

		project?.activities?.each { activity ->
			if(activity.type.equals(ActivityService.STAGE_REPORT_ACTIVITY_TYPE) &&
                    dateInSlot(stageStartDate, stageEndDate, activity.plannedEndDate)){

                stageReportActivityModel.outputs.each { outputType ->
                    def output = activity.outputs?.find { it.name == outputType }
                    def type = metadataService.annotatedOutputDataModel(outputType)

                    append(html,"<b> ${outputType}: </b> <br>");
                    type.each { field ->
                        def label = field.label ?:field.name
                        def value = output?.data ? output.data[field.name] : ''
                        append(html,"<em>${label}</em>:- ${value?:''}<br>");
                    }

                    append(html,"<br>");
                }
			}
        }
				
        append(html,'<br>')
        append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
        append(html,'<br>')
        append(html,'<h2><font color="">Project Risk</font></h2>')
        append(html,'<p>To help anticipate and determine management and mitigation strategies for the risks associated with delivering and '+
                'reporting the outcomes of this Regional Delivery project, complete the table below. Risks identified should be those that the '+
                'project team consider to be within the reasonable influence of the project team to anticipate and manage.</p>')
        append(html,'<table cellpadding="3" border="0">')
        append(html,'<tr><th>Risk/Threat Description</th><th>Likelihood</th><th>Consequence</th><th>Rating</th><th>Current Controls/Contingency </th><th>Residual Risk</th></tr>')
        project?.risks?.rows?.each{
            append(html,'<tr><td>'+it.description+'</td><td>'+it.likelihood+'</td><td>'+it.consequence+'</td><td>'+
                    it.riskRating+'</td><td>'+it.currentControl+'</td><td>'+it.residualRisk+'</td></tr>')
        }
        append(html,'</table>')

        append(html,'<br>')
        append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
        append(html,'<br>')
        append(html,'<h2><font color="">Progress Against Each Activity</font></h2>')

        int i=0;
        project?.activities?.each{
            if(dateInSlot(stageStartDate,stageEndDate,it.plannedEndDate)){
                i++;
                append(html,'<p>')
                append(html,'<table cellpadding="3" border="0">')
                append(html,'<tr><td><b>'+i+'. Activity Type</b></td><td><b>'+it.type+'</b></td></tr>')
                append(html,'<tr><td>Status</td><td>'+it.progress+'</td></tr>')
                append(html,'<tr><td>Activity Description</td><td>'+it.description+'</td></tr>')
                append(html,'<tr><td>Major Theme</td><td>'+it.mainTheme+'</td></tr>')

                def temp = it.siteId;
                project.sites?.each{
                    if(it.siteId.equals(temp)){
                        append(html,'<tr><td>Site</td><td>'+it.name+'</td></tr>')
                    }
                }
                append(html,"<tr><td>Start Date</td><td>${convertDate(it.startDate)}</td></tr>")
                append(html,"<tr><td>End Date</td><td>${convertDate(it.endDate)}</td></tr>")

                def reason = ''
                if(it.progress.equals('deferred') || it.progress.equals('cancelled')){
                    it.documents.each{
                        reason = "${it.notes}${it.data?.eventNotes}${it.data?.debrisNotes}${it.data?.erosionNotes}${it.data?.pestObservationNotes}${it.data?.weedInspectionNotes}${it.data?.fenceNotes}"
                    }
                    append(html,'<tr><td>Reason '+it.name+'</td><td>'+reason+'</td></tr>')
                    it.outputs?.each{
                        def outputNotes = "${it?.data?.notes}${it?.data?.eventNotes}${it?.data?.debrisNotes}${it?.data?.erosionNotes}${it?.data?.pestObservationNotes}${it?.data?.weedInspectionNotes}${it?.data?.fenceNotes}";
                        append(html,"<tr><td>Comments for ${it.name} </td><td> ${outputNotes} </td></tr>")
                    }
                }
                append(html,'</table>')
                append(html,'</p>')
            }
        }
        append(html,'<br>')
        append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
        append(html,'<br>')
        append(html,'<table cellpadding="3" border="0">')
        append(html,"<tr><td><b>Summary generated by: </b></td><td><b>${userService.getUser().displayName}(${userService.getUser().userName})</b></td></tr>")
        append(html,"<tr><td>Position/Role</td><td>MERIT Project Administrator and authorised representative of ${project.organisationName}</td></tr>")
        append(html,"<tr><td>Date</td><td>${dateWithTimeFormat2.format(new Date())}</td></tr>")
        append(html,"<tr><td>Report status</td><td>${status}</td></tr>")
        append(html,'</table>')

        append(html,"</font></body>")
        append(html,"</html>")
        org.codehaus.groovy.runtime.NullObject.metaClass.toString = {return 'null'}

        return html.toString();
    }

    private append(StringBuilder str, String data){
        str.append(data).append(CharUtils.CR).append(CharUtils.LF)
    }

    private convertDate(date) {
        if(date)
            convertTo.format(dateWithTime.parse(date))
        else
            '-';
    }

    private dateInSlot(d1,d2,range){
        if(d1 && d2 && range){
            d1 = dateWithTime.parse(d1)
            d2 = dateWithTime.parse(d2)
            range = dateWithTime.parse(range)
            def slot = d1..d2
            return slot.containsWithinBounds(range)
        }
        return false;
    }

    Map compareProjectRisks(String projectId, String baselineDate, String beforeDate) {
        Map toCompare = auditService.compareProjectEntity(projectId, baselineDate, beforeDate, 'risks')

        Map baseline = null
        Map comparison = null
        Map mostRecentEditBeforeOrOnBaselineDate = null
        if (toCompare.baseline && toCompare.baseline.entity.risks) {
            baseline = toCompare.baseline.entity.risks
        }
        if (toCompare.comparison && toCompare.comparison.entity.risks) {
            comparison = toCompare.comparison.entity.risks
        }
        if (toCompare.mostRecentEditBeforeOrOnBaselineDate && toCompare.mostRecentEditBeforeOrOnBaselineDate.entity.risks) {
            mostRecentEditBeforeOrOnBaselineDate = toCompare.mostRecentEditBeforeOrOnBaselineDate.entity.risks
        }
        [baselineDate: toCompare.baseline?.date, baseline:baseline, comparisonDate: toCompare.comparison?.date, comparison:comparison, mostRecentEditBeforeOrOnBaselineDate:mostRecentEditBeforeOrOnBaselineDate]

    }

    private Map defaultSpeciesSettings(Map project) {
        Map defaultConfig
//        if (project.listId) {
//
//            defaultConfig = [
//                    "type": "GROUP_OF_SPECIES",
//                    "speciesLists":[ [dataResourceUid:project.listId]],
//                    "speciesDisplayFormat" : "SCIENTIFICNAME(COMMONNAME)"
//            ]
//        }
//        else {
            defaultConfig = [
                    "type" : "ALL_SPECIES",
                    "speciesDisplayFormat" : "SCIENTIFICNAME(COMMONNAME)"
            ]
//        }
        defaultConfig
    }


    @Cacheable('speciesFieldConfig')
    public Map findSpeciesFieldConfigForActivity(String projectId, String surveyName) {
        def project = get(projectId)

        Map speciesFieldsSettings = project.speciesFieldsSettings
        if (!project.speciesFieldsSettings) {
            Map programConfig = getProgramConfiguration(project)
            if (programConfig && programConfig.speciesFieldsSettings) { // Handle JSON$Null (otherwise it will attempt to cast to a Map)
                speciesFieldsSettings = programConfig.speciesFieldsSettings
            }
        }

        Map surveyConfig = speciesFieldsSettings?.surveysConfig?.find {
            it.name == surveyName
        }

        Map defaultConfig
        if (speciesFieldsSettings?.defaultSpeciesConfig) {
            defaultConfig = speciesFieldsSettings?.defaultSpeciesConfig
        }
        else {
            defaultConfig = defaultSpeciesSettings(project)
        }
        [surveyConfig:surveyConfig, defaultSpeciesConfig:defaultConfig]
    }

    @Cacheable('speciesFieldConfig')
    Map findSpeciesFieldConfig(String projectId, String surveyName, String dataFieldName, String output) {
        def project = get(projectId)

        Map speciesFieldsSettings = project.speciesFieldsSettings
        if (!project.speciesFieldsSettings) {
            Map programConfig = getProgramConfiguration(project)
            if (programConfig && programConfig.speciesFieldsSettings) { // Handle JSON$Null (otherwise it will attempt to cast to a Map)
                speciesFieldsSettings = programConfig.speciesFieldsSettings
            }
        }

        def survey = speciesFieldsSettings?.surveysConfig?.find {
            it.name == surveyName
        }

        def specificFieldDefinition = survey?.speciesFields?.find {
            it.dataFieldName == dataFieldName && it.output == output
        }

        Map speciesFieldConfig
        if (specificFieldDefinition && specificFieldDefinition?.config?.type != "DEFAULT_SPECIES") {
            speciesFieldConfig = specificFieldDefinition.config
        }
        else if (speciesFieldsSettings?.defaultSpeciesConfig) {
            speciesFieldConfig = speciesFieldsSettings?.defaultSpeciesConfig
        }
        else {
            speciesFieldConfig = defaultSpeciesSettings(project)

        }
        speciesFieldConfig
    }

    /**
    * Searches for a species name taking into account the species constraints setup for the survey.
    *
    * @return json structure containing search results suitable for use by the species autocomplete widget on a survey form.
    */
    def searchSpecies(Map speciesFieldConfig, String q, Integer limit){
        def result = speciesService.searchSpeciesForConfig(speciesFieldConfig, q, limit)
        speciesService.formatSpeciesNameForSurvey(speciesFieldConfig.speciesDisplayFormat , result)
        result
    }

}

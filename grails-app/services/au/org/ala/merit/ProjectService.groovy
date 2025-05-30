package au.org.ala.merit

import au.org.ala.ecodata.forms.TermsService
import au.org.ala.merit.config.EmailTemplate
import au.org.ala.merit.config.ProgramConfig
import au.org.ala.merit.config.ReportConfig
import au.org.ala.merit.reports.ReportGenerationOptions
import au.org.ala.merit.reports.ReportGenerator
import au.org.ala.merit.reports.ReportOwner
import grails.converters.JSON
import grails.plugin.cache.Cacheable
import groovy.util.logging.Slf4j
import org.apache.commons.lang.CharUtils
import org.apache.http.HttpStatus
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject
import org.joda.time.*

import java.text.SimpleDateFormat

@Slf4j
class ProjectService  {

    static final String OUTCOMES_OUTPUT_TYPE = 'Outcomes'
    static final String STAGE_OUTCOMES_OUTPUT_TYPE = ''
    static final String COMPLETE = 'completed'
    static final String APPLICATION_STATUS = 'Application'
    static final String ACTIVE = 'active'

    static final String OTHER_EMSA_MODULE = 'Other'
    static final String PARATOO_FORM_TAG_SURVEY = 'survey'

    static dateWithTime = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss")
    static dateWithTimeFormat2 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss")
    static convertTo = new SimpleDateFormat("dd MMM yyyy")

    static final String PLAN_APPROVED = 'approved'
    static final String PLAN_NOT_APPROVED = 'not approved'
    static final String PLAN_SUBMITTED = 'submitted'
    static final String PLAN_UNLOCKED = 'unlocked for correction'
    public static final String DOCUMENT_ROLE_APPROVAL = 'approval'
    public static final String FLATTEN_BY_SUM = "SUM"
    public static final String FLATTEN_BY_COUNT = "COUNT"
    public static final String DEFAULT_GROUP_BY = 'scientificName,vernacularName,scientificNameID,individualsOrGroups'
    static final String PROJECT_TAGS_CATEGORY = 'MERIT Project Tags'

    // All projects can use the Plot Selection and Layout, Plot Description and Opportune modules, but
    // we don't want users recording data sets for Plot Selection and Layout so it's not included here.
    final List DEFAULT_EMSA_MODULES = Collections.synchronizedList(['Plot Description', 'Opportune'])

    def webService, grailsApplication, siteService, activityService, emailService, documentService, userService, metadataService, settingService, reportService, auditService, speciesService, commonService
    ProjectConfigurationService projectConfigurationService
    def programService
    LockService lockService
    DataSetSummaryService dataSetSummaryService
    TermsService termsService

    def get(id, levelOfDetail = "", includeDeleted = false) {

        def params = '?'

        params += levelOfDetail ? "view=${levelOfDetail}&" : ''
        params += "includeDeleted=${includeDeleted}"
        Map project = webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + 'project/' + id + params)
        if (!project.reports) {
            project.reports = reportService.getReportsForProject(id)
        }
        else {
            project.reports.sort ({ it.toDate })
        }
        project

    }

    Map findStateAndElectorateForProject(String projectId) {
        Map result = webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + 'project/findStateAndElectorateForProject?projectId=' + projectId) as Map
        if (result.error) {
            result = [:]
        }

        result
    }

    void filterDataSetSummaries(List dataSetSummaries) {
        List<Map> forms = activityService.monitoringProtocolForms()

        dataSetSummaries.removeAll { Map dataSetSummary ->
            Map protocolForm = forms.find{it.externalId == dataSetSummary.protocol}
            (protocolForm != null) && (!protocolForm.tags.contains(PARATOO_FORM_TAG_SURVEY))
        }
    }

    /**
     * Returns a filtered project view based on user needs.  This will be implemented in ecodata as a part of the
     * API changes but for now implementing it here is OK
     */
    Map get(String id, Map user, levelOfDetail = "") {
        Map project = get(id, levelOfDetail, false)

        // Improving the project view will be done in ecodata
        // This is a workaround until that's done.
        if (!user?.hasViewAccess) {
            project.documents = new JSONArray(project.documents.findAll{it.public})
            project.remove('sites')
            project.remove('activities')
            project.remove('reports')
        }

        project
    }

    def getRich(id) {
        get(id, 'rich')
    }

    /**
     * This does a 'soft' delete. The record is marked as inactive but not removed from the DB.
     * @param id the record to delete
     * @return the returned status
     */
    def delete(id) {
        webService.doDelete(grailsApplication.config.getProperty('ecodata.baseUrl') + 'project/' + id)
    }

    /**
     * This does a 'hard' delete. The record is removed from the DB.
     * @param id the record to destroy
     * @return the returned status
     */
    def destroy(id) {
        webService.doDelete(grailsApplication.config.getProperty('ecodata.baseUrl') + 'project/' + id + '?destroy=true')
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
    def summary(String id, boolean approvedDataOnly = false, List scoreIds = null) {

        Map result = projectSummary(id, approvedDataOnly, scoreIds)
        def scores = result?.resp
        def scoresWithTargetsByOutput = [:]
        def scoresWithoutTargetsByOutputs = [:]
        if (scores) {  // If there was an error, it would be returning a map containing the error.
            // There are some targets that have been saved as Strings instead of numbers.
            scoresWithTargetsByOutput = scores.grep{ it.hasTarget() }.groupBy { it.outputType }
            scoresWithoutTargetsByOutputs = scores.grep{ it.result && it.result.count && (it.result.result || it.result.groups) && !it.hasTarget() }.groupBy { it.outputType }
        }
        [targets:scoresWithTargetsByOutput, other:scoresWithoutTargetsByOutputs]
    }

    Map search(params) {
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl') + 'project/search', params)
    }

    /**
     * Returns summary data derived from project activities.
     * @param id  The project id.
     * @param approvedDataOnly If true, only data from approved activities will be used.
     * @param scoreIds If supplied, only data for the supplied score ids will be returned.
     * @return If the call to ecodata is successful a Map of the form: [resp: [<list of Score>]].
     * If the call to ecodata fails, a Map of the form: [error: <message>, (optional)statusCode: <HTTP status of the call>]
     *
     */
    private Map projectSummary(String id, boolean approvedDataOnly = false, List scoreIds = null) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + 'project/projectMetrics/' + id
        Map params = [approvedOnly:approvedDataOnly]
        if (scoreIds) {
            params.scoreIds = scoreIds
        }
        Map result = webService.doPost(url, params)
        if (result.resp) {
            result.resp = result.resp.collect{new Score(it)}
        }
        result
    }


    Map targetsAndScoresForActivity(String activityId) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + 'project/scoreDataForActivityAndProject/' + activityId
        Map result = webService.getJson2(url)

        if (result.statusCode == HttpStatus.SC_OK) {
            List projectScores = result.resp?.projectScores?.collect{new Score(it)}.findAll({it.hasTarget()})
            List scoreIdsWithTargets = projectScores.collect{it.scoreId}
            result.resp.projectScores = projectScores
            result.resp.activityScores = result.resp?.activityScores.collect{new Score(it)}.findAll{it.scoreId in scoreIdsWithTargets}
        }

        result
    }

    /**
     * Returns true if the report identified by reportId belongs to the project identified by projectId.
     */
    boolean doesReportBelongToProject(String projectId, String reportId) {
        Map report = reportService.get(reportId)
        report?.projectId == projectId
    }

    /**
     * Returns true if the report identified by reportId belongs to the project identified by projectId.
     */
    boolean doesActivityBelongToProject(String projectId, String activityId) {
        Map activity = activityService.get(activityId)
        activity?.projectId == projectId
    }

    /**
     * Get the list of users (members) who have any level of permission for the requested projectId
     *
     * @param projectId
     * @return
     */
    def getMembersForProjectId(projectId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/getMembersForProject/${projectId}"
        webService.getJson(url)
    }

    /**
     * Sends an email related to a project.
     * @param emailTemplate a closure that will be passed the project configuration and should return an EmailTemplate
     * @param project the project the email is about.
     * @param initiatorRole the role of the user that initiated the email - this will determine whether grant managers
     * or admins will be sent/copied on the email.
     * @param senderEmail the email to use for the from address.  Defaults to the current logged in user but
     * is a parameter so a scheduled task can specify the merit support email address.
     * @param model  The model containing substitution parameters to be used by the email template
     */
    void sendEmail(Closure<ProgramConfig> emailTemplate, Map project, String initiatorRole, String senderEmail = null, Map model = null) {

        ProgramConfig config = projectConfigurationService.getProjectConfiguration(project)
        List roles = getMembersForProjectId(project.projectId)
        EmailTemplate template = emailTemplate(config)
        if (!model) {
            model = [project:project]
        }
        emailService.sendEmail(template, model, roles, initiatorRole, senderEmail)
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
            def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/isUserAdminForProject?projectId=${projectId}&userId=${userId}"
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
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/isUserCaseManagerForProject?projectId=${projectId}&userId=${userId}"
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

    /**
     * Updates a project, taking actions as required where important fields (e.g. dates) are changed.
     * @param id the projectId
     * @param projectDetails the data to update
     * @param byPassLockCheck Updates to the MERI plan by users need a lock, however some operations
     * (e.g. data set updates need to merge the custom object, the org report can bulk update annoucements) can
     * be performed without a lock.
     * @return
     */
    def update(String id, Map projectDetails, boolean bypassMeriPlanLockCheck = true) {
        def defaultTimeZone = TimeZone.default
        TimeZone.setDefault(TimeZone.getTimeZone('UTC'))

        def resp = [:]

        Map options = projectDetails.remove('options')
        // Changing project dates requires some extra validation and updates to the stage reports.  Only
        // do this check for existing projects for which the planned start and/or end date is being changed

        boolean regenerateReports = false
        if (id) {

            String plannedStartDate = projectDetails.remove('plannedStartDate')
            String plannedEndDate = projectDetails.remove('plannedEndDate')

            def currentProject = get(id)
            if (plannedStartDate || plannedEndDate) {

                if (currentProject.plannedStartDate != plannedStartDate || currentProject.plannedEndDate != plannedEndDate) {
                    resp = changeProjectDates(id, plannedStartDate ?: currentProject.plannedStartDate, plannedEndDate ?: currentProject.plannedEndDate, options)
                }
            }

            // If the project name has changed, we need to regenerate reports to update any occurrences of the project name
            if (projectDetails.name) {

                if (currentProject.name != projectDetails.name) {
                    if (nameChangeAllowed(currentProject)) {
                        regenerateReports = true
                    }
                    else {
                        projectDetails.remove('name')
                    }
                }
            }

            // Don't allow MERI plan updates unless the user holds the lock.
            // Since it is modelled as an embedded object, we manually update the lastUpdated date as GORM
            // won't do it automatically.
            // The MERI Plan and data set summaries should be modelled as separate entities in a future change.
            if (projectDetails.custom) {

                if (projectDetails.custom.details && !bypassMeriPlanLockCheck && !lockService.userHoldsLock(currentProject.lock)) {
                    return [error:'MERI plan is locked by another user', noLock:true]
                }
                projectDetails.custom.details?.lastUpdated = DateUtils.formatAsISOStringNoMillis(new Date())
            }
        }

        if (projectDetails) {
            resp = updateUnchecked(id, projectDetails)
        }

        // We need to regenerate the reports because of the name change.  We do this after the update so the name
        // change has occurred.
        if (!resp?.error && regenerateReports) {
            generateProjectStageReports(id, new ReportGenerationOptions())
        }

        TimeZone.setDefault(defaultTimeZone)
        return resp
    }

    /**
     * For most projects, only FC_ADMINs can change the project name.  RLP projects are allowed name changes
     * via the MERI plan workflow.
     */
    private boolean nameChangeAllowed(Map project) {
        ProgramConfig config = projectConfigurationService.getProjectConfiguration(project)
        return userService.userIsAlaOrFcAdmin() || (!isMeriPlanSubmittedOrApproved(project) && config.getProjectTemplate() == ProgramConfig.ProjectTemplate.RLP)
    }

    /** Extracts date change options from a payload */
    ReportGenerationOptions dateChangeOptions(Map payload) {
        Map options = [:]
        // These are configuration items containing instructions for how to modify dates, not project information.
        options.updateActivities = Boolean.valueOf(payload?.changeActivityDates)
        options.includeSubmittedAndApprovedReports = Boolean.valueOf(payload?.includeSubmittedReports)
        options.keepExistingReportDates = Boolean.valueOf(payload?.keepReportEndDates)
        options.dateChangeReason = payload?.dateChangeReason

        new ReportGenerationOptions(options)
    }

    private updateUnchecked(String id, Map projectDetails) {
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl') + 'project/' + id, projectDetails)
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
            def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/canUserEditProject?projectId=${projectId}&userId=${userId}"
            userCanEdit = webService.getJson(url)?.userIsEditor?:false
        }

        userCanEdit
    }

    Map lockMeriPlanForEditing(String projectId) {
        Map project = get(projectId)
        if (!project.planStatus || project.planStatus == PLAN_NOT_APPROVED) {
            Map resp = lockService.lock(projectId)
            if (resp.resp && !resp.resp.error) {
                return [message:'success']
            }
            else {
                return [error:resp?.resp?.error]
            }
        }
        return [error:'Invalid plan status']
    }

    Map overrideLock(String projectId, String entityUrl) {
        Map project = get(projectId)
        lockService.stealLock(projectId, project, entityUrl, SettingPageType.PROJECT_LOCK_STOLEN_EMAIL_SUBJECT, SettingPageType.PROJECT_LOCK_STOLEN_EMAIL)
        // This is done in the projectService instead of the lockService as the
        // same use case for an Activity has the lock aquired as a part of the redirect
        lockService.lock(projectId)
    }


    def submitPlan(String projectId) {
        def project = get(projectId)

        if (!project.planStatus || project.planStatus == PLAN_NOT_APPROVED) {
            if (project.lock && project.lock?.userId != userService.getCurrentUserId()) {
                return [error:'MERI plan is locked by another user']
            }
            else {
                if (project.lock) {
                    lockService.unlock(projectId)
                }
                def resp = update(projectId, [planStatus: PLAN_SUBMITTED])
                if (resp.resp && !resp.resp.error) {

                    sendEmail({ ProgramConfig programConfig -> programConfig.getPlanSubmittedTemplate() }, project, RoleService.PROJECT_ADMIN_ROLE)
                    return [message: 'success']
                } else {
                    return [error: "Update failed: ${resp?.resp?.error}"]
                }
            }
        }
        return [error:'Invalid plan status']
    }

    def approvePlan(String projectId, Map approvalDetails) {
        def project = get(projectId)
        if (project.planStatus == PLAN_SUBMITTED) {

            //The MERI plan cannot be approved until an internal order number has been supplied for the project.
            if (!validateExternalIds(project.externalIds)) {
                return [error: 'A SAP internal order or TechOne code must be supplied before the MERI Plan can be approved']
            }

            //When the MERI plan is first approved, the status is changed to "active"
            def resp = project.status == APPLICATION_STATUS ? update(projectId, [planStatus:PLAN_APPROVED, status:ACTIVE])
                    : update(projectId, [planStatus:PLAN_APPROVED])
            if (resp.resp && !resp.resp.error) {
                createMeriPlanApprovalDocument(project, approvalDetails)
                sendEmail({ProgramConfig programConfig -> programConfig.getPlanApprovedTemplate()}, project, RoleService.GRANT_MANAGER_ROLE)
                return [message:'success']
            }
            else {
                return [error:"Update failed: ${resp?.resp?.error}"]
            }
        }
        return [error:'Invalid plan status']

    }

    /** The list of external ids needs to include at least one SAP Internal Order or one Tech One Project Code */
    private boolean validateExternalIds(List externalIds) {
        List requiredIdTypes = ["INTERNAL_ORDER_NUMBER", "TECH_ONE_CODE"]
        externalIds?.find{it.idType in requiredIdTypes && it.externalId}
    }

    boolean requiresMERITAdminToModifyPlan(Map project) {
        ProgramConfig config = projectConfigurationService.getProjectConfiguration(project)
        config.requireMeritAdminToReturnMeriPlan
    }

    def rejectPlan(String projectId) {
        def project = get(projectId)
        if (project.planStatus == PLAN_APPROVED && requiresMERITAdminToModifyPlan(project) && !userService.userIsAlaOrFcAdmin()) {
            return [error: 'Only MERIT admins can return MERI plans for this program']
        }
        if (project.planStatus in [PLAN_SUBMITTED, PLAN_APPROVED]) {
            def resp = update(projectId, [planStatus:PLAN_NOT_APPROVED])
            if (resp.resp && !resp.resp.error) {
                sendEmail({ProgramConfig programConfig -> programConfig.getPlanReturnedTemplate()}, project, RoleService.GRANT_MANAGER_ROLE)
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
                Map doc = [name:"Approval to correct project information for "+project.projectId, projectId:projectId, type:'text', role: DOCUMENT_ROLE_APPROVAL, labels:['correction'], filename:project.projectId+'-correction-approval.txt', readOnly:true, "public":false]
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
     * Retrieves / sets up the data that is required by project report state changes (submission / approval / rejection).
     */
    private Map prepareReport(String projectId, Map reportDetails) {
        reportDetails.projectId = projectId

        Map project = get(projectId, 'all')
        Map report = project?.reports?.find{it.reportId == reportDetails.reportId}
        if (!report) {
            return [error:'Invalid reportId supplied']
        }
        ProgramConfig config = projectConfigurationService.getProjectConfiguration(project)
        List roles = getMembersForProjectId(project.projectId)

        return [project: project, roles: roles, report:report, config: config]
    }

    /**
     * Submits a report of the activities performed during a specific time period (a project stage).
     * @param projectId the project the performing the activities.
     * @param reportDetails details of the report, including the ids of the activities being reported against.
     * @return a Map containing a boolean flag "success" and a String "error" if success == false
     */
    Map submitReport(String projectId, Map reportDetails) {

        Map reportInformation = prepareReport(projectId, reportDetails)
        if (reportInformation.error) {
            return [success:false, error:reportInformation.error]
        }

        EmailTemplate emailTemplate = ((ProgramConfig)reportInformation.config).getReportSubmittedTemplate()
        Map result = reportService.submitReport(reportDetails.reportId, reportDetails.activityIds, reportInformation.project, reportInformation.roles, emailTemplate)
        if (result.success) {
            createStageReportDocument(reportInformation.project, reportDetails, reportInformation.report)
        }
        result
    }

    /**
     * Creates a PDF document containing details of the report and attaches it as a document to the project.
     */
    private void createStageReportDocument(Map project, Map reportDetails, Map report) {
        String projectId = project.projectId

        String stageName = reportDetails.stage ?: report.name
        String stageNum = ''
        if (stageName.indexOf('Stage ') == 0) {
            stageNum = stageName.substring('Stage '.length(), stageName.length())
        }
        def param = [project: project, activities: project.activities, report: report, status: "Report submitted"]
        def htmlTxt = createHTMLStageReport(param)
        def dateWithTime = new SimpleDateFormat("yyyy_MM_dd_hh_mm_ss")
        def name = project?.grantId + '_' + stageName + '_' + dateWithTime.format(new Date()) + ".pdf"
        def doc = [name: name, projectId: projectId, saveAs: 'pdf', type: 'pdf', role: 'stageReport', filename: name, readOnly: true, "public": false, stage: stageNum]
        documentService.createTextDocument(doc, htmlTxt)
    }

    /**
     * Approves a submitted report.
     * @param projectId the owner of the report.
     * @param reportDetails details of the report and the related activities, specifically a list of activity ids.
     */
    Map approveReport(String projectId, Map reportDetails) {

        Map reportInformation = prepareReport(projectId, reportDetails)
        if (reportInformation.error) {
            return [success:false, error:reportInformation.error]
        }

        EmailTemplate emailTemplate = ((ProgramConfig)reportInformation.config).getReportApprovedTemplate()
        Map result = reportService.approveReport(reportDetails.reportId, reportDetails.activityIds, reportDetails.reason, reportInformation.project, reportInformation.roles, emailTemplate)
        if (result && result.success) {
            createReportApprovalDocument(reportInformation.project, reportDetails)

            // Close the project when the last stage report is approved.
            if (isFinalReportApproved(reportInformation.project, reportDetails.reportId)) {
                completeProject(projectId)
            }
        }

        result
    }

    private boolean isFinalReportApproved(Map project, String approvedReportId) {
        // Close the project when the last stage report is approved.
        // Some projects have extra stage reports after the end date due to legacy data so this checks we've got the last stage within the project dates
        List validReports = project.reports?.findAll{it.fromDate < project.plannedEndDate ? it.fromDate : project.plannedStartDate}

        List incompleteReports = (validReports?.findAll{PublicationStatus.requiresAction(it.publicationStatus)})?:[]

        return incompleteReports.size() ==1 && incompleteReports[0].reportId == approvedReportId
    }

    private void createReportApprovalDocument(Map project, Map reportDetails) {
        def readableId = project.grantId + (project.externalId?'-'+project.externalId:'')
        def name = "${readableId} ${reportDetails.stage} approval"
        def doc = [name:name, projectId:project.projectId, type:'text', role: DOCUMENT_ROLE_APPROVAL, filename:name, readOnly:true, "public":false, reportId:reportDetails.reportId]
        documentService.createTextDocument(doc, (project as JSON).toString())
    }

    /**
     * Records the details of the MERI plan approval in a text document.
     * @param project the project that has had the MERI plan approved
     * @param approvalDetails information supplied by the approver.
     */
    private void createMeriPlanApprovalDocument(Map project, Map approvalDetails) {
        def readableId = project.grantId + (project.externalId?'-'+project.externalId:'')
        def name = "${readableId} MERI plan approved ${approvalDetails.dateApproved}"

        if (!approvalDetails.dateApproved) {
            approvalDetails.dateApproved = DateUtils.format(new DateTime().withZone(DateTimeZone.UTC))
        }
        approvalDetails.approvedBy = userService.getCurrentUserId()
        DateTime dateApproved = DateUtils.parse(approvalDetails.dateApproved)
        String filename = 'meri-approval-'+project.projectId+"-"+dateApproved.getMillis()+'.txt'
        Map approvalContent = new HashMap(approvalDetails)
        approvalContent.project = project
        def doc = [name:name, projectId:project.projectId, type:'text', role: DOCUMENT_ROLE_APPROVAL, filename:filename, readOnly:true, "public":false, labels:['MERI']]
        documentService.createTextDocument(doc, (approvalContent as JSON).toString())
    }

    private void completeProject(String projectId) {
        Map values = [status:COMPLETE]
        update(projectId, values)
    }

    /**
     * Rejects / returns for rework a submitted report.
     * @param projectId the project the performing the activities.
     * @param reportDetails details of the activities, specifically a list of activity ids.
     */
    def rejectReport(String projectId, Map reportDetails) {
        Map reportInformation = prepareReport(projectId, reportDetails)
        if (reportInformation.error) {
            return [success:false, error:reportInformation.error]
        }

        EmailTemplate emailTemplate = ((ProgramConfig)reportInformation.config).getReportReturnedTemplate()
        Map result = reportService.rejectReport(reportDetails.reportId, reportDetails.activityIds, reportDetails.reason, reportDetails.categories, reportInformation.project, reportInformation.roles, emailTemplate)

        result
    }

    def cancelReport(String projectId, Map reportDetails) {
        Map reportInformation = prepareReport(projectId, reportDetails)
        if (reportInformation.error) {
            return [success:false, error:reportInformation.error]
        }

        Map result = reportService.cancelReport(reportDetails.reportId, reportDetails.activityIds, reportDetails.reason, reportInformation.project, reportInformation.roles)

        result
    }

    def unCancelReport(String projectId, Map reportDetails) {
        Map reportInformation = prepareReport(projectId, reportDetails)
        if (reportInformation.error) {
            return [success:false, error:reportInformation.error]
        }

        Map result = reportService.unCancelReport(reportDetails.reportId, reportDetails.activityIds, reportDetails.reason, reportInformation.project, reportInformation.roles)

        result
    }

    /**
     * Creates a report to offset the scores produced by the supplied report without having to unapprove the original report and edit the data.
     * @param projectId the project the report belongs to.
     * @param reportId identifies the report to adjust
     * @param adjustmentReason the reason for the adjustment.
     * @return a Map containing the result of the adjustment, including a error key it if failed.
     */
    Map adjustReport(String projectId, String reportId, String adjustmentReason) {

        Map reportInformation = prepareReport(projectId, [reportId:reportId])
        if (reportInformation.error) {
            return [success:false, error:reportInformation.error]
        }
        EmailTemplate emailTemplate = ((ProgramConfig)reportInformation.config).getReportAdjustedTemplate()

        reportService.createAdjustmentReport(reportId, adjustmentReason, reportInformation.config, reportInformation.project, reportInformation.roles, emailTemplate)
    }

    /**
     * Deletes the activities associated with a report.
     */
    Map deleteReportActivities(String reportId, List<String> activityIds) {

        Map report = reportService.get(reportId)

        Map result
        if (!reportService.excludesNotApproved(report)) {
            result = activityService.bulkDeleteActivities(activityIds)
        }
        else {
            result = [status:HttpStatus.SC_BAD_REQUEST, error:"Cannot delete submitted or approved stages"]
        }
        return result

    }

    /**
     * This method changes a project start and end date
     *
     * @param projectId the ID of the project
     * @param plannedStartDate an ISO 8601 formatted date string describing the new start date of the project.
     * * @param plannedStartDate an ISO 8601 formatted date string describing the new end date of the project.
     * @param updateActivities set to true if existing activities should be modified to fit into the new schedule
     */
    def changeProjectDates(String projectId, String plannedStartDate, String plannedEndDate, Map options = [:]) {
        Map response

        Map project = get(projectId)
        String previousStartDate = project.plannedStartDate
        ReportGenerationOptions dateChangeOptions = dateChangeOptions(options)

        String validationResult = validateProjectDates(projectId, plannedStartDate, plannedEndDate, dateChangeOptions)
        if (validationResult == null) {

            // The update method in this class treats dates specially and delegates the updates to this method.
            response = updateUnchecked(projectId, [plannedStartDate:plannedStartDate, plannedEndDate:plannedEndDate])

            //user explicitly generates the report from the reporting tab
            generateProjectStageReports(projectId, dateChangeOptions)

            if (dateChangeOptions.updateActivities) {
                updateActivityDates(projectId, previousStartDate)
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

    String validateProjectDates(String projectId, String plannedStartDate, String plannedEndDate, ReportGenerationOptions options) {

        if (plannedStartDate > plannedEndDate) {
            return "Start date must be before end date"
        }
        Map project = get(projectId, 'all')
        ProgramConfig config = projectConfigurationService.getProjectConfiguration(project)

        String startDateMessage = validateProjectStartDate(project, config, plannedStartDate, options)
        String endDateMessage = validateProjectEndDate(project, config, plannedEndDate, options)

        String message = [startDateMessage, endDateMessage].findAll().join('\n')
        message ?: null // Return null rather than an empty string
    }

    private String validateProjectEndDate(Map project, ProgramConfig config, String plannedEndDate, ReportGenerationOptions options) {

        if (project.plannedEndDate == plannedEndDate) {
            // The start date hasn't changed
            return null
        }
        String message
        if (config.activityBasedReporting) {

            if (!options.updateActivities) {
                Map lastActivity = project.activities?.max{it.plannedEndDate}
                if (lastActivity && plannedEndDate < lastActivity.plannedEndDate) {
                    message = "The project end date must be on or after ${DateUtils.isoToDisplayFormat(lastActivity.plannedEndDate)}"
                }
            }
        }
        else {
            Map lastReport = reportService.lastReportWithDataByCriteria(project.reports, {it.toDate})
            String plannedEndDateAlignedToReportingSchedule = DateUtils.format(DateUtils.parse(plannedEndDate).plusDays(1))
            // We allow reports to be generated up to 24 hours after the end of a project due to
            // project end dates being 00:00 of the last day of the project instead of 23:59:...
            if (lastReport) {
                ReportConfig reportConfig = config.findProjectReportConfigForReport(lastReport)
                String lastReportFromDate = DateUtils.format(DateUtils.parse(lastReport?.fromDate).plusDays(reportConfig.minimumReportDurationInDays))
                if (plannedEndDateAlignedToReportingSchedule < lastReportFromDate) {
                    message = "The project end date must be on or after ${DateUtils.isoToDisplayFormat(DateUtils.format(DateUtils.parse(lastReportFromDate).minusDays(1)))}"
                }
            }
        }
        message
    }

    /**
     * Returns null if the project dates can be changed.  Otherwise returns an error message.  Rules for
     * date changes for activity based (non-RLP) projects are different to RLP projects.
     */
    private String validateProjectDatesForActivityBasedProjects(Map project, String plannedStartDate, ReportGenerationOptions options) {

        String result = null

        // Allow FC_ADMINS to change project dates even with an approved plan as they are likely just
        // correcting bad data.
        boolean projectHasApprovedOrSubmittedReports = reportService.includesSubmittedOrApprovedReports(project.reports)
        if (!userService.userIsAlaOrFcAdmin()) {
            if (isMeriPlanSubmittedOrApproved(project)) {
                result = "Cannot change project dates when the MERI plan is approved"
            }
            if (project.plannedStartDate != plannedStartDate && projectHasApprovedOrSubmittedReports) {
                result = "Cannot change the start date of a project with submitted or approved reports"
            }
        }
        else {
            if (projectHasApprovedOrSubmittedReports && !options.includeSubmittedAndApprovedReports) {
                result = "Cannot change the start date of a project with submitted or approved reports"
            }
        }

        if (!result && !options.updateActivities) {
            Map firstActivity = project.activities?.min{it.plannedStartDate}
            if (firstActivity && plannedStartDate > firstActivity.plannedStartDate) {
                result = "The project start date must be before the first activity in the project ( ${DateUtils.isoToDisplayFormat(firstActivity.plannedStartDate)} )"
            }
        }
        return result
    }


    String validateProjectStartDate(Map project, ProgramConfig config, String plannedStartDate, ReportGenerationOptions options) {
        if (project.plannedStartDate == plannedStartDate) {
            // The start date hasn't changed
            return null
        }

        String message
        if (config.activityBasedReporting) {
            message = validateProjectDatesForActivityBasedProjects(project, plannedStartDate, options)
        }
        else {
            Map firstReport = reportService.firstReportWithDataByCriteria(project.reports, {report -> report.toDate})
            if (firstReport) {

                if (plannedStartDate > firstReport.toDate) {
                    message = "Data exists for ${firstReport.name}.  The project start date must be before ${DateUtils.isoToDisplayFormat(firstReport.toDate)}."
                } else {
                    // If there are reports containing data, don't allow the start date to be moved backwards in time
                    // far enough to introduce a new report as the rules for that are not implemented.
                    ReportGenerator generator = new ReportGenerator()
                    ReportOwner owner = projectReportOwner(project)
                    owner.periodStart = plannedStartDate
                    config.projectReports?.each { Map reportConfig ->
                        List reports = generator.generateReports(new ReportConfig(reportConfig), owner, 1, null)
                        int matchingReportIndex = reports.findIndexOf{DateUtils.within(DateUtils.parse(firstReport.toDate), DateUtils.parse(it.toDate), Period.days(1))}
                        int currentReportIndex = project.reports.findIndexOf{it == firstReport}
                        if (matchingReportIndex > currentReportIndex) {
                            message = "The project start date must be on or after ${DateUtils.isoToDisplayFormat(reports[matchingReportIndex - currentReportIndex].fromDate)}"
                        }
                    }
                }
            }

        }

        return message
    }

    Map getProgramConfiguration(Map project) {
        if (!project) {
            return [:]
        }
        projectConfigurationService.getProjectConfiguration(project)
    }


    private ReportOwner projectReportOwner(Map project) {
        new ReportOwner(
                id:[projectId:project.projectId],
                name:project.name,
                periodStart:project.plannedStartDate,
                periodEnd:project.plannedEndDate
        )
    }

    /**
     * Creates or re-creates project reports according the supplied configuration and project dates.
     *
     * @param reportConfig defines the type of report and the dates required.
     * @param project the project the reports are for
     * @param includeSubmittedAndApproved if true, submitted and approved reports can be regenerated or moved.  This should be used with caution.
     * @param deleteReportsBeforeNewStartDate if true, if the project start date is after the end date of a report, the report will be deleted
     * rather than the dates changed to match the new project dates.  This was designed for situations (e.g.) RLP where
     * empty reports exist because the projects were loaded with a start date earlier than the actual execution date
     * (due to those dates not being known) and the dates being updated after more than one reporting period has passed.
     * (e.g the 2nd report has data against correct dates, so we dont' want to move this, instead we delete the first report).
     */
    private void generateProjectReports(String category, List<Map> reportConfig, Map project, ReportGenerationOptions options) {
        if (canRegenerateReports(project)) {
            ReportOwner reportOwner = projectReportOwner(project)
            List<ReportConfig> configs = reportConfig.collect{new ReportConfig(it)}
            List reportsOfType = project.reports?.findAll{it.category == category}?.sort{it.toDate}

            if (options.includeSubmittedAndApprovedReports) {
                int index = 0

                // To keep existing reporting dates when we move the start date forward we may need to delete reports
                // that have been excluded by the new start date. (rather than moving it forward)
                if (options.keepExistingReportDates) {
                    Map report = reportsOfType ? reportsOfType[index] : null
                    // Handle reports that may have been cut off by the start date change.
                    while (report && report.toDate <= project.plannedStartDate) {
                        if (!reportService.hasData(report)) {
                            reportService.delete(report.reportId)
                        }
                        else {
                            log.warn("Unable to delete report ${report.name} with toDate ${report.toDate} as it has data.")
                        }
                        report = reportsOfType ? reportsOfType[++index] : null

                    }
                }
                reportService.regenerateReports(reportsOfType, configs, reportOwner, index-1)
            }
            else {
                // Regenerate reports starting from the first unsubmitted report
                reportService.regenerateReports(reportsOfType, configs, reportOwner)
            }
        }
    }

    /**
     * Modifies project activities to keep the dates in sync with a change to the project dates.
     */
    private void updateActivityDates(String projectId, String previousStartDateString) {

        Map project = get(projectId)
        DateTime newStartDate = DateUtils.parse(project.plannedStartDate)
        DateTime previousStartDate = DateUtils.parse(previousStartDateString)
        def daysStartChanged = Days.daysBetween(previousStartDate, newStartDate).days

        def activities = activityService.activitiesForProject(projectId)
        activities.each { activity ->

            def newActivityStartDate = DateUtils.format(DateUtils.parse(activity.plannedStartDate).plusDays(daysStartChanged))
            def newActivityEndDate = DateUtils.format(DateUtils.parse(activity.plannedEndDate).plusDays(daysStartChanged))

            // Account for any rounding errors that would result in the activity falling outside the project date range.
            if (newActivityStartDate > newActivityEndDate) {
                newActivityStartDate = newActivityEndDate
            }
            if (newActivityStartDate < project.plannedStartDate) {
                newActivityStartDate = project.plannedStartDate
            }
            if (newActivityEndDate > project.plannedEndDate) {
                newActivityEndDate = project.plannedEndDate
            }
            activityService.update(activity.activityId, [activityId: activity.activityId, plannedStartDate: newActivityStartDate, plannedEndDate: newActivityEndDate])

        }
    }

    def generateProjectStageReports(String projectId, ReportGenerationOptions options, List categoriesToRegenerate = null) {
        def project = get(projectId)
        def programConfig = getProgramConfiguration(project)

        if (programConfig.projectReports) {
            Map<String, List<Map>> groupedConfiguration = programConfig.projectReports.groupBy{ it.category }
            groupedConfiguration.each { String category, List reportConfig ->
                if (!categoriesToRegenerate || category in categoriesToRegenerate) {
                    generateProjectReports(category, reportConfig, project, options)
                }

            }
        }
        else {
            log.warn("No project report configuration for project ${project.projectId}")
        }

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
     * This method returns the range in which the project end date is allowed to fall.  A null minimum date indicates
     * any end date is OK (although it will need to be after the new start date which will be validated separately).
     */
    String minimumProjectEndDate(Map project, Map projectConfiguration) {

        String minimumDate
        // If activities are autogenerated, we don't mind deleting planned activities
        if (projectConfiguration.autogeneratedActivities) {
            minimumDate = project.reports?.findAll{it.progress != ActivityService.PROGRESS_PLANNED}?.max{it.fromDate}?.fromDate
            // We allow reports to be generated up to 24 hours after the end of a project due to
            // project end dates being 00:00 of the last day of the project instead of 23:59:..
            if (minimumDate) {
                minimumDate = DateUtils.format(DateUtils.parse(minimumDate).minusDays(1))
            }
        }
        // Otherwise we don't want to delete any activities
        else {
            minimumDate = project.activities?.max{it.plannedEndDate}?.plannedEndDate
        }

        minimumDate

    }

    /**
     * Returns true if project reports are allowed to be regenerated.
     * This allows project dates to be changed while a project is in the Application status
     *  @param project the project to check, expects the reports property to have
     * been populated with project reports.
     */
    boolean canRegenerateReports(Map project) {
        Status.isActive(project.status) && !hasSubmittedOrApprovedFinalReportInCategory(project)
    }

    /**
     * Checks if the supplied project has any reports that can't be modified
     * with an end date that overlaps the project end date.  this check is required
     * to prevent issues that can occur when extending a project end date where a report
     * that would otherwise be extended cannot be extended, resulting in a extra report
     * being inserted to fill the gap.
     * @param project the project to check, expects the reports property to have
     * been populated with project reports.
     */
    boolean hasSubmittedOrApprovedFinalReportInCategory(Map project) {
        if (!project.reports) {
            return false
        }
        List reports = new ArrayList(project.reports)
        reports?.groupBy{it.category}.find { String category, List reportsInCategory ->
            // Sort by toDate first, then fromDate as there is a special case
            // (a single day final report) where the to date matches the previous
            // report to date due to how project end dates are represented.
            reportsInCategory.sort{it.toDate+'-'+it.fromDate}
            Map finalReportInCategory = reportsInCategory[-1]
            finalReportInCategory.toDate >= project.plannedEndDate && reportService.excludesNotApproved(finalReportInCategory)
        }
    }

    boolean canEditActivity(Map activity) {
        Map project = get(activity.projectId)
        // We allow activities to be edited if the project has been unlocked for post-aquittal data correction.
        if (isComplete(project)) {
            return project.planStatus == PLAN_UNLOCKED
        }

        // Activities in a submitted or approved report cannot be edited
        Map report = reportService.findReportForDate(activity.plannedEndDate, project.reports)
        return !reportService.excludesNotApproved(report) && Status.isActive(report?.status)
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
				String units = data?.units ?: '';
				double total = data.result?.result ?: 0.0
				append(html,"<tr><td>${data.outputType}</td><td>${data.label}</td><td>${total}</td><td>${data.target} ${units}</td></tr>")
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
                    def type = metadataService.annotatedOutputDataModel(activity.type, outputType, activity.formVersion)

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


    List<Map> getServiceScoresForProject(String projectId) {
        Map project = get(projectId, 'flat')
        getProjectServices(project)
    }

    List<Map> getProjectServices(Map project, ProgramConfig programConfig) {
        List<Map> supportedServices = programConfig.services
        List serviceIds = project.custom?.details?.serviceIds?.collect{it as Integer}
        List projectServices = supportedServices?.findAll {it.id in serviceIds || it.mandatory }

        projectServices
    }

    List<Map> getProjectServices(Map project) {
        ProgramConfig config = projectConfigurationService.getProjectConfiguration(project)
        getProjectServices(project, config)
    }

    /** Returns a list of activity types that have been selected for implementation by a project in the MERI plan */
    List<String> getProjectActivities(Map project, ProgramConfig config) {
        List activityNames = project?.custom?.details?.activities?.activities ?: []
        List programActivities = config?.activities ?: []

        // Match the program activities by the activity name recorded in the project MERI plan
        activityNames.collect { String activityName ->  programActivities.find{it.name == activityName} }
    }


    /**
     * Returns a the List of services being delivered by this project with target information for each score.
     * @param projectId the projectId of the project
     * @return a data structure similar to:
     * [
     *    name:<service name>,
     *    id:<service id>,
     *    scores:[
     *         [
     *             scoreId:<id>,
     *             label:<score description>,
     *             isOutputTarget: <true/false>,
     *             target:<target defined for this score in the MERI plan, may be null>
     *             periodTargets: [
     *                 [
     *                     period:<string of form year1/year2, eg. 2017/2018, as it appears in the MERI plan>,
     *                     target:<minimum target for this score during the period>
     *                 ]
     *             ]
     *         ]
     *    ]
     * ]
     *
     */
    List<Map> getProjectServicesWithTargets(String projectId) {
        Map project = get(projectId, 'flat')

        List serviceIds = project.custom?.details?.serviceIds?.collect{it as Integer}

        ProgramConfig config = projectConfigurationService.getProjectConfiguration(project)
        List<Map> supportedServices = config.services
        List projectServices = supportedServices?.findAll {it.id in serviceIds }
        List targets = project.outputTargets

        // Make a copy of the services as we are going to augment them with target information.
        List results = projectServices.collect { service ->
            [
                    name:service.name,
                    id: service.id,
                    scores: service.scores?.collect { score ->
                        new Score([scoreId: score.scoreId, label: score.label, isOutputTarget:score.isOutputTarget, relatedScores:score.relatedScores])
                    }
            ]
        }
        results.each { service ->
            service.scores?.each  { score ->
                Map target = targets.find {it.scoreId == score.scoreId}
                score.target = target?.target
                score.periodTargets = target?.periodTargets
            }
        }

        results
    }

    /**
     * Returns the data structure from getProjectServicesWithTargets, however each score contains information
     * about the amount the supplied activity contributed to that score under a field named "data".
     * This is used specifically to pre-prop the output report adjustment form.
     * @param projectId the project of interest
     * @param activityId the activity of interest
     */
    List<Map> getServiceDataForActivity(String projectId, String activityId) {

        List services = getProjectServicesWithTargets(projectId)
        List scoreIds = services.collect { it.scores?.collect { score -> score.scoreId } }.flatten()

        Map results = reportService.scoresForActivity(projectId, activityId, scoreIds)

        // Attach the data to each service score
        services.each { service ->
            service.scores?.each { score ->
                Map data = results.scores?.find { it.scoreId == score.scoreId }
                if (data) {
                    score.data = data.result
                }
            }
        }
    }


    List findMinimumTargets(String projectId, String financialYear, boolean missedTargetsOnly) {
        Map report = reportProjectPeriodTargets(projectId)

        List targets = []
        report?.services.each { service ->
            service.scores?.each { score ->
                if (score.periodTargets) {
                    Map target = score.periodTargets.find { it.period == financialYear }

                    if (!missedTargetsOnly || missedTarget(target)) {
                        targets << [service:service.name, targetMeasure:score.label, projectTarget:score.target?:0, financialYearTarget:target?.target?:0, financialYearResult:target?.result?:0]

                    }

                }
            }
        }

        targets
    }


    private boolean missedTarget(Map targetData) {
        if (!targetData) {
            return false
        }
        BigDecimal target = new BigDecimal(targetData.target ?: 0)
        BigDecimal result = new BigDecimal(targetData.result ?: 0)
        return target > result
    }

    /**
     * If the activity type to be displayed is the RLP Outputs report, only show the outputs that align with
     * services to be delivered by the model.  This method has a side effect of modifying the
     * @param model the model containing the activity metaModel and output templates.
     * @param project the project associated with the report.
     */
    Map filterOutputModel(Map activityModel, Map project, Map existingActivityData) {

        Map filteredModel = activityModel

        ProgramConfig config = getProgramConfiguration(project)
        if (isFilterable(config, activityModel.name)) {

            List serviceOutputs
            List selectedForProject

            // The values to be filtered can come from either project services or activities in the MERI plan.
            selectedForProject = getProjectServices(project, config)


            if (!selectedForProject) {
                serviceOutputs = config.activities?.collect{it.output}.findAll()
                selectedForProject = getProjectActivities(project, config)
            }
            else {
                // We are deliberately filtering the project services against the
                // full service list instead of the services supported by the program.  This is
                // so that we can share a report containing the full service list across programs
                // and have the services filtered out.  If we just used the project/program
                // service list here, any services not on the program list would be treated
                // as non-service form sections (like WHS) and always display in the report.
                serviceOutputs = metadataService.getProjectServices().collect{it.outputs.find(
                        {it.formName == activityModel.name})?.sectionName}.findAll()
            }

            if (selectedForProject) {
                List projectOutputs = selectedForProject.collect{it.output}
                List mandatoryOutputs = selectedForProject.findAll{it.mandatory}.collect{it.output}
                // Override the mandatory flag for outputs that are mandatory for the program
                if (mandatoryOutputs) {
                    activityModel.outputConfig = new JSONArray(
                        activityModel.outputConfig.collect { Map outputConfig ->
                            if (mandatoryOutputs.contains(outputConfig.outputName)) {
                                outputConfig = new JSONObject(outputConfig)
                                outputConfig.optional = false
                            }
                            outputConfig
                        })

                }

                filteredModel = filterActivityModel(activityModel, existingActivityData, serviceOutputs, projectOutputs, mandatoryOutputs)
            }
        }
        filteredModel
    }

    List outcomesByScores(String projectId, List scoreIds) {
        Map project = get(projectId)
        outcomesByScores(project, scoreIds)
    }

    List outcomesByScores(Map project, List scoreIds) {
        List outcomes = []
        scoreIds.each { String scoreId ->
            Map target = project.outputTargets?.find{it.scoreId == scoreId}
            target?.outcomeTargets?.each { Map outcomeTarget ->
                if (outcomeTarget.relatedOutcomes) {
                    outcomes << outcomeTarget.relatedOutcomes.sort() // Otherwise "unique" won't filter out of order entries
                }
            }
        }
        outcomes?.unique()
    }

    /**
     * Determines if the FormSections / outputs of the form described by the activityModel
     * can be filtered by the selection of project services.
     * This is determined by the "filterable" flag in the report configuration defined
     * in the program configuration for the project.
     * @param config The program configuration
     * @param formName the name of the form to check
     * @return true if the form is filterable when used in a project run under the 
     * supplied ProgramConfig
     */
    private boolean isFilterable(ProgramConfig config, String formName) {

        boolean filterable = config.getProgramServices()?.serviceFormName == formName
        filterable
    }

    private Map filterActivityModel(Map activityModel, Map existingActivityData, List filterableSections, List sectionsToInclude, List mandatorySections) {
        Map filteredModel = new JSONObject(activityModel)
        List existingOutputs = existingActivityData?.outputs?.collect{it.name}
        filteredModel.outputs = activityModel.outputs.findAll({ String output ->
            boolean isFilterable = filterableSections.contains(output) && !mandatorySections.contains(output)

            // Include this output if it's not associated with a service,
            // Or if it's associated by a service delivered by this project
            // Or it has previously had data recorded against it (this can happen if the services change after the report has been completed)
            !isFilterable || output in sectionsToInclude || output in existingOutputs
        })
        filteredModel
    }


    Map reportProjectPeriodTargets(String projectId) {
        List services = getProjectServicesWithTargets(projectId)
        List scoreIds = services.collect { it.scores?.collect { score -> score.scoreId } }.flatten()
        Map results = scoresByFinancialYear(projectId, scoreIds)



        services.each { Map service ->
            service.scores?.each { Score score ->
                score.periodTargets?.each{ Map period ->


                    // Match period format to the report format.  The report uses YYYY - YYYY whereas the period is YYYY/YYYY
                    if (period.period && period.period.size() >= 4) {
                        String year = period.period[0..3]

                        results.resp?.each { Map yearGroup ->
                            if (yearGroup.group && yearGroup.group.size() >= 4) {
                                String resultYear = yearGroup.group[0..3]

                                // We can match the result to the target for this period.
                                if (resultYear == year) {
                                    Map scoreResult = yearGroup.results?.find{it.scoreId == score.scoreId}
                                    period.result = scoreResult?.result?.result ?: 0
                                }
                            }
                        }
                    }
                }
            }
        }

        [services:services]
    }


    Map scoresByFinancialYear(String projectId, List<String> scoreIds) {

        Map project = get(projectId)

        DateTime start = DateUtils.alignToFinancialYear(DateUtils.parse(project.plannedStartDate))
        DateTime end = DateUtils.alignToFinancialYear( DateUtils.parse(project.plannedEndDate))

        Map report = reportService.dateHistogramForScores(projectId, start, end.plusYears(2), Period.months(12), 'YYYY', scoreIds)

        return report
    }

    Map scoresForReport(String projectId, String reportId, List scoreIds) {
        Map project = get(projectId)
        Map report = project.reports?.find{it.reportId == reportId}
        Map result = [:]
        if (report) {
            String format = 'YYYY-MM'

            List dateBuckets = [report.fromDate, report.toDate]
            Map results = reportService.dateHistogramForScores(projectId, dateBuckets, format, scoreIds)

            // Match the algorithm used in ecodata to determine the algorithm so we can determine
            DateTime start = DateUtils.parse(report.fromDate).withZone(DateTimeZone.getDefault())
            DateTime end = DateUtils.parse(report.toDate).withZone(DateTimeZone.getDefault())

            String matchingGroup = DateUtils.format(start, format) + ' - ' + DateUtils.format(end.minusDays(1), format)
            result = results.resp?.find{ it.group == matchingGroup } ?: [:]

        }
        scoreIds.collectEntries{ String scoreId ->[(scoreId):result.results?.find{it.scoreId == scoreId}?.result?.result ?: 0]}
    }

    /**
     * Returns a map of the form:
     * [
     *     planning: true/false,
     *     services: [ <list of scores and targets for each of the project services> ]
     * ]
     */
    Map getServiceDashboardData(String projectId, boolean approvedDataOnly) {

        List<Score> projectServices = getProjectServicesWithTargets(projectId)
        List scoreIds = projectServices.collect{it.scores?.collect{ score ->

            if (score.relatedScores) {
                return score.relatedScores.collect{it.scoreId} + score.scoreId
            }
            else {
                return score.scoreId
            }

        }}.flatten()

        Map scoreSummary = projectSummary(projectId, approvedDataOnly, scoreIds)

        Map dashboard = [services:[], planning:false]
        int deliveredAgainstTargets = 0
        projectServices.each { Map service ->
            List scores = []
            service.scores.each { Score score ->

                if (score.hasTarget()) {
                    Score scoreData = scoreSummary.resp?.find{it.scoreId == score.scoreId}
                    if (scoreData?.result) {
                        score.result = scoreData.result ?: [result:0]
                        deliveredAgainstTargets += score.result?.result ?: 0
                    }
                    if (score.relatedScores) {
                        score.relatedScores.each { Map relatedScore ->
                            Score invoicedScore = new Score(
                                    [scoreId:relatedScore.scoreId,
                                     label:relatedScore.label,
                                     target:score.target,
                                     overDeliveryThreshold: 100])
                            relatedScore.score = invoicedScore

                            Score relatedScoreData = scoreSummary.resp?.find{it.scoreId == relatedScore.scoreId}
                            if (relatedScoreData) {
                                invoicedScore.result = relatedScoreData.result ?: [result:0]
                            }
                        }
                    }
                    scores << score
                }
            }
            // We only want to display scores with targets on the service dashboard,
            // some services have more than one target that may be in use by this
            // project.
            if (scores) {
                service.scores = scores
                dashboard.services << service
            }
        }
        // Once more than one target has been delivered against, the project is considered to be out of planning mode.
        dashboard.planning = deliveredAgainstTargets < 2
        dashboard
    }

    /**
     * Returns a Map with keys : projectArea (contains the site marked as the project area) and features (a List
     * of project sites as geo JSON)
     * @param projectId the id of the project to return sites for.
     */
    Map projectSites(String projectId) {
        Map result = [features:[]]
        Map projectSites = siteService.getProjectSites(projectId)
        if (projectSites && !projectSites.error) {
            List sites = projectSites.sites
            Map projectArea = projectSites?.find { it.properties?.type == SiteService.SITE_TYPE_PROJECT_AREA }
            if (projectArea) {
                result.projectArea = projectArea
            }

            sites?.each { site ->
                if (site.properties?.type == 'compound') {
                    site.properties.category = 'Reporting Sites'
                    result.features << site
                }
                else if (site.properties?.type != SiteService.SITE_TYPE_PROJECT_AREA) {
                    site.properties.category = 'Planning Sites'
                    result.features << site
                }
            }
        }
        else {
            if (projectSites && projectSites.error) {
                result.error = projectSites.error
            }

        }
        result
    }

    boolean hasProjectArea(Map project) {
        project?.sites?.find{it.type == SiteService.SITE_TYPE_PROJECT_AREA}
    }

    /**
     * Searches the audit trail for updates where the MERI plan has been approved and returns a summary of
     * those audit messages for display (and possible retreival) to the user.
     * @param projectId the project to find the history for.
     * @return a List of Maps, each of the form [documentId:<document id>, date:<the date the MERI plan was approved>, userDisplayName: <the user that approved the plan>]
     */
    List<Map> approvedMeriPlanHistory(String projectId) {

        Map result = documentService.search(projectId:projectId, role:'approval', labels:'MERI')
        List documents = result?.documents ?: []
        if (documents) {
            documents = documents.collect {
                String url = grailsApplication.config.getProperty('ecodata.baseUrl') + it.url
                Map response = webService.getJson2(url)
                Map doc = null
                if (response?.statusCode == HttpStatus.SC_OK) {
                    Map content = response.resp
                    String displayName = userService.lookupUser(content.approvedBy)?.displayName ?: 'Unknown'
                    doc = [
                            documentId:it.documentId,
                            date:content.dateApproved,
                            userDisplayName:displayName,
                            referenceDocument:content.referenceDocument,
                            reason:content.reason
                    ]
                }else{
                   doc = [
                       documentId:it.documentId,
                       date: it.lastUpdated,
                       referenceDocument: it.filename,
                       reason: "Error: "+it.name +" document is missing or damaged!"
                   ]
                }
                doc
            }
        }
        documents.sort({it.date})
        documents.findAll().reverse()
    }

    /**
     * Retrieves an approval document from the document service and extracts the project information from it.
     */
    Map getApprovedMeriPlanProject(String documentId) {
        Map result = documentService.get(documentId)
        if (!result || !result.url) {
            return null
        }

        Map content = webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + result.url)
        content
    }

    private Score findScore(String scoreId, Map scoresWithTargets) {
        Score score = null
        scoresWithTargets?.find { String key, List outputScores ->
            score = outputScores?.find{it.scoreId == scoreId}
        }

        score
    }

    /**
     * This method combines investment priorities listed in the primary and secondary outcome sections of the
     * RLP MERI plan into a single list for the purposes of pre-popluating one of the RLP outcomes reporting forms.
     * @param projectId the project of interest
     * @return a List of outcomes selected in the project MERI plan
     */
    List listProjectInvestmentPriorities(String projectId) {
        Map project = get(projectId,'flat')
        listProjectInvestmentPriorities(project)
    }

    /**
     * This method combines investment priorities listed in the primary and secondary outcome sections of the
     * RLP MERI plan into a single list for the purposes of pre-popluating one of the RLP outcomes reporting forms.
     * @param projectId the project of interest
     * @return a List of outcomes selected in the project MERI plan
     */
    List listProjectInvestmentPriorities(Map project) {
        List primaryPriorities = project?.custom?.details?.outcomes?.primaryOutcome?.assets ?: []
        List secondaryPriorities = project?.custom?.details?.outcomes?.secondaryOutcomes?.collect{it.assets}?.flatten() ?: []
        List allPriorities = primaryPriorities + secondaryPriorities
        allPriorities.findAll{it}.unique()
    }

    /** Returns all assets identified in the project MERI plan */
    List listProjectAssets(Map project) {
        project?.custom?.details?.assets?.collect{it.description}?.findAll{it}
    }

    List listProjectBaselines(Map project) {
        project?.custom?.details?.baseline?.rows
    }

    List listProjectProtocols(Map project) {

        List defaultModules = grailsApplication.config.getProperty('emsa.modules.defaults', List.class, DEFAULT_EMSA_MODULES)
        List<Map> forms = activityService.monitoringProtocolForms()
        List baselineProtocols = project?.custom?.details?.baseline?.rows?.collect{it.protocols}?.flatten() ?:[]
        List monitoringProtocols = project?.custom?.details?.monitoring?.rows?.collect{it.protocols}?.flatten() ?:[]

        List modules = (baselineProtocols + monitoringProtocols + defaultModules).unique().findAll{it}
        forms?.findAll{it.category in modules}
    }

    /**
     * Returns a map with key=<project priority>, value=<Ag or Env>
     * The map is used to determine whether the priority is associated with
     * an Environment of Agriculture outcome, which in turn allows
     * customisation of  the  questions asked in the outcomes report.
     *
     */
    Map projectPrioritiesByOutcomeType(String projectId) {
        Map project = get(projectId,'flat')
        Map config = getProgramConfiguration(project)

        Map prioritiesByOutcomeType = [:]
        List outcomes = []
        Map primaryOutcome =  project?.custom?.details?.outcomes?.primaryOutcome
        if (primaryOutcome) {
            outcomes << primaryOutcome
        }
        outcomes += project?.custom?.details?.outcomes?.secondaryOutcomes ?: []
        (outcomes).each { Map outcome ->
            Map programOutcome = config.outcomes?.find{it.outcome == outcome?.description}
            String outcomeDescription = programOutcome ? (programOutcome.shortDescription ?: programOutcome.outcome) : outcome?.description
            outcome?.assets.each {String asset  ->
                prioritiesByOutcomeType[asset] = outcomeDescription
            }
        }

        prioritiesByOutcomeType


    }

    /**
     * Returns the primary outcome specified in the project MERI plan, null if none is specified.
     * @param project the project of interest
     */
    String getPrimaryOutcome(Map project) {
        project?.custom?.details?.outcomes?.primaryOutcome?.description
    }

    /**
     * Returns the secondary outcome(s) specified in the project MERI plan, or an empty list if none are specified.
     * @param project the project of interest
     */
    List<String> getSecondaryOutcomes(Map project) {
        project?.custom?.details?.outcomes?.secondaryOutcomes?.collect{it.description} ?: []
    }

    List<String> getAllProjectOutcomes(Map project) {
        List outcomes = []
        outcomes << getPrimaryOutcome(project)
        outcomes.addAll(getSecondaryOutcomes(project))

        // Don't return null or empty values
        outcomes.findAll{it}.unique()
    }

    List getSelectedEmsaModules(Map project) {
        List baselineProtocols = project.custom?.details?.baseline?.rows?.collect{it.protocols}?.flatten() ?:[]
        List monitoringProtocols = project.custom?.details?.monitoring?.rows?.collect{it.protocols}?.flatten() ?:[]

        (baselineProtocols + monitoringProtocols).unique().findAll{it}
    }

    boolean hasSelectedEmsaModules(Map project) {
        getSelectedEmsaModules(project).findAll{it != OTHER_EMSA_MODULE}.size() > 0
    }

    @Cacheable("programList")
    List<Map> getProgramList() {
        List<Map> programs = programService.listOfAllPrograms()

        List programList = []
        List results = programs.findAll{!it.parentId}
        while (results) {
            programList.addAll(results)
            results = results.collect {Map parent ->
                programs.findAll{it.parentId == parent.programId}.collect{
                    [programId: it.programId, name:parent.name+' - '+it.name]
                }
            }.flatten()
        }
        programList.sort{it.name}
        return programList
    }

    /**
     * when reports are generated using the program or management unit pages,
     * reports should only be generated for projects with at least one existing report
     */
    boolean canBulkRegenerateReports(Map project) {
        return project.reports.size() > 0
    }

    /**
     * Updates all of the data set summaries for the supplied data set ids with the supplied properties.
     * @param dataSetIds
     * @param properties
     * @return
     */
    Map bulkUpdateDataSetSummaries(String projectId, String reportId, List dataSetIds, Map properties) {

        List errors = []
        Map project = get(projectId)
        List<Map> toUpdate = []
        dataSetIds?.each { String dataSetId ->

            Map dataSet = project.custom?.dataSets?.find{it.dataSetId == dataSetId}
            if (dataSet) {
                boolean dirty = false
                // Associate the data set with the report
                if (!dataSet.reportId) {
                    dataSet.reportId = reportId
                    dirty = true
                }
                else if (dataSet.reportId != reportId) {
                    Map report = project.reports?.find({it.reportId == dataSet.reportId})
                    String reportLabel = report?.name ?: dataSet.reportId
                    errors << "Data set ${dataSet.name} is already associated with report ${reportLabel}. " +
                            "Datasets can only be selected once into all outputs reports, please ensure that you have" +
                            " selected the correct dataset before attempting to save the report again. " +
                            "If you have selected the wrong dataset into another report, you will need to remove it" +
                            " from that report before you can select it into this report. " +
                            "If the problem persists, please contact support."
                    return
                }

                properties.each { String key, value ->
                    if (dataSet[key] != value) {
                        dataSet[key] = value
                        dirty = true
                    }
                }
                if (dirty) {
                    toUpdate << dataSet
                }
            }
            else {
                errors << "Report ${reportId} references data set ${dataSetId} which does not exist in project ${projectId}"
            }
        }
        // Disassociate any data sets that were removed from the report
        project.custom?.dataSets.findAll { Map dataSet ->
            dataSet.reportId == reportId && !(dataSet.dataSetId in dataSetIds)
        }.each {
            it.reportId = null
            it.publicationStatus = null
            toUpdate << it
        }

        Map result = [:]
        if (toUpdate) {
            // Save the changes to the data sets
            result = dataSetSummaryService.bulkUpdateDataSets(projectId, toUpdate)
            if (result?.error) {
                errors << result.error
            }
        }
        if (errors) {
            result.error = errors.join("\n")
        }
        result
    }

    List getSpeciesRecordsFromActivity (String activityId, String groupBy = DEFAULT_GROUP_BY, String operator = FLATTEN_BY_SUM) {
        if (activityId) {
            String displayFormat = 'SCIENTIFICNAME(COMMONNAME)'
            String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}record/listForActivity/${activityId}"
            List records = webService.getJson(url)?.records
            records = groupRecords(records, groupBy, operator)
            records?.each { record ->
                record.species = [
                        scientificName: record.scientificName,
                        commonName: record.vernacularName,
                        outputSpeciesId: record.outputSpeciesId,
                        guid: record.scientificNameID ?: record.guid ?: record.taxonConceptID ?: "A_GUID"
                ]

                record.species.name = speciesService.formatSpeciesName(displayFormat, record.species)
            }

            records
        }
    }

    /**
     * Groups records by the user defined attributes and applies the operator to the numeric values.
     * @param records - dwc records
     * @param groupBy - scientificName, individualsOrGroups, etc.
     * @param operator - SUM
     * @return
     */
    List groupRecords (List records, String groupBy = DEFAULT_GROUP_BY, String operator = FLATTEN_BY_SUM) {
        if (records && groupBy) {
            List groupByAttributes = groupBy.tokenize(',')
            // Group the records by the user defined attributes such as scientificName, individualsOrGroups, etc.
            Map recordsByGroup = records.groupBy { dwcRecord ->
                groupByAttributes.collect { dwcRecord[it] }
            }

            // For each group, summarize the records by applying the operator
            Map groupsAndTheirSummary= recordsByGroup.collectEntries { groupKey, groupedRecords ->
                // iterate over the records in the group and summarize them
                Map summaryOfGroupedRecords = groupedRecords.inject([:], { newRecord, recordInGroup ->
                    // iterate over the attributes of the record and apply the operator
                    recordInGroup.each { dwcAttribute, dwcValue ->
                        // sum or count all numeric values that are not used for grouping
                        if (dwcAttribute !in groupByAttributes && dwcValue instanceof Number) {
                            switch (operator) {
                                case FLATTEN_BY_COUNT:
                                    // implement count operator
                                    break

                                case FLATTEN_BY_SUM:
                                    newRecord[dwcAttribute] = (newRecord[dwcAttribute] ?: 0) + dwcValue
                                    break
                                default:
                                    log.error "Unsupported operator: ${operator}"
                            }
                        }
                        else {
                            // if not a numeric value, just copy the value to the new record
                            newRecord[dwcAttribute] = dwcValue
                        }
                    }

                    newRecord
                })

                // flattens groupedRecords (list) to a map
                [(groupKey): summaryOfGroupedRecords]
            }

            return groupsAndTheirSummary.values().toList()
        }

        records
    }


    List getProjectTags() {
        String hubId = SettingService.hubConfig.hubId
        termsService.getTerms(hubId, PROJECT_TAGS_CATEGORY)
    }

    Map addProjectTag(Map tag) {
        tag.category = PROJECT_TAGS_CATEGORY
        String hubId = SettingService.hubConfig.hubId
        tag.hubId = hubId
        termsService.addTerm(hubId, tag)
    }

    Map updateProjectTag(Map tag) {
        List existingTags = getProjectTags()
        Map result = [errors:[]]
        Map existingTag = existingTags?.find{it.termId == tag.termId}
        if (existingTag) {
            Map projectsUsingTag = search([tags:existingTag.term, view:'flat'])
            projectsUsingTag?.resp?.projects.each {
                Map projectUpdateResult = update(it.projectId, [tags: it.tags - existingTag.term + tag.term])
                if (projectUpdateResult.error) {
                    result.errors << projectUpdateResult.error
                }
            }
        }
        String hubId = SettingService.hubConfig.hubId
        tag.hubId = hubId
        tag.category = PROJECT_TAGS_CATEGORY
        Map termUpdateResult = termsService.updateTerm(hubId, tag)
        if (termUpdateResult.error) {
            result.errors << termUpdateResult.error
        }
        result.success = result.errors.size() == 0
        result
    }

    Map deleteProjectTag(Map tag) {
        Map result = [errors:[]]
        Map results = search([tags:tag.term, view:'flat'])
        results?.resp?.projects.each {
            Map projectUpdateResult = update(it.projectId, [tags: it.tags - tag.term])
            if (projectUpdateResult.error) {
                result.errors << projectUpdateResult.error
            }
        }
        Map termDeleteResult = termsService.deleteTerm(tag.termId)
        if (termDeleteResult.error) {
            result.errors << termUpdateResult.error
        }
        result.success = result.errors.size() == 0
        result
    }
}

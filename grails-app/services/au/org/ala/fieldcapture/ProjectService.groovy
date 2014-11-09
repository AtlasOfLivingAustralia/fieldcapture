package au.org.ala.fieldcapture

import grails.converters.JSON

import java.text.SimpleDateFormat

import org.codehaus.groovy.grails.web.mapping.LinkGenerator

class ProjectService {

    def webService, grailsApplication, siteService, activityService, authService, emailService, documentService
    LinkGenerator grailsLinkGenerator

    def projects

    def map() {
        if (!projects) {
            projects = siteService.getTestProjects()
            enrichTestData()
        }
        projects
    }

    def list(brief = false) {
        def params = brief ? '?brief=true' : ''
        def resp = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'project/' + params)
        resp.list
    }

    def get(id, levelOfDetail = "", includeDeleted = false) {

        def params = '?'

        params += levelOfDetail ? "view=${levelOfDetail}&" : ''
        params += "includeDeleted=${includeDeleted}"
        webService.getJson(grailsApplication.config.ecodata.baseUrl + 'project/' + id + params)
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

    def update(id, body) {
        TimeZone.setDefault(TimeZone.getTimeZone('UTC'))
        body?.custom?.details?.lastUpdated = new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'")
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'project/' + id, body)
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
        webService.doDelete(grailsApplication.config.ecodata.baseUrl + 'project/' + id +
            '?destroy=true')
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
            scoresWithTargetsByOutput = scores.grep{ it.target && it.target != "0" }.groupBy { it.score.outputName }
            scoresWithoutTargetsByOutputs = scores.grep{ it.results && (!it.target || it.target == "0") }.groupBy { it.score.outputName }
        }
        [targets:scoresWithTargetsByOutput, other:scoresWithoutTargetsByOutputs]
    }

    def enrichTestData() {
        def p = projects['Bushbids'.encodeAsMD5()]
        if (p) {p.project_description = dummyProjects[0].project_description}
        projects.put dummyProjects[1].project_id, dummyProjects[1]
        projects.put dummyProjects[2].project_id, dummyProjects[2]
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

        if (isOfficerOrHigher()) {
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

        if (isOfficerOrHigher()) {
            userCanEdit = true
        } else {
            def url = grailsApplication.config.ecodata.baseUrl + "permissions/canUserEditProject?projectId=${projectId}&userId=${userId}"
            userCanEdit = webService.getJson(url)?.userIsEditor?:false
        }

        userCanEdit
    }

    /**
     * Does the current user have permission to view details of the requested projectId?
     * @param userId the user to test.
     * @param the project to test.
     */
    def canUserViewProject(userId, projectId) {

        def userCanView
        if (isOfficerOrHigher() || authService.userInRole(grailsApplication.config.security.cas.readOnlyOfficerRole)) {
            userCanView = true
        }
        else {
            userCanView = canUserEditProject(userId, projectId)
        }
        userCanView
    }

    private isOfficerOrHigher() {
        (authService.userInRole(grailsApplication.config.security.cas.officerRole) || authService.userInRole(grailsApplication.config.security.cas.adminRole) || authService.userInRole(grailsApplication.config.security.cas.alaAdminRole))
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
		projectAll?.timeline?.each{
			if(it.name.equals(stageDetails.stage)){
				readyForSubmit = true;
			}
		}
		if (!readyForSubmit) {
			return [error:'Invalid stage']
		}
		
		def stageName = stageDetails.stage;
		def param  = [project: projectAll, activities:activities, stageName:stageName, status:"Report submitted"]
		def htmlTxt = documentService.createHTMLStageReport(param)
		def dateWithTime = new SimpleDateFormat("yyyy_MM_dd_hh_mm_ss")
		def name = projectAll?.grantId + '_' + stageName + '_' + dateWithTime.format(new Date()) + ".pdf"
		def doc = [name:name, projectId:projectId, saveAs:'pdf', type:'pdf', role:'stageReport',filename:name, readOnly:true, public:false]
		documentService.createTextDocument(doc, htmlTxt)
        def result = activityService.updatePublicationStatus(stageDetails.activityIds, 'pendingApproval')
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
        def result = activityService.updatePublicationStatus(stageDetails.activityIds, 'published')

        // TODO Send a message to GMS.
        def project = get(projectId, 'all')
        def readableId = project.grantId + (project.externalId?'-'+project.externalId:'')
        def name = "${readableId} ${stageDetails.stage} approval"
        def doc = [name:name, projectId:projectId, type:'text', role:'approval',filename:name, readOnly:true, public:false]
        documentService.createTextDocument(doc, (project as JSON).toString())
        stageDetails.project = project
        if (!result.resp.error) {
            emailService.sendReportApprovedEmail(projectId, stageDetails)
        }

        result
    }

    /**
     * Rejects a submitted stage report.
     * @param projectId the project the performing the activities.
     * @param stageDetails details of the activities, specifically a list of activity ids.
     */
    def rejectStageReport(projectId, stageDetails) {
        def result = activityService.updatePublicationStatus(stageDetails.activityIds, 'unpublished')

        // TODO Send a message to GMS.  Delete previous approval document (only an issue for withdrawal of approval)?
        def project = get(projectId)
        stageDetails.project = project

        if (!result.resp.error) {
            emailService.sendReportRejectedEmail(projectId, stageDetails)
        }

        result
    }
}

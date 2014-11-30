package au.org.ala.merit

import grails.converters.JSON
import org.apache.commons.lang.CharUtils

import java.text.SimpleDateFormat

class ProjectService extends au.org.ala.fieldcapture.ProjectService {

    static dateWithTime = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss")
    static dateWithTimeFormat2 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss")
    static convertTo = new SimpleDateFormat("dd MMM yyyy")


    def update(id, body) {
        TimeZone.setDefault(TimeZone.getTimeZone('UTC'))
        body?.custom?.details?.lastUpdated = new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'")
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'project/' + id, body)
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
		def htmlTxt = createHTMLStageReport(param)
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

        //Update project status to completed
        int published = 0;
        int validActivities = 0
        def activities = activityService.activitiesForProject(projectId);;
        project.timeline?.each {timeline->
            activities.each{act->
                def endDate = act.plannedEndDate ? act.plannedEndDate : act.endDate
                if(dateInSlot(timeline.fromDate,timeline.toDate,endDate)){
                    validActivities++;
                    if(act.publicationStatus.equals("published")){
                        published++
                    }
                }
            }
        }

        if(validActivities == published){
            def values = [:]
            values["status"] = "completed"
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
        def result = activityService.updatePublicationStatus(stageDetails.activityIds, 'unpublished')

        // TODO Send a message to GMS.  Delete previous approval document (only an issue for withdrawal of approval)?
        def project = get(projectId)
        stageDetails.project = project

        if (!result.resp.error) {
            emailService.sendReportRejectedEmail(projectId, stageDetails)
        }

        result
    }

    def createHTMLStageReport(param) {

        def project = param.project
        def activities = param.activities
        def stageName = param.stageName
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
        project.timeline?.each {
            if(it.name.equals(stageName)){
                stage = "${it.name} : "+convertDate(it.fromDate) +" - " +convertDate(it.toDate)
                stageStartDate = it.fromDate
                stageEndDate =  it.toDate
            }
        }
        activities.each{
            def endDate = it.plannedEndDate ? it.plannedEndDate : it.endDate

            if(it.progress.equals('planned') && dateInSlot(stageStartDate,stageEndDate,endDate))
                planned++
            else if (it.progress.equals('started') && dateInSlot(stageStartDate,stageEndDate,endDate))
                started++
            else if (it.progress.equals('finished') && dateInSlot(stageStartDate,stageEndDate,endDate))
                finished++
            else if (it.progress.equals('deferred') && dateInSlot(stageStartDate,stageEndDate,endDate))
                deferred++;
            else if (it.progress.equals('cancelled') && dateInSlot(stageStartDate,stageEndDate,endDate))
                cancelled++;
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
        
		project?.activities?.each {
			if(it.type.equals('Progress, Outcomes and Learning - stage report')){
				it.outputs?.each{
					def type = metadataService.annotatedOutputDataModel("$it.name")
					append(html,"<b> $it.name: </b> <br>");
					it.data?.each{ k, v ->
						def label = "Result"
						type.each{ view ->
							if(view.name.equals(k)){
								label = view.label;
							}
						}
						append(html,"${label}:- ${v}<br>");
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
        append(html,'<h2><font color="">Project Against Each Activity</font></h2>')

        int i=0;
        project?.activities?.each{
            def endDate = it.plannedEndDate ? it.plannedEndDate : it.endDate
            if(dateInSlot(stageStartDate,stageEndDate,endDate)){
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
}

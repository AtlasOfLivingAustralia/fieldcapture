package au.org.ala.fieldcapture
import org.apache.commons.lang.CharUtils;
import java.text.SimpleDateFormat

/**
 * Proxies to the ecodata DocumentController/DocumentService.
 */
class DocumentService {
	
	static dateWithTime = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss")
	static dateWithTimeFormat2 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss")
	static convertTo = new SimpleDateFormat("dd MMM yyyy")

    def webService, grailsApplication, userService, siteService

    def createTextDocument(doc, content) {
        def url = grailsApplication.config.ecodata.baseUrl + "document"
        doc.content = content
        return webService.doPost(url, doc)
    }
		
	def createHTMLStageReport(project, activities, stageName) {

		def stage = '';
		def planned = 0;
		def started = 0;
		def finished = 0;
		def deferred = 0;
		def cancelled = 0;
		def stageStartDate = '';
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
			def endDate = it.endDate ? it.endDate : it.plannedEndDate
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
		append(html,'<tr><th>Document</th><th>File name</th></tr>')
		project.activities?.each{
			def endDate = it.endDate ? it.endDate : it.plannedEndDate
			if(dateInSlot(stageStartDate,stageEndDate,endDate)){
				it.documents?.each{
					append(html,'<tr><td>'+it.name+'</td><td>'+it.filename+'</td></tr>')
				}
			}
		}	
		append(html,'</table>')
		
		append(html,'<br>')
		append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
		append(html,'<br>')
		append(html,'<h2><font color="">Outputs: Targets Vs Achieved</font></h2>')
		append(html,'<table cellpadding="3" border="0">')
		append(html,'<tr><th>Output type</th><th>Output Target Measure</th><th>Output Achieved(stage)</th><th>Output Achieved (project to date)</th><th>Output Target (whole project)</th></tr>')
		project.outputTargets?.each{
			if(it.isSaving){
				append(html,'<tr><td>'+it.outputLabel+'</td><td>'+it.scoreLabel+'</td><td>'+
						getTotalStageScore(project, it.scoreName, stageStartDate, stageEndDate)+'</td><td>'+
						getTotalScore(project, it.scoreName)+'</td><td>'+it.target+' '+it.units+ '</td></tr>')
			}	
		}
		append(html,'</table>')

		// todo: move this to lookup and rely on key.
		def stageOverviewProgress = ''
		def projectEnvironmentalOutcomes = ''
		def projectSocialOutcomes = ''
		def projectEconomicOutcomes = ''
		def stageReportAdaptations = ''
		def stageReportImplementation = ''
		def stageReportNotes = ''
		def stageReportImprovements = ''
		def stageReportLessons = ''

		project?.activities?.each {
			if(it.type.equals('Progress, Outcomes and Learning - stage report')){
				it.outputs?.each{
					if(it.name.equals('Overview of Project Progress')){
						stageOverviewProgress = it.data?.stageOverviewProgress
					}
					else if(it.name.equals('Environmental, Economic and Social Outcomes')){
						projectEnvironmentalOutcomes = it.data?.projectEnvironmentalOutcomes
						projectSocialOutcomes = it.data?.projectSocialOutcomes
						projectEconomicOutcomes = it.data?.projectEconomicOutcomes
					}
					else if(it.name.equals('Implementation Update')){
						stageReportAdaptations = it.data?.stageReportAdaptations
						stageReportImplementation =  it.data?.stageReportImplementation
					}
					else if(it.name.equals('Lessons Learned and Improvements')){
						stageReportNotes = it.data?.stageReportNotes
						stageReportImprovements = it.data?.stageReportImprovements
						stageReportLessons = it.data?.stageReportLessons
					}
				}
			}	
		}
		
		append(html,'<br>')
		append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
		append(html,'<br>')
		append(html,'<h2><font>Summary of Project Progress and Issues</font></h2>')
		append(html,'<table cellpadding="3" border="0">')
		append(html,'<tr><td>Overview of Project Progress*</td><td>'+stageOverviewProgress+'</td></tr>')
		append(html,'<tr><td>Environmental*</td><td>'+projectEnvironmentalOutcomes+'</td></tr>')
		append(html,'<tr><td>Social*</td><td>'+projectSocialOutcomes+'</td></tr>')
		append(html,'<tr><td>Economic*</td><td>'+projectEconomicOutcomes+'</td></tr>')
		append(html,'<tr><td>Implementation*</td><td>'+stageReportImplementation+'</br>'+stageReportAdaptations+'</td></tr>')
		append(html,'<tr><td>Lessons Learned*</td><td>'+stageReportLessons+'</td></tr>')
		append(html,'<tr><td>Improvements*</td><td>'+stageReportImprovements+'</td></tr>')
		append(html,'<tr><td>Additional Comments*</td><td>'+stageReportNotes+'</td></tr>')
		append(html,'</table>')
		
		append(html,'<br>')
		append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
		append(html,'<br>')
		append(html,'<h2><font color="">Project Risk</font></h2>')
		append(html,'<p>To help anticipate and determine management and mitigation strategies for the risks associated with delivering and '+ 
					'reporting the outcomes of this Regional Delivery project, complete the table below. Risks identified should be those that the '+ 
					'project team consider to be within the reasonable influence of the project team to anticipate and manage.</p>')
		append(html,'<table cellpadding="3" border="0">')
		append(html,'<tr><th>Risk/Threat Description</th><th>Likelihood</th><th>Consequence</th><th>Rating</th><th>Current Controls/Contingency </th><th>Residual Risk</th></tr>')
		project.custom?.details?.risks?.rows.each{
			append(html,'<tr><td>'+it.description+'</td><td>'+it.likelihood+'</td><td>'+it.consequence+'</td><td>'+
				it.riskRating+'</td><td>'+it.currentControl+'</td><td>'+it.residualRisk+'</td></tr>')
		}
		append(html,'</table>')
		
		append(html,'<br>')
		append(html,'<p align="left">_________________________________________________________________________________________________________</p>')
		append(html,'<br>')
		append(html,'<h2><font color="">Project Against Each Activity</font></h2>')
		
		int i=0;
		project.activities?.each{
			def endDate = it.endDate ? it.endDate : it.plannedEndDate
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
				append(html,'<tr><td>Start Date</td><td>'+convertDate(it.startDate)+'</td></tr>')
				append(html,'<tr><td>End Date</td><td>'+convertDate(it.endDate)+'</td></tr>')
				
				def reason = ''
				if(it.progress.equals('deferred') || it.progress.equals('cancelled')){
					it.documents.each{
						reason = "${it.notes}${it.data?.eventNotes}${it.data?.debrisNotes}${it.data?.erosionNotes}${it.data?.pestObservationNotes}${it.data?.weedInspectionNotes}${it.data?.fenceNotes}"
					}
					append(html,'<tr><td>Reason '+it.name+'</td><td>'+reason+'</td></tr>')
					it.outputs.each{
						def outputNotes = "${it.data?.notes}${it.data?.eventNotes}"+
							+"${it.data?.debrisNotes}${it.data?.erosionNotes}${it.data?.pestObservationNotes}"
							+"${it.data?.weedInspectionNotes}${it.data?.fenceNotes}";
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
		append(html,'<tr><td><b>Summary generated by: </b></td><td><b>'+userService.getUser().displayName+' ('+userService.getUser().userName+')</b></td></tr>')
		append(html,'<tr><td>Position/Role</td><td>MERIT Project Administrator and authorised representative of "'+project.organisationName+'"</td></tr>')
		append(html,'<tr><td>Date</td><td>'+dateWithTimeFormat2.format(new Date())+'</td></tr>')
		append(html,'</table>')
	
		append(html,"</font></body>")
		append(html,"</html>")
		org.codehaus.groovy.runtime.NullObject.metaClass.toString = {return 'null'}

		return html.toString();
	}
	
	private append(StringBuilder str, String data){
		str.append(data).append(CharUtils.CR).append(CharUtils.LF)
	}
	
	private getTotalScore(project, scoreName){
		int total = 0;
		project?.activities?.each{
			it.outputs?.each{
				for (d in it.data){
					if(d.key.equals(scoreName)){
						total = total + d.value?.toInteger()
					}
				}
			}	
		}
		return total
	}
	
	private getTotalStageScore(project, scoreName, stageStartDate, stageEndDate){
		int total = 0;
		project?.activities?.each{
			if(dateInSlot(stageStartDate,stageEndDate,it.plannedStartDate)){
				it.outputs?.each{
					for (d in it.data){
						if(d.key.equals(scoreName)){
							total = total + d.value?.toInteger()
						}
					}
				}
			}
		}
		return total
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
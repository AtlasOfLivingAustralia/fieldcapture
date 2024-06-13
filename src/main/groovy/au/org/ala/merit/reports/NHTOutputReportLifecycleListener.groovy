package au.org.ala.merit.reports

import au.org.ala.merit.ActivityService
import au.org.ala.merit.ProjectService
import au.org.ala.merit.PublicationStatus
import au.org.ala.merit.SiteService
import groovy.util.logging.Slf4j
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired

/**
 * Custom data for the NHT Output Report.
 */
@Slf4j
class NHTOutputReportLifecycleListener extends ReportLifecycleListener {

    @Autowired
    ProjectService projectService
    @Autowired
    ActivityService activityService
    @Autowired
    SiteService siteService

    boolean containsEntityReferences() {
        true
    }
    Map getContextData(Map project, Map report) {
        // Side effect - filter data sets.
        List eligibleDataSets = project.custom?.dataSets?.findAll {
            // This is a side effect and a workaround for the problem that selected outcomes
            // are an array and the knockout binding doesn't support arrays as a value.
            if (it.projectOutcomes) {
                it.outcomesLabel = new ArrayList(it.projectOutcomes.sort()).join(',')
            }
            it.progress == ActivityService.PROGRESS_FINISHED
        }
        eligibleDataSets.each {
            it.alreadyReported = (it.reportId && it.reportId != report.reportId)
        }
        if (project.custom) {
            project.custom.dataSets = new JSONArray(eligibleDataSets ?: [])
        }

        List investmentPriorities = projectService.listProjectInvestmentPriorities(project.projectId)

        List protocols = projectService.listProjectProtocols(project).collect {
            [label: it.name, value: it.externalId]
        }
        protocols << [label:'Other', value:'other']
        return [
            protocols:protocols,
            investmentPriorities:investmentPriorities
        ]
    }


    Map getOutputData(Map project, Map outputConfig, Map report) {
        List scores = outputConfig.outputContext.scores
        JSONObject extraData = new JSONObject()
        if (scores) {
            List result = projectService.outcomesByScores(project, scores)
            extraData.outcomes = result?.collect {
                String label = new ArrayList(it).join(',')
                // Knockout doesn't support binding arrays to select options so we need to
                // convert it to a String.
                new JSONObject([label:label, value:label])
            }
        }
        extraData
    }

    Map reportSaved(Map report, Map activityData) {
        updateDataSetSummaries(report, activityData, [reportId: report.reportId])
    }


    private Map updateDataSetSummaries(Map report, Map activityData, Map properties) {
        List entities = findReferencedEntities(activityData)
        List dataSetIds = entities.findAll{
            it.entityType == 'au.org.ala.ecodata.DataSetSummary'}.collect {
            it.entityIds }.flatten().unique()
        projectService.bulkUpdateDataSetSummaries(report.projectId, report.reportId, dataSetIds, properties)
    }

    Map reportSubmitted(Map report, List reportActivityIds, Map reportOwner) {
        updateDataSetPublicationStatus(report, reportActivityIds, PublicationStatus.SUBMITTED)
    }
    Map reportApproved(Map report, List reportActivityIds, Map reportOwner) {
        updateDataSetPublicationStatus(report, reportActivityIds, PublicationStatus.APPROVED)
    }
    Map reportRejected(Map report, List reportActivityIds, Map reportOwner) {
        updateDataSetPublicationStatus(report, reportActivityIds, PublicationStatus.NOT_APPROVED)
    }
    Map reportCancelled(Map report, List reportActivityIds, Map reportOwner) {
        updateDataSetPublicationStatus(report, reportActivityIds, PublicationStatus.CANCELLED)
    }
    Map reportReset(Map report) {
        deleteAssociatedSite(report)
        // This is dissociate all data set summaries from the report because of the empty array of data set ids.
        projectService.bulkUpdateDataSetSummaries(report.projectId, report.reportId, [], [:])
    }

    private boolean deleteAssociatedSite (Map report){
        if (deleteSiteOnReset) {
            Map activity = activityService.get(report.activityId)
            if (activity?.siteId) {
                Map resp = activityService.update(activity.activityId, [activityId:activity.activityId, siteId: null])
                if (!resp.error) {
                    siteService.delete(activity.siteId)
                    return true
                }
            }
        }

        return false
    }

    private Map updateDataSetPublicationStatus(Map report, List reportActivityIds, String newStatus) {
        Map result = [:]
        if (report.activityId) {
            Map activity = activityService.get(report.activityId)
            result = updateDataSetSummaries(report, activity, [publicationStatus: newStatus])
        }
        result
    }

}

package au.org.ala.merit.reports

import au.org.ala.ecodata.forms.ActivityFormService
import au.org.ala.merit.ActivityService
import au.org.ala.merit.ProjectService
import groovy.util.logging.Slf4j
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired

/**
 * Custom data for the NHT Output Report.
 */
@Slf4j
class NHTOutputReportData extends ReportData {

    @Autowired
    ProjectService projectService

    Map getContextData(Map project) {
        // Side effect - filter data sets.
        List eligibleDataSets = project.custom?.dataSets?.findAll {
            // This is a side effect and a workaround for the problem that selected outcomes
            // are an array and the knockout binding doesn't support arrays as a value.
            if (it.projectOutcomes) {
                it.outcomesLabel = new ArrayList(it.projectOutcomes).join(',')
            }
            it.progress == ActivityService.PROGRESS_FINISHED
        }
        if (project.custom) {
            project.custom.dataSets = new JSONArray(eligibleDataSets ?: [])
        }

        List protocols = projectService.listProjectProtocols(project).collect {
            [label: it.name, value: it.externalId]
        }
        protocols << [label:'Other', value:'other']
        return [
            protocols:protocols
        ]
    }

    Map getOutputData(Map project, Map outputConfig) {
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

}

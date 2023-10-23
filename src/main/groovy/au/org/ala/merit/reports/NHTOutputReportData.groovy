package au.org.ala.merit.reports

import au.org.ala.merit.ProjectService
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired

/**
 * Custom data for the NHT Output Report.
 */
class NHTOutputReportData extends ReportData {

    @Autowired
    ProjectService projectService

    Map getContextData(Map project) {
        return [
            protocols:projectService.listProjectProtocols(project).collect {
                [label: it.name, value: it.externalId]
            }
        ]
    }

    Map getOutputData(Map project, Map outputConfig) {
        List scores = outputConfig.outputContext.scores
        JSONObject extraData = new JSONObject()
        if (scores) {
            List result = projectService.outcomesByScores(project, scores)
            extraData.outcomes = result?.collect {
                List outcomes = new JSONArray(it)
                String label = new ArrayList(outcomes).join(',')
                new JSONObject([label:label, value:outcomes])
            }
        }
        extraData
    }
}

package au.org.ala.merit.reports

import au.org.ala.merit.ProjectService
import au.org.ala.merit.ActivityService
import spock.lang.Specification

class NhtOutputReportDataSpec extends Specification {

    NHTOutputReportData reportData = new NHTOutputReportData()
    ProjectService projectService = Mock(ProjectService)

    void setup() {
        reportData.projectService = projectService
    }

    def "The context data doesn't need project data sets to exist"() {

        setup:
        Map project = [:]
        List protocols = [[name:'test', externalId:'e1']]

        when:
        Map contextData = reportData.getContextData(project)

        then:
        1 * projectService.listProjectProtocols(project) >> protocols
        contextData.protocols.size() == 1
        contextData.protocols[0].label == 'test'
        contextData.protocols[0].value == 'e1'
        project.custom == null

    }


    def "Project data sets will be filtered to only finished data sets"() {
        setup:
        List dataSets = [[dataSetId:'d1', progress:ActivityService.PROGRESS_FINISHED, projectOutcomes:['a','b','c']],
                         [dataSetId:'d2', progress:ActivityService.PROGRESS_FINISHED, projectOutcomes:['d','e','f']],
                         [dataSetId:'d3', progress:ActivityService.PROGRESS_STARTED, projectOutcomes:['g','h','i']],
                         [dataSetId:'d4', progress:ActivityService.PROGRESS_FINISHED, projectOutcomes:['j','k','l']]]
        Map project = [custom:[dataSets:dataSets]]
        List protocols = [[name:'test', externalId:'e1']]

        when:
        Map contextData = reportData.getContextData(project)

        then:
        1 * projectService.listProjectProtocols(project) >> protocols
        project.custom.dataSets.size() == 3
        project.custom.dataSets*.dataSetId == ['d1','d2','d4']
    }

}

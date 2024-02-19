package au.org.ala.merit.reports

import au.org.ala.merit.ProjectService
import au.org.ala.merit.ActivityService
import spock.lang.Specification

class NhtOutputReportLifecycleListenerSpec extends Specification {

    NHTOutputReportLifecycleListener reportData = new NHTOutputReportLifecycleListener()
    ProjectService projectService = Mock(ProjectService)

    void setup() {
        reportData.projectService = projectService
    }

    def "The context data doesn't need project data sets to exist"() {

        setup:
        Map project = [:]
        Map report = [:]
        List protocols = [[name:'test', externalId:'e1']]

        when:
        Map contextData = reportData.getContextData(project, report)

        then:
        1 * projectService.listProjectProtocols(project) >> protocols
        contextData.protocols.size() == 2
        contextData.protocols[0].label == 'test'
        contextData.protocols[0].value == 'e1'
        contextData.protocols[1].label == 'Other'
        contextData.protocols[1].value == 'other'

        project.custom == null

    }


    def "Project data sets will be filtered to only finished data sets"() {
        setup:
        List dataSets = [[dataSetId:'d1', progress:ActivityService.PROGRESS_FINISHED, projectOutcomes:['a','b','c']],
                         [dataSetId:'d2', progress:ActivityService.PROGRESS_FINISHED, projectOutcomes:['d','e','f']],
                         [dataSetId:'d3', progress:ActivityService.PROGRESS_STARTED, projectOutcomes:['g','h','i']],
                         [dataSetId:'d4', progress:ActivityService.PROGRESS_FINISHED, projectOutcomes:['j','k','l']]]
        Map project = [custom:[dataSets:dataSets]]
        Map report = [:]
        List protocols = [[name:'test', externalId:'e1']]

        when:
        Map contextData = reportData.getContextData(project, report)

        then:
        1 * projectService.listProjectProtocols(project) >> protocols
        project.custom.dataSets.size() == 3
        project.custom.dataSets*.dataSetId == ['d1','d2','d4']
    }

    def "It will return a list of investment priorities from the MERI plan"() {
        setup:
        String projectId = 'p1'
        List secondaryOutcomes = [ [ "assets" : [ "Investment priority 1" ], "description" : "Outcome 2" ] ]
        Map primaryOutcome = [:]
        Map project = [projectId:projectId, custom:[details:[outcomes:[secondaryOutcomes:secondaryOutcomes, primaryOutcome:primaryOutcome]]]]

        when:
        Map contextData = reportData.getContextData(project)

        then:
        1 * projectService.listProjectInvestmentPriorities(projectId) >> ['Investment priority 1']
        contextData.investmentPriorities == ['Investment priority 1']

    }
}

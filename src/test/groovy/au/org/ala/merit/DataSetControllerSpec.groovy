package au.org.ala.merit

import org.apache.http.HttpStatus
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

class DataSetControllerSpec extends Specification implements ControllerUnitTest<DataSetController>{

    ProjectService projectService = Mock(ProjectService)
    def setup() {
        controller.projectService = projectService
    }

    def cleanup() {
    }



    void "If the project cannot be found, a 404 is returned"() {

        when:
        controller.create('p1')

        then:
        1 * projectService.get('p1') >> null
        response.status == HttpStatus.SC_NOT_FOUND
    }

    void "The model for the create page has information about the project"() {
        setup:
        Map project = [projectId:'p1']

        when:
        Map model = controller.create('p1')

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> [program:[name:"program 1"]]
        1 * projectService.getAllProjectOutcomes(project) >> ["1", "2"]
        1 * projectService.listProjectInvestmentPriorities(project) >> ["p1"]

        model == [project:project, projectId:'p1', programName:"program 1", priorities:["p1", "Other"], outcomes:["1", "2"]]
    }

    void "If the project cannot be found when editing a dataset, a 404 is returned"() {

        when:
        controller.edit('p1', 'd1')

        then:
        1 * projectService.get('p1') >> null
        response.status == HttpStatus.SC_NOT_FOUND
    }

    void "If the data set cannot be found when editing a dataset, a 404 is returned"() {

        when:
        controller.edit('p1', 'd1')

        then:
        1 * projectService.get('p1') >> [projectId:'p1']
        1 * projectService.getProgramConfiguration([projectId:'p1']) >> [program:[name:"program 1"]]
        response.status == HttpStatus.SC_NOT_FOUND
    }

    void "The model for the edit page has information about the project and data set"() {
        setup:
        List existingDataSets = [[name:'data set 1', dataSetId:'d1'], [name:'data set 2', dataSetId:'d2'], [name:'data set 3', dataSetId:'d3']]
        Map project = [projectId:'p1', custom:[dataSets:existingDataSets]]

        when:
        Map model = controller.edit('p1', 'd2')

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> [program:[name:"program 1"]]
        1 * projectService.getAllProjectOutcomes(project) >> ["1", "2"]
        1 * projectService.listProjectInvestmentPriorities(project) >> ["p1"]

        model == [project:project, projectId:'p1', programName:"program 1", priorities:["p1", "Other"], outcomes:["1", "2"], dataSet:existingDataSets[1]]
    }

    void "The save method delegates to the projectService"() {
        setup:
        Map dataSet = [dataSetId:"d1"]

        when:
        request.method = "POST"
        request.json = dataSet
        controller.save('p1')

        then:
        1 * projectService.saveDataSet('p1', dataSet) >> [status:HttpStatus.SC_OK]
        response.status == HttpStatus.SC_OK
        response.json == [status:HttpStatus.SC_OK]
    }

    void "The delete method delegates to the projectService"() {
        setup:
        Map dataSet = [dataSetId:"d1"]

        when:
        request.method = "POST"
        request.json = dataSet
        controller.delete('p1')

        then:
        1 * projectService.deleteDataSet('p1', dataSet.dataSetId) >> [status:HttpStatus.SC_OK]
        response.status == HttpStatus.SC_OK
        response.json == [status:HttpStatus.SC_OK]
    }

    void "If the data set cannot be found when viewing a dataset, a 404 is returned"() {

        when:
        controller.edit('p1', 'd1')

        then:
        1 * projectService.get('p1') >> [projectId:'p1']
        1 * projectService.getProgramConfiguration([projectId:'p1']) >> [program:[name:"program 1"]]
        response.status == HttpStatus.SC_NOT_FOUND
    }

    void "The model for the view page has information about the project and data set"() {
        setup:
        List existingDataSets = [[name:'data set 1', dataSetId:'d1'], [name:'data set 2', dataSetId:'d2'], [name:'data set 3', dataSetId:'d3']]
        Map project = [projectId:'p1', custom:[dataSets:existingDataSets]]

        when:
        Map model = controller.view('p1', 'd2')

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> [program:[name:"program 1"]]
        1 * projectService.getAllProjectOutcomes(project) >> ["1", "2"]
        1 * projectService.listProjectInvestmentPriorities(project) >> ["p1"]

        model == [project:project, projectId:'p1', programName:"program 1", priorities:["p1", "Other"], outcomes:["1", "2"], dataSet:existingDataSets[1]]
    }
}

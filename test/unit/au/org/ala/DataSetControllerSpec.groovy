package au.org.ala

import au.org.ala.merit.DataSetController
import au.org.ala.merit.ProjectService
import grails.test.mixin.TestFor
import org.apache.http.HttpStatus
import spock.lang.Specification

@TestFor(DataSetController)
class DataSetControllerSpec extends Specification {

    ProjectService projectService = Mock(ProjectService)
    def setup() {
        controller.projectService = projectService
    }

    def cleanup() {
    }

    void "create and edit are only accessible using GET, update and delete via POST"(String action, String method, boolean methodNotAllowed) {

        setup:
        projectService.get(_) >> [projectId:'p1']
        projectService.getProgramConfiguration(_) >> [:]

        when:
        params.id = 'p1'
        params.dataSetId = 'd1' // Ignored for all but edit but sufficient for this test
        request.method = method
        controller."${action}"()

        then:
        (response.status == HttpStatus.SC_METHOD_NOT_ALLOWED) == methodNotAllowed

        where:
        action   | method | methodNotAllowed
        "create" | "GET"  | false
        "create" | "POST" | true
        "edit"   | "GET"  | false
        "edit"   | "POST" | true
        "save"   | "GET"  | true
        "save"   | "POST" | false
        "delete" | "GET"  | true
        "delete" | "POST" | false
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

        model == [project:project, projectId:'p1', programName:"program 1", priorities:["p1"], outcomes:["1", "2"]]
    }

    void "If the project or data set cannot be found when editing a dataset, a 404 is returned"() {

        when:
        controller.edit('p1', 'd1')

        then:
        1 * projectService.get('p1') >> null
        response.status == HttpStatus.SC_NOT_FOUND

        when:
        controller.edit('p1', 'd1')

        then:
        1 * projectService.get('p1') >> [projectId:'p1']
        1 * projectService.getProgramConfiguration([projectId:'p1']) >> [program:[name:"program 1"]]
        response.status == HttpStatus.SC_NOT_FOUND
    }

    void "The model for the edit page has information about the project and data set"() {
        setup:
        Map project = [projectId:'p1', custom:[dataSets:[[dataSetId:'d1']]]]

        when:
        Map model = controller.edit('p1', 'd1')

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> [program:[name:"program 1"]]
        1 * projectService.getAllProjectOutcomes(project) >> ["1", "2"]
        1 * projectService.listProjectInvestmentPriorities(project) >> ["p1"]

        model == [project:project, projectId:'p1', programName:"program 1", priorities:["p1"], outcomes:["1", "2"], dataSet:[dataSetId:'d1']]
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
}

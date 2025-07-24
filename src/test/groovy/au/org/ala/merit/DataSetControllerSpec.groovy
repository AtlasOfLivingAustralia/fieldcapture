package au.org.ala.merit

import org.apache.http.HttpStatus
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

class DataSetControllerSpec extends Specification implements ControllerUnitTest<DataSetController>{

    BdrService bdrService = Mock(BdrService)
    ProjectService projectService = Mock(ProjectService)
    DataSetSummaryService dataSetSummaryService = Mock(DataSetSummaryService)
    WebService webService = Mock(WebService)
    def setup() {
        controller.projectService = projectService
        controller.dataSetSummaryService = dataSetSummaryService
        controller.bdrService = bdrService
        controller.webService = webService
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
        Map project = [projectId:'p1', custom:[dataSets:[[name:'d1'], [name:'d2']]]]
        Map programConfig = [program:[name:"program 1"]]

        when:
        Map model = controller.create('p1')

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> programConfig
        1 * projectService.getAllProjectOutcomes(project) >> ["1", "2"]
        1 * projectService.listProjectInvestmentPriorities(project) >> ["p1"]
        1 * projectService.listProjectProtocols(project) >> [["name":"p1", "externalId":"p1"]]
        1 * projectService.listProjectBaselines(project) >> [["code":"b1", baseline:"a baseline"]]

        model == [project:project, projectId:'p1', programName:"program 1", supportsOutcomeTargets:false,
                  priorities:["p1"], outcomes:["1", "2"], projectOutcomes:[],
                    projectBaselines:[[label:"b1 - a baseline", value:"b1"]],
                    projectProtocols:[[label:"p1", value:"p1"], [label:'Other', value:'other']], dataSetNames:['d1', 'd2'], serviceBaselineIndicatorOptions:[:]]

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
        Map programConfig = [program:[name:"program 1"], meriPlanContents:[[template:'serviceOutcomeTargets']]]
        when:
        Map model = controller.edit('p1', 'd2')

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> programConfig
        1 * projectService.getAllProjectOutcomes(project) >> ["1", "2"]
        1 * projectService.listProjectInvestmentPriorities(project) >> ["p1"]
        1 * projectService.listProjectProtocols(project) >> [["name":"p1", "externalId":"p1"]]
        1 * projectService.listProjectBaselines(project) >> [["code":"b1", baseline:"a baseline"]]


        model == [project:project, projectId:'p1', programName:"program 1", priorities:["p1"], supportsOutcomeTargets: true,
                  outcomes:["1", "2"], projectOutcomes:[], dataSet:existingDataSets[1],
                  projectBaselines:[[label:"b1 - a baseline", value:"b1"]],
                  projectProtocols:[[label:"p1", value:"p1"], [label:'Other', value:'other']], dataSetNames: ['data set 1', 'data set 3'], serviceBaselineIndicatorOptions:[:]]
    }

    void "The save method delegates to the projectService"() {
        setup:
        Map dataSet = [dataSetId:"d1"]

        when:
        request.method = "POST"
        request.json = dataSet
        controller.save('p1')

        then:
        1 * dataSetSummaryService.saveDataSet('p1', dataSet) >> [status:HttpStatus.SC_OK]
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
        1 * dataSetSummaryService.deleteDataSet('p1', dataSet.dataSetId) >> [status:HttpStatus.SC_OK]
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
        Map programConfig = [program:[name:"program 1"], supportsOutcomeTargets:true]

        when:
        Map model = controller.view('p1', 'd2')

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> programConfig
        1 * projectService.getAllProjectOutcomes(project) >> ["1", "2"]
        1 * projectService.listProjectInvestmentPriorities(project) >> ["p1"]
        1 * projectService.listProjectProtocols(project) >> [["name":"p1", "externalId":"p1"]]
        1 * projectService.listProjectBaselines(project) >> [["code":"b1", baseline:"a baseline"]]


        model == [project:project, projectId:'p1', programName:"program 1", priorities:["p1"], supportsOutcomeTargets: false,
                  outcomes:["1", "2"], projectOutcomes:[], dataSet:existingDataSets[1],
                  projectBaselines:[[label:"b1 - a baseline", value:"b1"]],
                  projectProtocols:[[label:"p1", value:"p1"], [label:'Other', value:'other']], dataSetNames: ['data set 1', 'data set 2', 'data set 3'], serviceBaselineIndicatorOptions:[:]]
    }

    void "The downloadProjectDataSets method handles valid and invalid inputs correctly"() {
        setup:
        Map project = [projectId: 'p1', name: 'Project 1']
        Map programConfig = [program: [name: "program 1"]]
        String format = 'application/geo+json'

        when: "No project ID is provided"
        controller.downloadProjectDataSets(null, format, 10)

        then:
        response.status == HttpStatus.SC_NOT_FOUND

        when: "An unsupported format is provided"
        response.reset()
        controller.downloadProjectDataSets('p1', 'xml', 10)

        then:
        response.status == HttpStatus.SC_BAD_REQUEST

        when: "A valid request is made"
        response.reset()
        controller.downloadProjectDataSets('p1', format, 10)

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> programConfig
        response.status == HttpStatus.SC_OK
        1 * bdrService.downloadProjectDataSet('p1', format, 'Project 1', response, 10)
    }

    void "The download method can validate input and download data for a data set from the BDR"() {
        setup:
        Map project = [projectId: 'p1', name: 'Project 1', custom: [dataSets: [[dataSetId: 'd1', name: 'DataSet 1', protocol: true]]]]
        Map programConfig = [program: [name: "program 1"]]
        String format = 'application/geo+json'

        when: "No project ID is provided"
        controller.download(null, 'd1', format, 10)

        then:
        response.status == HttpStatus.SC_NOT_FOUND

        when: "An unsupported format is provided"
        response.reset()
        controller.download('p1', 'd1', 'xml', 10)

        then:
        response.status == HttpStatus.SC_BAD_REQUEST

        when: "A valid request is made for a monitor data set"
        response.reset()
        controller.download('p1', 'd1', format, 10)

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> programConfig
        response.status == HttpStatus.SC_OK
        1 * bdrService.downloadDataSet('p1', 'd1', 'DataSet 1', format, response, 10)

        when: "A valid request is made for a non-monitor data set with a URL"
        response.reset()
        project.custom.dataSets[0].protocol = false
        project.custom.dataSets[0].url = 'http://example.com/dataset'
        controller.download('p1', 'd1', format, 10)

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> programConfig
        response.status == HttpStatus.SC_OK
        1 * webService.proxyGetRequest(response, 'http://example.com/dataset', false)
    }

    void "The resync method returns 404 if the data set is not found"() {
        setup:
        Map project = [projectId: 'p1', custom: [dataSets: [[dataSetId: 'd1', name: 'DataSet 1']]]]
        Map programConfig = [program: [name: "program 1"]]

        when:
        request.method = "POST"
        request.json = [dataSetId: 'd2']
        controller.resync('p1')

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> programConfig
        response.status == HttpStatus.SC_NOT_FOUND
    }

    void "The resync method delegates to the dataSetSummaryService and returns the response as JSON"() {
        setup:
        Map dataSet = [dataSetId: 'd1', name: 'DataSet 1']
        Map project = [projectId: 'p1', custom: [dataSets: [dataSet]]]
        Map programConfig = [program: [name: "program 1"]]
        Map resyncResponse = [status: HttpStatus.SC_OK, message: "Resynced"]

        when:
        request.method = "POST"
        request.json = [dataSetId: 'd1']
        controller.resync('p1')

        then:
        1 * projectService.get('p1') >> project
        1 * projectService.getProgramConfiguration(project) >> programConfig
        1 * dataSetSummaryService.resyncDataSet('p1', 'd1') >> resyncResponse
        response.json == resyncResponse
    }

}

package au.org.ala.merit

import grails.testing.services.ServiceUnitTest
import org.apache.http.HttpStatus
import spock.lang.Specification

class DataSetSummaryServiceSpec extends Specification implements ServiceUnitTest<DataSetSummaryService>{

    WebService webService = Mock(WebService)
    def setup() {
        service.webService = webService
    }

    def cleanup() {
    }

    def "A new dataset can be added"()  {
        setup:
        String projectId = 'p1'
        Map dataset = [name:'data set 1']
        Map postData

        when:
        Map result = service.saveDataSet(projectId, dataset)

        then:
        1 * webService.doPost({it.endsWith('dataSetSummary/'+projectId)}, _) >> { id, data ->
            postData = data
            [status: HttpStatus.SC_OK]
        }

        postData.name =='data set 1'
        postData.dataSetId != null
        postData.progress == ActivityService.PROGRESS_STARTED
        postData.dataCollectionOngoing == false
        postData.lastUpdated != null
        postData.dateCreated != null
        result == [status: HttpStatus.SC_OK]
    }

    def "A dataset can be edited"()  {
        setup:
        String projectId = 'p1'
        Map dataset = [name:'data set 1', dataSetId:'d1', progress: ActivityService.PROGRESS_FINISHED]
        Map postData

        when:
        Map result = service.saveDataSet(projectId, dataset)

        then:
        1 * webService.doPost({it.endsWith('dataSetSummary/'+projectId)}, _) >> { id, data ->
            postData = data
            [status: HttpStatus.SC_OK]
        }

        postData.name =='data set 1'
        postData.dataSetId == 'd1'
        postData.progress == ActivityService.PROGRESS_FINISHED
        postData.dataCollectionOngoing == false
        postData.lastUpdated != null
        postData.dateCreated == null

        result == [status: HttpStatus.SC_OK]
    }


    def "A dataset can be deleted"()  {
        setup:
        String projectId = 'p1'
        String datasetId = 'd1'

        when:
        Map result = service.deleteDataSet(projectId, datasetId)

        then:
        1 * webService.doDelete({it.endsWith('dataSetSummary/'+projectId+'/'+datasetId)}) >> HttpStatus.SC_OK

        result == [status:'ok']
    }

    def "The resync method delegates to the web service"() {
        setup:
        String projectId = 'p1'
        String datasetId = 'd1'

        when:
        Map result = service.resyncDataSet(projectId, datasetId)

        then:
        1 * webService.doPost({it.endsWith('dataSetSummary/resync/'+projectId+'/'+datasetId)}, [:], true, true) >> [status: HttpStatus.SC_OK]

        result == [status: HttpStatus.SC_OK]
    }

}

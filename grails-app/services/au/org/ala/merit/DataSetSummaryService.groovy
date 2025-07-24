package au.org.ala.merit

import grails.core.GrailsApplication
import org.apache.http.HttpStatus

class DataSetSummaryService {

    static String DATA_SET_PATH_PREFIX = 'dataSetSummary/'
    static String BULK_UPDATE_PATH = 'bulkUpdate/'
    static String RESYNC_DATA_SET_PATH = 'resync/'
    WebService webService
    GrailsApplication grailsApplication

    Map saveDataSet(String projectId, Map dataSet) {

        if(!dataSet.progress) {
            dataSet.progress = ActivityService.PROGRESS_STARTED
        }

        if(!dataSet.dataCollectionOngoing) {
            dataSet.dataCollectionOngoing = false
        }
        dataSet.lastUpdated = DateUtils.formatAsISOStringNoMillis(new Date())

        if (!dataSet.dataSetId) {
            dataSet.dataSetId = UUID.randomUUID().toString()
            dataSet.dateCreated = DateUtils.formatAsISOStringNoMillis(new Date())
        }

        String url = grailsApplication.config.getProperty('ecodata.baseUrl')+DATA_SET_PATH_PREFIX+projectId
        webService.doPost(url, dataSet)
    }

    Map bulkUpdateDataSets(String projectId, List dataSets) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl')+
                DATA_SET_PATH_PREFIX+BULK_UPDATE_PATH+projectId
        webService.doPost(url, [dataSets:dataSets])
    }

    Map deleteDataSet(String projectId, String dataSetId) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl')+DATA_SET_PATH_PREFIX+projectId+'/'+dataSetId
        int status = webService.doDelete(url)
        if (status == HttpStatus.SC_OK) {
            return [status: 'ok']
        }
        else {
            return [statusCode:status, error: 'Error deleting data set summary with id '+dataSetId]
        }
    }

    Map resyncDataSet(String projectId, String dataSetId) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl')+DATA_SET_PATH_PREFIX+RESYNC_DATA_SET_PATH+projectId+'/'+dataSetId
        Map resp = webService.doPost(url, [:], true, true)
        resp
    }
}

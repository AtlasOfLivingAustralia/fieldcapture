package au.org.ala.fieldcapture

import au.org.ala.ws.service.WebService
import org.apache.http.entity.ContentType
import org.grails.testing.GrailsUnitTest
import org.apache.http.HttpStatus
import spock.lang.Stepwise
import pages.RlpProjectPage

@Stepwise
// We need GrailsUnitTest because the WebService class has a dependency on grailsApplication.config
// It slows startup down quite a bit though
class ParatooIntegrationSpec extends StubbedCasSpec implements GrailsUnitTest {

    WebService webService

    def setupSpec(){
        useDataSet("dataset3")
    }

    def cleanupSpec() {
        logout(browser)
    }

    def setup() {
        webService = new WebService(grailsApplication: getGrailsApplication())
    }


    def "Add new data set in to project"() {

        setup:
        String token = tokenForUser('1')
        Map mintCollectionIdPayload = [

                surveyId: [
                        projectId:'monitorProject',
                        protocol: [
                                id: "guid-1", // Protocol 23 used to obtain representative data for this functional test
                                version: 1
                        ],
                        surveyType: 'soil-pit-characterisation-full',
                        time: '2023-08-28T00:34:13.100Z',
                        randNum: 46390249
                ]
        ]
        Map collectionPayload = [
                projectId:'monitorProject',
                protocol: [
                        id: "guid-1",
                        version: 1
                ],
                userId: '1',
                eventTime:'2023-08-28T00:28:15.272Z'
        ]

        when:
        String url = testConfig.ecodata.baseUrl+'paratoo/mintCollectionId'
        Map headers = ["Authorization": "Bearer ${token}"]
        Map resp = webService.post(url, mintCollectionIdPayload, null, ContentType.APPLICATION_JSON, false, false, headers)

        String orgMintedIdentifier = resp.resp.orgMintedIdentifier

        then:
        resp.statusCode == HttpStatus.SC_OK

        orgMintedIdentifier != null

        when:
        collectionPayload.mintedCollectionId = orgMintedIdentifier
        url = testConfig.ecodata.baseUrl+'/paratoo/collection'
        resp = webService.post(url, collectionPayload, null, ContentType.APPLICATION_JSON, false, false, headers)

        then:
        resp.statusCode == HttpStatus.SC_OK
        resp.resp.success == true



    }


    def "Data from monitor will be used to create a data set summary in MERIT"() {
        when: "We view the created data set in the project"
        loginAsUser('1', browser)
        to RlpProjectPage, "monitorProject"
        openDataSetSummaryTab()

        then: "The data set is displayed"
        datasetDetails.dataSetSummaryCount() == 1
    }
}

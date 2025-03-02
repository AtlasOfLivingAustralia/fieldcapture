package au.org.ala.fieldcapture


import au.org.ala.ws.service.WebService
import au.org.ala.ws.tokens.TokenService
import com.nimbusds.oauth2.sdk.token.AccessToken
import com.nimbusds.oauth2.sdk.token.BearerAccessToken
import groovy.json.JsonSlurper
import org.apache.http.HttpStatus
import org.apache.http.entity.ContentType
import org.grails.testing.GrailsUnitTest
import pages.RlpProjectPage
import spock.lang.Stepwise

import java.util.concurrent.Callable
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

@Stepwise
// We need GrailsUnitTest because the WebService class has a dependency on grailsApplication.config
// It slows startup down quite a bit though
class ParatooIntegrationSpec extends StubbedCasSpec implements GrailsUnitTest {
    WebService webService

    def setupSpec() {
        useDataSet("dataset3")
    }

    def cleanupSpec() {
        logout(browser)
    }

    def setup() {
        String token = tokenForUser('1')
        AccessToken accessToken = new BearerAccessToken(token)
        TokenService tokenService = Stub(TokenService)
        tokenService.getAuthToken(true) >> accessToken

        String m2mToken = setupTokenForSystem()
        AccessToken m2mAccessToken = new BearerAccessToken(m2mToken)
        tokenService.getAuthToken(false) >> m2mAccessToken
        webService = new WebService(grailsApplication: getGrailsApplication(), tokenService: tokenService)
    }

    private Map buildMintCollectionIdPayload() {
         [
                "survey_metadata": [
                        "survey_details": [
                                "survey_model": "soil-pit-characterisation-full",
                                "time": "2023-08-28T00:34:13.100Z",
                                "uuid": "123-123-123-123-123",
                                "project_id": "monitorProject",
                                "protocol_id": "guid-1",
                                "protocol_version": "1"
                        ],
                        "provenance":[
                                "version_app": "0.0.1-xxxxx",
                                "version_core": "0.1.0-1fb53f81",
                                "version_core_documentation": "0.0.1-xxxxx",
                                "version_org": "4.4-SNAPSHOT",
                                "system_app": "monitor",
                                "system_core": "Monitor-dummy-data-production",
                                "system_org": "MERIT"
                        ]
                ]
        ]
    }

    private Map mintCollectionId(Map payload, String token) {
        String url = testConfig.ecodata.baseUrl + 'paratoo/mintCollectionId'
        Map headers = ["Authorization": "Bearer ${token}"]
        Map resp = webService.post(url, payload, null, ContentType.APPLICATION_JSON, false, false, headers)
        resp
    }

    def "Add new data set in to project"() {

        setup:
        String token = tokenForUser('1')
        Map plotSelectionsPayload = [

                "data": [
                        "plot_name"                 : [
                                "state"        : "CT",
                                "program"      : "NLP",
                                "bioregion"    : "ARC",
                                "unique_digits": "6060"
                        ],
                        "plot_label"                : "string",
                        "recommended_location"      : [
                                "lat": 0,
                                "lng": 0
                        ],
                        "recommended_location_point": "C",
                        "uuid"                      : "string",
                        "comment"                   : "string",
                        "createdBy"                 : 0,
                        "updatedBy"                 : 0
                ]

        ]
        Map mintCollectionIdPayload = buildMintCollectionIdPayload()

        Map collectionPayload = [
                "coreProvenance": [
                        "system_core": "Monitor-test",
                        "version_core": "1"
                ]
        ]

        when:
        String url = testConfig.ecodata.baseUrl + 'paratoo/plot-selections'
        Map headers = ["Authorization": "Bearer ${token}"]
        Map resp = webService.post(url, plotSelectionsPayload, null, ContentType.APPLICATION_JSON, false, false, headers)

        then:
        resp.statusCode == HttpStatus.SC_OK

        when:
        resp = mintCollectionId(mintCollectionIdPayload, token)

        String orgMintedIdentifier = resp.resp.orgMintedIdentifier
        byte[] jsonBytes = orgMintedIdentifier.decodeBase64()
        Map json = new JsonSlurper().parse(jsonBytes)
        String orgMintedUUID = json.survey_metadata.orgMintedUUID

        then:
        resp.statusCode == HttpStatus.SC_OK

        orgMintedUUID != null

        when:
        url = testConfig.ecodata.baseUrl + 'paratoo/pdp/monitorProject/guid-1/write'

        headers = ["Authorization": "Bearer ${token}"]
        resp = webService.get(url, null, ContentType.APPLICATION_JSON, false, false, headers)

        then:
        resp.statusCode == HttpStatus.SC_OK
        resp.resp.isAuthorised == true

        when:
        collectionPayload.orgMintedUUID = orgMintedUUID
        url = testConfig.ecodata.baseUrl + '/paratoo/collection'
        resp = webService.post(url, collectionPayload, null, ContentType.APPLICATION_JSON, true, false, headers)

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

    def "Paratoo data sets can be submitted concurrently without data errors"() {
        setup:
        ExecutorService executor = Executors.newFixedThreadPool(20)
        String token = tokenForUser('1')
        String projectId = 'monitorProject'

        when:
        List callables = []
        for (int i = 0; i < 100; i++) {
            Callable callable = new Callable() {
                @Override
                Object call() throws Exception {
                    Map payload = buildMintCollectionIdPayload()
                    payload.survey_metadata.protocol_id = "guid-${i}"
                    Map result = mintCollectionId(payload, token)

                    return result
                }
            }
            callables.add(callable)
        }
        executor.invokeAll(callables)


        String url = testConfig.ecodata.baseUrl + 'project/'+projectId
        Map resp = webService.get(url, [:], ContentType.APPLICATION_JSON, true, false)

        then:
        resp.resp?.custom?.dataSets?.size() == 101
        for (int i = 0; i < 100; i++) {
            resp.resp.custom.dataSets.find { it.surveyId.survey_metadata.protocol_id == 'guid-' + i } != null
        }

    }


}

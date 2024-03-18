package au.org.ala.fieldcapture

import au.org.ala.ws.service.WebService
import org.apache.http.entity.ContentType
import org.grails.testing.GrailsUnitTest
import org.apache.http.HttpStatus
import spock.lang.Stepwise
import pages.RlpProjectPage
import pages.DatasetPage

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
        webService = new WebService(grailsApplication: getGrailsApplication())
    }

    def "The user completes the MERI plan for the project, selecting one service"() {
        when:
        loginAsUser('1', browser)
        to RlpProjectPage, "monitorProject"
        def meriPlan = openMeriPlanEditTab()
        meriPlan.aquireEditLock()
        waitFor {
            hasBeenReloaded()
        }
        at RlpProjectPage // reset at check time.
        meriPlan = openMeriPlanEditTab() // refresh the reference as the old one is stale

        meriPlan.priorityPlace.supportsPriorityPlaces = "No"
        meriPlan.firstNationsPeopleInvolvement.supportsFirstNationsPeopleInvolvement = "Yes"
        meriPlan.firstNationsPeopleInvolvement.firstNationsPeopleInvolvement = "Leading"
        meriPlan.primaryOutcome = "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        waitFor {
            meriPlan.primaryPriority.find('[value="Ginini Flats Wetland Complex"]')
        }
        meriPlan.primaryPriority = "Ginini Flats Wetland Complex"
        meriPlan.secondaryOutcomes[0].outcome = "By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
        meriPlan.secondaryOutcomes[0].priority = "Bettongia gaimardi"
        meriPlan.shortTermOutcomes[0].outcome = "Ginini Flats Wetland Complex"
        meriPlan.shortTermOutcomes[0].relatedProgramOutcomes = "Short term outcome 1"
        meriPlan.addMediumTermOutcome("Medium term outcome 1", "Ginini Flats Wetland Complex", "Medium term outcome 1")
        meriPlan.keyThreats[0].threat = "Threat 1"
        meriPlan.keyThreats[0].intervention = "Intervention 1"
        meriPlan.projectMethodology = "Project methodology"
        meriPlan.keyThreats[0].relatedOutcomes = ['ST1']
        meriPlan.keyThreats[0].threatCode = 'Key threat 2'
        meriPlan.keyThreats[0].threat = "Threat 1"
        meriPlan.keyThreats[0].intervention = "Intervention 1"

        meriPlan.keyThreats[0].targetMeasures = ['score_42']
        meriPlan.keyThreats[0].evidence = "Evidence 1"
        meriPlan.projectMethodology = "Project assumptions 1"

        meriPlan.projectPartnerships[0].name = 'partner name'
        meriPlan.projectPartnerships[0].partnership = 'partnership'
        meriPlan.projectPartnerships[0].orgType = 'Trust'
        meriPlan.extendedBaseline.projectBaselines[0].outcome = "MT1"
        meriPlan.extendedBaseline.projectBaselines[0].monitoringData = "Needs to be collected"
        meriPlan.extendedBaseline.projectBaselines[0].baseline = "Baseline 1"
        meriPlan.extendedBaseline.projectBaselines[0].targetMeasures = ['score_42']

        meriPlan.reviewMethodology = "Review methodology"
        meriPlan.nationalAndRegionalPlans[0].name = "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section = "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment = "Alignment 1"

        meriPlan.save()

        then:
        true
    }

    def "The user uses the Monitor app to submit a collection and add new data set to the project"() {

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
        Map mintCollectionIdPayload = [

                surveyId: [
                        projectId : 'monitorProject',
                        protocol  : [
                                id     : "guid-1", // Protocol 23 used to obtain representative data for this functional test
                                version: 1
                        ],
                        surveyType: 'soil-pit-characterisation-full',
                        time      : '2023-08-28T00:34:13.100Z',
                        uuid   : "123-123-123-123-123"
                ]
        ]
        Map collectionPayload = [
                projectId: 'monitorProject',
                protocol : [
                        id     : "guid-1",
                        version: 1
                ],
                userId   : '1',
                eventTime: '2023-08-28T00:28:15.272Z'
        ]

        when: "The user completes and synchronizes the plot selection protocol in Monitor"
        String url = testConfig.ecodata.baseUrl + 'paratoo/plot-selections'
        Map headers = ["Authorization": "Bearer ${token}"]
        Map resp = webService.post(url, plotSelectionsPayload, null, ContentType.APPLICATION_JSON, false, false, headers)

        then:
        resp.statusCode == HttpStatus.SC_OK


        when: "The user completes a protocol in Monitor, Monitor sends a mintCollectionId request to ecodata"
        url = testConfig.ecodata.baseUrl + 'paratoo/mintCollectionId'
        headers = ["Authorization": "Bearer ${token}"]
        resp = webService.post(url, mintCollectionIdPayload, null, ContentType.APPLICATION_JSON, false, false, headers)

        String orgMintedIdentifier = resp.resp.orgMintedIdentifier

        then:
        resp.statusCode == HttpStatus.SC_OK

        orgMintedIdentifier != null

        when:
        url = testConfig.ecodata.baseUrl + 'paratoo/pdp/monitorProject/guid-1/write'

        headers = ["Authorization": "Bearer ${token}"]
        resp = webService.get(url, null, ContentType.APPLICATION_JSON, false, false, headers)

        then:
        resp.statusCode == HttpStatus.SC_OK
        resp.resp.isAuthorised == true

        when:
        collectionPayload.orgMintedIdentifier = orgMintedIdentifier
        url = testConfig.ecodata.baseUrl + '/paratoo/collection'
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

        when: "The user views the data set summary created via the Monitor app"
        datasetDetails.summaryRows[0].edit()

        then: "Some of the fields have been pre-populated"

        waitFor {
            at DatasetPage
        }
        def dataSet = datasetContent
        println(dataSet.title.value())
        dataSet.title == "Protocol 1 - 2023-08-28 (Testing monitor integration)"
        dataSet.protocol == "guid-1"
        dataSet.methodDescription == "See EMSA Protocols Manual: https://www.tern.org.au/emsa-protocols-manual"
        dataSet.collectionApp == "Monitor"

        when: "The user completes the remaining fields"
        dataSet.programOutcome = "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        dataSet.investmentPriorities = ["Bettongia gaimardi"]
        dataSet.type = "Baseline dataset associated with a project outcome"
        dataSet.baselines = ['b1']
        dataSet.startDate ="21-01-2021"
        dataSet.endDate ="21-01-2022"
        dataSet.addition = "Yes"
        dataSet.threatenedSpeciesIndex = "No"
        dataSet.publicationUrl = "url"
        dataSet.sensitivities =["Commercially sensitive", "Ecologically sensitive"]

        dataSet.markCompleted.click()
        dataSet.createButton.click()

        then:
        waitFor  { at RlpProjectPage }
        openDataSetSummaryTab()
        datasetDetails.dataSetSummaryCount() == 1
        datasetDetails.summaryRows[0].progress == "finished"
    }
}

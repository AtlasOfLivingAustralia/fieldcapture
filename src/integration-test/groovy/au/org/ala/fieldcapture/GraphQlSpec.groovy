package au.org.ala.fieldcapture


import au.org.ala.ws.service.WebService
import au.org.ala.ws.tokens.TokenService
import com.nimbusds.oauth2.sdk.token.AccessToken
import com.nimbusds.oauth2.sdk.token.BearerAccessToken
import geb.module.FormElement
import groovy.json.JsonSlurper
import org.apache.http.HttpStatus
import org.apache.http.entity.ContentType
import org.grails.testing.GrailsUnitTest
import pages.AdminClearCachePage
import pages.AdminTools
import pages.RlpProjectPage
import spock.lang.Stepwise

import java.util.concurrent.Callable
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

@Stepwise
// We need GrailsUnitTest because the WebService class has a dependency on grailsApplication.config
// It slows startup down quite a bit though
class GraphQlSpec extends StubbedCasSpec implements GrailsUnitTest {
    WebService webService

    def setupSpec() {
        useDataSet("dataset_graphql")
        loginAsAlaAdmin(browser)
        to AdminTools
        reindex()
        clearMetadata()
        clearCache()
        Thread.sleep(5000) // Give the reindex time to happen

        to AdminClearCachePage
        clearProgramListCache()
        at AdminClearCachePage // reset at check time.
        clearServiceListCache()
        at AdminClearCachePage // reset at check time.
        clearProtocolListCache()
    }

    def cleanupSpec() {
        logout(browser)
    }

    def setup() {
        String token = tokenForUser('1000')
        AccessToken accessToken = new BearerAccessToken(token)
        TokenService tokenService = Stub(TokenService)
        tokenService.getAuthToken(true) >> accessToken

        String m2mToken = setupTokenForSystem()
        AccessToken m2mAccessToken = new BearerAccessToken(m2mToken)
        tokenService.getAuthToken(false) >> m2mAccessToken
        webService = new WebService(grailsApplication: getGrailsApplication(), tokenService: tokenService)


    }

    private String searchMERITProjectsQuery(String fqString) {
         """{
                searchMeritProjects(
                  page:1, 
                  max:10,
                  ${fqString}
                  ) {
                  results {
                    lastUpdated
                    dateCreated
                  
                    projectId
                    status
                    name
                    description
                    externalIds {
                      idType
                      externalId
                    }
                    associatedOrgs {
                      organisation {
                        acronym
                        name
                        abn
                      }
                      name
                    }
                    program {
                      name
                    }
                    meriPlan {
                      publicationStatus
                      supportedPriorityPlaces
                      firstNationsPeopleInvolvement
                      implementationOrDeliveryAssumptions
                      evaluationApproach
                      primaryOutcome {
                        description
                        relatedOutcome
                        code
                        assets
                      } 
                      secondaryOutcomes {
                        description
                        code
                        relatedOutcome
                        assets
                      }
                      shortTermOutcomes {
                        description
                        relatedOutcome
                        code
                      }
                      midTermOutcomes {
                        description
                        relatedOutcome
                        code
                      }
                      partnerships {
                        partnerName
                        partnerOrganisationType
                        description
                      }
                      keyThreats {
                      
                        threatCode
                        description
                        intervention
                        targetMeasures {
                          service {
                            name
                          }
                          targetMeasureId
                      
                          label
                        }
                        evidence
                        relatedOutcomes
                      }
                       baselines {
                        code
                        description
                        existsOrToBeEstablished
                        method
                        emsaModules
                        relatedOutcomes
                        evidence
                      
                        targetMeasures {
                          label 
                          targetMeasureId
                          service {
                            name
                          }
                    
                        }
                      }
                      monitoringMethodology {
                        relatedBaseline
                        description
                        targetMeasures {
                          targetMeasureId
                          label
                          service {
                            name
                          }
                        }
                        emsaModules
                        method
                        evidence
                      }
                      conservationAndManagementPlans {
                        documentName
                        documentSection
                        strategicAlignment
                        documentUrl
                      }
      
                                 
                     outputTargets {
                        targetMeasure {
                          label
                          service {
                            name
                          }
                        }
                        target
                        targetDate
                        outcomeTargets {
                          relatedOutcomes
                          target
                        }
                        periodTargets {
                          period
                          target
                        }
                      }
                      
            
                    }
                  
            
                  }
                  totalCount
                }
              }"""
    }

    def "A simple graphQL query will return the correct number of projects"() {

        setup:
        String userId = '1000'
        String query = """
        {
          searchMeritProjects(page:1, max:10, status:[ACTIVE]) {
            results {
              projectId
            }
            totalCount
          }
        }
        """

        when:
        Map resp = runGraphQLQuery(query, userId)

        then:
        resp.statusCode == HttpStatus.SC_OK
        !resp.resp?.errors
        resp.resp.data.searchMeritProjects.totalCount == 15
    }

    def "MERI data can be returned via the Graphql API"() {
        setup:
        String projectId = '55555555-2222-3333-4444-555555555555'
        loginAsMeritAdmin(browser)

        when:
        to RlpProjectPage, projectId
        def meriPlan = openMeriPlanEditTab()
        meriPlan.aquireEditLock()
        waitFor {
            hasBeenReloaded()
        }
        at RlpProjectPage // reset at check time.

        meriPlan = openMeriPlanEditTab()

        waitFor{meriPlan.projectName.displayed}
        interact {
            moveToElement(meriPlan.projectName)
        }

        meriPlan.projectName = "MERI plan edited name"
        meriPlan.projectDescription = "MERI plan edited description"
        meriPlan.priorityPlace.supportsPriorityPlaces = 'Yes'
        waitFor {
            meriPlan.priorityPlace.priorityPlace.displayed
        }
        meriPlan.priorityPlace.priorityPlace = 'Priority place 1'
        meriPlan.firstNationsPeopleInvolvement.supportsFirstNationsPeopleInvolvement = 'Yes'
        meriPlan.firstNationsPeopleInvolvement.firstNationsPeopleInvolvement = 'Leading'

        meriPlan.primaryOutcome = "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        waitFor {
            meriPlan.primaryPriority.find('[value="Ginini Flats Wetland Complex"')
        }
        meriPlan.primaryPriority = "Ginini Flats Wetland Complex"
        meriPlan.secondaryOutcomes[0].outcome = "By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
        meriPlan.secondaryOutcomes[0].priority = "Swainsona recta"

        meriPlan.addMediumTermOutcome("")

        then: "The Selectable priorities are derived from the selections made in the primary and secondary outcomes"
        waitFor {
            meriPlan.shortTermOutcomes[0].priority.find('option').collect { it.value() } == ["", "Ginini Flats Wetland Complex", "Swainsona recta"]
        }
        waitFor {
            meriPlan.shortTermOutcomes[0].relatedProgramOutcomes.find('option').collect { it.value() } == ["", "Short term outcome 1", "Short term outcome 2", "Short term outcome 3"]
        }
        waitFor {
            meriPlan.mediumTermOutcomes[0].priority.find('option').collect { it.value() } == ["", "Ginini Flats Wetland Complex", "Swainsona recta"]
        }
        waitFor {
            meriPlan.mediumTermOutcomes[0].relatedProgramOutcomes.find('option').collect{it.value()} == ["", "Medium term outcome 1", "Medium term outcome 2", "Medium term outcome 3"]
        }
        waitFor {
            meriPlan.keyThreats[0].threatCode.find('option').collect{it.value()} == ["", "Key threat 1", "Key threat 2", "Key threat 3"]
        }

        when:
        meriPlan.shortTermOutcomes[0].outcome = "Short term outcome 1"
        meriPlan.shortTermOutcomes[0].priority = "Swainsona recta"
        meriPlan.shortTermOutcomes[0].relatedProgramOutcomes = "Short term outcome 3"
        meriPlan.mediumTermOutcomes[0].outcome = "Medium term outcome 1"
        meriPlan.mediumTermOutcomes[0].priority = "Swainsona recta"
        meriPlan.mediumTermOutcomes[0].relatedProgramOutcomes = "Medium term outcome 1"
        meriPlan.addMediumTermOutcome("Medium term outcome 2", "Ginini Flats Wetland Complex", "Medium term outcome 2")

        then:
        waitFor {
            meriPlan.keyThreats[0].relatedOutcomes.find('option').collect{it.value()} == ["MT1", "MT2", "ST1"]
            meriPlan.keyThreats[0].targetMeasures.find('option').collect{it.value()}.containsAll(["score_42", "score_43", "score_44"])
        }

        when:
        meriPlan.keyThreats[0].relatedOutcomes = ['ST1']
        meriPlan.keyThreats[0].threatCode = 'Key threat 2'
        meriPlan.keyThreats[0].threat = "Threat 1"
        meriPlan.keyThreats[0].intervention = "Intervention 1"

        meriPlan.keyThreats[0].targetMeasures = ['score_43']
        meriPlan.keyThreats[0].evidence = "Evidence 1"
        meriPlan.projectMethodology = "Project assumptions 1"

        meriPlan.projectPartnerships[0].name = 'partner name'
        meriPlan.projectPartnerships[0].partnership = 'partnership'
        meriPlan.projectPartnerships[0].orgType = 'Trust'

        then:
        waitFor {
            meriPlan.extendedBaseline.projectBaselines[0].outcome.find('option').collect{it.value()} == ["", "MT1", "MT2", "ST1"]
            meriPlan.extendedBaseline.projectBaselines[0].methodProtocols.find('option').collect{it.value()} == ["", "Category 1", "Category 3", "Other"]
            meriPlan.extendedBaseline.projectBaselines[0].targetMeasures.module(FormElement).disabled
            meriPlan.extendedBaseline.projectBaselines[0].methodProtocols.module(FormElement).disabled
            meriPlan.extendedBaseline.projectBaselines[0].evidence.module(FormElement).disabled

        }

        when:
        meriPlan.extendedBaseline.projectBaselines[0].outcome = ["MT1"]
        meriPlan.extendedBaseline.projectBaselines[0].monitoringData = "Needs to be collected"

        then:
        waitFor {
            !meriPlan.extendedBaseline.projectBaselines[0].targetMeasures.module(FormElement).disabled
            !meriPlan.extendedBaseline.projectBaselines[0].methodProtocols.module(FormElement).disabled
            !meriPlan.extendedBaseline.projectBaselines[0].evidence.module(FormElement).disabled
        }

        when:
        meriPlan.extendedBaseline.projectBaselines[0].baseline = "Project baseline 1"
        meriPlan.extendedBaseline.projectBaselines[0].targetMeasures = ['score_44']
        meriPlan.extendedBaseline.projectBaselines[0].methodProtocols = ['Category 1']
        meriPlan.extendedBaseline.projectBaselines[0].evidence = "Baseline Evidence 1"
        meriPlan.extendedBaseline.addMonitoringIndicator(0)

        then: "Wait for the monitoring indicator to be displayed"
        waitFor {
            meriPlan.monitoringIndicators.size() == 1
        }

        when:
        meriPlan.monitoringIndicators[0].indicator = "Indicator 1"
        meriPlan.monitoringIndicators[0].targetMeasures = ['score_42']
        meriPlan.monitoringIndicators[0].methodProtocols = ['Category 1']
        meriPlan.monitoringIndicators[0].evidence = "Evidence 2"

        meriPlan.reviewMethodology = "Review methodology"
        meriPlan.nationalAndRegionalPlans[0].name = "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section = "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment = "Alignment 1"
        meriPlan.nationalAndRegionalPlans[0].documentUrl = "http://www.test.org"

        then: "Wait for the listener to update the available target measures and ensure they are correct"
        waitFor {
            meriPlan.serviceOutcomeTargets.serviceAndTargets.size() == 3

            meriPlan.serviceOutcomeTargets.serviceAndTargets[0].service == "Collecting, or synthesising baseline data"
            meriPlan.serviceOutcomeTargets.serviceAndTargets[0].targetMeasure == "Number of baseline data sets collected and/or synthesised"
            meriPlan.serviceOutcomeTargets.serviceAndTargets[1].service == "Communication materials"
            meriPlan.serviceOutcomeTargets.serviceAndTargets[1].targetMeasure == "Number of communication materials published"
            meriPlan.serviceOutcomeTargets.serviceAndTargets[2].service == "Weed distribution survey"
            meriPlan.serviceOutcomeTargets.serviceAndTargets[2].targetMeasure == "Area (ha) surveyed for weeds"

            meriPlan.serviceOutcomeTargets.outcomeTargets[0].outcomes == ["MT1"]
            meriPlan.serviceOutcomeTargets.outcomeTargets[1].outcomes == ["ST1"]
            meriPlan.serviceOutcomeTargets.outcomeTargets[2].outcomes == ["MT1"]
        }

        meriPlan.serviceForecasts.forecasts.size() == 3
        meriPlan.serviceForecasts.forecasts[0].service == "Collecting, or synthesising baseline data"
        meriPlan.serviceForecasts.forecasts[0].score == "Number of baseline data sets collected and/or synthesised"
        meriPlan.serviceForecasts.forecasts[1].service == "Communication materials"
        meriPlan.serviceForecasts.forecasts[1].score == "Number of communication materials published"
        meriPlan.serviceForecasts.forecasts[2].service == "Weed distribution survey"
        meriPlan.serviceForecasts.forecasts[2].score == "Area (ha) surveyed for weeds"

        when:
        meriPlan.serviceOutcomeTargets.outcomeTargets[0].target = "2"
        meriPlan.serviceOutcomeTargets.outcomeTargets[1].target = "1"
        meriPlan.serviceOutcomeTargets.outcomeTargets[2].target = "3"

        meriPlan.serviceForecasts.forecasts[0].targets[0].value("1")
        meriPlan.serviceForecasts.forecasts[0].targets[1].value("2")
        meriPlan.serviceForecasts.forecasts[0].targets[2].value("3")
        meriPlan.serviceForecasts.forecasts[0].targets[3].value("4")
        meriPlan.serviceForecasts.forecasts[0].targets[4].value("5")
        meriPlan.serviceForecasts.forecasts[1].targets[0].value("5")
        meriPlan.serviceForecasts.forecasts[1].targets[1].value("4")
        meriPlan.serviceForecasts.forecasts[1].targets[2].value("3")
        meriPlan.serviceForecasts.forecasts[1].targets[3].value("2")
        meriPlan.serviceForecasts.forecasts[1].targets[4].value("1")
        meriPlan.serviceForecasts.forecasts[2].targets[0].value("6")
        meriPlan.serviceForecasts.forecasts[2].targets[1].value("7")
        meriPlan.serviceForecasts.forecasts[2].targets[2].value("8")
        meriPlan.serviceForecasts.forecasts[2].targets[3].value("9")
        meriPlan.serviceForecasts.forecasts[2].targets[4].value("0")

        meriPlan.save()

        then:
        waitFor {hasBeenReloaded()}

        when:
        String query = searchMERITProjectsQuery("meritProjectID:\"outcomeMeriPlanProject\"")
        Map resp = runGraphQLQuery(query, '1000', 'merit')

        then:
        resp.statusCode == HttpStatus.SC_OK
        !resp.resp?.errors
        resp.resp.data.searchMeritProjects.totalCount == 1

        def result = resp.resp.data.searchMeritProjects.results[0]
        // Assert outcome targets match what was set
        result.meriPlan.outputTargets[0].targetMeasure.label == "Number of communication materials published"
        result.meriPlan.outputTargets[0].targetMeasure.service.name == "Communication materials"
        result.meriPlan.outputTargets[0].target == 1
        result.meriPlan.outputTargets[0].outcomeTargets.size() == 1
        result.meriPlan.outputTargets[0].outcomeTargets[0].target == 1
        result.meriPlan.outputTargets[0].outcomeTargets[0].relatedOutcomes == ["ST1"]
        result.meriPlan.outputTargets[0].periodTargets == [
            [period: "2018/2019", target: 5.0],
            [period: "2019/2020", target: 4.0],
            [period: "2020/2021", target: 3.0],
            [period: "2021/2022", target: 2.0],
            [period: "2022/2023", target: 1.0],
            [period: "2023/2024", target: 0.0]
        ]

        result.meriPlan.outputTargets[1].targetMeasure.label == "Area (ha) surveyed for weeds"
        result.meriPlan.outputTargets[1].targetMeasure.service.name == "Weed distribution survey"
        result.meriPlan.outputTargets[1].target == 3
        result.meriPlan.outputTargets[1].outcomeTargets.size() == 1
        result.meriPlan.outputTargets[1].outcomeTargets[0].target == 3
        result.meriPlan.outputTargets[1].outcomeTargets[0].relatedOutcomes == ["MT1"]
        result.meriPlan.outputTargets[1].periodTargets == [
            [period: "2018/2019", target: 6.0],
            [period: "2019/2020", target: 7.0],
            [period: "2020/2021", target: 8.0],
            [period: "2021/2022", target: 9.0],
            [period: "2022/2023", target: 0.0],
            [period: "2023/2024", target: 0.0]
        ]

        result.meriPlan.outputTargets[2].targetMeasure.label == "Number of baseline data sets collected and/or synthesised"
        result.meriPlan.outputTargets[2].targetMeasure.service.name == "Collecting, or synthesising baseline data"
        result.meriPlan.outputTargets[2].target == 2
        result.meriPlan.outputTargets[2].outcomeTargets.size() == 1
        result.meriPlan.outputTargets[2].outcomeTargets[0].target == 2
        result.meriPlan.outputTargets[2].outcomeTargets[0].relatedOutcomes == ["MT1"]
        result.meriPlan.outputTargets[2].periodTargets == [
                [period: "2018/2019", target: 1.0],
                [period: "2019/2020", target: 2.0],
                [period: "2020/2021", target: 3.0],
                [period: "2021/2022", target: 4.0],
                [period: "2022/2023", target: 5.0],
                [period: "2023/2024", target: 0.0]
        ]

        result.name == "MERI plan edited name"
        result.description == "MERI plan edited description"

        result.meriPlan.publicationStatus == "DRAFT"
        result.meriPlan.supportedPriorityPlaces == ["Priority place 1"]
        result.meriPlan.firstNationsPeopleInvolvement == "Leading"
        result.meriPlan.primaryOutcome.description == "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        result.meriPlan.primaryOutcome.assets == ["Ginini Flats Wetland Complex"]
        result.meriPlan.secondaryOutcomes[0].description == "By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
        result.meriPlan.secondaryOutcomes[0].assets == ["Swainsona recta"]
        result.meriPlan.shortTermOutcomes[0].description == "Short term outcome 1"
        result.meriPlan.shortTermOutcomes[0].relatedOutcome == "Short term outcome 3"
        result.meriPlan.midTermOutcomes[0].description == "Medium term outcome 1"
        result.meriPlan.midTermOutcomes[0].relatedOutcome == "Medium term outcome 1"
        result.meriPlan.keyThreats[0].threatCode == "Key threat 2"
        result.meriPlan.keyThreats[0].description == "Threat 1"
        result.meriPlan.keyThreats[0].intervention == "Intervention 1"
        result.meriPlan.keyThreats[0].targetMeasures[0].targetMeasureId == "score_43"
        result.meriPlan.keyThreats[0].targetMeasures[0].service.name == "Communication materials"
        result.meriPlan.keyThreats[0].targetMeasures[0].label == "Number of communication materials published"
        result.meriPlan.keyThreats[0].evidence == "Evidence 1"
        result.meriPlan.implementationOrDeliveryAssumptions  == "Project assumptions 1"
        result.meriPlan.partnerships[0].partnerName == "partner name"
        result.meriPlan.partnerships[0].description == "partnership"
        result.meriPlan.partnerships[0].partnerOrganisationType == "Trust"
        result.meriPlan.baselines[0].code == "B2"
        result.meriPlan.baselines[0].description == "Project baseline 1"
        result.meriPlan.baselines[0].relatedOutcomes == ["MT1"]
        result.meriPlan.baselines[0].existsOrToBeEstablished == "Needs to be collected"
        result.meriPlan.baselines[0].targetMeasures.size() == 1
        result.meriPlan.baselines[0].targetMeasures[0].targetMeasureId == "score_44"
        result.meriPlan.baselines[0].targetMeasures[0].service.name == "Weed distribution survey"
        result.meriPlan.baselines[0].targetMeasures[0].label == "Area (ha) surveyed for weeds"
        result.meriPlan.baselines[0].emsaModules == ["Category 1"]
        result.meriPlan.baselines[0].evidence == "Baseline Evidence 1"
        result.meriPlan.monitoringMethodology[0].description == "Indicator 1"
        result.meriPlan.monitoringMethodology[0].targetMeasures[0].targetMeasureId == "score_42"
        result.meriPlan.monitoringMethodology[0].targetMeasures[0].service.name == "Collecting, or synthesising baseline data"
        result.meriPlan.monitoringMethodology[0].targetMeasures[0].label == "Number of baseline data sets collected and/or synthesised"
        result.meriPlan.monitoringMethodology[0].relatedBaseline == "B2"
        result.meriPlan.monitoringMethodology[0].emsaModules == ["Category 1"]
        result.meriPlan.monitoringMethodology[0].evidence == "Evidence 2"

        result.meriPlan.conservationAndManagementPlans[0].documentName == "Plan 1"
        result.meriPlan.conservationAndManagementPlans[0].documentSection == "Section 1"
        result.meriPlan.conservationAndManagementPlans[0].strategicAlignment == "Alignment 1"
        result.meriPlan.conservationAndManagementPlans[0].documentUrl == "http://www.test.org"

    }

    private Map runGraphQLQuery(String query, String user, String hubPath = "merit") {
        Map q = [query: query]
        String url = testConfig.ecodata.baseUrl + "graphql/$hubPath"
        String token = tokenForUser(user)
        Map headers = ["Authorization": "Bearer ${token}"]
        return webService.post(url, q, null, ContentType.APPLICATION_JSON, false, false, headers)
    }

    private String GRAPHQL_TEST_PROJECT_ID = "a0f57791-e858-4f33-ae8e-7e3e3fffb447"

    void "Project data can be returned via the Graphql API"() {
        setup:
        String userId = '1000'
        String hubPath = 'merit'
        String query = """
          {
            meritProject(projectId:\"${GRAPHQL_TEST_PROJECT_ID}\") { 
              dateCreated
              lastUpdated
              status
              meritProjectID
              description
              externalId
              grantId             
              name
              projectId
              funding
              fundingType
              portfolio
              manager
            }  
          }  
        """

        when:
        Map resp = runGraphQLQuery(query, userId, hubPath)

        then:
        resp.statusCode == HttpStatus.SC_OK
        !resp.resp?.errors

        resp.resp.data.meritProject.projectId == GRAPHQL_TEST_PROJECT_ID
        def meritProject = resp.resp.data.meritProject
        meritProject.dateCreated == "2023-11-13T03:59:41Z"
        meritProject.lastUpdated == "2025-09-11T06:15:31Z"
        meritProject.status == "ACTIVE"
        meritProject.meritProjectID == "GRAPHQL-1"
        meritProject.description == "Test data for the GraphQL API"
        meritProject.externalId == ""
        meritProject.grantId == "GRAPHQL-1"
        meritProject.name == "GraphQL Test Project"
        meritProject.projectId == "a0f57791-e858-4f33-ae8e-7e3e3fffb447"
        meritProject.funding == 0
        meritProject.fundingType == ""
        meritProject.portfolio == ""
        meritProject.manager == ""


    }

    void "Risk data can be returned via the Graphql API"() {
        setup:
        String userId = '1000'
        String hubPath = 'merit'
        String query = """
          {
            meritProject(projectId:\"${GRAPHQL_TEST_PROJECT_ID}\") { 
              projectId
              risks { 
                lastUpdated
                overallRisk 
                risks { 
                  description 
                  likelihood 
                  consequence 
                  residualRisk
                  currentControl
                } 
              }
            }  
          }  
        """

        when:
        Map resp = runGraphQLQuery(query, userId, hubPath)

        then:
        resp.statusCode == HttpStatus.SC_OK
        !resp.resp?.errors

        resp.resp.data.meritProject.projectId == GRAPHQL_TEST_PROJECT_ID
        def risks = resp.resp.data.meritProject.risks
        risks != null
        risks.overallRisk == "Severe"
        risks.lastUpdated == "2025-09-12T00:33:11Z"

        risks.risks.size() == 2

        risks.risks[0].description == "Description 1"
        risks.risks[0].likelihood == "Highly Likely"
        risks.risks[0].consequence == "Minor"
        risks.risks[0].residualRisk == "Severe"
        risks.risks[0].currentControl == "Control 1"

        risks.risks[1].description == "Description 2"
        risks.risks[1].likelihood == "Rare"
        risks.risks[1].consequence == "Critical"
        risks.risks[1].residualRisk == "Severe"
        risks.risks[1].currentControl == "Control 2"
    }


    void "Data set summary data can be returned via the Graphql API"() {
        setup:
        String userId = '1000'
        String hubPath = 'merit'
        String query = """
        {
            meritProject(projectId: "a0f57791-e858-4f33-ae8e-7e3e3fffb447") {
                projectId
                dataSetSummaries {
                    dataSetId
                    reportId
                    siteId
                    name
                    status
                    publicationStatus
                    progress
                    startDate
                    endDate
                    type
                    collectorType
                    qa
                    term
                    programOutcome
                    addition
                    owner
                    methodDescription
                    custodian
                    dataCollectionOngoing
                    format
                    published
                    storageType
                    publicationUrl
                    threatenedSpeciesIndex
                    threatenedSpeciesIndexUploadDate
                    sizeUnknown
                    protocol
                    collectionApp
                    orgMintedIdentifier
                }
            }
        }
        """

        when:
        Map resp = runGraphQLQuery(query, userId, hubPath)

        then:
        resp.statusCode == HttpStatus.SC_OK
        !resp.resp?.errors

        resp.resp.data.meritProject.projectId == GRAPHQL_TEST_PROJECT_ID
        def dataSetSummaries = resp.resp.data.meritProject.dataSetSummaries
        dataSetSummaries instanceof List
        dataSetSummaries.size() == 4
        // First data set
        def ds1 = dataSetSummaries[0]
        ds1.publicationStatus == null
        ds1.sizeUnknown == true
        ds1.endDate == "2024-02-01T02:00:00Z"
        ds1.type == "Baseline"
        ds1.collectorType == null
        ds1.qa == null
        ds1.protocol == "other"
        ds1.term == null
        ds1.programOutcome == "1.  Species and Landscapes (Long term): Threatened Species (TS) - The trajectory of species targeted under the Threatened Species Action Plan 2022-2032 and other EPBC Act listed Species is improved"
        ds1.addition == "No"
        ds1.owner == null
        ds1.methodDescription == "Test methodology"
        ds1.reportId == null
        ds1.custodian == null
        ds1.dataCollectionOngoing == false
        ds1.format == "Database Table"
        ds1.published == null
        ds1.threatenedSpeciesIndexUploadDate == null
        ds1.collectionApp == "Monitor"
        ds1.orgMintedIdentifier == null
        ds1.dataSetId == "bbceb2dc-f62d-4116-b590-0124fc65b367"
        ds1.name == "Flora data set 19/02/2024"
        ds1.siteId == null
        ds1.progress == "FINISHED"
        ds1.storageType == null
        ds1.publicationUrl == "Biodiversity Data Repository (URL pending)"
        ds1.startDate == "2024-01-31T02:00:00Z"
        ds1.threatenedSpeciesIndex == "No"
        ds1.status == "ACTIVE"
        // Second data set
        def ds2 = dataSetSummaries[1]
        ds2.publicationStatus == null
        ds2.sizeUnknown == null
        ds2.endDate == null
        ds2.type == null
        ds2.collectorType == null
        ds2.qa == null
        ds2.protocol == "a9cb9e38-690f-41c9-8151-06108caf539d"
        ds2.term == null
        ds2.programOutcome == null
        ds2.addition == null
        ds2.owner == null
        ds2.methodDescription == null
        ds2.reportId == null
        ds2.custodian == null
        ds2.dataCollectionOngoing == null
        ds2.format == null
        ds2.published == null
        ds2.threatenedSpeciesIndexUploadDate == null
        ds2.collectionApp == "Monitor"
        ds2.orgMintedIdentifier != null
        ds2.dataSetId == "23721e7d-30a9-4753-ae05-79d2cf0c9e32"
        ds2.name == "Plot Selection - 2024-02-21 (Monitor Test Project 2)"
        ds2.siteId == null
        ds2.progress == "STARTED"
        ds2.storageType == null
        ds2.publicationUrl == null
        ds2.startDate == null
        ds2.threatenedSpeciesIndex == null
        ds2.status == "ACTIVE"
        // Third data set
        def ds3 = dataSetSummaries[2]
        ds3.publicationStatus == null
        ds3.sizeUnknown == null
        ds3.endDate == null
        ds3.type == null
        ds3.collectorType == null
        ds3.qa == null
        ds3.protocol == "a9cb9e38-690f-41c9-8151-06108caf539d"
        ds3.term == null
        ds3.programOutcome == null
        ds3.addition == null
        ds3.owner == null
        ds3.methodDescription == null
        ds3.reportId == null
        ds3.custodian == null
        ds3.dataCollectionOngoing == null
        ds3.format == null
        ds3.published == null
        ds3.threatenedSpeciesIndexUploadDate == null
        ds3.collectionApp == "Monitor"
        ds3.orgMintedIdentifier != null
        ds3.dataSetId == "e19263fb-31da-4bc8-80a8-697b79f7d7c7"
        ds3.name == "Plot Selection - 2024-02-21 (Monitor Test Project 2)"
        ds3.siteId == null
        ds3.progress == "STARTED"
        ds3.storageType == null
        ds3.publicationUrl == null
        ds3.startDate == null
        ds3.threatenedSpeciesIndex == null
        ds3.status == "ACTIVE"
        // Fourth data set
        def ds4 = dataSetSummaries[3]
        ds4.publicationStatus == null
        ds4.sizeUnknown == true
        ds4.endDate == null
        ds4.type == null
        ds4.collectorType == null
        ds4.qa == null
        ds4.protocol == "a9cb9e38-690f-41c9-8151-06108caf539d"
        ds4.term == null
        ds4.programOutcome == null
        ds4.addition == null
        ds4.owner == null
        ds4.methodDescription == null
        ds4.reportId == null
        ds4.custodian == null
        ds4.dataCollectionOngoing == null
        ds4.format == "Database Table"
        ds4.published == null
        ds4.threatenedSpeciesIndexUploadDate == null
        ds4.collectionApp == "Monitor"
        ds4.orgMintedIdentifier != null
        ds4.dataSetId == "e6794cfc-59f2-4718-8b22-dabfde2488e6"
        ds4.name == "Plot Selection - 2025-05-29 12:23 PM"
        ds4.siteId == null
        ds4.progress == "STARTED"
        ds4.storageType == null
        ds4.publicationUrl == null
        ds4.startDate == null
        ds4.threatenedSpeciesIndex == null
        ds4.status == "ACTIVE"
    }

    void "Site data can be returned via the Graphql API"() {
        setup:
        String userId = '1000'
        String hubPath = 'merit'
        String query = """
        {
            meritProject(projectId: \"a0f57791-e858-4f33-ae8e-7e3e3fffb447\") {
                projectId
                sites {
                    siteId
                    dateCreated
                    lastUpdated
                    name
                    purposeCode
                    geoJson
                    areaM2
                }
            }
        }
        """

        when:
        Map resp = runGraphQLQuery(query, userId, hubPath)

        then:
        resp.statusCode == HttpStatus.SC_OK
        !resp.resp?.errors

        resp.resp.data.meritProject.projectId == GRAPHQL_TEST_PROJECT_ID
        def sites = resp.resp.data.meritProject.sites
        sites instanceof List
        sites.size() == 27
        // First site (CTMAUA4788)
        def s1 = sites[0]
        s1.siteId == "1464a447-81bb-4da0-b389-a50ee57b9d3c"
        s1.dateCreated == "2024-02-21T03:32:58Z"
        s1.lastUpdated == "2024-11-04T05:51:44Z"
        s1.name == "CTMAUA4788"
        s1.purposeCode == null
        s1.areaM2 == 0.0
        s1.geoJson.type == "Feature"
        s1.geoJson.geometry.type == "Point"
        s1.geoJson.geometry.coordinates == [149.0651491, -35.2592449]
        s1.geoJson.properties.name == "CTMAUA4788"
        s1.geoJson.properties.id == "1464a447-81bb-4da0-b389-a50ee57b9d3c"
        s1.geoJson.properties.type == "surveyArea"
        // Middle site (CTMSEH9999 - Control (null), Polygon)
        def s7 = sites[6]
        s7.siteId == "19b6d086-71d2-4eca-b99c-73b64919d5fa"
        s7.dateCreated == "2024-02-28T00:39:57Z"
        s7.lastUpdated == "2024-11-04T05:57:29Z"
        s7.name == "CTMSEH9999 - Control (null)"
        s7.purposeCode == null
        s7.areaM2 == 9978.271536165266
        s7.geoJson.type == "Feature"
        s7.geoJson.geometry.type == "Polygon"
        s7.geoJson.geometry.coordinates[0][0] == [149.0651602, -35.2592455]
        s7.geoJson.properties.name == "CTMSEH9999 - Control (null)"
        s7.geoJson.properties.id == "19b6d086-71d2-4eca-b99c-73b64919d5fa"
        s7.geoJson.properties.type == "surveyArea"
        // Last site (CTMAUA1235 - Control (100 x 100), FeatureCollection)
        def s27 = sites[26]
        s27.siteId == "3193ff15-b4f0-42b5-b3f5-f634de5dbb16"
        s27.dateCreated == "2024-05-15T06:48:25Z"
        s27.lastUpdated == "2024-11-04T06:24:55Z"
        s27.name == "CTMAUA1235 - Control (100 x 100)"
        s27.purposeCode == null
        s27.areaM2 == 19956.561344448724
        s27.geoJson.type == "FeatureCollection"
        s27.geoJson.features instanceof List
        s27.geoJson.features[0].type == "Feature"
        s27.geoJson.features[0].geometry.type == "Polygon"
        s27.geoJson.features[0].properties.name == "CTMAUA1235 - Control (100 x 100)"
        s27.geoJson.features[0].properties.externalId == "12"
        s27.geoJson.features[0].properties.description == "CTMAUA1235 - Control (100 x 100)"
        // Check all sites have required fields
        sites.each { site ->
            site.siteId != null
            site.dateCreated != null
            site.lastUpdated != null
            site.name != null
            site.geoJson != null
            site.areaM2 != null
        }
    }

    void "Report data can be returned via the Graphql API"() {
        setup:
        String userId = '1000'
        String hubPath = 'merit'
        String query = """
        {
            meritProject(projectId: \"a0f57791-e858-4f33-ae8e-7e3e3fffb447\") {
                projectId
                reports {
                  publicationStatus
                  reportId
                  category
                  name
                  fromDate
                  toDate
                  submissionDate
                  dateSubmitted
                  dateApproved
                  dateReturned
                  dateCancelled
                  activity {
                    dateCreated
                    lastUpdated
                    activityId
                    status
                    type
                    formVersion
                    description
                    progress
                    startDate
                    endDate
                    plannedStartDate
                    plannedEndDate
                  }
                  statusChangeHistory {
                    dateChanged
                    changedBy
                    status
                    comment
                  }
                }
            }
        }
        """

        when:
        Map resp = runGraphQLQuery(query, userId, hubPath)

        then:
        resp.statusCode == HttpStatus.SC_OK
        !resp.resp?.errors

        resp.resp.data.meritProject.projectId == GRAPHQL_TEST_PROJECT_ID
        def reports = resp.resp.data.meritProject.reports
        reports instanceof List
        reports.size() == 13 // One report is deleted, so not returned
        // First report: Outcomes Report 2
        def r1 = reports[0]
        r1.publicationStatus == "DRAFT"
        r1.reportId == "97fd3a79-bb35-4eaa-af00-e2edba24a7f2"
        r1.activity == null
        r1.toDate == "2026-01-01"
        r1.submissionDate == "2026-01-01"
        r1.fromDate == "2024-01-01"
        r1.dateCancelled == null
        r1.statusChangeHistory == []
        r1.dateApproved == null
        r1.name == "Outcomes Report 2"
        r1.category == "Outcomes Report 2"
        r1.dateReturned == null
        r1.dateSubmitted == null
        // Second report: Annual Progress Report 2025 - 2026
        def r2 = reports[1]
        r2.publicationStatus == "DRAFT"
        r2.reportId == "aab26622-8c16-4751-a766-20036076ae41"
        r2.activity == null
        r2.toDate == "2026-01-01"
        r2.submissionDate == "2026-01-01"
        r2.fromDate == "2025-07-01"
        r2.dateCancelled == null
        r2.statusChangeHistory == []
        r2.dateApproved == null
        r2.name == "Annual Progress Report 2025 - 2026"
        r2.category == "Annual Progress Reporting"
        r2.dateReturned == null
        r2.dateSubmitted == null
        // Third report: Annual Progress Report 2024 - 2025
        def r3 = reports[2]
        r3.publicationStatus == "DRAFT"
        r3.reportId == "d342cc4b-cb7c-4755-8d56-4277fe90ac24"
        r3.activity == null
        r3.toDate == "2025-07-01"
        r3.submissionDate == "2025-07-01"
        r3.fromDate == "2024-07-01"
        r3.dateCancelled == null
        r3.statusChangeHistory == []
        r3.dateApproved == null
        r3.name == "Annual Progress Report 2024 - 2025"
        r3.category == "Annual Progress Reporting"
        r3.dateReturned == null
        r3.dateSubmitted == null
        // Fourth report: Annual Progress Report 2023 - 2024 (cancelled, with statusChangeHistory)
        def r4 = reports[3]
        r4.publicationStatus == "CANCELLED"
        r4.reportId == "435c4d42-aed0-4daa-be2c-9c4882e4b61e"
        r4.activity == null
        r4.toDate == "2024-07-01"
        r4.submissionDate == "2024-07-01"
        r4.fromDate == "2024-01-01"
        r4.dateCancelled == "2024-06-18T01:02:30Z"
        r4.statusChangeHistory.size() == 3
        r4.statusChangeHistory[0].dateChanged == "2024-04-18T04:10:32Z"
        r4.statusChangeHistory[0].changedBy == "56501"
        r4.statusChangeHistory[0].comment == "Test"
        r4.statusChangeHistory[0].status == "cancelled"
        r4.statusChangeHistory[1].dateChanged == "2024-06-18T01:02:25Z"
        r4.statusChangeHistory[1].changedBy == "56501"
        r4.statusChangeHistory[1].comment == "TEst"
        r4.statusChangeHistory[1].status == "returned"
        r4.statusChangeHistory[2].dateChanged == "2024-06-18T01:02:30Z"
        r4.statusChangeHistory[2].changedBy == "56501"
        r4.statusChangeHistory[2].comment == "TEst"
        r4.statusChangeHistory[2].status == "cancelled"
        r4.dateApproved == null
        r4.name == "Annual Progress Report 2023 - 2024"
        r4.category == "Annual Progress Reporting"
        r4.dateReturned == "2024-06-18T01:02:25Z"
        r4.dateSubmitted == null
        // Fifth report: Year 2025/2026 - Quarter 3 Outputs Report
        def r5 = reports[4]
        r5.publicationStatus == "DRAFT"
        r5.reportId == "2cddd195-4e4b-4d80-ad57-9a4b16e95d62"
        r5.activity == null
        r5.toDate == "2026-01-01"
        r5.submissionDate == "2026-01-01"
        r5.fromDate == "2026-01-01"
        r5.dateCancelled == null
        r5.statusChangeHistory == []
        r5.dateApproved == null
        r5.name == "Year 2025/2026 - Quarter 3 Outputs Report"
        r5.category == "Outputs Reporting"
        r5.dateReturned == null
        r5.dateSubmitted == null
        // Sixth report: Year 2025/2026 - Quarter 2 Outputs Report
        def r6 = reports[5]
        r6.publicationStatus == "DRAFT"
        r6.reportId == "245f5f8a-a105-4fd4-8f77-169c641051a1"
        r6.activity == null
        r6.toDate == "2026-01-01"
        r6.submissionDate == "2025-10-01"
        r6.fromDate == "2025-10-01"
        r6.dateCancelled == null
        r6.statusChangeHistory == []
        r6.dateApproved == null
        r6.name == "Year 2025/2026 - Quarter 2 Outputs Report"
        r6.category == "Outputs Reporting"
        r6.dateReturned == null
        r6.dateSubmitted == null
        // Seventh report: Year 2025/2026 - Quarter 1 Outputs Report
        def r7 = reports[6]
        r7.publicationStatus == "DRAFT"
        r7.reportId == "d354b597-09d4-412d-bf24-71a071266e33"
        r7.activity == null
        r7.toDate == "2025-10-01"
        r7.submissionDate == "2025-07-01"
        r7.fromDate == "2025-07-01"
        r7.dateCancelled == null
        r7.statusChangeHistory == []
        r7.dateApproved == null
        r7.name == "Year 2025/2026 - Quarter 1 Outputs Report"
        r7.category == "Outputs Reporting"
        r7.dateReturned == null
        r7.dateSubmitted == null
        // Eighth report: Year 2024/2025 - Quarter 4 Outputs Report
        def r8 = reports[7]
        r8.publicationStatus == "DRAFT"
        r8.reportId == "14d38a95-4f15-4d2b-a307-3b905c876b2b"
        r8.activity == null
        r8.toDate == "2025-07-01"
        r8.submissionDate == "2025-04-01"
        r8.fromDate == "2025-04-01"
        r8.dateCancelled == null
        r8.statusChangeHistory == []
        r8.dateApproved == null
        r8.name == "Year 2024/2025 - Quarter 4 Outputs Report"
        r8.category == "Outputs Reporting"
        r8.dateReturned == null
        r8.dateSubmitted == null
        // Ninth report: Year 2024/2025 - Quarter 3 Outputs Report
        def r9 = reports[8]
        r9.publicationStatus == "DRAFT"
        r9.reportId == "7b2fc26e-9071-4a90-b2bd-78ce5a8f6642"
        r9.activity == null
        r9.toDate == "2025-04-01"
        r9.submissionDate == "2025-01-01"
        r9.fromDate == "2025-01-01"
        r9.dateCancelled == null
        r9.statusChangeHistory == []
        r9.dateApproved == null
        r9.name == "Year 2024/2025 - Quarter 3 Outputs Report"
        r9.category == "Outputs Reporting"
        r9.dateReturned == null
        r9.dateSubmitted == null
        // Tenth report: Year 2024/2025 - Quarter 2 Outputs Report
        def r10 = reports[9]
        r10.publicationStatus == "DRAFT"
        r10.reportId == "f810fd11-3403-404e-af87-8d116a100cd9"
        r10.activity == null
        r10.toDate == "2025-01-01"
        r10.submissionDate == "2024-10-01"
        r10.fromDate == "2024-10-01"
        r10.dateCancelled == null
        r10.statusChangeHistory == []
        r10.dateApproved == null
        r10.name == "Year 2024/2025 - Quarter 2 Outputs Report"
        r10.category == "Outputs Reporting"
        r10.dateReturned == null
        r10.dateSubmitted == null
        // Eleventh report: Year 2024/2025 - Quarter 1 Outputs Report
        def r11 = reports[10]
        r11.publicationStatus == "DRAFT"
        r11.reportId == "2ed7f087-5200-4f1a-bfae-d743abbd371f"
        r11.activity == null
        r11.toDate == "2024-10-01"
        r11.submissionDate == "2024-07-01"
        r11.fromDate == "2024-07-01"
        r11.dateCancelled == null
        r11.statusChangeHistory == []
        r11.dateApproved == null
        r11.name == "Year 2024/2025 - Quarter 1 Outputs Report"
        r11.category == "Outputs Reporting"
        r11.dateReturned == null
        r11.dateSubmitted == null
        // Twelfth report: Year 2023/2024 - Quarter 4 Outputs Report
        def r12 = reports[11]
        r12.publicationStatus == "DRAFT"
        r12.reportId == "8b193938-db66-41f4-a5c0-5592c03ab111"
        r12.activity == null
        r12.toDate == "2024-07-01"
        r12.submissionDate == "2024-04-01"
        r12.fromDate == "2024-04-01"
        r12.dateCancelled == null
        r12.statusChangeHistory.size() == 0
        r12.dateApproved == null
        r12.name == "Year 2023/2024 - Quarter 4 Outputs Report"
        r12.category == "Outputs Reporting"
        r12.dateReturned == null
        r12.dateSubmitted == null
    }

}

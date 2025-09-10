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
        Map query = [query: searchMERITProjectsQuery("status:[ACTIVE]")]
        String token = tokenForUser('1000')

        when:
        String url = testConfig.ecodata.baseUrl + 'graphql/merit'
        Map headers = ["Authorization": "Bearer ${token}"]
        Map resp = webService.post(url, query, null, ContentType.APPLICATION_JSON, false, false, headers)

        println resp.resp.data

        then:
        resp.statusCode == HttpStatus.SC_OK
        !resp.resp?.errors
        resp.resp.data.searchMeritProjects.totalCount == 14
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
            meriPlan.keyThreats[0].targetMeasures.find('option').collect{it.value()} == ["score_42", "score_43", "score_44"]
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
        Map query = [query: searchMERITProjectsQuery("meritProjectID:\"outcomeMeriPlanProject\"")]
        String token = tokenForUser('1000')
        String url = testConfig.ecodata.baseUrl + 'graphql/merit'
        Map headers = ["Authorization": "Bearer ${token}"]
        Map resp = webService.post(url, query, null, ContentType.APPLICATION_JSON, false, false, headers)

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

}

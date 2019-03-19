package au.org.ala.merit

import grails.converters.JSON
import spock.lang.Specification

/**
 * Tests the MERI plan is able to be read from a spreadsheet
 */
class MeriPlanMapperSpec extends Specification {

    MeriPlanMapper importer

    void setup() {
        importer = new MeriPlanMapper()
    }


//    def "An empty MERI plan can be parsed without errors"() {
//        setup:
//        InputStream meriPlanXls = getClass().getResourceAsStream("/resources/emptyMeriPlanImportTest.xlsx")
//        Map expectedResult = JSON.parse(getClass().getResource("/resources/emptyMeriPlanExpectedResult.json").text)
//
//        when:
//        Map result = importer.importMeriPlan(meriPlanXls)
//
//        then:
//        result == expectedResult
//    }

    def "A full MERI plan can be extracted from an Excel spreadsheet"() {
        setup:
        InputStream meriPlanXls = getClass().getResourceAsStream("/resources/meriPlanImportTest.xlsx")

        when:
        Map result = importer.importMeriPlan(meriPlanXls)

        then: "The primary outcomes can be extracted from the sheet"
        result.outcomes.primaryOutcome.description == 'Outcome 1: By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar Sites, through the implementation of priority actions.'
        result.outcomes.primaryOutcome.assets.size() == 1
        result.outcomes.primaryOutcome.assets[0] == 'Asset 1'

        and: "The secondary outcomes can be extracted from the sheet"

        result.outcomes.secondaryOutcomes.size() == 3
        result.outcomes.secondaryOutcomes == [
                [description:"Outcome 2: By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved.", assets:["Secondary asset 1"]],
                [description:"Outcome 3: By 2023, invasive species management has reduced threats to the natural heritage Outstanding Universal Value of World Heritage properties through the implementation of priority actions.", assets:["Secondary asset 2"]],
                [description:"Outcome 4: By 2023, the implementation of priority actions is leading to an improvement in the condition of EPBC Act listed Threatened Ecological Communities.", assets:["Secondary asset 3"]],
        ]


        and: "The short term outcomes can be extracted from the sheet"
        result.outcomes.shortTermOutcomes.size() == 2
        result.outcomes.shortTermOutcomes == [
                [description:"Short term outcome 1", assets:[]],
                [description:"Short term outcome 2", assets:[]],
        ]

        and: "The medium term outcomes can be extracted from the sheet"
        result.outcomes.midTermOutcomes.size() == 3
        result.outcomes.midTermOutcomes == [
                [description:"Medium term outcome 1", assets:[]],
                [description:"Medium term outcome 2", assets:[]],
                [description:"Medium term outcome 3", assets:[]]
        ]

        and: "The project details can be extracted from the sheet"
        result.description == 'This is the project description'

        and: "The environmental threats and interventions can be extracted from the sheet"
        result.threats.rows == [
                [threat:'Threat 1', intervention:'Intervention 1'],
                [threat:'Threat 2', intervention:'Intervention 2'],
                [threat:'Threat 3', intervention:'Intervention 3'],
                [threat:'Threat 4', intervention:'Intervention 4']
        ]

        and: "The project rationale can be extracted from the sheet"
        result.rationale == "This is the project rationale"

        and: "The project methodology can be extracted from the sheet"
        result.projectMethodology == "This is the project methodology"

        and: "The monitoring baseline can be extracted from the sheet"
        result.baseline.rows == [
                [baseline:"Baseline 1", method: "Baseline method 1"],
                [baseline:"Baseline 2", method: "Baseline method 2"],
                [baseline:"Baseline 3", method: "Baseline method 3"],
                [baseline:"Baseline 4", method: "Baseline method 4"]
        ]

        and: "The monitoring indicators can be extracted from the sheet"
        result.keq.rows == [
                [data1:"Indicator 1", data2:"Indicator approach 1"],
                [data1:"Indicator 2", data2:"Indicator approach 2"],
                [data1:"Indicator 3", data2:"Indicator approach 3"]
        ]

        and: "The project evaluation methodology can be extracted from the sheet"
        result.projectEvaluationApproach == "This is the project evaluation approach"
    }



}

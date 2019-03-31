package au.org.ala.merit

import grails.converters.JSON
import spock.lang.Specification

/**
 * Tests the MERI plan is able to be read from a spreadsheet
 */
class MeriPlanMapperSpec extends Specification {

    MeriPlanMapper mapper

    void setup() {
        // The mapper needs to be able to turn output target names and service names into score and service ids
        List services = JSON.parse(getClass().getResourceAsStream('/services.json'), 'UTF-8')
        Map service = services.find{it.id == 1}
        service.scores = [[
                scoreId:"1", label:"Number of baseline data sets collected and/or synthesised"
        ]]

        mapper = new MeriPlanMapper([services:services, outcomes:programOutcomes(), priorities:priorities()])
    }

    def "A full MERI plan can be extracted from an Excel spreadsheet"() {
        setup:
        InputStream meriPlanXls = getClass().getResourceAsStream("/resources/meriPlanImportTest.xlsx")

        when:
        Map result = mapper.importMeriPlan(meriPlanXls)

        List outcomes = programOutcomes().collect{it.outcome}
        then: "The primary outcomes can be extracted from the sheet"
        result.outcomes.primaryOutcome.description == outcomes[0]
        result.outcomes.primaryOutcome.assets.size() == 1
        result.outcomes.primaryOutcome.assets[0] == 'Another ramsar site'

        and: "The secondary outcomes can be extracted from the sheet"

        result.outcomes.secondaryOutcomes.size() == 3
        result.outcomes.secondaryOutcomes == [
                [description:outcomes[1], assets:["Leipoa ocellata (Malleefowl)"]],
                [description:outcomes[2], assets:["Secondary asset 2"]],
                [description:outcomes[3], assets:["Weeping Myall Woodlands"]],
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
        result.implementation.description == "This is the project methodology"

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

        and: "The regional and national plans data can be extracted from the sheet"
        result.priorities.rows == [
                [data1:"Document 1", data2:"Section 1", data3:"Alignment 1"],
                [data1:"Document 2", data2:"Section 2", data3:"Alignment 2"]
        ]

        and: "The project services and targets can be extracted from the sheet"
        result.serviceIds == [1]
        result.outputTargets == [[scoreId:'1', target: "100", periodTargets:[[period:"2018/2019", target: "1"], [period:"2019/2020", target: "2"], [period:"2020/2021", target: "3"], [period:"2021/2022", target: "4"], [period:"2022/2023", target: "5"]]]]

        and: "The project risks can be extracted from the sheet"
        result.risks.rows == [
                [threat:"Natural Environment", description:"Testing description", likelihood:"Unlikely", consequence:"High", riskRating:"High", currentControl:"Testing control", residualRisk:"Medium"]
        ]
    }


    def "Targets can be extracted for a service with a single score when only a numeric target is supplied"() {
        setup:
        Map service = [scores:[[label:'Number of baseline data sets collected and/or synthesised', scoreId:'1']]]

        when:
        Map result = mapper.mapTargets(service, "11")

        then:
        result.data.size() == 1
        result.data[0].target == "11"
        result.data[0].scoreId == "1"

    }

    def "Targets can be extracted for a service with a single score when a decimal target is supplied"() {
        setup:
        Map service = [scores:[[label:'Number of baseline data sets collected and/or synthesised', scoreId:'1']]]

        when:
        Map result = mapper.mapTargets(service, "11.77")

        then:
        result.data.size() == 1
        result.data[0].target == "11.77"
        result.data[0].scoreId == "1"

    }

    def "Targets can be extracted for a service with a single score when a numeric target and score are supplied"() {
        setup:
        Map service = [scores:[[label:'Number of baseline data sets collected and/or synthesised', scoreId:'1']]]

        when:
        Map result = mapper.mapTargets(service, "11 (Number of baseline data sets collected and/or synthesised)")

        then:
        result.data.size() == 1
        result.data[0].target == "11"
        result.data[0].scoreId == "1"

    }
    
    private List programOutcomes() {
        [
                [
                    outcome: "1. By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions",
                    priorities: [[category: "Ramsar"]],
                    category: "environment"
                ],
                [
                    outcome: "2. By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved.",
                    priorities: [[category: "Threatened Species"]],
                    category: "environment"
                ],
                [
                    outcome: "3. By 2023, invasive species management has reduced threats to the natural heritage Outstanding Universal Value of World Heritage properties through the implementation of priority actions.",
                    priorities: [[category: "World Heritage Sites"]],
                    category: "environment"
                ],
                [
                    outcome: "4. By 2023, the implementation of priority actions is leading to an improvement in the condition of EPBC Act listed Threatened Ecological Communities.",
                    priorities: [[category: "Threatened Ecological Communities"]],
                    category: "environment"
                ],
                [
                    outcome: "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation.",
                    priorities: [[category: "Land Management"]],
                    category: "agriculture"
                ],
                [
                    outcome: "6. By 2023, there is an increase in the capacity of agriculture systems to adapt to significant changes in climate and market demands for information on provenance and sustainable production.",
                    priorities: [[category: "Sustainable Agriculture"]],
                    category: "agriculture"
                ]
        ]
    }

    private List priorities() {
        [
                [
                    "category" : "Ramsar",
                    "priority" : "The Macquarie Marshes"
                ],
                [
                        "category" : "Ramsar",
                        "priority" : "Another ramsar site"
                ],
                [
                    "category" : "Threatened Species",
                    "priority" : "Anthochaera phrygia (Regent Honeyeater)"
                ],
                [
                    "category" : "Threatened Species",
                    "priority" : "Botaurus poiciloptilus (Australasian Bittern)"
                ],
                [
                    "category" : "Threatened Species",
                    "priority" : "Homoranthus darwinioides"
                ],
                [
                    "category" : "Threatened Species",
                    "priority" : "Lathamus discolor (Swift Parrot)"
                ],
                [
                    "category" : "Threatened Species",
                    "priority" : "Leipoa ocellata (Malleefowl)"
                ],
                [
                    "category" : "Threatened Species",
                    "priority" : "Numenius madagascariensis (Eastern Curlew, Far Eastern Curlew)"
                ],
                [
                    "category" : "Threatened Species",
                    "priority" : "Swainsona recta (Small Purple-pea, Mountain Swainson-pea, Small Purple Pea)"
                ],
                [
                    "category" : "Threatened Ecological Communities",
                    "priority" : "Coolibah - Black Box Woodlands of the Darling Riverine Plains and the Brigalow Belt South Bioregions"
                ],
                [
                    "category" : "Threatened Ecological Communities",
                    "priority" : "Grey Box (Eucalyptus microcarpa) Grassy Woodlands and Derived Native Grasslands of South-eastern Australia"
                ],
                [
                    "category" : "Threatened Ecological Communities",
                    "priority" : "Natural Temperate Grassland of the South Eastern Highlands"
                ],
                [
                    "category" : "Threatened Ecological Communities",
                    "priority" : "Natural grasslands on basalt and fine-textured alluvial plains of northern New South Wales and southern Queensland"
                ],
                [
                    "category" : "Threatened Ecological Communities",
                    "priority" : "Weeping Myall Woodlands"
                ],
                [
                    "category" : "Threatened Ecological Communities",
                    "priority" : "White Box-Yellow Box-Blakely's Red Gum Grassy Woodland and Derived Native Grassland"
                ],
                [
                    "category" : "Soil Quality",
                    "priority" : "Soil acidification"
                ],
                [
                    "category" : "Soil Quality",
                    "priority" : "Soil Carbon priority"
                ],
                [
                    "category" : "Soil Quality",
                    "priority" : "Hillslope erosion priority"
                ],
                [
                    "category" : "Soil Quality",
                    "priority" : "Wind erosion priority"
                ],
                [
                    "category" : "Land Management",
                    "priority" : "Soil acidification"
                ],
                [
                    "category" : "Land Management",
                    "priority" : "Soil carbon"
                ],
                [
                    "category" : "Land Management",
                    "priority" : "Hillslope erosion"
                ],
                [
                    "category" : "Land Management",
                    "priority" : "Wind erosion"
                ],
                [
                    "category" : "Land Management",
                    "priority" : "Native vegetation and biodiversity on-farm"
                ],
                [
                    "category" : "Sustainable Agriculture",
                    "priority" : "Climate change adaptation"
                ],
                [
                    "category" : "Sustainable Agriculture",
                    "priority" : "Market traceability"
                ]
        ]
    }

}

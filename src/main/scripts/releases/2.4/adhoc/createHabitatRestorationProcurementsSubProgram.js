load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
var userId = '129333';

//Create the parent program
let programName = "Koala Conservation and Protection Program";
var parentProgram = createOrFindProgram(programName);

let refProgram = "Regional Fund - Co-design NRMs";
var subprograms = ["Habitat Restoration Projects - NRM Procurements"]

subprograms.forEach(function (subProgram) {
    var now = ISODate();
    var newProgram = db.program.find({name: refProgram}).next();
    delete newProgram._id
    delete newProgram.programId
    newProgram.name = subProgram
    newProgram.programId = UUID.generate()
    newProgram.dateCreated = now
    newProgram.lastUpdated = now
    newProgram.status = "active"
    newProgram.parent = parentProgram._id
    var program = db.program.find({name: subProgram})
    if (!program.hasNext()) {
        db.program.insert(newProgram);
    } else {
        print("Program Already Exist: " + subProgram)
    }
});

var projectConfig = {
    config: {
        "meriPlanContents": [
            {
                "template": "programOutcome",
                "model": {
                    "maximumPriorities": "1000",
                    "helpTextHeading": "Bushfire program outcomes are listed in the secondary outcomes"
                }
            },
            {
                "template": "additionalOutcomes",
                "model": {
                    "maximumPriorities": 1000,
                    "maxAdditionalOutcomes": 15
                }
            },
            {
                "template": "assets",
                "model": {
                    "priorityCategories": [
                        "Priority Vertebrate Animals",
                        "Additional Priority Species",
                        "Priority Invertebrate Species",
                        "Priority Natural Asset",
                        "Priority Plants",
                        "Additional Priority Plants",
                        "Threatened Ecological Community",
                        "Additional Priority Natural Asset",
                        "Additional Threatened Ecological Community",
                        "Threatened Species"
                    ],
                    "assetHeading": "Asset",
                    "viewExplanation": "Species, ecological community or environmental asset(s) the project is targeting",
                    "useCategorySelection": true,
                    "explanation": "List the natural assets within the bushfire region that will benefit from this project",
                    "fromPriorities": true,
                    "assetHelpText": "Scientific and/or common name",
                    "assetCategoryHelpText": "As identified within the regional workshop reports.  Types with no assets are not selectable",
                    "placeHolder": "Please select"
                }
            },
            {
                "template": "outcomeStatements",
                "model": {
                    "subtitle": "Please provide outcome statements. Outcomes statements should: <br/>- outline the degree of impact having undertaken the actions within the project timeframe;<br/>- be expressed as a SMART statement (Specific, Measurable, Attainable, Realistic and Time-bound); and<br/>- ensure the outcomes are measurable with consideration to the monitoring methodology provided below.",
                    "placeholder": "By 30 June 2021, [Free text]",
                    "title": "Outcome statements"
                }
            },
            {
                "template": "sectionHeading",
                "model": {
                    "heading": "Project Details"
                }
            },
            {
                "template": "name",
                "model": {
                    "tableFormatting": true,
                    "placeHolder": "[150 characters]"
                }
            },
            {
                "template": "description",
                "model": {
                    "tableFormatting": true,
                    "helpTextHeading": "A succinct overview of the project: (i) what will be done and (ii) why it will be done",
                    "maxSize": "1000",
                    "placeholder": "Please provide a short description of this project. This project description will be visible on the project overview page in MERIT [Free text; limit response to 1000 characters (approx. 150 words)]"
                }
            },
            {
                "template": "projectPartnerships",
                "model": {
                    "namePlaceHolder": "[Free text]",
                    "helpTextPartnerNature": "If partnership with an organisation: provide the name of the organisation and the role they will play/how you will support them. If partnering with community groups or members of the public: indicate each group or individual you will engage with",
                    "partnershipPlaceHolder": "[Free text]"
                }
            },
            {
                "template": "keyThreats",
                "model": {
                    "interventionHelpText": "Describe the proposed interventions to address the threat and how this will deliver on the project outcome"
                }
            },
            {
                "template": "projectMethodology",
                "model": {
                    "maxSize": "4000",
                    "title": "Project methodology",
                    "tableHeading": "Please describe the methodology that will be used to achieve the project's outcome statements. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification)",
                    "placeHolder": "[Free text; limit response to 4000 characters (approx. 650 words)]"
                }
            },
            {
                "template": "monitoringBaseline",
                "model": {
                    "baselineMethodHelpText": "Describe the project baseline (s) units of measure or data which will be used to report progress towards this project’s outcome and the monitoring design",
                    "titleHelpText": "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project’s outcomes and the monitoring design. Refer to the Regional Land Partnerships Evaluation Plan which provides guidance on baselines and the monitoring indicators for each outcome. Note, other monitoring indicators can also be used."
                }
            },
            {
                "template": "monitoringIndicators",
                "model": {
                    "approachHeading": "Describe the project monitoring indicator(s) approach",
                    "indicatorHeading": "Project monitoring indicators",
                    "indicatorHelpText": "List the measurable indicators of project success that will be monitored. Indicators should link back to the outcome statements and have units of measure. Indicators should measure both project outputs (e.g. area (ha) of rabbit control, length (km) of predator proof fencing) and change the project is aiming to achieve (e.g. Change in abundance of X threatened species at Y location, Change in vegetation cover (%), etc).",
                    "approachHelpText": "How will the indicator be monitored? Briefly describe the method to be used to monitor the indicator (including timing of monitoring, who will collect/collate / analyse data, etc)",
                    "indicatorPlaceHolder": "[Free text]",
                    "approachPlaceHolder": "[Free text]"
                }
            },
            {
                "template": "projectReview"
            },
            {
                "template": "nationalAndRegionalPlans"
            },
            {
                "template": "serviceTargets",
                "model": {
                    "title": "Services and Targets Table",
                    "serviceName": "Service"
                }
            }
        ],
        "excludes": [],
        "visibility": "public",
        "organisationRelationship": "Service Provider",
        "excludeFinancialYearData": true,
        "requiresActivityLocking": true,
        "projectTemplate": "rlp",
        "activityPeriodDescriptor": "Outputs report #",
        "meriPlanTemplate": "configurableMeriPlan",
        "riskAndThreatTypes": [
            "Performance",
            "Work Health and Safety",
            "People resources",
            "Financial",
            "External stakeholders",
            "Natural Environment"
        ],
        "projectReports": [
            {
                "reportType": "Activity",
                "firstReportingPeriodEnd": "2022-09-30T14:00:00Z",
                "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportingPeriodInMonths": 3,
                "description": "",
                "label": "Quarter",
                "category": "Outputs Reporting",
                "activityType": "RLP Output Report",
                "canSubmitDuringReportingPeriod": true
            },
            {
                "firstReportingPeriodEnd": "2022-06-30T14:00:00Z",
                "reportType": "Administrative",
                "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
                "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
                "reportingPeriodInMonths": 12,
                "description": "",
                "label": "Annual",
                "category": "Annual Progress Reporting",
                "activityType": "RLP Annual Report"
            },
            {
                "reportType": "Single",
                "firstReportingPeriodEnd": "2025-06-30T14:00:00Z",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 36,
                "multiple": false,
                "description": "Before beginning Outcomes Report 1, please go to the Data set summary tab and complete a form for each data set collected for this project. Help with completing this form can be found in Section 10 of the [RLP MERIT User Guide](http://www.nrm.gov.au/my-project/monitoring-and-reporting-plan/merit)",
                "label": "Outcomes Report 1",
                "category": "Outcomes Report 1",
                "reportsAlignedToCalendar": false,
                "activityType": "RLP Short term project outcomes"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 2 for %4$s",
                "reportNameFormat": "Outcomes Report 2",
                "reportingPeriodInMonths": 60,
                "multiple": false,
                "description": "_Please note that the reporting fields for these reports are currently being developed_",
                "minimumPeriodInMonths": 36,
                "label": "Outcomes Report 2",
                "category": "Outcomes Report 2",
                "reportsAlignedToCalendar": false,
                "activityType": "RLP Medium term project outcomes"
            }
        ],
        "navigationMode": "returnToProject",
        "objectives": [
            "Prevent extinction and limit decline of native species",
            "Reduce immediate suffering of native animals directly impacted by the fires",
            "Maximise chances of long-term recovery of native species and communities",
            "Ensure learning and continual improvement is core of the response"
        ],
        "supportedServiceIds": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
            33,
            34,
            35,
            36
        ]
    },
    priorities: [
        {
            "category": "Habitat Restoration Threatened Species",
            "priority": "Phascolarctos cinereus (Koala)"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Alpine Sphagnum Bogs and Associated Fens"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Natural Temperate Grassland of the South Eastern Highlands"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "White Box-Yellow Box-Blakely's Red Gum Grassy Woodland and Derived Native Grassland"
        },
        {
            "category": "Habitat Restoration Grants Secondary",
            "priority": "Additional Koala habitat planted"
        },
        {
            "category": "Habitat Restoration Grants Secondary",
            "priority": "Connection of existing Koala habitat established or strengthen"
        },
        {
            "category": "Habitat Restoration Grants Secondary",
            "priority": "Quality of existing Koala habitat improved by controlling pests and weeds"
        },
    ]
};
var outcomes = [
    {
        "priorities": [
            {
                "category": "Habitat Restoration Threatened Species"
            }
        ],
        "targeted": true,
        "supportsMultiplePrioritiesAsPrimary": false,
        "shortDescription": "Threatened Species Strategy",
        "type": "primary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "2. By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
    },
    {
        "priorities": [
            {
                "category": "Threatened Ecological Communities"
            }
        ],
        "targeted": true,
        "supportsMultiplePrioritiesAsPrimary": true,
        "shortDescription": "Threatened Ecological Communities",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "4. By 2023, the implementation of priority actions is leading to an improvement in the condition of EPBC Act listed Threatened Ecological Communities."
    },
    {
        "priorities": [
            {
                "category": "Habitat Restoration Grants Secondary"
            }
        ],
        "targeted": true,
        "shortDescription": "Asset Types as listed for Habitat Restoration Projects - NRM Procurements",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome":"Improve the extent, quality and connectivity of the nationally listed Koala’s habitat and reduced local threats."
    },
    {
        "priorities": [
            {
                "category": "Habitat Restoration Grants Secondary"
            }
        ],
        "targeted": true,
        "shortDescription": "Asset Types as listed for Habitat Restoration Projects - NRM Procurements",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome":"Improve data and knowledge of Koala populations and health across their range to support effective decision making and conservation action."
    },
    {
        "priorities": [
            {
                "category": "Habitat Restoration Grants Secondary"
            }
        ],
        "targeted": true,
        "shortDescription": "Asset Types as listed for Habitat Restoration Projects - NRM Procurements",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome":"Strengthen coordination of recovery efforts for the Koala and cross-sector engagement, collaboration and capability."
    }
]


subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        if (p.name === "Habitat Restoration Projects - NRM Procurements"){
            p.config = projectConfig.config
            p.priorities = projectConfig.priorities
            p.outcomes = outcomes;
        }
        db.program.save(p);
    }
});
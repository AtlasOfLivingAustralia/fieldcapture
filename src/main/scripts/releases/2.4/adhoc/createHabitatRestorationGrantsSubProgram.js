load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
var userId = '129333';

//Create the parent program
let programName = "Koala Conservation and Protection Program";
var parentProgram = createOrFindProgram(programName);

let refProgram = "Regional Fund - Co-design NRMs";
var subprograms = ["Habitat Restoration Projects - Grants"]

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
                "firstReportingPeriodEnd": "2022-12-31T13:00:00Z",
                "reportDescriptionFormat": "Progress Report %1d",
                "reportNameFormat": "Progress Report %1d",
                "reportingPeriodInMonths": 6,
                "description": "",
                "minimumReportDurationInDays": 3,
                "label": "Semester",
                "category": "Progress Reports",
                "activityType": "Koala Conservation Progress Report",
                "reportsAlignedToCalendar": true,
                "canSubmitDuringReportingPeriod": true
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Final Report",
                "reportNameFormat": "Final Report",
                "reportingPeriodInMonths": 0,
                "multiple": false,
                "description": "",
                "alignToOwnerEnd": true,
                "label": "Final Report",
                "category": "Final Report",
                "reportsAlignedToCalendar": false,
                "activityType": "Koala Conservation Final Report",
                "alignToOwnerStart": true
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
            "category": "Habitat Restoration Grants",
            "priority": "Phascolarctos cinereus (Koala)"
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
        }
    ]
};
var outcomes = [
    {
        "priorities": [
            {
                "category": "Habitat Restoration Threatened Species Primary"
            }
        ],
        "targeted": true,
        "supportsMultiplePrioritiesAsPrimary": false,
        "shortDescription": "Threatened Species Strategy",
        "type": "primary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "By 2026 the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
    },
    {
        "priorities": [
            {
                "category": "Habitat Restoration Threatened Species"
            }
        ],
        "targeted": true,
        "supportsMultiplePrioritiesAsPrimary": false,
        "shortDescription": "Threatened Species Strategy",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "By 2026, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
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
        "outcome": "By 2026, the implementation of priority actions is leading to an improvement in the condition of EPBC Act listed Threatened Ecological Communities."
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
        "outcome": "Improve the extent, quality and connectivity of the nationally listed Koala’s habitat and reduced local threats."
    }
]


subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        if (p.name === "Habitat Restoration Projects - Grants"){
            p.config = projectConfig.config
            p.priorities = projectConfig.priorities
            p.outcomes = outcomes;
        }
        db.program.save(p);
    }
});

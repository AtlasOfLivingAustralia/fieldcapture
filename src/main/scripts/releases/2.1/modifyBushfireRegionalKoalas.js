// Creating a new subprogram for Program:  Bushfire Recovery for Species and Landscapes Program
// New Subprogram:  Regional Fund - Co-design Koalas

load("uuid.js");
load('../../utils/audit.js');
var userId = '129333';
let parentProgram = "Bushfire Recovery for Species and Landscapes Program";
var subprograms = ["Regional Fund - Co-design Koalas"]

var parent = db.program.find({name: parentProgram}).next();
print(parent.programId)
subprograms.forEach(function (subProgram){
    var now = ISODate();
    var p = {name: subProgram, programId: UUID.generate(), dateCreated: now, lastUpdate: now, parent: parent._id, status: "active"}
    var program = db.program.find({name: subProgram})
    if (!program.hasNext()) {
        db.program.insert(p);
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
                        "Additional Threatened Ecological Community"
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
                "firstReportingPeriodEnd": "2018-09-30T14:00:00Z",
                "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportingPeriodInMonths": 3,
                "description": "",
                "category": "Outputs Reporting",
                "activityType": "RLP Output Report",
                "canSubmitDuringReportingPeriod": true
            },
            {
                "firstReportingPeriodEnd": "2019-06-30T14:00:00Z",
                "reportType": "Administrative",
                "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
                "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
                "reportingPeriodInMonths": 12,
                "description": "",
                "category": "Annual Progress Reporting",
                "activityType": "RLP Annual Report"
            },
            {
                "reportType": "Single",
                "firstReportingPeriodEnd": "2023-06-30T14:00:00Z",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 36,
                "multiple": false,
                "description": "Before beginning Outcomes Report 1, please go to the Data set summary tab and complete a form for each data set collected for this project. Help with completing this form can be found in Section 10 of the [RLP MERIT User Guide](http://www.nrm.gov.au/my-project/monitoring-and-reporting-plan/merit)",
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
    ]
};
var outcomes = [
    {
        "priorities": [
            {
                "category": "Ramsar"
            }
        ],
        "targeted": true,
        "shortDescription": "Ramsar Sites",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "1. By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
    },
    {
        "priorities": [
            {
                "category": "Threatened Species"
            }
        ],
        "targeted": true,
        "supportsMultiplePrioritiesAsPrimary": true,
        "shortDescription": "Threatened Species Strategy",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "2. By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
    },
    {
        "priorities": [
            {
                "category": "World Heritage Sites"
            }
        ],
        "targeted": true,
        "shortDescription": "World Heritage Areas",
        "supportsMultiplePrioritiesAsPrimary": true,
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "3. By 2023, invasive species management has reduced threats to the natural heritage Outstanding Universal Value of World Heritage properties through the implementation of priority actions."
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
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "4. By 2023, the implementation of priority actions is leading to an improvement in the condition of EPBC Act listed Threatened Ecological Communities."
    },
    {
        "priorities": [
            {
                "category": "Land Management"
            }
        ],
        "targeted": true,
        "shortDescription": "Soil Condition",
        "type": "secondary",
        "category": "agriculture",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
    },
    {
        "priorities": [
            {
                "category": "Sustainable Agriculture"
            }
        ],
        "shortDescription": "Climate / Weather Adaption",
        "type": "secondary",
        "category": "agriculture",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "6. By 2023, there is an increase in the capacity of agriculture systems to adapt to significant changes in climate and market demands for information on provenance and sustainable production."
    },
    {
        "priorities": [
            {
                "category": "Bushfires"
            }
        ],
        "shortDescription": "Bushfire Recovery",
        "type": "secondary",
        "category": "bushfires",
        "outcome": "Enhance the recovery and maximise the resilience of fire affected priority species, ecological communities and other natural assets within the seven regions impacted by the 2019-20 bushfires",
        "supportsMultiplePrioritiesAsSecondary": true
    }
]


subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        if (p.name === "Regional Fund - Co-design Koalas"){
            p.config = projectConfig.config
            p.priorities = projectConfig.priorities
            p.outcomes = outcomes;
        }
        db.program.save(p);
    }
});


// Moving 4 Koala projects to "Regional Fund - Co-design Koalas"
var newRegionalSubprogram = "Regional Fund - Co-design Koalas"
var newSubProg = db.program.find({name: newRegionalSubprogram}).next();
if (!newSubProg) {
    print("Sub-Program is not existing: " + newSubProg)
} else {
    //move projects
    var regionalProjects = ["Koala Recovery in the Hunter","Cool Country Koalas","Enhancing Koala Habitat, South East NSW","SEQ Koala Habitat Restoration and Landscape Resilience Improvement Project"]
    regionalProjects.forEach(function (regionalProject){
        var now = ISODate();
        var proj = db.project.find({name: regionalProject});
        if(proj.hasNext()){
            var p = proj.next();
            p.lastUpdated = now
            p.programId = newSubProg.programId
            db.project.save(p);
            audit(p, p.projectId, 'au.org.ala.ecodata.Project', userId);
        }else{
            print("Project is not existing - " + regionalProject)
        }
    });
}

//Renaming the sub-program's names:
var currProgram1 = "Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - NRM"
var cp1 = db.program.find({name: currProgram1});
if(cp1.hasNext()){
    var p = cp1.next();
    delete p.name
    p.name = "Regional Fund - Co-design NRMs";
    p.lastUpdated = ISODate();
    db.program.save(p);
}else{
    print("Sub-program name already updated - " + currProgram1)
}

var currProgram2 = "Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - States"
var cp2 = db.program.find({name: currProgram2});
if(cp2.hasNext()){
    var p = cp2.next();
    delete p.name
    p.name = "Regional Fund - Co-design States";
    p.lastUpdated = ISODate();
    db.program.save(p);
}else{
    print("Sub-program name already updated - " + currProgram2)
}


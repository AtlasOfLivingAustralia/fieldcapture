print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: " + pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');
load('../data/settingDefaults.js');

var config = {
    optionalProjectContent: ["Risks and Threats", "MERI Plan"]
};
createProgram({programId: 'original', config: config});

var config = {
    projectTemplate: 'rlp'
};
createProgram({programId: 'rlp', config: config});

var config = {
    projectTemplate: "rlp",
    meriPlanTemplate: "configurableMeriPlan",
    meriPlanContents: [
        {
            "template": "objectivesList"
        },
        {
            "template": "monitoringIndicators"
        },
        {
            "template": "projectImplementation"
        },
        {
            "template": "projectPartnerships"
        },
        {
            "template": "keq"
        },
        {
            "template": "meriBudget",
            "model": {
                "showThemeColumn":true
            }
        }
    ],
    objectives: [
        "objective 1",
        "objective 2",
        "objective 3"
    ]
};
createProgram({
    programId: "configurable_meri_plan",
    name: "Configurable MERI Plan Program",
    description: "",
    config: config
});

createMu({});

db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Program',
    entityId: 'test_program',
    userId: '1',
    accessLevel: 'admin'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.ManagementUnit',
    entityId: 'test_mu',
    userId: '1',
    accessLevel: 'admin'
});

createProject({projectId: "p1", name: "Original project", programId: "original"});
db.userPermission.insert({entityType: 'au.org.ala.ecodata.Project', entityId: "p1", userId: '1', accessLevel: 'admin'});

createProject({projectId: "p2", name: "RLP project", programId: "rlp"});
db.userPermission.insert({entityType: 'au.org.ala.ecodata.Project', entityId: "p2", userId: '1', accessLevel: 'admin'});

createProject({projectId: "p3", name: "Configurable MERI project", programId: "configurable_meri_plan"});
db.userPermission.insert({entityType: 'au.org.ala.ecodata.Project', entityId: "p3", userId: '1', accessLevel: 'admin'});

config = {
    projectTemplate: "rlp",
    meriPlanTemplate: "configurableMeriPlan",
    meriPlanContents: [
        {
            "template": "assets",
            "model": {
                "placeHolder": "[Free text; for species please enter common and scientific name; one asset per line]"
            }
        },
        {
            "template": "objectivesList",
            "model": {
                "title": "Project Objectives",
                "explanation": "Please select from the drop down options which of the following Expert Panel objectives are applicable to this project",
                "includeOther": true
            }
        },
        {
            "template": "outcomeStatements",
            "model": {
                "title": "Short term outcome statements",
                "placeholder": "By 30 June 2021, [Free text]",
                "subtitle": "Please provide short term outcome statements. Short term outcomes statements should: <br/>" +
                    "- contribute to the project's Expert Panel objectives; <br/>" +
                    "- outline the degree of impact having undertaken the actions within the project timeframe;<br/>" +
                    "- be expressed as a SMART statement (Specific, Measurable, Attainable, Realistic and Time-bound); and<br/>" +
                    "- ensure the outcomes are measurable with consideration to the monitoring methodology provided below."
            }
        },
        {
            "template": "description",
            "model": {
                "explanation": " Please provide a short description of this project. This project description will be visible on the project overview page in MERIT",
                "placeholder": "[Free text; limit response to 1000 characters (approx. 150 words)]",
                "maxSize": "1000"
            }
        },
        {
            "template": "projectMethodology",
            "model": {
                "title": "Project methodology",
                "tableHeading": "Please describe the methodology that will be used to achieve the project's short term outcome statements. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification)",
                "placeHolder": "[Free text; limit response to 4000 characters (approx. 650 words)]",
                "maxSize": "4000"
            }
        },
        {
            "template": "monitoringIndicators",
            "model": {
                "title": "Monitoring Methodology",
                "indicatorHeading": "Identify the project monitoring indicator(s)",
                "indicatorHelpText": "",
                "approachHeading": "Describe the project monitoring indicator(s) approach",
                "approachHelpText": "",
                "indicatorPlaceHolder": "[Free text]",
                "approachPlaceHolder": "[Free text]"
            }
        },
        {
            "template": "adaptiveManagement",
            "model": {
                "title": "Project Monitoring Indicators",
                "explanation": "Outline the methods and processes that will enable adaptive management during the lifetime of this project"
            }
        },
        {
            "template": "projectPartnerships",
            "model": {
                "namePlaceHolder": "[Free text]",
                "partnershipPlaceHolder": "[Free text]"
            }
        },
        {
            "template": "activities",
            "model": {
                "title": "Priority actions",
                "explanation": "Please select from the options which of the Expert Panel priority actions this project",
                "includeOther": true,
                "noneSelectedMessage": "No priority actions have been nominated for this project"
            }
        }
    ],
    "objectives": [
        "objective 1",
        "objective 2",
        "objective 3"
    ],
    "activities": [
        {
            "name": "activity 1",
            "output": "Output 1"
        },
        {
            "name":"activity 2",
            "output": "Output 2"
        }
    ],
    projectReports:[
        {
            "reportType": "Activity",
            "firstReportingPeriodEnd": "2018-09-30T14:00:00Z",
            "reportDescriptionFormat": "Year %5$s - %6$s %7$d Progress Report",
            "reportNameFormat": "Year %5$s - %6$s %7$d Progress Report",
            "reportingPeriodInMonths": 6,
            "description": "",
            "category": "Progress Reporting",
            "activityType": "Progress Report",
            "canSubmitDuringReportingPeriod": true
        },
    ]
};
createProgram({programId: "state_intervention", name: "State Intervention", description: "", config: config});

createProject({projectId: "meri2", name: "State intervention project", programId: "state_intervention", managementUnitId:null});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "meri2",
    userId: '1',
    accessLevel: 'admin'
});


config.excludes = ["DASHBOARD", "SITES", "MERI_PLAN", "RISKS_AND_THREATS", "DOCUMENTS"];
createProgram({programId: "excluded_content", name: "Excluded content program", description: "", config: config});
createProject({projectId: "excludedContent", name: "Excluded content project", programId: "excluded_content"});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "meri2",
    userId: '1',
    accessLevel: 'admin'
});

loadActivityForms();

config.excludeFinancialYearData = true;
config.excludes = [];
config.meriPlanContents = [
    {
        "template": "assets",
        "model": {
            "placeHolder": "[Free text; for species please enter common and scientific name; one asset per line]"
        }
    },
    {
        "template": "outcomeStatements",
        "model": {
            "subtitle": "Please provide short term outcome statements. Short term outcomes statements should: <br/>- outline the degree of impact having undertaken the actions within the project timeframe;<br/>- be expressed as a SMART statement (Specific, Measurable, Attainable, Realistic and Time-bound); and<br/>- ensure the outcomes are measurable with consideration to the monitoring methodology provided below.",
            "placeholder": "By 30 June 2021, [Free text]",
            "title": "Short term outcome statements"
        }
    },
    {
        "template": "description",
        "model": {
            "maxSize": "1000",
            "placeholder": "[Free text; limit response to 1000 characters (approx. 150 words)]",
            "explanation": " Please provide a short description of this project. This project description will be visible on the project overview page in MERIT"
        }
    },
    {
        "template": "projectMethodology",
        "model": {
            "maxSize": "4000",
            "title": "Project methodology",
            "tableHeading": "Please describe the methodology that will be used to achieve the project's short term outcome statements. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification)",
            "placeHolder": "[Free text; limit response to 4000 characters (approx. 650 words)]"
        }
    },
    {
        "template": "monitoringIndicators",
        "model": {
            "approachHeading": "Describe the project monitoring indicator(s) approach",
            "indicatorHeading": "Identify the project monitoring indicator(s)",
            "indicatorHelpText": "",
            "approachHelpText": "",
            "indicatorPlaceHolder": "[Free text]",
            "approachPlaceHolder": "[Free text]",
            "title": "Project Monitoring Indicators"
        }
    },
    {
        "template": "adaptiveManagement",
        "model": {
            "title": "Project Review, Evaluation and Improvement Methodology and Approach",
            "explanation": "Outline the methods and processes that will enable adaptive management during the lifetime of this project"
        }
    },
    {
        "template": "projectPartnerships",
        "model": {
            "namePlaceHolder": "[Free text]",
            "partnershipPlaceHolder": "[Free text]"
        }
    },
    {
        "template": "consultation",
        "model": {
            "title":"Consultation",
            "placeHolder": "[Free text]",
            "explanation": "Please provide details of consultation with relevant state / territory agencies and NRM organisations to identify any duplication between activities proposed in the Activity and any other government-funded actions already underway in the project location. Where duplication has been identified, please describe how this has been resolved. If a modification to the Activity is required, you must submit a written request for a variation to the Department."
        }
    },
    {
        "template": "serviceTargets",
        "model": {
            "title":"Activities and minimum targets",
            "serviceName": "Activity"
        }
    },
    {
        "template": "meriBudget",
        "model": {
            "title":"Activities and minimum targets",
            "serviceName": "Activity",
            "showActivityColumn": true,
            "itemName": "Budget item"
        }
    }
];

createProgram({programId: "grants", name: "Competitive Grants", description: "", config: config});

createProject({projectId: "grants1", name: "Excluded content project", programId: "grants"});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "grants1",
    userId: '1',
    accessLevel: 'admin'
});



addSetting('meritfielddata.risks.lastCheckTime', '2020-07-01T00:00:00Z');
addSetting('meritfielddata.risk_changes.emailSubject', 'Risks and threats changed subject');
addSetting('meritfielddata.risk_changes.emailBody', 'Risks and threats changed body');

config.meriPlanContents =  [
    {
        "template": "programOutcome"
    },
    {
        "template": "additionalOutcomes"
    },
    {
        "template": "outcomeStatements",
        "model": {
            "subtitle": "Short-term outcome statement/s",
            "title": "Project outcomes"
        }
    },
    {
        "template": "mediumTermOutcomes"
    },
    {
        "template": "name",
        "model": {
            "placeHolder": "[150 characters]"
        }
    },
    {
        "template": "description"
    },
    {
        "template": "keyThreats"
    },
    {
        "template": "rationale"
    },
    {
        "template": "projectMethodology",
        "model": {
            "maxSize": "4000",
            "title": "Project methodology",
            "tableHeading": "Please describe the methodology that will be used to achieve the project's short term outcome statements. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification)",
            "placeHolder": "[Free text; limit response to 4000 characters (approx. 650 words)]"
        }
    },
    {
        "template": "communityEngagement",
        "model": {
            "maxSize": "4000",
            "title": "Community engagement",
            "placeHolder": "[Free text; limit response to 4000 characters (approx. 650 words)]"
        }
    },
    {
        "template": "monitoringBaseline"
    },
    {
        "template": "monitoringIndicators",
        "model": {
            "approachHeading": "Describe the project monitoring indicator(s) approach",
            "indicatorHeading": "Identify the project monitoring indicator(s)",
            "indicatorHelpText": "List the measurable indicators of project success that will be monitored. Indicators should link back to the outcome statements and have units of measure. Indicators should measure both project outputs (e.g. area (ha) of rabbit control, length (km) of predator proof fencing) and change the project is aiming to achieve (e.g. Change in abundance of X threatened species at Y location, Change in vegetation cover (%), etc).",
            "approachHelpText": "How will the indicator be monitored? Briefly describe the method to be used to monitor the indicator (including timing of monitoring, who will collect/collate / analyse data, etc)",
            "indicatorPlaceHolder": "[Free text]",
            "approachPlaceHolder": "[Free text]",
            "title": "Project Monitoring Indicators"
        }
    },
    {
        "template": "projectReview"
    },
    {
        "template": "nationalAndRegionalPlans"
    },
    {
        "template": "serviceTargets"
    }
];

createProgram({programId: "fhr", name: "FHR", description: "", config: config});

createProject({projectId: "fhr1", name: "FHR project", programId: "fhr"});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "fhr1",
    userId: '1',
    accessLevel: 'admin'
});

config.meriPlanContents =  [
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
            "autoSelectCategory": true,
            "explanation": "List the natural assets within the bushfire region that will benefit from this project",
            "fromPriorities": true,
            "placeHolder": "Please select"
        }
    },
    {
        "template": "activities",
        "model": {
            "noneSelectedMessage": "No priority actions have been nominated for this project",
            "singleSelection": true,
            "title": "Priority actions",
            "explanation": "Please select from the drop-down options which of the following regional investment strategy objectives are applicable to this project"
        }
    },
    {
        "template": "outcomeStatements",
        "model": {
            "subtitle": "Please provide outcome statements. Outcomes statements should: <br/>- Contribute to the regional investment strategy;<br/>- Outline the degree of impact having undertaken the actions within the project timeframe;<br/>- Be expressed as a SMART statement (Specific, Measurable, Attainable, Realistic and Time-bound); and<br/>- Ensure the outcomes are measurable with consideration to the monitoring methodology provided below.",
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
        "template": "description",
        "model": {
            "maxSize": "1000",
            "placeholder": "[Free text; limit response to 1000 characters (approx. 150 words)]",
            "explanation": " Please provide a short description of this project. The project description should be succinct and state what will be done and why it will be done. This project description will be visible on the project overview page in MERIT"
        }
    },
    {
        "template": "relatedProjects",
        "model": {
            "maxSize": "1000",
            "placeholder": "[Free text; limit response to 1000 characters (approx. 150 words)]"
        }
    },
    {
        "template": "projectPartnerships",
        "model": {
            "namePlaceHolder": "[Free text]",
            "partnershipPlaceHolder": "[Free text]"
        }
    },
    {
        "template": "consultation",
        "model": {
            "title": "Consultation",
            "explanation": "Please provide details of consultation with relevant state / territory agencies and NRM organisations to identify any duplication between activities proposed in the Activity and any other government-funded actions already underway in the project location. Where duplication has been identified, please describe how this has been resolved. If a modification to the Activity is required, you must submit a written request for a variation to the Department.",
            "placeHolder": "[Free text]"
        }
    },
    {
        "template": "keyThreats"
    },
    {
        "template": "projectMethodology",
        "model": {
            "maxSize": "4000",
            "title": "Project methodology",
            "tableHeading": "Please describe the methodology that will be used to achieve the project’s outcome statements.",
            "placeHolder": "[Free text; limit response to 4000 characters (approx. 650 words)]"
        }
    },
    {
        "template": "monitoringIndicators",
        "model": {
            "approachHeading": "Describe the project monitoring indicator(s) approach",
            "indicatorHeading": "Identify the project monitoring indicator(s)",
            "indicatorHelpText": "List the measurable indicators of project success that will be monitored. Indicators should link back to the outcome statements and have units of measure. Indicators should measure both project outputs (e.g. area (ha) of rabbit control, length (km) of predator proof fencing) and change the project is aiming to achieve (e.g. Change in abundance of X threatened species at Y location, Change in vegetation cover (%), etc).",
            "approachHelpText": "How will the indicator be monitored? Briefly describe the method to be used to monitor the indicator (including timing of monitoring, who will collect/collate / analyse data, etc)",
            "indicatorPlaceHolder": "[Free text]",
            "approachPlaceHolder": "[Free text]",
            "title": "Project Monitoring Indicators"
        }
    },
    {
        "template": "adaptiveManagement",
        "model": {
            "title": "Project Review, Evaluation and Improvement Methodology and Approach",
            "explanation": "Outline the methods and processes that will enable adaptive management during the lifetime of this project"
        }
    },
    {
        "template": "nationalAndRegionalPlans"
    },
    {
        "template": "serviceTargets",
        "model": {
            "title": "Services and Targets Table",
            "serviceName": "Service",
            "showTargetDate": true
        }
    },
    {
        "template": "meriBudget",
        "model": {
            "itemName": "Budget item",
            "showActivityColumn": false
        }
    }
];
var priorities = [
    {
        "category": "Priority Natural Asset",
        "priority": "Gondwana Rainforests of Australia World Heritage Area"
    },
    {
        "category": "Additional Priority Natural Asset",
        "priority": "Great Sandy National Park"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Lowland Rainforest of Subtropical Australia"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Pseudomugil mellis (Honey Blue-eye)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Pezoporus wallicus (ground parrot)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Euastacus jagara (Freshwater crayfish)"
    },
    {
        "category": "Priority Plants",
        "priority": "Bertya ernestiana (Mt Barney bertya-shrub)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Pseudanthus pauciflorus subsp. pauciflorus"
    },
    {
        "category": "Threatened Species",
        "priority": "Numenius madagascariensis (Eastern Curlew, Far Eastern Curlew)"
    },
    {
        "category": "Land Management",
        "priority": "Soil acidification"
    }
];
createProgram({programId: "bushfireProgram", name: "New Bushfire Program", description: "", config: config});
db.managementUnit.insert({managementUnitId: "bushfireManagement", name: "New Bushfire Management", config:{}, priorities: priorities, status: "active"});
createProject({projectId: "bushfireProject", name: "New Bushfire Project", description: "", programId: "bushfireProgram", managementUnitId: "bushfireManagement"})
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "bushfireProject",
    userId: '1',
    accessLevel: 'admin'
});


config.meriPlanContents = [
    {
    "template": "programOutcome",
    "model": {
        "maximumPriorities": "1000"
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
            "maxSize": "1000",
            "placeholder": "Please provide a short description of this project. This project description will be visible on the project overview page in MERIT [Free text; limit response to 1000 characters (approx. 150 words)]"
        }
    },
    {
        "template": "projectPartnerships",
        "model": {
            "namePlaceHolder": "[Free text]",
            "partnershipPlaceHolder": "[Free text]"
        }
    },
    {
        "template": "keyThreats"
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
        "template": "monitoringBaseline"
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
    ];
var outcomes = [
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
db.managementUnit.insert({managementUnitId: "bushfireManagement1", name: "New Bushfire Management1", config:{}, priorities: priorities, status: "active"});
createProgram({programId: "bushfireProgramNRM", name: "New Bushfire program NRM", description: "", config:config, outcomes: outcomes});
createProject({projectId: "bushfireProjectNRM", name: "New Bushfire Project NRM", programId: "bushfireProgramNRM", managementUnitId: "bushfireManagement1"});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "bushfireProjectNRM",
    userId: '1',
    accessLevel: 'admin'
});

// Future Drought Fund
config.meriPlanContents =[
    {
        "template": "programOutcome",
        "model": {
            "maximumPriorities": "1000",
            "priorityHelpText": "Enter the primary investment priority/ies for the primary outcome. <br/>For outcomes 1-4, only one primary investment priority can be selected.<br/>For outcomes 5-6, select one or a maximum of two primary investment priorities"
        }
    },
    {
        "template": "otherOutcomes",
        "model": {
            "titleTableHeadingOne": "FDF Outcomes (Select at least 1)",
            "minimumCheckTableOne": "1",
            "otherOutcomeCategoryTableTwo": "nrm",
            "otherOutcomeCategoryTableOne": "fdf"
        }
    },
    {
        "template": "outcomeStatements",
        "model": {
            "helpText": "Short term outcomes statements should: <br/><ul> <li>Contribute to the 5-year Outcome (e.g. what degree of impact are you expecting from the Project's interventions )</li> <li>Outline the degree of impact having undertaken the Services for  up to 3 years, for example 'area of relevant vegetation type has increased'.</li><li>Be expressed as a SMART statement. SMART stands for Specific, Measurable, Attainable, Realistic, and Time-bound. Ensure the outcomes are measurable with consideration to the baseline and proposed monitoring regime.</li></ul><b>Please Note: </b> for Project three years or less in duration, a short-term Project outcome achievable at the Project's completion must be set.",
            "subtitle": "Short-terms outcome statement/s",
            "title": "Project Outcomes"
        }
    },
    {
        "template": "mediumTermOutcomes"
    },
    {
        "template": "sectionHeading",
        "model": {
            "heading": "Project Details"
        }
    },
    {
        "template": "description",
        "model": {
            "tableFormatting": true,
            "maxSize": "1000",
            "placeholder": "Please provide a short description of this project. This project description will be visible on the project overview page in MERIT [Free text; limit response to 1000 characters (approx. 150 words)]"
        }
    },
    {
        "template": "sectionHeading",
        "model": {
            "heading": "Agriculture projects only"
        }
    },
    {
        "template": "rationale",
        "model": {
            "tableFormatting": true,
            "rationaleHelpText": "Provide a rationale of why the targeted investment priorities are being addressed and explain (using evidence) how the methodology will address them. This includes why the area / stakeholders are being targeted and how the project activities chosen will contribute to achieving the 5 year Future Drought Fund and NRM Landscapes Program outcomes.",
            "maxSize": "3000",
            "title": "Project Rationale  (3000 character limit [approximately 500 words])"
        }
    },
    {
        "template": "projectMethodology",
        "model": {
            "helpText": "Describe the methodology that will be used to achieve the project outcomes. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification, and any assumptions).",
            "maxSize": "4000",
            "tableHeading": "Project methodology (4000 character limit [approx. 650 words])"
        }
    },
    {
        "template": "monitoringBaseline",
        "model": {
            "titleHelpText": "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term, NRM Landscapes, FDF and 5 year program outcome), and the monitoring design. Refer to the Regional Land Partnerships Evaluation Plan, which provides guidance on  baselines and the monitoring indicators for each RLP outcome. Note, other monitoring indicators can also be used. Refer to the Future Drought Fund Monitoring, Evaluation and Learning Framework for guidance"
        }
    },
    {
        "template": "monitoringIndicators",
        "model": {
            "approachHeading": "Describe the project monitoring indicator(s) approach",
            "monitoringValidation": true,
            "indicatorHeading": "Project monitoring indicators",
            "indicatorPlaceHolder": "[Free text]",
            "approachPlaceHolder": "[Free text]"
        }
    },
    {
        "template": "projectReview",
        "model": {
            "title": "Project review, evaluation and improvement methodology and approach (3000 character limit [approximately 500 words])"
        }
    },
    {
        "template": "nationalAndRegionalPlans"
    },
    {
        "template": "serviceTargets",
        "model": {
            "title": "Project services and minimum targets",
            "serviceName": "Service"
        }
    }
];
outcomes = [
    {
        "priorities": [
            {
                "category": "Land Management"
            }
        ],
        "targeted": true,
        "shortDescription": "Soil Condition",
        "supportsMultiplePrioritiesAsPrimary": true,
        "type": "primary",
        "category": "agriculture",
        "outcome": "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
    },
    {
        "priorities": [
            {
                "category": "Sustainable Agriculture"
            }
        ],
        "shortDescription": "Climate / Weather Adaption",
        "supportsMultiplePrioritiesAsPrimary": true,
        "type": "primary",
        "category": "agriculture",
        "outcome": "6. By 2023, there is an increase in the capacity of agriculture systems to adapt to significant changes in climate and market demands for information on provenance and sustainable production."
    },
    {
        "type": "other",
        "category": "fdf",
        "outcome": "More primary producers preserve natural capital while also improving productivity and profitability"
    },
    {
        "type": "other",
        "category": "fdf",
        "outcome": "More primary producers adopt risk management practices to improve their sustainability and resilience"
    },
    {
        "type": "other",
        "category": "fdf",
        "outcome": "More primary producers adopt whole-of-system approaches to NRM to improve the natural resource base, for long-term productivity and landscape health"
    },
    {
        "type": "other",
        "category": "nrm",
        "outcome": "More primary producers and agricultural communities are experimenting with adaptive or transformative NRM practices, systems and approaches that link and contribute to building drought resilience"
    },
    {
        "type": "other",
        "category": "nrm",
        "outcome": "Partnerships and engagement is built between stakeholders responsible for managing natural resources"
    },
    {
        "type": "other",
        "category": "nrm",
        "outcome": "More primary producers adopt whole-of-system approaches to NRM to improve the natural resource base, for long-term productivity and landscape health (also and FDF Outcome)"
    },
    {
        "type": "other",
        "category": "nrm",
        "outcome": "Improved NRM in agricultural landscapes for increased capacity to prepare and respond to drought"
    }
];
createProgram({programId:"fdFundProgram", name: "Future Drought Fund Program", description: "", config:config, outcomes: outcomes});
createProject({projectId: "fdFundProject", name: "fdFund Projects", programId: "fdFundProgram", managementUnitId: "bushfireManagement1",
    custom:{details:{outcomes:{
        otherOutcomes:["Partnerships and engagement is built between stakeholders responsible for managing natural resources",
       "More primary producers adopt risk management practices to improve their sustainability and resilience",
        "More primary producers and agricultural communities are experimenting with adaptive or transformative NRM practices, systems and approaches that link and contribute to building drought resilience"]}}}})

db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "fdFundProject",
    userId: '1',
    accessLevel: 'admin'
});



db.setting.insert({"key":"meritservices.config", "value":JSON.stringify(projectDashboardService) ,"version":NumberInt(0)});
// Load scores used by RLP services to enable their selection in the MERI plan.
createProjectNumberBaselineDataSets({ "scoreId":"score_42"});
createProjectNumberOfCommunicationMaterialsPublished({ "scoreId":"score_43"});
createProjectWeedAreaSurveyedHaDefault({ "scoreId":"score_44"});

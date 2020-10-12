print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: " + pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');

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
            "template": "meriBudget"
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

loadActivityForms();

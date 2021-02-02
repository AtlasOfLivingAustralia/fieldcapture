var name = 'Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - States';

var program = db.program.find({name: name}).next();

program.config.meriPlanContents =  [
    {
        "template": "assets",
        "model": {
            "priorityCategories": [
                "Ecological Communities",
                "Invertebrate species",
                "Other natural asset",
                "Plant species",
                "Priority Plants",
                "Vertebrate species"
            ],
            "assetHeading": "Asset",
            "autoSelectCategory": true,
            "assetClass": "asset-with-category",
            "viewExplanation": "Species, ecological community or environmental asset(s) the project is targeting",
            "explanation": "List the natural assets within the bushfire region that will benefit from this project",
            "fromPriorities": true,
            "assetHelpText": "Scientific and/or common name",
            "assetCategoryHelpText": "as identified within the regional workshop reports.  Types with no assets are not selectable",
            "placeHolder": "Please select"
        }
    },
    {
        "template": "activities",
        "model": {
            "includeOther": true,
            "noneSelectedMessage": "No priority actions have been nominated for this project",
            "singleSelection": false,
            "title": "Project Actions",
            "explanation": "Please select from the list of priority actions applicable to this project. If the priority action is not listed and ‘other’ is selected, please provide details of the ‘other’ priority within the space provided"
        }
    },
    {
        "template": "outcomeStatements",
        "model": {
            "subtitle": "Please provide outcome statements. Outcomes statements should: <br/>- Clearly describe the intent of the project, specifically the benefit or change that the project is expected to deliver by June 2022;<br/>- Be expressed as a SMART statement (Specific, Measurable, Attainable, Realistic and Time-bound); and<br/>- Ensure that the outcomes are measurable with consideration to the monitoring methodology provided below",
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
            "helpTextHeading": "A succinct overview of the project: (i) what will be done and (ii) why it will be done",
            "maxSize": "1000",
            "placeholder": "[Free text; limit response to 1000 characters (approx. 150 words)]",
            "explanation": " Please provide a short succinct description of this project. The description should state what will be done and why it will be done. This project description will be publicly visible on the project overview page in MERIT"
        }
    },
    {
        "template": "relatedProjects",
        "model": {
            "helpTextHeading": "A succinct overview of the project: (i) what will be done and (ii) why it will be done",
            "maxSize": "1000",
            "placeholder": "[Free text; limit response to 1000 characters (approx. 150 words)]",
            "explanation": " Please provide a short description of this project. The project description should be succinct and state what will be done and why it will be done. This project description will be visible on the project overview page in MERIT"
        }
    },
    {
        "template": "projectPartnerships",
        "model": {
            "namePlaceHolder": "[Free text]",
            "helpTextPartnerNature": "A brief description of the role the partner will have in the delivery of the project and the contribution they will make",
            "partnershipPlaceHolder": "[Free text]",
            "explanation": "Please provide details on all project partners, including partner name, type of organisation and the nature of their participation in the project.",
            "helpTextPartnerName": "Name of project partner: an individual or organisation actively involved in the planning or delivery of the project"
        }
    },
    {
        "template": "consultation",
        "model": {
            "helpTextHeading": "Indicate the groups or individuals you will consult with",
            "title": "Consultation",
            "explanation": "Please provide details on all groups or individuals that you will consult with as part of undertaking the project",
            "placeHolder": "[Free text] Indicate the groups or individuals you will consult with"
        }
    },
    {
        "template": "keyThreats",
        "model": {
            "threatHelpText": "The key threats (or key threatening processes) that your project will be addressing",
            "interventionHelpText": "Describe the proposed interventions to address the threat and how this will deliver on the project outcome",
            "title": "Key Threats",
            "explanation": "Describe the key threat(s) and/or key threatening processes impacting project assets that the project will be addressing."
        }
    },
    {
        "template": "projectMethodology",
        "model": {
            "maxSize": "4000",
            "title": "Project Methodology",
            "explanation": "The methodology should describe <u>how</u> each project service (i.e., action) will be implemented to achieve outcomes and <u>why</u> that specific approach or technique was chosen. The methodology could include the location, partner/s involvement and outputs. The methodology should clearly link to the outcome statement. At least one method for each project outcome should be identified.",
            "tableHeading": "Please describe the methodology that will be used to achieve the project’s outcome statements.",
            "placeHolder": "[Free text; limit response to 4000 characters (approx. 650 words)]"
        }
    },
    {
        "template": "monitoringIndicators",
        "model": {
            "approachHeading": "Describe the project monitoring indicator(s) approach",
            "indicatorHeading": "Identify the project monitoring indicator(s)",
            "indicatorHelpText": "List the indicators of project success that will be monitored. Indicators should link back to the outcome statements and, in most cases, will be quantitative and expressed as a numerical measurable. Where relevant, qualitative indicators can be used. Indicators should measure both project outputs (e.g., area (ha) of rabbit control, length (km) of predator proof fencing) and change the project is aiming to achieve (e.g., change in abundance of X threatened species at Y location, change in vegetation cover (%) etc.)",
            "approachHelpText": "Briefly describe the method that will be used to monitor the indicator (including timing of monitoring, who will collect/collate/analyse, data, etc)",
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
            "showTargetDate": true,
            "totalHelpText": "The overall total of Project Activities to be delivered during the project delivery period.",
            "title": "Actions and Targets Table",
            "serviceName": "Activities"
        }
    },
    {
        "template": "meriBudget",
        "model": {
            "itemName": "Budget item",
            "showThemeColumn": false,
            "showActivityColumn": false,
            "explanation": "Please detail how project funding will be allocated to project activities. Expenditure should align with the approved project proposal (including the amount identified for project reporting and administration). Each action should be identified as a different line item",
            "projectHeadingHelpText": "Planned budget expenditure for each activity",
            "hideHelpText": true
        }
    }
];

load("stateBushfireAssets.js");
program.priorities = [];

for (var i=0; i<assets.length; i+=2) {
    program.priorities.push({
        category:assets[i],
        priority:assets[i+1]
    });
}

// Update each state bushfire management unit.
var stateManagementUnitNames = [
    "Alpine Bushfires",
    "Greater Blue Mountains Bushfires",
    "East Gippsland Bushfires",
    "Kangaroo Island Bushfires",
    "NSW North Coast And Tablelands Bushfires",
    "NSW South Coast Bushfires",
    "South-East Queensland Bushfires"
];
for (var i=0; i<stateManagementUnitNames.length; i++) {
    print("Updating "+ stateManagementUnitNames[i]);
    var mu = db.managementUnit.find({name:stateManagementUnitNames[i]}).next();
    mu.priorities = program.priorities;
    db.managementUnit.save(mu);
}

db.program.save(program);

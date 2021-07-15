// Creating a subprogram for Program:  Bushfire Recovery for Species and Landscapes Program
// New Subprogram:  Multiregional – Species and Strategic Projects
// New Subprogram:  Multiregional – Species and Strategic Projects - NRM

load("uuid.js");
let parentProgram = "Bushfire Recovery for Species and Landscapes Program";
var subprograms = ["Multiregional – Species and Strategic Projects Program", "Multiregional – Species and Strategic Projects - NRM"]

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
var config = {
    "meriPlanContents": [
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
                "explanation": "Please select from the lists of priority action applicable to this project. If the priority action is not listed and ‘other’ is selected, please provide details of the ‘other’ priority within the space provided"
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
                "explanation": "The methodology should describe how each project service (i.e., action) will be implemented to achieve outcomes and why that specific approach or technique was chosen. The methodology could include the location, partner/s involvement and outputs. The methodology should clearly link to the outcome statement. At least one method for each project outcome should be identified.",
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
                "title": "Actions and Targets Table",
                "serviceName": "Service"
            }
        },
        {
            "template": "meriBudget",
            "model": {
                "itemName": "Budget item",
                "showThemeColumn": false,
                "showActivityColumn": false,
                "explanation": "Please detail how project funding will be allocated to project services (action). Expenditure should align with the approved project proposal (including the amount identified for project reporting and administration). Each action should be identified as a different line item",
                "projectHeadingHelpText": "Planned budget expenditure for each service (action)",
                "hideHelpText": true
            }
        }
    ],
    "excludes": ["DATA_SETS"],
    "visibility": "public",
    "organisationRelationship": "Grantee",
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
            "reportDescriptionFormat": "Progress Report %1d",
            "reportNameFormat": "Progress Report %1d",
            "reportingPeriodInMonths": 6,
            "description": "",
            "category": "Progress Reports",
            "activityType": "Bushfires States Progress Report",
            "reportsAlignedToCalendar": true,
            "endDates": [
                "2021-03-31T13:00:00Z",
                "2021-09-30T14:00:00Z",
                "2022-03-31T13:00:00Z"
            ],
            "canSubmitDuringReportingPeriod": true
        },
        {
            "reportType": "Single",
            "firstReportingPeriodEnd": "2022-06-30T14:00:00Z",
            "reportDescriptionFormat": "Final Report",
            "reportNameFormat": "Final Report",
            "reportingPeriodInMonths": 0,
            "multiple": false,
            "description": "",
            "category": "Final Report",
            "reportsAlignedToCalendar": false,
            "activityType": "Final Report"
        }
    ],
    "activities": [
        {
            "name": "Herbivore and/or predator control"
        },
        {
            "name": "Weed control and/or revegetation"
        },
        {
            "name": "Fire management and planning"
        },
        {
            "name": "Species and ecological community specific interventions"
        },
        {
            "name": "Traditional Owner led healing of country"
        },
        {
            "name": "Erosion control"
        },
        {
            "name": "Refugia management"
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
        36,
        37,
        38,
        39,
        40,
        41
    ]
}
subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        p.config = config;
        db.program.save(p);
    }
});

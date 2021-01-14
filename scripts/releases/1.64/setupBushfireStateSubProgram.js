load("uuid.js");

var name = 'Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - States';

var programQuery = db.program.find({name: name});
var program;
if (programQuery.hasNext()) {
    program = programQuery.next();
    print("Program " + name + " already exists")
} else {
    print("Creating program " + name)
    var parent = db.program.find({name: 'Bushfire Recovery for Species and Landscapes Program'}).next();
    program = db.program.find({name: 'Competitive Grants Tranche 1'}).next();
    delete program._id;
    program.parent = parent._id;
    program.programId = UUID.generate();

    program.name = name;

    db.program.save(program);
}

program.config.excludeFinancialYearData = true;
program.config.activities = [
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
];
program.config.excludes = [];
program.config.meriPlanContents = [
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
        "template": "activities",
        "model": {
            "noneSelectedMessage": "No priority actions have been nominated for this project",
            "singleSelection": true,
            "title": "Priority Action",
            "explanation": "Please select from the drop-down list the priority action applicable to this project. The priority action <strong><u>must</u></strong> align with the approved project proposal. If the priority action is not listed and ‘other’ is selected, please provide details of the ‘other’ priority within the space provided"
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
        "template": "projectPartnerships",
        "model": {
            "namePlaceHolder": "[Free text]",
            "partnershipPlaceHolder": "[Free text]",
            "explanation": "Please provide details on all project partners, including partner name, type of organisation and the nature of their participation in the project. For example, a partner could be a research institute that contributes frog research expertise to the project proponent in the deliver of a threatened frog species habitat augmentation and breeding project"
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
        "template": "keyThreats",
        "model": {
            "title": "Key Threats",
            "explanation": "Describe the key threat(s) and/or key threatening process to the priority action for this project. A key threat may comprise, for example: bridal veil <i>(asparagus declinatus)</i> invasion (a weed of national significance). The intervention to address the threat may comprise, for example: control and remove bridal veil at project site"
        }
    },
    {
        "template": "projectMethodology",
        "model": {
            "maxSize": "4000",
            "title": "Project Methodology",
            "explanation": "The methodology should detail how each project service will be completed. The methodology should reflect the services (i.e. actions) outlined in the approved proposal and describe how each service will be implemented to achieve outcomes. This <u>must</u> include an explanation for the choice of a specific methodology to undertake the service. The methodology should also describe how the project service will be undertaken, the location (where applicable), partner/s involvement (where applicable) and outputs. The methodology should clearly link to the approved project proposal outcome statement. There should be at least one method described that is linked to achieving each project outcome",
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
            "showTargetDate": true,
            "title": "Services and Targets Table",
            "serviceName": "Service"
        }
    },
    {
        "template": "meriBudget",
        "model": {
            "itemName": "Budget item",
            "showActivityColumn": false,
            "explanation": "The budget <u>must</u> clearly specify how the funds will be spent for each service the proponent will undertake in accordance with the approved project proposal. Expenditure items must align with the approved project proposal (including the amount identified for project reporting and administration). Each service or spending category should be set out as a different line item"
        }
    }
];
program.config.projectReports = [
    {
        "reportType": "Activity",
        "reportDescriptionFormat": "Progress Report %1d",
        "reportNameFormat": "Progress Report %1d",
        "description": "",
        "category": "Progress Reports",
        "reportingPeriodInMonths": 6,
        "activityType": "State Intervention Progress Report",
        "reportsAlignedToCalendar": true,
        "firstReportingPeriodEnd": "2021-06-30T14:00:00Z",
        "canSubmitDuringReportingPeriod": true
    },
    {
        "firstReportingPeriodEnd": "2021-06-30T14:00:00Z",
        "reportType": "Administrative",
        "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
        "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
        "reportingPeriodInMonths": 12,
        "description": "",
        "category": "Annual Progress Reporting",
        "activityType": "Bushfires Annual Report"
    },
    {
        "reportType": "Single",
        "firstReportingPeriodEnd": "2021-06-30T14:00:00Z",
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
        "firstReportingPeriodEnd": "2022-06-30T14:00:00Z",
        "reportDescriptionFormat": "Final Report",
        "reportNameFormat": "Final Report",
        "reportingPeriodInMonths": 18,
        "multiple": false,
        "description": "",
        "category": "Final Report",
        "reportsAlignedToCalendar": false,
        "activityType": "Final Report"
    }
];

db.program.save(program);

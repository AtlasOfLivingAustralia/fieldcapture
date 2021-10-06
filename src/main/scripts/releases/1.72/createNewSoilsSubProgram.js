// Creating a new subprogram of the National Landcare Programme:
load("uuid.js");
let parentProgram = "National Landcare Programme";
var subprograms = ["Smart Farms - Soil Extensions"]

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

var programConfig = {
    outcomes: [

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
        }

    ],
    priorities: [
        {
            "category": "Land Management",
            "priority":"Increase adoption of best practice"
        },
        {
            "category": "Land Management",
            "priority":"Increase the capacity of land manager"
        }
    ],
    config: {
        "meriPlanContents": [
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
                "template": "rationale",
                "model": {
                    "maxSize": "3000"
                }
            },
            {
                "template": "projectMethodology",
                "model": {
                    "maxSize": "5000",
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
        ],
        "excludes": [],
        "visibility": "public",
        "requiresActivityLocking": true,
        "projectTemplate": "rlp",
        "activityPeriodDescriptor": "Outputs report #",
        "emailTemplates": {
            "reportSubmittedEmailTemplate": "RLP_REPORT_SUBMITTED_EMAIL_TEMPLATE",
            "reportReturnedEmailTemplate": "RLP_REPORT_RETURNED_EMAIL_TEMPLATE",
            "planApprovedEmailTemplate": "RLP_PLAN_APPROVED_EMAIL_TEMPLATE",
            "planReturnedEmailTemplate": "RLP_PLAN_RETURNED_EMAIL_TEMPLATE",
            "reportApprovedEmailTemplate": "RLP_REPORT_APPROVED_EMAIL_TEMPLATE",
            "planSubmittedEmailTemplate": "RLP_PLAN_SUBMITTED_EMAIL_TEMPLATE"
        },
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
                "firstReportingPeriodEnd": "2025-06-30T14:00:00Z",
                "reportDescriptionFormat": "Outcomes Report 2 for %4$s",
                "reportNameFormat": "Outcomes Report 2",
                "reportingPeriodInMonths": 0,
                "multiple": false,
                "description": "_Please note that the reporting fields for these reports are currently being developed_",
                "minimumPeriodInMonths": 37,
                "category": "Outcomes Report 2",
                "reportsAlignedToCalendar": false,
                "activityType": "RLP Medium term project outcomes"
            }
        ],
        "navigationMode": "returnToProject",
        "supportsMeriPlanHistory": true,
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
    }
};

subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
            p.outcomes = programConfig.outcomes;
            p.config = programConfig.config;
            p.priorities = programConfig.priorities;

        db.program.save(p);
    }
});

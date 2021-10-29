// Modifying Post Fire Monitoring MeriPlan Configuration from "rlpMeriPlan" to "configurableMeriPlan"

load("uuid.js");
let config = {

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
        "template": "projectMethodology",
        "model": {
            "maxSize": "4000",
            "title": "Project methodology",
            "tableHeading": "Please describe the methodology that will be used to achieve the project's short term outcome statements. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification)",
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
    35
]

};

let programName = "Post-fire monitoring";
print("Adding config data into program:  " + programName)
var program = db.program.find({name: programName});
while(program.hasNext()){
    var p = program.next();
    p.config = config;
    db.program.save(p);
}

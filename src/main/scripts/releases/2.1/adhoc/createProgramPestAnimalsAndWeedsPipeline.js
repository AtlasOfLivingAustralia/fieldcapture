
load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');

//create the parent program
var programName = 'Advancing Pest Animal and Weed Control Solutions - Pipeline';
var parent = createOrFindProgram(programName);

//create the sub-program
let parentProgram = programName;
var subprograms = ["Competitive Grants 2022 - Round 1"]
createNewProgram(parentProgram, subprograms);

var projectConfig = {
    config: {
        "excludes": [],
        "visibility": "public",
        "requiresActivityLocking": true,
        "navigationMode": "returnToProject",
        "projectTemplate": "rlp",
        "activityPeriodDescriptor": "Outputs report #",
        "supportsMeriPlanHistory": true,
        "emailTemplates": {
            "reportSubmittedEmailTemplate": "RLP_REPORT_SUBMITTED_EMAIL_TEMPLATE",
            "reportReturnedEmailTemplate": "RLP_REPORT_RETURNED_EMAIL_TEMPLATE",
            "planApprovedEmailTemplate": "RLP_PLAN_APPROVED_EMAIL_TEMPLATE",
            "planReturnedEmailTemplate": "RLP_PLAN_RETURNED_EMAIL_TEMPLATE",
            "reportApprovedEmailTemplate": "RLP_REPORT_APPROVED_EMAIL_TEMPLATE",
            "planSubmittedEmailTemplate": "RLP_PLAN_SUBMITTED_EMAIL_TEMPLATE"
        },
        "meriPlanTemplate": "rlpMeriPlan",
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
                "label": "Annual",
                "category": "Annual Progress Reporting",
                "activityType": "RLP Annual Report"
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
                "firstReportingPeriodEnd": "2023-06-30T14:00:00Z",
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
    },
    outcomes: [
        {
            "priorities": [
                {
                    "category": "Ramsar"
                }
            ],
            "targeted": true,
            "shortDescription": "Ramsar Sites",
            "category": "environment",
            "outcome": "1. By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        },
        {
            "priorities": [
                {
                    "category": "Threatened Species"
                }
            ],
            "targeted": true,
            "shortDescription": "Threatened Species Strategy",
            "category": "environment",
            "outcome": "2. By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
        },
        {
            "priorities": [
                {
                    "category": "World Heritage Sites"
                }
            ],
            "targeted": true,
            "shortDescription": "World Heritage Areas",
            "category": "environment",
            "outcome": "3. By 2023, invasive species management has reduced threats to the natural heritage Outstanding Universal Value of World Heritage properties through the implementation of priority actions."
        },
        {
            "priorities": [
                {
                    "category": "Threatened Ecological Communities"
                }
            ],
            "targeted": true,
            "shortDescription": "Threatened Ecological Communities",
            "category": "environment",
            "outcome": "4. By 2023, the implementation of priority actions is leading to an improvement in the condition of EPBC Act listed Threatened Ecological Communities."
        },
        {
            "priorities": [
                {
                    "category": "Land Management"
                }
            ],
            "targeted": true,
            "shortDescription": "Soil Condition",
            "category": "agriculture",
            "outcome": "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
        },
        {
            "priorities": [
                {
                    "category": "Sustainable Agriculture"
                }
            ],
            "targeted": true,
            "shortDescription": "Climate / Weather Adaption",
            "category": "agriculture",
            "outcome": "6. By 2023, there is an increase in the capacity of agriculture systems to adapt to significant changes in climate and market demands for information on provenance and sustainable production."
        }
    ]
};

function setupProgramConfig(subprograms) {
    subprograms.forEach(function (subprogram){
        var program = db.program.find({name: subprogram});
        while(program.hasNext()){
            var p = program.next();
            p.config = projectConfig.config
            p.outcomes = projectConfig.outcomes;
            db.program.save(p);
        }
    });
}



load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
var userId = '129333';

let programName = "Supporting Communities Manage Pest Animals and Weeds";
var parentProgram = createOrFindProgram(programName);

var subprograms = ["On-ground management – focused on Threatened Species Strategy )2021-2031) Action Plan priority species and places"]
createNewProgram(programName, subprograms);


var programConfig = {
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
                "firstReportingPeriodEnd": "2022-09-30T14:00:00Z",
                "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportingPeriodInMonths": 3,
                "description": "",
                "category": "Outputs Reporting",
                "activityType": "RLP Output Report",
                "canSubmitDuringReportingPeriod": true
            },
            {
                "reportType": "Single",
                "firstReportingPeriodEnd": "2022-06-30T14:00:00Z",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 36,
                "multiple": false,
                "description": "Before beginning Outcomes Report 1, please go to the Data set summary tab and complete a form for each data set collected for this project. Help with completing this form can be found in Section 10 of the [RLP MERIT User Guide](http://www.nrm.gov.au/my-project/monitoring-and-reporting-plan/merit)",
                "category": "Outcomes Report 1",
                "reportsAlignedToCalendar": false,
                "activityType": "RLP Short term project outcomes"
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
            35,
            36
        ]
    },
    priorities: [
        {
            "category": "Soil Quality",
            "priority": "Soil acidification"
        },
        {
            "category": "Soil Quality",
            "priority": "Soil Carbon priority"
        },
        {
            "category": "Soil Quality",
            "priority": "Hillslope erosion priority"
        },
        {
            "category": "Soil Quality",
            "priority": "Wind erosion priority"
        },
        {
            "category": "Land Management",
            "priority": "Soil acidification"
        },
        {
            "category": "Land Management",
            "priority": "Soil carbon"
        },
        {
            "category": "Land Management",
            "priority": "Hillslope erosion"
        },
        {
            "category": "Land Management",
            "priority": "Wind erosion"
        },
        {
            "category": "Land Management",
            "priority": "Native vegetation and biodiversity on-farm"
        },
        {
            "category": "Sustainable Agriculture",
            "priority": "Climate change adaptation"
        },
        {
            "category": "Sustainable Agriculture",
            "priority": "Market traceability"
        }
    ]
};
var outcomes = [
    {
        "priorities": [
            {
                "category": "Land Management"
            }
        ],
        "targeted": true,
        "shortDescription": "Soil Condition",
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
        "type": "secondary",
        "category": "agriculture",
        "outcome": "6. By 2023, there is an increase in the capacity of agriculture systems to adapt to significant changes in climate and market demands for information on provenance and sustainable production."
    }
]


subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        if (p.name === subprogram){
            p.config = programConfig.config
            p.priorities = programConfig.priorities
            p.outcomes = outcomes;
        }
        db.program.save(p);
    }
});

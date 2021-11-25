load("uuid.js");
var programs = {
    parent :  "MER Network Pilot",
    subprogram: "Post-fire monitoring"
}
var config = {
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
        "category": "environment",
        "outcome": "1. By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
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
        "category": "environment",
        "outcome": "3. By 2023, invasive species management has reduced threats to the natural heritage Outstanding Universal Value of World Heritage properties through the implementation of priority actions."
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
        "outcome": "4. By 2023, the implementation of priority actions is leading to an improvement in the condition of EPBC Act listed Threatened Ecological Communities."
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

var program = db.program.find({name: programs.parent});
var now = ISODate();
var p = {
    name: programs.parent, programId: UUID.generate(), dateCreated: now, lastUpdate: now, status: "active"
}
if (!program.hasNext()) {
    db.program.insert(p);
}else{
    print("Program Already Exist: " + programs.parent)
}


var program = db.program.find({name: programs.subprogram});
var parent = db.program.find({name: programs.parent}).next();
var now = ISODate();
var p = {
    name: programs.subprogram, programId: UUID.generate(), dateCreated: now, lastUpdate: now, parent: parent._id, status: "active"
}
if (!program.hasNext()) {
    db.program.insert(p);
}else{
    print("Program Already Exist: " + programs.subprogram)
}
print("Adding config data into program:  " + programs.subprogram)
var program = db.program.find({name: programs.subprogram});
while(program.hasNext()){
    var p = program.next();
    p.config = config;
    p.outcomes = outcomes;
    db.program.save(p);
};

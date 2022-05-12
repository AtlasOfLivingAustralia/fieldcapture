// Creating a subprogram for Program:  Environmental Restoration Fund
// Flood Recovery Tranche 1

load('../../utils/uuid.js');
load('../../utils/audit.js');
load('../../utils/program.js');

let parentProgram = "Environmental Restoration Fund";
var subprograms = ["Flood Recovery Tranche 1"]
createNewProgram(parentProgram, subprograms);


var projectConfig = {
    config: {
        "excludes": [],
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
                    "category": "Threatened Ecological Communities"
                }
            ],
            "targeted": true,
            "shortDescription": "Threatened Ecological Communities",
            "category": "environment",
            "outcome": "4. By 2023, the implementation of priority actions is leading to an improvement in the condition of EPBC Act listed Threatened Ecological Communities."
        }
    ]
};

setupProgramConfig(subprograms);



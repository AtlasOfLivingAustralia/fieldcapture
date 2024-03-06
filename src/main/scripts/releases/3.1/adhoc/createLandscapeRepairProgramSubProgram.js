load('../../../utils/uuid.js');
load('../../../utils/program.js');

var program = db.program.findOne({name: "Reef Trust"});
var subprograms = ["Landscape Repair Program – Procurement", "Landscape Repair Program – Grants"]
var outcomes = [
    {
        "priorities": [
            {
                "category": "Ecological health"
            }
        ],
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Improve water quality in the Great Barrier Reef by reducing fine sediment."
    },
    {
        "priorities": [
            {
                "category": "Ecological health"
            }
        ],
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Improve water quality in the Great Barrier Reef by reducing dissolved inorganic nitrogen from agricultural sources."
    },
    {
        "priorities": [
            {
                "category": "Ecological health"
            }
        ],

        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Improve water quality in the Great Barrier Reef by reducing particulate phosphorus from agricultural sources."
    },
    {
        "priorities": [
            {
                "category": "Ecological health"
            }
        ],
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Improve water quality in the Great Barrier Reef by reducing particulate nitrogen from agricultural sources."
    }
];

var priorities = [
    {
        "category": "Ecological health",
        "priority": "Great Barrier Reef"
    }
];

var reports = [
    {
        reportType: 'Activity',
        reportDescriptionFormat: 'Year %5$s - %6$s %7$d Outputs Report',
        reportNameFormat: 'Year %5$s - %6$s %7$d Outputs Report',
        reportingPeriodInMonths: 6,
        description: '',
        minimumReportDurationInDays: 1,
        label: 'Semester',
        reportsAlignedToCalendar: true,
        category: 'Outputs Reporting',
        activityType: 'NHT Output Report',
        canSubmitDuringReportingPeriod: true
    },
    {
        firstReportingPeriodEnd: '2024-06-30T14:00:00Z',
        reportType: 'Administrative',
        reportDescriptionFormat: 'Annual Progress Report %2$tY - %3$tY for %4$s',
        reportNameFormat: 'Annual Progress Report %2$tY - %3$tY',
        reportingPeriodInMonths: 12,
        description: 'This report is still being developed.  _Please do not commence reporting until the new report is ready for use._',
        minimumReportDurationInDays: 1,
        label: 'Annual',
        category: 'Annual Progress Reporting',
        activityType: 'NHT Annual Report'
    },
    {
        reportDescriptionFormat: 'Outcomes Report 1 for %4$s',
        reportingPeriodInMonths: 36,
        multiple: false,
        description: 'This report is still being developed.  _Please do not commence reporting until the new report is ready for use._',
        maximumOwnerDurationInMonths: 35,
        label: 'Outcomes Report 1',
        alignToOwnerStart: true,
        reportType: 'Single',
        minimumOwnerDurationInMonths: null,
        reportNameFormat: 'Outcomes Report 1',
        alignToOwnerEnd: true,
        category: 'Outcomes Report 1',
        reportsAlignedToCalendar: false,
        activityType: 'NHT Outcomes 1 Report'
    },
    {
        reportType: 'Single',
        reportDescriptionFormat: 'Outcomes Report 1 for %4$s',
        minimumOwnerDurationInMonths: 36,
        reportNameFormat: 'Outcomes Report 1',
        reportingPeriodInMonths: 36,
        multiple: false,
        maximumOwnerDurationInMonths: 72,
        description: 'This report is still being developed.  _Please do not commence reporting until the new report is ready for use._',
        label: 'Outcomes Report 1',
        category: 'Outcomes Report 1',
        activityType: 'NHT Outcomes 1 Report'
    }
];
for (var i = 0; i < subprograms.length; i++) {
    var subprogram = subprograms[i];
    var mintedSubprogram = createOrFindProgram(subprogram, program._id, "Recovery Actions for Species and Landscapes")

    if (subprogram == "Landscape Repair Program – Procurement") {
        db.program.updateOne({programId: mintedSubprogram.programId}, {$set: {"config.projectReports": reports, outcomes: outcomes, priorities: priorities}});
    }
    else if (subprogram === "Landscape Repair Program – Grants") {
        db.program.updateOne({programId: mintedSubprogram.programId}, {$set: {"config.projectReports": [], outcomes: outcomes, priorities: priorities}});
    }
}
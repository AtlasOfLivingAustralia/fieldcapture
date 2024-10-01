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
        "targeted": true,
        "category": "Ecological health",
        "outcome": "1. Priority landscapes in the Great Barrier Reef catchments are remediated and maintained using approaches demonstrated to improve water quality, build resilience and enhanced ecological function."
    },
    {
        "category": "Ecological health",
        "type": "medium",
        "outcome": "1. Landscape remediation of priority locations resulting in the cost-effective reduction of fine sediment from reaching the Great Barrier Reef Lagoon."
    },
    {
        "category": "Ecological health",
        "type": "medium",
        "outcome": "2. Capacity, capability and willingness to adopt and maintain appropriate land management practices has increased across the Great Barrier Reef regions."
    },
    {
        "category": "Ecological health",
        "type": "medium",
        "outcome": "3. Participation of First Nations people in in project design, delivery, maintenance and monitoring of Reef water quality projects has increased across the Great Barrier Reef regions."
    },
    {
        "category": "Ecological health",
        "type": "medium",
        "outcome": "4. Reef Trust water quality investment landscape remediation sites are maintained to support longevity of water quality outcomes."
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "1. Whole-of-system Reef water quality strategies are guiding landscape repair in priority Great Barrier Reef regions and catchments"
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "2. Technical advice, data assurance, and evidence-based decision support has enabled site selection, design and commencement of landscape remediation activities to support the cost-effective reduction of sediment reaching the Great Barrier Reef."
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "3. Landscape remediation of priority locations resulting in the cost-effective reduction of fine sediment from reaching the Great Barrier Reef Lagoon."
    },
    {
        "type": "short",
        "category": "Farmer Sector",
        "outcome": "4. Region-led consortiums of landscape repair practitioners, industries, and communities are supporting ongoing collaboration in design and delivery of landscape repair programs to improve Reef water quality."
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "5. Initiatives to build regional capacity and capability to design, deliver, and maintain the legacy of Reef Trust investments are in place and supporting outcome delivery."
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "6. First Nations people are actively participating in project design, delivery, maintenance and monitoring."
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "7. Technical advice and input has been obtained to identify, design and ensure maintenance and monitoring occurs for Landscape Repair Sites."
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
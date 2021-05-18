// All subprograms of "Bushfire Wildlife and Habitat Recovery"
var programNames = ["State Government Emergency", "Competitive Grants Tranche 1", "Competitive Grants Tranche 2"];
var projectReports = [
    {
        "reportType": "Activity",
        "firstReportingPeriodEnd": "2020-09-30T14:00:00Z",
        "reportDescriptionFormat": "Progress Report %1d",
        "reportNameFormat": "Progress Report %1d",
        "reportingPeriodInMonths": 3,
        "reportsAlignedToCalendar":true,
        "skipFinalPeriod":true,
        "description": "",
        "category": "Progress Reports",
        "activityType": "State Intervention Progress Report",
        "canSubmitDuringReportingPeriod": true
    },
    {
        "reportType": "Single",
        "alignToOwnerStart": false,
        "alignToOwnerEnd": true,
        "reportDescriptionFormat": "Final Report",
        "reportNameFormat": "Final Report",
        "reportingPeriodInMonths": 3,
        "reportsAlignedToCalendar":true,
        "description": "",
        "category": "Final Report",
        "activityType": "Bushfires Final Report",
        "canSubmitDuringReportingPeriod": true,
        "multiple":false
    }
];
for (var i=0; i<programNames.length; i++) {
    var program = db.program.findOne({name:programNames[i]});
    program.config.projectReports = projectReports;
    db.program.save(program);
}


var programName = "Additional Bushfire Projects"
delete projectReports[0].firstReportingPeriodEnd;
projectReports[0].activityType = "Wildlife Recovery Progress Report - WRR";

program = db.program.findOne({name:programName});
program.config.projectReports = projectReports;
db.program.save(program);

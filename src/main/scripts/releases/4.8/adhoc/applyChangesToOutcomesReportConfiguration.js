load('../../../utils/audit.js');
let adminUserId = 'system';

let programs = db.program.find({$or:[{'config.projectReports.activityType':'NHT Outcomes 1 Report'}, {'config.projectReports.activityType':'NHT Outcomes 2 Report'}]});
const newOutcomesReportConfig = [
    {
        "reportType": "Single",
        "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
        "minimumOwnerDurationInMonths": 36,
        "reportNameFormat": "Outcomes Report 1",
        "reportingPeriodInMonths": 24,
        "multiple": false,
        "maximumOwnerDurationInMonths": 47,
        "label": "Outcomes Report 1",
        "category": "Outcomes Report 1",
        "activityType": "NHT Outcomes 1 Report"
    },
    {
        "reportType": "Single",
        "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
        "minimumOwnerDurationInMonths": 48,
        "reportNameFormat": "Outcomes Report 1",
        "reportingPeriodInMonths": 36,
        "multiple": false,
        "calendarAlignmentMonth": 7,
        "label": "Outcomes Report 1",
        "category": "Outcomes Report 1",
        "reportsAlignedToCalendar": true,
        "activityType": "NHT Outcomes 1 Report"
    },
    {
        "reportType": "Single",
        "reportDescriptionFormat": "Outcomes Report 2 for %4$s",
        "reportNameFormat": "Outcomes Report 2",
        "multiple": false,
        "alignToOwnerEnd": true,
        "label": "Outcomes Report 2",
        "category": "Outcomes Report 2",
        "activityType": "NHT Outcomes 2 Report",
        "alignToOwnerStart": true
    }
]
while (programs.hasNext()) {
    let program = programs.next();
    let reportConfigs = program.config.projectReports || [];
    let updated = false;

    let newConfig = [];
    for (let i = 0; i < reportConfigs.length; i++) {
        let config = reportConfigs[i];
        if (config.activityType === 'NHT Outcomes 1 Report') {
            //print("Found outcomes report 1");
        }
        else if (config.activityType === 'NHT Outcomes 2 Report') {
            //print("Found outcomes report 2");
        }
        else {
            newConfig.push(config);
        }
    }
    newConfig = newConfig.concat(newOutcomesReportConfig);
    program.config.projectReports = newConfig;

    print("Updating reporting configuration for program: " + program.name + " ( https://fieldcapture.ala.org.au/program/index/" + program.programId + " )");
    db.program.replaceOne({_id: program._id}, program);
    audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId);
}

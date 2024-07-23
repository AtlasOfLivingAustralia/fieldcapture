load('../../../utils/audit.js');
load('../../../utils/reports.js');

let adminUserId = '129333'

//Update the project start date and soft deletes the two reports
let projectId = '877a2e25-ef65-4a01-a488-ba7a528d42fa';
let project = db.project.findOne({projectId:projectId});
let startDate = ISODate('2020-01-28T14:00:00Z');
db.project.updateOne({projectId:projectId}, {$set:{plannedStartDate:startDate}});

 const reportIds = [
     'd4c90c0c-30bb-40eb-b4d2-beaa3edf6ddb',
     '475e9bc2-85a3-47a9-85b9-e385413a8a6b'
 ];

 for (let i=0; i<reportIds.length; i++) {
     deleteReport(reportIds[i], adminUserId);
}

//Update the report start date of the affected reports
const affectedReportIds = [
    '7d527d78-0bcc-4fc4-b59d-c3a80e6a121c', //Outputs Report
    '72ef10f1-ee7f-4154-871d-e85a17dccc97', //Annual Progress Report
    '550401f0-9441-43c4-81c1-1dee9c1b9a35', //Outcomes Report 1
    '10ab9c83-9e50-4370-8cd4-023422004d43' //Outcomes Report 2
];

for (let i=0; i<affectedReportIds.length; i++) {
    changeReportDate(affectedReportIds[i], startDate, adminUserId);
}

function changeReportDate(reportId, startDate, adminUserId) {
    const report = db.report.findOne({reportId:reportId});
    const activity = db.activity.findOne({activityId:report.activityId});

    report.fromDate = startDate;
    db.report.replaceOne({reportId:reportId}, report);
    audit(report, reportId, 'au.org.ala.ecodata.Report', adminUserId, report.projectId);

    activity.startDate = startDate;
    db.activity.replaceOne({activityId:report.activityId}, activity);
    audit(activity, report.activityId, 'au.org.ala.ecodata.Activity', adminUserId, report.projectId);

}
load('../../utils/audit.js');
load('../../utils/uuid.js');

var userId = '1493';
var now = ISODate();

// Change first annual report, insert new report.
// ERF-MU42-P2
var reportId = 'bc55d57f-62b3-4f77-82f3-97322e2c9e06'; // Report to move entirely into 20/21
updateReportDetails(reportId, 'Annual Progress Report 2020 - 2021 for Protecting Forty-spotted Pardalote', ISODate("2021-06-24T14:00:00Z"), ISODate('2021-06-30T14:00:00Z'), userId);

// Insert new report for 21/22 as a copy of 22/23
var toCopyId = 'dbb1a61e-50af-4d8b-950a-16de74c6cb48';
var toCopyReport = db.report.findOne({reportId:toCopyId});
delete toCopyReport._id;
toCopyReport.dateCreated = now;
toCopyReport.reportId = UUID.generate();

var toCopyActivity = db.activity.findOne({activityId:toCopyReport.activityId});
delete toCopyActivity._id;
toCopyActivity.activityId = UUID.generate();
toCopyActivity.dateCreated = now;

toCopyReport.activityId = toCopyActivity.activityId;

db.activity.insert(toCopyActivity);
audit(toCopyActivity, toCopyActivity.activityId, 'au.org.ala.ecodata.Activity', userId);
db.report.insert(toCopyReport);
audit(toCopyReport, toCopyReport.reportId, 'au.org.ala.ecodata.Report', userId);

updateReportDetails(toCopyReport.reportId, 'Annual Progress Report 2021 - 2022 for Protecting Forty-spotted Pardalote', ISODate("2021-06-30T14:00:00Z"), ISODate('2022-06-30T14:00:00Z'), userId);


// DPT-MU42-P1


var reportId = '903b0fc1-d5dc-4f64-b6c1-a614411358bc'; // Report to move entirely into 20/21
updateReportDetails(reportId, 'Annual Progress Report 2020 - 2021 for Further support for Orange-bellied Parrot (Neophema chrysogaster) recovery', ISODate("2021-06-24T14:00:00Z"), ISODate('2021-06-30T14:00:00Z'), userId);

// Insert new report for 21/22 as a copy of 22/23
var toCopyId = '7b77f9a0-cc84-40e1-a35b-c6255c2dfbae';
var toCopyReport = db.report.findOne({reportId:toCopyId});
delete toCopyReport._id;
toCopyReport.dateCreated = now;
toCopyReport.reportId = UUID.generate();

var toCopyActivity = db.activity.findOne({activityId:toCopyReport.activityId});
delete toCopyActivity._id;
toCopyActivity.activityId = UUID.generate();
toCopyActivity.dateCreated = now;

toCopyReport.activityId = toCopyActivity.activityId;

db.activity.insert(toCopyActivity);
audit(toCopyActivity, toCopyActivity.activityId, 'au.org.ala.ecodata.Activity', userId);
db.report.insert(toCopyReport);
audit(toCopyReport, toCopyReport.reportId, 'au.org.ala.ecodata.Report', userId);

updateReportDetails(toCopyReport.reportId, 'Annual Progress Report 2021 - 2022 for Further support for Orange-bellied Parrot (Neophema chrysogaster) recovery', ISODate("2021-06-30T14:00:00Z"), ISODate('2022-06-30T14:00:00Z'), userId);

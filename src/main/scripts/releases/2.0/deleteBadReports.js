load('../../utils/audit.js');

// Delete "Outputs Report 2..." for project RLP-MU52-P2
var report = db.report.findOne({reportId:'3e0cdb9e-6987-4dbc-bb2e-c502b1f19185'});
var activity = db.activity.findOne({activityId:report.activityId});

var userId = '1493';

report.status = 'deleted';
db.report.save(report);
audit(report, report.reportId, 'au.org.ala.ecodata.Report', userId);

activity.status = 'deleted';
db.activity.save(activity);
audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', userId);


// Delete "Outputs Report 1..." for project RLP
report = db.report.findOne({reportId:'60995db7-951a-44e3-a333-75d281fbdc36'});
activity = db.activity.findOne({activityId:report.activityId});

report.status = 'deleted';
db.report.save(report);
audit(report, report.reportId, 'au.org.ala.ecodata.Report', userId);

activity.status = 'deleted';
db.activity.save(activity);
audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', userId);

// Correct the start date for Output report 2
var outputReport2ReportId = 'ff38b6cf-bfde-4be7-a65d-52af8c8df5e0';
var outputReport2 = db.report.findOne({reportId:outputReport2ReportId});
updateReportDetails(outputReport2ReportId, outputReport2.description, report.fromDate, outputReport2.toDate, userId);
updateActivity(outputReport2, userId);

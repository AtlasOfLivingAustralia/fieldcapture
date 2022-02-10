load('../../../utils/audit.js');

// Delete Final Report for project ERF-WRR2-007
var report = db.report.findOne({reportId:'f2c8b90d-0fc5-41ec-8a89-52344806ade8'});
var activity = db.activity.findOne({activityId:report.activityId});

var userId = '129333';

report.status = 'deleted';
db.report.save(report);
audit(report, report.reportId, 'au.org.ala.ecodata.Report', userId);

activity.status = 'deleted';
db.activity.save(activity);
audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', userId);

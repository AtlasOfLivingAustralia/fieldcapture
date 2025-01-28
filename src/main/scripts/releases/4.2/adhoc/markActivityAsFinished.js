load('../../../utils/audit.js');
let reportId = 'ac5c0470-c654-40e1-9535-bfaf620fe883';
let adminUserId = 'system';

let outputsToMarkAsNotApplicable = ['NHT - Identifying sites', 'NHT - Weed treatment', 'NHT - Baseline data'];

let report =  db.report.findOne({reportId:reportId});
let activityId = report.activityId;
let activity = db.activity.findOne({activityId:activityId});
activity.progress = 'finished';
db.activity.replaceOne({activityId:activityId}, activity);
audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', adminUserId, activity.projectId, "Update");


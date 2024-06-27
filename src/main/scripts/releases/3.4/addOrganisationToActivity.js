load('../../utils/audit.js');
const adminUserId = 'system';

let reports = db.report.find({status: {$ne: 'deleted'}, organisationId: {$exists: true}, category:'Regional Capacity Services Reporting'});
while (reports.hasNext()) {
    let report = reports.next();
    let activities = db.activity.find({activityId:report.activityId, type:'Regional Capacity Services Report'});
    while (activities.hasNext()) {
        let activity = activities.next();
        activity.organisationId = report.organisationId;
        db.activity.replaceOne({activityId:activity.activityId}, activity);
        audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', adminUserId, activity.organisationId);
    }
}
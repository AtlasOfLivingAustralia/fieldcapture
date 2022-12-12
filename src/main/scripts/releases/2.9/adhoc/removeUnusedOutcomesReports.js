load('../../../utils/audit.js');

const adminUserId = '<ecodata>';
const program = 'Regional Fund - Co-design States';
let programId = db.program.findOne({name:program}).programId;

let projects = db.project.find({programId:programId});
while (projects.hasNext()) {
    let project = projects.next();

    let reports = db.report.find({projectId:project.projectId, activityType:'RLP Short term project outcomes'});
    while (reports.hasNext()) {
        let report = reports.next();

        db.report.deleteOne({_id:report._id});
        audit(report, report.reportId, 'au.org.ala.ecodata.Report', adminUserId, project.projectId, 'Delete');

        let activity = db.activity.findOne({activityId:report.activityId});
        db.activity.deleteOne({_id:activity._id});
        audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', adminUserId, project.projectId, 'Delete');
    }
}

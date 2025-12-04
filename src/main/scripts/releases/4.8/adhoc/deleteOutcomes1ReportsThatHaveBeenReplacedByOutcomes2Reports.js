load('../../../utils/audit.js');
let adminUserId = 'system';

let programs = db.program.find({$or:[{'config.projectReports.activityType':'NHT Outcomes 1 Report'}, {'config.projectReports.activityType':'NHT Outcomes 2 Report'}]});
const three_years = 3 * 365 * 24 * 60 * 60 * 1000; // in milliseconds
while (programs.hasNext()) {
    let program = programs.next();

    let projects = db.project.find({programId:program.programId, status:{$ne:'deleted'}});
    while (projects.hasNext()) {
        let project = projects.next();
        let start = project.plannedStartDate.getTime();
        let end = project.plannedEndDate.getTime();

        if (end-start <= three_years) {
            print("Project " + project.projectId + " has less than 3 years duration");

            let outcomes1Reports = db.report.find({projectId:project.projectId, activityType:'NHT Outcomes 1 Report', status:{$ne:'deleted'}});
            while (outcomes1Reports.hasNext()) {
                let report = outcomes1Reports.next();
                print("  Deleting Outcomes 1 Report " + report.name);
                db.report.updateOne({_id:report._id}, {$set:{status:'deleted'}});
                audit(report, report.reportId, 'au.org.ala.ecodata.Report', adminUserId, report.projectId);

                let activity = db.activity.findOne({activityId:report.activityId});
                db.activity.updateOne({activityId:report.activityId}, {$set:{status:'deleted'}});
                audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', adminUserId, activity.projectId);

            }

        }

    }

}
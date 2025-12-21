const programId = '05a2d9e8-be51-4973-bc66-41c53701d25e';
const mistakeCategory = '12 Monthly Progress Reports';
let projects = db.project.find({programId: programId});
while (projects.hasNext()) {
    let project = projects.next();

    let reports = db.report.find({projectId: project.projectId, category: mistakeCategory});
    print("Found " + reports.count() + " reports in mistake category for project: " + project.name);

    while (reports.hasNext()) {
        let report = reports.next();
        let activity = db.activity.find({activityId: report.activityId});
        if (activity.progress && activity.progress != 'planned') {
            print("Skipping report: " + report.reportId + " as activity progress is: " + activity.progress);
        }
        else if (report.publicationStatus && report.publicationStatus != 'unpublished') {
            print("Skipping report: " + report.reportId + " as publication status is: " + report.publicationStatus);
        }
        else {
            print("Deleting report: " + report.reportId + " for project: " + project.name);
            db.report.deleteOne({reportId: report.reportId});
            db.activity.deleteOne({activityId: report.activityId});
        }
    }

}
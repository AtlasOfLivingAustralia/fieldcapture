load('../../utils/audit.js');
var programId = "834f6ec8-100b-44c2-9527-72d12d6edd89", projects = [], reports = [], activities = [],
    reportName= "Progress Report 1", activities = [], newFormVersion = NumberInt(1), counter = 0,
    user="system";

db.project.find({programId: programId}).forEach(function(project) {
    projects.push(project.projectId);
});
print("Projects: " + projects.length);
db.report.find({projectId: {$in: projects}, name: reportName }).forEach(function(report) {
    reports.push(report.reportId);
    activities.push(report.activityId);
});

print("Reports length " + reports.length + " reports list " + reports);
db.activity.find({activityId: {$in: activities}, progress: "planned"}).forEach(function(activity) {
    if (!activity.formVersion) {
        activity.formVersion = newFormVersion;
        db.activity.updateOne({activityId: activity.activityId}, {$set: {formVersion: newFormVersion}});
        audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', user);
        print("Activity " + activity.activityId + " updated.");
        counter++;
    }
});

print("Activities: " + activities.length + " Updated: " + counter);
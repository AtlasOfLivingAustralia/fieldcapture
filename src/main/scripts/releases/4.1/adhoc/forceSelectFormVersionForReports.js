var programId = "834f6ec8-100b-44c2-9527-72d12d6edd89", projects = [], reports = [], activities = [],
    reportName= "Progress Report 1", activities = [], newFormVersion = NumberInt(1), counter = 0;

db.project.find({programId: programId}).forEach(function(program) {
    projects.push(program.projectId);
});
print("Projects: " + projects.length);
db.report.find({projectId: {$in: projects}, name: reportName }).forEach(function(report) {
    reports.push(report.reportId);
    activities.push(report.activityId);
});

print("Reports length " + reports.length + " reports list " + reports);
db.activity.find({activityId: {$in: activities}, progress: "planned"}).forEach(function(activity) {
    if (!activity.formVersion) {
        db.activity.updateOne({activityId: activity.activityId}, {$set: {formVersion: newFormVersion}});
        print("Activity " + activity.activityId + " updated.");
        counter++;
    }
});

print("Activities: " + activities.length + " Updated: " + counter);
var rlp = db.program.findOne({name:'Regional Land Partnerships'});
var rlpProjects = db.project.find({programId:rlp.programId, status:{$ne:'deleted'}});

var expectedLabels = ['Quarter', 'Semester', 'Annual', 'Outcomes Report 1', 'Outcomes Report 2', 'Output Adjustment'];

while (rlpProjects.hasNext()) {
    var project = rlpProjects.next();

    var reports = db.report.find({projectId:project.projectId, status:{$ne:'deleted'}});

    while (reports.hasNext()) {
        var report = reports.next();

        if (expectedLabels.indexOf(report.generatedBy) < 0) {

            print("Found label: "+report.generatedBy+" for report "+report.name+ "("+report.reportId+") in MU "+project.managementUnitId+ " and project "+project.projectId);

            if (report.name.indexOf("Quarter") >= 0) {
                report.generatedBy = "Quarter";
                db.report.save(report);
            }
            else if (report.generatedBy && report.generatedBy.indexOf('Annual Progress Reporting') == 0) {
                report.generatedBy = "Annual";
                db.report.save(report);
            }
            else if (report.name.indexOf("Annual Progress Report") == 0) {
                report.generatedBy = "Annual";
                db.report.save(report);
            }
            else if (report.generatedBy && report.generatedBy.indexOf('Short term') == 0) {
                report.generatedBy = 'Outcomes Report 1';
                db.report.save(report);
            }
            else if (report.name.indexOf("Semester") > 0) {
                report.generatedBy = 'Semester';
                db.report.save(report);
            }
            else if (report.reportId == '115db64d-e722-4887-94c0-f2b1677e9adb') {
                report.generatedBy = 'Quarter';
                db.report.save(report);
            }
        }

    }

}

// Correct some Semester labels back to Quarter
db.report.update({activityId:'71973372-5699-424a-8745-d611c56c8ca4'}, {$set:{generatedBy:'Quarter'}});
db.report.update({activityId:'dccd28db-cd0a-4ab7-a1e5-6b0565a3c8a0'}, {$set:{generatedBy:'Quarter'}});
db.report.update({activityId:'9dc95c8c-1d54-49b8-b04d-c89337d705d5'}, {$set:{generatedBy:'Quarter'}});

db.report.update({activityId:'a952baa4-52e3-48ff-9630-ee59a0170c03'}, {$set:{generatedBy:'Quarter'}});
db.report.update({activityId:'19e79418-760d-417e-aa89-6447dd091b2a'}, {$set:{generatedBy:'Quarter'}});
db.report.update({activityId:'6b560e65-54b1-4df7-86ac-24784e936d8a'}, {$set:{generatedBy:'Quarter'}});


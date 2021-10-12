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
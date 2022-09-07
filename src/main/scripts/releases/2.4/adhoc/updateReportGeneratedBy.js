var subprograms = [
    'Departmental', 'Direct source procurement',
    'NHT Emerging Priorities',
    'Pest Mitigation and Habitat Protection',
    'Post-fire monitoring',
    'Regional Fund - Co-design NRMs',
    'Regional Fund - Co-design Koalas',
    'Regional Land Partnerships',
    'Strategic and Multi-regional projects - NRM',
    'Strategic and Multi-regional - Koalas']

subprograms.forEach(function (subProgram) {
    var prog = db.program.find({name: subProgram}).next();

    var rlpProjects = db.project.find({programId:prog.programId, status:{$ne:'deleted'}});

    var expectedLabels = ['Quarter', 'Semester', 'Annual', 'Outcomes Report 1', 'Outcomes Report 2', 'Final Report'];

    while (rlpProjects.hasNext()) {
        var project = rlpProjects.next();
        var reports = db.report.find({projectId:project.projectId, status:{$ne:'deleted'}});

        while (reports.hasNext()) {
            var report = reports.next();

            if (expectedLabels.indexOf(report.generatedBy) < 0) {

                print("Found label: "+report.generatedBy+" for report "+report.name+ "("+report.reportId+") in and project "+project.projectId);

                if (report.name.indexOf("Quarter") >= 0) {
                    report.generatedBy = 'Quarter';
                    db.report.save(report);
                }
                else if (report.name.indexOf("Semester") >= 0) {
                    report.generatedBy = 'Semester';
                    db.report.save(report);
                }
                else if (report.name.indexOf("Annual Progress Report") >= 0) {
                    report.generatedBy = "Annual";
                    db.report.save(report);
                }
                else if (report.name.indexOf("Outcomes Report 1") >= 0) {
                    report.generatedBy = 'Outcomes Report 1';
                    db.report.save(report);
                }
                else if (report.name.indexOf("Outcomes Report 2") >= 0) {
                    report.generatedBy = 'Outcomes Report 2';
                    db.report.save(report);
                }
                else if (report.name.indexOf("Final Report") >= 0) {
                    report.generatedBy = 'Final Report';
                    db.report.save(report);
                }
            }
        }
    }

});



var programs = [
    'Departmental',
    'NHT Emerging Priorities',
    'Direct source procurement',
    'Flood Recovery Tranche 1',
    'Pest Mitigation and Habitat Protection',
    'Post-fire monitoring',
    'Regional Fund - Co-design Koalas',
    'Regional Fund - Co-design NRMs',
    'Strategic and Multi-regional - Koalas',
    'Strategic and Multi-regional projects - NRM',
    'Regional Land Partnerships'];

for (var i=0; i<programs.length; i++) {
    var program = db.program.findOne({name:programs[i]});
    print("Updating reports for program: "+program.name);
    if (program.config.projectReports) {

        for (var j=0; j<program.config.projectReports.length; j++) {
            var reportConfig = program.config.projectReports[j];
            if (reportConfig.category.indexOf("Output") >= 0 ||
                reportConfig.category.indexOf("Annual") >= 0 ||
                reportConfig.category.indexOf("Progress") >= 0) {
                reportConfig.minimumReportDurationInDays = 1;

                print("Updating report: "+reportConfig.category);
            }
        }
    }
    db.program.save(program);
    print("*************************************");
}
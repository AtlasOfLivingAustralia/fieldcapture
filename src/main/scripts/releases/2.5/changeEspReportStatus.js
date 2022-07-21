load('../../utils/audit.js');
var auditUserId = '<system>'; // Update me before running.
var status = 'readonly';
var subprograms = ['LMCW1', 'LHQS-QLD', 'LM1', 'LM2', 'MEC1', 'MEC 2', 'LHQS-NSW'];
for (var i=0; i<subprograms.length; i++) {
    var programId = db.program.findOne({name:subprograms[i]}).programId;
    var projectIds = db.project.distinct('projectId', {programId:programId});

    for (var j=0; j<projectIds.length; j++) {
        var reports = db.report.find({projectId:projectIds[j], status:{$ne:'deleted'}});
        while (reports.hasNext()) {
            var report = reports.next();
            if (report.status != status) {
                report.status = status;
                print("Updating report status to "+status+" for "+report.description);
                db.report.save(report);
                audit(report, report.reportId, 'au.org.ala.ecodata.Report', auditUserId);
            }
        }

    }
}
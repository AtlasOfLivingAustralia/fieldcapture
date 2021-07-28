// Script to check in Audit log if any dataset deleted from the project when meri plan is saved. github issue #2299

var programs = db.program.find({});
programs.forEach(function(program) {
    var projects = db.project.find({programId: program.programId, "custom.dataSets": {$exists: false}, status: {$ne: "deleted"}})
    projects.forEach(function (project) {
        var dataSets = db.auditMessage.find({projectId: project.projectId, entityType: /Project/, "entity.custom.dataSets": {$exists: true}}).sort({date: -1});
        dataSets.forEach(function (dataset) {
            print("Project that have dataSets in audit log: " + dataset.entity.projectId + " User Id: " + dataset.userId + " Date: " + dataset.date + "data set Length: " + dataset.entity.custom.dataSets.length)
        })
    })
});

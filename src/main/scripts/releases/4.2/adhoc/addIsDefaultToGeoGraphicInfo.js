load('../../../utils/audit.js');
var userId = "system";
db.project.find({"geographicInfo": {$exists: true},
    "geographicInfo.isDefault": {$exists: false}}
).forEach(function(project) {
    if (project.geographicInfo && project.geographicInfo.isDefault === undefined) {
        project.geographicInfo.isDefault = false;
        db.project.save(project);
        audit(project, project.projectId, 'au.org.ala.ecodata.Project', userId, undefined, "Update");
        print("Updated project: " + project.projectId);
    }
});
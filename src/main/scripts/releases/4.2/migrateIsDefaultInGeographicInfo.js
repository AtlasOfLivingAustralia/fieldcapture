load( "../../utils/audit.js");
var count = 0;
db.project.find({isMERIT: true, "geographicInfo.isDefault": true}).forEach(function (project) {
    project.geographicInfo.overridePrimaryElectorate = true
    project.geographicInfo.overridePrimaryState = true
    db.project.updateOne({projectId: project.projectId}, {$set: {geographicInfo: project.geographicInfo}});
    audit(project, project.projectId, 'au.org.ala.ecodata.Project', "system")
    print("updated " + project.projectId);
    count ++;
});

print("total updates " + count);
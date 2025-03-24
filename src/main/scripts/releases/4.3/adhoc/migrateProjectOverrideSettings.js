load('../../../utils/audit.js');
let projects = db.project.find({$or:[{'geographicInfo.primaryState':{$ne:null}}, {'geographicInfo.primaryElectorate':{$ne:null}}]});
while (projects.hasNext()) {
    let project = projects.next();
    let changed = false;
    if (project.geographicInfo.primaryState && !project.geographicInfo.overridePrimaryState) {
        project.geographicInfo.overridePrimaryState = true;
        changed = true;
    }
    if (project.geographicInfo.primaryElectorate && !project.geographicInfo.overridePrimaryElectorate) {
        project.geographicInfo.overridePrimaryElectorate = true;
        changed = true;
    }
    if (changed) {
        print("Updating project " + project.projectId);
        db.project.updateOne({projectId: project.projectId}, {$set: {geographicInfo: project.geographicInfo}});
        audit(project, project.projectId, 'au.org.ala.ecodata.Project', "system");
    }

}
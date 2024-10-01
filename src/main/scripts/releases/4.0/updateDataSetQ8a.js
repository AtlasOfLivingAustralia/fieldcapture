load('../../utils/audit.js');
let adminUserId = 'TBA';
let projects = db.project.find({'custom.dataSets.type': {$exists:true}});
while (projects.hasNext()) {
    let changed = false;
    let project = projects.next();
    let dataSets = project.custom.dataSets;
    for (let i=0; i<dataSets.length; i++) {
        let dataSet = dataSets[i];
        if (dataSet.type != null) {
            if (dataSet.type == 'Baseline dataset associated with a project outcome') {
                dataSet.type = 'Baseline';
                changed = true;
                print("match")
            }
            else if (dataSet.type == 'Project progress dataset that is tracking change against an established project baseline dataset') {
                dataSet.type = 'Indicator';
                changed = true;
                print("match")
            }
            else {
                print("non matching type: "+dataSet.type)
            }
        }
    }
    if (changed) {
        db.project.replaceOne({_id: project._id}, project);
        audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId, project.projectId);
    }


}
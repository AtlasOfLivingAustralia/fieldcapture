load('../../../audit.js');
const adminUserId = 'system';
let projects = db.projects.find({'custom.dataSets':{$ne:null}});
while (projects.hasNext()) {
    let project = projects.next();
    for (let i = 0; i<project.custom.dataSets.length; i++) {
        let dataSet = project.custom.dataSets[i];

        delete dataSet.collectorType;
        delete dataSet.qa;
        delete dataSet.published;
        delete dataSet.storageType;
    }
    db.project.replaceOne({_id:project._id}, project);
    audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);
}


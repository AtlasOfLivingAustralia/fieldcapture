load('../../../utils/audit.js');
let projects = db.project.find({'custom.details.lastUpdated':/.*0$/});
while (projects.hasNext()) {
    let project = projects.next();

    let date = new Date(project.custom.details.lastUpdated);
    let dateStr = date.toISOString().split('.')[0] + 'Z';
    project.custom.details.lastUpdated = dateStr;

    db.project.replaceOne({_id:project._id}, project);
    audit(project, project.projectId, 'au.org.ala.ecodata.Project', '<system>');

}
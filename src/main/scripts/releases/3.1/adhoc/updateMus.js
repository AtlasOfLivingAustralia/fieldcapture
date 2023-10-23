load('../../../utils/audit.js');
let adminUserId = 'system';
const projects = [
    ['PWP-MU42-P1', 'South NRM Region'],
    ['PWP-MU40-P1', 'North West NRM Region'],
    ['PWP-MU30-P1', 'Port Phillip and Western Port'],
    ['PWP-MU17-P2', 'Kangaroo Island'],
    ['PWP-MU19-P1', 'South Australian Murray Darling Basin'],
    ['PWP-MU21-P1', 'South Australian Arid Lands'],
    ['PWP-MU20-P1', 'Northern and Yorke'],
    ['PWP-MU15-P1', 'Alinytjara Wilurara'],
    ['PWP-MU37-P1', 'South Coast Region']];

for (let i=0; i<projects.length; i++) {
    let project = db.project.findOne({grantId:projects[i][0]});
    let mu = db.managementUnit.findOne({name:projects[i][1]});
    if (project && mu) {
        project.managementUnitId = mu.managementUnitId;
        db.project.replaceOne({_id:project._id}, project);
        audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);
    }
    else {
        print('No project or management unit found for ' + projects[i][0]);
    }
}


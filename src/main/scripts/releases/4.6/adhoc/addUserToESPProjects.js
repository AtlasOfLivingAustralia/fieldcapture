load('../../../utils/audit.js');

let espProgram = db.program.findOne({name:'Environmental Stewardship'});
let subProgramIds = db.program.distinct('programId', {parent:DBRef('program', espProgram._id)});

const userToInsert = '232001';
const adminUserId = 'admin';

for (let i=0; i<subProgramIds.length; i++) {
    let subProgramId = subProgramIds[i];

    let projects = db.project.find({programId: subProgramId});
    while (projects.hasNext()) {
        let project = projects.next();

        if (project.status == 'active') {
            let permission = {userId: userToInsert, entityType:'au.org.ala.ecodata.Project', entityId:project.projectId, accessLevel:'caseManager', status:'active'}
            db.userPermission.insert(permission);
            permission = db.userPermission.findOne({userId: userToInsert, entityType:'au.org.ala.ecodata.Project', entityId:project.projectId});
            audit(permission, permission._id, 'au.org.ala.ecodata.UserPermission', adminUserId, project.projectId, 'Insert');
        }


    }
}
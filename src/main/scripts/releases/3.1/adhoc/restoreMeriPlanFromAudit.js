load('../../../utils/audit.js');
let adminUserId = '1493';
let auditMessageId = ObjectId('65f110e2d687b746afe0a71f');
let auditMessage = db.auditMessage.findOne({_id:auditMessageId});

print(auditMessage);

let projectId = auditMessage.entityId;

let project = db.project.findOne({projectId:projectId});

project.custom.details = auditMessage.entity.custom.details;
project.outputTargets = auditMessage.entity.outputTargets;
project.custom.details.lastUpdated = '2024-03-14T11:13:09+11:00'

printjson(project);
db.project.replaceOne({projectId:projectId}, project);

audit(project, projectId, 'au.org.ala.ecodata.Project', adminUserId);


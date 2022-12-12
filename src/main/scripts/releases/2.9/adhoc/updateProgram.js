load('../../../utils/audit.js');
var projectId = 'e2fb146e-07e2-4c20-918e-d6d4abaffe77';
var programId = 'fd1d3618-2ae7-4a21-a744-84e7f9a6b7d8';
var adminUserId = 'tba';


db.project.update({projectId:projectId}, {$set:{programId:programId}});
audit(db.project.findOne({projectId:projectId}), projectId, 'au.org.ala.ecodata.Project', projectId);

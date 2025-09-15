load("../../../utils/audit.js");
const adminUserId = 'system';
const projectId = '718c6e69-5266-495d-88d7-b84b932afab7';

let project = db.project.findOne({projectId: projectId});

const site1 = 'af520122-27ce-4828-af32-0a14bba76960';
const site2 = '04c0d971-87f0-4f95-8b3f-cbe7e270883c';

// Remove activities associated with the sites to be deleted.
db.activity.updateMany({siteId: site1, projectId: projectId}, {$set: {status:'deleted', lastUpdated: ISODate()}});
db.site.update({siteId: site1}, {$set: {status:'deleted', lastUpdated: ISODate()}});
db.activity.updateMany({siteId: site2, projectId: projectId}, {$set: {status:'deleted', lastUpdated: ISODate()}});
db.site.update({siteId: site2}, {$set: {status:'deleted', lastUpdated: ISODate()}});

printjson(project.custom.dataSets.length);
for (var i = 0; i < project.custom.dataSets.length; i++) {
    if (project.custom.dataSets[i].siteId === site1 || project.custom.dataSets[i].siteId === site2) {
        printjson(project.custom.dataSets.splice(i, 1));
        i--;
    }
}
project.lastUpdated = ISODate();
printjson(project.custom.dataSets.length);

db.project.replaceOne({projectId: projectId}, project);
audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId, undefined, "Update");


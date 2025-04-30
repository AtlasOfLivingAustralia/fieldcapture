load('../../../utils/audit.js');

const adminUserId = 'system';

function removeSite(project, siteId) {
    let dataSets = project.custom.dataSets;

    let dataSetIds = [];

    for (let i = 0; i < dataSets.length; i++) {
        let dataSet = dataSets[i];
        if (dataSet.siteId == siteId) {
            dataSetIds.push(dataSet.dataSetId);
            dataSet.siteId = null;
            print("Removing siteId from dataSet: " + dataSet.dataSetId+  ", "+ dataSet.name);
        }
    }

    // Delete the site
    db.site.update({siteId: siteId}, {$set: {status: 'deleted'}});
    db.project.replaceOne({projectId: projectId}, project);

    audit(project, projectId, 'au.org.ala.ecodata.Project', adminUserId);
    audit(db.site.findOne({siteId:siteId}), siteId, 'au.org.ala.ecodata.Site', adminUserId, null, 'Delete');

    print("Resync required for the following data sets: ");
    printjson(dataSetIds);
}

const projectId = '718c6e69-5266-495d-88d7-b84b932afab7';

let project = db.project.findOne({projectId: projectId});

// NSMNET0001 - Not applicable (Core)
let siteId = 'af520122-27ce-4828-af32-0a14bba76960';
removeSite(project, siteId);

// NSMNET0002 - Not applicable (Core)
siteId = '04c0d971-87f0-4f95-8b3f-cbe7e270883c';
removeSite(project, siteId);

// NSMNET0003 - Impact (Core)
siteId = '5881f919-d75d-4f37-94a1-d1062450ed11';
removeSite(project, siteId);

load("../../../utils/audit.js");
const systemUserId = 'system';
const projectId = 'f4a0642b-49b7-4ec3-9be5-e7e65a25cb78';
const siteId = '3a005864-6b28-484f-babc-e47286517404';

const oldSiteName = 'VCNLPVVP0002';
const newSiteName = 'VCNLPSVP0002';

let project = db.project.findOne({ projectId: projectId });

let dataSets = project.custom.dataSets;
for (let i = 0; i < dataSets.length; i++) {
    if (dataSets[i].siteId === siteId) {
        if (dataSets[i].name.indexOf(oldSiteName) >= 0) {
            let newName = dataSets[i].name.replace(oldSiteName, newSiteName);
            print("Renaming dataSet " + dataSets[i].dataSetId + " from " + dataSets[i].name + " to " + newName + " in project " + projectId);
            dataSets[i].name = newName;
        }
    }
}

project.lastUpdated = ISODate();
db.project.replaceOne({ projectId: projectId }, project);
audit(project, project.projectId, 'au.org.ala.ecodata.Project', systemUserId);

// Rename the site to keep
let site = db.site.findOne({siteId: siteId});
if (site) {
    let newName = site.name.replace(oldSiteName, newSiteName);
    let newDescription = site.description.replace(oldSiteName, newSiteName);
    print("Renaming site " + siteId + " from " + site.name + " to " + newName);
    site.name = newName;
    site.description = newDescription;
    site.lastUpdated = ISODate();
    db.site.replaceOne({siteId: siteId}, site);
    audit(site, site.siteId, 'au.org.ala.ecodata.Site', systemUserId, project.projectId, "Update");
}


// And the related plot selection
let plotSelectionId = 'c642126e-6249-431d-b6f4-68ebf67ef2a5';
site = db.site.findOne({siteId: plotSelectionId});
if (site) {
    let newName = site.name.replace(oldSiteName, newSiteName);
    let newDescription = site.description.replace(oldSiteName, newSiteName);
    print("Renaming site " + plotSelectionId + " from " + site.name + " to " + newName);
    site.name = newName;
    site.description = newDescription;
    site.lastUpdated = ISODate();
    db.site.replaceOne({siteId: plotSelectionId}, site);
    audit(site, site.siteId, 'au.org.ala.ecodata.Site', systemUserId, project.projectId, "Update");
}
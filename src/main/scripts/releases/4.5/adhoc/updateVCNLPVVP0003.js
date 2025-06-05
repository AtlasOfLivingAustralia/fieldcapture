load("../../../utils/audit.js");
const systemUserId = 'system';
const projectId = 'f4a0642b-49b7-4ec3-9be5-e7e65a25cb78';

// Fix issues around duplicate VCNLPSVP0003 (also needs to be renamed from VCNLPVVP0003
const toDeleteSiteId = '6855fdb2-0146-43c3-aaac-6d1353a8e531';
const toKeepSiteId = '5872fd7d-45a4-4ed0-8f10-c3658d207d90';

let project = db.project.findOne({ projectId: projectId });

const oldSiteName = 'VCNLPVVP0003';
const newSiteName = 'VCNLPSVP0003';

let dataSets = project.custom.dataSets;
let activityId = null;
for (let i = 0; i < dataSets.length; i++) {
    if (dataSets[i].siteId === toDeleteSiteId) {

        activityId = dataSets[i].activityId;
        project.custom.dataSets.splice(i, 1);
        i--;
        print("Removing dataSet with name " + oldSiteName + " from project " + projectId);

    }
    else if (dataSets[i].name.indexOf(oldSiteName) >= 0) {
        let newName = dataSets[i].name.replace(oldSiteName, newSiteName);
        print("Renaming dataSet " + dataSets[i].dataSetId + " from " + dataSets[i].name + " to " + newName + " in project " + projectId);
        dataSets[i].name = newName;
    }

}

project.lastUpdated = ISODate();
db.project.replaceOne({ projectId: projectId }, project);
audit(project, project.projectId, 'au.org.ala.ecodata.Project', systemUserId);

// Delete the activity associated with the site to be deleted
if (activityId) {
    let activity = db.activity.findOne({activityId: activityId});
    activity.status = 'deleted';
    activity.lastUpdated = ISODate();
    db.activity.replaceOne({activityId: activity.activityId}, activity);

    audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', systemUserId, activity.projectId, "Delete");

}


let site = db.site.findOne({siteId: toDeleteSiteId});
if (site) {
    site.status = 'deleted';
    site.lastUpdated = ISODate();
    db.site.replaceOne({siteId: toDeleteSiteId}, site);
    audit(site, site.siteId, 'au.org.ala.ecodata.Site', systemUserId, project.projectId, "Delete");
}

// Rename the site to keep
site = db.site.findOne({siteId: toKeepSiteId});
if (site) {
    let newName = site.name.replace(oldSiteName, newSiteName);
    let newDescription = site.description.replace(oldSiteName, newSiteName);
    print("Renaming site " + toKeepSiteId + " from " + site.name + " to " + newName);
    site.name = newName;
    site.description = newDescription;
    site.lastUpdated = ISODate();
    db.site.replaceOne({siteId: toKeepSiteId}, site);
    audit(site, site.siteId, 'au.org.ala.ecodata.Site', systemUserId, project.projectId, "Update");
    print("Updated site name to " + newSiteName + " for siteId " + toKeepSiteId);
}
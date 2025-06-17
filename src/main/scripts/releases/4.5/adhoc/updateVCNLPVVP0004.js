load("../../../utils/audit.js");
const systemUserId = 'system';
const projectId = 'f4a0642b-49b7-4ec3-9be5-e7e65a25cb78';

// Fix issues around duplicate VCNLPSVP0004 (also needs to be renamed from VCNLPVVP0004
const toDeleteSiteId = '83f33f65-e0fe-4801-b9e3-2ccb5fce85e6';
const toKeepSiteId = 'b98ffdfa-6d66-4228-a862-5adc666dac2a';

let project = db.project.findOne({ projectId: projectId });

const toMoveDataSetIds = ['5f67ff44-2f6b-444f-aec9-572de0e92b4e', 'a941dbe7-9a0f-4f84-a3ce-f51d0c39f8f9', 'f57b2b34-bdc7-4e91-b28f-5e231f63cad5 ', '40982ac4-8464-4d1a-a1da-9dc7c1ae979d'];
const oldSiteName = 'VCNLPVVP0004';
const newSiteName = 'VCNLPSVP0004';

let dataSets = project.custom.dataSets;
for (let i = 0; i < dataSets.length; i++) {
    if (toMoveDataSetIds.includes(dataSets[i].dataSetId)) {
        if (dataSets[i].siteId !== toKeepSiteId) {
            dataSets[i].siteId = toKeepSiteId;
            print("Setting siteId to " + toKeepSiteId + " for plot description dataSet " + dataSets[i].dataSetId);
        }
        let activity = db.activity.findOne({ activityId: dataSets[i].activityId });
        activity.siteId = toKeepSiteId;
        db.activity.replaceOne({ activityId: dataSets[i].activityId }, activity);
        audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', 'system', undefined, "Update");
    }
    else if (dataSets[i].siteId === toDeleteSiteId) {

        project.custom.dataSets.splice(i, 1);
        i--;
        print("Removing dataSet with name " + oldSiteName + " from project " + projectId);
        continue;
    }
    if (dataSets[i].name.indexOf(oldSiteName) >= 0) {
        let newName = dataSets[i].name.replace(oldSiteName, newSiteName);
        print("Renaming dataSet " + dataSets[i].dataSetId + " from " + dataSets[i].name + " to " + newName + " in project " + projectId);
        dataSets[i].name = newName;
    }

}

project.lastUpdated = ISODate();
db.project.replaceOne({ projectId: projectId }, project);
audit(project, project.projectId, 'au.org.ala.ecodata.Project', systemUserId);

let activities = db.activity.find({siteId:toDeleteSiteId});
while (activities.hasNext()) {
    let activity = activities.next();
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
}


// And the related plot selection
let plotSelectionId = '36fe96d8-9dfb-4501-8b87-c194103bcdeb';
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
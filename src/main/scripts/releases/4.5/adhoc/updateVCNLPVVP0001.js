load("../../../utils/audit.js");
const systemUserId = 'system';
const projectId = 'f4a0642b-49b7-4ec3-9be5-e7e65a25cb78';

// Fix issues around duplicate VCNLPSVP0001 (also needs to be renamed from VCNLPVVP0001
const toDeleteSiteId = '3fc11f96-38e0-45a6-9c61-a40a2e4f00c2';
const toKeepSiteId = '80ed862b-430f-4e95-be81-b7efb11bccfd';

let project = db.project.findOne({ projectId: projectId });

const plotDescriptionDataSetId = '7631ef2a-e3d6-4058-83c6-09351eb6cb61';
const oldSiteName = 'VCNLPVVP0001';
const newSiteName = 'VCNLPSVP0001';

let dataSets = project.custom.dataSets;
for (let i = 0; i < dataSets.length; i++) {
    if (dataSets[i].dataSetId == plotDescriptionDataSetId) {
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
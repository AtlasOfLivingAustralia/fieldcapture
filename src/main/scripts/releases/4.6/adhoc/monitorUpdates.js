load("../../../utils/audit.js");
const adminUserId = 'system';
const projectId = '01a4896e-bc4a-4ba5-9768-a40cf15e236b';

let project = db.project.findOne({projectId: projectId});

const goodSite = '4c7157ba-775e-4705-9b1b-efb6a838408d';
const duplicateSite = '10f2df75-98d5-4251-9c69-d0558f632bb8';

const siteIdFor0001 = 'a34eea96-c237-40c3-ba21-837da81ad1f5';

const duplicateDataSetId = '2416a307-7390-4d41-b120-874d620619f7'

for (var i = 0; i < project.custom.dataSets.length; i++) {
    if (project.custom.dataSets[i].siteId === duplicateSite) {
        project.custom.dataSets[i].siteId = goodSite;
        let activity = db.activity.findOne({activityId: project.custom.dataSets[i].activityId});
        activity.siteId = goodSite;
        db.activity.replaceOne({activityId: activity.activityId}, activity);
        audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', adminUserId, undefined, "Update");
    }
    else if (project.custom.dataSets[i].dataSetId === duplicateDataSetId) {

        let activity = db.activity.findOne({activityId: project.custom.dataSets[i].activityId});
        activity.status = 'deleted';
        db.activity.replaceOne({activityId: activity.activityId}, activity);
        audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', adminUserId, undefined, "Update");
        project.custom.dataSets.splice(i, 1);
        i--; // Adjust index since we removed an item
    }
    else if (project.custom.dataSets[i].dataSetId === 'b6271ab5-f22a-4cb9-9778-18fd50b5103c') {
        project.custom.dataSets[i].siteId = siteIdFor0001;
    }
}
project.lastUpdated = ISODate();

db.project.replaceOne({projectId: projectId}, project);
audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId, undefined, "Update");

db.site.updateOne({siteId: duplicateSite}, {$set: {status: 'deleted', lastUpdated: ISODate()}});
let ducpliateSiteValue = db.site.findOne({siteId: duplicateSite});
audit( ducpliateSiteValue, 'au.org.ala.ecodata.Site', adminUserId, undefined, "Update");
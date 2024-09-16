load( "../../../utils/audit.js");
function removeDataSetSite(projectId, dataSetId, adminUserId) {
    let project = db.project.findOne({projectId: projectId});
    let dataSet = null;
    for (let i=0; i<project.custom.dataSets.length; i++) {
        if (project.custom.dataSets[i].dataSetId === dataSetId) {
            dataSet = project.custom.dataSets[i];
            break;
        }
    }
    if (!dataSet) {
        print("No data set with dataSetId found in project: " + dataSetId);
        return;
    }
    let siteId = dataSet.siteId;
    dataSet.siteId = null;

    let site = db.site.findOne({siteId: siteId});
    site.status = 'deleted';
    site.lastUpdated = ISODate();
    db.site.replaceOne({siteId: siteId}, site);
    audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId);

    project.lastUpdated = ISODate();
    db.project.replaceOne({projectId: projectId}, project);
    audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);

}
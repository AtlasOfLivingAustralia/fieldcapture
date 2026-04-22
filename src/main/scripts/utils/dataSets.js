load( "../../../utils/audit.js");
function removeDataSetSite(projectId, dataSetId, adminUserId, deleteSite) {
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

    if (deleteSite) {
        let site = db.site.findOne({siteId: siteId});
        site.status = 'deleted';
        site.lastUpdated = ISODate();
        db.site.replaceOne({siteId: siteId}, site);
        audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId);

    }

    project.lastUpdated = ISODate();
    db.project.replaceOne({projectId: projectId}, project);
    audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);

}

function moveDataSet(dataSetId, fromProjectId, toProjectId, adminUserId) {

    let fromProject = db.project.findOne({projectId:fromProjectId});
    let toProject = db.project.findOne({projectId:toProjectId});

    let dataSet = null;
    for (let i=0; i<fromProject.custom.dataSets.length; i++) {
        dataSet = fromProject.custom.dataSets[i];
        if (dataSet.dataSetId === dataSetId) {
            fromProject.custom.dataSets.splice(i, 1);
            break;
        }
    }

    if (!dataSet) {
        throw "No dataset found with dataSetId "+dataSetId+" in project "+fromProjectId;
    }
    if (dataSet.reportId) {
        throw "Data set with dataSetId "+dataSetId+" is used in a report: "+dataSet.reportId;
    }

    toProject.custom.dataSets.push(dataSet);
    let site = null;
    if (dataSet.siteId) {
        site = db.site.findOne({siteId:dataSet.siteId});
        if (site.projects.length !== 1 || site.projects[0] !== fromProjectId) {
            throw "Site "+dataSet.siteId + " is not associated with the project "+fromProjectId;
        }
        site.projects[0] = toProjectId;
    }
    fromProject.lastUpdated = ISODate();
    toProject.lastUpdated = ISODate();

    db.project.replaceOne({projectId:fromProjectId}, fromProject);
    audit(fromProject, fromProjectId, 'au.org.ala.ecodata.Project', adminUserId);
    db.project.replaceOne({projectId:toProjectId}, toProject);
    audit(toProject, toProjectId, 'au.org.ala.ecodata.Project', adminUserId);

    if (site) {
        site.lastUpdated = ISODate();
        db.site.replaceOne({siteId:site.siteId}, site);
        audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId, toProjectId);
    }



}
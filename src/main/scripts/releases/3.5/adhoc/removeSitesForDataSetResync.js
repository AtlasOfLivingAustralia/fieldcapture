load('../../../utils/audit.js');
let adminUserId = '<FIXME>';
let userId = '<FIXME>';
let projectId = '<FIXME>';
let sites = db.site.find({projects:projectId, name:/Camera Trap Deployment site/});
let project = db.project.findOne({projectId:projectId});
while (sites.hasNext()) {
    let site = sites.next();
    if (site.extent.geometry.decimalLatitude > 0) {

        site.status = 'deleted';
        db.site.replaceOne({siteId:site.siteId},site);
        audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId, project.projectId, "Update");
        print("Deleted site "+site.name+" ("+site.siteId+")");

        let ds = project.custom.dataSets;
        for (let i=0; i<ds.length; i++) {
            if (ds[i].siteId === site.siteId) {
                ds[i].siteId = null;
                print("Removed siteId for dataSet "+ds[i].name+" from project "+project.name);

                print('https://ecodata.ala.org.au/reSubmitDataSet/'+project.projectId+'?dataSetId='+ds[i].dataSetId+'&userId='+userId);

                break;
            }
        }
    }
    else {
        print("Ignoring site "+site.name+" with latitude "+site.extent.geometry.decimalLatitude);
    }

}
db.project.replaceOne({projectId:project.projectId},project);
audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId, project.projectId, "Update");
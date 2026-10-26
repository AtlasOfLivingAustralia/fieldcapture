load('../../../utils/audit.js');
const adminUserId = 'system';

let projectId1 = 'ba3f2d5d-0b63-481d-b096-3d1eb520bc7c';
let projectId2 = '5d8a2cbf-dc3a-41d6-be02-3a327292be64';

addPlotsFromOneProjectToAnother(projectId1, projectId2);
addPlotsFromOneProjectToAnother(projectId2, projectId1);

function addPlotsFromOneProjectToAnother(projectIdFrom, projectIdTo) {
    let sites1 = db.site.find({projects: projectIdFrom, 'externalIds.idType': 'MONITOR_PLOT_SELECTION_GUID'});
    print("Found " + sites1.count() + " plots in project " + projectIdFrom);
    while (sites1.hasNext()) {
        let site = sites1.next();

        print("Found plot " + site.siteId + " with name " + site.name);
        if (site.projects.indexOf(projectIdTo) < 0) {
            site.projects.push(projectIdTo);

            print("Adding plot " + site.siteId + " to project " + projectIdTo);

            db.site.replaceOne({siteId: site.siteId}, site);
            audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId);
        }
    }
}
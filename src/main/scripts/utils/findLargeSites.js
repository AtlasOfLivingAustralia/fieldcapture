load('turf-packaged.js');
function findLargeSitesForProject(projectId) {
    let sites = db.site.find({projects:projectId, status:{$ne:'deleted'}});
    let count = 0;
    while (sites.hasNext()) {
        const site = sites.next();
        examineSite(site);
        count++;
    }
    print("Processed "+count+" sites");
}

function examineSite(site) {

    let coordCount = 0;
    let geojson = null;
    // This is a reporting site with embedded sites
    if (site.features) {
        geojson = {type:'FeatureCollection', features:site.features};
    }
    else {
        if (site.extent && site.extent.geometry) {
            geojson = site.extent.geometry;
        }
    }
    if (geojson) {
        turf.meta.coordEach(geojson, function() { coordCount++ });
    }
    else {
        print("No geojson for Site "+site.siteId+", "+site.name)
    }

    if (coordCount > 3) {
        print("Site "+site.siteId+", "+site.name+" has "+coordCount);
        if (site.features) {

            for (var i=0; i<site.features.length; i++) {
                coordCount = 0;
                turf.meta.coordEach(site.features[i], function() { coordCount++ });
                print(" - feature "+site.features[i].properties['id']+"("+site.features[i].properties['name']+") has "+coordCount);
            }
        }
    }
}

//findLargeSitesForProject('');

examineSite(db.site.findOne({siteId:'30bf41ed-941d-4d7b-9e0a-942903a999ed'}));
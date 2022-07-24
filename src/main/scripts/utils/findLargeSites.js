load('turf-packaged.js');
function findLargeSitesForProject(projectId) {
    let sites = db.site.find({projects:projectId, status:{$ne:'deleted'}});
    let count = 0;
    while (sites.hasNext()) {
        const site = sites.next();
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

        if (coordCount > 3000) {
             print("Site "+site.siteId+", "+site.name+" has "+coordCount);
        }
        count++;
    }
    print("Processed "+count+" sites");
}

findLargeSitesForProject('');
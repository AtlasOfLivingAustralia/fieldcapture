let sites = db.site.find({'externalIds.idType':'MONITOR_PLOT_GUID', 'extent.geometry.type':'Point', features:{$exists:false}});
while (sites.hasNext()) {
    let site = sites.next();

    if (!site.externalIds.length == 1) {
        print("ERROR: "+siteId+" has more than one externalId");
    }
    else {
        site.externalIds[0].idType = 'MONITOR_PLOT_SELECTION_GUID';
        db.site.replaceOne({_id:site._id}, site);
        print("Updated site "+site.siteId+', '+site.name);
    }
}
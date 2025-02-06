let hub = db.hub.findOne({urlPath:'merit'});
hub.availableFacets.push('services')
hub.adminFacets.push('services');

db.hub.replaceOne({urlPath:'merit'}, hub);
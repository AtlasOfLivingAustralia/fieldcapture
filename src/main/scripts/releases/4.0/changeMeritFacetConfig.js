let hub = db.hub.findOne({urlPath:'merit'});
const electFacetIndex = hub.adminFacets.indexOf('electFacet');
hub.adminFacets.splice(electFacetIndex, 1);
hub.officerFacets = ['electFacet'];
db.hub.replaceOne({hubId:hub.hubId}, hub);
let hub = db.hub.findOne({urlPath:'merit'});
let servicesFacetIndex = hub.availableFacets.indexOf('services');
if (servicesFacetIndex < 0) {
    hub.availableFacets.push('services');
}
hub.officerFacets = ['muFacet', 'projectElectFacet', 'services'];

servicesFacetIndex = hub.adminFacets.indexOf('services');
if (servicesFacetIndex >= 0) {
    hub.adminFacets.splice(servicesFacetIndex, 1);
}
let muFacetIndex = hub.adminFacets.indexOf('muFacet');
if (muFacetIndex >= 0) {
    hub.adminFacets.splice(muFacetIndex, 1);
}

db.hub.replaceOne({urlPath:'merit'}, hub);
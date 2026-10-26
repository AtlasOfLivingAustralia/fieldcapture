load( "../../utils/audit.js");
var newFacet = 'meriPlanAssetTypeFacet';
var adminUserId = "system";
let hub = db.hub.findOne({urlPath:'merit'});
if (hub.adminFacets.indexOf(newFacet) < 0) {
    hub.adminFacets.push(newFacet);
    changed = true;
}
if (hub.availableFacets.indexOf(newFacet) < 0) {
    hub.availableFacets.push(newFacet);
    changed = true;
}
if (changed) {
    db.hub.updateOne({hubId: hub.hubId}, {$set: hub});
    audit(hub, hub.hubId, 'au.org.ala.ecodata.Hub', adminUserId, undefined, "Update");
    print(`Updated hub - ${hub.urlPath}`);
};
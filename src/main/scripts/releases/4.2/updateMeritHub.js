load( "../../utils/audit.js");
var oldAndNewFacets = {electFacet: 'autoElectFacet', stateFacet: 'autoStateFacet'}
var propsToCheck = ["adminFacets", "availableFacets", "availableMapFacets", "officerFacets"]
var oldFacets = Object.keys(oldAndNewFacets);
var adminUserId = "system";
db.hub.find({urlPath:'merit'}).forEach(function (hub){
    propsToCheck.forEach(function (prop){
        if (hub[prop]) {
            for(var index = 0; index < oldFacets.length; index++) {
                var oldFacet = oldFacets[index];
                var indexOfOldFacet = hub[prop].indexOf(oldFacet);
                if( indexOfOldFacet >= 0) {
                    hub[prop][indexOfOldFacet] = oldAndNewFacets[oldFacet];
                }
            }
        }
    });

    db.hub.updateOne({hubId: hub.hubId}, {$set: hub});
    audit(hub, hub.hubId, 'au.org.ala.ecodata.Hub', adminUserId, undefined, "Update");
    print(`Updated hub - ${hub.urlPath}`);
});
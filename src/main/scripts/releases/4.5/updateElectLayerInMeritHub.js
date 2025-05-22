load('../../utils/audit.js');
const adminUserId = 'system';
const electLayerId = 'cl11225';
const stateLayerId = 'cl927';

let meritHub = db.hub.findOne({urlPath:'merit'});

meritHub.geographicConfig.checkForBoundaryIntersectionInLayers = [stateLayerId, electLayerId];
meritHub.geographicConfig.contextual.elect = electLayerId;

db.hub.replaceOne({urlPath:'merit'}, meritHub);
audit(meritHub, meritHub.hubId, 'au.org.ala.ecodata.Hub', adminUserId);
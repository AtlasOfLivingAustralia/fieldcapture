load('../../utils/audit.js');
let meritHub = db.hub.findOne({urlPath:'merit'});
meritHub.geographicConfig.contextual.lga = 'cl11014';
db.hub.replaceOne({hubId:meritHub.hubId}, meritHub);
audit(meritHub, meritHub.hubId, 'au.org.ala.ecodata.Hub', '<system>');
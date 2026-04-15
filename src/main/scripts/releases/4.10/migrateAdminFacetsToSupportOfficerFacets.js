load('../../utils/audit.js');
let meritHub = db.hub.findOne({urlPath:'merit'});
if (!meritHub.supportOfficerFacets) {
    meritHub.supportOfficerFacets = meritHub.adminFacets;
    meritHub.adminFacets = [];
    db.hub.replaceOne({hubId:meritHub.hubId}, meritHub);
    audit(meritHub, meritHub.hubId, 'au.org.ala.ecodata.Hub', '<system>');
}
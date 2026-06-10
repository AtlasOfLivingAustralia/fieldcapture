let hub = db.hub.findOne({urlPath:'merit'});
const hubId = hub.hubId;

db.project.updateMany({hubId:hubId, portfolio:null}, {$set: {portfolio:'Environment'}});
db.project.updateMany({hubId:hubId, portfolio:''}, {$set: {portfolio:'Environment'}});
db.project.updateMany({hubId:hubId, portfolio:'Environment and Water'}, {$set: {portfolio:'Environment'}});
db.project.updateMany({hubId:hubId, portfolio:'Yes'}, {$set: {portfolio:'Environment'}});
db.project.updateMany({hubId:hubId, portfolio:'DCCEEW/DAFF'}, {$set: {portfolio:'Environment and Agriculture'}});

if (hub.officerFacets.indexOf('portfolio') < 0) {
    hub.officerFacets.push('portfolio');

    db.hub.replaceOne({hubId:hubId}, hub);
}

let portfolioIndex = hub.availableFacets.indexOf('portfolio');
if (portfolioIndex >= 0) {
    hub.availableFacets.splice(portfolioIndex, 1);
}
hub.availableFacets.splice(4, 0, 'portfolio');
db.hub.replaceOne({hubId:hubId}, hub);

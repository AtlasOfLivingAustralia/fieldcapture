load('../../../utils/audit.js');
const adminUserId = 'system';

var priorities = [
    {
        "category": "Reduce emissions and build resilience",
        "priority": "Climate change adaptation"
    },
    {
        "category": "Reduce emissions and build resilience",
        "priority": "On-farm emissions reduction practices"
    },
    {
        "category": "Harness carbon and biodiversity incentives",
        "priority": "Carbon and biodiversity market information"
    },
    {
        "category": "Harness carbon and biodiversity incentives",
        "priority": "Sustainability framework engagement"
    },
    {
        "category": "Harness carbon and biodiversity incentives",
        "priority": "Market access and traceability"
    },
    {
        "category": "Drive agricultural growth",
        "priority": "Native vegetation and biodiversity on-farm"
    },
    {
        "category": "Drive agricultural growth",
        "priority": "Soil carbon"
    },
    {
        "category": "Drive agricultural growth",
        "priority": "Soil erosion"
    },
    {
        "category": "Drive agricultural growth",
        "priority": "Soil acidification"
    },
    {
        "category": "Drive agricultural growth",
        "priority": "Sustainable agriculture practices"
    }
];

var mus = db.managementUnit.find({});
while(mus.hasNext()){
    var m = mus.next();
    db.managementUnit.updateOne({name:m.name},{$push:{"priorities": {$each : priorities}}});
    audit(m, m.managementUnitId, 'au.org.ala.ecodata.ManagementUnit', adminUserId, null, 'Update');
}
load( "../../utils/audit.js");
var adminUserId = 'system'
var indigenousWorkforcePerformanceScoreId = '5d28e47f-5182-4ad7-91f7-074908fb66e4';
var indigenousSupplyChainPerformanceScoreId = 'f7a537fd-cb38-4392-a0db-5e02beec6aa0';
var indigenousSupplyChainValueScoreId = 'e3227a01-177f-4ec1-9c09-3c1cc755cf19';

var scores = [
    {
        "category": "Indigenous Procurement",
        "configuration": {
            "filter": {
                filterValue: "Regional capacity services - reporting",
                property: "name",
                type: "filter"
            },
            "childAggregations": [{
                "property": "data.workforcePerformancePercentage",
                "type": "AVERAGE"
            }]
        },
        "description": "",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": true,
        "label": "Indigenous workforce performance (% of Indigenous FTE achieved to date/% FTE target for Indigenous employment to date)",
        "outputType": "Regional capacity services - reporting",
        "scoreId": indigenousWorkforcePerformanceScoreId,
        "status": "active",
        "name":"targetIndigenousParticipationPercentage"
    },
    {
        "category": "Indigenous Procurement",
        "configuration": {
            "filter": {
                filterValue: "Regional capacity services - reporting",
                property: "name",
                type: "filter"
            },
            "childAggregations": [{
                "property": "data.supplyChainPerformancePercentage",
                "type": "AVERAGE"
            }]
        },
        "description": "",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": true,
        "label": "Indigenous supply chain performance (% of procurement from Indigenous suppliers achieved to date/% procurement target of procurement from Indigenous suppliers at end of Deed period)",
        "outputType": "Regional capacity services - reporting",
        "scoreId": indigenousSupplyChainPerformanceScoreId,
        "status": "active",
        "name":"targetIndigenousProcurementPercentage"
    },
    {
        "category": "Indigenous Procurement",
        "configuration": {
            "filter": {
                filterValue: "Regional capacity services - reporting",
                property: "name",
                type: "filter"
            },
            "childAggregations": [{
                "property": "data.servicesContractedValueFirstNations",
                "type": "SUM"
            }]
        },
        "description": "",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": false,
        "label": "Total reported value of services contracted to First Nations",
        "outputType": "Regional capacity services - reporting",
        "scoreId": indigenousSupplyChainValueScoreId,
        "status": "active",
        "name":"totalValueServicesContractedToFirstNations"
    }

];

for (var i=0; i<scores.length; i++) {
    var existing = db.score.find({label:scores[i].label});
    if (existing.hasNext()) {
        var existingScore = existing.next();
        existingScore.configuration = scores[i].configuration;
        existingScore.name = scores[i].name;
        db.score.replaceOne({label:scores[i].label}, existingScore);

        audit(scores[i], scores[i].scoreId, 'au.org.ala.ecodata.Score', adminUserId, undefined, 'Update');

    }
    else {
        db.score.insert(scores[i]);
        audit(scores[i], scores[i].scoreId, 'au.org.ala.ecodata.Score', adminUserId, undefined, 'Create');
    }

}
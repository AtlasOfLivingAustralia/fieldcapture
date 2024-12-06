load("../../utils/uuid.js");
load( "../../utils/audit.js");
load( "../../utils/addService.js");

let adminUserId = '<system>'
addService("Indigenous Procurement", NumberInt(47), 'Regional Capacity Services Report', 'Regional capacity services - reporting', undefined, adminUserId);


// These have been pre-generated as there is value in having the same id in all environments
var indigenousWorkforcePerformanceScoreId = '5d28e47f-5182-4ad7-91f7-074908fb66e4';
var indigenousSupplyChainPerformanceScoreId = 'f7a537fd-cb38-4392-a0db-5e02beec6aa0';

var scores = [
    {
        "category": "Indigenous Procurement",
        "configuration": {
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
        "label": "Indigenous workforce performance",
        "outputType": "Regional capacity services - reporting",
        "scoreId": indigenousWorkforcePerformanceScoreId,
        "status": "active"
    },
    {
        "category": "Indigenous Procurement",
        "configuration": {
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
        "label": "Indigenous supply chain performance",
        "outputType": "Regional capacity services - reporting",
        "scoreId": indigenousSupplyChainPerformanceScoreId,
        "status": "active"
    }
];

for (var i=0; i<scores.length; i++) {
    var existing = db.score.find({label:scores[i].label});
    if (existing.hasNext()) {
        var existingScore = existing.next();
        existingScore.configuration = scores[i].configuration;
        db.score.replaceOne({label:scores[i].label}, existingScore);
    }
    else {
        db.score.insert(scores[i]);
    }
    audit(scores[i], scores[i].scoreId, 'au.org.ala.ecodata.Score', adminUserId, undefined, 'Update');

}

const targetsConfig = {
    "periodGenerationConfig": {
        "reportType": "Administrative",
        "reportDescriptionFormat": "Regional capacity services report %d for %4$s",
        "reportNameFormat": "Regional capacity report %d",
        "reportingPeriodInMonths": 12,
        "minimumReportDurationInDays": 1,
        "label": "Annual",
        "category": "Regional Capacity Services Reporting",
        "activityType": "Regional Capacity Services Report",
        "periodStart": "2022-06-30T14:00:00Z",
        "periodEnd": "2027-06-30T13:59:59Z"
    },
    "periodLabelFormat": "MMM YYYY"
};

function findRcsReportConfig(reports) {
    for (let i=0; i<reports.length; i++) {
        if (reports[i].activityType == 'Regional Capacity Services Report') {
            return reports[i];
        }
    }
    return null;
}
db.organisation.find({'config.organisationReports':{$exists:true}}).forEach(function(org){
    let rcsReportConfig = findRcsReportConfig(org.config.organisationReports);
    if (!rcsReportConfig) {
        return;
    }
    // Adjust the target config to match the period in which the RCS reporting is happening.
    targetsConfig.periodGenerationConfig.periodStart = rcsReportConfig.periodStart;
    targetsConfig.periodGenerationConfig.periodEnd = rcsReportConfig.periodEnd;

    org.config.targets = targetsConfig;

    //org.config.serviceTargets = serviceTargetsConfig;
    print("updating organisation "+org.name+' , id: '+org.organisationId);
    db.organisation.replaceOne({organisationId:org.organisationId}, org);
    audit(org, org.organisationId, 'au.org.ala.ecodata.Organisation', adminUserId, undefined, 'Update');
});
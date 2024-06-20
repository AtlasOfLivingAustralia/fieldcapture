load("../../utils/addService.js")
var userId = "4228"
var serviceName = "Developing farm/project/site management plan"
var sectionName = "Management plan development"
var label = "Developing Management Plans"
var newOutputs = [
    {formName: "Grants and Others Progress Report", sectionName: sectionName},
    {formName: "Procurement Output Report", sectionName: sectionName}
];
var service = db.service.findOne({name: serviceName})
if (!service) {
    throw "Service not found: " + serviceName
}

// add to all NHT programs
var programLabels = service.programLabels || {}
var nhtPrograms = db.program.find({'config.meriPlanContents.template':'extendedKeyThreats'}, {programId: true})
while(nhtPrograms.hasNext()) {
    var program = nhtPrograms.next()
    programLabels[program.programId] = {label: label}
}

var outputs = service.outputs || [];
for (var i = 0; i < newOutputs.length; i++) {
    if (!outputs.find(function (output) { return output.formName === newOutputs[i].formName && output.sectionName === newOutputs[i].sectionName })) {
        outputs.push(newOutputs[i]);
    }
}

db.service.updateOne({serviceId: service.serviceId}, {$set: {programLabels: programLabels, outputs: outputs, lastUpdated: ISODate()}});
service = db.service.findOne({name: serviceName});
audit(service, service.serviceId, 'au.org.ala.ecodata.Service', userId, undefined, "Update");

var scores = [
    {
        "configuration": {
            "label": "Number of management plans developed",
            "childAggregations": [
                {
                    "filter": {
                        "filterValue": sectionName,
                        "property": "name",
                        "type": "filter"
                    },
                    "childAggregations": [
                        {
                            "property": "data.managementPlans.numberOfPlansDeveloped",
                            "type": "SUM"
                        }
                    ]
                }
            ]
        },
        "outputType": sectionName,
        "entityTypes": [
            "Grants and Others Progress Report",
            "Procurement Output Report"
        ],
        "label": "Number of management plans developed",
        "units": "",
        "category": "Natural Heritage Trust",
        "isOutputTarget": true,
        "status": "active",
        "scoreId": "8113ab8a-17e6-43c9-be32-9ca72dd01454"
    },
    {
        "configuration": {
            "label": "Area (ha) covered by management plans",
            "childAggregations": [
                {
                    "filter": {
                        "filterValue": sectionName,
                        "property": "name",
                        "type": "filter"
                    },
                    "childAggregations": [
                        {
                            "property": "data.managementPlans.areaCoveredByPlanHa",
                            "type": "SUM"
                        }
                    ]
                }
            ]
        },
        "outputType": sectionName,
        "entityTypes": [
            "Grants and Others Progress Report",
            "Procurement Output Report"
        ],
        "label": "Area (ha) covered by management plans",
        "units": "",
        "category": "Natural Heritage Trust",
        "isOutputTarget": true,
        "status": "active",
        "scoreId": "9f6f06ac-b055-48c1-9d80-b305acdeae79"
    }
]

for(var i = 0; i < scores.length; i++) {
    var score = scores[i];
    if(!db.score.findOne({scoreId: score.scoreId})) {
        db.score.insertOne(score);
        audit(score, score.scoreId, 'au.org.ala.ecodata.Score', userId, undefined, "Insert");
    }
    else {
        db.score.replaceOne({scoreId: score.scoreId}, score);
        audit(score, score.scoreId, 'au.org.ala.ecodata.Score', userId, undefined, "Update");
    }
}

// add service Obtaining Relevant Approvals – Number of relevant approvals obtained
outputs = [
    {
        formName: "Grants and Others Progress Report",
        sectionName: "Obtaining approvals"
    },
    {
        formName: "Procurement Output Report",
        sectionName: "Obtaining approvals"
    }
]
addService("Obtaining Relevant Approvals", 46, undefined, undefined, outputs, userId)

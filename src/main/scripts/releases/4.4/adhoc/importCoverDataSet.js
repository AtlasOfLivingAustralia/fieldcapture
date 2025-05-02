load('../../../utils/audit.js');
const fs = require('fs');
let adminUserId = 'system', forceUpdate= true;
var result, dataSetId= "1aae7917-fffc-49cd-8883-36ee78129a6d",
    activity = {
        "dateCreated": ISODate("2025-04-23T01:51:00.390Z"),
        "lastUpdated": ISODate("2025-04-23T01:51:00.390Z"),
        "activityId": "19b04e07-3fde-4dc2-899f-0401043dfa8d",
        "endDate": ISODate("2025-04-09T18:56:51.000Z"),
        "startDate": ISODate("2025-02-26T11:25:05.000Z"),
        "userId": "198733",
        "siteId": "8a271899-0279-4e71-a4e8-9a0186afa4b0",
        "assessment": false,
        "plannedStartDate": ISODate("2025-02-26T11:25:05.000Z"),
        "progress": "finished",
        "externalIds": [
            {
                "idType": "MONITOR_MINTED_COLLECTION_ID",
                "externalId": "1aae7917-fffc-49cd-8883-36ee78129a6d"
            }
        ],
        "type": "Cover - Enhanced",
        "plannedEndDate": ISODate("2025-04-09T18:56:51.000Z"),
        "status": "active",
        "projectId": "c9c9d206-9a9d-41bb-b984-7f692d4474ac",
        "description": "Activity submitted by monitor",
        "formVersion": 1,
        "publicationStatus": "published"
    },
    output = {
        "dateCreated": ISODate("2025-04-23T01:51:00.395Z"),
        "lastUpdated": ISODate("2025-04-23T01:51:00.395Z"),
        "activityId": "19b04e07-3fde-4dc2-899f-0401043dfa8d",
        "outputId": "509c3646-22cb-4a99-9ac0-6d6a47de5508",
        "status": "active"
    },
    datasetUpdate = {
        "activityId": activity.activityId,
        "areSpeciesRecorded": true,
        "startDate": ISODate("2025-02-26T11:25:05Z"),
        "endDate": ISODate("2025-04-09T18:56:51Z"),
        "sizeUnknown": true,
        "lastUpdated": ISODate("2025-04-17T04:50:59Z")
    },
    records = JSON.parse(fs.readFileSync('./ecodata.record.json', 'utf8'));

if(forceUpdate) {
    result = db.activity.deleteOne({"activityId": activity.activityId});
    print("Activity deleted");
    printjson(result);
    result = db.output.deleteOne({"outputId": output.outputId});
    print("Output deleted");
    printjson(result);
    result = db.record.deleteMany({"activityId": activity.activityId});
    print("Records deleted");
    printjson(result);
}

if (db.activity.find({"activityId": activity.activityId}).count() === 0) {
    result = db.activity.insertOne(activity);
    print("Activity inserted");
    printjson(result);
    audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', adminUserId, null, 'Insert');
}

if (db.output.find({"outputId": output.outputId}).count() === 0) {
    result = db.output.insertOne(output);
    print("Output inserted");
    printjson(result);
    audit(output, output.outputId, 'au.org.ala.ecodata.Output', adminUserId, null, 'Insert');
}

var project = db.project.findOne({"projectId": activity.projectId});
var dataset = project.custom.dataSets.filter(function (dataSet) {
    return dataSet.dataSetId === dataSetId;
});

for (var key in datasetUpdate) {
    dataset[0][key] = datasetUpdate[key];
}

result = db.project.updateOne(
    {"projectId": activity.projectId},
    {
        "$set": {
            "custom.dataSets": project.custom.dataSets
        }
    }
);

audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId, null, 'Update');

print("Project updated");
printjson(result);

var dateFields = ["lastUpdated", "dateCreated", "verbatimEventDate"];
for (var i = 0; i < records.length; i++) {
    delete records[i]._id
    for (var j = 0; j < dateFields.length; j++) {
        if (records[i][dateFields[j]]) {
            records[i][dateFields[j]] = ISODate(records[i][dateFields[j]].$date);
        }
    }
}

if (db.record.find({"activityId": activity.activityId}).count() === 0) {
    result = db.record.insertMany(records);
    print("Records inserted");
    printjson(result);

    for (var i = 0; i < records.length; i++) {
        audit(records[i], records[i].occurrenceID, 'au.org.ala.ecodata.Record', adminUserId, null, 'Insert');
    }
}

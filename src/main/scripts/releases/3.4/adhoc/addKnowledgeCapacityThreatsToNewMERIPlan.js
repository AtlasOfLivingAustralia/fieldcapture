var deleteExisting = false;
var result
var newThreats = [
    "Knowledge/Capacity - Insufficient knowledge to inform appropriate management or intervention actions",
    "Knowledge/Capacity - Inadequate scientific and/or technological capacity"
]

if (deleteExisting) {
    result = db.program.updateMany(
        {'config.meriPlanContents.template': 'extendedKeyThreats'},
        {
            "$pull": {
                'config.keyThreatCodes': {"$in": newThreats}
            }
        }
    )

    print("Programs with threat removed: " + result.modifiedCount);
}

result = db.program.updateMany(
    {'config.meriPlanContents.template':'extendedKeyThreats'},
    {
        "$push": {
            'config.keyThreatCodes': {
                "$each": newThreats,
                "$sort": 1
            }
        }
    }
)
print("Programs updated: " + result.modifiedCount);
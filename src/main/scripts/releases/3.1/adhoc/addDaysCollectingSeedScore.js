load('../../../utils/uuid.js');
const label = "Number of days collecting seeds/cuttings";
let score = db.score.findOne({label:label, status:{$ne:'deleted'}});
const config = {
    "childAggregations": [
        {
            "filter": {
                "property": "name",
                "filterValue": "NHT - Seed Collection",
                "type": "filter"
            },
            "childAggregations": [
                {
                    "property": "data.areasOfSeedCollection.seedCollectionDetails.numberDaysCollecting",
                    "type": "SUM"
                }
            ]
        }
    ]
}
if (!score) {
    // Insert the score
    score = {
        scoreId: UUID.generate(),
        label: label,
        status: 'active',
        isOutputTarget: true,
        category: 'RLP and Bushfire Recovery',
        outputType: "Seed Collection",
        configuration: config,
        dateCreated: ISODate(),
        lastUpdated: ISODate()
    };
    db.score.insertOne(score);
    print("Created score "+score.label);
};

let programs = db.program.find({'config.programServiceConfig.serviceFormName':'NHT Output Report'});

while (programs.hasNext()) {
    let program = programs.next();

    let serviceConfig = program.config.programServiceConfig.programServices;
    for (let i=0; i<serviceConfig.length; i++) {
        if (serviceConfig[i].serviceId == 36) { // Seed Collection service
            if (serviceConfig[i].serviceTargets.indexOf(score.scoreId) < 0) {
                serviceConfig[i].serviceTargets.push(score.scoreId);
                db.program.replaceOne({_id:program._id}, program);
                print("Added score to program "+program.name);
                break;
            }
        }
    }
}



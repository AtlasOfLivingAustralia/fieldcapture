load('../utils/audit.js');
load('../utils/program.js');

var dryRun = true;
var adminUserId = 'system';

var serviceId = NumberInt(45);
var scoreId = 'd5f769b8-2377-4357-84bb-8782d2e27dcb';

var score = {
    _id: ObjectId('6a5d71b703017c4c63e01ae0'),
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Research and Development',
    scoreId: scoreId,
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    status: 'active',
    label: 'Number of hours conducting research and/or development for this reporting period',
    configuration: {
        childAggregations: [
            {
                filter: {
                    property: 'name',
                    filterValue: 'NHT - Research and development',
                    type: 'filter'
                },
                childAggregations: [
                    {
                        property: 'data.noHoursConductingResearchAndDevelopment',
                        type: 'SUM'
                    }
                ]
            }
        ]
    }
};

// Create the score if it is missing.
var existingScore = db.score.findOne({
    scoreId: scoreId
});

var conflictingScore = db.score.findOne({
    _id: score._id,
    scoreId: {
        $ne: scoreId
    }
});

if (conflictingScore) {
    print('ERROR: Score ObjectId is already used by another score:');
    printjson(conflictingScore);
    throw new Error('Cannot create score due to an ObjectId conflict.');
}

if (existingScore) {
    print('Score already exists: ' + scoreId);
} else if (dryRun) {
    print('DRY RUN: Would insert score:');
    printjson(score);
} else {
    db.score.insertOne(score);
    audit(score, scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Insert'
    );
    print('Inserted score: ' + scoreId);
}

// Find programs that contain service 45 and do not contain the new score under service 45.
var query = {
    'config.meriPlanContents.template': 'extendedKeyThreats',
    'config.programServiceConfig.programServices': {
        $elemMatch: {
            serviceId: serviceId,
            serviceTargets: {
                $ne: scoreId
            }
        }
    }
};

var matchingCount = db.program.countDocuments(query);
var programs = db.program.find(query).sort({name: 1});

var updatedCount = 0;

print('');
print('Programs requiring an update: ' + matchingCount);

while (programs.hasNext()) {
    var program = programs.next();

    updateProgramServiceConfig(program, serviceId, [scoreId]);

    if (dryRun) {
        print('DRY RUN: Would update ' + program.name + ' (' + program.programId + ')');
        continue;
    }

    var result = db.program.updateOne({programId: program.programId},
        {
            $set: {
                config: program.config
            }
        }
    );

    if (result.modifiedCount === 1) {
        audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, 'Update');
        updatedCount++;
        print('Updated ' + program.name);
    }
}

print('');

if (dryRun) {
    print('DRY RUN complete. No database changes were made.');
    print('Programs that would be updated: ' + matchingCount);
} else {
    print('Complete.');
    print('Programs updated: ' + updatedCount);
}
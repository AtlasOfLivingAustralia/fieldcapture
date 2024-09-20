load('../../../utils/addService.js');
load('../../../utils/scores.js');
let userId = 'system';
addService('Creation and improvement of green and blue spaces', NumberInt(47), 'Grants and Others Progress Report', 'Creation and improvement of green and blue spaces', undefined, userId);
let config = {
    "childAggregations": [
        {
            "filter": {
                "property": "name",
                "filterValue": "Creation and improvement of green and blue spaces",
                "type": "filter"
            },
            "childAggregations": [
                {
                    "property": "data.numberOfGreenAndBlueSpacesCreatedOrImproved",
                    "type": "SUM"
                }
            ]
        }
    ]
};
let scoreId = 'f22c68ae-3d15-4104-bd72-0c36f2319039';
addScore(scoreId,
    'Number of green and blue spaces created or improved',
    'RLP and Bushfire Recovery',
    'Sums the number of green and/or blue spaces created or improved by a project/program',
    'Creation and improvement of green and blue spaces',
    config,
    true,
    userId);


let programs = [
    'Urban Rivers and Catchments Round 1 Election Commitments - 6 month reports',
    'Urban Rivers and Catchments Round 1 Election Commitments - 12 month reports'
]

for (let programName of programs) {
    let program = db.program.findOne({name: programName});
    let programServices = program.config.programServiceConfig.programServices;
    let found = false;
    for (service of programServices) {
        if (service.serviceId == NumberInt(47)) {
            found = true;
        }
    }

    if (!found) {
        programServices.push({
            serviceId: NumberInt(47),
            "serviceTargets": [
                scoreId
            ]
        });
        db.program.replaceOne({programId:program.programId}, program);
        audit(program, program.programId, 'au.org.ala.ecodata.Program', userId, undefined, 'Update');
    }
}
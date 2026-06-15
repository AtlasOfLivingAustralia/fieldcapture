load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
load("../../../utils/addService.js")

const adminUserId = "system";
const initialScoreId = '99bd36b0-5a87-4c69-a46b-064499708310';
const followUpScoreId = '5a2af425-34bf-4ac8-a9b9-04a679504588';
//var label = "Sediment Reduction"
var serviceName = "Image pairing to document on-ground change"
var sectionName = "Image pairing to document on-ground change"
var newOutputs = [
    {formName: "NHT Output Report", sectionName: sectionName},
    {formName: "Grants and Others Progress Report", sectionName: sectionName},
    {formName: "Procurement Output Report", sectionName: sectionName}
];


addService(serviceName, NumberInt(58), undefined, undefined, newOutputs, adminUserId)

let scores = [
    {
        scoreId: initialScoreId,
        entityTypes: undefined,
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: sectionName,
        isOutputTarget: true,
        category: "Reporting",
        status: 'active',
        label: 'Number of locations of actual images or imagery collected - initial',
        description: '',
        configuration: {
            childAggregations: [
                {
                    filter: {
                        property: 'name',
                        filterValue: sectionName,
                        type: 'filter'
                    },
                    childAggregations: [
                        {
                            property: 'data.totalActualImagesCollectedInitial',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        }
    }
    ,
    {
        scoreId: followUpScoreId,
        label: 'Number of locations of actual images or imagery collected - follow-up',
        status: 'active',
        isOutputTarget: true,
        category: "Reporting",
        outputType: sectionName,
        configuration: {
            childAggregations: [
                {
                    filter: {
                        property: 'name',
                        filterValue: sectionName,
                        type: 'filter'
                    },
                    childAggregations: [
                        {
                            property: 'data.totalActualImagesCollectedFollowup',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        }
    }];


for (let i=0; i<scores.length; i++) {
    let score = scores[i];

    let savedScore = db.score.findOne({scoreId: score.scoreId});
    if (!savedScore) {
        db.score.insertOne(score);
        audit(score, score.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Insert');
    }
}

var excludedPrograms = []
var programServices = [
    {
        serviceTargets: [initialScoreId, followUpScoreId],
        serviceId: NumberInt(58)
    }
];

var programs = db.program.find({name: "Urban Rivers and Catchments Round 2 Competitive Grants"});
while (programs.hasNext()) {
    var program = programs.next();
    programServices.forEach(function (programService) {
        updateProgramServiceConfig(program, programService.serviceId, programService.serviceTargets);
    });

    db.program.updateOne({programId: program.programId}, {$set: {config: program.config}});
    audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, "Update");
    print("Updated "+ program.name);
}

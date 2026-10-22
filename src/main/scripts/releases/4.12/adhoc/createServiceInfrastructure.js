load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
load("../../../utils/addService.js");

const adminUserId = "system";
const serviceName = "Infrastructure (Construction, Maintenance, Renovation)";
const sectionName = "Infrastructure (Construction, Maintenance, Renovation)";

const newOutputs = [
    { formName: "Grants and Others Progress Report", sectionName: sectionName },
    { formName: "Procurement Output Report", sectionName: sectionName }
];

addService(serviceName, NumberInt(59), undefined, undefined, newOutputs, adminUserId);

// Define the scores
const completedScoreId = 'b7c0e5f8-29e2-4e44-aff1-327f259d81c6';
const invoicedScoreId = '238f1520-242c-4ac0-b72e-1d1e00047519';
const scores = [
    {
        scoreId: completedScoreId,
        label: 'Total number of structures or facilities built/maintained/renovated completed for this reporting period',
        status: 'active',
        isOutputTarget: true,
        category: "Reporting",
        entity: 'Activity',
        outputType: sectionName,
        configuration: {
            childAggregations: [
                {
                    filter: {
                        property: "name",
                        filterValue: sectionName,
                        type: "filter"
                    },
                    childAggregations: [
                        {
                            property: "data.totalNoOfStructures",
                            type: "SUM"
                        }
                    ]
                }
            ]
        },
        relatedScores: [
            {
                description: 'Invoiced by',
                scoreId: invoicedScoreId
            }
        ],
        dateCreated: ISODate('2026-08-17T11:00:11.160Z'),
        lastUpdated: ISODate('2026-08-17T11:00:11.160Z')
    },
    {
        scoreId: invoicedScoreId,
        label: 'Total number of structures or facilities built/maintained/renovated invoiced for this reporting period',
        status: 'active',
        isOutputTarget: false,
        category: "Reporting",
        entity: 'Activity',
        outputType: sectionName,
        configuration: {
            childAggregations: [
                {
                    filter: {
                        property: "name",
                        filterValue: sectionName,
                        type: "filter"
                    },
                    childAggregations: [
                        {
                            property: "data.totalNoOfStructuresInvoiced",
                            type: "SUM"
                        }
                    ]
                }
            ]
        },
        dateCreated: ISODate('2026-08-17T11:00:11.160Z'),
        lastUpdated: ISODate('2026-08-17T11:00:11.160Z')
    }
];

// Insert score if it doesn't already exist
for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    const existing = db.score.findOne({ scoreId: score.scoreId });
    if (!existing) {
        audit(score, score.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Insert');
        db.score.insertOne(score);
    }
    else {
        db.score.replaceOne({ scoreId: score.scoreId }, score);
        audit(score, score.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Update');
    }
}

// Link service to programs
// const programServices = [
//     {
//         serviceTargets: ["3d03150f-763b-4baf-b49f-60a2dbda0235"],
//         serviceId: NumberInt(59)
//     }
// ];
//
// // Update matching program(s)
// const programs = db.program.find({
//     name: "Reefwise Farming",
//     'config.meriPlanContents.template': 'extendedKeyThreats'
// });
// while (programs.hasNext()) {
//     const program = programs.next();
//
//     programServices.forEach(function (programService) {
//         updateProgramServiceConfig(program, programService.serviceId, programService.serviceTargets);
//     });
//
//     db.program.updateOne({ programId: program.programId }, { $set: { config: program.config } });
//     audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, "Update");
//     print("Updated " + program.name);
// }
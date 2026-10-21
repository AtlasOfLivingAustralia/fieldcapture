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

// Define the score
const scores = [
    {
        scoreId: 'b7c0e5f8-29e2-4e44-aff1-327f259d81c6',
        label: 'Number of days building structures/facilities/infrastructure',
        status: 'active',
        isOutputTarget: true,
        category: "Reporting",
        outputType: 'Number of days building structures/facilities/infrastructure',
        configuration: {
            childAggregations: [
                {
                    filter: {
                        property: "name",
                        filterValue: "Infrastructure survey",
                        type: "filter"
                    },
                    childAggregations: [
                        {
                            property: "data.totalSurveysBaseline",
                            type: "SUM"
                        }
                    ]
                }
            ]
        },
        dateCreated: ISODate('2026-08-17T11:00:11.160Z'),
        lastUpdated: ISODate('2026-08-17T11:00:11.160Z')
    },
    {
        scoreId: '238f1520-242c-4ac0-b72e-1d1e00047519',
        label: 'Number of days renovating or maintaining structures/facilities/infrastructure',
        status: 'active',
        isOutputTarget: true,
        category: "Reporting",
        outputType: 'Number of days renovating or maintaining structures/facilities/infrastructure',
        configuration: {
            childAggregations: [
                {
                    filter: {
                        property: "name",
                        filterValue: "Infrastructure survey",
                        type: "filter"
                    },
                    childAggregations: [
                        {
                            property: "data.totalSurveysBaseline",
                            type: "SUM"
                        }
                    ]
                }
            ]
        },
        dateCreated: ISODate('2026-08-17T11:00:11.160Z'),
        lastUpdated: ISODate('2026-08-17T11:00:11.160Z')
    }
];;

// Insert score if it doesn't already exist
for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    const existing = db.score.findOne({ scoreId: score.scoreId });
    if (!existing) {
        audit(score, score.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Insert');
        db.score.insertOne(score);
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
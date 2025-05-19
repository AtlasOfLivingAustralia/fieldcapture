load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
load("../../../utils/addService.js");

const adminUserId = "system";
const invoiceScoreId = '2d03150f-763b-4baf-b49f-60a2dbda0235';
const label = "Employment - Defined Role";
const serviceName = "Employment - Defined Role";
const sectionName = "RF - Employment Defined Role";

const newOutputs = [
    { formName: "NHT Output Report", sectionName: sectionName },
    { formName: "Grants and Others Progress Report", sectionName: sectionName },
    { formName: "Procurement Output Report", sectionName: sectionName }
];

addService(serviceName, NumberInt(57), undefined, undefined, newOutputs, adminUserId);

// Define the score
const scores = [
    {
        _id: ObjectId('517cde76a291e30890b60fd8'),
        scoreId: '3d03150f-763b-4baf-b49f-60a2dbda0235',
        label: 'Number of FTE',
        status: 'active',
        isOutputTarget: true,
        category: "Natural Heritage Trust",
        outputType: label,
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
                            property: 'data.numberOfFte',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        },
        dateCreated: ISODate('2025-05-14T11:00:11.160Z'),
        lastUpdated: ISODate('2025-05-14T11:00:11.160Z')
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
}

// Link service to programs
const programServices = [
    {
        serviceTargets: ["3d03150f-763b-4baf-b49f-60a2dbda0235"],
        serviceId: NumberInt(57)
    }
];

// Update matching program(s)
const programs = db.program.find({
    name: "Reefwise Farming",
    'config.meriPlanContents.template': 'extendedKeyThreats'
});
while (programs.hasNext()) {
    const program = programs.next();

    programServices.forEach(function (programService) {
        updateProgramServiceConfig(program, programService.serviceId, programService.serviceTargets);
    });

    db.program.updateOne({ programId: program.programId }, { $set: { config: program.config } });
    audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, "Update");
    print("Updated " + program.name);
}
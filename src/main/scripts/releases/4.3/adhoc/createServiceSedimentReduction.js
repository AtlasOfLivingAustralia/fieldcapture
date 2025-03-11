load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
load("../../../utils/addService.js")

const adminUserId = "system";
const invoiceScoreId = '2d03150f-763b-4baf-b49f-60a2dbda0235';
var label = "Sediment Reduction"
var serviceName = "Sediment Reduction"
var sectionName = "LRP - Sediment reduction"
var newOutputs = [
    {formName: "NHT Output Report", sectionName: sectionName},
    {formName: "Grants and Others Progress Report", sectionName: sectionName},
    {formName: "Procurement Output Report", sectionName: sectionName}
];


addService(serviceName, NumberInt(48), undefined, undefined, newOutputs, adminUserId)

let scores = [
    {
        scoreId: invoiceScoreId,
        entityTypes: undefined,
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: label,
        isOutputTarget: false,
        category: "Reporting",
        status: 'active',
        label: 'Invoiced tonnes of sediment saved',
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
                            property: 'data.tonnesOfSedimentSavedInvoiced',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        }
    }
    ,
    {
        _id: ObjectId('617cde76a291e30890b60fd8'),
        scoreId: '8d03150f-763b-4baf-b49f-60a2dbda0235',
        label: 'Tonnes of sediment saved',
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
                            property: 'data.tonnesOfSedimentSaved',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        },
        dateCreated: ISODate('2024-12-17T04:40:11.160Z'),
        lastUpdated: ISODate('2024-12-17T04:40:11.160Z'),
        relatedScores: [
            {
                description: 'Invoiced by',
                scoreId: invoiceScoreId
            }
        ]
    }];


for (let i=0; i<scores.length; i+=2) {
    let invoiced = scores[i];
    let delivered = scores[i+1];

    let savedInvoiced = db.score.findOne({scoreId: invoiced.scoreId});
    if (!savedInvoiced) {
        audit(invoiced, invoiced.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Insert');
        db.score.insertOne(invoiced);
    }

    let savedDelivered = db.score.findOne({scoreId: delivered.scoreId});
    if (!savedDelivered) {
        audit(delivered, delivered.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Insert');
        db.score.insertOne(delivered);
    }
}

var excludedPrograms = []
var programServices = [
    {
        serviceTargets: ["8d03150f-763b-4baf-b49f-60a2dbda0235"],
        serviceId: NumberInt(48)
    }
];

var programs = db.program.find({name: "Landscape Repair Program – Procurement", 'config.meriPlanContents.template':'extendedKeyThreats'})
while (programs.hasNext()) {
    var program = programs.next();
    programServices.forEach(function (programService) {
        updateProgramServiceConfig(program, programService.serviceId, programService.serviceTargets);
    });

    db.program.updateOne({programId: program.programId}, {$set: {config: program.config}});
    audit(program, program.programId, 'au.org.ala.ecodata.Program', userId, undefined, "Update");
    print("Updated "+ program.name);
}

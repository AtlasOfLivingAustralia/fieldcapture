load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
load("../../../utils/addService.js")

const adminUserId = "system";
const invoiceScoreId = '2d02150f-763b-4baf-b49f-60a2dbda0235';
var serviceName = "First Nations Delivery Partners Program PS&O"
var sectionName = "Non-RDP - First Nations Delivery Partners Program PS&O"
var newOutputs = [
    {formName: "NHT Output Report", sectionName: sectionName},
    {formName: "Grants and Others Progress Report", sectionName: sectionName},
    {formName: "Procurement Output Report", sectionName: sectionName}
];


addService(serviceName, NumberInt(50), undefined, undefined, newOutputs, adminUserId)

let scores = [
    {
        scoreId: invoiceScoreId,
        entityTypes: undefined,
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: serviceName,
        isOutputTarget: false,
        category: "Reporting",
        status: 'active',
        label: 'Invoiced PS&O delivered',
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
                            property: 'data.psoDeliveredInvoiced',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        }
    }
    ,
    {
        _id: ObjectId('627cde76a291e30890b60fd8'),
        scoreId: '7d03150f-763b-4baf-b49f-60a2dbda0235',
        label: 'PS&O delivered',
        status: 'active',
        isOutputTarget: true,
        category: "Natural Heritage Trust",
        outputType: serviceName,
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
                            property: 'data.psoDelivered',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        },
        dateCreated: ISODate('2025-03-19T04:40:11.160Z'),
        lastUpdated: ISODate('2025-03-19T04:40:11.160Z'),
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
        serviceTargets: ["7d03150f-763b-4baf-b49f-60a2dbda0235"],
        serviceId: NumberInt(50)
    }
];

var programs = db.program.find({name: "First Nations Delivery Partner"})
while (programs.hasNext()) {
    var program = programs.next();
    programServices.forEach(function (programService) {
        updateProgramServiceConfig(program, programService.serviceId, programService.serviceTargets);
    });

    db.program.updateOne({programId: program.programId}, {$set: {config: program.config}});
    audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, "Update");
    print("Updated "+ program.name);
}

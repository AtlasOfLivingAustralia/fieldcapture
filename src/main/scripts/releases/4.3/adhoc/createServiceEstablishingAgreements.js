load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
load("../../../utils/addService.js")

const adminUserId = "system";
const invoiceScoreId = '12dK3150f-763b-4taf-j49f-60a2dbda4311';
const scoreId = '1103150k-653q-ubag-s49d-60a2dbda0711';
var serviceName = "Establishing Agreements"
var newOutputs = [
    {formName: "NHT Output Report", sectionName: serviceName},
    {formName: "Grants and Others Progress Report", sectionName: serviceName},
    {formName: "Procurement Output Report", sectionName: serviceName}
];


addService(serviceName, NumberInt(49), undefined, undefined, newOutputs, adminUserId)

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
        label: 'Invoiced number of agreements established',
        description: '',
        configuration: {
            childAggregations: [
                {
                    filter: {
                        property: 'name',
                        filterValue: serviceName,
                        type: 'filter'
                    },
                    childAggregations: [
                        {
                            property: 'data.numberAgreementsEstablishedInvoiced',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        }
    }
    ,
    {
        _id: ObjectId('517cde76a291e30890b60fd8'),
        scoreId: scoreId,
        label: 'Number of agreements established',
        status: 'active',
        isOutputTarget: true,
        category: "Natural Heritage Trust",
        outputType: serviceName,
        configuration: {
            childAggregations: [
                {
                    filter: {
                        property: 'name',
                        filterValue: serviceName,
                        type: 'filter'
                    },
                    childAggregations: [
                        {
                            property: 'data.numberAgreementsEstablished',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        },
        dateCreated: ISODate('2025-03-13T04:40:11.160Z'),
        lastUpdated: ISODate('2025-03-13T04:40:11.160Z'),
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
        serviceTargets: [scoreId],
        serviceId: NumberInt(49)
    }
];


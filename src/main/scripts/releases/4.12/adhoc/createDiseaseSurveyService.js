load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
load("../../../utils/addService.js")

const adminUserId = "system";
// It makes program configuration easier if score ids are the same in test as in prod/staging so
// we pre-assign them here.
const baselineScoreId = 'bde1dc53-c6b2-4e74-aa7f-f415731fb1a0';
const indicatorScoreId = '9b3253fe-d021-4888-a9e9-45c7cfd4a16c';
const invoicedBaselineScoreId = '575e47a7-820d-4dc7-a082-11e8009ddad2';
const invoicedIndicatorScoreId = '506f881b-f319-49ee-9e67-e45616db3945';
const baselineScoreIdByOutcome = 'd054a017-69ec-4f97-bbee-be5198eccd4e';
const indicatorScoreIdByOutcome = '8f9b4f5d-3efc-49c0-abe9-359d6fd3eebf';

// Find the next unused service id.
let results = db.service.aggregate([
    {
        $group: {
            _id: null,
            maxLegacyId: { $max: "$legacyId" }
        }
    }
]).toArray();

const serviceId = results[0].maxLegacyId;

const serviceName = "Disease survey"
const sectionName = "Disease survey"
const newOutputs = [
    {formName: "NHT Output Report", sectionName: sectionName},
    {formName: "Grants and Others Progress Report", sectionName: sectionName},
    {formName: "Enhanced Grants Progress Report", sectionName: sectionName},
    {formName: "Procurement Output Report", sectionName: sectionName}
];


addService(serviceName, NumberInt(serviceId), undefined, undefined, newOutputs, adminUserId, 'Survey')

let scores = [
    {
        scoreId: baselineScoreId,
        entityTypes: undefined,
        tags: ['Survey', 'Baseline'],
        displayType: '',
        entity: 'Activity',
        outputType: sectionName,
        isOutputTarget: true,
        category: "Reporting",
        status: 'active',
        label: 'Number of disease surveys conducted - baseline',
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
                            property: 'data.totalSurveysBaseline',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        },
        relatedScores: [
            {
                description: 'Invoiced by',
                scoreId: invoicedBaselineScoreId
            },
            {
                description: 'By outcome',
                scoreId: baselineScoreIdByOutcome
            }
        ]
    },
    {
        scoreId: indicatorScoreId,
        label: 'Number of disease surveys conducted - indicator',
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
                            property: 'data.totalSurveysIndicator',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        },
        relatedScores: [
            {
                description: 'Invoiced by',
                scoreId: invoicedIndicatorScoreId
            },
            {
                description: 'By outcome',
                scoreId: indicatorScoreIdByOutcome
            }
        ],
        tags:['Survey', 'Indicator']
    },
    {
        scoreId: invoicedBaselineScoreId,
        entityTypes: undefined,
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: sectionName,
        isOutputTarget: false,
        category: "Reporting",
        status: 'active',
        label: 'Invoiced number of disease surveys conducted - baseline',
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
                            property: 'data.totalSurveysBaselineInvoiced',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        }
    },
    {
        scoreId: invoicedIndicatorScoreId,
        label: 'Invoiced number of disease surveys conducted - indicator',
        status: 'active',
        isOutputTarget: false,
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
                            property: 'data.totalSurveysIndicatorInvoiced',
                            type: 'SUM'
                        }
                    ]
                }
            ]
        }
    },
    {
        scoreId: baselineScoreIdByOutcome,
        entityTypes: undefined,
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: sectionName,
        isOutputTarget: false,
        category: "Reporting",
        status: 'active',
        label: 'Number of disease surveys conducted by outcome - baseline by related outcomes',
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
                            "groups": {
                                "type": "discrete",
                                "property": "data.diseaseSurveys.relatedOutcomes"
                            },
                            "childAggregations": [
                                {
                                    "property": "data.totalSurveysBaseline",
                                    "type": "SUM"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        scoreId: indicatorScoreIdByOutcome,
        label: 'Number of disease surveys conducted - indicator by related outcomes',
        status: 'active',
        isOutputTarget: false,
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
                            "groups": {
                                "type": "discrete",
                                "property": "data.diseaseSurveys.relatedOutcomes"
                            },
                            "childAggregations": [
                                {
                                    property: 'data.totalSurveysIndicator',
                                    type: 'SUM'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
];


for (let i=0; i<scores.length; i++) {
    let score = scores[i];

    let savedScore = db.score.findOne({scoreId: score.scoreId});
    if (!savedScore) {
        db.score.insertOne(score);
        audit(score, score.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Insert');
    }
    else {
        db.score.replaceOne({scoreId: score.scoreId}, score);
        audit(score, score.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Update');
    }
}

let programServices = [
    {
        serviceTargets: [baselineScoreId, indicatorScoreId],
        serviceId: NumberInt(serviceId)
    }
];

let programs = db.program.find({'config.programServiceConfig':{$exists:true}});
while (programs.hasNext()) {
    let program = programs.next();
    programServices.forEach(function (programService) {
        updateProgramServiceConfig(program, programService.serviceId, programService.serviceTargets);
    });

    db.program.updateOne({programId: program.programId}, {$set: {config: program.config}});
    audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, "Update");
    print("Updated "+ program.name);
}

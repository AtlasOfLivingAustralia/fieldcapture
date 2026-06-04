let scores = [

    {
        scoreId: '9kb244ec-a15r-lb23-l77d-d9317xyza3rk',
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'FTE delivered',
        isOutputTarget: false,
        category: 'Annual Reporting',
        status: 'active',
        label: 'Total FTE supporting and/or delivering the project',
        description: 'An aggregate of the FTE value reported in the Outputs Report PSO header',
        configuration: {
            "childAggregations": [
                {
                    "filter": {
                        "filterValue": "First Nations Delivery Partners PSO",
                        "property": "name",
                        "type": "filter"
                    },
                    "childAggregations": [
                        {
                            "property": "data.fteEquivalent",
                            "type": "SUM"
                        }
                    ]
                }
            ]
        }
    },
    {
        scoreId: 'l7712124-l23j-15ar-80f5-86f9ffcef60v',
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'NHT Communications PSO',
        isOutputTarget: false,
        category: 'Annual Reporting',
        status: 'active',
        label: 'Output report communications',
        description: 'All the communications from the output report',
        configuration: {
            "filter": {
                "filterValue": "First Nations Delivery Partners PSO",
                "type": "filter",
                "property": "name"
            },
            "childAggregations": [
                {
                    "groups": {
                        "type": "discrete",
                        "property": "data.psoCommunicationDetails.communicationMaterialType"
                    },
                    "childAggregations": [
                        {
                            "property": "data.psoCommunicationDetails",
                            "type": "SET"
                        }
                    ]
                }
            ]
        }
    },
];

for (let i = 0; i < scores.length; i++) {
    let score = db.score.findOne({scoreId: scores[i].scoreId});
    if (!score) {
        db.score.insert(scores[i]);
    } else {
        db.score.replaceOne({scoreId: scores[i].scoreId}, scores[i]);
    }
}
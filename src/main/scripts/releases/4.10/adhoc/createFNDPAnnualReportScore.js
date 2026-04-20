let scores = [

    {
        scoreId: '9kb244ec-a15r-lb23-l77d-d9317xyza3rk',
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'FTE',
        isOutputTarget: false,
        category: 'Reporting',
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
    }
];

for (let i = 0; i < scores.length; i++) {
    let score = db.score.findOne({scoreId: scores[i].scoreId});
    if (!score) {
        db.score.insert(scores[i]);
    } else {
        db.score.replaceOne({scoreId: scores[i].scoreId}, scores[i]);
    }
}
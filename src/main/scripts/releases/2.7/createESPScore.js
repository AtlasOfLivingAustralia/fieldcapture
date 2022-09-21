const scoreId = '4d03150f-763b-4baf-b49f-60a2dbda0235';
let score = db.score.findOne({scoreId: scoreId});
if (!score) {
    score = {
        scoreId: scoreId,
        label: 'Total cost of management actions reported in MERIT'
    }
    db.score.insertOne(score);
    score = db.score.findOne({scoreId: scoreId});
}

score.description = 'An aggregate of the values reported in the PMU and SMU forms in the various Total cost of management actions fields';
score.category = 'Environmental Stewardship';
score.outputType = 'Cost of management actions';
score.isOutputTarget = false;
score.entity = 'Activity';
score.status = 'active';
score.units = '$';
score.displayType = null;
score.entityTypes = [];
score.configuration = {
    label: 'Total cost of management actions reported in MERIT',
    childAggregations: [
        {
            filter: {
                filterValue: 'ESP Livestock Grazing Management',
                property: 'name',
                type: 'filter'
            },
            childAggregations: [{property: 'data.cost', type: 'SUM'}]
        },
        {
            filter: {
                filterValue: 'ESP Native herbivore management',
                property: 'name',
                type: 'filter'
            },
            childAggregations: [{property: 'data.cost', type: 'SUM'}]
        },
        {
            filter: {
                filterValue: 'ESP Feral animal management',
                property: 'name',
                type: 'filter'
            },
            childAggregations: [{property: 'data.cost', type: 'SUM'}]
        },
        {
            filter: {
                filterValue: 'ESP Weed management',
                property: 'name',
                type: 'filter'
            },
            childAggregations: [{property: 'data.cost', type: 'SUM'}]
        },
        {
            filter: {
                filterValue: 'ESP Biomass control measures',
                property: 'name',
                type: 'filter'
            },
            childAggregations: [{property: 'data.biomassControl.cost', type: 'SUM'}]
        },
        {
            filter: {
                filterValue: 'ESP Revegetation',
                property: 'name',
                type: 'filter'
            },
            childAggregations: [{property: 'data.planting.cost', type: 'SUM'}]
        },
        {
            filter: {
                filterValue: 'ESP Restoration of Habitat Features',
                property: 'name',
                type: 'filter'
            },
            childAggregations: [{property: 'data.habitatRestoration.cost', type: 'SUM'}]
        },
        {
            filter: {
                filterValue: 'ESP Fencing Paddock Trees',
                property: 'name',
                type: 'filter'
            },
            childAggregations: [{property: 'data.fencing.cost', type: 'SUM'}]
        }
    ]
};

db.score.replaceOne({scoreId: scoreId}, score);

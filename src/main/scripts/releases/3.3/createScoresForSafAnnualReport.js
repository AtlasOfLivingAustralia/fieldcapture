let scores = [

    {
        scoreId: 'e7701823-e534-414e-80f5-86f9eecef50c', // Deliberately coding the score ids to keep consistency between test & prod
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'NHT Communications',
        isOutputTarget: false,
        category: 'Annual Reporting',
        status: 'active',
        label: 'Output report communications',
        description: 'All the communications from the output report',
        configuration: {
            filter: {
                filterValue: 'NHT - Communications',
                type: 'filter',
                property: 'name'
            },
            childAggregations: [ { property: 'data', type: 'SET' } ]
        }
    },

    {
        scoreId: 'f474c538-c8d7-4431-86c3-741163a50a35', // Deliberately coding the score ids to keep consistency between test & prod
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'NHT - Project Engagements',
        isOutputTarget: false,
        category: 'Annual Reporting',
        status: 'active',
        label: 'Project engagements',
        description: 'All the Project engagements from the output report',
        configuration: {
            filter: {
                filterValue: 'NHT - Project Engagements',
                type: 'filter',
                property: 'name'
            },
            childAggregations: [ { property: 'data.engagementDetails', type: 'SET' } ]
        }
    }

];

for (let i=0; i<scores.length; i++) {
    let score = db.score.findOne({scoreId: scores[i].scoreId});
    if (!score) {
        db.score.insert(scores[i]);
    }
    else {
        db.score.replaceOne({scoreId: scores[i].scoreId}, scores[i]);
    }
}
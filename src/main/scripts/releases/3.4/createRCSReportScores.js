let scores = [

    {
        scoreId: '9ae784ec-c50e-4c45-a88e-d9317aaac2ed',
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'Project design requested',
        isOutputTarget: false,
        category: 'RLP and Bushfire Recovery',
        status: 'active',
        label: 'Total project design requested',
        description: 'An aggregate of the values reported in the RCS quarterly question number 11',
        configuration: {
            filter: {
                filterValue: 'Regional capacity services - reporting',
                type: 'filter',
                property: 'name'
            },
            childAggregations: [
                {
                    filter: {
                        type: 'SUM',
                        property: 'data.projectDesignRequested'
                    }
                }]
        }
    },

    {
        scoreId: '2f771f77-a6c3-4b86-8a2a-929254f5c5f3',
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'Work order executed',
        isOutputTarget: false,
        category: 'RLP and Bushfire Recovery',
        status: 'active',
        label: 'Total work order executed',
        description: 'An aggregate of the values reported in the RCS quarterly question number 12',
        configuration: {
            filter: {
                filterValue: 'Regional capacity services - reporting',
                type: 'filter',
                property: 'name'
            },
            childAggregations: [
                {
                    filter: {
                        type: 'SUM',
                        property: 'data.workOrderExecuted'
                    }
                }]
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
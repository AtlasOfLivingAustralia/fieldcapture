let score = {
    entityTypes: [],
    tags: [],
    displayType: '',
    configuration: {
        label: 'Number of field days',
        childAggregations: [
            {
                filter: {
                    filterValue: 'RLP - Output Report Adjustment',
                    type: 'filter',
                    property: 'name'
                },
                childAggregations: [
                    {
                        filter: {
                            filterValue: '06514e13-3aa4-4f3e-805a-16c7b67d3524',
                            type: 'filter',
                            property: 'data.adjustments.scoreId'
                        },
                        childAggregations: [
                            {
                                property: 'data.adjustments.adjustment',
                                type: 'SUM'
                            }
                        ]
                    }
                ]
            },
            {
                filter: {
                    filterValue: 'RLP - Community engagement',
                    property: 'name',
                    type: 'filter'
                },
                childAggregations: [{property: 'data.events.numberOfEvents', type: 'SUM'}]
            },
            {
                filter: {
                    filterValue: 'Community engagement',
                    property: 'name',
                    type: 'filter'
                },
                childAggregations: [{property: 'data.events.numberOfEvents', type: 'SUM'}]
            },
            {
                filter: {
                    filterValue: 'NHT - Community engagement',
                    property: 'name',
                    type: 'filter'
                },
                childAggregations: [{property: 'data.events.numberOfEvents', type: 'SUM'}]
            }
        ]
    },
    entity: 'Activity',
    outputType: 'Community/stakeholder engagement',
    scoreId: 'f9c85612-602e-465c-89e0-e155b34b1f31',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    status: 'active',
    label: 'Number of engagement events'
};

db.score.insert(score);


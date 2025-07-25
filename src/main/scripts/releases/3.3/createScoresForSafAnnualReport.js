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
            childAggregations: [
                {
                    filter: {
                        filterValue: 'Yes',
                        type: 'filter',
                        property: 'data.nhtCommunications'
                    },
                    childAggregations: [{property: 'data', type: 'SET'}]
                }]
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
            childAggregations: [{property: 'data.engagementDetails', type: 'SET'}]
        }
    },
    {
        scoreId: '3117521e-a801-45ef-838f-519c31ca59a2', // Deliberately coding the score ids to keep consistency between test & prod
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'NHT - Project Engagements',
        isOutputTarget: false,
        category: 'Annual Reporting',
        status: 'active',
        label: 'Project engagements by engagement type',
        description: 'All the Project engagements from the output report',
        configuration: {
            filter: {
                filterValue: 'NHT - Project Engagements',
                type: 'filter',
                property: 'name'
            },
            childAggregations: [
                {
                    groups: {
                        "type": "discrete",
                        "property": "data.engagementDetails.engagementType"
                    },
                    "childAggregations": [
                        {property: 'data.engagementDetails', type: 'SET'}
                    ]

                }

            ]
        }
    },
    {
        scoreId: '06c401d9-1370-48d1-9c30-9a6846128f71', // Deliberately coding the score ids to keep consistency between test & prod
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'NHT - Coordinate',
        isOutputTarget: false,
        category: 'Annual Reporting',
        status: 'active',
        label: 'All NHT Coordinate data from the NHT Output report',
        description: 'All NHT Coordinate data from the NHT Output report',
        configuration: {
            filter: {
                filterValue: 'NHT - Coordinate',
                type: 'filter',
                property: 'name'
            },
            childAggregations: [
                {
                    filter: {
                        filterValue: 'Yes',
                        type: 'filter',
                        property: 'data.plansDeveloped'
                    },
                    childAggregations: [
                        {property: 'data.planDetails', type: 'SET'}]
                }]
        }
    },

    {
        scoreId: 'c6b2f62b-06c7-4ea6-9cb3-61ce26ab8200', // Deliberately coding the score ids to keep consistency between test & prod
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'NHT - Coordinate',
        isOutputTarget: false,
        category: 'Annual Reporting',
        status: 'active',
        label: 'All NHT Coordinate planning meetings reporting in the NHT Output report',
        description: 'All NHT Coordinate planning meetings reporting in the NHT Output report',
        configuration: {
            filter: {
                filterValue: 'NHT - Coordinate',
                type: 'filter',
                property: 'name'
            },
            childAggregations: [{property: 'data.meetingDetails', type: 'SET'}]
        }
    },

    {
        scoreId: 'c6b2f62b-06c7-4ea6-9cb3-61ce26ab8200', // Deliberately coding the score ids to keep consistency between test & prod
        entityTypes: [],
        tags: [],
        displayType: '',
        entity: 'Activity',
        outputType: 'NHT - Coordinate',
        isOutputTarget: false,
        category: 'Annual Reporting',
        status: 'active',
        label: 'All NHT Coordinate planning meetings reporting in the NHT Output report',
        description: 'All NHT Coordinate planning meetings reporting in the NHT Output report',
        configuration: {
            filter: {
                filterValue: 'NHT - Coordinate',
                type: 'filter',
                property: 'name'
            },
            childAggregations: [
                {
                    filter: {filterValue: 'Yes', type: 'filter', property: 'data.facilitatedPlanningMeetings'},
                    childAggregations: [{property: 'data.meetingDetails', type: 'SET'}]
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
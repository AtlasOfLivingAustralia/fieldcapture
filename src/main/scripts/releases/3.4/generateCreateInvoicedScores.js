load('../../utils/uuid.js');
let RASL = db.program.findOne({name:"RASL - Recovery Actions for Species and Landscapes"});

let scoreIds = [];
for (let i=0; i<RASL.config.programServiceConfig.programServices.length; i++){
    let service = RASL.config.programServiceConfig.programServices[i];
    scoreIds = scoreIds.concat(service.serviceTargets);
};



let template = {
    scoreId: '', // Deliberately coding the score ids to keep consistency between test & prod
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'NHT Communications',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: '',
    description: '',
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
};

let pairs = [];
for (let i=0; i<scoreIds.length; i++) {
    let invoicedScore = Object.assign({}, template);
    let actualScore = db.score.findOne({scoreId: scoreIds[i]});

    invoicedScore.scoreId = UUID.generate();
    invoicedScore.entityTypes = actualScore.entityTypes;
    invoicedScore.outputType = actualScore.outputType;
    invoicedScore.configuration = actualScore.configuration;
    invoicedScore.label = 'Invoiced '+actualScore.label[0].toLowerCase()+actualScore.label.substring(1, actualScore.label.length);


    printjson(invoicedScore);
    print(',')
    pairs.push([{label: actualScore.label, scoreId:actualScore.scoreId},  {label:invoicedScore.label, scoreId: invoicedScore.scoreId}]);
}

for (let i=0; i<pairs.length; i++) {
    let actualScore = pairs[i][0];
    let invoicedScore = pairs[i][1];
    print('"'+actualScore.label+'",'+actualScore.scoreId+',"'+invoicedScore.label+'",'+invoicedScore.scoreId);
}


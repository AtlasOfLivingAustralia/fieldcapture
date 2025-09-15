load('../../../utils/audit.js');
load('../../../utils/uuid.js');

const score1 = '';

const formSection = 'NHT - Establishing ex-situ breeding programs';
const numberOfDaysScoreId = '3751ae6f-b0a2-4ec0-935f-1da14b334f38';
const invoicedNumberOfDaysScoreId = '2cc53a8a-d4aa-4481-94dc-140075fb09e7';
const numberOfDaysLabel = 'Number of days captive breeding and release, translocation, or re-introduction programs are maintained';
const invoicedNumberOfDaysLabel = 'Invoiced number of days captive breeding and release, translocation, or re-introduction programs are maintained';
const numberOfDaysFormFieldToAggregate = 'numberOfDaysSpentMaintainingCaptiveBreedingPrograms';
const invoicedNumberOfDaysFormFieldToAggregate = 'invoicedNumberOfDaysSpentMaintainingCaptiveBreedingPrograms';

newScore(numberOfDaysScoreId, numberOfDaysLabel, invoicedNumberOfDaysScoreId, invoicedNumberOfDaysLabel, numberOfDaysFormFieldToAggregate, invoicedNumberOfDaysFormFieldToAggregate);

const numberOfMonthsScoreId = 'a30e7b28-b986-456c-a209-14fc6af38cd9';
const invoicedNumberOfMonthsScoreId = '6c94f5aa-2518-47de-8a97-f50e7db77084';
const numberOfMonthsLabel = 'Number of months captive breeding and release, translocation, or re-introduction programs are maintained';
const invoicedNumberOfMonthsLabel = 'Invoiced number of months captive breeding and release, translocation, or re-introduction programs are maintained';
const numberOfMonthsFormFieldToAggregate = 'numberOfMonthsSpentMaintainingCaptiveBreedingPrograms';
const invoicedNumberOfMonthsFormFieldToAggregate = 'invoicedNumberOfMonthsSpentMaintainingCaptiveBreedingPrograms';

newScore(numberOfMonthsScoreId, numberOfMonthsLabel, invoicedNumberOfMonthsScoreId, invoicedNumberOfMonthsLabel, numberOfMonthsFormFieldToAggregate, invoicedNumberOfMonthsFormFieldToAggregate);

//
const numberOfServicesScoreId = '67d670e1-60c8-4bc9-a144-d3142e24daae';
// const invoicedNumberOfServicesScoreId = '89ee9073-c1f8-4c61-8ff5-81c30a677922';
// const numberOfServicesLabel = 'Number of captive breeding and release, translocation, or re-introduction program Services delivered';
// const invoicedNumberOfServicesLabel = 'Invoiced number of captive breeding and release, translocation, or re-introduction program Services delivered';
// const numberOfServicesFormFieldToAggregate = 'numberOfCaptiveBreedingProgramServicesDelivered';
// const invoicedNumberOfServicesFormFieldToAggregate = 'invoicedNumberOfCaptiveBreedingProgramServicesDelivered';
//
// newScore(numberOfServicesScoreId, numberOfServicesLabel, invoicedNumberOfServicesScoreId, invoicedNumberOfServicesLabel, numberOfServicesFormFieldToAggregate, invoicedNumberOfServicesFormFieldToAggregate);


function newScore(scoreId, scoreLabel, invoicedScoreId, invoicedScoreLabel, formFieldToAggregate, invoicedFormFieldToAggregate) {

    let invoicedScore = {
        scoreId: invoicedScoreId,
        label: invoicedScoreLabel,
        status: 'active',
        isOutputTarget: false,
        category: "Natural Heritage Trust",
        outputType: formSection,
        configuration: {
            childAggregations: [
                {
                    filter: {
                        property: 'name',
                        filterValue: formSection,
                        type: 'filter'
                    },
                    childAggregations: [
                        {
                            property: 'data.'+invoicedFormFieldToAggregate,
                            type: 'SUM'
                        }
                    ]
                }
            ]
        },
        dateCreated: ISODate(),
        lastUpdated: ISODate()
    };

    let score =
        {
            scoreId: scoreId,
            entityTypes: undefined,
            tags: [],
            displayType: '',
            entity: 'Activity',
            outputType: formSection,
            isOutputTarget: true,
            category: "Natural Heritage Trust",
            status: 'active',
            label: scoreLabel,
            description: '',
            configuration: {
                childAggregations: [
                    {
                        filter: {
                            property: 'name',
                            filterValue: formSection,
                            type: 'filter'
                        },
                        childAggregations: [
                            {
                                property: 'data.' + formFieldToAggregate,
                                type: 'SUM'
                            }
                        ]
                    }
                ]
            },
        relatedScores: [
            {
                description: 'Invoiced by',
                scoreId: invoicedScoreId
            }
        ]
        };

    let savedScore = db.score.find({scoreId: scoreId});
    if (savedScore) {
        db.score.replaceOne({scoreId: scoreId}, score);
    }
    else {
        db.score.insertOne(score);
    }

    let invoicedSavedScore = db.score.find({scoreId: invoicedScoreId});
    if (invoicedSavedScore) {
        db.score.replaceOne({scoreId: invoicedScoreId}, invoicedScore);
    }
    else {
        db.score.insertOne(invoicedScore);
    }


};

let allScores = [numberOfDaysScoreId, numberOfMonthsScoreId];//, numberOfServicesScoreId];
let score = db.score.findOne({label:'Number of captive breeding and release, translocation, or re-introduction programs established'});
let programs = db.program.find({'config.programServiceConfig.programServices.serviceTargets': score.scoreId, status: {$ne: 'deleted'}});
while (programs.hasNext()) {
    let program = programs.next();
    print(program.name);
    print(program.programId);
    let allowedForms = ['NHT Output Report', 'Procurement Output Report', 'Grants and Others Progress Report'];
    if (allowedForms.indexOf(program.config.programServiceConfig.serviceFormName) < 0) {
        print("Skipping program " + program.name + " as it does not use the NHT Output Report form. "+program.config.programServiceConfig.serviceFormName);
        continue;
    }
    let service = program.config.programServiceConfig.programServices.find(function (service) {
        return service.serviceId == 10;
    });

    if (service) {
        for (let i = 0; i < allScores.length; i++) {
            let scoreId = allScores[i];
            if (!service.serviceTargets || service.serviceTargets.indexOf(scoreId) === -1) {
                service.serviceTargets = service.serviceTargets || [];
                service.serviceTargets.push(scoreId);
            }
        }
        //printjson(program)
        db.program.updateOne({programId: program.programId}, {$set: {config: program.config}});
        print("Updated program " + program.name + " with new service targets: " + allScores.join(', '));
        audit(program, program.programId, 'au.org.ala.ecodata.Program', 'system', undefined, "Update");
    }
}


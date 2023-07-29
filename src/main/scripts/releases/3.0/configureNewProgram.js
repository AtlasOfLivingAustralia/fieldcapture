load('../../utils/uuid.js');
load('../../utils/audit.js');
load('../../utils/program.js');
var userId = '';

const serviceFormName = "NHT Output Report";
const annualReportFormName = "NHT Annual Report";
const outcomes1ReportFormName = "NHT Outcomes 1 Report";
const outcomes2ReportFormName = "NHT Outcomes 2 Report";
function addService(newServiceName, legacyId, sectionName) {
    let outputs = [
        {
            formName:serviceFormName,
            sectionName:sectionName
        }
    ];
    if (!db.service.findOne({legacyId:legacyId})) {
        let newService = {
            "outputs": outputs,
            "name": newServiceName,
            "legacyId": legacyId,
            serviceId: UUID.generate(),
            dateCreated:ISODate(),
            lastUpdated:ISODate()
        }
        db.service.insertOne(newService);
    } else {
        db.service.updateOne(
            {legacyId: legacyId},
            {$set: {name: newServiceName, outputs:outputs, lastUpdated:ISODate()}});
    }

    let service = db.service.findOne({legacyId:legacyId});
    if (!service.outputs) {
        service.outputs = [{
            formName: serviceFormName,
            sectionName: sectionName
        }]
    }
}
addService("Habitat Condition Assessment Survey", NumberInt(42), "NHT - Habitat condition assessment");


const newScores = [
    {
        serviceId: 1,
        formSection:  'NHT - Baseline data',
        scores: [
            {
                label: 'Number of baseline datasets synthesised and finalised',
                path: 'data.numberBaselineDataSets',
                tags: ['Survey', 'Baseline', 'Indicator']
            }
        ]
    },
    {
        serviceId: 10,
        formSection:  'NHT - Establishing ex-situ breeding programs',
        scores: [
            {
                label: 'Number of captive breeding and release, translocation, or re-introduction programs established',
                path: 'data.numberOfCaptiveBreeding',
                filterValue: "Newly established",
                filterPath: "data.breedingProgramDetails.newOrMaintained",
                tags: ['Survey', 'Baseline', 'Indicator']
            },
            {
                label: 'Number of captive breeding and release, translocation, or re-introduction programs maintained',
                path: 'data.numberOfCaptiveBreeding',
                filterValue: "Maintained",
                filterPath: "data.breedingProgramDetails.newOrMaintained",
                tags: ['Survey', 'Baseline', 'Indicator']
            }
        ]
    },
    {
        serviceId: 34,
        formSection:  'NHT - Debris removal',
        scores: [
            {
                label: 'Area (ha) of debris removal - initial',
                path: 'data.debrisRemovalSurveys.debrisRemovalDetails.debrisRemovedHa',
                filterValue: "Initial",
                filterPath: "data.debrisRemovalSurveys.debrisRemovalDetails.initialOrFollowup",
                tags: ['Survey', 'Baseline', 'Indicator']
            },
            {
                label: 'Area (ha) of debris removal - follow-up',
                path: 'data.debrisRemovalSurveys.debrisRemovalDetails.debrisRemovedHa',
                filterValue: 'Follow-up',
                filterPath: "data.debrisRemovalSurveys.debrisRemovalDetails.initialOrFollowup",
                tags: ['Survey', 'Baseline', 'Indicator']
            },
            {
                label: 'Length (km) of debris removal - initial',
                path: 'data.debrisRemovalSurveys.debrisRemovalDetails.debrisRemovedKm',
                filterValue: 'Initial',
                filterPath: "data.debrisRemovalSurveys.debrisRemovalDetails.initialOrFollowup",
                tags: ['Survey', 'Baseline', 'Indicator']
            },
            {
                label: 'Length (km) of debris removal - follow-up',
                path: 'data.debrisRemovalSurveys.debrisRemovalDetails.debrisRemovedKm',
                filterValue: 'Follow-up',
                filterPath: "data.debrisRemovalSurveys.debrisRemovalDetails.initialOrFollowup",
                tags: ['Survey', 'Baseline', 'Indicator']
            }
        ]
    },
    {
        serviceId: 7,
        formSection:  'NHT - Erosion Management',
        scores: [
            {
                label: 'Area (ha) of erosion control - initial',
                path: 'data.tba'
            },
            {
                label: 'Area (ha) of erosion control - follow-up',
                path: 'data.tba'
            },
            {
                label: 'Length (km) of stream/coastline treated for erosion - initial',
                path: 'data.tba'
            },
            {
                label: 'Length (km) of stream/coastline treated for erosion - follow-up',
                path: 'data.tba'
            }
        ]
    },
    {
        serviceId: 8,
        formSection:  'NHT - Establishing Agreements',
        scores: [
            {
                label: 'Area (ha) covered by conservation agreements established',
                path: 'data.tba'
            },
            {
                label: 'Area (ha) where implementation activities conducted (implementation/stewardship)',
                path: 'data.tba'
            }
        ]
    },
    {
        serviceId: 9,
        formSection:  'NHT - Maintaining feral free enclosures',
        scores: [
            {
                label: 'Number of pest animal-free enclosures - initial',
                path: 'data.tba'
            },
            {
                label: 'Number of pest animal-free enclosures - maintained',
                path: 'data.tba'
            },
            {
                label: 'Number of days maintaining pest animal-free enclosures',
                path: 'data.tba'
            },
            {
                label: 'Area (ha) of pest animal-free enclosure',
                path: 'data.tba'
            }
        ]
    },
    {
        serviceId: 12,
        formSection:  'NHT - Farm Management Survey',
        scores: [
            {
                label: 'Number of farm management surveys conducted - baseline',
                path: 'data.numberFarmManagementSurveysConducted',
                filterValue: "Baseline",
                filterPath: "data.farmSurveys.surveyBaselineDetails.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of farm management surveys conducted - indicator',
                path: 'data.numberFarmManagementSurveysConducted',
                filterValue: "Indicator",
                filterPath: "data.farmSurveys.surveyBaselineDetails.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Indicator']
            }
        ]
    },
    {
        serviceId: 13,
        formSection:  'NHT - Fauna survey',
        scores: [
            {
                label: 'Number of fauna surveys conducted - baseline',
                path: 'data.numberFaunaSurveysConducted',
                filterValue: "Baseline",
                filterPath: "data.faunaSurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of fauna surveys conducted - indicator',
                path: 'data.numberFaunaSurveysConducted',
                filterValue: "Indicator",
                filterPath: "data.faunaSurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Indicator']
            }
        ]
    },
    {
        serviceId: 15,
        formSection:  'NHT - Flora survey',
        scores: [
            {
                label: 'Number of flora surveys conducted - baseline',
                path: 'data.numberFloraSurveysConducted',
                filterValue: "Baseline",
                filterPath: "data.floraSurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of flora surveys conducted - indicator',
                path: 'data.numberFloraSurveysConducted',
                filterValue: "Indicator",
                filterPath: "data.floraSurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Indicator']
            }
        ]
    },
    {
        serviceId: 16,
        formSection:  'NHT - Habitat augmentation',
        scores: [
            {
                label: 'Area (ha) of augmentation - initial',
                path: 'data.habitatAugmentationAreas.areaImplementedHa',
                filterValue: 'Initial',
                filterPath: "data.habitatAugmentationAreas.initialOrMaintained",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Area (ha) of augmentation - maintained',
                path: 'data.habitatAugmentationAreas.areaImplementedHa',
                filterValue: "Maintained",
                filterPath: "data.habitatAugmentationAreas.initialOrMaintained",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of locations where structures installed - initial',
                path: 'data.habitatAugmentationAreas.noStructuresInstalled',
                filterValue: 'Initial',
                filterPath: "data.habitatAugmentationAreas.initialOrMaintained",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of locations where structures installed - maintained',
                path: 'data.habitatAugmentationAreas.noStructuresInstalled',
                filterValue: "Maintained",
                filterPath: "data.habitatAugmentationAreas.initialOrMaintained",
                tags: ['Survey', 'Baseline']
            }
        ]
    },
    {
        serviceId: 42,
        formSection:  'NHT - Habitat condition assessment',
        scores: [
            {
                label: 'Number of habitat condition assessment surveys conducted - baseline',
                path: 'data.numberHabitatConditionAssessmentSurveysConducted',
                filterValue: "Baseline",
                filterPath: "data.conditionAssessmentSurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of habitat condition assessment surveys conducted - indicator',
                path: 'data.numberHabitatConditionAssessmentSurveysConducted',
                filterValue: "Indicator",
                filterPath: "data.conditionAssessmentSurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Indicator']
            }
        ]
    },
    {
        serviceId: 17,
        formSection:  'NHT - Identifying sites',
        scores: [
            {
                label: 'Number of potential sites assessed',
                path: 'data.potentialSiteSurveys.numberPotentialSitesAssessed',
            }
        ]
    },
    {
        serviceId: 14,
        formSection:  'NHT - Fire management',
        scores: [
            {
                label: 'Area (ha) treated by fire management action/s - initial',
                path: 'data.tba'
            },
            {
                label: 'Area (ha) treated by fire management action/s - follow-up',
                path: 'data.tba'
            }
        ]
    },
    {
        serviceId: 18,
        formSection:  'NHT - Improving hydrological regimes',
        scores: [
            {
                label: 'Number of treatments implemented to improve site eco-hydrology - initial',
                path: 'data.numberEcoHydroTreatments',
                filterValue: "Initial",
                filterPath: "data.hydroAreasControlled.initialOrFollowup",
                tags: ['Survey', 'Baseline', 'Indicator', 'Initial']
            },
            {
                label: 'Number of treatments implemented to improve site eco-hydrology - follow-up',
                path: 'data.numberEcoHydroTreatments',
                filterValue: 'Follow-up',
                filterPath: "data.hydroAreasControlled.initialOrFollowup",
                tags: ['Survey', 'Baseline', 'Indicator', 'Initial']
            }
        ]
    },
    {
        serviceId: 19,
        formSection:  'NHT - Improving land management practices',
        scores: [
            {
                label: 'Area (ha) covered by practice change - initial',
                path: 'data.landManagementControlledArea.landManagementDetails.areaImplementedHa',
                filterValue: 'Initial',
                filterPath: "data.landManagementControlledArea.initialOrFollowup",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Area (ha) covered by practice change - follow-up',
                path: 'data.landManagementControlledArea.landManagementDetails.areaImplementedHa',
                filterValue: 'Follow-up',
                filterPath: "data.landManagementControlledArea.initialOrFollowup",
                tags: ['Survey', 'Baseline']
            }
        ]
    },
    {
        serviceId: 20,
        formSection:  'NHT - Disease management',
        scores: [
            {
                label: 'Area (ha) for disease treatment/prevention - initial',
                path: 'data.diseaseManagementAreasControlled.diseaseManagementDetails.areaTreatedHa',
                filterValue: 'Initial',
                filterPath: "data.diseaseManagementAreasControlled.initialOrFollowup",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Area (ha) for disease treatment/prevention - follow-up',
                path: 'data.diseaseManagementAreasControlled.diseaseManagementDetails.areaTreatedHa',
                filterValue: 'Follow-up',
                filterPath: "data.diseaseManagementAreasControlled.initialOrFollowup",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Length (km) for disease treatment/prevention - initial',
                path: 'data.diseaseManagementAreasControlled.diseaseManagementDetails.lengthTreatedKm',
                filterValue: 'Initial',
                filterPath: "data.diseaseManagementAreasControlled.initialOrFollowup",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Length (km) for disease treatment/prevention - follow-up',
                path: 'data.diseaseManagementAreasControlled.diseaseManagementDetails.lengthTreatedKm',
                filterValue: 'Follow-up',
                filterPath: "data.diseaseManagementAreasControlled.initialOrFollowup",
                tags: ['Survey', 'Baseline']
            }
        ]
    },
    {
        serviceId: 23,
        formSection:  'NHT - Pest animal survey',
        scores: [
            {
                label: 'Number of pest animal surveys conducted - baseline',
                path: 'data.numberPestAnimalSurveysConducted',
                filterValue: "Baseline",
                filterPath: "data.pestAnimalSurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of pest animal surveys conducted - indicator',
                path: 'data.numberPestAnimalSurveysConducted',
                filterValue: "Indicator",
                filterPath: "data.pestAnimalSurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Indicator']
            }
        ]
    },
    {
        serviceId: 26,
        formSection:  'NHT - Remediating riparian and aquatic areas',
        scores: [
            {
                label: 'Number of structures installed to promote aquatic health',
                path: 'data.tba'
            },
            {
                label: 'Area (ha) of remediation of riparian/aquatic areas - initial',
                path: 'data.tba'
            },
            {
                label: 'Area (ha) of remediation of riparian/aquatic areas - follow-up',
                path: 'data.tba'
            },
            {
                label: 'Length (km) of remediation of riparian/aquatic areas - initial',
                path: 'data.tba'
            },
            {
                label: 'Length (km) of remediation of riparian/aquatic areas - follow-up',
                path: 'data.tba'
            }
        ]
    },
    {
        serviceId: 28,
        formSection:  'NHT - Revegetating habitat',
        scores: [
            {
                label: 'Area (ha) of habitat revegetated - initial',
                path: 'data.revegetationArea.siteCalculatedAreaHa',
                filterValue: "Initial",
                filterPath: "data.revegetationArea.initialOrMaintenance",
                tags: ['Survey', 'Baseline', 'Indicator', 'Initial']
            },
            {
                label: 'Area (ha) of habitat revegetated - maintained',
                path: 'data.revegetationArea.siteCalculatedAreaHa',
                filterValue: "Maintenance",
                filterPath: "data.revegetationArea.initialOrMaintenance",
                tags: ['Survey', 'Baseline', 'Indicator', 'Initial']
            }
        ]
    },
    {
        serviceId: 36,
        formSection:  'NHT - Seed Collection',
        scores: [
            {
                label: 'Amount (grams)/number of seeds/cuttings collected',
                path: 'data.areasOfSeedCollection.seedCollectionDetails.amountSeedCollected'
            },
            {
                label: 'Number of days propagating',
                path: 'data.areasOfSeedCollection.seedCollectionDetails.noOfDaysPropagating'
            },
            {
                label: 'Number of plants propagated',
                path: 'data.areasOfSeedCollection.seedCollectionDetails.noOfPlantsPropogated'
            }
        ]
    },
    {
        serviceId: 24,
        formSection:  'NHT - Plant survival survey',
        scores: [
            {
                label: 'Number of seed germination/plant survival surveys completed - indicator',
                path: 'data.numberPlantSurvivalSurveys',
                tags: ['Survey', 'Indicator']
            }
        ]
    },
    {
        serviceId: 35,
        formSection:  'NHT - Site preparation',
        scores: [
            {
                label: 'Area (ha) of site preparation',
                path: 'data.sitePreparationAreasControlled.areaPreparedHa',
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Length (km) of site preparation',
                path: 'data.sitePreparationAreasControlled.lengthPreparedKm',
                tags: ['Survey', 'Baseline']
            }
        ]
    },
    {
        serviceId: 32,
        formSection:  'NHT - Water quality survey',
        scores: [
            {
                label: 'Number of water quality surveys conducted - baseline',
                path: 'data.numberWaterQualitySurveyConducted',
                filterValue: "Baseline",
                filterPath: "data.waterQualitySurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of water quality surveys conducted - indicator',
                path: 'data.numberWaterQualitySurveyConducted',
                filterValue: "Indicator",
                filterPath: "data.waterQualitySurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Indicator']
            }
        ]
    },
    {
        serviceId: 33,
        formSection:  'NHT - Weed distribution survey',
        scores: [
            {
                label: 'Number of weed distribution surveys conducted - baseline',
                path: 'data.numberWeedDistributionSurveysConducted',
                filterValue: "Baseline",
                filterPath: "data.weedDistSurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of weed distribution surveys conducted - indicator',
                path: 'data.numberWeedDistributionSurveysConducted',
                filterValue: "Indicator",
                filterPath: "data.weedDistSurveys.baselineOrIndicatorSurvey",
                tags: ['Survey', 'Indicator']
            }
        ]
    },
    {
        serviceId: 31,
        formSection:  'NHT - Emergency Interventions',
        scores: [
            {
                label: 'Number of interventions - initial',
                path: 'data.tba'
            },
            {
                label: 'Number of interventions - follow-up',
                path: 'data.tba'
            }
        ]
    },
    {
        serviceId: 30,
        formSection:  'NHT - Soil testing',
        scores: [
            {
                label: 'Number of soil tests conducted - baseline',
                path: 'data.tba',
                filterValue: "Baseline",
                filterPath: "data.tba.baselineOrIndicator",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of soil tests conducted - indicator',
                path: 'data.tba',
                filterValue: "Indicator",
                filterPath: "data.tba.baselineOrIndicator",
            tags: ['Survey', 'Indicator']
            }
        ]
    },
    {
        serviceId: 29,
        formSection:  'NHT - Skills and knowledge survey',
        scores: [
            {
                label: 'Number of skills and knowledge surveys conducted - baseline',
                path: 'data.numberSkillsKnowledgeSurveysConducted',
                filterValue: "Baseline",
                filterPath: "data.skillsKnowledgeSurveys.skillsKnowledgeSurveyBaselineDetails.baselineOrIndicator",
                tags: ['Survey', 'Baseline']
            },
            {
                label: 'Number of skills and knowledge surveys conducted - indicator',
                path: 'data.numberSkillsKnowledgeSurveysConducted',
                filterValue: "Indicator",
                filterPath: "data.skillsKnowledgeSurveys.skillsKnowledgeSurveyBaselineDetails.baselineOrIndicator",
                tags: ['Survey', 'Indicator']
            }
        ]
    }
];

for (let i=0; i<newScores.length; i++) {
    let service = db.service.findOne({legacyId: newScores[i].serviceId});
    for (let j=0; j<newScores[i].scores.length; j++) {
        let score = db.score.findOne({label: newScores[i].scores[j].label});

        let aggregation =
             [{
                property: newScores[i].scores[j].path,
                type: 'SUM'
            }];
        let config = {
            filter: {
                property: 'name',
                filterValue: newScores[i].formSection,
                type: 'filter'
            }
        }
        if (newScores[i].scores[j].filterPath) {
            config.childAggregations = [{
                filter: {
                    property: newScores[i].scores[j].filterPath,
                    filterValue: newScores[i].scores[j].filterValue,
                    type:"filter"
                },
                childAggregations: aggregation
            }]
        }
        else {
            config.childAggregations = aggregation;
        }
        if (!score) {
            // Insert the score
            score = {
                scoreId: UUID.generate(),
                label: newScores[i].scores[j].label,
                status: 'active',
                isOutputTarget: true,
                category: 'RLP and Bushfire Recovery',
                outputType: service.name,
                configuration: {childAggregations: [config]},
                dateCreated: ISODate(),
                lastUpdated: ISODate()
            };
            if (newScores[i].scores[j].tags) {
                score.tags = newScores[i].scores[j].tags;
            }
            db.score.insertOne(score);
        } else {
            var tags = newScores[i].scores[j].tags;
            if (!tags) {
                tags = null;
            }
            db.score.update(
                {_id: score._id},
                {$set: {
                    configuration: {childAggregations: [config]}, serviceId: newScores[i].serviceId,
                    category:'RLP and Bushfire Recovery',
                    outputType: service.name,
                    tags:tags
                }});
        }
    }
}

const existingScores = [
    {
        serviceId: 2, // communication materials
        formSection: 'NHT - Communication materials',
        rlpFormSection: 'RLP - Communication materials',
        scores: [
             'Number of communication materials published'
        ]
    },
    {
        serviceId: 3, // community / stakeholder engagement
        formSection: 'NHT - Community engagement',
        rlpFormSection: 'RLP - Community engagement',
        scores: [
           'Number of field days',
            'Number of training / workshop events',
            'Number of on-ground trials / demonstrations'
        ]
    },
    {
        serviceId: 4, // controlling access
        formSection: 'NHT - Controlling access',
        rlpFormSection: 'RLP - Controlling access',
        scores: [
            'Number of structures installed'
        ]
    },
    {
        serviceId: 5,
        formSection: 'NHT - Pest animal management',
        rlpFormSection: 'RLP - Pest animal management',
        scores: [
            'Area (ha) treated for pest animals - initial',
            'Area (ha) treated for pest animals - follow-up',
            'Length (km) treated for pest animals - follow-up',
            'Length (km) treated for pest animals - initial'
        ]
    },
    {
        serviceId: 27,
        formSection: 'NHT - Weed treatment',
        rlpFormSection: 'RLP - Weed treatment',
        scores: [
            'Area (ha) treated for weeds - initial',
            'Area (ha) treated for weeds - follow-up',
            'Length (km) treated for weeds - initial',
            'Length (km) treated for weeds - follow-up'
        ]
    },
];

for (let i=0; i<existingScores.length; i++) {
    let service = db.service.findOne({legacyId: existingScores[i].serviceId});
    for (let j=0; j<existingScores[i].scores.length; j++) {
        let score = db.score.findOne({label: existingScores[i].scores[j]});

        if (!score) {
            throw "Cannot find score with label: " + existingScores[i].scores[j];
        }

        let foundRlp = false;
        let foundNht = false;
        for (let k=0; k<score.configuration.childAggregations.length; k++) {
            if (score.configuration.childAggregations[k].filter && score.configuration.childAggregations[k].filter.filterValue === existingScores[i].rlpFormSection) {
                foundRlp = score.configuration.childAggregations[k];
            }
            if (score.configuration.childAggregations[k].filter && score.configuration.childAggregations[k].filter.filterValue === existingScores[i].formSection) {
                foundNht = score.configuration.childAggregations[k];
            }
        }
        if (!foundRlp) {
            throw "Cannot find RLP form section to copy to NHT "+existingScores[i].rlpFormSection+' for score '+existingScores[i].scores[j].label;
        }
        if (!foundNht) {
            let nhtConfig = Object.assign({}, foundRlp);
            nhtConfig.filter = Object.assign ({}, foundRlp.filter);
            nhtConfig.filter.filterValue = existingScores[i].formSection;
            score.configuration.childAggregations.push(nhtConfig);
        }
        else {
            foundNht.childAggregations = foundRlp.childAggregations;
        }
        db.score.updateOne({_id: score._id}, {$set: {configuration: score.configuration, outputType: service.name}});
    }
}


var config=
    {
        "excludes": [],
        "programServiceConfig": {
            "serviceFormName": serviceFormName,
            "programServices": [
                {
                    serviceId: 1,
                    serviceTargetLabels: [ 'Number of baseline datasets synthesised and finalised' ]
                },
                {
                    serviceId: 2,
                    serviceTargetLabels: [ 'Number of communication materials published' ]
                },
                {
                    serviceId: 3,
                    serviceTargetLabels: [
                        'Number of field days',
                        'Number of training / workshop events',
                        'Number of on-ground trials / demonstrations' ]
                },
                {
                    serviceId: 4,
                    serviceTargetLabels: [
                        'Number of structures installed'
                    ]
                },
                {
                    serviceId: 5,
                    serviceTargetLabels: [
                        'Area (ha) treated for pest animals - initial',
                        'Area (ha) treated for pest animals - follow-up',
                        'Length (km) treated for pest animals - follow-up',
                        'Length (km) treated for pest animals - initial'
                    ]
                },
                {
                    serviceId: 7,
                    serviceTargetLabels: [
                        'Area (ha) of erosion control - initial',
                        'Area (ha) of erosion control - follow-up',
                        'Length (km) of stream/coastline treated for erosion - initial',
                        'Length (km) of stream/coastline treated for erosion - follow-up'
                    ]
                },
                {
                    serviceId: 8,
                    serviceTargetLabels: [
                        'Area (ha) covered by conservation agreements established',
                        'Area (ha) where implementation activities conducted (implementation/stewardship)'
                    ]
                },
                {
                    serviceId: 9,
                    serviceTargetLabels: [
                        'Number of pest animal-free enclosures - initial',
                        'Number of pest animal-free enclosures - maintained',
                        'Number of days maintaining pest animal-free enclosures',
                        'Area (ha) of pest animal-free enclosure'
                    ]
                },
                {
                    serviceId: 10,
                    serviceTargetLabels: [
                        'Number of captive breeding and release, translocation, or re-introduction programs established',
                        'Number of captive breeding and release, translocation, or re-introduction programs maintained'
                    ]
                },
                {
                    serviceId: 12,
                    serviceTargetLabels: [
                        'Number of farm management surveys conducted - baseline',
                        'Number of farm management surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 13,
                    serviceTargetLabels: [
                        'Number of fauna surveys conducted - baseline',
                        'Number of fauna surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 14,
                    serviceTargetLabels: [
                        'Area (ha) treated by fire management action/s - initial',
                        'Area (ha) treated by fire management action/s - follow-up'
                    ]
                },
                {
                    serviceId: 15,
                    serviceTargetLabels: [
                        'Number of flora surveys conducted - baseline',
                        'Number of flora surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 16,
                    serviceTargetLabels: [
                        'Area (ha) of augmentation - initial',
                        'Area (ha) of augmentation - maintained',
                        'Number of locations where structures installed - initial',
                        'Number of locations where structures installed - maintained'
                    ]
                },
                {
                    serviceId: 18,
                    serviceTargetLabels: [
                        'Number of treatments implemented to improve site eco-hydrology - initial',
                        'Number of treatments implemented to improve site eco-hydrology - follow-up'
                    ]
                },
                {
                    serviceId: 42,
                    serviceTargetLabels: [
                        'Number of habitat condition assessment surveys conducted - baseline',
                        'Number of habitat condition assessment surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 17,
                    serviceTargetLabels: [ 'Number of potential sites assessed' ]
                },
                {
                    serviceId: 19,
                    serviceTargetLabels: [
                        'Area (ha) covered by practice change - initial',
                        'Area (ha) covered by practice change - follow-up'
                    ]
                },
                {
                    serviceId: 20,
                    serviceTargetLabels: [
                        'Area (ha) for disease treatment/prevention - initial',
                        'Area (ha) for disease treatment/prevention - follow-up',
                        'Length (km) for disease treatment/prevention - initial',
                        'Length (km) for disease treatment/prevention - follow-up'
                    ]
                },
                {
                    serviceId: 23,
                    serviceTargetLabels: [
                        'Number of pest animal surveys conducted - baseline',
                        'Number of pest animal surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 24,
                    serviceTargetLabels: [
                        'Number of seed germination/plant survival surveys completed - indicator'
                    ]
                },
                {
                    serviceId: 26,
                    serviceTargetLabels: [
                        'Area (ha) of remediation of riparian/aquatic areas - initial',
                        'Area (ha) of remediation of riparian/aquatic areas - follow-up',
                        'Length (km) of remediation of riparian/aquatic areas - initial',
                        'Length (km) of remediation of riparian/aquatic areas - follow-up',
                    ]
                },
                {
                    serviceId: 27, // Weed treatment
                    serviceTargetLabels: [
                        'Area (ha) treated for weeds - initial',
                        'Area (ha) treated for weeds - follow-up',
                        'Length (km) treated for weeds - initial',
                        'Length (km) treated for weeds - follow-up'
                    ]
                },
                {
                    serviceId: 28,
                    serviceTargetLabels: [
                        'Area (ha) of habitat revegetated - initial',
                        'Area (ha) of habitat revegetated - maintained',
                    ]
                },
                {
                    serviceId: 29,
                    serviceTargetLabels: [
                        'Number of skills and knowledge surveys conducted - baseline',
                        'Number of skills and knowledge surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 30,
                    serviceTargetLabels: [
                        'Number of soil tests conducted - baseline',
                        'Number of soil tests conducted - indicator',
                    ]
                },
                {
                    serviceId: 31,
                    serviceTargetLabels: [
                        'Number of interventions - initial',
                        'Number of interventions - follow-up'
                    ]
                },
                {
                    serviceId: 32,
                    serviceTargetLabels: [
                        'Number of water quality surveys conducted - baseline',
                        'Number of water quality surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 33,
                    serviceTargetLabels: [
                        'Number of weed distribution surveys conducted - baseline',
                        'Number of weed distribution surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 34,
                    serviceTargetLabels: [
                        'Area (ha) of debris removal - initial',
                        'Area (ha) of debris removal - follow-up',
                        'Length (km) of debris removal - initial',
                        'Length (km) of debris removal - follow-up'
                    ]
                },
                {
                    serviceId: 35,
                    serviceTargetLabels: [
                        'Area (ha) of site preparation',
                        'Length (km) of site preparation'
                    ]
                },
                {
                    serviceId: 36,
                    serviceTargetLabels: [
                        'Amount (grams)/number of seeds/cuttings collected',
                        'Number of days propagating',
                        'Number of plants propagated'
                    ]
                }
            ]

        },
        "visibility": "public",
        "requiresActivityLocking": true,
        "projectTemplate": "rlp",
        "activityPeriodDescriptor": "Outputs report #",
        "supportsParatoo": true,
        "emailTemplates": {
            "reportSubmittedEmailTemplate": "RLP_REPORT_SUBMITTED_EMAIL_TEMPLATE",
            "reportReturnedEmailTemplate": "RLP_REPORT_RETURNED_EMAIL_TEMPLATE",
            "planApprovedEmailTemplate": "RLP_PLAN_APPROVED_EMAIL_TEMPLATE",
            "planReturnedEmailTemplate": "RLP_PLAN_RETURNED_EMAIL_TEMPLATE",
            "reportApprovedEmailTemplate": "RLP_REPORT_APPROVED_EMAIL_TEMPLATE",
            "planSubmittedEmailTemplate": "RLP_PLAN_SUBMITTED_EMAIL_TEMPLATE"
        },
        "meriPlanTemplate": "configurableMeriPlan",
        "riskAndThreatTypes": [
            "Performance",
            "Work Health and Safety",
            "People resources",
            "Financial",
            "External stakeholders",
            "Natural Environment"
        ],
        "projectReports": [
            {
                "reportType": "Activity",
                "reportsAlignedToCalendar": true,
                "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportingPeriodInMonths": 3,
                "description": "",
                "category": "Outputs Reporting",
                "activityType": serviceFormName,
                "canSubmitDuringReportingPeriod": true,
                "label": "Quarter",
                "minimumReportDurationInDays": 1

            },
            {
                "firstReportingPeriodEnd": "2024-06-30T14:00:00Z",
                "reportType": "Administrative",
                "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
                "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
                "reportingPeriodInMonths": 12,
                "category": "Annual Progress Reporting",
                "activityType": annualReportFormName,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "label": "Annual",
                "minimumReportDurationInDays": 1
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "minimumOwnerDurationInMonths": null,
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 36,
                "alignToOwnerStart":true,
                "alignToOwnerEnd":true,
                "multiple": false,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "maximumOwnerDurationInMonths": 35,
                "category": "Outcomes Report 1",
                "reportsAlignedToCalendar": false,
                "activityType": outcomes1ReportFormName,
                "label":"Outcomes Report 1"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "minimumOwnerDurationInMonths": 36,
                "maximumOwnerDurationInMonths": 47,
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 24,
                "multiple": false,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "category": "Outcomes Report 1",
                "activityType": outcomes1ReportFormName,
                "label": "Outcomes Report 1"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 36,
                "multiple": false,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "minimumOwnerDurationInMonths": 48,
                "calendarAlignmentMonth": 7,
                "category": "Outcomes Report",
                "reportsAlignedToCalendar": true,
                "activityType": outcomes1ReportFormName,
                "label": "Outcomes Report 1"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 2 for %4$s",
                "minimumOwnerDurationInMonths": 36,
                "reportNameFormat": "Outcomes Report 2",
                "alignToOwnerStart":true,
                "alignToOwnerEnd":true,
                "multiple": false,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "category": "Outcomes Report 2",
                "activityType": outcomes2ReportFormName,
                "label": "Outcomes Report 2"
            }
        ],
        "navigationMode": "returnToProject",
        "supportsMeriPlanHistory": true,
        "requireMeritAdminToReturnMeriPlan":true,
        "meriPlanContents": [
            {
                "template": "name",
                "model": {
                    "tableFormatting": true
                }
            },
            {
                "template": "priorityPlace",
                "model": {
                    "priorityPlaceLabel":"Does this project directly support a priority place?",
                    "priorityPlaceHelpText":"Priority places recognises that some threatened species share the same habitat, and that place-based action can support protection and recovery of more than one species."
                }
            },
            {
                "template": "indigenousInvolvement"
            },
            {
                "template": "description",
                "model": {
                    "tableFormatting": true,
                    "maxSize": "1000",
                    "placeholder": "Please provide a short description of this project. This project description will be visible on the project overview page in MERIT [Free text; limit response to 1000 characters (approx. 150 words)]"
                }
            },
            {
                "template": "programOutcome",
                "model": {
                    "maximumPriorities": "1000",
                    "priorityHelpText": "Enter the primary investment priority for the primary outcome, noting only one can be selected."
                }
            },
            {
                "template": "additionalOutcomes",
                "model": {
                    "title": "Additional benefits",
                    "helpTextHeading":"If the project is not delivering additional benefits, delete the row using the 'x' in the right-most column.",
                    "outcomePriority":"Additional outcome/s",
                    "priority":"Additional Investment Priorities",
                    "priorityHelpText":"Other investment priorities that will benefit from the project.  Delete the row if there are no additional outcomes."
                }
            },
            {
                "template": "outcomeStatements",
                "model": {
                    "outcomeType": "mid",
                    "subtitle": "Medium-term outcome statement/s",
                    "title": "Project Outcomes",
                    "extendedOutcomes": true,
                    "helpText":"Projects more than 3 years in duration must set medium-term Project outcomes achievable at project completion. Ensure proposed outcomes are measurable with consideration to the baseline and proposed monitoring regime",
                    "minimumNumberOfOutcomes": 0
                }
            },
            {
                "template": "outcomeStatements",
                "model": {
                    "outcomeType": "short",
                    "helpText": "Outline the degree of impact having undertaken the services for up to three years. Ensure the outcomes are measurable with consideration to the baseline and proposed monitoring regime",
                    "subtitle": "Short-term outcome statement/s",
                    "extendedOutcomes": true
                }
            },
            {
                "template": "extendedKeyThreats",
                "model": {
                    "title":"Key threat(s) and/or key threatening processes",
                    "threatHelpText":"Describe the key threats or key threatening processes to the investment priority",
                    "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance",
                    "interventionHelpText":"Describe the proposed method to address the threat or threatening process",
                    "servicesHelpText": "Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables"
                }
            },
            {
                "template": "projectMethodology",
                "model": {
                    "maxSize": "4000",
                    "tableHeading": "Project delivery assumptions (4000 character limit [approx. 650 words])",
                    "helpText": "Include all those conditions or factors that are sufficient to guarantee the success of the project, for example, on ground activities were not impacted by adverse weather conditions. Ensure what’s documented here aligns to those assumptions documented within the Project Logic."
                }
            },
            {
                "template": "projectPartnerships",
                "model": {
                    "helpTextPartnerName":"Insert name of project partner. To be a project partner, they need to be actively involved in the planning or delivery of the project",
                    "helpTextHeading":"Note: Not limited to key subcontractors."
                }
            },
            {
                "template": "extendedBaselineMonitoring",
                "model": {
                    "approachHeading": "Monitoring method",
                    "indicatorHeading": "Monitoring methodology",
                    "baselineHelpText": "Describe the project baseline to be established, or the baseline data that currently exists",
                    "baselineServiceHelpText": "Select the relevant Project Service(s)/Target measure(s) that will be used to support the development of the baseline",
                    "monitoringServiceHelpText": "Select the relevant Project Services(s)/Target measure(s) that will be used to support ongoing monitoring",
                    "baselineMethodHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
                    "approachHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
                    "titleHelpText": "Describe the Project Baseline(s) and ongoing monitoring which will be used to report progress towards this projects outcome(s).  Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables",
                    "newIndicatorText": "New monitoring indicator",
                    "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance"
                }
            },
            {
                "template": "projectReview",
                "model": {
                    "title": "Project review, improvement and evaluation methodology and approach (3000 character limit [approximately 500 words])"
                }
            },
            {
                "template": "nationalAndRegionalPlans",
                "model": {
                    "includeUrl": true,
                    "headingTitle": "Conservation and management plans"
                }
            },
            {
                "template": "serviceOutcomeTargets",
                "model": {
                    "title": "Project services and targets",
                    "serviceName": "Service",
                    "titleHelpText":"Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections"
                }
            },
            {
                "template": "serviceForecasts",
                "excludedModes":["PRINT"],
                "model": {
                    "titleHelpText":"Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections"
                }

            }
        ],
        keyThreatCodes: [
            'Climate Change - Changed flooding regime',
            'Climate Change - Changed rainfall patterns',
            'Climate Change - Sea level rises',
            'Climate Change - Unexpected seasonal/temperature extremes',
            'Disease/pathogens - Areas that are infected',
            'Disease/pathogens - Possible infection of disease free areas',
            'Fire - Inappropriate fire regime',
            'Fire - Lack of protection for ecological assets during fire control activities',
            'Genetics - Bottleneck/inbreeding',
            'Habitat loss - Breeding place disturbance',
            'Habitat loss - Dieback/senescence',
            'Habitat loss - Feeding habitat loss/interference',
            'Habitat loss - Habitat fragmentation',
            'Habitat loss - Land clearing',
            'Habitat loss - Loss of critical ecosystem service supporting habitat',
            'Human interference - Fish and harvesting aquatic resources (commercial)',
            'Human interference - Flow-on effects of housing development',
            'Human interference - Illegal activities',
            'Human interference - Industrial development',
            'Human interference - Land use intensification',
            'Human interference - Recreational fishing',
            'Human interference - Recreational pressures',
            'Human interference - Road/vehicle strike',
            'Land management practices - Changes to hydrology and aquatic systems',
            'Land management practices - Domestic grazing/stock impacts',
            'Land management practices - Excess recharge of groundwater',
            'Land management practices - Excess use (or over-use) of surface water or groundwater resources',
            'Land management practices - Excessive fertiliser use',
            'Land management practices - Inappropriate ground cover management',
            'Land management practices - Runoff',
            'Native fauna - Competition',
            'Native fauna - Predation',
            'Pest - Competition/exclusion',
            'Pest - Disease transmission',
            'Pest - Habitat degradation',
            'Pest - Introduction of new pest animals',
            'Pest - Predation',
            'Pollution - Chemical',
            'Pollution - Eutrophication/algal blooms',
            'Pollution - Inappropriate waste disposal',
            'Pollution - Sediment ',
            'Population size/range - Low habitat area',
            'Population size/range - Low population numbers',
            'Weeds - Competition',
            'Weeds - Introduction of new weed',
            'Weeds - Spread of weeds from surrounding areas'
        ],
        priorityPlaces: [
            "Australian Alps – NSW/ACT/VIC",
            "Brigalow Country – QLD",
            "Bruny Island – TAS",
            "Christmas Island – External Territory",
            "Eastern Forests of Far North Queensland – QLD",
            "Fitz-Stirlings – WA",
            "French Island – VIC",
            "Giant Kelp Ecological Community – TAS",
            "Greater Blue Mountains – NSW",
            "Kakadu & West Arnhem – NT",
            "Kangaroo Island – SA",
            "MacDonnell Ranges – NT",
            "Mallee Birds Ecological Community – VIC/SA/NSW",
            "Midlands region of central Tasmanian – TAS",
            "Norfolk Island – External Territory",
            "Raine Island – Queensland",
            "Remnant WA Wheatbelt Woodlands – WA",
            "South East Coastal Ranges – NSW/VIC",
            "Southern Plains, including the Western Victorian volcanic plain and karst springs – VIC/SA",
            "Yampi Sounds and surrounds – WA"
        ]

    };


var outcomes = [
    {
        outcome: "1.  Species and Landscapes (Long term): Threatened Species (TS) - The trajectory of species targeted under the Threatened Species Action Plan 2022-2032 and other EPBC Act listed Species is improved",
        shortDescription: "EPBC Species",
        category: "Threatened Species",
        priorities: [
            {
                category: "Threatened Species"
            }
        ]
    },
    {
        outcome: "1.  Species and Landscapes (Long term): Threatened Species (TS) - New extinctions of plants and animals are prevented",
        shortDescription: "New extinctions",
        category: "Threatened Species",
        priorities: [
            {
                category: "Threatened Species"
            }
        ]
    },
    {
        outcome: "1.  Species and Landscapes (Long term): Threatened Ecological Communities (TECs) and priority places - The condition of targeted EPBC Act listed Threatened Ecological Communities and identified priority places under the Threatened Species Action Plan 2022-2032 is improved",
        shortDescription: "Threatened Ecological Communities",
        category: "Threatened Ecological Communities",
        priorities: [
            {
                category: "Threatened Ecological Communities"
            }
        ]
    },
    {
        outcome: "2: World Heritage Protection (Long term): The outstanding universal value of world heritage properties listed for their natural heritage value is maintained and improved",
        shortDescription: "World Heritage",
        category: "World Heritage",
        priorities: [
            {
                category: "World Heritage"
            }
        ]
    },
    {
        outcome: "3: Ramsar Wetland Protection (Long term): The ecological character of targeted Ramsar sites is maintained and/or improved, building resilience to climate change",
        shortDescription: "Ramsar Sites",
        category: "Ramsar",
        priorities: [
            {
                category: "Ramsar"
            }
        ]
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Targeted threatened species (TS) are on track for improved trajectory",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Species at high risk of imminent extinction are identified and supported to persist",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Priority species are being assisted to strengthen reliance and adaptive capacity for climate change",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Increased leadership and/or participation of First Nations people in the management and recovery of threatened species",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - The implementation of priority actions is leading to an improvement in the condition of targeted TECs and priority places",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - Resilience to climate change and extreme events has been increased",
        category: "Threatened Species",
        type: "medium"
    },

    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - Increased leadership and/or participation of First Nations people in the management and recovery of threatened ecological communities and priority places",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Threats to the outstanding universal value of world heritage properties listed for their natural heritage value have been reduced through the implementation of priority actions",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Managing Threats - Threats from climate change, extreme events and invasive species have been reduced",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Managing Threats - Threats from disease have been reduced",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Managing Threats - Increased leadership and/or participation of First Nations people in the management of threats to World Heritage properties",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Improving land management practices and protecting habitat - Threats from inappropriate fire management are reduced",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Improving land management practices and protecting habitat - Threats from inappropriate management of human impacts, climate change and extreme events are reduced",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Improving land management practices and protecting habitat - Increased leadership and/or participation of First Nations people in the management and protection of World Heritage properties",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Priority actions at targeted Ramsar sites will reduce threats, restore or maintain ecological character and increase climate change resilience",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - The critical components, processes and services of the wetland actively maintained and/or improved",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - Absence/reduction of non-native species",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - Increased leadership and/or participation of First Nations people in the management of threats to Ramsar sites",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - Adaptive management planning and actions are building resilience to extreme climate events",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Wetland biota and/or abundance is maintained and improved",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Hydrological regimes have been restored and maintained",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Improved condition of wetland vegetation/habitat",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Quality of breeding, foraging and roosting habitat is improved",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Increased leadership and/or participation of First Nations people in the restoration and/or maintenance of the ecological character of Ramsar sites",
        category: "Ramsar",
        type: "medium"
    },
    {
        outcome: '1.  Species and Landscapes (Short term): Managing Threats - Pest predator an competitor species have been controlled or are under active, long-term control programs',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '1.  Species and Landscapes (Short term): Managing Threats - Threats from disease have been contained, reduced or excluded',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '1.  Species and Landscapes (Short term): Improving habitat - Land management practices have improved',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '1.  Species and Landscapes (Short term): Improving habitat - Quality of (TS/TECs) habitat has improved',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '1.  Species and Landscapes (Short term): Improving habitat - Area/Extent of (TS/TECs) habitat has increased',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '1.  Species and Landscapes (Short term): Improving habitat - Increased connectivity between patches',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '1.  Species and Landscapes (Short term): Improving habitat - Quality of breeding and foraging habitat is improved   ',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '1.  Species and Landscapes (Short term): Creating insurance populations - Existing populations have been protected',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '1.  Species and Landscapes (Short term): Creating insurance populations - Re-introductions have enhanced wild populations',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '1.  Species and Landscapes (Short term): Climate adaption and resilience - Climate change resilience and adaptive capacity actions underway',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '1.  Species and Landscapes (Short term): First Nations People and community involvement - First Nations people are leading and/or participating in recovery activities',
        type: 'short',
        category: 'Threatened Species'
    },
    {
        outcome: '2. World Heritage Protection (Short term): Managing threats - Pest predator and competitor species have been controlled',
        type: 'short',
        category: 'World Heritage'
    },
    {
        outcome: '2. World Heritage Protection (Short term): Managing threats -Threats from disease have been contained or reduced',
        type: 'short',
        category: 'World Heritage'
    },
    {
        outcome: '2. World Heritage Protection (Short term): Improving land management practices and protecting habitat - Inappropriate fire regimes have been reduced or halted',
        type: 'short',
        category: 'World Heritage'
    },
    {
        outcome: '2. World Heritage Protection (Short term): Improving land management practices and protecting habitat - Land management practices have improved (within and around heritage properties)',
        type: 'short',
        category: 'World Heritage'
    },
    {
        outcome: '2. World Heritage Protection (Short term): Improving land management practices and protecting habitat - Actions to reduce nutrient levels have been implemented, and nutrient levels are beginning to stabilise/improve ',
        type: 'short',
        category: 'World Heritage'
    },
    {
        outcome: '2. World Heritage Protection (Short term): Climate adaption and resilience - Climate change resilience and adaptive capacity actions underway',
        type: 'short',
        category: 'World Heritage'
    },
    {
        outcome: '2. World Heritage Protection (Short term): First Nations People and community involvement - First Nations people are leading and/or participating in management and protection activities',
        type: 'short',
        category: 'World Heritage'
    },
    {
        outcome: '3. Ramsar Wetland Protection (Short term): Managing threats -  Inappropriate land management practices have decreased within the catchment',
        type: 'short',
        category: 'Ramsar'
    },
    {
        outcome: '3. Ramsar Wetland Protection (Short term): Managing Threats - Pest predator and competitor species have been controlled ',
        type: 'short',
        category: 'Ramsar'
    },
    {
        outcome: '3. Ramsar Wetland Protection (Short term):  Managing Threats - Appropriate fire management regimes within and external to site',
        type: 'short',
        category: 'Ramsar'
    },
    {
        outcome: '3. Ramsar Wetland Protection (Short term): Protecting and Improving Habitat - Area and quality of suitable wetland habitat has increased and/or is maintained',
        type: 'short',
        category: 'Ramsar'
    },
    {
        outcome: '3. Ramsar Wetland Protection (Short term): Protecting and Improving Habitat - Water quality has been stabilised and/or improved  ',
        type: 'short',
        category: 'Ramsar'
    },
    {
        outcome: '3. Ramsar Wetland Protection (Short term): Protecting and Improving Habitat - Improved access control to protect sensitive species and habitats',
        type: 'short',
        category: 'Ramsar'
    },
    {
        outcome: '3. Ramsar Wetland Protection (Short term): Climate adaption and resilience - Climate change resilience and adaptive capacity actions underway to improve and/or maintain the ecological character of Ramsar sites ',
        type: 'short',
        category: 'Ramsar'
    },
    {
        outcome: '3. Ramsar Wetland Protection (Short term): First Nations People and community involvement - First Nations people are leading and/or participating in restoration, maintenance and protection activities',
        type: 'short',
        category: 'Ramsar'
    }

];
let programName = "National Heritage Trust";
var program = createOrFindProgram(programName);
program.acronym = "NHT";
program.config = config;
program.outcomes = outcomes;
//program.priorities = priorities;

// Convert labels to scoreIds (scoreIds can be different between test & prod)
let s = config.programServiceConfig.programServices;
for (let i=0; i<s.length; i++) {
    let t = s[i].serviceTargetLabels;
    s[i]['serviceTargets'] = [];
    for (let j=0; j<t.length; j++) {
        let score = db.score.findOne({label:t[j]});
        if (!score) {
            print("No score with label "+t[j]);
        }
        s[i]['serviceTargets'].push(score.scoreId);

        let service = db.service.findOne({legacyId:s[i].serviceId});
        if (!service) {
            print("No service with legacyId "+s[i].serviceId);
        }
        else {
            let found = false;
            for (let k=0; k<service.outputs.length; k++) {
                if (service.outputs[k].formName == 'NHT Output Report') {
                    found = service.outputs[k];
                }
            }
            let match = null;
            for (let l=0; l<newScores.length; l++) {
                if (newScores[l].serviceId == s[i].serviceId) {
                    match = newScores[l];
                }
            }
            if (!match) {
                for (let l=0; l<existingScores.length; l++) {
                    if (existingScores[l].serviceId == s[i].serviceId) {
                        match = existingScores[l];
                    }
                }
            }
            if (!match) {
                throw "Can't find form section for score "+score.label;
            }
            if (!found) {
                service.outputs.push({
                    formName: 'NHT Output Report',
                    sectionName: match.formSection
                });

            }
            else {
                found.sectionName = match.formSection;
            }
            db.service.replaceOne({legacyId:s[i].serviceId}, service);
        }
    }
    delete s[i].serviceTargetLabels;
}

db.program.replaceOne({programId: program.programId}, program);

let subProgramName = "Recovery Actions for Species and Landscapes";
var subProgram = createOrFindProgram(subProgramName);
subProgram.parent = DBRef("program", program._id);
subProgram.config = config;
subProgram.outcomes = outcomes;

db.program.replaceOne({programId: subProgram.programId}, subProgram);

// Add labels and output mapping for services used by the new program
var programLabels = {};
var label =  {label: 'Synthesising and finalising baseline data'};
programLabels[program.programId] = label;
db.service.update({legacyId:NumberInt(1)}, {$set:{programLabels:programLabels}});

label.label = 'Captive Breeding, Translocation or Re-introduction Programs';
db.service.update({legacyId:NumberInt(10)}, {$set:{programLabels:programLabels}});

label.label = 'Establishing and Implementing Conservation Agreements';
db.service.update({legacyId:NumberInt(8)}, {$set:{programLabels:programLabels}});

label.label = 'Identifying and Prioritising the Location of potential sites';
db.service.update({legacyId:NumberInt(17)}, {$set:{programLabels:programLabels}});

label.label = 'Improving Hydrological Regimes for Site Eco-hydrology';
db.service.update({legacyId:NumberInt(18)}, {$set:{programLabels:programLabels}});

label.label = 'Seed Germination/Plant Survival Survey';
db.service.update({legacyId:NumberInt(24)}, {$set:{programLabels:programLabels}});

label.label = 'Establishing and Maintaining Pest Animal-Free Enclosures'
db.service.update({legacyId:NumberInt(9)}, {$set:{programLabels:programLabels}});

label.label = 'Implementing Fire Management Actions'
db.service.update({legacyId:NumberInt(14)}, {$set:{programLabels:programLabels}});

label.label = 'Improving Hydrological Regimes for Site Eco-hydrology';
db.service.update({legacyId:NumberInt(18)}, {$set:{programLabels:programLabels}});

label.label = 'Managing Diseases';
db.service.update({legacyId:NumberInt(20)}, {$set:{programLabels:programLabels}});

label.label = 'Seed Collection and Propagation';
db.service.update({legacyId:NumberInt(36)}, {$set:{programLabels:programLabels}});

label.label = 'Undertaking Emergency Interventions to Prevent Extinction';
db.service.update({legacyId:NumberInt(31)}, {$set:{programLabels:programLabels}});

let services = db.service.find();
while (services.hasNext()) {
    let service = services.next();

    // if the service.name matches a case insensitive regex of "survey"
    // then add the "Survey" category
    if (service.name.match(/survey/i) || service.legacyId == 30 || service.legacyId == 1) {
        // Add the Survey category to the service if it doesn't already have it
        if (!service.categories) {
            service.categories = [];
        }
        if (!service.categories.includes('Survey')) {
            service.categories.push('Survey');
            db.service.replaceOne({legacyId:service.legacyId}, service);
        }
    }
}


var blankReportTemplate = function(name, templateName, category) {
    return {
        dateCreated: ISODate(),
        minOptionalSectionsCompleted: NumberInt(1),
        supportsSites: false,
        lastUpdated: ISODate(),
        external: false,
        supportsPhotoPoints: false,
        publicationStatus: 'published',
        name: name,
        sections: [
            {
                collapsedByDefault: false,
                template: {
                    modelName: name,
                    dataModel: [],
                    viewModel: [{
                        type: 'row', items: [{
                            type: "literal",
                            source: "<h4>This report is in development</h4>"
                        }]
                    }],
                    title: name
                },
                templateName: templateName,
                optional: false,
                name: name
            }
        ],
        type: 'Report',
        category: category,
        status: 'active',
        formVersion: NumberInt(1),
    };
};
const reports = [
    {name: "NHT Annual Report", templateName: "nhtProgramAnnualReport", category: 'Annual Report'},
    {
        name: outcomes1ReportFormName,
        templateName: "nhtProgramOutcomes1Report",
        category: "Outcomes 1 Report"
    },
    {
        name: outcomes2ReportFormName,
        templateName: "nhtProgramOutcomes2Report",
        category: "Outcomes 2 Report"
    }
];
for (let i = 0; i < reports.length; i++) {
    let reportConfig = reports[i];
    let report = db.activityForm.findOne({name: reportConfig.name});
    if (!report) {

        let template = blankReportTemplate(reportConfig.name, reportConfig.templateName, reportConfig.category);
        db.activityForm.insertOne(template);
    }
}


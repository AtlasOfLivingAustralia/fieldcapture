load('../../utils/uuid.js');
load('../../utils/audit.js');
const scoreInfoWithoutLabels = [
  {
    "scoreId": "58422487-fe0a-4cc6-85b6-761e9f2752b9",
    "filterValue": "NHT - Baseline data",
    "property": "totalNumberBaselineDatasets",
    "computedExpression": "sum(baselineDetailsControlled, \"relatedOutcomes ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Baseline data\"].template.dataModel[name=\"baselineDetailsControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "7abd62ba-2e44-4318-800b-b659c73dc12b",
    "filterValue": "NHT - Communication materials",
    "property": "totalMaterialsPublished",
    "computedExpression": "sum(communicationMaterialsByOutcome, \"numberOfCommunicationsMaterialsPublishedForOutcome\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Communication materials\"].template.dataModel[name=\"communicationMaterialsByOutcome\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "f9c85612-602e-465c-89e0-e155b34b1f31",
    "filterValue": "NHT - Community engagement",
    "property": "totalNumberEngagementHeld",
    "computedExpression": "sum(communityEngagementByOutcome, \"engagementsForOutcome\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Community engagement\"].template.dataModel[name=\"communityEngagementByOutcome\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "e30b721b-99d7-4292-9395-e10ad8b1b9e1",
    "filterValue": "NHT - Controlling access",
    "property": "totalAreaStructuresInstalled",
    "computedExpression": "sum(controllingAccessAreasControlled, \"areaTreatedHa\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Controlling access\"].template.dataModel[name=\"controllingAccessAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "eedf53df-e2f1-4fde-b955-41b46ac83282",
    "filterValue": "NHT - Controlling access",
    "property": "totalLengthStructuresInstalled",
    "computedExpression": "sum(controllingAccessAreasControlled, \"lengthTreatedKm\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Controlling access\"].template.dataModel[name=\"controllingAccessAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "6c92881f-d8ae-434c-9275-3373ce8023fb",
    "filterValue": "NHT - Controlling access",
    "property": "totalStructuresInstalled",
    "computedExpression": "sum(controllingAccessAreasControlled, \"numberInstalled\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Controlling access\"].template.dataModel[name=\"controllingAccessAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "e037c2d7-a5e5-4e5c-a173-a2f426d39e95",
    "filterValue": "NHT - Pest animal management",
    "property": "totalAreaPestAnimalsTreatedInitial",
    "computedExpression": "sum(areasControlled, \"initialOrFollowup == 'Initial' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Pest animal management\"].template.dataModel[name=\"areasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "dd4a0ab0-f760-44e9-ae37-5589a06678dd",
    "filterValue": "NHT - Pest animal management",
    "property": "totalAreaPestAnimalsTreatedFollowUp",
    "computedExpression": "sum(areasControlled, \"initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Pest animal management\"].template.dataModel[name=\"areasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "7ba84972-750a-4952-921d-1552743bc09b",
    "filterValue": "NHT - Pest animal management",
    "property": "totalLengthPestAnimalsTreatedFollowUp",
    "computedExpression": "sum(areasControlled, \"initialOrFollowup == 'Follow-up' ? lengthTreatedKm : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Pest animal management\"].template.dataModel[name=\"areasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "64555f23-a7f0-4fbd-a509-2a5492f7e91b",
    "filterValue": "NHT - Pest animal management",
    "property": "totalLengthPestAnimalsTreatedInitial",
    "computedExpression": "sum(areasControlled, \"initialOrFollowup == 'Initial' ? lengthTreatedKm : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Pest animal management\"].template.dataModel[name=\"areasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "ab61838c-eba7-4007-bb06-65fe0bfcf604",
    "filterValue": "NHT - Erosion Management",
    "property": "totalAreaErosionControlInitial",
    "computedExpression": "sum(erosionManagementAreasControlled, \"initialOrFollowup == 'Initial' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Erosion Management\"].template.dataModel[name=\"erosionManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "d75389ba-e4a7-4735-9e52-93d86667d519",
    "filterValue": "NHT - Erosion Management",
    "property": "totalAreaErosionControlFollowup",
    "computedExpression": "sum(erosionManagementAreasControlled, \"initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Erosion Management\"].template.dataModel[name=\"erosionManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "cb7c9d74-c1fc-4503-b4d8-96586b7d28c5",
    "filterValue": "NHT - Erosion Management",
    "property": "totalLengthStreamCoastlineInitial",
    "computedExpression": "sum(erosionManagementAreasControlled, \"initialOrFollowup == 'Initial' ? lengthTreatedKm : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Erosion Management\"].template.dataModel[name=\"erosionManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "50e4a1a1-31cb-4236-b23e-3949edcfba06",
    "filterValue": "NHT - Erosion Management",
    "property": "totalLengthStreamCoastlineFollowup",
    "computedExpression": "sum(erosionManagementAreasControlled, \"initialOrFollowup == 'Follow-up' ? lengthTreatedKm : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Erosion Management\"].template.dataModel[name=\"erosionManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "11dc6641-488a-482b-9e4d-4d1ab1fad282",
    "filterValue": "NHT - Maintaining feral free enclosures",
    "property": "totalNoPestFreeSurveyEstablished",
    "computedExpression": "sum(enclosureDetails, \"newOrMaintained == 'Initial' ? numberOfPestFreeEnclosures : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Maintaining feral free enclosures\"].template.dataModel[name=\"enclosureDetails\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "a253fcea-320d-4d12-a736-a1189c732b17",
    "filterValue": "NHT - Maintaining feral free enclosures",
    "property": "totalNoPestFreeSurveyMaintained",
    "computedExpression": "sum(enclosureDetails, \"newOrMaintained == 'Maintained' ? numberOfPestFreeEnclosures : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Maintaining feral free enclosures\"].template.dataModel[name=\"enclosureDetails\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "4feac7e6-b5bd-4b5b-869d-3e3fdfced31b",
    "filterValue": "NHT - Maintaining feral free enclosures",
    "property": "totalNoDaysMaintainingPestFree",
    "computedExpression": "sum(enclosureDetails, \"daysSpentOnMaintenanceOfEnclosures\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Maintaining feral free enclosures\"].template.dataModel[name=\"enclosureDetails\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "82db08b5-58e8-4d35-8335-037801ef4067",
    "filterValue": "NHT - Maintaining feral free enclosures",
    "property": "totalAreaPestFreeSurveyInitial",
    "computedExpression": "sum(enclosureDetails, \"areaTreatedHa\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Maintaining feral free enclosures\"].template.dataModel[name=\"enclosureDetails\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "23261000-91f6-4480-8368-fa910649f3e1",
    "filterValue": "NHT - Establishing ex-situ breeding programs",
    "property": "totalCaptiveBreedingEstablished",
    "computedExpression": "sum(breedingProgramDetails, \"newOrMaintained == 'Newly established' ? numberOfCaptiveBreeding : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Establishing ex-situ breeding programs\"].template.dataModel[name=\"breedingProgramDetails\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "8990164b-73c1-4ec1-90aa-b1b6e306e186",
    "filterValue": "NHT - Establishing ex-situ breeding programs",
    "property": "totalCaptiveBreedingMaintained",
    "computedExpression": "sum(breedingProgramDetails, \"newOrMaintained == 'Maintained' ? numberOfCaptiveBreeding : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Establishing ex-situ breeding programs\"].template.dataModel[name=\"breedingProgramDetails\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "3751ae6f-b0a2-4ec0-935f-1da14b334f38",
    "filterValue": "NHT - Establishing ex-situ breeding programs",
    "property": "totalNumberOfDaysSpentMaintainingCaptiveBreedingPrograms",
    "error": "Property not found in dataModel"
  },
  {
    "scoreId": "a30e7b28-b986-456c-a209-14fc6af38cd9",
    "filterValue": "NHT - Establishing ex-situ breeding programs",
    "property": "totalNumberOfMonthsSpentMaintainingCaptiveBreedingPrograms",
    "error": "Property not found in dataModel"
  },
  {
    "scoreId": "1246a484-cade-497d-a76e-e5fdf881e46f",
    "filterValue": "NHT - Farm Management Survey",
    "property": "totalSurveyBaseline",
    "computedExpression": "sum(farmManagementSurveys, \"baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Farm Management Survey\"].template.dataModel[name=\"farmManagementSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "b80aaccc-5f28-43f0-a754-338b9b1c0edd",
    "filterValue": "NHT - Farm Management Survey",
    "property": "totalSurveyIndicator",
    "computedExpression": "sum(farmManagementSurveys, \"baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Farm Management Survey\"].template.dataModel[name=\"farmManagementSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "e0a2e283-77a2-4f74-94de-550578cc4612",
    "filterValue": "NHT - Fauna survey",
    "property": "totalSurveyBaseline",
    "computedExpression": "sum(faunaSurveys, \"baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Fauna survey\"].template.dataModel[name=\"faunaSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "65dbe133-29c2-46a8-a91f-c76ece73e2fc",
    "filterValue": "NHT - Fauna survey",
    "property": "totalSurveyIndicator",
    "computedExpression": "sum(faunaSurveys, \"baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Fauna survey\"].template.dataModel[name=\"faunaSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "a2ba766b-f9ce-4948-b331-b4989e8edfc8",
    "filterValue": "NHT - Fire management",
    "property": "totalAreaTreatedFireMgmtInitial",
    "computedExpression": "sum(fireManagementAreasControlled, \"initialOrFollowup == 'Initial' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Fire management\"].template.dataModel[name=\"fireManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "6a7f9150-3107-46fc-967d-143b595f39a3",
    "filterValue": "NHT - Fire management",
    "property": "totalAreaTreatedFireMgmtFollowup",
    "computedExpression": "sum(fireManagementAreasControlled, \"initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Fire management\"].template.dataModel[name=\"fireManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "c0b0a691-057e-4af4-a0d2-647988354931",
    "filterValue": "NHT - Flora survey",
    "property": "totalSurveyBaseline",
    "computedExpression": "sum(floraSurveys, \"baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Flora survey\"].template.dataModel[name=\"floraSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "e5de1384-40b8-4347-b3b3-e1efb8f0b09b",
    "filterValue": "NHT - Flora survey",
    "property": "totalSurveyIndicator",
    "computedExpression": "sum(floraSurveys, \"baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Flora survey\"].template.dataModel[name=\"floraSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "ede35cd2-bb14-44b6-8d47-6b0ea55cb2d1",
    "filterValue": "NHT - Habitat augmentation",
    "property": "totalAreaAugmentationInitial",
    "computedExpression": "sum(habitatAugmentationAreas, \"initialOrMaintained == 'Initial' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Habitat augmentation\"].template.dataModel[name=\"habitatAugmentationAreas\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "da7e114f-24ed-4924-b763-4843fbe85152",
    "filterValue": "NHT - Habitat augmentation",
    "property": "totalAreaAugmentationMaintained",
    "computedExpression": "sum(habitatAugmentationAreas, \"initialOrMaintained == 'Maintained' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Habitat augmentation\"].template.dataModel[name=\"habitatAugmentationAreas\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "88d2eddf-5633-4220-948c-f5b5d690b896",
    "filterValue": "NHT - Habitat augmentation",
    "property": "totalStructuresInstalledInitial",
    "computedExpression": "sum(habitatAugmentationAreas, \"initialOrMaintained == 'Initial' ? noStructuresInstalled : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Habitat augmentation\"].template.dataModel[name=\"habitatAugmentationAreas\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "6d3971f4-a393-499e-ad7d-6d030a0ace7e",
    "filterValue": "NHT - Habitat augmentation",
    "property": "totalStructuresInstalledMaintained",
    "computedExpression": "sum(habitatAugmentationAreas, \"initialOrMaintained == 'Maintained' ? noStructuresInstalled : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Habitat augmentation\"].template.dataModel[name=\"habitatAugmentationAreas\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "9e17ef60-59e4-4509-a396-0f0a8e3d77d4",
    "filterValue": "NHT - Improving hydrological regimes",
    "property": "totalHydroTreatmentsInitial",
    "computedExpression": "sum(hydroAreasControlled, \"initialOrFollowup == 'Initial' ? noTreatments : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Improving hydrological regimes\"].template.dataModel[name=\"hydroAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "0a973540-78c8-45b8-9074-5d99b0c8a8ef",
    "filterValue": "NHT - Improving hydrological regimes",
    "property": "totalHydroTreatmentsFollowup",
    "computedExpression": "sum(hydroAreasControlled, \"initialOrFollowup == 'Follow-up' ? noTreatments : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Improving hydrological regimes\"].template.dataModel[name=\"hydroAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "91185422-300a-43c9-8148-3074aa9b9bf2",
    "filterValue": "NHT - Habitat condition assessment",
    "property": "totalSurveyBaseline",
    "computedExpression": "sum(habitatConditionSurveys, \"baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Habitat condition assessment\"].template.dataModel[name=\"habitatConditionSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "88b6be7f-8b43-4514-b6f5-7176d5a6a23b",
    "filterValue": "NHT - Habitat condition assessment",
    "property": "totalSurveyIndicator",
    "computedExpression": "sum(habitatConditionSurveys, \"baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Habitat condition assessment\"].template.dataModel[name=\"habitatConditionSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "6902a27f-a4bb-4a85-82e9-ea2e361510c2",
    "filterValue": "NHT - Identifying sites",
    "property": "totalPotentialSites",
    "computedExpression": "sum(potentialSiteSurveys, \"rowCount\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Identifying sites\"].template.dataModel[name=\"potentialSiteSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "de5f262d-5474-40ef-92fc-a631bd2866ff",
    "filterValue": "NHT - Improving land management practices",
    "property": "totalAreaPracticeChangeInitial",
    "computedExpression": "sum(landManagementAreasControlled, \"initialOrFollowup == 'Initial' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Improving land management practices\"].template.dataModel[name=\"landManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "eb72cc6e-6e0b-449b-954d-d76b5c9dfe10",
    "filterValue": "NHT - Improving land management practices",
    "property": "totalAreaPracticeChangeFollowup",
    "computedExpression": "sum(landManagementAreasControlled, \"initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Improving land management practices\"].template.dataModel[name=\"landManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "210ade50-7e53-44d5-a170-a8271e4a5448",
    "filterValue": "NHT - Disease management",
    "property": "totalAreaDiseaseManagementInitial",
    "computedExpression": "sum(diseaseManagementAreasControlled, \"initialOrFollowup == 'Initial' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Disease management\"].template.dataModel[name=\"diseaseManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "30fcbc69-07de-4cee-a952-17dfdcc99841",
    "filterValue": "NHT - Disease management",
    "property": "totalAreaDiseaseManagementFollowup",
    "computedExpression": "sum(diseaseManagementAreasControlled, \"initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Disease management\"].template.dataModel[name=\"diseaseManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "48d7b144-ae3a-4b45-a022-0654c38dcc5a",
    "filterValue": "NHT - Disease management",
    "property": "totalLengthDiseaseManagementInitial",
    "computedExpression": "sum(diseaseManagementAreasControlled, \"initialOrFollowup == 'Initial' ? lengthTreatedKm : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Disease management\"].template.dataModel[name=\"diseaseManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "8ba07e59-2d5a-4b08-8775-2643c67126f7",
    "filterValue": "NHT - Disease management",
    "property": "totalLengthDiseaseManagementFollowup",
    "computedExpression": "sum(diseaseManagementAreasControlled, \"initialOrFollowup == 'Follow-up' ? lengthTreatedKm : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Disease management\"].template.dataModel[name=\"diseaseManagementAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "86d53f79-9847-4c1c-91b6-0df157bfbb46",
    "filterValue": "NHT - Pest animal survey",
    "property": "totalSurveyBaseline",
    "computedExpression": "sum(pestAnimalSurveys, \"baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Pest animal survey\"].template.dataModel[name=\"pestAnimalSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "d02595ef-b0f0-464e-9950-a38ea17e7449",
    "filterValue": "NHT - Pest animal survey",
    "property": "totalSurveyIndicator",
    "computedExpression": "sum(pestAnimalSurveys, \"baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Pest animal survey\"].template.dataModel[name=\"pestAnimalSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "f4f3790d-8af6-4d75-8b5c-da5834359837",
    "filterValue": "NHT - Plant survival survey",
    "property": "totalSurveyIndicator",
    "computedExpression": "sum(plantSurvivalSurveys, \"surveyObjective ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Plant survival survey\"].template.dataModel[name=\"plantSurvivalSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "a7e6b1ee-d458-4330-a1b2-fd9fc1636955",
    "filterValue": "NHT - Remediating riparian and aquatic areas",
    "property": "totalAreaRemediationInitial",
    "computedExpression": "sum(remediatingAreas, \"initialOrFollowup == 'Initial' ? areaTreatedHaRemediated : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Remediating riparian and aquatic areas\"].template.dataModel[name=\"remediatingAreas\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "d8d501c9-f18b-4dcd-88d8-1a3b947b4a87",
    "filterValue": "NHT - Remediating riparian and aquatic areas",
    "property": "totalAreaRemediationFollowup",
    "computedExpression": "sum(remediatingAreas, \"initialOrFollowup == 'Follow-up' ? areaTreatedHaRemediated : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Remediating riparian and aquatic areas\"].template.dataModel[name=\"remediatingAreas\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "adf68191-6ed1-46cb-9d6c-ab4a02cccb5d",
    "filterValue": "NHT - Remediating riparian and aquatic areas",
    "property": "totalLengthRemediationInitial",
    "computedExpression": "sum(remediatingAreas, \"initialOrFollowup == 'Initial' ? lengthTreatedKmRemediated : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Remediating riparian and aquatic areas\"].template.dataModel[name=\"remediatingAreas\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "f6ba8663-b014-4033-84d6-0dd96e593385",
    "filterValue": "NHT - Remediating riparian and aquatic areas",
    "property": "totalLengthRemediationFollowup",
    "computedExpression": "sum(remediatingAreas, \"initialOrFollowup == 'Follow-up' ? lengthTreatedKmRemediated : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Remediating riparian and aquatic areas\"].template.dataModel[name=\"remediatingAreas\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "7299cb0e-b811-49ec-8ea2-08ac75c39647",
    "filterValue": "NHT - Remediating riparian and aquatic areas",
    "property": "totalStructuresInstalled",
    "computedExpression": "sum(remediatingAreas, \"noRemediationInterventions\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Remediating riparian and aquatic areas\"].template.dataModel[name=\"remediatingAreas\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "29f64aa4-e4e5-4e27-bdac-0a259730f3a1",
    "filterValue": "NHT - Weed treatment",
    "property": "totalAreaWeedsTreatedInitial",
    "computedExpression": "sum(weedTreatmentAreasControlled, \"initialOrFollowup == 'Initial' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Weed treatment\"].template.dataModel[name=\"weedTreatmentAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "97afd8a0-aa10-4987-8e9e-4c572f6a80b3",
    "filterValue": "NHT - Weed treatment",
    "property": "totalAreaWeedsTreatedFollowup",
    "computedExpression": "sum(weedTreatmentAreasControlled, \"initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Weed treatment\"].template.dataModel[name=\"weedTreatmentAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "cf1794d1-5d9b-410b-9092-372ebf691b96",
    "filterValue": "NHT - Weed treatment",
    "property": "totalLengthWeedsTreatedInitial",
    "computedExpression": "sum(weedTreatmentAreasControlled, \"initialOrFollowup == 'Initial' ? lengthTreatedKm : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Weed treatment\"].template.dataModel[name=\"weedTreatmentAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "14230564-70c2-47e6-9e75-ddc407fc9916",
    "filterValue": "NHT - Weed treatment",
    "property": "totalLengthWeedsTreatedFollowup",
    "computedExpression": "sum(weedTreatmentAreasControlled, \"initialOrFollowup == 'Follow-up' ? lengthTreatedKm : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Weed treatment\"].template.dataModel[name=\"weedTreatmentAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "53341328-38fc-460b-a330-4906543dd468",
    "filterValue": "NHT - Revegetating habitat",
    "property": "totalAreaWeedsTreatedInitial",
    "computedExpression": "sum(revegetationAreasControlled, \"initialOrMaintenance == 'Initial' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Revegetating habitat\"].template.dataModel[name=\"revegetationAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "49fbabc3-cad5-4504-b06b-721482393613",
    "filterValue": "NHT - Revegetating habitat",
    "property": "totalAreaWeedsTreatedFollowup",
    "computedExpression": "sum(revegetationAreasControlled, \"initialOrMaintenance == 'Maintenance' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Revegetating habitat\"].template.dataModel[name=\"revegetationAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "cc50184f-4b1b-4086-9ef8-387c88799acf",
    "filterValue": "NHT - Skills and knowledge survey",
    "property": "totalSurveyBaseline",
    "computedExpression": "sum(skillsAndKnowledgeSurveys, \"baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Skills and knowledge survey\"].template.dataModel[name=\"skillsAndKnowledgeSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "2dbb1e1f-b00b-4f09-8af9-eefee9474695",
    "filterValue": "NHT - Skills and knowledge survey",
    "property": "totalSurveyIndicator",
    "computedExpression": "sum(skillsAndKnowledgeSurveys, \"baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Skills and knowledge survey\"].template.dataModel[name=\"skillsAndKnowledgeSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "5de1fddf-5089-496b-8e8f-6127ff39c3a1",
    "filterValue": "NHT - Soil testing",
    "property": "totalSurveyBaseline",
    "error": "Property not found in dataModel"
  },
  {
    "scoreId": "e8559392-8a14-46a2-b962-cf8be46bc476",
    "filterValue": "NHT - Soil testing",
    "property": "totalSurveyIndicator",
    "error": "Property not found in dataModel"
  },
  {
    "scoreId": "36481317-5db0-4d87-93ae-9ffcabbfa6a0",
    "filterValue": "NHT - Emergency Interventions",
    "property": "totalNumberInterventionsInitial",
    "computedExpression": "sum(interventionDetails, \"initialOrFollowup == 'Initial' ? numberOfInterventions : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Emergency Interventions\"].template.dataModel[name=\"interventionDetails\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "0c44f773-fb12-4753-9d0a-6900a2858230",
    "filterValue": "NHT - Emergency Interventions",
    "property": "totalNumberInterventionsFollowUp",
    "computedExpression": "sum(interventionDetails, \"initialOrFollowup == 'Follow-up' ? numberOfInterventions : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Emergency Interventions\"].template.dataModel[name=\"interventionDetails\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "a82d04c9-4cdf-40c2-9bed-78539b92bf58",
    "filterValue": "NHT - Water quality survey",
    "property": "totalSurveyBaseline",
    "computedExpression": "sum(waterQualitySurveys, \"baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Water quality survey\"].template.dataModel[name=\"waterQualitySurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "edaefddb-e55d-40ba-bb7b-a163f9678125",
    "filterValue": "NHT - Water quality survey",
    "property": "totalSurveyIndicator",
    "computedExpression": "sum(waterQualitySurveys, \"baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Water quality survey\"].template.dataModel[name=\"waterQualitySurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "a9bd257e-ebfe-4dc6-98c5-98488c80c12d",
    "filterValue": "NHT - Weed distribution survey",
    "property": "totalSurveyBaseline",
    "computedExpression": "sum(weedSurveys, \"baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Weed distribution survey\"].template.dataModel[name=\"weedSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "b6a2c1f2-9daa-4256-b79c-6fc3a2df3b05",
    "filterValue": "NHT - Weed distribution survey",
    "property": "totalSurveyIndicator",
    "computedExpression": "sum(weedSurveys, \"baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Weed distribution survey\"].template.dataModel[name=\"weedSurveys\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "c43c95a6-2698-4e2d-8d5d-9f8bcc5bbc0a",
    "filterValue": "NHT - Debris removal",
    "property": "totalAreaDebrisRemovedInitial",
    "computedExpression": "sum(debrisRemovalAreasControlled, \"initialOrFollowup == 'Initial' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Debris removal\"].template.dataModel[name=\"debrisRemovalAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "a8687dcf-7a08-4d7e-9cba-7c14b701048c",
    "filterValue": "NHT - Debris removal",
    "property": "totalAreaDebrisRemovedFollowup",
    "computedExpression": "sum(debrisRemovalAreasControlled, \"initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Debris removal\"].template.dataModel[name=\"debrisRemovalAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "21a7fd05-79b4-46b2-b939-c90ee4699867",
    "filterValue": "NHT - Debris removal",
    "property": "totalLengthDebrisRemovedInitial",
    "computedExpression": "sum(debrisRemovalAreasControlled, \"initialOrFollowup == 'Initial' ? lengthTreatedKm : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Debris removal\"].template.dataModel[name=\"debrisRemovalAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "c1e99d44-369d-4c85-b20d-c35685c32a80",
    "filterValue": "NHT - Debris removal",
    "property": "totalLengthDebrisRemovedFollowup",
    "computedExpression": "sum(debrisRemovalAreasControlled, \"initialOrFollowup == 'Follow-up' ? lengthTreatedKm : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Debris removal\"].template.dataModel[name=\"debrisRemovalAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "332bd6c4-3209-4691-b454-3dbe4f011385",
    "filterValue": "NHT - Site preparation",
    "property": "totalAreaSitePreparation",
    "computedExpression": "sum(sitePreparationDetailsControlled, \"areaTreatedHa\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Site preparation\"].template.dataModel[name=\"sitePreparationDetailsControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "2695a9b8-54db-4483-90e5-c83c5a230060",
    "filterValue": "NHT - Site preparation",
    "property": "totalLengthSitePreparation",
    "computedExpression": "sum(sitePreparationDetailsControlled, \"lengthTreatedKm\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Site preparation\"].template.dataModel[name=\"sitePreparationDetailsControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "a0cc136c-094a-4e57-b5e0-f410dbb3ae51",
    "filterValue": "NHT - Seed Collection",
    "property": "totalAmountSeedsCuttingsCollected",
    "computedExpression": "sum(areasOfSeedCollection, \"amountSeedCollected\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Seed Collection\"].template.dataModel[name=\"areasOfSeedCollection\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "2930c94c-cb39-4df6-9593-6ce76a5bb9e9",
    "filterValue": "NHT - Seed Collection",
    "property": "totalDaysPropagating",
    "computedExpression": "sum(areasOfSeedCollection, \"noOfDaysPropagating\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Seed Collection\"].template.dataModel[name=\"areasOfSeedCollection\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "b2299148-ec80-4c02-ac91-afbe780f7344",
    "filterValue": "NHT - Seed Collection",
    "property": "totalPlantsPropagated",
    "computedExpression": "sum(areasOfSeedCollection, \"noOfPlantsPropogated\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Seed Collection\"].template.dataModel[name=\"areasOfSeedCollection\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "c7d0963e-2847-4f5f-8a1c-e149dfa4c9d1",
    "filterValue": "NHT - Seed Collection",
    "property": "totalDaysSeedsCuttingsCollected",
    "computedExpression": "sum(areasOfSeedCollection, \"numberOfDaysCollectingSeeds\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Seed Collection\"].template.dataModel[name=\"areasOfSeedCollection\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "3d06b150-bb86-47dc-8ad8-c33a51c3e3b3",
    "filterValue": "NHT - Sustainable agriculture facilitators",
    "property": "totalAnnualFtes",
    "computedExpression": "sum(safAreasControlled, \"fteOfThisPosition\")/4",
    "relatedOutcomesPath": "sections[name=\"NHT - Sustainable agriculture facilitators\"].template.dataModel[name=\"safAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "b8304577-afd8-45e0-8ef4-b71ae10998f5",
    "filterValue": "NHT - First nations australians cultural practices",
    "property": "totalNoDaysCulturalPractices",
    "computedExpression": "sum(firstNationAreasControlled, \"noDaysConductingCulturalPractices\")",
    "relatedOutcomesPath": "sections[name=\"NHT - First nations australians cultural practices\"].template.dataModel[name=\"firstNationAreasControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "07440abb-88a7-47a7-a5b2-26d834d00679",
    "filterValue": "NHT - Research and development",
    "property": "noDaysConductingResearchAndDevelopment",
    "computedExpression": "sum(researchAndDevelopmentByOutcome, \"numberOfDaysConducted\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Research and development\"].template.dataModel[name=\"researchAndDevelopmentByOutcome\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "e4cedcec-6a4c-4125-8d27-9230d6a21ba5",
    "filterValue": "NHT - Establishing Agreements",
    "property": "totalAreaConservationAgreements",
    "computedExpression": "sum(conservationAgreementsControlled, \"establishedOrImplementation == 'Established' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Establishing Agreements\"].template.dataModel[name=\"conservationAgreementsControlled\"].columns[name=\"relatedOutcomes\"]"
  },
  {
    "scoreId": "2504bde1-6389-4d65-8a5d-95bccefccd0a",
    "filterValue": "NHT - Establishing Agreements",
    "property": "totalAreaActivitiesConducted",
    "computedExpression": "sum(conservationAgreementsControlled, \"establishedOrImplementation == 'Implementation' ? areaTreatedHa : 0\")",
    "relatedOutcomesPath": "sections[name=\"NHT - Establishing Agreements\"].template.dataModel[name=\"conservationAgreementsControlled\"].columns[name=\"relatedOutcomes\"]"
  }
];


const scoreInfo = [
  {
    scoreId: '58422487-fe0a-4cc6-85b6-761e9f2752b9',
    filterValue: 'NHT - Baseline data',
    property: 'totalNumberBaselineDatasets',
    computedExpression: 'sum(baselineDetailsControlled, "relatedOutcomes ? 1 : 0")',
    relatedOutcomesPath: 'sections[name="NHT - Baseline data"].template.dataModel[name="baselineDetailsControlled"].columns[name="relatedOutcomes"]',
    label: 'Number of baseline datasets synthesised and finalised'
  },
  {
    scoreId: '7abd62ba-2e44-4318-800b-b659c73dc12b',
    filterValue: 'NHT - Communication materials',
    property: 'totalMaterialsPublished',
    computedExpression: 'sum(communicationMaterialsByOutcome, "numberOfCommunicationsMaterialsPublishedForOutcome")',
    relatedOutcomesPath: 'sections[name="NHT - Communication materials"].template.dataModel[name="communicationMaterialsByOutcome"].columns[name="relatedOutcomes"]',
    label: 'Number of communication materials published'
  },
  {
    scoreId: 'f9c85612-602e-465c-89e0-e155b34b1f31',
    filterValue: 'NHT - Community engagement',
    property: 'totalNumberEngagementHeld',
    computedExpression: 'sum(communityEngagementByOutcome, "engagementsForOutcome")',
    relatedOutcomesPath: 'sections[name="NHT - Community engagement"].template.dataModel[name="communityEngagementByOutcome"].columns[name="relatedOutcomes"]',
    label: 'Number of engagement events'
  },
  {
    scoreId: 'e30b721b-99d7-4292-9395-e10ad8b1b9e1',
    filterValue: 'NHT - Controlling access',
    property: 'totalAreaStructuresInstalled',
    computedExpression: 'sum(controllingAccessAreasControlled, "areaTreatedHa")',
    relatedOutcomesPath: 'sections[name="NHT - Controlling access"].template.dataModel[name="controllingAccessAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of structures installed that control access'
  },
  {
    scoreId: 'eedf53df-e2f1-4fde-b955-41b46ac83282',
    filterValue: 'NHT - Controlling access',
    property: 'totalLengthStructuresInstalled',
    computedExpression: 'sum(controllingAccessAreasControlled, "lengthTreatedKm")',
    relatedOutcomesPath: 'sections[name="NHT - Controlling access"].template.dataModel[name="controllingAccessAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) of structures installed that control access'
  },
  {
    scoreId: '6c92881f-d8ae-434c-9275-3373ce8023fb',
    filterValue: 'NHT - Controlling access',
    property: 'totalStructuresInstalled',
    computedExpression: 'sum(controllingAccessAreasControlled, "numberInstalled")',
    relatedOutcomesPath: 'sections[name="NHT - Controlling access"].template.dataModel[name="controllingAccessAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Number of structures installed that control access'
  },
  {
    scoreId: 'e037c2d7-a5e5-4e5c-a173-a2f426d39e95',
    filterValue: 'NHT - Pest animal management',
    property: 'totalAreaPestAnimalsTreatedInitial',
    computedExpression: `sum(areasControlled, "initialOrFollowup == 'Initial' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Pest animal management"].template.dataModel[name="areasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) treated for pest animals - initial'
  },
  {
    scoreId: 'dd4a0ab0-f760-44e9-ae37-5589a06678dd',
    filterValue: 'NHT - Pest animal management',
    property: 'totalAreaPestAnimalsTreatedFollowUp',
    computedExpression: `sum(areasControlled, "initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Pest animal management"].template.dataModel[name="areasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) treated for pest animals - follow-up'
  },
  {
    scoreId: '7ba84972-750a-4952-921d-1552743bc09b',
    filterValue: 'NHT - Pest animal management',
    property: 'totalLengthPestAnimalsTreatedFollowUp',
    computedExpression: `sum(areasControlled, "initialOrFollowup == 'Follow-up' ? lengthTreatedKm : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Pest animal management"].template.dataModel[name="areasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) treated for pest animals - follow-up'
  },
  {
    scoreId: '64555f23-a7f0-4fbd-a509-2a5492f7e91b',
    filterValue: 'NHT - Pest animal management',
    property: 'totalLengthPestAnimalsTreatedInitial',
    computedExpression: `sum(areasControlled, "initialOrFollowup == 'Initial' ? lengthTreatedKm : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Pest animal management"].template.dataModel[name="areasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) treated for pest animals - initial'
  },
  {
    scoreId: 'ab61838c-eba7-4007-bb06-65fe0bfcf604',
    filterValue: 'NHT - Erosion Management',
    property: 'totalAreaErosionControlInitial',
    computedExpression: `sum(erosionManagementAreasControlled, "initialOrFollowup == 'Initial' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Erosion Management"].template.dataModel[name="erosionManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of erosion control - initial'
  },
  {
    scoreId: 'd75389ba-e4a7-4735-9e52-93d86667d519',
    filterValue: 'NHT - Erosion Management',
    property: 'totalAreaErosionControlFollowup',
    computedExpression: `sum(erosionManagementAreasControlled, "initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Erosion Management"].template.dataModel[name="erosionManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of erosion control - follow-up'
  },
  {
    scoreId: 'cb7c9d74-c1fc-4503-b4d8-96586b7d28c5',
    filterValue: 'NHT - Erosion Management',
    property: 'totalLengthStreamCoastlineInitial',
    computedExpression: `sum(erosionManagementAreasControlled, "initialOrFollowup == 'Initial' ? lengthTreatedKm : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Erosion Management"].template.dataModel[name="erosionManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) of stream/coastline treated for erosion - initial'
  },
  {
    scoreId: '50e4a1a1-31cb-4236-b23e-3949edcfba06',
    filterValue: 'NHT - Erosion Management',
    property: 'totalLengthStreamCoastlineFollowup',
    computedExpression: `sum(erosionManagementAreasControlled, "initialOrFollowup == 'Follow-up' ? lengthTreatedKm : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Erosion Management"].template.dataModel[name="erosionManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) of stream/coastline treated for erosion - follow-up'
  },
  {
    scoreId: '11dc6641-488a-482b-9e4d-4d1ab1fad282',
    filterValue: 'NHT - Maintaining feral free enclosures',
    property: 'totalNoPestFreeSurveyEstablished',
    computedExpression: `sum(enclosureDetails, "newOrMaintained == 'Initial' ? numberOfPestFreeEnclosures : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Maintaining feral free enclosures"].template.dataModel[name="enclosureDetails"].columns[name="relatedOutcomes"]',
    label: 'Number of pest animal-free enclosures - initial'
  },
  {
    scoreId: 'a253fcea-320d-4d12-a736-a1189c732b17',
    filterValue: 'NHT - Maintaining feral free enclosures',
    property: 'totalNoPestFreeSurveyMaintained',
    computedExpression: `sum(enclosureDetails, "newOrMaintained == 'Maintained' ? numberOfPestFreeEnclosures : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Maintaining feral free enclosures"].template.dataModel[name="enclosureDetails"].columns[name="relatedOutcomes"]',
    label: 'Number of pest animal-free enclosures - maintained'
  },
  {
    scoreId: '4feac7e6-b5bd-4b5b-869d-3e3fdfced31b',
    filterValue: 'NHT - Maintaining feral free enclosures',
    property: 'totalNoDaysMaintainingPestFree',
    computedExpression: 'sum(enclosureDetails, "daysSpentOnMaintenanceOfEnclosures")',
    relatedOutcomesPath: 'sections[name="NHT - Maintaining feral free enclosures"].template.dataModel[name="enclosureDetails"].columns[name="relatedOutcomes"]',
    label: 'Number of days maintaining pest animal-free enclosures'
  },
  {
    scoreId: '82db08b5-58e8-4d35-8335-037801ef4067',
    filterValue: 'NHT - Maintaining feral free enclosures',
    property: 'totalAreaPestFreeSurveyInitial',
    computedExpression: 'sum(enclosureDetails, "areaTreatedHa")',
    relatedOutcomesPath: 'sections[name="NHT - Maintaining feral free enclosures"].template.dataModel[name="enclosureDetails"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of pest animal-free enclosure'
  },
  {
    scoreId: '23261000-91f6-4480-8368-fa910649f3e1',
    filterValue: 'NHT - Establishing ex-situ breeding programs',
    property: 'totalCaptiveBreedingEstablished',
    computedExpression: `sum(breedingProgramDetails, "newOrMaintained == 'Newly established' ? numberOfCaptiveBreeding : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Establishing ex-situ breeding programs"].template.dataModel[name="breedingProgramDetails"].columns[name="relatedOutcomes"]',
    label: 'Number of captive breeding and release, translocation, or re-introduction programs established'
  },
  {
    scoreId: '8990164b-73c1-4ec1-90aa-b1b6e306e186',
    filterValue: 'NHT - Establishing ex-situ breeding programs',
    property: 'totalCaptiveBreedingMaintained',
    computedExpression: `sum(breedingProgramDetails, "newOrMaintained == 'Maintained' ? numberOfCaptiveBreeding : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Establishing ex-situ breeding programs"].template.dataModel[name="breedingProgramDetails"].columns[name="relatedOutcomes"]',
    label: 'Number of captive breeding and release, translocation, or re-introduction programs maintained'
  },
  {
    scoreId: '3751ae6f-b0a2-4ec0-935f-1da14b334f38',
    filterValue: 'NHT - Establishing ex-situ breeding programs',
    property: 'totalNumberOfDaysSpentMaintainingCaptiveBreedingPrograms',
    error: 'Property not found in dataModel',
    label: 'Number of days captive breeding and release, translocation, or re-introduction programs are maintained'
  },
  {
    scoreId: 'a30e7b28-b986-456c-a209-14fc6af38cd9',
    filterValue: 'NHT - Establishing ex-situ breeding programs',
    property: 'totalNumberOfMonthsSpentMaintainingCaptiveBreedingPrograms',
    error: 'Property not found in dataModel',
    label: 'Number of months captive breeding and release, translocation, or re-introduction programs are maintained'
  },
  {
    scoreId: '1246a484-cade-497d-a76e-e5fdf881e46f',
    filterValue: 'NHT - Farm Management Survey',
    property: 'totalSurveyBaseline',
    computedExpression: `sum(farmManagementSurveys, "baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Farm Management Survey"].template.dataModel[name="farmManagementSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of farm management surveys conducted - baseline'
  },
  {
    scoreId: 'b80aaccc-5f28-43f0-a754-338b9b1c0edd',
    filterValue: 'NHT - Farm Management Survey',
    property: 'totalSurveyIndicator',
    computedExpression: `sum(farmManagementSurveys, "baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Farm Management Survey"].template.dataModel[name="farmManagementSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of farm management surveys conducted - indicator'
  },
  {
    scoreId: 'e0a2e283-77a2-4f74-94de-550578cc4612',
    filterValue: 'NHT - Fauna survey',
    property: 'totalSurveyBaseline',
    computedExpression: `sum(faunaSurveys, "baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Fauna survey"].template.dataModel[name="faunaSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of fauna surveys conducted - baseline'
  },
  {
    scoreId: '65dbe133-29c2-46a8-a91f-c76ece73e2fc',
    filterValue: 'NHT - Fauna survey',
    property: 'totalSurveyIndicator',
    computedExpression: `sum(faunaSurveys, "baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Fauna survey"].template.dataModel[name="faunaSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of fauna surveys conducted - indicator'
  },
  {
    scoreId: 'a2ba766b-f9ce-4948-b331-b4989e8edfc8',
    filterValue: 'NHT - Fire management',
    property: 'totalAreaTreatedFireMgmtInitial',
    computedExpression: `sum(fireManagementAreasControlled, "initialOrFollowup == 'Initial' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Fire management"].template.dataModel[name="fireManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) treated by fire management action/s - initial'
  },
  {
    scoreId: '6a7f9150-3107-46fc-967d-143b595f39a3',
    filterValue: 'NHT - Fire management',
    property: 'totalAreaTreatedFireMgmtFollowup',
    computedExpression: `sum(fireManagementAreasControlled, "initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Fire management"].template.dataModel[name="fireManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) treated by fire management action/s - follow-up'
  },
  {
    scoreId: 'c0b0a691-057e-4af4-a0d2-647988354931',
    filterValue: 'NHT - Flora survey',
    property: 'totalSurveyBaseline',
    computedExpression: `sum(floraSurveys, "baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Flora survey"].template.dataModel[name="floraSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of flora surveys conducted - baseline'
  },
  {
    scoreId: 'e5de1384-40b8-4347-b3b3-e1efb8f0b09b',
    filterValue: 'NHT - Flora survey',
    property: 'totalSurveyIndicator',
    computedExpression: `sum(floraSurveys, "baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Flora survey"].template.dataModel[name="floraSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of flora surveys conducted - indicator'
  },
  {
    scoreId: 'ede35cd2-bb14-44b6-8d47-6b0ea55cb2d1',
    filterValue: 'NHT - Habitat augmentation',
    property: 'totalAreaAugmentationInitial',
    computedExpression: `sum(habitatAugmentationAreas, "initialOrMaintained == 'Initial' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Habitat augmentation"].template.dataModel[name="habitatAugmentationAreas"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of augmentation - initial'
  },
  {
    scoreId: 'da7e114f-24ed-4924-b763-4843fbe85152',
    filterValue: 'NHT - Habitat augmentation',
    property: 'totalAreaAugmentationMaintained',
    computedExpression: `sum(habitatAugmentationAreas, "initialOrMaintained == 'Maintained' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Habitat augmentation"].template.dataModel[name="habitatAugmentationAreas"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of augmentation - maintained'
  },
  {
    scoreId: '88d2eddf-5633-4220-948c-f5b5d690b896',
    filterValue: 'NHT - Habitat augmentation',
    property: 'totalStructuresInstalledInitial',
    computedExpression: `sum(habitatAugmentationAreas, "initialOrMaintained == 'Initial' ? noStructuresInstalled : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Habitat augmentation"].template.dataModel[name="habitatAugmentationAreas"].columns[name="relatedOutcomes"]',
    label: 'Number of locations where structures installed - initial'
  },
  {
    scoreId: '6d3971f4-a393-499e-ad7d-6d030a0ace7e',
    filterValue: 'NHT - Habitat augmentation',
    property: 'totalStructuresInstalledMaintained',
    computedExpression: `sum(habitatAugmentationAreas, "initialOrMaintained == 'Maintained' ? noStructuresInstalled : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Habitat augmentation"].template.dataModel[name="habitatAugmentationAreas"].columns[name="relatedOutcomes"]',
    label: 'Number of locations where structures installed - maintained'
  },
  {
    scoreId: '9e17ef60-59e4-4509-a396-0f0a8e3d77d4',
    filterValue: 'NHT - Improving hydrological regimes',
    property: 'totalHydroTreatmentsInitial',
    computedExpression: `sum(hydroAreasControlled, "initialOrFollowup == 'Initial' ? noTreatments : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Improving hydrological regimes"].template.dataModel[name="hydroAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Number of treatments implemented to improve site eco-hydrology - initial'
  },
  {
    scoreId: '0a973540-78c8-45b8-9074-5d99b0c8a8ef',
    filterValue: 'NHT - Improving hydrological regimes',
    property: 'totalHydroTreatmentsFollowup',
    computedExpression: `sum(hydroAreasControlled, "initialOrFollowup == 'Follow-up' ? noTreatments : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Improving hydrological regimes"].template.dataModel[name="hydroAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Number of treatments implemented to improve site eco-hydrology - follow-up'
  },
  {
    scoreId: '91185422-300a-43c9-8148-3074aa9b9bf2',
    filterValue: 'NHT - Habitat condition assessment',
    property: 'totalSurveyBaseline',
    computedExpression: `sum(habitatConditionSurveys, "baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Habitat condition assessment"].template.dataModel[name="habitatConditionSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of habitat condition assessment surveys conducted - baseline'
  },
  {
    scoreId: '88b6be7f-8b43-4514-b6f5-7176d5a6a23b',
    filterValue: 'NHT - Habitat condition assessment',
    property: 'totalSurveyIndicator',
    computedExpression: `sum(habitatConditionSurveys, "baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Habitat condition assessment"].template.dataModel[name="habitatConditionSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of habitat condition assessment surveys conducted - indicator'
  },
  {
    scoreId: '6902a27f-a4bb-4a85-82e9-ea2e361510c2',
    filterValue: 'NHT - Identifying sites',
    property: 'totalPotentialSites',
    computedExpression: 'sum(potentialSiteSurveys, "rowCount")',
    relatedOutcomesPath: 'sections[name="NHT - Identifying sites"].template.dataModel[name="potentialSiteSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of potential sites assessed'
  },
  {
    scoreId: 'de5f262d-5474-40ef-92fc-a631bd2866ff',
    filterValue: 'NHT - Improving land management practices',
    property: 'totalAreaPracticeChangeInitial',
    computedExpression: `sum(landManagementAreasControlled, "initialOrFollowup == 'Initial' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Improving land management practices"].template.dataModel[name="landManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) covered by practice change - initial'
  },
  {
    scoreId: 'eb72cc6e-6e0b-449b-954d-d76b5c9dfe10',
    filterValue: 'NHT - Improving land management practices',
    property: 'totalAreaPracticeChangeFollowup',
    computedExpression: `sum(landManagementAreasControlled, "initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Improving land management practices"].template.dataModel[name="landManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) covered by practice change - follow-up'
  },
  {
    scoreId: '210ade50-7e53-44d5-a170-a8271e4a5448',
    filterValue: 'NHT - Disease management',
    property: 'totalAreaDiseaseManagementInitial',
    computedExpression: `sum(diseaseManagementAreasControlled, "initialOrFollowup == 'Initial' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Disease management"].template.dataModel[name="diseaseManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) for disease treatment/prevention - initial'
  },
  {
    scoreId: '30fcbc69-07de-4cee-a952-17dfdcc99841',
    filterValue: 'NHT - Disease management',
    property: 'totalAreaDiseaseManagementFollowup',
    computedExpression: `sum(diseaseManagementAreasControlled, "initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Disease management"].template.dataModel[name="diseaseManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) for disease treatment/prevention - follow-up'
  },
  {
    scoreId: '48d7b144-ae3a-4b45-a022-0654c38dcc5a',
    filterValue: 'NHT - Disease management',
    property: 'totalLengthDiseaseManagementInitial',
    computedExpression: `sum(diseaseManagementAreasControlled, "initialOrFollowup == 'Initial' ? lengthTreatedKm : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Disease management"].template.dataModel[name="diseaseManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) for disease treatment/prevention - initial'
  },
  {
    scoreId: '8ba07e59-2d5a-4b08-8775-2643c67126f7',
    filterValue: 'NHT - Disease management',
    property: 'totalLengthDiseaseManagementFollowup',
    computedExpression: `sum(diseaseManagementAreasControlled, "initialOrFollowup == 'Follow-up' ? lengthTreatedKm : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Disease management"].template.dataModel[name="diseaseManagementAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) for disease treatment/prevention - follow-up'
  },
  {
    scoreId: '86d53f79-9847-4c1c-91b6-0df157bfbb46',
    filterValue: 'NHT - Pest animal survey',
    property: 'totalSurveyBaseline',
    computedExpression: `sum(pestAnimalSurveys, "baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Pest animal survey"].template.dataModel[name="pestAnimalSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of pest animal surveys conducted - baseline'
  },
  {
    scoreId: 'd02595ef-b0f0-464e-9950-a38ea17e7449',
    filterValue: 'NHT - Pest animal survey',
    property: 'totalSurveyIndicator',
    computedExpression: `sum(pestAnimalSurveys, "baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Pest animal survey"].template.dataModel[name="pestAnimalSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of pest animal surveys conducted - indicator'
  },
  {
    scoreId: 'f4f3790d-8af6-4d75-8b5c-da5834359837',
    filterValue: 'NHT - Plant survival survey',
    property: 'totalSurveyIndicator',
    computedExpression: 'sum(plantSurvivalSurveys, "surveyObjective ? 1 : 0")',
    relatedOutcomesPath: 'sections[name="NHT - Plant survival survey"].template.dataModel[name="plantSurvivalSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of seed germination/plant survival surveys completed - indicator'
  },
  {
    scoreId: 'a7e6b1ee-d458-4330-a1b2-fd9fc1636955',
    filterValue: 'NHT - Remediating riparian and aquatic areas',
    property: 'totalAreaRemediationInitial',
    computedExpression: `sum(remediatingAreas, "initialOrFollowup == 'Initial' ? areaTreatedHaRemediated : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Remediating riparian and aquatic areas"].template.dataModel[name="remediatingAreas"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of remediation of riparian/aquatic areas - initial'
  },
  {
    scoreId: 'd8d501c9-f18b-4dcd-88d8-1a3b947b4a87',
    filterValue: 'NHT - Remediating riparian and aquatic areas',
    property: 'totalAreaRemediationFollowup',
    computedExpression: `sum(remediatingAreas, "initialOrFollowup == 'Follow-up' ? areaTreatedHaRemediated : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Remediating riparian and aquatic areas"].template.dataModel[name="remediatingAreas"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of remediation of riparian/aquatic areas - follow-up'
  },
  {
    scoreId: 'adf68191-6ed1-46cb-9d6c-ab4a02cccb5d',
    filterValue: 'NHT - Remediating riparian and aquatic areas',
    property: 'totalLengthRemediationInitial',
    computedExpression: `sum(remediatingAreas, "initialOrFollowup == 'Initial' ? lengthTreatedKmRemediated : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Remediating riparian and aquatic areas"].template.dataModel[name="remediatingAreas"].columns[name="relatedOutcomes"]',
    label: 'Length (km) of remediation of riparian/aquatic areas - initial'
  },
  {
    scoreId: 'f6ba8663-b014-4033-84d6-0dd96e593385',
    filterValue: 'NHT - Remediating riparian and aquatic areas',
    property: 'totalLengthRemediationFollowup',
    computedExpression: `sum(remediatingAreas, "initialOrFollowup == 'Follow-up' ? lengthTreatedKmRemediated : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Remediating riparian and aquatic areas"].template.dataModel[name="remediatingAreas"].columns[name="relatedOutcomes"]',
    label: 'Length (km) of remediation of riparian/aquatic areas - follow-up'
  },
  {
    scoreId: '7299cb0e-b811-49ec-8ea2-08ac75c39647',
    filterValue: 'NHT - Remediating riparian and aquatic areas',
    property: 'totalStructuresInstalled',
    computedExpression: 'sum(remediatingAreas, "noRemediationInterventions")',
    relatedOutcomesPath: 'sections[name="NHT - Remediating riparian and aquatic areas"].template.dataModel[name="remediatingAreas"].columns[name="relatedOutcomes"]',
    label: 'Number of structures installed to promote aquatic health'
  },
  {
    scoreId: '29f64aa4-e4e5-4e27-bdac-0a259730f3a1',
    filterValue: 'NHT - Weed treatment',
    property: 'totalAreaWeedsTreatedInitial',
    computedExpression: `sum(weedTreatmentAreasControlled, "initialOrFollowup == 'Initial' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Weed treatment"].template.dataModel[name="weedTreatmentAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) treated for weeds - initial'
  },
  {
    scoreId: '97afd8a0-aa10-4987-8e9e-4c572f6a80b3',
    filterValue: 'NHT - Weed treatment',
    property: 'totalAreaWeedsTreatedFollowup',
    computedExpression: `sum(weedTreatmentAreasControlled, "initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Weed treatment"].template.dataModel[name="weedTreatmentAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) treated for weeds - follow-up'
  },
  {
    scoreId: 'cf1794d1-5d9b-410b-9092-372ebf691b96',
    filterValue: 'NHT - Weed treatment',
    property: 'totalLengthWeedsTreatedInitial',
    computedExpression: `sum(weedTreatmentAreasControlled, "initialOrFollowup == 'Initial' ? lengthTreatedKm : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Weed treatment"].template.dataModel[name="weedTreatmentAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) treated for weeds - initial'
  },
  {
    scoreId: '14230564-70c2-47e6-9e75-ddc407fc9916',
    filterValue: 'NHT - Weed treatment',
    property: 'totalLengthWeedsTreatedFollowup',
    computedExpression: `sum(weedTreatmentAreasControlled, "initialOrFollowup == 'Follow-up' ? lengthTreatedKm : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Weed treatment"].template.dataModel[name="weedTreatmentAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) treated for weeds - follow-up'
  },
  {
    scoreId: '53341328-38fc-460b-a330-4906543dd468',
    filterValue: 'NHT - Revegetating habitat',
    property: 'totalAreaWeedsTreatedInitial',
    computedExpression: `sum(revegetationAreasControlled, "initialOrMaintenance == 'Initial' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Revegetating habitat"].template.dataModel[name="revegetationAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of habitat revegetated - initial'
  },
  {
    scoreId: '49fbabc3-cad5-4504-b06b-721482393613',
    filterValue: 'NHT - Revegetating habitat',
    property: 'totalAreaWeedsTreatedFollowup',
    computedExpression: `sum(revegetationAreasControlled, "initialOrMaintenance == 'Maintenance' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Revegetating habitat"].template.dataModel[name="revegetationAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of habitat revegetated - maintained'
  },
  {
    scoreId: 'cc50184f-4b1b-4086-9ef8-387c88799acf',
    filterValue: 'NHT - Skills and knowledge survey',
    property: 'totalSurveyBaseline',
    computedExpression: `sum(skillsAndKnowledgeSurveys, "baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Skills and knowledge survey"].template.dataModel[name="skillsAndKnowledgeSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of skills and knowledge surveys conducted - baseline'
  },
  {
    scoreId: '2dbb1e1f-b00b-4f09-8af9-eefee9474695',
    filterValue: 'NHT - Skills and knowledge survey',
    property: 'totalSurveyIndicator',
    computedExpression: `sum(skillsAndKnowledgeSurveys, "baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Skills and knowledge survey"].template.dataModel[name="skillsAndKnowledgeSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of skills and knowledge surveys conducted - indicator'
  },
  {
    scoreId: '5de1fddf-5089-496b-8e8f-6127ff39c3a1',
    filterValue: 'NHT - Soil testing',
    property: 'totalSurveyBaseline',
    error: 'Property not found in dataModel',
    label: 'Number of soil tests conducted - baseline'
  },
  {
    scoreId: 'e8559392-8a14-46a2-b962-cf8be46bc476',
    filterValue: 'NHT - Soil testing',
    property: 'totalSurveyIndicator',
    error: 'Property not found in dataModel',
    label: 'Number of soil tests conducted - indicator'
  },
  {
    scoreId: '36481317-5db0-4d87-93ae-9ffcabbfa6a0',
    filterValue: 'NHT - Emergency Interventions',
    property: 'totalNumberInterventionsInitial',
    computedExpression: `sum(interventionDetails, "initialOrFollowup == 'Initial' ? numberOfInterventions : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Emergency Interventions"].template.dataModel[name="interventionDetails"].columns[name="relatedOutcomes"]',
    label: 'Number of interventions - initial'
  },
  {
    scoreId: '0c44f773-fb12-4753-9d0a-6900a2858230',
    filterValue: 'NHT - Emergency Interventions',
    property: 'totalNumberInterventionsFollowUp',
    computedExpression: `sum(interventionDetails, "initialOrFollowup == 'Follow-up' ? numberOfInterventions : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Emergency Interventions"].template.dataModel[name="interventionDetails"].columns[name="relatedOutcomes"]',
    label: 'Number of interventions - follow-up'
  },
  {
    scoreId: 'a82d04c9-4cdf-40c2-9bed-78539b92bf58',
    filterValue: 'NHT - Water quality survey',
    property: 'totalSurveyBaseline',
    computedExpression: `sum(waterQualitySurveys, "baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Water quality survey"].template.dataModel[name="waterQualitySurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of water quality or hydrology surveys conducted - baseline'
  },
  {
    scoreId: 'edaefddb-e55d-40ba-bb7b-a163f9678125',
    filterValue: 'NHT - Water quality survey',
    property: 'totalSurveyIndicator',
    computedExpression: `sum(waterQualitySurveys, "baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Water quality survey"].template.dataModel[name="waterQualitySurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of water quality or hydrology surveys conducted - indicator'
  },
  {
    scoreId: 'a9bd257e-ebfe-4dc6-98c5-98488c80c12d',
    filterValue: 'NHT - Weed distribution survey',
    property: 'totalSurveyBaseline',
    computedExpression: `sum(weedSurveys, "baselineOrIndicatorSurvey == 'Baseline' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Weed distribution survey"].template.dataModel[name="weedSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of weed distribution surveys conducted - baseline'
  },
  {
    scoreId: 'b6a2c1f2-9daa-4256-b79c-6fc3a2df3b05',
    filterValue: 'NHT - Weed distribution survey',
    property: 'totalSurveyIndicator',
    computedExpression: `sum(weedSurveys, "baselineOrIndicatorSurvey == 'Indicator' ? 1 : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Weed distribution survey"].template.dataModel[name="weedSurveys"].columns[name="relatedOutcomes"]',
    label: 'Number of weed distribution surveys conducted - indicator'
  },
  {
    scoreId: 'c43c95a6-2698-4e2d-8d5d-9f8bcc5bbc0a',
    filterValue: 'NHT - Debris removal',
    property: 'totalAreaDebrisRemovedInitial',
    computedExpression: `sum(debrisRemovalAreasControlled, "initialOrFollowup == 'Initial' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Debris removal"].template.dataModel[name="debrisRemovalAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of debris removal - initial'
  },
  {
    scoreId: 'a8687dcf-7a08-4d7e-9cba-7c14b701048c',
    filterValue: 'NHT - Debris removal',
    property: 'totalAreaDebrisRemovedFollowup',
    computedExpression: `sum(debrisRemovalAreasControlled, "initialOrFollowup == 'Follow-up' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Debris removal"].template.dataModel[name="debrisRemovalAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of debris removal - follow-up'
  },
  {
    scoreId: '21a7fd05-79b4-46b2-b939-c90ee4699867',
    filterValue: 'NHT - Debris removal',
    property: 'totalLengthDebrisRemovedInitial',
    computedExpression: `sum(debrisRemovalAreasControlled, "initialOrFollowup == 'Initial' ? lengthTreatedKm : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Debris removal"].template.dataModel[name="debrisRemovalAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) of debris removal - initial'
  },
  {
    scoreId: 'c1e99d44-369d-4c85-b20d-c35685c32a80',
    filterValue: 'NHT - Debris removal',
    property: 'totalLengthDebrisRemovedFollowup',
    computedExpression: `sum(debrisRemovalAreasControlled, "initialOrFollowup == 'Follow-up' ? lengthTreatedKm : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Debris removal"].template.dataModel[name="debrisRemovalAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) of debris removal - follow-up'
  },
  {
    scoreId: '332bd6c4-3209-4691-b454-3dbe4f011385',
    filterValue: 'NHT - Site preparation',
    property: 'totalAreaSitePreparation',
    computedExpression: 'sum(sitePreparationDetailsControlled, "areaTreatedHa")',
    relatedOutcomesPath: 'sections[name="NHT - Site preparation"].template.dataModel[name="sitePreparationDetailsControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) of site preparation'
  },
  {
    scoreId: '2695a9b8-54db-4483-90e5-c83c5a230060',
    filterValue: 'NHT - Site preparation',
    property: 'totalLengthSitePreparation',
    computedExpression: 'sum(sitePreparationDetailsControlled, "lengthTreatedKm")',
    relatedOutcomesPath: 'sections[name="NHT - Site preparation"].template.dataModel[name="sitePreparationDetailsControlled"].columns[name="relatedOutcomes"]',
    label: 'Length (km) of site preparation'
  },
  {
    scoreId: 'a0cc136c-094a-4e57-b5e0-f410dbb3ae51',
    filterValue: 'NHT - Seed Collection',
    property: 'totalAmountSeedsCuttingsCollected',
    computedExpression: 'sum(areasOfSeedCollection, "amountSeedCollected")',
    relatedOutcomesPath: 'sections[name="NHT - Seed Collection"].template.dataModel[name="areasOfSeedCollection"].columns[name="relatedOutcomes"]',
    label: 'Amount (grams)/number of seeds/cuttings collected'
  },
  {
    scoreId: '2930c94c-cb39-4df6-9593-6ce76a5bb9e9',
    filterValue: 'NHT - Seed Collection',
    property: 'totalDaysPropagating',
    computedExpression: 'sum(areasOfSeedCollection, "noOfDaysPropagating")',
    relatedOutcomesPath: 'sections[name="NHT - Seed Collection"].template.dataModel[name="areasOfSeedCollection"].columns[name="relatedOutcomes"]',
    label: 'Number of days propagating'
  },
  {
    scoreId: 'b2299148-ec80-4c02-ac91-afbe780f7344',
    filterValue: 'NHT - Seed Collection',
    property: 'totalPlantsPropagated',
    computedExpression: 'sum(areasOfSeedCollection, "noOfPlantsPropogated")',
    relatedOutcomesPath: 'sections[name="NHT - Seed Collection"].template.dataModel[name="areasOfSeedCollection"].columns[name="relatedOutcomes"]',
    label: 'Number of plants propagated'
  },
  {
    scoreId: 'c7d0963e-2847-4f5f-8a1c-e149dfa4c9d1',
    filterValue: 'NHT - Seed Collection',
    property: 'totalDaysSeedsCuttingsCollected',
    computedExpression: 'sum(areasOfSeedCollection, "numberOfDaysCollectingSeeds")',
    relatedOutcomesPath: 'sections[name="NHT - Seed Collection"].template.dataModel[name="areasOfSeedCollection"].columns[name="relatedOutcomes"]',
    label: 'Number of days collecting seeds/cuttings'
  },
  {
    scoreId: '3d06b150-bb86-47dc-8ad8-c33a51c3e3b3',
    filterValue: 'NHT - Sustainable agriculture facilitators',
    property: 'totalAnnualFtes',
    computedExpression: 'sum(safAreasControlled, "fteOfThisPosition")/4',
    relatedOutcomesPath: 'sections[name="NHT - Sustainable agriculture facilitators"].template.dataModel[name="safAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Number of SAF FTEs invoiced for'
  },
  {
    scoreId: 'b8304577-afd8-45e0-8ef4-b71ae10998f5',
    filterValue: 'NHT - First nations australians cultural practices',
    property: 'totalNoDaysCulturalPractices',
    computedExpression: 'sum(firstNationAreasControlled, "noDaysConductingCulturalPractices")',
    relatedOutcomesPath: 'sections[name="NHT - First nations australians cultural practices"].template.dataModel[name="firstNationAreasControlled"].columns[name="relatedOutcomes"]',
    label: 'Number of days conducting cultural practices'
  },
  {
    scoreId: '07440abb-88a7-47a7-a5b2-26d834d00679',
    filterValue: 'NHT - Research and development',
    property: 'noDaysConductingResearchAndDevelopment',
    computedExpression: 'sum(researchAndDevelopmentByOutcome, "numberOfDaysConducted")',
    relatedOutcomesPath: 'sections[name="NHT - Research and development"].template.dataModel[name="researchAndDevelopmentByOutcome"].columns[name="relatedOutcomes"]',
    label: 'Number of days conducting research and development'
  },
  {
    scoreId: 'e4cedcec-6a4c-4125-8d27-9230d6a21ba5',
    filterValue: 'NHT - Establishing Agreements',
    property: 'totalAreaConservationAgreements',
    computedExpression: `sum(conservationAgreementsControlled, "establishedOrImplementation == 'Established' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Establishing Agreements"].template.dataModel[name="conservationAgreementsControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) covered by conservation agreements established'
  },
  {
    scoreId: '2504bde1-6389-4d65-8a5d-95bccefccd0a',
    filterValue: 'NHT - Establishing Agreements',
    property: 'totalAreaActivitiesConducted',
    computedExpression: `sum(conservationAgreementsControlled, "establishedOrImplementation == 'Implementation' ? areaTreatedHa : 0")`,
    relatedOutcomesPath: 'sections[name="NHT - Establishing Agreements"].template.dataModel[name="conservationAgreementsControlled"].columns[name="relatedOutcomes"]',
    label: 'Area (ha) where implementation activities conducted (implementation/stewardship)'
  }
];


let scores = db.score.find({'relatedScores.description':/outcome/});
while (scores.hasNext()) {
    let score = scores.next();
    score.relatedScores = score.relatedScores.filter(relatedScore => !relatedScore.description.match(/outcome/));
    db.score.replaceOne({scoreId: score.scoreId}, score);
}

for (const scoreConfig of scoreInfo) {

  let score = db.score.findOne({label: scoreConfig.label});
  if (!score) {
    print("Unable to find score with label "+scoreConfig.label);
    continue;
  }
  if (!scoreConfig.relatedOutcomesPath) {
    print("Can't process config: "+scoreConfig.error+", "+scoreConfig.label);
    continue;
  }

  const match = scoreConfig.relatedOutcomesPath.match(/dataModel\[name="([^"]+)"\]\.columns\[name="([^"]+)"\]/);
  let listName = null;
  let columnName = null;
  if (match) {
    listName = match[1];
    columnName = match[2];

  }
  else {
    print("Outcomes path didn't match "+scoreConfig.relatedOutcomesPath);
    continue;
  }

  let nhtConfigSection = score.configuration.childAggregations;

  if (nhtConfigSection.length > 1) {
    for (let i in nhtConfigSection) {
     let section = nhtConfigSection[i];
      if (section.filter && section.filter.filterValue.indexOf('NHT') >= 0) {
        nhtConfigSection = section;
        print("Found config section using NHT")
        break;
      }
    }
    if (!nhtConfigSection) {
      print("Couldn't find a config matching NHT so using the last one....")
      nhtConfigSection = score.configuration.childAggregations[score.configuration.childAggregations.length - 1];
    }
  } else {
    nhtConfigSection = score.configuration.childAggregations[0];
  }


  let newScore = {
    scoreId: UUID.generate(),
    label: score.label + " by related outcomes",
    category: "NHT",
    isOutputTarget: false,
    status: "active",
    outputType: score.outputType,
    entityTypes: score.entityTypes,
    configuration: {
        childAggregations: [
          {
            filter: {
              filterValue: scoreConfig.filterValue,
              type:'filter',
              property:'name'

            },
            childAggregations: [
              {
                groups: {
                  type: 'discrete',
                  property: 'data.' + listName + '.' + columnName
                },
                childAggregations: nhtConfigSection.childAggregations

              }
            ]
          }
        ]
    }
  };

  const now = ISODate();
  score.lastUpdated = now;
  newScore.dateCreated = now;
  newScore.lastUpdated = now;

  let existingNewScore = db.score.findOne({label:newScore.label});
  if (existingNewScore) {
    db.score.replaceOne({scoreId:existingNewScore.scoreId}, newScore);
  }
  else {
    db.score.insertOne(newScore);
  }

  score.relatedScores.push({
    description: "By outcome",
    scoreId: newScore.scoreId
  });


  db.score.replaceOne({scoreId: score.scoreId}, score);

  audit(score, score.scoreId, 'au.org.ala.ecodata.Score', '<system>')



}

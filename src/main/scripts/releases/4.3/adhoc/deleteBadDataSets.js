load('../../../utils/audit.js');
load('../../../utils/reports.js');
const adminUserId = 'system';
let project=db.project.findOne({projectId:'f4a0642b-49b7-4ec3-9be5-e7e65a25cb78'});
let dataSets=project.custom.dataSets;
print(project.custom.dataSets.length);
let deleteCount =0;
function removeDataSet(dataSets, badSurveyUuid, goodDataSetId, deleteStarted) {
    for (let i=0; i<dataSets.length; i++) {
        let dataSet=dataSets[i];
        if (dataSet.surveyId) {
            if (dataSet.surveyId.survey_metadata.survey_details.uuid == badSurveyUuid) {

                if (dataSet.progress != 'planned') {
                    if (deleteStarted && dataSet.progress == 'started') {
                        if (dataSet.dataSetId != goodDataSetId) {
                            print("Deleting dataset: " + dataSet.dataSetId + " for survey: " + badSurveyUuid+ " with name: " + dataSet.name + " in started state");
                            deleteActivity(dataSet.activityId, adminUserId);
                            // remove the dataset from the array
                            dataSets.splice(i, 1);
                            deleteCount++;
                            return dataSets;
                        }
                    }
                    else {
                        print("Warning dataset is not in planned state: " + dataSet.dataSetId + ",  "+dataSet.name);
                    }


                } else {
                    print("Deleting dataset: " + dataSet.dataSetId + " for survey: " + badSurveyUuid+ " with name: " + dataSet.name+ " in planned state");

                    // remove the dataset from the array
                    dataSets.splice(i, 1);
                    deleteCount++;
                    return dataSets;
                }
            }
        }
    }
}

function deleteAndUpdate(badSurveyId, goodDatasetId, deleteStarted) {
    deleteCount = 0;
    let dataSets = project.custom.dataSets;

    while (dataSets) {
        dataSets = removeDataSet(dataSets, badSurveyUuid, goodDatasetId, deleteStarted);
    }
    print("Deleted " + deleteCount+ " datasets with survey uuid " + badSurveyUuid);
    print(project.custom.dataSets.length);

    db.project.replaceOne({projectId:project.projectId}, project);
    audit(project, project.projectId, 'au.org.ala.ecodata.Project', 'system', project.projectId);
}

// Cover - enhanced
let badSurveyUuid = '3d4940ef-2eca-4a87-b2d2-4b228dbd499e';
deleteAndUpdate(badSurveyUuid);

// Photopoints
badSurveyUuid = '9b5360ce-5b4e-478f-b006-0292e22870ba';
goodDataSetId = '40982ac4-8464-4d1a-a1da-9dc7c1ae979d';
deleteAndUpdate(badSurveyUuid, goodDataSetId, true);

// FLoristics
badSurveyUuid = '7a635ab4-c871-4a4b-8b69-94c5d83a56d2';
goodDataSetId = 'f57b2b34-bdc7-4e91-b28f-5e231f63cad5';
deleteAndUpdate(badSurveyUuid, goodDataSetId, true);

// Floristics
badSurveyUuid = '955ebed3-bc05-4353-abcb-bf1c3e1c98db';
goodDataSetId = 'a941dbe7-9a0f-4f84-a3ce-f51d0c39f8f9';
deleteAndUpdate(badSurveyUuid, goodDataSetId, true);

// Floristics
badSurveyUuid = '6a970b22-4521-469c-ac79-a83ef7c2d0d1';
goodDataSetId = 'c4bdd5ad-6f92-494a-99d6-bb3dc887b733';
deleteAndUpdate(badSurveyUuid, goodDataSetId, true);

// Floristics
badSurveyUuid = '1ed22901-469a-4ee6-985e-dbec17780cb1';
goodDataSetId = '582afd5a-567e-4616-b658-29f5a597f1e9';
deleteAndUpdate(badSurveyUuid, goodDataSetId, true);

// Floristics
badSurveyUuid = '852382f0-1526-4c7e-bb02-7edf6c369840';
goodDataSetId = 'f4b6b130-fa9a-4a38-8408-14f3b934c496';
deleteAndUpdate(badSurveyUuid, goodDataSetId, true);

// Floristics
badSurveyUuid = 'b6f3f4db-9e83-44db-aac1-859b7dae06d6';
goodDataSetId = '04a6397b-1443-49fe-83d6-354f51fe7021';
deleteAndUpdate(badSurveyUuid, goodDataSetId, true);

// Floristics
badSurveyUuid = '5ddc8adf-ecbb-4221-ac52-d75ca20e7442';
goodDataSetId = '6b3ab834-4037-4ab8-9dd4-b376682144f4';
deleteAndUpdate(badSurveyUuid, goodDataSetId, true);

badSurveyUuid = '9d4defe3-c1fb-43b9-9594-06c00ecb6729';
deleteAndUpdate(badSurveyUuid);

badSurveyUuid = 'be49fe0d-8d97-4a62-9ec5-c45f171d7c8e';
deleteAndUpdate(badSurveyUuid);

// Floristics
badSurveyUuid = 'd1ab3343-761d-4a6e-b47e-0c3001d72f5a';
goodDataSetId = 'c0d1bc94-f965-4f3e-977f-c671fbcbe1f1';
deleteAndUpdate(badSurveyUuid, goodDataSetId, true);


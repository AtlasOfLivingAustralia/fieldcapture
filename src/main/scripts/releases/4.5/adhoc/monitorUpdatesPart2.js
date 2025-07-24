load("../../../utils/audit.js");
load('../../../utils/dataSets.js');
const adminUserId = 'system';
const projectId = '718c6e69-5266-495d-88d7-b84b932afab7';
const dataSetId = '469dc84c-92f0-4179-8d12-9ff213bfb210';
let project = db.project.findOne({projectId: projectId});

const site3 = '5881f919-d75d-4f37-94a1-d1062450ed11';

removeDataSetSite(projectId, dataSetId, adminUserId, true);

// Re-sync the data set
//https://ecodata-staging.ala.org.au/admin/reSubmitDataSet?id=718c6e69-5266-495d-88d7-b84b932afab7&dataSetId=469dc84c-92f0-4179-8d12-9ff213bfb210
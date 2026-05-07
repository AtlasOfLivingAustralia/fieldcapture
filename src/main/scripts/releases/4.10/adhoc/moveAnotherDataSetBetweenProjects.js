load('../../../utils/audit.js');
load('../../../utils/dataSets.js');

const dataSetIds = [
   '14b3c245-c7ee-4785-88c9-0d49a8028637'
];

const fromProjectId = 'ba3f2d5d-0b63-481d-b096-3d1eb520bc7c';
const toProjectId = '5d8a2cbf-dc3a-41d6-be02-3a327292be64';

const adminUserId = '<system>';

for (let i=0; i<dataSetIds.length; i++) {
    moveDataSet(dataSetIds[i], fromProjectId, toProjectId, adminUserId);
}

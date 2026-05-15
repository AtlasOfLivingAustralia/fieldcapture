load('../../../utils/audit.js');
load('../../../utils/dataSets.js');

const dataSetIds = [
    'fb06dc1e-e448-486d-b724-0a00c351db88',
    '8c9423a5-59dc-4028-8c94-b02697d24165',
    'f511fadf-3d4f-44ab-b661-07edcd589bde',
    'b2751f6c-06cf-4b75-9990-ae3621c57ab4'
];

const fromProjectId = 'ba3f2d5d-0b63-481d-b096-3d1eb520bc7c';
const toProjectId = '5d8a2cbf-dc3a-41d6-be02-3a327292be64';

const adminUserId = '<system>';

for (let i=0; i<dataSetIds.length; i++) {
    moveDataSet(dataSetIds[i], fromProjectId, toProjectId, adminUserId);
}

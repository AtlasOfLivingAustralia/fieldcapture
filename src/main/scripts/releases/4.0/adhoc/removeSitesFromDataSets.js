load('../../../utils/dataSets.js');
let adminUserId = '<tba>';

let projectId = '38f9f4b2-a33f-4f10-9b79-b514653e5abd';

let dataSets = ['44cc5fb3-dcc5-49bf-8d2d-ba841bcf638c','d3b9a7cd-5b11-4a66-bce7-3d9354c743d7'];

for (let i=0; i<dataSets.length; i++) {
    removeDataSetSite(projectId, dataSets[i], adminUserId);
}
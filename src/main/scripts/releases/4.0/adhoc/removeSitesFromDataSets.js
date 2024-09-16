load('../../../utils/dataSets.js');
let adminUserId = '<tba>';

let projectId = 'tbs';

let dataSets = ['ds1','ds2'];

for (let i=0; i<dataSets.length; i++) {
    removeDataSetSite(projectId, dataSets[i], adminUserId);
}
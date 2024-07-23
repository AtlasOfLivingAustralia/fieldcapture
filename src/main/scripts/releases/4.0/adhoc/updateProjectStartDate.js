load('../../../utils/audit.js');
load('../../../utils/reports.js');

let adminUserId = '129333'

let projectId = '877a2e25-ef65-4a01-a488-ba7a528d42fa'; //staging
let project = db.project.findOne({projectId:projectId});
let startDate = ISODate('2020-01-28T14:00:00Z'); // 29/1/2020
db.project.updateOne({projectId:projectId}, {$set:{plannedStartDate:startDate}});

const reportIds = [
    'd4c90c0c-30bb-40eb-b4d2-beaa3edf6ddb',
    '475e9bc2-85a3-47a9-85b9-e385413a8a6b'
];



for (let i=0; i<reportIds.length; i++) {
    deleteReport(reportIds[i], adminUserId);
}
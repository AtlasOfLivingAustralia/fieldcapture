load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/reports.js');

let adminUserId = '1493';

const grantIds = [
    'ERF-MU23-P1',
    'ERF-MU23-P6',
    'ERF-MU23-P5',
    'ERF-MU23-P4',
    'ERF-MU23-P7',
    'ERF-MU23-P2',
    'ERF-MU23-P3'
];



for (let i=0; i<grantIds.length; i++) {
    let project = db.project.findOne({grantId: grantIds[i]});

    let reportDetails = {
        name: 'Outcomes Report 2',
        category: 'Outcomes Report 2',
        generatedBy: 'Outcomes Report 2',
        activityType: 'RLP Medium term project outcomes',
        type:"Single"
    };

    reportDetails.description = reportDetails.name + ' for ' + project.name;
    createReportForProject(reportDetails, project, adminUserId);


}
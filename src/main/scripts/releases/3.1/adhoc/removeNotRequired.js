load('../../../utils/reports.js');
load('../../../utils/audit.js');
const adminUserId = '1493';
const reportIds = [];

const grantIds = [
'ASP-MU05-P1',
'ASP-MU38-P1',
'ASP-MU37-P1',
'ASP-MU12-P1',
'ASP-MU20-P1',
'ASP-MU44-P1',
'ASP-MU42-P1',
'ASP-MU16-P1',
'ASP-MU28-P1',
'ASP-MU41-P1',
'ASP-MU26-P1',
];


for (let i=0; i<grantIds.length; i++) {
    let project = db.project.findOne({grantId:grantIds[i]});

    let report = db.report.findOne({projectId:project.projectId, activityType:'Annual Report 2022', toDate:{$gte:project.plannedEndDate}});

    if (!report) {
        throw "Uhoh, found no report for project "+grantIds[i];
    }
    else {
        print("Found report "+report.name);
    }

    removeNotRequiredStatus(report.reportId, 'Extending project end date', adminUserId);

}
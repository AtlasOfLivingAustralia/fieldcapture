print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: "+pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');

createProject({name:'project 1', projectId:"project_1", programId:'program_1',managementUnitId:"mu_1", grantId:"RLP-Test-Program-Project-1" })

createProgram({name:'Regional Land Partnerships', programId:'program_1' })
createMu({name:'test mu', managementUnitId:"mu_1"});

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'program_1', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_1', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'mu_1', userId:'1', accessLevel:'admin'});


loadActivityForms();
var report1 = {
        "managementUnitId" : "mu_1",
        "activityType" : "RLP Core Services report",
        "category" : "Core Services Reporting",
        "dateCreated" : ISODate("2019-08-27T01:13:26.944Z"),
        "description" : "Core services report 1 for Test MU",
        "fromDate" : ISODate("2018-06-30T14:00:00.000Z"),
        "lastUpdated" : ISODate("2019-09-04T05:38:41.463Z"),
        "name" : "Core services report 1",
        "publicationStatus" : "unpublished",
        "reportId" : "report_1",
        "status" : "active",
        "submissionDate" : ISODate("2018-07-31T14:00:00.000Z"),
        "toDate" : ISODate("2018-07-31T14:00:00.000Z"),
        "type" : "Administrative",
        "activityId" : "activity_1",
        "progress" : "started",
        "projectId":"project_1"
}

var activity1 = {
    "activityId" : "activity_1",
    "assessment" : false,
    "dateCreated" : ISODate("2019-08-27T01:13:26.961Z"),
    "description" : "Core services report 1",
    "endDate" : ISODate("2018-07-31T14:00:00.000Z"),
    "lastUpdated" : ISODate("2019-09-04T05:38:41.470Z"),
    "plannedEndDate" : ISODate("2018-07-31T14:00:00.000Z"),
    "plannedStartDate" : ISODate("2018-06-30T14:00:00.000Z"),
    "progress" : "started",
    "startDate" : ISODate("2018-06-30T14:00:00.000Z"),
    "status" : "active",
    "type" : "RLP Core Services report",
    "formVersion" : 1,
    "projectStage" : "",
    "siteId" : "",
    "mainTheme" : "",
    "projectId":"project_1"
}

db.report.insert(report1);
db.activity.insert(activity1);


var document1 = {
    "dateCreated" : ISODate("2020-01-13T23:17:31.180Z"),
    "documentId" : "document_1",
    "filename" : "Screen Shot 2019-11-12 at 1.25.38 pm.png",
    "filepath" : "2020-01",
    "isPrimaryProjectImage" : false,
    "isSciStarter" : false,
    "labels" : [],
    "lastUpdated" : ISODate("2020-01-13T23:46:50.184Z"),
    "name" : "test 1",
    "projectId" : "project_1",
    "role" : "information",
    "status" : "active",
    "thirdPartyConsentDeclarationMade" : false,
    "type" : "image",
    "reportId" : "report_1",
    "readOnly" : false,
    "filesize" : 95759,
    "uploadDate" : "2020-01-13T23:17:31Z",
    "contentType" : "image/png"
};

db.document.insert(document1);
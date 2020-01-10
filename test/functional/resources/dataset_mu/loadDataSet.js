print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: "+pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');

var blog1 = {
    "content": "blog test",
    "keepOnTop" : true,
    "title" : "BlogTest",
    "blogEntryId" : "0",
    "projectId" : "project_1",
    "date" : "2017-01-03T13:00:00Z",
    "type" : "Project Stories",
    "stockIcon" : ""
}

createProject({name:'project 1', projectId:"project_1", programId:'test_program',managementUnitId:"test_mu",siteId:'test_site_1', grantId:"RLP-Test-Program-Project-1",
    blog:[blog1]})
createProject({name:'project 2', projectId:"project_2", programId:'test_program',managementUnitId:"test_mu_2",siteId:'test_site_2', grantId:"RLP-Test-Program-Project-2"})
createProject({name:'project in ACT', projectId:"project_3", programId:'test_program',managementUnitId:"test_mu_3",siteId:'test_site_3', grantId:"RLP-Test-Program-Project-3"})




createSite(site1)
createSite({name:"test site 2", siteId:'test_site_2', extent:{geometry:{state:'Victoria'}}})
createSite({name:"ACT Acronyms", siteId:'test_site_3', extent:{geometry:{state:'ACT'}}})

var blog_program = {
    "content": "blog test",
    "keepOnTop" : true,
    "title" : "BlogTest",
    "blogEntryId" : "0",
    "programId" : "test_program",
    "date" : "2017-01-03T13:00:00Z",
    "type" : "Program Stories",
    "stockIcon" : ""
}

createProgram({name:'Regional Land Partnerships', programId:'test_program', blog:[blog_program]})

var blog_mu = {
    "content": "blog test",
    "keepOnTop" : true,
    "title" : "BlogTest",
    "blogEntryId" : "0",
    "managementUnitId" : "test_mu",
    "date" : "2017-01-03T13:00:00Z",
    "type" : "Management Unit Stories",
    "stockIcon" : ""
}


createMu({name:'test mu', managementUnitId:"test_mu",managementUnitSiteId:'test_site_1', blog:[blog_mu]});
createMu({name:'test mu 2', managementUnitId:"test_mu_2",managementUnitSiteId:'test_site_2'})
createMu({name:'test mu in ACT', managementUnitId:"test_mu_3",managementUnitSiteId:'test_site_3'})

// createProgram({programId:"test_program_2", name:"test program 2"})
// createProject({projectId:"test_project_2", name:"test project 2", programId:'test_program_2', managementUnitId:"test_mu"})

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'test_program', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_1', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'test_mu_2', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'test_mu', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'test_mu', userId:'3', accessLevel:'caseManager'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'test_mu', userId:'4', accessLevel:'editor'});




var site1 = {
    "dateCreated" : ISODate("2013-12-16T00:48:29.045Z"),
    "extent" : {
        "source" : "Point",
        "geometry" : {
            "centre" : [
                "138.343",
                "-29.688"
            ],
            "areaKmSq" : 0,
            "type" : "Point",
            "coordinates" : [
                138.343,
                -29.688
            ],
            "aream2" : 0.0,
            "state" : [
                "South Australia (including Coastal Waters)"
            ],
            "nrm" : [
                "South Australian Arid Lands"
            ],
            "lga" : [
                "Unincorporated SA"
            ],
            "ibra" : [
                "Stony Plains"
            ],
            "elect" : [
                "GREY"
            ],
            "cmz" : [
                "Arid shrublands and desert"
            ],
            "other" : [
                "National Native Title Register (NNTR, Determinations of Native Title) - boundaries and core attributes"
            ]
        }
    },
    "geoIndex" : {
        "type" : "Point",
        "coordinates" : [
            138.343,
            -29.688
        ]
    },
    "lastUpdated" : ISODate("2018-02-09T02:43:54.519Z"),
    "name" : "test site 1",
    "projects" : [
        "abdd9f05-a757-420b-85a6-3e8ae31c2d4f"
    ],
    "siteId" : "test_site_1",
    "status" : "active"
};

loadActivityForms();


var report1 = {
        "managementUnitId" : "test_mu",
        "activityType" : "RLP Core Services report",
        "category" : "Core Services Reporting",
        "dateCreated" : ISODate("2019-08-27T01:13:26.944Z"),
        "description" : "Core services report 1 for Test MU",
        "fromDate" : ISODate("2018-06-30T14:00:00.000Z"),
        "lastUpdated" : ISODate("2019-09-04T05:38:41.463Z"),
        "name" : "Core services report 1",
        "publicationStatus" : "unpublished",
        "reportId" : "a02a527a-4377-40f0-86de-77ceabe6d72f",
        "status" : "active",
        "submissionDate" : ISODate("2018-07-31T14:00:00.000Z"),
        "toDate" : ISODate("2018-07-31T14:00:00.000Z"),
        "type" : "Administrative",
        "activityId" : "d17254bf-b4fe-481c-9324-6d65d9c7c0d8",
        "progress" : "started"
}

var activity1 = {
    "activityId" : "d17254bf-b4fe-481c-9324-6d65d9c7c0d8",
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
    "mainTheme" : ""
}

db.report.insert(report1);
db.activity.insert(activity1);



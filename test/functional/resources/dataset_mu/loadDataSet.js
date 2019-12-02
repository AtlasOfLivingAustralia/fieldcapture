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
}








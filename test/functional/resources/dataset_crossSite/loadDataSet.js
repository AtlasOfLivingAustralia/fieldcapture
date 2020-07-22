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

var meriPlan = {
    outcomes: {
        primaryOutcome: { description: 'outcome 1'},
        secondaryOutcomes: [ {description: 'outcome 2'}, {description: 'outcome 3'} ]
    }
};

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'test_programId', userId:'1', accessLevel:'admin'});


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

var outcomes = [
    {
        outcome:'outcome 1',
        shortDescription: 'o1',
        type:'primary'
    },
    {
        outcome:'outcome 2',
        shortDescription: 'o2'
    },
    {
        outcome:'outcome 3',
        shortDescription: 'o3',
        type:'secondary'
    }
];

createProgram({name:'Regional Land Partnerships', parent: null, programId:'test_program', blog:[blog_program], outcomes:outcomes})

createOrganisation({
    name:'Test Organisation',
    organisationId:'test_organisation',
    status:'active', abn:'12345678901',
    url:'http://www.ala.org.au',
    acronym:'TSTORG'
})



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


createSite(site1)

// script injection

createProject({name:"Project Script Injection <script>alert('Test')</script>",
    projectId:"project_111",programId:'new_test_Program_1',managementUnitId:"test_mu_1", organisationId:"test_organisation_1",
    siteId:'test_site_1', grantId:"RLP-Test-Program-Project-1",
    blog:[blog1], custom:{details:meriPlan}});

createProgram({name:'New Test Program <script>alert("Program")</script>', parent:null, programId:'new_test_Program_1'});
createOrganisation({
    name:'Test Organisation <script>alert("Org")</script>',
    organisationId:'test_organisation_1',
    status:'active', abn:'12345678901',
    url:'http://www.ala.org.au',
    acronym:'TSTORG'
})

createMu({name:'test mu <script>alert("MU")</script>', managementUnitId:"test_mu_1",managementUnitSiteId:'test_site_1'});


loadActivityForms();








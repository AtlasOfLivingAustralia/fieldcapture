print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: " + process.cwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');

var blog1 = {
    "content": "blog test",
    "keepOnTop": true,
    "title": "BlogTest",
    "blogEntryId": "0",
    "projectId": "project_1",
    "date": "2017-01-03T13:00:00Z",
    "type": "Project Stories",
    "stockIcon": ""
}

var meriPlan = {
    outcomes: {
        primaryOutcome: {description: 'outcome 1'},
        secondaryOutcomes: [{description: 'outcome 2'}, {description: 'outcome 3'}]
    }
};
createProject({
    name: 'project 1',
    projectId: "project_1",
    programId: 'test_program',
    managementUnitId: "test_mu",
    siteId: 'test_site_1',
    grantId: "RLP-Test-Program-Project-1",
    blog: [blog1],
    custom: {details: meriPlan}
});
createProject({
    name: 'project 2',
    projectId: "project_2",
    programId: 'test_program',
    managementUnitId: "test_mu_2",
    siteId: 'test_site_2',
    grantId: "RLP-Test-Program-Project-2"
});
createProject({
    name: 'project in ACT',
    projectId: "project_3",
    programId: 'test_program',
    managementUnitId: "test_mu_3",
    siteId: 'test_site_3',
    grantId: "RLP-Test-Program-Project-3"
})

createProgram({name: 'A test program', programId: 'test_programId'})

db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Program',
    entityId: 'test_programId',
    userId: '1',
    accessLevel: 'admin'
});


createSite(site1)
createSite({name: "test site 2", siteId: 'test_site_2', extent: {geometry: {state: 'Victoria'}}})
createSite({name: "ACT Acronyms", siteId: 'test_site_3', extent: {geometry: {state: 'ACT'}}})

var blog_program = {
    "content": "blog test",
    "keepOnTop": true,
    "title": "BlogTest",
    "blogEntryId": "0",
    "programId": "test_program",
    "date": "2017-01-03T13:00:00Z",
    "type": "Program Stories",
    "stockIcon": ""
}

var outcomes = [
    {
        outcome: 'outcome 1',
        shortDescription: 'o1',
        type: 'primary'
    },
    {
        outcome: 'outcome 2',
        shortDescription: 'o2'
    },
    {
        outcome: 'outcome 3',
        shortDescription: 'o3',
        type: 'secondary'
    }
];
createProgram({name: 'New Test Program', parent: null, programId: 'new_test_Program'})
createProgram({name: 'New Second Test program', parent: null, programId: 'second_test_program'})
createProgram({
    name: 'Regional Land Partnerships',
    parent: null,
    programId: 'test_program',
    blog: [blog_program],
    outcomes: outcomes
})


createOrganisation({
    name: 'Test Organisation',
    abnStatus: 'Active',
    organisationId: 'test_organisation',
    status: 'active', abn: '12345678901',
    url: 'http://www.ala.org.au',
    acronym: 'TSTORG',
    state: "ACT",
    postcode: 2600

});

createMu({name: 'test mu', managementUnitId: "test_mu", managementUnitSiteId: 'test_site_1'});
createMu({name: 'test mu 2', managementUnitId: "test_mu_2", managementUnitSiteId: 'test_site_2'});
createMu({name: 'test mu in ACT', managementUnitId: "test_mu_3", managementUnitSiteId: 'test_site_3'});

db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Program',
    entityId: 'test_program',
    userId: '1',
    accessLevel: 'admin'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: 'project_1',
    userId: '1',
    accessLevel: 'admin'
});

db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.ManagementUnit',
    entityId: 'test_mu',
    userId: '1',
    accessLevel: 'admin'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.ManagementUnit',
    entityId: 'test_mu',
    userId: '4',
    accessLevel: 'editor'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.ManagementUnit',
    entityId: 'test_mu',
    userId: '1001',
    accessLevel: 'caseManager'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.ManagementUnit',
    entityId: 'test_mu_2',
    userId: '1',
    accessLevel: 'admin'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.ManagementUnit',
    entityId: 'test_mu_2',
    userId: '4',
    accessLevel: 'editor'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.ManagementUnit',
    entityId: 'test_mu_2',
    userId: '1001',
    accessLevel: 'caseManager'
});

db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Organisation',
    entityId: 'test_organisation',
    userId: '1',
    accessLevel: 'admin'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Organisation',
    entityId: 'test_organisation',
    userId: '4',
    accessLevel: 'editor'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Organisation',
    entityId: 'test_organisation',
    userId: '1001',
    accessLevel: 'caseManager'
});


var site1 = {
    "dateCreated": ISODate("2013-12-16T00:48:29.045Z"),
    "extent": {
        "source": "Point",
        "geometry": {
            "centre": [
                "138.343",
                "-29.688"
            ],
            "areaKmSq": 0,
            "type": "Point",
            "coordinates": [
                138.343,
                -29.688
            ],
            "aream2": 0.0,
            "state": [
                "South Australia (including Coastal Waters)"
            ],
            "nrm": [
                "South Australian Arid Lands"
            ],
            "lga": [
                "Unincorporated SA"
            ],
            "ibra": [
                "Stony Plains"
            ],
            "elect": [
                "GREY"
            ],
            "cmz": [
                "Arid shrublands and desert"
            ],
            "other": [
                "National Native Title Register (NNTR, Determinations of Native Title) - boundaries and core attributes"
            ]
        }
    },
    "geoIndex": {
        "type": "Point",
        "coordinates": [
            138.343,
            -29.688
        ]
    },
    "lastUpdated": ISODate("2018-02-09T02:43:54.519Z"),
    "name": "test site 1",
    "projects": [
        "abdd9f05-a757-420b-85a6-3e8ae31c2d4f"
    ],
    "siteId": "test_site_1",
    "status": "active"
};


// script injection

createProject({
    name: "Project Script Injection <script>alert('Test')</script>",
    projectId: "project_111", programId: 'new_test_Program_1', managementUnitId: "test_mu_1",
    siteId: 'test_site_1', grantId: "RLP-Test-Program-Project-1",
    blog: [blog1], custom: {details: meriPlan}
});

createProgram({
    name: 'New Test Program <script>alert("Program")</script>',
    parent: null,
    programId: 'new_test_Program_1'
});
createOrganisation({
    name: 'Test Organisation <script>alert("Org")</script>',
    organisationId: 'test_organisation_1',
    status: 'active', abn: '12345678901',
    url: 'http://www.ala.org.au',
    acronym: 'TSTORG'
})

createMu({
    name: 'test mu <script>alert("MU")</script>',
    managementUnitId: "test_mu_1",
    managementUnitSiteId: 'test_site_1'
});

addSetting('meritfielddata.rlp.cs_report.submitted.emailSubject', 'Report submitted subject');
addSetting('meritfielddata.rlp.cs_report.submitted.emailBody', 'Report submitted body');
addSetting('meritfielddata.rlp.cs_report.approved.emailSubject', 'Report approved subject');
addSetting('meritfielddata.rlp.cs_report.approved.emailBody', 'Report approved body');
addSetting('meritfielddata.rlp.cs_report.returned.emailSubject', 'Report approved subject');
addSetting('meritfielddata.rlp.cs_report.returned.emailBody', 'Report approved body');

addSetting('meritorganisation_report.submitted.emailSubject', 'Organisation report submitted subject');
addSetting('meritorganisation_report.submitted.emailBody', 'Organisation report submitted body');
addSetting('meritorganisation_report.approved.emailSubject', 'Organisation report approved subject');
addSetting('meritorganisation_report.approved.emailBody', 'Organisation report approved body');
addSetting('meritorganisation_report.returned.emailSubject', 'Organisation report returned subject');
addSetting('meritorganisation_report.returned.emailBody', 'Organisation report returned body');


loadActivityForms();


var report1 = {
    "managementUnitId": "test_mu",
    "activityType": "RLP Core Services report",
    "category": "Core Services Reporting",
    "dateCreated": ISODate("2019-08-27T01:13:26.944Z"),
    "description": "Core services report 1 for Test MU",
    "fromDate": ISODate("2018-06-30T14:00:00.000Z"),
    "lastUpdated": ISODate("2019-09-04T05:38:41.463Z"),
    "name": "Core services report 1",
    "publicationStatus": "unpublished",
    "reportId": "a02a527a-4377-40f0-86de-77ceabe6d72f",
    "status": "active",
    "submissionDate": ISODate("2018-07-31T14:00:00.000Z"),
    "toDate": ISODate("2018-07-31T14:00:00.000Z"),
    "type": "Administrative",
    "activityId": "d17254bf-b4fe-481c-9324-6d65d9c7c0d8",
    "progress": "started"
}

var activity1 = {
    "activityId": "d17254bf-b4fe-481c-9324-6d65d9c7c0d8",
    "assessment": false,
    "dateCreated": ISODate("2019-08-27T01:13:26.961Z"),
    "description": "Core services report 1",
    "endDate": ISODate("2018-07-31T14:00:00.000Z"),
    "lastUpdated": ISODate("2019-09-04T05:38:41.470Z"),
    "plannedEndDate": ISODate("2018-07-31T14:00:00.000Z"),
    "plannedStartDate": ISODate("2018-06-30T14:00:00.000Z"),
    "progress": "started",
    "startDate": ISODate("2018-06-30T14:00:00.000Z"),
    "status": "active",
    "type": "RLP Core Services report",
    "formVersion": NumberInt(1),
    "projectStage": "",
    "siteId": "",
    "mainTheme": ""
}

db.report.insert(report1);
db.activity.insert(activity1);

createProject({
    name: 'project org 1',
    projectId: "project_org1",
    programId: 'test_program',
    organisationId: "test_organisation",
    siteId: 'test_site_1',
    grantId: "RLP-Test-Program-Project-Org-1",
    blog: [blog1],
    custom: {details: meriPlan}
});

var orgReport1 = {
    "organisationId": "test_organisation",
    "activityType": "RLP Core Services report",
    "category": "Regional Capacity Services Reporting",
    "type": "Administrative",
    "description": "Core services report 1 for Test Organisation",
    "name": "Core services report 1",
    "reportId": "a02a527a-4377-40f0-86de-77ceabe6dddd",
    "activityId": "xyz254bf-b4fe-481c-9324-6d65d9c7c0d8",
    "dateCreated": ISODate("2022-06-01T01:13:26.944Z"),
    "submissionDate": ISODate("2022-07-15T14:00:00.000Z"),
    "lastUpdated": ISODate("2022-06-02T05:38:41.463Z"),
    "fromDate": ISODate("2023-01-01T14:00:00.000Z"),
    "toDate": ISODate("2023-03-31T14:00:00.000Z"),
    "publicationStatus": "unpublished",
    "status": "active",
    "progress": "started"
}

var orgPerfReport = {
    "reportId": "a02a527a-4377-40f0-86de-8eabe6weeknd",
    "dateCreated": ISODate("2016-06-22T01:13:26.944Z"),
    "lastUpdated": ISODate("2017-07-16T05:38:41.463Z"),
    "type": "Performance Management Framework - Self Assessment",
    "organisationId": "test_organisation",
    "name": "2015 / 2016 Performance Management Framework - Self Assessment",
    "publicationStatus": "unpublished",
    "status": "active",
    "progress": "finished",
    "fromDate": ISODate("2015-07-01T14:00:00.000Z"),
    "toDate": ISODate("2016-07-01T14:00:00.000Z"),
    "dueDate": ISODate("2016-08-15T14:00:00.000Z"),
    "submissionDate": ISODate("2016-07-01T14:00:00.000Z"),
    "category": "Performance Management Framework"
}

var activity2 = {
    "activityId": "xyz254bf-b4fe-481c-9324-6d65d9c7c0d8",
    "assessment": false,
    "dateCreated": ISODate("2022-06-01T14:00:00.000Z"),
    "description": "Core services report 1",
    "endDate": ISODate("2023-03-31T14:00:00.000Z"),
    "lastUpdated": ISODate("2022-09-04T05:38:41.470Z"),
    "plannedEndDate": ISODate("2022-12-31T14:00:00.000Z"),
    "plannedStartDate": ISODate("2022-06-30T14:00:00.000Z"),
    "progress": "planned",
    "startDate": ISODate("2023-01-01T14:00:00.000Z"),
    "status": "active",
    "type": "RLP Core Services report",
    "formVersion": NumberInt(1),
    "projectStage": "",
    "siteId": "",
    "mainTheme": ""
}


db.report.insert(orgReport1);
db.report.insert(orgPerfReport);
db.activity.insert(activity2);

addSetting('meritfielddata.rlp.cs_report.submitted.emailSubject', 'Report submitted subject');
addSetting('meritfielddata.rlp.cs_report.submitted.emailBody', 'Report submitted body');
addSetting('meritfielddata.rlp.cs_report.approved.emailSubject', 'Report approved subject');
addSetting('meritfielddata.rlp.cs_report.approved.emailBody', 'Report approved body');
addSetting('meritfielddata.rlp.cs_report.returned.emailSubject', 'Report returned subject');
addSetting('meritfielddata.rlp.cs_report.returned.emailBody', 'Report returned body');

var indigenousWorkforcePerformanceScoreId = '5d28e47f-5182-4ad7-91f7-074908fb66e4';
var indigenousSupplyChainPerformanceScoreId = 'f7a537fd-cb38-4392-a0db-5e02beec6aa0';
var indigenousSupplyChainValueScoreId = 'e3227a01-177f-4ec1-9c09-3c1cc755cf19';

var scores = [
    {
        "category": "Indigenous Procurement",
        "configuration": {
            "filter": {
                filterValue: "Regional capacity services - reporting",
                property: "name",
                type: "filter"
            },
            "childAggregations": [{
                "expression": "totalFirstNationsFteWorkforce/totalOrganisationFteWorkforce*100",
                "defaultValue": 0,
                "childAggregations": [
                    {
                        "label": "totalFirstNationsFteWorkforce",
                        "property": "data.organisationFteIndigenousWorkforce",
                        "type": "SUM"
                    },
                    {
                        "label": "totalOrganisationFteWorkforce",
                        "property": "data.organisationFteWorkforce",
                        "type": "SUM"
                    }
                ]
            }]
        },
        "description": "",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "units": "percentage",
        "isOutputTarget": true,
        "label": "Indigenous workforce performance (% of Indigenous FTE achieved to date/% FTE target for Indigenous employment to date)",
        "outputType": "Regional capacity services - reporting",
        "scoreId": indigenousWorkforcePerformanceScoreId,
        "status": "active",
        "name": "targetIndigenousParticipationPercentage"
    },
    {
        "category": "Indigenous Procurement",
        "configuration": {
            "filter": {
                filterValue: "Regional capacity services - reporting",
                property: "name",
                type: "filter"
            },
            "childAggregations": [{
                "expression": "totalFirstNationsProcurement/currentTotalProcurement*100",
                "defaultValue": 0,
                "childAggregations": [
                    {
                        "label": "totalFirstNationsProcurement",
                        "property": "data.servicesContractedValueFirstNations",
                        "type": "SUM"
                    },
                    {
                        "label": "currentTotalProcurement",
                        "property": "activity.organisation.custom.details.funding.overallTotal",
                        "type": "DISTINCT_SUM",
                        "keyProperty": "activity.organisation.organisationId"
                    }
                ]
            }]
        },
        "description": "",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "units": "$",
        "isOutputTarget": true,
        "label": "Indigenous supply chain performance (% of procurement from Indigenous suppliers achieved to date/% procurement target of procurement from Indigenous suppliers at end of Deed period)",
        "outputType": "Regional capacity services - reporting",
        "scoreId": indigenousSupplyChainPerformanceScoreId,
        "status": "active",
        "name": "targetIndigenousProcurementPercentage"
    },
    {
        "category": "Indigenous Procurement",
        "configuration": {
            "filter": {
                filterValue: "Regional capacity services - reporting",
                property: "name",
                type: "filter"
            },
            "childAggregations": [{
                "property": "data.servicesContractedValueFirstNations",
                "type": "SUM"
            }]
        },
        "description": "",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": false,
        "label": "Total reported value of services contracted to First Nations",
        "outputType": "Regional capacity services - reporting",
        "scoreId": indigenousSupplyChainValueScoreId,
        "status": "active",
        "name": "totalValueServicesContractedToFirstNations"
    }

];

for (var i = 0; i < scores.length; i++) {
        db.score.insert(scores[i]);
}




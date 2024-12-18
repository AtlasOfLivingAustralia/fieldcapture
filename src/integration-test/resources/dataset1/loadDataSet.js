print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: " + process.cwd());
load('../data_common/loadMeritHub.js');
load("../data_common/insertData.js");
loadActivityForms();
let program = programDefaults.create();
// Configure the program as an original MERIT program with Activities tab.
program.config = {
    projectReports: [
        {
            reportType: 'Activity',
            reportingPeriodInMonths: 6,
            reportsAlignedToCalendar: true,
            reportNameFormat: 'Stage %1d',
            reportDescriptionFormat: 'Stage %1d for ${project.name}'
        }
    ],
    excludes: ['DATA_SETS', 'MERI_PLAN', 'RISKS_AND_THREATS'],
    projectTemplate: 'default',
    meriPlanTemplate: 'meriPlan',
    activities:

        [
            {
                "name": "Indigenous Employment and Businesses"
            },
            {
                "name": "Outcomes, Evaluation and Learning - final report"
            },
            {
                "name": "Project Administration"
            },
            {
                "name": "Progress, Outcomes and Learning - stage report"
            },
            {
                "name": "Fauna Survey - general"
            },
            {
                "name": "Flora Survey - general"
            },
            {
                "name": "Pest Animal Survey"
            },
            {
                "name": "Plant Survival Survey"
            },
            {
                "name": "Site Monitoring Plan"
            },
            {
                "name": "Water Quality Survey"
            },
            {
                "name": "Weed Mapping & Monitoring"
            },
            {
                "name": "Vegetation Assessment - Commonwealth government methodology"
            },
            {
                "name": "Community Participation and Engagement"
            },
            {
                "name": "Debris Removal"
            },
            {
                "name": "Disease Management"
            },
            {
                "name": "Erosion Management"
            },
            {
                "name": "Fencing"
            },
            {
                "name": "Conservation Grazing Management"
            },
            {
                "name": "Fire Management"
            },
            {
                "name": "Heritage Conservation"
            },
            {
                "name": "Management Plan Development"
            },
            {
                "name": "Management Practice Change"
            },
            {
                "name": "Conservation Actions for Species and Communities"
            },
            {
                "name": "Pest Management"
            },
            {
                "name": "Plant Propagation"
            },
            {
                "name": "Public Access and Infrastructure"
            },
            {
                "name": "Research"
            },
            {
                "name": "Revegetation"
            },
            {
                "name": "Seed Collection"
            },
            {
                "name": "Site Preparation"
            },
            {
                "name": "Water Management"
            },
            {
                "name": "Weed Treatment"
            },
            {
                "name": "Works Planning and Risk"
            },
            {
                "name": "Green Army - Monthly project status report"
            },
            {
                "name": "Green Army - Quarterly project report"
            },
            {
                "name": "Indigenous Knowledge Transfer"
            },
            {
                "name": "Training and Skills Development"
            }
        ],
    activityNavigationMode:
        'returnToProject'
}
;

db.program.insert(program);

var activityProject = {
    "hubId": "merit",
    "alaHarvest": false,
    "associatedProgram": "Biodiversity Fund",
    "associatedSubProgram": "Round 1",
    "programId": "test_program",
    "custom": {
        "details": {
            "lastUpdated": "2016-05-06T03:59:30Z",
            "priorities": {
                "description": "",
                "rows": [{
                    "data3": " In what way will the project deliver against this section?",
                    "data2": " What section of the plan is being addressed?",
                    "data1": "List the name of the National or Regional plan the project is addressing"
                }]
            },
            "partnership": {
                "description": "",
                "rows": [{
                    "data3": "Australian Government Department",
                    "data2": "Very briefly indicate how the partner is contributing to the project.",
                    "data1": "Name of project partner"
                }]
            },
            "keq": {
                "description": "",
                "rows": [{
                    "data3": "",
                    "data2": " Briefly describe how the project will ensure that evaluation questions will be addressed in a timely and appropriate manner.",
                    "data1": "List the project's KEQ's"
                }]
            },
            "implementation": {
                "description": "How is the project to be delivered? Briefly describe the high level method/s to be used. The delivery mechanism/s should provide sufficient detail to understand how the project's outputs and activities will be implemented."
            },
            "obligations": "Yes",
            "policies": "Yes",
            "objectives": {
                "rows1": [{
                    "assets": ["Natural/Cultural assets managed"],
                    "description": "Enter the outcomes sought by the project. This should be expressed as a 'SMART' statement and deliver against the programme.  The objective should be no more than 2 sentences."
                }],
                "rows": [{
                    "data3": "",
                    "data2": " How will this indicator be monitored? Briefly describe the mehtod to be used to monitor the indicator.",
                    "data1": "List the indicators of project success that will be monitored. Add a new row for each indicator. "
                }]
            },
            "caseStudy": true,
            "events": [{
                "funding": "0",
                "name": "The Project Events and Announcements section provides funding recipients a place to provide key forward (planned) announcables and invite the Australian Government to participate in launches, communication and media opportunities related to this requirement. This includes opportunities to announce recipients of small projects and related activities.",
                "description": "",
                "scheduledDate": "2014-09-17T00:31:12Z",
                "media": "",
                "grantAnnouncementDate": "",
                "type": "1: funding announcements"
            }],
            "status": "active",
            "budget": {
                "overallTotal": 20000,
                "headers": [{"data": "2014/2015"}, {"data": "2015/2016"}, {"data": "2016/2017"}, {"data": "2017/2018"}, {"data": "2018/2019"}, {"data": "2019/2020"}, {"data": "2020/2021"}],
                "rows": [{
                    "costs": [{"dollar": "20000"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}],
                    "rowTotal": 20000,
                    "description": "Expenditure for Community Engagement",
                    "shortLabel": "Biodiverse plantings"
                }, {
                    "costs": [{"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}],
                    "rowTotal": 0,
                    "description": "Expenditure for Indigenous engagement",
                    "shortLabel": "Biodiverse plantings"
                }, {
                    "costs": [{"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}, {"dollar": "0"}],
                    "rowTotal": 0,
                    "description": "Residule expenditure for investment",
                    "shortLabel": "Biodiverse plantings"
                }],
                "columnTotal": [{"data": 20000}, {"data": 0}, {"data": 0}, {"data": 0}, {"data": 0}, {"data": 0}, {"data": 0}]
            }
        }
    },
    "dateCreated": ISODate("2014-08-05T02:17:43.061Z"),
    "description": "The project aims to increase the area and condition of remnant riparian vegetation, volunteers will propagate, plant and maintain local native trees, control environmental weeds, fence a riparian area from cattle, repair a public access track to prevent damage to vegetation and increase public awareness of the conservation significance of local remnant Cumberland Plain Woodland through the installation of interpretative signs.",
    "externalId": "Training 2",
    "funding": 0,
    "grantId": "Training 2",
    "hasParticipantCost": false,
    "hasTeachingMaterials": false,
    "isCitizenScience": false,
    "isContributingDataToAla": false,
    "isDIY": false,
    "isDataSharing": false,
    "isExternal": false,
    "isMERIT": true,
    "isMetadataSharing": false,
    "isSciStarter": false,
    "isSuitableForChildren": false,
    "lastUpdated": ISODate("2019-09-06T00:39:59.195Z"),
    "manager": "",
    "name": "Training project 2",
    "organisation": "",
    "organisationId": "",
    "organisationName": "Local Landcare Group 2",
    "origin": "merit",
    "outputTargets": [{
        "scoreLabel": "Total seed collected (Kg)",
        "outputLabel": "Seed Collection Details",
        "units": "Kg",
        "scoreName": "totalSeedCollectedKg",
        "target": NumberDecimal("5"),
        "scoreId": "23a44835-ac5d-4eda-beb6-487e273f4903"
    }, {
        "outputLabel": "Seed Collection Details",
        "outcomeTarget": ""
    }, {
        "scoreLabel": "No of volunteers participating in project activities",
        "outputLabel": "Participant Information",
        "units": "",
        "scoreName": "totalParticipantsNotEmployed",
        "target": NumberDecimal("0"),
        "scoreId": "2b79a184-5ec0-4646-a819-3b10a40b4168"
    }, {
        "scoreLabel": "No of Indigenous participants at project events.",
        "outputLabel": "Participant Information",
        "units": "",
        "scoreName": "numberOfIndigenousParticipants",
        "target": NumberDecimal("0"),
        "scoreId": "c10d9043-ecc3-4cde-8450-fa159fb7a545"
    }, {
        "scoreLabel": "Total No. of new participants (attending project events for the first time)",
        "outputLabel": "Participant Information",
        "units": "",
        "scoreName": "totalParticipantsNew",
        "target": NumberDecimal("0"),
        "scoreId": "4b8749ec-ca5c-434b-a00f-e7432f9c8eb0"
    }, {
        "outputLabel": "Participant Information",
        "outcomeTarget": ""
    }, {
        "scoreLabel": "Total number of revegetation monitoring activities undertaken",
        "outputLabel": "Vegetation Monitoring Results",
        "scoreName": "countingMethod",
        "target": NumberDecimal("0"),
        "scoreId": "88eec581-713b-470c-8ae6-e311a83a8c58"
    }, {
        "scoreLabel": "Total No. of plants surviving with mature height > 2 metres",
        "outputLabel": "Vegetation Monitoring Results",
        "scoreName": "numberSurviving",
        "target": NumberDecimal("0"),
        "scoreId": "46d629fe-e6d6-4625-86a6-6266e14cfb24"
    }, {
        "scoreLabel": "Average survivability of tubestock and seedstock (%)",
        "outputLabel": "Vegetation Monitoring Results",
        "scoreName": "survivalRate",
        "target": NumberDecimal("0"),
        "scoreId": "41a8d9bf-87ae-4f1d-b30f-1d628df5c8f3"
    }, {
        "outputLabel": "Vegetation Monitoring Results",
        "outcomeTarget": ""
    }, {
        "scoreLabel": "Area of revegetation works (Ha)",
        "outputLabel": "Revegetation Details",
        "units": "Ha",
        "scoreName": "areaRevegHa",
        "target": NumberDecimal("1"),
        "scoreId": "d6a22325-f867-444b-bcbd-b1ebc50f5bd4"
    }, {
        "scoreLabel": "Number of plants planted",
        "outputLabel": "Revegetation Details",
        "units": "",
        "scoreName": "totalNumberPlanted",
        "target": NumberDecimal("100"),
        "scoreId": "a9534e7d-3006-41fa-bb9a-693a46b7937c"
    }, {
        "scoreLabel": "Kilograms of seed sown",
        "outputLabel": "Revegetation Details",
        "units": "Kg",
        "scoreName": "totalSeedSownKg",
        "target": NumberDecimal("5"),
        "scoreId": "dcf4164f-4d63-46e1-83dc-783d61e9b115"
    }, {
        "scoreLabel": "No. of plants planted > 2 metres in height",
        "outputLabel": "Revegetation Details",
        "scoreName": "numberPlanted",
        "target": NumberDecimal("0"),
        "scoreId": "db514efb-ab2b-4348-98e2-f673a7af2975"
    }, {
        "scoreLabel": "Kilograms of seed sown of species expected to grow > 2 metres in height",
        "outputLabel": "Revegetation Details",
        "scoreName": "seedSownKg",
        "target": NumberDecimal("0"),
        "scoreId": "b80c9ba7-370a-419d-9ec3-e8c9482ca91d"
    }, {
        "scoreLabel": "No. of plants planted < 2 metres in height",
        "outputLabel": "Revegetation Details",
        "scoreName": "numberPlanted",
        "target": NumberDecimal("0"),
        "scoreId": "a0236481-701f-4d61-a877-6ef9464b588d"
    }, {
        "scoreLabel": "Kilograms of seed sown of species expected to grow < 2 metres in height",
        "outputLabel": "Revegetation Details",
        "units": "Kg",
        "scoreName": "seedSownKg",
        "target": NumberDecimal("0"),
        "scoreId": "99bb1108-3760-4eb9-9d63-c0c96939500a"
    }, {"outputLabel": "Revegetation Details", "outcomeTarget": ""}, {
        "scoreLabel": "Total length of fence (Km)",
        "outputLabel": "Fence Details",
        "units": "kilometres",
        "scoreName": "lengthOfFence",
        "target": NumberDecimal("0.4"),
        "scoreId": "55745dc2-8185-44d4-b87e-a82a9a95c253"
    }, {
        "scoreLabel": "Area protected by fencing (Ha)",
        "outputLabel": "Fence Details",
        "scoreName": "fenceAreaProtected",
        "target": NumberDecimal("0"),
        "scoreId": "0aa00813-3b08-4f08-8a98-843b264d93f6"
    }, {"outputLabel": "Fence Details", "outcomeTarget": ""}, {
        "scoreLabel": "Total new area treated for weeds (Ha)",
        "outputLabel": "Weed Treatment Details",
        "units": "Ha",
        "scoreName": "areaTreatedHa",
        "target": NumberDecimal("0"),
        "scoreId": "72cc6c1d-5c4f-4a77-b91b-3474b6450a3d"
    }, {
        "outputLabel": "Weed Treatment Details",
        "outcomeTarget": ""
    }, {
        "scoreLabel": "No. of activities undertaking weed monitoring",
        "outputLabel": "Weed Observation and Monitoring Details",
        "scoreName": "weedObservationMonitoringDetails",
        "target": NumberDecimal("0"),
        "scoreId": "9ddc4f82-e5df-40f4-b647-88f33d60384a"
    }, {"outputLabel": "Weed Observation and Monitoring Details", "outcomeTarget": ""}],
    "planStatus": "not approved",
    "plannedEndDate": ISODate("2020-12-30T13:00:00.000Z"),
    "plannedStartDate": ISODate("2014-12-31T13:00:00.000Z"),
    "projectId": "activityProject",
    "promoteOnHomepage": "",
    "risks": {
        "overallRisk": "Medium", "rows": [{
            "consequence": "Moderate",
            "likelihood": "Likely",
            "residualRisk": "Low",
            "currentControl": "frost protection",
            "description": "poor plant survial due to seasonal conditions",
            "threat": "Seasonal conditions (eg. drought, flood, etc.)",
            "riskRating": "Significant"
        }], "status": "active"
    },
    "serviceProviderName": "",
    "status": "active",
    "workOrderId": "",
    "hubId": "merit"

};
db.project.insert(activityProject)
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: activityProject.projectId,
    userId: '1',
    accessLevel: 'editor'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: activityProject.projectId,
    userId: '2',
    accessLevel: 'admin'
});

var activity = {
    "activityId": "6034ca77-464e-4546-9de1-b88006d3ebfb",
    "assessment": false,
    "dateCreated": ISODate("2019-09-06T05:28:08.289Z"),
    "lastUpdated": ISODate("2021-03-03T02:26:39.652Z"),
    "mainTheme": "Biodiverse plantings",
    "plannedEndDate": ISODate("2015-06-30T00:00:00.000Z"),
    "plannedStartDate": ISODate("2015-01-01T00:00:00.000Z"),
    "progress": "planned",
    "projectId": "activityProject",
    "projectStage": "Stage 1",
    "siteId": "",
    "status": "active",
    "type": "Water Management",
    "description": "Description Test",
    "endDate": ISODate("2015-06-30T00:00:00.000Z")
}
db.activity.insert(activity);
addStaticContentSettings();

let now = new Date().getTime();
// Create a user login > 2 years ago to test the access removal feature
let lastLogin = new Date(now - (1000 * 60 * 60 * 24 * 900))
db.user.insert({
    userId: '2',
    userHubs: [{
        hubId: 'merit',
        lastLoginTime: lastLogin
    }]
});

// Create another user login between 23 and 24 months ago to test the access warning email
lastLogin = new Date(now - (1000 * 60 * 60 * 24 * 30 * 23.5));
db.user.insert({
    userId: '1',
    userHubs: [{
        hubId: 'merit',
        lastLoginTime: lastLogin
    }]
});
db.setting.insert({
    key: 'merit.accessexpiry.expired.email.subject',
    value: 'Your access has been removed'
});
db.setting.insert({
    key: 'merit.accessexpiry.expired.email.body',
    value: 'Your access has been removed body'
});
db.setting.insert({
    key: 'merit.accessexpiry.warning.email.subject',
    value: 'Your access will be removed'
});
db.setting.insert({
    key: 'merit.accessexpiry.warning.email.body',
    value: 'Your access will be removed body'
});
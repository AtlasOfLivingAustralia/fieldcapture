print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: "+pwd());
load('../data_common/loadMeritHub.js');
load("../data_common/insertData.js");

var  activityProject = {
    "alaHarvest":false,
    "associatedProgram":"Biodiversity Fund",
    "associatedSubProgram":"Round 1",
    "custom": {
        "details":{
            "lastUpdated":"2016-05-06T03:59:30Z",
            "priorities":{
                "description":"",
                "rows":[{
                    "data3":" In what way will the project deliver against this section?",
                    "data2":" What section of the plan is being addressed?",
                    "data1":"List the name of the National or Regional plan the project is addressing"
                }]
            },
            "partnership":{
                "description":"",
                "rows":[{
                    "data3":"Australian Government Department",
                    "data2":"Very briefly indicate how the partner is contributing to the project.",
                    "data1":"Name of project partner"
                }]
            },
            "keq":{
                "description":"",
                "rows":[{
                    "data3":"",
                    "data2":" Briefly describe how the project will ensure that evaluation questions will be addressed in a timely and appropriate manner.","data1":"List the project's KEQ's"
                }]
            },
            "implementation":{
                "description":"How is the project to be delivered? Briefly describe the high level method/s to be used. The delivery mechanism/s should provide sufficient detail to understand how the project's outputs and activities will be implemented."
            },
            "obligations":"Yes",
            "policies":"Yes",
            "objectives":{
                "rows1":[{
                    "assets":["Natural/Cultural assets managed"],
                    "description":"Enter the outcomes sought by the project. This should be expressed as a 'SMART' statement and deliver against the programme.  The objective should be no more than 2 sentences."
                }],
                "rows":[{
                    "data3":"",
                    "data2":" How will this indicator be monitored? Briefly describe the mehtod to be used to monitor the indicator.","data1":"List the indicators of project success that will be monitored. Add a new row for each indicator. "
                }]
            },
            "caseStudy":true,
            "events":[{
                "funding":"0",
                "name":"The Project Events and Announcements section provides funding recipients a place to provide key forward (planned) announcables and invite the Australian Government to participate in launches, communication and media opportunities related to this requirement. This includes opportunities to announce recipients of small projects and related activities.",
                "description":"",
                "scheduledDate":"2014-09-17T00:31:12Z",
                "media":"",
                "grantAnnouncementDate":"",
                "type":"1: funding announcements"
            }],
            "status":"active",
            "budget":{
                "overallTotal":20000,
                "headers":[{"data":"2014/2015"}, {"data":"2015/2016"},{"data":"2016/2017"},{"data":"2017/2018"},{"data":"2018/2019"},{"data":"2019/2020"},{"data":"2020/2021"}],
                "rows":[{"costs":[{"dollar":"20000"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"}],"rowTotal":20000,"description":"Expenditure for Community Engagement","shortLabel":"Biodiverse plantings"},{"costs":[{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"}],"rowTotal":0,"description":"Expenditure for Indigenous engagement","shortLabel":"Biodiverse plantings"},{"costs":[{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"},{"dollar":"0"}],"rowTotal":0,"description":"Residule expenditure for investment","shortLabel":"Biodiverse plantings"}],
                "columnTotal":[{"data":20000},{"data":0},{"data":0},{"data":0},{"data":0},{"data":0},{"data":0}]
            }
        }
        },
    "dateCreated":ISODate("2014-08-05T02:17:43.061Z"),
    "description":"The project aims to increase the area and condition of remnant riparian vegetation, volunteers will propagate, plant and maintain local native trees, control environmental weeds, fence a riparian area from cattle, repair a public access track to prevent damage to vegetation and increase public awareness of the conservation significance of local remnant Cumberland Plain Woodland through the installation of interpretative signs.",
    "externalId":"Training 2",
    "funding":0,
    "grantId":"Training 2",
    "hasParticipantCost":false,
    "hasTeachingMaterials":false,
    "isCitizenScience":false,
    "isContributingDataToAla":false,
    "isDIY":false,
    "isDataSharing":false,
    "isExternal":false,
    "isMERIT":true,
    "isMetadataSharing":false,
    "isSciStarter":false,
    "isSuitableForChildren":false,
    "lastUpdated":ISODate("2019-09-06T00:39:59.195Z"),
    "listId":"dr1820",
    "manager":"",
    "name":"Training project 2",
    "organisation":"",
    "organisationId":"",
    "organisationName":"Local Landcare Group 2",
    "origin":"merit",
    "outputTargets":[{"scoreLabel":"Total seed collected (Kg)","outputLabel":"Seed Collection Details","units":"Kg","scoreName":"totalSeedCollectedKg","target":"5","scoreId":"23a44835-ac5d-4eda-beb6-487e273f4903"},{"outputLabel":"Seed Collection Details","outcomeTarget":""},{"scoreLabel":"No of volunteers participating in project activities","outputLabel":"Participant Information","units":"","scoreName":"totalParticipantsNotEmployed","target":"0","scoreId":"2b79a184-5ec0-4646-a819-3b10a40b4168"},{"scoreLabel":"No of Indigenous participants at project events.","outputLabel":"Participant Information","units":"","scoreName":"numberOfIndigenousParticipants","target":"0","scoreId":"c10d9043-ecc3-4cde-8450-fa159fb7a545"},{"scoreLabel":"Total No. of new participants (attending project events for the first time)","outputLabel":"Participant Information","units":"","scoreName":"totalParticipantsNew","target":"0","scoreId":"4b8749ec-ca5c-434b-a00f-e7432f9c8eb0"},{"outputLabel":"Participant Information","outcomeTarget":""},{"scoreLabel":"Total number of revegetation monitoring activities undertaken","outputLabel":"Vegetation Monitoring Results","scoreName":"countingMethod","target":"0","scoreId":"88eec581-713b-470c-8ae6-e311a83a8c58"},{"scoreLabel":"Total No. of plants surviving with mature height > 2 metres","outputLabel":"Vegetation Monitoring Results","scoreName":"numberSurviving","target":"0","scoreId":"46d629fe-e6d6-4625-86a6-6266e14cfb24"},{"scoreLabel":"Average survivability of tubestock and seedstock (%)","outputLabel":"Vegetation Monitoring Results","scoreName":"survivalRate","target":"0","scoreId":"41a8d9bf-87ae-4f1d-b30f-1d628df5c8f3"},{"outputLabel":"Vegetation Monitoring Results","outcomeTarget":""},{"scoreLabel":"Area of revegetation works (Ha)","outputLabel":"Revegetation Details","units":"Ha","scoreName":"areaRevegHa","target":"1","scoreId":"d6a22325-f867-444b-bcbd-b1ebc50f5bd4"},{"scoreLabel":"Number of plants planted","outputLabel":"Revegetation Details","units":"","scoreName":"totalNumberPlanted","target":"100","scoreId":"a9534e7d-3006-41fa-bb9a-693a46b7937c"},{"scoreLabel":"Kilograms of seed sown","outputLabel":"Revegetation Details","units":"Kg","scoreName":"totalSeedSownKg","target":"5","scoreId":"dcf4164f-4d63-46e1-83dc-783d61e9b115"},{"scoreLabel":"No. of plants planted > 2 metres in height","outputLabel":"Revegetation Details","scoreName":"numberPlanted","target":"0","scoreId":"db514efb-ab2b-4348-98e2-f673a7af2975"},{"scoreLabel":"Kilograms of seed sown of species expected to grow > 2 metres in height","outputLabel":"Revegetation Details","scoreName":"seedSownKg","target":"0","scoreId":"b80c9ba7-370a-419d-9ec3-e8c9482ca91d"},{"scoreLabel":"No. of plants planted < 2 metres in height","outputLabel":"Revegetation Details","scoreName":"numberPlanted","target":"0","scoreId":"a0236481-701f-4d61-a877-6ef9464b588d"},{"scoreLabel":"Kilograms of seed sown of species expected to grow < 2 metres in height","outputLabel":"Revegetation Details","units":"Kg","scoreName":"seedSownKg","target":"0","scoreId":"99bb1108-3760-4eb9-9d63-c0c96939500a"},{"outputLabel":"Revegetation Details","outcomeTarget":""},{"scoreLabel":"Total length of fence (Km)","outputLabel":"Fence Details","units":"kilometres","scoreName":"lengthOfFence","target":"0.4","scoreId":"55745dc2-8185-44d4-b87e-a82a9a95c253"},{"scoreLabel":"Area protected by fencing (Ha)","outputLabel":"Fence Details","scoreName":"fenceAreaProtected","target":"0","scoreId":"0aa00813-3b08-4f08-8a98-843b264d93f6"},{"outputLabel":"Fence Details","outcomeTarget":""},{"scoreLabel":"Total new area treated for weeds (Ha)","outputLabel":"Weed Treatment Details","units":"Ha","scoreName":"areaTreatedHa","target":"0","scoreId":"72cc6c1d-5c4f-4a77-b91b-3474b6450a3d"},{"outputLabel":"Weed Treatment Details","outcomeTarget":""},{"scoreLabel":"No. of activities undertaking weed monitoring","outputLabel":"Weed Observation and Monitoring Details","scoreName":"weedObservationMonitoringDetails","target":"0","scoreId":"9ddc4f82-e5df-40f4-b647-88f33d60384a"},{"outputLabel":"Weed Observation and Monitoring Details","outcomeTarget":""}],
    "planStatus":"not approved",
    "plannedEndDate":ISODate("2020-12-30T13:00:00.000Z"),
    "plannedStartDate":ISODate("2014-12-31T13:00:00.000Z"),
    "projectId":"activityProject",
    "promoteOnHomepage":"",
    "risks":{"overallRisk":"Medium","rows":[{"consequence":"Moderate","likelihood":"Likely","residualRisk":"Low","currentControl":"frost protection",
            "description":"poor plant survial due to seasonal conditions",
            "threat":"Seasonal conditions (eg. drought, flood, etc.)","riskRating":"Significant"}],"status":"active"},
    "serviceProviderName":"",
    "status":"active",
    "timeline":[{"fromDate":"2014-12-31T13:00:00.000Z","name":"Stage 1","toDate":"2015-06-30T14:00:00.000Z"},
        {"fromDate":"2015-06-30T14:00:00.000Z","name":"Stage 2","toDate":"2015-12-31T13:00:00.000Z"},
        {"fromDate":"2015-12-31T13:00:00.000Z","name":"Stage 3","toDate":"2016-06-30T14:00:00.000Z"},
        {"fromDate":"2016-06-30T14:00:00.000Z","name":"Stage 4","toDate":"2016-12-31T13:00:00.000Z"},
        {"fromDate":"2016-12-31T13:00:00.000Z","name":"Stage 5","toDate":"2017-06-30T14:00:00.000Z"},
        {"fromDate":"2017-06-30T14:00:00.000Z","name":"Stage 6","toDate":"2017-12-31T13:00:00.000Z"},
        {"fromDate":"2017-12-31T13:00:00.000Z","name":"Stage 7","toDate":"2018-06-30T14:00:00.000Z"},
        {"fromDate":"2018-06-30T14:00:00.000Z","name":"Stage 8","toDate":"2018-12-31T13:00:00.000Z"},
        {"fromDate":"2018-12-31T13:00:00.000Z","name":"Stage 9","toDate":"2019-06-30T14:00:00.000Z"},
        {"fromDate":"2019-06-30T14:00:00.000Z","name":"Stage 10","toDate":"2019-12-31T13:00:00.000Z"},
        {"fromDate":"2019-12-31T13:00:00.000Z","name":"Stage 11","toDate":"2020-06-30T14:00:00.000Z"},
        {"fromDate":"2020-06-30T14:00:00.000Z","name":"Stage 12","toDate":"2020-12-31T13:00:00.000Z"}]
    ,"workOrderId":""
};
db.project.insert(activityProject)

var activity = {
    "activityId":"6034ca77-464e-4546-9de1-b88006d3ebfb",
    "assessment":false,
    "dateCreated":ISODate("2019-09-06T05:28:08.289Z"),
    "lastUpdated":ISODate("2021-03-03T02:26:39.652Z"),
    "mainTheme":"Biodiverse plantings",
    "plannedEndDate":ISODate("2015-06-30T00:00:00.000Z"),
    "plannedStartDate":ISODate("2015-01-01T00:00:00.000Z"),
    "progress":"planned",
    "projectId":"activityProject",
    "projectStage":"Stage 1",
    "siteId":"",
    "status":"active",
    "type":"Water Management",
    "description":"Description Test",
    "endDate":ISODate("2015-06-30T00:00:00.000Z")
}
db.activity.insert(activity)

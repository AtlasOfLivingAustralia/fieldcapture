load('../../../utils/uuid.js');
load('../../../utils/program.js');

var reef2050Plan = createOrFindProgram('Reef 2050 Plan');

var subprograms = ["Reef 2050 Implementation","Reef 2050 Plan Action Reporting"];

var excludesReef2050Implementation = ["DATA_SETS"];
var excludesReef2050PlanActionReporting = ["DATA_SETS", "MERI_PLAN", "RISKS_AND_THREATS"];

var activitiesReef2050Implementation = [
    {name:"Indigenous Employment and Businesses"},
    {name:"Outcomes, Evaluation and Learning - final report"},
    {name:"Project Administration"},
    {name:"Progress, Outcomes and Learning - stage report"},
    {name:"Stage Report"},
    {name:"Annual Stage Report"},
    {name:"Fauna Survey - general"},
    {name:"Flora Survey - general"},
    {name:"Pest Animal Survey"},
    {name:"Plant Survival Survey"},
    {name:"Site Monitoring Plan"},
    {name:"Water Quality Survey"},
    {name:"Weed Mapping & Monitoring"},
    {name:"Vegetation Assessment - Commonwealth government methodology"},
    {name:"Community Participation and Engagement"},
    {name:"Debris Removal"},
    {name:"Disease Management"},
    {name:"Erosion Management"},
    {name:"Fencing"},
    {name:"Conservation Grazing Management"},
    {name:"Fire Management"},
    {name:"Heritage Conservation"},
    {name:"Management Plan Development"},
    {name:"Management Practice Change"},
    {name:"Conservation Actions for Species and Communities"},
    {name:"Pest Management"},
    {name:"Plant Propagation"},
    {name:"Public Access and Infrastructure"},
    {name:"Research"},
    {name:"Revegetation"},
    {name:"Seed Collection"},
    {name:"Site Preparation"},
    {name:"Water Management"},
    {name:"Weed Treatment"},
    {name:"Works Planning and Risk"},
    {name:"Post revegetation site management"},
    {name:"Indigenous Knowledge Transfer"},
    {name:"Training and Skills Development"}
]

var activitiesReef2050PlanActionReporting = [
    {name:"Reef 2050 Plan Action Reporting 2018"},
    {name:"Reef 2050 Plan Action Reporting"}
    ]

var config = {
    "projectReports": [
        {
            reportType:'Activity',
            reportingPeriodInMonths: 6,
            "reportsAlignedToCalendar": true,
            reportNameFormat: "Stage %1d",
            reportDescriptionFormat: "Stage %1d for ${project.name}"
        }
    ],
    excludes:["DATA_SETS","RISKS_AND_THREATS"],
    "projectTemplate": "default",
    "activities": [
        {name:"Reef 2050 Plan Action Reporting"}
    ],
    "activityNavigationMode": "returnToProject"
};

//inserts config into the parent program and inserts programId into the projects without associatedSubProgram
reef2050Plan.config = config;
db.program.updateMany({programId:reef2050Plan.programId}, {$set:{config:config}}, {multi:true});
db.project.updateMany({associatedProgram:reef2050Plan.name,associatedSubProgram:""}, {$set:{programId:reef2050Plan.programId}}, {multi:true});

for (var i=0; i<subprograms.length; i++) {
    var sub = createOrFindProgram(subprograms[i], reef2050Plan._id);
    sub.config = config;

    if (sub.name === "Reef 2050 Implementation"){
        config.excludes = excludesReef2050Implementation;
    }
    if (sub.name === "Reef 2050 Plan Action Reporting"){
        config.excludes = excludesReef2050PlanActionReporting;
    }
    if (sub.name === "Reef 2050 Implementation"){
        config.activities = activitiesReef2050Implementation;
    }
    if (sub.name === "Reef 2050 Plan Action Reporting"){
        config.activities = activitiesReef2050PlanActionReporting;
    }

    print("******************************* "+sub.programId+" ****************************");
    // db.program.save(sub);
    //inserts the config
    db.program.updateMany({programId:sub.programId}, {$set:{config:config}}, {multi:true});

    //update the projects programId by associatedProgram and associatedSubProgram
    db.project.updateMany({associatedProgram:reef2050Plan.name, associatedSubProgram:sub.name}, {$set:{programId:sub.programId}}, {multi:true});
    print("**********************************************************");
}
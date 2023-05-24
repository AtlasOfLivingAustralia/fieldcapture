load('../../../utils/uuid.js');
load('../../../utils/program.js');

var cumberlandPlain = createOrFindProgram('Cumberland Plain');

var subprograms = ['Cumberland Plain Projects'];
var config = {
    "projectReports": [
        {
            reportType:'Activity',
            reportingPeriodInMonths: 6,
            "reportsAlignedToCalendar": false,
            reportNameFormat: "Stage %1d",
            reportDescriptionFormat: "Stage %1d for ${project.name}"
        }
    ],
    excludes:["DATA_SETS", "MERI_PLAN"],
    "projectTemplate": "default",
    "meriPlanTemplate": "meriPlan",
    "activities": [
        {name:"Indigenous Employment and Businesses"},
        {name:"Outcomes, Evaluation and Learning - final report"},
        {name:"Project Administration"},
        {name:"Progress, Outcomes and Learning - stage report"},
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
        {name:"Indigenous Knowledge Transfer"},
        {name:"Training and Skills Development"}
    ],
    "activityNavigationMode": "returnToProject"
};

//inserts config into the sub program and inserts programId into the projects
for (var i=0; i<subprograms.length; i++) {
    var sub = createOrFindProgram(subprograms[i], cumberlandPlain._id);
    sub.config = config;
    print("******************************* "+sub.programId+" ****************************");
    // db.program.save(sub);
    // inserts the config
    db.program.updateMany({programId:sub.programId}, {$set:{config:config}}, {multi:true});

    // update the projects programId by associatedProgram and associatedSubProgram
    db.project.updateMany({associatedProgram:cumberlandPlain.name, associatedSubProgram:sub.name}, {$set:{programId:sub.programId}}, {multi:true});
    print("**********************************************************");
}

load('../../../utils/uuid.js');
load('../../../utils/program.js');

var nationalLandcare = createOrFindProgram('National Landcare Programme');

var subprograms = ["Regional Delivery","Local Programmes", "25th Anniversary Landcare Grants 2014-15","20 Million Trees Grants Round 1","World Heritage","Regional Funding","Landcare Network Grants 2014-16", "20 Million Trees Grants Round 2", "20 Million Trees West Melbourne", "20 Million Trees Discretionary Grants","20 Million Trees Cumberland Conservation Corridor Grants","20 Million Trees Cumberland Conservation Corridor Land Management","20 Million Trees Service Providers Tranche 1","20 Million Trees Service Providers","20 Million Trees Service Providers Tranche 2","20 Million Trees Grants Round 3","20 Million Trees Service Providers Tranche 3"];
var excludes25thAnniversaryLandcareGrants201415 = ["DATA_SETS","RISKS_AND_THREATS"];


var projectReportsNotAligned = [
    {
        reportType:'Activity',
        reportingPeriodInMonths: 6,
        "reportsAlignedToCalendar": false,
        reportNameFormat: "Stage %1d",
        reportDescriptionFormat: "Stage %1d for ${project.name}"
    }
]


var activities25thAnniversaryLandcareGrants201415 = [
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
    {name:"25th Anniversary Landcare Grants - Progress Report"},
    {name:"25th Anniversary Landcare Grants - Final Report"},
    {name:"Indigenous Knowledge Transfer"},
    {name:"Training and Skills Development"}
]

var activitiesRegionalFunding = [
    {name:"Regional Funding Final Report"},
    {name:"Indigenous Employment and Businesses"},
    {name:"Outcomes, Evaluation and Learning - final report"},
    {name:"Project Administration"},
    {name:"Progress, Outcomes and Learning - stage report"},
    {name:"Stage Report"},
    {name:"Fauna Survey - general"},
    {name:"Flora Survey - general"},
    {name:"Pest Animal Survey"},
    {name:"Plant Survival Survey"},
    {name:"Site Monitoring Plan"},
    {name:"Water Quality Survey"},
    {name:"Weed Mapping & Monitoring"},
    {name:"Vegetation Assessment - Commonwealth government methodology"},
    {name:"Community Grants"},
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
    excludes:["DATA_SETS"],
    projectTemplate: "default",
    "meriPlanTemplate": "meriPlan",
    activities: [
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
        {name:"Post revegetation site management"},
        {name:"Indigenous Knowledge Transfer"},
        {name:"Training and Skills Development"}
    ],
    "activityNavigationMode": "returnToProject"
};

//inserts config into the parent program and inserts programId into the projects without associatedSubProgram
nationalLandcare.config = config;
db.program.updateMany({programId:nationalLandcare.programId}, {$set:{config:config}}, {multi:true});
db.project.updateMany({associatedProgram:nationalLandcare.name,associatedSubProgram:""}, {$set:{programId:nationalLandcare.programId}}, {multi:true});

for (var i=0; i<subprograms.length; i++) {
    var sub = createOrFindProgram(subprograms[i], nationalLandcare._id);
    sub.config = config;

    if (sub.name === "25th Anniversary Landcare Grants 2014-15"){
        config.excludes = excludes25thAnniversaryLandcareGrants201415;
    }
    if (sub.name === "25th Anniversary Landcare Grants 2014-15"){
        config.activities = activities25thAnniversaryLandcareGrants201415;
    }
    if (sub.name === "Regional Funding"){
        config.activities = activitiesRegionalFunding;
    }
    if (sub.name === "20 Million Trees Service Providers" || sub.name === "20 Million Trees Service Providers Tranche 2" || sub.name === "20 Million Trees Service Providers Tranche 3"){
        config.projectReports = projectReportsNotAligned;
    }
    print("******************************* "+sub.programId+" ****************************");
    // db.program.save(sub);
    //inserts the config
    db.program.updateMany({programId:sub.programId}, {$set:{config:config}}, {multi:true});

    //update the projects programId by associatedProgram and associatedSubProgram
    db.project.updateMany({associatedProgram:nationalLandcare.name, associatedSubProgram:sub.name}, {$set:{programId:sub.programId}}, {multi:true});
    print("**********************************************************");
}
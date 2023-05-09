load('../../../utils/uuid.js');
load('../../../utils/program.js');

var caringForOurCountry2 = createOrFindProgram('Caring for Our Country 2');

var subprograms = ['Regional Delivery 1318','Target Area Grants - 2013/14', 'Community Environment Grants 1314', 'Reef Rescue 2013/14','Regional Delivery (sustainable agriculture)', 'Target Area Grants -  Expression of Interest 2013/14','0210 1318'];
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
    "projectTemplate": "default",
    "meriPlanTemplate": "meriPlan",
    "activities": [],
    "activityNavigationMode": "returnToProject"
};

//inserts config into the parent program and inserts programId into the projects without associatedSubProgram
caringForOurCountry2.config = config;
db.program.updateMany({programId:caringForOurCountry2.programId}, {$set:{config:config}}, {multi:true});
db.project.updateMany({associatedProgram:caringForOurCountry2.name,associatedSubProgram:""}, {$set:{programId:caringForOurCountry2.programId}}, {multi:true});

//inserts config into the sub program and inserts programId into the projects
for (var i=0; i<subprograms.length; i++) {
    var sub = createOrFindProgram(subprograms[i], caringForOurCountry2._id);
    sub.config = config;
    print("******************************* "+sub.programId+" ****************************");
    // db.program.save(sub);
    // inserts the config
    db.program.updateMany({programId:sub.programId}, {$set:{config:config}}, {multi:true});

    // update the projects programId by associatedProgram and associatedSubProgram
    db.project.updateMany({associatedProgram:caringForOurCountry2.name, associatedSubProgram:sub.name}, {$set:{programId:sub.programId}}, {multi:true});
    print("**********************************************************");
}

load('../../../utils/uuid.js');
load('../../../utils/program.js');

var reef2050Plan = createOrFindProgram('Reef 2050 Plan');

var subprograms = ["Reef 2050 Implementation","Reef 2050 Plan Action Reporting"];
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
    excludes:["DATA_SETS","MERI_PLAN","RISKS_AND_THREATS"],
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
    print("******************************* "+sub.programId+" ****************************");
    // db.program.save(sub);
    //inserts the config
    db.program.updateMany({programId:sub.programId}, {$set:{config:config}}, {multi:true});

    //update the projects programId by associatedProgram and associatedSubProgram
    db.project.updateMany({associatedProgram:reef2050Plan.name, associatedSubProgram:sub.name}, {$set:{programId:sub.programId}}, {multi:true});
    print("**********************************************************");
}
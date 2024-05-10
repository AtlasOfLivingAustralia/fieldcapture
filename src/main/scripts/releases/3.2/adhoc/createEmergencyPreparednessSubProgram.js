load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');

var config = {
    "meriPlanContents": [
        {
            "template": "meriBudget",
            "model": {
                "itemName": "Budget item",
                "showThemeColumn": false,
                "showActivityColumn": false,
                "explanation": "Please detail how project funding will be allocated to project services (action). Expenditure should align with the approved project proposal (including the amount identified for project reporting and administration). Each action should be identified as a different line item",
                "projectHeadingHelpText": "Planned budget expenditure for each service (action)",
                "hideHelpText": true
            }
        }
    ],
    "excludes": [
        "DATA_SETS",
        "DASHBOARD",
        "REPORTING",
        "RISKS_AND_THREATS",
        "DOCUMENTS"
    ],
    "visibility": "private",
    "projectTemplate": "rlp",
    "meriPlanTemplate": "configurableMeriPlan"
};

//Create the parent program
let programName = "Natural Heritage Trust";
var parent = createOrFindProgram(programName);
var subprograms = ["Emergency Preparedness"]

subprograms.forEach(function (subProgram){
    createOrFindProgram(subProgram, parent._id);
});

subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        print("sub program ID: " + p.programId)
        db.program.updateOne({programId:p.programId}, {$set:{config:config}});
        useNhtServiceLabels(p.name);
    }
});


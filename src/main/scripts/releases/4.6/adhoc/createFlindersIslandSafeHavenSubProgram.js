load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
var userId = '';

const serviceFormName = "NHT Output Report";
const annualReportFormName = "NHT Annual Report";
const outcomes1ReportFormName = "NHT Outcomes 1 Report";
const outcomes2ReportFormName = "NHT Outcomes 2 Report";

var config =
    {
        "meriPlanContents": [
            {
                "template": "name",
                "model": {
                    "tableFormatting": true
                }
            },
            {
                "template": "description",
                "model": {
                    "tableFormatting": true,
                    "maxSize": "1000",
                    "placeholder": "Please provide a short description of this project. This project description will be visible on the project overview page in MERIT [Free text; limit response to 1000 characters (approx. 150 words)]"
                }
            },
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
            "RISKS_AND_THREATS"
        ],
        "visibility": "public",
        "projectTemplate": "rlp",
        "meriPlanTemplate": "configurableMeriPlan"
    };


var outcomes = [];

var priorities = [];


//Create the parent program
let programName = "Saving Native Species";
var parent = createOrFindProgram(programName);
var subprograms = ["Flinders Island Safe Haven"]

subprograms.forEach(function (subProgram){
    createOrFindProgram(subProgram, parent._id);
});

subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        print("sub program ID: " + p.programId)
        db.program.updateOne({programId:p.programId}, {$set:{config:config, outcomes:outcomes, priorities:priorities}});
        useNhtServiceLabels(p.name);
    }
});



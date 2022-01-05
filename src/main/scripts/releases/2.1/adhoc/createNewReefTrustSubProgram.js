// Creating a new subprogram for Reef Trust:
load("uuid.js");
let refProgram = "Reef Trust 7 - Islands Restoration";
var subprograms = ["Reef Trust 7 - Traditional Owner Led Reef Protection"]


subprograms.forEach(function (subProgram) {
    var now = ISODate();
    var newProgram = db.program.find({name: refProgram}).next();
    delete newProgram._id
    delete newProgram.programId
    newProgram.name = subProgram
    newProgram.programId = UUID.generate()
    newProgram.dateCreated = now
    newProgram.lastUpdated = now
    newProgram.status = "active"
    var program = db.program.find({name: subProgram})
    if (!program.hasNext()) {
        db.program.insert(newProgram);
    } else {
        print("Program Already Exist: " + subProgram)
    }
});

var programConfig = {
    outcomes: [],
    priorities: [],
    config: {
        "excludes": [
            "DATA_SETS"
        ],
        "requiresActivityLocking": true,
        "projectTemplate": "index",
        "meriPlanTemplate": "configurableMeriPlan",
        "projectReports": [
            {
                "reportType": "Activity",
                "weekDaysToCompleteReport": 30,
                "reportDescriptionFormat": "Stage %1d for ${project.name}",
                "reportNameFormat": "Stage %1d",
                "reportingPeriodInMonths": 6,
                "reportsAlignedToCalendar": true
            }
        ]
    }
};

subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
            p.outcomes = programConfig.outcomes;
            p.config = programConfig.config;
            p.priorities = programConfig.priorities;

        db.program.save(p);
    }
});

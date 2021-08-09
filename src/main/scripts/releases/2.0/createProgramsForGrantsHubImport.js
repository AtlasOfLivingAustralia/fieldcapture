load("uuid.js");
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
    "visibility": "public",
    "projectTemplate": "rlp",
    "meriPlanTemplate": "configurableMeriPlan"
};

function createOrFindProgram(name, parentId) {
    var program = db.program.findOne({name:name});
    if (!program) {
        program = createProgram(name, parentId)
    }
    return program;
}

function createProgram(name, parentId) {
    var now = ISODate();
    var program = {
        name:name,
        description:"Grants hub import",
        programId: UUID.generate(),
        dateCreated: now,
        lastUpdated: now,
        status:'active',
        parent: parentId || null,
    }
    db.program.insert(program);

    return db.program.findOne({programId:program.programId});
}

function updateProgram(program) {
    var now = ISODate();
    program.lastUpdated = now;
    program.config = config;
    db.program.save(program);
}

var programName = 'Communities Environment Program';
var parent = createOrFindProgram(programName);
updateProgram(parent);

programName = 'Improving Your Local Parks and Environment';
parent = createOrFindProgram(programName);

programName = 'Improving Your Local Parks and Environment - Grants';
var program = createOrFindProgram(programName, parent._id);
updateProgram(program);

programName = 'Environmental Restoration Fund';
parent = createOrFindProgram(programName);

programName = 'Environmental Restoration Fund - Grants';
program = createOrFindProgram(programName);
updateProgram(program, parent.programId);

programName = 'Environmental Restoration Fund - Specific Purpose Payments';
program = createOrFindProgram(programName);
updateProgram(program, parent.programId);

programName = 'National Landcare Programme';
parent = createOrFindProgram(programName);

programName = 'Environment Small Grants';
program = createOrFindProgram(programName);
updateProgram(program, parent.programId);

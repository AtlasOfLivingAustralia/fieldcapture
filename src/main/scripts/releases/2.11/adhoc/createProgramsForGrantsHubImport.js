load("../../../utils/uuid.js");
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
    let merit = db.hub.findOne({urlPath:'merit'});
    var now = ISODate();
    var program = {
        hubId:merit.hubId,
        name:name,
        description:"Grants hub import",
        url:null,
        programSiteId:null,
        fundingType:null,
        programId: UUID.generate(),
        dateCreated: now,
        lastUpdated: now,
        status:'active',
        parent: parentId || null,
    }
    db.program.insert(program);

    return db.program.findOne({programId:program.programId});
}

function updateProgram(program, grantAwardId, fundingType) {
    var now = ISODate();
    program.lastUpdated = now;
    program.config = config;
    if (grantAwardId) {
        program.externalIds = [{idType:"GRANT_AWARD", externalId:grantAwardId}];
    }
    program.fundingType = fundingType || null;

    db.program.replaceOne({programId:program.programId}, program);
}

function updateSubPrograms(parentProgram, subprograms) {

    var subprogram;
    for (var i=0; i<subprograms.length; i++) {
        subprogram = createOrFindProgram(subprograms[i].name, parentProgram._id);
        updateProgram(subprogram, subprograms[i].grantAwardId, subprograms[i].fundingType);
    }
}

// Communities Environment Program & sub-programs
var programName = 'Planting Trees for the Queen\'s Jubilee';
var parent = createOrFindProgram(programName);
var subprograms = [
    {name: "PTQJ - Round 1 - 2022" }];
updateSubPrograms(parent, subprograms);

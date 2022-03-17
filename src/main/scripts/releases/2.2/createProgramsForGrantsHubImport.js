load("../../utils/uuid.js");
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

function updateProgram(program, grantAwardId, fundingType) {
    var now = ISODate();
    program.lastUpdated = now;
    program.config = config;
    if (grantAwardId) {
        program.externalIds = [{idType:"GRANT_AWARD", externalId:grantAwardId}];
    }
    program.fundingType = fundingType;

    db.program.save(program);
}

function updateSubPrograms(parentProgram, subprograms) {

    var subprogram;
    for (var i=0; i<subprograms.length; i++) {
        subprogram = createOrFindProgram(subprograms[i].name, parentProgram._id);
        updateProgram(subprogram, subprograms[i].grantAwardId, subprograms[i].fundingType);
    }
}

// Communities Environment Program & sub-programs
var programName = 'Communities Environment Program';
var parent = createOrFindProgram(programName);
var subprograms = [
    {name: "CEP - Round 1 - 2019-20 - Initial Projects", fundingType:"Grant", grantAwardId:"GO2828"},
    {name: "CEP - Round 1 - 2019-20 - Replacement Projects", fundingType:"Grant", grantAwardId:"GO2828"}];
updateSubPrograms(parent, subprograms);

// Improving your local parks and environment and sub-programs
programName = 'Improving Your Local Parks and Environment';
parent = createOrFindProgram(programName);
subprograms = [
    {name:'IYLPE - Grants - Round 1 - 2016 Election Commitments', fundingType:'Grant'},
    {name:'IYLPE - Grants - Round 1 - Ad Hoc', fundingType:'Grant'}
];
updateSubPrograms(parent, subprograms);

// ERF sub programs
programName = 'Environmental Restoration Fund';
parent = createOrFindProgram(programName);
subprograms = [
    {name:'ERF - Grants - Round 1 - Feral Cat Eradication', fundingType:"Grant", grantAwardId:"GO4305"},
    {name:'ERF - Grants - Round 1 - 2019 Election Commitments', fundingType:"Grant", grantAwardId:"GO3097"},
    {name:'ERF - Grants - Round 1 - 2019 Election Commitments - Koalas', fundingType:"Grant", grantAwardId:"GO3097"},
    {name:'ERF - Grants - Round 1 - Ad Hoc', fundingType:"Grant", grantAwardId:"GO3097"},
    {name:'ERF - Specific Purpose Payments - 2019-20 - 2019 Election Commitments', fundingType:"SPP", grantAwardId:null},
    {name:'ERF - Grants - Safe Havens - 2019 Election Commitments', fundingType:"Grant", grantAwardId:"GO4305"}
];
updateSubPrograms(parent, subprograms);

// NLP subprograms
programName = 'National Landcare Programme';
parent = createOrFindProgram(programName);
subprograms = [
    {name:'NLP - Environment Small Grants - Round 1 - 2018-19', fundingType:"Grant", grantAwardId:"GO1008"},
    {name:'Emerging Priorities', fundingType:null, grantAwardId:null},
    {name:'Regional Land Partnerships - Business Grants Hub', fundingType:null, grantAwardId: null },
    {name:'Indigenous Protected Areas', fundingType:"Grant"},
    {name:'NLP2 Bush Blitz 3', fundingType:"Grant"}
];
updateSubPrograms(parent, subprograms);

// Bushfires
programName = 'Bushfire Recovery for Species and Landscapes Program';
parent = createOrFindProgram(programName);
subprograms = [
    {name:'Landcare grants', fundingType:"Procurement", grantAwardId: null},
    {name:'Trust for Nature', fundingType:"Procurement", grantAwardId: null},
    {name:'Indigenous Fire and Land Management', fundingType:'Grant', grantAwardId: null},
    {name:'Australian seedbank partnership', fundingType:'Grant', grantAwardId: null},
    {name:'CSIRO - Gippsland Lakes', fundingType:'Procurement', grantAwardId: null},
    {name:'Pest Species Coordination', fundingType:'Grant', grantAwardId: null},
    {name:'Community Grants', fundingType:'Grant', grantAwardId: null},
];
updateSubPrograms(parent, subprograms);


programName = 'Bushfire Wildlife and Habitat Recovery';
program = createOrFindProgram(programName);
subprograms = [
    {name:'Pest Mitigation and Habitat Protection - Business Grants Hub', fundingType:"Grant", grantAwardId: null},
];
updateSubPrograms(parent, subprograms);

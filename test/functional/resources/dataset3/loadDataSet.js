print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: "+pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');

var config = {
    optionalProjectContent:["Risks and Threats", "MERI Plan"]
};
createProgram({programId:'original', config:config});

var config = {
    projectTemplate: 'rlp'
};
createProgram({programId:'rlp', config:config});

var config = {
    projectTemplate: "rlp",
    meriPlanTemplate : "configurableMeriPlan",
    meriPlanContents : [
        {
            "template": "objectivesList"
        },
        {
            "template": "monitoringIndicators"
        },
        {
            "template": "projectImplementation"
        },
        {
            "template": "projectPartnerships"
        },
        {
            "template":"keq"
        },
        {
            "template": "meriBudget"
        }
    ],
    objectives:[
        "objective 1",
        "objective 2",
        "objective 3"
    ]
};
createProgram({programId:"configurable_meri_plan", name:"Configurable MERI Plan Program", description: "", config: config});

createMu({});

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'test_program', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'test_mu', userId:'1', accessLevel:'admin'});

createProject({projectId:"p1", name:"Original project", programId:"original"});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:"p1", userId:'1', accessLevel:'admin'});

createProject({projectId:"p2", name:"RLP project", programId:"rlp"});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:"p2", userId:'1', accessLevel:'admin'});

createProject({projectId:"p3", name:"Configurable MERI project", programId:"configurable_meri_plan"});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:"p3", userId:'1', accessLevel:'admin'});

config = {
    projectTemplate: "rlp",
    meriPlanTemplate: "configurableMeriPlan",
    meriPlanContents: [
        {
            "template": "assets"
        },
        {
            "template": "objectivesList"
        },
        {
            "template": "outcomeStatements"
        },
        {
            "template": "description"
        },
        {
            "template": "monitoringIndicators"
        },
        {
            "template": "projectPartnerships"
        },
        {
            "template": "activities"
        }
    ],
    "objectives": [
        "objective 1",
        "objective 2",
        "objective 3"
    ],
    "activities": [
        "activity 1",
        "activity 2"
    ]
};
createProgram({programId: "state_intervention", name: "State Intervention", description: "", config: config});

createProject({projectId: "meri2", name: "State intervention project", programId: "state_intervention"});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "meri2",
    userId: '1',
    accessLevel: 'admin'
});



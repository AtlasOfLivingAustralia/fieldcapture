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
        "objectivesList",
        "monitoringIndicators",
        "projectImplementation",
        "projectPartnerships",
        "keq",
        "meriBudget"
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





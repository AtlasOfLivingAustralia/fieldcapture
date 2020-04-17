print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: "+pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');

loadActivityForms();

createProgram({});
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

for (var i=1; i<10; i++) {
    var id = ''+i;
    createProject({name:'Project '+id, projectId:id});
    createSite({name:"Test site "+id, siteId:'test_site_'+id, projects:[id]});
    if (i < 4) {
        db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:id, userId:'1', accessLevel:'admin'});
        db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:id, userId:'10', accessLevel:'editor'});
    }
}

createProject({projectId:"meri1", name:"Configurable MERI plan project", programId:"configurable_meri_plan"});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:"meri1", userId:'1', accessLevel:'admin'});






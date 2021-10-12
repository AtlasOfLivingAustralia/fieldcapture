print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: " + pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');

loadActivityForms();

createProgram({});
var config = {
    projectTemplate: "rlp",
    meriPlanTemplate: "configurableMeriPlan",
    meriPlanContents: [
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
            "template": "keq"
        },
        {
            "template": "meriBudget"
        }
    ],
    objectives: [
        "objective 1",
        "objective 2",
        "objective 3"
    ]
};
createProgram({
    programId: "configurable_meri_plan",
    name: "Configurable MERI Plan Program",
    description: "",
    config: config
});
createMu({});

db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Program',
    entityId: 'test_program',
    userId: '1',
    accessLevel: 'admin'
});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.ManagementUnit',
    entityId: 'test_mu',
    userId: '1',
    accessLevel: 'admin'
});

for (var i = 1; i < 10; i++) {
    var id = '' + i;
    createProject({name: 'Project ' + id, projectId: id, outputTargets: [{scoreId: "score_44", target: 1, periodTargets:[{period:"2018/2019", target: 1}] }]});


    createSite({name: "Test site " + id, siteId: 'test_site_' + id, projects: [id]});
    if (i < 4) {
        db.userPermission.insert({
            entityType: 'au.org.ala.ecodata.Project',
            entityId: id,
            userId: '1',
            accessLevel: 'admin'
        });
        db.userPermission.insert({
            entityType: 'au.org.ala.ecodata.Project',
            entityId: id,
            userId: '10',
            accessLevel: 'editor'
        });
        db.userPermission.insert({
            entityType: 'au.org.ala.ecodata.Project',
            entityId: id,
            userId: '30',
            accessLevel: 'caseManager'
        });
    }
}

createProject({projectId: "meri1", name: "Configurable MERI plan project", programId: "configurable_meri_plan"});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "meri1",
    userId: '1',
    accessLevel: 'admin'
});

var programWithDefaultOutcome = programDefaults.create();
programWithDefaultOutcome.outcomes[2].default = true;
programWithDefaultOutcome.programId  = 'default_outcome';
programWithDefaultOutcome.name =  "Default outcome";

db.program.insert(programWithDefaultOutcome);

createProject({projectId: "defaultOutcome", name: "Default outcome project", programId: "default_outcome"});
db.userPermission.insert({
    entityType: 'au.org.ala.ecodata.Project',
    entityId: "defaultOutcome",
    userId: '1',
    accessLevel: 'admin'
});

createOrganisation({
    name:'THE TRUSTEE FOR PSS FUND Test',
    organisationId:'test_organisation',
    status:'active', abn:'',
    url:'http://www.ala.org.au',
    acronym:'TSTORG', description:'THE TRUSTEE FOR PSS FUND Test'
})

createProject({name:'project active', projectId:"project_active", status:"active", planStatus:'submitted', internalOrderId:'12345' })
createProject({name:'project application', projectId:"project_application", status:"application", planStatus:'submitted', internalOrderId:''})
createProject({name:'project completed', projectId:"project_completed", status:"completed", planStatus:'submitted', internalOrderId:'12345'})

db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_active', userId:'2', accessLevel:'caseManager'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_application', userId:'2', accessLevel:'caseManager'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_completed', userId:'2', accessLevel:'caseManager'});


createProgram({programId:"grants", name:"Grant Program"});
var grantProgram = db.program.findOne({programId:"grants"});
grantProgram.config.projectTemplate=null;
grantProgram.config.meriPlanTemplate=null;
db.program.save(grantProgram);
createProject({name:'Grants project', projectId:"grants_project", programId:"grants", status:"active", planStatus:'',
    custom: {details: {objectives: {rows1:[{assets:["Threatened Species"], description:"Objective 1"}, {assets: ["Threatened Species"], description: "Objective 2"}]}}}});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'grants_project', userId:'2', accessLevel:'admin'});

addSetting('meritfielddata.rlp.report.declaration', 'Report declaration text');
addSetting('meritfielddata.rlp.report.submitted.emailSubject', 'Report submitted subject');
addSetting('meritfielddata.rlp.report.submitted.emailBody', 'Report submitted body');
addSetting('meritfielddata.rlp.report.submitted.emailSubject', 'Report approved subject');
addSetting('meritfielddata.rlp.report.submitted.emailBody', 'Report approved body');

// Load scores used by RLP services to enable their selection in the MERI plan.
createProjectNumberBaselineDataSets({ "scoreId":"score_42"});
createProjectNumberOfCommunicationMaterialsPublished({ "scoreId":"score_43"});
createProjectWeedAreaSurveyedHaDefault({ "scoreId":"score_44"});





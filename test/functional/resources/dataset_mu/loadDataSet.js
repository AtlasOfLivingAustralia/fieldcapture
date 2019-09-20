print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: "+pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');

createProject({name:'project 1', projectId:"project_1", programId:'test_program',managementUnitId:"test_mu",siteId:'test_site_1', grantId:"RLP-Test-Program-Project-1"})
createProject({name:'project 2', projectId:"project_2", programId:'test_program',managementUnitId:"test_mu_2",siteId:'test_site_2', grantId:"RLP-Test-Program-Project-2"})

createSite({name:"test site 1", siteId:'test_site_1', extent:{geometry:{state:'New South Wales (including Coastal Waters)'}}})
createSite({name:"test site 2", siteId:'test_site_2', extent:{geometry:{state:'Victoria'}}})

createProgram({name:'Program 1', programId:'test_program'})

createMu({name:'test mu', managementUnitId:"test_mu",managementUnitSiteId:'test_site_1'});
createMu({name:'test mu 2', managementUnitId:"test_mu_2",managementUnitSiteId:'test_site_2'})

// createProgram({programId:"test_program_2", name:"test program 2"})
// createProject({projectId:"test_project_2", name:"test project 2", programId:'test_program_2', managementUnitId:"test_mu"})

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'test_program', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'test_mu', userId:'1', accessLevel:'admin'});








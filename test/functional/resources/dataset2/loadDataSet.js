print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: "+pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');

loadActivityForms();

createProgram({});
createMu({});

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'test_program', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'test_mu', userId:'1', accessLevel:'admin'});

for (var i=1; i<10; i++) {
    var id = ''+i;
    createProject({name:'Project '+id, projectId:id});
    if (i < 4) {
        db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:id, userId:'1', accessLevel:'admin'});
        db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:id, userId:'10', accessLevel:'editor'});
    }
}






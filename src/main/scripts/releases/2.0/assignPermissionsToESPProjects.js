load('../../utils/audit.js');
var userIds = ['', ''];
var adminUserId = '';
var count;
for (var i=0; i<userIds.length; i++) {
    count = 0;
    var projects = db.project.find({associatedProgram:"Environmental Stewardship", status:{$ne:'deleted'}});
    while (projects.hasNext()) {
        var project = projects.next();

        addProjectPermission(userIds[i], project.projectId, 'caseManager', adminUserId);
        count++;
    }
    print("Added user: "+userIds[i]+" to "+count+" projects");
}
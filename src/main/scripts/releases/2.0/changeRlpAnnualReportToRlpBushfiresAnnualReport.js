load('../../utils/audit.js');
var userId = '1493';
var programs = ['Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - NRM', 'Multiregional Species and Strategic Program - NRM'];
for (var i=0; i<programs.length; i++) {
    var program = db.program.findOne({name:programs[i]});
    var projectReports = program.config.projectReports;
    for (var j=0; j<projectReports.length; j++) {
        if (projectReports[j].activityType == 'RLP Annual Report') {
            projectReports[j].activityType = 'RLP Bushfires Annual Report';
        }
    }
    db.program.save(program);

    var projects = db.project.find({programId:program.programId, status:{$ne:'deleted'}});
    while (projects.hasNext()) {
        var project = projects.next();

        var activities = db.activity.find({projectId:project.projectId, type:'RLP Annual Report'});
        while (activities.hasNext()) {
            var activity = activities.next();
            activity.type = 'RLP Bushfires Annual Report';
            if (activity.formVersion && activity.formVersion != NumberInt(1)) {
                activity.formVersion = NumberInt(1);
            }
            db.activity.save(activity);
            audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', userId, activity.projectId);

            db.output.update({activityId:activity.activityId}, {$set:{name:'RLP Bushfires Annual Report'}});
        }
    }
}
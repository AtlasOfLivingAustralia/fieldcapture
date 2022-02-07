load('../../../utils/audit.js');
var userId = '1493';
var program = db.program.findOne({name:"Direct source procurement"});

var projects = db.project.find({programId:program.programId, status:{$ne:'deleted'}});
while (projects.hasNext()) {
    var project = projects.next();

    var report = db.report.findOne({activityType:'RLP Short term project outcomes', projectId:project.projectId});
    if (report) {
        report.status = 'deleted';
        db.report.save(report);
        print("Removing report: "+report.reportId+" "+report.name+ " from "+project.projectId);
        audit(report, report.reportId, 'au.org.ala.ecodata.Report', userId);
        var activity = db.activity.findOne({activityId:report.activityId});
        activity.status = 'deleted';
        db.activity.save(activity);
        audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', userId);
        print("Removing activity: "+activity.activityId+" "+activity.description+ " from "+project.projectId);

        var outputs = db.output.find({activityId:activity.activityId});
        while (outputs.hasNext()) {
            var output = outputs.next();
            output.status = 'deleted';
            db.output.save(output);
            audit(output, output.outputId, 'au.org.ala.ecodata.Output', userId);
            print("Removing output: "+output.outputId+" "+output.name+ " from "+activity.activityId);
        }

        if (activity.siteId) {
            var site = db.site.findOne({siteId:activity.siteId});
            site.status = 'deleted';
            db.site.save(site);
            audit(site, site.siteId, 'au.org.ala.ecodata.Site', userId, project.projectId);
            print("Removing site: "+site.siteId+" "+site.name+ " from "+activity.activityId);
        }

    }

}
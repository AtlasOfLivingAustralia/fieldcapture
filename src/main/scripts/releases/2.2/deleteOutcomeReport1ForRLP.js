load('../../utils/audit.js');

var userId = '129333';
// Delete Outcomes Report 1 for project RLP-MU46-P2
var report1 = db.report.findOne({reportId:'245e6269-10aa-406c-b535-39b71a227ff9'});
if (report1) {
    var activity = db.activity.findOne({activityId:report1.activityId});

    report1.status = 'deleted';
    db.report.save(report1);
    audit(report1, report1.reportId, 'au.org.ala.ecodata.Report', userId);

    activity.status = 'deleted';
    db.activity.save(activity);
    audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', userId);

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



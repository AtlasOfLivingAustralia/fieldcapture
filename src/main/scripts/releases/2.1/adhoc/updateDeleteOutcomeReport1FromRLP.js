load('../../../utils/audit.js');

var userId = '129333';
// Delete Outcomes Report 1 for project RLP-MU11-P6
var report1 = db.report.findOne({reportId:'0a326540-e8e5-4038-b1a4-655e767d5350'});
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

// Delete Outcomes Report 1 for project RLP-MU08-P8
var report2 = db.report.findOne({reportId:'27801bcb-697c-4c2a-81a2-0d4aaaaa4c25'});
if (report2) {
    var activity = db.activity.findOne({activityId:report2.activityId});

    report2.status = 'deleted';
    db.report.save(report2);
    audit(report2, report2.reportId, 'au.org.ala.ecodata.Report', userId);

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


// Update Period End Date of Outcomes Report 1 for project RLP-MU11-P6
var reportId1 = '1c80504b-a3e4-4c9a-8ea3-0bea76202a37';
updateReportDetails(reportId1, 'Outcomes Report 1', ISODate("2020-01-16T13:00:00Z"), ISODate('2022-06-29T14:00:00Z'), userId);

// Update Period End Date of Outcomes Report 1 for project RLP-MU08-P8
var reportId2 = '7f3caf56-47ae-47f2-a30c-eaa3330df891';
updateReportDetails(reportId2, 'Outcomes Report 1', ISODate("2020-01-20T13:00:00Z"), ISODate('2022-06-29T14:00:00Z'), userId);
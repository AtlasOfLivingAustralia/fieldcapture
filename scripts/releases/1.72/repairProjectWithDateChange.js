var projectId = '35a31960-d3f1-418b-94a3-4623d25d31df';
var  adminUserId  = '1493';

function audit(entity, entityId, type) {
    var auditMessage = {
        date: ISODate(),
        entity: entity,
        eventType: 'Update',
        entityType: type,
        entityId: entityId,
        userId: adminUserId,
        projectId: entity.projectId
    };
    db.auditMessage.insert(auditMessage);
}

function updateActivity(report)  {
    var activity = db.activity.find({activityId:report.activityId}).next();
    activity.plannedEndDate = report.toDate;
    activity.endDate  =  report.toDate;
    activity.plannedStartDate = report.fromDate;
    activity.startDate = report.fromDate;
    activity.description = report.name;

    activity.lastUpdated = report.lastUpdated;

    db.activity.save(activity);
    audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity');
}

var reports = db.report.find({projectId:projectId, activityType:'RLP Output Report', status:{$ne:'deleted'}}).sort({toDate:1});

var currentReport;
var currentActivity;

var previousReport;
var previousActivity;

while (reports.hasNext()) {

    var previousReport = reports.next();
    var copyOfPreviousReport = db.report.find({reportId:previousReport.reportId}).next();

    var previousActivity = db.activity.find({activityId:previousReport.activityId}).next();
    var copyOfPreviousActivity = db.activity.find({activityId:previousReport.activityId}).next();

    print("current: "+(currentReport && currentReport.name));
    print("previous: "+previousReport.name);
    print("********");
    if (currentReport && previousReport) {

        print("Moving "+currentReport.name+" to "+previousReport.name);

        previousReport.name = currentReport.name;
        previousReport.description = currentReport.description;
        previousReport.toDate = currentReport.toDate;
        previousReport.fromDate = currentReport.fromDate;
        previousReport.lastUpdated = ISODate();
        previousReport.submissionDate = currentReport.submissionDate;

        db.report.save(previousReport);
        audit(previousReport, previousReport.reportId, 'au.org.ala.ecodata.Report');

        previousActivity.plannedStartDate = previousReport.fromDate;
        previousActivity.startDate = previousReport.fromDate;
        previousActivity.plannedEndDate = previousReport.toDate;
        previousActivity.endDate = previousReport.toDate;
        previousActivity.lastUpdated = ISODate();
        previousActivity.description = currentActivity.description;
        db.activity.save(previousActivity);
        audit(previousActivity, previousActivity.activityId, 'au.org.ala.ecodata.Activity');

    }

    currentReport = copyOfPreviousReport;
    currentActivity = copyOfPreviousActivity;
}

// Undelete the final report
var finalReportId = '115db64d-e722-4887-94c0-f2b1677e9adb';
var report = db.report.findOne({reportId:finalReportId});
report.lastUpdated = ISODate();
report.status = 'active';
db.report.save(report);
audit(report, report.reportId, 'au.org.ala.ecodata.Report');

var activity = db.activity.findOne({activityId:report.activityId});
activity.lastUpdated = ISODate();
activity.status = 'active';
db.activity.save(activity);
audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity');

// The report doesn't have a site so we don't need to restore the site.

var outputs = db.output.find({activityId:report.activityId});
while (outputs.hasNext()) {
    var output = outputs.next();
    output.lastUpdated = ISODate();
    output.status = 'active';
    db.output.save(output);
    audit(output, output.outputId, 'au.org.ala.ecodata.Output');
}

var documents = db.document.find({activityId:report.activityId});
while (documents.hasNext()) {
    var document = documents.next();
    document.lastUpdated = ISODate();
    document.status = 'active';
    print('mv /data/ecodata/archive/'+document.filepath+'/'+document.filename+' /data/ecodata/uploads/'+document.filepath+'/'+document.filename);
    db.document.save(document);
    audit(document, document.documentId, 'au.org.ala.ecodata.Document');
}

// Delete the empty report & associated activity
var emptyReportId = '2b0283e6-4520-4139-aeff-dfdcfca2ca94';
var emptyReport = db.report.findOne({reportId:emptyReportId});
emptyReport.lastUpdated = ISODate();
emptyReport.status = 'deleted';
db.report.save(emptyReport);
audit(emptyReport, emptyReport.reportId, 'au.org.ala.ecodata.Report');

activity = db.activity.findOne({activityId:emptyReport.activityId});
activity.lastUpdated = ISODate();
activity.status = 'deleted';
db.activity.save(activity);
audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity');

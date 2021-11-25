var projectId = '938593de-15e1-47fa-be37-2771ccb836a1';
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


// Delete the empty report & associated activity
var emptyReportId = '1d3f98a7-a655-422e-b785-cea1eee976dd';
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
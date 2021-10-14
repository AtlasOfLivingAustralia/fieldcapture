/** Inserts a document into the auditMessage collection */
function audit(entity, entityId, type, userId, projectId) {
    var auditMessage = {
        date: ISODate(),
        entity: entity,
        eventType: 'Update',
        entityType: type,
        entityId: entityId,
        userId: userId
    };
    if (entity.projectId || projectId) {
        auditMessage.projectId = (entity.projectId || projectId);
    }
    db.auditMessage.insert(auditMessage);
}

/** Updates the name and dates for a supplied report */
function updateReportDetails(reportId, name, fromDate, toDate, userId) {
    var now = ISODate();
    var report = db.report.findOne({reportId:reportId});
    report.fromDate = fromDate;
    report.toDate = toDate;
    report.lastUpdated = now;
    report.name = name;
    report.description = name;

    db.report.save(report);
    audit(report, report.reportId, 'au.org.ala.ecodata.Report', userId);

    updateActivity(report, userId);
}

/** Updates an activity to match the changes made to a supplied report and audits the change */
function updateActivity(report, userId)  {
    var activity = db.activity.findOne({activityId:report.activityId});
    activity.plannedEndDate = report.toDate;
    activity.endDate  =  report.toDate;
    activity.plannedStartDate = report.fromDate;
    activity.startDate = report.fromDate;
    activity.description = report.name;

    activity.lastUpdated = report.lastUpdated;

    db.activity.save(activity);
    audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', userId);
}
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
function updateReportDetails(reportId, name, fromDate, toDate, userId, submissionDate, description) {
    var now = ISODate();
    var report = db.report.findOne({reportId:reportId});
    report.fromDate = fromDate;
    report.toDate = toDate;
    report.lastUpdated = now;
    report.name = name;
    report.description = description || name;
    report.submissionDate = submissionDate || toDate;

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

function addProjectPermission(userId, projectId, accessLevel, adminUserId) {
    var userPermission = {
        userId:userId,
        entityType:'au.org.ala.ecodata.Project',
        entityId:projectId,
        accessLevel:accessLevel
    };
    if (db.userPermission.findOne({userId:userId, entityId:projectId})) {
        print("Not adding permission for user: "+userId+" to entity: "+projectId+", permission already exists");
    }
    else {
        db.userPermission.insert(userPermission);
        var id = db.userPermission.findOne({userId:userId, entityId:projectId})._id;
        audit(userPermission, id, 'au.org.ala.ecodata.UserPermission', adminUserId, projectId);
    }


}
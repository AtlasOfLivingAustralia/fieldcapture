/**
 * Iterates through a management unit project and managementUnit report configuration and adds a description
 * to any reports matching the supplied category.
 */
function addDescriptionToMUReports(category, description) {
    var mus = db.managementUnit.find({status:{$ne:'deleted'}});
    while (mus.hasNext()) {
        var mu = mus.next();

        if (mu.config.projectReports) {
            for (var i=0; i<mu.config.projectReports.length; i++) {
                if (mu.config.projectReports[i].category == category) {
                    mu.config.projectReports[i].description = description;
                    print("Updating report description for MU: "+mu.name);
                    db.managementUnit.save(mu);
                }
            }
        }
        if (mu.config.managementUnitReports) {
            for (var i=0; i<mu.config.managementUnitReports.length; i++) {
                if (mu.config.managementUnitReports[i].category == category) {
                    mu.config.managementUnitReports[i].description = description;

                    print("Updating report description for MU: "+mu.name);
                    db.managementUnit.save(mu);
                }
            }
        }

    }
}

function addDescriptionToOrganisationReports(category, description, auditUserId) {
    var orgs = db.organisation.find({status:{$ne:'deleted'}});
    while (orgs.hasNext()) {
        var org = orgs.next();

        if (org.config && org.config.organisationReports) {
            for (var i=0; i<org.config.organisationReports.length; i++) {
                if (org.config.organisationReports[i].category == category) {
                    org.config.organisationReports[i].description = description;
                    print("Updating report description for organisation: "+org.name);
                    db.organisation.replaceOne({organisationId:org.organisationId}, org);
                    audit(org, org.organisationId, 'au.org.ala.ecodata.Organisation', auditUserId);
                }
            }
        }
    }
}

function addDescriptionToProgramReports(category, description, programs) {
    var criteria = {status:{$ne:'deleted'}};
    if (programs) {
        criteria.name = {$in:programs};
    }
    var programs = db.program.find(criteria);

    while (programs.hasNext()) {
        var program = programs.next();
        if (program.config.projectReports) {
            for (var i=0; i<program.config.projectReports.length; i++) {
                if (program.config.projectReports[i].category == category) {
                    program.config.projectReports[i].description = description;
                    print("Updating report description for program: "+program.name);
                    db.program.save(program);
                }
            }
        }
    }
}

/**
 * Iterates backwards through project reports, undoing the effects of a bug that can result
 * in reports being pushed to the next reporting period when a start date change is made on
 * projects with existing reports.
 * @param projectId the project id affected by the bug
 * @param reportTypes an array containing the activityType of the reports to change
 * @param adminUserId the userId to include in the audit trail
 */
function repairProjectAffectedByDateChangeBug(projectId, reportTypes, adminUserId) {

    for (var i=0; i<reportTypes.length; i++) {

        var reports = db.report.find({projectId:projectId, activityType:reportTypes[i], status:{$ne:'deleted'}}).sort({toDate:1});

        var currentReport = null;
        var currentActivity = null;

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
                audit(previousReport, previousReport.reportId, 'au.org.ala.ecodata.Report', adminUserId);

                previousActivity.plannedStartDate = previousReport.fromDate;
                previousActivity.startDate = previousReport.fromDate;
                previousActivity.plannedEndDate = previousReport.toDate;
                previousActivity.endDate = previousReport.toDate;
                previousActivity.lastUpdated = ISODate();
                previousActivity.description = currentActivity.description;
                db.activity.save(previousActivity);
                audit(previousActivity, previousActivity.activityId, 'au.org.ala.ecodata.Activity', adminUserId);

            }

            currentReport = copyOfPreviousReport;
            currentActivity = copyOfPreviousActivity;
        }
    }

}

/** Undoes an accidental status of "Not required" for a report. */
function removeNotRequiredStatus(reportId, reason, adminUserId) {
    var report = db.report.findOne({reportId:reportId});
    report.publicationStatus = 'unpublished';
    report.statusChangeHistory.push({
            "changedBy" : adminUserId,
            "comment" : reason,
            "dateChanged" : ISODate(),
            "status" : report.publicationStatus
        });
    db.report.replaceOne({_id:report._id}, report);
    audit(report, report.reportId, 'au.org.ala.ecodata.Report', adminUserId);

    if (report.activityId) {
        var activity = db.activity.findOne({activityId:report.activityId});
        activity.publicationStatus = 'unpublished';
        db.activity.replaceOne({_id:activity._id}, activity);
        audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', adminUserId);
    }
}

/**
 * This currently doesn't delete or restore documents associated with a report due to the
 * complications with the actual document location on the file system.
 *
 * @param reportId the report to change the status of
 * @param status the new status ('deleted' or 'active')
 */
function changeReportStatus(reportId, status, adminUserId) {
    const report = db.report.findOne({reportId:reportId});
    const activity = db.activity.findOne({activityId:report.activityId});
    const outputs = db.output.find({activityId:report.activityId});

    report.status = status;
    db.report.replaceOne({reportId:reportId}, report);
    audit(report, reportId, 'au.org.ala.ecodata.Report', adminUserId, report.projectId);

    activity.status = status;
    db.activity.replaceOne({activityId:report.activityId}, activity);
    audit(activity, report.activityId, 'au.org.ala.ecodata.Activity', adminUserId, report.projectId);

    while (outputs.hasNext()) {
        const output = outputs.next();
        output.status = status;
        db.output.replaceOne({outputId:output.outputId}, output);
        audit(output, output.outputId, 'au.org.ala.ecodata.Output', adminUserId, report.projectId);
    }

    if (activity.siteId) {
        var site = db.site.findOne({siteId:activity.siteId});
        site.status = status;
        db.site.replaceOne(site);
        audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId, project.projectId);
        print("Removing site: "+site.siteId+" "+site.name+ " from "+activity.activityId);
    }
}

function undeleteReport(reportId, adminUserId) {
    changeReportStatus(reportId, 'active', adminUserId);
}

function deleteReport(reportId, adminUserId) {
    changeReportStatus(reportId, 'deleted', adminUserId);
}

/**
 * This currently doesn't delete or restore documents associated with a report due to the
 * complications with the actual document location on the file system.
 *
 * @param reportId the report to change the status of
 * @param status the new status ('deleted' or 'active')
 */
function restoreNotRequiredReport(reportId, adminUserId, comment) {
    const report = db.report.findOne({reportId:reportId});
    const activity = db.activity.findOne({activityId:report.activityId});

    const now = ISODate();
    report.publicationStatus = 'unpublished';
    report.dateReturned = now;
    report.returnedBy = adminUserId;
    report.statusChangeHistory.push({
        changedBy:adminUserId,
        dateChanged:now,
        status:'unpublished',
        comment:comment
    });

    db.report.replaceOne({reportId:reportId}, report);
    audit(report, reportId, 'au.org.ala.ecodata.Report', adminUserId, report.projectId);

    activity.publicationStatus = 'unpublished';
    db.activity.replaceOne({activityId:report.activityId}, activity);
    audit(activity, report.activityId, 'au.org.ala.ecodata.Activity', adminUserId, report.projectId);
}

/**
 * Creates a new report for the given project.
 * @param reportDetails
 * @param project
 * @param adminUserId
 */
function createReportForProject(reportDetails, project, adminUserId) {
    let now = ISODate();
    if (!reportDetails.fromDate) {
        reportDetails.fromDate = project.plannedStartDate;
    }
    if (!reportDetails.toDate) {
        reportDetails.toDate = project.plannedEndDate;
    }
    if (!reportDetails.submissionDate) {
        reportDetails.submissionDate = reportDetails.toDate;
    }
    reportDetails.dateCreated = now;
    reportDetails.lastUpdated = now;
    reportDetails.projectId = project.projectId;
    reportDetails.reportId = UUID.generate();
    reportDetails.status = 'active';
    reportDetails.publicationStatus =null;


    if (!reportDetails.name ||
        !reportDetails.description ||
        !reportDetails.activityType ||
        !reportDetails.category ||
        !reportDetails.generatedBy ||
        !reportDetails.type) {
        throw "Missing report details"
    }

    let activity = {
        activityId: UUID.generate(),
        assessment: false,
        dateCreated:now,
        lastUpdated:now,
        description:reportDetails.name,
        type:reportDetails.activityType,
        progress:'planned',
        startDate:reportDetails.fromDate,
        endDate:reportDetails.toDate,
        status:'active',
        publicationStatus:null
    };
    reportDetails.activityId = activity.activityId;

    db.report.insertOne(reportDetails);

    let savedReport = db.report.findOne({reportId:reportDetails.reportId});
    audit(savedReport, savedReport.reportId, 'au.org.ala.ecodata.Report', adminUserId, project.projectId);

    db.activity.insertOne(activity);
    let savedActivity = db.activity.findOne({activityId:activity.activityId});
    audit(savedActivity, savedActivity.activityId, 'au.org.ala.ecodata.Activity', adminUserId, project.projectId);

}


function deleteActivity(activityId, adminUserId) {


    let activity = db.activity.findOne({activityId: activityId});
    print("deleting activity: "+activityId+" "+activity.description);
    if (activity) {
        activity.status = 'deleted';

        db.activity.replaceOne({activityId: activityId}, activity);
        audit(activity, activity.activityId, 'au.org.ala.ecodata.Activity', adminUserId, activity.projectId);

        let outputs = db.output.find({activityId: activityId});
        while (outputs.hasNext()) {
            let output = outputs.next();
            output.status = 'deleted';
            print("deleting output: "+output.outputId+" "+output.name);
            db.output.replaceOne({outputId: output.outputId}, output);
            audit(output, output.outputId, 'au.org.ala.ecodata.Output', adminUserId, activity.projectId);
        }
    }

}
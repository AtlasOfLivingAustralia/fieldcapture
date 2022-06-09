
load('../../utils/uuid.js');
load('../../utils/audit.js');
var adminUserId = 'tba';
var save = false;
var reports = db.report.find({status:{$ne:'deleted'}, reportId:{$exists:true}});

var count = 0;
while (reports.hasNext()) {
    var report = reports.next();

    //print("Processing report: " + report.reportId);

    processReport(report);
}
print(count);

function processReport(report) {
    var auditMessages = db.auditMessage.find({entityId:report.reportId, entityType:'au.org.ala.ecodata.Report'}).sort({date:1});

    if (!auditMessages.hasNext()) {
        print("*****WARNING: No audit messages found for report: "+report.reportId);
        return;
    }
    var previousReport = auditMessages.next().entity;
    var currentReport = null;
    var missingChanges = [];
    while (auditMessages.hasNext()) {
        var message = auditMessages.next();
        currentReport = message.entity;

        var missingChange = lookForStatusChanges(currentReport, previousReport);
        if (missingChange) {
            missingChanges.push(missingChange);
            if (!report.statusChangeHistory) {
                report.statusChangeHistory = [];
            }
            var toInsertIndex = 0;
            while (toInsertIndex < report.statusChangeHistory.length && missingChange.dateChanged.getTime() > report.statusChangeHistory[toInsertIndex].dateChanged.getTime()) {
                toInsertIndex++;
            }
            report.statusChangeHistory.splice(toInsertIndex, 0, missingChange);
        }
        previousReport = currentReport;
    }
    if (missingChanges.length > 0) {
        print("******************************");
        print("Found missing changes for report "+report.reportId);
        printjson(report);
        printjson(missingChanges);
        print("");
        count++;

        if (save) {
             db.report.save(report);
             audit(report, report.reportId, 'au.org.ala.ecodata.Report', adminUserId);
        }
    }

}

function lookForStatusChanges(currentReport, previousReport) {
    var statusChange = null;
    if (!areDatesEqual(currentReport.dateSubmitted, previousReport.dateSubmitted)) {
        //print("Date submitted mismatch: "+currentReport.dateSubmitted+", "+previousReport.dateSubmitted);
        statusChange = {changedBy: currentReport.submittedBy, dateChanged:currentReport.dateSubmitted, status:'submitted'};
    }
    if (!areDatesEqual(currentReport.dateApproved, previousReport.dateApproved)) {
        //print("Date approved mismatch: "+currentReport.dateApproved+", "+previousReport.dateApproved);
        statusChange = {changedBy: currentReport.approvedBy, dateChanged:currentReport.dateApproved, status:'approved'};
    }
    if (!areDatesEqual(currentReport.dateReturned, previousReport.dateReturned)) {
        //print("Date returned mismatch: "+currentReport.dateReturned+", "+previousReport.dateReturned);
        statusChange = {changedBy: currentReport.returnedBy, dateChanged:currentReport.dateReturned, status:'returned'};
    }
    if (!areDatesEqual(currentReport.dateAdjusted, previousReport.dateAdjusted)) {
        //print("Date adjusted mismatch: "+currentReport.dateAdjusted+", "+previousReport.dateAdjusted);
        statusChange = {changedBy: currentReport.adjustedBy, dateChanged:currentReport.dateAdjusted, status:'adjusted'};
    }
    if (!areDatesEqual(currentReport.dateCancelled, previousReport.dateCancelled)) {
        //print("Date cancelled mismatch: "+currentReport.dateCancelled+", "+previousReport.dateCancelled);
        statusChange = {changedBy: currentReport.cancelledBy, dateChanged:currentReport.dateCancelled, status:'cancelled'};
    }
    if (statusChange) {
        var found = findStatusChange(statusChange, currentReport.statusChangeHistory || []);
        if (statusChange.changedBy  && statusChange.dateChanged && !found) {
            // The audit trail can have entries with nulls when the procedure to change project start dates is goes wrong.
            if (statusChange.status == 'returned') {
                print("Date returned mismatch");
                printjson(currentReport);
            }
            return statusChange;
        }
    }
}
function findStatusChange(change, changeHistory) {
    var found = false;
    for (var i=0; i<changeHistory.length; i++) {
        var historicalChange = changeHistory[i];

        if (historicalChange.status == change.status && historicalChange.changedBy == change.changedBy && areDatesEqual(historicalChange.dateChanged, change.dateChanged)) {
            found = true;
            break;
        }
    }
    return found;
}

function areDatesEqual(date1, date2) {

    if (!date1 && !date2) {
        return true;
    }
    if (!date1 && date2 || !date2 && date1) {
        return false;
    }
    return date1.getTime() == date2.getTime();

}

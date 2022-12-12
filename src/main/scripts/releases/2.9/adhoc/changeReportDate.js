load('../../../utils/audit.js');
var reportId = '72bc4fc9-f443-4368-801e-4a80c158d45a';
var report = db.report.findOne({reportId:reportId});

var newEndDate = ISODate('2022-06-29T14:00:00Z');
var adminUserId = '';
updateReportDetails(reportId, report.name, report.fromDate, newEndDate, adminUserId, newEndDate, report.description);
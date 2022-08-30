load('../../../utils/audit.js');
load('../../../utils/reports.js');

var reportId = '9cd037da-83dd-4d0c-a53c-8b424861a19d';
var adminUserId = '<insert userId here>';
var reason = 'Restoring report marked as Not Required';

removeNotRequiredStatus(reportId, reason, adminUserId);
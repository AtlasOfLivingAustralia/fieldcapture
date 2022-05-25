load('../../utils/audit.js');
load('../../utils/reports.js');

var projectId = 'e5b8d8a5-db73-48c9-b1ab-fd83c2e1d98c';
var adminUserId  = '1493';

var reportTypes = ['RLP Output Report', 'RLP Annual Report'];

repairProjectAffectedByDateChangeBug(projectId, reportTypes, adminUserId);

// Now fix up the first Outputs & annual report
var outputReport1 = 'fe578318-92f2-4450-84b8-fa90ab34fdf3';

var fromDate = ISODate("2021-06-29T14:00:00Z");
var toDate = ISODate("2021-06-30T14:00:00Z");

updateReportDetails(outputReport1, 'Year 2020/2021 - Quarter 4 Outputs Report', fromDate, toDate, adminUserId);

var annualReportId = '07986ef5-567c-48e1-82c7-0f2b06eab910';
updateReportDetails(annualReportId, 'Annual Progress Report 2020 - 2021 for NRM Regional Bushfire Recovery in the Blue Mountains – Greater Sydney', fromDate, toDate, adminUserId);
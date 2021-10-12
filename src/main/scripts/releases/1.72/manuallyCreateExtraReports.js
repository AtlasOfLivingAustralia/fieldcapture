load('../../utils/audit.js');

var userId = '1493';

// DPT-MU42-P1
// Change the dates for Q1 2021 Output Report from 25-06-2021 - 30-09-2021 to 25-06-2021 - 30-06-2021

var reportId = 'f5ec91cc-3c11-4f5d-af0b-e59845ae95da'; // Q1 2021/2022
updateReportDetails(reportId, 'Year 2020/2021 - Quarter 4 Outputs Report', ISODate("2021-06-24T14:00:00Z"), ISODate('2021-06-30T14:00:00Z'), userId);

// ERF-MU42-P2

// Change the dates for Q1 2021 Output Report from 28-06-2021 - 30-09-2021 to 28-06-2021 - 30-06-2021
// Change the dates for Q2 2021 Output Report from 01-10-2021 - 31-12-2021 to 01-07-2021 - 30-09-2021
var q1_2122ReportId = '527bb2c3-e351-4720-98be-650f86cf9f6e';
updateReportDetails(q1_2122ReportId, 'Year 2020/2021 - Quarter 4 Outputs Report', ISODate("2021-06-27T14:00:00Z"), ISODate('2021-06-30T14:00:00Z'), userId);

var q2_12122ReportId = 'd95e7011-0bb5-403f-b9db-4d2909c55afe';
updateReportDetails(q2_12122ReportId, 'Year 2021/2022 - Quarter 1 Outputs Report', ISODate('2021-06-30T14:00:00Z'), ISODate("2021-09-30T14:00:00Z"), userId);

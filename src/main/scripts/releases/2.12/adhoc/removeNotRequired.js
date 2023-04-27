load('../../../utils/reports.js');
load('../../../utils/audit.js');
const adminUserId = '';
const comment = 'Removing not required report status as per request dated 27/04/2023'
const reports = [
    '29326249-41ab-4d6c-91f3-abfd34bf89b1',
    '8906bd0d-7ec9-4d9a-bf7a-a09ef835a3f6',
    'aadb3ab3-3e15-417c-bf75-5e2cbfd72c21',
    'f3a81a80-eed4-4950-8c90-24cfa1aceee6'
];

for (let i=0; i<reports.length; i++) {
    restoreNotRequiredReport(reports[i], adminUserId, comment)
}
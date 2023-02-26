load('../../../utils/audit.js');
load('../../../utils/reports.js');

const reportIds = [
    '82129045-2902-45bc-b801-6c6ae85855f4', // 'RLP-MU48-P3'
    '491036a9-9425-4588-95b6-be8fa0ed7d7b', // RLP-MU48-P1
    '2bc6ef8c-029e-458d-9499-9bae41380e1b', // RLP-MU33-P5
    '6f512e72-9c30-40de-bb71-562350c8eec7', // RLP-MU30-P4
    '3baada34-e509-4d41-8d89-c6c0986b51d7', // RLP-MU21-P2
    '015ff283-913b-4826-b76c-9c4cd61e5e3c', // RLP-MU07-P1
];

const adminUserId = 'TBA'

for (let i=0; i<reportIds.length; i++) {
    deleteReport(reportIds[i], adminUserId);
}
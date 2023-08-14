load('../../../utils/audit.js');

let adminUserId = '<tba>';
let removalDate = '2023-06-23T00:00:00Z';
const users = [
    '126694'
];
for (let i=0; i<users.length; i++) {
    restoreRemovedPermissions(users[i], removalDate, adminUserId);
}


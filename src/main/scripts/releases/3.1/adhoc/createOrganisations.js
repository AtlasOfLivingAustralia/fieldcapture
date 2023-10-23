load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/organisations.js');

const adminUserId = '<system>'
const names = ['Northern Tablelands Local Land Services', 'Hunter Local Land Services', 'Riverina Local Land Services', 'North Coast Local Land Services'];

const abn = '57876455969';
for (let i=0; i<names.length; i++) {
    let result = createOrganisation(names[i], 'TBA', abn, adminUserId);
    print("Created "+names[i]+" with organisationId: "+result.organisationId);
}

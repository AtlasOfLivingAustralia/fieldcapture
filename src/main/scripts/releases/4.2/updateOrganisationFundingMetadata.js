load('../../utils/audit.js');
const adminUserId = 'system';
let organisations = db.organisation.find({'custom.details.funding':{$exists:true}});
while (organisations.hasNext()) {
    let organisation = organisations.next();
    let funding = organisation.custom.details.funding;

    if (!funding) {
        continue;
    }
    if (funding.rows.length != 1) {
        print("Organisation " + organisation.organisationId + " has " + funding.rows.length + " funding rows");
    }

    const metadata = {
        type: 'periodicallyRevisedTotal',
        shortLabel: 'rcsContractedFunding',
        description: 'RCS Contracted Funding'
    };

    if (funding.rows[0].type != metadata.type || funding.rows[0].shortLabel != metadata.shortLabel || funding.rows[0].description != metadata.description) {
        print("Updating funding metadata for organisation " + organisation.organisationId+", "+organisation.name);

        funding.rows[0].type = metadata.type;
        funding.rows[0].shortLabel = metadata.shortLabel;
        funding.rows[0].description = metadata.description;
        db.organisation.replaceOne({organisationId: organisation.organisationId}, organisation);
        audit(organisation, organisation.organisationId, 'au.org.ala.ecodata.Organisation', adminUserId);
    }
}
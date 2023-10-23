/**
 * Creates a new report for the given project.
 * @param reportDetails
 * @param project
 * @param adminUserId
 */
function createOrganisation(name, description, abn, adminUserId) {
    const now = ISODate();

    const meritHub = db.hub.findOne({urlPath:'merit'});
    let org = {
        name: name,
        description: description || name,
        abn: abn,
        hubId: meritHub.hubId,
        organisationId: UUID.generate(),
        dateCreated: now,
        lastUpdated: now,
        status:'active'
    };
    db.organisation.insertOne(org);
    audit(org, org.organisationId, "au.org.ala.ecodata.Organisation", adminUserId, null, 'create');
    return db.organisation.findOne({organisationId:org.organisationId});
}
load('../../../utils/audit.js');
const adminUserId = "system";

// NHT - Coordinate dropdown value update
db.output.find(
    {
        name: 'NHT - Coordinate',
        status: { $ne: 'deleted' },
        "data.undergoneReview": "NA" // Filter directly in the query
    }
).forEach(coordinate => {
    let activity = db.activity.findOne({ activityId: coordinate.activityId });

    if (activity?.type === 'NHT Output Report' && activity.formVersion > 1) {
        let updateResult = db.output.updateOne(
            { _id: coordinate._id },
            { $set: { "data.undergoneReview": "Not Applicable" } }
        );

        if (updateResult.modifiedCount > 0) {
            // Get the updated document after the update
            let updatedCoordinate = db.output.findOne({ _id: coordinate._id });
            audit(updatedCoordinate, updatedCoordinate.outputId, 'au.org.ala.ecodata.Output', adminUserId);

            printjson({
                message: "Updated document",
                documentId: updatedCoordinate._id,
                modifiedCount: updateResult.modifiedCount
            });
        }
    }
});

// NHT - Communications dropdown value updates
let comms = db.output.find(
    { name: 'NHT - Communications', status: { $ne: 'deleted' } }
).toArray();

comms.forEach(comm => {
    let activity = db.activity.findOne({ activityId: comm.activityId });

    if (comm.data?.communicationDetails && activity?.type === 'NHT Output Report' && activity.formVersion > 1) {
        // Update separately using arrayFilters
        let updateResult1 = db.output.updateOne(
            { _id: comm._id },
            {
                $set: { "data.communicationDetails.$[flyer].communicationMaterialType": "Event Flyers and Brochures" }
            },
            {
                arrayFilters: [{ "flyer.communicationMaterialType": "Flyers and brochures" }]
            }
        );

        let updateResult2 = db.output.updateOne(
            { _id: comm._id },
            {
                $set: { "data.communicationDetails.$[newspaper].communicationMaterialType": "Newspaper/Magazine Articles" }
            },
            {
                arrayFilters: [{ "newspaper.communicationMaterialType": "Newspaper articles" }]
            }
        );

        // Check if any updates were made then insert in audit
        if (updateResult1.modifiedCount > 0 || updateResult2.modifiedCount > 0) {
            let updatedComm = db.output.findOne({ _id: comm._id });
            audit(updatedComm, updatedComm.outputId, 'au.org.ala.ecodata.Output', adminUserId);
            printjson({
                message: "Updated document",
                documentId: updatedComm._id,
                modifiedCount: updateResult1.modifiedCount + updateResult2.modifiedCount
            });
        }
    }
});

// NHT - Communication materials dropdown value updates
let commsMaterials = db.output.find(
    { name: 'NHT - Communication materials', status: { $ne: 'deleted' } }
).toArray();

commsMaterials.forEach(commsMaterial => {
    let activity = db.activity.findOne({ activityId: commsMaterial.activityId });

    if (
        commsMaterial.data?.communicationMaterialsByOutcome &&
        activity?.type === 'NHT Output Report' &&
        activity.formVersion > 1
    ) {
        let updated = false;

        commsMaterial.data.communicationMaterialsByOutcome.forEach(outcome => {
            if (Array.isArray(outcome.communicationMaterials)) {
                outcome.communicationMaterials.forEach(material => {
                    if (material.communicationMaterialType === 'Booklets') {
                        material.communicationMaterialType = 'Books/Booklets';
                        updated = true;
                    }
                    if (material.communicationMaterialType === 'Podcasts') {
                        material.communicationMaterialType = 'Podcasts/Radio recordings/Radio transcripts';
                        updated = true;
                    }
                    if (material.communicationMaterialType === 'Fact Sheets/Brochures') {
                        material.communicationMaterialType = 'Fact Sheets/Brochures/Guides';
                        updated = true;
                    }
                });
            }
        });

        if (updated) {
            let result = db.output.updateOne(
                { _id: commsMaterial._id },
                { $set: { 'data.communicationMaterialsByOutcome': commsMaterial.data.communicationMaterialsByOutcome } }
            );

            let updatedDoc = db.output.findOne({ _id: commsMaterial._id });
            audit(updatedDoc, updatedDoc.outputId, 'au.org.ala.ecodata.Output', adminUserId);

            printjson({
                message: "Updated document",
                documentId: updatedDoc._id,
                modifiedCount: result.modifiedCount
            });
        }
    }
});
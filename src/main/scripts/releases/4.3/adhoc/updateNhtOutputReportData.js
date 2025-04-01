load('../../../utils/audit.js');
const adminUserId = "system";

// NHT - Coordinate dropdown value update
let coordinates = db.output.find(
    { name: 'NHT - Coordinate', status: { $ne: 'deleted' } }
).toArray();

coordinates.forEach(coordinate => {
    let activity = db.activity.findOne({ activityId: coordinate.activityId });

    if (coordinate.data?.undergoneReview === "NA" && activity?.type === 'NHT Output Report' && activity.formVersion > 1) {
        let updateResult = db.output.updateOne(
            { _id: coordinate._id },
            { $set: { "data.undergoneReview": "Not Applicable" } }
        );

        if (updateResult.modifiedCount > 0) {
            audit(coordinate, coordinate.outputId, 'au.org.ala.ecodata.Output', adminUserId);
            printjson({ message: "Updated document", documentId: coordinate._id, modifiedCount: updateResult.modifiedCount });
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
        // Update both "Flyers and Brochures", and "Newspaper Articles" in the same query
        let updateResult = db.output.updateOne(
            {
                _id: comm._id,
                "data.communicationDetails.communicationMaterialType": { $in: ["Flyers and Brochures", "Newspaper Articles"] }
            },
            {
                $set: {
                    "data.communicationDetails.$[flyers].communicationMaterialType": "Event Flyers and Brochures",
                    "data.communicationDetails.$[newspaper].communicationMaterialType": "Newspaper/Magazine Articles"
                }
            },
            {
                arrayFilters: [
                    { "flyers.communicationMaterialType": "Flyers and Brochures" },
                    { "newspaper.communicationMaterialType": "Newspaper Articles" }
                ]
            }
        );

        if (updateResult.modifiedCount > 0) {
            audit(comm, comm.outputId, 'au.org.ala.ecodata.Output', adminUserId);
            printjson({ message: "Updated document", documentId: comm._id, modifiedCount: updateResult.modifiedCount });
        }
    }
});

// NHT - Communication materials dropdown value updates
let commsMaterials = db.output.find(
    { name: 'NHT - Communication materials', status: { $ne: 'deleted' } }
).toArray();

commsMaterials.forEach(commsMaterial => {
    let activity = db.activity.findOne({ activityId: commsMaterial.activityId });

    if (commsMaterial.data?.communicationDetails && activity?.type === 'NHT Output Report' && activity.formVersion > 1) {
        // Update "Books", "Podcasts", and "Fact Sheets/Brochures" in the same query
        let updateResult = db.output.updateOne(
            {
                _id: commsMaterial._id,
                "data.communicationDetails.communicationMaterialType": { $in: ["Books", "Podcasts", "Fact Sheets/Brochures"] }
            },
            {
                $set: {
                    "data.communicationDetails.$[book].communicationMaterialType": "Books/Booklets",
                    "data.communicationDetails.$[podcast].communicationMaterialType": "Podcasts/Radio recordings/Radio transcripts",
                    "data.communicationDetails.$[fact].communicationMaterialType": "Fact Sheets/Brochures/Guides"
                }
            },
            {
                arrayFilters: [
                    { "book.communicationMaterialType": "Books" },
                    { "podcast.communicationMaterialType": "Podcasts" },
                    { "fact.communicationMaterialType": "Fact Sheets/Brochures" }
                ]
            }
        );

        if (updateResult.modifiedCount > 0) {
            audit(commsMaterial, commsMaterial.outputId, 'au.org.ala.ecodata.Output', adminUserId);
            printjson({ message: "Updated document", documentId: commsMaterial._id, modifiedCount: updateResult.modifiedCount });

        }
    }
});
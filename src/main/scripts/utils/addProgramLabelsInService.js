const programIds = ["5945d219-3141-4e9f-ad45-828118f8191f"];

addProgramLabels(
    9,
    'Establishing and maintaining pest animal-free enclosures',
    programIds
);

addProgramLabels(
    14,
    'Implementing fire management actions',
    programIds
);

function addProgramLabels(legacyId, labelText, programIds) {

    const updateFields = {};

    programIds.forEach(function(programId) {
        updateFields[`programLabels.${programId}`] = { label: labelText };
    });

    const existsConditions = programIds.map(pid => ({ [`programLabels.${pid}`]: { $exists: false } }));

    const result = db.service.updateOne(
        {
            legacyId: legacyId,
            $or: existsConditions
        },
        {
            $set: updateFields
        }
    );

    printjson(result);
}
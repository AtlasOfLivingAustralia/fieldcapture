const programIds = [
    "05a2d9e8-be51-4973-bc66-41c53701d25e",
    "d45985bc-033f-42c9-820d-0676579412f0",
    "7b16bc63-d568-4a4a-8822-0f4a8c61d18f",
    "cc0ea7ef-a043-4c2a-9826-23ae600d922d",
    "2d9ce957-98fd-432d-990e-9092c5089156",
    "736ac78c-8632-4145-abea-a61fd03cb1c2",
    "631d0e7f-c540-4840-826f-e7e06222eafd",
    "0875827c-01fc-4083-9d1a-cc475f3bcc86"
];

insertProgramInDevelopingManagementLabel(programIds);
insertProgramInCaptiveBreedingLabel(programIds);

function insertProgramInDevelopingManagementLabel(programIds) {
    if (!Array.isArray(programIds)) {
        print("Expected an array of program IDs.");
        return;
    }

    const updateFields = {};

    programIds.forEach(function(programId) {
        updateFields[`programLabels.${programId}`] = {
            label: 'Developing Management Plans'
        };
    });

    const result = db.service.updateOne(
        { _id: ObjectId('6409c3dda2714114a5b53c7f') },
        { $set: updateFields }
    );
    printjson(result);

    print("Program Labels Added:");
    printjson(programIds);
}

function insertProgramInCaptiveBreedingLabel(programIds) {
    if (!Array.isArray(programIds)) {
        print("Expected an array of program IDs.");
        return;
    }

    const updateFields = {};

    programIds.forEach(function(programId) {
        updateFields[`programLabels.${programId}`] = {
            label: 'Captive breeding, translocation or re-introduction programs'
        };
    });

    const result = db.service.updateOne(
        { _id: ObjectId('6409c3dda2714114a5b53c83') },
        { $set: updateFields }
    );
    printjson(result);

    print("Program Labels Added:");
    printjson(programIds);
}
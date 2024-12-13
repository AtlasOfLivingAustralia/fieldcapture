
function addService (newServiceName, legacyId,  serviceFormName, sectionName, outputs, userId) {
    var eventType;
    legacyId = NumberInt(legacyId);
    if (!outputs) {
        outputs = [
            {
                formName: serviceFormName,
                sectionName: sectionName
            }
        ];
    }

    if (!db.service.findOne({legacyId:legacyId})) {
        let newService = {
            "outputs": outputs,
            "name": newServiceName,
            "legacyId": legacyId,
            serviceId: UUID.generate(),
            dateCreated:ISODate(),
            lastUpdated:ISODate()
        }
        db.service.insertOne(newService);
        eventType = "Insert"
    } else {
        db.service.updateOne(
            {legacyId: legacyId},
            {$set: {name: newServiceName, outputs:outputs, lastUpdated:ISODate()}}
        );
        eventType = "Update"
    }

    let service = db.service.findOne({legacyId:legacyId});
    audit(service, service.serviceId, 'au.org.ala.ecodata.Service', userId, undefined, eventType);

    return legacyId;
}

function addServiceOutput(legacyId, formName, sectionName, userId) {
    let service = db.service.findOne({legacyId:legacyId});
    let outputs = service.outputs;
    let output = {
        formName: formName,
        sectionName: sectionName
    };
    outputs.push(output);
    db.service.updateOne(
        {legacyId: legacyId},
        {$set: {outputs:outputs, lastUpdated:ISODate()}}
    );
    audit(service, service.serviceId, 'au.org.ala.ecodata.Service', userId, undefined, 'Update');
}
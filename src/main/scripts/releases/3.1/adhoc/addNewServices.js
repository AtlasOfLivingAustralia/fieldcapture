load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
var userId = '';

const serviceFormName = "NHT Output Report";

function addService(newServiceName, legacyId, sectionName) {
    let outputs = [
        {
            formName:serviceFormName,
            sectionName:sectionName
        }
    ];
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
    } else {
        db.service.updateOne(
            {legacyId: legacyId},
            {$set: {name: newServiceName, outputs:outputs, lastUpdated:ISODate()}});
    }

    let service = db.service.findOne({legacyId:legacyId});
    if (!service.outputs) {
        service.outputs = [{
            formName: serviceFormName,
            sectionName: sectionName
        }]
    }
}

addService("Sustainable Agriculture Facilitators", NumberInt(43), "NHT - Sustainable agriculture facilitators");
addService("First Nations Australians Cultural Practices", NumberInt(44), "NHT - First nations australians cultural practices");

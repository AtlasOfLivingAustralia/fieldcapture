load('../../utils/uuid.js');
load('../../utils/audit.js');
load('../../utils/program.js');
load("../../utils/addService.js")

const adminUserId = "system";

const formName = "NHT Output Report"
var serviceName = "Project Support Communications"
var sectionName = "NHT - Communications"

addService(serviceName, NumberInt(52), formName, sectionName, undefined, adminUserId)

serviceName = "Project Support Community Engagement"
sectionName = "NHT - Project Engagements"

addService(serviceName, NumberInt(53), formName, sectionName, undefined, adminUserId)

serviceName = "Project Coordination and MERI"
sectionName = "NHT - Coordinate"

addService(serviceName, NumberInt(54), formName, sectionName, undefined, adminUserId)

serviceName = 'Work Health and Safety'
sectionName =  "NHT - Project WHS"

addService(serviceName, NumberInt(55), formName, sectionName, undefined, adminUserId)

serviceName = "Project Commencement";
sectionName = "NHT - Project Commencement"

addService(serviceName, NumberInt(56), formName, sectionName, undefined, adminUserId)


let programs = db.program.find({'config.programServiceConfig.serviceFormName':formName, status:{$ne:'deleted'}});


while (programs.hasNext()) {
    var program = programs.next();


    let serviceIds = [NumberInt(52), NumberInt(53), NumberInt(54), NumberInt(55),NumberInt(56)];
    serviceIds.forEach(function (serviceId) {
        updateProgramServiceConfig(program, serviceId, [], true);
    });

    db.program.updateOne({programId: program.programId}, {$set: {config: program.config}});
    audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, "Update");
    print("Updated "+ program.name);
}

let firstNationsPSO = db.service.findOne({legacyId:50});
firstNationsPSO.outputs[0].formName = formName;
db.service.replaceOne({legacyId:50}, firstNationsPSO);
audit(firstNationsPSO, firstNationsPSO.serviceId, 'au.org.ala.ecodata.Service', adminUserId, undefined, "Update");

let firstNationsProgram = db.program.findOne({name: "First Nations Delivery Partner"});
firstNationsProgram.config.programServiceConfig.serviceFormName = formName;

db.program.updateOne({programId: firstNationsProgram.programId}, {$set: {config: firstNationsProgram.config}});
audit(firstNationsProgram, firstNationsProgram.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, "Update");
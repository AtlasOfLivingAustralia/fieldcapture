let serviceIds = [NumberInt(52), NumberInt(53), NumberInt(54), NumberInt(55),NumberInt(56)];
serviceIds.forEach(function (serviceId) {
    let service = db.service.findOne({legacyId: serviceId});
    service.outputs = [];
    db.service.replaceOne({legacyId: serviceId}, service);

});
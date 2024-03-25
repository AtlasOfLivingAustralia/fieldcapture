let id2 = ObjectId('65f137f7d687b746afe0a7f6');
let id1 = ObjectId('65e984f3d687b746afe07f91');

let auditMessage2 = db.auditMessage.findOne({_id:id2});
let auditMessage1 = db.auditMessage.findOne({_id:id1});

printjson(auditMessage1);
printjson(auditMessage2);
const projectId='cfeb6552-abf6-4fc2-9fe1-d62f76c8579f';
let activities = db.activity.find({projectId:projectId, 'externalIds.idType':/MONITOR/});
while (activities.hasNext()) {
    let activityId = activities.next().activityId;
    db.output.updateMany({activityId:activityId}, {$set:{status:'deleted', note:'Temporarily deleted'}});
}

// let activities = db.activity.find({projectId:projectId, 'externalIds.idType':/MONITOR/});
// while (activities.hasNext()) {
//     let activityId = activities.next().activityId;
//     print("Un-deleting outputs for activity "+activityId);
//     db.output.updateMany({activityId:activityId, note:'Temporarily deleted'}, {$set:{status:'active'}, $unset:{note:true}});
// }
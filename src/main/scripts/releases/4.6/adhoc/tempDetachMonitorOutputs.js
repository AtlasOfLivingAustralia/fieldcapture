// Mallee Bird Community of the Murray Darling Depression Bioregion - Protecting mallee habitat for the birds.
// const projectId='cfeb6552-abf6-4fc2-9fe1-d62f76c8579f';
// Threatened Mallee Birds: Restoring landscape-scale connectivity to strengthen resilience
const projectId='c9c9d206-9a9d-41bb-b984-7f692d4474ac';
let activities = db.activity.find({projectId:projectId, 'externalIds.idType':/MONITOR/});
var counter = 0;
while (activities.hasNext()) {
    let activityId = activities.next().activityId;
    db.output.updateMany({activityId:activityId}, {$set:{status:'deleted', note:'Temporarily deleted'}});
    counter++;
}
print("Deleted outputs for "+counter+" activities with MONITOR externalIds in project "+projectId);
// let activities = db.activity.find({projectId:projectId, 'externalIds.idType':/MONITOR/});
// while (activities.hasNext()) {
//     let activityId = activities.next().activityId;
//     print("Un-deleting outputs for activity "+activityId);
//     db.output.updateMany({activityId:activityId, note:'Temporarily deleted'}, {$set:{status:'active'}, $unset:{note:true}});
// }
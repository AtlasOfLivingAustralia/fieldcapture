
var adminUserId = '1493';
var type = 'au.org.ala.ecodata.Output';
var lastUpdated = ISODate();
var count = 0
function audit(entity, entityId, projectId) {
    var auditMessage = {
        date: lastUpdated,
        entity: entity,
        eventType: 'Update',
        entityType: type,
        entityId: entityId,
        userId: adminUserId,
        projectId: entity.projectId
    };
    db.auditMessage.insert(auditMessage);
}

var outputs = db.output.find({name:'RLP Short-term outcomes', 'data.projectOutcomes.investmentPriorities.investmentPriorities':{$exists:true}});

while (outputs.hasNext()) {
    var output = outputs.next();
    var modified = false;

    for (var i=0; i<output.data.projectOutcomes.length; i++) {

        var outcome = output.data.projectOutcomes[i];
        if (outcome.investmentPriorities) {
            for (var j=0; j<outcome.investmentPriorities.length; j++) {
                // investmentPriority changed from text to stringList and renamed to investmentPriorities

                var priority = outcome.investmentPriorities[j];
                if (priority.investmentPriorities) {
                    priority.investmentPriorities2 = priority.investmentPriorities;
                    delete priority.investmentPriorities;
                    modified = true;
                }
            }
        }
    }

    if (modified) {
        var activity = db.activity.findOne({activityId:output.activityId});
        db.output.save(output);
        audit(output, output, activity.projectId);
        print("Updating short term outcomes for project: https://fieldcapture.ala.org.au/project/index/"+activity.projectId);
        count++
    }
}
print("Updated "+count+" outputs")



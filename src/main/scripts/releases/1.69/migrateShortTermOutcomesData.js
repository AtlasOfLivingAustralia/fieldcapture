
var adminUserId = '1493';
var type = 'au.org.ala.ecodata.Output';
var lastUpdated = ISODate();

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

var outputs = db.output.find({name:'RLP Short-term outcomes', data:{$exists:true}});

while (outputs.hasNext()) {
    var output = outputs.next();
    var modified = false;
    if (output.data.projectOutcomes) {
        for (var i=0; i<output.data.projectOutcomes.length; i++) {
            var outcome = output.data.projectOutcomes[i];
            if (outcome.investmentPriorities) {
                for (var j=0; j<outcome.investmentPriorities.length; j++) {
                    // investmentPriority changed from text to stringList and renamed to investmentPriorities
                    var priority = outcome.investmentPriorities[j];
                    if (priority.investmentPriority) {
                        priority.investmentPriorities = [priority.investmentPriority];
                        modified = true;
                    }
                    if (priority.hasOwnProperty('investmentPriority')) {
                       delete priority.investmentPriority;
                    }

                    // outcomeIndicator changed from text to stringlist and renamed to outcomeIndicators
                    if (priority.outcomeIndicator) {
                        priority.outcomeIndicators = [priority.outcomeIndicator];
                        modified = true;
                    }
                    if (priority.hasOwnProperty('outcomeIndicator')) {
                        delete priority.outcomeIndicator;
                    }

                    // agOrEnv no longer determined via lookup table.  "Ag" -> "Agriculture", "Env" -> "Environment"
                    // otherAgOrEnv removed, populating agOrEnv if present.
                    if (priority.agOrEnv) {
                        if (priority.agOrEnv == 'Ag') {
                            priority.agOrEnv = 'Agriculture';
                            modified = true;
                        }
                        else if (priority.agOrEnv == 'Env') {
                            priority.agOrEnv = 'Environment';
                            modified = true;
                        }
                    }
                    if (priority.otherAgOrEnv) {
                        if (priority.otherAgOrEnv == 'Environment' || priority.otherAgOrEnv == 'Agriculture') {
                            priority.agOrEnv = priority.otherAgOrEnv;
                            modified = true;
                        }
                        else {
                            print("otherAgOrEnv is weird: "+priority.otherAgOrEnv);
                        }

                    }
                    delete priority.agOrEnvByOutcome;
                }
            }
        }
    }
    if (modified) {
        var activity = db.activity.findOne({activityId:output.activityId});
        db.output.save(output);
        audit(output, output, activity.projectId);
        print("Updating short term outcomes for project: https://fieldcapture.ala.org.au/project/index/"+activity.projectId);
    }
}




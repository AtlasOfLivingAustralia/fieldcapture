load('../../../utils/audit.js');
let adminUserId = '<tba>';
let commsMaterials = db.output.find({name:'NHT - Communication materials', status:{$ne:'deleted'}});
while (commsMaterials.hasNext()) {
    let commsMaterial = commsMaterials.next();
    let activity = db.activity.findOne({activityId:commsMaterial.activityId});

    if (commsMaterial.data && commsMaterial.data.communicationMaterials) {
        if (activity.type == 'NHT Output Report' && activity.formVersion == 1) {
            print("Not updating v1 of the NHT Output Report for project "+activity.projectId+", "+activity.description);
            continue;
        }
        else {
            print("Updating "+activity.type+" v"+activity.formVersion+" for project "+activity.projectId+", "+activity.description);
        }
        printjson(commsMaterial.data);

        let toMove = {
            communicationMaterials: commsMaterial.data.communicationMaterials,
            relatedOutcomes: commsMaterial.data.relatedOutcomes,
            investmentPriorities2: commsMaterial.data.investmentPriorities2,
            otherInvestmentPriority: commsMaterial.data.otherInvestmentPriority,
            invoicingThisActivity: commsMaterial.data.invoicingThisActivity,
        }


        delete commsMaterial.data.communicationMaterials;
        delete commsMaterial.data.relatedOutcomes;
        delete commsMaterial.data.investmentPriorities2;
        delete commsMaterial.data.otherInvestmentPriority;
        delete commsMaterial.data.invoicingThisActivity;

        commsMaterial.data.communicationMaterialsByOutcome = [toMove];

        db.output.replaceOne({_id:commsMaterial._id}, commsMaterial);
        audit(commsMaterial, commsMaterial.outputId, 'au.org.ala.ecodata.Output', adminUserId);
        printjson(commsMaterial.data);
    }

    let communityEngagement = db.output.find({name:'NHT - Community engagement', status:{$ne:'deleted'}});
    while (communityEngagement.hasNext()) {
        let commEngagement = communityEngagement.next();
        let activity = db.activity.findOne({activityId: commEngagement.activityId});

        if (commEngagement.data && commEngagement.data.events) {
            if (activity.type == 'NHT Output Report' && activity.formVersion == 1) {
                print("Not updating v1 of the NHT Output Report for project "+activity.projectId+", "+activity.description);
                continue;
            }
            else {
                print("Updating "+activity.type+" v"+activity.formVersion+" for project "+activity.projectId+", "+activity.description);
            }
            printjson(commEngagement.data);

            let toMove = {
                events: commEngagement.data.events,
                relatedOutcomes: commEngagement.data.relatedOutcomes,
                investmentPriorities2: commEngagement.data.investmentPriorities2,
                otherInvestmentPriority: commEngagement.data.otherInvestmentPriority,
                invoicingThisActivity: commEngagement.data.invoicingThisActivity,
            }


            delete commEngagement.data.communicationMaterials;
            delete commEngagement.data.relatedOutcomes;
            delete commEngagement.data.investmentPriorities2;
            delete commEngagement.data.otherInvestmentPriority;
            delete commEngagement.data.invoicingThisActivity;

            commEngagement.data.communityEngagementByOutcome = [toMove];

            db.output.replaceOne({_id:commEngagement._id}, commEngagement);
            audit(commEngagement, commEngagement.outputId, 'au.org.ala.ecodata.Output', adminUserId);
            printjson(commEngagement.data);
        }
    }
}
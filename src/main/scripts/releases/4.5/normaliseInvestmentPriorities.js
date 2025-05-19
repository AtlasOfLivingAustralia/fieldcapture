load('../../utils/audit.js');
load('../../utils/uuid.js');


let programs = db.program.find({status:{$ne:'deleted'}});
while (programs.hasNext()) {
    let program = programs.next();
    if (program.priorities && program.priorities.length > 0) {
        for (let j=0; j<program.priorities.length; j++) {
            let programPriority = program.priorities[j];
            addInvestmentPriority(programPriority);
        }
    }
}

let mus = db.managementUnit.find({status:{$ne:'deleted'}});
while (mus.hasNext()) {
    let mu = mus.next();
    if (mu.priorities && mu.priorities.length > 0) {
        for (let j=0; j<mu.priorities.length; j++) {
            let muPriority = mu.priorities[j];
            addInvestmentPriority(muPriority, mu);
        }
    }
}


function addInvestmentPriority(priority, managementUnit) {

    let investementPriority = null;
    let changed = false;
    let existingPriority = db.investmentPriority.findOne({name:priority.priority});
    if (existingPriority) {
        if (existingPriority.categories.indexOf(priority.category) < 0) {
            existingPriority.categories.push(priority.category);
            changed = true;
        }
        if (managementUnit && (existingPriority.managementUnits.indexOf(managementUnit.managementUnitId) < 0)) {
            existingPriority.managementUnits.push(managementUnit.managementUnitId);
            changed = true;
        }
        if (changed) {
            db.investmentPriority.replaceOne({investmentPriorityId: existingPriority.investmentPriorityId}, existingPriority);
        }

        investmentPriority = existingPriority;
    }
    else {
        investmentPriority = {
            dateCreated: ISODate(),
            lastUpdated: ISODate(),
            investmentPriorityId: UUID.generate(),
            status:'active',
            name:priority.priority,
            categories: [priority.category],
            managementUnits: [],
        }
        if (managementUnit) {
            investmentPriority.managementUnits.push(managementUnit.managementUnitId);
        }
        db.investmentPriority.insertOne(investmentPriority);
    }
    return investmentPriority;
}

const projects = db.project.find({'custom.details.outcomes':{$exists:true}, status:{$ne:'deleted'}});
while (projects.hasNext()) {
    let project = projects.next();

    replaceInvestmentPrioritiesWithIds(project);

}



function replaceInvestmentPrioritiesWithIds(project) {
    let investmentPriorities = [];
    /*let objectives = project.custom.details.objectives && project.custom.details.objectives.rows1;
    if (objectives) {
        for (let i = 0; i < objectives.length; i++) {
            let objective = objectives[i];
            if (objective.assets) {
                let assetIds = [];
                for (let j = 0; j < objective.assets.length; j++) {
                    let asset = objective.assets[j];
                    if (asset) {

                        let investmentPriority = db.investmentPriority.findOne({name:asset});
                        if (!investmentPriority) {
                            print("No investment priority found for " + asset + " in project " + project.projectId);
                            //investmentPriority = addInvestmentPriority(priority);
                        }
                        else {
                            assetIds.push(investmentPriority.investmentPriorityId);
                        }
                    }

                }
            }
        }
    }

    let assets = project.custom.details.assets;
    if (assets) {
        for (let i = 0; i < assets.length; i++) {
            let assetDescription = assets[i];
            if (assetDescription.description) {
                investmentPriorities.push(assetDescription.description);
            }
        }
    }*/

    let outcomes = project.custom.details.outcomes;

    if (outcomes) {
        let error = false;
        let changed = false;
        if (outcomes.primaryOutcome && outcomes.primaryOutcome.assets) {
            investmentPriorities = investmentPriorities.concat(outcomes.primaryOutcome.assets);
            let assetIds = [];
            for (let j = 0; j < outcomes.primaryOutcome.assets.length; j++) {
                let asset = outcomes.primaryOutcome.assets[j];
                if (asset) {
                    let investmentPriority = db.investmentPriority.findOne({name:asset});
                    if (!investmentPriority) {
                        print("No investment priority found for " + asset + " in project " + project.projectId);
                        //investmentPriority = addInvestmentPriority(priority);
                        error = true;
                    }
                    else {
                        assetIds.push(investmentPriority.investmentPriorityId);
                        changed = true;
                    }
                }
            }
            if (!error) {
                outcomes.primaryOutcome.assets = assetIds;
            }
        }
        if (outcomes.secondaryOutcomes) {
            for (let i = 0; i < outcomes.secondaryOutcomes.length; i++) {
                let outcome = outcomes.secondaryOutcomes[i];
                if (outcome.assets) {
                    let assetIds = [];
                    for (let j = 0; j < outcome.assets.length; j++) {
                        let asset = outcome.assets[j];
                        if (asset) {
                            let investmentPriority = db.investmentPriority.findOne({name:asset});
                            if (!investmentPriority) {
                                print("No investment priority found for " + asset + " in project " + project.projectId);
                                //investmentPriority = addInvestmentPriority(priority);
                                error = true;
                            }
                            else {
                                assetIds.push(investmentPriority.investmentPriorityId);
                                changed = true;
                            }
                        }


                    }
                    if (!error) {
                        outcomes.secondaryOutcomes[i].assets = assetIds;
                    }

                }
            }

        }
        if (!error && changed) {
            print("Updating project " + project.projectId);
            //db.project.replaceOne({projectId: project.projectId}, project);
            //audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);
        }
        else if (error) {
            print("Error updating project " + project.projectId);
        }
    }

}
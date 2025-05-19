load('../../../utils/audit.js');
const adminUserId = "system";
const toUpdate = [['Additional koala habitat planted', 'Additional Koala habitat planted']];

for (const [oldValue, newValue] of toUpdate) {

    let projectCursor = findProjectsUsingInvestmentPriority(oldValue);
    while (projectCursor.hasNext()) {
        let project = projectCursor.next();
        updateInvestmentPriority(project, oldValue, newValue);

        print("Updating project " + project.projectId + " with investment priority " + oldValue + " to " + newValue);
        project.lastUpdated = ISODate();
        db.project.replaceOne({_id: project._id}, project);
        audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);
    }

    let muCursor = findMUsUsingInvestmentPriority(oldValue);
    while (muCursor.hasNext()) {
        let mu = muCursor.next();
        for (let i=0; i<mu.priorities.length; i++) {
            if (mu.priorities[i].priority == oldValue) {
                mu.priorities[i].priority = newValue;
            }
        }
        print("Updating managementUnit "+mu.name+" with investment priority " + oldValue + " to " + newValue);
        db.managementUnit.replaceOne({_id: mu._id}, mu);
        audit(mu, mu.managementUnitId, 'au.org.ala.ecodata.ManagementUnit', adminUserId);
    }

    let programCursor = findProgramsUsingInvestmentPriority(oldValue);
    while (programCursor.hasNext()) {
        let program = programCursor.next();
        for (let i=0; i<program.priorities.length; i++) {
            if (program.priorities[i].priority == oldValue) {
                program.priorities[i].priority = newValue;
            }
        }
        print("Updating program "+program.name+" with investment priority " + oldValue + " to " + newValue);
        db.program.replaceOne({_id: program._id}, program);
        audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId);
    }


}

function findMUsUsingInvestmentPriority(investmentPriority) {
    return db.managementUnit.find({'priorities.priority':investmentPriority});
}

function findProgramsUsingInvestmentPriority(investmentPriority) {
    return db.program.find({'priorities.priority':investmentPriority});
}


function findProjectsUsingInvestmentPriority(investmentPriority) {

    const primaryInvestmentPriorityPath = 'custom.details.outcomes.primaryOutcome.assets';
    const secondaryInvestmentPriorityPath = 'custom.details.outcomes.secondaryOutcomes.assets';
    const objectivesInvestmentPriorityPath = 'custom.details.objectives.rows1.assets';
    const assetsInvestmentPriorityPath = 'custom.details.assets.description';

    const query = {
        $or: [
            { [primaryInvestmentPriorityPath]: investmentPriority },
            { [secondaryInvestmentPriorityPath]: investmentPriority },
            { [objectivesInvestmentPriorityPath]: investmentPriority },
            { [assetsInvestmentPriorityPath]: investmentPriority }
        ]
    };
    return db.project.find(query);
}


function updateInvestmentPriority(project, oldValue, newValue) {

    let outcomes = project.custom.details.outcomes;
    if (outcomes) {
        if (outcomes.primaryOutcome && outcomes.primaryOutcome.assets) {
            for (let i = 0; i < outcomes.primaryOutcome.assets.length; i++) {
                if (outcomes.primaryOutcome.assets[i] === oldValue) {
                    outcomes.primaryOutcome.assets[i] = newValue;
                }
            }
        }
        if (outcomes.secondaryOutcomes) {
            for (let i = 0; i < outcomes.secondaryOutcomes.length; i++) {
                let outcome = outcomes.secondaryOutcomes[i];
                if (outcome.assets) {
                    for (let j = 0; j < outcome.assets.length; j++) {
                        if (outcome.assets[j] === oldValue) {
                            outcome.assets[j] = newValue;
                        }
                    }
                }
            }
        }
    }

    if (project.custom.details.objectives && project.custom.details.objectives.rows1) {
        for (let i=0; i < project.custom.details.objectives.rows1.length; i++) {
            let objective = project.custom.details.objectives.rows1[i];
            if (objective.assets) {
                for (let j=0; j < objective.assets.length; j++) {
                    if (objective.assets[j] === oldValue) {
                        objective.assets[j] = newValue;
                    }
                }
            }
        }
    }


    if (project.custom.details.assets) {
       for (let i=0; i < project.custom.details.assets.length; i++) {
            let asset = project.custom.details.assets[i];
            if (asset.description === oldValue) {
                asset.description = newValue;
            }
       }
    }

    return project;
}
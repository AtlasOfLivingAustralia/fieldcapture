let projects = db.project.find({isMERIT:true, 'custom.details':{$exists:true}, status:{$ne:'deleted'}});

// Investment priorities can be found at:
// 1. custom.details.objectives.rows1.assets
// 2. custom.details.assets.description
// 3. custom.details.outcomes.*.assets

let allInvestmentPriorities = {};

while (projects.hasNext()) {
    let project = projects.next();

    addInvestmentPriorities(project, getInvestmentPriorities(project));

}

// Sort the investment priorities by the property name
let investmentPriorityNames = Object.keys(allInvestmentPriorities);
investmentPriorityNames.sort();

const maxPrograms = 30;
const maxManagementUnits = 10;
for (var i=0; i<investmentPriorityNames.length; i++) {
    let investmentPriority = investmentPriorityNames[i];
    let investmentPriorityObj = allInvestmentPriorities[investmentPriority];

    let line = "\""+investmentPriority+"\"";
    line += ', '+investmentPriorityObj.projects.length+", ";

    for (let i=0; i<maxPrograms; i++) {
        if (i < investmentPriorityObj.programs.length) {
            let program = investmentPriorityObj.programs[i];
            line += program.programId + ", " + program.name + ", " + program.category + ", ";
        }
    }
    for (let i=0; i<maxManagementUnits; i++) {
        if (i < investmentPriorityObj.managementUnits.length) {
            let mu = investmentPriorityObj.managementUnits[i];
            line += mu.managementUnitId + ", " + mu.category + ", ";
        }
    }
    print(line)
}


function addInvestmentPriorities(project, investmentPriorities) {
    for (let i=0; i<investmentPriorities.length; i++) {
        let investmentPriority = investmentPriorities[i];
        if (!allInvestmentPriorities[investmentPriority]) {
            allInvestmentPriorities[investmentPriority] = {projects: [], programs: [], managementUnits: []};
        }

        allInvestmentPriorities[investmentPriority].projects.push(project.projectId);
        let program = db.program.findOne({programId: project.programId});
        let category = '';
        if (!program) {
            print("No program found with id "+project.programId+ " for project "+project.projectId);
            continue;
        }
        if (program.priorities && program.priorities.length > 0) {
            for (let j=0; j<program.priorities.length; j++) {
                let programPriority = program.priorities[j];
                if (programPriority.priority == investmentPriority) {
                    category = programPriority.category;
                    break;
                }
            }
        }
        if (allInvestmentPriorities[investmentPriority].programs.indexOf(project.programId) < 0) {
            allInvestmentPriorities[investmentPriority].programs.push({programId:project.programId, name:program.name, category:category});
        }

        let mu = db.managementUnit.findOne({managementUnitId: project.managementUnitId});
        category = '';
        if (mu && mu.priorities && mu.priorities.length > 0) {
            for (let j=0; j<mu.priorities.length; j++) {
                let programPriority = mu.priorities[j];
                if (programPriority.priority == investmentPriority) {
                    category = programPriority.category;
                    break;
                }
            }
        }

        if (project.managementUnitId && !allInvestmentPriorities[investmentPriority].managementUnits.indexOf(project.managementUnitId) < 0) {
            allInvestmentPriorities[investmentPriority].managementUnits.push({managementUnitId:project.managementUnitId, category:category});
        }
    }
}

function getInvestmentPriorities(project) {
    let investmentPriorities = [];
    let objectives = project.custom.details.objectives && project.custom.details.objectives.rows1;
    if (objectives) {
        for (let i = 0; i < objectives.length; i++) {
            let objective = objectives[i];
            if (objective.assets) {
                for (let j = 0; j < objective.assets.length; j++) {
                    let asset = objective.assets[j];
                    if (asset) {
                        investmentPriorities.push(asset);
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
    }

    let outcomes = project.custom.details.outcomes;

    if (outcomes) {
        if (outcomes.primaryOutcome && outcomes.primaryOutcome.assets) {
            investmentPriorities = investmentPriorities.concat(outcomes.primaryOutcome.assets);
            for (let j = 0; j < outcomes.primaryOutcome.assets.length; j++) {
                let asset = outcomes.primaryOutcome.assets[j];
                if (asset) {
                    investmentPriorities.push(asset);
                }

            }
        }
        if (outcomes.secondaryOutcomes) {
            for (let i = 0; i < outcomes.secondaryOutcomes.length; i++) {
                let outcome = outcomes.secondaryOutcomes[i];
                if (outcome.assets) {
                    for (let j = 0; j < outcome.assets.length; j++) {
                        let asset = outcome.assets[j];
                        if (asset) {
                            investmentPriorities.push(asset);
                        }

                    }

                }
            }
        }
    }

    return investmentPriorities;
}
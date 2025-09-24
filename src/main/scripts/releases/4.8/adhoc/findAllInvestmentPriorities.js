let projects = db.project.find({isMERIT:true, 'custom.details':{$exists:true}, status:{$ne:'deleted'}});

// Investment priorities can be found at:
// 1. custom.details.objectives.rows1.assets
// 2. custom.details.assets.description
// 3. custom.details.outcomes.*.assets

let projectInvestmentPriorities = {};

while (projects.hasNext()) {
    let project = projects.next();

    addInvestmentPriorities(project, getInvestmentPriorities(project));

}

// Sort the investment priorities by the property name
let investmentPriorityNames = Object.keys(projectInvestmentPriorities);
investmentPriorityNames.sort();

const maxPrograms = 33;
const maxManagementUnits = 53;

let headerRow = "Investment Priority, Number of Projects";
for (let i=0; i<maxPrograms; i++) {
    headerRow += ", Program Id "+i+", Program Name "+i+", Program Category "+i;
}
for (let i=0; i<maxManagementUnits; i++) {
    headerRow += ", Management Unit Id "+i+", Management Unit Name "+i+", Management Unit Category "+i;
}
print(headerRow);


for (var i=0; i<investmentPriorityNames.length; i++) {
    let investmentPriority = investmentPriorityNames[i];
    let investmentPriorityObj = projectInvestmentPriorities[investmentPriority];

    let line = "\""+investmentPriority+"\"";
    line += ', '+investmentPriorityObj.projects.length+", ";

    for (let i=0; i<maxPrograms; i++) {
        if (i < investmentPriorityObj.programs.length) {
            let program = investmentPriorityObj.programs[i];
            line += program.programId + ", " + program.name + ", " + program.category + ", ";
        }
        else {
            line += ", , , ";
        }
    }
    for (let i=0; i<maxManagementUnits; i++) {
        if (i < investmentPriorityObj.managementUnits.length) {
            let mu = investmentPriorityObj.managementUnits[i];
            line += mu.managementUnitId + ", " + mu.name + ", " + mu.category + ", ";
        }
        else {
            line += ", , , ";
        }
    }
    print(line)
}


function addInvestmentPriorities(project, investmentPriorities) {
    for (let i=0; i<investmentPriorities.length; i++) {
        let investmentPriority = investmentPriorities[i];
        if (!projectInvestmentPriorities[investmentPriority]) {
            projectInvestmentPriorities[investmentPriority] = {projects: [], programs: [], managementUnits: []};
        }

        projectInvestmentPriorities[investmentPriority].projects.push(project.projectId);
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
        let found = false;
        for (let p=0; p<projectInvestmentPriorities[investmentPriority].programs.length; p++) {
            let programObj = projectInvestmentPriorities[investmentPriority].programs[p];
            if (programObj.programId == project.programId) {
                // Already have this program
                found = true;
                break;
            }
        }
        if (!found) {
            projectInvestmentPriorities[investmentPriority].programs.push({programId:project.programId, name:program.name, category:category});
        }



        if (project.managementUnitId) {

            let mu = db.managementUnit.findOne({managementUnitId: project.managementUnitId});
            category = '';
            if (mu && mu.priorities && mu.priorities.length > 0) {
                for (let j=0; j<mu.priorities.length; j++) {
                    let muPriority = mu.priorities[j];
                    if (muPriority.priority == investmentPriority) {
                        category = muPriority.category;
                        break;
                    }
                }
            }

            found = false;
            for (let p = 0; p < projectInvestmentPriorities[investmentPriority].managementUnits.length; p++) {
                let muObj = projectInvestmentPriorities[investmentPriority].managementUnits[p];
                if (muObj.managementUnitId == project.managementUnitId) {
                    // Already have this management unit
                    found = true;
                    break;
                }
            }
            if (!found) {
                projectInvestmentPriorities[investmentPriority].managementUnits.push({
                    managementUnitId: project.managementUnitId,
                    name: mu.name,
                    category: category
                });

            }
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

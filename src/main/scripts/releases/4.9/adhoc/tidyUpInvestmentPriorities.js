load('../../../utils/audit.js');
load('./investmentPriorityMapping.js');
const adminUserId = "system";

let unmatched = 0;
let projectResults = [];
let muResults = [];
let programResults = [];


function toRegExp(value) {
    return new RegExp('^(\\s*)'+value.replaceAll('(', '\\(').replaceAll(')', '\\)').replaceAll('+', '\\+').replace(/\s+/g, '\\s+')+'(\\s*)$');
}
for (const [oldValue, newValue] of mapping) {

    if (!newValue || newValue == 'N/A') {
        continue;
    }
    let projectCursor = findProjectsUsingInvestmentPriority(oldValue);
    let oldValueToMatch = oldValue;
    if (!projectCursor.hasNext()) {
        oldValueToMatch = toRegExp(oldValue);
        projectCursor = findProjectsUsingInvestmentPriority(oldValueToMatch);
        if (!projectCursor.hasNext()) {
            unmatched++;
            print("No projects found using investment priority " + oldValue);
        }
    }


    while (projectCursor.hasNext()) {
        let project = projectCursor.next();
        updateInvestmentPriority(project, oldValueToMatch, newValue);

        projectResults.push({projectId:project.projectId, oldValue:oldValue , newValue:newValue, changed:matches(oldValueToMatch, newValue)});
        project.lastUpdated = ISODate();
        db.project.replaceOne({_id: project._id}, project);
        audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);
    }

    let muCursor = findMUsUsingInvestmentPriority(oldValueToMatch);
    while (muCursor.hasNext()) {
        let mu = muCursor.next();
        for (let i=0; i<mu.priorities.length; i++) {
            if (matches(mu.priorities[i].priority, oldValueToMatch)){
                mu.priorities[i].priority = newValue;
            }
        }
        muResults.push({managementUnitId:mu.managementUnitId, oldValue:oldValue , newValue:newValue});
        db.managementUnit.replaceOne({_id: mu._id}, mu);
        audit(mu, mu.managementUnitId, 'au.org.ala.ecodata.ManagementUnit', adminUserId);
    }

    let programCursor = findProgramsUsingInvestmentPriority(oldValueToMatch);
    while (programCursor.hasNext()) {
        let program = programCursor.next();
        for (let i=0; i<program.priorities.length; i++) {
            if (matches(program.priorities[i].priority, oldValueToMatch)) {
                program.priorities[i].priority = newValue;
            }
        }
        programResults.push({programId:program.programId, oldValue:oldValue , newValue:newValue});
        db.program.replaceOne({_id: program._id}, program);
        audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId);
    }
}
print(unmatched)

// Now find all unmatched investment priorities
const projects = db.project.find({$or:[{'custom.details.outcomes': {$exists: true}, 'custom.details.assets':{$exists:true}}], status: {$ne: 'deleted'}});

while (projects.hasNext()) {
    let project = projects.next();

    let investmentPriorities = getInvestmentPriorities(project);

    for (let i=0; i<investmentPriorities.length; i++) {
        let ip = investmentPriorities[i];
        if (!mapping.find(([oldValue, newValue]) => matches(toRegExp(ip), oldValue) || matches(ip, newValue))) {
            projectResults.push({projectId:project.projectId, oldValue:ip , newValue:ip, changed:'No mapping found'});
        }
    }
}

for (let i=0; i<projectResults.length; i++) {
    let result = projectResults[i];
    // Print the result in CSV format
    print(`Project,${result.projectId},"${result.oldValue}","${result.newValue}",${result.changed ? '' : 'Updated'}`);
}


function getInvestmentPriorities(project) {
    let investmentPriorities = [];

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
            for (let j = 0; j < outcomes.primaryOutcome.assets.length; j++) {
                investmentPriorities.push(outcomes.primaryOutcome.assets[j]);
            }
        }
        const outcomeTypes = ["secondaryOutcomes", "shortTermOutcomes", "midTermOutcomes"];
        for (let k = 0; k < outcomeTypes.length; k++) {

            if (outcomes[outcomeTypes[k]]) {
                for (let i = 0; i < outcomes[outcomeTypes[k]].length; i++) {
                    let outcome = outcomes[outcomeTypes[k]][i];
                    if (outcome.assets) {
                        for (let j = 0; j < outcome.assets.length; j++) {
                            investmentPriorities.push(outcome.assets[j]);
                        }
                    }
                }

            }
        }
    }

    return investmentPriorities;
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
function matches(value, pattern) {
    if (pattern instanceof RegExp) {
        return pattern.test(value);
    } else {
        return value === pattern;
    }
}

function updateInvestmentPriority(project, oldValue, newValue) {

    let outcomes = project.custom.details.outcomes;
    if (outcomes) {
        if (outcomes.primaryOutcome && outcomes.primaryOutcome.assets) {
            for (let i = 0; i < outcomes.primaryOutcome.assets.length; i++) {
                if (matches(outcomes.primaryOutcome.assets[i], oldValue)) {
                    outcomes.primaryOutcome.assets[i] = newValue;
                }
            }
        }

        const outcomeTypes = ["secondaryOutcomes", "shortTermOutcomes", "midTermOutcomes"];
        for (let k = 0; k < outcomeTypes.length; k++) {
            if (outcomes[outcomeTypes[k]]) {
                for (let i = 0; i < outcomes[outcomeTypes[k]].length; i++) {
                    let outcome = outcomes[outcomeTypes[k]][i];
                    if (outcome.assets) {
                        for (let j = 0; j < outcome.assets.length; j++) {
                            if (matches(outcome.assets[j], oldValue)) {
                                outcome.assets[j] = newValue;
                            }
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
                    if (matches(objective.assets[j], oldValue)) {
                        objective.assets[j] = newValue;
                    }
                }
            }
        }
    }


    if (project.custom.details.assets) {
       for (let i=0; i < project.custom.details.assets.length; i++) {
            let asset = project.custom.details.assets[i];
            if (matches(asset.description, oldValue)) {
                asset.description = newValue;
            }
       }
    }

    return project;
}
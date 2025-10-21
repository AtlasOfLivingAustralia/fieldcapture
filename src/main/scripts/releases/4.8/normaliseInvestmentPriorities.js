load('../../utils/audit.js');
load('../../utils/uuid.js');
load('./findInvestmentPrioritiesInForms.js');

const adminUserId = "system";

let results = [];
let errors = [];

const typesForCategory = {
    "Additional Priority Natural Asset": "Other",
    "Additional Priority Plants": "Species",
    "Additional Priority Species": "Species",
    "Agriculture Sector": "Agricultural Practices",
    "Agriculture Sector Adopting Practices": "Agricultural Practices",
    "Birds": "Species",
    "Bush Blitz Priority": "Other",
    "Bushfires": "Other",
    "Drive agricultural growth": "Agricultural Practices",
    "Ecological Communities": "Ecological Community",
    "Ecological Health": "Other",
    "Farmer Sector": "Agricultural Practices",
    "Fish": "Species",
    "Frogs": "Species",
    "Habitat Restoration Grants Secondary": "Other",
    "Habitat Restoration Threatened Ecological Communities": "Ecological Community",
    "Habitat Restoration Threatened Species": "Species",
    "Habitat Restoration Threatened Species Primary": "Species",
    "Harness carbon and biodiversity incentives": "Agricultural Practices",
    "High Risk Species": "Species",
    "Improve the condition for all priority places": "Priority Place",
    "Invertebrate species": "Species",
    "Invertebrates": "Species",
    "Land Management": "Agricultural Practices",
    "Mammals": "Species",
    "Marine Park Networks": "Marine Park",
    "Marine Parks": "Marine Park",
    "Other natural asset": "Other",
    "Plant species": "Species",
    "Plants": "Species",
    "Plants and animals extinction prevention": "Species",
    "Primary Marine Park Networks": "Marine Park",
    "Priority Invertebrate Species": "Species",
    "Priority Natural Asset": "Other",
    "Priority Plants": "Species",
    "Priority Threatened Species Primary": "Species",
    "Priority Threatened Species Primaryy": "Species",
    "Priority Vertebrate Animals": "Species",
    "Ramsar": "Ramsar",
    "Reduce emissions and build resilience": "Agricultural Practices",
    "Reptiles": "Species",
    "Soil Quality": "Agricultural Practices",
    "Sustainable Agriculture": "Agricultural Practices",
    "Target 3": "Species",
    "Threatened Ecological Communities": "Ecological Community",
    "Threatened Ecological Community": "Ecological Community",
    "Threatened Species": "Species",
    "Threatened Species  Wild Hoses Specific": "Species",
    "Vertebrate species": "Species",
    "Waterways": "Waterway",
    "World Heritage": "World Heritage Site",
    "World Heritage Sites": "World Heritage Site"
};

let programs = db.program.find({status: {$ne: 'deleted'}});
while (programs.hasNext()) {
    let program = programs.next();
    if (program.priorities && program.priorities.length > 0) {
        for (let j = 0; j < program.priorities.length; j++) {
            let programPriority = program.priorities[j];
            addInvestmentPriority(programPriority);
        }
    }
}

let mus = db.managementUnit.find({status: {$ne: 'deleted'}});
while (mus.hasNext()) {
    let mu = mus.next();
    if (mu.priorities && mu.priorities.length > 0) {
        for (let j = 0; j < mu.priorities.length; j++) {
            let muPriority = mu.priorities[j];
            addInvestmentPriority(muPriority, mu);
        }
    }
}


function addInvestmentPriority(priority, managementUnit) {

    let investmentPriority = null;
    let changed = false;
    let existingPriority = db.investmentPriority.findOne({name: priority.priority});
    if (existingPriority) {
        if (existingPriority.categories.indexOf(priority.category) < 0) {
            existingPriority.categories.push(priority.category);
            changed = true;
        }
        if (existingPriority.type != (typesForCategory[priority.category] || 'Other')) {
            existingPriority.type = typesForCategory[priority.category] || 'Other';
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
    } else {
        investmentPriority = {
            dateCreated: ISODate(),
            lastUpdated: ISODate(),
            investmentPriorityId: UUID.generate(),
            status: 'active',
            type: typesForCategory[priority.category] || 'Other',
            name: priority.priority,
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

const projects = db.project.find({'custom.details.outcomes': {$exists: true}, status: {$ne: 'deleted'}});
const reportPathsByType = findInvestmentPrioritiesInForms();
while (projects.hasNext()) {
    let project = projects.next();

    replaceInvestmentPrioritiesWithIds(project);

    replaceInvestmentPrioritiesInReportsForProject(project, reportPathsByType);

}
const projectUrl = 'https://fieldcapture.ala.org.au/project/index/';
print("Project, MERIT Project ID, Activity ID, Activity Type, Output, Old Value, New Value, Error");
for (let i=0; i<results.length; i++) {
    print(projectUrl+results[i].projectId + ", " + results[i].meritProjectID + ", " + results[i].activityId + ", " + results[i].activityType + ", " + results[i].output + ", \"" + results[i].oldValue + "\", \"" + results[i].newValue+ "\"");
}


for (let i=0; i<errors.length; i++) {
    print(projectUrl+errors[i].projectId + ", " + errors[i].meritProjectID + ", " + errors[i].activityId + ", " + errors[i].activityType + ", " + errors[i].output + ", \"" + results[i].oldValue + "\",, " + errors[i].error);
}


function processInvestmentPriority(parentNode, path, project, activity, output) {
    let node = parentNode[path];
    if (!node) {
        return false;
    }
    let changed = false;
    if (Array.isArray(node)) {
        let newValues = [];
        for (let i = 0; i < node.length; i++) {
            if (!node[i]) {
                continue;
            }
            let ip = db.investmentPriority.findOne({name: node[i]});
            if (!ip) {
                errors.push({
                    error:"No investment priority found for " + node[i],
                    projectId: project ? project.projectId : null,
                    meritProjectID: project ? project.grantId : null,
                    activityId: output ? output.activityId : null,
                    activityType: activity.type,
                    oldValue: node[i],
                    newValue: '',
                    output: output ? output.name : null
                })

            }
            else {
                newValues.push(ip.name);
                changed = true;
            }

        }
        parentNode[path] = newValues;
    } else {
        let ip = db.investmentPriority.findOne({name: node});
        if (!ip) {
            errors.push({
                error:"No investment priority found for " + node[i],
                projectId: project ? project.projectId : null,
                meritProjectID: project ? project.grantId : null,
                activityId: output ? output.activityId : null,
                activityType: activity.type,
                output: output ? output.name : null
            })
        }
        else {
            parentNode[path] = ip.name;
            changed = true;
        }
    }
    if (changed) {
        results.push({
            projectId: project ? project.projectId : null,
            meritProjectID: project ? project.grantId : null,
            activityId: output ? output.activityId : null,
            activityType: activity.type,
            output: output ? output.name : null,
            oldValue: node,
            newValue: parentNode[path]
        });
    }
    return changed;
}

function replaceInvestmentPrioritiesInReportsForProject(project, reportPathsByType) {
    for (let i = 0; i < reportPathsByType.length; i++) {
        const activityType = reportPathsByType[i].name;
        const formVersion = reportPathsByType[i].formVersion;

        const activities = db.activity.find({
            projectId: project.projectId,
            type: activityType,
            formVersion: formVersion,
            status: {$ne: 'deleted'}
        });

        while (activities.hasNext()) {
            const activity = activities.next();

            let outputs = db.output.find({activityId: activity.activityId});

            while (outputs.hasNext()) {
                let output = outputs.next();
                let paths = reportPathsByType[i].sections[output.name];


                if (paths) {
                    for (let p = 0; p < paths.length; p++) {
                        let fullPath = paths[p];
                        let node = output.data;

                        function processNode(path, node) {
                            let currentPath = path[0];
                            if (!node[currentPath]) {
                                // No data at path
                                return;
                            }
                            if (path.length === 1) {
                                // Pass the parent node and path so it can be modified.
                                processInvestmentPriority(node, currentPath, project, activity, output);
                            } else {
                                node = node[currentPath];
                                if (Array.isArray(node)) {
                                    for (let i = 0; i < node.length; i++) {
                                        let childNode = node[i];
                                        if (childNode) {
                                            processNode(path.slice(1), childNode);
                                        }
                                    }
                                } else {
                                    processNode(path.slice(1), node);
                                }
                            }

                        }
                        processNode(fullPath, node);
                    }

                }
            }
        }
    }
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
                    let investmentPriority = db.investmentPriority.findOne({name: asset});
                    if (!investmentPriority) {
                        print("No investment priority found for " + asset + " in project " + project.projectId);
                        //investmentPriority = addInvestmentPriority(priority);
                        error = true;
                    } else {
                        assetIds.push(investmentPriority.investmentPriorityId);
                        changed = true;
                    }
                }
            }
            if (!error) {
                outcomes.primaryOutcome.assets = assetIds;
            }
        }
        const outcomeTypes = ["secondaryOutcomes", "shortTermOutcomes", "midTermOutcomes"];
        for (let k = 0; k < outcomeTypes.length; k++) {

            if (outcomes[outcomeTypes[k]]) {
                for (let i = 0; i < outcomes[outcomeTypes[k]].length; i++) {
                    let outcome = outcomes[outcomeTypes[k]][i];
                    if (outcome.assets) {
                        let assetIds = [];
                        for (let j = 0; j < outcome.assets.length; j++) {
                            let asset = outcome.assets[j];
                            if (asset) {
                                let investmentPriority = db.investmentPriority.findOne({name: asset});
                                if (!investmentPriority) {
                                    print("No investment priority found for " + asset + " in project " + project.projectId);
                                    //investmentPriority = addInvestmentPriority(priority);
                                    error = true;
                                } else {
                                    assetIds.push(investmentPriority.investmentPriorityId);
                                    changed = true;
                                }
                            }


                        }
                        if (!error) {
                            outcomes[outcomeTypes[k]][i].assets = assetIds;
                        }

                    }
                }

            }
        }

        if (!error && changed) {
            print("Updating project " + project.projectId);
            db.project.replaceOne({projectId: project.projectId}, project);
            audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);
        } else if (error) {
            print("Error updating project " + project.projectId);
        }
    }

}
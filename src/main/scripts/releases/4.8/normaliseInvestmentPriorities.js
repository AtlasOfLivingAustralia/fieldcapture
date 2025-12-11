load('../../utils/audit.js');
load('../../utils/uuid.js');
load('./findInvestmentPrioritiesInForms.js');

const adminUserId = "system";

let results = [];
let errors = [];

const typesForCategory = {
    "Additional Priority Natural Asset": "Other",
    "Additional Priority Plants": "Threatened Species",
    "Additional Priority Species": "Threatened Species",
    "Agriculture Sector": "Agricultural Practices",
    "Agriculture Sector Adopting Practices": "Agricultural Practices",
    "Birds": "Threatened Species",
    "Bush Blitz Priority": "Other",
    "Bushfires": "Other",
    "Drive agricultural growth": "Agricultural Practices",
    "Ecological Communities": "Threatened Ecological Community",
    "Ecological Health": "Other",
    "Farmer Sector": "Agricultural Practices",
    "Fish": "Threatened Species",
    "Frogs": "Threatened Species",
    "Habitat Restoration Grants Secondary": "Other",
    "Habitat Restoration Threatened Ecological Communities": "Threatened Ecological Community",
    "Habitat Restoration Threatened Species": "Threatened Species",
    "Habitat Restoration Threatened Species Primary": "Threatened Species",
    "Harness carbon and biodiversity incentives": "Agricultural Practices",
    "High Risk Species": "Threatened Species",
    "Improve the condition for all priority places": "Priority Place",
    "Invertebrate species": "Threatened Species",
    "Invertebrates": "Threatened Species",
    "Land Management": "Agricultural Practices",
    "Mammals": "Threatened Species",
    "Marine Park Networks": "Marine Park",
    "Marine Parks": "Marine Park",
    "Other natural asset": "Other",
    "Plant species": "Threatened Species",
    "Plants": "Threatened Species",
    "Plants and animals extinction prevention": "Threatened Species",
    "Primary Marine Park Networks": "Aquatic and Coastal systems including wetlands",
    "Priority Invertebrate Species": "Threatened Species",
    "Priority Natural Asset": "Other",
    "Priority Plants": "Threatened Species",
    "Priority Threatened Species Primary": "Threatened Species",
    "Priority Threatened Species Primaryy": "Threatened Species",
    "Priority Vertebrate Animals": "Threatened Species",
    "Ramsar": "Ramsar",
    "Reduce emissions and build resilience": "Agricultural Practices",
    "Reptiles": "Threatened Species",
    "Soil Quality": "Agricultural Practices",
    "Sustainable Agriculture": "Agricultural Practices",
    "Target 3": "Threatened Species",
    "Threatened Ecological Communities": "Threatened Ecological Community",
    "Threatened Ecological Community": "Threatened Ecological Community",
    "Threatened Species": "Threatened Species",
    "Threatened Species  Wild Hoses Specific": "Threatened Species",
    "Vertebrate species": "Threatened Species",
    "Waterways": "Aquatic and Coastal systems including wetlands",
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
    let priorityName = priority.priority && priority.priority.trim();
    let category = priority.category && priority.category.trim();
    let existingPriority = db.investmentPriority.findOne({name: priorityName});
    if (existingPriority) {
        if (existingPriority.categories.indexOf(category) < 0) {
            existingPriority.categories.push(category);
            changed = true;
        }
        if (existingPriority.type != (typesForCategory[category] || 'Other')) {
            existingPriority.type = typesForCategory[category] || 'Other';
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
            type: typesForCategory[category] || 'Other',
            name: priorityName.trim(),
            categories: [category],
            managementUnits: [],
        }
        if (managementUnit) {
            investmentPriority.managementUnits.push(managementUnit.managementUnitId);
        }

        db.investmentPriority.insertOne(investmentPriority);
    }
    return investmentPriority;
}

const projects = db.project.find({$or:[{'custom.details.outcomes': {$exists: true}, 'custom.details.assets':{$exists:true}}], status: {$ne: 'deleted'}});
const reportPathsByType = findInvestmentPrioritiesInForms();
while (projects.hasNext()) {
    let project = projects.next();

    replaceInvestmentPrioritiesWithIds(project);

    //replaceInvestmentPrioritiesInReportsForProject(project, reportPathsByType);

}
const projectUrl = 'https://fieldcapture.ala.org.au/project/index/';
print("Project,MERIT Project ID,Activity ID,Activity Type,Output,Old Value,New Value,Error");

for (let i=0; i<results.length; i++) {
    print(projectUrl+results[i].projectId + "," + results[i].meritProjectID + "," + results[i].activityId + "," + results[i].activityType + "," + results[i].output + ",\"" + results[i].oldValue + "\",\"" + results[i].newValue+ "\"");
}


for (let i=0; i<errors.length; i++) {
    print(projectUrl+errors[i].projectId + "," + errors[i].meritProjectID + "," + errors[i].activityId + "," + errors[i].activityType + "," + errors[i].output + ",\"" + results[i].oldValue + "\",," + errors[i].error);
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
            let value = node[i] && node[i].trim();
            if (!value || value === '') {
                continue;
            }
            let ip = db.investmentPriority.findOne({name: value});
            if (!ip) {
                errors.push({
                    error:"No investment priority found for " + value,
                    projectId: project ? project.projectId : null,
                    meritProjectID: project ? project.grantId : null,
                    activityId: output ? output.activityId : null,
                    activityType: activity ? activity.type : null,
                    oldValue: node[i],
                    newValue: '',
                    output: output ? output.name : null
                })

            }
            else {
                newValues.push(ip.investmentPriorityId);
                changed = true;
            }

        }
        parentNode[path] = newValues;
    } else {
        let value = node && node.trim();
        let ip = db.investmentPriority.findOne({name: value});
        if (!ip) {
            errors.push({
                error:"No investment priority found for " + node,
                projectId: project ? project.projectId : null,
                meritProjectID: project ? project.grantId : null,
                activityId: output ? output.activityId : null,
                activityType: activity ? activity.type : null,
                output: output ? output.name : null
            })
        }
        else {
            parentNode[path] = ip.investmentPriorityId;
            changed = true;
        }
    }
    if (changed) {
        results.push({
            projectId: project ? project.projectId : null,
            meritProjectID: project ? project.grantId : null,
            activityId: output ? output.activityId : null,
            activityType: activity ? activity.type : null,
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
                let changed = false;
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
                                if (processInvestmentPriority(node, currentPath, project, activity, output)) {
                                    changed = true;
                                }
                            } else {
                                node = node[currentPath];
                                if (Array.isArray(node)) {
                                    for (let j = 0; j < node.length; j++) {
                                        let childNode = node[j];
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
                if (changed) {
                    db.output.replaceOne({outputId: output.outputId}, output);
                    audit(output, output.outputId, 'au.org.ala.ecodata.Output', adminUserId, project.projectId);
                }
            }
        }
    }

}


function replaceInvestmentPrioritiesWithIds(project) {
    /*
    // The "assets" in the objectives.rows1.assets field are actually much closer to the "category" or "type"
    // We are leaving these as they don't add any value to migrate.
    let objectives = project.custom.details.objectives && project.custom.details.objectives.rows1;
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
    */
    let changed = false;
    let assets = project.custom.details.assets;
    if (assets) {
        for (let i = 0; i < assets.length; i++) {
            let assetDescription = assets[i].description && assets[i].description.trim();
            if (assetDescription && assetDescription !== '') {
                if (processInvestmentPriority(assets[i], 'description', project)) {
                    changed = true;
                }
            }

        }
    }
    let outcomes = project.custom.details.outcomes;

    if (outcomes) {


        if (outcomes.primaryOutcome && outcomes.primaryOutcome.assets) {
            changed = processInvestmentPriority(outcomes.primaryOutcome, 'assets', project);
        }
        const outcomeTypes = ["secondaryOutcomes", "shortTermOutcomes", "midTermOutcomes"];
        for (let k = 0; k < outcomeTypes.length; k++) {

            if (outcomes[outcomeTypes[k]]) {
                for (let i = 0; i < outcomes[outcomeTypes[k]].length; i++) {
                    let outcome = outcomes[outcomeTypes[k]][i];
                    if (outcome.assets) {
                        if (processInvestmentPriority(outcome, 'assets', project)) {
                            changed = true;
                        }
                    }
                }

            }
        }

        if (changed) {
            //print("Updating project " + project.projectId);
            db.project.replaceOne({projectId: project.projectId}, project);
            audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);
        }
    }
}
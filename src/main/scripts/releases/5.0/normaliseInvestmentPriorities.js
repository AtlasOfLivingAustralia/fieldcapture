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
    "Influenza Sector": "Threatened Species",
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

function updateProgramInvestmentPriorities() {
    let programs = db.program.find({status: {$ne: 'deleted'}});
    while (programs.hasNext()) {
        let changed = false;
        let program = programs.next();
        if (program.priorities && program.priorities.length > 0) {
            for (let j = 0; j < program.priorities.length; j++) {
                let programPriority = program.priorities[j];
                addInvestmentPriority(programPriority);
            }
            delete program.priorities;
            changed = true;
        }

        if (programs.outcomes && programs.outcomes.length > 0) {
            for (let k = 0; k < program.outcomes.length; k++) {
                let priorityCategories = [];
                if (outcome.priorities && outcome.priorities.length > 0) {
                    for (let l = 0; l < outcome.priorities.length; l++) {
                        priorityCategories.push(outcome.priorities[l].category);
                    }
                    outcome.priorityCategories = priorityCategories;
                    delete outcome.priorities;
                    changed = true;
                }
            }
        }
        if (changed) {
            print("Updating program " + program.programId);
            db.program.replaceOne({programId: program.programId}, program);
            audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId);
        }
    }
}

let programsWithMissingStuff = {};
function addInvestmentPriority(priority, project) {

    let investmentPriority = null;
    let priorityName = priority && priority.trim();
    if (!priorityName) {
        print(project.projectId + 'has an empty priority');
        return;
    }
    let categories = [];
    let type = null;

    let mu = null;
    if (project.managementUnitId) {
        mu = db.managementUnit.findOne({managementUnitId: project.managementUnitId});
        let muPriority = mu.priorities && mu.priorities.find(
            m => (m.priority && m.priority.trim()) === priorityName
        );
        let muCategory = muPriority ? muPriority.category : null;
        if (muCategory) {
            type = typesForCategory[muCategory] || 'Other';
            categories.push(muCategory);
        }

    }

    let program = db.program.findOne({programId: project.programId});
    if (program) {
        let programPriority = program.priorities && program.priorities.find(
            p => (p.priority && p.priority.trim()) === priorityName
        );
        if (!programPriority) {
            //print("No priority found for " + priorityName + " in program " + program.name);
            if (!programsWithMissingStuff[program.programId]) {
                programsWithMissingStuff[program.programId] = {
                    name: program.name,
                    count: 0,
                    ips: []
                }
            }
            programsWithMissingStuff[program.programId].count++;
            programsWithMissingStuff[program.programId].ips.push({[priorityName]:project.projectId});

        } else {
            priorityName = programPriority.priority.trim();
            let programCategory = programPriority.category;
            if (programCategory) {
                categories.push(programCategory);
                type = typesForCategory[programCategory] || 'Other';
            }

        }
    }

    let existingPriority = db.investmentPriority.findOne({name: priorityName});
    if (!existingPriority) {
        investmentPriority = {
            dateCreated: ISODate(),
            lastUpdated: ISODate(),
            investmentPriorityId: UUID.generate(),
            status: 'active',
            type:type,
            name: priorityName,
            categories: categories,
            managementUnits: [],
        }


        db.investmentPriority.insertOne(investmentPriority);
        existingPriority = db.investmentPriority.findOne({name: priorityName});
    }
    else {
        let changed = false;
        if (!existingPriority.type && type) {
            existingPriority.type = type;
            changed = true;
        }
        for (let i=0; i<categories.length; i++) {
            if (!existingPriority.categories.find(c => c === categories[i])) {
                existingPriority.categories.push(categories[i]);
                changed = true;
            }
        }
        if (changed) {
            db.investmentPriority.replaceOne({investmentPriorityId: existingPriority.investmentPriorityId}, existingPriority);
        }
    }
    if (project.managementUnitId) {
        if (!existingPriority.managementUnits.find(m => m === project.managementUnitId)) {
            existingPriority.managementUnits.push(project.managementUnitId);
            db.investmentPriority.replaceOne({investmentPriorityId: existingPriority.investmentPriorityId}, existingPriority);
        }
    }
    return investmentPriority;
}

const projects = db.project.find({$or:[{'custom.details.outcomes': {$exists: true}, 'custom.details.assets':{$exists:true}}], status: {$ne: 'deleted'}});

while (projects.hasNext()) {
    let project = projects.next();

    let investmentPriorities = getInvestmentPriorities(project);
    //print(project.projectId);
    //print(investmentPriorities);
    for (let i=0; i<investmentPriorities.length; i++) {
        let ip = investmentPriorities[i];
        let result = addInvestmentPriority(ip, project);
        if (result === "error") {
            throw "e";
        }
    }
    replaceInvestmentPrioritiesWithIds(project);


    //replaceInvestmentPrioritiesInReportsForProject(project, reportPathsByType);

}
printjson(programsWithMissingStuff);


let programs = db.program.find({status: {$ne: 'deleted'}});
while (programs.hasNext()) {
    let changed = false;
    let program = programs.next();

    if (program.outcomes && program.outcomes.length > 0) {
        for (let k = 0; k < program.outcomes.length; k++) {
            let priorityCategories = [];
            let outcome = program.outcomes[k];
            if (outcome.priorities && outcome.priorities.length > 0) {
                for (let l = 0; l < outcome.priorities.length; l++) {
                    priorityCategories.push(outcome.priorities[l].category);
                }
                outcome.priorityCategories = priorityCategories;
                delete outcome.priorities;
                changed = true;
            }
        }
    }
    if (changed)   {
        print("Updating program " + program.programId);
        db.program.replaceOne({programId: program.programId}, program);
        audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId);
    }
}

let investmentPriorities = db.investmentPriority.find({type: null});
while (investmentPriorities.hasNext()) {
    let ip = investmentPriorities.next();
    // Check if the ip.name matches a species using the regexp "<exactly two words> (common name, common name 2, etc)"
    // If it does, update the type to "Threatened Species"
    // For example, Eucalyptus elaeophloia (Olive Mallee) should match
    let m = ip.name.match(/^[A-Z][a-z]+(-[a-z]+)? [a-z]+(-[a-z]+)?(\s+[a-z]+(-[a-z]+)?)?(\s+\(.+\))?$/);
    if (m) {
        ip.type = "Threatened Species";
        if (ip.categories && ip.categories[0] == null) {
            ip.categories = [];
        }
        db.investmentPriority.replaceOne({investmentPriorityId: ip.investmentPriorityId}, ip);

    }

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


function replaceInvestmentPrioritiesWithIds(project) {
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
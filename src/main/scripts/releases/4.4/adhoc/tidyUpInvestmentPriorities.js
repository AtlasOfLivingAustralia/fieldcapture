load('../../../utils/audit.js');
const adminUserId = "system";
const toUpdate = [['old', 'new']];

for (const [oldValue, newValue] of toUpdate) {

    let projectCursor = findProjectsUsingInvestmentPriority(oldValue);
    while (projectCursor.hasNext()) {
        let project = projectCursor.next();
        updateInvestmentPriority(project, oldValue, newValue);
    }

    db.project.replaceOne({ _id: project._id }, project);
    audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);
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

    project.custom.details.outcomes.primaryOutcome.assets = project.custom.details.outcomes.primaryOutcome.assets.map(asset => asset === oldValue ? newValue : asset);
    project.custom.details.outcomes.secondaryOutcomes.forEach(outcome => {
        outcome.assets = outcome.assets.map(asset => asset === oldValue ? newValue : asset);
    });
    project.custom.details.objectives.rows1.forEach(objective => {
        objective.assets = objective.assets.map(asset => asset === oldValue ? newValue : asset);
    });
    project.custom.details.assets.forEach(asset => {
        if (asset.description === oldValue) {
            asset.description = newValue;
        }
    });

    return project;
}
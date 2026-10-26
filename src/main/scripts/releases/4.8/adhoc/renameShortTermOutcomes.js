load('../../../utils/audit.js');

replaceShortTermOutcomes(
    '1.  Species and Landscapes (Short term): Managing Threats - Pest predator an competitor species have been controlled or are under active, long-term control programs',
    '1.  Species and Landscapes (Short term): Managing Threats - Pest predator and competitor species have been controlled or are under active, long-term control programs');

function replaceShortTermOutcomes(oldOutcome, newOutcome) {
    let projects = db.project.find({'custom.details.outcomes.shortTermOutcomes.relatedOutcome': oldOutcome});

    while (projects.hasNext()) {
        let project = projects.next();
        let shortTermOutcomes = project.custom.details.outcomes.shortTermOutcomes;
        for (let i = 0; i < shortTermOutcomes.length; i++) {
            if (shortTermOutcomes[i].relatedOutcome === oldOutcome) {
                shortTermOutcomes[i].relatedOutcome = newOutcome;
                print('Updating project ' + project.grantId);
                db.project.replaceOne({projectId: project.projectId}, project);
                audit(project, project.projectId, 'au.org.ala.ecodata.Project', 'system', project.projectId);
            }
        }
    }
}
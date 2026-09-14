// This script updates the configuration of all programs configured with short term outcomes
// so as to preserve the previous default behaviour of auto-adding a short term outcome when the MERI plan
// is opened for the first time.
load("../../utils/audit.js");
let programs = db.program.find({'config.meriPlanContents.template':'outcomeStatements'});
while (programs.hasNext()) {
    let program = programs.next();

    for (let i=0; i<program.config.meriPlanContents.length; i++) {
        let config = program.config.meriPlanContents[i];
        if (config.template == 'outcomeStatements' && (config.model.outcomeType == 'short' || !config.model.outcomeType)) {
            config.model.minimumNumberOfOutcomes = 1;
            config.model.outcomeType = 'short';
            print("Updating program: "+program.name+ ", setting the minimum number of short term outcomes to 1");
            db.program.replaceOne({programId:program.programId}, program);
            audit(program, program.programId, 'au.org.ala.ecodata.Program', '<system>');
        }
    }

}
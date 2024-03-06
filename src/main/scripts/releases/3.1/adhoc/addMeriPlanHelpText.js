let programs = db.program.find({'config.meriPlanContents.template':'serviceOutcomeTargets'});
const newText = 'In addition to listing your project assumptions, please list any nominated project services that will not be charged for.';
programs.forEach(program => {
    for (let i = 0; i < program.config.meriPlanContents.length; i++) {
        let template = program.config.meriPlanContents[i];
        if (template.template === 'projectMethodology') {
            if (!template.model.helpText) {
                print("Missing help text for program: "+program.name+", "+program.programId);
            }
            else {
                template.model.helpText = newText+'\n'+template.model.helpText;
                print("Updating help text for program: "+program.name+", "+program.programId);
                db.program.replaceOne({_id: program._id}, program);
            }

            break;
        }
    }
});


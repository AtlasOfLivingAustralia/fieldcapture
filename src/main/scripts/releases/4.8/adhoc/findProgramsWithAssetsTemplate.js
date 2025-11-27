let programs = db.program.find({'config.meriPlanContents.template': 'assets'});
while (programs.hasNext()) {
    let program = programs.next();


    let assetTemplate = program.config.meriPlanContents.find(content => content.template === 'assets');
    print(program.programId+' '+program.name+' '+assetTemplate.model.fromPriorities);
}
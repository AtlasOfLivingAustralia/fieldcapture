let programs = db.program.find({'config.meriPlanContents.template':'serviceOutcomeTargets'});
const newThreats = [
    "Disconnection from Country - Altered/disrupted connection with land and sea country",
"Disconnection from Country - Altered or disrupted First Nations engagement/leadership in caring for land and sea country",
"Disconnection from Country - Altered or disrupted transfer of First Nations knowledge systems",
"Disconnection from Country - Inadequate recognition of Traditional knowledge and practices",
"Disengagement of community - Community are not informed and are not engaged in managing the environment"
];
while (programs.hasNext()) {
    let program = programs.next();
    print(program.name+" "+program.config.keyThreatCodes.length);
    let insertIndex = 4;
    if (program.config.keyThreatCodes.length == 46) {
        for (let i=0; i<newThreats.length; i++) {
            program.config.keyThreatCodes.splice(insertIndex+i, 0, newThreats[i]);
            print(program.config.keyThreatCodes)
        }
    }
    else {
        print("Program "+program.name+" already has "+program.config.keyThreatCodes.length+" key threats");
    }
    db.program.replaceOne({_id:program._id}, program);
}
load('../../../utils/audit.js');
let programs = db.program.find({'config.projectTemplate':'rlp'});
while (programs.hasNext()) {
    let program = programs.next();
    if (program.config && !program.config.riskModel) {
        program.config.riskModel = 'rlp';

        console.log("Updating risk model for program: " + program.name);
        db.program.replaceOne({programId:program.programId}, program);
        audit(program, program.programId, 'au.org.ala.ecodata.Program', 'system');
    }
}
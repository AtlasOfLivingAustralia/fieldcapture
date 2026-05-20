load('../../utils/audit.js');
let agGrantPrograms = ['Climate-Smart Agriculture Program - Capacity Building Grants - Round 1', 'Climate-Smart Agriculture Program - Capacity Building Grants - Round 2', 'Climate-Smart Agriculture Program - Partnerships and Innovation Grants'];
let programs = db.program.find({name:{$in:agGrantPrograms}});
while (programs.hasNext()) {
    let program = programs.next();
    program.config.riskModel = 'ag'
    db.program.replaceOne({programId:program.programId}, program);
    audit(program, program.programId, 'au.org.ala.ecodata.Program');
}
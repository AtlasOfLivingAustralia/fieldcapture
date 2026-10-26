
load('../../../utils/audit.js');
const adminUserId = "system";

const formName = "NHT Output Report"
let programs = db.program.find({'config.programServiceConfig.programServices.mandatory': {$exists:true}, status:{$ne:'deleted'}});


while (programs.hasNext()) {
    var program = programs.next();

    let programServices = program.config.programServiceConfig.programServices;
    for (let i = 0; i < programServices.length; i++) {
        let programService = programServices[i];
        if (programService.mandatory) {
            delete programService.mandatory;
        }
    }

    db.program.updateOne({programId: program.programId}, {$set: {config: program.config}});
    audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, "Update");
    print("Updated "+ program.name);
}
load('../../utils/program.js');

let programName = "Natural Heritage Trust";
var program = db.program.findOne({name:programName});

program.config.reportData = {
    "NHT Output Report": "nhtOutputReportData"
}
db.program.replaceOne({_id:program._id}, program);

programName = "Recovery Actions for Species and Landscapes";
var program = db.program.findOne({name:programName});

program.config.supportsMeriPlanComparison = true;
program.config.declarationPageType = "rdpReportDeclaration";
db.program.save(program);
load('../../utils/program.js');

let programName = "Natural Heritage Trust";
var program = db.program.findOne({name:programName});

program.config.reportData = {
    "NHT Output Report": "nhtOutputReportData"
}

db.program.replaceOne({_id:program._id}, program);

let subProgramName = "Recovery Actions for Species and Landscapes";
var subProgram = db.program.findOne({name:subProgramName});

db.program.replaceOne({_id:subProgram._id}, subProgram);
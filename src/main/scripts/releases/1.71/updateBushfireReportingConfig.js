// All subprograms of "Bushfire Wildlife and Habitat Recovery"
var programNames = ["Additional Bushfire Projects", "Wildlife Rescue and Rehabilitation", "Wildlife Rescue and Rehabilitation (Round 2)"];
var activityType = "Wildlife Recovery Final Report - WRR";

for (var i=0; i<programNames.length; i++) {
    var program = db.program.findOne({name:programNames[i]});
    program.config.projectReports[1].activityType = activityType;
    db.program.save(program);
}

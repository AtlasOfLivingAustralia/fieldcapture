var programsUsingServices = db.program.find({$or:[{'config.meriPlanTemplate':'rlpMeriPlan'}, {'config.meriPlanContents.template':'serviceTargets'}]});
var serviceIdsExcluding37 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
while (programsUsingServices.hasNext()) {
    var program = programsUsingServices.next();
    program.config.supportedServiceIds = serviceIdsExcluding37;

    print("Updating program: "+program.name+" to exclude new service");
    db.program.save(program);
}
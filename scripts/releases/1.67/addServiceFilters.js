var programsUsingServices = db.program.find({$or:[{'config.meriPlanTemplate':'rlpMeriPlan'}, {'config.meriPlanContents.template':'serviceTargets'}]});
var serviceIdsExcludingNewServices = [
    NumberInt(1),
    NumberInt(2),
    NumberInt(3),
    NumberInt(4),
    NumberInt(5),
    NumberInt(6),
    NumberInt(7),
    NumberInt(8),
    NumberInt(9),
    NumberInt(10),
    NumberInt(11),
    NumberInt(12),
    NumberInt(13),
    NumberInt(14),
    NumberInt(15),
    NumberInt(16),
    NumberInt(17),
    NumberInt(18),
    NumberInt(19),
    NumberInt(20),
    NumberInt(21),
    NumberInt(22),
    NumberInt(23),
    NumberInt(24),
    NumberInt(25),
    NumberInt(26),
    NumberInt(27),
    NumberInt(28),
    NumberInt(29),
    NumberInt(30),
    NumberInt(31),
    NumberInt(32),
    NumberInt(33),
    NumberInt(34),
    NumberInt(35),
    NumberInt(36)];
while (programsUsingServices.hasNext()) {
    var program = programsUsingServices.next();
    program.config.supportedServiceIds = serviceIdsExcludingNewServices;

    print("Updating program: "+program.name+" to exclude new service");
    db.program.save(program);
}
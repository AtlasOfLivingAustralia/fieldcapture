/** Inserts a document into the program collection **/
function createNewProgram(parentProgram, subprograms) {
    var parent = db.program.find({name: parentProgram}).next();
    print(parent.programId)
    subprograms.forEach(function (subProgram){
        var now = ISODate();
        var p = {name: subProgram, programId: UUID.generate(), dateCreated: now, lastUpdate: now, parent: parent._id, status: "active"}
        var program = db.program.find({name: subProgram})
        if (!program.hasNext()) {
            db.program.insert(p);
        } else {
            print("Program Already Exist: " + subProgram)
        }
    });
}

/** Setups the program configuration **/
function setupProgramConfig(subprograms) {
    subprograms.forEach(function (subprogram){
        var program = db.program.find({name: subprogram});
        while(program.hasNext()){
            var p = program.next();
            p.config = projectConfig.config
            p.priorities = projectConfig.priorities

            db.program.save(p);
        }
    });
}
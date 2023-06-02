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

function createOrFindProgram(name, parentId) {
    var program = db.program.findOne({name:name});
    if (!program) {
        program = createProgram(name, parentId)
    }
    return program;
}

function createProgram(name, parentId) {
    var now = ISODate();
    var program = {
        name:name,
        programId: UUID.generate(),
        dateCreated: now,
        lastUpdated: now,
        status:'active',
        parent: parentId || null,
    }
    db.program.insert(program);

    return db.program.findOne({programId:program.programId});
}

function createProgramAsCopy(name, nameOfProgramToCopy) {
    const now = ISODate();
    let copy = db.program.findOne({name:nameOfProgramToCopy});
    delete copy._id;
    copy.name = name;
    copy.programId = UUID.generate();
    copy.dateCreated = now;
    copy.lastUpdated = now;
    db.program.insert(copy);
}
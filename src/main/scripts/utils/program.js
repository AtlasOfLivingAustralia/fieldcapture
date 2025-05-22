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

function createOrFindProgram(name, parentId, nameOfProgramToCopy) {
    var program = db.program.findOne({name:name});
    if (!program) {
        if (nameOfProgramToCopy) {
            program = createProgramAsCopy(name, nameOfProgramToCopy);
        }
        else {
            program = createProgram(name, parentId)
        }
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
        parent: parentId ? DBRef("program", parentId) : null,
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

    return db.program.findOne({programId:copy.programId});
}

/** When creating a new program, we often want to use the service labels that the NHT uses.
 * This mechanism is a bit clunky, but for now this utility function will take the labels used by the
 * NHT and apply them to the program with the supplied name.
 * @param programName the name of the program to update labels for.
 * @param programNameToCopy the name of the progam that already has the labels we want.  By default this will use the
 * main NHT sub-program, Recovery Actions for Species and Landscapes.
 */
function useNhtServiceLabels(programName, programNameToCopy) {

    programNameToCopy = programNameToCopy || 'RASL - Recovery Actions for Species and Landscapes';
    var programToCopyLabels = db.program.findOne({name: programNameToCopy});
    let program = db.program.findOne({name: programName});
    let services = db.service.find({programLabels: {$ne: null}});
    while (services.hasNext()) {
        let service = services.next();
        let label = service.programLabels[programToCopyLabels.programId];

        if (!label) {
            print("No label found for service " + service.name);
            printjson(service);
            throw "Help!";
        }

        service.programLabels[program.programId] = {label: label.label};
        print("Updating label for service " + service.name + ", program "+program.name+" to " + label.label);

        db.service.replaceOne({_id: service._id}, service);
    }
}

/**
 * Updates the program service configuration for the given program with service id and score ids.
 * This method ensures duplicates are not created.
 * @param program
 * @param legacyId
 * @param scoreIds
 * @param mandatory
 */
function updateProgramServiceConfig(program, legacyId, scoreIds, mandatory){
    if (!program || !program.config) {
        print("Program not found ");
        return;
    }

    program.config.programServiceConfig = program.config.programServiceConfig || {};
    program.config.programServiceConfig.programServices = program.config.programServiceConfig.programServices || [];

    var service = program.config.programServiceConfig.programServices.find(function (service) {
        return service.serviceId == legacyId;
    });

    if (!service) {
        service = {serviceId: legacyId, serviceTargets: scoreIds};
        if (mandatory) {
            service.mandatory = true;
        }
        program.config.programServiceConfig.programServices.push(service);
    }
    else {
        scoreIds.forEach(function (scoreId) {
            service.serviceTargets = service.serviceTargets || [];
            if (service.serviceTargets.indexOf(scoreId) === -1)
                service.serviceTargets.push(scoreId);
        });
        if (mandatory && !service.mandatory) {
            service.mandatory = true;
        }
    }

    return program;
}

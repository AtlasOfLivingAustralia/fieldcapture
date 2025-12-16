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

/**
 * Renames a program outcome and updates all affected projects.
 * NOTE that only short term outcomes have been tested with this script so far.
 * @param type the type of outcome: primary, secondary, medium, short, or '' for both primary and secondary
 * @param oldName the old name of the outcome
 * @param newName the new name of the outcome
 */
function renameProgramOutcome(type, oldName, newName) {

    let programs = db.program.find({'outcomes.outcome': oldName});
    while (programs.hasNext()) {
        let program = programs.next();

        for (let i = 0; i < (program.outcomes || []).length; i++) {
            let outcome = program.outcomes[i];
            if (outcome.outcome === oldName) {
                outcome.outcome = newName;
                print("Updating program outcome: " + program.name + " outcome: " + oldName + " to " + newName);
                db.program.replaceOne({programId:program.programId}, program);
                audit(program, program.programId, 'au.org.ala.ecodata.Program', systemUserId);

                let prefix = 'custom.details.outcomes.';
                switch (type) {
                    case 'primary':
                        prefix += 'primaryOutcome';
                        updateAffectedProjects(program.programId, prefix, 'description', oldName, newName, systemUserId);
                        break;
                    case 'secondary':
                        prefix += 'secondaryOutcomes';
                        updateAffectedProjects(program.programId, prefix, 'description', oldName, newName, systemUserId);
                        break;
                    case 'medium':
                        prefix += 'midTermOutcomes';
                        updateAffectedProjects(program.programId, prefix, 'relatedOutcome', oldName, newName, systemUserId);
                        break;
                    case 'short':
                        prefix += 'shortTermOutcomes';
                        updateAffectedProjects(program.programId, prefix, 'relatedOutcome', oldName, newName, systemUserId);
                        break;
                    case '':
                        let firstPrefix = prefix + 'primaryOutcome';
                        updateAffectedProjects(program.programId, firstPrefix, 'description', oldName, newName, systemUserId);
                        let secondPrefix = prefix + 'secondaryOutcomes';
                        updateAffectedProjects(program.programId, secondPrefix, 'description', oldName, newName, systemUserId);
                        break;
                    default:
                        throw "Unknown outcome type: " + type;
                }
            }
        }

    }
}

function updateAffectedProjects(programId, prefix, nodeName, oldName, newName, systemUserId) {

    const key = prefix+'.'+nodeName;
    let query = {programId:programId};
    query[key] = oldName;

    let affectedProjects = db.project.find(query);
    print("Found " + affectedProjects.count() + " affected projects for outcome: " + oldName);
    while (affectedProjects.hasNext()) {
        let project = affectedProjects.next();
        // Split the prefix on '.' to get the array of paths to traverse to find the outcome
        let paths = prefix.split('.');
        let current = project;
        for (let i=0; i<paths.length; i++) {
            current = current[paths[i]];
        }

        if (current && current[nodeName] === oldName) {
            current[nodeName] = newName;
            print("Updating project: " + project.name + " outcome: " + oldName + " to " + newName);
            db.project.replaceOne({projectId:project.projectId}, project);
            audit(project, project.projectId, 'au.org.ala.ecodata.Project', systemUserId);
        }
        else if (current && Array.isArray(current)) {
            for (let j=0; j<current.length; j++) {
                if (current[j][nodeName] === oldName) {
                    current[j][nodeName] = newName;
                    print("Updating project: " + project.name + " outcome: " + oldName + " to " + newName);
                    db.project.replaceOne({projectId:project.projectId}, project);
                    audit(project, project.projectId, 'au.org.ala.ecodata.Project', systemUserId);
                }
            }
        }
    }
}

const programs = [
    'Priority Species - Procurements',
    'World Heritage Protection',
    'Ramsar Wetland Protection',
    'Priority Places',
    'Priority Species',
    'Saving Native Species'
];
var programToCopyLabels = db.program.findOne({name:'Recovery Actions for Species and Landscapes'});

let services = db.service.find({programLabels:{$ne:null}});
while(services.hasNext()) {
    let service = services.next();
    let label = service.programLabels[programToCopyLabels.programId];

    if (!label) {
        print("No label found for service " + service.name);
        printjson(service);
        throw "Help!";
    }

    for (let i=0; i<programs.length; i++) {
        let program = db.program.findOne({name:programs[i]});
        service.programLabels[program.programId] = {label:label.label};
        print("Updating label for service " + service.name + " to " + label.label);
    }
    db.service.replaceOne({_id:service._id}, service);
}

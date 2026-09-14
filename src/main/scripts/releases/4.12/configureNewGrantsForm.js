const newGrantsForm = 'Enhanced Grants Progress Report';
let services = db.service.find();
while (services.hasNext()) {
    let service = services.next();

    let output = service.outputs.find(output => output.formName === newGrantsForm);
    if (!output) {

        output = service.outputs.find(output => output.formName === 'Grants and Others Progress Report');
        if (!output) {
            print("Service " + service.name + " has no output for the grants form");
        } else {
            print("**************** found for service " + service.name);
            service.outputs.push({formName: newGrantsForm, sectionName: output.sectionName});
            db.service.replaceOne({name: service.name}, service);
        }
    }

}

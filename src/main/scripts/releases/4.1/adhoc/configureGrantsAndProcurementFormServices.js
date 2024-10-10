load('../../../utils/audit.js');
const forms = ['Grants and Others Progress Report', 'Procurement Output Report'];
const nhtOutputReportForm = 'NHT Output Report';
let services = db.service.find();
while (services.hasNext()) {
    let service = services.next();
    let updated = false;
    let sectionName = null;
    for (let i=0; i<service.outputs.length; i++) {
        let output = service.outputs[i];

        if (output.formName == nhtOutputReportForm) {
           sectionName = output.sectionName;
        }
    }

    if (!sectionName) {
        print("No section found for service: "+service.name);
        continue;
    }
    for (let form in forms) {
        let found = false;
        for (let i=0; i<service.outputs.length; i++) {
            let output = service.outputs[i];
            if (output.formName == forms[form]) {
                found = true;
            }
        }
        if (!found) {
            service.outputs.push({formName:forms[form], sectionName:sectionName});
            updated = true;
        }
    }

    if (updated) {
        print("Updating service forms for service: "+service.name);
        db.service.replaceOne({_id:service._id}, service);
        audit(service, service.serviceId, 'au.org.ala.ecodata.Service', 'system');
    }


}
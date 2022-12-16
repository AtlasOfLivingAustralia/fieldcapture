const formName = 'RLP Output Report - Review';
const formVersion = NumberInt(1);

let form = db.activityForm.findOne({name:formName, formVersion:formVersion});

let services = db.service.find();
while (services.hasNext()) {
    let service = services.next();

    // The section name of the RLP form.
    const sectionName = service.outputs[0].sectionName;
    print("******************************* "+sectionName+" ****************************");

    let bestMatchCount = 10; // Require at least a 3 char match
    let bestMatch = null;
    // The form section names for forms based off the RLP Output Report tend
    // to change the prefix but not the suffix so we are trying to auto match based
    // on the end of each section.
    for (let i=0; i<form.sections.length; i++) {
        let section = form.sections[i].name;

        let matchingChars = 0;
        //print("Comparing "+section+" to "+sectionName);
        for (let j=0; j<sectionName.length && j<section.length; j++) {
            if (sectionName.charAt(sectionName.length-j-1) == section.charAt(section.length-j-1)) {
                matchingChars++;
            }
        }
        if (matchingChars > bestMatchCount) {
            print("section "+section+" has best match with "+matchingChars+" matches!");
            bestMatch = section;
            bestMatchCount = matchingChars;
        }
    }
    print("Best match for "+sectionName+" is "+bestMatch);
    if (bestMatch) {
        service.outputs.push({formName:formName, sectionName:bestMatch});
    }

    db.service.replaceOne({_id:service._id}, service);
}
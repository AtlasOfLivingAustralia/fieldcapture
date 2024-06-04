load('../../../utils/audit.js');
const module1 = "Pest Fauna Control Activities";
const module2 = "Interventions";

let properties = ['monitoring', 'baseline'];
const adminUserId = '1493';
for (let z=0; z<properties.length; z++) {

    print("*************************************************************")

    let property = properties[z];
    print(property)


    let queryPath = 'custom.details.' + property + '.rows.protocols';
    let updatePath = 'custom.details.' + property + '.rows';
    let projects = db.project.find({[queryPath]: {$in: [module1, module2]}});

    while (projects.hasNext()) {
        let project = projects.next();
        print('https://fieldcapture.ala.org.au/project/index/' + project.projectId + ',"' + project.name + '",' + project.planStatus + ", " + project.organisationName)

        let monitoringRows = project.custom.details[property].rows;

        for (let row = 0; row < monitoringRows.length; row++) {
            let before = Array.of(...monitoringRows[row].protocols);
            let found = false;
            if (monitoringRows[row].protocols.length > 0) {
                for (let i = monitoringRows[row].protocols.length - 1; i >= 0; i--) {
                    if (monitoringRows[row].protocols[i] === module1 || monitoringRows[row].protocols[i] === module2) {
                        let result = monitoringRows[row].protocols.splice(i, 1);
                        //print("Removing " + result + " from " + project.name)
                        found = true;
                    }

                }
                if (found) {
                    //print("Before: " + before);
                    //print("After: " + monitoringRows[row].protocols);
                }
            } else {
                //print("empty row for " + project.name + ", " + project.projectId+", "+project.planStatus);
                //print(monitoringRows[row])
            }

        }

        db.project.updateOne({_id:project._id}, {$set: {[updatePath]:monitoringRows}});
        audit(project, project.projectId, 'au.org.ala.ecodata.Project', adminUserId);
    }
}
load('../../../utils/audit.js');
let projects = db.project.find({'risks.dateUpdated':{$gt:ISODate('2026-03-23T00:00:00Z')}});
while (projects.hasNext()) {
    let project = projects.next();
    let program = db.program.findOne({programId:project.programId});

    let risks = project.risks.rows;

    let changed = false;

    for (let i=0; i<risks.length; i++) {
        let risk = risks[i];
        if (risk.likelihood == 'Almost Certain') {
            risk.likelihood = 'Highly Likely';
            print("Changing Almost Certain to Highly Likely");
            changed = true;
        }
        else if (risk.likelihood =='Remote') {
            risk.likelihood = 'Rare';
            print("Changing Remote to Rare");
            changed = true;
        }
        if (risk.consequence == 'Insignificant') {
            risk.consequence = 'Minor';
            print("Changing Insignificant to Minor");
            changed = true;
        } else if (risk.consequence == 'Extreme') {
            risk.consequence = 'Critical';
            print("Changing Extreme to Critical");
            changed = true;
        }
    }
    if (changed) {
        print("Updating project "+project.projectId+", "+project.name);
        db.project.replaceOne({projectId:project.projectId}, project);
        audit(project, project.projectId, 'au.org.ala.ecodata.Project', '<system>', project.projectId);
    }


}

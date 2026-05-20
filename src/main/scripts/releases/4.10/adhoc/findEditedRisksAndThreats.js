let projects = db.project.find({'risks.dateUpdated':{$gt:ISODate('2026-03-23T00:00:00Z')}});
print("Production URL, Staging URL, Risks changes report URL, Date risks edited, Program ID, Program Name, Uses a value that will be removed, Changed High to Moderate or Major, New risk row that uses Moderate or Major")
while (projects.hasNext()) {
    let project = projects.next();
    let program = db.program.findOne({programId:project.programId});

    let risks = project.risks.rows;

    let usesUniqueValue = false;
    let newRisks = false;
    let changedHighToModerateOrMajor = false;

    for (let i=0; i<risks.length; i++) {
        let risk = risks[i];
        if (risk.likelihood ==' Almost Certain' || risk.likelihood =='Remote') {
            usesUniqueValue = true;
        }
        if (risk.consequence == 'Insignificant' || risk.consequence == 'Extreme') {
            usesUniqueValue = true;
        }

        if (risk.consequence == 'Major' || risk.consequence == 'Moderate') {

            let previousValues = db.auditMessage.find({entityId:project.projectId, date:{$lt:ISODate('2026-02-24T00:00:00Z')}}).sort({date:-1});
            if (previousValues.hasNext()) {


                let message = previousValues.next();


                let oldRiskRows = message.entity.risks && message.entity.risks.rows;
                if (oldRiskRows && oldRiskRows.length > i) {
                    let oldRisk = oldRiskRows[i];
                    if (oldRisk.consequence == 'High') {
                        changedHighToModerateOrMajor = true;
                    }
                }
                else{
                    newRisks = true;
                }
            }
            else {
                newRisks = true;
            }

        }
    }

    print("https://fieldcapture.ala.org.au/project/index/"+project.projectId+', '+"https://merit-staging.ala.org.au/project/index/"+project.projectId+', '+"https://merit-staging.ala.org.au/project/projectReport/"+project.projectId+'?fromDate=2026-02-22T13:00:00Z&toDate=2026-05-06T04:41:21Z&sections=Project+risks+changes&orientation=portrait, '+project.risks.dateUpdated+', '+program.programId+', '+program.name+', '+(usesUniqueValue?"Yes":"")+', '+(changedHighToModerateOrMajor?"Yes":"")+", "+(newRisks?"Yes":""));

}

load('../../../utils/audit.js');
let reportId = 'ac5c0470-c654-40e1-9535-bfaf620fe883';
let adminUserId = 'system';

let outputsToMarkAsNotApplicable = ['NHT - Identifying sites', 'NHT - Weed treatment', 'NHT - Baseline data'];

let report =  db.report.findOne({reportId:reportId});
let activityId = report.activityId;

printjson(db.output.find({activityId:activityId, name:{$in:outputsToMarkAsNotApplicable}}, {outputId:true, name:true, outputNotCompleted:true}));

for (let i=0; i<outputsToMarkAsNotApplicable.length; i++) {
    let output = db.output.findOne({activityId:activityId, name:outputsToMarkAsNotApplicable[i]});
    if (output.outputNotCompleted === false) {
        output.outputNotCompleted = true;

        db.output.replaceOne({outputId:output.outputId}, output);
        audit(output, output.outputId, 'au.org.ala.ecodata.Output', report.projectId);
    }
}
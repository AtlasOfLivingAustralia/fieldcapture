
load( "../../../utils/audit.js");

let adminUserId = '<system>'

function findRcsReportConfig(reports) {
    for (let i=0; i<reports.length; i++) {
        if (reports[i].activityType == 'Regional Capacity Services Report') {
            return reports[i];
        }
    }
    return null;
}
db.organisation.find({'config.organisationReports':{$exists:true}}).forEach(function(org){
    let rcsReportConfig = findRcsReportConfig(org.config.organisationReports);
    if (!rcsReportConfig) {
        return;
    }
    rcsReportConfig.description = "Changes are being made to the Regional Capacity Services Reporting template so editing has been temporarily disabled for the Q2 report.  Providers will be notified once the report is ready to be accessed again";

    //org.config.serviceTargets = serviceTargetsConfig;
    print("updating organisation "+org.name+' , id: '+org.organisationId);
    db.organisation.replaceOne({organisationId:org.organisationId}, org);
    audit(org, org.organisationId, 'au.org.ala.ecodata.Organisation', adminUserId, undefined, 'Update');
});

db.report.updateMany({activityType:'Regional Capacity Services Report', toDate:ISODate('2024-12-31T13:00:00Z')}, {$set:{status:'readonly'}});
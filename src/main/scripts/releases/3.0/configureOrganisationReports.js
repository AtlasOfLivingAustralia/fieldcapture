load('../../utils/audit.js');
const PERFORMANCE_MANAGEMENT_FRAMEWORK_CATEGORY = 'Performance Management Framework';
const adminUserId = 'system';
db.report.update({status:{$ne:'deleted'}, organisationId:{$exists:true}}, {$set:{category:PERFORMANCE_MANAGEMENT_FRAMEWORK_CATEGORY}}, {multi:true});
let reports = db.report.find({status:{$ne:'deleted'}, organisationId:{$exists:true}});
while (reports.hasNext()) {
    let report = reports.next();
    let organisation = db.organisation.findOne({organisationId:report.organisationId});

    printjson(organisation)
    if (!organisation.config) {
        organisation.config = {};
    }
    if (!organisation.config.organisationReports) {
        organisation.config.organisationReports = [];
    }
    if (!organisation.config.organisationReports.find(function(report) {return report.category == PERFORMANCE_MANAGEMENT_FRAMEWORK_CATEGORY})) {
        organisation.config.organisationReports.push({category:PERFORMANCE_MANAGEMENT_FRAMEWORK_CATEGORY, adhoc:true});

        db.organisation.replaceOne({organisationId:organisation.organisationId}, organisation);
        audit(organisation, organisation.organisationId, 'au.org.ala.ecodata.Organisation', adminUserId);
    }
}


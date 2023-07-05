load('../../utils/audit.js');
const PERFORMANCE_MANAGEMENT_FRAMEWORK_CATEGORY = 'Performance Management Framework';
const adminUserId = 'system';

const reportConfig = {
    "Regional Capacity Services": [
        {
            "reportType": "Administrative",
            "periodStart": "2023-06-30T14:00:00Z",
            "periodEnd": "2028-06-29T14:00:00Z",
            "reportDescriptionFormat": "Regional capacity services report %d for %4$s",
            "reportNameFormat": "Regional capacity report %d",
            "reportingPeriodInMonths": 3,
            "label": "Quarterly",
            "category": "Regional Capacity Services Reporting",
            "activityType": "Regional Capacity Services Report"
        },
        {
            "periodStart": "2023-06-30T14:00:00Z",
            "periodEnd": "2028-06-29T14:00:00Z",
            "reportType": "Administrative",
            "reportDescriptionFormat": "Regional capacity annual report %d for %4$s",
            "reportNameFormat": "Regional capacity annual report %d",
            "reportingPeriodInMonths": 12,
            "label": "Annual",
            "description": "The core services annual report is being updated for the 21/22 financial year.  _Please do not commence annual reporting until the new report is ready for use._",
            "category": "Regional Capacity Services Annual Reporting",
            "activityType": "RLP Core Services annual report"
        }
    ]
};
var setting = {
    key: 'meritorganisation.availableReportsConfig',
    value: JSON.stringify(reportConfig),
    dateCreated: ISODate(),
    lastUpdated: ISODate()
};
if (db.setting.findOne({key: setting.key})) {
    db.setting.replaceOne({key: setting.key}, setting);
} else {
    db.setting.insertOne(setting);
}

db.report.update({
    status: {$ne: 'deleted'},
    organisationId: {$exists: true},
    type : "Performance Management Framework - Self Assessment"
}, {$set: {category: PERFORMANCE_MANAGEMENT_FRAMEWORK_CATEGORY}}, {multi: true});
let reports = db.report.find({status: {$ne: 'deleted'}, organisationId: {$exists: true}});
while (reports.hasNext()) {
    let report = reports.next();
    let organisation = db.organisation.findOne({organisationId: report.organisationId});

    if (!organisation.config) {
        organisation.config = {};
    }
    if (!organisation.config.organisationReports) {
        organisation.config.organisationReports = [];
    }
    let found = false;
    for (let i = 0; i < organisation.config.organisationReports.length; i++) {
        if (organisation.config.organisationReports[i].category == PERFORMANCE_MANAGEMENT_FRAMEWORK_CATEGORY) {
            found = true;
            break;
        }
    }

    if (!found) {
        organisation.config.organisationReports.push({
            category: PERFORMANCE_MANAGEMENT_FRAMEWORK_CATEGORY,
            adhoc: true
        });

        db.organisation.replaceOne({organisationId: organisation.organisationId}, organisation);
        audit(organisation, organisation.organisationId, 'au.org.ala.ecodata.Organisation', adminUserId);
    }
}

// Email templates

var emailTemplates = [
    {
        key: 'meritorganisation_report.submitted.emailSubject',
        value: 'A MERIT ${report.category} report has been submitted for your approval – ${reportOwner.name}',
    },
    {
        key: 'meritorganisation_report.submitted.emailBody',
        value: 'A ${report.category} report for the below organisation has been submitted to you for consideration. \r\n' +
            '\r\n' +
            'You should now log into MERIT and review the report in line with standard project management requirements before accepting or rejecting the report. \r\n' +
            '\r\n' +
            'Please ensure you review the separate invoice and statutory declaration (not applicable for Annual Reports) before you accept or reject the report.\r\n' +
            '\r\n' +
            'Organisation: [**${reportOwner.name}**](https://fieldcapture.ala.org.au/organisation/index/${reportOwner.organisationId})\r\n' +
            'Report: **${report.description}**',
    },
    {
        key: 'meritorganisation_report.approved.emailSubject',
        value: 'Your MERIT ${report.category} report for ${reportOwner.name} has been approved',
    },
    {

        key: 'meritorganisation_report.approved.emailBody',
        value: 'Your report for the below organisation has been approved by your departmental Project Manager. \r\n' +
            '\r\n' +
            'Organisation: **[${reportOwner.name}](https://fieldcapture.ala.org.au/organisation/index/${reportOwner.organisationId})**\r\n' +
            'Report: **${report.description}**',
    },
    {

        key: 'meritorganisation_report.returned.emailSubject',
        value: 'Your MERIT ${report.category} report for ${reportOwner.name} has been returned for updates',

    },
    {

        key: 'meritorganisation_report.returned.emailBody',
        value: 'Your departmental Project Manager has requested some updates be made to your report for the below organisation. \r\n' +
            '\r\n' +
            'The areas requiring further attention are:\r\n' +
            '${reason}\r\n' +
            '\r\n' +
            'You should contact your departmental Project Manager if you require further clarification.\r\n' +
            '\r\n' +
            'Organisation: **${reportOwner.name}**\r\n' +
            'Report: [**${report.name}**](https://fieldcapture.ala.org.au/organisation/editOrganisationReport/${reportOwner.programId}?reportId=${report.reportId})',

    }];

for (var i=0; i<emailTemplates.length; i++) {
    var setting = {
        key: emailTemplates[i].key,
        value: emailTemplates[i].value,
        dateCreated: ISODate(),
        lastUpdated: ISODate()
    };
    if (db.setting.findOne({key: setting.key})) {
        print("Inserting " + setting.key)
        db.setting.replaceOne({key: setting.key}, setting);
    } else {
        print("Updating " + setting.key)
        db.setting.insertOne(setting);
    }
}
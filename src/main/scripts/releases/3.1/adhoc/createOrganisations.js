load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/organisations.js');

const adminUserId = '<system>'
const names = ['Northern Tablelands Local Land Services', 'Hunter Local Land Services', 'Riverina Local Land Services', 'North Coast Local Land Services'];

const abn = '57876455969';
const config = {
    "organisationReports": [
        {
            "reportType": "Administrative",
            "reportDescriptionFormat": "Regional capacity services report %d for %4$s",
            "reportNameFormat": "Regional capacity report %d",
            "reportingPeriodInMonths": 3,
            "minimumReportDurationInDays": 1,
            "label": "Quarterly",
            "category": "Regional Capacity Services Reporting",
            "activityType": "Regional Capacity Services Report",
            "periodStart": "2023-06-30T14:00:00Z",
            "periodEnd": "2028-06-30T13:59:59Z"
        },
        {
            "firstReportingPeriodEnd": "2024-06-30T14:00:00Z",
            "reportType": "Administrative",
            "reportDescriptionFormat": "Regional capacity annual report %d for %4$s",
            "reportNameFormat": "Regional capacity annual report %d",
            "reportingPeriodInMonths": 12,
            "minimumReportDurationInDays": 1,
            "description": "The Regional Capacity Services Annual Report is in development.  _Please do not commence annual reporting until the new report is ready for use._",
            "label": "Annual",
            "category": "Regional Capacity Services Annual Reporting",
            "activityType": "Regional Capacity Services Annual Report",
            "periodStart": "2023-06-30T14:00:00Z",
            "periodEnd": "2028-06-30T13:59:59Z"
        }
    ]
};
for (let i=0; i<names.length; i++) {
    let org = db.organisation.findOne({name:names[i]});
    if (!org) {
        let result = createOrganisation(names[i], 'TBA', abn, adminUserId);
        print("Created "+names[i]+" with organisationId: "+result.organisationId);
    }

    db.organisation.updateOne({organisationId:org.organisationId}, {$set:{config:config}});

}

var orgDefaults = {
    create: function () {
        return {
            "config": {
                "organisationReports": [
                    {
                        "reportType": "Administrative",
                        "periodStart": "2023-06-30T14:00:00Z",
                        "periodEnd": "2028-06-29T14:00:00Z",
                        "reportDescriptionFormat": "Regional capacity services report %d for %4$s",
                        "reportNameFormat": "Regional capacity report %d",
                        "reportingPeriodInMonths": 3,
                        "label": "Quarterly",
                        "category": "Regional Capacity Services Reporting",
                        "activityType": "RLP Core Services report"
                    },
                    {
                        "reportType": "Administrative",
                        "periodStart": "2023-06-30T14:00:00Z",
                        "periodEnd": "2028-06-29T14:00:00Z",
                        "reportDescriptionFormat": "Regional capacity annual report %d for %4$s",
                        "reportNameFormat": "Regional capacity annual report %d",
                        "reportingPeriodInMonths": 12,
                        "label": "Annual",
                        "description": "The core services annual report is being updated for the 21/22 financial year.  _Please do not commence annual reporting until the new report is ready for use._",
                        "category": "Regional Capacity Services Annual Reporting",
                        "activityType": "RLP Core Services annual report"
                    }
                ]
            },
            "dateCreated": ISODate("2022-02-01T14:00:00Z"),
            "description": "A description of the organisation",
            "endDate": ISODate("2023-12-30T14:00:00Z"),
            "lastUpdated": ISODate("2022-02-02T14:00:00Z"),
            "logoUrlProvided": "https://ecodata-test.ala.org.au/uploads/2018-06/0_alaLog.png",
            "name": "Test Organisation",
            "organisationId": "test_organisation",
            "startDate": ISODate("2023-01-01T14:00:00Z"),
            "status": "active",
            "url": "",
            "hubId": "merit"
        };
    }
}

const reportConfig = {
    "Regional Capacity Services": [
        {
            "reportType": "Administrative",
            "periodStart": "2023-06-30T14:00:00Z",
            "periodEnd":"2028-06-29T14:00:00Z",
            "reportDescriptionFormat": "Regional capacity services report %d for %4$s",
            "reportNameFormat": "Regional capacity report %d",
            "reportingPeriodInMonths": 3,
            "label": "Quarterly",
            "category": "Regional Capacity Services Reporting",
            "activityType": "Regional Capacity Services Report"
        },
        {
            "periodStart": "2023-06-30T14:00:00Z",
            "periodEnd":"2028-06-29T14:00:00Z",
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
    key:'meritorganisation.availableReportsConfig',
    value:JSON.stringify(reportConfig),
    dateCreated:ISODate(),
    lastUpdated:ISODate()
};
if (db.setting.findOne({key:setting.key})) {
    db.setting.replaceOne({key:setting.key}, setting);
}
else {
    db.setting.insertOne(setting);
}


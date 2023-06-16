var orgDefaults = {
    create: function () {
        return {
            "config": {
                "organisationReports": [
                    {
                        "reportType": "Administrative",
                        "firstReportingPeriodEnd": "2023-09-30T14:00:00Z",
                        "reportDescriptionFormat": "Core services report %d for %4$s",
                        "reportNameFormat": "Core services report %d",
                        "reportingPeriodInMonths": 3,
                        "category": "Core Services Reporting",
                        "activityType": "RLP Core Services report"
                    },
                    {
                        "reportType": "Administrative",
                        "firstReportingPeriodEnd": "2023-09-30T14:00:00Z",
                        "reportDescriptionFormat": "Core services annual report %d for %4$s",
                        "reportNameFormat": "Core services annual report %d",
                        "reportingPeriodInMonths": 12,
                        "category": "Core Services Annual Reporting",
                        "activityType": "RLP Core Services annual report"
                    }
                ]
            },
            "dateCreated": ISODate("2023-06-01T14:00:00Z"),
            "description": "A description of the organisation",
            "endDate": ISODate("2023-12-30T14:00:00Z"),
            "lastUpdated": ISODate("2023-06-02T14:00:00Z"),
            "logoUrlProvided": "https://ecodata-test.ala.org.au/uploads/2018-06/0_alaLog.png",
            "name": "Test Organisation",
            "organisationId": "test_organisation",
            "startDate": ISODate("2023-06-01T14:00:00Z"),
            "status": "active",
            "url": "",
            "hubId": "merit"
        };
    }
}

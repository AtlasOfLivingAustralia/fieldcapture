var muDefaults = {
    create: function() {
      return {
        "associatedOrganisations": [
            {
                "description": "Service provider",
                "name": "Test Org"
            }
        ],
            "config": {
            "managementUnitReports": [
                {
                    "reportType": "Administrative",
                    "firstReportingPeriodEnd": "2018-08-31T14:00:00Z",
                    "reportDescriptionFormat": "Core services report %d for %4$s",
                    "reportNameFormat": "Core services report %d",
                    "reportingPeriodInMonths": 3,
                    "category": "Core Services Reporting",
                    "activityType": "RLP Core Services report"
                },
                {
                    "reportType": "Administrative",
                    "firstReportingPeriodEnd": "2018-06-30T14:00:00Z",
                    "reportDescriptionFormat": "Core services annual report %d for %4$s",
                    "reportNameFormat": "Core services annual report %d",
                    "reportingPeriodInMonths": 12,
                    "category": "Core Services Annual Reporting",
                    "activityType": "RLP Core Services annual report"
                }
            ],
                "emailTemplates": {
                "reportSubmittedEmailTemplate": "RLP_REPORT_SUBMITTED_EMAIL_TEMPLATE",
                    "reportReturnedEmailTemplate": "RLP_REPORT_RETURNED_EMAIL_TEMPLATE",
                    "planApprovedEmailTemplate": "RLP_PLAN_APPROVED_EMAIL_TEMPLATE",
                    "planReturnedEmailTemplate": "RLP_PLAN_RETURNED_EMAIL_TEMPLATE",
                    "reportApprovedEmailTemplate": "RLP_REPORT_APPROVED_EMAIL_TEMPLATE",
                    "planSubmittedEmailTemplate": "RLP_PLAN_SUBMITTED_EMAIL_TEMPLATE"
            },
            "riskAndThreatTypes": [
                "Performance",
                "Work Health and Safety",
                "People resources",
                "Financial",
                "External stakeholders",
                "Natural Environment"
            ],
                "projectReports": [
                {
                    "reportType": "Activity",
                    "firstReportingPeriodEnd": "2018-09-30T14:00:00Z",
                    "adjustmentActivityType": "RLP Output Report Adjustment",
                    "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                    "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                    "reportingPeriodInMonths": 3,
                    "description": "",
                    "category": "Outputs Reporting",
                    "activityType": "RLP Output Report",
                    "canSubmitDuringReportingPeriod": true
                },
                {
                    "reportType": "Administrative",
                    "firstReportingPeriodEnd": "2018-06-30T14:00:00Z",
                    "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
                    "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
                    "reportingPeriodInMonths": 12,
                    "category": "Annual Progress Reporting",
                    "activityType": "RLP Annual Report"
                },
                {
                    "reportType": "Single",
                    "firstReportingPeriodEnd": "2021-06-30T14:00:00Z",
                    "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                    "reportNameFormat": "Outcomes Report 1",
                    "reportingPeriodInMonths": 36,
                    "multiple": false,
                    "category": "Outcomes Report 1",
                    "reportsAlignedToCalendar": false,
                    "activityType": "RLP Short term project outcomes"
                },
                {
                    "reportType": "Single",
                    "firstReportingPeriodEnd": "2023-06-30T14:00:00Z",
                    "reportDescriptionFormat": "Outcomes Report 2 for %4$s",
                    "reportNameFormat": "Outcomes Report 2",
                    "reportingPeriodInMonths": 0,
                    "multiple": false,
                    "minimumPeriodInMonths": 37,
                    "category": "Outcomes Report 2",
                    "reportsAlignedToCalendar": false,
                    "activityType": "RLP Medium term project outcomes"
                }
            ]
        },
            "dateCreated": ISODate("2018-06-30T14:00:00Z"),
            "description": "A description of the management unit and / or service provider",
            "endDate": ISODate("2023-06-30T14:00:00Z"),
            "lastUpdated": ISODate("2018-06-30T14:00:00Z"),
            "logoUrlProvided": "https://ecodata-test.ala.org.au/uploads/2018-06/0_alaLog.png",
            "name": "Test management unit",
            "outcomes": [
            {
                "outcome": "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions",
                "priorities": [
                    {
                        "category": "Ramsar"
                    }
                ],
                "category": "environment",
                "shortDescription": "Ramsar Sites"
            },
            {
                "outcome": "By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved.",
                "priorities": [
                    {
                        "category": "Threatened Species"
                    }
                ],
                "category": "environment",
                "shortDescription": "Threatened Species Strategy"
            },
            {
                "outcome": "By 2023, invasive species management has reduced threats to the natural heritage Outstanding Universal Value of World Heritage properties through the implementation of priority actions.",
                "priorities": [
                    {
                        "category": "World Heritage Sites"
                    }
                ],
                "category": "environment",
                "shortDescription": "World Heritage Areas"
            },
            {
                "outcome": "By 2023, the implementation of priority actions is leading to an improvement in the condition of EPBC Act listed Threatened Ecological Communities.",
                "priorities": [
                    {
                        "category": "Threatened Ecological Communities"
                    }
                ],
                "category": "environment",
                "shortDescription": "Threatened Ecological Communities"
            },
            {
                "outcome": "By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation.",
                "priorities": [
                    {
                        "category": "Land Management"
                    }
                ],
                "category": "agriculture",
                "shortDescription": "Soil Condition"
            },
            {
                "outcome": "By 2023, there is an increase in the capacity of agriculture systems to adapt to significant changes in climate and market demands for information on provenance and sustainable production.",
                "priorities": [
                    {
                        "category": "Sustainable Agriculture"
                    }
                ],
                "category": "agriculture",
                "shortDescription": "Climate / Weather Adaption"
            }
        ],
            "priorities": [
            {
                "category": "Ramsar",
                "priority": "Ginini Flats Wetland Complex"
            },
            {
                "category": "Threatened Species",
                "priority": "Anthochaera phrygia"
            },
            {
                "category": "Threatened Species",
                "priority": "Bettongia gaimardi"
            },
            {
                "category": "Threatened Species",
                "priority": "Botaurus poiciloptilus"
            },
            {
                "category": "Threatened Species",
                "priority": "Lathamus discolor"
            },
            {
                "category": "Threatened Species",
                "priority": "Rutidosis leptorrhynchoides"
            },
            {
                "category": "Threatened Species",
                "priority": "Swainsona recta"
            },
            {
                "category": "Threatened Ecological Communities",
                "priority": "Alpine Sphagnum Bogs and Associated Fens"
            },
            {
                "category": "Threatened Ecological Communities",
                "priority": "Natural Temperate Grassland of the South Eastern Highlands"
            },
            {
                "category": "Threatened Ecological Communities",
                "priority": "White Box-Yellow Box-Blakely's Red Gum Grassy Woodland and Derived Native Grassland"
            },
            {
                "category": "Soil Quality",
                "priority": "Soil acidification"
            },
            {
                "category": "Soil Quality",
                "priority": "Soil Carbon priority"
            },
            {
                "category": "Soil Quality",
                "priority": "Hillslope erosion priority"
            },
            {
                "category": "Soil Quality",
                "priority": "Wind erosion priority"
            },
            {
                "category": "Land Management",
                "priority": "Soil acidification"
            },
            {
                "category": "Land Management",
                "priority": "Soil carbon"
            },
            {
                "category": "Land Management",
                "priority": "Hillslope erosion"
            },
            {
                "category": "Land Management",
                "priority": "Wind erosion"
            },
            {
                "category": "Land Management",
                "priority": "Native vegetation and biodiversity on-farm"
            },
            {
                "category": "Sustainable Agriculture",
                "priority": "Climate change adaptation"
            },
            {
                "category": "Sustainable Agriculture",
                "priority": "Market traceability"
            }
        ],
            "managementUnitId": "test_mu",
            "startDate": ISODate("2018-06-30T14:00:00Z"),
            "status": "active",
            "url": ""
        };
    }
}

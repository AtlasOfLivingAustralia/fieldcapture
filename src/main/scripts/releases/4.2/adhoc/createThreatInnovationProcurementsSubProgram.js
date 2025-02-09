load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');

var config =
    {
        "meriPlanContents": [
            {
                "template": "name",
                "model": {
                    "tableFormatting": true
                }
            },
            {
                "template": "priorityPlace",
                "model": {
                    "priorityPlaceHelpText": "Priority places recognises that some threatened species share the same habitat, and that place-based action can support protection and recovery of more than one species.",
                    "priorityPlaceLabel": "Does this project directly support a priority place?"
                }
            },
            {
                "template": "indigenousInvolvement"
            },
            {
                "template": "description",
                "model": {
                    "tableFormatting": true,
                    "maxSize": "1000",
                    "placeholder": "Please provide a short description of this project. This project description will be visible on the project overview page in MERIT [Free text; limit response to 1000 characters (approx. 150 words)]"
                }
            },
            {
                "template": "programOutcome",
                "model": {
                    "maximumPriorities": "1000",
                    "priorityHelpText": "Enter the primary investment priority for the primary outcome, noting only one can be selected."
                }
            },
            {
                "template": "outcomeStatements",
                "model": {
                    "outcomeType": "short",
                    "helpText": "Outline the degree of impact having undertaken the services for up to three years. Ensure the outcomes are measurable with consideration to the baseline and proposed monitoring regime",
                    "subtitle": "Short-term outcome statement/s",
                    "extendedOutcomes": true
                }
            },
            {
                "template": "extendedKeyThreats",
                "model": {
                    "servicesHelpText": "Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables",
                    "threatHelpText": "Describe the key threats or key threatening processes to the investment priority",
                    "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance",
                    "interventionHelpText": "Describe the proposed method to address the threat or threatening process",
                    "title": "Key threat(s) and/or key threatening processes"
                }
            },
            {
                "template": "projectMethodology",
                "model": {
                    "helpText": "Include all those conditions or factors that are sufficient to guarantee the success of the project, for example, on ground activities were not impacted by adverse weather conditions. Ensure what’s documented here aligns to those assumptions documented within the Project Logic.",
                    "maxSize": "4000",
                    "tableHeading": "Project delivery assumptions (4000 character limit [approx. 650 words])"
                }
            },
            {
                "template": "projectPartnerships",
                "model": {
                    "helpTextHeading": "Note: Not limited to key subcontractors.",
                    "helpTextPartnerName": "Insert name of project partner. To be a project partner, they need to be actively involved in the planning or delivery of the project"
                }
            },
            {
                "template": "extendedBaselineMonitoring",
                "model": {
                    "approachHeading": "Monitoring method",
                    "indicatorHeading": "Monitoring methodology",
                    "monitoringServiceHelpText": "Select the relevant Project Services(s)/Target measure(s) that will be used to support ongoing monitoring",
                    "baselineDataDescriptionHelpText": "Describe the project baseline to be established, or the baseline data that currently exists",
                    "baselineMethodHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
                    "baselineDataHelpText": "Existing baseline data needs to be based on best practice methods and be compatible with the EMSA protocols.",
                    "approachHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
                    "titleHelpText": "Describe the Project Baseline(s) and ongoing monitoring which will be used to report progress towards this projects outcome(s).  Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables",
                    "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance",
                    "baselineServiceHelpText": "Select the relevant Project Service(s)/Target measure(s) that will be used to support the development of the baseline",
                    "newIndicatorText": "New monitoring indicator"
                }
            },
            {
                "template": "projectReview",
                "model": {
                    "title": "Project review, improvement and evaluation methodology and approach (3000 character limit [approximately 500 words])"
                }
            },
            {
                "template": "nationalAndRegionalPlans",
                "model": {
                    "includeUrl": true,
                    "headingTitle": "Conservation and management plans"
                }
            },
            {
                "template": "serviceOutcomeTargets",
                "model": {
                    "titleHelpText": "Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections",
                    "title": "Project services and targets",
                    "serviceName": "Service"
                }
            },
            {
                "template": "serviceForecasts",
                "model": {
                    "titleHelpText": "Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections"
                },
                "excludedModes": [
                    "PRINT"
                ]
            }
        ],
        "excludes": [],
        "programServiceConfig": {
            "serviceFormName": "Priority Threatened Species Progress Report",
            "programServices": [
                {
                    "serviceTargets": [
                        "c3276929-b8a9-4985-a329-49b86f14018c"
                    ],
                    "serviceId": 1
                },
                {
                    "serviceTargets": [
                        "69deaaf9-cdc2-439a-b684-4cffdc7f224e"
                    ],
                    "serviceId": 2
                },
                {
                    "serviceTargets": [
                        "1f8161bc-908b-4ec8-ab7f-edac973a657d",
                        "88908921-1248-4a7c-b185-51c625c737e3",
                        "fe9f1a6c-e614-489a-80fa-4d6d76f1cf95"
                    ],
                    "serviceId": 3
                },
                {
                    "serviceTargets": [
                        "aa0c6b29-285e-4344-987e-dfeaf1d95648",
                        "a9d98baa-b2ab-4428-82cf-d96185e63aa6",
                        "c4ea5ce3-4a70-4df8-aff7-ffa929e7df61"
                    ],
                    "serviceId": 4
                },
                {
                    "serviceTargets": [
                        "55d76c03-c89d-40fe-867b-93f7a48ff9c1",
                        "3cbf653f-f74c-4066-81d2-e3f78268185c",
                        "3855d565-3b77-497b-90af-addb271aa598",
                        "5dbfb32a-5933-4d8a-9937-41f350fb5f75"
                    ],
                    "serviceId": 5
                },
                {
                    "serviceTargets": [
                        "22771c0d-8403-433b-b468-e36dc16a1d21",
                        "675cc878-eb80-435f-a841-d89b657fb2e3",
                        "dd9f8fd4-b6c7-4f09-bbbf-5d721afc7677",
                        "6f3cb6ab-5c6a-49be-9af9-9226fa751725"
                    ],
                    "serviceId": 7
                },
                {
                    "serviceTargets": [
                        "e0b4cc3e-e94a-4c97-81dc-a4cb868c2cc3",
                        "b0bcfc54-76fa-4659-accf-276c18b50c31"
                    ],
                    "serviceId": 8
                },
                {
                    "serviceTargets": [
                        "9416c9f4-48ca-4bd1-8822-cd45ebb56c58",
                        "2409e649-2ee2-47fd-9e76-ef2ffa07a5e7",
                        "d58f8dba-109d-4179-b130-a888cd3d303c",
                        "01686d38-9165-4497-9648-627ef81945a7"
                    ],
                    "serviceId": 9
                },
                {
                    "serviceTargets": [
                        "0e2f8d61-b7b4-4d2d-b07c-4fc20bbe326a",
                        "bb506258-e907-43d3-99bd-0fe0400f654e"
                    ],
                    "serviceId": 10
                },
                {
                    "serviceTargets": [
                        "3c83e639-9c19-4b31-a86f-9d2d5e78123b",
                        "e901be5e-8336-432e-b164-f278abd7430b"
                    ],
                    "serviceId": 12
                },
                {
                    "serviceTargets": [
                        "5557288b-190e-4a3f-a60b-4bdff6ca8fe8",
                        "902df7a8-92f6-420d-9544-47d4b8cf31ca"
                    ],
                    "serviceId": 13
                },
                {
                    "serviceTargets": [
                        "9deb3edf-50c7-4b04-a1fb-d1451eadf641",
                        "360c8b86-360c-4ca3-b1aa-626be56f2b11"
                    ],
                    "serviceId": 14
                },
                {
                    "serviceTargets": [
                        "7c30bc26-829e-4080-8059-27af9285113b",
                        "158a5544-78e3-4d00-9f1b-62a85a938268"
                    ],
                    "serviceId": 15
                },
                {
                    "serviceTargets": [
                        "4aa201ec-2066-40e1-a457-99daa569c8e2",
                        "f46f096a-a274-426b-adad-702e7cf8fab7",
                        "3b1403f3-139a-4206-b325-62ebfe05ddc4",
                        "7cb13c22-3dcd-43e7-808d-e0e26f5c090d"
                    ],
                    "serviceId": 16
                },
                {
                    "serviceTargets": [
                        "5c6db4c1-7fde-452e-8735-e52842fe6217",
                        "41cb1e2c-59bc-4639-8bf7-fe0f528e006e"
                    ],
                    "serviceId": 18
                },
                {
                    "serviceTargets": [
                        "4f71e00a-2d80-488d-9ce4-947e60589149",
                        "69a2ffba-41e9-406e-8ea4-5bdeee92cbde"
                    ],
                    "serviceId": 42
                },
                {
                    "serviceTargets": [
                        "26ea592f-ee39-4e6e-b6af-5b53fb1a5675"
                    ],
                    "serviceId": 17
                },
                {
                    "serviceTargets": [
                        "3587a984-68f9-4db3-b5af-49f265d853e0",
                        "9d2d01be-b517-4be2-a225-8b1c887e016e"
                    ],
                    "serviceId": 19
                },
                {
                    "serviceTargets": [
                        "d0516817-5acb-46bd-9871-2696c245bad0",
                        "7fed132d-6a38-448c-b519-381ab9e1e027",
                        "e08dda14-360c-4b66-b8c5-eb0269c5aa44",
                        "f3671aa7-773f-447d-9649-ba7f11dbe97a"
                    ],
                    "serviceId": 20
                },
                {
                    "serviceTargets": [
                        "5ab2b539-a5b4-40da-a556-a2c18066345b",
                        "36410625-05f3-42d3-b04f-a3b268498ee1"
                    ],
                    "serviceId": 23
                },
                {
                    "serviceTargets": [
                        "0162246b-13fd-40c9-ae26-fb767eee76f8"
                    ],
                    "serviceId": 24
                },
                {
                    "serviceTargets": [
                        "b9e710e4-7dd3-4acc-ac2c-c69f4bcb9787",
                        "00934509-f102-4d39-a043-7547a8ab9ac8",
                        "1021bec7-3836-4b33-90b4-76701efd4fe3",
                        "4dad393e-cbf7-43dd-87bb-62ea8f8afcdd"
                    ],
                    "serviceId": 26
                },
                {
                    "serviceTargets": [
                        "a516c78d-740f-463b-a1ce-5b02b8c82dd3",
                        "4cbcb2b5-45cd-42dc-96bf-a9a181a4865b",
                        "fbc45154-1d60-4f5e-a484-fdff514f9d51",
                        "85191c99-f56d-46e6-9311-a58c1f37965d"
                    ],
                    "serviceId": 27
                },
                {
                    "serviceTargets": [
                        "3cfa82aa-0b38-49c0-be37-0fa61b5b6e3c",
                        "91e90861-3ba7-4257-a765-6cab24c6f58a"
                    ],
                    "serviceId": 28
                },
                {
                    "serviceTargets": [
                        "96be68cf-783d-452a-b8fd-3832163f95db",
                        "e70c70fd-4f31-41dc-a4b4-07f79efc3055"
                    ],
                    "serviceId": 29
                },
                {
                    "serviceTargets": [
                        "598bd978-0907-4cad-a7a6-ec5a8a8bbdc4",
                        "d29bd931-1dd1-47c4-b456-c175099ff1df"
                    ],
                    "serviceId": 30
                },
                {
                    "serviceTargets": [
                        "6db1ebd7-92c5-49f2-98b7-2faa700fd752",
                        "524d93b4-5cd1-4d0d-b1f8-d393028220ad"
                    ],
                    "serviceId": 31
                },
                {
                    "serviceTargets": [
                        "8040931a-2e6c-41be-9e92-f1035093b2ac",
                        "5d652e6e-b719-45bf-8ae6-e9f293c24a92"
                    ],
                    "serviceId": 32
                },
                {
                    "serviceTargets": [
                        "f74182bd-7a53-4157-aeb9-eda281bb0234",
                        "e7b7bb1e-66c2-4140-90f9-9534aa46ffa3"
                    ],
                    "serviceId": 33
                },
                {
                    "serviceTargets": [
                        "15615a70-ee60-46b8-b5e9-b33d4d88de6b",
                        "d8dc153b-da23-4f7b-947a-89bc98338d6d",
                        "5f762c6d-4f42-4458-9855-03c6896959c1",
                        "5885f105-fc7d-43fd-8c26-c72938a95b76"
                    ],
                    "serviceId": 34
                },
                {
                    "serviceTargets": [
                        "dea1ff8b-f4eb-4987-8073-500bbbf97fcd",
                        "fba17df1-d5cb-4643-987f-0626055b3c78"
                    ],
                    "serviceId": 35
                },
                {
                    "serviceTargets": [
                        "3ec07754-4a7a-46fb-a76d-553921781716",
                        "fbc2dab8-7454-40f9-94f6-6bf258fcefff",
                        "7186e284-0cb2-418e-a8cc-4343eb618140"
                    ],
                    "serviceId": 36
                },
                {
                    "serviceTargets": [
                        "3d06b150-bb86-47dc-8ad8-c33a51c3e3b3"
                    ],
                    "serviceId": 43
                },
                {
                    "serviceTargets": [
                        "b8304577-afd8-45e0-8ef4-b71ae10998f5"
                    ],
                    "serviceId": 44
                },
                {
                    "serviceTargets": [
                        "9ed0ab84-6d04-4926-ae36-c75a8763e09b"
                    ],
                    "serviceId": 45
                },
                {
                    "serviceTargets": [
                        "8113ab8a-17e6-43c9-be32-9ca72dd01454"
                    ],
                    "serviceId": 6
                },
                {
                    "serviceTargets": [
                        "0e887410-a3c5-49ca-a6f5-0f2f6fae30db"
                    ],
                    "serviceId": 46
                }
            ]
        },
        "requiresActivityLocking": true,
        "projectTemplate": "rlp",
        "activityPeriodDescriptor": "Outputs report #",
        "requireMeritAdminToReturnMeriPlan": true,
        "emailTemplates": {
            "reportSubmittedEmailTemplate": "RLP_REPORT_SUBMITTED_EMAIL_TEMPLATE",
            "reportReturnedEmailTemplate": "RLP_REPORT_RETURNED_EMAIL_TEMPLATE",
            "planApprovedEmailTemplate": "RLP_PLAN_APPROVED_EMAIL_TEMPLATE",
            "planReturnedEmailTemplate": "RLP_PLAN_RETURNED_EMAIL_TEMPLATE",
            "reportApprovedEmailTemplate": "RLP_REPORT_APPROVED_EMAIL_TEMPLATE",
            "planSubmittedEmailTemplate": "RLP_PLAN_SUBMITTED_EMAIL_TEMPLATE"
        },
        "meriPlanTemplate": "configurableMeriPlan",
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
                "firstReportingPeriodEnd": "2022-09-30T14:00:00Z",
                "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportingPeriodInMonths": 3,
                "description": "_Please note that the reporting fields for these reports are currently being developed_",
                "label": "Quarter",
                "category": "Outputs Reporting",
                "activityType": "RLP Output Report",
                "canSubmitDuringReportingPeriod": true
            },
            {
                "firstReportingPeriodEnd": "2024-06-30T14:00:00Z",
                "reportType": "Administrative",
                "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
                "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
                "reportingPeriodInMonths": 12,
                "description": "_Please note that the reporting fields for these reports are currently being developed_",
                "label": "Annual",
                "category": "Annual Progress Reporting",
                "activityType": "RLP Annual Report"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "reportNameFormat": "Outcomes Report 1",
                "multiple": false,
                "alignToOwnerEnd": true,
                "description": "Before beginning Outcomes Report 1, please go to the Data set summary tab and complete a form for each data set collected for this project. Help with completing this form can be found in Section 10 of the [RLP MERIT User Guide](http://www.nrm.gov.au/my-project/monitoring-and-reporting-plan/merit)",
                "label": "Outcomes Report 1",
                "category": "Outcomes Report 1",
                "reportsAlignedToCalendar": false,
                "activityType": "RLP Short term project outcomes",
                "alignToOwnerStart": true
            }
        ],
        "keyThreatCodes": [
            "Climate Change - Changed flooding regime",
            "Climate Change - Changed rainfall patterns",
            "Climate Change - Sea level rises",
            "Climate Change - Unexpected seasonal/temperature extremes",
            "Disease/pathogens - Areas that are infected",
            "Disease/pathogens - Possible infection of disease free areas",
            "Fire - Inappropriate fire regime",
            "Fire - Lack of protection for ecological assets during fire control activities",
            "Genetics - Bottleneck/inbreeding",
            "Habitat loss - Breeding place disturbance",
            "Habitat loss - Dieback/senescence",
            "Habitat loss - Feeding habitat loss/interference",
            "Habitat loss - Habitat fragmentation",
            "Habitat loss - Land clearing",
            "Habitat loss - Loss of critical ecosystem service supporting habitat",
            "Human interference - Fish and harvesting aquatic resources (commercial)",
            "Human interference - Flow-on effects of housing development",
            "Human interference - Illegal activities",
            "Human interference - Industrial development",
            "Human interference - Land use intensification",
            "Human interference - Recreational fishing",
            "Human interference - Recreational pressures",
            "Human interference - Road/vehicle strike",
            "Land management practices - Changes to hydrology and aquatic systems",
            "Land management practices - Domestic grazing/stock impacts",
            "Land management practices - Excess recharge of groundwater",
            "Land management practices - Excess use (or over-use) of surface water or groundwater resources",
            "Land management practices - Excessive fertiliser use",
            "Land management practices - Inappropriate ground cover management",
            "Land management practices - Runoff",
            "Native fauna - Competition",
            "Native fauna - Predation",
            "Pest - Competition/exclusion",
            "Pest - Disease transmission",
            "Pest - Habitat degradation",
            "Pest - Introduction of new pest animals",
            "Pest - Predation",
            "Pollution - Chemical",
            "Pollution - Eutrophication/algal blooms",
            "Pollution - Inappropriate waste disposal",
            "Pollution - Sediment ",
            "Population size/range - Low habitat area",
            "Population size/range - Low population numbers",
            "Weeds - Competition",
            "Weeds - Introduction of new weed",
            "Weeds - Spread of weeds from surrounding areas"
        ],
        "navigationMode": "returnToProject",
        "priorityPlaces": [
            "Australian Alps – NSW/ACT/VIC",
            "Brigalow Country – QLD",
            "Bruny Island – TAS",
            "Christmas Island – External Territory",
            "Eastern Forests of Far North Queensland – QLD",
            "Fitz-Stirlings – WA",
            "French Island – VIC",
            "Giant Kelp Ecological Community – TAS",
            "Greater Blue Mountains – NSW",
            "Kakadu & West Arnhem – NT",
            "Kangaroo Island – SA",
            "MacDonnell Ranges – NT",
            "Mallee Birds Ecological Community – VIC/SA/NSW",
            "Midlands region of central Tasmanian – TAS",
            "Norfolk Island – External Territory",
            "Raine Island – Queensland",
            "Remnant WA Wheatbelt Woodlands – WA",
            "South East Coastal Ranges – NSW/VIC",
            "Southern Plains, including the Western Victorian volcanic plain and karst springs – VIC/SA",
            "Yampi Sounds and surrounds – WA"
        ],
        "supportsParatoo": true,
        "supportsMeriPlanHistory": true
    };

var priorities = [
    {
        "category": "Plants",
        "priority": "Adamson’s Blown-grass Lachnagrostis adamsonii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Adamson’s Blown-grass Lachnagrostis adamsonii"
    },
    {
        "category": "High Risk Species",
        "priority": "Adamson’s Blown-grass Lachnagrostis adamsonii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Ammonite Snail Ammoniropa vigens"
    },
    {
        "category": "Invertebrates",
        "priority": "Ammonite Snail Ammoniropa vigens"
    },
    {
        "category": "High Risk Species",
        "priority": "Ammonite Snail Ammoniropa vigens"
    },
    {
        "category": "Plants",
        "priority": "Angle-stemmed Myrtle Gossia gonoclada"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Angle-stemmed Myrtle Gossia gonoclada"
    },
    {
        "category": "High Risk Species",
        "priority": "Angle-stemmed Myrtle Gossia gonoclada"
    },
    {
        "category": "Plants",
        "priority": "Arckaringa Daisy Olearia arckaringensis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Arckaringa Daisy Olearia arckaringensis"
    },
    {
        "category": "High Risk Species",
        "priority": "Arckaringa Daisy Olearia arckaringensis"
    },
    {
        "category": "Reptiles",
        "priority": "Arnhem Land Gorges Skink Bellatorias obiri"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Arnhem Land Gorges Skink Bellatorias obiri"
    },
    {
        "category": "High Risk Species",
        "priority": "Arnhem Land Gorges Skink Bellatorias obiri"
    },
    {
        "category": "Birds",
        "priority": "Australasian Bittern Botaurus poiciloptilus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Australasian Bittern Botaurus poiciloptilus"
    },
    {
        "category": "High Risk Species",
        "priority": "Australasian Bittern Botaurus poiciloptilus"
    },
    {
        "category": "Mammals",
        "priority": "Australian Sea-lion Neophoca cinerea"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Australian Sea-lion Neophoca cinerea"
    },
    {
        "category": "High Risk Species",
        "priority": "Australian Sea-lion Neophoca cinerea"
    },
    {
        "category": "Reptiles",
        "priority": "Bellinger River Snapping Turtle Wollumbinia georgesi"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Bellinger River Snapping Turtle Wollumbinia georgesi"
    },
    {
        "category": "High Risk Species",
        "priority": "Bellinger River Snapping Turtle Wollumbinia georgesi"
    },
    {
        "category": "Birds",
        "priority": "Black-eared Miner Manorina melanotis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Black-eared Miner Manorina melanotis"
    },
    {
        "category": "High Risk Species",
        "priority": "Black-eared Miner Manorina melanotis"
    },
    {
        "category": "Plants",
        "priority": "Bolivia Hill Rice-flower, Pimelea venosa"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Bolivia Hill Rice-flower, Pimelea venosa"
    },
    {
        "category": "High Risk Species",
        "priority": "Bolivia Hill Rice-flower, Pimelea venosa"
    },
    {
        "category": "Plants",
        "priority": "Border Ranges Lined Fern Antrophyum austroqueenslandicum"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Border Ranges Lined Fern Antrophyum austroqueenslandicum"
    },
    {
        "category": "High Risk Species",
        "priority": "Border Ranges Lined Fern Antrophyum austroqueenslandicum"
    },
    {
        "category": "Mammals",
        "priority": "Brush-tailed Rock-wallaby Petrogale penicillata"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Brush-tailed Rock-wallaby Petrogale penicillata"
    },
    {
        "category": "High Risk Species",
        "priority": "Brush-tailed Rock-wallaby Petrogale penicillata"
    },
    {
        "category": "Plants",
        "priority": "Bulberin Nut Macadamia jansenii "
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Bulberin Nut Macadamia jansenii "
    },
    {
        "category": "High Risk Species",
        "priority": "Bulberin Nut Macadamia jansenii "
    },
    {
        "category": "Reptiles",
        "priority": "Canberra Grassland Earless Dragon Tympanocryptis lineata"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Canberra Grassland Earless Dragon Tympanocryptis lineata"
    },
    {
        "category": "High Risk Species",
        "priority": "Canberra Grassland Earless Dragon Tympanocryptis lineata"
    },
    {
        "category": "Birds",
        "priority": "Carnaby's Cockatoo Calyptorhynchus latirostris"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Carnaby's Cockatoo Calyptorhynchus latirostris"
    },
    {
        "category": "High Risk Species",
        "priority": "Carnaby's Cockatoo Calyptorhynchus latirostris"
    },
    {
        "category": "Plants",
        "priority": "Carrington Falls Pomaderris Pomaderris walshii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Carrington Falls Pomaderris Pomaderris walshii"
    },
    {
        "category": "High Risk Species",
        "priority": "Carrington Falls Pomaderris Pomaderris walshii"
    },
    {
        "category": "Invertebrates",
        "priority": "Cauliflower Soft Coral Dendronephthya australis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Cauliflower Soft Coral Dendronephthya australis"
    },
    {
        "category": "High Risk Species",
        "priority": "Cauliflower Soft Coral Dendronephthya australis"
    },
    {
        "category": "Mammals",
        "priority": "Central Rock-rat Antina Zyzomys pedunculatus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Central Rock-rat Antina Zyzomys pedunculatus"
    },
    {
        "category": "High Risk Species",
        "priority": "Central Rock-rat Antina Zyzomys pedunculatus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Christmas Island Blue-tailed skink Crytoblepharus egariae"
    },
    {
        "category": "Birds",
        "priority": "Christmas Island Goshawk Accipiter hiogaster natalis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Christmas Island Goshawk Accipiter hiogaster natalis"
    },
    {
        "category": "High Risk Species",
        "priority": "Christmas Island Goshawk Accipiter hiogaster natalis"
    },
    {
        "category": "Mammals",
        "priority": "Chuditch, Western Quoll Dasyurus geoffroii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Chuditch, Western Quoll Dasyurus geoffroii"
    },
    {
        "category": "High Risk Species",
        "priority": "Chuditch, Western Quoll Dasyurus geoffroii"
    },
    {
        "category": "Reptiles",
        "priority": "Collared Delma, Adorned Delma Delma torquata"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Collared Delma, Adorned Delma Delma torquata"
    },
    {
        "category": "High Risk Species",
        "priority": "Collared Delma, Adorned Delma Delma torquata"
    },
    {
        "category": "Plants",
        "priority": "Davies' Waxflower Phebalium daviesii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Davies' Waxflower Phebalium daviesii"
    },
    {
        "category": "High Risk Species",
        "priority": "Davies' Waxflower Phebalium daviesii"
    },
    {
        "category": "Birds",
        "priority": "Eastern Curlew Numenius madagascariensis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Eastern Curlew Numenius madagascariensis"
    },
    {
        "category": "High Risk Species",
        "priority": "Eastern Curlew Numenius madagascariensis"
    },
    {
        "category": "Mammals",
        "priority": "Eastern Quoll Dasyurus viverrinus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Eastern Quoll Dasyurus viverrinus"
    },
    {
        "category": "High Risk Species",
        "priority": "Eastern Quoll Dasyurus viverrinus"
    },
    {
        "category": "Invertebrates",
        "priority": "Eltham Copper Butterfly Paralucia pyrodiscus lucida"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Eltham Copper Butterfly Paralucia pyrodiscus lucida"
    },
    {
        "category": "High Risk Species",
        "priority": "Eltham Copper Butterfly Paralucia pyrodiscus lucida"
    },
    {
        "category": "Plants",
        "priority": "Foote's Grevillea Grevillea calliantha"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Foote's Grevillea Grevillea calliantha"
    },
    {
        "category": "High Risk Species",
        "priority": "Foote's Grevillea Grevillea calliantha"
    },
    {
        "category": "Plants",
        "priority": "Forked Spyridium Spyridium furculentum"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Forked Spyridium Spyridium furculentum"
    },
    {
        "category": "High Risk Species",
        "priority": "Forked Spyridium Spyridium furculentum"
    },
    {
        "category": "Fish",
        "priority": "Freshwater Sawfish Pristis pristis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Freshwater Sawfish Pristis pristis"
    },
    {
        "category": "High Risk Species",
        "priority": "Freshwater Sawfish Pristis pristis"
    },
    {
        "category": "Plants",
        "priority": "Giant Andersonia Andersonia axilliflora"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Giant Andersonia Andersonia axilliflora"
    },
    {
        "category": "High Risk Species",
        "priority": "Giant Andersonia Andersonia axilliflora"
    },
    {
        "category": "Invertebrates",
        "priority": "Giant Gippsland Earthworm Megascolides australis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Giant Gippsland Earthworm Megascolides australis"
    },
    {
        "category": "High Risk Species",
        "priority": "Giant Gippsland Earthworm Megascolides australis"
    },
    {
        "category": "Mammals",
        "priority": "Gilbert's Potoroo Ngilkat Potorous gilbertii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Gilbert's Potoroo Ngilkat Potorous gilbertii"
    },
    {
        "category": "High Risk Species",
        "priority": "Gilbert's Potoroo Ngilkat Potorous gilbertii"
    },
    {
        "category": "Invertebrates",
        "priority": "Glenelg Freshwater Mussel Hyridella glenelgensis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Glenelg Freshwater Mussel Hyridella glenelgensis"
    },
    {
        "category": "High Risk Species",
        "priority": "Glenelg Freshwater Mussel Hyridella glenelgensis"
    },
    {
        "category": "Birds",
        "priority": "Golden-shouldered Parrot, Alwal Psephotus chrysopterygius"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Golden-shouldered Parrot, Alwal Psephotus chrysopterygius"
    },
    {
        "category": "High Risk Species",
        "priority": "Golden-shouldered Parrot, Alwal Psephotus chrysopterygius"
    },
    {
        "category": "Plants",
        "priority": "Gorge Rice-flower, Pimelelea cremnophila"
    },
    {
        "category": "High Risk Species",
        "priority": "Gorge Rice-flower, Pimelelea cremnophila"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Gorge Rice-flower, Pimelea cremnophila"
    },
    {
        "category": "Plants",
        "priority": "Graveside Leek-orchid Prasophyllum taphanyx"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Graveside Leek-orchid Prasophyllum taphanyx"
    },
    {
        "category": "High Risk Species",
        "priority": "Graveside Leek-orchid Prasophyllum taphanyx"
    },
    {
        "category": "Reptiles",
        "priority": "Great Desert Skink, Tjakura, Warrarna, Mulyamiji Liopholis kintorei"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Great Desert Skink, Tjakura, Warrarna, Mulyamiji Liopholis kintorei"
    },
    {
        "category": "High Risk Species",
        "priority": "Great Desert Skink, Tjakura, Warrarna, Mulyamiji Liopholis kintorei"
    },
    {
        "category": "Mammals",
        "priority": "Greater Bilby Macrotis lagotis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Greater Bilby Macrotis lagotis"
    },
    {
        "category": "High Risk Species",
        "priority": "Greater Bilby Macrotis lagotis"
    },
    {
        "category": "Reptiles",
        "priority": "Green Turtle Chelonia mydas"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Green Turtle Chelonia mydas"
    },
    {
        "category": "High Risk Species",
        "priority": "Green Turtle Chelonia mydas"
    },
    {
        "category": "Fish",
        "priority": "Grey Nurse Shark (eastern) Carcharias taurus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Grey Nurse Shark (eastern) Carcharias taurus"
    },
    {
        "category": "High Risk Species",
        "priority": "Grey Nurse Shark (eastern) Carcharias taurus"
    },
    {
        "category": "Frogs",
        "priority": "Growling Grass Frog, Southern Bell Frog Litoria raniformis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Growling Grass Frog, Southern Bell Frog Litoria raniformis"
    },
    {
        "category": "High Risk Species",
        "priority": "Growling Grass Frog, Southern Bell Frog Litoria raniformis"
    },
    {
        "category": "High Risk Species",
        "priority": "Hooded Plover (eastern) Thinornis cucullatus cucullatus"
    },
    {
        "category": "Birds",
        "priority": "Hooded Plover (eastern) Thinornis cucullatus cucullatus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Hooded Plover (eastern) Thinornis cucullatus cucullatus"
    },
    {
        "category": "Plants",
        "priority": "Imlay Mallee Eucalyptus imlayensis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Imlay Mallee Eucalyptus imlayensis"
    },
    {
        "category": "High Risk Species",
        "priority": "Imlay Mallee Eucalyptus imlayensis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Kangaroo Island Assassin Spider Zephyrarchaea austini"
    },
    {
        "category": "High Risk Species",
        "priority": "Kangaroo Island Assassin Spider Zephyrarchaea austini"
    },
    {
        "category": "Mammals",
        "priority": "Kangaroo Island Echidna Tachyglossus aculeatus multiaculeatus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Kangaroo Island Echidna Tachyglossus aculeatus multiaculeatus"
    },
    {
        "category": "High Risk Species",
        "priority": "Kangaroo Island Echidna Tachyglossus aculeatus multiaculeatus"
    },
    {
        "category": "Plants",
        "priority": "King Blue-grass Dichanthium queenslandicum"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "King Blue-grass Dichanthium queenslandicum"
    },
    {
        "category": "High Risk Species",
        "priority": "King Blue-grass Dichanthium queenslandicum"
    },
    {
        "category": "Birds",
        "priority": "King Island Brown Thornbill Acanthiza pusilla archibaldi"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "King Island Brown Thornbill Acanthiza pusilla archibaldi"
    },
    {
        "category": "High Risk Species",
        "priority": "King Island Brown Thornbill Acanthiza pusilla archibaldi"
    },
    {
        "category": "Birds",
        "priority": "King Island Scrubtit Acanthornis magna greeniana"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "King Island Scrubtit Acanthornis magna greeniana"
    },
    {
        "category": "High Risk Species",
        "priority": "King Island Scrubtit Acanthornis magna greeniana"
    },
    {
        "category": "Mammals",
        "priority": "Koala Phascolarctos cinereus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Koala Phascolarctos cinereus"
    },
    {
        "category": "High Risk Species",
        "priority": "Koala Phascolarctos cinereus"
    },
    {
        "category": "Frogs",
        "priority": "Kroombit Tinker Frog Taudactylus pleione"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Kroombit Tinker Frog Taudactylus pleione"
    },
    {
        "category": "High Risk Species",
        "priority": "Kroombit Tinker Frog Taudactylus pleione"
    },
    {
        "category": "Plants",
        "priority": "Lax Leek Orchid Prasophyllum laxum"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Lax Leek Orchid Prasophyllum laxum"
    },
    {
        "category": "High Risk Species",
        "priority": "Lax Leek Orchid Prasophyllum laxum"
    },
    {
        "category": "Mammals",
        "priority": "Leadbeater’s Possum Gymnobelideus leadbeateri"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Leadbeater’s Possum Gymnobelideus leadbeateri"
    },
    {
        "category": "High Risk Species",
        "priority": "Leadbeater’s Possum Gymnobelideus leadbeateri"
    },
    {
        "category": "Reptiles",
        "priority": "Leaf-Scaled Seasnake – Aipysurus foliosquama"
    },
    {
        "category": "Plants",
        "priority": "Little Mountain Palm Lepidorrhachis mooreana"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Little Mountain Palm Lepidorrhachis mooreana"
    },
    {
        "category": "High Risk Species",
        "priority": "Little Mountain Palm Lepidorrhachis mooreana"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Lister's Gecko Lepidodactylus listeri"
    },
    {
        "category": "Invertebrates",
        "priority": "Lord Howe Island Phasmid Dryococelus australis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Lord Howe Island Phasmid Dryococelus australis"
    },
    {
        "category": "High Risk Species",
        "priority": "Lord Howe Island Phasmid Dryococelus australis"
    },
    {
        "category": "Plants",
        "priority": "MacDonnell Ranges Cycad Macrozamia macdonnellii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "MacDonnell Ranges Cycad Macrozamia macdonnellii"
    },
    {
        "category": "High Risk Species",
        "priority": "MacDonnell Ranges Cycad Macrozamia macdonnellii"
    },
    {
        "category": "Birds",
        "priority": "Malleefowl Leipoa ocellata"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Malleefowl Leipoa ocellata"
    },
    {
        "category": "High Risk Species",
        "priority": "Malleefowl Leipoa ocellata"
    },
    {
        "category": "Invertebrates",
        "priority": "Margaret River Burrowing Crayfish Engaewa pseudoreducta"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Margaret River Burrowing Crayfish Engaewa pseudoreducta"
    },
    {
        "category": "High Risk Species",
        "priority": "Margaret River Burrowing Crayfish Engaewa pseudoreducta"
    },
    {
        "category": "Fish",
        "priority": "Maugean Skate Zearaja maugeana"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Maugean Skate Zearaja maugeana"
    },
    {
        "category": "High Risk Species",
        "priority": "Maugean Skate Zearaja maugeana"
    },
    {
        "category": "Invertebrates",
        "priority": "Mount Lidgbird Charopid Land Snail Pseudocharopa ledgbirdi"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Mount Lidgbird Charopid Land Snail Pseudocharopa ledgbirdi"
    },
    {
        "category": "High Risk Species",
        "priority": "Mount Lidgbird Charopid Land Snail Pseudocharopa ledgbirdi"
    },
    {
        "category": "Frogs",
        "priority": "Mountain Frog Philoria kundagungan"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Mountain Frog Philoria kundagungan"
    },
    {
        "category": "High Risk Species",
        "priority": "Mountain Frog Philoria kundagungan"
    },
    {
        "category": "Mammals",
        "priority": "Mountain Pygmy-possum Burramys parvus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Mountain Pygmy-possum Burramys parvus"
    },
    {
        "category": "High Risk Species",
        "priority": "Mountain Pygmy-possum Burramys parvus"
    },
    {
        "category": "Frogs",
        "priority": "Mountain-top Nursery-frog Cophixalus monticola"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Mountain-top Nursery-frog Cophixalus monticola"
    },
    {
        "category": "High Risk Species",
        "priority": "Mountain-top Nursery-frog Cophixalus monticola"
    },
    {
        "category": "Fish",
        "priority": "Murray Hardyhead Craterocephalus fluviatilis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Murray Hardyhead Craterocephalus fluviatilis"
    },
    {
        "category": "High Risk Species",
        "priority": "Murray Hardyhead Craterocephalus fluviatilis"
    },
    {
        "category": "Plants",
        "priority": "Narrow-leaf Eremophila Eremophila subangustifolia"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Narrow-leaf Eremophila Eremophila subangustifolia"
    },
    {
        "category": "High Risk Species",
        "priority": "Narrow-leaf Eremophila Eremophila subangustifolia"
    },
    {
        "category": "Plants",
        "priority": "Native Guava Rhodomyrtus psidioides"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Native Guava Rhodomyrtus psidioides"
    },
    {
        "category": "High Risk Species",
        "priority": "Native Guava Rhodomyrtus psidioides"
    },
    {
        "category": "Mammals",
        "priority": "New Holland Mouse, Pookila Pseudomys novaehollandiae"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "New Holland Mouse, Pookila Pseudomys novaehollandiae"
    },
    {
        "category": "High Risk Species",
        "priority": "New Holland Mouse, Pookila Pseudomys novaehollandiae"
    },
    {
        "category": "Birds",
        "priority": "Night Parrot Pezoporus occidentalis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Night Parrot Pezoporus occidentalis"
    },
    {
        "category": "High Risk Species",
        "priority": "Night Parrot Pezoporus occidentalis"
    },
    {
        "category": "Birds",
        "priority": "Noisy Scrub-bird Atrichornis clamosus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Noisy Scrub-bird Atrichornis clamosus"
    },
    {
        "category": "High Risk Species",
        "priority": "Noisy Scrub-bird Atrichornis clamosus"
    },
    {
        "category": "Birds",
        "priority": "Norfolk Island Green Parrot Cyanoramphus cookii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Norfolk Island Green Parrot Cyanoramphus cookii"
    },
    {
        "category": "High Risk Species",
        "priority": "Norfolk Island Green Parrot Cyanoramphus cookii"
    },
    {
        "category": "Mammals",
        "priority": "Northern Brushtail Possum Trichosurus vulpecula arnhemensis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Northern Brushtail Possum Trichosurus vulpecula arnhemensis"
    },
    {
        "category": "High Risk Species",
        "priority": "Northern Brushtail Possum Trichosurus vulpecula arnhemensis"
    },
    {
        "category": "Mammals",
        "priority": "Northern Hairy-nosed Wombat, Yaminon Lasiorhinus krefftii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Northern Hairy-nosed Wombat, Yaminon Lasiorhinus krefftii"
    },
    {
        "category": "High Risk Species",
        "priority": "Northern Hairy-nosed Wombat, Yaminon Lasiorhinus krefftii"
    },
    {
        "category": "Mammals",
        "priority": "Northern Hopping-mouse, Woorrentinta Notomys aquilo"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Northern Hopping-mouse, Woorrentinta Notomys aquilo"
    },
    {
        "category": "High Risk Species",
        "priority": "Northern Hopping-mouse, Woorrentinta Notomys aquilo"
    },
    {
        "category": "Mammals",
        "priority": "Northern Quoll Dasyurus hallucatus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Northern Quoll Dasyurus hallucatus"
    },
    {
        "category": "High Risk Species",
        "priority": "Northern Quoll Dasyurus hallucatus"
    },
    {
        "category": "Mammals",
        "priority": "Numbat Myrmecobius fasciatus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Numbat Myrmecobius fasciatus"
    },
    {
        "category": "High Risk Species",
        "priority": "Numbat Myrmecobius fasciatus"
    },
    {
        "category": "Reptiles",
        "priority": "Olive Ridley Turtle Lepidochelys olivacea"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Olive Ridley Turtle Lepidochelys olivacea"
    },
    {
        "category": "High Risk Species",
        "priority": "Olive Ridley Turtle Lepidochelys olivacea"
    },
    {
        "category": "Birds",
        "priority": "Orange-bellied Parrot Neophema chrysogaster"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Orange-bellied Parrot Neophema chrysogaster"
    },
    {
        "category": "High Risk Species",
        "priority": "Orange-bellied Parrot Neophema chrysogaster"
    },
    {
        "category": "Invertebrates",
        "priority": "Pink Underwing Moth Phyllodes imperialis smithersi"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Pink Underwing Moth Phyllodes imperialis smithersi"
    },
    {
        "category": "High Risk Species",
        "priority": "Pink Underwing Moth Phyllodes imperialis smithersi"
    },
    {
        "category": "Birds",
        "priority": "Plains-wanderer Pedionomus torquatus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Plains-wanderer Pedionomus torquatus"
    },
    {
        "category": "High Risk Species",
        "priority": "Plains-wanderer Pedionomus torquatus"
    },
    {
        "category": "Birds",
        "priority": "Princess Parrot Polytelis alexandrae"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Princess Parrot Polytelis alexandrae"
    },
    {
        "category": "High Risk Species",
        "priority": "Princess Parrot Polytelis alexandrae"
    },
    {
        "category": "Reptiles",
        "priority": "Pygmy Blue-tongue Lizard Tiliqua adelaidensis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Pygmy Blue-tongue Lizard Tiliqua adelaidensis"
    },
    {
        "category": "High Risk Species",
        "priority": "Pygmy Blue-tongue Lizard Tiliqua adelaidensis"
    },
    {
        "category": "Mammals",
        "priority": "Quokka Setonix brachyurus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Quokka Setonix brachyurus"
    },
    {
        "category": "High Risk Species",
        "priority": "Quokka Setonix brachyurus"
    },
    {
        "category": "Birds",
        "priority": "Red Goshawk Erythrotriorchis radiatus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Red Goshawk Erythrotriorchis radiatus"
    },
    {
        "category": "High Risk Species",
        "priority": "Red Goshawk Erythrotriorchis radiatus"
    },
    {
        "category": "Fish",
        "priority": "Red Handfish Thymichthys politus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Red Handfish Thymichthys politus"
    },
    {
        "category": "High Risk Species",
        "priority": "Red Handfish Thymichthys politus"
    },
    {
        "category": "Birds",
        "priority": "Red-tailed Black Cockatoo (SE) Calyptorhynchus banksii graptogyne"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Red-tailed Black Cockatoo (SE) Calyptorhynchus banksii graptogyne"
    },
    {
        "category": "High Risk Species",
        "priority": "Red-tailed Black Cockatoo (SE) Calyptorhynchus banksii graptogyne"
    },
    {
        "category": "Fish",
        "priority": "Redfin Blue-eye Scaturiginichthys vermeilipinnis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Redfin Blue-eye Scaturiginichthys vermeilipinnis"
    },
    {
        "category": "High Risk Species",
        "priority": "Redfin Blue-eye Scaturiginichthys vermeilipinnis"
    },
    {
        "category": "Birds",
        "priority": "Regent Honeyeater Anthochaera phrygia"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Regent Honeyeater Anthochaera phrygia"
    },
    {
        "category": "High Risk Species",
        "priority": "Regent Honeyeater Anthochaera phrygia"
    },
    {
        "category": "Plants",
        "priority": "Scaly-butt Mallee Eucalyptus leprophloia"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Scaly-butt Mallee Eucalyptus leprophloia"
    },
    {
        "category": "High Risk Species",
        "priority": "Scaly-butt Mallee Eucalyptus leprophloia"
    },
    {
        "category": "Reptiles",
        "priority": "Short-nosed Seasnake Aipysurus apraefrontalis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Short-nosed Seasnake Aipysurus apraefrontalis"
    },
    {
        "category": "High Risk Species",
        "priority": "Short-nosed Seasnake Aipysurus apraefrontalis"
    },
    {
        "category": "Plants",
        "priority": "Small-flowered Snottygobble Persoonia micranthera"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Small-flowered Snottygobble Persoonia micranthera"
    },
    {
        "category": "High Risk Species",
        "priority": "Small-flowered Snottygobble Persoonia micranthera"
    },
    {
        "category": "Plants",
        "priority": "Smooth Davidson's Plum Davidsonia johnsonii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Smooth Davidson's Plum Davidsonia johnsonii"
    },
    {
        "category": "High Risk Species",
        "priority": "Smooth Davidson's Plum Davidsonia johnsonii"
    },
    {
        "category": "Frogs",
        "priority": "Southern Corroboree Frog Pseudophryne corroboree"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Southern Corroboree Frog Pseudophryne corroboree"
    },
    {
        "category": "High Risk Species",
        "priority": "Southern Corroboree Frog Pseudophryne corroboree"
    },
    {
        "category": "Mammals",
        "priority": "Spectacled Flying-fox Pteropus conspicillatus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Spectacled Flying-fox Pteropus conspicillatus"
    },
    {
        "category": "High Risk Species",
        "priority": "Spectacled Flying-fox Pteropus conspicillatus"
    },
    {
        "category": "Plants",
        "priority": "Stiff Groundsel Senecio behrianus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Stiff Groundsel Senecio behrianus"
    },
    {
        "category": "High Risk Species",
        "priority": "Stiff Groundsel Senecio behrianus"
    },
    {
        "category": "Plants",
        "priority": "Stirling Range Dryandra Banksia montana"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Stirling Range Dryandra Banksia montana"
    },
    {
        "category": "High Risk Species",
        "priority": "Stirling Range Dryandra Banksia montana"
    },
    {
        "category": "Fish",
        "priority": "Stocky Galaxias Galaxias tantangara"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Stocky Galaxias Galaxias tantangara"
    },
    {
        "category": "High Risk Species",
        "priority": "Stocky Galaxias Galaxias tantangara"
    },
    {
        "category": "Fish",
        "priority": "Swan Galaxias Galaxias fontanus"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Swan Galaxias Galaxias fontanus"
    },
    {
        "category": "High Risk Species",
        "priority": "Swan Galaxias Galaxias fontanus"
    },
    {
        "category": "Birds",
        "priority": "Swift Parrot Lathamus discolor"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Swift Parrot Lathamus discolor"
    },
    {
        "category": "High Risk Species",
        "priority": "Swift Parrot Lathamus discolor"
    },
    {
        "category": "Plants",
        "priority": "Tangled Wattle Acacia volubilis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Tangled Wattle Acacia volubilis"
    },
    {
        "category": "High Risk Species",
        "priority": "Tangled Wattle Acacia volubilis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Tasmanian Giant Freshwater Crayfish Astacopsis gouldi"
    },
    {
        "category": "Invertebrates",
        "priority": "Tasmanian Giant Freshwater Crayfish Astacopsis gouldi"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Tasmanian Devil Sarcophilus harrisii"
    },
    {
        "category": "High Risk Species",
        "priority": "Tasmanian Giant Freshwater Crayfish Astacopsis gouldi"
    },
    {
        "category": "Plants",
        "priority": "Waddy, Waddi, Waddy-wood, Birdsville Wattle Acacia peuce"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Waddy, Waddi, Waddy-wood, Birdsville Wattle Acacia peuce"
    },
    {
        "category": "High Risk Species",
        "priority": "Waddy, Waddi, Waddy-wood, Birdsville Wattle Acacia peuce"
    },
    {
        "category": "Birds",
        "priority": "Western Ground Parrot, Kyloring Pezoporus flaviventris"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Western Ground Parrot, Kyloring Pezoporus flaviventris"
    },
    {
        "category": "High Risk Species",
        "priority": "Western Ground Parrot, Kyloring Pezoporus flaviventris"
    },
    {
        "category": "Mammals",
        "priority": "Western Ringtail Possum Pseudocheirus occidentalis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Western Ringtail Possum Pseudocheirus occidentalis"
    },
    {
        "category": "High Risk Species",
        "priority": "Western Ringtail Possum Pseudocheirus occidentalis"
    },
    {
        "category": "Reptiles",
        "priority": "Western Swamp Tortoise Pseudemydura umbrina"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Western Swamp Tortoise Pseudemydura umbrina"
    },
    {
        "category": "High Risk Species",
        "priority": "Western Swamp Tortoise Pseudemydura umbrina"
    },
    {
        "category": "Frogs",
        "priority": "White-bellied Frog Anstisia alba"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "White-bellied Frog Anstisia alba"
    },
    {
        "category": "High Risk Species",
        "priority": "White-bellied Frog Anstisia alba"
    },
    {
        "category": "Birds",
        "priority": "White-throated Grasswren, Yirlinkirrkirr Amytornis woodwardi"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "White-throated Grasswren, Yirlinkirrkirr Amytornis woodwardi"
    },
    {
        "category": "High Risk Species",
        "priority": "White-throated Grasswren, Yirlinkirrkirr Amytornis woodwardi"
    },
    {
        "category": "Fish",
        "priority": "White's Seahorse Hippocampus whitei"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "White's Seahorse Hippocampus whitei"
    },
    {
        "category": "High Risk Species",
        "priority": "White's Seahorse Hippocampus whitei"
    },
    {
        "category": "Plants",
        "priority": "Wollemi Pine Wollemia nobilis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Wollemi Pine Wollemia nobilis"
    },
    {
        "category": "High Risk Species",
        "priority": "Wollemi Pine Wollemia nobilis"
    },
    {
        "category": "Plants",
        "priority": "Wongan Eriostemon Philotheca wonganensis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Wongan Eriostemon Philotheca wonganensis"
    },
    {
        "category": "High Risk Species",
        "priority": "Wongan Eriostemon Philotheca wonganensis"
    },
    {
        "category": "Plants",
        "priority": "Wood Well Spyridium Spyridium fontis-woodii"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Wood Well Spyridium Spyridium fontis-woodii"
    },
    {
        "category": "High Risk Species",
        "priority": "Wood Well Spyridium Spyridium fontis-woodii"
    },
    {
        "category": "Reptiles",
        "priority": "Yinnietharra Rock-dragon Ctenophorus yinnietharra"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Yinnietharra Rock-dragon Ctenophorus yinnietharra"
    },
    {
        "category": "High Risk Species",
        "priority": "Yinnietharra Rock-dragon Ctenophorus yinnietharra"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Alpine Sphagnum Bogs and Associated Fens"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Aquatic Root Mat Community 1 in Caves of the Leeuwin Naturaliste Ridge"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Aquatic Root Mat Community 2 in Caves of the Leeuwin Naturaliste Ridge"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Aquatic Root Mat Community 3 in Caves of the Leeuwin Naturaliste Ridge"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Aquatic Root Mat Community 4 in Caves of the Leeuwin Naturaliste Ridge"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Aquatic Root Mat Community in Caves of the Swan Coastal Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Araluen Scarp Grassy Forest"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Arnhem Plateau Sandstone Shrubland Complex"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Assemblages of plants and invertebrate animals of tumulus (organic mound) springs of the Swan Coastal Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Assemblages of species associated with open-coast salt-wedge estuaries of western and central Victoria ecological community"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Banksia Woodlands of the Swan Coastal Plain ecological community"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Ben Halls Gap Sphagnum Moss Cool Temperate Rainforest"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Blue Gum High Forest of the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Brigalow (Acacia harpophylla dominant and co-dominant)"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Broad leaf tea-tree (Melaleuca viridiflora) woodlands in high rainfall coastal north Queensland"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Brogo Vine Forest of the South East Corner Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Buloke Woodlands of the Riverina and Murray-Darling Depression Bioregions"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Castlereagh Scribbly Gum and Agnes Banks Woodlands of the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Central Hunter Valley eucalypt forest and woodland"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Clay Pans of the Swan Coastal Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Coastal Swamp Oak (Casuarina glauca) Forest of New South Wales and South East Queensland ecological community"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Coastal Swamp Sclerophyll Forest of New South Wales and South East Queensland"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Coastal Upland Swamps in the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Cooks River/Castlereagh Ironbark Forest of the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Coolibah - Black Box Woodlands of the Darling Riverine Plains and the Brigalow Belt South Bioregions"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Corymbia calophylla - Kingia australis woodlands on heavy soils of the Swan Coastal Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Corymbia calophylla - Xanthorrhoea preissii woodlands and shrublands of the Swan Coastal Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Cumberland Plain Shale Woodlands and Shale-Gravel Transition Forest"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Drooping sheoak grassy woodland on calcrete of the Eyre Yorke Block Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Dunn's white gum (Eucalyptus dunnii) moist forest in north-east New South Wales and south-east Queensland"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Eastern Stirling Range Montane Heath and Thicket"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Eastern Suburbs Banksia Scrub of the Sydney Region"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Elderslie Banksia Scrub Forest in the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Empodisma peatlands of southwestern Australia"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Eucalypt Woodlands of the Western Australian Wheatbelt"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Eucalypt Woodlands of the Western Australian Wheatbelt"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Eucalyptus ovata - Callitris oblonga Forest"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Eyre Peninsula Blue Gum (Eucalyptus petiolaris) Woodland"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Giant Kelp Marine Forests of South East Australia"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Gippsland Red Gum (Eucalyptus tereticornis subsp. mediana) Grassy Woodland and Associated Native Grassland"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Grassy Eucalypt Woodland of the Victorian Volcanic Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Grey Box (Eucalyptus microcarpa) Grassy Woodlands and Derived Native Grasslands of South-eastern Australia"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Grey box-grey gum wet forest of subtropical eastern Australia"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Honeymyrtle shrubland on limestone ridges of the Swan Coastal Plain Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Hunter Valley Weeping Myall (Acacia pendula) Woodland"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Illawarra and south coast lowland forest and woodland ecological community"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Illawarra-Shoalhaven Subtropical Rainforest of the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Iron-grass Natural Temperate Grassland of South Australia"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Kangaroo Island Narrow-leaved Mallee (Eucalyptus cneorifolia) Woodland"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Karst springs and associated alkaline fens of the Naracoorte Coastal Plain Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Kurri sand swamp woodland of the Sydney Basin bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Littoral Rainforest and Coastal Vine Thickets of Eastern Australia"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Long lowland rivers of south eastern Queensland and northern New South Wales"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Lowland Grassy Woodland in the South East Corner Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Lowland Native Grasslands of Tasmania"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Lowland Rainforest of Subtropical Australia"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Lowland tropical rainforest of the Wet Tropics"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Mabi Forest (Complex Notophyll Vine Forest 5b)"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Mallee Bird Community of the Murray Darling Depression Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Monsoon vine thickets on the coastal sand dunes of Dampier Peninsula"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Mount Kaputar land snail and slug community"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Natural Damp Grassland of the Victorian Coastal Plains"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Natural Grasslands of the Murray Valley Plains"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Natural Grasslands of the Queensland Central Highlands and northern Fitzroy Basin"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Natural Temperate Grassland of the South Eastern Highlands"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Natural Temperate Grassland of the Victorian Volcanic Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Natural grasslands on basalt and fine-textured alluvial plains of northern New South Wales and southern Queensland"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "New England Peppermint (Eucalyptus nova-anglica) Grassy Woodlands"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Peppermint Box (Eucalyptus odorata) Grassy Woodland of South Australia"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Perched Wetlands of the Wheatbelt region with extensive stands of living sheoak and paperbark across the lake floor (Toolibin Lake)"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Plains mallee box woodlands of the Murray Darling Depression, Riverina and Naracoorte Coastal Plain Bioregions"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Poplar Box Grassy Woodland on Alluvial Plains"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Posidonia australis seagrass meadows of the Manning-Hawkesbury ecoregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Proteaceae Dominated Kwongkan Shrublands of the Southeast Coastal Floristic Province of Western Australia"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "River Murray and associated wetlands, floodplains and groundwater systems, from the junction with the Darling River to the sea"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "River-flat eucalypt forest on coastal floodplains of southern New South Wales and eastern Victoria"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Robertson Rainforest in the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Scott River Ironstone Association"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Seasonal Herbaceous Wetlands (Freshwater) of the Temperate Lowland Plains"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Sedgelands in Holocene dune swales of the southern Swan Coastal Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Semi-evergreen vine thickets of the Brigalow Belt (North and South) and Nandewar Bioregions"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Shale Sandstone Transition Forest of the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Shrublands and Woodlands of the eastern Swan Coastal Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Shrublands and Woodlands on Muchea Limestone of the Swan Coastal Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Shrublands and Woodlands on Perth to Gingin ironstone (Perth to Gingin ironstone association) of the Swan Coastal Plain"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Shrublands on southern Swan Coastal Plain ironstones"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Silurian Limestone Pomaderris Shrubland of the South East Corner and Australian Alps Bioregions"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Southern Highlands Shale Forest and Woodland in the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Subtropical and Temperate Coastal Saltmarsh"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Subtropical eucalypt floodplain forest and woodland of the New South Wales North Coast and South East Queensland bioregions"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Swamp Tea-tree (Melaleuca irbyana) Forest of South-east Queensland"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Swamps of the Fleurieu Peninsula"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Tasmanian Forests and Woodlands dominated by black gum or Brookers gum (Eucalyptus ovata / E. brookeriana)"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Tasmanian white gum (Eucalyptus viminalis) wet forest"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Temperate Highland Peat Swamps on Sandstone"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "The community of native species dependent on natural discharge of groundwater from the Great Artesian Basin"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Thrombolite (microbial) community of coastal freshwater lakes of the Swan Coastal Plain (Lake Richmond)"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Thrombolite (microbialite) Community of a Coastal Brackish Lake (Lake Clifton)"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Tuart (Eucalyptus gomphocephala) Woodlands and Forests of the Swan Coastal Plain ecological community"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Turpentine-Ironbark Forest of the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Upland Basalt Eucalypt Forests of the Sydney Basin Bioregion"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Upland Wetlands of the New England Tablelands (New England Tableland Bioregion) and the Monaro Plateau (South Eastern Highlands Bioregion)"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Warkworth Sands Woodland of the Hunter Valley"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Weeping Myall Woodlands"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Western Sydney Dry Rainforest and Moist Woodland on Shale"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "Wetlands and inner floodplains of the Macquarie Marshes"
    },
    {
        "category": "Threatened Ecological Communities",
        "priority": "White Box-Yellow Box-Blakely's Red Gum Grassy Woodland and Derived Native Grassland"
    }
];

var outcomes = [
    {
        "priorities": [
            {
                "category": "Priority Threatened Species Primary"
            }
        ],
        "targeted": true,
        "shortDescription": "EPBC Species",
        "category": "Threatened Species",
        "outcome": "Conserve, protect and sustainably manage Australia’s biodiversity, ecosystems, environment and heritage through research, management, supporting natural resource management, establishing and managing Commonwealth protected areas, and reducing and regulating the use of pollutants and hazardous substances"
    },
    {
        "priorities": [
            {
                "category": "Priority Threatened Species Primary"
            }
        ],
        "targeted": true,
        "shortDescription": "EPBC Species",
        "category": "Threatened Species",
        "type": "secondary",
        "outcome": "1.  Species and Landscapes (Long term): Threatened Species (TS) - The trajectory of species targeted under the Threatened Species Action Plan 2022-2032 and other EPBC Act listed Species is improved"
    },
    {
        "priorities": [
            {
                "category": "Priority Threatened Species Primary"
            }
        ],
        "shortDescription": "New extinctions",
        "category": "Threatened Species",
        "type": "secondary",
        "outcome": "2.  Species and Landscapes (Long term): Threatened Species (TS) - New extinctions of plants and animals are prevented"
    },
    {
        "priorities": [
            {
                "category": "Threatened Ecological Communities"
            }
        ],
        "targeted": true,
        "shortDescription": "Threatened Ecological Communities",
        "category": "Threatened Ecological Communities",
        "type": "secondary",
        "outcome": "3. Species and Landscapes (Long term): Threatened Ecological Communities (TECs) and priority places - The condition of targeted EPBC Act listed Threatened Ecological Communities and identified priority places under the Threatened Species Action Plan 2022-2032 is improved"
    },
    {
        "type": "short",
        "category": "Priority species related outcome",
        "outcome": "All priority species are on track for improved trajectory"
    },
    {
        "type": "short",
        "category": "Priority species related outcome",
        "outcome": "Implementation of priority actions for priority species is tracked and published"
    },
    {
        "type": "short",
        "category": "Priority species related outcome",
        "outcome": "At least 5 new tools are developed to mitigate the impact of broad-scale threats on threatened species"
    },
    {
        "type": "short",
        "category": "Priority species related outcome",
        "outcome": "Species at high risk of imminent extinction are identified and supported to persist"
    },
    {
        "type": "short",
        "category": "Priority species related outcome",
        "outcome": "Feral cats and foxes are managed across all important habitats for susceptible priority species using best practice methods"
    },
    {
        "type": "short",
        "category": "Priority species related outcome",
        "outcome": "Impacts of climate change on priority species and places are identified and actions are underway to strengthen resilience and adaptive capacity"
    },
    {
        "type": "short",
        "category": "Priority species related outcome",
        "outcome": "First Nations-led recovery activities for threatened species and ecological communities are increased"
    },
    {
        "type": "short",
        "category": "Priority species related outcome",
        "outcome": "First Nations’ knowledges are integrated in conservation assessments, processes and planning for threatened species and ecological communities"
    },
    {
        "type": "short",
        "category": "Priority species related outcome",
        "outcome": "At least half the number of projects that benefit priority species and priority places receive private investment or support from partners"
    },
    {
        "type": "short",
        "category": "Priority species related outcome",
        "outcome": "Community groups lead or participate in recovery activities for all accessible priority species and places, including through citizen science"
    }
];

//Create the parent program
let programName = "Saving Native Species";
var parent = createOrFindProgram(programName);
var subprograms = ["Threat Innovation - Procurements"]

subprograms.forEach(function (subProgram){
    createOrFindProgram(subProgram, parent._id);
});

subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        print("sub program ID: " + p.programId)
        db.program.updateOne({programId:p.programId}, {$set:{config:config, outcomes:outcomes, priorities:priorities}});
        useNhtServiceLabels(p.name);
    }
});

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
                "template": "additionalOutcomes",
                "model": {
                    "outcomePriority": "Additional outcome/s",
                    "helpTextHeading": "If the project is not delivering additional benefits, delete the row using the 'x' in the right-most column.",
                    "title": "Additional benefits",
                    "priority": "Additional Investment Priorities",
                    "priorityHelpText": "Other investment priorities that will benefit from the project.  Delete the row if there are no additional outcomes."
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
            "serviceFormName": "Procurement Output Report",
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
                "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportingPeriodInMonths": 6,
                "description": "",
                "minimumReportDurationInDays": 3,
                "label": "Semester",
                "category": "Outputs Reporting",
                "activityType": "Procurement Output Report",
                "reportsAlignedToCalendar": true,
                "canSubmitDuringReportingPeriod": true
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Final Report",
                "reportNameFormat": "Final Report",
                "reportingPeriodInMonths": 0,
                "multiple": false,
                "description": "",
                "alignToOwnerEnd": true,
                "label": "Final Report",
                "category": "Final Report",
                "reportsAlignedToCalendar": false,
                "activityType": "Grants and Others Final Report",
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
        "category": "Plants and animals extinction prevention",
        "priority": "A shrub (Kardomia granitica)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Abba Bell (Darwinia whicherensis)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Backhousia tetraptera"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Backhousia hughesii (Grey Teak)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Brumby Mallee-gum (Eucalyptus phoenix)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Chapman's Bell (Darwinia chapmaniana)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Chittering Myrtle (Hypocalymma sylvestre)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Coast featherflower or Barrens featherflower (Verticordia helicrysantha)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Cranbrook Bell (Darwinia meeboldii)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Dalveen Blue Box (Eucalyptus dalveenica)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Dandaragan Mallee, Mount Misery Mallee (Eucalyptus dolorosa)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Gingin Wax (Chamelaucium lullfitzii)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Gossia lewisensis (Myrteae)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Harlequin Bell (Darwinia polychroma)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Homoranthus bruhlii"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Homoranthus elusus"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Homoranthus floydii"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Homoranthus lunatus"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Homoranthus prolixus"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Johnson's Mallee (Eucalyptus johnsoniana)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Lenwebbia lasioclada  (Velvet Myrtle)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Little Pine Verticordia, Pine-like Featherflower (Verticordia pityrhops)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Long-stalked Featherflower (Verticordia. densiflora var. pedunculata)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "McDowall’s Galaxias (Galaxias mcdowalli)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Mogumber Bell, Narrogin Bell (Darwinia carnea)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Mountain White Gum, King Leopold Range Mallee, Moore's Gum (Eucalyptus mooreana)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Muchea Bell (Darwinia foetida)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Mukarrthippi Grasswren (Amytornis striatus striatus)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Pink Mountain Bell (Darwinia squarrosa)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Pugh's Mountain Frog (Philoria pughi)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Rhodamnia arenaria (Myrteae)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Rhodamnia pauciovulata (Myrteae)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Rhodomyrtus effuse"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Ristantia pachysperma (Yellow Penda)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Scarp Darwinia (Darwinia apiculate)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Seppelt Range gum or Seppelt Range yellow-jacket (Eucalyptus ceraceae)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Shaw Galaxias (Galaxias gunaikurnai)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Stirling Range Featherflower (Verticordia carinata)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Superb Myrtle  (Hypocalymma magnificum (formerly Hypocalymma sp Cascade (R. Bruhn 20896))"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Tapered Galaxias (Galaxias lanceolatus)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Tufted Plumed Featherflower (Verticordia Plumosa var. ananeotes)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Tasmanian Live-bearing Seastar (Parvulastra vivipara)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Verticordia crebra (Verticordia crebra)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Verticordia staminosa subsp. cylindracea var. erecta"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Victorian Grassland Earless Dragon (Tympanocryptis pinguicolla)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "West Gippsland Galaxias (Galaxias longifundus)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Wongan Featherflower (Verticordia staminosa subsp. Staminosa)"
    },
    {
        "category": "Plants and animals extinction prevention",
        "priority": "Yalmy Galaxias (Galaxias sp. nov. ‘Yalmy’)"
    }
];

var outcomes = [
    {
        "priorities": [
            {
                "category": "Plants and animals extinction prevention"
            },
            {
                "category": "Threatened Species"
            }
        ],
        "targeted": true,
        "shortDescription": "Prevent new extinctions of plants and animals",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "1. Species and Landscapes (Long term): Threatened Species (TS) - New extinctions of plants and animals are prevented"
    },
    {
        "type": "short",
        "category": "Emergency actions related outcome",
        "outcome": "All priority species are on track for improved trajectory"
    },
    {
        "type": "short",
        "category": "Emergency actions related outcome",
        "outcome": "Implementation of priority actions for priority species is tracked and published"
    },
    {
        "type": "short",
        "category": "Emergency actions related outcome",
        "outcome": "Species at high risk of imminent extinction are identified and supported to persist"
    },
    {
        "type": "short",
        "category": "Emergency actions related outcome",
        "outcome": "National conservation planning for threatened species and ecological communities is contemporary, effective and fit-for-purpose"
    }
];

//Create the parent program
let programName = "Saving Native Species";
var parent = createOrFindProgram(programName);
var subprograms = ["Emergency Actions for Threatened Species - Procurements"]

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

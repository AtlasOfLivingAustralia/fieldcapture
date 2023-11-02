load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
var userId = '';

const serviceFormName = "NHT Output Report";
const annualReportFormName = "NHT Annual Report";
const outcomes1ReportFormName = "NHT Outcomes 1 Report";
const outcomes2ReportFormName = "NHT Outcomes 2 Report";

var config =
    {
        "excludes": [],
        "programServiceConfig": {
            "serviceFormName": serviceFormName,
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
                }
            ]

        },
        "visibility": "public",
        "declarationPageType": "rdpReportDeclaration",
        "requiresActivityLocking": true,
        "supportsMeriPlanComparison": true,
        "projectTemplate": "rlp",
        "activityPeriodDescriptor": "Outputs report #",
        "supportsParatoo": true,
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
                "firstReportingPeriodEnd": "2023-12-31T13:00:00Z",
                "reportDescriptionFormat": "Progress Report %1d",
                "reportNameFormat": "Progress Report %1d",
                "reportingPeriodInMonths": 6,
                "description": "_Please note that the reporting fields for these reports are currently being developed_",
                "minimumReportDurationInDays": 3,
                "label": "Semester",
                "category": "Progress Reports",
                "activityType": "Progress Report",
                "reportsAlignedToCalendar": true,
                "canSubmitDuringReportingPeriod": true
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Final Report",
                "reportNameFormat": "Final Report",
                "reportingPeriodInMonths": 0,
                "multiple": false,
                "description": "_Please note that the reporting fields for these reports are currently being developed_",
                "alignToOwnerEnd": true,
                "label": "Final Report",
                "category": "Final Report",
                "reportsAlignedToCalendar": false,
                "activityType": "Final Report",
                "alignToOwnerStart": true
            }
        ],
        "navigationMode": "returnToProject",
        "supportsMeriPlanHistory": true,
        "requireMeritAdminToReturnMeriPlan":true,
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
                    "priorityPlaceLabel":"Does this project directly support a priority place?",
                    "priorityPlaceHelpText":"Priority places recognises that some threatened species share the same habitat, and that place-based action can support protection and recovery of more than one species."
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
                    "title": "Additional benefits",
                    "helpTextHeading":"If the project is not delivering additional benefits, delete the row using the 'x' in the right-most column.",
                    "outcomePriority":"Additional outcome/s",
                    "priority":"Additional Investment Priorities",
                    "priorityHelpText":"Other investment priorities that will benefit from the project.  Delete the row if there are no additional outcomes."
                }
            },
            {
                "template": "outcomeStatements",
                "model": {
                    "outcomeType": "mid",
                    "subtitle": "Medium-term outcome statement/s",
                    "title": "Project Outcomes",
                    "extendedOutcomes": true,
                    "helpText":"Projects more than 3 years in duration must set medium-term Project outcomes achievable at project completion. Ensure proposed outcomes are measurable with consideration to the baseline and proposed monitoring regime",
                    "minimumNumberOfOutcomes": 0
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
                    "title":"Key threat(s) and/or key threatening processes",
                    "threatHelpText":"Describe the key threats or key threatening processes to the investment priority",
                    "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance",
                    "interventionHelpText":"Describe the proposed method to address the threat or threatening process",
                    "servicesHelpText": "Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables"
                }
            },
            {
                "template": "projectMethodology",
                "model": {
                    "maxSize": "4000",
                    "tableHeading": "Project delivery assumptions (4000 character limit [approx. 650 words])",
                    "helpText": "Include all those conditions or factors that are sufficient to guarantee the success of the project, for example, on ground activities were not impacted by adverse weather conditions. Ensure what’s documented here aligns to those assumptions documented within the Project Logic."
                }
            },
            {
                "template": "projectPartnerships",
                "model": {
                    "helpTextPartnerName":"Insert name of project partner. To be a project partner, they need to be actively involved in the planning or delivery of the project",
                    "helpTextHeading":"Note: Not limited to key subcontractors."
                }
            },
            {
                "template": "extendedBaselineMonitoring",
                "model": {
                    "approachHeading": "Monitoring method",
                    "indicatorHeading": "Monitoring methodology",
                    "baselineDataHelpText": "Existing baseline data needs to be based on best practice methods and be compatible with the EMSA protocols.",
                    "baselineDataDescriptionHelpText": "Describe the project baseline to be established, or the baseline data that currently exists",
                    "baselineServiceHelpText": "Select the relevant Project Service(s)/Target measure(s) that will be used to support the development of the baseline",
                    "monitoringServiceHelpText": "Select the relevant Project Services(s)/Target measure(s) that will be used to support ongoing monitoring",
                    "baselineMethodHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
                    "approachHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
                    "titleHelpText": "Describe the Project Baseline(s) and ongoing monitoring which will be used to report progress towards this projects outcome(s).  Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables",
                    "newIndicatorText": "New monitoring indicator",
                    "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance"
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
                    "title": "Project services and targets",
                    "serviceName": "Service",
                    "titleHelpText":"Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections"
                }
            },
            {
                "template": "serviceForecasts",
                "excludedModes":["PRINT"],
                "model": {
                    "titleHelpText":"Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections"
                }

            }
        ],
        keyThreatCodes: [
            'Climate Change - Changed flooding regime',
            'Climate Change - Changed rainfall patterns',
            'Climate Change - Sea level rises',
            'Climate Change - Unexpected seasonal/temperature extremes',
            'Disease/pathogens - Areas that are infected',
            'Disease/pathogens - Possible infection of disease free areas',
            'Fire - Inappropriate fire regime',
            'Fire - Lack of protection for ecological assets during fire control activities',
            'Genetics - Bottleneck/inbreeding',
            'Habitat loss - Breeding place disturbance',
            'Habitat loss - Dieback/senescence',
            'Habitat loss - Feeding habitat loss/interference',
            'Habitat loss - Habitat fragmentation',
            'Habitat loss - Land clearing',
            'Habitat loss - Loss of critical ecosystem service supporting habitat',
            'Human interference - Fish and harvesting aquatic resources (commercial)',
            'Human interference - Flow-on effects of housing development',
            'Human interference - Illegal activities',
            'Human interference - Industrial development',
            'Human interference - Land use intensification',
            'Human interference - Recreational fishing',
            'Human interference - Recreational pressures',
            'Human interference - Road/vehicle strike',
            'Land management practices - Changes to hydrology and aquatic systems',
            'Land management practices - Domestic grazing/stock impacts',
            'Land management practices - Excess recharge of groundwater',
            'Land management practices - Excess use (or over-use) of surface water or groundwater resources',
            'Land management practices - Excessive fertiliser use',
            'Land management practices - Inappropriate ground cover management',
            'Land management practices - Runoff',
            'Native fauna - Competition',
            'Native fauna - Predation',
            'Pest - Competition/exclusion',
            'Pest - Disease transmission',
            'Pest - Habitat degradation',
            'Pest - Introduction of new pest animals',
            'Pest - Predation',
            'Pollution - Chemical',
            'Pollution - Eutrophication/algal blooms',
            'Pollution - Inappropriate waste disposal',
            'Pollution - Sediment ',
            'Population size/range - Low habitat area',
            'Population size/range - Low population numbers',
            'Weeds - Competition',
            'Weeds - Introduction of new weed',
            'Weeds - Spread of weeds from surrounding areas'
        ],
        priorityPlaces: [
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
        ]

    };


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
        "outcome": "1. The trajectory of species targeted under the Threatened Species Action Plan 2022-2032 and other EPBC Act listed Species is improved"
    },
    {
        "priorities": [
            {
                "category": "Priority Threatened Species Primary"
            }
        ],
        "shortDescription": "New extinctions",
        "category": "Threatened Species",
        "outcome": "2. New extinctions of plants and animals are prevented"
    },
    {
        "priorities": [
            {
                "category": "Threatened Ecological Communities"
            }
        ],
        "shortDescription": "Threatened Ecological Communities",
        "category": "Threatened Ecological Communities",
        "outcome": "3. The condition of targeted EPBC Act listed Threatened Ecological Communities and identified priority places under the Threatened Species Action Plan 2022-2032 is improved"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Targeted threatened species (TS) are on track for improved trajectory"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "2.  Species and Landscapes (Medium term): Threatened species - Species at high risk of imminent extinction are identified and supported to persist"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "3.  Species and Landscapes (Medium term): Threatened species - Priority species are being assisted to strengthen reliance and adaptive capacity for climate change"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "4.  Species and Landscapes (Medium term): Threatened species - Increased leadership and/or participation of First Nations people in the management and recovery of threatened species"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "5.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - The implementation of priority actions is leading to an improvement in the condition of targeted TECs and priority places"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "6.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - Resilience to climate change and extreme events has been increased"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "7.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - Increased leadership and/or participation of First Nations people in the management and recovery of threatened ecological communities and priority places"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Managing Threats - Pest predator an competitor species have been controlled or are under active, long-term control programs"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "2.  Species and Landscapes (Short term): Managing Threats - Threats from disease have been contained, reduced or excluded"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "3.  Species and Landscapes (Short term): Improving habitat - Land management practices have improved"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "4.  Species and Landscapes (Short term): Improving habitat - Quality of (TS/TECs) habitat has improved"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "5.  Species and Landscapes (Short term): Improving habitat - Area/Extent of (TS/TECs) habitat has increased"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "6.  Species and Landscapes (Short term): Improving habitat - Increased connectivity between patches"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "7.  Species and Landscapes (Short term): Improving habitat - Quality of breeding and foraging habitat is improved   "
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "8.  Species and Landscapes (Short term): Creating insurance populations - Existing populations have been protected"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "9.  Species and Landscapes (Short term): Creating insurance populations - Re-introductions have enhanced wild populations"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "10.  Species and Landscapes (Short term): Climate adaption and resilience - Climate change resilience and adaptive capacity actions underway"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "11.  Species and Landscapes (Short term): First Nations People and community involvement - First Nations people are leading and/or participating in recovery activities"
    }
];

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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
        "priority": "Central Rock-rat Antina Zyzomys pedunculatus"
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
        "priority": "Golden-shouldered Parrot, Alwal Psephotus chrysopterygius"
    },
    {
        "category": "Plants",
        "priority": "Gorge Rice-flower, Pimelelea cremnophila"
    },
    {
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
        "priority": "Growling Grass Frog, Southern Bell Frog Litoria raniformis"
    },
    {
        "category": "Target 3",
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
        "category": "Target 3",
        "priority": "Imlay Mallee Eucalyptus imlayensis"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Kangaroo Island Assassin Spider Zephyrarchaea austini"
    },
    {
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
        "priority": "Little Mountain Palm Lepidorrhachis mooreana"
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
        "priority": "Tangled Wattle Acacia volubilis"
    },
    {
        "category": "Invertebrates",
        "priority": "Tasmanian Giant Freshwater Crayfish Astacopsis gouldi"
    },
    {
        "category": "Priority Threatened Species Primary",
        "priority": "Tasmanian Giant Freshwater Crayfish Astacopsis gouldi"
    },
    {
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
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
        "category": "Target 3",
        "priority": "Yinnietharra Rock-dragon Ctenophorus yinnietharra"
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
    }
];

let parentProgram = "Saving Native Species";
var subprograms = ["Gamba Grass Control"]

var parent = db.program.find({name: parentProgram}).next();
subprograms.forEach(function (subProgram){
    var now = ISODate();
    var p = {name: subProgram, programId: UUID.generate(), dateCreated: now, lastUpdate: now, parent: parent._id, status: "active"}
    var program = db.program.find({name: subProgram})
    if (!program.hasNext()) {
        db.program.insertOne(p);
    } else {
        print("Program Already Exist: " + subProgram)
    }
});

subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        print("sub program ID: " + p.programId)
        db.program.updateOne({programId:p.programId}, {$set:{config:config, outcomes:outcomes, priorities:priorities}});
    }
});



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
                    "priority": "Additional investment priorities",
                    "priorityHelpText": "Other investment priorities that will benefit from the project.  Delete the row if there are no additional outcomes."
                }
            },
            {
                "template": "outcomeStatements",
                "model": {
                    "outcomeType": "mid",
                    "helpText": "Projects more than 3 years in duration must set medium-term Project outcomes achievable at project completion. Ensure proposed outcomes are measurable with consideration to the baseline and proposed monitoring regime",
                    "minimumNumberOfOutcomes": 0,
                    "subtitle": "Medium-term outcome statement/s",
                    "title": "Project Outcomes",
                    "extendedOutcomes": true
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
                    "helpText": "In addition to listing your project assumptions, please list any nominated project services that will not be charged for.\nInclude all those conditions or factors that are sufficient to guarantee the success of the project, for example, on ground activities were not impacted by adverse weather conditions. Ensure what’s documented here aligns to those assumptions documented within the Project Logic.",
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
            "serviceFormName": "NHT Output Report",
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
                        "f9c85612-602e-465c-89e0-e155b34b1f31"
                    ],
                    "serviceId": 3
                },
                {
                    "serviceTargets": [
                        "a9d98baa-b2ab-4428-82cf-d96185e63aa6",
                        "c4ea5ce3-4a70-4df8-aff7-ffa929e7df61",
                        "dcf917dc-eaf7-49e2-ae7b-abf65edeedae"
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
                        "4dad393e-cbf7-43dd-87bb-62ea8f8afcdd",
                        "7186117e-ac17-4ed9-8c9c-8ee1c3bf473b"
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
                        "7186e284-0cb2-418e-a8cc-4343eb618140",
                        "c7d0963e-2847-4f5f-8a1c-e149dfa4c9d1"
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
        "visibility": "private",
        "declarationPageType": "rdpReportDeclaration",
        "requiresActivityLocking": true,
        "supportsMeriPlanComparison": true,
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
            "People resources",
            "Financial",
            "External stakeholders",
            "Natural Environment"
        ],
        "projectReports": [
            {
                "reportType": "Activity",
                "firstReportingPeriodEnd": "",
                "reportDescriptionFormat": "Progress Report %1d",
                "reportNameFormat": "Progress Report %1d",
                "reportingPeriodInMonths": 6,
                "description": "Priority Places Grants Progress Report",
                "minimumReportDurationInDays": 3,
                "label": "Semester",
                "category": "Progress Reports",
                "activityType": "Progress Report",
                "reportsAlignedToCalendar": true,
                "canSubmitDuringReportingPeriod": true
            },
            {
                "firstReportingPeriodEnd": "2025-06-30T14:00:00Z",
                "reportType": "Administrative",
                "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
                "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
                "reportingPeriodInMonths": 12,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "minimumReportDurationInDays": 1,
                "label": "Annual",
                "category": "Annual Progress Reporting",
                "activityType": "NHT Annual Report"
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
                "activityType": "Priority Places Final Report",
                "alignToOwnerStart": true
            }
        ],
        "keyThreatCodes": [
            "Climate Change - Changed flooding regime",
            "Climate Change - Changed rainfall patterns",
            "Climate Change - Sea level rises",
            "Climate Change - Unexpected seasonal/temperature extremes",
            "Disconnection from Country - Altered/disrupted connection with land and sea country",
            "Disconnection from Country - Altered or disrupted First Nations engagement/leadership in caring for land and sea country",
            "Disconnection from Country - Altered or disrupted transfer of First Nations knowledge systems",
            "Disconnection from Country - Inadequate recognition of Traditional knowledge and practices",
            "Disengagement of community - Community are not informed and are not engaged in managing the environment",
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
            "Midlands region of central Tasmania – TAS",
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


var outcomes = [
    {
        "priorities": [
            {
                "category": "Threatened Species"
            }
        ],
        "targeted": true,
        "shortDescription": "EPBC Species",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Long term): Threatened Species (TS) - The trajectory of species targeted under the Threatened Species Action Plan 2022-2032 and other EPBC Act listed Species is improved"
    },
    {
        "priorities": [
            {
                "category": "Threatened Species"
            }
        ],
        "targeted": true,
        "shortDescription": "New extinctions",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Long term): Threatened Species (TS) - New extinctions of plants and animals are prevented"
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
        "outcome": "1.  Species and Landscapes (Long term): Threatened Ecological Communities (TECs) and priority places - The condition of targeted EPBC Act listed Threatened Ecological Communities and identified priority places under the Threatened Species Action Plan 2022-2032 is improved"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Targeted threatened species (TS) are on track for improved trajectory"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Species at high risk of imminent extinction are identified and supported to persist"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Priority species are being assisted to strengthen reliance and adaptive capacity for climate change"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Increased leadership and/or participation of First Nations people in the management and recovery of threatened species"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - The implementation of priority actions is leading to an improvement in the condition of targeted TECs and priority places"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - Resilience to climate change and extreme events has been increased"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "1.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - Increased leadership and/or participation of First Nations people in the management and recovery of threatened ecological communities and priority places"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Managing Threats - Pest predator an competitor species have been controlled or are under active, long-term control programs"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Managing Threats - Threats from disease have been contained, reduced or excluded"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Improving habitat - Land management practices have improved"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Improving habitat - Quality of (TS/TECs) habitat has improved"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Improving habitat - Area/Extent of (TS/TECs) habitat has increased"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Improving habitat - Increased connectivity between patches"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Improving habitat - Quality of breeding and foraging habitat is improved   "
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Creating insurance populations - Existing populations have been protected"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Creating insurance populations - Re-introductions have enhanced wild populations"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): Climate adaption and resilience - Climate change resilience and adaptive capacity actions underway"
    },
    {
        "type": "short",
        "category": "Threatened Species",
        "outcome": "1.  Species and Landscapes (Short term): First Nations People and community involvement - First Nations people are leading and/or participating in recovery activities"
    }
];

var priorities = [
    {
        "category": "Ramsar",
        "priority": "Ginini Flats Wetland Complex"
    },
    {
        "category": "Threatened Species",
        "priority": "Anthochaera phrygia (Regent Honeyeater)"
    },
    {
        "category": "Threatened Species",
        "priority": "Bettongia gaimardi (Tasmanian Bettong, Eastern Bettong)"
    },
    {
        "category": "Threatened Species",
        "priority": "Botaurus poiciloptilus (Australasian Bittern)"
    },
    {
        "category": "Threatened Species",
        "priority": "Lathamus discolor (Swift Parrot)"
    },
    {
        "category": "Threatened Species",
        "priority": "Rutidosis leptorrhynchoides (Button Wrinklewort)"
    },
    {
        "category": "Threatened Species",
        "priority": "Swainsona recta (Small Purple-pea, Mountain Swainson-pea, Small Purple Pea)"
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
    },
    {
        "category": "Threatened Species",
        "priority": "Dasyurus viverrinus (Eastern Quoll)"
    },
    {
        "category": "Bushfires",
        "priority": "Herbivore and/or predator control"
    },
    {
        "category": "Bushfires",
        "priority": "Weed control and/or revegetation"
    },
    {
        "category": "Bushfires",
        "priority": "Fire management and planning"
    },
    {
        "category": "Bushfires",
        "priority": "Species and ecological community specific interventions"
    },
    {
        "category": "Bushfires",
        "priority": "Traditional Owner led healing of country"
    },
    {
        "category": "Bushfires",
        "priority": "Erosion control"
    },
    {
        "category": "Bushfires",
        "priority": "Refugia management"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Alpine Sphagnum Bogs and Associated Fens"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Ecological vegetation classes (EVC) dominated by fire sensitive eucalypt species"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Ecological vegetation classes dominated by callitris pine"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Montane Peatlands and Swamps of the New England Tableland, NSW North Coast, Sydney Basin, South East Corner, South Eastern Highlands and Australian Alps bioregions"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Podocarpus heathland"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Kosciuszko-Namadgi Alpine Ash Moist Grassy Forest"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Jounama Snow Gum Shrub Woodland"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Alpine Snow Gum Woodland"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Black Sallee Woodland"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "White Box-Yellow Box-Blakely's Red Gum Grassy Woodland and Derived Native Grassland"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Natural Temperate Grassland of the South Eastern Highlands"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Alpine Teatree shrubland"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Kosciuszko Flanks Moist Gully Forest"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Kosciuszko Snow Gum-Mountain Gum Moist Forest"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Kosciuszko Western Flanks Moist Shrub Forest"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Kosciuszko Eastern Slopes Mountain Gum Forest"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Namadgi Subalpine Rocky Shrubland"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Kybeyan Montane Heath"
    },
    {
        "category": "Threatened Ecological Community",
        "priority": "Eucalyptus niphophila woodlands (Alpine Snow Gum Woodland)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Potorous longipes (Long-footed Potoroo)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Antechinus mimetes (Dusky Antechinus)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Ornithorhynchus anatinus (Platypus)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Phascolarctos cinereus (Koala)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Potorous tridactylus (Long-nosed Potoroo)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Pseudomys novaehollandiae (New Holland Mouse, Pookila)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Petrogale penicillata (Brush-tailed Rock-wallaby)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Pteropus poliocephalus (Grey-headed Flying-fox)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Menura novaehollandiae (Superb Lyrebird)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Callocephalon fimbriatum (Gang-gang Cockatoo)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Pycnoptilus floccosus (Pilotbird)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Cyclodomorphs praealtus (Alpine She-oak Skink)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Litoria spenceri (Spotted Tree Frog)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Pseudophryne corroboree (Southern Corroboree Frog)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Pseudophryne pengilleyi (Northern Corroboree Frog)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Climacteris erythrops (Red-browed Treecreeper)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Anthochaera phrygia (Regent Honeyeater)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Monarcha melanopsis (Black-faced Monarch)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Calyptorhynchs lathami (Glossy Black-Cockatoo (eastern))"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Galaxias rostratus (Flathead Galaxias, Beaked Minnow, Dargo Galaxias)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Pseudemoia cryodroma (Alpine Bog Skink)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Liopholis guthega (Guthega Skink)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Pseudemoia rawlinsoni (Glossy Grass Skink, Swampland Cool-skink)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Eulamprus typmanum (Southern Water-skink)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Petauroides volans (Greater Glider)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Dasyurus maculatus maculatus (Spotted-tailed Quoll)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Dasyornis brachypterus (Eastern Bristlebird)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Dasyurus maculatus (Spot-tailed Quoll)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Mastacomys fuscus mordicus (Broad-toothed Rat)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Miniopterus orianae oceanensis (Eastern Bentwing Bat)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Petaurus norfolcensis (Squirrel Glider)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Petauroides volans (Southern Greater Glider)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Potorous longipes (Long-footed Potoroo)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Pseudomys fumeus (Smoky Mouse)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Crinia sloanei (Sloanes Froglet)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Litoria booroolongensis (Booroolong Tree Frog)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Litoria verreauxii alpina (Alpine Tree Frog)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Macquaria australasica (Macquarie Perch)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Galaxias tantangara (Stocky Galaxias)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Gadopsis bispinosus (Two-spined Blackfish)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Dasyurus maculatus maculatus (Spotted-tailed Quoll)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Petaurus australis (Yellow-bellied Glider)"
    },
    {
        "category": "Priority Vertebrate Animals",
        "priority": "Petaurus australis (Yellow-bellied Glider)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Callocephalon fimbriatum (Gang gang Cockatoo)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Climacteris picumnus victoriae (Brown Treecreeper)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Melithreptus gularis (Black-chinned Honeyeater)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Neophema pulchella (Turquoise Parrot)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Ninox connivens (Barking Owl)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Petauroides volans (Greater Glider)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Ninox strenua (Powerful Owl)"
    },
    {
        "category": "Additional Priority Species",
        "priority": "Stagonopleura guttata (Diamond Firetail)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Xenica Oreixenica lathalis theddora (Alpine Silver)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Hedleyropa yarrangobillyensis (Yarrangobilly Pinwheel Snail)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Buburra jeanae (leaf beetle)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Canthocamptus longipes (harpactacoid copepod)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Euastacus crassus. (Alpine crayfish)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Euastacus diversus (Orbost Spiny Crayfish)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Euastacus rieki (Riek's Crayfish)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Thaumatoperia alpina (Alpine Stonefly)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Castiarina flavoviridis (jewel beetle)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Austrochloritis kosciuszkoensis (Koscuiszko Bristle Snail)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Austrorhytida glaciamans (Koscuiszko Carnivorous Snail)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Diphyoropa illustra (Lakes Entrance Pinwheel Snail)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Oreixenica latialis (Small Alpine Xenica)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Austroaeschna flavomaculata (Alpine Darner)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Paralaoma annabelli (Prickle Pinhead Snail)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Oreixenica orichora (Spotted Alpine Xenica)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Castiarina kershawi (jewel beetle)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Oreixenica correae (Orange Alpine Xenica; Correa Brown)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Aulacopris reichei (Beetle)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Temognatha grandis (jewel beetle)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Leptoperla cacuminis (Mount Kosciusko Wingless Stonefly)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Asteron grayi (Spider, harvestman or pseudoscorpion)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Molycria mammosa (Spider, harvestman or pseudoscorpion -)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Storenosoma terraneum (Spider, harvestman or pseudoscorpion -)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Acanthaeschna victoria (Thylacine Darner)"
    },
    {
        "category": "Priority Invertebrate Species",
        "priority": "Austropetalia patricia (Waterfall Redspot)"
    },
    {
        "category": "Priority Plants",
        "priority": "Grevillea jephcottii (Pine Mountain Grevillea)"
    },
    {
        "category": "Priority Plants",
        "priority": "Grevillea oxyantha subsp. ecarinata  "
    },
    {
        "category": "Priority Plants",
        "priority": "Olearia stenophylla  "
    },
    {
        "category": "Priority Plants",
        "priority": "Prasophyllum bagoense (Bago Leek-orchid)"
    },
    {
        "category": "Priority Plants",
        "priority": "Eucalyptus forresterae (Brumby Sallee)"
    },
    {
        "category": "Priority Plants",
        "priority": "Pomaderris helianthemifolia "
    },
    {
        "category": "Priority Plants",
        "priority": "Prasophyllum keltonii (Kelton’s Leek-orchid)"
    },
    {
        "category": "Priority Plants",
        "priority": "Pterostylis oreophila (Blue-tongue Greenhood)"
    },
    {
        "category": "Priority Plants",
        "priority": "Gentianella sylvicola "
    },
    {
        "category": "Priority Plants",
        "priority": "Pultenaea vrolandii "
    },
    {
        "category": "Priority Plants",
        "priority": "Zieria citriodora (Lemon-scented Zieria)"
    },
    {
        "category": "Priority Plants",
        "priority": "Tetratheca subaphylla (Leafless Pinkbells)"
    },
    {
        "category": "Priority Plants",
        "priority": "Cardamine tryssa (Dainty Bitter-cress)"
    },
    {
        "category": "Priority Plants",
        "priority": "Prostanthera walteri (Blotchy Mintbush)"
    },
    {
        "category": "Priority Plants",
        "priority": "Galium roddii "
    },
    {
        "category": "Priority Plants",
        "priority": "Dampiera fusca (Kydra Dampiera)"
    },
    {
        "category": "Priority Plants",
        "priority": "Prostanthera stenophylla "
    },
    {
        "category": "Priority Plants",
        "priority": "Philotheca myoporoides subsp. brevipedunculata "
    },
    {
        "category": "Priority Plants",
        "priority": "Callistemon subulatus (Dwarf Bottlebrush)"
    },
    {
        "category": "Priority Plants",
        "priority": "Dillwynia brunioides "
    },
    {
        "category": "Priority Plants",
        "priority": "Eucalyptus fraxinoides (White Mountain Ash, White Ash)"
    },
    {
        "category": "Priority Plants",
        "priority": "Eucalyptus elaeophloia (Nunniong Gum)"
    },
    {
        "category": "Priority Plants",
        "priority": "Grevillea macleayana (Jervis Bay Grevillea)"
    },
    {
        "category": "Priority Plants",
        "priority": "Deyeuxia talariata"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Acacia blayana (Blay’s Wattle)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Acacia covenyi "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Acacia mabellae "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Acacia phlebophylla (Mount Buffalo Wattle)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Acacia phasmoides (Phantom Wattle)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Acacia saliciformis "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Acacia trachyphloia "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Almalea capitata (Slender Parrot Pea)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Banksia canei (Mountain Banksia)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Botrychium lunaria (Moonwort)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Caladenia montana (Mountain Spider Orchid)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Calochilus sandrae (Brownish Beard Orchid)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Calochilus saprophyticus (Leafless Beard Orchid)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Cassinia heleniae "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Cassinia venusta "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Cassytha phaeolasia "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Celmisia sp pulchella (A snow daisy)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Dampiera fusca (Kydra Dampiera)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Daviesia nova-anglica "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Deyeuxia reflexa "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Dillwynia palustris "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Discaria nitida (Leafy Anchor Plant)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Diuris ochroma (Pale Golden Moths)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Eucalyptus cinerea subsp. triplex  "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Eucalyptus forresterae "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Euphrasia scabra (Rough Eyebright)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Galium roddii  "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Genoplesium vernale (East Lynne Midge Orchid)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Gentiana baeuerlenii (Baeuerlen's Gentian)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Gentianella muelleriana subsp. jingerensis (Mueller’s Snow-gentian)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Geranium sessiliflorum  "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Goodenia glomerata "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Grevillea imberbis "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Grevillea alpivaga (Buffalo Grevillea)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Grevillea macleayana "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Grevillea neurophylla subsp fluviatilis  "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Grevillea neurophylla subsp neurophylla  "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Grevillea oxyantha subsp. ecarinata "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Grevillea ramosissima subsp hypargyrea (Fan Grevillea)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Grevillea victoriae subsp nivalis  "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Grevillea willisii (Omeo Grevillea)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Hakea macraeana "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Leionema lamprophyllum subsp obovatum (Shiny Phebalium)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Leptospermum namadgiensis (Namadgi Tea Tree)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Logania granitica (Mountain Logania)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Leucochrysum albicans var. tricolor (Hoary Sunray)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Lobelia gelida (Snow Pratia)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Olearia sp Rhizomatica  "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Olearia stenophylla "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Parantennaria uniceps  "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Persoonia chamaepitys "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Persoonia mollis subsp. mollis "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Persoonia procumbens "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Pimelea bracteata  "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Pomaderris cotoneaster (Cotoneaster Pomaderris)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Pomaderris gilmourii (Grey Deua Pomaderris)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Pomaderris phylicifolia subsp. phylicifolia  "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Prostanthera monticola (Buffalo Mint Bush)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Prasophyllum canaliculatum (Summer Leek Orchid)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Prasophyllum innubum (Brandy Marys leek orchid)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Prasophyllum keltonii (Kelton's Leek Orchid)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Prasophyllum venustum (Charming Leek Orchid)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Prasophyllum viriosum (Stocky Leek Orchid)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Prostanthera decussata "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Prostanthera stenophylla "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Prostanthera walteri "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Pterostylis oreophila (Blue-tongued Greenhood / Kiandra Greenhood)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Pultenaea polifolia (Dusky Bush-pea)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Pultenaea vrolandii (Cupped Bush-pea)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Rutidosis leiolepis (Monaro Golden Daisy)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Sannantha crenulate (Fern-leaf Baeckea)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Tetratheca subaphylla "
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Thesium austral (Austral Toadflax)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Thynninorchis huntianus (Elbow Orchid)"
    },
    {
        "category": "Additional Priority Plants",
        "priority": "Viola improcera (Dwarf Violet)"
    }
];

//Create the parent program
let programName = "Natural Heritage Trust";
var parent = createOrFindProgram(programName);
var subprograms = ["Climate-Smart Agriculture Program - Capacity Building Grants - Round 1"]

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


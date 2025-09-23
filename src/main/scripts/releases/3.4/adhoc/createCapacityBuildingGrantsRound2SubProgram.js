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
                    "servicesHeading": "Project service / Target measure/s to address Barrier/Issue",
                    "threatsHeading": "Key Barrier/Issue",
                    "threatHelpText": "Describe the Key Barriers/Issues to the investment priority",
                    "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance",
                    "interventionHelpText": "Describe the proposed method to address the Key Barriers/Issues",
                    "title": "Key Barriers/Issues"
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
                    "headingTitle": "Sustainability plans/priorities/frameworks",
                    "explanation": "Explain how the project aligns with any applicable national/state/territory/regional/industry documents. These may include sustainability plans, priorities, strategies or frameworks."
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
            "serviceFormName": "Grants and Others Progress Report",
            "programServices": [
                {
                    "serviceTargets": [
                        "58422487-fe0a-4cc6-85b6-761e9f2752b9"
                    ],
                    "serviceId": 1
                },
                {
                    "serviceTargets": [
                        "7abd62ba-2e44-4318-800b-b659c73dc12b"
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
                        "e30b721b-99d7-4292-9395-e10ad8b1b9e1",
                        "eedf53df-e2f1-4fde-b955-41b46ac83282",
                        "6c92881f-d8ae-434c-9275-3373ce8023fb"
                    ],
                    "serviceId": 4
                },
                {
                    "serviceTargets": [
                        "e037c2d7-a5e5-4e5c-a173-a2f426d39e95",
                        "dd4a0ab0-f760-44e9-ae37-5589a06678dd",
                        "7ba84972-750a-4952-921d-1552743bc09b",
                        "64555f23-a7f0-4fbd-a509-2a5492f7e91b"
                    ],
                    "serviceId": 5
                },
                {
                    "serviceTargets": [
                        "ab61838c-eba7-4007-bb06-65fe0bfcf604",
                        "d75389ba-e4a7-4735-9e52-93d86667d519",
                        "cb7c9d74-c1fc-4503-b4d8-96586b7d28c5",
                        "50e4a1a1-31cb-4236-b23e-3949edcfba06"
                    ],
                    "serviceId": 7
                },
                {
                    "serviceTargets": [
                        "e4cedcec-6a4c-4125-8d27-9230d6a21ba5",
                        "2504bde1-6389-4d65-8a5d-95bccefccd0a"
                    ],
                    "serviceId": 8
                },
                {
                    "serviceTargets": [
                        "11dc6641-488a-482b-9e4d-4d1ab1fad282",
                        "a253fcea-320d-4d12-a736-a1189c732b17",
                        "4feac7e6-b5bd-4b5b-869d-3e3fdfced31b",
                        "82db08b5-58e8-4d35-8335-037801ef4067"
                    ],
                    "serviceId": 9
                },
                {
                    "serviceTargets": [
                        "23261000-91f6-4480-8368-fa910649f3e1",
                        "8990164b-73c1-4ec1-90aa-b1b6e306e186",
                        "3751ae6f-b0a2-4ec0-935f-1da14b334f38",
                        "a30e7b28-b986-456c-a209-14fc6af38cd9"
                    ],
                    "serviceId": 10
                },
                {
                    "serviceTargets": [
                        "1246a484-cade-497d-a76e-e5fdf881e46f",
                        "b80aaccc-5f28-43f0-a754-338b9b1c0edd"
                    ],
                    "serviceId": 12
                },
                {
                    "serviceTargets": [
                        "e0a2e283-77a2-4f74-94de-550578cc4612",
                        "65dbe133-29c2-46a8-a91f-c76ece73e2fc"
                    ],
                    "serviceId": 13
                },
                {
                    "serviceTargets": [
                        "a2ba766b-f9ce-4948-b331-b4989e8edfc8",
                        "6a7f9150-3107-46fc-967d-143b595f39a3"
                    ],
                    "serviceId": 14
                },
                {
                    "serviceTargets": [
                        "c0b0a691-057e-4af4-a0d2-647988354931",
                        "e5de1384-40b8-4347-b3b3-e1efb8f0b09b"
                    ],
                    "serviceId": 15
                },
                {
                    "serviceTargets": [
                        "ede35cd2-bb14-44b6-8d47-6b0ea55cb2d1",
                        "da7e114f-24ed-4924-b763-4843fbe85152",
                        "88d2eddf-5633-4220-948c-f5b5d690b896",
                        "6d3971f4-a393-499e-ad7d-6d030a0ace7e"
                    ],
                    "serviceId": 16
                },
                {
                    "serviceTargets": [
                        "9e17ef60-59e4-4509-a396-0f0a8e3d77d4",
                        "0a973540-78c8-45b8-9074-5d99b0c8a8ef"
                    ],
                    "serviceId": 18
                },
                {
                    "serviceTargets": [
                        "91185422-300a-43c9-8148-3074aa9b9bf2",
                        "88b6be7f-8b43-4514-b6f5-7176d5a6a23b"
                    ],
                    "serviceId": 42
                },
                {
                    "serviceTargets": [
                        "6902a27f-a4bb-4a85-82e9-ea2e361510c2"
                    ],
                    "serviceId": 17
                },
                {
                    "serviceTargets": [
                        "de5f262d-5474-40ef-92fc-a631bd2866ff",
                        "eb72cc6e-6e0b-449b-954d-d76b5c9dfe10"
                    ],
                    "serviceId": 19
                },
                {
                    "serviceTargets": [
                        "210ade50-7e53-44d5-a170-a8271e4a5448",
                        "30fcbc69-07de-4cee-a952-17dfdcc99841",
                        "48d7b144-ae3a-4b45-a022-0654c38dcc5a",
                        "8ba07e59-2d5a-4b08-8775-2643c67126f7"
                    ],
                    "serviceId": 20
                },
                {
                    "serviceTargets": [
                        "86d53f79-9847-4c1c-91b6-0df157bfbb46",
                        "d02595ef-b0f0-464e-9950-a38ea17e7449"
                    ],
                    "serviceId": 23
                },
                {
                    "serviceTargets": [
                        "f4f3790d-8af6-4d75-8b5c-da5834359837"
                    ],
                    "serviceId": 24
                },
                {
                    "serviceTargets": [
                        "a7e6b1ee-d458-4330-a1b2-fd9fc1636955",
                        "d8d501c9-f18b-4dcd-88d8-1a3b947b4a87",
                        "adf68191-6ed1-46cb-9d6c-ab4a02cccb5d",
                        "f6ba8663-b014-4033-84d6-0dd96e593385",
                        "7299cb0e-b811-49ec-8ea2-08ac75c39647"
                    ],
                    "serviceId": 26
                },
                {
                    "serviceTargets": [
                        "29f64aa4-e4e5-4e27-bdac-0a259730f3a1",
                        "97afd8a0-aa10-4987-8e9e-4c572f6a80b3",
                        "cf1794d1-5d9b-410b-9092-372ebf691b96",
                        "14230564-70c2-47e6-9e75-ddc407fc9916"
                    ],
                    "serviceId": 27
                },
                {
                    "serviceTargets": [
                        "53341328-38fc-460b-a330-4906543dd468",
                        "49fbabc3-cad5-4504-b06b-721482393613"
                    ],
                    "serviceId": 28
                },
                {
                    "serviceTargets": [
                        "cc50184f-4b1b-4086-9ef8-387c88799acf",
                        "2dbb1e1f-b00b-4f09-8af9-eefee9474695"
                    ],
                    "serviceId": 29
                },
                {
                    "serviceTargets": [
                        "5de1fddf-5089-496b-8e8f-6127ff39c3a1",
                        "e8559392-8a14-46a2-b962-cf8be46bc476"
                    ],
                    "serviceId": 30
                },
                {
                    "serviceTargets": [
                        "36481317-5db0-4d87-93ae-9ffcabbfa6a0",
                        "0c44f773-fb12-4753-9d0a-6900a2858230"
                    ],
                    "serviceId": 31
                },
                {
                    "serviceTargets": [
                        "a82d04c9-4cdf-40c2-9bed-78539b92bf58",
                        "edaefddb-e55d-40ba-bb7b-a163f9678125"
                    ],
                    "serviceId": 32
                },
                {
                    "serviceTargets": [
                        "a9bd257e-ebfe-4dc6-98c5-98488c80c12d",
                        "b6a2c1f2-9daa-4256-b79c-6fc3a2df3b05"
                    ],
                    "serviceId": 33
                },
                {
                    "serviceTargets": [
                        "c43c95a6-2698-4e2d-8d5d-9f8bcc5bbc0a",
                        "a8687dcf-7a08-4d7e-9cba-7c14b701048c",
                        "21a7fd05-79b4-46b2-b939-c90ee4699867",
                        "c1e99d44-369d-4c85-b20d-c35685c32a80"
                    ],
                    "serviceId": 34
                },
                {
                    "serviceTargets": [
                        "332bd6c4-3209-4691-b454-3dbe4f011385",
                        "2695a9b8-54db-4483-90e5-c83c5a230060"
                    ],
                    "serviceId": 35
                },
                {
                    "serviceTargets": [
                        "a0cc136c-094a-4e57-b5e0-f410dbb3ae51",
                        "2930c94c-cb39-4df6-9593-6ce76a5bb9e9",
                        "b2299148-ec80-4c02-ac91-afbe780f7344",
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
                },
                {
                    "serviceTargets": [
                        "07440abb-88a7-47a7-a5b2-26d834d00679"
                    ],
                    "serviceId": 45
                },
                {
                    "serviceTargets": [],
                    "serviceId": 52,
                    "mandatory": true
                },
                {
                    "serviceTargets": [],
                    "serviceId": 53,
                    "mandatory": true
                },
                {
                    "serviceTargets": [],
                    "serviceId": 54,
                    "mandatory": true
                },
                {
                    "serviceTargets": [],
                    "serviceId": 55,
                    "mandatory": true
                },
                {
                    "serviceTargets": [],
                    "serviceId": 56,
                    "mandatory": true
                }
            ]
        },
        "visibility": "public",
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
                "activityType": "Grants and Others Progress Report",
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
            "Disconnection from Country - Altered or disrupted First Nations engagement/leadership in caring for land and sea country",
            "Disconnection from Country - Altered or disrupted transfer of First Nations knowledge systems",
            "Disconnection from Country - Altered/disrupted connection with land and sea country",
            "Disconnection from Country - Inadequate recognition of Traditional knowledge and practices",
            "Disease/pathogens - Areas that are infected",
            "Disease/pathogens - Possible infection of disease free areas",
            "Disengagement of community - Community are not informed and are not engaged in managing the environment",
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
            "Knowledge/Capacity - Inadequate scientific and/or technological capacity",
            "Knowledge/Capacity - Insufficient knowledge to inform appropriate management or intervention actions",
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
                "category": "Farmer Sector"
            }
        ],
        "targeted": true,
        "shortDescription": "Skills and Knowledge",
        "category": "Farmer Sector",
        "outcome": "1: Farmers and land holders have increased awareness, knowledge, and skills of best practice climate-smart sustainable agriculture approaches"
    },
    {
        "priorities": [
            {
                "category": "Farmer Sector"
            }
        ],
        "targeted": true,
        "shortDescription": "Capacity and Capability",
        "category": "Farmer Sector",
        "outcome": "2: Community, Landcare groups, First Nations peoples and industry have increased capacity and capability to assist farmers and land holders to adopt climate-smart and sustainable agriculture practices"
    },
    {
        "priorities": [
            {
                "category": "Farmer Sector"
            }
        ],
        "targeted": true,
        "shortDescription": "Agricultural Practices",
        "category": "Farmer Sector",
        "outcome": "3: The agriculture sector is utilising proven climate-smart and sustainable agriculture practices, initiatives, and information sources to increase adoption at scale"
    },
    {
        "category": "Farmer Sector",
        "type": "medium",
        "outcome": "1. Farmers are trialing and/or adopting CSSA practices"
    },
    {
        "category": "Farmer Sector",
        "type": "medium",
        "outcome": "2. Farmers are adopting innovative tools, technologies or practices"
    },
    {
        "category": "Farmer Sector",
        "type": "medium",
        "outcome": "3. Farmers are demonstrating sustainability credentials and traceability"
    },
    {
        "category": "Farmer Sector",
        "type": "medium",
        "outcome": "4. Farmers are implementing sustainability frameworks"
    },
    {
        "category": "Farmer Sector",
        "type": "medium",
        "outcome": "5. Farmers understand how and why to adopt CSSA practices (knowledge)"
    },
    {
        "category": "Farmer Sector",
        "type": "medium",
        "outcome": "6. Farmers are aware of CSSA practices, and their value and opportunities"
    },
    {
        "category": "Farmer Sector",
        "type": "medium",
        "outcome": "7. Farmers have the skills to adopt CSSA practices"
    },
    {
        "category": "Farmer Sector",
        "type": "medium",
        "outcome": "8. Farmers accept and value CSSA practices"
    },
    {
        "type": "short",
        "category": "Farmer Sector",
        "outcome": "1. Farmers understand how and why to adopt CSSA practices (Knowledge)"
    },
    {
        "type": "short",
        "category": "Farmer Sector",
        "outcome": "2. Farmers are aware of CSSA practices, and their value and opportunities"
    },
    {
        "type": "short",
        "category": "Farmer Sector",
        "outcome": "3. Farmers have the skills to adopt CSSA practices"
    },
    {
        "type": "short",
        "category": "Farmer Sector",
        "outcome": "4. Farmers accept and value CSSA practices (attitude/culture)"
    },
    {
        "type": "short",
        "category": "Farmer Sector",
        "outcome": "5. Farmers are accessing demonstrations of innovative and effective practices"
    },
    {
        "type": "short",
        "category": "Farmer Sector",
        "outcome": "6. Farmers are accessing relevant information resources and products"
    },
    {
        "type": "short",
        "category": "Farmer Sector",
        "outcome": "7. Farmers are accessing advice and support"
    },
    {
        "type": "short",
        "category": "Farmer Sector",
        "outcome": "8. Farmers are connecting to peer networks"
    }
]

var priorities = [
    {
        "category": "Farmer Sector",
        "priority": "Native vegetation and biodiversity on-farm"
    },
    {
        "category": "Farmer Sector",
        "priority": "On-farm emissions reduction practices"
    },
    {
        "category": "Farmer Sector",
        "priority": "Soil carbon"
    },
    {
        "category": "Farmer Sector",
        "priority": "Soil erosion"
    },
    {
        "category": "Farmer Sector",
        "priority": "Soil acidification"
    },
    {
        "category": "Farmer Sector",
        "priority": "Sustainable agriculture practices, including natural resource management"
    },
    {
        "category": "Farmer Sector",
        "priority": "Climate change adaptation"
    },
    {
        "category": "Farmer Sector",
        "priority": "Carbon and biodiversity market information"
    },
    {
        "category": "Farmer Sector",
        "priority": "Sustainability framework engagement"
    },
    {
        "category": "Farmer Sector",
        "priority": "Market access and traceability"
    }
];

//Create the parent program
let programName = "Natural Heritage Trust";
var parent = createOrFindProgram(programName);
var subprograms = ["Climate-Smart Agriculture Program - Capacity Building Grants - Round 2"]

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


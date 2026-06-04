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
                    "renderPrioritiesWithSelect2": true,
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
                        "11dc6641-488a-482b-9e4d-4d1ab1fad282",
                        "a253fcea-320d-4d12-a736-a1189c732b17",
                        "4feac7e6-b5bd-4b5b-869d-3e3fdfced31b",
                        "82db08b5-58e8-4d35-8335-037801ef4067"
                    ],
                    "serviceId": 9
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
                "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportingPeriodInMonths": 3,
                "description": "",
                "minimumReportDurationInDays": 1,
                "label": "Quarter",
                "reportsAlignedToCalendar": true,
                "category": "Outputs Reporting",
                "activityType": "NHT Output Report",
                "canSubmitDuringReportingPeriod": true
            },
            {
                "firstReportingPeriodEnd": "2024-06-30T14:00:00Z",
                "reportType": "Administrative",
                "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
                "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
                "reportingPeriodInMonths": 12,
                "description": "",
                "minimumReportDurationInDays": 1,
                "label": "Annual",
                "category": "Annual Progress Reporting",
                "activityType": "NHT RDP Annual Report"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "minimumOwnerDurationInMonths": 36,
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 24,
                "multiple": false,
                "maximumOwnerDurationInMonths": 47,
                "label": "Outcomes Report 1",
                "category": "Outcomes Report 1",
                "activityType": "NHT Outcomes 1 Report"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "minimumOwnerDurationInMonths": 48,
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 36,
                "multiple": false,
                "calendarAlignmentMonth": 7,
                "label": "Outcomes Report 1",
                "category": "Outcomes Report 1",
                "reportsAlignedToCalendar": true,
                "activityType": "NHT Outcomes 1 Report"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 2 for %4$s",
                "reportNameFormat": "Outcomes Report 2",
                "multiple": false,
                "alignToOwnerEnd": true,
                "label": "Outcomes Report 2",
                "category": "Outcomes Report 2",
                "activityType": "NHT Outcomes 2 Report",
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
                "category": "Influenza Sector"
            }
        ],
        "targeted": true,
        "shortDescription": "High Pathogenicity Avian Influenza",
        "category": "High Pathogenicity Avian Influenza",
        "type": "primary",
        "outcome": "To boost and accelerate H5 bird flu preparedness and protective action for Australia’s most at-risk species"
    },
    {
        "priorities": [
            {
                "category": "Influenza Sector"
            }
        ],
        "targeted": true,
        "shortDescription": "High Pathogenicity Avian Influenza",
        "category": "High Pathogenicity Avian Influenza",
        "type": "secondary",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "To boost and accelerate H5 bird flu preparedness and protective action for Australia’s most at-risk species."
    },
    {
        "type": "short",
        "category": "Influenza Sector",
        "outcome": "To safeguard and build resilience for Australia’s most at-risk species in nature by mitigating other threats"
    }
];

var priorities = [
    {
        "category": "Influenza Sector",
        "priority": "Accipiter hiogaster natalis (Christmas island goshawk)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Actitis hypoleucos (Common Sandpiper)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Amaurornis cinerea (White-browed Crake)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Amaurornis moluccana (Pale-Vented Bush-Hen)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Amytornis (Magnamytis) rowleyi (Rusty Grasswren)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Anarhynchus mongolus (Siberian Sand Plover)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Anas gracilis (Grey Teal)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Anas superciliosa (Pacific Black Duck)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Anhinga novaehollandiae (Australasian Darter)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Anous albivitta (Grey Noddy)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Anous minutus (Black Noddy)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Anous stolidus (Common Noddy)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Anous tenuirostris melanops (Australian Lesser Noddy)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Anseranas semipalmata (Magpie Goose)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Antechinus minimus maritimus (Swamp antechinus)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Anthochaera phrygia (Regent Honeyeater)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Aquila audax (Wedge-tailed eagle)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Arctocephalus forsteri (Long-nosed Fur-seal, New Zealand Fur-seal)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Arctocephalus pusillus (Australian fur seal)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Ardea alba (Great Egret, White Egret)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Ardea intermedia plumifera (Intermediate (plumed) Egret)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Ardenna carneipes (Flesh-footed shearwater)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Ardenna grisea (Sooty shearwater)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Ardenna pacifica (Wedge-tailed Shearwater)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Ardenna tenuirostris (Short-tailed Shearwater)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Arenaria interpres (Ruddy Turnstone)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Aythya (Nyroca) australis (Hardhead)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Biziura lobata (Musk Duck)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Botaurus dubius (Australian little bittern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Botaurus poiciloptilus (Australasian Bittern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Calidris acuminata (Sharp-tailed Sandpiper))"
    },
    {
        "category": "Influenza Sector",
        "priority": "Calidris alba (Sanderling)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Calidris canutus (Red Knot, Knot)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Calidris falcinellus (Broad-billed Sandpiper)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Calidris ferruginea (Curlew Sandpiper)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Calidris ruficollis (Red-necked Stint)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Calidris tenuirostris (Great Knot)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Calyptorhynchus (Calyptorhynchus) lathami lathami (Glossy Black-Cockatoo)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Calyptorhynchus (Calyptorhynchus) lathami erebus (Capricorn Glossy Black-Cockatoo)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Charadrius bicinctus (Double-banded plover)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Charadrius leschenaultii (Greater Sand Plover, Large Sand Plover)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Charadrius mongolus (Lesser Sand Plover, Mongolian Plover)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Charadrius ruficapillus (Red-capped plover)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Chenonetta jubata (Australian Wood Duck)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Chlidonias hybrida (Whiskered Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Chlidonias leucopterus (White-winged Tern, White-winged Black Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Chroicocephalus novaehollandiae (Silver gull)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Cincloramphus timoriensis (Tawny Grassbird)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Cisticola (Cisticola) exilis (Golden-Headed Cisticola)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Cladorhynchus leucocephalus (Banded Stilt)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Coturnix (Coturnix) pectoralis (Stubble Quail)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Cygnus atratus (Black Swan)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Dasyuroides byrnei (Kowari)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Dendrocygna arcuata (Wandering Whistling Duck)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Dendrocygna eytoni (Plumed Whistling Duck)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Egretta garzetta (Little Egret)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Egretta novaehollandiae (White-faced Heron)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Egretta sacra (Eastern Reef Egret)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Egretta sacra (Eastern Reef Heron (Pacific Reef Heron))"
    },
    {
        "category": "Influenza Sector",
        "priority": "Elanus axillaris (Black-Shouldered Kite)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Elanus scriptus (Letter-Winged Kite)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Ephippiorhynchus asiaticus (Black-Necked Stork)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Esacus magnirostris (Beach Stone-curlew)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Eudyptula minor (Little penguin)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Eulabeornis castaneoventris (Chestnut Rail)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Excalfactoria chinensis (King Quail)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Falco berigora (Brown Falcon)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Falco cenchroides (Australian Kestrel, Nankeen Kestrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Falco cenchroides (Nankeen Kestrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Falco hypoleucos (Grey Falcon)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Falco longipennis (Australian Hobby)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Falco peregrinus (Peregrine Falcon)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Falco subniger (Black Falcon)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Fregata andrewsi (Christmas Island frigatebird, Andrew's Frigatebird)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Fregata ariel (Lesser Frigatebird, Least Frigatebird)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Fregetta grallaria (White-bellied Storm-Petrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Fregata minor (Great Frigatebird, Greater Frigatebird)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Gallinago hardwickii (Latham’s Snipe)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Gallinula tenebrosa (Dusky Moorhen)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Gallirallus sylvestris (Lord Howe Rail)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Gelochelidon macrotarsa (Australian Gull-billed Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Gelochelidon nilotica (Gull-billed Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Grus rubicunda (Brolga)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Haematopus fuliginosus (Sooty Oystercatcher)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Haematopus longirostris (Pied Oystercatcher)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Haliaeetus leucogaster (White-bellied Sea-Eagle)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Haliastur indus (Brahminy Kite)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Haliastur sphenurus (Whistling Kite )"
    },
    {
        "category": "Influenza Sector",
        "priority": "Hamirostra melanosternon (Black-Breasted Buzzard)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Himantopus himantopus (Black-winged Stilt, Pied Stilt)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Hydroprogne caspia (Caspian Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Hypotaenidia philippensis (Buff-banded Rail)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Isoodon obesulus (Southern brown bandicoot)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Ixobrychus dubius (Australasian little bittern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Larus dominicanus (Kelp Gull)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Lathamus discolor (Swift parrot)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Lewinia pectoralis (Lewin's Rail)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Limnodromus semipalmatus (Asian Dowitcher)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Limosa lapponica (Bar-tailed Godwit)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Limosa lapponica menzbieri (Bar-tailed Godwit (Yakutian))"
    },
    {
        "category": "Influenza Sector",
        "priority": "Limosa limosa (Black-tailed Godwit)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Litoria aurea (Green and Golden Bell Frog)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Lophoictinia isura (Square-Tailed Kite)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Macronectes giganteus (Southern Giant-Petrel, Southern Giant Petrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Malacorhynchus membranaceus (Pink-eared Duck)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Milvus migrans (Black Kite)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Motacilla tschutschensis (Eastern Yellow Wagtail)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Neophema chrysogaster  (Orange-bellied parrot)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Neophema chrysostoma (Blue-winged Parrot)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Neophema elegans (Elegant parrot)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Neophema petrophila (Rock Parrot)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Neophoca cinerea (Australian Sea-lion, Australian Sea Lion)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Nettapus pulchellus (Green Pygmy Goose)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Notomys fuscus (Dusky Hopping-mouse, Wilkiniti)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Numenius madagascariensis (Eastern curlew, Far Eastern Curlew)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Numenius phaeopus (Whimbrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Nycticorax caledonicus (Nankeen Night Heron)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Onychoprion anaethetus (Bridled Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Onychoprion fuscatus (Sooty Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Oreoica gutturalis (Crested bellbird)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Oxyura australis (Blue-billed Duck)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pachyptila turtur (Fairy prion)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pandion haliaetus cristatus (Eastern osprey, Australian Osprey)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Papasula abbotti (Abbott’s booby)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pardalotus quadragintus (Forty Spotted pardalote)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pelagodroma marina (White-faced Storm-Petrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pelecanoides urinatrix (Common diving petrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pelecanus conspicillatus (Australian Pelican)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Perameles gunnii (Eastern barred bandicoot)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Peregrine falcon (Peregrine falcon)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Petrochelidon nigricans (Tree Martin)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pezoporus flaviventris (Western Ground Parrot, Kyloring)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Phaethon lepturus fulvus (White-tailed Tropicbird (Christmas Island), Golden Bosunbird)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Phaethon rubricauda (Red-tailed Tropicbird)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Phalacrocorax fuscescens (Black-faced cormorants)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Phalacrocorax varius (Pied Cormorant)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Plegadis falcinellus (Glossy Ibis)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pluvialis fulva (Pacific Golden Plover)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pluvialis squatarola (Grey Plover)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Polytelis anthopeplus monarchoides (Regent parrot)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Poodytes gramineus (Little Grassbird)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Porphyrio (Porphyrio) porphyrio melanotus (Australasian Purple Swamphen)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Porzana fluminea (Australian Spotted Crake, Spotted Crake)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Potorous tridactylus (Long nosed potoroo)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pseudomys australis (Plains Mouse)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pterodroma cervicalis (White-necked Petrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pterodroma externa (Juan Fernández Petrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pterodroma leucoptera leucoptera (Gould’s petrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pterodroma neglecta (Kermadec Petrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pterodroma nigripennis (Black-winged Petrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Pterodroma solandri (Providence Petrel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Puffinus assimilis (Little Shearwater)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Puffinus gavia (Fluttering shearwater)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Rallina (Rallina) tricolor (Red-Necked Crake)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Rostratula australis (Australian Painted Snipe)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Sarcophilus harrisii (Tasmanian Devil)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Spatula rhynchotis (Australasian Shoveler)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Sterna dougallii (Roseate Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Sterna hirundo (Common Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Sterna striata (White fronted tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Sternula albifrons (Little Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Sternula nereis (Fairy tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Sternula nereis nereis (Australian Fairy Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Stictonetta naevosa (Freckled Duck)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Stiltia isabella (Australian Pratincole)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Sula dactylatra (Masked Booby)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Sula leucogaster (Brown Booby)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Sula sula (Red-footed Booby)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Synoicus ypsilophorus (Brown Quail)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Tadorna tadornoides (Australian Shelduck)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Thalassarche cauta (Shy Albatross)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Thalasseus bengalensis (Lesser Crested Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Thalasseus bergii (Great Crested Tern, Crested Tern)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Thinornis cucullatus (Hooded Plover, Hooded Dotterel)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Thinornis cucullatus cucullatus (Eastern Hooded Plover)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Threskiornis moluccus (Australian White Ibis)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Threskiornis spinicollis (Straw-necked Ibis)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Todiramphus sanctus (Sacred Kingfisher)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Tribonyx mortierii (Tasmanian Native-Hen)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Tribonyx ventralis (Black-Tailed Native-Hen)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Tringa brevipes (Grey-tailed Tattler)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Tringa nebularia (Common Greenshank, Greenshank)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Tringa stagnatilis (Marsh Sandpiper, Little Greenshank)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Tringa totanus (Common Redshank, Redshank)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Turnix melanogaster (Black-breasted Button-quail)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Xenus cinereus (Terek Sandpiper)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Zapornia pusilla (Baillon's Crake)"
    },
    {
        "category": "Influenza Sector",
        "priority": "Zapornia tabuensis (Spotless Crake)"
    }
];

//Create the parent program
let programName = "High Pathogenicity Avian Influenza (HPAI)";
var parent = createOrFindProgram(programName);
var subprograms = ["High Pathogenicity Avian Influenza (HPAI) Preparedness Activities - Procurements - RDP"]

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


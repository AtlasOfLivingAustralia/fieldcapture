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
        "visibility": "private",
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
                "reportsAlignedToCalendar": true,
                "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportingPeriodInMonths": 3,
                "description": "",
                "category": "Outputs Reporting",
                "activityType": serviceFormName,
                "canSubmitDuringReportingPeriod": true,
                "label": "Quarter",
                "minimumReportDurationInDays": 1

            },
            {
                "firstReportingPeriodEnd": "2024-06-30T14:00:00Z",
                "reportType": "Administrative",
                "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
                "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
                "reportingPeriodInMonths": 12,
                "category": "Annual Progress Reporting",
                "activityType": annualReportFormName,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "label": "Annual",
                "minimumReportDurationInDays": 1
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "minimumOwnerDurationInMonths": null,
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 36,
                "alignToOwnerStart":true,
                "alignToOwnerEnd":true,
                "multiple": false,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "maximumOwnerDurationInMonths": 35,
                "category": "Outcomes Report 1",
                "reportsAlignedToCalendar": false,
                "activityType": outcomes1ReportFormName,
                "label":"Outcomes Report 1"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "minimumOwnerDurationInMonths": 36,
                "maximumOwnerDurationInMonths": 47,
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 24,
                "multiple": false,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "category": "Outcomes Report 1",
                "activityType": outcomes1ReportFormName,
                "label": "Outcomes Report 1"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 36,
                "multiple": false,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "minimumOwnerDurationInMonths": 48,
                "calendarAlignmentMonth": 7,
                "category": "Outcomes Report",
                "reportsAlignedToCalendar": true,
                "activityType": outcomes1ReportFormName,
                "label": "Outcomes Report 1"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 2 for %4$s",
                "minimumOwnerDurationInMonths": 36,
                "reportNameFormat": "Outcomes Report 2",
                "alignToOwnerStart":true,
                "alignToOwnerEnd":true,
                "multiple": false,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "category": "Outcomes Report 2",
                "activityType": outcomes2ReportFormName,
                "label": "Outcomes Report 2"
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
                "category": "Ecological health"
            }
        ],
        "targeted": true,
        "category": "Ecological health",
        "outcome": "1. Priority landscapes in the Great Barrier Reef catchments are remediated and maintained using approaches demonstrated to improve water quality, build resilience and enhanced ecological function."
    },
    {
        "category": "Ecological health",
        "type": "medium",
        "outcome": "1. Landscape remediation of priority locations resulting in the cost-effective reduction of fine sediment from reaching the Great Barrier Reef Lagoon."
    },
    {
        "category": "Ecological health",
        "type": "medium",
        "outcome": "2. Capacity, capability and willingness to adopt and maintain appropriate land management practices has increased across the Great Barrier Reef regions."
    },
    {
        "category": "Ecological health",
        "type": "medium",
        "outcome": "3. Participation of First Nations people in in project design, delivery, maintenance and monitoring of Reef water quality projects has increased across the Great Barrier Reef regions."
    },
    {
        "category": "Ecological health",
        "type": "medium",
        "outcome": "4. Reef Trust water quality investment landscape remediation sites are maintained to support longevity of water quality outcomes."
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "1. Whole-of-system Reef water quality strategies are guiding landscape repair in priority Great Barrier Reef regions and catchments"
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "2. Technical advice, data assurance, and evidence-based decision support has enabled site selection, design and commencement of landscape remediation activities to support the cost-effective reduction of sediment reaching the Great Barrier Reef."
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "3. Landscape remediation of priority locations resulting in the cost-effective reduction of fine sediment from reaching the Great Barrier Reef Lagoon."
    },
    {
        "type": "short",
        "category": "Farmer Sector",
        "outcome": "4. Region-led consortiums of landscape repair practitioners, industries, and communities are supporting ongoing collaboration in design and delivery of landscape repair programs to improve Reef water quality."
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "5. Initiatives to build regional capacity and capability to design, deliver, and maintain the legacy of Reef Trust investments are in place and supporting outcome delivery."
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "6. First Nations people are actively participating in project design, delivery, maintenance and monitoring."
    },
    {
        "type": "short",
        "category": "Ecological health",
        "outcome": "7. Technical advice and input has been obtained to identify, design and ensure maintenance and monitoring occurs for Landscape Repair Sites."
    }
];

var priorities = [
    {
        "category": "Ecological health",
        "priority": "Great Barrier Reef"
    }
];

//Create the parent program
let programName = "Reef Trust";
var parent = createOrFindProgram(programName);
var subprograms = ["Landscape Repair Program – Procurement"]

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



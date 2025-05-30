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
                    "title": "Additional benefits TEST 25 March 2025",
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
                    "title": "Project Outcomes TEST 25 March 2025",
                    "extendedOutcomes": true
                }
            },
            {
                "template": "outcomeStatements",
                "model": {
                    "outcomeType": "short",
                    "helpText": "Outline the degree of impact having undertaken the services for up to three years. Ensure the outcomes are measurable with consideration to the baseline and proposed monitoring regime",
                    "subtitle": "Short-term outcome statement/s TEST 25 March 2025",
                    "extendedOutcomes": true
                }
            },
            {
                "template": "extendedKeyThreats",
                "model": {
                    "servicesHelpText": "Project Services/Target measures selected in this section will be pre-populated into the Project services and targets and Project service forecasts tables",
                    "threatHelpText": "Describe the key threats or key threatening processes to the investment priority",
                    "methodologyHeading": "Some test text",
                    "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance",
                    "interventionHelpText": "Describe the proposed method to address the threat or threatening process",
                    "title": "Key threat(s) and/or key threatening processes and/or Barriers/Issues"
                }
            },
            {
                "template": "projectMethodology",
                "model": {
                    "helpText": "In addition to listing your project assumptions, please list any nominated project services that will not be charged for.\nInclude all those conditions or factors that are sufficient to guarantee the success of the project, for example, on ground activities were not impacted by adverse weather conditions. Ensure what’s documented here aligns to those assumptions documented within the Project Logic.",
                    "maxSize": "4000",
                    "tableHeading": "Project delivery assumptions (4000 character limit [approx. 650 words]) TEST 25 March 2025"
                }
            },
            {
                "template": "projectPartnerships",
                "model": {
                    "helpTextHeading": "Note: Not limited to key subcontractors.TEST 25 March 2025",
                    "helpTextPartnerName": "Insert name of project partner. To be a project partner, they need to be actively involved in the planning or delivery of the project TEST 25 March 2025"
                }
            },
            {
                "template": "extendedBaselineMonitoring",
                "model": {
                    "approachHeading": "Monitoring method TEST 25 March 2025",
                    "indicatorHeading": "Monitoring methodology TEST 25 March 2025",
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
                    "title": "Project review, improvement and evaluation methodology and approach (3000 character limit [approximately 500 words]) TEST 25 March 2025"
                }
            },
            {
                "template": "nationalAndRegionalPlans",
                "model": {
                    "includeUrl": true,
                    "headingTitle": "Conservation and management plans and/or Sustainability plans/priorities/frameworks TEST 25 March 2025"
                }
            },
            {
                "template": "serviceOutcomeTargets",
                "model": {
                    "titleHelpText": "Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections TEST 25 March 2025",
                    "title": "Project services and targets TEST 25 March 2025",
                    "serviceName": "Service"
                }
            },
            {
                "template": "serviceForecasts",
                "model": {
                    "titleHelpText": "Service and Target measure fields pre-populated through the Project Service/Target Measure/s to address threats field and Monitoring methodology sections TEST 25 March 2025"
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
                        "0e2f8d61-b7b4-4d2d-b07c-4fc20bbe326a",
                        "bb506258-e907-43d3-99bd-0fe0400f654e"
                    ],
                    "serviceId": 10
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
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "reportingPeriodInMonths": 36,
                "multiple": false,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "maximumOwnerDurationInMonths": 35,
                "label": "Outcomes Report 1",
                "alignToOwnerStart": true,
                "reportType": "Single",
                "minimumOwnerDurationInMonths": null,
                "reportNameFormat": "Outcomes Report 1",
                "alignToOwnerEnd": true,
                "category": "Outcomes Report 1",
                "reportsAlignedToCalendar": false,
                "activityType": "NHT Outcomes 1 Report"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "minimumOwnerDurationInMonths": 36,
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 24,
                "multiple": false,
                "maximumOwnerDurationInMonths": 47,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
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
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "calendarAlignmentMonth": 7,
                "label": "Outcomes Report 1",
                "category": "Outcomes Report",
                "reportsAlignedToCalendar": true,
                "activityType": "NHT Outcomes 1 Report"
            },
            {
                "reportType": "Single",
                "reportDescriptionFormat": "Outcomes Report 2 for %4$s",
                "minimumOwnerDurationInMonths": 36,
                "reportNameFormat": "Outcomes Report 2",
                "multiple": false,
                "alignToOwnerEnd": true,
                "description": "This report is still being developed.  _Please do not commence reporting until the new report is ready for use._",
                "label": "Outcomes Report 2",
                "category": "Outcomes Report 2",
                "activityType": "NHT Outcomes 2 Report",
                "alignToOwnerStart": true
            }
        ],
        "keyThreatCodes": [
            "Disease/pathogens - Areas that are infected TEST 25 March 2025",
            "Disease/pathogens - Possible infection of disease free areas",
            "Disengagement of community - Community are not informed and are not engaged in managing the environment",
            "Fire - Inappropriate fire regime",
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
        "nonAgricultureoOutcomeStartIndex": 10,
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
                "category": "Threatened Species"
            }
        ],
        "targeted": true,
        "shortDescription": "New extinctions",
        "category": "Threatened Species",
        "outcome": "4.  Species and Landscapes (Long term): Threatened Species (TS) - New extinctions of plants and animals are prevented"
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
        "outcome": "5.  Species and Landscapes (Long term): Threatened Species (TS) - New extinctions of plants and animals are prevented"
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
        "outcome": "6.  Species and Landscapes (Long term): Threatened Species (TS) - New extinctions of plants and animals are prevented"
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
        "priorities": [
            {
                "category": "World Heritage Sites"
            }
        ],
        "shortDescription": "World Heritage",
        "category": "World Heritage Sites",
        "type": "secondary",
        "outcome": "2: World Heritage Protection (Long term): The outstanding universal value of world heritage properties listed for their natural heritage value is maintained and improved"
    },
    {
        "priorities": [
            {
                "category": "Ramsar"
            }
        ],
        "targeted": true,
        "shortDescription": "Ramsar Sites",
        "category": "Ramsar",
        "type": "secondary",
        "outcome": "3: Ramsar Wetland Protection (Long term): The ecological character of targeted Ramsar sites is maintained and/or improved, building resilience to climate change"
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
        "category": "World Heritage",
        "type": "medium",
        "outcome": "2. World Heritage Protection (Medium term): Threats to the outstanding universal value of world heritage properties listed for their natural heritage value have been reduced through the implementation of priority actions"
    },
    {
        "category": "World Heritage",
        "type": "medium",
        "outcome": "2. World Heritage Protection (Medium term): Managing Threats - Threats from climate change, extreme events and invasive species have been reduced"
    },
    {
        "category": "World Heritage",
        "type": "medium",
        "outcome": "2. World Heritage Protection (Medium term): Managing Threats - Threats from disease have been reduced"
    },
    {
        "category": "World Heritage",
        "type": "medium",
        "outcome": "2. World Heritage Protection (Medium term): Managing Threats - Increased leadership and/or participation of First Nations people in the management of threats to World Heritage properties"
    },
    {
        "category": "Threatened Species",
        "type": "medium",
        "outcome": "2. World Heritage Protection (Medium term): Improving land management practices and protecting habitat - Threats from inappropriate fire management are reduced"
    },
    {
        "category": "World Heritage",
        "type": "medium",
        "outcome": "2. World Heritage Protection (Medium term): Improving land management practices and protecting habitat - Threats from inappropriate management of human impacts, climate change and extreme events are reduced"
    },
    {
        "category": "World Heritage",
        "type": "medium",
        "outcome": "2. World Heritage Protection (Medium term): Improving land management practices and protecting habitat - Increased leadership and/or participation of First Nations people in the management and protection of World Heritage properties"
    },
    {
        "category": "Ramsar",
        "type": "medium",
        "outcome": "3. Ramsar Wetland Protection (Medium term): Priority actions at targeted Ramsar sites will reduce threats, restore or maintain ecological character and increase climate change resilience"
    },
    {
        "category": "Ramsar",
        "type": "medium",
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - The critical components, processes and services of the wetland actively maintained and/or improved"
    },
    {
        "category": "Ramsar",
        "type": "medium",
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - Absence/reduction of non-native species"
    },
    {
        "category": "Ramsar",
        "type": "medium",
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - Increased leadership and/or participation of First Nations people in the management of threats to Ramsar sites"
    },
    {
        "category": "Ramsar",
        "type": "medium",
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - Adaptive management planning and actions are building resilience to extreme climate events"
    },
    {
        "category": "Ramsar",
        "type": "medium",
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Wetland biota and/or abundance is maintained and improved"
    },
    {
        "category": "Ramsar",
        "type": "medium",
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Hydrological regimes have been restored and maintained"
    },
    {
        "category": "Ramsar",
        "type": "medium",
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Improved condition of wetland vegetation/habitat"
    },
    {
        "category": "Ramsar",
        "type": "medium",
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Quality of breeding, foraging and roosting habitat is improved"
    },
    {
        "category": "Ramsar",
        "type": "medium",
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Increased leadership and/or participation of First Nations people in the restoration and/or maintenance of the ecological character of Ramsar sites"
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
    },
    {
        "type": "short",
        "category": "World Heritage",
        "outcome": "2. World Heritage Protection (Short term): Managing threats - Pest predator and competitor species have been controlled"
    },
    {
        "type": "short",
        "category": "World Heritage",
        "outcome": "2. World Heritage Protection (Short term): Managing threats -Threats from disease have been contained or reduced"
    },
    {
        "type": "short",
        "category": "World Heritage",
        "outcome": "2. World Heritage Protection (Short term): Improving land management practices and protecting habitat - Inappropriate fire regimes have been reduced or halted"
    },
    {
        "type": "short",
        "category": "World Heritage",
        "outcome": "2. World Heritage Protection (Short term): Improving land management practices and protecting habitat - Land management practices have improved (within and around heritage properties)"
    },
    {
        "type": "short",
        "category": "World Heritage",
        "outcome": "2. World Heritage Protection (Short term): Improving land management practices and protecting habitat - Actions to reduce nutrient levels have been implemented, and nutrient levels are beginning to stabilise/improve "
    },
    {
        "type": "short",
        "category": "World Heritage",
        "outcome": "2. World Heritage Protection (Short term): Climate adaption and resilience - Climate change resilience and adaptive capacity actions underway"
    },
    {
        "type": "short",
        "category": "World Heritage",
        "outcome": "2. World Heritage Protection (Short term): First Nations People and community involvement - First Nations people are leading and/or participating in management and protection activities"
    },
    {
        "type": "short",
        "category": "Ramsar",
        "outcome": "3. Ramsar Wetland Protection (Short term): Managing threats -  Inappropriate land management practices have decreased within the catchment"
    },
    {
        "type": "short",
        "category": "Ramsar",
        "outcome": "3. Ramsar Wetland Protection (Short term): Managing Threats - Pest predator and competitor species have been controlled "
    },
    {
        "type": "short",
        "category": "Ramsar",
        "outcome": "3. Ramsar Wetland Protection (Short term):  Managing Threats - Appropriate fire management regimes within and external to site"
    },
    {
        "type": "short",
        "category": "Ramsar",
        "outcome": "3. Ramsar Wetland Protection (Short term): Protecting and Improving Habitat - Area and quality of suitable wetland habitat has increased and/or is maintained"
    },
    {
        "type": "short",
        "category": "Ramsar",
        "outcome": "3. Ramsar Wetland Protection (Short term): Protecting and Improving Habitat - Water quality has been stabilised and/or improved  "
    },
    {
        "type": "short",
        "category": "Ramsar",
        "outcome": "3. Ramsar Wetland Protection (Short term): Protecting and Improving Habitat - Improved access control to protect sensitive species and habitats"
    },
    {
        "type": "short",
        "category": "Ramsar",
        "outcome": "3. Ramsar Wetland Protection (Short term): Climate adaption and resilience - Climate change resilience and adaptive capacity actions underway to improve and/or maintain the ecological character of Ramsar sites "
    },
    {
        "type": "short",
        "category": "Ramsar",
        "outcome": "3. Ramsar Wetland Protection (Short term): First Nations People and community involvement - First Nations people are leading and/or participating in restoration, maintenance and protection activities"
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
let programName = "Priority Conservation and Recovery Actions for the Maugean Skate";
var parent = createOrFindProgram(programName);
var subprograms = ["Maugean Skate Program"]

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



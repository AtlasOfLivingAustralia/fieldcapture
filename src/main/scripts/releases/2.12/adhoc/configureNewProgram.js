load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
var userId = '';




var config=
    {
        "excludes": [],
        "programServiceConfig": {
            "serviceFormName": "RLP Output Report - Review",
            "programServices": [
                {
                    serviceId: 1,
                    serviceTargetLabels: [ 'Number of baseline data sets collected and/or synthesised' ]
                },
                {
                    serviceId: 2,
                    serviceTargetLabels: [ 'Number of communication materials published' ]
                },
                {
                    serviceId: 3,
                    serviceTargetLabels: [
                        'Number of field days',
                        'Number of training / workshop events',
                        'Number of on-ground trials / demonstrations' ]
                },
                {
                    serviceId: 4,
                    serviceTargetLabels: [
                        'Number of structures installed'
                    ]
                },
                {
                    serviceId: 5,
                    serviceTargetLabels: [
                        'Area (ha) treated for pest animals - initial',
                        'Area (ha) treated for pest animals - follow-up',
                        'Length (km) treated for pest animals - follow-up',
                        'Length (km) treated for pest animals - initial'
                    ]
                },
                {
                    serviceId: 7,
                    serviceTargetLabels: [
                        'Length (km) of stream/coastline treated for erosion - initial',
                        'Length (km) of stream/coastline treated for erosion - follow-up'
                    ]
                },
                {
                    serviceId: 8,
                    serviceTargetLabels: [
                        'Area (ha) covered by conservation agreements established',
                        'Area (ha) where implementation activities conducted (implementation/stewardship)'
                    ]
                },
                {
                    serviceId: 9,
                    serviceTargetLabels: [
                        'Number of pest animal-free enclosures - initial',
                        'Number of pest animal-free enclosures - maintained',
                        'Number of days maintaining pest animal-free enclosures',
                        'Area (ha) of pest animal-free enclosure'
                    ]
                },
                {
                    serviceId: 10,
                    serviceTargetLabels: [
                        'Number of captive breeding and release, translocation, or re-introduction programs established',
                        'Number of captive breeding and release, translocation, or re-introduction programs maintained'
                    ]
                },
                {
                    serviceId: 12,
                    serviceTargetLabels: [
                        'Number of farm management surveys conducted - initial',
                        'Number of farm management surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 13,
                    serviceTargetLabels: [
                        'Number of fauna surveys conducted - baseline',
                        'Number of fauna surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 14,
                    serviceTargetLabels: [
                        'Area (ha) treated by fire management action/s - initial',
                        'Area (ha) treated by fire management action/s - follow-up'
                    ]
                },
                {
                    serviceId: 15,
                    serviceTargetLabels: [
                        'Number of flora surveys conducted - baseline',
                        'Number of flora surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 16,
                    serviceTargetLabels: [
                        'Number of treatments implemented to improve site eco-hydrology - initial',
                        'Number of treatments implemented to improve site eco-hydrology - follow-up'
                    ]
                },
                {
                    serviceId: 42,
                    serviceTargetLabels: [
                        'Number of habitat condition assessment surveys conducted - baseline',
                        'Number of habitat condition assessment surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 17,
                    serviceTargetLabels: [ 'Number of potential sites assessed' ]
                },
                {
                    serviceId: 18,
                    serviceTargetLabels: [
                        'Number of treatments implemented to improve water management',
                        'Area (ha) of catchment being managed as a result of this management action'
                    ]
                },
                {
                    serviceId: 19,
                    serviceTargetLabels: [
                        'Area (ha) covered by practice change - initial',
                        'Area (ha) covered by practice change - follow-up'
                    ]
                },
                {
                    serviceId: 20,
                    serviceTargetLabels: [
                        'Area (ha) for disease treatment/prevention - initial',
                        'Area (ha) for disease treatment/prevention - follow-up',
                        'Length (km) for disease treatment/prevention - initial',
                        'Length (km) for disease treatment/prevention - follow-up'
                    ]
                },
                {
                    serviceId: 23,
                    serviceTargetLabels: [
                        'Number of pest animal surveys conducted - baseline',
                        'Number of pest animal surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 24,
                    serviceTargetLabels: [
                        'Number of seed germination/plant survival surveys completed - indicator'
                    ]
                },
                {
                    serviceId: 26,
                    serviceTargetLabels: [
                        'Area (ha) of remediation of riparian/aquatic areas - initial',
                        'Area (ha) of remediation of riparian/aquatic areas - follow-up',
                        'Length (km) of remediation of riparian/aquatic areas - initial',
                        'Length (km) of remediation of riparian/aquatic areas - follow-up',
                    ]
                },
                {
                    serviceId: 27,
                    serviceTargetLabels: [
                        'Area (ha) treated for weeds - initial',
                        'Area (ha) treated for weeds - follow-up',
                        'Length (km) treated for weeds - initial',
                        'Length (km) treated for weeds - follow-up'
                    ]
                },
                {
                    serviceId: 28,
                    serviceTargetLabels: [
                        'Area (ha) of habitat revegetated - initial',
                        'Area (ha) of habitat revegetated - maintenance',
                    ]
                },
                {
                    serviceId: 29,
                    serviceTargetLabels: [
                        'Number of skills and knowledge surveys conducted - baseline',
                        'Number of skills and knowledge surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 30,
                    serviceTargetLabels: [
                        'Number of soil tests conducted - baseline',
                        'Number of soil tests conducted - indicator',
                    ]
                },
                {
                    serviceId: 31,
                    serviceTargetLabels: [
                        'Number of interventions - initial',
                        'Number of interventions - follow-up'
                    ]
                },
                {
                    serviceId: 32,
                    serviceTargetLabels: [
                        'Number of water quality surveys conducted - baseline',
                        'Number of water quality surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 33,
                    serviceTargetLabels: [
                        'Number of weed distribution surveys conducted - baseline',
                        'Number of weed distribution surveys conducted - indicator'
                    ]
                },
                {
                    serviceId: 34,
                    serviceTargetLabels: [
                        'Area (ha) of debris removal - initial',
                        'Area (ha) of debris removal - follow-up',
                        'Length (km) of debris removal - initial',
                        'Length (km) of debris removal - follow-up'
                    ]
                },
                {
                    serviceId: 35,
                    serviceTargetLabels: [
                        'Area (ha) of site preparation',
                        'Length (km) of site preparation'
                    ]
                },
                {
                    serviceId: 36,
                    serviceTargetLabels: [
                        'Amount (grams) seed collected',
                        'Number of days propagating',
                        'Number of plants propagated'
                    ]
                }
            ]

        },
        "visibility": "public",
        "requiresActivityLocking": true,
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
                "firstReportingPeriodEnd": "2021-06-30T14:00:00Z",
                "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
                "reportingPeriodInMonths": 3,
                "description": "",
                "category": "Outputs Reporting",
                "activityType": "RLP Output Report - Review",
                "canSubmitDuringReportingPeriod": true
            },
            {
                "firstReportingPeriodEnd": "2021-06-30T14:00:00Z",
                "reportType": "Administrative",
                "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
                "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
                "reportingPeriodInMonths": 12,
                "description": "",
                "category": "Annual Progress Reporting",
                "activityType": "RLP Annual Report"
            },
            {
                "reportType": "Single",
                "firstReportingPeriodEnd": "2024-06-30T14:00:00Z",
                "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
                "reportNameFormat": "Outcomes Report 1",
                "reportingPeriodInMonths": 36,
                "multiple": false,
                "description": "Before beginning Outcomes Report 1, please go to the Data set summary tab and complete a form for each data set collected for this project. Help with completing this form can be found in Section 10 of the [RLP MERIT User Guide](http://www.nrm.gov.au/my-project/monitoring-and-reporting-plan/merit)",
                "category": "Outcomes Report 1",
                "reportsAlignedToCalendar": false,
                "activityType": "RLP Short term project outcomes"
            }
        ],
        "navigationMode": "returnToProject",
        "supportsMeriPlanHistory": true,
        "meriPlanContents": [
            {
                "template": "name",
                "model": {
                    "tableFormatting": true
                }
            },
            {
                "template": "priorityPlace"
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
                    "helpText":"Projects more than 3 years in duration must set medium-term Project outcomes achievable at project completion. Ensure proposed outcomes are measurable with consideration to the baseline and proposed monitoring regime"
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
                    "threatHelpText":"Describe the key threats or key threatening processes to the investment priority",
                    "evidenceHelpText": "List evidence that will be retained to demonstrate delivery of this service. Refer to Evidence Guide and Project Service Summaries for guidance",
                    "interventionHelpText":"Describe the proposed method to address the threat or threatening process"
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
                    "baselineHelpText": "Describe the project baseline to be established",
                    "baselineServiceHelpText": "Select the relevant Project Service(s)/Target measure(s) that will be used to support the development of the baseline",
                    "monitoringServiceHelpText": "Select the relevant Project Services(s)/Target measure(s) that will be used to support ongoing monitoring",
                    "baselineMethodHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
                    "approachHelpText": "EMSA modules mandatory unless exemption agreed to by the Department. Where an exemption has been provided the user can then select \"Other\"",
                    "titleHelpText": "Describe the Project Baseline(s) and ongoing monitoring which will be used to report progress towards this projects outcome(s)",
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
                    "serviceName": "Service"
                }
            },
            {
                "template": "serviceForecasts",
                "excludedModes":["PRINT"]
            }
        ],
        keyThreatCodes: [
            "Climate change adaptation",
            "Comprehensive regenerative agricultural practices",
            "Farm Production management",
            "Fencing",
            "Feral animal management",
            "Fire management",
            "Food security",
            "Ground cover management",
            "Improving market access opportunities through sustainability credentials",
            "Livestock",
            "Native vegetation management",
            "Soil Management",
            "Water management",
            "Weeding",
            "Native fauna - Competition",
            "Native fauna - predation",
            "Habitat loss - Dieback/senescence",
            "Habitat loss - Habitat fragmentation",
            "Habitat loss - Land clearing",
            "Habitat loss - Breeding place disturbance",
            "Habitat loss - Feeding habitat loss/interference",
            "Habitat loss - Loss of critical ecosystem service supporting habitat",
            "Land management practices - Domestic grazing/stock impacts",
            "Land management practices - Runoff",
            "Land management practices - Excessive fertiliser use",
            "Land management practices - changes to hydrology and aquatic systems",
            "Land management practices - excess recharge of groundwater",
            "Land management practices – Excess use (or over use) of surface water or groundwater resources",
            "Weeds - Control/spraying",
            "Weeds - Competition",
            "Weeds - Spread of weeds from surrounding areas",
            "Weeds - Introduction of new weed",
            "Low population numbers",
            "Low habitat area",
            "Pest - competition/exclusion",
            "Pest - predation",
            "Pest - habitat degradation",
            "Pest - Disease transmission",
            "Pest - Introduction of new pest animals",
            "Lack of protection for ecological assets during fire control activities",
            "Lack of/inappropriate fire regime",
            "Disease/pathogens - Areas that are infected",
            "Disease/pathogens - Possible infection of disease free areas",
            "Pollution - Chemical",
            "Pollution - Eutrophication/algal blooms",
            "Pollution - Inappropriate waste disposal",
            "Pollution - Sediment",
            "Climate Change - Sea level rises",
            "Climate Change - Unexpected seasonal/temperature extremes",
            "Climate Change - Changed flooding regime",
            "Climate Change - Changed rainfall patterns",
            "Climate Change - Wildfire",
            "Genetic bottleneck/inbreeding",
            "Data deficiency/lack of ecological data",
            "Human interference - flow-on effects of housing development",
            "Human interference - Road/vehicle strike",
            "Human interference - Recreational pressures",
            "Human interference - Illegal activities",
            "Human interference - Fish and harvesting aquatic resources (commercial)",
            "Human interference - Recreational fishing",
            "Human interference - lack of strategic and statutory planning consideration for ecological assets",
            "Human interference - Lack of knowledge and understanding",
            "Human interference - land use intensification",
            "Human interference - industrial development"
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
        outcome: "1.  Species and Landscapes (Long term): Threatened Species (TS) - The trajectory of species targeted under the Threatened Species Action Plan 2022-2032 and other EPBC Act listed Species is improved",
        shortDescription: "EPBC Species",
        category: "Threatened Species",
        priorities: [
            {
                category: "Threatened Species"
            }
        ]
    },
    {
        outcome: "1.  Species and Landscapes (Long term): Threatened Species (TS) - New extinctions of plants and animals are prevented",
        shortDescription: "New extinctions",
        category: "Threatened Species",
        priorities: [
            {
                category: "Threatened Species"
            }
        ]
    },
    {
        outcome: "1.  Species and Landscapes (Long term): Threatened Ecological Communities (TECs) and priority places - The condition of targeted EPBC Act listed Threatened Ecological Communities and identified priority places under the Threatened Species Action Plan 2022-2032 is improved",
        shortDescription: "Threatened Ecological Communities",
        category: "Threatened Ecological Communities",
        priorities: [
            {
                category: "Threatened Ecological Communities"
            }
        ]
    },
    {
        outcome: "2: World Heritage Protection (Long term): The outstanding universal value of world heritage properties listed for their natural heritage value is maintained and improved",
        shortDescription: "World Heritage",
        category: "World Heritage",
        priorities: [
            {
                category: "World Heritage"
            }
        ]
    },
    {
        outcome: "3: Ramsar Wetland Protection (Long term): The ecological character of targeted Ramsar sites is maintained and/or improved, building resilience to climate change",
        shortDescription: "Ramsar Sites",
        category: "Ramsar",
        priorities: [
            {
                category: "Ramsar"
            }
        ]
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Targeted threatened species (TS) are on track for improved trajectory",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Species at high risk of imminent extinction are identified and supported to persist",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species - Priority species are being assisted to strengthen reliance and adaptive capacity for climate change",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened species -Increased leadership and/or participation of First Nations people in the management and recovery of threatened species",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - The implementation of priority actions is leading to an improvement in the condition of targeted TECs and priority places",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - Resilience to climate change and extreme events has been increased",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Medium term): Threatened Ecological Communities and priority places - Increased leadership and/or participation of First Nations people in the management and recovery of threatened ecological communities and priority places",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Threats to the outstanding universal value of world heritage properties listed for their natural heritage value have been reduced through the implementation of priority actions",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Managing Threats - Threats from climate change, extreme events and invasive species have been reduced",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Managing Threats -Threats from disease have been reduced",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Managing Threats - Increased leadership and/or participation of First Nations people in the management of threats to World Heritage properties",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Improving land management practices and protecting habitat -Threats from inappropriate fire management are reduced",
        category: "Threatened Species",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Improving land management practices and protecting habitat -Threats from inappropriate management of human impacts, climate change and extreme events are reduced",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "2. World Heritage Protection (Medium term): Improving land management practices and protecting habitat - Increased leadership and/or participation of First Nations people in the management and protection of World Heritage properties",
        category: "World Heritage",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Priority actions at targeted Ramsar sites will reduce threats, restore or maintain ecological character and increase climate change resilience",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - The critical components, processes and services of the wetland actively maintained and/or improved",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - Absence/reduction of non-native species",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - Increased leadership and/or participation of First Nations people in the management of threats to Ramsar sites",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - Adaptive management planning and actions are building resilience to extreme climate events",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Wetland biota and/or abundance is maintained and improved",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Hydrological regimes have been restored and maintained",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Improved condition of wetland vegetation/habitat",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Quality of breeding, foraging and roosting habitat is improved",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Increased leadership and/or participation of First Nations people in the restoration and/or maintenance of the ecological character of Ramsar sites",
        category: "Ramsar",
        type: "medium"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): Managing Threats - Pest predator an competitor species have been controlled or are under active, long-term control programs",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): Managing Threats - Threats from disease have been contained, reduced or excluded",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): Improving habitat - Land management practices have improved",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): Improving habitat - Quality of (TS/TECs) habitat has improved",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): Improving habitat - Area/Extent of (TS/TECs) habitat has increased",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): Improving habitat - Increased connectivity between patches",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): Improving habitat - Quality of breeding and foraging habitat is improved",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): Creating insurance populations - Existing populations have been protected",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): Creating insurance populations - Re-introductions have enhanced wild populations",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): Climate adaption and resilience - Climate change resilience and adaptive capacity actions underway",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "1.  Species and Landscapes (Short term): First Nations People and community involvement - First Nations people are leading and/or participating in recovery activities",
        "type": "short",
        "category": "Threatened Species"
    },
    {
        "outcome": "2. World Heritage Protection (Short term): Managing threats - Pest predator and competitor species have been controlled",
        "type": "short",
        "category": "World Heritage"
    },
    {
        "outcome": "2. World Heritage Protection (Short term): Managing threats -Threats from disease have been contained or reduced",
        "type": "short",
        "category": "World Heritage"
    },
    {
        "outcome": "2. World Heritage Protection (Short term): Improving land management practices and protecting habitat - Inappropriate fire regimes have been reduced or halted",
        "type": "short",
        "category": "World Heritage"
    },
    {
        "outcome": "2. World Heritage Protection (Short term): Improving land management practices and protecting habitat - Land management practices have improved (within and around heritage properties)",
        "type": "short",
        "category": "World Heritage"
    },
    {
        "outcome": "2. World Heritage Protection (Short term): Improving land management practices and protecting habitat - Actions to reduce nutrient levels have been implemented, and nutrient levels are beginning to stabilise/improve",
        "type": "short",
        "category": "World Heritage"
    },
    {
        "outcome": "2. World Heritage Protection (Short term): Climate adaption and resilience - Climate change resilience and adaptive capacity actions underway",
        "type": "short",
        "category": "World Heritage"
    },
    {
        "outcome": "2. World Heritage Protection (Short term): First Nations People and community involvement - First Nations people are leading and/or participating in management and protection activities",
        "type": "short",
        "category": "World Heritage"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Short term): Managing threats -  Inappropriate land management practices have decreased within the catchment",
        "type": "short",
        "category": "Ramsar"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Managing Threats - Pest predator and competitor species have been controlled",
        "type": "short",
        "category": "Ramsar"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term):  Managing Threats - Appropriate fire management regimes within and external to site",
        "type": "short",
        "category": "Ramsar"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Area and quality of suitable wetland habitat has increased and/or is maintained",
        "type": "short",
        "category": "Ramsar"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Water quality has been stabilised and/or improved",
        "type": "short",
        "category": "Ramsar"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Protecting and Improving Habitat - Improved access control to protect sensitive species and habitats",
        "type": "short",
        "category": "Ramsar"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): Climate adaption and resilience -Climate change resilience and adaptive capacity actions underway to improve and/or maintain the ecological character of Ramsar sites",
        "type": "short",
        "category": "Ramsar"
    },
    {
        "outcome": "3. Ramsar Wetland Protection (Medium term): First Nations People and community involvement -First Nations people are leading and/or participating in restoration, maintenance and protection activities",
        "type": "short",
        "category": "Ramsar"
    }

];
let programName = "Project Services Review Group";
var program = createOrFindProgram(programName);

program.config = config;
program.outcomes = outcomes;
//program.priorities = priorities;

// Convert labels to scoreIds (scoreIds can be different between test & prod)
let s = config.programServiceConfig.programServices;
for (let i=0; i<s.length; i++) {
    let t = s[i].serviceTargetLabels;
    s[i]['serviceTargets'] = [];
    for (let j=0; j<t.length; j++) {
        let score = db.score.findOne({label:t[j]});
        if (!score) {
            print("No score with id "+t[j]);
        }
        s[i]['serviceTargets'].push(score.scoreId);
    }
    delete s[i].serviceTargetLabels;
}

db.program.replaceOne({programId: program.programId}, program);

// Add labels and output mapping for services used by the new program
var programLabels = {};
var label =  {label: 'Synthesising and finalising baseline data'};
programLabels[program.programId] = label;
db.service.update({legacyId:NumberInt(1)}, {$set:{programLabels:programLabels}});

label.label = 'Captive Breeding, Translocation or Re-introduction Programs';
db.service.update({legacyId:NumberInt(10)}, {$set:{programLabels:programLabels}});

label.label = 'Establishing and Implementing Conservation Agreements';
db.service.update({legacyId:NumberInt(8)}, {$set:{programLabels:programLabels}});

label.label = 'Identifying and Prioritising the Location of potential sites';
db.service.update({legacyId:NumberInt(17)}, {$set:{programLabels:programLabels}});

label.label = 'Improving Hydrological Regimes for Site Eco-hydrology';
db.service.update({legacyId:NumberInt(18)}, {$set:{programLabels:programLabels}});

label.label = 'Seed Germination/Plant Survival Survey';
db.service.update({legacyId:NumberInt(24)}, {$set:{programLabels:programLabels}});

label.label = 'Establishing and Maintaining Pest Animal-Free Enclosures'
db.service.update({legacyId:NumberInt(9)}, {$set:{programLabels:programLabels}});

label.label = 'Implementing Fire Management Actions'
db.service.update({legacyId:NumberInt(14)}, {$set:{programLabels:programLabels}});

label.label = 'Improving Hydrological Regimes for Site Eco-hydrology';
db.service.update({legacyId:NumberInt(18)}, {$set:{programLabels:programLabels}});

label.label = 'Managing Diseases';
db.service.update({legacyId:NumberInt(20)}, {$set:{programLabels:programLabels}});

label.label = 'Seed Collection and Propagation';
db.service.update({legacyId:NumberInt(36)}, {$set:{programLabels:programLabels}});

label.label = 'Undertaking Emergency Interventions to Prevent Extinction';
db.service.update({legacyId:NumberInt(31)}, {$set:{programLabels:programLabels}});

function addService(newServiceName, legacyId) {
    if (!db.service.findOne({legacyId:legacyId})) {
        var newService = {
            "outputs": [],
            "name": newServiceName,
            "legacyId": legacyId,
            serviceId: UUID.generate()
        }
        db.service.insertOne(newService);
    } else {
        db.service.updateOne({legacyId: legacyId}, {$set: {name: newServiceName}});
    }
}
addService("Habitat Condition Assessment Survey", NumberInt(42));


const newScores = [
    'Number of captive breeding and release, translocation, or re-introduction programs established',
    'Number of captive breeding and release, translocation, or re-introduction programs maintained',
    'Area (ha) of debris removal - initial',
    'Area (ha) of debris removal - follow-up',
    'Length (km) of debris removal - initial',
    'Length (km) of debris removal - follow-up',
    'Length (km) of stream/coastline treated for erosion - initial',
    'Length (km) of stream/coastline treated for erosion - follow-up',
    'Area (ha) covered by conservation agreements established',
    'Area (ha) where implementation activities conducted (implementation/stewardship)',
    'Number of pest animal-free enclosures - initial',
    'Number of pest animal-free enclosures - maintained',
    'Number of days maintaining pest animal-free enclosures',
    'Area (ha) of pest animal-free enclosure',
    'Number of farm management surveys conducted - baseline',
    'Number of farm management surveys conducted - indicator',
    'Number of fauna surveys conducted - baseline',
    'Number of fauna surveys conducted - indicator',
    'Number of flora surveys conducted - baseline',
    'Number of flora surveys conducted - indicator',
    'Area (ha) of augmentation - initial',
    'Area (ha) of augmentation - maintained',
    'Number of locations where structures installed - initial',
    'Number of locations where structures installed - maintained',
    'Number of habitat condition assessment surveys conducted - baseline',
    'Number of habitat condition assessment surveys conducted - indicator',
    'Number of potential sites assessed',
    'Area (ha) treated by fire management action/s - initial',
    'Area (ha) treated by fire management action/s - follow-up',
    'Number of treatments implemented to improve site eco-hydrology - initial',
    'Number of treatments implemented to improve site eco-hydrology - follow-up',
    'Area (ha) covered by practice change - initial',
    'Area (ha) covered by practice change - follow-up',
    'Area (ha) for disease treatment/prevention - initial',
    'Area (ha) for disease treatment/prevention - follow-up',
    'Length (km) for disease treatment/prevention - initial',
    'Length (km) for disease treatment/prevention - follow-up',
    'Number of pest animal surveys conducted - baseline',
    'Number of pest animal surveys conducted - indicator',
    'Number of structures installed to promote aquatic health',
    'Area (ha) of remediation of riparian/aquatic areas - initial',
    'Area (ha) of remediation of riparian/aquatic areas - follow-up',
    'Length (km) of remediation of riparian/aquatic areas - initial',
    'Length (km) of remediation of riparian/aquatic areas - follow-up',
    'Area (ha) of habitat revegetated - initial',
    'Area (ha) of habitat revegetated - maintained',
    'Amount (grams) seed collected',
    'Number of days propagating',
    'Number of seed germination/plant survival surveys completed - indicator',
    'Length (km) of site preparation',
    'Number of water quality surveys conducted - baseline',
    'Number of water quality surveys conducted - indicator',
    'Number of weed distribution surveys conducted - baseline',
    'Number of weed distribution surveys conducted - indicator',
    'Number of interventions - initial',
    'Number of interventions - follow-up',
    'Number of soil tests conducted - baseline',
    'Number of soil tests conducted - indicator',
    'Number of treatments implemented to improve site eco-hydrology - initial',
    'Number of treatments implemented to improve site eco-hydrology - follow-up'
]

for (let i=0; i<newScores.length; i++) {
    let score = db.score.findOne({label:label});

    if (!score) {
        // Insert the score

    }

}



// New service - habitat condition assessment survey

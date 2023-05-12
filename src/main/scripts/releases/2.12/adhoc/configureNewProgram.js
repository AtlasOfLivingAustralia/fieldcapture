load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
var userId = '';

let programName = "Project Services Review Group";


var config =
    {
        "excludes": [],
        "programServiceConfig": {
            "serviceFormName": "RLP Output Report - Review",
            "programServices": [
                {
                    "serviceTargets": [
                        "0df7c177-2864-4a25-b420-2cf3c45ce749"
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
                        "88908921-1248-4a7c-b185-51c625c737e3"
                    ],
                    "serviceId": 3
                },
                {
                    "serviceTargets": [
                        "aa0c6b29-285e-4344-987e-dfeaf1d95648",
                        "c464b652-be5e-4658-b62f-02bf1a80bcf8",
                        "a901232d-8244-40dd-9bb7-ff9e4e9dbeac"
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
                        "d97037d2-7ee4-429b-bd26-cdcc5a269d9d",
                        "e48faf01-72eb-479c-be9b-d2d71d254fa4"
                    ],
                    "serviceId": 6
                },
                {
                    "serviceTargets": [
                        "482bdf4e-6f7a-4bdf-80d5-d619ac7cdf50",
                        "2ef32f94-14f1-4878-9eb7-c115fa18ce25"
                    ],
                    "serviceId": 7
                },
                {
                    "serviceTargets": [
                        "7709de92-0f85-490b-bc5f-2748b3db42c2",
                        "8025b157-44d7-4283-bc1c-f40fb9b99501",
                        "0ec5fd50-13e2-4bde-8e01-5955e7145cae"
                    ],
                    "serviceId": 8
                },
                {
                    "serviceTargets": [
                        "46925c6c-e222-4f6a-8553-c69929929d10",
                        "757d6c9e-ec24-486f-a128-acc9bfb87830",
                        "ffa44bad-209d-414a-bc96-e8ca3c96092f"
                    ],
                    "serviceId": 9
                },
                {
                    "serviceTargets": [
                        "edb6e94a-d781-447c-8792-5e06e5c912a8",
                        "a3afea6e-711c-4ef2-bb20-6d2630b7ee93"
                    ],
                    "serviceId": 10
                },
                {
                    "serviceTargets": [
                        "607e2cd4-d7c5-4d5b-867f-c2c8e7b62948",
                        "b7c067e3-6ae7-4e76-809a-312165b75f94"
                    ],
                    "serviceId": 11
                },
                {
                    "serviceTargets": [
                        "d1c10295-05e5-4265-a5f1-8a5683af2efe"
                    ],
                    "serviceId": 12
                },
                {
                    "serviceTargets": [
                        "011a161f-7275-4b5e-986e-3fe4640d0265",
                        "3e402423-3e0b-4549-9e09-2b71329ea069"
                    ],
                    "serviceId": 13
                },
                {
                    "serviceTargets": [
                        "c2dc6f91-ccb1-412e-99d0-a842a4ac4b03"
                    ],
                    "serviceId": 14
                },
                {
                    "serviceTargets": [
                        "def4e2af-dcad-4a15-8336-3765e6671f08",
                        "cf3ccbf5-d031-4a22-a746-961cdefa7318"
                    ],
                    "serviceId": 15
                },
                {
                    "serviceTargets": [
                        "c46842b6-d7b6-4917-b56f-f1b0594663fa",
                        "ab822db5-ed79-47af-badc-5a3772dab87d"
                    ],
                    "serviceId": 16
                },
                {
                    "serviceTargets": [
                        "2d877a91-6312-4c44-9ae1-2494ea3e43db"
                    ],
                    "serviceId": 17
                },
                {
                    "serviceTargets": [
                        "d4ba13a1-00c8-4e7f-8463-36b6ea37eee6",
                        "01ee5719-e814-43ce-a1b1-4e26063b5a6c"
                    ],
                    "serviceId": 18
                },
                {
                    "serviceTargets": [
                        "4bcab901-879a-402d-83f3-01528c6c86a5"
                    ],
                    "serviceId": 19
                },
                {
                    "serviceTargets": [
                        "45994b98-21f1-4927-a03e-3d940ac75116"
                    ],
                    "serviceId": 20
                },
                {
                    "serviceTargets": [
                        "6eaa061c-b77b-4440-8e8f-7ebaa2ff6207"
                    ],
                    "serviceId": 21
                },
                {
                    "serviceTargets": [
                        "0e887410-a3c5-49ca-a6f5-0f2f6fae30db"
                    ],
                    "serviceId": 22
                },
                {
                    "serviceTargets": [
                        "725d9365-0889-4355-8a7f-a21ef260c468",
                        "996e3dc7-1376-47ad-a941-648cbae246b4"
                    ],
                    "serviceId": 23
                },
                {
                    "serviceTargets": [
                        "0f11a699-6063-4e91-96ca-53e45cf26b80",
                        "1144fc3d-4d31-42bd-b9fb-ab5f91db37ca"
                    ],
                    "serviceId": 24
                },
                {
                    "serviceTargets": [
                        "8a5dac4a-0bef-431c-b857-2085eca9ae7c",
                        "3c2c4aaa-fd5f-43d8-a72f-3567e6dea6f4"
                    ],
                    "serviceId": 25
                },
                {
                    "serviceTargets": [
                        "ed30b80b-7bb9-4c04-9949-093df64d124c",
                        "3d4f1932-7a5b-45d6-ae68-d0571860ea94"
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
                        "6ab3298e-c24b-49d8-9f86-441e71858b6a",
                        "f23f9fb0-99ec-4fbf-ade3-b6581fe25dcf",
                        "fd77b1b1-8234-4d06-8a02-aea6f4abb01d",
                        "f38fbd9e-d208-4750-96ce-3c032ad37684"
                    ],
                    "serviceId": 28
                },
                {
                    "serviceTargets": [
                        "4f747371-fa5f-4200-ae37-6cd59d268fe8"
                    ],
                    "serviceId": 29
                },
                {
                    "serviceTargets": [
                        "685d61e9-2ebd-4198-a83a-ac7a2fc1477a"
                    ],
                    "serviceId": 30
                },
                {
                    "serviceTargets": [
                        "91387f2b-258d-4325-aa60-828d1acf6ac6"
                    ],
                    "serviceId": 31
                },
                {
                    "serviceTargets": [
                        "ba3d0a20-1e4d-404a-9907-b95239499c2f",
                        "aa92f559-6260-4947-a714-ae6b80776b47"
                    ],
                    "serviceId": 32
                },
                {
                    "serviceTargets": [
                        "28dd9736-b66a-4ab4-9111-504d5cffba88",
                        "4670a4ba-62bb-401c-a7ed-4fbd8dc5999c"
                    ],
                    "serviceId": 33
                },
                {
                    "serviceTargets": [
                        "0f9ef068-b2f9-4e6f-9ab5-521857b036f4"
                    ],
                    "serviceId": 34
                },
                {
                    "serviceTargets": [
                        "dea1ff8b-f4eb-4987-8073-500bbbf97fcd",
                        "d48e05f4-a1cb-40e6-a4a3-bafa86b137f0"
                    ],
                    "serviceId": 35
                },
                {
                    "serviceTargets": [
                        "72d83731-3cfd-497b-bf6d-33eea76bc181",
                        "7186e284-0cb2-418e-a8cc-4343eb618140",
                        "3eea89f9-7c2e-4e4f-be0b-31d292705e3d"
                    ],
                    "serviceId": 36
                }
            ]
        },
        "visibility": "public",
        "requiresActivityLocking": true,
        "projectTemplate": "rlp",
        "activityPeriodDescriptor": "Outputs report #",
        "supportsParataoo": true,
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
        "supportedServiceIds": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
            33,
            34,
            35,
            36
        ],
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
                    "priorityHelpText": "Enter the primary investment priority/ies for the primary outcome. <br/>For outcomes 1-4, only one primary investment priority can be selected.<br/>For outcomes 5-6, select one or a maximum of two primary investment priorities"
                }
            },
            {
                "template": "additionalOutcomes",
                "model": {
                    "title": "Secondary benefits"
                }
            },
            {
                "template": "outcomeStatements",
                "model": {
                    "outcomeType": "mid",
                    "subtitle": "Medium-terms outcome statement/s",
                    "title": "Project Outcomes",
                    "extendedOutcomes": true
                }
            },
            {
                "template": "outcomeStatements",
                "model": {
                    "outcomeType": "short",
                    "helpText": "Short term outcomes statements should: <br/><ul> <li>Contribute to the 5-year Outcome (e.g. what degree of impact are you expecting from the Project's interventions )</li> <li>Outline the degree of impact having undertaken the Services for  up to 3 years, for example 'area of relevant vegetation type has increased'.</li><li>Be expressed as a SMART statement. SMART stands for Specific, Measurable, Attainable, Realistic, and Time-bound. Ensure the outcomes are measurable with consideration to the baseline and proposed monitoring regime.</li></ul><b>Please Note: </b> for Project three years or less in duration, a short-term Project outcome achievable at the Project's completion must be set.",
                    "subtitle": "Short-terms outcome statement/s",
                    "extendedOutcomes": true
                }
            },
            {
                "template": "extendedKeyThreats"
            },
            {
                "template": "sectionHeading",
                "model": {
                    "heading": "Project Details"
                }
            },
            {
                "template": "projectMethodology",
                "model": {
                    "helpText": "Describe the methodology that will be used to achieve the project outcomes. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification, and any assumptions).",
                    "maxSize": "4000",
                    "tableHeading": "Project methodology (4000 character limit [approx. 650 words])"
                }
            },
            {
                "template": "extendedBaselineMonitoring",
                "model": {
                    "approachHeading": "Monitoring indicator",
                    "indicatorHeading": "Monitoring methodology",
                    "baselineMethodHelpText": "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term, Future Drought Fund, NRM Landscapes and 5 year program outcome), and the monitoring design. ",
                    "titleHelpText": "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term, Future Drought Fund, NRM Landscapes and 5 year program outcome), and the monitoring design.",
                    "newIndicatorText": "New monitoring indicator"
                }
            },
            {
                "template": "projectReview",
                "model": {
                    "title": "Project review, evaluation and improvement methodology and approach (3000 character limit [approximately 500 words])"
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
                "template": "serviceForecasts"
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
            "Eastern Forests of Far North Queensland – QLD",
            "Brigalow Country – QLD",
            "Greater Blue Mountains - NSW",
            "Australian Alps – NSW/ACT/VIC",
            "South East Coastal Ranges - NSW/VIC",
            "Southern Plains, including the Western Victorian volcanic plain and karst springs – VIC/SA",
            "Midlands region of central Tasmanian – TAS",
            "Giant Kelp Ecological Community – TAS",
            "Mallee Birds Ecological Community – VIC/SA/NSW",
            "MacDonnell Ranges – NT",
            "Kakadu & West Arnhem – NT",
            "Yampi Sounds and surrounds  -WA",
            "Remnant WA Wheatbelt Woodlands – WA",
            "Fitz-Stirlings – WA",
            "Kangaroo Island – SA",
            "Bruny Island – TAS",
            "French Island – VIC",
            "Christmas Island – External Territory",
            "Norfolk Island – External Territory",
            "Raine Island – Queensland",
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

var program = createOrFindProgram(programName);

program.config = config;
program.outcomes = outcomes;
//program.priorities = priorities;

db.program.replaceOne({programId: program.programId}, program);


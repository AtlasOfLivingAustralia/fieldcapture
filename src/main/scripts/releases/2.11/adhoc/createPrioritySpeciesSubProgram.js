load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
var userId = '129333';

//Create the parent program
let programName = "Saving Native Species";
var parentProgram = createOrFindProgram(programName);

let refProgram = "Habitat Restoration Projects - Grants";
var subprograms = ["Priority Species"]

subprograms.forEach(function (subProgram) {
    var now = ISODate();
    var newProgram = db.program.find({name: refProgram}).next();
    delete newProgram._id
    delete newProgram.programId
    newProgram.name = subProgram
    newProgram.programId = UUID.generate()
    newProgram.dateCreated = now
    newProgram.lastUpdated = now
    newProgram.status = "active"
    newProgram.parent = parentProgram._id
    var program = db.program.find({name: subProgram})
    if (!program.hasNext()) {
        db.program.insert(newProgram);
    } else {
        print("Program Already Exist: " + subProgram)
    }
});

var projectConfig = {
    config: {
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
                        "88908921-1248-4a7c-b185-51c625c737e3",
                        "26a8213e-1770-4dc4-8f99-7e6302197504",
                        "15a49c6f-2177-4183-9955-c7e487970171",
                        "fe9f1a6c-e614-489a-80fa-4d6d76f1cf95",
                        "f7089b5b-333f-4f33-b0df-f7ef88e9f683"
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
                "firstReportingPeriodEnd": "2023-12-31T13:00:00Z",
                "reportDescriptionFormat": "Progress Report %1d",
                "reportNameFormat": "Progress Report %1d",
                "reportingPeriodInMonths": 6,
                "description": "",
                "minimumReportDurationInDays": 3,
                "label": "Semester",
                "category": "Progress Reports",
                "activityType": "Priority Threatened Species Progress Reportx",
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
                "activityType": "Priority Threatened Species Final Reportx",
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
    },
    priorities: [
        {
            "category": "Birds",
            "priority": "Australasian Bittern Botaurus poiciloptilus"
        },
        {
            "category": "Birds",
            "priority": "Black-eared Miner Manorina melanotis"
        },
        {
            "category": "Birds",
            "priority": "Carnaby's Cockatoo Calyptorhynchus latirostris"
        },
        {
            "category": "Birds",
            "priority": "Christmas Island Goshawk Accipiter hiogaster natalis"
        },
        {
            "category": "Birds",
            "priority": "Eastern Curlew Numenius madagascariensis"
        },
        {
            "category": "Birds",
            "priority": "Golden-shouldered Parrot, Alwal Psephotus chrysopterygius"
        },
        {
            "category": "Birds",
            "priority": "Hooded Plover (eastern) Thinornis cucullatus cucullatus"
        },
        {
            "category": "Birds",
            "priority": "King Island Brown Thornbill Acanthiza pusilla archibaldi"
        },
        {
            "category": "Birds",
            "priority": "Malleefowl Leipoa ocellata"
        },
        {
            "category": "Birds",
            "priority": "Night Parrot Pezoporus occidentalis"
        },
        {
            "category": "Birds",
            "priority": "Norfolk Island Green Parrot Cyanoramphus cookii"
        },
        {
            "category": "Birds",
            "priority": "Orange-bellied Parrot Neophema chrysogaster"
        },
        {
            "category": "Birds",
            "priority": "Plains-wanderer Pedionomus torquatus"
        },
        {
            "category": "Birds",
            "priority": "Princess Parrot Polytelis alexandrae"
        },
        {
            "category": "Birds",
            "priority": "Red Goshawk Erythrotriorchis radiatus"
        },
        {
            "category": "Birds",
            "priority": "Red-tailed Black Cockatoo (SE) Calyptorhynchus banksii graptogyne"
        },
        {
            "category": "Birds",
            "priority": "Regent Honeyeater Anthochaera phrygia"
        },
        {
            "category": "Birds",
            "priority": "Swift Parrot Lathamus discolor"
        },
        {
            "category": "Birds",
            "priority": "Western Ground Parrot, Kyloring Pezoporus flaviventris"
        },
        {
            "category": "Birds",
            "priority": "White-throated Grasswren, Yirlinkirrkirr Amytornis woodwardi"
        },
        {
            "category": "Birds",
            "priority": "King Island Scrubtit Acanthornis magna greeniana"
        },
        {
            "category": "Birds",
            "priority": "Noisy Scrub-bird Atrichornis clamosus"
        },
        {
            "category": "Mammals",
            "priority": "Australian Sea-lion Neophoca cinerea"
        },
        {
            "category": "Mammals",
            "priority": "Brush-tailed Rock-wallaby Petrogale penicillata"
        },
        {
            "category": "Mammals",
            "priority": "Central Rock-rat Antina Zyzomys pedunculatus"
        },
        {
            "category": "Mammals",
            "priority": "Chuditch, Western Quoll Dasyurus geoffroii"
        },
        {
            "category": "Mammals",
            "priority": "Eastern Quoll Dasyurus viverrinus"
        },
        {
            "category": "Mammals",
            "priority": "Gilbert's Potoroo Ngilkat Potorous gilbertii"
        },
        {
            "category": "Mammals",
            "priority": "Greater Bilby Macrotis lagotis"
        },
        {
            "category": "Mammals",
            "priority": "Kangaroo Island Echidna Tachyglossus aculeatus multiaculeatus"
        },
        {
            "category": "Mammals",
            "priority": "Koala Phascolarctos cinereus"
        },
        {
            "category": "Mammals",
            "priority": "Leadbeater’s Possum Gymnobelideus leadbeateri"
        },
        {
            "category": "Mammals",
            "priority": "Mountain Pygmy-possum Burramys parvus"
        },
        {
            "category": "Mammals",
            "priority": "New Holland Mouse, Pookila Pseudomys novaehollandiae"
        },
        {
            "category": "Mammals",
            "priority": "Northern Brushtail Possum Trichosurus vulpecula arnhemensis"
        },
        {
            "category": "Mammals",
            "priority": "Northern Hairy-nosed Wombat, Yaminon Lasiorhinus krefftii"
        },
        {
            "category": "Mammals",
            "priority": "Northern Hopping-mouse, Woorrentinta Notomys aquilo"
        },
        {
            "category": "Mammals",
            "priority": "Northern Quoll Dasyurus hallucatus"
        },
        {
            "category": "Mammals",
            "priority": "Numbat Myrmecobius fasciatus"
        },
        {
            "category": "Mammals",
            "priority": "Quokka Setonix brachyurus"
        },
        {
            "category": "Mammals",
            "priority": "Spectacled Flying-fox Pteropus conspicillatus"
        },
        {
            "category": "Mammals",
            "priority": "Western Ringtail Possum Pseudocheirus occidentalis"
        },
        {
            "category": "Fish",
            "priority": "Freshwater Sawfish Pristis pristis"
        },
        {
            "category": "Fish",
            "priority": "Grey Nurse Shark (eastern) Carcharias taurus"
        },
        {
            "category": "Fish",
            "priority": "Maugean Skate Zearaja maugeana"
        },
        {
            "category": "Fish",
            "priority": "Murray Hardyhead Craterocephalus fluviatilis"
        },
        {
            "category": "Fish",
            "priority": "Red Handfish Thymichthys politus"
        },
        {
            "category": "Fish",
            "priority": "Redfin Blue-eye Scaturiginichthys vermeilipinnis"
        },
        {
            "category": "Fish",
            "priority": "Stocky Galaxias Galaxias tantangara"
        },
        {
            "category": "Fish",
            "priority": "Swan Galaxias Galaxias fontanus"
        },
        {
            "category": "Fish",
            "priority": "White's Seahorse Hippocampus whitei"
        },
        {
            "category": "Frogs",
            "priority": "Growling Grass Frog, Southern Bell Frog Litoria raniformis"
        },
        {
            "category": "Frogs",
            "priority": "Kroombit Tinker Frog Taudactylus pleione"
        },
        {
            "category": "Frogs",
            "priority": "Southern Corroboree Frog Pseudophryne corroboree"
        },
        {
            "category": "Frogs",
            "priority": "Mountain Frog Philoria kundagungan"
        },
        {
            "category": "Frogs",
            "priority": "Mountain-top Nursery-frog Cophixalus monticola"
        },
        {
            "category": "Frogs",
            "priority": "White-bellied Frog Anstisia alba"
        },
        {
            "category": "Reptiles",
            "priority": "Arnhem Land Gorges Skink Bellatorias obiri"
        },
        {
            "category": "Reptiles",
            "priority": "Bellinger River Snapping Turtle Wollumbinia georgesi"
        },
        {
            "category": "Reptiles",
            "priority": "Collared Delma, Adorned Delma Delma torquata"
        },
        {
            "category": "Reptiles",
            "priority": "Great Desert Skink, Tjakura, Warrarna, Mulyamiji Liopholis kintorei"
        },
        {
            "category": "Reptiles",
            "priority": "Green Turtle Chelonia mydas"
        },
        {
            "category": "Reptiles",
            "priority": "Olive Ridley Turtle Lepidochelys olivacea"
        },
        {
            "category": "Reptiles",
            "priority": "Pygmy Blue-tongue Lizard Tiliqua adelaidensis"
        },
        {
            "category": "Reptiles",
            "priority": "Short-nosed Seasnake Aipysurus apraefrontalis"
        },
        {
            "category": "Reptiles",
            "priority": "Yinnietharra Rock-dragon Ctenophorus yinnietharra"
        },
        {
            "category": "Reptiles",
            "priority": "Canberra Grassland Earless Dragon Tympanocryptis lineata"
        },
        {
            "category": "Reptiles",
            "priority": "Western Swamp Tortoise Pseudemydura umbrina"
        },
        {
            "category": "Invertebrates",
            "priority": "Ammonite Snail Ammoniropa vigens"
        },
        {
            "category": "Invertebrates",
            "priority": "Cauliflower Soft Coral Dendronephthya australis"
        },
        {
            "category": "Invertebrates",
            "priority": "Eltham Copper Butterfly Paralucia pyrodiscus lucida"
        },
        {
            "category": "Invertebrates",
            "priority": "Giant Gippsland Earthworm Megascolides australis"
        },
        {
            "category": "Invertebrates",
            "priority": "Lord Howe Island Phasmid Dryococelus australis"
        },
        {
            "category": "Invertebrates",
            "priority": "Margaret River Burrowing Crayfish Engaewa pseudoreducta"
        },
        {
            "category": "Invertebrates",
            "priority": "Mount Lidgbird Charopid Land Snail Pseudocharopa ledgbirdi"
        },
        {
            "category": "Invertebrates",
            "priority": "Pink Underwing Moth Phyllodes imperialis smithersi"
        },
        {
            "category": "Invertebrates",
            "priority": "Tasmanian Giant Freshwater Crayfish Astacopsis gouldi"
        },
        {
            "category": "Invertebrates",
            "priority": "Glenelg Freshwater Mussel Hyridella glenelgensis"
        },
        {
            "category": "Invertebrates",
            "priority": "Kangaroo Island Assassin Spider Zephyrarchaea austini"
        },
        {
            "category": "Plants",
            "priority": "Adamson’s Blown-grass Lachnagrostis adamsonii"
        },
        {
            "category": "Plants",
            "priority": "Angle-stemmed Myrtle Gossia gonoclada"
        },
        {
            "category": "Plants",
            "priority": "Arckaringa Daisy Olearia arckaringensis"
        },
        {
            "category": "Plants",
            "priority": "Border Ranges Lined Fern Antrophyum austroqueenslandicum"
        },
        {
            "category": "Plants",
            "priority": "Bulberin Nut Macadamia jansenii "
        },
        {
            "category": "Plants",
            "priority": "Carrington Falls Pomaderris Pomaderris walshii"
        },
        {
            "category": "Plants",
            "priority": "Davies' Waxflower Phebalium daviesii"
        },
        {
            "category": "Plants",
            "priority": "Eremophila subangustifolia"
        },
        {
            "category": "Plants",
            "priority": "Foote's Grevillea Grevillea calliantha"
        },
        {
            "category": "Plants",
            "priority": "Forked Spyridium Spyridium furculentum"
        },
        {
            "category": "Plants",
            "priority": "Giant Andersonia Andersonia axilliflora"
        },
        {
            "category": "Plants",
            "priority": "Graveside Leek-orchid Prasophyllum taphanyx"
        },
        {
            "category": "Plants",
            "priority": "Imlay Mallee Eucalyptus imlayensis"
        },
        {
            "category": "Plants",
            "priority": "King Blue-grass Dichanthium queenslandicum"
        },
        {
            "category": "Plants",
            "priority": "Lax Leek Orchid Prasophyllum laxum"
        },
        {
            "category": "Plants",
            "priority": "Little Mountain Palm Lepidorrhachis mooreana"
        },
        {
            "category": "Plants",
            "priority": "MacDonnell Ranges Cycad Macrozamia macdonnellii"
        },
        {
            "category": "Plants",
            "priority": "Native Guava Rhodomyrtus psidioides"
        },
        {
            "category": "Plants",
            "priority": "Pimelea cremnophila"
        },
        {
            "category": "Plants",
            "priority": "Pimelea venosa"
        },
        {
            "category": "Plants",
            "priority": "Scaly-butt Mallee Eucalyptus leprophloia"
        },
        {
            "category": "Plants",
            "priority": "Small-flowered Snottygobble Persoonia micranthera"
        },
        {
            "category": "Plants",
            "priority": "Smooth Davidson's Plum Davidsonia johnsonii"
        },
        {
            "category": "Plants",
            "priority": "Stiff Groundsel Senecio behrianus"
        },
        {
            "category": "Plants",
            "priority": "Stirling Range Dryandra Banksia montana"
        },
        {
            "category": "Plants",
            "priority": "Tangled Wattle Acacia volubilis"
        },
        {
            "category": "Plants",
            "priority": "Waddy, Waddi, Waddy-wood, Birdsville Wattle Acacia peuce"
        },
        {
            "category": "Plants",
            "priority": "Wollemi Pine Wollemia nobilis"
        },
        {
            "category": "Plants",
            "priority": "Wongan Eriostemon Philotheca wonganensis"
        },
        {
            "category": "Plants",
            "priority": "Wood Well Spyridium Spyridium fontis-woodii"
        },
        {
            "category": "Plants",
            "priority": "Narrow-leaf Eremophila Eremophila subangustifolia"
        },
        {
            "category": "Plants",
            "priority": "Gorge Rice-flower, Pimelelea cremnophila"
        },
        {
            "category": "Plants",
            "priority": "Bolivia Hill Rice-flower, Pimelea venosa"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Australasian Bittern Botaurus poiciloptilus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Black-eared Miner Manorina melanotis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Carnaby's Cockatoo Calyptorhynchus latirostris"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Christmas Island Goshawk Accipiter hiogaster natalis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Eastern Curlew Numenius madagascariensis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Golden-shouldered Parrot, Alwal Psephotus chrysopterygius"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Hooded Plover (eastern) Thinornis cucullatus cucullatus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "King Island Brown Thornbill Acanthiza pusilla archibaldi"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Malleefowl Leipoa ocellata"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Night Parrot Pezoporus occidentalis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Norfolk Island Green Parrot Cyanoramphus cookii"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Orange-bellied Parrot Neophema chrysogaster"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Plains-wanderer Pedionomus torquatus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Princess Parrot Polytelis alexandrae"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Red Goshawk Erythrotriorchis radiatus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Red-tailed Black Cockatoo (SE) Calyptorhynchus banksii graptogyne"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Regent Honeyeater Anthochaera phrygia"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Swift Parrot Lathamus discolor"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Western Ground Parrot, Kyloring Pezoporus flaviventris"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "White-throated Grasswren, Yirlinkirrkirr Amytornis woodwardi"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "King Island Scrubtit Acanthornis magna greeniana"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Noisy Scrub-bird Atrichornis clamosus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Australian Sea-lion Neophoca cinerea"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Brush-tailed Rock-wallaby Petrogale penicillata"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Central Rock-rat Antina Zyzomys pedunculatus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Chuditch, Western Quoll Dasyurus geoffroii"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Eastern Quoll Dasyurus viverrinus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Gilbert's Potoroo Ngilkat Potorous gilbertii"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Greater Bilby Macrotis lagotis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Kangaroo Island Echidna Tachyglossus aculeatus multiaculeatus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Koala Phascolarctos cinereus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Leadbeater’s Possum Gymnobelideus leadbeateri"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Mountain Pygmy-possum Burramys parvus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "New Holland Mouse, Pookila Pseudomys novaehollandiae"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Northern Brushtail Possum Trichosurus vulpecula arnhemensis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Northern Hairy-nosed Wombat, Yaminon Lasiorhinus krefftii"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Northern Hopping-mouse, Woorrentinta Notomys aquilo"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Northern Quoll Dasyurus hallucatus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Numbat Myrmecobius fasciatus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Quokka Setonix brachyurus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Spectacled Flying-fox Pteropus conspicillatus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Western Ringtail Possum Pseudocheirus occidentalis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Freshwater Sawfish Pristis pristis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Grey Nurse Shark (eastern) Carcharias taurus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Maugean Skate Zearaja maugeana"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Murray Hardyhead Craterocephalus fluviatilis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Red Handfish Thymichthys politus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Redfin Blue-eye Scaturiginichthys vermeilipinnis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Stocky Galaxias Galaxias tantangara"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Swan Galaxias Galaxias fontanus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "White's Seahorse Hippocampus whitei"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Growling Grass Frog, Southern Bell Frog Litoria raniformis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Kroombit Tinker Frog Taudactylus pleione"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Southern Corroboree Frog Pseudophryne corroboree"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Mountain Frog Philoria kundagungan"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Mountain-top Nursery-frog Cophixalus monticola"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "White-bellied Frog Anstisia alba"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Arnhem Land Gorges Skink Bellatorias obiri"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Bellinger River Snapping Turtle Wollumbinia georgesi"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Collared Delma, Adorned Delma Delma torquata"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Great Desert Skink, Tjakura, Warrarna, Mulyamiji Liopholis kintorei"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Green Turtle Chelonia mydas"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Olive Ridley Turtle Lepidochelys olivacea"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Pygmy Blue-tongue Lizard Tiliqua adelaidensis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Short-nosed Seasnake Aipysurus apraefrontalis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Yinnietharra Rock-dragon Ctenophorus yinnietharra"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Canberra Grassland Earless Dragon Tympanocryptis lineata"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Western Swamp Tortoise Pseudemydura umbrina"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Ammonite Snail Ammoniropa vigens"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Cauliflower Soft Coral Dendronephthya australis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Eltham Copper Butterfly Paralucia pyrodiscus lucida"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Giant Gippsland Earthworm Megascolides australis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Lord Howe Island Phasmid Dryococelus australis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Margaret River Burrowing Crayfish Engaewa pseudoreducta"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Mount Lidgbird Charopid Land Snail Pseudocharopa ledgbirdi"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Pink Underwing Moth Phyllodes imperialis smithersi"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Tasmanian Giant Freshwater Crayfish Astacopsis gouldi"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Glenelg Freshwater Mussel Hyridella glenelgensis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Kangaroo Island Assassin Spider Zephyrarchaea austini"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Adamson’s Blown-grass Lachnagrostis adamsonii"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Angle-stemmed Myrtle Gossia gonoclada"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Arckaringa Daisy Olearia arckaringensis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Border Ranges Lined Fern Antrophyum austroqueenslandicum"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Bulberin Nut Macadamia jansenii "
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Carrington Falls Pomaderris Pomaderris walshii"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Davies' Waxflower Phebalium daviesii"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Foote's Grevillea Grevillea calliantha"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Forked Spyridium Spyridium furculentum"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Giant Andersonia Andersonia axilliflora"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Graveside Leek-orchid Prasophyllum taphanyx"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Imlay Mallee Eucalyptus imlayensis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "King Blue-grass Dichanthium queenslandicum"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Lax Leek Orchid Prasophyllum laxum"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Little Mountain Palm Lepidorrhachis mooreana"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "MacDonnell Ranges Cycad Macrozamia macdonnellii"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Native Guava Rhodomyrtus psidioides"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Scaly-butt Mallee Eucalyptus leprophloia"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Small-flowered Snottygobble Persoonia micranthera"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Smooth Davidson's Plum Davidsonia johnsonii"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Stiff Groundsel Senecio behrianus"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Stirling Range Dryandra Banksia montana"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Tangled Wattle Acacia volubilis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Waddy, Waddi, Waddy-wood, Birdsville Wattle Acacia peuce"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Wollemi Pine Wollemia nobilis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Wongan Eriostemon Philotheca wonganensis"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Wood Well Spyridium Spyridium fontis-woodii"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Narrow-leaf Eremophila Eremophila subangustifolia"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Gorge Rice-flower, Pimelea cremnophila"
        },
        {
            "category": "Priority Threatened Species Primary",
            "priority": "Bolivia Hill Rice-flower, Pimelea venosa"
        },
        {
            "category": "Target 3",
            "priority": "Australasian Bittern Botaurus poiciloptilus"
        },
        {
            "category": "Target 3",
            "priority": "Black-eared Miner Manorina melanotis"
        },
        {
            "category": "Target 3",
            "priority": "Carnaby's Cockatoo Calyptorhynchus latirostris"
        },
        {
            "category": "Target 3",
            "priority": "Christmas Island Goshawk Accipiter hiogaster natalis"
        },
        {
            "category": "Target 3",
            "priority": "Eastern Curlew Numenius madagascariensis"
        },
        {
            "category": "Target 3",
            "priority": "Golden-shouldered Parrot, Alwal Psephotus chrysopterygius"
        },
        {
            "category": "Target 3",
            "priority": "Hooded Plover (eastern) Thinornis cucullatus cucullatus"
        },
        {
            "category": "Target 3",
            "priority": "King Island Brown Thornbill Acanthiza pusilla archibaldi"
        },
        {
            "category": "Target 3",
            "priority": "Malleefowl Leipoa ocellata"
        },
        {
            "category": "Target 3",
            "priority": "Night Parrot Pezoporus occidentalis"
        },
        {
            "category": "Target 3",
            "priority": "Norfolk Island Green Parrot Cyanoramphus cookii"
        },
        {
            "category": "Target 3",
            "priority": "Orange-bellied Parrot Neophema chrysogaster"
        },
        {
            "category": "Target 3",
            "priority": "Plains-wanderer Pedionomus torquatus"
        },
        {
            "category": "Target 3",
            "priority": "Princess Parrot Polytelis alexandrae"
        },
        {
            "category": "Target 3",
            "priority": "Red Goshawk Erythrotriorchis radiatus"
        },
        {
            "category": "Target 3",
            "priority": "Red-tailed Black Cockatoo (SE) Calyptorhynchus banksii graptogyne"
        },
        {
            "category": "Target 3",
            "priority": "Regent Honeyeater Anthochaera phrygia"
        },
        {
            "category": "Target 3",
            "priority": "Swift Parrot Lathamus discolor"
        },
        {
            "category": "Target 3",
            "priority": "Western Ground Parrot, Kyloring Pezoporus flaviventris"
        },
        {
            "category": "Target 3",
            "priority": "White-throated Grasswren, Yirlinkirrkirr Amytornis woodwardi"
        },
        {
            "category": "Target 3",
            "priority": "King Island Scrubtit Acanthornis magna greeniana"
        },
        {
            "category": "Target 3",
            "priority": "Noisy Scrub-bird Atrichornis clamosus"
        },
        {
            "category": "Target 3",
            "priority": "Australian Sea-lion Neophoca cinerea"
        },
        {
            "category": "Target 3",
            "priority": "Brush-tailed Rock-wallaby Petrogale penicillata"
        },
        {
            "category": "Target 3",
            "priority": "Central Rock-rat Antina Zyzomys pedunculatus"
        },
        {
            "category": "Target 3",
            "priority": "Chuditch, Western Quoll Dasyurus geoffroii"
        },
        {
            "category": "Target 3",
            "priority": "Eastern Quoll Dasyurus viverrinus"
        },
        {
            "category": "Target 3",
            "priority": "Gilbert's Potoroo Ngilkat Potorous gilbertii"
        },
        {
            "category": "Target 3",
            "priority": "Greater Bilby Macrotis lagotis"
        },
        {
            "category": "Target 3",
            "priority": "Kangaroo Island Echidna Tachyglossus aculeatus multiaculeatus"
        },
        {
            "category": "Target 3",
            "priority": "Koala Phascolarctos cinereus"
        },
        {
            "category": "Target 3",
            "priority": "Leadbeater’s Possum Gymnobelideus leadbeateri"
        },
        {
            "category": "Target 3",
            "priority": "Mountain Pygmy-possum Burramys parvus"
        },
        {
            "category": "Target 3",
            "priority": "New Holland Mouse, Pookila Pseudomys novaehollandiae"
        },
        {
            "category": "Target 3",
            "priority": "Northern Brushtail Possum Trichosurus vulpecula arnhemensis"
        },
        {
            "category": "Target 3",
            "priority": "Northern Hairy-nosed Wombat, Yaminon Lasiorhinus krefftii"
        },
        {
            "category": "Target 3",
            "priority": "Northern Hopping-mouse, Woorrentinta Notomys aquilo"
        },
        {
            "category": "Target 3",
            "priority": "Northern Quoll Dasyurus hallucatus"
        },
        {
            "category": "Target 3",
            "priority": "Numbat Myrmecobius fasciatus"
        },
        {
            "category": "Target 3",
            "priority": "Quokka Setonix brachyurus"
        },
        {
            "category": "Target 3",
            "priority": "Spectacled Flying-fox Pteropus conspicillatus"
        },
        {
            "category": "Target 3",
            "priority": "Western Ringtail Possum Pseudocheirus occidentalis"
        },
        {
            "category": "Target 3",
            "priority": "Freshwater Sawfish Pristis pristis"
        },
        {
            "category": "Target 3",
            "priority": "Grey Nurse Shark (eastern) Carcharias taurus"
        },
        {
            "category": "Target 3",
            "priority": "Maugean Skate Zearaja maugeana"
        },
        {
            "category": "Target 3",
            "priority": "Murray Hardyhead Craterocephalus fluviatilis"
        },
        {
            "category": "Target 3",
            "priority": "Red Handfish Thymichthys politus"
        },
        {
            "category": "Target 3",
            "priority": "Redfin Blue-eye Scaturiginichthys vermeilipinnis"
        },
        {
            "category": "Target 3",
            "priority": "Stocky Galaxias Galaxias tantangara"
        },
        {
            "category": "Target 3",
            "priority": "Swan Galaxias Galaxias fontanus"
        },
        {
            "category": "Target 3",
            "priority": "White's Seahorse Hippocampus whitei"
        },
        {
            "category": "Target 3",
            "priority": "Growling Grass Frog, Southern Bell Frog Litoria raniformis"
        },
        {
            "category": "Target 3",
            "priority": "Kroombit Tinker Frog Taudactylus pleione"
        },
        {
            "category": "Target 3",
            "priority": "Southern Corroboree Frog Pseudophryne corroboree"
        },
        {
            "category": "Target 3",
            "priority": "Mountain Frog Philoria kundagungan"
        },
        {
            "category": "Target 3",
            "priority": "Mountain-top Nursery-frog Cophixalus monticola"
        },
        {
            "category": "Target 3",
            "priority": "White-bellied Frog Anstisia alba"
        },
        {
            "category": "Target 3",
            "priority": "Arnhem Land Gorges Skink Bellatorias obiri"
        },
        {
            "category": "Target 3",
            "priority": "Bellinger River Snapping Turtle Wollumbinia georgesi"
        },
        {
            "category": "Target 3",
            "priority": "Collared Delma, Adorned Delma Delma torquata"
        },
        {
            "category": "Target 3",
            "priority": "Great Desert Skink, Tjakura, Warrarna, Mulyamiji Liopholis kintorei"
        },
        {
            "category": "Target 3",
            "priority": "Green Turtle Chelonia mydas"
        },
        {
            "category": "Target 3",
            "priority": "Olive Ridley Turtle Lepidochelys olivacea"
        },
        {
            "category": "Target 3",
            "priority": "Pygmy Blue-tongue Lizard Tiliqua adelaidensis"
        },
        {
            "category": "Target 3",
            "priority": "Short-nosed Seasnake Aipysurus apraefrontalis"
        },
        {
            "category": "Target 3",
            "priority": "Yinnietharra Rock-dragon Ctenophorus yinnietharra"
        },
        {
            "category": "Target 3",
            "priority": "Canberra Grassland Earless Dragon Tympanocryptis lineata"
        },
        {
            "category": "Target 3",
            "priority": "Western Swamp Tortoise Pseudemydura umbrina"
        },
        {
            "category": "Target 3",
            "priority": "Ammonite Snail Ammoniropa vigens"
        },
        {
            "category": "Target 3",
            "priority": "Cauliflower Soft Coral Dendronephthya australis"
        },
        {
            "category": "Target 3",
            "priority": "Eltham Copper Butterfly Paralucia pyrodiscus lucida"
        },
        {
            "category": "Target 3",
            "priority": "Giant Gippsland Earthworm Megascolides australis"
        },
        {
            "category": "Target 3",
            "priority": "Lord Howe Island Phasmid Dryococelus australis"
        },
        {
            "category": "Target 3",
            "priority": "Margaret River Burrowing Crayfish Engaewa pseudoreducta"
        },
        {
            "category": "Target 3",
            "priority": "Mount Lidgbird Charopid Land Snail Pseudocharopa ledgbirdi"
        },
        {
            "category": "Target 3",
            "priority": "Pink Underwing Moth Phyllodes imperialis smithersi"
        },
        {
            "category": "Target 3",
            "priority": "Tasmanian Giant Freshwater Crayfish Astacopsis gouldi"
        },
        {
            "category": "Target 3",
            "priority": "Glenelg Freshwater Mussel Hyridella glenelgensis"
        },
        {
            "category": "Target 3",
            "priority": "Kangaroo Island Assassin Spider Zephyrarchaea austini"
        },
        {
            "category": "Target 3",
            "priority": "Adamson’s Blown-grass Lachnagrostis adamsonii"
        },
        {
            "category": "Target 3",
            "priority": "Angle-stemmed Myrtle Gossia gonoclada"
        },
        {
            "category": "Target 3",
            "priority": "Arckaringa Daisy Olearia arckaringensis"
        },
        {
            "category": "Target 3",
            "priority": "Border Ranges Lined Fern Antrophyum austroqueenslandicum"
        },
        {
            "category": "Target 3",
            "priority": "Bulberin Nut Macadamia jansenii "
        },
        {
            "category": "Target 3",
            "priority": "Carrington Falls Pomaderris Pomaderris walshii"
        },
        {
            "category": "Target 3",
            "priority": "Davies' Waxflower Phebalium daviesii"
        },
        {
            "category": "Target 3",
            "priority": "Eremophila subangustifolia"
        },
        {
            "category": "Target 3",
            "priority": "Foote's Grevillea Grevillea calliantha"
        },
        {
            "category": "Target 3",
            "priority": "Forked Spyridium Spyridium furculentum"
        },
        {
            "category": "Target 3",
            "priority": "Giant Andersonia Andersonia axilliflora"
        },
        {
            "category": "Target 3",
            "priority": "Graveside Leek-orchid Prasophyllum taphanyx"
        },
        {
            "category": "Target 3",
            "priority": "Imlay Mallee Eucalyptus imlayensis"
        },
        {
            "category": "Target 3",
            "priority": "King Blue-grass Dichanthium queenslandicum"
        },
        {
            "category": "Target 3",
            "priority": "Lax Leek Orchid Prasophyllum laxum"
        },
        {
            "category": "Target 3",
            "priority": "Little Mountain Palm Lepidorrhachis mooreana"
        },
        {
            "category": "Target 3",
            "priority": "MacDonnell Ranges Cycad Macrozamia macdonnellii"
        },
        {
            "category": "Target 3",
            "priority": "Native Guava Rhodomyrtus psidioides"
        },
        {
            "category": "Target 3",
            "priority": "Pimelea cremnophila"
        },
        {
            "category": "Target 3",
            "priority": "Pimelea venosa"
        },
        {
            "category": "Target 3",
            "priority": "Scaly-butt Mallee Eucalyptus leprophloia"
        },
        {
            "category": "Target 3",
            "priority": "Small-flowered Snottygobble Persoonia micranthera"
        },
        {
            "category": "Target 3",
            "priority": "Smooth Davidson's Plum Davidsonia johnsonii"
        },
        {
            "category": "Target 3",
            "priority": "Stiff Groundsel Senecio behrianus"
        },
        {
            "category": "Target 3",
            "priority": "Stirling Range Dryandra Banksia montana"
        },
        {
            "category": "Target 3",
            "priority": "Tangled Wattle Acacia volubilis"
        },
        {
            "category": "Target 3",
            "priority": "Waddy, Waddi, Waddy-wood, Birdsville Wattle Acacia peuce"
        },
        {
            "category": "Target 3",
            "priority": "Wollemi Pine Wollemia nobilis"
        },
        {
            "category": "Target 3",
            "priority": "Wongan Eriostemon Philotheca wonganensis"
        },
        {
            "category": "Target 3",
            "priority": "Wood Well Spyridium Spyridium fontis-woodii"
        },
        {
            "category": "Target 3",
            "priority": "Narrow-leaf Eremophila Eremophila subangustifolia"
        },
        {
            "category": "Target 3",
            "priority": "Gorge Rice-flower, Pimelelea cremnophila"
        },
        {
            "category": "Target 3",
            "priority": "Bolivia Hill Rice-flower, Pimelea venosa"
        }
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
        "supportsMultiplePrioritiesAsPrimary": false,
        "shortDescription": "Threatened Species Strategy",
        "type": "primary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": true,
        "outcome": "1.  Species and Landscapes (Long term): Threatened Species (TS) - The trajectory of species targeted under the Threatened Species Action Plan 2022-2032 and other EPBC Act listed Species is improved"
    },
    {
        "priorities": [
            {
                "category": ""
            }
        ],
        "targeted": true,
        "shortDescription": "Target 3",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "Target 3: Species at high risk of imminent extinction are identified and supported to persist"
    },
    {
        "priorities": [
            {
                "category": "Target 7"
            }
        ],
        "targeted": true,
        "shortDescription": "Target 7",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "Target 7: Impacts of climate change on priority species and places are identified and actions are underway to strengthen resilience and adaptive capacity"
    },
    {
        "priorities": [
            {
                "category": "Target 8"
            }
        ],
        "targeted": true,
        "shortDescription": "Target 8",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "Target 8: Feral cats and foxes are managed across all important habitats for susceptible priority species using best practice methods"
    },
    {
        "priorities": [
            {
                "category": "Target 10"
            }
        ],
        "targeted": true,
        "shortDescription": "Target 10",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "Target 10: Gamba Grass is reduced to an area less than its 2022 range"
    },
    {
        "priorities": [
            {
                "category": "Target 12"
            }
        ],
        "targeted": true,
        "shortDescription": "Target 12",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "Target 12: Five new populations of appropriate species are added across the national safe haven network to improve representation of invasive predator-susceptible threatened species"
    },
    {
        "priorities": [
            {
                "category": "Target 13"
            }
        ],
        "targeted": true,
        "shortDescription": "Target 13",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "Target 13: At least 80 per cent of nationally listed threatened plant species are secured in insurance collections"
    },
    {
        "priorities": [
            {
                "category": "Target 14"
            }
        ],
        "targeted": true,
        "shortDescription": "Target 14",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "Target 14: All nationally listed threatened plant species affected by Myrtle Rust are secured in insurance collections and populations"
    },
    {
        "priorities": [
            {
                "category": "Target 16"
            }
        ],
        "targeted": true,
        "shortDescription": "Target 16",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "Target 16: First Nations-led recovery activities for threatened species and ecological communities are increased"
    },
    {
        "priorities": [
            {
                "category": "Target 21"
            }
        ],
        "targeted": true,
        "shortDescription": "Target 21",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "Target 21: At least half the number of projects that benefit priority species and priority places receive private investment or support from partners"
    },
    {
        "priorities": [
            {
                "category": "Target 22"
            }
        ],
        "targeted": true,
        "shortDescription": "Target 22",
        "type": "secondary",
        "category": "environment",
        "supportsMultiplePrioritiesAsSecondary": false,
        "outcome": "Target 22: Community groups lead or participate in recovery activities for all accessible priority species and places, including through citizen science"
    }
]


subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        if (p.name === "Practical Action for Priority Threatened Species"){
            p.config = projectConfig.config
            p.priorities = projectConfig.priorities
        }
        db.program.save(p);
    }
});

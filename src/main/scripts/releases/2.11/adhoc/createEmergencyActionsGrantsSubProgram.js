load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
var userId = '129333';

//Create the parent program
let programName = "Saving Native Species";
var parentProgram = createOrFindProgram(programName);

let refProgram = "Threatened Species Strategy Action Plan Priority Species";
var subprograms = ["Emergency Actions for Threatened Species"]

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
                    "helpTextHeading": "A succinct overview of the project: (i) what will be done and (ii) why it will be done",
                    "maxSize": "1000",
                    "placeholder": "[Free text; limit response to 1000 characters (approx. 150 words)]",
                    "explanation": ""
                }
            },
            {
                "template": "description",
                "model": {
                    "helpTextHeading": "",
                    "maxSize": "1000",
                    "placeholder": "[Free text; limit response to 1000 characters (approx. 150 words)]",
                    "explanation": " Please provide a short succinct description of this project. The description should state what will be done and why it will be done. This project description will be publicly visible on the project overview page in MERIT"
                }
            },
            {
                "template": "assets",
                "model": {
                    "priorityCategories": [
                        "Birds",
                        "Mammals",
                        "Fish",
                        "Plants",
                        "Priority Plants",
                        "Vertebrate species"
                    ],
                    "assetHeading": "Asset",
                    "autoSelectCategory": true,
                    "assetClass": "asset-with-category",
                    "viewExplanation": "Species, ecological community or environmental asset(s) the project is targeting",
                    "explanation": "List the natural assets that will benefit from this project",
                    "fromPriorities": true,
                    "assetHelpText": "Scientific and/or common name",
                    "assetCategoryHelpText": "as identified within the regional workshop reports.  Types with no assets are not selectable",
                    "placeHolder": "Please select"
                }
            },
            {
                "template": "activities",
                "model": {
                    "includeOther": true,
                    "noneSelectedMessage": "No priority actions have been nominated for this project",
                    "singleSelection": false,
                    "title": "Project Actions",
                    "explanation": "Please select from the lists of priority action applicable to this project. If the priority action is not listed and ‘other’ is selected, please provide details of the ‘other’ priority within the space provided"
                }
            },
            {
                "template": "outcomeStatements",
                "model": {
                    "subtitle": "Please provide outcome statements. Outcomes statements should: <br/>- Clearly describe the intent of the project, specifically the benefit or change that the project is expected to deliver by June 2022;<br/>- Be expressed as a SMART statement (Specific, Measurable, Attainable, Realistic and Time-bound); and<br/>- Ensure that the outcomes are measurable with consideration to the monitoring methodology provided below",
                    "placeholder": "By 30 June 2021, [Free text]",
                    "title": "Project Outcome"
                }
            },
            {
                "template": "keyThreats",
                "model": {
                    "threatHelpText": "The key threats (or key threatening processes) that your project will be addressing",
                    "interventionHelpText": "Describe the proposed interventions to address the threat and how this will deliver on the project outcome",
                    "title": "Key Threats",
                    "explanation": "Describe the key threat(s) and/or key threatening processes impacting project assets that the project will be addressing."
                }
            },
            {
                "template": "projectMethodology",
                "model": {
                    "maxSize": "4000",
                    "title": "Project Methodology",
                    "explanation": "The methodology should describe how each project service (i.e., action) will be implemented to achieve outcomes and why that specific approach or technique was chosen. The methodology could include the location, partner/s involvement and outputs. The methodology should clearly link to the outcome statement. At least one method for each project outcome should be identified.",
                    "tableHeading": "Please describe the methodology that will be used to achieve the project’s outcome statements.",
                    "placeHolder": "[Free text; limit response to 4000 characters (approx. 650 words)]"
                }
            },
            {
                "template": "monitoringIndicators",
                "model": {
                    "approachHeading": "Describe the project monitoring indicator(s) approach",
                    "indicatorHeading": "Identify the project monitoring indicator(s)",
                    "indicatorHelpText": "List the indicators of project success that will be monitored. Indicators should link back to the outcome statements and, in most cases, will be quantitative and expressed as a numerical measurable. Where relevant, qualitative indicators can be used. Indicators should measure both project outputs (e.g., area (ha) of rabbit control, length (km) of predator proof fencing) and change the project is aiming to achieve (e.g., change in abundance of X threatened species at Y location, change in vegetation cover (%) etc.)",
                    "approachHelpText": "Briefly describe the method that will be used to monitor the indicator (including timing of monitoring, who will collect/collate/analyse, data, etc)",
                    "indicatorPlaceHolder": "[Free text]",
                    "approachPlaceHolder": "[Free text]",
                    "title": "Project Monitoring Indicators"
                }
            },
            {
                "template": "adaptiveManagement",
                "model": {
                    "title": "Project Review, Evaluation and Improvement Methodology and Approach",
                    "explanation": "Outline the methods and processes that will enable adaptive management during the lifetime of this project"
                }
            },
            {
                "template": "nationalAndRegionalPlans",
                "model": {
                    "documentNameHelpText": "List the name of the Recovery Plan or Conservation Advice for species listed under the Environment Protection and Biodiversity Conservation Act 1999 (if applicable), or state recovery plan.",
                    "explanation": "Explain how the project aligns with national and/or state species recovery plans and strategies."
                }
            },
            {
                "template": "serviceTargets",
                "model": {
                    "showTargetDate": true,
                    "title": "Activities and Targets Table",
                    "serviceName": "Activities"
                }
            },
            {
                "template": "projectPartnerships",
                "model": {
                    "namePlaceHolder": "[Free text]",
                    "helpTextPartnerNature": "If partnership with an organisation: provide the name of the organisation and the role they will play/how you will support them. If partnering with community groups or members of the public: indicate each group or individual you will engage with",
                    "partnershipPlaceHolder": "[Free text]"
                }
            },
            {
                "template": "meriBudget",
                "model": {
                    "itemName": "Budget item",
                    "showThemeColumn": false,
                    "showActivityColumn": false,
                    "explanation": "Please detail how project funding will be allocated to project services (action) by species, if more than one species is benefitting from the project. Expenditure should align with the approved project grant application (including the amount identified for project reporting and administration). Each action should be identified as a different line item",
                    "projectHeadingHelpText": "Planned budget expenditure for each service (action) by species",
                    "hideHelpText": true
                }
            }
        ],
        "excludes": [],
        "visibility": "public",
        "organisationRelationship": "Grantee",
        "excludeFinancialYearData": true,
        "requiresActivityLocking": true,
        "projectTemplate": "rlp",
        "activityPeriodDescriptor": "Outputs report #",
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
                "activityType": "Final Report",
                "alignToOwnerStart": true
            }
        ],
        "activities": [
            {
                "name": "Herbivore and/or predator control"
            },
            {
                "name": "Weed control and/or revegetation"
            },
            {
                "name": "Fire management and planning"
            },
            {
                "name": "Species and ecological community specific interventions"
            },
            {
                "name": "Traditional Owner led healing of country"
            },
            {
                "name": "Erosion control"
            },
            {
                "name": "Refugia management"
            }
        ],
        "navigationMode": "returnToProject",
        "objectives": [
            "Prevent extinction and limit decline of native species",
            "Reduce immediate suffering of native animals directly impacted by the fires",
            "Maximise chances of long-term recovery of native species and communities",
            "Ensure learning and continual improvement is core of the response"
        ],
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
            36,
            37,
            38,
            39,
            40,
            41
        ]
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
            "priority": "Koala (Qld, NSW, ACT) Phascolarctos cinereus"
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
            "category": "Reptiles",
            "priority": "Eucalyptus langleyi (Albatross Mallee)"
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
            "priority": "Wood Well Spyridium Spyridium fontis-woodii "
        }
    ]
};



subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        if (p.name === "Emergency Actions for Threatened Species"){
            p.config = projectConfig.config
            p.priorities = projectConfig.priorities
        }
        db.program.save(p);
    }
});

// Creating a subprogram for Program:  Bushfire Recovery for Species and Landscapes Program
// New Subprogram:  Strategic and Multi-regional - Koalas

load("uuid.js");
let parentProgram = "Bushfire Recovery for Species and Landscapes Program";
var subprograms = ["Strategic and Multi-regional - Koalas"]

var parent = db.program.find({name: parentProgram}).next();
print(parent.programId)
subprograms.forEach(function (subProgram){
    var now = ISODate();
    var p = {name: subProgram, programId: UUID.generate(), dateCreated: now, lastUpdate: now, parent: parent._id, status: "active"}
    var program = db.program.find({name: subProgram})
    if (!program.hasNext()) {
        db.program.insert(p);
    } else {
        print("Program Already Exist: " + subProgram)
    }
});


var projectConfig = {
    config: {
        "meriPlanContents": [
            {
                "template": "assets",
                "model": {
                    "priorityCategories": [
                        "Ecological Communities",
                        "Invertebrate species",
                        "Other natural asset",
                        "Plant species",
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
                    "title": "Outcome statements"
                }
            },
            {
                "template": "sectionHeading",
                "model": {
                    "heading": "Project Details"
                }
            },
            {
                "template": "description",
                "model": {
                    "helpTextHeading": "A succinct overview of the project: (i) what will be done and (ii) why it will be done",
                    "maxSize": "1000",
                    "placeholder": "[Free text; limit response to 1000 characters (approx. 150 words)]",
                    "explanation": " Please provide a short succinct description of this project. The description should state what will be done and why it will be done. This project description will be publicly visible on the project overview page in MERIT"
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
                    "title": "Actions and Targets Table",
                    "serviceName": "Service"
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
                "firstReportingPeriodEnd": "2022-06-30T14:00:00Z",
                "reportDescriptionFormat": "Final Report",
                "reportNameFormat": "Final Report",
                "reportingPeriodInMonths": 0,
                "multiple": false,
                "description": "",
                "category": "Final Report",
                "reportsAlignedToCalendar": false,
                "activityType": "Final Report"
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
            "category": "Ecological Communities",
            "priority": "Alpine Crag Complex"
        },
        {
            "category": "Ecological Communities",
            "priority": "Alpine Snow Gum Woodland (Eucalyptus niphophila woodlands)"
        },
        {
            "category": "Ecological Communities",
            "priority": "Alpine Sphagnum Bogs and Associated Fens"
        },
        {
            "category": "Ecological Communities",
            "priority": "Aquatic Root Mat Community in Caves of the Swan Coastal Plain"
        },
        {
            "category": "Ecological Communities",
            "priority": "Assemblages of plants and invertebrate animals of tumulus (organic mound) springs of the Swan Coastal Plain"
        },
        {
            "category": "Ecological Communities",
            "priority": "Banksia Woodlands of the Swan Coastal Plain ecological community"
        },
        {
            "category": "Ecological Communities",
            "priority": "Blackthorn Scrub"
        },
        {
            "category": "Ecological Communities",
            "priority": "Broad leaf tea-tree (Melaleuca viridiflora) woodlands in high rainfall coastal north Queensland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Brogo Wet Vine Forest in the South East Corner Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Carex Sedgeland of the New England Tableland, Nandewar, Brigalow Belt South and NSW North Coast Bioregions"
        },
        {
            "category": "Ecological Communities",
            "priority": "Castlereagh Scribbly Gum and Agnes Banks Woodlands of the Sydney Basin Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Central Hunter Valley eucalypt forest and woodland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Clay Heathland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Coast Banksia Woodland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Coastal Lagoon Wetland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Coastal Sand Heathland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Coastal Swamp Oak (Casuarina glauca) Forest of South-east Queensland and New South Wales"
        },
        {
            "category": "Ecological Communities",
            "priority": "Coastal Upland Swamps in the Sydney Basin Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Cooks River/Castlereagh Ironbark Forest of the Sydney Basin Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Corymbia calophylla - Kingia australis woodlands on heavy soils of the Swan Coastal Plain"
        },
        {
            "category": "Ecological Communities",
            "priority": "Cumberland Plain Shale Woodlands and Shale-Gravel Transition Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Cut-tail Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Damp Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Dry Rainforest of the South East Forests in the South East Corner Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Dry Valley Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Eastern Stirling Range Montane Heath and Thicket"
        },
        {
            "category": "Ecological Communities",
            "priority": "Foothill Box Ironbark Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Freshwater Wetlands on Coastal Floodplains of the New South Wales North Coast, Sydney Basin and South East Corner Bioregions"
        },
        {
            "category": "Ecological Communities",
            "priority": "Gallery Rainforest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Granitic Hills Woodland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Grey Box-Grey Gum Wet Sclerophyll Forest in the NSW North Coast Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Illawarra-Shoalhaven Subtropical Rainforest of the Sydney Basin Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Jounama Snow Gum Shrub Woodland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Kangaroo Island Narrow-leaved Mallee (Eucalyptus cneorifolia) Woodland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Kosciuszko Eastern Slopes Mountain Gum Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Kosciuszko Flanks Moist Gully Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Kosciuszko Snow Gum-Mountain Gum Moist Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Kosciuszko Western Flanks Moist Shrub Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Kosciuszko-Namadgi Alpine Ash Moist Grassy Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Kurri Sand Swamp Woodland in the Sydney Basin Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Kybeyan Montane Heath"
        },
        {
            "category": "Ecological Communities",
            "priority": "Littoral Rainforest and Coastal Vine Thickets of Eastern Australia"
        },
        {
            "category": "Ecological Communities",
            "priority": "Lower Hunter Spotted Gum Ironbark Forest in the Sydney Basin and NSW North Coast Bioregions"
        },
        {
            "category": "Ecological Communities",
            "priority": "Lowland Grassy Woodland in the South East Corner Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Lowland Rainforest of Subtropical Australia"
        },
        {
            "category": "Ecological Communities",
            "priority": "Ben Halls Gap National Park Sphagnum Moss Cool Temperate Rainforest Community"
        },
        {
            "category": "Ecological Communities",
            "priority": "Bendethera Shrublands"
        },
        {
            "category": "Ecological Communities",
            "priority": "Milton Ulladulla Subtropical Rainforest in the Sydney Basin Bioregion. This community is listed under the EPBC Act as the Illawarra Shoalhaven Sub-tropical Rainforest threatened ecological community"
        },
        {
            "category": "Ecological Communities",
            "priority": "Montane Damp Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Montane Dry Woodland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Montane Grassy Shrubland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Montane Herb-rich Woodland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Montane Peatlands and Swamps of the New England Tableland, NSW North Coast, Sydney Basin, South East Corner, South Eastern Highlands and Australian Alps bioregions"
        },
        {
            "category": "Ecological Communities",
            "priority": "Namadgi Subalpine Rocky Shrubland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Natural grasslands on basalt and fine-textured alluvial plains of northern New South Wales and southern Queensland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Natural Temperate Grassland of the South Eastern Highlands"
        },
        {
            "category": "Ecological Communities",
            "priority": "New England Peppermint (Eucalyptus nova-anglica) Grassy Woodlands"
        },
        {
            "category": "Ecological Communities",
            "priority": "Riparian Forest/Swampy Riparian Woodland Mosaic"
        },
        {
            "category": "Ecological Communities",
            "priority": "Riparian Scrub/Swampy Riparian Forest Mosaic"
        },
        {
            "category": "Ecological Communities",
            "priority": "Riverine Escarpment Scrub"
        },
        {
            "category": "Ecological Communities",
            "priority": "Robertson Rainforest in the Sydney Basin Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Sedgelands in Holocene dune swales of the southern Swan Coastal Plain"
        },
        {
            "category": "Ecological Communities",
            "priority": "Semi-evergreen vine thickets of the Brigalow Belt (North and South) and Nandewar Bioregions"
        },
        {
            "category": "Ecological Communities",
            "priority": "Shale Sandstone Transition Forest of the Sydney Basin Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Shrubby Damp Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Shrubby Dry Forest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Silurian Limestone Pomaderris Shrubland of the South East Corner and Australian Alps Bioregions"
        },
        {
            "category": "Ecological Communities",
            "priority": "Southern Highlands Shale Forest and Woodland in the Sydney Basin Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Sub-alpine Wet Heathland/Sub-alpine Grassland Mosaic"
        },
        {
            "category": "Ecological Communities",
            "priority": "Sub-alpine Woodland"
        },
        {
            "category": "Ecological Communities",
            "priority": "Subtropical and Temperate Coastal Saltmarsh"
        },
        {
            "category": "Ecological Communities",
            "priority": "Tallong"
        },
        {
            "category": "Ecological Communities",
            "priority": "Temperate Highland Peat Swamps on Sandstone"
        },
        {
            "category": "Ecological Communities",
            "priority": "Tuart (Eucalyptus gomphocephala) Woodlands and Forests of the Swan Coastal Plain ecological community"
        },
        {
            "category": "Ecological Communities",
            "priority": "Turpentine-Ironbark Forest of the Sydney Basin Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Upland Basalt Eucalypt Forests of the Sydney Basin Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Upland Wetlands of the Drainage Divide of the New England Tableland Bioregion"
        },
        {
            "category": "Ecological Communities",
            "priority": "Upland Wetlands of the New England Tablelands (New England Tableland Bioregion) and the Monaro Plateau (South Eastern Highlands Bioregion)"
        },
        {
            "category": "Ecological Communities",
            "priority": "Warm Temperate Rainforest"
        },
        {
            "category": "Ecological Communities",
            "priority": "Western Sydney Dry Rainforest and Moist Woodland on Shale"
        },
        {
            "category": "Ecological Communities",
            "priority": "Wet Heathland"
        },
        {
            "category": "Ecological Communities",
            "priority": "White Box-Yellow Box-Blakely's Red Gum Grassy Woodland and Derived Native Grassland"
        },
        {
            "category": "Ecological Communities",
            "priority": "White Gum Moist Forest in the NSW North Coast Bioregion"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus crassus (Alpine Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Austroaeschna (Austroaeschna) flavomaculata (Alpine Darner Dragonfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Oreixenica latialis/ Oreixenica theddora (Alpine Silver Xenica/Small Alpine Xenica/Mount Buffalo Xenica)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus crassus (Alpine Spiny Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Thaumatoperla alpina (Alpine Stonefly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Praxibulus uncinatus (Alpine Yellow-Bellied Grasshopper)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus sp. 1 (Arte Spiny Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Hyridella (Hyridella) australis (Austral Mussel)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Pseudalmenus chlorinda fisheri/zephyrus (Australian Hairstreak/Orange Tit/Silky Hairstreak/Victorian Hairstreak)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Egilodonta bairnsdalensis (Bairnsdale Pinwheel Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Trioza barrettae (Banksia brownii Plant Louse)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Pseudococcus markharveyi (Banksia Montana Mealybug)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Paralucia spinifera (Bathurst Copper Butterfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Macrophallikoropa belli (Bell's Pinwheel Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Ceratopogonidae sp. 1, 8 (DNRE), 12, 20, 32 (EPA) (Biting Midge)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Ceratopogonidae gen. Forcipomyia (Biting Midge)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Austrosimulium spp. (Black Fly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Simuliidae spp. (Black Fly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus gumar (Bloodclaw Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus jagabar (Blue-Black Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Netrocoryne repanda  (Bronze Flat)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Ogyris otanes (otanes) (Brown Azure/Western Dark Azure/Small Brown Azure)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Kosciuscola cuneatus (Brown Kosciuscola)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Aphilorheithrus stepheni (Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Conoesucidae gen. Matasia (Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Ecnomidae gen. Ecnomina E group (Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Hydrobiosidae gen. Koetonga (Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Leptoceridae gen. Hudsonema (Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Micronectidae gen. Micronecta (Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Odontoceridae gen. Genus P (Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Tasimiidae gen. Tasiagma (Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Tasimiidae gen. Tasimia (Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Hydrobiosidae spp. Conoesucidae spp. Apsilochorema spp. Ethochorema spp. Psyllobetina spp. Ptychobiosis spp. Taschorema spp. Ulmerochorema spp. Agapetus spp. Chimarra spp. Hydrobiosella spp. Asmicridea spp. Smicrophylax spp. Coenoria spp. Conoesucus spp.  (Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus sp. 2 (Cann Spiny Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Kosciuscola tristis (Chameleon Grasshopper)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Hesperilla mastersi  (Chequered Sedge-skipper)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus claytoni (Claytons Spiny Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Petalura litorea (Coastal Petaltail )"
        },
        {
            "category": "Invertebrate species",
            "priority": "Kosciuscola cognatus (Common Montane Grasshopper)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Candalides absimilis/ Candalides edwardsi  (Common Pencilled-blue)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Acrodipsas cuprea (Copper Ant-blue)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Coricudgia wollemiana (Coricudgy Pinwheel Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Tipulidae sp. 1, 7-9, 13, 29 (EPA) (Crane Fly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Tipulidae sp. 4, 5, 17-19, 25, 28, 33 (SRV) (Crane Fly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Austroaeschna spp. (Darner Dragonfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Hyridella (Hyridella) depressa (Depressed Mussel)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Archichauliodes spp. (Dobsonfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus bidawalus (East Gippsland Spiny Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Bertmainius colonus (Eastern Stirling Range Pygmy Trapdoor Spider)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus clarkae (Ellen Clark's Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus jagara (Freshwater crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus gamilaroi (Gamilaroi Spiny Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Petalura gigantea (Giant Dragonfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Megascolides australis (Giant Gippsland Earthworm)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Hyridella glenelgensis (Glenelg Freshwater Mussel)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Acrodipsas aurata (Golden Ant-blue)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Gazameda gunnii (Gunn's Screw Shell)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus pilosus (Hairy Cataract Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Canthocamptus longipes (Harpactacoid Copepod)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus jagara  (Jagara Hairy Crayfish )"
        },
        {
            "category": "Invertebrate species",
            "priority": "Marilyniropa jenolanensis  (Jenolan Pinwheel Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Pygmipanda kershawi (Kershaw's Panda-snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Keyacris scurra (Key's Matchstick Grasshopper)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Austrochloritis kosciuszkoensis (Kosciuszko Bristle Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Austrorhytida glaciamans (Kosciuszko Carnivorous Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Kempyninae sp. 1 (Lacewing)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Diphyoropa illustra (Lakes Entrance Pinwheel Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Acrodipsas brisbanensis (Large Ant Blue Butterfly/Bronze Ant-Blue )"
        },
        {
            "category": "Invertebrate species",
            "priority": "Tasmanophlebi lacuscoerulei (Large Blue Lake Mayfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Caliagrion billinghursti (Large Riverdamsel)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Engaeus mallacoota (Mallacoota Burrowing Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus polysetosus (Many-bristled Crayfish )"
        },
        {
            "category": "Invertebrate species",
            "priority": "Tabanidae spp. (March/Horse Flies)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Coloburiscoides spp. Leptophlebiidae spp. Atalophlebia spp. Austrophlebioides spp. Mirawara spp. Nousia spp. (Mayfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Pommerhelix mastersi (Merimbula Woodland Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Xylocopa aeratus (Metallic Green Carpenter Bee)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Hydroptilidae gen. Hellyethira (Microcaddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Hydroptilidae gen. Hydroptila (Microcaddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Hydroptilidae gen. Oxyethira (Microcaddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "supf. Hydroptiloidea fam. Hydroptilidae (Microcaddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Hydraenidae gen. Hydraena (Minute Moss Beetle)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus morgani (Morgan's Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Alpiniropa okeana (Mount Feathertop Pinwheel Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Arachnocampa sp. = Arachnocampa lucifera buffaloensis (Mt Buffalo Glow-worm)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus dalagarbe  (Mud Gully Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Cheumatopsyche spp. (Netspinning Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Diplectrona spp. (Netspinning Caddisfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Chironomini spp. (Non-biting Midge)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Tanypodinae spp. (Non-biting Midge)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Hypocysta adiante (Orange Ringlet Butterfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Maratus rainbowi , Maratus pavonis (Peacock Spider)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Colubotelson joyneri (Phreatoicid isopod)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Planarian sp. 3, 4 (RSC) (Planarian)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Eucinetidae spp. (Plate-thigh beetles)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Pyrgomorphidae gen. Monistria (Pyrgomorph Grasshopper)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus rieki  (Riek's Spiny Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Australatya striolata (Riffle Shrimp/Eastern Freshwater Shrimp)"
        },
        {
            "category": "Invertebrate species",
            "priority": "supf. Staphylinoidea fam. Staphylinidae (Rove Beetle)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Trapezites iacchoides  (Silver-studded Ochre)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus spinichelatus (Small Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus simplex (Small Mountain Crayfish )"
        },
        {
            "category": "Invertebrate species",
            "priority": "Synemon discalis (Small Orange-spotted Sun-moth)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus girurmulayn (Smooth Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Vitellidelos helmsiana (Snowy Mountains Carnivorous Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Paralaoma gelida (Snowy Mountains Pinhead Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Banjoropa snowyensis (Snowy River Pinwheel Snail)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Telicota eurychlora (Southern Sedge-darter Butterfly/ Dingy Darter)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Notonemouridae gen. Austrocercella, Gripopterygidae spp. Cosmioperla spp. Dinotoperla spp. Leptoperla spp. Illiesoperla spp. Eunotoperla spp. Riekoperla spp. Trinotoperla spp. (Stonefly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus suttoni (Sutton's Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Pasma tasmanica (Tasmanica Skipper/Two-spotted Skipper/Grass-skipper)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus guwinus (Tianjara Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus yanga (Variable Spiny Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Onychophora gen. Peripatopsidae, Ooperipatellus duwilensis, Ooperipitas pulchellus, Planipapillus biacinaces (Velvet Worm)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Dytiscidae gen. Necterosoma (Water Beetle)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Hydrophilidae gen. Berosus (Water Scavenger Beetle)"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Hydrophilidae gen. Notohydrus (Water Scavenger Beetle)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Athericidae spp. (Water Snipe-flies)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Austropetalia patricia (Waterfall Redspot)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Euastacus sp. 3 (West Snowy Spiny Crayfish)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Heteronympha mirifica  (Wonder Brown)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Trapezites luteus (Yellow Ochre Butterfly)"
        },
        {
            "category": "Invertebrate species",
            "priority": "Anisocentropus spp. Notalina spp. Triplectides spp. Archaeophylax canarus"
        },
        {
            "category": "Invertebrate species",
            "priority": "Costora spp. Helicopsyche spp. Tamasia spp. Austrheithrus spp."
        },
        {
            "category": "Invertebrate species",
            "priority": "Ecnomus neboissi"
        },
        {
            "category": "Invertebrate species",
            "priority": "Ecnomus nibbor"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Caenidae gen. Tasmanocoenis"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Diphlebiidae gen. Diphlebia"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Dytiscidae gen. Lancetes"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Elmidae gen. Kingolus"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Elmidae gen. Simsonia"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Gomphidae gen. Hemigomphus"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Leptophlebiidae gen. Garinjuga"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Leptophlebiidae gen. Ulmerophlebia"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Synthemistidae gen. Eusynthemis"
        },
        {
            "category": "Invertebrate species",
            "priority": "fam. Telephlebiidae gen. Notoaeschna"
        },
        {
            "category": "Invertebrate species",
            "priority": "Kosrheithrus spp.  "
        },
        {
            "category": "Invertebrate species",
            "priority": "Kosrheithrus spp.  Anisocentropus spp. Notalina spp. Triplectides spp. Archaeophylax canarus"
        },
        {
            "category": "Invertebrate species",
            "priority": "Ramiheithrus virgatus"
        },
        {
            "category": "Invertebrate species",
            "priority": "Triaenodes cuspiosa"
        },
        {
            "category": "Invertebrate species",
            "priority": "Triaenodes uvida"
        },
        {
            "category": "Other natural asset",
            "priority": "Australian Alpine National Parks and Reserves National Heritage List place"
        },
        {
            "category": "Other natural asset",
            "priority": "Headwaters of the Murray River"
        },
        {
            "category": "Other natural asset",
            "priority": "Gondwana Rainforests of Australia World Heritage Area"
        },
        {
            "category": "Other natural asset",
            "priority": "Greater Blue Mountains World Heritage Area"
        },
        {
            "category": "Other natural asset",
            "priority": "Moreton Bay Ramsar Wetland"
        },
        {
            "category": "Other natural asset",
            "priority": "Myall Lakes Ramsar Wetland"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus langleyi (Albatross Mallee)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus delegatensis subsp. delegatensis (Alpine Ash)"
        },
        {
            "category": "Plant species",
            "priority": "Dodonaea truncatiales (Angular Hop-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Syzygium anisatum (Aniseed Myrtle)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus annettae (Annett’s Mallet)"
        },
        {
            "category": "Plant species",
            "priority": "Nothofagus moorei  (Antarctic Beech)"
        },
        {
            "category": "Plant species",
            "priority": "Zieria adenophora (Araluen Zieria)"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum bagoense (Bago Leek-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea banyabba (Banyabba Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus pachycalyx subsp. banyabba (Banyabba Shiny-barked Gum)"
        },
        {
            "category": "Plant species",
            "priority": "Boronia barkeriana subsp. barkeriana (Barker's Boronia)"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia sp. Toolbrunup (J.R.Wheeler 2504) (Barrett’s Guinea Flower)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia beadleana (Beadle’s Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea beadleana (Beadle's Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia georgensis (Bega Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus bensonii (Benson's Stringybark)"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris sericea (Bent Pomaderris)"
        },
        {
            "category": "Plant species",
            "priority": "Callistemon kenmorrisonii (Betka Bottlebrush)"
        },
        {
            "category": "Plant species",
            "priority": "Homoranthus binghiensis (Binghi Homoranthus)"
        },
        {
            "category": "Plant species",
            "priority": "Brachyscome ascendens (Binna Burra Daisy)"
        },
        {
            "category": "Plant species",
            "priority": "Chiloglottis anaticeps (Bird Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Schoenus melanostachys (Black Bog-sedge)"
        },
        {
            "category": "Plant species",
            "priority": "Adiantum formosum (Black Stem)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia blayana (Blay's Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Callistemon purpurescens"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera walteri (Blotchy Mintbush, Monkey Mint-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia covenyi (Blue Bush)"
        },
        {
            "category": "Plant species",
            "priority": "Euphrasia bowdeniae (Blue Mountains Cliff Eyebright)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus agglomerata (Blue-leaf Stringybark)"
        },
        {
            "category": "Plant species",
            "priority": "Pterostylis oreophila (Blue-tongue Greenhood)"
        },
        {
            "category": "Plant species",
            "priority": "Santalum obtusifolium (Blunt Sandalwood)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea acanthifolia subsp. paludosa (Bog Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Bossiaea bombayensis (Bombay Bossiaea)"
        },
        {
            "category": "Plant species",
            "priority": "Cryptostylis erecta (Bonnet Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia marginata (Bordered Guinea Flower)"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum innubum (Brandy Marys Leek-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Gentiana bredboensis (Bredbo Gentian)"
        },
        {
            "category": "Plant species",
            "priority": "Polystichum formosum (Broad Shield-fern)"
        },
        {
            "category": "Plant species",
            "priority": "Dodonaea rhombifolia (Broad-leaf Hop-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus phoenix (Brumby Mallee-gum)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus forresterae (Brumby Sallee)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea pachylostyla (Buchan River Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea baeuerlenii (Budawangs Bush-pea)"
        },
        {
            "category": "Plant species",
            "priority": "Budawangia gnidioides (Budawangs Cliff-heath)"
        },
        {
            "category": "Plant species",
            "priority": "Epacris gnidioides (Budawangs Cliff-heath)"
        },
        {
            "category": "Plant species",
            "priority": "Plinthanthesis rodwayi (Budawangs Wallaby-grass)"
        },
        {
            "category": "Plant species",
            "priority": "Symplocos thwaitesii (Buff Hazelwood)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea alpivaga (Buffalo Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera monticola (Buffalo Mint-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus mitchelliana (Buffalo Sallee)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea burrowa (Burrowa Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Echinopogon caespitosus var. caespitosus (Bushy Hedgehog-grass)"
        },
        {
            "category": "Plant species",
            "priority": "Diuris aequalis (Buttercup Doubletail)"
        },
        {
            "category": "Plant species",
            "priority": "Livistona australis (Cabbage Fan-palm)"
        },
        {
            "category": "Plant species",
            "priority": "Banksia anatona (Cactus Dryandra)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus macarthurii (Camden Woollybutt, Paddys River Box)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia cangaiensis (Cangai Forest Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Carex jackiana (Carpet Sedge)"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum caricetum (Cathcart Leek Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia chalkeri (Chalker's Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Correa baeuerlenii (Chef's Cap)"
        },
        {
            "category": "Plant species",
            "priority": "Pteris vittata (Chinese Brake)"
        },
        {
            "category": "Plant species",
            "priority": "Blandfordia grandiflora (Christmas bells)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus gunnii (Cider Gum)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus cunninghamii (Cliff Mallee Ash)"
        },
        {
            "category": "Plant species",
            "priority": "Deyeuxia ramosa (Climbing Bent-grass)"
        },
        {
            "category": "Plant species",
            "priority": "Poranthera corymbosa (Clustered Poranthera)"
        },
        {
            "category": "Plant species",
            "priority": "Cassinia maritima (Coast Cassinia)"
        },
        {
            "category": "Plant species",
            "priority": "Epacris microphylla s.s. (Coast Coral Heath)"
        },
        {
            "category": "Plant species",
            "priority": "Buffalo sallow wattle (Acacia phlebophylla)"
        },
        {
            "category": "Plant species",
            "priority": "Fern-leaf baeckea (Sannantha crenulata)"
        },
        {
            "category": "Plant species",
            "priority": "Snow pratia (Lobelia gelida)"
        },
        {
            "category": "Plant species",
            "priority": "Muellerina celastroides (Coast Mistletoe)"
        },
        {
            "category": "Plant species",
            "priority": "Thelymitra improcera (Coast Sun-orchid, Coastal Sun-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Thelymitra incurva (Coastal Stiped Sun-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea celata (Colquhoun Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris cotoneaster (Cotoneaster Pomaderris)"
        },
        {
            "category": "Plant species",
            "priority": "Zieria covenyi (Coveny's Zieria)"
        },
        {
            "category": "Plant species",
            "priority": "Triplarina imbricata (Creek Triparina)"
        },
        {
            "category": "Plant species",
            "priority": "Lastreopsis microsora subsp. microsora (Creeping Shield-fern)"
        },
        {
            "category": "Plant species",
            "priority": "Tylophora woollsii (Cryptic Forest Twiner)"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea vrolandii (Cupped Bush-pea)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera incisa (Cut-leaf Mint-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Cardamine tryssa (Dainty Bitter-cress)"
        },
        {
            "category": "Plant species",
            "priority": "Goodenia bellidifolia subsp. bellidifolia (Daisy Goodenia)"
        },
        {
            "category": "Plant species",
            "priority": "Correa calycina var. halmaturorum (De Mole River Correa)"
        },
        {
            "category": "Plant species",
            "priority": "Boronia deanei (Deane's Boronia)"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris reperta (Denman Pomaderris)"
        },
        {
            "category": "Plant species",
            "priority": "Baloskion longipes (Dense Cord-rush)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera decussata (Dense Mint-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea rhyolitica (Deua Grevillea, Deua Flame)"
        },
        {
            "category": "Plant species",
            "priority": "Deyeuxia decipiens (Devious Bent-grass)"
        },
        {
            "category": "Plant species",
            "priority": "Diuris corymbosa (Donkey Orchid )"
        },
        {
            "category": "Plant species",
            "priority": "Olearia flocktoniae (Dorrigo Daisy-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Zieria littoralis (Downy Zieria, Dwarf Zieria)"
        },
        {
            "category": "Plant species",
            "priority": "Deyeuxia drummondii (Drummond's Grass, Drummond Grass)"
        },
        {
            "category": "Plant species",
            "priority": "Asterolasia beckersii (Dungowan Starbush)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus dunni (Dunn's white gum)"
        },
        {
            "category": "Plant species",
            "priority": "Callistemon subulatus (Dwarf Bottlebrush)"
        },
        {
            "category": "Plant species",
            "priority": "Brunoniella pumilio (Dwarf Brunoniella)"
        },
        {
            "category": "Plant species",
            "priority": "Callitris monticola (Dwarf Cypress)"
        },
        {
            "category": "Plant species",
            "priority": "Allocasuarina defungens (Dwarf Heath Casuarina)"
        },
        {
            "category": "Plant species",
            "priority": "Pherosphaera fitzgeraldii (Dwarf Mountain Pine)"
        },
        {
            "category": "Plant species",
            "priority": "Patersonia sericea var. longifolia (Dwarf Purple-flag)"
        },
        {
            "category": "Plant species",
            "priority": "Xyris juncea (Dwarf Yellow-eye)"
        },
        {
            "category": "Plant species",
            "priority": "Genoplesium vernale (East Lynne Midge Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Eucryphia moorei (Eastern Leatherwood)"
        },
        {
            "category": "Plant species",
            "priority": "Rhizanthella slateri (Eastern Underground Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Cassinia venusta (Elegant Cassinia)"
        },
        {
            "category": "Plant species",
            "priority": "Brachyscome salkiniae (Elegant Daisy)"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea elusa (Elusive Bush-pea)"
        },
        {
            "category": "Plant species",
            "priority": "Irenepharsus magicus (Elusive Cress)"
        },
        {
            "category": "Plant species",
            "priority": "Hakea aenigma (Enigma Hakea)"
        },
        {
            "category": "Plant species",
            "priority": "Podocarpus aff. lawrencei (Goonmirk Rocks) (Errinundra Plum-pine)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus denticulata (Errinundra Shining Gum)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus sturgissiana (Ettrema Mallee)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea evansiana (Evans Grevillea )"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea evansiana  (Evans Grevillea )"
        },
        {
            "category": "Plant species",
            "priority": "Lambertia fairallii (Fairall's Honeysuckle)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea ramosissima subsp. hypargyrea (Fan Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Hakea dactyloides (Finger Hakea)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea quinquenervis (Five-veined Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Isopogon fletcheri (Fletchers Drumsticks)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia flocktoniae (Flockton Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Zieria floydii (Floyd's Zieria)"
        },
        {
            "category": "Plant species",
            "priority": "Deyeuxia frigida (Forest Bent-grass)"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia silvatica (Forest Geebung)"
        },
        {
            "category": "Plant species",
            "priority": "Callistemon forresterae (Forrester’s Bottlebrush)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea parvula (Genoa Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Correa lawrenceana var. genoensis (Genoa River Correa)"
        },
        {
            "category": "Plant species",
            "priority": "Caladenia ancylosa (Genoa Spider-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Andersonia axilliflora (Giant Andersonia)"
        },
        {
            "category": "Plant species",
            "priority": "Stylidium laricifolium  (Giant Trigger-Plant)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea rhizomatosa (Gibraltar Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Telopea aspera (Gibraltar Range Waratah)"
        },
        {
            "category": "Plant species",
            "priority": "Darwinia oxylepis (Gillam's Bell)"
        },
        {
            "category": "Plant species",
            "priority": "Banksia croajingolensis (Gippsland Banksia)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia trachyphloia (Golden Feather Wattle, Bodalla Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Notothixos subaureus (Golden Mistletoe)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia gordonii (Gordon's Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Boronia granitica (Granite Boronia)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea neurophylla subsp. fluviatilis (Granite Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Botrychium lunaria (Grassy Moonwort)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea jephcottii (Green Grevillea, Pine Mountain Grevillea, Jephcotts Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia decurrens (Green Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris gilmourii var. cana (Grey Deua Pomaderris)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea guthrieana (Guthrie's Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia hirsuta (Hairy Geebung)"
        },
        {
            "category": "Plant species",
            "priority": "Commersonia breviseta (Hairy Kerrawang)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia hamiltoniana (Hamilton's Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Sarcochilus hartmannii (Hartman's Sarcochilus)"
        },
        {
            "category": "Plant species",
            "priority": "Astrotricha cordata (Heart-leaved Star Hair)"
        },
        {
            "category": "Plant species",
            "priority": "Mirbelia rubiifolia (Heathy Mirbelia)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia echinula (Hedgehog Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Picris angustifolia subsp. merxmuelleri (Highland Picris)"
        },
        {
            "category": "Plant species",
            "priority": "Pterostylis sp. aff. alveata (Montane) (Hill Greenhood)"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia notabilis (Howe Guinea-flower)"
        },
        {
            "category": "Plant species",
            "priority": "Irenepharsus trypherus (Illawarra Irene)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus imitans (Illawarra Stringybark )"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus imlayensis (Imlay Mallee, Mount Imlay Mallee)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea macleayana (Jervis Bay Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus stenostoma (Jillaga Ash)"
        },
        {
            "category": "Plant species",
            "priority": "Macrozamia johnsonii (Johnson's Cycad)"
        },
        {
            "category": "Plant species",
            "priority": "Korthalsella rubra subsp. rubra (Jointed Mistletoe)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia jonesii (Jones Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus remota (Kangaroo Island Ash)"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea trifida (Kangaroo Island Bush-pea)"
        },
        {
            "category": "Plant species",
            "priority": "Irenepharsus phasmatodes (Kangaroo Island Cress)"
        },
        {
            "category": "Plant species",
            "priority": "Achnophora tatei (Kangaroo Island Daisy)"
        },
        {
            "category": "Plant species",
            "priority": "Dampiera lanceolata var. insularis (Kangaroo Island Dampiera)"
        },
        {
            "category": "Plant species",
            "priority": "Acrotriche halmaturina (Kangaroo Island Ground-berry)"
        },
        {
            "category": "Plant species",
            "priority": "Calytrix smeatoniana (Kangaroo Island Heath-myrtle)"
        },
        {
            "category": "Plant species",
            "priority": "Logania insularis (Kangaroo Island Logania)"
        },
        {
            "category": "Plant species",
            "priority": "Tetratheca insularis (Kangaroo Island Pink-eyes)"
        },
        {
            "category": "Plant species",
            "priority": "Lepyrodia valliculae (Kangaroo Island Scale-rush)"
        },
        {
            "category": "Plant species",
            "priority": "Gahnia hystrix (Kangaroo Island Spiky Saw-sedge)"
        },
        {
            "category": "Plant species",
            "priority": "Stylidium tepperianum (Kangaroo Island Trigger-Plant)"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum keltonii (Kelton's Leek-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Commersonia dasyphylla (Kerrawang)"
        },
        {
            "category": "Plant species",
            "priority": "Boronia keysii (Key's boronia)"
        },
        {
            "category": "Plant species",
            "priority": "Hakea dohertyi (Kowmung Hakea)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia clunies-rossiae (Kowmung Wattle, Kanangra Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Dampiera fusca (Kydra Dampiera)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia kydrensis (Kydra Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Tetratheca subaphylla (Leafless Pink-bells)"
        },
        {
            "category": "Plant species",
            "priority": "Cryptostylis hunteriana (Leafless Tongue-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Nematolepis frondosa (Leafy Nematolepis)"
        },
        {
            "category": "Plant species",
            "priority": "Asterolasia muricata (Lemon Star-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Zieria citriodora (Lemon-scented Zieria)"
        },
        {
            "category": "Plant species",
            "priority": "Schelhammera undulata (Lilac Lily)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera caerulea (Lilac Mint-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia caerulescens (Limestone Blue Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Orthotrichum cupulatum var. cupulatum (Limestone Bristle-moss)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea linsmithii (Linsmith's Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus molyneuxii (Little Desert Peppermint)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus moorei (Little Sally, Narrow-leaved Sally)"
        },
        {
            "category": "Plant species",
            "priority": "Platysace heterophylla var. tepperi (Lobed Platysace)"
        },
        {
            "category": "Plant species",
            "priority": "Dendrophthoe vitellina (Long-flower Mistletoe)"
        },
        {
            "category": "Plant species",
            "priority": "Daviesia wyattiana (Long-leaf Bitter-pea)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia mabellae (Mabel's Wattle, Black Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Hakea macraeana (Macrae's Hakea, Willow Needlewood)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia maidenii (Maiden's Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus codonocarpa (Mallee ash)"
        },
        {
            "category": "Plant species",
            "priority": "Solanum sulphureum (Manning Yellow Solanum)"
        },
        {
            "category": "Plant species",
            "priority": "Olearia astroloba (Marble Daisy-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum niphopedium (Marsh Leek-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Callistemon megalongensis (Megalong Valley Bottlebrush)"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia glaucescens (Mittagong Geebung)"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum thompsonii (Monga Tea-tree)"
        },
        {
            "category": "Plant species",
            "priority": "Telopea mongaensis (Monga Waratah)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus deuaensis (Mongamulla Mallee)"
        },
        {
            "category": "Plant species",
            "priority": "Styphelia perileuca (Montane Green Five-corners)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia saxicola (Mount Maroon Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus regnans (Mountain Ash)"
        },
        {
            "category": "Plant species",
            "priority": "Banksia canei (Mountain Banksia)"
        },
        {
            "category": "Plant species",
            "priority": "Bertya findlayi (Mountain Bertya)"
        },
        {
            "category": "Plant species",
            "priority": "Craspedia sp. 1 (Mountain Forest Billy-buttons)"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia asperula (Mountain Geebung)"
        },
        {
            "category": "Plant species",
            "priority": "Latrobea colophona (Mountain Latrobea)"
        },
        {
            "category": "Plant species",
            "priority": "Cryptocarya nova-anglica (Mountain Laurel)"
        },
        {
            "category": "Plant species",
            "priority": "Leptostigma breviflorum (Mountain Nertera)"
        },
        {
            "category": "Plant species",
            "priority": "Trachymene scapigera (Mountain Trachymene)"
        },
        {
            "category": "Plant species",
            "priority": "Philotheca obovatifolia (Mountain Wax-flower)"
        },
        {
            "category": "Plant species",
            "priority": "Asperula tetraphylla (Mountain Woodruff)"
        },
        {
            "category": "Plant species",
            "priority": "Zieria montana (Mountain Zieria)"
        },
        {
            "category": "Plant species",
            "priority": "Bertya ernestiana (Mt Barney Bertya)"
        },
        {
            "category": "Plant species",
            "priority": "Boronia imlayensis (Mt Imlayt Boronia)"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea whiteana (Mt. Barney Bush-pea)"
        },
        {
            "category": "Plant species",
            "priority": "Callitris muelleri (Mueller’s Cypress)"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum pallens (Musty Leek-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia myrtilloides (Myrtle Geebung)"
        },
        {
            "category": "Plant species",
            "priority": "Nematolepis rhytidophylla (Nalbaugh Nematolepis)"
        },
        {
            "category": "Plant species",
            "priority": "Euphrasia collina subsp. nandewarensis (Nandewar Range Eyebright)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia constablei (Narrabarba Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Deyeuxia pungens (Narrow-leaf Bent-grass)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia subporosa (Narrow-leaf Bower Wattle, Sticky Bower Wattle, River Wattle, Bower Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Melichrus sp. Gibberagee (Narrow-leaf Melichrus)"
        },
        {
            "category": "Plant species",
            "priority": "Hakea asperma (Native Dog Hakea)"
        },
        {
            "category": "Plant species",
            "priority": "Androcalva rossii (Native Hemp)"
        },
        {
            "category": "Plant species",
            "priority": "Alectryon subcinereus (Native Quince)"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia acerosa (Needle Geebung)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea renwickiana (Nerriga Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia subtilinervis (Net-veined Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Gentiana wissmannii (New England Gentian)"
        },
        {
            "category": "Plant species",
            "priority": "Eidothea hardeniana  (Nightcap Oak)"
        },
        {
            "category": "Plant species",
            "priority": "Triplarina nowraensis (Nowra Heath-myrtle)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus elaeophloia (Nunniong Gum, Olive Mallee)"
        },
        {
            "category": "Plant species",
            "priority": "Olearia quercifolia (Oak-leaved Olearia)"
        },
        {
            "category": "Plant species",
            "priority": "Olax stricta (Olax)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus corticosa (Olinda Box)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia olsenii (Olsen’s Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Sarcochilus falcatus (Orange-blossom Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus mackintii (Orbost Stringybark)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalytus macarthurii (Paddys River Box)"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum trinervium (Paperbark Tea-tree)"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea parrisiae (Paris' Bush-pea)"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris parrisiae (Parris' Pomaderris)"
        },
        {
            "category": "Plant species",
            "priority": "Uromyrtus australis (Peach Myrtle)"
        },
        {
            "category": "Plant species",
            "priority": "Polyscias murrayi (Pencil Cedar)"
        },
        {
            "category": "Plant species",
            "priority": "Rytidosperma vickeryae (Perisher Wallaby-grass  )"
        },
        {
            "category": "Plant species",
            "priority": "Acacia phasmoides (Phantom Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus triflora (Pigeon House Ash, Three-flowered Ash)"
        },
        {
            "category": "Plant species",
            "priority": "Boronia pulchella (Pink Boronia)"
        },
        {
            "category": "Plant species",
            "priority": "Correa lawrenceana var. cordifolia (Pink Mountain-correa)"
        },
        {
            "category": "Plant species",
            "priority": "Zieria veronicea subsp. insularis (Pink Zieria)"
        },
        {
            "category": "Plant species",
            "priority": "Pterostylis acuminata (Pointed Greenhood)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia dawsonii (Poverty Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Calochilus pulchellus (Pretty Beard Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Euphrasia bella (Pretty Eyebright)"
        },
        {
            "category": "Plant species",
            "priority": "Mirbelia pungens (Prickly Mirbelia)"
        },
        {
            "category": "Plant species",
            "priority": "Podolobium ilicifolium (Prickly Podolobium)"
        },
        {
            "category": "Plant species",
            "priority": "Cyathea leichhardtiana (Prickly Tree-fern)"
        },
        {
            "category": "Plant species",
            "priority": "Coopernookia barbata (Purple Coopernookia)"
        },
        {
            "category": "Plant species",
            "priority": "Callitris oblonga subsp. corangensis (Pygmy Cypress Pine)"
        },
        {
            "category": "Plant species",
            "priority": "Corymbia gummifera (Red Bloodwood)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus scias subsp. apoda (Red mahogany)"
        },
        {
            "category": "Plant species",
            "priority": "Actinotus forsythii (Ridge Flannel-flower)"
        },
        {
            "category": "Plant species",
            "priority": "Leucopogon riparius (River Beard-heath)"
        },
        {
            "category": "Plant species",
            "priority": "Gleichenia rupestris (Rock Coral-fern)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus saxatilis (Rock Mallee)"
        },
        {
            "category": "Plant species",
            "priority": "Dendrobium speciosum var. speciosum (Rock Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Callicarpa thozetii (Rockhampton Beautyberry)"
        },
        {
            "category": "Plant species",
            "priority": "Euphrasia scabra (Rough Eyebright)"
        },
        {
            "category": "Plant species",
            "priority": "Logania scabrella (Rough Logania)"
        },
        {
            "category": "Plant species",
            "priority": "Angophora floribunda (Rough-barked Apple)"
        },
        {
            "category": "Plant species",
            "priority": "Pittosporum revolutum (Rough-fruit Pittosporum)"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum rotundifolium (Round-leaved Tea Tree)"
        },
        {
            "category": "Plant species",
            "priority": "Wahlenbergia gloriosa (Royal Bluebell)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus rudderi (Rudder's Box)"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris brunnea (Rufous Pomaderris)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia ruppii (Rupp's Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Lasiopetalum ferrugineum (Rusty Velvet-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Leionema sympetalum  (Rylstone Bell)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea arenaria subsp. arenaria (Sand Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Ficus coronata (Sandpaper Fig)"
        },
        {
            "category": "Plant species",
            "priority": "Melaleuca capitata (Sandstone Honey-myrtle)"
        },
        {
            "category": "Plant species",
            "priority": "Bothriochloa bunyensis (Satin-top Grass)"
        },
        {
            "category": "Plant species",
            "priority": "Darwinia apiculata (Scarp Darwinia)"
        },
        {
            "category": "Plant species",
            "priority": "Rhodamnia rubescens (Scrub Turpentine, Brown Malletwood)"
        },
        {
            "category": "Plant species",
            "priority": "Boronia hapalophylla (Shannon Creek Boronia)"
        },
        {
            "category": "Plant species",
            "priority": "Cyathochaeta diandra (Sheath Sedge)"
        },
        {
            "category": "Plant species",
            "priority": "Discaria nitida (Shining Anchor Plant)"
        },
        {
            "category": "Plant species",
            "priority": "Sticherus flabellatus (Shiny Fan-fern)"
        },
        {
            "category": "Plant species",
            "priority": "Baeckea brevifolia (Short-leaved Baeckea)"
        },
        {
            "category": "Plant species",
            "priority": "Boronia ledifolia (Showy Boronia)"
        },
        {
            "category": "Plant species",
            "priority": "Deyeuxia talariata (Skirted Bent-Grass)"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum parviflorum (Slender Leek-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Muehlenbeckia gracillima (Slender Lignum)"
        },
        {
            "category": "Plant species",
            "priority": "Pseudoraphis paradoxa (Slender Mud-grass)"
        },
        {
            "category": "Plant species",
            "priority": "Myoporum floribundum (Slender Myoporum)"
        },
        {
            "category": "Plant species",
            "priority": "Pterostylis reflexa (Small Autumn Greenhood)"
        },
        {
            "category": "Plant species",
            "priority": "Cryptocarya williwilliana (Small-leave Laurel)"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia levis (Smooth Geebung)"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum glabrescens s.s. (Smooth Tea-tree)"
        },
        {
            "category": "Plant species",
            "priority": "Aciphylla glacialis (Snow Aciphyll)"
        },
        {
            "category": "Plant species",
            "priority": "Kelleria bogongensis (Snow Daphne)"
        },
        {
            "category": "Plant species",
            "priority": "Hookerochloa eriopoda (Snow Fescue)"
        },
        {
            "category": "Plant species",
            "priority": "Brachyscome riparia (Snowy River Daisy)"
        },
        {
            "category": "Plant species",
            "priority": "Westringia cremnophila (Snowy River Westringia)"
        },
        {
            "category": "Plant species",
            "priority": "Scutellaria mollis (Soft Skullcap)"
        },
        {
            "category": "Plant species",
            "priority": "Leptomeria acida s.s. (Sour Currant-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Epacris sparsa (Sparse Heath)"
        },
        {
            "category": "Plant species",
            "priority": "Ozothamnus argophyllus (Spicy Everlasting)"
        },
        {
            "category": "Plant species",
            "priority": "Choretrum spicatum (Spiked Sour-bush, Berry Broombush)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus perriniana (Spinning Gum)"
        },
        {
            "category": "Plant species",
            "priority": "Lepidium aschersonii (Spiny Peppercress)"
        },
        {
            "category": "Plant species",
            "priority": "Hydrocotyle crassiuscula (Spreading Pennywort)"
        },
        {
            "category": "Plant species",
            "priority": "Corysanthes aconitiflorus (Spurred Helmet Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus ophitica (Stalked Guinea-flower)"
        },
        {
            "category": "Plant species",
            "priority": "Cryptocarya foetida (Stinking Cryptocarya)"
        },
        {
            "category": "Plant species",
            "priority": "Leucopogon gnaphalioides (Stirling Range Beard-heath)"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia micranthera (Stirling Range Daviesia)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus parvula (Stirling Range Dryandra)"
        },
        {
            "category": "Plant species",
            "priority": "Conospermum burgessiorum (Stirling Range Gastrolobium)"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea glabra (Stirling Range Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum jingera (Stringbark Tea-tree)"
        },
        {
            "category": "Plant species",
            "priority": "Allocasuarina nana (Stunted Sheoak)"
        },
        {
            "category": "Plant species",
            "priority": "Darwinia nubigena (Success Bell, Red Mountain Bell)"
        },
        {
            "category": "Plant species",
            "priority": "Philotheca myoporoides subsp. brevipedunculata (Suggan Buggan Wax-flower)"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum uvidulum (Summer Leek-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera palustris (Swamp Mint-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Hovea purpurea (Tall Hovea)"
        },
        {
            "category": "Plant species",
            "priority": "Genoplesium plumosum (Tallong Midge Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Plectorrhiza tridentata (Tangle Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Philotheca virgata (Tasmanian Wax-flower)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera staurophylla (Tenterfield Mint-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Deyeuxia crassiuscula (Thick Bent-grass)"
        },
        {
            "category": "Plant species",
            "priority": "Astrotricha crassifolia (Thick-leaf Star Hair)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia trinervata (Three-veined Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Tetratheca thymifolia (Thyme Pink-bells)"
        },
        {
            "category": "Plant species",
            "priority": "Spyridium cinereum (Tiny Spyridium)"
        },
        {
            "category": "Plant species",
            "priority": "Olearia tomentosa (Toothed Daisy-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Lobelia dentata (Toothed Lobelia)"
        },
        {
            "category": "Plant species",
            "priority": "Leucopogon confertus (Torrington Beard-heath)"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia terminalis (Torrington Geebung)"
        },
        {
            "category": "Plant species",
            "priority": "Almaleea cambagei (Torrington Pea)"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia dentata (Trailing Guinea Flower)"
        },
        {
            "category": "Plant species",
            "priority": "Monotoca rotundifolia (Trailing Monotoca)"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia hexandra (Tree Guinea Flower)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea polychroma (Tullach Ard Grevillea)"
        },
        {
            "category": "Plant species",
            "priority": "Genoplesium littorale (Tuncurry Midge Orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera teretifolia (Turpentine Mint-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Cheiranthera volubilis (Twining Finger-flower)"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris virgata (Upright Pomaderris)"
        },
        {
            "category": "Plant species",
            "priority": "Conospermum taxifolium (Variable Smoke-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris costata (Veined Pomaderris)"
        },
        {
            "category": "Plant species",
            "priority": "Zieria murphyi (Velvet Zieria)"
        },
        {
            "category": "Plant species",
            "priority": "Olearia iodochroa (Violet Daisy-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera violacea (Violet Mint-bush)"
        },
        {
            "category": "Plant species",
            "priority": "Solanum silvestre (Violet Nightshade)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus paliformis (Wadbilliga Ash)"
        },
        {
            "category": "Plant species",
            "priority": "Zieria tuberculata (Warty Zieria)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus fraxinoides (White Ash)"
        },
        {
            "category": "Plant species",
            "priority": "Ripogonum album (White Supplejack)"
        },
        {
            "category": "Plant species",
            "priority": "Zieria lasiocaulis (Willi Willi Zieria)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia saliciformis (Willow Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Ozothamnus adnatus (Winged Everlasting)"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea molyneuxii (Wingello Grevillea )"
        },
        {
            "category": "Plant species",
            "priority": "Plinthanthesis paradoxa (Wiry Wallaby-grass)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus olsenii (Woila Gum)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus gregsoniana (Wolgan or Mallee Snow Gum)"
        },
        {
            "category": "Plant species",
            "priority": "Wollemia nobilis (Wollemi Pine)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus expressa (Wollemi Stringybark)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia lanigera var. gracilipes (Woolly Watttle)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia lucasii (Woolly-bear Wattle)"
        },
        {
            "category": "Plant species",
            "priority": "Dipodium interaneum [hamiltonianum] (Yellow Hyacinth-orchid)"
        },
        {
            "category": "Plant species",
            "priority": "Marsdenia flavescens (Yellow Milk-vine)"
        },
        {
            "category": "Plant species",
            "priority": "Darwinia collina (Yellow Mountain Bell)"
        },
        {
            "category": "Plant species",
            "priority": "Acacia alaticaulis"
        },
        {
            "category": "Plant species",
            "priority": "Acacia awestoniana"
        },
        {
            "category": "Plant species",
            "priority": "Acacia meiantha"
        },
        {
            "category": "Plant species",
            "priority": "Acacia ptychoclada"
        },
        {
            "category": "Plant species",
            "priority": "Acacia tessellata"
        },
        {
            "category": "Plant species",
            "priority": "Acacia torringtonensis"
        },
        {
            "category": "Plant species",
            "priority": "Acacia ureniae"
        },
        {
            "category": "Plant species",
            "priority": "Acacia yalwalensis"
        },
        {
            "category": "Plant species",
            "priority": "Actinotus rhomboideus"
        },
        {
            "category": "Plant species",
            "priority": "Allocasuarina diminuta subsp. annectens"
        },
        {
            "category": "Plant species",
            "priority": "Allocasuarina rigida"
        },
        {
            "category": "Plant species",
            "priority": "Almaleea incurvata"
        },
        {
            "category": "Plant species",
            "priority": "Aotus genistoides"
        },
        {
            "category": "Plant species",
            "priority": "Apatophyllum constablei"
        },
        {
            "category": "Plant species",
            "priority": "Asterolasia buxifolia"
        },
        {
            "category": "Plant species",
            "priority": "Asterolasia rivularis"
        },
        {
            "category": "Plant species",
            "priority": "Asterolasia rupestris subsp. rupestris"
        },
        {
            "category": "Plant species",
            "priority": "Asterolasia trymalioides subsp. areniticola"
        },
        {
            "category": "Plant species",
            "priority": "Astrotricha sp. Deua (R.O.Makinson 1647)"
        },
        {
            "category": "Plant species",
            "priority": "Astrotricha sp. Howe Range (D.E.Albrecht 1054)"
        },
        {
            "category": "Plant species",
            "priority": "Astrotricha sp. Wallagaraugh"
        },
        {
            "category": "Plant species",
            "priority": "Astrotricha sp. Wingan Inlet (J.A.Jeanes 2268)"
        },
        {
            "category": "Plant species",
            "priority": "Baeckea kandos"
        },
        {
            "category": "Plant species",
            "priority": "Baeckea sp. Crossroads (B.L.Rye & M.E.Trudgen 241186)"
        },
        {
            "category": "Plant species",
            "priority": "Banksia paludosa subsp. astrolux"
        },
        {
            "category": "Plant species",
            "priority": "Banksia penicillata"
        },
        {
            "category": "Plant species",
            "priority": "Bertya mollissima"
        },
        {
            "category": "Plant species",
            "priority": "Bertya sp. Chambigne NR (M.Fatemi 24)"
        },
        {
            "category": "Plant species",
            "priority": "Bertya sp. Clouds Creek (M.Fatemi 4)"
        },
        {
            "category": "Plant species",
            "priority": "Beyeria sulcata var. truncata"
        },
        {
            "category": "Plant species",
            "priority": "Boronia anemonifolia subsp. wadbilligensis"
        },
        {
            "category": "Plant species",
            "priority": "Boronia chartacea"
        },
        {
            "category": "Plant species",
            "priority": "Boronia deanei subsp. deanei"
        },
        {
            "category": "Plant species",
            "priority": "Boronia inflexa subsp. torringtonensis"
        },
        {
            "category": "Plant species",
            "priority": "Boronia subulifolia"
        },
        {
            "category": "Plant species",
            "priority": "Bossiaea arcuata"
        },
        {
            "category": "Plant species",
            "priority": "Bossiaea fragrans"
        },
        {
            "category": "Plant species",
            "priority": "Brachyscome brownii"
        },
        {
            "category": "Plant species",
            "priority": "Bulbophyllum weinthalii subsp. weinthalii"
        },
        {
            "category": "Plant species",
            "priority": "Bursaria calcicola"
        },
        {
            "category": "Plant species",
            "priority": "Caladenia oreophila"
        },
        {
            "category": "Plant species",
            "priority": "Caladenia osmera"
        },
        {
            "category": "Plant species",
            "priority": "Callistemon sp. Waratah trig (J.B.Williams NE85940)"
        },
        {
            "category": "Plant species",
            "priority": "Cassinia heleniae"
        },
        {
            "category": "Plant species",
            "priority": "Cassinia theodorii"
        },
        {
            "category": "Plant species",
            "priority": "Cassytha phaeolasia"
        },
        {
            "category": "Plant species",
            "priority": "Choretrum spicatum subsp. spicatum"
        },
        {
            "category": "Plant species",
            "priority": "Chrysocephalum apiculatum subsp. stoloniferum"
        },
        {
            "category": "Plant species",
            "priority": "Coronidium kaputaricum"
        },
        {
            "category": "Plant species",
            "priority": "Cryptandra speciosa"
        },
        {
            "category": "Plant species",
            "priority": "Cyperus aquatilis"
        },
        {
            "category": "Plant species",
            "priority": "Cyphanthera scabrella"
        },
        {
            "category": "Plant species",
            "priority": "Darwinia briggsiae"
        },
        {
            "category": "Plant species",
            "priority": "Darwinia fascicularis subsp. oligantha"
        },
        {
            "category": "Plant species",
            "priority": "Darwinia leiostyla subsp. Upland (W.Greuter 23111)"
        },
        {
            "category": "Plant species",
            "priority": "Darwinia taxifolia"
        },
        {
            "category": "Plant species",
            "priority": "Darwinia taxifolia subsp. macrolaena"
        },
        {
            "category": "Plant species",
            "priority": "Darwinia taxifolia subsp. taxifolia"
        },
        {
            "category": "Plant species",
            "priority": "Daviesia nova-anglica"
        },
        {
            "category": "Plant species",
            "priority": "Daviesia oppositifolia"
        },
        {
            "category": "Plant species",
            "priority": "Daviesia pseudaphylla"
        },
        {
            "category": "Plant species",
            "priority": "Daviesia suaveolens"
        },
        {
            "category": "Plant species",
            "priority": "Deyeuxia reflexa"
        },
        {
            "category": "Plant species",
            "priority": "Dillwynia acicularis"
        },
        {
            "category": "Plant species",
            "priority": "Dillwynia brunioides"
        },
        {
            "category": "Plant species",
            "priority": "Dillwynia crispii"
        },
        {
            "category": "Plant species",
            "priority": "Dillwynia rupestris"
        },
        {
            "category": "Plant species",
            "priority": "Dillwynia stipulifera"
        },
        {
            "category": "Plant species",
            "priority": "Diuris eborensis"
        },
        {
            "category": "Plant species",
            "priority": "Epacris hamiltonii"
        },
        {
            "category": "Plant species",
            "priority": "Epacris pilosa"
        },
        {
            "category": "Plant species",
            "priority": "Epacris purpurascens var. onosmiflora"
        },
        {
            "category": "Plant species",
            "priority": "Epacris rigida"
        },
        {
            "category": "Plant species",
            "priority": "Epacris sprengelioides"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus insularis"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus insularis subsp. continentalis"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus olida"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus redimiculifera"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus scopulorum"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus sp. Howes Swamp Creek (M.Doherty 26)"
        },
        {
            "category": "Plant species",
            "priority": "Eucalyptus volcanica"
        },
        {
            "category": "Plant species",
            "priority": "Euphrasia arguta"
        },
        {
            "category": "Plant species",
            "priority": "Galium roddii"
        },
        {
            "category": "Plant species",
            "priority": "Gastrolobium mondurup"
        },
        {
            "category": "Plant species",
            "priority": "Gastrolobium vestitum"
        },
        {
            "category": "Plant species",
            "priority": "Genoplesium superbum"
        },
        {
            "category": "Plant species",
            "priority": "Gentianella muelleriana subsp. jingerensis"
        },
        {
            "category": "Plant species",
            "priority": "Gentianella sylvicola"
        },
        {
            "category": "Plant species",
            "priority": "Geranium sessiliflorum"
        },
        {
            "category": "Plant species",
            "priority": "Gingidia algida"
        },
        {
            "category": "Plant species",
            "priority": "Gompholobium uncinatum"
        },
        {
            "category": "Plant species",
            "priority": "Gonocarpus hirtus"
        },
        {
            "category": "Plant species",
            "priority": "Goodenia glomerata"
        },
        {
            "category": "Plant species",
            "priority": "Goodenia heterophylla subsp. montana"
        },
        {
            "category": "Plant species",
            "priority": "Goodenia rostrivalvis"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea acerata"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea aspleniifolia"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea baueri subsp. asperula"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea buxifolia subsp. ecorniculata"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea epicroca"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea imberbis"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea irrasa subsp. didymochiton"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea irrasa subsp. irrasa"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea juniperina subsp. villosa"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea kedumbensis"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea mollis"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea obtusiflora ssp"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea oxyantha"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea oxyantha subsp. ecarinata"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea scortechinii subsp. sarmentosa"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea sp. Gillingarra (R.J.Cranfield 4087)"
        },
        {
            "category": "Plant species",
            "priority": "Gyrostemon thesioides"
        },
        {
            "category": "Plant species",
            "priority": "Hakea ambigua"
        },
        {
            "category": "Plant species",
            "priority": "Hakea constablei"
        },
        {
            "category": "Plant species",
            "priority": "Hakea macrorrhyncha"
        },
        {
            "category": "Plant species",
            "priority": "Hakea pachyphylla"
        },
        {
            "category": "Plant species",
            "priority": "Haloragodendron gibsonii"
        },
        {
            "category": "Plant species",
            "priority": "Haloragodendron lucasii"
        },
        {
            "category": "Plant species",
            "priority": "Hemigenia tenelliflora"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia acaulothrix"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia circinata"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia cistiflora subsp. quadristaminea"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia coloensis"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia ericifolia"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia glebosa subsp. oblonga"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia monticola"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia porcata"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia praemorsa"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia puberula"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia rhynchocalyx"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia saligna"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia scandens var. glabra"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia singularis"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia sp. Bankstown"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia spathulata subsp. spathulata"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia villosa"
        },
        {
            "category": "Plant species",
            "priority": "Hovea pedunculata"
        },
        {
            "category": "Plant species",
            "priority": "Hymenophyllum pumilum"
        },
        {
            "category": "Plant species",
            "priority": "Juncus laeviusculus"
        },
        {
            "category": "Plant species",
            "priority": "Kardomia odontocalyx"
        },
        {
            "category": "Plant species",
            "priority": "Kardomia prominens"
        },
        {
            "category": "Plant species",
            "priority": "Kunzea aristulata"
        },
        {
            "category": "Plant species",
            "priority": "Kunzea juniperoides subsp. pernervosa"
        },
        {
            "category": "Plant species",
            "priority": "Kunzea sp. Scrubby form (K.R.Thiele 445)"
        },
        {
            "category": "Plant species",
            "priority": "Kunzea sp. Tree form (J.B.Williams NE7973)"
        },
        {
            "category": "Plant species",
            "priority": "Lasiopetalum joyceae"
        },
        {
            "category": "Plant species",
            "priority": "Laxmannia grandiflora subsp. brendae"
        },
        {
            "category": "Plant species",
            "priority": "Leionema ceratogynum"
        },
        {
            "category": "Plant species",
            "priority": "Leionema coxii"
        },
        {
            "category": "Plant species",
            "priority": "Leionema lachnaeoides "
        },
        {
            "category": "Plant species",
            "priority": "Leionema lamprophyllum subsp. orbiculare"
        },
        {
            "category": "Plant species",
            "priority": "Leionema scopulinum"
        },
        {
            "category": "Plant species",
            "priority": "Lenwebbia sp. Main Range (P.R.Sharpe+ 4877)"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum barneyense"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum benwellii"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum blakelyi"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum crassifolium"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum deuense"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum macrocarpum"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum namadgiense"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum petraeum"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum spectabile"
        },
        {
            "category": "Plant species",
            "priority": "Leptospermum subglabratum"
        },
        {
            "category": "Plant species",
            "priority": "Lepyrodia oligocolea"
        },
        {
            "category": "Plant species",
            "priority": "Leucochrysum graminifolium"
        },
        {
            "category": "Plant species",
            "priority": "Leucopogon cryptanthus"
        },
        {
            "category": "Plant species",
            "priority": "Leucopogon psilopus"
        },
        {
            "category": "Plant species",
            "priority": "Lomandra confertifolia subsp. leptostachya"
        },
        {
            "category": "Plant species",
            "priority": "Luzula flaccida subsp. Long Anther (K.L.Wilson 828 et al.)"
        },
        {
            "category": "Plant species",
            "priority": "Macrozamia montana"
        },
        {
            "category": "Plant species",
            "priority": "Microlaena stipoides var. breviseta"
        },
        {
            "category": "Plant species",
            "priority": "Mirbelia confertiflora"
        },
        {
            "category": "Plant species",
            "priority": "Myoporum bateae"
        },
        {
            "category": "Plant species",
            "priority": "Nematolepis elliptica"
        },
        {
            "category": "Plant species",
            "priority": "Ochrosperma oligomerum"
        },
        {
            "category": "Plant species",
            "priority": "Olearia burgessii"
        },
        {
            "category": "Plant species",
            "priority": "Olearia covenyi"
        },
        {
            "category": "Plant species",
            "priority": "Olearia oliganthema"
        },
        {
            "category": "Plant species",
            "priority": "Olearia rugosa subsp. angustifolia"
        },
        {
            "category": "Plant species",
            "priority": "Olearia rugosa subsp. distalilobata"
        },
        {
            "category": "Plant species",
            "priority": "Olearia sp. Henry River (J.B.Williams 21/Oct/1966)"
        },
        {
            "category": "Plant species",
            "priority": "Olearia sp. rhizomatica (I.R.Telford 11549)"
        },
        {
            "category": "Plant species",
            "priority": "Olearia stenophylla"
        },
        {
            "category": "Plant species",
            "priority": "Ozothamnus cuneifolius"
        },
        {
            "category": "Plant species",
            "priority": "Pentachondra dehiscens"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia brevifolia"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia chamaepitys"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia hindii"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia mollis subsp. budawangensis"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia mollis subsp. leptophylla"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia mollis subsp. mollis"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia oblongata"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia oleoides"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia procumbens"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia recedens"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia rufa"
        },
        {
            "category": "Plant species",
            "priority": "Persoonia terminalis subsp. terminalis"
        },
        {
            "category": "Plant species",
            "priority": "Phebalium glandulosum subsp. riparium"
        },
        {
            "category": "Plant species",
            "priority": "Philotheca obovalis"
        },
        {
            "category": "Plant species",
            "priority": "Philotheca scabra subsp. latifolia"
        },
        {
            "category": "Plant species",
            "priority": "Pimelea bracteata"
        },
        {
            "category": "Plant species",
            "priority": "Pimelea cremnophila"
        },
        {
            "category": "Plant species",
            "priority": "Pimelea umbratica"
        },
        {
            "category": "Plant species",
            "priority": "Plectranthus sp. Torrington (C.E.Nano 460)"
        },
        {
            "category": "Plant species",
            "priority": "Podolobium aestivum"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris buchanensis"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris gilmourii var. gilmourii"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris helianthemifolia"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris ligustrina subsp. latifolia"
        },
        {
            "category": "Plant species",
            "priority": "Pomaderris oblongifolia"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum asinantum"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum fuscum"
        },
        {
            "category": "Plant species",
            "priority": "Prasophyllum sp. Majors Creek (Jones 11084)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera hindii"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera porcata"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera saxicola var. major"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera saxicola var. montana"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera sejuncta"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera sp. Mt Kaputar (W.Schofield NE92414)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera sp. Rowleys Creek (L.M.Copeland 4288)"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera stenophylla"
        },
        {
            "category": "Plant species",
            "priority": "Prostanthera tallowa"
        },
        {
            "category": "Plant species",
            "priority": "Pseudanthus pauciflorus subsp. pauciflorus"
        },
        {
            "category": "Plant species",
            "priority": "Pterostylis crebra"
        },
        {
            "category": "Plant species",
            "priority": "Pterostylis scapula"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea pycnocephala"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea rodwayi"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea sp. Olinda"
        },
        {
            "category": "Plant species",
            "priority": "Pultenaea tarik"
        },
        {
            "category": "Plant species",
            "priority": "Sannantha whitei"
        },
        {
            "category": "Plant species",
            "priority": "Scaevola sp. Mt Ernest (S.T.Blake 4333)"
        },
        {
            "category": "Plant species",
            "priority": "Schoenus evansianus"
        },
        {
            "category": "Plant species",
            "priority": "Senecio scabrellus"
        },
        {
            "category": "Plant species",
            "priority": "Solanum armourense"
        },
        {
            "category": "Plant species",
            "priority": "Solanum curvicuspe"
        },
        {
            "category": "Plant species",
            "priority": "Spyridium burragorang"
        },
        {
            "category": "Plant species",
            "priority": "Styphelia psiloclada"
        },
        {
            "category": "Plant species",
            "priority": "Thelymitra grandiflora"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia obtusibracteata"
        },
        {
            "category": "Plant species",
            "priority": "Hibbertia empertrifolia subsp. radians"
        },
        {
            "category": "Plant species",
            "priority": "Grevillea lavandulcea subsp. rogersii"
        },
        {
            "category": "Plant species",
            "priority": "Cardamine paucijuga"
        },
        {
            "category": "Plant species",
            "priority": "Brachyloma erioicdes ssp. Bicolor"
        },
        {
            "category": "Plant species",
            "priority": "Boronia parvifolia"
        },
        {
            "category": "Plant species",
            "priority": "Asterolasia phebalioides"
        },
        {
            "category": "Plant species",
            "priority": "Allittia uliginosa"
        },
        {
            "category": "Plant species",
            "priority": "Adenanthos macropodianus"
        },
        {
            "category": "Plant species",
            "priority": "Symphionema montanum"
        },
        {
            "category": "Plant species",
            "priority": "Tetramolopium vagans"
        },
        {
            "category": "Plant species",
            "priority": "Tetratheca rupicola"
        },
        {
            "category": "Plant species",
            "priority": "Tetratheca sp. Kent River (B.G.Hammersley 1791)"
        },
        {
            "category": "Plant species",
            "priority": "Thismia clavarioides"
        },
        {
            "category": "Plant species",
            "priority": "Trachymene saniculifolia"
        },
        {
            "category": "Plant species",
            "priority": "Velleia perfoliata"
        },
        {
            "category": "Plant species",
            "priority": "Veronica arcuata"
        },
        {
            "category": "Plant species",
            "priority": "Veronica brownii"
        },
        {
            "category": "Plant species",
            "priority": "Veronica lithophila"
        },
        {
            "category": "Plant species",
            "priority": "Viola improcera"
        },
        {
            "category": "Plant species",
            "priority": "Westringia saxatilis"
        },
        {
            "category": "Plant species",
            "priority": "Xerochrysum sp. Mt Merino (S.T.Blake 22869)"
        },
        {
            "category": "Plant species",
            "priority": "Xyris exilis"
        },
        {
            "category": "Plant species",
            "priority": "Zieria caducibracteata"
        },
        {
            "category": "Plant species",
            "priority": "Zieria hindii"
        },
        {
            "category": "Vertebrate species",
            "priority": "Menura alberti (Albert's Lyrebird)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pseudemoia cryodroma (Alpine Bog Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Cyclodomorphus praealtus (Alpine She-oak Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria verreauxii alpina (Alpine Tree Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Eulamprus kosciuskoi (Alpine Water Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Prototroctes maraena (Australian Grayling)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Ninox connivens (Barking Owl)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Zoothera lunulata halmaturina (Bassian Thrush (South Australian), Western Bassian Thrush)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Myuchelys georgesi (Bellinger River Snapping Turtle)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Wollumbinia belli (Bell's Turtle)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Monarcha melanopsis (Black-faced Monarch)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Macquaria sp. nov. 'hawkesbury taxon' (Blue Mountains Perch, Hawkesbury Perch)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria citropa (Blue Mountains Tree Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Eulamprus leuraensis (Blue Mountains Water Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria booroolongensis (Booroolong Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Hoplocephalus bungaroides (Broad-headed Snake)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Phyllurus platurus (Broad-tailed Gecko)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Mastacomys fuscus mordicus (Broad-toothed Rat)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Gerygone mouki (Brown Gerygone)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Petrogale penicillata (Brush-tailed Rock-wallaby)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Tursiops australis (Burrunan Dolphin)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias sp. 17 'Cann' (Cann River Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Maccullochella ikei  (Clarence River Cod, Eastern Freshwater Cod)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Dromaius novaehollandiae (Coastal Emu)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Ctenotus teniolatus (Copper-tailed Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Cyclopsitta diophthalma coxeni (Coxen’s Fig Parrot)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias mungadhan  (Dargo Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria daviesae (Davies' Tree Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pseudophryne dendyi (Dendy's Toadlet)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Morelia spilota (Diamond Python)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias aequipinnis  (East Gippsland Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Miniopterus schreibersii oceanensis (Eastern Bent-wing Bat)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Dasyornis brachypterus (Eastern Bristlebird)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Falsistrellus tasmaniensis (Eastern False Pipistrelle)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pezoporus wallicus (Eastern Ground Parrot)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Rhinolophus megaphyllus (Eastern Horseshoe Bat)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Cercartetus nanus (Eastern Pygmy-possum)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Cyclodomorphus michaeli (Eastern She-oak Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Acrobates pygmaeus (Feathertail Glider)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Petroica phoenicea (Flame Robin)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias rostratus  (Flathead Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Mixophyes fleayi (Fleay's barred frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxis olidus complex (Galaxis olidus complex)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Callocephalon fimbriatum (Gang-gang Cockatoo)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Wollumbinia georgesi (Georges' Snapping Turtle)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Mixophyes iteratus (Giant Barred Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Heleioporus australiacus (Giant Burrowing Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Gadopsis sp. (Gippsland Blackfish)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Intellagama lesueurii howittii (Gippsland Water Dragon)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Calyptorhynchus lathami (Glossy Black-Cockatoo)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pseudemoia rawlinsoni (Glossy Grass Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Phoniscus papuensis (Golden-tipped Bat)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Saltaurius wyberba (Granite Leaf-tailed Gecko)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Petauroides volans (Greater Glider)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria aurea (Green and Golden Bell Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pteropus poliocephalus (Grey-headed Flying-fox)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Liopholis guthega (Guthega Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pseudomys oralis (Hastings River Mouse, Koontoo)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pseudomugil mellis  (Honey Blue-eye)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Thinornis rubricollis (Hooded Plover)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Sminthopsis griseoventer aitkeni (Kangaroo Island Dunnart)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Tachyglossus aculeatus multiaculeatus (Kangaroo Island Echidna)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Calyptorhynchus lathami halmaturinus (Kangaroo Island Glossy Black-Cockatoo)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Stipiturus malachurus halmaturinus (Kangaroo Island Southern Emu-wren)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Psophodes nigrogularis lashmari (Kangaroo Island Western Whipbird)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Egernia roomi (Kaputar Rock Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Saltuarius kateae (Kate's Leaf-tail Gecko)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria dentata (Keferstein's Tree Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Phascolarctos cinereus (Koala)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Taudactylus pleione (Kroombit Tinker Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Varanus varius (Lace Monitor)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Chalinolobus dwyeri (Large-eared Pied Bat)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria nudidigita (Leaf Green Tree Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Meliphaga lewinii (Lewin's Honeyeater)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Miniopterus australis (Little Bent-winged Bat)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria littlejohni (Littlejohn's Tree Frog, Heath Frog, Large Brown Tree Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Lampropholis elongata (Long Sunskink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Potorous longipes (Long-footed Potoroo)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Perameles nasuta (Long-nosed Bandicoot)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Potorous tridactylus (Long-nosed Potoroo)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Macquaria australasica (Macquarie Perch)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Antechinus mimetes (Mainland Dusky Antechinus)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pezoporus wallicus wallicus (Mainland Ground Parrot)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Myuchelys purvisi (Manning River Helmeted Turtle)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Uperoleia martini (Martin's Toadlet)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Tyto novaehollandiae (Masked Owl)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias mcdowalli   (McDowall's Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Saltuarius moritzi (Moritz's Leaf-tailed Gecko)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias sp. 16 ('Moroka' Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Philoria kundagungan (Mountain Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias olidus (Mountain Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Burramys parvus (Mountain Pygmy-possum)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Drysdalia rhodogaster (Mustard-bellied Snake)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Nangura spinosa (Nangur Spiny Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria subglandulosa (New England treefrog, Glandular Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pseudomys novaehollandiae (New Holland Mouse, Pookila)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Mordacia praecox  (Non-parasitic Lamprey)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pseudophryne pengilleyi (Northern Corroboree Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Phyllurus kabikabi (Oakview Leaf-tailed Gecko)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Nannoperca oxleyana (Oxleyan Pygmy Perch)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Notomacropus parma (Parma Wallaby)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria piperata (Peppered Tree Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pycnoptilus floccosus (Pilotbird)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Ornithorhynchus anatinus (Platypus)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Ninox strenua (Powerful Owl)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Philoria pughi (Pugh's Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Paralucia spinifera (Purple Copper Butterfly)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Harrisoniascincus zia (Rainforest Cool-skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Philoria kundagungan (Red-and-yellow mountain frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Climacteris erythrops (Red-browed Treecreeper)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pseudophryne australis (Red-crowned Toadlet)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Calyptotis ruficauda (Red-tailed Calyptotis)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Acritoscincus platynotus (Red-throated Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Anthochaera phrygia (Regent Honeyeater)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Philoria richmondensis (Richmond Range Sphagnum Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Phyllurus caudiannulatus (Ringed Thin-tail Gecko)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Gadopsis sp. nov. 'Western Victoria' (River Blackfish (south western Victoria))"
        },
        {
            "category": "Vertebrate species",
            "priority": "Origma solitaria (Rockwarbler)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias terenasus (Roundsnout Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Atrichornis rufescens (Rufous Scrub-bird)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias brevissimus  (Short-tail Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Antechinus argentus (Silver-headed Antechinus)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pseudomys fumeus (Smoky Mouse, Konoom)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Tyto tenebricosa (Sooty Owl)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Calyptorhynchus lathami lathami (South-eastern Glossy Black-Cockatoo)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Isoodon obesulus (Southern Brown Bandicoot)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pseudophryne corroboree (Southern Corroboree Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Stipiturus malachurus (Southern Emu-wren)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Eulamprus tympanum (Southern Water-skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Philoria sphagnicola (Sphagnum Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Dasyurus maculatus maculatus (South-east mainland population) (Spot-tailed Quoll, Spotted-tail Quoll, Tiger Quoll)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Cinclosoma punctatum (Spotted Quail-thrush)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria spenceri (Spotted Tree Frog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias tantangara  (Stocky Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Calamanthus fuliginosus (Striated Fieldwren)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Mixophyes balbus (Stuttering Frog, Southern Barred Frog )"
        },
        {
            "category": "Vertebrate species",
            "priority": "Menura novaehollandiae (Superb Lyrebird)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Lissolepis coventryi (Swamp Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Coeranoscincus reticulatus (Three-toed Snake-tooth Skink)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Crinia tinnula (Wallum froglet)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria freycineti (Wallum rocketfrog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Litoria olongburensis (Wallum sedgefrog)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Pezoporus wallicus flaviventris (Western Ground Parrot)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Sminthopsis leucopus (White-footed Dunnart)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Galaxias sp. nov. 'yalmy' (Yalmy Galaxias)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Petaurus australis (Yellow-bellied Glider)"
        },
        {
            "category": "Vertebrate species",
            "priority": "Eulamprus heatwolei (Yellow-bellied Water Skink)"
        }

    ]
};
var outcomes = [
]


subprograms.forEach(function (subprogram){
    var program = db.program.find({name: subprogram});
    while(program.hasNext()){
        var p = program.next();
        if (p.name === "Strategic and Multi-regional - Koalas"){
            p.config = projectConfig.config
            p.priorities = projectConfig.priorities
            p.outcomes = outcomes;
        }
        db.program.save(p);
    }
});

// Moving 3 Koala projects to "Strategic and Multi-regional - Koalas"
var newRegionalSubprogram = "Strategic and Multi-regional - Koalas"
var newSubProg = db.program.find({name: newRegionalSubprogram}).next();
if (!newSubProg) {
    print("Sub-Program is not existing: " + newSubProg)
} else {
    //move projects
    var regionalProjects = ["Restoration of Koala Corridors in the Northern Rivers and SEQ","Protecting Koalas in the Armidale Areas of Regional Koala Significance (ARKS)","Koala habitat restoration in Border Ranges and Guula Ngurra National Park"]
    regionalProjects.forEach(function (regionalProject){
        var now = ISODate();
        var proj = db.project.find({name: regionalProject});
        if(proj.hasNext()){
            var p = proj.next();
            delete p.programId
            delete p.associatedSubProgram
            p.lastUpdated = now
            p.programId = newSubProg.programId
            p.associatedSubProgram = newSubProg.name
            db.project.save(p);
        }else{
            print("Project is not existing - " + regionalProject)
        }
    });
}

//Renaming the sub-program's names:
var currProgram1 = "Multiregional Species and Strategic Program"
var cp1 = db.program.find({name: currProgram1});
if(cp1.hasNext()){
    var p = cp1.next();
    delete p.name
    p.name = "Strategic and Multi-regional projects";
    p.lastUpdated = ISODate();
    db.program.save(p);
}else{
    print("Sub-program name already updated - " + currProgram1)
}

var currProgram2 = "Multiregional Species and Strategic Program - NRM"
var cp2 = db.program.find({name: currProgram2});
if(cp2.hasNext()){
    var p = cp2.next();
    delete p.name
    p.name = "Strategic and Multi-regional projects - NRM";
    p.lastUpdated = ISODate();
    db.program.save(p);
}else{
    print("Sub-program name already updated - " + currProgram2)
}

load('../../utils/audit.js');
let meritHubId = db.hub.findOne({urlPath: "merit"}).hubId;

let adminUserId = '1493';

let orgLookupResults = {
    "d1bee08a-b83f-496a-91d7-892b885f1b90": {
        "abn": "26873357348",
        "entityName": "Reef Catchments (Mackay Whitsunday Isaac) Limited",
        "abnStatus": "Active",
        "businessNames": ["Mackay Whitsunday Isaac Healthy Rivers to Reef Partnership"],
        "state": "QLD",
        "postcode": 4740,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "ead15dea-c4a1-4751-b003-468e520bc973": {
        "abn": "30802469401",
        "entityName": "FITZROY BASIN ASSOCIATION LIMITED",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4700,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "f59fd4aa-253d-404b-bd66-ddad0f68756e": {
        "abn": "15144005229",
        "entityName": "Burnett Mary Regional Group For Natural Resource Management Ltd",
        "abnStatus": "Active",
        "businessNames": ["ECOVERY"],
        "state": "QLD",
        "postcode": 4670,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "f28a5430-b849-4408-bc56-1cc9f8b2844f": {
        "abn": "18101770601",
        "entityName": "NQ DRY TROPICS LTD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4810,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "c3336327-02ee-4f8c-b30b-771f68d5cb03": {
        "abn": "52624459784",
        "entityName": "TERRITORY NATURAL RESOURCE MANAGEMENT INCORPORATED",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NT",
        "postcode": 801,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "419daa65-d5d1-418c-b4ed-3dc290bd9710": {
        "abn": "38323082163",
        "entityName": "DESERT CHANNELS QUEENSLAND LTD",
        "abnStatus": "Active",
        "businessNames": ["DC Foundation"],
        "state": "QLD",
        "postcode": 4730,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "84e78d51-ae51-4503-b0ce-b852b050d915": {
        "abn": "94106450355",
        "entityName": "NORTHERN GULF RESOURCE MANAGEMENT GROUP LTD",
        "abnStatus": "Active",
        "businessNames": ["Gulf Savannah Future Fund", "GULF SAVANNAH NRM", "BUSH BUSINESS FNQ"],
        "state": "QLD",
        "postcode": 4871,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "bdc89276-1d5c-46b2-af37-fc896308578a": {
        "abn": "15441877135",
        "entityName": "NORTHERN AGRICULTURAL CATCHMENTS COUNCIL INCORPORATED",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "WA",
        "postcode": 6530,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "83242356-b5ff-4172-8ce6-6ee345d1cccf": {
        "abn": "60355974029",
        "entityName": "CORANGAMITE CATCHMENT MANAGEMENT AUTHORITY",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3250,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "6e2b80f4-0660-4ed1-8414-e329e16b081a": {
        "abn": "53229361440",
        "entityName": "NORTH EAST CATCHMENT MANAGEMENT AUTHORITY",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3690,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "2c7a21c8-b431-43e2-969f-631eaf9b9b71": {
        "abn": "89184039725",
        "entityName": "GOULBURN BROKEN CATCHMENT MANAGEMENT AUTHORITY",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3630,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "0a23c131-f508-4ee7-bea4-291aba1f52e2": {
        "abn": "53032039445",
        "entityName": "Rangelands NRM Co-ordinating Group (Inc.)",
        "abnStatus": "Active",
        "businessNames": ["NATURAL RESOURCE MANAGEMENT AUSTRALIA", "RANGELANDS NRM", "NRM WA", "Rangelands NRM Western Australia", "Rangelands NRM WA"],
        "state": "WA",
        "postcode": 6153,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "199013fc-62c9-4b18-b1d0-12afb357cd78": {
        "abn": "55218240014",
        "entityName": "GLENELG - HOPKINS CATCHMENT MANAGEMENT AUTHORITY",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3300,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "d693dbef-2d94-4caa-a31d-29c5d6eaf520": {
        "abn": "15030795778",
        "entityName": "SOUTHERN GULF NRM LTD",
        "abnStatus": "Active",
        "businessNames": ["Southern Gulf NRM"],
        "state": "QLD",
        "postcode": 4825,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "026b6850-1d4e-4197-9289-58f6fc6dcee2": {
        "abn": "73937058422",
        "entityName": "NORTH CENTRAL CATCHMENT MANAGEMENT AUTHORITY",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3551,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "fd6f2c9d-9531-4302-868a-1276a1adcd94": {
        "abn": "43781945884",
        "entityName": "SOUTH COAST NATURAL RESOURCE MANAGEMENT INC",
        "abnStatus": "Active",
        "businessNames": ["Biosecurity Australia"],
        "state": "WA",
        "postcode": 6330,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "cbdee359-e5f3-455f-b9fe-82a8f4018195": {
        "abn": "78053639115",
        "entityName": "BUSH HERITAGE AUSTRALIA",
        "abnStatus": "Active",
        "businessNames": ["Hamelin Station Stay", "BUSH HERITAGE"],
        "state": "VIC",
        "postcode": 3008,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "2c539bfe-1ed2-44f4-b305-e29cba30f53e": {
        "abn": "27811602364",
        "entityName": "MALLEE CATCHMENT MANAGEMENT AUTHORITY",
        "abnStatus": "Active",
        "businessNames": ["Mallee Catchment Management Authority"],
        "state": "VIC",
        "postcode": 3498,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "390e9461-b68f-4628-a172-d34ebf7d72c7": {
        "abn": "61661518664",
        "entityName": "WHEATBELT NATURAL RESOURCE MANAGEMENT INCORPORATED",
        "abnStatus": "Active",
        "businessNames": ["RED CARD FOR RABBITS AND FOXES"],
        "state": "WA",
        "postcode": 6401,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "537a5735-d61c-4b9b-bfeb-25ca414ebc24": {
        "abn": "53106385899",
        "entityName": "FNQ NRM LTD",
        "abnStatus": "Active",
        "businessNames": ["TERRAIN NATURAL RESOURCE MANAGEMENT"],
        "state": "QLD",
        "postcode": 4860,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "bc371753-b6e4-449a-8e1d-80a0eab4be64": {
        "abn": "88062514481",
        "entityName": "WEST GIPPSLAND CATCHMENT MANAGEMENT AUTHORITY",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3844,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "e3b8bea1-1804-4404-937c-0d39b5ad190a": {
        "abn": "57155285807",
        "entityName": "Torres Strait Regional Authority",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4875,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "5d01a7b0-6e7e-4bd2-ae2c-b590a0d8b4a4": {
        "abn": "86724656359",
        "entityName": "South West Catchments Council",
        "abnStatus": "Active",
        "businessNames": ["SOUTH WEST NRM"],
        "state": "WA",
        "postcode": 6230,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "a496d705-de39-40d4-8772-d37caede59ef": {
        "abn": "55279164790",
        "entityName": "CRADLE COAST AUTHORITY",
        "abnStatus": "Active",
        "businessNames": ["CRADLE COAST AUTHORITY"],
        "state": "TAS",
        "postcode": 7320,
        "entityType": "LGE",
        "entityTypeName": "Local Government Entity"
    },
    "dd674ab3-0b28-4fba-acab-357242b884e6": {
        "abn": "89146770167",
        "entityName": "CAPE YORK NATURAL RESOURCE MANAGEMENT LTD.",
        "abnStatus": "Active",
        "businessNames": ["Cape York NRM", "Cape York Natural Resource Management"],
        "state": "QLD",
        "postcode": 4883,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "4d56ff9c-fb6f-4647-b6e5-4873873edd46": {
        "abn": "13565953466",
        "entityName": "PERTH REGION NRM INC",
        "abnStatus": "Active",
        "businessNames": ["ReWild WA", "Natural Capital Restoration Services", "NATURAL CAPITAL MANAGEMENT SERVICES", "RegenWA Collective", "RegenWA", "ReWild Perth", "Living Landscapes WA", "Living Perth WA", "Perth NRM"],
        "state": "WA",
        "postcode": 6102,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "3201d911-5739-429f-ac03-1ca7cb246afc": {
        "abn": "83900830261",
        "entityName": "WIMMERA CATCHMENT AUTHORITY",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3400,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "6d58497f-4fd7-48e4-8c10-988939452bf8": {
        "abn": "86704088698",
        "entityName": "Southern Regional Natural Resource Management Association",
        "abnStatus": "Active",
        "businessNames": ["NRM SOUTH"],
        "state": "TAS",
        "postcode": 7000,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "18001b72-e3ad-4fc2-96fb-a49f9b329e27": {
        "abn": "57876455969",
        "entityName": "LOCAL LAND SERVICES",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2800,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "353869cd-28ef-44ab-9e0c-af0904db0384": {
        "abn": "77806505566",
        "entityName": "PEEL-HARVEY CATCHMENT COUNCIL INC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "WA",
        "postcode": 6210,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "6364c2a5-6055-4283-8b7e-864f907c739e": {
        "abn": "75149124774",
        "entityName": "BIRDLIFE AUSTRALIA",
        "abnStatus": "Active",
        "businessNames": ["Broome Bird Observatory", "BirdLife Eyre", "BirdLife Western Australia", "BIRDLIFE AUSTRALIA", "BIRDLIFE AUSTRALIA"],
        "state": "VIC",
        "postcode": 3053,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "24c1d77d-4b45-4998-87d2-f2572f0eb447": {
        "abn": "57001594074",
        "entityName": "WORLD WIDE FUND FOR NATURE AUSTRALIA",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2000,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "71ea20cd-6f5d-41cd-8ce6-d0016b7e2781": {
        "abn": "86015680466",
        "entityName": "Northern Tasmanian Natural Resource Management Association Inc.",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "TAS",
        "postcode": 7250,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "5ffb1d41-ffc3-4122-980b-7dde518da858": {
        "abn": "34165571089",
        "entityName": "SECOND NATURE CONSERVANCY",
        "abnStatus": "Active",
        "businessNames": ["SECOND NATURE CONSERVANCY", "MOUNT BARKER COMMUNITY NURSERY"],
        "state": "SA",
        "postcode": 5255,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "ad8a6bc4-ef05-4b04-acb6-92e310fb7037": {
        "abn": "36600553934",
        "entityName": "ROYAL BOTANIC GARDENS BOARD",
        "abnStatus": "Active",
        "businessNames": ["Royal Botanic Gardens Victoria"],
        "state": "VIC",
        "postcode": 3004,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "68b6c455-a0a8-4773-ad69-73980a623525": {
        "abn": "69561995226",
        "entityName": "LANDCARE VICTORIA INC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3000,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "060592a4-5baf-4ad4-931a-13e97fe55290": {
        "abn": "38052249024",
        "entityName": "DEPARTMENT OF BIODIVERSITY CONSERVATION AND ATTRACTIONS",
        "abnStatus": "Active",
        "businessNames": ["Kalbarri Skywalk", "Karijini Visitor Centre", "MUNDA BIDDI TRAIL", "Department of Biodiversity Conservation and Attractions", "Conservation and Land Management Executive Body", "Yanchep National Park", "PERTH HILLS CENTRE", "NEARER TO NATURE", "BIBBULMUN TRACK", "CAPE TO CAPE TRACK", "PINNACLES DESERT DISCOVERY", "SHOALWATER ISLANDS MARINE PARK", "W.A. NATURALLY", "WILDCARE"],
        "state": "WA",
        "postcode": 6151,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "0f8d3a4e-d852-468c-9c1b-87c834a49755": {
        "abn": "23917949584",
        "entityName": "The Trustee for Nature Glenelg Trust",
        "abnStatus": "Active",
        "businessNames": ["NGT Education", "Aquasave - Nature Glenelg Trust", "Nature Glenelg Trust", "NGT CONSULTING", "NGT CONSULTING"],
        "state": "VIC",
        "postcode": 3304,
        "entityType": "FXT",
        "entityTypeName": "Fixed Trust"
    },
    "6ec0cca7-ef44-4b70-b7cd-d9c1c97e218d": {
        "abn": "77005217283",
        "entityName": "DUNKELD PASTORAL CO. PTY. LTD.",
        "abnStatus": "Active",
        "businessNames": ["GRAMPIAN SANDSTONE", "MT STURGEON MERINO", "MT STURGEON COTTAGES", "ROYAL MAIL HOTEL DUNKELD"],
        "state": "VIC",
        "postcode": 3300,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    },
    "cda277ab-d63a-48b8-9e20-4670fe52aeed": {
        "abn": "73315096794",
        "entityName": "NOOSA AND DISTRICT LANDCARE GROUP INC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4568,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "e98610b0-a5fd-4c96-8887-a25dba3f8498": {
        "abn": "20220278016",
        "entityName": "Kangaroo Island Land for Wildlife (KI LFW) Association Incorporated",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5223,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "93c7482a-03b0-4d7d-82c4-62dde0c3c67c": {
        "abn": "76642201841",
        "entityName": "EYRE PENINSULA LANDSCAPE BOARD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5606,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "a1bd9119-b615-4d3a-87c5-b412227d8ee1": {
        "abn": "24201100166",
        "entityName": "KANGAROO ISLAND LANDSCAPE BOARD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5223,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "cabed251-3963-4a9f-b3cd-90dfc3ed6889": {
        "abn": "40313872882",
        "entityName": "HILLS AND FLEURIEU LANDSCAPE BOARD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5251,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "6e097c5c-ca09-4cca-ae9f-d065f3069c86": {
        "abn": "78879031800",
        "entityName": "MURRAYLANDS AND RIVERLAND LANDSCAPE BOARD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5253,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "5bd961c7-4557-4f30-b124-f3d88c3e32d3": {
        "abn": "83450552896",
        "entityName": "NORTHERN AND YORKE LANDSCAPE BOARD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5453,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "298fa33d-5a5b-4563-86a4-f841a98beaeb": {
        "abn": "69489027866",
        "entityName": "SOUTH AUSTRALIAN ARID LANDS LANDSCAPE BOARD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5700,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "466e4c0e-a66b-43f6-9970-61917b429db1": {
        "abn": "34256534106",
        "entityName": "LIMESTONE COAST LANDSCAPE BOARD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5290,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "c266f529-a98b-4a97-b685-69885538dff6": {
        "abn": "65420303927",
        "entityName": "ALINYTJARA WILURARA LANDSCAPE BOARD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5000,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "35b123b3-e7d7-4cd1-a729-77b5ca568730": {
        "abn": "40627143202",
        "entityName": "SOUTHERN QUEENSLAND NATURAL RESOURCES MANAGEMENT LTD.",
        "abnStatus": "Active",
        "businessNames": ["Australian Centre for Agricultural Value Adding", "Southern Queensland Landscapes", "SQ Landscapes"],
        "state": "QLD",
        "postcode": 4350,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "79bdf3ed-00b2-4904-9810-d8d67ed4c9a9": {
        "abn": "20770707468",
        "entityName": "DEPARTMENT OF PLANNING HOUSING AND INFRASTRUCTURE",
        "abnStatus": "Active",
        "businessNames": ["Value NSW", "Valuer General NSW", "Heritage Stoneworks", "Department of Planning and Environment", "Dept of Industry", "Office of Local Government", "Cemeteries and Crematoria NSW", "Crown Reserves Improvement fund", "Dept of Trade & Investment", "Industry & Investment NSW", "Ministerial Corporation for Industry", "National Resource Management Investment", "NSW Office for Science & Medical Research", "Public Reserves Management Fund", "Office of the Valuer General"],
        "state": "NSW",
        "postcode": 2150,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "3892f4fe-e0e2-4435-8863-5cafdfd8ca69": {
        "abn": "61503876129",
        "entityName": "The Trustee for SOUTH ENDEAVOUR TRUST",
        "abnStatus": "Active",
        "businessNames": ["ENDEAVOUR CONSERVATION"],
        "state": "NSW",
        "postcode": 2022,
        "entityType": "FXT",
        "entityTypeName": "Fixed Trust"
    },
    "f28a56c4-3b24-439c-b54a-15b232cd5ea4": {
        "abn": "57195873179",
        "entityName": "UNIVERSITY OF NEW SOUTH WALES",
        "abnStatus": "Active",
        "businessNames": ["UNSW Beach Safety Research Group", "Innovation Central Sydney", "Centre for Future Health Systems", "Nuclear innovation centre", "UNSW Centre for nuclear innovation", "UNSW nuclear innovation centre", "Centre for Criminology, Law and Justice", "UNSW 3DXLab", "UNSW HSK Centre", "Centre for social impact", "Centre For Industrial Decarbonisation", "Institute For Industrial Decarbonisation", "FINTECH AI INNOVATION CONSORTIUM", "UNSW BUSINESS INSIGHTS INSTITUTE", "MENTEM", "CENTRE FOR THE FUTURE OF THE LEGAL PROFESSION", "INDIGENOUS LAW CENTRE", "AUSTRALIAN GRADUATE SCHOOL OF HEALTH", "CENTRE FOR CRITICAL DIGITAL INFRASTRUCTURE", "UNSW CITIES INSTITUTE", "INSTITUTE FOR CLIMATE RISK AND RESPONSE", "The UNSW Institute for Artificial Intelligence, Data Science and Machine Learning", "UNSW AI INSTITUTE", "ASEAN BUSINESS RESEARCH", "EPIWATCH", "UNSW ASEAN BUSINESS RESEARCH", "INSTITUTE FOR ARTIFICIAL INTELLIGENCE, DATA SCIENCE AND MACHINE LEARNING", "INSTITUTE FOR ARTIFICIAL INTELLIGENCE, MACHINE LEARNING AND DATA SCIENCE", "UNSW.AI", "UNSW RNA INSTITUTE", "RNA INSTITUTE", "KINGSFORD LEGAL CENTRE", "THE BIG ANXIETY RESEARCH CENTRE", "uDASH", "CENTRE FOR CHILDHOOD CANCER RESEARCH", "UNSW CENTRE FOR CHILDHOOD CANCER RESEARCH", "OCD.ORG.AU", "ANDREW & RENATA KALDOR CENTRE FOR INTERNATIONAL REFUGEE LAW", "AUSTRALIAN ENERGY INSTITUTE", "THE ELECTRIFYING LAB", "UNSW ENERGY INSTITUTE", "IFCYBER", "UNSW INSTITUTE FOR CYBER SECURITY", "MICROBIOME RESEARCH CENTRE", "EARTH AND SUSTAINABILITY SCIENCE RESEARCH CENTRE", "ESSRC", "AGORA CENTRE FOR MARKET DESIGN", "TYREE IHEALTHE", "DEMENTIA TV", "EMBODIMAP", "FEEL LAB", "FELT EXPERIENCE AND EMPATHY LAB", "NATIONAL INSTITUTE OF EXPERIMENTAL ARTS", "NIEA", "THE BIG ANXIETY", "AUSTRALIAN CARBON MATERIALS CENTRE", "GONSKI INSTITUTE", "GONSKI INSTITUTE FOR EDUCATION", "Tyree Foundation IHealthE", "TYREE FOUNDATION INSTITUTE OF HEALTH ENGINEERING", "AUSTRALIAN GRADUATE SCHOOL OF ENGINEERING", "AUSTRALIAN GRADUATE SCHOOL OF ENGINEERING AND TECHNOLOGY", "3DN", "DEPARTMENT OF DEVELOPMENTAL DISABILITY NEUROPSYCHIATRY", "IHEALTHE", "INSTITUTE OF HEALTH ENGINEERING", "UNOVA", "CASLEO", "CENTRE FOR ADVANCED SOLID AND LIQUID BASED ELECTRONICS AND OPTICS", "CENTRE FOR ADVANCED CARBON MATERIALS", "CLIMATE CHANGE RESEARCH CENTRE", "GLOBAL WATER INSTITUTE", "UNSW GLOBAL WATER INSTITUTE", "CCLJ", "CENTRE FOR CRIME, LAW AND JUSTICE", "MyIVFSuccess", "NATIONAL PERINATAL STATISTICS UNIT", "NATIONAL REPRODUCTIVE MEDICINE STATISTICS UNIT", "YourIVFSuccess", "rCITI", "RESEARCH CENTRE FOR INTEGRATED TRANSPORT INNOVATION", "INDUSTRIAL RELATIONS RESEARCH CENTRE", "IRRC", "CENTRE FOR SOCIAL RESEARCH IN HEALTH", "CSRH", "SOCIAL POLICY RESEARCH CENTRE", "CAPABILITY SYSTEMS CENTRE", "CENTRE FOR BIG DATA RESEARCH IN HEALTH", "E&ERC", "EVOLUTION & ECOLOGY RESEARCH CENTRE", "WATER RESEARCH CENTRE", "WATER RESEARCH LABORATORY", "CENTRE FOR ECOSYSTEM SCIENCE", "PLATYPUS CONSERVATION INITIATIVE", "DEFENCE RESEARCH INSTITUTE", "CPHCE", "CENTRE FOR PRIMARY HEALTH CARE AND EQUITY", "ChallENG", "THE ChallENG PROGRAM", "UNSW Canberra", "CHINA INTERNATIONAL BUSINESS & ECONOMIC LAW CENTRE", "CIBEL CENTRE", "HERC", "Hydrogen Energy Research Centre", "AUSTRALIAN CENTRE FOR NANOMEDICINE", "DESIGN NEXT", "CITY FUTURES RESEARCH CENTRE", "RECOMBINANT PRODUCTS FACILITY", "NATIONAL DRUG AND ALCOHOL RESEARCH CENTRE", "NDARC", "CENTRE FOR INFRASTRUCTURE ENGINEERING AND SAFETY", "CITY FUTURES", "CENTRE FOR HEALTHY BRAIN AGEING", "CHEBA", "Australian Centre for Astrobiology", "CENTRE FOR APPLIED ECONOMIC RESEARCH", "INSTITUTE OF GLOBAL FINANCE", "CENTRE FOR MARINE SCIENCE AND INNOVATION", "CMSI", "GERRIC", "GIFTED EDUCATION RESEARCH RESOURCE AND INFORMATION CENTRE", "MARK WAINWRIGHT ANALYTICAL CENTRE", "MWAC", "UNSW EDGE", "SECedu Institute", "SINGLE MOLECULE SCIENCE", "UNSW FATIGUE CLINIC", "Australia Ensemble", "UNSW CELLULAR GENOMICS FUTURES INSTITUTE", "UNSW DIGITAL GRID FUTURES INSTITUTE", "UNSW MATERIALS & MANUFACTURING FUTURES INSTITUTE", "UNSW AGEING FUTURES INSTITUTE", "Ramaciotti Centre for Genomics", "RESEARCH IMAGING NSW", "Disability Innovation Institute", "AGSM", "AUSTRALIAN HUMAN RIGHTS INSTITUTE", "AHRI", "UNISEARCH", "UNSW Sydney", "AUSTRALIAN GRADUATE SCHOOL OF MANAGEMENT", "SIMNA", "Social Impact Measurement Network Australia", "National Perinatal Epidemiology and Statistics Unit", "KANGA'S HOUSE CHILD CARE CENTRE", "AUSTRALIAN CENTRE FOR RESEARCH IN FINANCE", "AUSTRALIAN SCHOOL OF BUSINESS AT UNSW", "ATAX", "CENTRE FOR RESEARCH IN FINANCE", "University of New South Wales Bookshop"],
        "state": "NSW",
        "postcode": 2033,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "cfad9ca9-99df-4778-a17f-fe9203799f4f": {
        "abn": "15736576735",
        "entityName": "THE UNIVERSITY OF NEWCASTLE",
        "abnStatus": "Active",
        "businessNames": ["Newcastle Institute for Energy and Resources", "Bar on the Hill", "The G.T. Bar", "Watt Space", "KEY WORD SIGN AUSTRALIA"],
        "state": "NSW",
        "postcode": 2308,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "3d2a8d34-485c-49a4-9c7a-fecd771b4d2a": {
        "abn": "83791724622",
        "entityName": "QUEENSLAND UNIVERSITY OF TECHNOLOGY",
        "abnStatus": "Active",
        "businessNames": ["QUT College"],
        "state": "QLD",
        "postcode": 4000,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "d52e6bf3-efe2-4662-b128-6481a65e7b2e": {
        "abn": "51288461579",
        "entityName": "ENVITE INCORPORATED",
        "abnStatus": "Cancelled",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2480,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "b2979517-c9f8-43c0-96d0-e0f7b5c8f2e1": {
        "abn": "53014069881",
        "entityName": "WESTERN SYDNEY UNIVERSITY",
        "abnStatus": "Active",
        "businessNames": ["Western Sydney University Village, Bankstown Campus", "Western Sydney University Village, Campbelltown Campus", "Western Sydney University Village, Hawkesbury Campus", "Western Sydney University Village, Nirimba Campus", "Western Sydney University Village, Penrith Campus", "Fairfield Connect", "Launch Pad Technology Business Incubator", "Western Sydney University Psychology Clinics", "The Boilerhouse", "Yarramundi House", "Australia-China Chinese Medicine Centre", "NICM Health Research Institute", "Western Sydney Integrative Health", "Translational Health Research Institute", "Launch Pad Smart Business Centres", "University of Western Sydney", "Western Sydney Graduate School of Management", "Sydney Review of Books", "WERRINGTON PARK CORPORATE CENTRE", "SYDNEY GRADUATE SCHOOL OF HEALTH", "SYDNEY GRADUATE SCHOOL OF ENGINEERING", "SYDNEY GRADUATE SCHOOL", "SMEXCELLENCE"],
        "state": "NSW",
        "postcode": 2753,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "988aa02b-576f-4033-b371-b6082c05b5db": {
        "abn": "63008656513",
        "entityName": "LANDCARE AUSTRALIA LIMITED",
        "abnStatus": "Active",
        "businessNames": ["CARBONSMART"],
        "state": "NSW",
        "postcode": 2067,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "028f4067-f47d-4574-ae08-87572ff9812d": {
        "abn": "64804735113",
        "entityName": "LA TROBE UNIVERSITY",
        "abnStatus": "Active",
        "businessNames": ["LA TROBE COLLEGE AUSTRALIA", "La Trobe Melbourne College", "La Trobe Sydney College", "LTU College", "OzXFEL", "La Trobe Albury-Wodonga", "La Trobe Bendigo", "La Trobe Goulburn Valley", "La Trobe Mildura", "La Trobe Regional", "La Trobe Shepparton", "La Trobe Sunraysia", "La Trobe Wodonga", "La Trobe University Sydney Campus", "LA TROBE PATHWAYS", "LA TROBE INSTITUTE FOR MOLECULAR SCIENCE (LIMS)", "LTP.EDU.AU", "LA TROBE PROFESSIONAL", "LA TROBE LEARNING", "MELBOURNE TALK RADIO MTR", "LA TROBE SYDNEY", "LA TROBE MELBOURNE", "AUSTRALIAN CENTRE FOR EVIDENCE BASED AGED CARE (ACEBAC)"],
        "state": "VIC",
        "postcode": 3083,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "0168f54e-0fc4-4e1a-9012-3366271c1689": {
        "abn": "80129896671",
        "entityName": "TAREE INDIGENOUS DEVELOPMENT & ENTERPRISE LTD",
        "abnStatus": "Active",
        "businessNames": ["GILAYN-MANDAY AERIAL SERVICES", "TIDE"],
        "state": "NSW",
        "postcode": 2430,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "752d5048-c585-42ec-9939-5d046171e1ae": {
        "abn": "56721584203",
        "entityName": "DEAKIN UNIVERSITY",
        "abnStatus": "Active",
        "businessNames": ["HOPKINS RIVER CAFE", "DEAKIN JOURNAL OF TEACHING AND LEARNING FOR GRADUATE EMPLOYABILITY", "DEAKIN CLINICAL EXERCISE LEARNING CENTRE", "DEAKIN SPORT PERFORMANCE HUB", "WATERFRONT PANTRY", "SOLARSTORE AUSTRALIA", "PATENT PORTAL", "CYBER SECURITY RESEARCH AND INNOVATION", "CYBER SECURITY RESEARCH AND INNOVATION CENTRE", "DEAKIN COLLABORATIVE EYE CARE CLINIC", "FOOMOO", "DEAKIN LAW CLINIC", "DeakinCo.", "ManuFutures", "GEELONG CORPORATE CENTRE", "WAURN PONDS ESTATE", "THE DINER AT DEAKIN", "MARKET HALL GRAB & GO", "BARISTA BAR GRAB & GO", "FOOD 4 THOUGHT GRAB & GO", "BURWOOD CORNER CAFE", "BURWOOD CORPORATE CENTRE", "BURWOOD FUSION CAFE", "NATURAL 1 CAFE", "Carbon Nexus"],
        "state": "VIC",
        "postcode": 3220,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "630a4af3-83dd-40a9-8873-f694043d5aff": {
        "abn": "58096262494",
        "entityName": "CMORE PTY LTD",
        "abnStatus": "Active",
        "businessNames": ["ProofDocs", "TREETEC"],
        "state": "VIC",
        "postcode": 3159,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    },
    "fc369cec-86e9-49db-a217-be0c782e90c0": {
        "abn": "31432729493",
        "entityName": "ENVIRONMENT, PLANNING AND SUSTAINABLE DEVELOPMENT DIRECTORATE - DEPARTMENTAL",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "ACT",
        "postcode": 2602,
        "entityType": "TGE",
        "entityTypeName": "Territory Government Entity"
    },
    "a5921706-7f5c-4048-b5cb-ea56729dd1a1": {
        "abn": "22526891208",
        "entityName": "NATURE CONSERVATION TRUST OF NEW SOUTH WALES",
        "abnStatus": "Cancelled",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2480,
        "entityType": "UIE",
        "entityTypeName": "Other Unincorporated Entity"
    },
    "da4133eb-478a-44b8-9133-13881ac86c02": {
        "abn": "75792454315",
        "entityName": "THE UNIVERSITY OF NEW ENGLAND",
        "abnStatus": "Active",
        "businessNames": ["MANNA INSTITUTE", "Moree Institute of Higher Education", "Parramatta Institute of Higher Education", "Taree Institute of Higher Education", "Western Sydney Institute of Higher Education", "New England Institute of Higher Education", "Tamworth Institute of Higher Education", "UNE Institute of Higher Education"],
        "state": "NSW",
        "postcode": 2350,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "880862e9-587e-4f83-a0da-779ee44c1f25": {
        "abn": "14539880872",
        "entityName": "LEIJS, REMKO",
        "abnStatus": "Active",
        "businessNames": ["Ecosystem and Biological Services"],
        "state": "SA",
        "postcode": 5050,
        "entityType": "IND",
        "entityTypeName": "Individual/Sole Trader"
    },
    "79e955a0-3c54-446d-b327-0141b8fd0039": {
        "abn": "88320670472",
        "entityName": "Border Ranges-Richmond Valley Landcare Network Incorporated",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2474,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "59ee2a54-20f3-4745-8c22-84765a9c14b1": {
        "abn": "23326506063",
        "entityName": "MARSH, JESSICA RUTH",
        "abnStatus": "Active",
        "businessNames": ["Arthropoda Scientific"],
        "state": "SA",
        "postcode": 5221,
        "entityType": "IND",
        "entityTypeName": "Individual/Sole Trader"
    },
    "ff971419-1874-4884-9f53-43216a7e9186": {
        "abn": "58153442365",
        "entityName": "THE COUNCIL OF HEADS OF AUSTRALIAN BOTANIC GARDENS INCORPORATED",
        "abnStatus": "Active",
        "businessNames": ["AUSTRALIAN SEED BANK PARTNERSHIP"],
        "state": "ACT",
        "postcode": 2601,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "4743367f-eb32-4ad9-b84b-d56cc8634dda": {
        "abn": "44961208161",
        "entityName": "MID-COAST COUNCIL",
        "abnStatus": "Active",
        "businessNames": ["BARRINGTON COAST TOURISM", "MidCoast ASSIST", "Manning Entertainment Centre", "Manning Aquatic Leisure Centre", "Manning Regional Art Gallery", "Manning Valley Visitor Information Centre", "Mid Coast Council", "MidCoast Council", "Mid Coast Tourism", "MidCoast Tourism", "Mid-Coast Tourism", "Destination Mid Coast", "Destination MidCoast", "Destination Mid-Coast", "Tourism Mid Coast", "Tourism MidCoast", "Tourism Mid-Coast"],
        "state": "NSW",
        "postcode": 2430,
        "entityType": "LGE",
        "entityTypeName": "Local Government Entity"
    },
    "009b459c-8e91-45e7-8d2d-7cfa30ae39c3": {
        "abn": "98434926368",
        "entityName": "EAST GIPPSLAND LANDCARE NETWORK INCORPORATED",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3875,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "e552306f-2200-47fc-8a69-c5c2c7aca4a9": {
        "abn": "40538422811",
        "entityName": "THE NATURE CONSERVATION SOCIETY OF SA INC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5007,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "22a27d04-d2eb-4a8e-b736-347ba4185d6a": {
        "abn": "41995651524",
        "entityName": "SOUTHERN CROSS UNIVERSITY",
        "abnStatus": "Active",
        "businessNames": ["MANNA INSTITUTE", "Southern Cross Environmental Analytical Laboratory", "Southern Cross Analytical Research Laboratory", "RegenerativeAg Alliance", "Regenerative Agriculture Alliance", "EAL - Environmental Analysis Laboratory", "Environmental Analysis Laboratory", "Southern Cross Football Centre", "The Hotel School Gold Coast", "AUSTRALASIAN INSTITUTE OF HOTEL MANAGEMENT", "AUSTRALIAN INSTITUTE OF HOTEL MANAGEMENT", "THE HOTEL SCHOOL", "THE HOTEL SCHOOL MELBOURNE", "THE HOTEL SCHOOL, SYDNEY", "SOLITARY ISLANDS AQUARIUM", "NATIONAL MARINE SCIENCE CENTRE", "SOUTHERN CROSS UNIVERSITY HEALTH CLINIC"],
        "state": "NSW",
        "postcode": 2480,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "28b5fe5d-aab8-4857-a71f-4210a33069fb": {
        "abn": "26123867587",
        "entityName": "CESAR PTY. LTD.",
        "abnStatus": "Active",
        "businessNames": ["Cesar Australia", "CESAR"],
        "state": "VIC",
        "postcode": 3056,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    },
    "e3a71de2-1266-4740-afff-7fb66d94e7af": {
        "abn": "52234063906",
        "entityName": "AUSTRALIAN NATIONAL UNIVERSITY",
        "abnStatus": "Active",
        "businessNames": ["Astralis Instrumentation Consortium"],
        "state": "ACT",
        "postcode": 2601,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "21692a75-ac3e-48fc-b126-6623e6c614bc": {
        "abn": "97007529124",
        "entityName": "WILDERNESS SCHOOL LIMITED",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5081,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "1997bac2-6d77-44e4-a5c0-9bb5104091b3": {
        "abn": "81945386953",
        "entityName": "MELBOURNE WATER CORPORATION",
        "abnStatus": "Active",
        "businessNames": ["MELBOURNE WATER"],
        "state": "VIC",
        "postcode": 3008,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "d5735ec7-da73-452e-8c41-4dceb7d744c0": {
        "abn": "76889339564",
        "entityName": "WILSONS CREEK HUONBROOK LANDCARE INCORPORATED",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2482,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "cefc89ca-00e0-4b5f-90ce-f71c1afe1852": {
        "abn": "47539096184",
        "entityName": "Connecting Country (Mt Alexander Region) Inc.",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3450,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "b69c89bd-d518-4bac-bd4e-1d73aea29a1c": {
        "abn": "91510214244",
        "entityName": "FRIENDS OF SHOREBIRDS SE INCORPORATED",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5291,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "a0543c5e-2408-48cf-986f-d18852cd992c": {
        "abn": "20632257964",
        "entityName": "INDIGENOUS DESERT ALLIANCE LIMITED",
        "abnStatus": "Active",
        "businessNames": ["Indigenous Desert Alliance Foundation", "Indigenous Desert Foundation", "Healthy Country Credits", "Indigenous Desert Alliance"],
        "state": "WA",
        "postcode": 6005,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "47c55c67-438e-439d-973b-839a6bd8b96a": {
        "abn": "98008631981",
        "entityName": "THE SYDNEY AQUARIUM COMPANY PTY. LIMITED",
        "abnStatus": "Active",
        "businessNames": ["SEA LIFE SYDNEY AQUARIUM"],
        "state": "NSW",
        "postcode": 2000,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    },
    "be74c2e4-f1fb-482c-9f36-a0c60f0e293b": {
        "abn": "51417871203",
        "entityName": "AUSTRALIAN WILDLIFE ARK LIMITED",
        "abnStatus": "Active",
        "businessNames": ["Mongo Valley Wildlife Sanctuary", "Australian Quoll Ark", "Australian Quoll Conservation", "Devil Ark", "rewild Australia", "Aussie Wildlife Ark", "Koala Ark", "Western Ark"],
        "state": "NSW",
        "postcode": 2250,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "a10fede3-f1de-45af-9992-ea81e10def66": {
        "abn": "36068572556",
        "entityName": "AUSTRALIAN WILDLIFE CONSERVANCY",
        "abnStatus": "Active",
        "businessNames": ["Paruna Sanctuary", "EcoFire", "MARION DOWNS STATION", "MORNINGTON WILDERNESS CAMP", "SCOTIA SANCTUARY", "YOOKAMURRA SANCTUARY", "MORNINGTON STATION", "KARAKAMIA SANCTUARY"],
        "state": "WA",
        "postcode": 6008,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "03fdf2ca-3388-4df2-a1ff-1eb293a3c884": {
        "abn": "13136824392",
        "entityName": "Bass Coast Landcare Network Inc",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3991,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "773473cd-1788-46d4-a851-76397819ae96": {
        "abn": "49459776673",
        "entityName": "EAST GIPPSLAND CONSERVATION MANAGEMENT NETWORK",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3878,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "9a1ad13b-72f9-4129-8f12-618d84319e4b": {
        "abn": "70861480818",
        "entityName": "AUSTRALIAN NETWORK FOR PLANT CONSERVATION INC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "ACT",
        "postcode": 2601,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "17f1a11c-0b1e-4d7a-bd1b-ba8427fd7ef6": {
        "abn": "85106687736",
        "entityName": "The Wombat Foundation",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "TAS",
        "postcode": 7150,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "b27a4924-86aa-4ca3-9534-a8c0234bfa57": {
        "abn": "75191868479",
        "entityName": "GILBERT'S POTOROO ACTION GROUP INC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "WA",
        "postcode": 6330,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "fac1c13e-9720-45b7-8daa-47ca80d989b7": {
        "abn": "59096030385",
        "entityName": "ECOLOGICAL HORIZONS PTY LTD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5641,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    },
    "5d3dacac-0d12-406a-ba74-9e3d91d4e77e": {
        "abn": "29602568696",
        "entityName": "OZFISH UNLIMITED LIMITED",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2478,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "961a77e2-6571-492e-8d64-373e061c393d": {
        "abn": "67649417658",
        "entityName": "LANDSCAPE RECOVERY FOUNDATION LTD.",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "TAS",
        "postcode": 7000,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "55b6f41d-5f2d-4e01-82f2-14584c58939a": {
        "abn": "69094934586",
        "entityName": "GIDARJIL DEVELOPMENT CORPORATION LIMITED",
        "abnStatus": "Active",
        "businessNames": ["GIDARJIL WATER QUALITY LAB NYAMGIM GUNG", "MILBI CAFE", "CENTRAL QUEENSLAND LANGUAGE CENTRE", "MURRA WOLKA", "MURRA WOLKA CREATIONS", "Gidji Cafe", "Gidarjil Workforce", "GIDJIART"],
        "state": "QLD",
        "postcode": 4670,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "9624cb58-5ce6-408c-a47e-45045db913d3": {
        "abn": "97988369006",
        "entityName": "PULLEN PULLEN CATCHMENTS GROUP INC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4069,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "7fd30c2b-0de7-4a19-8342-74cda04a6752": {
        "abn": "50137010658",
        "entityName": "MURRAY DARLING WETLANDS WORKING GROUP LTD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2640,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "f87c592a-9a5e-4fcc-8818-cdaddc0592f0": {
        "abn": "44235565907",
        "entityName": "WILDLIFE PRESERVATION SOCIETY OF QUEENSLAND",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4101,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "d44d2f0c-d262-4e2a-b0af-b74dc8aa6cfd": {
        "abn": "83243328398",
        "entityName": "The Trustee for The Nature Conservancy Australia Trust",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4101,
        "entityType": "DIT",
        "entityTypeName": "Discretionary Investment Trust"
    },
    "789bc709-c7ab-4e10-a13c-a33cfa157141": {
        "abn": "21627796435",
        "entityName": "LOGAN CITY COUNCIL",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4114,
        "entityType": "LGE",
        "entityTypeName": "Local Government Entity"
    },
    "880bc3f8-bbf5-4799-9273-2fa064e41aa1": {
        "abn": "12128878142",
        "entityName": "Warddeken Land Management Limited",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NT",
        "postcode": 886,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "806442ac-9408-4c09-8cd2-24669209e844": {
        "abn": "22662547254",
        "entityName": "BELLINGER LANDCARE INC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2454,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "a76e48d0-f5aa-4b85-9d39-d278d9ab4bc2": {
        "abn": "52166526533",
        "entityName": "SOUTH GIPPSLAND LANDCARE NETWORK",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3953,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "6a4432f6-ca64-46d9-bc85-f2f000738892": {
        "abn": "85836591486",
        "entityName": "NATIONAL TRUST OF AUSTRALIA (QUEENSLAND) LIMITED",
        "abnStatus": "Active",
        "businessNames": ["SUPERBEE HONEYWORLD", "Currumbin Wildlife Hospital Foundation", "Currumbin Wildlife Sanctuary"],
        "state": "QLD",
        "postcode": 4223,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "cd3b5f63-86f6-4db1-821e-24b850ef29e3": {
        "abn": "41687119230",
        "entityName": "COMMONWEALTH SCIENTIFIC AND INDUSTRIAL RESEARCH ORGANISATION",
        "abnStatus": "Active",
        "businessNames": ["CSIRO", "CENTRE FOR LIVEABILITY REAL ESTATE", "DATA61"],
        "state": "ACT",
        "postcode": 2601,
        "entityType": "CGE",
        "entityTypeName": "Commonwealth Government Entity"
    },
    "98333a63-4be1-4a46-ad4c-b8332d2b7091": {
        "abn": "91115662989",
        "entityName": "HEALTHY LAND AND WATER LTD",
        "abnStatus": "Active",
        "businessNames": ["Queensland Fire and Biodiversity Consortium", "CARBON +"],
        "state": "QLD",
        "postcode": 4000,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "4e6a438b-8a47-4668-87fe-05786159e8b5": {
        "abn": "58259330901",
        "entityName": "Department of Natural Resources and Environment Tasmania",
        "abnStatus": "Active",
        "businessNames": ["Tasmanian Waste and Resource Recovery Board", "Recycle Rewards", "NRE Tas", "Department of Natural Resources and Environment", "Department of Natural Resources and Environment Tasmania", "Natural Resources and Environment", "NRE", "Natural Resources and Environment Tasmania", "Tasmania Parks and Wildlife Service", "Biosecurity Tasmania", "Three Capes Track", "Office of Racing Integrity", "Land Tasmania", "Fishwise", "DPIPWE", "Tas Fish Guide", "HERITAGE TASMANIA", "Department of Primary Industries Parks Water and Environment", "Aboriginal Heritage Tasmania (DPIPWE)", "TASMANIAN HERITAGE COUNCIL", "Analytical Services Tasmania", "Parks and Wildlife Service", "TASMAP", "FISHCARE TASMANIA"],
        "state": "TAS",
        "postcode": 7000,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "04959614-bdfe-4f79-b0d9-e1af3db1dd13": {
        "abn": "74851544037",
        "entityName": "THE ROYAL SOCIETY FOR THE PREVENTION OF CRUELTY TO ANIMALS (QUEENSLAND) LIMITED",
        "abnStatus": "Active",
        "businessNames": ["RSPCA QUEENSLAND SCHOOL FOR PETS", "RSPCA OP SHOPS", "RSPCA QUEENSLAND", "RSPCA QUEENSLAND BLACK CAT CAFE", "RSPCA QUEENSLAND OP SHOPS", "RSPCA QUEENSLAND PETS AT REST", "World for Pets"],
        "state": "QLD",
        "postcode": 4076,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "b4eaaf6d-9c52-408e-9125-36e92f5fcfe2": {
        "abn": "17266405424",
        "entityName": "ENVIRONS KIMBERLEY INCORPORATED",
        "abnStatus": "Active",
        "businessNames": ["WATTLESEED COLLECTIVE", "NATURE PROJECTS AUSTRALIA"],
        "state": "WA",
        "postcode": 6725,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "c23d36ed-2e4a-4b56-b807-fbff825b56ca": {
        "abn": "61616369313",
        "entityName": "MURDOCH UNIVERSITY",
        "abnStatus": "Active",
        "businessNames": ["SIFT WESTERN AUSTRALIA", "The Animal Hospital at Murdoch University", "Perth Business School", "Centre for Advanced Veterinary Education", "NEXUS THEATRE", "SCIENCE SUMMER SCHOOL OF WESTERN AUSTRALIA"],
        "state": "WA",
        "postcode": 6150,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "32613ec6-a80f-479c-94da-0c94b633a3ba": {
        "abn": "70877369988",
        "entityName": "Ngadju Conservation Aboriginal Corporation",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "WA",
        "postcode": 6443,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "a49d386b-29aa-445a-9bd8-6315f0a6902e": {
        "abn": "95826121536",
        "entityName": "Arafura Swamp Rangers Aboriginal Corporation",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NT",
        "postcode": 822,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "fae21e4f-0185-4875-90bf-cc372bf74efb": {
        "abn": "71979619393",
        "entityName": "CENTRAL LAND COUNCIL",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NT",
        "postcode": 870,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "c8c75130-03b6-471e-b45b-f39282811779": {
        "abn": "12949356885",
        "entityName": "GREAT BARRIER REEF MARINE PARK AUTHORITY",
        "abnStatus": "Active",
        "businessNames": ["Great Barrier Reef Aquarium"],
        "state": "QLD",
        "postcode": 4810,
        "entityType": "CGE",
        "entityTypeName": "Commonwealth Government Entity"
    },
    "dff6032d-2d07-429a-a0e5-d887d31bb937": {
        "abn": "57876455969",
        "entityName": "LOCAL LAND SERVICES",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2800,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "e7d4f7f4-7509-49f5-96ac-c5a7a67ff31e": {
        "abn": "57876455969",
        "entityName": "LOCAL LAND SERVICES",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2800,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "df445486-dcec-4e87-9bf8-47a5c85c0906": {
        "abn": "72411984201",
        "entityName": "EAST GIPPSLAND CATCHMENT MANAGEMENT AUTHORITY",
        "abnStatus": "Active",
        "businessNames": ["VIC CATCHMENTS", "CULTURE IN THE CATCHMENT TOURS"],
        "state": "VIC",
        "postcode": 3875,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "9b00bbcb-7055-44d5-b4f4-3cfeba9f9274": {
        "abn": "57876455969",
        "entityName": "LOCAL LAND SERVICES",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2800,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "37fbb2c3-baf6-4975-a7df-0ad5bfa40cc6": {
        "abn": "57876455969",
        "entityName": "LOCAL LAND SERVICES",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2800,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "87ea0fad-6587-4ad9-8cd8-5cb0c3dc2e47": {
        "abn": "13051694963",
        "entityName": "DIRECTOR OF NATIONAL PARKS",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "ACT",
        "postcode": 2600,
        "entityType": "CGE",
        "entityTypeName": "Commonwealth Government Entity"
    },
    "316ba939-8931-48ee-8375-4a8c9161b885": {
        "abn": "56327515336",
        "entityName": "NORTHERN LAND COUNCIL",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NT",
        "postcode": 800,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "5f1cdc91-42e8-4d3d-9c7c-90132899d69f": {
        "abn": "90719052204",
        "entityName": "DEPARTMENT OF ENERGY ENVIRONMENT AND CLIMATE ACTION",
        "abnStatus": "Active",
        "businessNames": ["VicGrid", "Office of the Commissioner for Environmental Sustainability", "Office of the Environmental Monitor", "Victorian Catchment Management Council", "Victorian Environmental Assessment Council (VEAC)", "GET INTO GENES", "AGRICULTURE VICTORIA", "DEECA", "Department of Energy, Environment and Climate Action", "Solar Victoria", "Department of Environment Land Water and Planning", "DELWP", "DEPARTMENT OF ENVIRONMENT AND PRIMARY INDUSTRIES", "DEPI"],
        "state": "VIC",
        "postcode": 3002,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "a6ddba0c-4e3f-4fee-bf15-9dd3e2a9dc19": {
        "abn": "27578976844",
        "entityName": "DEPARTMENT OF CLIMATE CHANGE, ENERGY, THE ENVIRONMENT AND WATER",
        "abnStatus": "Active",
        "businessNames": ["Energy, Climate Change & Sustainability", "Water Group DCCEEW", "Biodiversity, Conservation & Science", "Heritage NSW DCCEEW", "Fort Denison", "National Parks and Wildlife Service", "Water Administration Ministerial Corporation", "Manly Hydraulics Laboratory", "MHL"],
        "state": "NSW",
        "postcode": 2800,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "de0c316c-d460-4dab-8c8e-8dca4ef0e762": {
        "abn": "65542596200",
        "entityName": "Flinders University",
        "abnStatus": "Active",
        "businessNames": ["FLINDERS HEALTH SERVICE", "Flinders Institute for Mental Health and Wellbeing", "ARIIA", "Flinders Health and Medical Research Institute", "South Australian Academy of the Creative Arts", "South Australian Academy of the Arts", "Flinders Health2GO", "CARESEARCH", "Centre for Remote Health"],
        "state": "SA",
        "postcode": 5042,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "47ad3ae3-9298-4310-b237-8821c8d2536d": {
        "abn": "46640294485",
        "entityName": "DEPARTMENT OF ENVIRONMENT, SCIENCE AND INNOVATION",
        "abnStatus": "Active",
        "businessNames": ["BRAMWELL JUNCTION", "BRAMWELL STATION"],
        "state": "QLD",
        "postcode": 4000,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "8c3a7806-6d5e-4b60-97d7-b76ba495750e": {
        "abn": "37882817280",
        "entityName": "UNIVERSITY OF WESTERN AUSTRALIA",
        "abnStatus": "Active",
        "businessNames": ["EYE HEALTH CENTRE OF WESTERN AUSTRALIA", "UWA COLLEGE", "Astrofest", "WESTERN AUSTRALIAN MARINE SCIENCE INSTITUTION (WAMSI)", "ORAL HEALTH CENTRE OF WESTERN AUSTRALIA", "WA FRINGE FESTIVAL"],
        "state": "WA",
        "postcode": 6009,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "f0f0d6ca-2652-4fe6-b2ed-e5d196f30a1f": {
        "abn": "81633873422",
        "entityName": "UNIVERSITY OF CANBERRA",
        "abnStatus": "Active",
        "businessNames": ["Australian National Museum of Education", "UC Health Clinics", "87.8 UCFM Canberra's Alternative", "NATIONAL CENTRE FOR SOCIAL AND ECONOMIC MODELLING"],
        "state": "ACT",
        "postcode": 2617,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "a5e86f4e-553a-4144-b77c-cadbe60a3a0b": {
        "abn": "30764374782",
        "entityName": "UNIVERSITY OF TASMANIA",
        "abnStatus": "Active",
        "businessNames": ["TASMANIAN SCHOOL OF BUSINESS AND ECONOMICS", "The Red Lion Drum Corps"],
        "state": "TAS",
        "postcode": 7005,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "6d3a461c-5eb5-47c2-89f0-a3c6d62e6a67": {
        "abn": "19948325463",
        "entityName": "DEPARTMENT OF PRIMARY INDUSTRIES AND REGIONAL DEVELOPMENT",
        "abnStatus": "Active",
        "businessNames": ["NSW Public Works", "Soil Conservation Service", "Coal Innovation Fund", "Dept of Primary Industries", "Marine Parks Authority", "Murrumbidgee Rural Studies Centre", "Tocal College"],
        "state": "NSW",
        "postcode": 2800,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "4d837d62-9a2c-4b6c-ad86-6fd6e128ad84": {
        "abn": "34994775963",
        "entityName": "AusTurtle",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NT",
        "postcode": 830,
        "entityType": "UIE",
        "entityTypeName": "Other Unincorporated Entity"
    },
    "e5159107-1910-41db-9c2a-5aaffaaade34": {
        "abn": "37282729681",
        "entityName": "GIPPSLAND THREATENED SPECIES ACTION GROUP INC.",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3991,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "26b2ae5b-875f-4e51-b2c9-4a337f6057bc": {
        "abn": "50957582595",
        "entityName": "WORKWAYS AUSTRALIA LIMITED",
        "abnStatus": "Active",
        "businessNames": ["ENVITE ENVIRONMENT", "YOUTHWAYS"],
        "state": "VIC",
        "postcode": 3875,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "2acb0042-d327-42fb-acc9-0268b9ea422e": {
        "abn": "42174450880",
        "entityName": "TWEED LANDCARE INC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2486,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "73f245a7-b31e-4e1f-8fba-a1825ed576eb": {
        "abn": "14153577907",
        "entityName": "NATURE GLENELG PTY. LTD.",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3304,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    },
    "e94b8f1c-6ba7-454f-8740-b49feb4255c4": {
        "abn": "98781662491",
        "entityName": "CAPITAL WOODLAND AND WETLANDS CONSERVATION ASSOCIATION_INC",
        "abnStatus": "Active",
        "businessNames": ["Woodlands and Wetlands Trust"],
        "state": "ACT",
        "postcode": 2914,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "a616ca77-4591-4da7-8d4b-1da2bf210930": {
        "abn": "39887088737",
        "entityName": "Lockyer Uplands Catchments Inc",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4344,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "10ea1ada-ad01-428c-8458-956cfe1d6d15": {
        "abn": "45127050444",
        "entityName": "SOUTH ENDEAVOUR CONSERVATION PTY LIMITED",
        "abnStatus": "Cancelled",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2022,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    },
    "dd9d8003-99b2-46db-8b1d-7801ad846d98": {
        "abn": "82466887179",
        "entityName": "Conservation Partners Aust Ltd",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4885,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "e61fc8aa-1b1c-470d-8059-e96d027cd46f": {
        "abn": "43709397769",
        "entityName": "Gunaikurnai Land & Waters Aboriginal Corporation RNTBC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3909,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "65f6548a-c0ea-4e21-813c-683d216cd209": {
        "abn": "33280968043",
        "entityName": "LORD HOWE ISLAND BOARD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2898,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "763bb2f0-99a3-4ffe-8296-690541bd0dac": {
        "abn": "41733619876",
        "entityName": "TARONGA CONSERVATION SOCIETY AUSTRALIA",
        "abnStatus": "Active",
        "businessNames": ["TARONGA WILDLIFE HOSPITAL DUBBO", "TARONGA WILDLIFE HOSPITAL SYDNEY", "Twilight at Taronga", "TARONGA WESTERN PLAINS ZOO", "TARONGA TRAINING INSTITUTE", "TARONGA CONSERVATION SOCIETY AUSTRALIA", "FEARLESS AT TARONGA"],
        "state": "NSW",
        "postcode": 2088,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "98ff07a0-c4e5-427d-a356-ea24d57064f5": {
        "abn": "87054667051",
        "entityName": "TIWI RESOURCES PTY LTD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NT",
        "postcode": 812,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    },
    "c392a028-3484-4efd-8095-32ea8e3085d2": {
        "abn": "14011921883",
        "entityName": "YAMATJI MARLPA ABORIGINAL CORPORATION",
        "abnStatus": "Active",
        "businessNames": ["Knowledge Partnerships"],
        "state": "WA",
        "postcode": 6000,
        "entityType": "UIE",
        "entityTypeName": "Other Unincorporated Entity"
    },
    "b290cb31-6dbb-4fdc-8c38-e5a9ac14a068": {
        "abn": "96913959053",
        "entityName": "ZOOLOGICAL PARKS AND GARDENS BOARD",
        "abnStatus": "Active",
        "businessNames": ["Australian Platypus Conservation Centre", "Fauna Park Cafe", "Kyabram Fauna Park", "Healesville Sanctuary", "Werribee Open Range Zoo", "SIR COLIN MACKENZIE SANCTUARY", "FRIENDS OF THE ZOOS", "ZOOS VICTORIA - FRIENDS OF THE ZOOS"],
        "state": "VIC",
        "postcode": 3052,
        "entityType": "SGA",
        "entityTypeName": "State Government Statutory Authority"
    },
    "70cce95a-0c77-4982-8170-a9f4613d060f": {
        "abn": "84085734992",
        "entityName": "NORTHERN TERRITORY OF AUSTRALIA",
        "abnStatus": "Active",
        "businessNames": ["DARWIN INTERNATIONAL LAKSA FESTIVAL", "Northern Territory Police", "Northern Territory Fire and Emergency Service", "NTG", "NTGov", "NTofA", "Alice Springs Hospital", "Gove District Hospital", "Katherine Hospital", "Palmerston Regional Hospital", "Royal Darwin Hospital", "Tennant Creek Hospital", "Territory Pathology", "ALAN WALKER CANCER CARE CENTRE", "TERRITORY FAMILIES, HOUSING AND COMMUNITIES", "Department of Industry, Tourism and Trade", "Department of Corporate and Digital Development", "Department of Environment, Parks and Water Security", "Department of Territory Families, Housing and Communities", "Department of the Chief Minister and Cabinet", "Office of the ICAC NT", "Office of the Independent Commissioner Against Corruption", "Northern Territory Correctional Services RTO", "NATIONAL ABORIGINAL ART GALLERY", "Ombudsman's Office NT", "Department of Health NT", "Department of Infrastructure, Planning and Logistics", "Yaye's Cafe", "Northern Territory Police, Fire and Emergency Services", "National Critical Care & Trauma Response Centre", "CENTRAL MEDICAL RETRIEVAL SERVICE", "NORTHERN TERRITORY MEDICAL RETRIEVAL SERVICE", "NORTHERN TERRITORY MEDICAL RETRIEVAL SERVICE - TOP END", "TOP END MEDICAL RETRIEVAL SERVICE", "Auditor-General's Office", "Department of the Attorney-General and Justice NT", "Department of the Legislative Assembly", "Northern Territory Department of Treasury and Finance", "Northern Territory Electoral Commission", "Northern Territory Government", "NT Department of Education", "NT Health", "Office of the Commissioner for Public Employment", "Department of the Chief Minister NT", "Department of Community Services", "Department of Local Government and Regions", "Department of Sport, Recreation and Racing"],
        "state": "NT",
        "postcode": 800,
        "entityType": "TGE",
        "entityTypeName": "Territory Government Entity"
    },
    "72b9bd2a-816b-4f23-abf3-7dd2ea94e9e3": {
        "abn": "37846306459",
        "entityName": "Jamukurnu-Yapalikurnu Aboriginal Corporation (Western Desert Lands) RNTBC",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "WA",
        "postcode": 6000,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "1d19cefc-98d9-4904-867f-c995e918efbc": {
        "abn": "21273161123",
        "entityName": "The Trustee for Wetland Revival Trust",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "VIC",
        "postcode": 3451,
        "entityType": "DTT",
        "entityTypeName": "Discretionary Trading Trust"
    },
    "0dd60d20-b64e-4fe9-a165-c1ecfd923c8c": {
        "abn": "76654304337",
        "entityName": "INVERTEBRATES AUSTRALIA LTD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "NSW",
        "postcode": 2000,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "9f7fcc8e-9200-441d-88c6-40f118b1284b": {
        "abn": "61249878937",
        "entityName": "THE UNIVERSITY OF ADELAIDE",
        "abnStatus": "Active",
        "businessNames": ["The University of Adelaide College", "Roseworthy Vet", "Roseworthy Veterinary Hospital", "Veterinary Health Centre", "The Adelaide MBA", "ERESEARCH SA"],
        "state": "SA",
        "postcode": 5000,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "be2edbda-a2b2-4c23-a2d5-d0e1e5a5f08d": {
        "abn": "26928873058",
        "entityName": "BONHAM, KEVIN JAMES",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "TAS",
        "postcode": 7000,
        "entityType": "IND",
        "entityTypeName": "Individual/Sole Trader"
    },
    "82967026-74ca-4cdf-a127-66513bbaccba": {
        "abn": "36388980563",
        "entityName": "Department of State Growth",
        "abnStatus": "Active",
        "businessNames": ["Enterprise Centres Tasmania", "New Business Support", "Tasmanian Business Advice Service", "Department of State Growth", "Silverdome", "Derwent Entertainment Centre", "Skills Tasmania", "TASPLATES", "BUSINESS TASMANIA"],
        "state": "TAS",
        "postcode": 7000,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "5a3bbdd4-e68c-48db-9fdf-4b08b49154b7": {
        "abn": "74151011157",
        "entityName": "AQUENAL PTY LTD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "TAS",
        "postcode": 7050,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    },
    "799a55c0-cef0-4376-b29d-60ccadcb6cec": {
        "abn": "29154674709",
        "entityName": "CAIRNS AQUARIUM & REEF RESEARCH CENTRE PTY LTD",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "QLD",
        "postcode": 4870,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    },
    "b3894160-dd4c-455e-b7db-fecdea342aec": {
        "abn": "18951343745",
        "entityName": "Department of Primary Industries and Regional Development",
        "abnStatus": "Active",
        "businessNames": ["Department of Primary Industries and Regional Development"],
        "state": "WA",
        "postcode": 6151,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "b829627d-1509-4069-93bd-e6d683d7691c": {
        "abn": "70775720864",
        "entityName": "ISLAND CARE INCORPORATED",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "SA",
        "postcode": 5223,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "e78654ab-df00-486e-abec-30a32a0bd294": {
        "abn": "48212321102",
        "entityName": "TASMANIAN ABORIGINAL CORPORATION",
        "abnStatus": "Active",
        "businessNames": ["PALAWA KIPLI YULA", "palawa kipli"],
        "state": "TAS",
        "postcode": 7000,
        "entityType": "UIE",
        "entityTypeName": "Other Unincorporated Entity"
    },
    "be5a11fc-b802-4070-9165-4a65dd7c5c65": {
        "abn": "31266367654",
        "entityName": "WAGYL KAIP SOUTHERN NOONGAR ABORIGINAL CORPORATION",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "WA",
        "postcode": 6004,
        "entityType": "OIE",
        "entityTypeName": "Other Incorporated Entity"
    },
    "32be3f2b-d845-407d-a6bd-6cf8e2b25499": {
        "abn": "96724252047",
        "entityName": "KIMBERLEY LAND COUNCIL ABORIGINAL CORPORATION",
        "abnStatus": "Active",
        "businessNames": [],
        "state": "WA",
        "postcode": 6725,
        "entityType": "UIE",
        "entityTypeName": "Other Unincorporated Entity"
    },
    "5d9bb817-7865-42fd-aa7a-8c2327e93ea1": {
        "abn": "43121237054",
        "entityName": "Queensland Regional Natural Resource Management Groups Collective Ltd",
        "abnStatus": "Active",
        "businessNames": ["NRM Regions Queensland"],
        "state": "QLD",
        "postcode": 4020,
        "entityType": "PUB",
        "entityTypeName": "Australian Public Company"
    },
    "4fd63059-2f4b-4cbb-a9bd-be99787f5dab": {
        "abn": "81335751971",
        "entityName": "BOARD OF THE BOTANIC GARDENS AND STATE HERBARIUM",
        "abnStatus": "Active",
        "businessNames": ["Evergreen To Go", "Botanic Lodge", "CAFE EVERGREEN", "EVERGREEN CAFE", "Little Sprouts Kitchen Garden", "Adelaide Botanic Garden Restaurant", "The Australian Centre of Horticultural Excellence", "SIMPSON KIOSK", "CAFE FIBONACCI"],
        "state": "SA",
        "postcode": 5000,
        "entityType": "SGE",
        "entityTypeName": "State Government Entity"
    },
    "af614d68-7d06-4748-b7e4-75d67c1b77d4": {
        "abn": "68131866067",
        "entityName": "Above Photography Pty Ltd",
        "abnStatus": "Active",
        "businessNames": ["AEROGLOBE", "ABOVE PHOTOGRAPHY"],
        "state": "QLD",
        "postcode": 4573,
        "entityType": "PRV",
        "entityTypeName": "Australian Private Company"
    }
}

function updateOrg(project, org) {
    let changed = false;
    if (!org) {
        print("Missing org: " + project.organisationId + " for project " + project.projectId);
    } else {
        if (org.abn && !org.entityName) {
            let abnData = orgLookupResults[org.organisationId];
            if (!abnData || abnData.abn != org.abn) {
                // Find by ABN as the org ids are production org ids
                for (let i in orgLookupResults) {
                    if (orgLookupResults[i].abn == org.abn) {
                        abnData = orgLookupResults[i];
                        break;
                    }
                }
                if (!abnData) {
                    print("No abn data for organisation: "+org.organisationId+", "+org.name+", "+org.abn);
                    if (org.abnStatus != 'Active') {
                        org.abnStatus = 'Active';
                        changed = true;
                    }
                }
            }
            if (abnData) {
                org.abnStatus = abnData.abnStatus;
                org.entityName = abnData.entityName;
                org.businessNames = abnData.businessNames;
                org.state = abnData.state;
                org.postcode = abnData.postcode;
                org.entityType = abnData.entityType;
                org.entityTypeName = abnData.entityTypeName;
                changed = true;
            }


        } else {
            if (org.abnStatus != 'N/A') {
                org.abnStatus = 'N/A';
                changed = true;
            }
        }
        if (changed) {
            print("Updating organisation: "+org.name);
            db.organisation.replaceOne({organisationId: org.organisationId}, org);
            audit(org, org.organisationId, 'au.org.ala.ecodata.Organisation', adminUserId);
        }

    }
}
let projects = db.project.find({hubId: meritHubId, status: {$ne: 'deleted'}});
while (projects.hasNext()) {
    let project = projects.next();

    if (project.organisationId) {
        let org = db.organisation.findOne({organisationId: project.organisationId});
        updateOrg(project, org);
    }
    if (project.orgIdSvcProvider) {
        let org = db.organisation.findOne({organisationId: project.orgIdSvcProvider});
        updateOrg(project, org);
    }
    if (!project.organisationId && !project.orgIdSvcProvider) {
        print("No org for project " + project.projectId);
    }
}

// Adding MU priorities

load('../../../utils/uuid.js');
var managementUnits = ["Glenelg Hopkins"]

var muConfig = {
    priorities: [
        {
            "category": "Ramsar",
            "priority": "Towra Point Nature Reserve"
        },
        {
            "category": "Threatened Species",
            "priority": "Anthochaera phrygia (Regent Honeyeater)"
        },
        {
            "category": "Threatened Species",
            "priority": "Botaurus poiciloptilus (Australasian Bittern)"
        },
        {
            "category": "Threatened Species",
            "priority": "Grevillea caleyi (Caley's Grevillea)"
        },
        {
            "category": "Threatened Species",
            "priority": "Homoranthus darwinioides"
        },
        {
            "category": "Threatened Species",
            "priority": "Lathamus discolor (Swift Parrot)"
        },
        {
            "category": "Threatened Species",
            "priority": "Numenius madagascariensis (Eastern Curlew, Far Eastern Curlew)"
        },
        {
            "category": "Threatened Species",
            "priority": "Syzygium paniculatum (Magenta Lilly Pilly, Magenta Cherry, Daguba, Scrub Cherry, Creek Lilly Pilly, Brush Cherry)"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Blue Gum High Forest of the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Castlereagh Scribbly Gum and Agnes Banks Woodlands of the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Coastal Upland Swamps in the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Cooks River/Castlereagh Ironbark Forest of the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Cumberland Plain Shale Woodlands and Shale-Gravel Transition Forest"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Eastern Suburbs Banksia Scrub of the Sydney Region"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Littoral Rainforest and Coastal Vine Thickets of Eastern Australia"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Posidonia australis seagrass meadows of the Manning-Hawkesbury ecoregion"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Shale Sandstone Transition Forest of the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Subtropical and Temperate Coastal Saltmarsh"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Temperate Highland Peat Swamps on Sandstone"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Turpentine-Ironbark Forest of the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Upland Basalt Eucalypt Forests of the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Western Sydney Dry Rainforest and Moist Woodland on Shale"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "White Box-Yellow Box-Blakely's Red Gum Grassy Woodland and Derived Native Grassland"
        },
        {
            "category": "World Heritage Sites",
            "priority": "The Greater Blue Mountains Area"
        },
        {
            "category": "World Heritage Sites",
            "priority": "Budj Bim Cultural Landscape"
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
            "category": "Land Management",
            "priority": "Shoreline and bank erosion"
        },
        {
            "category": "Land Management",
            "priority": "Riparian remediation"
        },
        {
            "category": "Land Management",
            "priority": "Habitat construction/restoration"
        },
        {
            "category": "Land Management",
            "priority": "Aquatic revegetation"
        },
        {
            "category": "Land Management",
            "priority": "Bank/shoreline revegetation"
        },
        {
            "category": "Land Management",
            "priority": "Reef building/rehabilitation"
        },
        {
            "category": "Land Management",
            "priority": "Saltmarsh remediation"
        },
        {
            "category": "Land Management",
            "priority": "Fish habitat awareness"
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
            "category": "Priority Natural Asset",
            "priority": "Greater Blue Mountains World Heritage Area"
        },
        {
            "category": "Priority Natural Asset",
            "priority": "Gondwana Rainforests of Australia World Heritage Area"
        },
        {
            "category": "Priority Natural Asset",
            "priority": "Budj Bim Cultural Landscape"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Upland Basalt Eucalypt Forests of the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Temperate Highland Peat Swamps on Sandstone"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Lowland Rainforest of Subtropical Australia"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Coastal Swamp Oak (Casuarina glauca) Forest of New South Wales and South East Queensland"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Montane Peatlands and Swamps of the New England Tableland, NSW North Coast, Sydney Basin, South East Corner, South Eastern Highlands and Australian Alps bioregion"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Kurri Sand Swamp Woodland in the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Lower Hunter Spotted Gum Ironbark Forest in the Sydney Basin and NSW North Coast Bioregions"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Turpentine-Ironbark Forest of the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Littoral Rainforest and Coastal Vine Thickets of Eastern Australia"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Castlereagh Scribbly Gum and Agnes Banks Woodlands of the Sydney Basin Bioregion"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Eulamprus leuraensis (Blue Mountains Water Skink)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Hoplocephalus bungaroides (Broad-headed Snake)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Phyllurus platurus (Southern Leaf-Tailed Gecko, Broad-tailed Gecko)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Origma solitaria (Rockwarbler)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Petrogale penicillata (Brush-tailed rock-wallaby)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Petauroides volans (Greater glider)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Petaurus australis (Yellow-bellied glider)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Phascolarctos cinereus (Koala)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Dasyurus maculatus maculatus (Spotted-tail quoll)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Pteropus poliocephalus (Grey-headed flying-fox)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Ornithorinchus anatinus (Platypus)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Anthochaera phrygia (Regent Honeyeater)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Callocephalon fimbriatum (Gang-gang Cockatoo)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Calyptorhynchus lathami lathami (South-eastern Glossy Black-cockatoo)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Mixophyes balbus (Stuttering Frog)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Mixophyes iteratu (Giant Barred Frog)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Dasyornis brachypterus (Eastern Bristlebird)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Atrichornis rufescens (Rufous Scrub-bird)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Notomacropus parma (Parma Wallaby)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Pseudomys oralis (Hastings River Mouse)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Drysdalia rhodogaster (Mustard-bellied Snake)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Calyptotis ruficauda (Red-tailed Calyptotis)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Saltuarius moritzi (Moritz’s leaf-tail gecko)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Antechinus mimetes (Dusky Antechinus)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Phoniscus papuensis (Golden-tipped Bat)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Pseudomys oralis (Hastings River Mouse, Koontoo)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Litoria littlejohni (Littlejohn's Tree Frog, Heath Frog)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Heleioporus australiacus (Giant Burrowing Frog)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Mixophyes balbus (Stuttering Frog, Southern Barred Frog)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Philoria sphagnicola (Sphagnum Frog)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Litoria daviesae (Davies’ Tree Frog)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Mixophyes iteratus (Giant Barred Frog)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Macquaria australasica 'MDB taxa' (Macquarie Perch)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Macquarie sp. nov. 'Hawkesbury taxon' (Blue Mountains Perch, Hawkesbury Perch)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Pycnoptilus floccosus (Pilotbird)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Menura novaehollandiae (Superb Lyrebird)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Climacteris erythrops (Red-browed Treecreeper)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Monarcha melanopsis (Black-faced Monarch)"
        },
        {
            "category": "Priority Vertebrate Animals",
            "priority": "Pezoporus wallicus wallicus (Mainland Ground Parrot)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "(Blue Mountains Perch)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "(Giant Burrowing Frog)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "(Red-crowned Toadlet)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "(Little Bent-winged Bat)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "(Barking Owl)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "(Masked Owl)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "(Powerful Owl)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "(Sooty Owl)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "Myuchelys purvisi (Manning River Helmeted Turtle, Purvis' Turtle)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "Mastacomys fuscus mordicus (Broad-toothed Rat)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "Potorous tridactylus tridactylus (Long-nosed Potoroo)"
        },
        {
            "category": "Additional Priority Species",
            "priority": "Pseudomys novaehollandiae (New Holland Mouse Pookila)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Pelecorhynchus niger (Fly)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "(Jewel Beetle)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Coricudgia wollemiana (Coricudgy Pinwheel Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Macrophallikoropa stenoumbilicata (Wolllemi Pinwheel Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Pelecorhynchus nebulosus (Fly)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Matthewsius rossi (Beetle)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Marilyniropa jenolanensis (Jenolan Pinwheel Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Pommerhelix depressa (Jenolan Caves Woodland Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Austrochloritis wollemiensis (Wollemi Bristle Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Figulus trilobus (Beetle)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Pelecorhynchus lineatus (Fly)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Petalura gigantea (Giant Dragonfly)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Paralucia spinifera (Bathurst Copper Butterfly)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Euastacus suttoni (Sutton’s Crayfish)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Euastacus spinichelatus (Small Crayfish)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Euastacus polysetosus (Many Bristled Crayfish)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Euastacus gamilaroi (Hanging Rock Crayfish)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Pommerhelix monacha (Blue Mountains Woodland Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Austrochloritis kanangra (Jenolan Caves Bristle Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Mesodina aeluropis (Montane Iris-skipper; Aeluropis Skipper)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Xylocopa aeratus (Green Carpenter Bee, Metallic Green Carpenter Bee, Southern Green Carpenter Bee)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Paralaoma annabelli (Prickle Pinhead Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Matthewsius illawarrensis (Beetle)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Storenosoma terraneum (Spider, harvestman or pseudoscorpion)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Molycria mammosa (Spider, harvestman or pseudoscorpion)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Austropetalia patricia (Waterfall Redspot)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Aulacopris reichei (Beetle)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Diorygopyx incrassatus (Beetle)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Coripera morleyana (Beetle)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Hyridella depressa (Depressed Mussel; Knife-shaped Mussel)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Pelecorhynchus distinctus (Fly)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Oreixenica latialis latialis (Small Alpine Xenica)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Venatrix australiensis (Spider, harvestman or pseudoscorpion)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Asteron grayi (Spider, harvestman or pseudoscorpion)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Gyrocochlea wauchope (Wauchope Pinwheel Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Tetramorium confusum (Ant, wasp or bee)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Cordulephya divergens (Clubbed Shutwing)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Telicota eurychlora (Dingy Darter, Sedge Darter, Southern Sedge Darter)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Australatya striolata (Eastern Freshwater Shrimp)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Pelecorhynchus rubidus (Fly)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Trichophthalma bivitta (Fly)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Candalides absimilis edwardsi (Glistening Pencil-blue; Common Pencilled-blue)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Meridolum jervisensis (Jervis Bay Forest Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Caliagrion billinghursti (Large Riverdamsel)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Pleuropoma jana (Macleay Valley Droplet-snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Elsothera kyliestumkatae (Mount Seaview Pinwheel Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Oreixenica correae (Orange Alpine Xenica; Correa Brown)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Gyrocochlea planorbis (Port Stephens Pinwheel Snail)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Graycassis bruxner (Spider, harvestman or pseudoscorpion)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Rhynchochydorus australiensis (Water Flea)"
        },
        {
            "category": "Priority Invertebrate Species",
            "priority": "Kirkaldyella rugosa (Hemiptera (bug))"
        },
        {
            "category": "Priority Natural Asset",
            "priority": "Greater Blue Mountains World Heritage Area"
        },
        {
            "category": "Priority Natural Asset",
            "priority": "Gondwana Rainforests of Australia World Heritage Area"
        },
        {
            "category": "Priority Plants",
            "priority": "Hibbertia cistiflora subsp. quadristaminea"
        },
        {
            "category": "Priority Plants",
            "priority": "Persoonia hindii"
        },
        {
            "category": "Priority Plants",
            "priority": "Persoonia recedens"
        },
        {
            "category": "Priority Plants",
            "priority": "Leucochrysum graminifolium"
        },
        {
            "category": "Priority Plants",
            "priority": "Eucalyptus bensonii (Benson’s Stringybark)"
        },
        {
            "category": "Priority Plants",
            "priority": "Leptospermum petraeum,"
        },
        {
            "category": "Priority Plants",
            "priority": "Hakea dohertyi (Kowmung Hakea)"
        },
        {
            "category": "Priority Plants",
            "priority": "Almaleea incurvata"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia alaticaulis (Winged Sunshine Wattle)"
        },
        {
            "category": "Priority Plants",
            "priority": "Veronica brownii"
        },
        {
            "category": "Priority Plants",
            "priority": "Hibbertia acaulothrix"
        },
        {
            "category": "Priority Plants",
            "priority": "Eucalyptus corticosa (Olinda Box)"
        },
        {
            "category": "Priority Plants",
            "priority": "Darwinia taxifolia subsp. taxifolia"
        },
        {
            "category": "Priority Plants",
            "priority": "Dillwynia stipulifera"
        },
        {
            "category": "Priority Plants",
            "priority": "Haloragodendron lucasii"
        },
        {
            "category": "Priority Plants",
            "priority": "Persoonia oblongata"
        },
        {
            "category": "Priority Plants",
            "priority": "Persoonia mollis subsp. Mollis"
        },
        {
            "category": "Priority Plants",
            "priority": "Epacris purpurascens var. onosmiflora"
        },
        {
            "category": "Priority Plants",
            "priority": "Eucalyptus rudderi (Rudder's Box)"
        },
        {
            "category": "Priority Plants",
            "priority": "Pultenaea glabra (Smooth Bush-pea, Swamp Bush-pea)"
        },
        {
            "category": "Priority Plants",
            "priority": "Hakea pachyphylla"
        },
        {
            "category": "Priority Plants",
            "priority": "Haloragodendron gibsonii"
        },
        {
            "category": "Priority Plants",
            "priority": "Leptospermum macrocarpum"
        },
        {
            "category": "Priority Plants",
            "priority": "Isopogon fletcheri (Fletcher's Drumsticks)"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia saliciformis (Willow Wattle)"
        },
        {
            "category": "Priority Plants",
            "priority": "Banksia penicillata"
        },
        {
            "category": "Priority Plants",
            "priority": "Baeckea kandos"
        },
        {
            "category": "Priority Plants",
            "priority": "Brachyscome brownii"
        },
        {
            "category": "Priority Plants",
            "priority": "Wollemia nobilis (Wollemi Pine)"
        },
        {
            "category": "Priority Plants",
            "priority": "Apatophyllum constablei"
        },
        {
            "category": "Priority Plants",
            "priority": "Cyphanthera scabrella"
        },
        {
            "category": "Priority Plants",
            "priority": "Trachymene scapigera (Mountain Trachymene)"
        },
        {
            "category": "Priority Plants",
            "priority": "Eucalyptus cunninghamii (Cliff Mallee Ash)"
        },
        {
            "category": "Priority Plants",
            "priority": "Persoonia acerosa (Needle Geebung)"
        },
        {
            "category": "Priority Plants",
            "priority": "Ochrosperma oligomerum"
        },
        {
            "category": "Priority Plants",
            "priority": "Hakea constablei"
        },
        {
            "category": "Priority Plants",
            "priority": "Veronica lithophila"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia clunies-rossiae (Kowmung Wattle, Kanangra Wattle)"
        },
        {
            "category": "Priority Plants",
            "priority": "Leionema lamprophyllum subsp. Orbiculare"
        },
        {
            "category": "Priority Plants",
            "priority": "Prasophyllum fuscum (Tawny Leekorchid, Slaty Leekorchid)"
        },
        {
            "category": "Priority Plants",
            "priority": "Hibbertia saligna"
        },
        {
            "category": "Priority Plants",
            "priority": "Eucalyptus sp. Howes Swamp Creek"
        },
        {
            "category": "Priority Plants",
            "priority": "Callitris muelleri (Mueller’s Cypress)"
        },
        {
            "category": "Priority Plants",
            "priority": "Grevillea kedumbensis"
        },
        {
            "category": "Priority Plants",
            "priority": "Allocasuarina defungens (Dwarf Heath Casuarina)"
        },
        {
            "category": "Priority Plants",
            "priority": "Grevillea imberbis"
        },
        {
            "category": "Priority Plants",
            "priority": "Pomaderris brunnea (Rufous Pomaderris)"
        },
        {
            "category": "Priority Plants",
            "priority": "Actinotus forsythii (Wiry Flannel flower)"
        },
        {
            "category": "Priority Plants",
            "priority": "Eucalyptus gregsoniana (Wolgan Snow Gum)"
        },
        {
            "category": "Priority Plants",
            "priority": "Hibbertia coloensis"
        },
        {
            "category": "Priority Plants",
            "priority": "Spyridium burragorang"
        },
        {
            "category": "Priority Plants",
            "priority": "Pomaderris sericea (Bent Pomaderris)"
        },
        {
            "category": "Priority Plants",
            "priority": "Grevillea evansiana (Evan’s Grevillea)"
        },
        {
            "category": "Priority Plants",
            "priority": "Boronia deanei (Deane's Boronia)"
        },
        {
            "category": "Priority Plants",
            "priority": "Prostanthera caerulea"
        },
        {
            "category": "Priority Plants",
            "priority": "Leptospermum spectabile"
        },
        {
            "category": "Priority Plants",
            "priority": "Grevillea buxifolia subsp. ecorniculata"
        },
        {
            "category": "Priority Plants",
            "priority": "Epacris hamiltonii"
        },
        {
            "category": "Priority Plants",
            "priority": "Velleia perfoliata"
        },
        {
            "category": "Priority Plants",
            "priority": "Solanum armourense"
        },
        {
            "category": "Priority Plants",
            "priority": "Prostanthera stenophylla"
        },
        {
            "category": "Priority Plants",
            "priority": "Dillwynia brunioides"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia hamiltoniana (Hamilton's Wattle)"
        },
        {
            "category": "Priority Plants",
            "priority": "Goodenia heterophylla subsp. montana"
        },
        {
            "category": "Priority Plants",
            "priority": "Banksia paludosa subsp. astrolux (Swamp Banksia)"
        },
        {
            "category": "Priority Plants",
            "priority": "Schoenus evansianus"
        },
        {
            "category": "Priority Plants",
            "priority": "Prostanthera saxicola var. montana"
        },
        {
            "category": "Priority Plants",
            "priority": "Grevillea aspleniifolia"
        },
        {
            "category": "Priority Plants",
            "priority": "Genoplesium superbum (Superb Midgeorchid)"
        },
        {
            "category": "Priority Plants",
            "priority": "Goodenia rostrivalvis"
        },
        {
            "category": "Priority Plants",
            "priority": "Olearia covenyi"
        },
        {
            "category": "Priority Plants",
            "priority": "Asterolasia rivularis"
        },
        {
            "category": "Priority Plants",
            "priority": "Grevillea acanthifolia (Bog Grevillea)"
        },
        {
            "category": "Priority Plants",
            "priority": "Hibbertia circinata"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia jonesii (Jones Wattle)"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia meiantha"
        },
        {
            "category": "Priority Plants",
            "priority": "Callistemon megalongensis (Megalong Valley Bottlebrush)"
        },
        {
            "category": "Priority Plants",
            "priority": "Hymenophyllum pumilum"
        },
        {
            "category": "Priority Plants",
            "priority": "Grevillea guthrieana"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia olsenii (Olsen’s Wattle)"
        },
        {
            "category": "Priority Plants",
            "priority": "Zieria caducibracteata"
        },
        {
            "category": "Priority Plants",
            "priority": "Macrozamia montana"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia trinervata (Three-nerved Wattle)"
        },
        {
            "category": "Priority Plants",
            "priority": "Deyeuxia reflexa"
        },
        {
            "category": "Priority Plants",
            "priority": "Eucalyptus macarthurii (Camden Woollybutt, Paddys River Box)"
        },
        {
            "category": "Priority Plants",
            "priority": "Pomaderris cotoneaster (Cotoneaster Pomaderris)"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia covenyi (Blue Bush, Bluebush, Bendethera Wattle)"
        },
        {
            "category": "Priority Plants",
            "priority": "Microlaena stipoides var. breviseta"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia tessellata"
        },
        {
            "category": "Priority Plants",
            "priority": "Telopea mongaensis (Monga Waratah, Braidwood Waratah)"
        },
        {
            "category": "Priority Plants",
            "priority": "Styphelia perileuca"
        },
        {
            "category": "Priority Plants",
            "priority": "Acacia chalkeri (Chalker's Wattle)"
        },
        {
            "category": "Priority Plants",
            "priority": "Callistemon subulatus (Dwarf Bottlebrush)"
        },
        {
            "category": "Priority Plants",
            "priority": "Leptospermum rotundifolium"
        },
        {
            "category": "Priority Plants",
            "priority": "Grevillea linsmithii (Linsmith's Grevillea)"
        },
        {
            "category": "Priority Plants",
            "priority": "Lasiopetalum joyceae"
        },
        {
            "category": "Priority Plants",
            "priority": "Asterolasia buxifolia"
        },
        {
            "category": "Priority Plants",
            "priority": "Grevillea acerata"
        },
        {
            "category": "Priority Plants",
            "priority": "Prostanthera teretifolia"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Eucalytus macarthurii (Paddys River Box)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Wollemia nobilis (Wollemi Pine)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Pherosphaera fitzgeraldii (Dwarf Mountain Pine)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Zieria convenyi (Coveny’s Zieria)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Leionema lachnaeoides"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Grevillea obtusiflora ssp"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Diuris aequalis (Donkey Orchid)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Epacris sparsa"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Isopogon fletcheri (Fletchers Drumsticks)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Trachymene saniculifolia"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Bertya sp."
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Grevillea evansiana (Evans Grevillea)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Hibbertia puberula"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Hibbertia sp. Bankstown"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Pultenaea sp. Olinda"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Leionema sympetalum (Rylstone Bell)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Velleia perfoliata"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Zieria murphyi (Velvet Zieria)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Eucalytus macarthurii (Paddys River Box)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Wollemia nobilis (Wollemi Pine)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Pherosphaera fitzgeraldii (Dwarf Mountain Pine)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Zieria convenyi (Coveny’s Zieria)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Leionema lachnaeoides"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Grevillea obtusiflora ssp"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Diuris aequalis (Donkey Orchid)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Epacris sparsa"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Isopogon fletcheri (Fletchers Drumsticks)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Trachymene saniculifolia"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Bertya sp."
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Grevillea evansiana (Evans Grevillea)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Hibbertia puberula"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Hibbertia sp. Bankstown"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Pultenaea sp. Olinda"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Leionema sympetalum (Rylstone Bell)"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Velleia perfoliata"
        },
        {
            "category": "Additional Priority Plants",
            "priority": "Zieria murphyi (Velvet Zieria)"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Upland Basalt Eucalypt Forests of the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Temperate Highland Peat Swamps on Sandstone"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Lowland Rainforest of Subtropical Australia"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Coastal Swamp Oak (Casuarina glauca) Forest of New South Wales and South East Queensland"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Montane Peatlands and Swamps of the New England Tableland, NSW North Coast, Sydney Basin, South East Corner, South Eastern Highlands and Australian Alps bioregion"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Kurri Sand Swamp Woodland in the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Lower Hunter Spotted Gum Ironbark Forest in the Sydney Basin and NSW North Coast Bioregions"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Turpentine-Ironbark Forest of the Sydney Basin Bioregion"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Littoral Rainforest and Coastal Vine Thickets of Eastern Australia"
        },
        {
            "category": "Threatened Ecological Community",
            "priority": "Castlereagh Scribbly Gum and Agnes Banks Woodlands of the Sydney Basin Bioregion"
        },
        {
            "category": "Ramsar",
            "priority": "Piccaninnie Ponds Karst Wetlands"
        },
        {
            "category": "Ramsar",
            "priority": "Western District Lakes"
        },
        {
            "category": "Ramsar",
            "priority": "Glenelg Estuary and Discovery Bay Ramsar Site"
        },
        {
            "category": "Threatened Species",
            "priority": "Calyptorhynchus banksii graptogyne (Red-tailed Black-Cockatoo (south-eastern))"
        },
        {
            "category": "Threatened Species",
            "priority": "Leipoa ocellata (Malleefowl)"
        },
        {
            "category": "Threatened Species",
            "priority": "Neophema chrysogaster (Orange-bellied Parrot)"
        },
        {
            "category": "Threatened Species",
            "priority": "Pedionomus torquatus (Plains-wanderer)"
        },
        {
            "category": "Threatened Species",
            "priority": "Perameles gunnii Victorian subspecies (Eastern Barred Bandicoot (Mainland))"
        },
        {
            "category": "Threatened Species",
            "priority": "Pimelea spinescens subsp. spinescens (Plains Rice-flower, Spiny Rice-flower, Prickly Pimelea)"
        },
        {
            "category": "Threatened Species",
            "priority": "Rutidosis leptorrhynchoides (Button Wrinklewort)"
        },
        {
            "category": "Threatened Species",
            "priority": "Thinornis rubricollis rubricollis (Hooded Plover (eastern))"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Grassy Eucalypt Woodland of the Victorian Volcanic Plain"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Grey Box (Eucalyptus microcarpa) Grassy Woodlands and Derived Native Grasslands of South-eastern Australia"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Natural Temperate Grassland of the Victorian Volcanic Plain"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Seasonal Herbaceous Wetlands (Freshwater) of the Temperate Lowland Plains"
        },
        {
            "category": "Threatened Ecological Communities",
            "priority": "Subtropical and Temperate Coastal Saltmarsh"
        }
    ]
};


managementUnits.forEach(function (mu){
    var mu = db.managementUnit.find({name: mu});
    while(mu.hasNext()){
        var m = mu.next();
        if (m.name === "Glenelg Hopkins"){
            m.priorities = muConfig.priorities
        }
        db.managementUnit.save(m);
    }
});





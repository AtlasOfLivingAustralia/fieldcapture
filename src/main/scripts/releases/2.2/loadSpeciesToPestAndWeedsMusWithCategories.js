load('../../utils/uuid.js');

function updateSpecies (ts, mgUnit, category){
    var management = db.managementUnit.find({name: mgUnit});
    while (management.hasNext()) {
        var m = management.next();
        ts.forEach(function (species) {
            var isPrioritiesExist = false;
            for (i = 0; i < m.priorities.length; i++) {
                if (m.priorities[i].category === category && m.priorities[i].priority === species) {
                    isPrioritiesExist = true
                }
            }
            if (!isPrioritiesExist) {
                m.priorities.push({category: category, priority: species});
                print("Saving this " + species + " to the mangement unit: " + m.name + " under this category: " + category)
                db.managementUnit.save(m);
            }

        });
    }

}

function removePrioritiesIfpresent(options){
    var {mgUnit, management, category} = options
    mgUnit.priorities.forEach(function(priorities){
        if (priorities.category === category){
            print("Removing Existing other species")
            print("ManagementUnit: " + management + " Category: " + priorities.category  + " species: " + priorities.priority)
            db.managementUnit.update({managementUnitId: mgUnit.managementUnitId},{"$pull": { "priorities": {"category":category}}},{"multi": true});
        }
    });

}

function addTsToMus(managementUnit, ts, category) {
    if (!category) {
        category = 'Threatened Species';
    }
    managementUnit.forEach(function (management) {
        var muExist = db.managementUnit.find({name: management});
        while (muExist.hasNext()) {
            var mgUnit = muExist.next();
            if (mgUnit.priorities.length > 0){
                var options = {mgUnit, management, category}
                removePrioritiesIfpresent(options);
            }
            print("Adding species after removing species from the priorities list")
           updateSpecies(ts, management, category)
        }
    });
}

let targetPestSpecies = [

    "Amphibalanus Improvisus (Bay Barnacle)",
    "Cherax Destructor (Common Yabby)",
    "Limnoria Quadripunctata (Gribble)",
    "Carcinus Maenas (Shore Crab)",

    "Acridotheres Tristis (Common Myna)",
    "Struthio Camelus (Common Ostrich)",
    "Sturnus Vulgaris (Common Starling)",
    "Columba Livia (Domestic Pigeon)",
    "Turdus Merula (Eurasian Blackbird)",
    "Passer Montanus (Eurasian Tree Sparrow)",
    "Carduelis Carduelis (European Goldfinch)",
    "Chloris Chloris (European Greenfinch)",
    "Gallus Varius (Green Junglefowl)",
    "Passer Domesticus (House Sparrow)",
    "Pavo Cristatus (Indian Peafowl)",
    "Spilopelia Senegalensis (Laughing Dove)",
    "Anas Platyrhynchos (Mallard)",
    "Gallus Gallus (Red Junglefowl)",
    "Alauda Arvensis (Skylark)",
    "Turdus Philomelos (Song Thrush)",
    "Spilopelia Chinensis (Spotted Dove)",

    "Asterias Amurensis (Northern Pacific Seastar)",

    "Cyprinus Carpio (European Carp)",

    "Misgurnus Anguillicaudatus (Asian Weatherloach)",
    "Salmo Trutta (Brown Trout)",
    "Cyprinus Carpio (Common Carp)",
    "Perca Fluviatilis (European Perch, Redfin Perch)",
    "Gambusia Holbrooki (Gambusia / Mosquitofish)",
    "Carassius Auratus (Goldfish)",
    "Xiphophorus Hellerii (Green Swordtail)",
    "Astronotus Ocellatus (Oscar)",
    "Oncorhynchus Mykiss (Rainbow Trout)",
    "Pelmatolapia Mariae (Spotted Tilapia)",
    "Oreochromis Spp (Tilapia)",
    "Acanthogobius Flavimanus (Yellowfin Goby)",

    "Batrachochytrium Dendrobatidis (Frog Chytrid Fungus)",

    "Bruchophagus Roddi (Alfalfa Seed Chalcid)",
    "Linepithema Humile (Argentine Ant)",
    "Pheidole Megacephala (Coastal Brown Ant)",
    "Forficula Auricularia (Common Earwig)",
    "Vespula Vulgaris (Common Wasp)",
    "Trichomyrmex Destructor (Destructive Trailing Ant)",
    "Apis Cerana (Eastern Honey Bee)",
    "Wasmannia Auropunctata (Electric/Little Fire Ant)",
    "Xanthogaleruca Luteola (Elm-Leaf Beetle)",
    "Vespula Germanica (European Wasp)",
    "Spodoptera Frugiperda (Fall Armyworm)",
    "Ips Grandicollis (Five-Spined Bark Beetle (Ips))",
    "Xyleborinus Saxesenii (Fruit-Tree Pinhole Borer)",
    "Tapinoma Melanocephalum (Ghost Ant)",
    "Solenopsis Geminata (Ginger Ant)",
    "Aphis Spiraecola (Green Citrus Aphid)",
    "Trialeurodes Vaporariorum (Greenhouse Whiteflies)",
    "Maconellicoccus Hirsutus (Hibiscus Mealybug)",
    "Aethina Tumida (Hive Beetles)",
    "Sitobion Miscanthi (Indian Grain Aphid)",
    "Phylacteophaga Froggatti (Leafblister Sawfly)",
    "Paratrechina Longicornis (Longhorn Crazy Ant)",
    "Idioscopus Nitidulus (Mango Leafhopper)",
    "Ceratitis Capitata (Mediterranean Fruit Fly)",
    "Spodoptera Litura (Oriental Leafworm Moth)",
    "Cerataphis Lataniae (Palm Aphid)",
    "Pheidole Megacephala (Pantanal African Big-Headed Ant Or Coastal Brown Ant)",
    "Monomorium Pharaonis (Monomorium Pharaonis)",
    "Pineus Pini (Pine Adelgid)",
    "Solenopsis Invicta (Red Imported Fire Ant)",
    "Hylurgus Ligniperda (Red-Haired Pine Bark Beetle)",
    "Diuraphis Noxia (Russian Wheat Aphid)",
    "Bemisia Tabaci (Silverleaf Whitefly)",
    "Aethina Tumida (Small Hive Beetle)",
    "Corythucha Ciliata (Sycamore Lace Bug)",
    "Euwallacea Fornicatus (Tea Shot-Hole Borer)",
    "Aedes Albopictus (Tiger Mosquito)",
    "Tremex Fuscicornis (Tremex Wasp)",
    "Solenopsis Geminata (Tropical Fire Ant)",
    "Frankliniella Occidentalis (Western Flower Thrips)",
    "Anoplolepsis Gracilipes (Yellow Crazy Ants)",

    "Rattus Rattus (Black Rat)",
    "Rattus Norvegicus (Brown Rat)",
    "Felis Catus (Cat)",
    "Axis Axis (Chital Deer)",
    "Bos Javanicus (Domestic Banteng)",
    "Vulpes Vulpes (European Fox)",
    "Lepus Europaeus (European Hare)",
    "Oryctalagus Cuniculus (European Rabbit)",
    "Dama Dama (Fallow Deer)",
    "Camelus Dromedarius (Feral Camel)",
    "Felis Silvestris Catus (Feral Cat)",
    "Bos Species (Feral Cattle)",
    "Equus Asinus (Feral Donkey)",
    "Capra Hircus (Feral Goat)",
    "Equus Caballus (Feral Horse)",
    "Sus Scrofa (Feral Pig)",
    "Funambulus Pennantii (Five-Lined Palm Squirrel)",
    "Axis Porcinus (Hog Deer)",
    "Mus Musculus (House Mouse)",
    "Sus Scrofa Domestica (Razorback)",
    "Cervus Elaphus (Red Deer)",
    "Cervus Timorensis (Rusa Deer)",
    "Cervus Unicolor (Sambar Deer)",
    "Bubalus Bubalis (Water Buffalo)",
    "Canis Lupus Familiaris (Wild Dogs)",

    "Musculista Senhousia (Asian Mussel)",
    "Cernuella Virgata (Common White Snail)",
    "Cornu Aspersum (Garden Snail)",
    "Deroceras Laeve (Marsh Slug)",
    "Magallana Gigas (Pacific Oyster)",
    "Cochlicella Acuta (Pointed Snail)",
    "Cochlicella Barbara (Small Pointed Snail)",
    "Deroceras Invadens (Tramp Slug)",
    "Theba Pisana (White Garden Snail)",

    "Lycium Ferocissimum (African Boxthorn)",
    "Eragrostis Curvula (African Lovegrass)",
    "Brassica Tournefortii (African Mustard)",
    "Annona Glabra (Alligator Apple)",
    "Alternanthera Philoxeroides (Alligator Weed)",
    "Calotropis Procera (Apple Of Sodom)",
    "Asparagus Aethiopicus (Asparagus Fern)",
    "Paspalum Notatum (Bahia Grass)",
    "Echinochloa Crus-Galli (Barnyard Grass)",
    "Xanthium Spinosum (Bathurst Burr)",
    "Chrysanthemoides Monilifera (Bitou Bush)",
    "Rubus Ruticosus Aggregate (Blackberry)",
    "Asparagus Sps (Bridal Creeper)",
    "Andropogon Virginicus (Broomsedge)",
    "Cinnamomum Camphora (Camphor Laurel)",
    "Dolichandra Unguis-Cati (Cat’S Claw Creeper)",
    "Nassella Neesiana (Chilean Needle Grass)",
    "Hyparrhenia Hirta (Collatai Grass)",
    "Opuntia Stricta (Common Pest Pear)",
    "Cylindropuntia Fulgida (Coral Cactus)",
    "Froelichia Floridana, F. Gracilis (Cotton-Tails)",
    "Cylindropuntia Imbricata (Devil'S Rope Pear)",
    "Cabomba Caroliniana (Fanwort)",
    "Chloris Virgata (Feathertop Rhodes Grass)",
    "Senecio Madagascariensis (Fireweed)",
    "Fleabane (Genus)",
    "Florestina Tripteris (Florestina)",
    "Bromus Rubens (Foxtail Brome)",
    "Arundo Donax (Giant Cane)",
    "Sporobolus Fertilis (Giant Parramatta Grass)",
    "Harrisia Martinii (Harrisia Cactus)",
    "Gleditsia Triacanthos (Honey Locust)",
    "Marrubium Vulgare (Horehound)",
    "Hymenachne Amplexicaulis (Hymenachne)",
    "Cenchrus Sps (Innocent Weed)",
    "Berberis Thunbergii (Japanese Barberry)",
    "Lantana Camara (Lantana)",
    "Diplotaxis Tenuifolia (Lincoln Weed)",
    "Phyla Canescens (Lippia)",
    "Anredera Cordifolia (Madeira Vine)",
    "Argemone Ochroleuca (Mexican Poppy)",
    "Vachellia Farnesiana (Mimosa Bush)",
    "Bryophyllum Delagoense (Mother-Of-Millions)",
    "Cereus Uruguayanus (Night Blooming Cereus)",
    "Xanthium Occidentale (Noogoora Burr)",
    "Opuntia Genus (Opuntioid Cacti)",
    "Leucanthemum Vulgare (Ox-Eye Daisy)",
    "Cortaderia Selloana (Pampas Grass)",
    "Parkinsonia Aculeata (Parkinsonia)",
    "Parthenium Hysterophorus (Parthenium)",
    "Echium Plantagineum (Paterson’S Curse)",
    "Vachellia Nilotica (Prickly Acacia)",
    "Opuntia Spp (Prickly Pear)",
    "Cryptostegia Grandiflora (Rubber Vine)",
    "Carthamus Lanatus (Saffron Thistle)",
    "Nassella Trichotoma (Serrated Tussock)",
    "Ardisia Elliptica (Shoebutton Ardisia)",
    "Solanum Elaeagnifolium (Silver-Leaf Nightshade)",
    "Sonchus Arvensis (Sowthistle)",
    "Erica Lusitanica (Spanish Heath)",
    "Cirsium Vulgare (Spear Thistle)",
    "Hypericum Perforatum (St. John's Wort)",
    "Acacia Farnesiana (Sweet Acacia)",
    "Opuntia Aurantiaca (Tiger Pear)",
    "Ailanthus Altissima (Tree Of Heaven)",
    "Opuntia Tomentosa (Velvety Tree Pear)",
    "Ipomoea Calobra (Weir Vine)",
    "Andropogon Virginicus (Whisky Grass)",
    "Solanum Mauritianum (Wild Tobacco)",
    "Brassica Tournefortii (Wild Turnip Weed)",

    "Rhinella Marina (Cane Toad)",
    "Indotyphlops Braminus (Flowerpot Blind Snake)",
    "Hemidactylus Frenatus (House Gecko)",
    "Trachemys Scripta Elegans (Red-Eared Slider)",
    "Trachemys Scripta Elegans (Red-Eared Slider Turtle)",
    "Lissotriton Vulgaris (Smooth Newts)",

    "Lolium Rigidum (Annual Ryegrass)",
    "Sagittaria Genus (Arrowhead)",
    "Tamarix Aphylla (Athel Pine)",
    "Chrysanthemoides Monilifera Subsp. Monilifera (Boneseed)",
    "Cenchrus Polystachios (Buffel Grass)",
    "Jatropha Gossypifolia (Cotton-Leaved Physic-Nut)",
    "Cytisus Scoparius (English Broom)",
    "Genista Linifolia (Flax-Leaved Broom)",
    "Andropogon Gayanus (Gamba Grass)",
    "Sporobolus Pyramidalis (Giant Rat's Tail Grass)",
    "Mimosa Pigra (Giant Sensitive Plant)",
    "Ulex Europaeus (Gorse)",
    "Themeda Quadrivalvis (Grader Grass)",
    "Pilosella Species (Hawkweeds)",
    "Cylindropuntia Pallida (Hudson Pear)",
    "Pereskia Aculeata (Leaf Cactus)",
    "Prosopsis Spp (Mesquite)",
    "Genista Monspessulana (Montpellier Broom)",
    "Cereus Spp (Night-Blooming Cacti)",
    "Hymenachne Amplexicaulis (Olive Hymenachne)",
    "Salvinia Molesta (Salvinia)",
    "Chromolaena Odorata (Siam Weed)",
    "Solanum Viarum (Solanum)",
    "Eichhornia Crassipes (Water Hyacinth)",
    "Avena Spps (Wild Oat)",
    "Raphanus Raphanistrum (Wild Radish)",
    "Salix Spp (Willow)"

];

addTsToMus(["Hunter"],targetPestSpecies, "Target Pest Species");
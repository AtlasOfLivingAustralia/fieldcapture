// Adding MU priorities

load('../../../utils/uuid.js');
var managementUnits = ["Glenelg Hopkins"]

var muConfig = {
    priorities: [
        {
            "category": "Ramsar",
            "priority": "Piccaninnie Ponds Karst Wetlands"
        },
        {
            "category": "Ramsar",
            "priority": "Western District Lakes"
        },
        {
            "category": "Threatened Species",
            "priority": "Botaurus poiciloptilus (Australasian Bittern)"
        },
        {
            "category": "Threatened Species",
            "priority": "Calyptorhynchus banksii graptogyne (Red-tailed Black-Cockatoo (south-eastern))"
        },
        {
            "category": "Threatened Species",
            "priority": "Lathamus discolor (Swift Parrot)"
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
            "priority": "Numenius madagascariensis (Eastern Curlew, Far Eastern Curlew)"
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
            "category": "Ramsar",
            "priority": "Glenelg Estuary and Discovery Bay Ramsar Site"
        },
        {
            "category": "Threatened Species",
            "priority": "Orange-bellied Parrot Neophema chrysogaster"
        },
        {
            "category": "World Heritage Sites",
            "priority": "Budj Bim Cultural Landscape"
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
            "priority": "Gondwana Rainforests of Australia World Heritage Area"
        },
        {
            "category": "Priority Natural Asset",
            "priority": "Budj Bim Cultural Landscape"
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





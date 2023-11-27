var mus = [
    'Burdekin',
    'Burnett Mary',
    'Cape York',
    'Condamine',
    'Desert Channels',
    'Fitzroy',
    'Mackay Whitsunday',
    'Maranoa Balonne and Border Rivers',
    'Northern Gulf',
    'South East Queensland',
    'Southern Gulf',
    'South West Queensland',
    'Wet Tropics'
];

var priorities = [
    {
        "category": "Ecological health",
        "priority": "Saltwater Creek, Cairns"
    },
    {
        "category": "Ecological health",
        "priority": "Bulimba Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Cubberla Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Bremer River"
    },
    {
        "category": "Ecological health",
        "priority": "Saltwater Creek, Gold Coast"
    },
    {
        "category": "Ecological health",
        "priority": "Fig Tree Creek, Yeppoon"
    },
    {
        "category": "Ecological health",
        "priority": "Downfall Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Dowse Lagoon"
    },
    {
        "category": "Ecological health",
        "priority": "McCready's Creek, Mackay"
    },
    {
        "category": "Ecological health",
        "priority": "Slacks Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Lake Macquarie"
    },
    {
        "category": "Ecological health",
        "priority": "Hawkesbury River"
    },
    {
        "category": "Ecological health",
        "priority": "Tuggerah Lakes"
    },
    {
        "category": "Ecological health",
        "priority": "Shoalhaven and Crookshaven Rivers"
    },
    {
        "category": "Ecological health",
        "priority": "Cooks River"
    },
    {
        "category": "Ecological health",
        "priority": "Canberra Waterways"
    },
    {
        "category": "Ecological health",
        "priority": "Peter Hopper Lake"
    },
    {
        "category": "Ecological health",
        "priority": "Moonee Ponds Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Karaaf Wetlands"
    },
    {
        "category": "Ecological health",
        "priority": "KooyongKoot (Tooronga Park wetland)"
    },
    {
        "category": "Ecological health",
        "priority": "Diamond Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Yarra Flats"
    },
    {
        "category": "Ecological health",
        "priority": "Elster Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Redan Wetlands and Yarrowee River"
    },
    {
        "category": "Ecological health",
        "priority": "Werribee River"
    },
    {
        "category": "Ecological health",
        "priority": "Darebin Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Merri Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Gardiners Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Derwent River"
    },
    {
        "category": "Ecological health",
        "priority": "Tamar Estuary"
    },
    {
        "category": "Ecological health",
        "priority": "Onkaparinga River"
    },
    {
        "category": "Ecological health",
        "priority": "Pedler Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Brownhill Creek"
    },
    {
        "category": "Ecological health",
        "priority": "Port River"
    },
    {
        "category": "Ecological health",
        "priority": "Sturt River"
    },
    {
        "category": "Ecological health",
        "priority": "Swan and Canning Rivers"
    },
    {
        "category": "Ecological health",
        "priority": "Darwin creeks (Rapid Creek, Mitchell Creek, Ludmilla Creek and Sandy Creek)"
    },
    {
        "category": "River health",
        "priority": "Saltwater Creek, Cairns"
    },
    {
        "category": "River health",
        "priority": "Bulimba Creek"
    },
    {
        "category": "River health",
        "priority": "Cubberla Creek"
    },
    {
        "category": "River health",
        "priority": "Bremer River"
    },
    {
        "category": "River health",
        "priority": "Saltwater Creek, Gold Coast"
    },
    {
        "category": "River health",
        "priority": "Fig Tree Creek, Yeppoon"
    },
    {
        "category": "River health",
        "priority": "Downfall Creek"
    },
    {
        "category": "River health",
        "priority": "Dowse Lagoon"
    },
    {
        "category": "River health",
        "priority": "McCready's Creek, Mackay"
    },
    {
        "category": "River health",
        "priority": "Slacks Creek"
    },
    {
        "category": "River health",
        "priority": "Lake Macquarie"
    },
    {
        "category": "River health",
        "priority": "Hawkesbury River"
    },
    {
        "category": "River health",
        "priority": "Tuggerah Lakes"
    },
    {
        "category": "River health",
        "priority": "Shoalhaven and Crookshaven Rivers"
    },
    {
        "category": "River health",
        "priority": "Cooks River"
    },
    {
        "category": "River health",
        "priority": "Canberra Waterways"
    },
    {
        "category": "River health",
        "priority": "Peter Hopper Lake"
    },
    {
        "category": "River health",
        "priority": "Moonee Ponds Creek"
    },
    {
        "category": "River health",
        "priority": "Karaaf Wetlands"
    },
    {
        "category": "River health",
        "priority": "KooyongKoot (Tooronga Park wetland)"
    },
    {
        "category": "River health",
        "priority": "Diamond Creek"
    },
    {
        "category": "River health",
        "priority": "Yarra Flats"
    },
    {
        "category": "River health",
        "priority": "Elster Creek"
    },
    {
        "category": "River health",
        "priority": "Redan Wetlands and Yarrowee River"
    },
    {
        "category": "River health",
        "priority": "Werribee River"
    },
    {
        "category": "River health",
        "priority": "Darebin Creek"
    },
    {
        "category": "River health",
        "priority": "Merri Creek"
    },
    {
        "category": "River health",
        "priority": "Gardiners Creek"
    },
    {
        "category": "River health",
        "priority": "Derwent River"
    },
    {
        "category": "River health",
        "priority": "Tamar Estuary"
    },
    {
        "category": "River health",
        "priority": "Onkaparinga River"
    },
    {
        "category": "River health",
        "priority": "Pedler Creek"
    },
    {
        "category": "River health",
        "priority": "Brownhill Creek"
    },
    {
        "category": "River health",
        "priority": "Port River"
    },
    {
        "category": "River health",
        "priority": "Sturt River"
    },
    {
        "category": "River health",
        "priority": "Swan and Canning Rivers"
    },
    {
        "category": "River health",
        "priority": "Darwin creeks (Rapid Creek, Mitchell Creek, Ludmilla Creek and Sandy Creek)"
    }
];

for (var i = 0; i < mus.length; i++) {
    let mu = db.managementUnit.findOne({name:mus[i]});
    print("Checking priorities for "+mu.name);
    let changed = false;
    for (let j=0; j<priorities.length; j++) {
        let found = false;
        for (let k=0; k<mu.priorities.length; k++) {
            if (mu.priorities[k].category == priorities[j].category && mu.priorities[k].priority == priorities[j].priority) {
                print("Already exists: " + priorities[j].priority);
                found = true;
                break;
            }
        }
        if (!found) {
            mu.priorities.push(priorities[j]);
            changed = true;
        }
    }
    if (changed) {
        print("Saving: " + mu.name);
        db.managementUnit.replaceOne({_id:mu._id}, mu);
    }

}
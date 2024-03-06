var mus = [
    {mu:'Northern Territory', priorities: ['Darwin (Rapid Creek, Mitchell Creek, Ludmilla Creek and Sandy Creek)']},
    {mu:'Corangamite', priorities: ['Kaaraf Wetlands', 'Redan Wetlands and Yarrowee River']},
    {mu:'Swan Region', priorities: ['Swan and Canning Rivers - Swan River at Bayswater', 'Swan and Canning Rivers - Swan/Canning Estuary Foreshore', 'Swan and Canning Rivers – Canning River and tributaries']},
    {mu:'Fitzroy', priorities: ['Fig Tree Creek, Yeppoon']},
    {mu:'Mackay Whitsunday', priorities: ['McCready\'s Creek, Mackay']},
    {mu:'Adelaide and Mount Lofty Ranges', priorities: ['Onkaparinga River (a)', 'Pedler Creek', 'Brownhill Keswick Creeks (a)', 'Brownhill Creek (b)', 'Port River Foreshore - shoreline', 'Port River Estuary', 'Onkaparinga River (b)', 'Sturt River - Warrappendi', 'Sturt River - Riverside Drive', 'Sturt River - Oxbow']},
    {mu:'South NRM Region', priorities: ['Derwent River', 'Tamar Estuary']},
    {mu:'Port Phillip and Western Port', priorities: ['Peter Hopper Lake', 'Moonee Ponds Creek (a) - Maribyrnong', 'Moonee Ponds Creek (b) – Strathmore to Pascoe Vale', 'KooyongKoot (Tooronga Park wetland)', 'Diamond Creek', 'Yarra Flats', 'Elster Creek', 'Werribee River', 'Darebin Creek', 'Merri Creek', 'Gardiners Creek / KooongKoot waterway']},
    {mu:'ACT', priorities: ['ACT Urban Waterways', 'Jerrabomberra Creek']},
    {mu:'South West Queensland', priorities: ['Bulimba Creek', 'Cubberla Creek', 'Bremer River, Ipswich', 'Saltwater Creek, Gold Coast', 'Downfall Creek', 'Dowse Lagoon', 'Brisbane River', 'Slacks Creek']},
    {mu:'Wet Tropics', priorities: ['Saltwater Creek, Cairns']},
    {mu:'Hunter', priorities: ['Lake Macquarie (Waterways of Dora Creek, Cockle Creek and Slatey Creek)']},
    {mu:'Greater Sydney', priorities: ['Hawkesbury River', 'Tuggerah Lakes', 'Cooks River']},
    {mu:'South East NSW', priorities:['Shoalhaven and Crookshaven Rivers']},
];

const category = 'Waterways';

for (var i = 0; i < mus.length; i++) {
    let mu = db.managementUnit.findOne({name:mus[i].mu});
    print("Checking priorities for "+mu.name);

    // Remove other "Waterways" priorities

    let changed = false;
    for (let j=0; j<mus[i].priorities.length; j++) {
        let found = false;
        for (let k=0; k<mu.priorities.length; k++) {
            if (mu.priorities[k].category == category && mu.priorities[k].priority == mus[i].priorities[j].priority) {
                print("Already exists: " + priorities[j].priority);
                found = true;
                break;
            }

        }
        if (!found) {
            mu.priorities.push({category:category, priority:mus[i].priorities[j]});
            changed = true;
        }
    }
    if (changed) {
        print("Saving: " + mu.name);
        db.managementUnit.replaceOne({_id:mu._id}, mu);
    }

}
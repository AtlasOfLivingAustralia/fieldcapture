if (db.investmentPriority.count() == 0) {

    const investmentPriorities = [
        {
            "investmentPriorityId": "ip1",
            "categories": ["Ramsar"],
            "type": "Ramsar",
            "name": "Ginini Flats Wetland Complex"
        },
        {
            "investmentPriorityId": "ip2",
            "categories": ["Threatened Species"],
            "type": "species",
            "name": "Anthochaera phrygia"
        },
        {
            "investmentPriorityId": "ip3",
            "categories": ["Threatened Species"],
            "type": "species",
            "name": "Bettongia gaimardi"
        },
        {
            "investmentPriorityId": "ip4",
            "categories": ["Threatened Species"],
            "type": "species",
            "name": "Botaurus poiciloptilus"
        },
        {
            "investmentPriorityId": "ip5",
            "categories": ["Threatened Species"],
            "type": "species",
            "name": "Lathamus discolor"
        },
        {
            "investmentPriorityId": "ip6",
            "categories": ["Threatened Species"],
            "type": "species",
            "name": "Rutidosis leptorrhynchoides"
        },
        {
            "investmentPriorityId": "ip7",
            "categories": ["Threatened Species"],
            "type": "species",
            "name": "Swainsona recta"
        },
        {
            "investmentPriorityId": "ip8",
            "categories": ["Threatened Ecological Communities"],
            "type": "tec",
            "name": "Alpine Sphagnum Bogs and Associated Fens"
        },
        {
            "investmentPriorityId": "ip9",
            "categories": ["Threatened Ecological Communities"],
            "type": "tec",
            "name": "Natural Temperate Grassland of the South Eastern Highlands"
        },
        {
            "investmentPriorityId": "ip10",
            "categories": ["Threatened Ecological Communities"],
            "type": "tec",
            "name": "White Box-Yellow Box-Blakely's Red Gum Grassy Woodland and Derived Native Grassland"
        },
        {
            "investmentPriorityId": "ip11",
            "categories": ["Soil Quality", "Land Management"],
            "type":"agricultural",
            "name": "Soil acidification"
        },
        {
            "investmentPriorityId": "ip12",
            "categories": ["Soil Quality"],
            "type":"agricultural",
            "name": "Soil Carbon priority"
        },
        {
            "investmentPriorityId": "ip13",
            "categories": ["Soil Quality"],
            "type":"agricultural",
            "name": "Hillslope erosion priority"
        },
        {
            "investmentPriorityId": "ip14",
            "categories": ["Soil Quality"],
            "type":"agricultural",
            "name": "Wind erosion priority"
        },
        {
            "investmentPriorityId": "ip16",
            "categories": ["Land Management"],
            "type":"agricultural",
            "name": "Soil carbon"
        },
        {
            "investmentPriorityId": "ip17",
            "categories": ["Land Management"],
            "type":"agricultural",
            "name": "Hillslope erosion"
        },
        {
            "investmentPriorityId": "ip18",
            "categories": ["Land Management"],
            "type":"agricultural",
            "name": "Wind erosion"
        },
        {
            "investmentPriorityId": "ip19",
            "categories": ["Land Management"],
            "type":"agricultural",
            "name": "Native vegetation and biodiversity on-farm"
        },
        {
            "investmentPriorityId": "ip20",
            "categories": ["Sustainable Agriculture"],
            "type":"agricultural",
            "name": "Climate change adaptation"
        },
        {
            "investmentPriorityId": "ip21",
            "categories": ["Sustainable Agriculture"],
            "type":"agricultural",
            "name": "Market traceability"
        }
    ];

    for (let i = 0; i < investmentPriorities.length; i++) {
        var investmentPriority = investmentPriorities[i];
        investmentPriority.status = 'active';
        db.investmentPriority.insertOne(investmentPriority);
    }
}
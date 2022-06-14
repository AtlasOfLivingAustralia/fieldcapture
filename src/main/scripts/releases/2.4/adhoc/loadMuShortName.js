
var mus = [
    {name: "ACT", shortName:"MU02", geographicInfo: {primaryState:"ACT"}},
    {name: "Northern Territory", shortName:"MU03", geographicInfo: {primaryState:"NT"}},
    {name: "Central Tablelands", shortName:"MU04", geographicInfo: {primaryState:"NSW"}},
    {name: "Central West", shortName: "MU05", geographicInfo: {primaryState:"NSW"}},
    {name: "Greater Sydney", shortName:"MU06", geographicInfo: {primaryState:"NSW"}},
    {name: "Hunter", shortName:"MU07", geographicInfo: {primaryState:"NSW"}},
    {name: "Murray", shortName:"MU08", geographicInfo: {primaryState:"NSW"}},
    {name: "Northern Tablelands", shortName:"MU09", geographicInfo: {primaryState:"NSW"}},
    {name: "North West NSW", shortName:"MU10", geographicInfo: {primaryState:"NSW"}},
    {name: "North Coast", shortName:"MU11", geographicInfo: {primaryState:"NSW"}},
    {name: "Riverina", shortName:"MU12", geographicInfo: {primaryState:"NSW"}},
    {name: "South East NSW", shortName:"MU13", geographicInfo: {primaryState:"NSW"}},
    {name: "Western", shortName:"MU14", geographicInfo: {primaryState:"NSW"}},
    {name: "Alinytjara Wilurara", shortName:"MU15", geographicInfo: {primaryState:"SA"}},
    {name: "Eyre Peninsula", shortName:"MU16", geographicInfo: {primaryState:"SA"}},
    {name: "Kangaroo Island", shortName:"MU17", geographicInfo: {primaryState:"SA"}},
    {name: "Adelaide and Mount Lofty Ranges", shortName:"MU18", geographicInfo: {primaryState:"SA"}},
    {name: "South Australian Murray Darling Basin", shortName:"MU19", geographicInfo: {primaryState:"SA"}},
    {name: "Northern and Yorke", shortName:"MU20", geographicInfo: {primaryState:"SA"}},
    {name: "South Australian Arid Lands", shortName:"MU21", geographicInfo: {primaryState:"SA"}},
    {name: "South East", shortName:"MU22", geographicInfo: {primaryState:"SA"}},
    {name: "Corangamite", shortName:"MU23", geographicInfo: {primaryState:"VIC"}},
    {name: "East Gippsland", shortName:"MU24", geographicInfo: {primaryState:"VIC"}},
    {name: "Glenelg Hopkins", shortName:"MU25", geographicInfo: {primaryState:"VIC"}},
    {name: "Goulburn Broken", shortName:"MU26", geographicInfo: {primaryState:"VIC"}},
    {name: "Mallee", shortName:"MU27", geographicInfo: {primaryState:"VIC"}},
    {name: "North Central", shortName:"MU28", geographicInfo: {primaryState:"VIC"}},
    {name: "North East", shortName:"MU29", geographicInfo: {primaryState:"VIC"}},
    {name: "Port Phillip and Western Port", shortName:"MU30", geographicInfo: {primaryState:"VIC"}},
    {name: "West Gippsland", shortName:"MU31", geographicInfo: {primaryState:"VIC"}},
    {name: "Wimmera", shortName:"MU32", geographicInfo: {primaryState:"VIC"}},
    {name: "Avon River Basin", shortName:"MU33", geographicInfo: {primaryState:"WA"}},
    {name: "Northern Agricultural Region", shortName:"MU34", geographicInfo: {primaryState:"WA"}},
    {name: "Peel-Harvey Region", shortName:"MU35", geographicInfo: {primaryState:"WA"}},
    {name: "Rangelands Region", shortName:"MU36", geographicInfo: {primaryState:"WA"}},
    {name: "South Coast Region", shortName:"MU37", geographicInfo: {primaryState:"WA"}},
    {name: "South West Region", shortName:"MU38", geographicInfo: {primaryState:"WA"}},
    {name: "Swan Region", shortName:"MU39", geographicInfo: {primaryState:"WA"}},
    {name: "North West NRM Region", shortName:"MU40", geographicInfo: {primaryState:"TAS"}},
    {name: "North NRM Region", shortName:"MU41", geographicInfo: {primaryState:"TAS"}},
    {name: "South NRM Region", shortName:"MU42", geographicInfo: {primaryState:"TAS"}},
    {name: "Burdekin", shortName:"MU43", geographicInfo: {primaryState:"QLD"}},
    {name: "Burnett Mary", shortName:"MU44", geographicInfo: {primaryState:"QLD"}},
    {name: "Cape York", shortName:"MU45", geographicInfo: {primaryState:"QLD"}},
    {name: "Condamine", shortName:"MU46", geographicInfo: {primaryState:"QLD"}},
    {name: "Desert Channels", shortName:"MU47", geographicInfo: {primaryState:"QLD"}},
    {name: "Fitzroy", shortName:"MU48", geographicInfo: {primaryState:"QLD"}},
    {name: "Mackay Whitsunday", shortName:"MU49", geographicInfo: {primaryState:"QLD"}},
    {name: "Maranoa Balonne and Border Rivers", shortName:"MU50", geographicInfo: {primaryState:"QLD"}},
    {name: "Northern Gulf", shortName:"MU51", geographicInfo: {primaryState:"QLD"}},
    {name: "South East Queensland", shortName:"MU52", geographicInfo: {primaryState:"QLD"}},
    {name: "Southern Gulf", shortName:"MU53", geographicInfo: {primaryState:"QLD"}},
    {name: "South West Queensland", shortName:"MU54", geographicInfo: {primaryState:"QLD"}},
    {name: "Wet Tropics", shortName:"MU56", geographicInfo: {primaryState:"QLD"}}
];


mus.forEach(function (mu) {
    var muExist = db.managementUnit.find({name: mu.name});
    while (muExist.hasNext()) {
        var mgUnit = muExist.next();
        mgUnit.shortName = mu.shortName
        mgUnit.geographicInfo = mu.geographicInfo
        db.managementUnit.save(mgUnit);
    }
});


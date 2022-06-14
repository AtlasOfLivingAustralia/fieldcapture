
var mus = [
    {name: "ACT", shortName:"MU02"},
    {name: "Northern Territory", shortName:"MU03"},
    {name: "Central Tablelands", shortName:"MU04"},
    {name: "Central West", shortName: "MU05"},
    {name: "Greater Sydney", shortName:"MU06"},
    {name: "Hunter", shortName:"MU07"},
    {name: "Murray", shortName:"MU08"},
    {name: "Northern Tablelands", shortName:"MU09"},
    {name: "North West NSW", shortName:"MU10"},
    {name: "North Coast", shortName:"MU11"},
    {name: "Riverina", shortName:"MU12"},
    {name: "South East NSW", shortName:"MU13"},
    {name: "Western", shortName:"MU14"},
    {name: "Alinytjara Wilurara", shortName:"MU15"},
    {name: "Eyre Peninsula", shortName:"MU16"},
    {name: "Kangaroo Island", shortName:"MU17"},
    {name: "Adelaide and Mount Lofty Ranges", shortName:"MU18"},
    {name: "South Australian Murray Darling Basin", shortName:"MU19"},
    {name: "Northern and Yorke", shortName:"MU20"},
    {name: "South Australian Arid Lands", shortName:"MU21"},
    {name: "South East", shortName:"MU22"},
    {name: "Corangamite", shortName:"MU23"},
    {name: "East Gippsland", shortName:"MU24"},
    {name: "Glenelg Hopkins", shortName:"MU25"},
    {name: "Goulburn Broken", shortName:"MU26"},
    {name: "Mallee", shortName:"MU27"},
    {name: "North Central", shortName:"MU28"},
    {name: "North East", shortName:"MU29"},
    {name: "Port Phillip and Western Port", shortName:"MU30"},
    {name: "West Gippsland", shortName:"MU31"},
    {name: "Wimmera", shortName:"MU32"},
    {name: "Avon River Basin", shortName:"MU33"},
    {name: "Northern Agricultural Region", shortName:"MU34"},
    {name: "Peel-Harvey Region", shortName:"MU35"},
    {name: "Rangelands Region", shortName:"MU36"},
    {name: "South Coast Region", shortName:"MU37"},
    {name: "South West Region", shortName:"MU38"},
    {name: "Swan Region", shortName:"MU39"},
    {name: "North West NRM Region", shortName:"MU40"},
    {name: "North NRM Region", shortName:"MU41"},
    {name: "South NRM Region", shortName:"MU42"},
    {name: "Burdekin", shortName:"MU43"},
    {name: "Burnett Mary", shortName:"MU44"},
    {name: "Cape York", shortName:"MU45"},
    {name: "Condamine", shortName:"MU46"},
    {name: "Desert Channels", shortName:"MU47"},
    {name: "Fitzroy", shortName:"MU48"},
    {name: "Mackay Whitsunday", shortName:"MU49"},
    {name: "Maranoa Balonne and Border Rivers", shortName:"MU50"},
    {name: "Northern Gulf", shortName:"MU51"},
    {name: "South East Queensland", shortName:"MU52"},
    {name: "Southern Gulf", shortName:"MU53"},
    {name: "South West Queensland", shortName:"MU54"},
    {name: "Wet Tropics", shortName:"MU56"}
];


mus.forEach(function (mu){
    var muExist = db.managementUnit.find({name: mu.name});
    while (muExist.hasNext()) {
        var mgUnit = muExist.next();
        mgUnit.shortName = mu.shortName
        db.managementUnit.save(mgUnit);
    }
});


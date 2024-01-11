
var priorities = [
    {
        "category": "Agriculture Sector Adopting Practices",
        "priority": "Climate change adaptation"
    },
    {
        "category": "Agriculture Sector Adopting Practices",
        "priority": "On-farm emissions reduction practices"
    },
    {
        "category": "Agriculture Sector",
        "priority": "Carbon and biodiversity market information"
    },
    {
        "category": "Agriculture Sector",
        "priority": "Sustainability framework engagement"
    },
    {
        "category": "Agriculture Sector",
        "priority": "Market access and traceability"
    },
    {
        "category": "Farmer Sector",
        "priority": "Native vegetation and biodiversity on-farm"
    },
    {
        "category": "Farmer Sector",
        "priority": "Soil carbon"
    },
    {
        "category": "Farmer Sector",
        "priority": "Soil erosion"
    },
    {
        "category": "Farmer Sector",
        "priority": "Soil acidification"
    },
    {
        "category": "Farmer Sector",
        "priority": "Sustainable agriculture practices"
    }
];

var stateManagementUnitNames = [
    "ACT",
    "Northern Territory",
    "Central Tablelands",
    "Central West",
    "Greater Sydney",
    "Hunter",
    "Murray",
    "Northern Tablelands",
    "North West",
    "North Coast",
    "Riverina",
    "South East NSW",
    "Western",
    "Alinytjara Wilurara",
    "Eyre Peninsula",
    "Kangaroo Island",
    "Adelaide and Mount Lofty Ranges",
    "South Australian Murray Darling Basin",
    "Northern and Yorke",
    "South Australian Arid Lands",
    "South East",
    "Corangamite",
    "East Gippsland",
    "Glenelg Hopkins",
    "Goulburn Broken",
    "Mallee",
    "North Central",
    "North East",
    "Port Phillip and Westernport",
    "West Gippsland",
    "Wimmera",
    "Avon River Basin",
    "Northern Agricultural Region",
    "Peel-Harvey",
    "Rangelands Region",
    "South Coast Region",
    "South West Region",
    "Swan Region",
    "North West NRM Region",
    "North NRM Region",
    "South NRM Region",
    "Burdekin",
    "Burnett Mary",
    "Cape York",
    "Desert Channels",
    "Fitzroy",
    "Mackay Whitsunday",
    "Northern Gulf",
    "South East Queensland",
    "Southern Gulf",
    "Wet Tropics",
    "Southern Queensland"
];

var mus = db.managementUnit.find();
while(mus.hasNext()){
    var m = mus.next();
    db.managementUnit.updateOne({name:m.name},{$push:{"priorities": {$each : priorities}}});
}
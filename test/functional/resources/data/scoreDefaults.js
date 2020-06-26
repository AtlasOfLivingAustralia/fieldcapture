//Default for Total new area treated for weeds (Ha) for Weed Treatment Details - All Programme
var scoreWeedHaDefaults = {
    create: function(){
        return {
            "_id":10,

    "category":"Invasive Species Management - Weeds",
    "configuration":
{"childAggregations": [
    {"childAggregations": [
        {"childAggregations": [
            {"label":"Total new area treated for weeds (Ha)",
                "property":"data.areaTreatedHa",
                "type":"SUM"
            }
            ],
            "filter":
                {"buckets":null,
                    "filterValue":"Initial treatment",
                    "format":null,
                    "label":null,
                    "property":"data.treatmentEventType",
                    "type":"filter"
                },
            "label":"Total new area treated for weeds (Ha)",
            "type":null
        }],
        "filter":
            {"buckets":null,
                "filterValue":"Weed Treatment Details",
                "format":null,
                "label":null,
                "property":"name",
                "type":"filter"
            },
        "label":"Total new area treated for weeds (Ha)",
        "type":null
    },
     {"childAggregations":[
         {"label":"Total new area treated for weeds (Ha)",
            "property":"data.areaTreatedHa",
            "type":"SUM"
         }],
        "filter":{
            "buckets":null,
            "filterValue":"Output Details",
            "format":null,
            "label":null,
            "property":"name",
            "type":"filter"
        },
        "label":"Total new area treated for weeds (Ha)",
        "type":null
     },
     {"childAggregations": [
         {"childAggregations": [
             {"label":"Total new area treated for weeds (Ha)",
                 "property":"data.scores.score",
                 "type":"SUM"
             }],
            "filter": {
                "buckets":null,
                "filterValue":"Total new area treated (Ha)",
                "format":null,
                "label":null,
                "property":"data.scores.scoreLabel",
                "type":"filter"
            },
            "label":"Total new area treated for weeds (Ha)","type":null}],
            "filter":{
                "buckets":null,
                "filterValue":"Upload of stage 1 and 2 reporting data",
                "format":null,
                "label":null,
                "property":"name",
                "type":"filter"
            },
            "label":"Total new area treated for weeds (Ha)",
         "type":null
     },
     {"childAggregations":
             [{
                 "label":"Total new area treated for weeds (Ha)",
                 "property":"data.areaTreatedHa",
                 "type":"SUM"
             }],
            "filter":{
                "buckets":null,
                "filterValue":"2. Community Grants Reporting",
                "format":null,
                "label":null,
                "property":"name",
                "type":"filter"
            },
            "label":"Total new area treated for weeds (Ha)",
            "type":null
     }],
    "label":"Total new area treated for weeds (Ha)",
    "type":null
},
"description":"The total area of weeds for which an initial treatment was undertaken.",
"entity":"au.org.ala.ecodata.Activity",
"entityTypes":
    [
        "Site Preparation",
        "Weed Treatment",
        "25th Anniversary Landcare Grants - Final Report","Upload of stage 1 and 2 reporting data",
        "Community Grants"
    ],
"isOutputTarget":true,
"label":"Total new area treated for weeds (Ha)",
"outputType":"Weed Treatment Details",
"scoreId":"",
"status":"active",
"externalId":"WDT WDT25ALG WDT25ALG"
}}};
// for Invasive Species Management - Pests & Diseases

var scoreInvasiveSpeciesDefaults = {
    create: function(){
        return {
            "_id" : 40,
            "category" : "Invasive Species Management - Pests & Diseases",
            "configuration" : {
            "childAggregations" : [
                {
                    "childAggregations" : [
                        {
                            "label" : "Area covered (Ha) by pest treatment actions",
                            "property" : "data.totalAreaTreatedHa",
                            "type" : "SUM"
                        }
                    ],
                    "filter" : {
                        "buckets" : null,
                        "filterValue" : "Pest Management Details",
                        "format" : null,
                        "label" : null,
                        "property" : "name",
                        "type" : "filter"
                    },
                    "label" : "Area covered (Ha) by pest treatment actions",
                    "type" : null
                },
                {
                    "childAggregations" : [
                        {
                            "label" : "Area covered (Ha) by pest treatment actions",
                            "property" : "data.totalAreaTreatedHa",
                            "type" : "SUM"
                        }
                    ],
                    "filter" : {
                        "buckets" : null,
                        "filterValue" : "Output Details",
                        "format" : null,
                        "label" : null,
                        "property" : "name",
                        "type" : "filter"
                    },
                    "label" : "Area covered (Ha) by pest treatment actions",
                    "type" : null
                },
                {
                    "childAggregations" : [
                        {
                            "childAggregations" : [
                                {
                                    "label" : "Area covered (Ha) by pest treatment actions",
                                    "property" : "data.scores.score",
                                    "type" : "SUM"
                                }
                            ],
                            "filter" : {
                                "buckets" : null,
                                "filterValue" : "Area covered (Ha) by pest treatment",
                                "format" : null,
                                "label" : null,
                                "property" : "data.scores.scoreLabel",
                                "type" : "filter"
                            },
                            "label" : "Area covered (Ha) by pest treatment actions",
                            "type" : null
                        }
                    ],
                    "filter" : {
                        "buckets" : null,
                        "filterValue" : "Upload of stage 1 and 2 reporting data",
                        "format" : null,
                        "label" : null,
                        "property" : "name",
                        "type" : "filter"
                    },
                    "label" : "Area covered (Ha) by pest treatment actions",
                    "type" : null
                },
                {
                    "childAggregations" : [
                        {
                            "label" : "Area covered (Ha) by pest treatment actions",
                            "property" : "data.totalAreaTreatedHa",
                            "type" : "SUM"
                        }
                    ],
                    "filter" : {
                        "buckets" : null,
                        "filterValue" : "2. Community Grants Reporting",
                        "format" : null,
                        "label" : null,
                        "property" : "name",
                        "type" : "filter"
                    },
                    "label" : "Area covered (Ha) by pest treatment actions",
                    "type" : null
                },
                {
                    "childAggregations" : [
                        {
                            "label" : "Area covered (Ha) by pest treatment actions",
                            "property" : "data.totalPestAreaTreatedHa",
                            "type" : "SUM"
                        }
                    ],
                    "filter" : {
                        "buckets" : null,
                        "filterValue" : "Post revegetation pest management",
                        "format" : null,
                        "label" : null,
                        "property" : "name",
                        "type" : "filter"
                    },
                    "label" : "Area covered (Ha) by pest treatment actions",
                    "type" : null
                }
            ],
                "label" : "Area covered (Ha) by pest treatment actions",
                "type" : null
        },
            "description" : "The total area over which pest treatment activities have been undertaken.",
            "entity" : "au.org.ala.ecodata.Activity",
            "entityTypes" : [
            "Pest Management",
            "25th Anniversary Landcare Grants - Final Report",
            "Upload of stage 1 and 2 reporting data",
            "Community Grants",
            "Post revegetation site management"
        ],
            "isOutputTarget" : true,
            "label" : "Area covered (Ha) by pest treatment actions",
            "outputType" : "Pest Management Details",
            "scoreId" : "score_4",
            "status" : "active",
            "externalId" : "PMA PMA25ALG PMA25ALG PMA"
 }}};

print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: "+pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');

createProject({name:'project 1', projectId:"project_1", programId:'program_1',managementUnitId:"mu_1", grantId:"RLP-Test-Program-Project-1",
    outputTargets:[
        {"outputLabel":"Weed Treatment Details",
            "scoreName":"areaTreatedHa",
            "target":"10",
            "unit":"Ha",
            "scoreLabel":"Total new area treated for weeds (Ha)",
            "scoreId":"score_1"
        }
        ]
});

createProject({name:'project 2', projectId:"project_2", programId:'program_2',managementUnitId:"mu_2", grantId:"RLP-Test-Program-Project-2",
    outputTargets:[
        {"outputLabel":"Weed Treatment Details",
            "scoreName":"areaTreatedHa",
            "target":"10",
            "unit":"Ha",
            "scoreLabel":"Total new area treated for weeds (Ha)",
            "scoreId":"score_1"
        }
    ]
});
createProject({name:'project 3', projectId:"project_3", programId:'program_3',managementUnitId:"mu_3", grantId:"RLP-Test-Program-Project-3",
    outputTargets:[
        {"outputLabel":"Weed Treatment Details",
            "scoreName":"areaTreatedHa",
            "target":"10","unit":"Ha",
            "scoreLabel":"Total new area treated for weeds (Ha)",
            "scoreId":"score_1"
        }
    ]
});


createProject({name:'project 4', projectId:"project_4", programId:'program_1',managementUnitId:"mu_1", grantId:"RLP-Test-Program-Project-1",
    associatedProgram: "National Landcare Programme",
    associatedSubProgram: "Regional Funding",
    planStatus: "approved",
    outputTargets:[
        {"outputLabel":"Pest Management Details",
            "target":"600",
            "scoreLabel":"Area covered (Ha) by pest treatment actions",
            "scoreId":"score_4",
            "scoreName":"totalAreaTreatedHa",
            "unit":"Ha",
        }
    ],
    custom:{"details":
            {
                "objectives":
                    {
                        "rows1": [
                            {
                                "assets": [
                                    "Natural/Cultural assets managed",
                                    "Threatened Species",
                                    "Threatened Ecological Communities",
                                    "World Heritage area",
                                    "Community awareness/participation in NRM",
                                    "Remnant Vegetation"
                                ],
                                "description": "By June 2018, engage 170 individuals (including Indigenous members) towards NRM awareness and skills relating to Ramsar and World Heritage areas, EPBC species and communities as measured by engagement evaluations (Strategic Objective 3)\n"
                            },
                            {
                                "assets": [
                                    "Natural/Cultural assets managed",
                                    "Threatened Species",
                                    "Threatened Ecological Communities",
                                    "World Heritage area",
                                    "Community awareness/participation in NRM",
                                    "Remnant Vegetation"
                                ],
                                "description": "By 2018, implement actions towards 30 Ha of improved habitat in 1 inland Ramsar site and World Heritage areas, and implement recovery actions for 10 EPBC listed flora species or communities as measured by partner evaluations and Natural Values Atlas data entry. (Strategic objective 4)"
                            }
                        ]
                    },
                "status": "active",
                "budget": {
                    "overallTotal" : 566668,
                    "headers" : [
                        {
                            "data" : "2014/2015"
                        },
                        {
                            "data" : "2015/2016"
                        },
                        {
                            "data" : "2016/2017"
                        },
                        {
                            "data" : "2017/2018"
                        }
                    ],
                    "rows" : [
                        {
                            "costs" : [
                                {
                                    "dollar" : "38626"
                                },
                                {
                                    "dollar" : "79616"
                                },
                                {
                                    "dollar" : "83470"
                                },
                                {
                                    "dollar" : "85557"
                                }
                            ],
                            "rowTotal" : 287269,
                            "description" : "RLF - Project Implementation - facilitate and coordinate the sharing of skills between the Board and farming groups, schools, and community groups.  Provide feedback to the Australian Government on emerging issues",
                            "shortLabel" : "Farmers and fishers are increasing their long term returns through better management of the natural resource base"
                        },
                        {
                            "costs" : [
                                {
                                    "dollar" : "21374"
                                },
                                {
                                    "dollar" : "70384"
                                },
                                {
                                    "dollar" : "66530"
                                },
                                {
                                    "dollar" : "64443"
                                }
                            ],
                            "rowTotal" : 222731,
                            "description" : "RLF - Project Implementation - Assist and develop community Landcare and production groups; Contributes to farming system tours and crop walks with farming groups",
                            "shortLabel" : "Communities are involved in caring for their environment"
                        },
                        {
                            "costs" : [
                                {
                                    "dollar" : "6667"
                                },
                                {
                                    "dollar" : "16667"
                                },
                                {
                                    "dollar" : "16667"
                                },
                                {
                                    "dollar" : "16667"
                                }
                            ],
                            "rowTotal" : 56668,
                            "description" : "MERI & Admin - Monitoring activities, Admin Support, data compilation and distribution, field based assessments, interpreting effectiveness of the practices; evaluation of project participants at trial sites and workshops",
                            "shortLabel" : "MERI & Admin"
                        }
                    ],
                    "columnTotal" : [
                        {
                            "data" : 66667
                        },
                        {
                            "data" : 166667
                        },
                        {
                            "data" : 166667
                        },
                        {
                            "data" : 166667
                        }
                    ]
                }
            }}});
createProject({name:'project 5', projectId:"project_5", programId:'program_1',managementUnitId:"mu_1", grantId:"RLP-Test-Program-Project-1",
    associatedProgram: "National Landcare Programme",
    associatedSubProgram: "Regional Funding",
    planStatus: "approved",
    outputTargets:[
        {"outputLabel":"Pest Management Details",
            "target":"600",
            "scoreLabel":"Area covered (Ha) by pest treatment actions",
            "scoreId":"score_4",
            "scoreName":"totalAreaTreatedHa",
            "unit":"Ha",
        }
    ],
    custom:{"details":
            {
                "objectives":
                    {
                        "rows1": [
                            {
                                "assets": [
                                    "Natural/Cultural assets managed",
                                    "Threatened Species",
                                    "Threatened Ecological Communities",
                                    "World Heritage area",
                                    "Community awareness/participation in NRM",
                                    "Remnant Vegetation"
                                ],
                                "description": "By June 2018, engage 170 individuals (including Indigenous members) towards NRM awareness and skills relating to Ramsar and World Heritage areas, EPBC species and communities as measured by engagement evaluations (Strategic Objective 3)\n"
                            },
                            {
                                "assets": [
                                    "Natural/Cultural assets managed",
                                    "Threatened Species",
                                    "Threatened Ecological Communities",
                                    "World Heritage area",
                                    "Community awareness/participation in NRM",
                                    "Remnant Vegetation"
                                ],
                                "description": "By 2018, implement actions towards 30 Ha of improved habitat in 1 inland Ramsar site and World Heritage areas, and implement recovery actions for 10 EPBC listed flora species or communities as measured by partner evaluations and Natural Values Atlas data entry. (Strategic objective 4)"
                            }
                        ]
                    },
                "status": "active",
                "budget": {
                    "overallTotal" : 566668,
                    "headers" : [
                        {
                            "data" : "2014/2015"
                        },
                        {
                            "data" : "2015/2016"
                        },
                        {
                            "data" : "2016/2017"
                        },
                        {
                            "data" : "2017/2018"
                        }
                    ],
                    "rows" : [
                        {
                            "costs" : [
                                {
                                    "dollar" : "38626"
                                },
                                {
                                    "dollar" : "79616"
                                },
                                {
                                    "dollar" : "83470"
                                },
                                {
                                    "dollar" : "85557"
                                }
                            ],
                            "rowTotal" : 287269,
                            "description" : "RLF - Project Implementation - facilitate and coordinate the sharing of skills between the Board and farming groups, schools, and community groups.  Provide feedback to the Australian Government on emerging issues",
                            "shortLabel" : "Farmers and fishers are increasing their long term returns through better management of the natural resource base"
                        },
                        {
                            "costs" : [
                                {
                                    "dollar" : "21374"
                                },
                                {
                                    "dollar" : "70384"
                                },
                                {
                                    "dollar" : "66530"
                                },
                                {
                                    "dollar" : "64443"
                                }
                            ],
                            "rowTotal" : 222731,
                            "description" : "RLF - Project Implementation - Assist and develop community Landcare and production groups; Contributes to farming system tours and crop walks with farming groups",
                            "shortLabel" : "Communities are involved in caring for their environment"
                        },
                        {
                            "costs" : [
                                {
                                    "dollar" : "6667"
                                },
                                {
                                    "dollar" : "16667"
                                },
                                {
                                    "dollar" : "16667"
                                },
                                {
                                    "dollar" : "16667"
                                }
                            ],
                            "rowTotal" : 56668,
                            "description" : "MERI & Admin - Monitoring activities, Admin Support, data compilation and distribution, field based assessments, interpreting effectiveness of the practices; evaluation of project participants at trial sites and workshops",
                            "shortLabel" : "MERI & Admin"
                        }
                    ],
                    "columnTotal" : [
                        {
                            "data" : 66667
                        },
                        {
                            "data" : 166667
                        },
                        {
                            "data" : 166667
                        },
                        {
                            "data" : 166667
                        }
                    ]
                }
            }}});
createProject({name:'project 6', projectId:"project_6", programId:'program_1',managementUnitId:"mu_1", grantId:"RLP-Test-Program-Project-1",
    associatedProgram: "National Landcare Programme",
    associatedSubProgram: "Regional Funding",
    planStatus: "approved",
    outputTargets:[
        {"outputLabel":"Pest Management Details",
            "target":"600",
            "scoreLabel":"Area covered (Ha) by pest treatment actions",
            "scoreName":"totalAreaTreatedHa",
            "unit":"Ha",
            "scoreId":"score_4"
        }
    ],
    custom:{"details":
            {
                "objectives":
                    {
                        "rows1": [
                            {
                                "assets": [
                                    "Natural/Cultural assets managed",
                                    "Threatened Species",
                                    "Threatened Ecological Communities",
                                    "World Heritage area",
                                    "Community awareness/participation in NRM",
                                    "Remnant Vegetation"
                                ],
                                "description": "By June 2018, engage 170 individuals (including Indigenous members) towards NRM awareness and skills relating to Ramsar and World Heritage areas, EPBC species and communities as measured by engagement evaluations (Strategic Objective 3)\n"
                            },
                            {
                                "assets": [
                                    "Natural/Cultural assets managed",
                                    "Threatened Species",
                                    "Threatened Ecological Communities",
                                    "World Heritage area",
                                    "Community awareness/participation in NRM",
                                    "Remnant Vegetation"
                                ],
                                "description": "By 2018, implement actions towards 30 Ha of improved habitat in 1 inland Ramsar site and World Heritage areas, and implement recovery actions for 10 EPBC listed flora species or communities as measured by partner evaluations and Natural Values Atlas data entry. (Strategic objective 4)"
                            }
                        ]
                    },
                "status": "active",
                "budget": {
                    "overallTotal" : 566668,
                    "headers" : [
                        {
                            "data" : "2014/2015"
                        },
                        {
                            "data" : "2015/2016"
                        },
                        {
                            "data" : "2016/2017"
                        },
                        {
                            "data" : "2017/2018"
                        }
                    ],
                    "rows" : [
                        {
                            "costs" : [
                                {
                                    "dollar" : "38626"
                                },
                                {
                                    "dollar" : "79616"
                                },
                                {
                                    "dollar" : "83470"
                                },
                                {
                                    "dollar" : "85557"
                                }
                            ],
                            "rowTotal" : 287269,
                            "description" : "RLF - Project Implementation - facilitate and coordinate the sharing of skills between the Board and farming groups, schools, and community groups.  Provide feedback to the Australian Government on emerging issues",
                            "shortLabel" : "Farmers and fishers are increasing their long term returns through better management of the natural resource base"
                        },
                        {
                            "costs" : [
                                {
                                    "dollar" : "21374"
                                },
                                {
                                    "dollar" : "70384"
                                },
                                {
                                    "dollar" : "66530"
                                },
                                {
                                    "dollar" : "64443"
                                }
                            ],
                            "rowTotal" : 222731,
                            "description" : "RLF - Project Implementation - Assist and develop community Landcare and production groups; Contributes to farming system tours and crop walks with farming groups",
                            "shortLabel" : "Communities are involved in caring for their environment"
                        },
                        {
                            "costs" : [
                                {
                                    "dollar" : "6667"
                                },
                                {
                                    "dollar" : "16667"
                                },
                                {
                                    "dollar" : "16667"
                                },
                                {
                                    "dollar" : "16667"
                                }
                            ],
                            "rowTotal" : 56668,
                            "description" : "MERI & Admin - Monitoring activities, Admin Support, data compilation and distribution, field based assessments, interpreting effectiveness of the practices; evaluation of project participants at trial sites and workshops",
                            "shortLabel" : "MERI & Admin"
                        }
                    ],
                    "columnTotal" : [
                        {
                            "data" : 66667
                        },
                        {
                            "data" : 166667
                        },
                        {
                            "data" : 166667
                        },
                        {
                            "data" : 166667
                        }
                    ]
                }
            }}});


createProgram({name:'National Landcare Programme', programId:'program_1' });
createProgram({name:'Regional Land Partnerships', programId:'program_2' });
createProgram({name:'Regional Land Partnerships', programId:'program_3' });

createMu({name:'test mu', managementUnitId:"mu_1"});
createMu({name:'test mu', managementUnitId:"mu_2"});
createMu({name:'test mu', managementUnitId:"mu_3"});

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'program_1', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_1', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'mu_1', userId:'1', accessLevel:'admin'});

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'program_2', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_2', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'mu_2', userId:'1', accessLevel:'admin'});

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'program_3', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_3', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'mu_3', userId:'1', accessLevel:'admin'});

createScoreWeedHaDefaults({_id:35, scoreId: "score_1"});
// createScoreWeedHaDefaults({_id:36, scoreId: "score_2"});
// createScoreWeedHaDefaults({_id:37, scoreId: "score_3"});

createActivities({activityId:"activity_1", projectId:"project_1", type : "Managed for invasive weeds"});
createActivities({activityId:"activity_2", projectId:"project_2", type : "Managed for invasive weeds"});
createActivities({activityId:"activity_3", projectId:"project_3", type : "Managed for invasive weeds"});

createOutput({activityId:"activity_1", outputId:"output_1", data:{"linearAreaTreated":"1","areaTreatedHa":"10",
        "treatmentEventType":"Initial treatment"}});
createOutput({activityId:"activity_2", outputId:"output_2", data:{"linearAreaTreated":"1","areaTreatedHa":"10",
        "treatmentEventType":"Initial treatment"}})
createOutput({activityId:"activity_3", outputId:"output_3", data:{"linearAreaTreated":"1","areaTreatedHa":"10",
        "treatmentEventType":"Initial treatment"}});







//  // for Invasive Species Management - Pests & Diseases

createScoreInvasiveSpecies({_id: 39, scoreId:"score_4"});
// createScoreInvasiveSpecies({_id: 40, scoreId:"score_5"});
// createScoreInvasiveSpecies({_id: 41, scoreId:"score_6"});

createActivities({activityId:"activity_4", progress:"finished",projectId: "project_4", type:"Pest Management"});
createActivities({activityId:"activity_5", progress:"finished", projectId: "project_5", type:"Pest Management"});
createActivities({activityId:"activity_6", progress:"finished",projectId: "project_6", type:"Pest Management"});

createPestOutDataDefaults({activityId:"activity_4", outputId:"output_4"});
createPestOutDataDefaults({activityId:"activity_5", outputId:"output_5"});
createPestOutDataDefaults({activityId:"activity_6", outputId:"output_6"});

loadActivityForms();

//inserting setting homepage static 6 box only

var staticValue = "{\n" +
    "  \"statistics\": {\n" +
    "    \"ts1\": {\n" +
    "      \"config\": \"5\",\n" +
    "      \"title\": \"Threatened Species Strategy\",\n" +
    "      \"label\": \"Protecting threatened species\",\n" +
    "      \"units\": \"Projects\",\n" +
    "      \"type\": \"projectCount\",\n" +
    "      \"projectFilter\": [\n" +
    "        \"meriPlanAssetFacet:Threatened Species\"\n" +
    "      ]\n" +
    "    },\n" +
    "    \"nlp1\": {\n" +
    "      \"config\": \"5\",\n" +
    "      \"title\": \"National Landcare Programme\",\n" +
    "      \"label\": \"Supporting sustainable agriculture\",\n" +
    "      \"units\": \"Projects\",\n" +
    "      \"type\": \"investmentProjectCount\",\n" +
    "      \"projectFilter\": [\n" +
    "        \"associatedProgramFacet:National Landcare Programme\"\n" +
    "      ],\n" +
    "      \"investmentTypeFilter\": \"Farmers and fishers are increasing their long term returns through better management of the natural resource base\"\n" +
    "    },\n" +
    "    \"nlp7\": {\n" +
    "      \"config\": \"6\",\n" +
    "      \"title\": \"National Landcare Programme\",\n" +
    "      \"label\": \"That support World Heritage Areas\",\n" +
    "      \"units\": \"Projects\",\n" +
    "      \"type\": \"projectCount\",\n" +
    "      \"projectFilter\": [\n" +
    "        \"associatedProgramFacet:National Landcare Programme\",\n" +
    "        \"meriPlanAssetFacet:World Heritage area\"\n" +
    "      ]\n" +
    "    },\n" +
    "    \"nlp9\": {\n" +
    "      \"config\": \"2\",\n" +
    "      \"title\": \"National Landcare Programme\",\n" +
    "      \"label\": \"Targeted for weed control\",\n" +
    "      \"units\": \"Ha\",\n" +
    "      \"type\": \"outputTarget\",\n" +
    "      \"projectFilter\": [\n" +
    "        \"associatedProgramFacet:National Landcare Programme\"\n" +
    "      ],\n" +
    "      \"scoreLabel\":\"Total new area treated for weeds (Ha)\"\n" +
    "    },\n" +
    "    \"nlp13\": {\n" +
    "      \"config\": \"6\",\n" +
    "      \"title\": \"National Landcare Programme\",\n" +
    "      \"label\": \"Targeted for pest animal control\",\n" +
    "      \"units\": \"Ha\",\n" +
    "      \"type\": \"outputTarget\",\n" +
    "      \"projectFilter\": [\n" +
    "        \"associatedProgramFacet:National Landcare Programme\"\n" +
    "      ],\n" +
    "      \"scoreLabel\": \"Area covered (Ha) by pest treatment actions\"\n" +
    "    },\n" +
    "    \"all1\": {\n" +
    "      \"config\": \"3\",\n" +
    "      \"title\": \"All programmes\",\n" +
    "      \"label\": \"Managed for invasive weeds\",\n" +
    "      \"units\": \"Ha\",\n" +
    "      \"type\": \"score\",\n" +
    "      \"scoreLabel\": \"Total new area treated for weeds (Ha)\"\n" +
    "    }\n" +
    "  },\n" +
    "  \"groups\": [\n" +
    "    [\n" +
    "      \"ts1\",\n" +
    "      \"nlp1\",\n" +
    "      \"nlp7\",\n" +
    "      \"nlp9\",\n" +
    "      \"nlp13\",\n" +
    "      \"all1\"\n" +
    "    ]\n" +
    "  ]\n" +
    "}"

db.setting.insert({"key":"meritstatistics.config","value":staticValue, version: 3})

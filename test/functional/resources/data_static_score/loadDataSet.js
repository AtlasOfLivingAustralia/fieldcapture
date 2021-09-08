print("This script is expected to be executed with a working directory containing this script");
print("Current working dir: "+pwd());
load('../data_common/loadMeritHub.js');
load('../data_common/insertData.js');
load('../data/settingDefaults.js')

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
createProgram({name:'General Program', programId:'program_10' });

createMu({name:'test mu 1', managementUnitId:"mu_1"});
createMu({name:'test mu 2', managementUnitId:"mu_2"});
createMu({name:'test mu 3', managementUnitId:"mu_3"});
createMu({name:'test mu 10', managementUnitId:"mu_10"});

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'program_1', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_1', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'mu_1', userId:'1', accessLevel:'admin'});

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'program_2', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_2', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'mu_2', userId:'1', accessLevel:'admin'});

db.userPermission.insert({entityType:'au.org.ala.ecodata.Program', entityId:'program_3', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.Project', entityId:'project_3', userId:'1', accessLevel:'admin'});
db.userPermission.insert({entityType:'au.org.ala.ecodata.ManagementUnit', entityId:'mu_3', userId:'1', accessLevel:'admin'});

createScoreWeedHaDefaults({ scoreId: "score_1"});


createActivities({activityId:"activity_1", projectId:"project_1", type : "Managed for invasive weeds"});
createActivities({activityId:"activity_2", projectId:"project_2", type : "Managed for invasive weeds"});
createActivities({activityId:"activity_3", projectId:"project_3", type : "Managed for invasive weeds"});

createOutput({activityId:"activity_1", outputId:"output_1",
    data:
        {
            "linearAreaTreated":"1",
            "areaTreatedHa":"10",
            "treatmentEventType":"Initial treatment",

        }});
createOutput({activityId:"activity_2", outputId:"output_2", data:{"linearAreaTreated":"1","areaTreatedHa":"10",
        "treatmentEventType":"Initial treatment"}})
createOutput({activityId:"activity_3", outputId:"output_3", data:{"linearAreaTreated":"1","areaTreatedHa":"10",
        "treatmentEventType":"Initial treatment"}});

//  // for Invasive Species Management - Pests & Diseases

createScoreInvasiveSpecies({ scoreId:"score_4"});


createActivities({activityId:"activity_4", progress:"finished",projectId: "project_4", type:"Pest Management"});
createActivities({activityId:"activity_5", progress:"finished", projectId: "project_5", type:"Pest Management"});
createActivities({activityId:"activity_6", progress:"finished",projectId: "project_6", type:"Pest Management"});

createPestOutDataDefaults({activityId:"activity_4", outputId:"output_4"});
createPestOutDataDefaults({activityId:"activity_5", outputId:"output_5"});
createPestOutDataDefaults({activityId:"activity_6", outputId:"output_6"});

loadActivityForms();

createProjectNumberBaselineDataSets({ "scoreId":"score_42"});
createProjectNumberOfCommunicationMaterialsPublished({ "scoreId":"score_43"});
createProjectWeedAreaSurveyedHaDefault({ "scoreId":"score_44"});


createActivities({activityId: "activity_10", projectId: "project_10", type:"RLP Output Report", progress:"finished"});
createActivities({activityId: "activity_11", projectId: "project_10", type:"RLP Output Report", progress:"finished"});
createActivities({activityId: "activity_12", projectId: "project_10", type:"RLP Output Report", progress:"finished"});


createOutput({activityId:"activity_10", outputId:"output_10", name: "RLP - Baseline data",
    data:
        {
            "numberBaselineDataSets":"2"
        }
});
createOutput({activityId:"activity_11", outputId:"output_11", name: "RLP - Communication materials",
    data:
        {"communicationMaterials": [{"numberOfCommunicationMaterialsPublished":"2"}],
        }
});
createOutput({activityId:"activity_12", outputId:"output_12", name: "RLP - Weed distribution survey",
    data:
        {
            "weedDistributionSurveySites":[
                {
                    "areaSurveyedHa":"15"
                }
            ]
        }
});


createProject({name:'General Projects', projectId:"project_10", programId:'program_10',managementUnitId:"mu_10", grantId:"RLP-Test-Program-Project-1",
    "custom" : { "details" : { "serviceIds" : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35] } },
    outputTargets:[
        {"outputLabel":"Weed Treatment Details",
            "scoreName":"areaTreatedHa",
            "target":"10",
            "unit":"Ha",
            "scoreLabel":"Total new area treated for weeds (Ha)",
            "scoreId":"score_1"
        },
        {
            "scoreId" : "score_44",
            "periodTargets" : [
                {
                    "period" : "2018/2019",
                    "target" : 0
                },
                {
                    "period" : "2019/2020",
                    "target" : 10
                },
                {
                    "period" : "2020/2021",
                    "target" : 0
                },
                {
                    "period" : "2021/2022",
                    "target" : 0
                },
                {
                    "period" : "2022/2023",
                    "target" : 0
                },
                {
                    "period" : "2023/2024",
                    "target" : 0
                },
                {
                    "period" : "2024/2025",
                    "target" : 0
                },
                {
                    "period" : "2025/2026",
                    "target" : 0
                }
            ],
            "target" : 10
        },
        {
            "scoreId" : "score_43",
            "periodTargets" : [
                {
                    "period" : "2017/2018",
                    "target" : 2
                },
                {
                    "period" : "2018/2019",
                    "target" : 3
                },
                {
                    "period" : "2019/2020",
                    "target" : 2
                },
                {
                    "period" : "2020/2021",
                    "target" : 1
                },
                {
                    "period" : "2021/2022",
                    "target" : 0
                },
                {
                    "period" : "2022/2023",
                    "target" : 0
                }
            ],
            "target" : 8
        },
        {
            "scoreId" : "score_42",
            "periodTargets" : [
                {
                    "period" : "2017/2018",
                    "target" : 0
                },
                {
                    "period" : "2018/2019",
                    "target" : 2
                },
                {
                    "period" : "2019/2020",
                    "target" : 6
                },
                {
                    "period" : "2020/2021",
                    "target" : 0
                },
                {
                    "period" : "2021/2022",
                    "target" : 0
                },
                {
                    "period" : "2022/2023",
                    "target" : 0
                }
            ],
            "target" : 8
        }
    ]
});
createSite({projects:["project_10"]});
db.project.update({ projectId: "project_10"},{$set:{'custom.details.serviceIds':[


                        NumberInt(1),
                        NumberInt(2),
                        NumberInt(3),
                        NumberInt(4),
                        NumberInt(5),
                        NumberInt(6),
                        NumberInt(7),
                        NumberInt(8),
                        NumberInt(9),
                        NumberInt(10),
                        NumberInt(11),
                        NumberInt(12),
                        NumberInt(13),
                        NumberInt(14),
                        NumberInt(15),
                        NumberInt(16),
                        NumberInt(17),
                        NumberInt(18),
                        NumberInt(19),
                        NumberInt(20),
                        NumberInt(21),
                        NumberInt(22),
                        NumberInt(23),
                        NumberInt(24),
                        NumberInt(25),
                        NumberInt(26),
                        NumberInt(27),
                        NumberInt(28),
                        NumberInt(29),
                        NumberInt(30),
                        NumberInt(31),
                        NumberInt(32),
                        NumberInt(33),
                        NumberInt(34),
                        NumberInt(35)
                ]}});


db.setting.insert({"key":"meritstatistics.config", "value": JSON.stringify(homePageStatisticValues), "version":NumberInt(3)});
db.setting.insert({"key":"meritservices.config", "value":JSON.stringify(projectDashboardService) ,"version":NumberInt(0)});
db.setting.update({key:"meritstatistics.config"},{$set:{version:NumberInt(3)}});
db.setting.update({key:"meritservices.config"},{$set:{version:NumberInt(0)}});

var reef2050FinalReportValue = "This is a dummy text";
db.setting.insert({key: "meritfielddata.reef2050Final.report", "value": reef2050FinalReportValue, "version": NumberInt(0)});
db.setting.insert({key: "meritfielddata.reef2050Plan.report", "value": reef2050FinalReportValue, "version": NumberInt(0)});


db.document.insert({externalUrl:'https://ala.org.au/1', name:'Link 1', role:'helpResource', documentId:'1'});
db.document.insert({externalUrl:'https://ala.org.au/2', name:'Link 2', role:'helpResource', documentId:'2'});
db.document.insert({externalUrl:'https://ala.org.au/3', name:'Link 3', role:'helpResource', documentId:'3'});
db.document.insert({externalUrl:'https://ala.org.au/4', name:'Link 4', role:'helpResource', documentId:'4'});
db.document.insert({externalUrl:'https://ala.org.au/5', name:'Link 5', role:'helpResource', documentId:'5'});
db.document.insert({externalUrl:'https://ala.org.au/6', name:'Link 6', role:'helpResource', documentId:'6'});

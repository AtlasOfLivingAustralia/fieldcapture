var individuals = {
        "dataType": "text",
        "name": "countTypeIndividual",
        "dwcAttribute": "individualsOrGroups",
        "dwcExpression": "'Individuals'",
        "constraints": [
            "Individuals",
            "Groups"
        ]
    },
    groups = {
        "dataType": "text",
        "name": "countTypeGroup",
        "dwcAttribute": "individualsOrGroups",
        "dwcExpression": "'Groups'",
        "constraints": [
            "Individuals",
            "Groups"
        ]
    };
var protocols = {
    "068d17e8-e042-ae42-1e42-cff4006e64b0":
        {
            "name": "Opportune",
            "usesPlotLayout": false,
            "tags": ["survey"],
            "apiEndpoint": "opportunistic-surveys",
            "overrides": {
                "dataModel": {
                    "opportunistic-observation.number_of_individuals": {
                        "dwcAttribute": "individualCount"
                    }
                },
                "viewModel": null
            },
            "insertions": {
                "dataModel": {
                    "<root>" : [
                        individuals
                    ]
                }
            }
        },
    "cd2cbbc7-2f17-4b0f-91b4-06f46e9c90f2": {
        "name": "Vegetation Mapping",
        "usesPlotLayout": false,
        "tags": ["survey"],
        "apiEndpoint": "vegetation-mapping-surveys",
        "geometryType": "Point",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "a9cb9e38-690f-41c9-8151-06108caf539d":
        {
            "name": "Plot Selection",
            "usesPlotLayout": false,
            "apiEndpoint": "plot-selections",
            "tags": ["site"],
            "insertions": {
                "dataModel": {
                    "<root>" : [
                        individuals
                    ]
                }
            }
        },
    "d7179862-1be3-49fc-8ec9-2e219c6f3854": {
        "name": "Plot Layout and Visit",
        "usesPlotLayout": true,
        "apiEndpoint": "plot-definition-surveys",
        "startDatePath": "plot_visit.start_date",
        "endDatePath": "plot_visit.end_date",
        "tags": ["site"],
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "617df00c-0e4f-4267-9efc-9ca9eae19686": {
        "name": "Plot Description(enhanced)",
        "apiEndpoint": "plot-description-enhanceds",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "dc10f902-e310-45eb-b82a-bebab050b46b": {
        "name": "Plot Description(standard)",
        "apiEndpoint": "plot-description-standards",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "3cbc5277-45fb-4e7a-8f33-19d9bff4cd78": {
        "name": "Drone Survey", "usesPlotLayout": false, "tags": ["development"],
        "apiEndpoint": "drone-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "3d2eaa76-a610-4575-ac30-abf40e57b68a": {
        "name": "Dev sandbox", "usesPlotLayout": false, "tags": ["development"],
        "apiEndpoint": "dev-sandbox-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "5fd206b5-25cb-4371-bd90-7b2e8801ea25": {
        "name": "Photopoints - DSLR Panorama",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "photopoints-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "383fa013-c52d-4186-911b-35e9b2375653": {
        "name": "Photopoints - Compact Panorama",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "photopoints-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "2dbb595b-3541-46bd-b200-13db3a823b74": {
        "name": "Photopoints - Device Panorama",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "photopoints-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "e15db26f-55de-4459-841b-d7ef87dea5cd": {
        "name": "Floristics - Enhanced",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "floristics-veg-survey-fulls",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "floristics-veg-voucher-full.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "floristics-veg-voucher-full.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "bbd550c0-04c5-4a8c-ae39-cc748e920fd4": {
        "name": "Floristics - Standard",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "floristics-veg-survey-lites",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "floristics-veg-virtual-voucher.host_species": {
                    "dataType": "species"
                },
                "floristics-veg-virtual-voucher.voucher_lite.host_species": {
                    "dataType": "species"
                },
                "floristics-veg-virtual-voucher.voucher_full.host_species": {
                    "dataType": "species"
                },
                "floristics-veg-voucher-lite.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "floristics-veg-virtual-voucher.host_species": {
                    "type": "speciesSelect"
                },
                "floristics-veg-virtual-voucher.voucher_lite.host_species": {
                    "type": "speciesSelect"
                },
                "floristics-veg-virtual-voucher.voucher_full.host_species": {
                    "type": "speciesSelect"
                },
                "floristics-veg-voucher-lite.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "b92005b0-f418-4208-8671-58993089f587": {
        "name": "Plant Tissue Vouchering - Enhanced",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "floristics-veg-genetic-voucher-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "floristics-veg-genetic-voucher.floristics_voucher.voucher_full.host_species": {
                    "dataType": "species"
                },
                "floristics-veg-genetic-voucher.floristics_voucher.voucher_lite.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "floristics-veg-genetic-voucher.floristics_voucher.voucher_full.host_species": {
                    "type": "speciesSelect"
                },
                "floristics-veg-genetic-voucher.floristics_voucher.voucher_lite.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "f01e0673-a29d-48bb-b6ce-cf1c0f0de345": {
        "name": "Plant Tissue Vouchering - Standard",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "floristics-veg-genetic-voucher-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "floristics-veg-genetic-voucher.floristics_voucher.voucher_full.host_species": {
                    "dataType": "species"
                },
                "floristics-veg-genetic-voucher.floristics_voucher.voucher_lite.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "floristics-veg-genetic-voucher.floristics_voucher.voucher_full.host_species": {
                    "type": "speciesSelect"
                },
                "floristics-veg-genetic-voucher.floristics_voucher.voucher_lite.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "93e65339-4bce-4ca1-a323-78977865ef93": {
        "name": "Cover - Enhanced",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "cover-point-intercept-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "cover-point-intercept-point.species_intercepts.floristics_voucher_lite.host_species": {
                    "dataType": "species"
                },
                "cover-point-intercept-point.species_intercepts.floristics_voucher_full.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "cover-point-intercept-point.species_intercepts.floristics_voucher_lite.host_species": {
                    "type": "speciesSelect"
                },
                "cover-point-intercept-point.species_intercepts.floristics_voucher_full.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "37a3b018-3779-4c4f-bfb3-d38eb53a2568": {
        "name": "Cover - Standard",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "cover-point-intercept-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "cover-point-intercept-point.species_intercepts.floristics_voucher_lite.host_species": {
                    "dataType": "species"
                },
                "cover-point-intercept-point.species_intercepts.floristics_voucher_full.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "cover-point-intercept-point.species_intercepts.floristics_voucher_lite.host_species": {
                    "type": "speciesSelect"
                },
                "cover-point-intercept-point.species_intercepts.floristics_voucher_full.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "8c47b1f8-fc58-4510-a138-e5592edd2dbc": {
        "name": "Cover + Fire - Enhanced",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "cover-point-intercept-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "cover-point-intercept-point.species_intercepts.floristics_voucher_lite.host_species": {
                    "dataType": "species"
                },
                "cover-point-intercept-point.species_intercepts.floristics_voucher_full.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "cover-point-intercept-point.species_intercepts.floristics_voucher_lite.host_species": {
                    "type": "speciesSelect"
                },
                "cover-point-intercept-point.species_intercepts.floristics_voucher_full.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "58f2b4a6-6ce1-4364-9bae-f96fc3f86958": {
        "name": "Cover + Fire - Standard",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "cover-point-intercept-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "cover-point-intercept-point.species_intercepts.floristics_voucher_lite.host_species": {
                    "dataType": "species"
                },
                "cover-point-intercept-point.species_intercepts.floristics_voucher_full.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "cover-point-intercept-point.species_intercepts.floristics_voucher_lite.host_species": {
                    "type": "speciesSelect"
                },
                "cover-point-intercept-point.species_intercepts.floristics_voucher_full.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "36e9d224-a51f-47ea-9442-865e80144311": {
        "name": "Fire Survey",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "fire-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "5005b0af-4360-4a8c-a203-b2c9e440547e": {
        "name": "Basal Area - DBH",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "basal-area-dbh-measure-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "basal-area-dbh-measure-observation.floristics_voucher.voucher_full.host_species": {
                    "dataType": "species"
                },
                "basal-area-dbh-measure-observation.floristics_voucher.voucher_lite.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "basal-area-dbh-measure-observation.floristics_voucher.voucher_full.host_species": {
                    "type": "speciesSelect"
                },
                "basal-area-dbh-measure-observation.floristics_voucher.voucher_lite.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "4b8b35c7-15ef-4abd-a7b2-2f4e24509b52": {
        "name": "Basal Area - Basal Wedge",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "basal-wedge-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "basal-wedge-observation.floristics_voucher.voucher_full.host_species": {
                    "dataType": "species"
                },
                "basal-wedge-observation.floristics_voucher.voucher_lite.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "basal-wedge-observation.floristics_voucher.voucher_full.host_species": {
                    "type": "speciesSelect"
                },
                "basal-wedge-observation.floristics_voucher.voucher_lite.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "6e613128-92e8-4525-854c-4021f1d4d02f": {
        "name": "Coarse Woody Debris",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "coarse-woody-debris-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "a05f8914-ef4f-4a46-8cf1-d035c9c46d4d": {
        "name": "Recruitment - Age Structure",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "recruitment-field-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "recruitment-growth-stage.floristics_voucher.voucher_full.host_species": {
                    "dataType": "text"
                },
                "recruitment-growth-stage.floristics_voucher.voucher_lite.host_species": {
                    "dataType": "text"
                },
                "recruitment-growth-stage.floristics_voucher.voucher_full.field_name": {
                    "dataType": "text"
                },
                "recruitment-growth-stage.floristics_voucher.voucher_lite.field_name": {
                    "dataType": "text"
                },
                "recruitment-sapling-and-seedling-count.juvenile_count": {
                    "dwcExpression": "(['juvenile_count'] == null ? 0 : ['juvenile_count']) + (['seedling_count'] == null ? 0 : ['seedling_count']) + (['sapling_count'] == null ? 0 :['sapling_count'])",
                    "dwcAttribute": "individualCount"
                },
                "recruitment-sapling-and-seedling-count.voucher_full.host_species": {
                    "dataType": "species"
                },
                "recruitment-sapling-and-seedling-count.voucher_lite.host_species": {
                    "dataType": "species"
                },
            },
            "viewModel": {
                "recruitment-growth-stage.floristics_voucher.voucher_full.host_species": {
                    "type": "text"
                },
                "recruitment-growth-stage.floristics_voucher.voucher_full.field_name": {
                    "type": "text"
                },
                "recruitment-sapling-and-seedling-count.voucher_full.host_species": {
                    "type": "speciesSelect"
                },
                "recruitment-sapling-and-seedling-count.voucher_lite.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "db841be3-dfb7-4860-9474-a131f4de5954": {
        "name": "Recruitment - Survivorship",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "recruitment-survivorship-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "recruitment-survivorship-observation.species": {
                    "dataType": "species"
                },
                "recruitment-survivorship-observation.survivor_survey.floristics_voucher.voucher_full.host_species": {
                    "dataType": "species"
                },
                "recruitment-survivorship-observation.survivor_survey.floristics_voucher.voucher_lite.host_species": {
                    "dataType": "species"
                },
                "recruitment-survivorship-survey.floristics_voucher.voucher_full.host_species": {
                    "dataType": "species"
                },
                "recruitment-survivorship-survey.floristics_voucher.voucher_lite.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "recruitment-survivorship-observation.species": {
                    "type": "speciesSelect"
                },
                "recruitment-survivorship-observation.survivor_survey.floristics_voucher.voucher_full.host_species": {
                    "type": "speciesSelect"
                },
                "recruitment-survivorship-observation.survivor_survey.floristics_voucher.voucher_lite.host_species": {
                    "type": "speciesSelect"
                },
                "recruitment-survivorship-survey.floristics_voucher.voucher_full.host_species": {
                    "type": "speciesSelect"
                },
                "recruitment-survivorship-survey.floristics_voucher.voucher_lite.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "1dd7d3ff-11b5-4690-8167-d8fe148656b9": {
        "name": "Soil Sub-pit and Metagenomics",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "soil-sub-pit-and-metagenomics-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "15ea86ab-22f6-43fa-8cd5-751eab2347ad": {
        "name": "Soil Sample Pit",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "soil-pit-characterisation-lites",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "1de5eed1-8f97-431c-b7ca-a8371deb3c28": {
        "name": "Soil Site Observation and Pit Characterisation",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "soil-pit-characterisation-fulls",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "39da41f1-dd45-4838-ae57-ea50588fd2bc": {
        "name": "Soils - Bulk Density",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "soil-bulk-density-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "c1b38b0f-a888-4f28-871b-83da2ac1e533": {
        "name": "Vertebrate Fauna - Bird Survey",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "bird-surveys",
        "startDatePath": "start_date",
        "endDatePath": "end_date",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "bird-survey-observation.count": {
                    "dwcAttribute": "individualCount"
                }
            }
        }
    },
    "ab990a3a-a972-45d2-a384-13c3b01e9c7b": {
        "name": "Vertebrate Fauna - Trapping Survey Closure",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "vertebrate-end-trapping-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "82463b77-aac2-407c-a03c-8669bd73baf0": {
        "name": "Invertebrate Fauna - Malaise Trapping",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "invertebrate-malaise-trappings",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "8041a1a4-3e19-4fd2-86b9-d453023b5592": {
        "name": "Invertebrate Fauna - Active Search",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "invertebrate-active-search-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "7f95710a-2003-4119-a2c6-41ce4e34d12a": {
        "name": "Condition - Attributes",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "condition-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "condition-tree-survey.tree_record.species.voucher_full.host_species": {
                    "dataType": "species"
                },
                "condition-tree-survey.tree_record.species.voucher_lite.host_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "condition-tree-survey.tree_record.species.voucher_full.host_species": {
                    "type": "speciesSelect"
                },
                "condition-tree-survey.tree_record.species.voucher_lite.host_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "aae4dbd8-845a-406e-b682-ef01c3497711": {
        "name": "Dev Sandbox Bulk Survey",
        "usesPlotLayout": true,
        "tags": ["development"],
        "apiEndpoint": "dev-sandbox-bulk-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "6000cb5f-ad75-41e2-9e3e-c070c527453a": {
        "name": "Metadata Collection",
        "usesPlotLayout": false,
        "createSpeciesRecord":false,
        "tags": ["survey"],
        "apiEndpoint": "new-targeted-surveys",
        "overrides": {
            "dataModel": {
                "metadata-collection.survey_data.key_target_species": {
                    "dataType": "species"
                }
            },
            "viewModel": {
                "metadata-collection.survey_data.key_target_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "949ae38f-c047-42a7-8164-38c24ede35d5": {
        "name": "Camera Trap Reequipping",
        "usesPlotLayout": false,
        "createSpeciesRecord":false,
        "tags": ["survey"],
        "apiEndpoint": "camera-trap-reequipping-surveys"
    },
    "90c0f4cc-a22a-4820-9a8b-a01564bc197a": {
        "name": "Fauna Aerial Survey",
        "usesPlotLayout": false,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "apiEndpoint": "aerial-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "aerial-observation.ferals_aerial_count_survey.available_species.deer": {
                    "dataType": "species"
                },
                "aerial-observation.ferals_aerial_count_survey.available_species.wild_dog": {
                    "dataType": "species"
                },
                "aerial-observation.ferals_aerial_count_survey.available_species.species": {
                    "dataType": "species"
                },
                "aerial-observation.ferals_aerial_count_survey.available_species.count": {
                    "dwcAttribute": "individualCount"
                }
            },
            "viewModel": {
                "aerial-observation.ferals_aerial_count_survey.available_species.deer": {
                    "dataType": "speciesSelect"
                },
                "aerial-observation.ferals_aerial_count_survey.available_species.wild_dog": {
                    "dataType": "speciesSelect"
                },
                "aerial-observation.ferals_aerial_count_survey.available_species.species": {
                    "dataType": "speciesSelect"
                }
            }
        }
    },
    "2c5bb8d7-b624-4dc4-93d7-3f1276e65ad5": {
        "name": "Vertebrate Fauna - Trapping Survey Setup",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "vertebrate-trapping-setup-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "70fbd236-9e51-47a8-93da-125a18a13acc": {
        "name": "Vertebrate Fauna - Identify, Measure and Release",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "vertebrate-trap-check-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "9d2c3fcf-881b-41df-944d-33bb6ef8ac51": {
        "name": "Vertebrate Fauna - Active and Passive Search",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "vertebrate-active-passive-search-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "0628e486-9b33-4d86-98db-c6d3f10f7744": {
        "name": "Vertebrate Fauna - Acoustic and Ultrasonic Recordings",
        "usesPlotLayout": false,
        "tags": ["survey"],
        "apiEndpoint": "<root>",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "9e75385a-4783-4911-8870-cca78b44d781": {
        "name": "Invertebrate Fauna - Wet Pitfall Trapping",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "invertebrate-wet-pitfall-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "7dc49039-4999-43f6-8896-e33d7b28a934": {
        "name": "Invertebrate Fauna - Rapid Ground Trapping",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "invertebrate-rapid-ground-trappings",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "7b0e4526-726e-4292-a897-238f336ce51e": {
        "name": "Invertebrate Fauna - Pan Trapping",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "invertebrate-pan-trappings",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "aa64fd4d-2c5a-4f84-a197-9f3ce6409152": {
        "name": "Invertebrate Fauna - Post-field Sampling Curation",
        "usesPlotLayout": true,
        "tags": ["survey"],
        "apiEndpoint": "<root>",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "08adf0ff-43c1-4f19-b2c4-f5da667baf65": {
        "name": "Interventions - Data Collection",
        "usesPlotLayout": false,
        "tags": ["intervention"],
        "apiEndpoint": "interventions-general-project-informations",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "ad088dbe-02b2-472a-901f-bd081e590bcf": {
        "name": "Camera Trap Deployment",
        "usesPlotLayout": false,
        "createSpeciesRecord":false,
        "tags": ["survey"],
        "apiEndpoint": "camera-trap-deployment-surveys"
    },
    "3db7f7b6-a96d-495a-9981-5d6170a7458d": {
        "name": "Camera Trap Retrieval",
        "usesPlotLayout": false,
        "createSpeciesRecord":false,
        "tags": ["survey"],
        "apiEndpoint": "camera-trap-retrieval-surveys"
    },
    "648d545a-cdae-4c19-bc65-0c9f93d9c0eb": {
        "name": "Sign-based Fauna Surveys - Within-plot Belt Transect",
        "usesPlotLayout": true,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "apiEndpoint": "within-plot-belt-transect-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "within-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "within-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "within-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "within-plot-belt-transect.quadrat.sign_observed.count": {
                    "dwcAttribute": "individualCount"
                },
                "within-plot-belt-transect.survey.other_target_species.other_species": {
                    "dataType": "text"
                },
                "within-plot-belt-transect-survey.other_target_species.other_species": {
                    "dataType": "text"
                }
            },
            "viewModel": {
                "within-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "within-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "within-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "2cd7b489-b582-41f6-9dcc-264f6ea7801a": {
        "name": "Sign-based Fauna Surveys - Off-plot Belt Transect",
        "usesPlotLayout": false,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "apiEndpoint": "off-plot-belt-transect-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "off-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "off-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "off-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "within-plot-belt-transect.quadrat.sign_observed.count": {
                    "dwcAttribute": "individualCount"
                },
                "off-plot-belt-transect-survey-setup.other_target_species.other_species": {
                    "dataType": "text"
                }
            },
            "viewModel": {
                "off-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "off-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "off-plot-belt-transect.quadrat.sign_observed.attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "0c5d1d14-c71b-467f-aced-abe1c83c15d3": {
        "name": "Sign-based Fauna - Vehicle Track",
        "usesPlotLayout": false,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "apiEndpoint": "sign-based-vehicle-track-set-ups",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "sign-based-vehicle-track-observation.observations.attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "sign-based-vehicle-track-observation.observations.attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "sign-based-vehicle-track-observation.observations.attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "sign-based-vehicle-track-observation.observations.number_of_individuals": {
                    "dwcAttribute": "individualCount"
                },
                "sign-based-vehicle-track-observation.survey.route_taken": {
                    "dataType": "feature"
                },
                "sign-based-vehicle-track-observation.points": {
                    "dataType": "feature"
                },
                "sign-based-vehicle-track-observation.survey.other_target_species.other_species": {
                    "dataType": "text"
                },
                "sign-based-vehicle-track-set-up.other_target_species.other_species": {
                    "dataType": "text"
                }
            },
            "viewModel":{
                "sign-based-vehicle-track-observation.survey.route_taken": {
                    "type": "feature"
                },
                "sign-based-vehicle-track-observation.points": {
                    "type": "feature"
                },
                "sign-based-vehicle-track-observation.observations.attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "sign-based-vehicle-track-observation.observations.attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "sign-based-vehicle-track-observation.observations.attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "a76dac21-94f4-4851-af91-31f6dd00750f": {
        "name": "Fauna Ground Counts Transects",
        "usesPlotLayout": false,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "apiEndpoint": "fauna-ground-counts-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "fauna-ground-counts-conduct-survey.observation.species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "fauna-ground-counts-conduct-survey.observation.species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "fauna-ground-counts-conduct-survey.observation.species.attributable_deer": {
                    "dataType": "species"
                },
                "fauna-ground-counts-conduct-survey.observation.species.other_attributable_species": {
                    "dataType": "species"
                },
                "fauna-ground-counts-observation.other_target_species.other_species": {
                    "dataType": "text"
                },
                "fauna-ground-counts-conduct-survey.observation.count": {
                    "dwcAttribute": "individualCount"
                },
            },
            "viewModel": {
                "fauna-ground-counts-observation.observation.pest_species": {
                    "type": "speciesSelect"
                },
                "fauna-ground-counts-conduct-survey.observation.species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "fauna-ground-counts-conduct-survey.observation.species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "fauna-ground-counts-conduct-survey.observation.species.attributable_deer": {
                    "type": "speciesSelect"
                },
                "fauna-ground-counts-conduct-survey.observation.species.other_attributable_species": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "80360ceb-bd6d-4ed4-b2ea-9bd45d101d0e": {
        "name": "Pest Fauna - Control Activities",
        "usesPlotLayout": false,
        "tags": ["intervention"],
        "apiEndpoint": "pest-fauna-control-activities",
        "geometryType": "LineString",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        }
    },
    "228e5e1e-aa9f-47a3-930b-c1468757f81d": {
        "name": "Herbivory and Physical Damage - Active Plot Search",
        "usesPlotLayout": true,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "apiEndpoint": "herbivory-and-physical-damage-active-search-setups",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "herbivory-and-physical-damage-active-search-transect.track_log": {
                    "dataType": "feature"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.physical_damage_attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.physical_damage_attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.physical_damage_attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.herbivory_attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.herbivory_attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.herbivory_attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-active-search-transect.active_search_setup.other_target_species.other_species": {
                    "dataType": "text"
                },
                "herbivory-and-physical-damage-active-search-setup.other_target_species.other_species": {
                    "dataType": "text"
                }
            },
            "viewModel": {
                "herbivory-and-physical-damage-active-search-transect.track_log": {
                    "type": "feature"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.physical_damage_attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.physical_damage_attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.physical_damage_attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.herbivory_attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.herbivory_attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "herbivory-and-physical-damage-active-search-transect.hapd_observed.herbivory_attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "cc826a19-a1e7-4dfe-8d6e-f135d258d7f9": {
        "name": "Sign-based Fauna - Plot Sign Search",
        "usesPlotLayout": true,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "apiEndpoint": "sign-based-active-plot-search-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "sign-based-active-plot-search.sign.attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "sign-based-active-plot-search.sign.attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "sign-based-active-plot-search.sign.attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "sign-based-nearby-track-plot.sign.attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "sign-based-nearby-track-plot.sign.attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "sign-based-nearby-track-plot.sign.attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "sign-based-active-plot-search.track_log": {
                    "dataType": "feature"
                },
                "sign-based-active-plot-search.sign.attributable_fauna_species.count": {
                    "dwcAttribute": "individualCount"
                },
                "sign-based-nearby-track-plot.track_log": {
                    "dataType": "feature"
                },
                "sign-based-nearby-track-plot.sign.count": {
                    "dwcAttribute": "individualCount"
                },
                "sign-based-active-plot-search.active_search_survey.other_target_species.other_species": {
                    "dataType": "text"
                },
                "sign-based-nearby-track-plot.active_search_survey.other_target_species.other_species": {
                    "dataType": "text"
                },
                "sign-based-active-plot-search-survey.other_target_species.other_species": {
                    "dataType": "text"
                }
            },
            "viewModel": {
                "sign-based-active-plot-search.sign.attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "sign-based-active-plot-search.sign.attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "sign-based-active-plot-search.sign.attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                },
                "sign-based-nearby-track-plot.sign.attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "sign-based-nearby-track-plot.sign.attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "sign-based-nearby-track-plot.sign.attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                },
                "sign-based-nearby-track-plot.track_log": {
                    "type": "feature"
                },
                "sign-based-active-plot-search.track_log": {
                    "type": "feature"
                }
            }
        }
    },
    "685b5e9b-20c2-4688-9b04-b6caaf084aad": {
        "name": "Sign-based Fauna - Track Station",
        "usesPlotLayout": false,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "sign-based-track-station-observation.observations.attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "sign-based-track-station-observation.observations.attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "sign-based-track-station-observation.observations.attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "sign-based-track-station-observation.observations.number_of_individuals": {
                    "dwcAttribute": "individualCount"
                },
                "sign-based-track-station-survey-setup.other_target_species.other_species": {
                    "dataType": "text"
                }
            },
            "viewModel": {
                "sign-based-track-station-observation.observations.attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "sign-based-track-station-observation.observations.attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "sign-based-track-station-observation.observations.attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                }
            }
        },
        "apiEndpoint": "sign-based-track-station-survey-setups"
    },
    "d706fd34-2f05-4559-b738-a65615a3d756": {
        "name": "Fauna Ground Counts Vantage Point",
        "usesPlotLayout": false,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "apiEndpoint": "ground-counts-vantage-point-surveys",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "vantage-point-conduct-survey.observations.count_of_individuals": {
                    "dwcAttribute": "individualCount"
                },
                "vantage-point-conduct-survey.observations.species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "vantage-point-conduct-survey.observations.species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "vantage-point-conduct-survey.observations.species.attributable_deer": {
                    "dataType": "species"
                },
                "vantage-point-conduct-survey.observations.spotters_name": {
                    "dataType": "recordedBy"
                },
                "vantage-point-conduct-survey.other_target_species.other_species": {
                    "dataType": "text"
                }
            },
            "viewModel": {
                "ground-counts-vantage-point-setup.observations.species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "ground-counts-vantage-point-setup.observations.species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "ground-counts-vantage-point-setup.observations.species.attributable_deer": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "06cd903e-b8b3-40a5-add4-f779739cce35": {
        "name": "Herbivory and Physical Damage - Within-plot Belt Transect",
        "usesPlotLayout": true,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "apiEndpoint": "herbivory-and-physical-damage-belt-transect-setups",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "herbivory-and-physical-damage-belt-transect-setup.other_target_species.other_species": {
                    "dataType": "text"
                },
                "herbivory-and-physical-damage-transect.within_plot_setup.other_target_species.other_species": {
                    "dataType": "text"
                }
            },
            "viewModel": {
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                },
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "herbivory-and-physical-damage-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                }
            }
        }
    },
    "49d02f5d-b148-4b5b-ad6a-90e48c81b294": {
        "name": "Herbivory and Physical Damage - Off-plot Transect",
        "usesPlotLayout": false,
        "createSpeciesRecord":true,
        "tags": ["survey"],
        "apiEndpoint": "herbivory-off-plot-belt-transect-setups",
        "insertions": {
            "dataModel": {
                "<root>" : [
                    individuals
                ]
            }
        },
        "overrides": {
            "dataModel": {
                "herbivory-off-plot-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "herbivory-off-plot-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "herbivory-off-plot-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "herbivory-off-plot-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_fauna_species": {
                    "dataType": "species"
                },
                "herbivory-off-plot-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_wild_dog": {
                    "dataType": "species"
                },
                "herbivory-off-plot-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_deer": {
                    "dataType": "species"
                },
                "herbivory-off-plot-belt-survey-setup.other_target_species.other_species": {
                    "dataType": "text"
                }
            },
            "viewModel": {
                "herbivory-off-plot-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "herbivory-off-plot-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "herbivory-off-plot-transect.quadrat.quadrat_observation.physical_damage_attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                },
                "herbivory-off-plot-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_fauna_species": {
                    "type": "speciesSelect"
                },
                "herbivory-off-plot-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_wild_dog": {
                    "type": "speciesSelect"
                },
                "herbivory-off-plot-transect.quadrat.quadrat_observation.herbivory_attributable_fauna_species.attributable_deer": {
                    "type": "speciesSelect"
                }
            }
        }
    }
};


var key = "paratoo.surveyData.mapping";
var setting = {
    key: key,
    value: JSON.stringify(protocols),
    dateCreated: ISODate(),
    lastUpdated: ISODate()
};
if (db.setting.findOne({key: key})) {
    db.setting.replaceOne({key: key}, setting);
} else {
    db.setting.insertOne(setting);
}


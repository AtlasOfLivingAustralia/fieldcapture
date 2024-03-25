let protocols = [
    {
        "id": 1,
        "attributes": {
            "identifier": "068d17e8-e042-ae42-1e42-cff4006e64b0",
            "name": "Opportune",
            "module": "Opportune",
            "endpointPrefix": "/opportunistic-surveys",
            "version": 1,
            "description": "Record opportune observations of species across a project area.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "opportunistic-survey",
                    "splitSurveyStep": true
                },
                {
                    "multiple": true,
                    "modelName": "opportunistic-observation",
                    "overrideDisplayName": "Opportune",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.869Z",
            "updatedAt": "2024-03-21T06:27:31.869Z"
        }
    },
    {
        "id": 2,
        "attributes": {
            "identifier": "cd2cbbc7-2f17-4b0f-91b4-06f46e9c90f2",
            "name": "Vegetation Mapping",
            "module": "Vegetation Mapping",
            "endpointPrefix": "/vegetation-mapping-surveys",
            "version": 1,
            "description": "Classify vegetation at precise points across the project area and use this data to map vegetation associations.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "vegetation-mapping-survey",
                    "splitSurveyStep": true
                },
                {
                    "multiple": true,
                    "modelName": "vegetation-mapping-observation",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.882Z",
            "updatedAt": "2024-03-21T06:27:31.882Z"
        }
    },
    {
        "id": 3,
        "attributes": {
            "identifier": "a9cb9e38-690f-41c9-8151-06108caf539d",
            "name": "Plot Selection",
            "module": "Plot Selection and Layout",
            "endpointPrefix": "/plot-selections",
            "version": 1,
            "description": "A desktop component to define project area boundaries, stratifying the project area into sampling units and selecting proposed plot locations prior to field collection.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-selection",
                    "addSurveyID": true,
                    "useManyEndpoint": true,
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.896Z",
            "updatedAt": "2024-03-21T06:27:31.896Z"
        }
    },
    {
        "id": 4,
        "attributes": {
            "identifier": "d7179862-1be3-49fc-8ec9-2e219c6f3854",
            "name": "Plot Layout and Visit",
            "module": "Plot Selection and Layout",
            "endpointPrefix": "/plot-definition-surveys",
            "version": 1,
            "description": "A field based component to establish the plot positioning based on the results of the plot selection protocol (marking out the plot boundary, transects, and centre).",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-definition-survey",
                    "wrapperStepOnly": true
                },
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.908Z",
            "updatedAt": "2024-03-21T06:27:31.908Z"
        }
    },
    {
        "id": 5,
        "attributes": {
            "identifier": "617df00c-0e4f-4267-9efc-9ca9eae19686",
            "name": "Plot Description(enhanced)",
            "module": "Plot Description",
            "endpointPrefix": "/plot-description-enhanceds",
            "version": 1,
            "description": "A comprehensive description of the landform, land surface and vegetation of a plot when it is established (first visit)",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-description-enhanced",
                    "protocol-variant": "full",
                    "overrideDisplayName": "Plot Description(enhanced)",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.920Z",
            "updatedAt": "2024-03-21T06:27:31.920Z"
        }
    },
    {
        "id": 6,
        "attributes": {
            "identifier": "dc10f902-e310-45eb-b82a-bebab050b46b",
            "name": "Plot Description(standard)",
            "module": "Plot Description",
            "endpointPrefix": "/plot-description-standards",
            "version": 1,
            "description": "A condensed description of the vegetation of an established plot that has previously been described using the enhanced protocol (revisits)",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-description-standard",
                    "protocol-variant": "lite",
                    "overrideDisplayName": "Plot Description(standard)",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.932Z",
            "updatedAt": "2024-03-21T06:27:31.932Z"
        }
    },
    {
        "id": 7,
        "attributes": {
            "identifier": "3cbc5277-45fb-4e7a-8f33-19d9bff4cd78",
            "name": "Drone Survey",
            "module": "None",
            "endpointPrefix": "/drone-surveys",
            "version": 1,
            "description": "Drone Survey",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "drone-survey"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.948Z",
            "updatedAt": "2024-03-21T06:27:31.948Z"
        }
    },
    {
        "id": 8,
        "attributes": {
            "identifier": "3d2eaa76-a610-4575-ac30-abf40e57b68a",
            "name": "Dev sandbox",
            "module": "None",
            "endpointPrefix": "/dev-sandbox-surveys",
            "version": 1,
            "description": "An all-in-one Project for testing all Protocols",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "dev-sandbox-survey"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.960Z",
            "updatedAt": "2024-03-21T06:27:31.960Z"
        }
    },
    {
        "id": 9,
        "attributes": {
            "identifier": "5fd206b5-25cb-4371-bd90-7b2e8801ea25",
            "name": "Photopoints - DSLR Panorama",
            "module": "Photopoints",
            "endpointPrefix": "/photopoints-surveys",
            "version": 1,
            "description": "360° panorama taken using a DSLR or high-end mirrorless camera that allows the user to set specific camera and lens settings, including focal length, aperture, and ISO.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "photopoints-survey",
                    "protocol-variant": "DSLR Full",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.971Z",
            "updatedAt": "2024-03-21T06:27:31.971Z"
        }
    },
    {
        "id": 10,
        "attributes": {
            "identifier": "383fa013-c52d-4186-911b-35e9b2375653",
            "name": "Photopoints - Compact Panorama",
            "module": "Photopoints",
            "endpointPrefix": "/photopoints-surveys",
            "version": 1,
            "description": "360° panorama taken using a compact camera without the ability to set all the specific camera and lens settings required of the DSLR panorama protocol.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "photopoints-survey",
                    "protocol-variant": "Compact Lite",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.983Z",
            "updatedAt": "2024-03-21T06:27:31.983Z"
        }
    },
    {
        "id": 11,
        "attributes": {
            "identifier": "2dbb595b-3541-46bd-b200-13db3a823b74",
            "name": "Photopoints - Device Panorama",
            "module": "Photopoints",
            "endpointPrefix": "/photopoints-surveys",
            "version": 1,
            "description": "360° panorama taken using the Monitor app on a mobile phone or tablet.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "photopoints-survey",
                    "protocol-variant": "On-device Lite",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:31.994Z",
            "updatedAt": "2024-03-21T06:27:31.994Z"
        }
    },
    {
        "id": 12,
        "attributes": {
            "identifier": "e15db26f-55de-4459-841b-d7ef87dea5cd",
            "name": "Floristics - Enhanced",
            "module": "Floristics",
            "endpointPrefix": "/floristics-veg-survey-fulls",
            "version": 1,
            "description": "Collect plant specimen vouchers for all species present in a plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "floristics-veg-survey-full",
                    "protocol-variant": "full",
                    "usesCustomComponent": "true"
                },
                {
                    "minimum": 1,
                    "multiple": true,
                    "modelName": "floristics-veg-voucher-full",
                    "deepPopulate": true,
                    "protocol-variant": "full",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "floristics-veg-genetic-voucher",
                    "defaultHidden": true,
                    "isSubmoduleStep": true,
                    "protocol-variant": "full",
                    "overrideDisplayName": "Plant Tissue Vouchering",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.013Z",
            "updatedAt": "2024-03-21T06:27:32.013Z"
        }
    },
    {
        "id": 13,
        "attributes": {
            "identifier": "bbd550c0-04c5-4a8c-ae39-cc748e920fd4",
            "name": "Floristics - Standard",
            "module": "Floristics",
            "endpointPrefix": "/floristics-veg-survey-lites",
            "version": 1,
            "description": "Plant specimen vouchers collected for a subset of the species present in a plot and collect photo collected for the remaining species.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "floristics-veg-survey-lite",
                    "protocol-variant": "lite",
                    "usesCustomComponent": "true"
                },
                {
                    "minimum": 1,
                    "multiple": true,
                    "required": false,
                    "modelName": "floristics-veg-voucher-lite",
                    "deepPopulate": true,
                    "protocol-variant": "lite",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "required": false,
                    "modelName": "floristics-veg-virtual-voucher",
                    "defaultHidden": true
                },
                {
                    "multiple": true,
                    "modelName": "floristics-veg-genetic-voucher",
                    "defaultHidden": true,
                    "isSubmoduleStep": true,
                    "protocol-variant": "full",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.069Z",
            "updatedAt": "2024-03-21T06:27:32.069Z"
        }
    },
    {
        "id": 14,
        "attributes": {
            "identifier": "b92005b0-f418-4208-8671-58993089f587",
            "name": "Plant Tissue Vouchering - Enhanced",
            "module": "Plant Tissue Vouchering",
            "endpointPrefix": "/floristics-veg-genetic-voucher-surveys",
            "version": 1,
            "description": "Plant tissue vouchers from a single plant collected for all species present in a plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "floristics-veg-genetic-voucher-survey",
                    "wrapperStepOnly": true,
                    "protocol-variant": "full",
                    "overrideDisplayName": "Plant Tissue Vouchering Survey"
                },
                {
                    "multiple": true,
                    "modelName": "floristics-veg-genetic-voucher",
                    "protocol-variant": "full",
                    "overrideDisplayName": "Plant Tissue Vouchering",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.081Z",
            "updatedAt": "2024-03-21T06:27:32.081Z"
        }
    },
    {
        "id": 15,
        "attributes": {
            "identifier": "f01e0673-a29d-48bb-b6ce-cf1c0f0de345",
            "name": "Plant Tissue Vouchering - Standard",
            "module": "Plant Tissue Vouchering",
            "endpointPrefix": "/floristics-veg-genetic-voucher-surveys",
            "version": 1,
            "description": "Plant tissue vouchers from a single plant collected for a subset of the species present in a plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "floristics-veg-genetic-voucher-survey",
                    "wrapperStepOnly": true,
                    "protocol-variant": "lite",
                    "overrideDisplayName": "Plant Tissue Vouchering Survey"
                },
                {
                    "multiple": true,
                    "modelName": "floristics-veg-genetic-voucher",
                    "protocol-variant": "lite",
                    "overrideDisplayName": "Plant Tissue Vouchering",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.093Z",
            "updatedAt": "2024-03-21T06:27:32.093Z"
        }
    },
    {
        "id": 17,
        "attributes": {
            "identifier": "37a3b018-3779-4c4f-bfb3-d38eb53a2568",
            "name": "Cover - Standard",
            "module": "Cover",
            "endpointPrefix": "/cover-point-intercept-surveys",
            "version": 1,
            "description": "Record fractional vegetation and substrate cover using the point intercept method across the 40 x 40 m sub-plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "cover-point-intercept-survey",
                    "wrapperStepOnly": true,
                    "protocol-variant": "lite"
                },
                {
                    "multiple": true,
                    "modelName": "cover-point-intercept-point",
                    "protocol-variant": "lite",
                    "overrideDisplayName": "Point-intercept data collection",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "cover-point-intercept-species-intercept"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "species_intercepts"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.118Z",
            "updatedAt": "2024-03-21T06:27:32.118Z"
        }
    },
    {
        "id": 19,
        "attributes": {
            "identifier": "58f2b4a6-6ce1-4364-9bae-f96fc3f86958",
            "name": "Cover + Fire - Standard",
            "module": "Fire Severity",
            "endpointPrefix": "/cover-point-intercept-surveys",
            "version": 1,
            "description": "Record the cover and height of fire severity attributes 404 point-intercepts well as trunk char height at four locations within the plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "cover-point-intercept-survey",
                    "wrapperStepOnly": true,
                    "protocol-variant": "lite"
                },
                {
                    "multiple": true,
                    "modelName": "cover-point-intercept-point",
                    "protocol-variant": "lite",
                    "overrideDisplayName": "Point-intercept data collection",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "cover-point-intercept-species-intercept"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "species_intercepts"
                    ]
                },
                {
                    "multiple": true,
                    "modelName": "fire-char-observation",
                    "defaultHidden": true,
                    "isSubmoduleStep": true,
                    "overrideDisplayName": "Trunk char height",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.143Z",
            "updatedAt": "2024-03-21T06:27:32.143Z"
        }
    },
    {
        "id": 20,
        "attributes": {
            "identifier": "36e9d224-a51f-47ea-9442-865e80144311",
            "name": "Fire Survey",
            "module": "Fire Severity",
            "endpointPrefix": "/fire-surveys",
            "version": 1,
            "description": "Fire Severity",
            "isWritable": false,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "fire-survey"
                },
                {
                    "multiple": true,
                    "modelName": "fire-point-intercept-point",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "fire-species-intercept"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "fire_species_intercepts"
                    ]
                },
                {
                    "maximum": 4,
                    "minimum": 4,
                    "multiple": true,
                    "modelName": "fire-char-observation",
                    "overrideDisplayName": "Trunk char height",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": true,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.157Z",
            "updatedAt": "2024-03-21T06:27:32.157Z"
        }
    },
    {
        "id": 22,
        "attributes": {
            "identifier": "4b8b35c7-15ef-4abd-a7b2-2f4e24509b52",
            "name": "Basal Area - Basal Wedge",
            "module": "Basal Area",
            "endpointPrefix": "/basal-wedge-surveys",
            "version": 1,
            "description": "Use a basal wedge to assess diameter at breast height (DBH) at nine sampling locations across the core monitoring plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "basal-wedge-survey",
                    "wrapperStepOnly": true,
                    "protocol-variant": "wedge"
                },
                {
                    "maximum": 9,
                    "minimum": 9,
                    "multiple": true,
                    "modelName": "basal-wedge-observation",
                    "protocol-variant": "wedge",
                    "usesCustomComponent": "true",
                    "x-paratoo-description": "BasalWedge"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.187Z",
            "updatedAt": "2024-03-21T06:27:32.187Z"
        }
    },
    {
        "id": 25,
        "attributes": {
            "identifier": "db841be3-dfb7-4860-9474-a131f4de5954",
            "name": "Recruitment - Survivorship",
            "module": "Recruitment",
            "endpointPrefix": "/recruitment-survivorship-surveys",
            "version": 1,
            "description": "Tag individuals for on-going monitoring of survivorship, recording location, health, growth stage, life-stage and size measurements.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "recruitment-survivorship-survey",
                    "usesCustomComponent": true
                },
                {
                    "multiple": true,
                    "modelName": "recruitment-survivorship-observation",
                    "usesCustomComponent": true
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.224Z",
            "updatedAt": "2024-03-21T06:27:32.224Z"
        }
    },
    {
        "id": 27,
        "attributes": {
            "identifier": "1dd7d3ff-11b5-4690-8167-d8fe148656b9",
            "name": "Soil Sub-pit and Metagenomics",
            "module": "Soils",
            "endpointPrefix": "/soil-sub-pit-and-metagenomics-surveys",
            "version": 1,
            "description": "Collect metagenomic soil surface samples and soil sub-pit samples at nine locations of differing microhabitats within the plot, or at a single location, outside the southwest corner of the plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout"
                },
                {
                    "modelName": "plot-visit"
                },
                {
                    "modelName": "soil-sub-pit-and-metagenomics-survey",
                    "hasLabPhase": true,
                    "overrideDisplayName": "Survey setup"
                },
                {
                    "multiple": true,
                    "required": false,
                    "modelName": "soil-sub-pit",
                    "usesCustomComponent": true,
                    "relationOnAttributesModelNames": [
                        "soil-sub-pit-observation"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "sub_pit_observation"
                    ]
                },
                {
                    "labPhase": true,
                    "multiple": true,
                    "required": false,
                    "modelName": "soil-sub-pit-sampling",
                    "overrideDisplayName": "Sampling",
                    "usesCustomComponent": true
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.252Z",
            "updatedAt": "2024-03-21T06:27:32.252Z"
        }
    },
    {
        "id": 29,
        "attributes": {
            "identifier": "39da41f1-dd45-4838-ae57-ea50588fd2bc",
            "name": "Soils - Bulk Density",
            "module": "Soils",
            "endpointPrefix": "/soil-bulk-density-surveys",
            "version": 1,
            "description": "Collect soil core samples at 10 cm increments down to 30 cm from the edge of the soil pit.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "soil-bulk-density-survey",
                    "hasLabPhase": true
                },
                {
                    "maximum": 3,
                    "minimum": 3,
                    "labPhase": true,
                    "multiple": true,
                    "required": false,
                    "modelName": "soil-bulk-density-sample",
                    "usesCustomComponent": true
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.276Z",
            "updatedAt": "2024-03-21T06:27:32.276Z"
        }
    },
    {
        "id": 31,
        "attributes": {
            "identifier": "2c5bb8d7-b624-4dc4-93d7-3f1276e65ad5",
            "name": "Vertebrate Fauna - Trapping Survey Setup",
            "module": "Vertebrate Fauna",
            "endpointPrefix": "/vertebrate-trapping-setup-surveys",
            "version": 1,
            "description": "Record details of trapping survey including trap type, location and duration of trapping effort.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "vertebrate-trapping-setup-survey",
                    "overrideDisplayName": "Setup trapping survey"
                },
                {
                    "multiple": true,
                    "modelName": "vertebrate-trap-line",
                    "overrideDisplayName": "Start/End trap line",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "vertebrate-trap"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "traps"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.300Z",
            "updatedAt": "2024-03-21T06:27:32.300Z"
        }
    },
    {
        "id": 33,
        "attributes": {
            "identifier": "ab990a3a-a972-45d2-a384-13c3b01e9c7b",
            "name": "Vertebrate Fauna - Trapping Survey Closure",
            "module": "Vertebrate Fauna",
            "endpointPrefix": "/vertebrate-end-trapping-surveys",
            "version": 1,
            "description": "Record details of trapping survey including trap type, location and duration of trapping effort",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout"
                },
                {
                    "modelName": "plot-visit"
                },
                {
                    "modelName": "vertebrate-end-trapping-survey",
                    "wrapperStepOnly": true
                },
                {
                    "multiple": true,
                    "modelName": "vertebrate-end-trap",
                    "overrideDisplayName": "End traps",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "required": false,
                    "modelName": "vertebrate-closed-drift-photo",
                    "overrideDisplayName": "Closed drift line photos",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.325Z",
            "updatedAt": "2024-03-21T06:27:32.325Z"
        }
    },
    {
        "id": 16,
        "attributes": {
            "identifier": "93e65339-4bce-4ca1-a323-78977865ef93",
            "name": "Cover - Enhanced",
            "module": "Cover",
            "endpointPrefix": "/cover-point-intercept-surveys",
            "version": 1,
            "description": "Record vegetation and substrate cover using the point intercept method across the 100 x 100 m core monitoring plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "cover-point-intercept-survey",
                    "wrapperStepOnly": true,
                    "protocol-variant": "full"
                },
                {
                    "multiple": true,
                    "modelName": "cover-point-intercept-point",
                    "protocol-variant": "full",
                    "overrideDisplayName": "Point-intercept data collection",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "cover-point-intercept-species-intercept"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "species_intercepts"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.106Z",
            "updatedAt": "2024-03-21T06:27:32.106Z"
        }
    },
    {
        "id": 18,
        "attributes": {
            "identifier": "8c47b1f8-fc58-4510-a138-e5592edd2dbc",
            "name": "Cover + Fire - Enhanced",
            "module": "Fire Severity",
            "endpointPrefix": "/cover-point-intercept-surveys",
            "version": 1,
            "description": "Record the cover and height of fire severity attributes 404 point-intercepts well as trunk char height at four locations within the plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "cover-point-intercept-survey",
                    "wrapperStepOnly": true,
                    "protocol-variant": "full"
                },
                {
                    "multiple": true,
                    "modelName": "cover-point-intercept-point",
                    "protocol-variant": "full",
                    "overrideDisplayName": "Point-intercept data collection",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "cover-point-intercept-species-intercept"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "species_intercepts"
                    ]
                },
                {
                    "maximum": 4,
                    "minimum": 4,
                    "multiple": true,
                    "modelName": "fire-char-observation",
                    "defaultHidden": true,
                    "isSubmoduleStep": true,
                    "overrideDisplayName": "Trunk char height",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.130Z",
            "updatedAt": "2024-03-21T06:27:32.130Z"
        }
    },
    {
        "id": 21,
        "attributes": {
            "identifier": "5005b0af-4360-4a8c-a203-b2c9e440547e",
            "name": "Basal Area - DBH",
            "module": "Basal Area",
            "endpointPrefix": "/basal-area-dbh-measure-surveys",
            "version": 1,
            "description": "Record the actual diameter at breast height (DBH) for all trees within the 100 x 100 m core monitoring plot or the 40 x 40 m sub-plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "basal-area-dbh-measure-survey",
                    "protocol-variant": "full"
                },
                {
                    "multiple": true,
                    "modelName": "basal-area-dbh-measure-observation",
                    "protocol-variant": "full",
                    "usesCustomComponent": "true",
                    "x-paratoo-description": "ProblemTrees"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.169Z",
            "updatedAt": "2024-03-21T06:27:32.169Z"
        }
    },
    {
        "id": 23,
        "attributes": {
            "identifier": "6e613128-92e8-4525-854c-4021f1d4d02f",
            "name": "Coarse Woody Debris",
            "module": "Coarse Woody Debris",
            "endpointPrefix": "/coarse-woody-debris-surveys",
            "version": 1,
            "description": "The coarse woody debris (CWD) survey method within the 100 x 100 m core monitoring plot or the 40 x 40 m sub-plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "coarse-woody-debris-survey"
                },
                {
                    "multiple": true,
                    "modelName": "coarse-woody-debris-observation",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.199Z",
            "updatedAt": "2024-03-21T06:27:32.199Z"
        }
    },
    {
        "id": 24,
        "attributes": {
            "identifier": "a05f8914-ef4f-4a46-8cf1-d035c9c46d4d",
            "name": "Recruitment - Age Structure",
            "module": "Recruitment",
            "endpointPrefix": "/recruitment-field-surveys",
            "version": 1,
            "description": "Record the growth stage and life-stage of species at the plot level (100 m x 100 m) and seedling, sapling and juvenile counts at the sub-plot level (40 x 40 m)",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "recruitment-field-survey",
                    "wrapperStepOnly": true
                },
                {
                    "multiple": true,
                    "modelName": "recruitment-growth-stage",
                    "overrideDisplayName": "Growth and life stages",
                    "usesCustomComponent": true
                },
                {
                    "multiple": true,
                    "modelName": "recruitment-sapling-and-seedling-count",
                    "usesCustomComponent": true
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.211Z",
            "updatedAt": "2024-03-21T06:27:32.211Z"
        }
    },
    {
        "id": 26,
        "attributes": {
            "identifier": "1de5eed1-8f97-431c-b7ca-a8371deb3c28",
            "name": "Soil Site Observation and Pit Characterisation",
            "module": "Soils",
            "endpointPrefix": "/soil-pit-characterisation-fulls",
            "version": 1,
            "description": "Describe aspects of the land surface around the soil pit. Characterise the soil profile by exposing the profile to a depth of 1 m+ and capture a photographic record of the soil pit and collect soil samples from 10 cm increments.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout"
                },
                {
                    "modelName": "plot-visit"
                },
                {
                    "modelName": "soil-pit-characterisation-full",
                    "hasLabPhase": true,
                    "overrideDisplayName": "Soil Pit Location"
                },
                {
                    "required": false,
                    "modelName": "soil-landform-element",
                    "overrideDisplayName": "Land Form Element",
                    "usesCustomComponent": true
                },
                {
                    "required": false,
                    "modelName": "soil-land-surface-phenomena",
                    "overrideDisplayName": "Land Surface Phenomena & Soil Development"
                },
                {
                    "minimum": 0,
                    "multiple": true,
                    "required": false,
                    "modelName": "microrelief-observation",
                    "usesCustomComponent": true
                },
                {
                    "minimum": 0,
                    "multiple": true,
                    "required": false,
                    "modelName": "erosion-observation",
                    "usesCustomComponent": true
                },
                {
                    "minimum": 0,
                    "multiple": true,
                    "required": false,
                    "modelName": "surface-coarse-fragments-observation",
                    "usesCustomComponent": true
                },
                {
                    "required": false,
                    "modelName": "rock-outcrop-observation",
                    "usesCustomComponent": true
                },
                {
                    "required": false,
                    "modelName": "soil-pit-observation"
                },
                {
                    "multiple": true,
                    "required": false,
                    "modelName": "soil-horizon-observation",
                    "usesCustomComponent": true,
                    "relationOnAttributesModelNames": [
                        "soil-horizon-mottle",
                        "soil-horizon-coarse-fragment",
                        "soil-horizon-structure",
                        "soil-horizon-segregation",
                        "soil-horizon-void",
                        "soil-horizon-pan",
                        "soil-horizon-cutan",
                        "soil-horizon-root"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "mottles",
                        "coarse_fragments",
                        "structure",
                        "segregation",
                        "voids",
                        "pans",
                        "cutans",
                        "roots"
                    ]
                },
                {
                    "required": false,
                    "modelName": "soil-asc",
                    "x-patatoo-hint": "Assess and record the Australian Soil Classification (ASC), including the confidence level, order, suborder, great group, subgroup and family level. Refer to the third edition of The Australian Soil Classification for further descriptions",
                    "overrideDisplayName": "Australian Soil Classification (ASC)"
                },
                {
                    "required": false,
                    "modelName": "soil-classification",
                    "usesCustomComponent": true
                },
                {
                    "labPhase": true,
                    "multiple": true,
                    "required": false,
                    "modelName": "soil-horizon-sample",
                    "usesCustomComponent": true
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": "39da41f1-dd45-4838-ae57-ea50588fd2bc",
            "createdAt": "2024-03-21T06:27:32.240Z",
            "updatedAt": "2024-03-21T06:27:32.240Z"
        }
    },
    {
        "id": 28,
        "attributes": {
            "identifier": "15ea86ab-22f6-43fa-8cd5-751eab2347ad",
            "name": "Soil Sample Pit",
            "module": "Soils",
            "endpointPrefix": "/soil-pit-characterisation-lites",
            "version": 1,
            "description": "Collect soil samples from a 1 m+ soil pit in a plot, including exposing the soil profile to 1 m+, sampling the soil profile in 10 cm increments.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "soil-pit-characterisation-lite",
                    "hasLabPhase": true,
                    "protocol-variant": "lite",
                    "overrideDisplayName": "Soil pit"
                },
                {
                    "labPhase": true,
                    "multiple": true,
                    "required": false,
                    "modelName": "soil-lite-sample",
                    "protocol-variant": "lite",
                    "overrideDisplayName": "Soil pit sample"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.264Z",
            "updatedAt": "2024-03-21T06:27:32.264Z"
        }
    },
    {
        "id": 30,
        "attributes": {
            "identifier": "c1b38b0f-a888-4f28-871b-83da2ac1e533",
            "name": "Vertebrate Fauna - Bird Survey",
            "module": "Vertebrate Fauna",
            "endpointPrefix": "/bird-surveys",
            "version": 1,
            "description": "Conduct a 2 ha, 20 minute survey or 500 m area search recording all bird species, their age class and behaviour details where possible.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "bird-survey",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "weather-observation"
                },
                {
                    "minimum": 1,
                    "multiple": true,
                    "required": true,
                    "modelName": "bird-survey-observation"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.289Z",
            "updatedAt": "2024-03-21T06:27:32.289Z"
        }
    },
    {
        "id": 32,
        "attributes": {
            "identifier": "70fbd236-9e51-47a8-93da-125a18a13acc",
            "name": "Vertebrate Fauna - Identify, Measure and Release",
            "module": "Vertebrate Fauna",
            "endpointPrefix": "/vertebrate-trap-check-surveys",
            "version": 1,
            "description": "Record capture details from trapping conducted including species identification, morphology meausrements, body condition and health status (manditory when trapping is conducted).",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "vertebrate-trap-check-survey",
                    "overrideDisplayName": "Trap Check Survey"
                },
                {
                    "multiple": true,
                    "modelName": "vertebrate-check-trap",
                    "overrideDisplayName": "Check traps",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "vertebrate-captured-individual"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "captured_individual"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.313Z",
            "updatedAt": "2024-03-21T06:27:32.313Z"
        }
    },
    {
        "id": 34,
        "attributes": {
            "identifier": "9d2c3fcf-881b-41df-944d-33bb6ef8ac51",
            "name": "Vertebrate Fauna - Active and Passive Search",
            "module": "Vertebrate Fauna",
            "endpointPrefix": "/vertebrate-active-passive-search-surveys",
            "version": 1,
            "description": "Record all fauna observations whilst actively searching for fauna and signs of fauna and/or conduct passive nocturnal searches.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "vertebrate-active-passive-search-survey",
                    "overrideDisplayName": "Survey setup"
                },
                {
                    "modelName": "vertebrate-active-passive-search",
                    "overrideDisplayName": "Start search",
                    "usesCustomComponent": true
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.337Z",
            "updatedAt": "2024-03-21T06:27:32.337Z"
        }
    },
    {
        "id": 36,
        "attributes": {
            "identifier": "9e75385a-4783-4911-8870-cca78b44d781",
            "name": "Invertebrate Fauna - Wet Pitfall Trapping",
            "module": "Invertebrate Fauna",
            "endpointPrefix": "/invertebrate-wet-pitfall-surveys",
            "version": 1,
            "description": "Conduct pitfall trapping across a grid with a focus on capturing surface active invertebrate taxa.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "wet-pitfall-weather",
                    "overrideDisplayName": "Weather"
                },
                {
                    "modelName": "invertebrate-wet-pitfall-survey",
                    "overrideDisplayName": "Trapping Information"
                },
                {
                    "multiple": true,
                    "modelName": "invertebrate-wet-pitfall-trap",
                    "overrideDisplayName": "Add traps",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "invertebrate-wet-pitfall-trap-grid",
                    "overrideDisplayName": "Trap Grid Photo"
                },
                {
                    "multiple": true,
                    "modelName": "remove-wet-pitfall-trap",
                    "overrideDisplayName": "Remove traps",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "invertebrate-wet-pitfall-vouchering",
                    "overrideDisplayName": "Vouchering",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.363Z",
            "updatedAt": "2024-03-21T06:27:32.363Z"
        }
    },
    {
        "id": 37,
        "attributes": {
            "identifier": "7dc49039-4999-43f6-8896-e33d7b28a934",
            "name": "Invertebrate Fauna - Rapid Ground Trapping",
            "module": "Invertebrate Fauna",
            "endpointPrefix": "/invertebrate-rapid-ground-trappings",
            "version": 1,
            "description": "Conduct invertebrate trapping using baits with a focus on documenting the distribution and abundance of dominant ant species across a project area.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "invertebrate-rapid-ground-trapping",
                    "usesCustomComponent": "true"
                },
                {
                    "maximum": 4,
                    "minimum": 4,
                    "multiple": true,
                    "modelName": "invertebrate-rapid-trap",
                    "overrideDisplayName": "Vouchering",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.374Z",
            "updatedAt": "2024-03-21T06:27:32.374Z"
        }
    },
    {
        "id": 39,
        "attributes": {
            "identifier": "7b0e4526-726e-4292-a897-238f336ce51e",
            "name": "Invertebrate Fauna - Pan Trapping",
            "module": "Invertebrate Fauna",
            "endpointPrefix": "/invertebrate-pan-trappings",
            "version": 1,
            "description": "Conduct invertebrate trapping using coloured pans filled with liquid. Commonly used for monitoring bees and pollinators.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "invertebrate-pan-trapping",
                    "overrideDisplayName": "Survey setup"
                },
                {
                    "multiple": true,
                    "modelName": "invertebrate-pan-trap",
                    "overrideDisplayName": "Add traps",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "remove-pan-trap",
                    "overrideDisplayName": "Remove traps",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "pan-trap-vouchering",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.401Z",
            "updatedAt": "2024-03-21T06:27:32.401Z"
        }
    },
    {
        "id": 41,
        "attributes": {
            "identifier": "aa64fd4d-2c5a-4f84-a197-9f3ce6409152",
            "name": "Invertebrate Fauna - Post-field Sampling Curation",
            "module": "Invertebrate Fauna",
            "endpointPrefix": "",
            "version": 1,
            "description": "Instructions for invertebrate specimen presevation, sorting and storage of specimens.",
            "isWritable": false,
            "workflow": [],
            "isHidden": true,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.424Z",
            "updatedAt": "2024-03-21T06:27:32.424Z"
        }
    },
    {
        "id": 43,
        "attributes": {
            "identifier": "08adf0ff-43c1-4f19-b2c4-f5da667baf65",
            "name": "Interventions - Data Collection",
            "module": "Interventions",
            "endpointPrefix": "/interventions-general-project-informations",
            "version": 1,
            "description": "Record the location of intervention activities and detailed information about the nature of the intervention and how it was undertaken.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "interventions-general-project-information",
                    "splitSurveyStep": true
                },
                {
                    "multiple": true,
                    "modelName": "interventions",
                    "deepPopulate": true,
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.447Z",
            "updatedAt": "2024-03-21T06:27:32.447Z"
        }
    },
    {
        "id": 45,
        "attributes": {
            "identifier": "6000cb5f-ad75-41e2-9e3e-c070c527453a",
            "name": "Metadata Collection",
            "module": "Targeted Surveys",
            "endpointPrefix": "/new-targeted-surveys",
            "version": 1,
            "description": "Record metadata for any other survey method employed",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "new-targeted-survey",
                    "splitSurveyStep": true
                },
                {
                    "modelName": "metadata-collection",
                    "usesCustomComponent": true
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.474Z",
            "updatedAt": "2024-03-21T06:27:32.474Z"
        }
    },
    {
        "id": 48,
        "attributes": {
            "identifier": "3db7f7b6-a96d-495a-9981-5d6170a7458d",
            "name": "Camera Trap Retrieval",
            "module": "Camera Trapping",
            "endpointPrefix": "/camera-trap-retrieval-surveys",
            "version": 1,
            "description": "Camera traps retrieved at the end of the deployment period.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "camera-trap-retrieval-survey",
                    "splitSurveyStep": true,
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "camera-trap-retrieval-point",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.511Z",
            "updatedAt": "2024-03-21T06:27:32.511Z"
        }
    },
    {
        "id": 50,
        "attributes": {
            "identifier": "648d545a-cdae-4c19-bc65-0c9f93d9c0eb",
            "name": "Sign-based Fauna Surveys - Within-plot Belt Transect",
            "module": "Sign-based Fauna Surveys",
            "endpointPrefix": "/within-plot-belt-transect-surveys",
            "version": 1,
            "description": "Record presence and age of fauna signs and their attributing species occuring along 1 m x 100 m transect/s within a plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout"
                },
                {
                    "modelName": "plot-visit"
                },
                {
                    "modelName": "within-plot-belt-transect-survey",
                    "overrideDisplayName": "Transect setup",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "within-plot-belt-transect",
                    "overrideDisplayName": "Commence transect survey",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "within-plot-belt-quadrat"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "quadrat"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.540Z",
            "updatedAt": "2024-03-21T06:27:32.540Z"
        }
    },
    {
        "id": 52,
        "attributes": {
            "identifier": "cc826a19-a1e7-4dfe-8d6e-f135d258d7f9",
            "name": "Sign-based Fauna - Plot Sign Search",
            "module": "Sign-based Fauna Surveys",
            "endpointPrefix": "/sign-based-active-plot-search-surveys",
            "version": 1,
            "description": "Record presence and age of fauna signs and their attributing species occuring within a plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout"
                },
                {
                    "modelName": "plot-visit"
                },
                {
                    "modelName": "sign-based-active-plot-search-survey",
                    "overrideDisplayName": "Survey setup",
                    "usesCustomComponent": true
                },
                {
                    "modelName": "sign-based-active-plot-search",
                    "overrideDisplayName": "Commence search",
                    "usesCustomComponent": true
                },
                {
                    "required": false,
                    "modelName": "sign-based-nearby-track-plot",
                    "overrideDisplayName": "Nearby track plot",
                    "usesCustomComponent": true
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.567Z",
            "updatedAt": "2024-03-21T06:27:32.567Z"
        }
    },
    {
        "id": 55,
        "attributes": {
            "identifier": "a76dac21-94f4-4851-af91-31f6dd00750f",
            "name": "Fauna Ground Counts Transects",
            "module": "Fauna Ground Counts",
            "endpointPrefix": "/fauna-ground-counts-surveys",
            "version": 1,
            "description": "Record the survey details and any observations of fauna along a transect.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "fauna-ground-counts-survey",
                    "wrapperStepOnly": true
                },
                {
                    "multiple": true,
                    "modelName": "field-reconnaissance-and-transect-set-up",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "fauna-ground-counts-observation",
                    "overrideDisplayName": "Survey Setup",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "observer-detail"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "observer_details"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.602Z",
            "updatedAt": "2024-03-21T06:27:32.602Z"
        }
    },
    {
        "id": 57,
        "attributes": {
            "identifier": "80360ceb-bd6d-4ed4-b2ea-9bd45d101d0e",
            "name": "Pest Fauna - Control Activities",
            "module": "Pest Fauna Control Activities",
            "endpointPrefix": "/pest-fauna-control-activities",
            "version": 1,
            "description": "Record numbers of pest animals removed from the population as a result of control activities undertaken.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "pest-fauna-control-activity",
                    "splitSurveyStep": true,
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "control-activity-observation",
                    "deepPopulate": true,
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.627Z",
            "updatedAt": "2024-03-21T06:27:32.627Z"
        }
    },
    {
        "id": 35,
        "attributes": {
            "identifier": "0628e486-9b33-4d86-98db-c6d3f10f7744",
            "name": "Vertebrate Fauna - Acoustic and Ultrasonic Recordings",
            "module": "Vertebrate Fauna",
            "endpointPrefix": "",
            "version": 1,
            "description": "Record the details for acoustic recorders in the Biodiversity plot. Acoustic recorders may be set to record acoustic calls (birds, frogs and invertebrates) or ultrasonic calls (bats) depending on the equipment used.",
            "isWritable": false,
            "workflow": [],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.349Z",
            "updatedAt": "2024-03-21T06:27:32.349Z"
        }
    },
    {
        "id": 38,
        "attributes": {
            "identifier": "82463b77-aac2-407c-a03c-8669bd73baf0",
            "name": "Invertebrate Fauna - Malaise Trapping",
            "module": "Invertebrate Fauna",
            "endpointPrefix": "/invertebrate-malaise-trappings",
            "version": 1,
            "description": "Conduct invertebrate trapping using a malaise trap. Commonly used for collecting arthripod and other flying insect taxa.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "invertebrate-malaise-trapping",
                    "overrideDisplayName": "Survey setup"
                },
                {
                    "multiple": true,
                    "modelName": "invertebrate-malaise-trap",
                    "overrideDisplayName": "Add traps",
                    "usesCustomComponent": "true"
                },
                {
                    "minimum": 0,
                    "multiple": true,
                    "required": false,
                    "modelName": "add-malaise-sample",
                    "overrideDisplayName": "Add samples",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "remove-malaise-trap",
                    "overrideDisplayName": "Remove traps",
                    "usesCustomComponent": "true"
                },
                {
                    "minimum": 0,
                    "multiple": true,
                    "required": false,
                    "modelName": "malaise-trap-vouchering",
                    "overrideDisplayName": "Vouchering",
                    "usesCustomComponent": "true"
                },
                {
                    "minimum": 0,
                    "multiple": true,
                    "required": false,
                    "modelName": "malaise-biomass",
                    "overrideDisplayName": "Biomass",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.388Z",
            "updatedAt": "2024-03-21T06:27:32.388Z"
        }
    },
    {
        "id": 40,
        "attributes": {
            "identifier": "8041a1a4-3e19-4fd2-86b9-d453023b5592",
            "name": "Invertebrate Fauna - Active Search",
            "module": "Invertebrate Fauna",
            "endpointPrefix": "/invertebrate-active-search-surveys",
            "version": 1,
            "description": "Search the plot to collect representative specimens and create an inventory of as many invertebrate taxa as possible within a set time.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "invertebrate-active-search-survey",
                    "overrideDisplayName": "Survey setup",
                    "usesCustomComponent": true
                },
                {
                    "modelName": "invertebrate-active-search",
                    "overrideDisplayName": "Start search",
                    "usesCustomComponent": true
                },
                {
                    "multiple": true,
                    "modelName": "invertebrate-active-search-sample",
                    "overrideDisplayName": "Vouchering"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.412Z",
            "updatedAt": "2024-03-21T06:27:32.412Z"
        }
    },
    {
        "id": 42,
        "attributes": {
            "identifier": "7f95710a-2003-4119-a2c6-41ce4e34d12a",
            "name": "Condition - Attributes",
            "module": "Condition",
            "endpointPrefix": "/condition-surveys",
            "version": 1,
            "description": "Collect data on a suite of condition indicators to describe biodiversity condition.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "condition-survey"
                },
                {
                    "multiple": true,
                    "modelName": "condition-tree-survey",
                    "usesCustomComponent": "true"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.435Z",
            "updatedAt": "2024-03-21T06:27:32.435Z"
        }
    },
    {
        "id": 44,
        "attributes": {
            "identifier": "aae4dbd8-845a-406e-b682-ef01c3497711",
            "name": "Dev Sandbox Bulk Survey",
            "module": "None",
            "endpointPrefix": "/dev-sandbox-bulk-surveys",
            "version": 1,
            "description": "",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "dev-sandbox-bulk-survey"
                },
                {
                    "multiple": true,
                    "modelName": "dev-sandbox-bulk-observation"
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.462Z",
            "updatedAt": "2024-03-21T06:27:32.462Z"
        }
    },
    {
        "id": 46,
        "attributes": {
            "identifier": "ad088dbe-02b2-472a-901f-bd081e590bcf",
            "name": "Camera Trap Deployment",
            "module": "Camera Trapping",
            "endpointPrefix": "/camera-trap-deployment-surveys",
            "version": 1,
            "description": "Camera traps deployed at points of interest, in an array or at a plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "camera-trap-deployment-survey",
                    "splitSurveyStep": true,
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "camera-trap-deployment-point",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "camera-trap-feature",
                        "camera-trap-information",
                        "camera-trap-setting"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "features",
                        "camera_trap_information",
                        "camera_trap_settings"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.488Z",
            "updatedAt": "2024-03-21T06:27:32.488Z"
        }
    },
    {
        "id": 47,
        "attributes": {
            "identifier": "949ae38f-c047-42a7-8164-38c24ede35d5",
            "name": "Camera Trap Reequipping",
            "module": "Camera Trapping",
            "endpointPrefix": "/camera-trap-reequipping-surveys",
            "version": 1,
            "description": "Camera trap batteries and SD cards replaced to extend deployment.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "camera-trap-reequipping-survey",
                    "splitSurveyStep": true,
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "camera-trap-reequipping-point",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "camera-trap-information",
                        "camera-trap-setting"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "camera_trap_information",
                        "camera_trap_settings"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.499Z",
            "updatedAt": "2024-03-21T06:27:32.499Z"
        }
    },
    {
        "id": 49,
        "attributes": {
            "identifier": "90c0f4cc-a22a-4820-9a8b-a01564bc197a",
            "name": "Fauna Aerial Survey",
            "module": "Fauna Aerial Surveys",
            "endpointPrefix": "/aerial-surveys",
            "version": 1,
            "description": "Record the survey details, distance travelled and species counts for surveys undertaken from an aircraft.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "aerial-survey",
                    "splitSurveyStep": true,
                    "usesCustomComponent": "true"
                },
                {
                    "required": false,
                    "modelName": "aerial-setup-desktop",
                    "defaultHidden": true,
                    "overrideDisplayName": "Fauna aerial setup - desktop",
                    "usesCustomComponent": "true"
                },
                {
                    "required": false,
                    "modelName": "aerial-observation",
                    "defaultHidden": true,
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "ferals-aerial-count-survey"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "ferals_aerial_count_survey"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.525Z",
            "updatedAt": "2024-03-21T06:27:32.525Z"
        }
    },
    {
        "id": 51,
        "attributes": {
            "identifier": "2cd7b489-b582-41f6-9dcc-264f6ea7801a",
            "name": "Sign-based Fauna Surveys - Off-plot Belt Transect",
            "module": "Sign-based Fauna Surveys",
            "endpointPrefix": "/off-plot-belt-transect-surveys",
            "version": 1,
            "description": "Record the presence and age of fauna signs and their attributing species occuring along a belt transect of user specified length and width outside of a plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "off-plot-belt-transect-survey",
                    "deepPopulate": true,
                    "splitSurveyStep": true,
                    "overrideDisplayName": "Transect setup",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "off-plot-belt-transect",
                    "overrideDisplayName": "Commence transect survey",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "off-plot-belt-quadrat"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "quadrat"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.552Z",
            "updatedAt": "2024-03-21T06:27:32.552Z"
        }
    },
    {
        "id": 53,
        "attributes": {
            "identifier": "0c5d1d14-c71b-467f-aced-abe1c83c15d3",
            "name": "Sign-based Fauna - Vehicle Track",
            "module": "Sign-based Fauna Surveys",
            "endpointPrefix": "/sign-based-vehicle-track-set-ups",
            "version": 1,
            "description": "Set up vehicle track transect/s and return on subsequent days record the presence of fauna tracks and their attributing species.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout"
                },
                {
                    "modelName": "plot-visit"
                },
                {
                    "modelName": "sign-based-vehicle-track-set-up",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "sign-based-vehicle-track-observation",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "sign-based-vehicle-track-log"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "observations"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.578Z",
            "updatedAt": "2024-03-21T06:27:32.578Z"
        }
    },
    {
        "id": 54,
        "attributes": {
            "identifier": "685b5e9b-20c2-4688-9b04-b6caaf084aad",
            "name": "Sign-based Fauna - Track Station",
            "module": "Sign-based Fauna Surveys",
            "endpointPrefix": "/sign-based-track-station-survey-setups",
            "version": 1,
            "description": "Set up a track station and return on subsequent days to record the presence of fauna tracks and their attributing speices.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout"
                },
                {
                    "modelName": "plot-visit"
                },
                {
                    "modelName": "sign-based-track-station-survey-setup",
                    "deepPopulate": true,
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "sign-based-track-station-observation",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "sign-based-track-station-log"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "tracks"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.590Z",
            "updatedAt": "2024-03-21T06:27:32.590Z"
        }
    },
    {
        "id": 56,
        "attributes": {
            "identifier": "d706fd34-2f05-4559-b738-a65615a3d756",
            "name": "Fauna Ground Counts Vantage Point",
            "module": "Fauna Ground Counts",
            "endpointPrefix": "/ground-counts-vantage-point-surveys",
            "version": 1,
            "description": "Record the survey details and any observations of fauna from a vantage point.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "ground-counts-vantage-point-survey",
                    "wrapperStepOnly": true
                },
                {
                    "multiple": true,
                    "modelName": "ground-counts-vantage-point",
                    "overrideDisplayName": "Field Reconnaissance and Vantage Point Setup",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "ground-counts-vantage-point-setup",
                    "overrideDisplayName": "Survey Set Up",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "ground-counts-vantage-point-observation"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "observations"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.613Z",
            "updatedAt": "2024-03-21T06:27:32.613Z"
        }
    },
    {
        "id": 58,
        "attributes": {
            "identifier": "06cd903e-b8b3-40a5-add4-f779739cce35",
            "name": "Herbivory and Physical Damage - Within-plot Belt Transect",
            "module": "Herbivory and Physical Damage",
            "endpointPrefix": "/herbivory-and-physical-damage-belt-transect-setups",
            "version": 1,
            "description": "Record signs of herbivory and physical damage to vegetation and land along a 1 m x 100 m belt transect within a plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "herbivory-and-physical-damage-belt-transect-setup",
                    "overrideDisplayName": "Field Reconnaissance and Transect Set Up",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "herbivory-and-physical-damage-transect",
                    "overrideDisplayName": "Conduct the Survey",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "herbivory-and-physical-damage-quadrat"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "quadrat"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.639Z",
            "updatedAt": "2024-03-21T06:27:32.639Z"
        }
    },
    {
        "id": 59,
        "attributes": {
            "identifier": "49d02f5d-b148-4b5b-ad6a-90e48c81b294",
            "name": "Herbivory and Physical Damage - Off-plot Transect",
            "module": "Herbivory and Physical Damage",
            "endpointPrefix": "/herbivory-off-plot-belt-transect-setups",
            "version": 1,
            "description": "Record signs of herbivory and physical damage to vegetation and land along a belt transect of user specified length and width outside of a plot.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "herbivory-off-plot-belt-transect-setup",
                    "deepPopulate": true,
                    "splitSurveyStep": true,
                    "overrideDisplayName": "Field Reconnaissance and Transect Set Up",
                    "usesCustomComponent": "true"
                },
                {
                    "multiple": true,
                    "modelName": "herbivory-off-plot-transect",
                    "overrideDisplayName": "Conduct the Survey",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "herbivory-and-physical-damage-quadrat"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "quadrat"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.658Z",
            "updatedAt": "2024-03-21T06:27:32.658Z"
        }
    },
    {
        "id": 60,
        "attributes": {
            "identifier": "228e5e1e-aa9f-47a3-930b-c1468757f81d",
            "name": "Herbivory and Physical Damage - Active Plot Search",
            "module": "Herbivory and Physical Damage",
            "endpointPrefix": "/herbivory-and-physical-damage-active-search-setups",
            "version": 1,
            "description": "Record signs of herbivory and physical damage observed within a plot. Best suited where herbivory and physical damage is isolated and not homogenous across the project area.",
            "isWritable": true,
            "workflow": [
                {
                    "modelName": "plot-layout",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "plot-visit",
                    "usesCustomComponent": "true"
                },
                {
                    "modelName": "herbivory-and-physical-damage-active-search-setup",
                    "overrideDisplayName": "Reconnaissance and survey setup"
                },
                {
                    "modelName": "herbivory-and-physical-damage-active-search-transect",
                    "overrideDisplayName": "Conduct the Survey",
                    "usesCustomComponent": "true",
                    "relationOnAttributesModelNames": [
                        "hapd-active-search-observation"
                    ],
                    "newInstanceForRelationOnAttributes": [
                        "hapd_observed"
                    ]
                }
            ],
            "isHidden": false,
            "nextProtSuggestion": null,
            "createdAt": "2024-03-21T06:27:32.674Z",
            "updatedAt": "2024-03-21T06:27:32.674Z"
        }
    }
];

const key = 'paratoo.protocols';
const data = JSON.stringify(protocols);

db.setting.insert({key:key, value:data});
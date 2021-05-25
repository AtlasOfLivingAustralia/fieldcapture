var revegetation = {
    "dateCreated": ISODate("2019-06-25T06:36:13Z"),
    "minOptionalSectionsCompleted": NumberInt(1),
    "supportsSites": true,
    "lastUpdated": ISODate("2019-06-25T06:36:13Z"),
    "createdUserId": "<anon>",
    "activationDate": null,
    "supportsPhotoPoints": true,
    "publicationStatus": "published",
    "gmsId": "RVA RVN RVSS RVT2A RVT2B RVS2B",
    "name": "Revegetation",
    "sections": [
        {
            "collapsedByDefault": false,
            "template": {
                "dataModel": [
                    {
                        "dataType": "text",
                        "name": "revegetationMethod",
                        "dwcAttribute": "establishmentMeans",
                        "description": "The method used for planting",
                        "constraints": [
                            "Direct drill seeding",
                            "Hand broadcast seeding",
                            "Hand planting",
                            "Machine planting",
                            "Natural regeneration from threat exclusion / removal",
                            "Infill plantings",
                            "Combination of methods"
                        ],
                        "validate": "required"
                    },
                    {
                        "dataType": "text",
                        "name": "vegDescriptionAtPlanting",
                        "dwcAttribute": "habitat",
                        "description": "General description of the vegetative cover on the planting site at the time of planting",
                        "constraints": [
                            "Bare substrate",
                            "Exotic grassland/pasture",
                            "Mixed exotic/native grassland/pasture",
                            "Native grassland/pasture",
                            "Sparse/scattered shrubland",
                            "Open grassy woodland",
                            "Other (specify in notes)"
                        ],
                        "validate": "required"
                    },
                    {
                        "dataType": "text",
                        "name": "equipmentUsed",
                        "description": "Simple description of the type of planting equipment used"
                    },
                    {
                        "dataType": "text",
                        "name": "adjacentLanduse",
                        "description": "The predominant land use adjoining the planting site",
                        "constraints": [
                            "Conservation",
                            "Livestock",
                            "Cropping",
                            "Recreational",
                            "Rural",
                            "Residential",
                            "Industrial",
                            "Commercial or Business"
                        ]
                    },
                    {
                        "dataType": "text",
                        "name": "connectivityIndex",
                        "description": "Estimate of the 'connectedness' of the planting site with other native vegetation around it. Choose the most representative category.",
                        "constraints": [
                            "Patch linked to other vegetation via riparian link",
                            "Patch <1km from a patch of more than 1000ha",
                            "Patch <1km from a patch of 100 to 1000ha",
                            "Patch <1km from a patch of 25 to 100ha",
                            "Patch <1km from a patch of less than 25ha",
                            "Isolated forest or woodland remnant >1km from other remnants",
                            "Isolated grassland >1km from other remnants",
                            "No vegetation within 1km",
                            "Only isolated Paddock trees within 1 km",
                            "Patch surrounded by grazing",
                            "Patch surrounded by cropping"
                        ],
                        "validate": "required"
                    },
                    {
                        "dataType": "stringList",
                        "name": "environmentalBenefits",
                        "description": "Environmental benefits /outcomes expected to be achieved through implementing the activity.",
                        "constraints": [
                            "Groundwater recharge management",
                            "Groundwater discharge or salinity management",
                            "Home range / extent improvement",
                            "Habitat condition improvement",
                            "Improved habitat connectivity",
                            "Improved / increased fauna habitat",
                            "Improved vegetation condition",
                            "Improved vegetation connectivity",
                            "Improved vegetation extent",
                            "Nutrient cycling",
                            "Soil stabilisation",
                            "Riparian rehabilitation"
                        ]
                    },
                    {
                        "dataType": "stringList",
                        "name": "guardType",
                        "description": "Type of guard used to protect planted seedlings",
                        "constraints": [
                            "None",
                            "Carton",
                            "Corflute",
                            "Mesh",
                            "Plastic sleeve",
                            "Other"
                        ]
                    },
                    {
                        "dataType": "number",
                        "name": "areaRevegHa",
                        "description": "The area in hectares of the revegetation works area",
                        "validate": "required"
                    },
                    {
                        "dataType": "number",
                        "name": "lengthReveg",
                        "description": "The length in kilometres of the revegetation works area. This field should only be used for linear sites"
                    },
                    {
                        "dataType": "number",
                        "name": "activityDuration",
                        "dwcAttribute": "samplingEffort",
                        "description": "The duration of the planting activity in hours"
                    },
                    {
                        "columns": [
                            {
                                "dataType": "species",
                                "dwcAttribute": "scientificName",
                                "speciesList": "project",
                                "noTotal": "true",
                                "name": "species",
                                "description": "The species planted / sown. (start typing a  scientific or common name for a species)",
                                "validate": "required"
                            },
                            {
                                "dataType": "number",
                                "dwcAttribute": "individualCount",
                                "name": "numberPlanted",
                                "description": "Number of plants planted",
                                "validate": "required,integer,min[0]"
                            },
                            {
                                "dataType": "number",
                                "name": "seedSownKg",
                                "description": "Weight of seed direct sown in kilograms",
                                "validate": "required"
                            },
                            {
                                "dataType": "text",
                                "noTotal": "true",
                                "name": "stockType",
                                "description": "The type of plantstock used for plantings",
                                "constraints": [
                                    "Seed",
                                    "Tube",
                                    "Advanced",
                                    "Cutting",
                                    "Other"
                                ],
                                "validate": "required"
                            },
                            {
                                "dataType": "text",
                                "noTotal": "true",
                                "name": "structuralLayer",
                                "description": "The structural layer of vegetation that planted plants will occupy when mature",
                                "constraints": [
                                    "Overstory",
                                    "Midstory",
                                    "Understory",
                                    "Ground stratum"
                                ],
                                "validate": "required"
                            },
                            {
                                "dataType": "text",
                                "name": "matureHeight",
                                "description": "The expected height class of mature plants of this species in the planted location.",
                                "constraints": [
                                    "> 2 metres",
                                    "< 2 metres"
                                ],
                                "validate": "required"
                            },
                            {
                                "dataType": "text",
                                "dwcAttribute": "locality",
                                "name": "stockProvenance",
                                "description": "The name of the locality from which the seedstock was collected"
                            },
                            {
                                "dataType": "number",
                                "name": "stockCostPerUnit",
                                "description": "The average cost per plant or kilogram of seed as applicable"
                            }
                        ],
                        "dataType": "list",
                        "name": "planting"
                    },
                    {
                        "computed": {
                            "dependents": {
                                "fromList": "planting",
                                "source": "numberPlanted"
                            },
                            "operation": "sum"
                        },
                        "primaryResult": "true",
                        "dataType": "number",
                        "name": "totalNumberPlanted",
                        "description": "Aggregate total of plants planted"
                    },
                    {
                        "computed": {
                            "dependents": {
                                "fromList": "planting",
                                "source": "seedSownKg"
                            },
                            "operation": "sum"
                        },
                        "primaryResult": "true",
                        "dataType": "number",
                        "name": "totalSeedSownKg",
                        "description": "Aggregate total of seed sown"
                    },
                    {
                        "dataType": "text",
                        "name": "notes",
                        "dwcAttribute": "eventRemarks",
                        "description": "Please enter any additional comments or notes about this planting activity"
                    }
                ],
                "modelName": "Revegetation",
                "record": "true",
                "viewModel": [
                    {
                        "footer": {
                            "rows": [
                                {
                                    "columns": [
                                        {
                                            "computed": null,
                                            "source": "Total Seedlings Planted:",
                                            "type": "literal"
                                        },
                                        {
                                            "computed": "{\"operation\":\"sum\",\"dependents\":{\"source\":\"numberPlanted\",\"fromList\":\"planted\"}}",
                                            "source": "totalNumberPlanted",
                                            "type": "number"
                                        },
                                        {
                                            "computed": null,
                                            "source": "Total Seed Sown (Kg):",
                                            "type": "literal"
                                        },
                                        {
                                            "computed": "{\"operation\":\"sum\",\"dependents\":{\"source\":\"seedSownKg\",\"fromList\":\"planted\"}}",
                                            "source": "totalSeedSownKg",
                                            "type": "number"
                                        },
                                        {
                                            "colspan": 3,
                                            "computed": null,
                                            "source": "",
                                            "type": "literal"
                                        }
                                    ]
                                }
                            ]
                        },
                        "columns": [
                            {
                                "computed": null,
                                "width": "20%",
                                "source": "species",
                                "title": "Species:",
                                "type": "autocomplete"
                            },
                            {
                                "computed": null,
                                "width": "10%",
                                "source": "numberPlanted",
                                "title": "No. Planted:",
                                "type": "number"
                            },
                            {
                                "computed": null,
                                "width": "10%",
                                "source": "seedSownKg",
                                "title": "Seed Sown (Kg):",
                                "type": "number"
                            },
                            {
                                "width": "10%",
                                "source": "stockType",
                                "title": "Type of stock",
                                "type": "selectOne"
                            },
                            {
                                "width": "10%",
                                "source": "structuralLayer",
                                "title": "Structural Layer",
                                "type": "selectOne"
                            },
                            {
                                "width": "10%",
                                "source": "matureHeight",
                                "title": "Mature height",
                                "type": "selectOne"
                            },
                            {
                                "width": "10%",
                                "source": "stockProvenance",
                                "title": "Stock Provenance",
                                "type": "text"
                            },
                            {
                                "computed": null,
                                "width": "10%",
                                "source": "stockCostPerUnit",
                                "title": "Cost / unit ($)",
                                "type": "number"
                            }
                        ],
                        "userAddedRows": true,
                        "source": "planting",
                        "title": "Please list the numbers of each species planted during this activity and any additional information that you can that is relevant:",
                        "type": "table",
                        "class": "output-section"
                    },
                    {
                        "type": "row",
                        "items": [
                            {
                                "computed": null,
                                "type": "col",
                                "items": [
                                    {
                                        "preLabel": "Vegetation at time of planting:",
                                        "computed": null,
                                        "source": "vegDescriptionAtPlanting",
                                        "type": "selectOne"
                                    },
                                    {
                                        "preLabel": "Revegetation method:",
                                        "computed": null,
                                        "source": "revegetationMethod",
                                        "type": "selectOne"
                                    },
                                    {
                                        "preLabel": "Equipment used:",
                                        "computed": null,
                                        "source": "equipmentUsed",
                                        "type": "textarea"
                                    },
                                    {
                                        "preLabel": "Adjacent landuse:",
                                        "computed": null,
                                        "source": "adjacentLanduse",
                                        "type": "selectOne"
                                    },
                                    {
                                        "preLabel": "Landscape connectivity:",
                                        "computed": null,
                                        "source": "connectivityIndex",
                                        "type": "selectOne"
                                    },
                                    {
                                        "preLabel": "Area of revegetation works (Ha):",
                                        "computed": null,
                                        "source": "areaRevegHa",
                                        "type": "number"
                                    },
                                    {
                                        "preLabel": "Length of planting (metres) - if site is linear:",
                                        "computed": null,
                                        "source": "lengthReveg",
                                        "type": "number"
                                    },
                                    {
                                        "preLabel": "Duration of the activity (hours):",
                                        "computed": null,
                                        "source": "activityDuration",
                                        "type": "number"
                                    }
                                ]
                            },
                            {
                                "computed": null,
                                "type": "col",
                                "items": [
                                    {
                                        "preLabel": "Environmental benefits / outcomes expected to be achieved:",
                                        "computed": null,
                                        "source": "environmentalBenefits",
                                        "type": "selectMany"
                                    }
                                ]
                            },
                            {
                                "computed": null,
                                "type": "col",
                                "items": [
                                    {
                                        "preLabel": "Type(s) of guard used",
                                        "computed": null,
                                        "source": "guardType",
                                        "type": "selectMany"
                                    }
                                ]
                            }
                        ],
                        "class": "output-section"
                    },
                    {
                        "type": "row",
                        "items": [
                            {
                                "preLabel": "Comments / Notes:",
                                "computed": null,
                                "width": "90%",
                                "source": "notes",
                                "type": "textarea"
                            }
                        ],
                        "class": "output-section"
                    }
                ]
            },
            "modelName": null,
            "templateName": "revegetationDetails",
            "optional": false,
            "optionalQuestionText": null,
            "title": null,
            "name": "Revegetation Details"
        },
        {
            "collapsedByDefault": false,
            "template": {
                "dataModel": [
                    {
                        "dataType": "number",
                        "primaryResult": "true",
                        "description": "The total number of people involved in an activity who are not delivery partners or employed in the project. These would typically be the volunteer participants and/or event attendees.",
                        "name": "totalParticipantsNotEmployed",
                        "validate": "required,min[0]"
                    },
                    {
                        "dataType": "number",
                        "description": "The number of indigenous people participating in an activity who are not delivery partners or employed in the project (ie. Indigenous volunteers)",
                        "name": "numberOfIndigenousParticipants",
                        "validate": "required,min[0]"
                    },
                    {
                        "dataType": "number",
                        "description": "The number of unique indigenous on-country visits undertaken as part of this activity",
                        "name": "numberOnCountryVisits",
                        "validate": "required,min[0]"
                    },
                    {
                        "dataType": "number",
                        "description": "The number of people involved in an activity who have not attended other activities associated with the project",
                        "name": "totalParticipantsNew",
                        "validate": "required,min[0]"
                    },
                    {
                        "dataType": "number",
                        "description": "The number of different community groups (non delivery partners) participating in this activity",
                        "name": "numberOfCommunityGroups",
                        "validate": "required,min[0]"
                    },
                    {
                        "dataType": "number",
                        "description": "A farming entity is a farm business (whether sole trader, partnership, company, etc.) that would be considered a primary producer for tax purposes.",
                        "name": "numberOfFarmingEntitiesNew",
                        "validate": "required,min[0]"
                    }
                ],
                "modelName": "Participant Information",
                "viewModel": [
                    {
                        "items": [
                            {
                                "items": [
                                    {
                                        "source": "totalParticipantsNotEmployed",
                                        "preLabel": "Total no. of participants (ie. not employed on project):",
                                        "computed": null,
                                        "type": "number"
                                    },
                                    {
                                        "source": "numberOfIndigenousParticipants",
                                        "preLabel": "No. of Indigenous participants (ie. not employed on project):",
                                        "computed": null,
                                        "type": "number"
                                    }
                                ],
                                "computed": null,
                                "width": "30%",
                                "type": "col"
                            },
                            {
                                "items": [
                                    {
                                        "source": "totalParticipantsNew",
                                        "preLabel": "No. of new people attending project events or activities:",
                                        "computed": null,
                                        "type": "number"
                                    },
                                    {
                                        "source": "numberOfFarmingEntitiesNew",
                                        "preLabel": "No. of farming entities participating in project activities for the first time:",
                                        "computed": null,
                                        "type": "number"
                                    }
                                ],
                                "computed": null,
                                "width": "30%",
                                "type": "col"
                            },
                            {
                                "items": [
                                    {
                                        "source": "numberOfCommunityGroups",
                                        "preLabel": "No. of community groups (non delivery partners) participating:",
                                        "computed": null,
                                        "type": "number"
                                    },
                                    {
                                        "source": "numberOnCountryVisits",
                                        "preLabel": "No. of Indigenous on-country visits:",
                                        "computed": null,
                                        "type": "number"
                                    }
                                ],
                                "computed": null,
                                "width": "30%",
                                "type": "col"
                            }
                        ],
                        "class": "output-section",
                        "type": "row"
                    }
                ]
            },
            "modelName": null,
            "templateName": "participation",
            "optional": false,
            "optionalQuestionText": null,
            "title": null,
            "name": "Participant Information"
        }
    ],
    "type": "Activity",
    "category": "Implementation actions",
    "status": "active",
    "lastUpdatedUserId": "<anon>",
    "formVersion": NumberInt(1)
}

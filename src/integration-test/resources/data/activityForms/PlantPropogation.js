var plantPropogation = {
    "dateCreated": ISODate("2019-06-25T06:36:13Z"),
    "minOptionalSectionsCompleted": NumberInt(1),
    "supportsSites": false,
    "lastUpdated": ISODate("2019-06-25T06:36:13Z"),
    "createdUserId": "<anon>",
    "activationDate": null,
    "supportsPhotoPoints": false,
    "publicationStatus": "published",
    "gmsId": "PPRP",
    "name": "Plant Propagation",
    "sections": [
    {
        "collapsedByDefault": false,
        "template": {
            "class": "output-section",
            "dataModel": [
                {
                    "dataType": "date",
                    "name": "batchTreatmentDate",
                    "description": ""
                },
                {
                    "indexName": "taxonName",
                    "dataType": "species",
                    "name": "species",
                    "description": "Species propagated",
                    "validate": "required"
                },
                {
                    "indexName": "seedBatchId",
                    "dataType": "text",
                    "name": "batchId",
                    "description": ""
                },
                {
                    "indexName": "seedCatalogueNumber",
                    "dataType": "text",
                    "name": "catalogueNumber",
                    "description": "The catalogue/accession number allocated to the batch of seed in the seedbank/collection."
                },
                {
                    "columns": [
                        {
                            "indexName": "seedBatchTestSampleId",
                            "dataType": "text",
                            "name": "sampleId",
                            "description": "An identifier for the sample tested.",
                            "validate": "required"
                        },
                        {
                            "primaryResult": "true",
                            "dataType": "number",
                            "name": "seedWeightTestedInGrams",
                            "description": "Weight in grams of seed propagated in batch test."
                        },
                        {
                            "indexName": "seedTreatmentMethod",
                            "dataType": "text",
                            "name": "treatmentMethod",
                            "description": "The main method used to treat seed for each sample test.",
                            "constraints": [
                                "Direct sowing - pre-treated (abrasion / scarification)",
                                "Direct sowing - pre-treated (cold stratification)",
                                "Direct sowing - pre-treated (moist stratification)",
                                "Direct sowing - pre-treated (cold moist stratification)",
                                "Direct sowing - pre-treated (freezing and thawing)",
                                "Direct sowing - pre-treated (light)",
                                "Direct sowing - pre-treated (Hot Water)",
                                "Direct sowing - pre-treated (fire)",
                                "Direct sowing - pre-treated (smoke)",
                                "Direct sowing - pre-treated (leaching)",
                                "Direct sowing - seeds untreated",
                                "Mycorrhizal inoculation",
                                "Vegetative - cuttings - direct striking",
                                "Vegetative - cuttings - pre-rooting",
                                "Vegetative - layering",
                                "Vegetative - tissue culture",
                                "Other (specify in notes)"
                            ]
                        },
                        {
                            "dataType": "text",
                            "name": "propagationSubstrateDescription",
                            "description": "Describe the type and chemical composition of the substrate used for propagation."
                        },
                        {
                            "dataType": "text",
                            "name": "treatmentQuantityAndDescription",
                            "description": "Describe the treatment used including any applicable settings and quanities."
                        },
                        {
                            "dataType": "number",
                            "name": "numberOfPropagules",
                            "description": "The number of propagules achieved with each treatment.",
                            "validate": "required"
                        },
                        {
                            "primaryResult": "true",
                            "dataType": "number",
                            "name": "propaguleEmergenceElapsedTimeInDays",
                            "description": "Elapsed time in days from treatment to propagule emergence."
                        },
                        {
                            "dataType": "text",
                            "name": "notes",
                            "description": "General notes"
                        }
                    ],
                    "dataType": "list",
                    "name": "plantPropagationTestResults"
                }
            ],
            "modelName": "plantPropagation-BatchTest",
            "type": "row",
            "viewModel": [
                {
                    "computed": null,
                    "type": "row",
                    "items": [
                        {
                            "computed": null,
                            "source": "<h2>Batch Propagation Treatment Test Results</h2>",
                            "type": "literal"
                        }
                    ]
                },
                {
                    "computed": null,
                    "type": "row",
                    "items": [
                        {
                            "type": "col",
                            "items": [
                                {
                                    "preLabel": "Batch treatment date",
                                    "source": "batchTreatmentDate",
                                    "type": "date"
                                },
                                {
                                    "preLabel": "Species tested",
                                    "source": "species",
                                    "type": "autocomplete"
                                }
                            ]
                        },
                        {
                            "type": "col",
                            "items": [
                                {
                                    "preLabel": "Catalogue number of tested batch",
                                    "source": "catalogueNumber",
                                    "type": "text"
                                },
                                {
                                    "preLabel": "Batch number tested",
                                    "source": "batchId",
                                    "type": "text"
                                }
                            ]
                        }
                    ]
                },
                {
                    "columns": [
                        {
                            "width": "10%",
                            "source": "sampleId",
                            "title": "Test sample Id",
                            "type": "text"
                        },
                        {
                            "width": "8%",
                            "source": "seedWeightTestedInGrams",
                            "title": "Amount of seed (gms)",
                            "type": "number"
                        },
                        {
                            "width": "15%",
                            "source": "treatmentMethod",
                            "title": "Treatment method",
                            "type": "selectOne"
                        },
                        {
                            "width": "18%",
                            "source": "propagationSubstrateDescription",
                            "title": "Description of propagation substrate",
                            "type": "textarea"
                        },
                        {
                            "width": "17%",
                            "source": "treatmentQuantityAndDescription",
                            "title": "Treatment quantum & description",
                            "type": "textarea"
                        },
                        {
                            "width": "8%",
                            "source": "numberOfPropagules",
                            "title": "No. of propagules",
                            "type": "number"
                        },
                        {
                            "width": "8%",
                            "source": "propaguleEmergenceElapsedTimeInDays",
                            "title": "Propagule emergence time (days)",
                            "type": "number"
                        },
                        {
                            "width": "15%",
                            "source": "notes",
                            "title": "Test comments",
                            "type": "textarea"
                        }
                    ],
                    "userAddedRows": "true",
                    "source": "plantPropagationTestResults",
                    "type": "table",
                    "class": "output-section"
                }
            ]
        },
        "modelName": null,
        "templateName": "plantPropagation-BatchTest",
        "optional": false,
        "optionalQuestionText": null,
        "title": null,
        "name": "Plant Propagation - Batch Test"
    }
],
    "type": "Activity",
    "category": "Implementation actions",
    "status": "active",
    "lastUpdatedUserId": "<anon>",
    "formVersion": NumberInt(1)
}

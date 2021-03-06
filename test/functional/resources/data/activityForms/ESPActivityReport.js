var espPMUReport = {
    "category": "Environmental Stewardship Programme",
    "createdUserId": "<anon>",
    "dateCreated": ISODate("2020-03-11T23:27:56.467Z"),
    "formVersion": NumberInt(4),
    "lastUpdated": ISODate("2021-02-22T00:50:29.044Z"),
    "lastUpdatedUserId": "1493",
    "minOptionalSectionsCompleted": NumberInt(1),
    "name": "ESP PMU or Zone reporting",
    "publicationStatus": "published",
    "sections": [{
        "collapsedByDefault": false,
        "name": "ESP PMU Header",
        "optional": false,
        "template": {
            "dataModel": [{"dataType": "text", "name": "reportingDates", "validate": "required"}],
            "title": "ESP PMU Reporting",
            "viewModel": [{
                "items": [{
                    "source": "Please complete the reporting for your PMU site below.",
                    "type": "literal"
                }], "type": "row"
            }, {
                "items": [{
                    "source": "reportingDates",
                    "type": "text",
                    "preLabel": "Please confirm the 12 month period that this report covers"
                }], "type": "row"
            }]
        },
        "templateName": "espPmuHeader",
        "title": "ESP PMU Header"
    }, {
        "collapsedByDefault": false,
        "name": "ESP Livestock Grazing Management",
        "optional": true,
        "optionalQuestionText": "Not an agreed management action under my funding agreement",
        "template": {
            "dataModel": [{
                "dataType": "text",
                "name": "multiplePaddocks",
                "constraints": ["Yes", "No"]
            }, {"dataType": "text", "name": "grazingagreement", "constraints": ["Yes", "No"]}, {
                "columns": [{
                    "dataType": "number",
                    "name": "paddockNum",
                    "behaviour": [{"condition": "multiplePaddocks == \"Yes\"", "type": "enable"}]
                }, {"dataType": "number", "name": "paddockArea", "validate": "min[0]"}, {
                    "dataType": "date",
                    "name": "startDate",
                    "description": "",
                    "validate": "required"
                }, {
                    "dataType": "date",
                    "name": "endDate",
                    "description": "",
                    "validate": "required"
                }, {
                    "dataType": "text",
                    "name": "typeOfStock",
                    "description": "",
                    "constraints": ["Cattle", "Sheep", "Goats", "Horses"],
                    "validate": "required"
                }, {
                    "dataType": "text",
                    "name": "productionType",
                    "description": "",
                    "constraints": {
                        "default": [],
                        "options": [{
                            "condition": "typeOfStock == \"Cattle\"",
                            "value": ["N/A", "Dairy", "Meat"]
                        }, {
                            "condition": "typeOfStock == \"Sheep\"",
                            "value": ["N/A", "Dairy", "Meat", "Wool"]
                        }, {
                            "condition": "typeOfStock == \"Goats\"",
                            "value": ["N/A", "Dairy", "Meat", "Fibre"]
                        }, {"condition": "typeOfStock == \"Horses\"", "value": ["N/A", "Adjistment"]}],
                        "type": "computed"
                    }
                }, {
                    "dataType": "text",
                    "name": "growthStage",
                    "description": "",
                    "constraints": {
                        "default": [],
                        "options": [{
                            "condition": "typeOfStock == \"Cattle\"",
                            "value": ["Bull", "Calf", "Cow", "Cow - Pregnant", "Heifer", "Steer", "Weanling"]
                        }, {
                            "condition": "typeOfStock == \"Sheep\"",
                            "value": ["Ewe", "Ewe - Pregnant", "Hogget", "Lamb", "Ram", "Wether"]
                        }, {
                            "condition": "typeOfStock == \"Goats\"",
                            "value": ["Buck", "Weaner", "Doe", "Doe - Pregnant", "Kid"]
                        }, {
                            "condition": "typeOfStock == \"Horses\"",
                            "value": ["Colt", "Filly", "Foal", "Gelding", "Mare", "Mare - Pregnant", "Stallion", "Yearling"]
                        }],
                        "type": "computed"
                    }
                }, {
                    "dataType": "number",
                    "name": "individualCount",
                    "description": "",
                    "validate": "required,min[0]"
                }, {
                    "dataType": "text", "name": "breed", "description": "", "constraints": {
                        "default": [],
                        "options": [{
                            "condition": "typeOfStock == \"Cattle\"",
                            "value": ["Africander", "Angus", "Anjou", "Beef Shorthorn", "Belgian Blue", "Belmont Red", "Black Wagyu", "Blonde Aquitaine", "Boran", "Braford", "Brahman", "Brangus", "Brown Swiss", "Charbray", "Charolais", "Chianina", "Crossbreed", "Devon", "Droughtmaster", "Galloway", "Gelbvieh", "Hereford", "Holstein", "Jersey", "Limousin", "Maine", "Maine Anjou", "Murray Grey", "Piedmontese", "Poll Hereford", "Red Wagyu", "Romagnola", "Sahiwal", "Santa Gertrudis", "Senepol", "Shorthorn", "Simmental", "South Devon", "Tuli", "Other"]
                        }, {
                            "condition": "typeOfStock == \"Sheep\"",
                            "value": ["Afrino", "Aussiedown", "Australian Finnsheep", "Bond", "Border Leicester", "Cheviot", "Composite", "Coopworth", "Cormo", "Corriedale", "Crossbreed", "Damaras", "Dohne", "Dorper", "Dorset Down", "Dorset Horn", "Drysdale", "East Friesian", "English Leiceter", "Gromark", "Hampshire Down", "Lincoln", "Merino", "Perendale", "Poll Dorset", "Poll Merino", "Poll Wiltshire", "Polwarth", "Romney", "Ryeland", "Sharlea", "Shropshire", "South Suffolk", "Southdown", "Suffolk", "Texel", "Tukidale", "White Suffolk", "Wiltipoll", "Wiltshire Horn", "Other"]
                        }, {
                            "condition": "typeOfStock == \"Goats\"",
                            "value": ["Anglo-Nubian", "Angora", "Australian Brown", "Australian Melaan", "Boer", "British Alpine", "Cashmere", "Crossbreed", "Kalahari Red", "Mohair", "Rangeland", "Saanen", "Toggenburg", "Other"]
                        }, {"condition": "typeOfStock == \"Horses\"", "value": []}],
                        "type": "computed"
                    }
                }, {"dataType": "number", "name": "swardHeightCm", "validate": "min[0]"}, {
                    "dataType": "number",
                    "name": "groundCoverPercent",
                    "validate": "min[0],max[100]"
                }], "dataType": "list", "name": "grazingPeriods"
            }, {"dataType": "number", "name": "cost", "validate": "integer,min[0]"}, {
                "dataType": "text",
                "name": "notes",
                "description": "",
                "validate": "required"
            }],
            "modelName": "ESP Livestock Grazing Management",
            "title": "Livestock Grazing Management",
            "viewModel": [{
                "type": "row",
                "items": [{
                    "source": "If grazing is a management action for the site but you did not graze during this reporting period please complete the report and state why you did not graze in the text box.",
                    "type": "literal"
                }]
            }, {
                "type": "row",
                "items": [{
                    "source": "<b>Please note</b> Grazing activities are included under any or all of the following; “Conservation grazing”, “Strategic grazing”, “Monitoring and manage grazing pressure from domestic livestock” and “Monitor and manage total grazing pressure”. <br/><i>Please endeavour to record sward height and ground cover percentage after each grazing period.</i>",
                    "type": "literal"
                }]
            }, {
                "type": "row",
                "items": [{
                    "type": "col",
                    "items": [{
                        "preLabel": "Is this site divided up into multiple paddocks?",
                        "source": "multiplePaddocks",
                        "type": "selectOne"
                    }]
                }]
            }, {
                "type": "row",
                "items": [{
                    "type": "col",
                    "items": [{
                        "preLabel": "Is grazing exclusion a management action in your funding agreement?",
                        "source": "grazingagreement",
                        "type": "selectOne"
                    }]
                }]
            }, {
                "type": "row", "items": [{
                    "allowHeaderWrap": true,
                    "columns": [{
                        "source": "paddockNum",
                        "title": "Paddock (if applicable)",
                        "type": "number"
                    }, {
                        "source": "paddockArea",
                        "title": "Paddock Area Ha (if known)",
                        "type": "number"
                    }, {"source": "startDate", "title": "Start Date", "type": "simpleDate"}, {
                        "source": "endDate",
                        "title": "End Date",
                        "type": "simpleDate"
                    }, {
                        "source": "typeOfStock",
                        "title": "Type of Stock",
                        "type": "selectOne"
                    }, {
                        "source": "productionType",
                        "title": "Production Type",
                        "type": "selectOne"
                    }, {
                        "source": "growthStage",
                        "title": "Growth Stage",
                        "type": "selectOne"
                    }, {"source": "individualCount", "title": "No. Individuals", "type": "number"}, {
                        "source": "breed",
                        "title": "Breed",
                        "type": "selectOne"
                    }, {
                        "source": "swardHeightCm",
                        "title": "Sward Height (cm)",
                        "type": "number"
                    }, {"source": "groundCoverPercent", "title": "Ground cover %", "type": "number"}],
                    "userAddedRows": true,
                    "source": "grazingPeriods",
                    "title": "<b>Please record all grazing periods for this site:</b> <br/>If your situation makes it impractical to record your grazing information in the table below, please delete any row(s) from the table below and instead provide a summary of your grazing activities in the textbox below.<p/>",
                    "type": "table"
                }]
            }, {
                "type": "row",
                "items": [{
                    "source": "<span class=\"preLabel required\"><label>Please provide comment on the effectiveness of the above management this year, or if the management was not undertaken, please state the reason why</label></span><div>If the management action was not undertaken and you are explaining why, delete all rows in the above table by hitting the bold 'x' in the last column.  If you don't delete the empty rows you will be unable to submit your report.</div>",
                    "type": "literal"
                }]
            }, {
                "type": "row",
                "items": [{"preLabel": "", "source": "notes", "type": "textarea", "rows": 5}]
            }, {
                "type": "row",
                "items": [{"preLabel": "Total cost of management actions", "source": "cost", "type": "currency"}]
            }]
        },
        "templateName": "espLivestockGrazingManagement",
        "title": "Livestock Grazing Management"
    }, {
        "collapsedByDefault": false,
        "name": "ESP Sward Height",
        "optional": false,
        "optionalQuestionText": "Not applicable, as this is not a contracted (approved) management action for this site/management unit.",
        "template": {
            "dataModel": [{
                "dataType": "list",
                "name": "swardHeight",
                "columns": [{
                    "dataType": "number",
                    "name": "swardHeightCm",
                    "validate": "required,min[0]"
                }, {"dataType": "date", "name": "dateMeasured", "validate": "required"}]
            }],
            "description": "To measure sward height, find a spot on your site that is representative of the site. Use either a ruler or eyeball a measurement of the sward height. If using a ruler, place the base on the surface of the soil. Slide your thumb down until you touch the top of the leaf blade. Do not measure the stems or flower heads.",
            "modelName": "ESP Sward Height",
            "title": "Sward Height",
            "viewModel": [{
                "items": [{
                    "source": "If you undertake grazing, please record sward height at the end of your grazing periods (in the table under “Livestock Grazing Management). If you do not undertake grazing, then record sward height at the same time that you take the photo-point photograph for this site. Please ensure that this is done at the same time each year.",
                    "type": "literal"
                }], "type": "row"
            }, {
                "items": [{
                    "source": "swardHeight",
                    "columns": [{
                        "title": "Sward Height (cm)",
                        "source": "swardHeightCm",
                        "type": "number"
                    }, {"title": "Date measured", "source": "dateMeasured", "type": "date"}],
                    "userAddedRows": true,
                    "disableTableUpload": true,
                    "type": "table"
                }], "type": "row"
            }]
        },
        "templateName": "espSwardHeight",
        "title": "ESP Sward Height"
    }, {
        "collapsedByDefault": false,
        "name": "ESP Ground Cover",
        "optional": false,
        "optionalQuestionText": "Not applicable, as this is not a contracted (approved) management action for this site/management unit.",
        "template": {
            "dataModel": [{
                "dataType": "list",
                "name": "groundCoverPercent",
                "columns": [{
                    "dataType": "number",
                    "name": "groundCoverPercent",
                    "validate": "required,min[0],max[100]"
                }, {"dataType": "date", "name": "dateMeasured", "validate": "required"}]
            }],
            "description": "Ground cover is the plant material covering the ground, both living and dead. To get a % estimate stand with your feet about 50cm apart. Visualise a 50cm square in front of your feet and estimate the percentage of groundcover in it. Do this a few times across the site and average the results.",
            "modelName": "ESP Ground Cover",
            "title": "Ground Cover % Estimate",
            "viewModel": [{
                "items": [{
                    "source": "If you undertake grazing, please record ground cover at the end of your grazing periods (in the table under “Livestock Grazing Management). If you do not undertake grazing, then record ground cover percentage at the same time that you take the photo-point photograph for this site. Please ensure that this is done at the same time each year.",
                    "type": "literal"
                }], "type": "row"
            }, {
                "items": [{
                    "source": "groundCoverPercent",
                    "columns": [{
                        "title": "Ground cover %",
                        "source": "groundCoverPercent",
                        "type": "number"
                    }, {"title": "Date measured", "source": "dateMeasured", "type": "date"}],
                    "userAddedRows": true,
                    "disableTableUpload": true,
                    "type": "table"
                }], "type": "row"
            }]
        },
        "templateName": "espGroundCover",
        "title": "Ground Cover %"
    }, {
        "collapsedByDefault": false,
        "name": "ESP Native herbivore management",
        "optional": true,
        "optionalQuestionText": "Not an agreed management action under my funding agreement",
        "template": {
            "dataModel": [{
                "columns": [{
                    "dataType": "text",
                    "name": "species",
                    "description": "",
                    "constraints": ["Grey Kangaroo", "Red Kangaroo", "Wallaby", "Wombat", "Euro / Wallaroo"],
                    "validate": "required"
                }, {
                    "dataType": "text",
                    "name": "season",
                    "constraints": ["Spring", "Summer", "Autumn", "Winter", "Year round"],
                    "validate": "required"
                }, {
                    "dataType": "stringList",
                    "name": "managementActions",
                    "constraints": ["Exclusion fencing", "Observed", "Shooting"],
                    "validate": "required"
                }, {
                    "dataType": "text",
                    "name": "managementReason",
                    "constraints": ["Excessive grazing", "Excessive population", "Infrastructure damage", "Nil"]
                }, {"dataType": "number", "name": "noCulled", "validate": "min[0]"}],
                "dataType": "list",
                "name": "nativeSpeciesMonitoring"
            }, {"dataType": "number", "name": "cost", "validate": "integer,min[0]"}, {
                "dataType": "text",
                "name": "notes",
                "description": "",
                "validate": "required"
            }],
            "description": "When you enter the details for this activity please make sure that you only enter the number and cost details once. Either as a single total record, encompassing the details and costs of this activity across all of your sites or as separate entries for each site.",
            "modelName": "ESP Native Herbivore Management",
            "title": "Native Herbivore Management",
            "viewModel": [{
                "type": "row",
                "items": [{
                    "type": "literal",
                    "source": "If Native Herbivore Management is a management action for the site but you didn’t undertake any actions around this for the reporting period, please complete the report and state why you didn’t, in the text box."
                }]
            }, {
                "type": "row",
                "items": [{
                    "source": "<b>Please note</b> Activities to monitor and/or manage native herbivores are included under any or all of the following; “Monitor and manage total grazing pressure”, “Monitor and manage grazing pressure from native species” and “Monitor and manage native herbivores”.",
                    "type": "literal"
                }]
            }, {
                "type": "row",
                "items": [{
                    "disableTableUpload": true,
                    "columns": [{"source": "species", "title": "Species", "type": "selectOne"}, {
                        "source": "season",
                        "title": "Season observed / managed",
                        "type": "selectOne"
                    }, {
                        "source": "managementActions",
                        "title": "Management Action(s)",
                        "type": "select2Many"
                    }, {
                        "source": "managementReason",
                        "title": "Reason for management",
                        "type": "selectOne"
                    }, {"source": "noCulled", "title": "If applicable, no. culled (if known)", "type": "number"}],
                    "userAddedRows": true,
                    "source": "nativeSpeciesMonitoring",
                    "title": "Please complete the following:  If your situation makes it impractical to record your information in the table/rows below, please delete any row(s) from the table by clicking the X at the far right hand side.",
                    "type": "table"
                }]
            }, {
                "type": "row",
                "items": [{
                    "source": "<span class=\"preLabel required\"><label>Please provide comment on the effectiveness of the above management this year, or if the management was not undertaken, please state the reason why</label></span><div>If the management action was not undertaken and you are explaining why, delete all rows in the above table by hitting the bold 'x' in the last column.  If you don't delete the empty rows you will be unable to submit your report.</div>",
                    "type": "literal"
                }]
            }, {"type": "row", "items": [{"preLabel": "", "source": "notes", "type": "textarea"}]}, {
                "type": "row",
                "items": [{"preLabel": "Total cost of management actions", "source": "cost", "type": "currency"}]
            }]
        },
        "templateName": "espNativeHerbivoreManagement",
        "title": "Native herbivore management"
    }, {
        "collapsedByDefault": false,
        "name": "ESP Feral animal management",
        "optional": true,
        "optionalQuestionText": "Not an agreed management action under my funding agreement",
        "template": {
            "dataModel": [{
                "columns": [{
                    "dataType": "species",
                    "name": "species",
                    "description": "",
                    "validate": "required"
                }, {
                    "dataType": "text",
                    "name": "season",
                    "constraints": ["Spring", "Summer", "Autumn", "Winter", "Year round"],
                    "validate": "required"
                }, {
                    "dataType": "stringList",
                    "name": "managementActions",
                    "constraints": ["Bait & trap", "Bait only", "Biological control agents", "Exclusion fencing", "Fumigation", "Mustering", "Observed", "Shooting", "Trap & cull", "Trap & remove"],
                    "validate": "required"
                }, {
                    "dataType": "text",
                    "name": "managementReason",
                    "constraints": ["Excessive grazing", "Excessive population", "Land degradation", "Nil", "Predation", "Removal of feral animals"]
                }, {"dataType": "number", "name": "noCulled", "validate": "min[0]"}],
                "dataType": "list",
                "name": "feralAnimalManagement"
            }, {"dataType": "number", "name": "cost", "validate": "integer,min[0]"}, {
                "dataType": "text",
                "name": "notes",
                "description": "",
                "validate": "required"
            }],
            "description": "When you enter the details for this activity please make sure that you only enter the number and cost details once. Either as a single total record, encompassing the details and costs of this activity across all of your sites or as separate entries for each site.",
            "modelName": "ESP Feral Animal Management",
            "title": "Feral Animal Management",
            "viewModel": [{
                "type": "row",
                "items": [{
                    "type": "literal",
                    "source": "If Feral Animal Management is a management action for the site but you didn’t undertake any actions around this for the reporting period, please complete the report and state why you didn’t, in the text box."
                }]
            }, {
                "type": "row",
                "items": [{
                    "source": "<b>Please note</b> Activities to monitor and/or manage feral animals are included under any or all of the following; “Monitor and manage total grazing pressure” and “Monitor and manage feral animals”. To enter details of activities undertaken to monitor and/or manage Feral animals please take care to add in a new row for each different species and each different season you have monitored or managed Feral animals.",
                    "type": "literal"
                }]
            }, {
                "type": "row",
                "items": [{
                    "disableTableUpload": true,
                    "fixedWidth": true,
                    "columns": [{
                        "width": "25%",
                        "source": "species",
                        "title": "Species",
                        "type": "speciesSelect"
                    }, {
                        "width": "10%",
                        "source": "season",
                        "title": "Season observed / managed",
                        "type": "selectOne"
                    }, {
                        "wdith": "20%",
                        "source": "managementActions",
                        "title": "Management Action(s)",
                        "type": "select2Many"
                    }, {
                        "width": "20%",
                        "source": "managementReason",
                        "title": "Reason for management",
                        "type": "selectOne"
                    }, {
                        "width": "10%",
                        "source": "noCulled",
                        "title": "If applicable, no. culled (if known)",
                        "type": "number"
                    }],
                    "userAddedRows": true,
                    "source": "feralAnimalManagement",
                    "title": "Please complete the following: If your situation makes it impractical to record your information in the table/rows below, please delete any row(s) from the table by clicking the X at the far right hand side",
                    "type": "table"
                }]
            }, {
                "type": "row",
                "items": [{
                    "source": "<span class=\"preLabel required\"><label>Please provide comment on the effectiveness of the above management this year, or if the management was not undertaken, please state the reason why</label></span><div>If the management action was not undertaken and you are explaining why, delete all rows in the above table by hitting the bold 'x' in the last column.  If you don't delete the empty rows you will be unable to submit your report.</div>",
                    "type": "literal"
                }]
            }, {"type": "row", "items": [{"preLabel": "", "source": "notes", "type": "textarea"}]}, {
                "type": "row",
                "items": [{"preLabel": "Total cost of management actions", "source": "cost", "type": "currency"}]
            }]
        },
        "templateName": "espFeralAnimalManagement",
        "title": "Feral animal management"
    }, {
        "collapsedByDefault": false,
        "name": "ESP Weed management",
        "optional": true,
        "optionalQuestionText": "Not an agreed management action under my funding agreement",
        "template": {
            "dataModel": [{
                "dataType": "list",
                "name": "weedManagement",
                "columns": [{
                    "dataType": "species",
                    "description": "",
                    "name": "species",
                    "validate": "required"
                }, {
                    "dataType": "stringList",
                    "description": "The primary method used to treat the patch of the target species",
                    "name": "treatmentMethod",
                    "constraints": ["Chemical control - Foliar spraying", "Chemical control - Basal bark spraying", "Chemical control - Cut stump", "Chemical control - Cut and swab", "Mechanical control - Slashing", "Mechanical control - Mowing", "Mechanical control - Felling", "Manual control - Hand pulling", "Biological control - Biological agents (specify in notes)", "Biological control – Grazing", "Environmental management - Fire", "Other (specify in notes)"],
                    "validate": "required"
                }, {"dataType": "number", "name": "weedAreaTreatedHa", "validate": "min[0]"}, {
                    "dataType": "text",
                    "name": "plantDensity",
                    "constraints": ["Dense infestation", "Isolated plant", "Scattered plants"]
                }, {
                    "dataType": "text",
                    "description": "The control status of the patch of the target species being treated",
                    "name": "controlStatus",
                    "constraints": ["New Infestation", "Active Infestation", "Under control", "Under monitoring", "Cleared", "Unknown"]
                }]
            }, {"dataType": "number", "name": "cost", "validate": "integer,min[0]"}, {
                "dataType": "text",
                "name": "undertakenNoxiousWeedControl",
                "constraints": ["Yes", "No"],
                "validate": "required"
            }, {
                "defaultRows": [],
                "dataType": "list",
                "name": "noxiousWeedManagement",
                "columns": [{
                    "dataType": "species",
                    "description": "",
                    "name": "species",
                    "validate": "required"
                }, {
                    "dataType": "stringList",
                    "description": "The primary method used to treat the patch of the target species",
                    "name": "treatmentMethod",
                    "constraints": ["Chemical control - Foliar spraying", "Chemical control - Basal bark spraying", "Chemical control - Cut stump", "Chemical control - Cut and swab", "Mechanical control - Slashing", "Mechanical control - Mowing", "Mechanical control - Felling", "Manual control - Hand pulling", "Biological control - Biological agents (specify in notes)", "Biological control – Grazing", "Environmental management - Fire", "Other (specify in notes)"],
                    "validate": "required"
                }, {"dataType": "number", "name": "weedAreaTreatedHa", "validate": "min[0]"}, {
                    "dataType": "text",
                    "name": "plantDensity",
                    "constraints": ["Dense infestation", "Isolated plant", "Scattered plants"]
                }, {
                    "dataType": "text",
                    "description": "The control status of the patch of the target species being treated",
                    "name": "controlStatus",
                    "constraints": ["New Infestation", "Active Infestation", "Under control", "Under monitoring", "Cleared", "Unknown"]
                }]
            }, {"dataType": "text", "description": "", "name": "notes", "validate": "required"}],
            "description": "When you enter the details for this activity please make sure that you only enter the number and cost details once. Either as a single total record, encompassing the details and costs of this activity across all of your sites or as separate entries for each site.",
            "modelName": "ESP Weed Management",
            "title": "Weed Management",
            "viewModel": [{
                "type": "row",
                "items": [{
                    "type": "literal",
                    "source": "If Weed Management is a management action for the site but you didn’t undertake any actions around this for the reporting period, please complete the report and state why you didn’t, in the text box."
                }]
            }, {
                "items": [{
                    "source": "<b>Please note</b> Activities to monitor and/or manage weeds are included under any or all of the following; “Monitor and manage herbaceous exotic plants (aggressive)”, “Monitor and manage herbaceous exotic plants (non-aggressive)”, “Monitor and manage exotic shrubs (aggressive)”, “Monitor and manage exotic plants”, “Monitor and manage aggressive exotic plants” and “Monitor and manage non-aggressive exotic plants”.",
                    "type": "literal"
                }], "type": "row"
            }, {
                "items": [{
                    "title": "Please complete the following: If your situation makes it impractical to record your information in the table/rows below, please delete any row(s) from the table by clicking the X at the far right hand side",
                    "source": "weedManagement",
                    "columns": [{
                        "title": "Species (do not include noxious (NSW) or declared (SA) plants)",
                        "source": "species",
                        "width": "25%",
                        "type": "speciesSelect"
                    }, {
                        "title": "Treatment Method",
                        "source": "treatmentMethod",
                        "width": "20%",
                        "type": "select2Many"
                    }, {
                        "title": "Approximate area treated (Ha)",
                        "source": "weedAreaTreatedHa",
                        "width": "10%",
                        "type": "number"
                    }, {
                        "title": "Density",
                        "source": "plantDensity",
                        "width": "15%",
                        "type": "selectOne"
                    }, {"title": "Control Status", "source": "controlStatus", "width": "15%", "type": "selectOne"}],
                    "userAddedRows": true,
                    "fixedWidth": true,
                    "disableTableUpload": true,
                    "type": "table"
                }], "type": "row"
            }, {
                "items": [{
                    "source": "cost",
                    "preLabel": "Total cost of management actions.  ESP funds must not be attributed to management of noxious (NSW) or declared (SA) plants unless they are also Weeds of National Significance (WONS)",
                    "type": "currency"
                }], "type": "row"
            }, {
                "items": [{
                    "source": "To search a list of noxious (NSW) weed species click <a href=\"https://weeds.dpi.nsw.gov.au/\" target=\"_blank\">here</a>. To search a list of declared (SA) weeds click <a href=\"https://pir.sa.gov.au/biosecurity/weeds_and_pest_animals/weeds_in_sa\" target=\"_blank\">here</a>.  To find a list of Weeds of National Significance (WONS) click <a href=\"https://www.environment.gov.au/biodiversity/invasive/weeds/weeds/lists/wons.html\">here</a>",
                    "type": "literal"
                }], "type": "row"
            }, {
                "items": [{
                    "source": "undertakenNoxiousWeedControl",
                    "preLabel": "Have you undertaken any activities to manage weeds that are; noxious (NSW) or declared (SA)?",
                    "type": "selectOne"
                }], "type": "row"
            }, {
                "items": [{
                    "title": "If \"Yes\", please complete the following:",
                    "source": "noxiousWeedManagement",
                    "columns": [{
                        "title": "Species",
                        "source": "species",
                        "width": "25%",
                        "type": "speciesSelect"
                    }, {
                        "title": "Treatment Method",
                        "source": "treatmentMethod",
                        "width": "20%",
                        "type": "select2Many"
                    }, {
                        "title": "Approximate area treated (Ha)",
                        "source": "weedAreaTreatedHa",
                        "width": "10%",
                        "type": "number"
                    }, {
                        "title": "Density",
                        "source": "plantDensity",
                        "width": "15%",
                        "type": "selectOne"
                    }, {"title": "Control Status", "source": "controlStatus", "width": "15%", "type": "selectOne"}],
                    "userAddedRows": true,
                    "fixedWidth": true,
                    "disableTableUpload": true,
                    "type": "table"
                }], "type": "row"
            }, {
                "type": "row",
                "items": [{
                    "source": "<span class=\"preLabel required\"><label>Please provide comment on the effectiveness of the above management this year, or if the management was not undertaken, please state the reason why</label></span><div>If the management action was not undertaken and you are explaining why, delete all rows in the above table by hitting the bold 'x' in the last column.  If you don't delete the empty rows you will be unable to submit your report.</div>",
                    "type": "literal"
                }]
            }, {"items": [{"source": "notes", "preLabel": "", "type": "textarea"}], "type": "row"}]
        },
        "templateName": "espWeedManagement",
        "title": "Weed management"
    }, {
        "collapsedByDefault": false,
        "name": "ESP Biomass control measures",
        "optional": true,
        "optionalQuestionText": "Not an agreed management action under my funding agreement",
        "template": {
            "dataModel": [{
                "dataType": "list",
                "name": "biomassControl",
                "columns": [{
                    "dataType": "text",
                    "description": "The type of biomass control",
                    "name": "controlType",
                    "constraints": ["Thinning", "Small scale ecological burns", "Slashing / mowing", "Grazing"]
                }, {
                    "dataType": "stringList",
                    "description": "",
                    "name": "controlPurpose",
                    "constraints": ["Reduction of fire risks", "Reduction of single species dominance", "Removal of feral habitat", "Weed control"],
                    "validate": "required"
                }, {"dataType": "number", "name": "areaTreatedHa", "validate": "min[0]"}, {
                    "dataType": "number",
                    "name": "cost",
                    "validate": "integer,min[0]"
                }]
            }, {"dataType": "text", "description": "", "name": "notes", "validate": "required"}],
            "description": "When you enter the details for this activity please make sure that you only enter the number and cost details once. Either as a single total record, encompassing the details and costs of this activity across all of your sites or as separate entries for each site.",
            "modelName": "ESP Biomass Control Measures",
            "title": "Biomass Control Measures",
            "viewModel": [{
                "type": "row",
                "items": [{
                    "type": "literal",
                    "source": "If Biomass Control Measures is a management action for the site but you didn’t undertake any actions around this for the reporting period, please complete the report and state why you didn’t, in the text box."
                }]
            }, {
                "items": [{
                    "source": "<b>Please note</b> Activities to control Biomass are included under any or all of the following; “Monitor and manage dominant native species”, “Biomass control to reduce dominance of a single native plant species”, “Biomass Control” and “Thinning”.",
                    "type": "literal"
                }], "type": "row"
            }, {
                "items": [{
                    "title": "If your situation makes it impractical to record your information in the table/rows below, please delete any row(s) from the table by clicking the X at the far right hand side",
                    "source": "biomassControl",
                    "columns": [{
                        "title": "Biomass control activity",
                        "source": "controlType",
                        "type": "selectOne"
                    }, {
                        "title": "Purpose",
                        "source": "controlPurpose",
                        "type": "select2Many"
                    }, {"title": "Area treated (Ha)", "source": "areaTreatedHa", "type": "number"}, {
                        "title": "Cost",
                        "source": "cost",
                        "type": "currency"
                    }],
                    "userAddedRows": true,
                    "disableTableUpload": true,
                    "type": "table"
                }], "type": "row"
            }, {
                "type": "row",
                "items": [{
                    "source": "<span class=\"preLabel required\"><label>Please provide comment on the effectiveness of the above management this year, or if the management was not undertaken, please state the reason why</label></span><div>If the management action was not undertaken and you are explaining why, delete all rows in the above table by hitting the bold 'x' in the last column.  If you don't delete the empty rows you will be unable to submit your report.</div>",
                    "type": "literal"
                }]
            }, {"items": [{"source": "notes", "preLabel": "", "type": "textarea"}], "type": "row"}]
        },
        "templateName": "espBiomassControlMeasures",
        "title": "Biomass control measures"
    }, {
        "collapsedByDefault": false,
        "name": "ESP Revegetation",
        "optional": true,
        "optionalQuestionText": "Not an agreed management action under my funding agreement",
        "template": {
            "dataModel": [{
                "dataType": "list",
                "name": "planting",
                "columns": [{
                    "dataType": "text",
                    "description": "The method used for planting",
                    "name": "revegetationMethod",
                    "constraints": ["Direct drill seeding", "Hand broadcast seeding", "Hand planting", "Machine planting", "Natural regeneration from threat exclusion / removal", "Infill plantings", "Combination of methods"],
                    "dwcAttribute": "establishmentMeans",
                    "validate": "required"
                }, {
                    "dataType": "species",
                    "speciesList": "project",
                    "noTotal": "true",
                    "description": "The species planted / sown. (start typing a  scientific or common name for a species)",
                    "name": "species",
                    "dwcAttribute": "scientificName",
                    "validate": "required"
                }, {
                    "dataType": "number",
                    "description": "The number of plants planted",
                    "name": "numberPlanted",
                    "validate": "required"
                }, {
                    "dataType": "number",
                    "description": "The average cost per plant or kilogram of seed as applicable",
                    "name": "cost"
                }]
            }, {
                "dataType": "list",
                "name": "survival",
                "columns": [{"dataType": "date", "name": "yearPlanted", "validate": "required"}, {
                    "dataType": "species",
                    "speciesList": "project",
                    "noTotal": "true",
                    "description": "The species planted / sown. (start typing a  scientific or common name for a species)",
                    "name": "species",
                    "dwcAttribute": "scientificName",
                    "validate": "required"
                }, {
                    "dataType": "number",
                    "description": "The number of plants originally planted",
                    "name": "numberPlanted",
                    "validate": "required"
                }, {
                    "dataType": "number",
                    "description": "Estimated survival %",
                    "name": "estimatedSurvivalPercent",
                    "validate": "required,min[0],max[100]"
                }]
            }, {"dataType": "text", "description": "", "name": "notes", "validate": "required"}],
            "description": "When you enter the details for this activity please make sure that you only enter the number and cost details once. Either as a single total record, encompassing the details and costs of this activity across all of your sites or as separate entries for each site.",
            "modelName": "ESP Revegetation",
            "title": "Revegetation",
            "viewModel": [{
                "type": "row",
                "items": [{
                    "type": "literal",
                    "source": "If Revegetation is a management action for the site but you didn’t undertake any actions around this for the reporting period, please complete the report and state why you didn’t, in the text box."
                }]
            }, {
                "items": [{
                    "source": "<b>Please note</b> that revegetation activities are included under any or all of the following; “Re-establish perennial native species”, “Plants overstorey tree species of target community”, “Re-establish understorey shrubs”, “Plant perennial species” and “Planting/direct seeding”. ",
                    "type": "literal"
                }], "type": "row"
            }, {
                "title": "Please list each species planted during this activity and any additional information that you can that is relevant:  If your situation makes it impractical to record your information in the table/rows below, please delete any row(s) from the table by clicking the X at the far right hand side",
                "source": "planting",
                "columns": [{
                    "title": "Revegetation Activity",
                    "source": "revegetationMethod",
                    "computed": null,
                    "width": "30%",
                    "type": "selectOne"
                }, {
                    "title": "Species planted",
                    "source": "species",
                    "computed": null,
                    "width": "40%",
                    "type": "speciesSelect"
                }, {
                    "title": "Number planted (if applicable)",
                    "source": "numberPlanted",
                    "computed": null,
                    "width": "10%",
                    "type": "number"
                }, {"title": "Cost ($)", "source": "cost", "computed": null, "width": "10%", "type": "currency"}],
                "userAddedRows": true,
                "disableTableUpload": true,
                "type": "table"
            }, {
                "title": "Survival rates of previous revegetation activities <br/>Please note that this is voluntary and can be recorded as often as you like.",
                "source": "survival",
                "columns": [{
                    "title": "Year planted",
                    "source": "yearPlanted",
                    "width": "30%",
                    "type": "date",
                    "displayOptions": {"minViewMode": "years"}
                }, {
                    "title": "Species planted",
                    "source": "species",
                    "computed": null,
                    "width": "40%",
                    "type": "speciesSelect"
                }, {
                    "title": "Number planted (if applicable)",
                    "source": "numberPlanted",
                    "computed": null,
                    "width": "10%",
                    "type": "number"
                }, {
                    "title": "Estimated survival rate (%)",
                    "source": "estimatedSurvivalPercent",
                    "computed": null,
                    "width": "10%",
                    "type": "number"
                }],
                "userAddedRows": true,
                "disableTableUpload": true,
                "type": "table"
            }, {
                "type": "row",
                "items": [{
                    "source": "<span class=\"preLabel required\"><label>Please provide comment on the effectiveness of the above management this year, or if the management was not undertaken, please state the reason why</label></span><div>If the management action was not undertaken and you are explaining why, delete all rows in the above table by hitting the bold 'x' in the last column.  If you don't delete the empty rows you will be unable to submit your report.</div>",
                    "type": "literal"
                }]
            }, {"items": [{"source": "notes", "preLabel": "", "type": "textarea"}], "type": "row"}]
        },
        "templateName": "espRevegetation",
        "title": "Revegetation"
    }, {
        "collapsedByDefault": false,
        "name": "ESP Regeneration",
        "optional": true,
        "optionalQuestionText": "Not an agreed management action under my funding agreement",
        "template": {
            "dataModel": [{
                "dataType": "list",
                "name": "regeneration",
                "columns": [{"dataType": "species", "description": "", "name": "species"}, {
                    "dataType": "text",
                    "name": "plantDensity",
                    "constraints": ["Dense", "Scattered", "Isolated"]
                }, {"dataType": "image", "name": "photo"}]
            }, {"dataType": "text", "description": "", "name": "notes", "validate": "required"}],
            "modelName": "ESP Regeneration",
            "title": "Regeneration",
            "viewModel": [{
                "type": "row",
                "items": [{
                    "type": "literal",
                    "source": "If Regeneration is a management action for the site but you didn’t undertake any actions around this for the reporting period, please complete the report and state why you didn’t, in the text box."
                }]
            }, {
                "items": [{
                    "source": "<b>Please note</b> Activities relating to Regeneration are included under any or all of the following; “Monitor and manage regeneration”, “Buffering”, “Connectivity” and “Reduce isolation”. ",
                    "type": "literal"
                }], "type": "row"
            }, {
                "items": [{
                    "source": "Please feel free to upload a photograph(s) of any regenerating plant species from your ESP site.",
                    "type": "literal"
                }], "type": "row"
            }, {
                "items": [{
                    "title": "Please complete the following: If your situation makes it impractical to record your information in the table/rows below, please delete any row(s) from the table by clicking the X at the far right hand side",
                    "source": "regeneration",
                    "columns": [{
                        "title": "Species Observed Regenerating (if known)",
                        "source": "species",
                        "type": "speciesSelect"
                    }, {
                        "title": "How widespread is the regeneration",
                        "source": "plantDensity",
                        "width": "15%",
                        "type": "selectOne"
                    }, {
                        "title": "Photo(s)",
                        "source": "photo",
                        "type": "image",
                        "displayOptions": {"disableDragDrop": true}
                    }],
                    "userAddedRows": true,
                    "disableTableUpload": true,
                    "type": "table"
                }], "type": "row"
            }, {
                "type": "row",
                "items": [{
                    "source": "<span class=\"preLabel required\"><label>Please provide comment on the effectiveness of the above management this year, or if the management was not undertaken, please state the reason why</label></span><div>If the management action was not undertaken and you are explaining why, delete all rows in the above table by hitting the bold 'x' in the last column.  If you don't delete the empty rows you will be unable to submit your report.</div>",
                    "type": "literal"
                }]
            }, {"items": [{"source": "notes", "preLabel": "", "type": "textarea"}], "type": "row"}]
        },
        "templateName": "espRegeneration",
        "title": "Regeneration"
    }, {
        "collapsedByDefault": false,
        "name": "ESP Restoration of Habitat Features",
        "optional": true,
        "optionalQuestionText": "Not an agreed management action under my funding agreement",
        "template": {
            "dataModel": [{
                "dataType": "list",
                "name": "habitatRestoration",
                "columns": [{
                    "dataType": "text",
                    "description": "",
                    "name": "habitatFeature",
                    "constraints": ["Woody debris", "Corrugated tin", "Nesting boxes", "Other"]
                }, {"dataType": "number", "description": "", "name": "numberAdded"}, {
                    "dataType": "number",
                    "name": "cost",
                    "validate": "integer,min[0]"
                }]
            }, {
                "dataType": "text",
                "description": "Please describe the habitat feature if other was selected",
                "name": "otherHabitatFeature"
            }, {"dataType": "text", "description": "", "name": "notes", "validate": "required"}],
            "description": "When you enter the details for this activity please make sure that you only enter the number and cost details once. Either as a single total record, encompassing the details and costs of this activity across all of your sites or as separate entries for each site.",
            "modelName": "ESP Restoration of Habitat",
            "title": "Restoration of Habitat Features",
            "viewModel": [{
                "type": "row",
                "items": [{
                    "type": "literal",
                    "source": "If Restoration of Habitat Features is a management action for the site but you didn’t undertake any actions around this for the reporting period, please complete the report and state why you didn’t, in the text box."
                }]
            }, {
                "items": [{
                    "source": "<b>Please note</b> Activities to restore habitat features are included under any or all of the following; “Add coarse woody debris” and “Retain fallen timber”.",
                    "type": "literal"
                }], "type": "row"
            }, {
                "items": [{
                    "title": "Please complete the following: If your situation makes it impractical to record your information in the table/rows below, please delete any row(s) from the table by clicking the X at the far right hand side",
                    "source": "habitatRestoration",
                    "columns": [{
                        "title": "Have you placed any of the following habitat features on your site?",
                        "source": "habitatFeature",
                        "type": "selectOne"
                    }, {
                        "title": "Number of habitat features added",
                        "source": "numberAdded",
                        "type": "number"
                    }, {"title": "Cost of Management Action?", "source": "cost", "type": "currency"}],
                    "userAddedRows": true,
                    "disableTableUpload": true,
                    "type": "table"
                }], "type": "row"
            }, {
                "items": [{
                    "source": "otherHabitatFeature",
                    "preLabel": "Habitat Feature (if Other)",
                    "type": "textarea"
                }], "type": "row"
            }, {
                "type": "row",
                "items": [{
                    "source": "<span class=\"preLabel required\"><label>Please provide comment on the effectiveness of the above management this year, or if the management was not undertaken, please state the reason why</label></span><div>If the management action was not undertaken and you are explaining why, delete all rows in the above table by hitting the bold 'x' in the last column.  If you don't delete the empty rows you will be unable to submit your report.</div>",
                    "type": "literal"
                }]
            }, {"items": [{"source": "notes", "preLabel": "", "type": "textarea"}], "type": "row"}]
        },
        "templateName": "espRestorationOfHabitatFeatures",
        "title": "Restoration of Habitat Features"
    }],
    "status": "active",
    "supportsPhotoPoints": true,
    "supportsSites": true,
    "type": "Report",
    "version": NumberInt(5)
};
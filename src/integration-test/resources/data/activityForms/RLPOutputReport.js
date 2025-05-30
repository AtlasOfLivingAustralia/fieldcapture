var rlpOutputReport = {
  "activationDate": null,
  "category": "RLP Reports",
  "createdUserId": "<anon>",
  "dateCreated": ISODate("2019-08-22T03:34:29Z"),
  "formVersion": NumberInt(1),
  "gmsId": null,
  "lastUpdated": ISODate("2019-08-27T22:32:11Z"),
  "lastUpdatedUserId": "1493",
  "minOptionalSectionsCompleted": NumberInt(0),
  "name": "RLP Output Report",
  "publicationStatus": "published",
  "sections": [
    {
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Output WHS",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "name": "RLP - Output WHS",
        "title": "WHS Requirements",
        "dataModel": [
          {
            "name": "whsRequirementsMet",
            "dataType": "text",
            "validate": "required",
            "constraints": [
              "Met requirements",
              "Not met requirements"
            ]
          },
          {
            "name": "notMetWHSRequirementsReason",
            "dataType": "text",
            "validate": "required,maxSize[300]",
            "behaviour": [
              {
                "condition": "whsRequirementsMet == \"Not met requirements\"",
                "type": "enable"
              }
            ]
          }
        ],
        "viewModel": [
          {
            "type": "row",
            "items": [
              {
                "css": "span6",
                "type": "selectOne",
                "source": "whsRequirementsMet",
                "preLabel": "Has the Service Provider provided a safe work environment consistent with WHS Laws and in accordance with Clause 44 of the Services Agreement within this reporting period?"
              }
            ]
          },
          {
            "type": "row",
            "items": [
              {
                "type": "textarea",
                "source": "notMetWHSRequirementsReason",
                "preLabel": "Please enter the reason(s) the WHS requirements were not met"
              }
            ]
          }
        ]
      },
      "templateName": "rlpOutputWHS",
      "title": "WHS Requirements"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Change Management",
      "optional": false,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "dataType": "text",
            "name": "variationSubmitted",
            "description": "eg. Changes to Activities, Extension of Time",
            "constraints": [
              "Yes",
              "No"
            ],
            "validate": "required"
          },
          {
            "dataType": "text",
            "name": "variationDetails",
            "behaviour": [
              {
                "condition": "variationSubmitted == \"Yes\"",
                "type": "enable"
              }
            ],
            "validate": "required,maxSize[300]"
          },
          {
            "dataType": "text",
            "name": "meriOrWorkOrderChangesRequired",
            "constraints": [
              "Yes",
              "No"
            ],
            "validate": "required"
          },
          {
            "dataType": "text",
            "name": "meriOrWorkOrderChangeDetails",
            "description": "eg. Please describe the change you need, why it is required and how you plan to apply it in future",
            "behaviour": [
              {
                "condition": "meriOrWorkOrderChangesRequired == \"Yes\"",
                "type": "enable"
              }
            ],
            "validate": "required,maxSize[300]"
          }
        ],
        "name": "RLP - Change Management",
        "title": "Project change management",
        "viewModel": [
          {
            "type": "row",
            "items": [
              {
                "preLabel": "Do you have a variation request currently in progress with the Dept?",
                "css": "span6",
                "source": "variationSubmitted",
                "type": "selectOne"
              }
            ]
          },
          {
            "type": "row",
            "items": [
              {
                "preLabel": "If yes, please provide details of the change required.",
                "source": "variationDetails",
                "type": "textarea"
              }
            ]
          },
          {
            "type": "row",
            "items": [
              {
                "preLabel": "Are further changes to the project MERI Plan or Project Work Order required?",
                "css": "span6",
                "source": "meriOrWorkOrderChangesRequired",
                "type": "selectOne"
              }
            ]
          },
          {
            "type": "row",
            "items": [
              {
                "preLabel": "If yes, please provide a succinct summary of the change required and reasons below.",
                "source": "meriOrWorkOrderChangeDetails",
                "type": "textarea"
              }
            ]
          }
        ]
      },
      "templateName": "rlpChangeManagement",
      "title": "Project change management"
    },
    {
      "collapsedByDefault": false,
      "template": {
        "title": "Collecting or synthesising baseline data",
        "modelName": "RLP - Baseline data",
        "dataModel": [
          {
            "dataType": "number",
            "name": "numberBaselineDataSets",
            "validate": "required,min[0]"
          },
          {
            "dataType": "text",
            "name": "comments",
            "validate": "required,maxSize[500]",
            "description": "Please list the multiple data sets collected and/or synthesised."
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails"
          },
          {
            "dataType": "list",
            "name": "assuranceDocuments",
            "columns": [
              {
                "dataType": "document",
                "name": "attachments",
                "description": "Please attach any Evidence of Service Delivery here"
              }
            ]
          }
        ],
        "viewModel": [
          {
            "items": [
              {
                "type": "row",
                "items": [
                  {
                    "source": "numberBaselineDataSets",
                    "preLabel": "Number of baseline data sets collected and/or synthesised",
                    "type": "number",
                    "css": "span4"
                  },
                  {
                    "source": "comments",
                    "preLabel": "Comments",
                    "type": "textarea",
                    "rows": 4,
                    "css": "span8"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "type": "literal",
                    "source": "<p><b>Available Evidence</b></p>This field is mandatory for all <u>Environment</u> projects but optional for Agriculture projects. This field identifies what evidence you have available for this service and where the evidence is stored. This helps the Department and Service Providers during future assurance activities. Refer to the <a href=\"http://nrm.gov.au/publications/rlp-merit-user-guide\" target=\"_evidence\">Evidence Guide</a> for details of the types of acceptable evidence."
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "type": "literal",
                    "source": "<p><b>Evidence of Service Delivery</b></p>This field is mandatory for all <u>Agriculture</u> projects as part of the invoicing process, as well as any environment projects where you have been notified as undergoing an <u>audit or quarterly assurance check</u>. The field allows you to attach evidence against a specific service."
                  }
                ]
              },
              {
                "type": "table",
                "source": "assuranceDocuments",
                "userAddedRows": true,
                "disableTableUpload": true,
                "columns": [
                  {
                    "title": "Attached documents",
                    "source": "attachments",
                    "type": "document"
                  }
                ]
              }
            ],
            "type": "section"
          }
        ]
      },
      "modelName": null,
      "templateName": "rlpBaselineData",
      "optional": true,
      "optionalQuestionText": null,
      "title": "Collecting, or synthesising baseline data",
      "name": "RLP - Baseline data"
    },
    {
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Communication materials",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "communicationMaterialType",
                "constraints": [
                  "Advertising",
                  "Book",
                  "Brochures",
                  "Extension materials",
                  "Fliers",
                  "Media release",
                  "Report",
                  "Social media posts",
                  "Videos",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherCommunicationMaterialType",
                "behaviour": [
                  {
                    "condition": "communicationMaterialType == \"Other\"",
                    "type": "enable"
                  }
                ],
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "number",
                "name": "numberOfCommunicationMaterialsPublished",
                "description": "Refers to unique publications not number printed",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "communicationMaterialPurpose",
                "validate": "required,maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "communicationMaterials"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Communication Materials",
        "title": "Communication Materials",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "25%",
                    "source": "communicationMaterialType",
                    "title": "Type of communication material published",
                    "type": "select2"
                  },
                  {
                    "width": "25%",
                    "source": "otherCommunicationMaterialType",
                    "title": "Type of communication material published (if Other)",
                    "type": "textarea"
                  },
                  {
                    "width": "15%",
                    "source": "numberOfCommunicationMaterialsPublished",
                    "title": "Number of communication materials published",
                    "type": "number"
                  },
                  {
                    "width": "35%",
                    "source": "communicationMaterialPurpose",
                    "title": "Purpose of communication material",
                    "type": "textarea"
                  }
                ],
                "userAddedRows": true,
                "source": "communicationMaterials",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "source": "<i>Note: to upload a communication material refer to the documents tab.</i>",
                    "type": "literal"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpCommunicationMaterials",
      "title": "Communication materials"
    },
    {
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Community engagement",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "eventType",
                "constraints": [
                  "Field days",
                  "Training / workshop events",
                  "Conferences / seminars",
                  "One-on-one technical advice interactions",
                  "On-ground trials / demonstrations",
                  "On-ground works"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfEvents",
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfParticipants",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "numberOfIndigenousParticipants",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "numberOfFarmers",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "numberOfGroups",
                "validate": "required,min[0]"
              },
              {
                "dataType": "stringList",
                "name": "industryType",
                "constraints": [
                  "Cropping",
                  "Dairy",
                  "Dryland agriculture",
                  "Horticulture",
                  "Grazing",
                  "Fisheries",
                  "Aquaculture",
                  "Environmental"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "eventPurpose",
                "validate": "required,maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "events"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Community engagement",
        "title": "Community/stakeholder engagement",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "15%",
                    "source": "eventType",
                    "title": "Type of Community / Stakeholder engagement activity",
                    "type": "select2"
                  },
                  {
                    "width": "10%",
                    "source": "numberOfEvents",
                    "title": "Number of Community / Stakeholder engagement type events",
                    "type": "number"
                  },
                  {
                    "width": "20%",
                    "source": "eventPurpose",
                    "title": "Purpose of engagement",
                    "type": "textarea"
                  },
                  {
                    "width": "10%",
                    "source": "numberOfGroups",
                    "title": "Number of communities or groups engaged",
                    "type": "number"
                  },
                  {
                    "width": "10%",
                    "source": "numberOfParticipants",
                    "title": "Total number of attendees / participants",
                    "type": "number"
                  },
                  {
                    "width": "10%",
                    "source": "numberOfIndigenousParticipants",
                    "title": "Number of Indigenous attendees / participants",
                    "type": "number"
                  },
                  {
                    "width": "10%",
                    "source": "numberOfFarmers",
                    "title": "Number of farmers attending / participating",
                    "type": "number"
                  },
                  {
                    "width": "15%",
                    "source": "industryType",
                    "title": "Industry type engaged",
                    "type": "select2Many"
                  }
                ],
                "userAddedRows": true,
                "source": "events",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpCommunityEngagement",
      "title": "Community/stakeholder engagement"
    },
    {
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Controlling access",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "number",
                "name": "numberInstalled",
                "validate": "required,min[0]"
              },
              {
                "dataType": "feature",
                "name": "sitesInstalled"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesInstalled)"
                },
                "dataType": "number",
                "name": "sitesInstalledCalculatedAreaHa",
                "units": "ha"
              },
              {
                "computed": {
                  "expression": "$geom.lengthKm(sitesInstalled)"
                },
                "dataType": "number",
                "name": "sitesInstalledCalculatedLengthKm",
                "units": "km"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(areaInstalledHa, sitesInstalledCalculatedAreaHa, 0.1) and within(lengthInstalledKm, sitesInstalledCalculatedLengthKm, 0.1)) or roundTo(areaInstalledHa, 2) != roundTo(areaInvoicedHa, 2) or roundTo(lengthInstalledKm, 2) != roundTo(lengthInvoicedKm, 2)",
                    "type": "visible"
                  }
                ],
                "validate": "required"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesInstalled)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaInstalledHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "defaultValue": {
                  "expression": "$geom.lengthKm(sitesInstalled)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "lengthInstalledKm",
                "units": "km",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaInstalledHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "number",
                "name": "lengthInvoicedKm",
                "units": "km",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "lengthInstalledKm",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not (within(areaInstalledHa, sitesInstalledCalculatedAreaHa, 0.1) and within(lengthInstalledKm, sitesInstalledCalculatedLengthKm, 0.1))",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaInstalledHa, 2) != roundTo(areaInvoicedHa, 2) or roundTo(lengthInstalledKm, 2) != roundTo(lengthInvoicedKm, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "feature",
                "name": "protectedSites"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(protectedSites)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaProtectedHa",
                "units": "ha"
              },
              {
                "dataType": "text",
                "name": "accessControlType",
                "description": "",
                "constraints": [
                  "Boardwalks",
                  "Bollards & barriers",
                  "Constructed parking bays",
                  "Fencing, styles, gates & grids",
                  "Formed traffic ways",
                  "Signage",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherAccessControlType",
                "description": "Please specify the type of access control if Other (specify in notes) was selected in the Type of Access Control Installed column.",
                "behaviour": [
                  {
                    "condition": "accessControlType == \"Other\"",
                    "type": "enable"
                  }
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "controlObjective",
                "description": "What is your access control method? and/or What do you intend to achieve by using your structure/s?",
                "validate": "required,maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "accessControlDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Controlling access",
        "title": "Controlling access",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "5%",
                    "source": "numberInstalled",
                    "type": "number",
                    "title": "Number of structures installed"
                  },
                  {
                    "width": "10%",
                    "type": "col",
                    "title": "Site/s where access has been controlled",
                    "items": [
                      {
                        "source": "sitesInstalled",
                        "type": "feature"
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "readonly": true,
                            "source": "sitesInstalledCalculatedAreaHa",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "readonly": true,
                            "source": "sitesInstalledCalculatedLengthKm",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "May be changed manually if different to the calculated areas",
                    "width": "15%",
                    "type": "col",
                    "title": "Actual length (km) / area (ha) where access has been controlled",
                    "items": [
                      {
                        "source": "areaInstalledHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthInstalledKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "May be changed manually if different to the calculated areas",
                    "width": "15%",
                    "type": "col",
                    "title": "Area (ha) / Length (km) invoiced",
                    "items": [
                      {
                        "source": "areaInvoicedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthInvoicedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "10%",
                    "type": "col",
                    "title": "Site/s protected by access control structures",
                    "items": [
                      {
                        "source": "protectedSites",
                        "type": "feature"
                      },
                      {
                        "source": "areaProtectedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      }
                    ]
                  },
                  {
                    "width": "20%",
                    "type": "col",
                    "title": "Type of access control installed",
                    "items": [
                      {
                        "source": "accessControlType",
                        "type": "select2"
                      },
                      {
                        "source": "otherAccessControlType",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "width": "25%",
                    "source": "controlObjective",
                    "title": "Control objective",
                    "type": "textarea",
                    "rows": 5
                  }
                ],
                "userAddedRows": true,
                "source": "accessControlDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos of the access control work performed",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpControllingAccess",
      "title": "Controlling access"
    },
    {

      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Pest animal management",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "feature",
                "name": "site"
              },
              {
                "dataType": "number",
                "name": "siteCalculatedAreaHa",
                "computed": {
                  "expression": "$geom.areaHa(site)"
                },
                "units": "ha"
              },
              {
                "dataType": "number",
                "name": "siteCalculatedLengthKm",
                "computed": {
                  "expression": "$geom.lengthKm(site)"
                },
                "units": "km"
              },
              {
                "dataType": "number",
                "name": "areaControlledHa",
                "validate": "required,min[0]",
                "units": "ha",
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.areaHa(site)"
                }
              },
              {
                "dataType": "number",
                "name": "lengthControlledKm",
                "validate": "required,min[0]",
                "units": "km",
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.lengthKm(site)"
                }
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "areaControlledHa"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "not (within(areaControlledHa, siteCalculatedAreaHa, 0.1) and within(lengthControlledKm, siteCalculatedLengthKm, 0.1))",
                    "type": "if"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "validate": "required,maxSize[300]",
                "behaviour": [
                  {
                    "type": "if",
                    "condition": "\"Other\" == mappingNotAlignedReason"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "roundTo(areaControlledHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "if"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "type": "if",
                    "condition": "\"Other\" == invoicedNotActualReason"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "validate": "required",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(areaControlledHa, siteCalculatedAreaHa, 0.1) and within(lengthControlledKm, siteCalculatedLengthKm, 0.1)) or roundTo(areaControlledHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "if"
                  }
                ]
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "pestSpecies",
                    "dwcAttribute": "scientificName",
                    "description": "Pest species targeted for treatment (start typing a  scientific or common name for a species)",
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "pestManagementMethod",
                    "dwcAttribute": "treatmentMethod",
                    "description": "The method used in this activity to manage pests",
                    "constraints": [
                      "Aerial shoot",
                      "Bait & trap",
                      "Bait only",
                      "Feral free enclosure",
                      "Exclusion fencing",
                      "Fumigation",
                      "Ground shoot",
                      "Trap & cull",
                      "Trap & remove",
                      "Other"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "otherManagementMethod",
                    "description": "Please specify the management method used if Other was selected in the Management Method column.",
                    "behaviour": [
                      {
                        "condition": "pestManagementMethod == \"Other\"",
                        "type": "enable"
                      }
                    ],
                    "validate": "required,maxSize[100]"
                  },
                  {
                    "dataType": "text",
                    "name": "treatmentObjective",
                    "validate": "required,maxSize[300]"
                  },
                  {
                    "dataType": "text",
                    "name": "individualsOrColonies",
                    "constraints": [
                      "Colonies",
                      "Individuals"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "number",
                    "name": "individualsOrColoniesRemoved",
                    "validate": "required"
                  }
                ],
                "dataType": "list",
                "name": "pestAnimalsControlled"
              }
            ],
            "dataType": "list",
            "name": "areasControlled"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Pest animal management",
        "title": "Controlling pest animals",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "Add a new controlled area",
                "userAddedRows": true,
                "source": "areasControlled",
                "type": "repeat",
                "items": [
                  {
                    "type": "row",
                    "css": "border-bottom",
                    "items": [
                      {
                        "preLabel": "Initial or follow-up control?",
                        "css": "span3",
                        "source": "initialOrFollowup",
                        "type": "selectOne"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "type": "col",
                        "css": "span3 col-border-right",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Site/s where pest control was undertaken",
                                "source": "site",
                                "type": "feature"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "source": "siteCalculatedAreaHa",
                                "type": "number",
                                "readonly": true,
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "source": "siteCalculatedLengthKm",
                                "type": "number",
                                "readonly": true,
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Please attach mapping details",
                                "source": "extraMappingDetails",
                                "type": "document"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "col",
                        "css": "span4 col-border-right",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Actual area (ha) / length (km) treated for pest animals",
                                "helpText": "Manually enter correct figure for this reporting period if different to mapped value.",
                                "source": "areaControlledHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "source": "lengthControlledKm",
                                "type": "number",
                                "validate": "required",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for actual being different to mapped amount",
                                "source": "mappingNotAlignedReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "mappingNotAlignedComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "col",
                        "css": "span4",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Invoiced area (ha) / length (km) treated for pest animals",
                                "helpText": "Enter the amount you will invoice for during this reporting period.",
                                "source": "areaInvoicedHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for invoiced amount being different to actual amount",
                                "source": "invoicedNotActualReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "invoicedNotActualComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "addRowText": "Add a species",
                        "columns": [
                          {
                            "width": "40%",
                            "source": "pestSpecies",
                            "title": "Target pest species",
                            "type": "speciesSelect"
                          },
                          {
                            "width": "10%",
                            "source": "pestManagementMethod",
                            "title": "Type of control",
                            "type": "selectOne"
                          },
                          {
                            "width": "10%",
                            "source": "otherManagementMethod",
                            "title": "Type of control (if other)",
                            "type": "text"
                          },
                          {
                            "width": "20%",
                            "source": "treatmentObjective",
                            "title": "Treatment objective",
                            "type": "textarea"
                          },
                          {
                            "width": "10%",
                            "source": "individualsOrColonies",
                            "title": "Individuals or colonies?",
                            "type": "selectOne"
                          },
                          {
                            "width": "10%",
                            "source": "individualsOrColoniesRemoved",
                            "title": "Number of individuals or colonies removed / destroyed",
                            "type": "number"
                          }
                        ],
                        "userAddedRows": true,
                        "source": "pestAnimalsControlled",
                        "type": "table"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpPestAnimalManagement",
      "title": "Controlling pest animals"
    },
    {

      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Management plan development",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "newOrRevised",
                "description": "",
                "constraints": [
                  "New plan",
                  "Revised plan"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "managementPlanType",
                "description": "",
                "constraints": [
                  "Fire management plan",
                  "Catchment plan",
                  "Farm management plan",
                  "Implementation works design",
                  "Marine protection plan",
                  "Project arrangements and governance",
                  "Project plan",
                  "Ramsar management plan",
                  "Recovery plan",
                  "Regional plan",
                  "Resource management plan",
                  "Site development plan",
                  "Site management plan",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherManagementPlanType",
                "description": "",
                "behaviour": [
                  {
                    "condition": "managementPlanType == \"Other\"",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "number",
                "name": "numberOfPlansDeveloped",
                "validate": "required,min[0]"
              },
              {
                "dataType": "feature",
                "name": "sitesCoveredByPlan"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesCoveredByPlan)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "calculatedAreaHa",
                "units": "ha"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not within(areaCoveredByPlanHa, calculatedAreaHa, 0.1) or (roundTo(areaCoveredByPlanHa, 2) != roundTo(areaInvoicedHa, 2))",
                    "type": "visible"
                  }
                ],
                "validate": "required"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesCoveredByPlan)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaCoveredByPlanHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not within(areaCoveredByPlanHa, calculatedAreaHa, 0.1)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaCoveredByPlanHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaCoveredByPlanHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "speciesOrTECCoveredByPlan",
                "description": "This free text field allows multiple species and/or TECs to be entered. For Species: Use Scientific names with (common name in brackets), TECs should be written as listed in EPBC. Species or TECs should be separated by commas.",
                "validate": "required,maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "managementPlans"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Management plan development",
        "title": "Developing farm / project / site management plan",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "10%",
                    "source": "newOrRevised",
                    "title": "Are these plans new or revised?",
                    "type": "selectOne"
                  },
                  {
                    "width": "20%",
                    "type": "col",
                    "title": "Type of plan",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "managementPlanType",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "otherManagementPlanType",
                            "placeholder": "Type of plan (if Other)",
                            "type": "textarea"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "6%",
                    "source": "numberOfPlansDeveloped",
                    "title": "Number of plans developed",
                    "type": "number"
                  },
                  {
                    "width": "10%",
                    "type": "col",
                    "title": "Sites/s covered by plan/s",
                    "items": [
                      {
                        "source": "sitesCoveredByPlan",
                        "type": "feature"
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedAreaHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "17%",
                    "title": "Actual area (ha) covered by plan/s",
                    "type": "col",
                    "items": [
                      {
                        "source": "areaCoveredByPlanHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "17%",
                    "type": "col",
                    "title": "Invoiced area (ha) covered by the plan",
                    "items": [
                      {
                        "source": "areaInvoicedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "20%",
                    "source": "speciesOrTECCoveredByPlan",
                    "type": "textarea",
                    "title": "Species and/or Threatened ecological communities covered in plan"
                  }
                ],
                "userAddedRows": true,
                "source": "managementPlans",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpManagementPlanDevelopment",
      "title": "Developing farm/project/site management plan"
    },
    {

      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Debris removal",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "feature",
                "name": "clearedSites"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(clearedSites)"
                },
                "dataType": "number",
                "name": "calculatedDebrisRemovedHa",
                "units": "ha"
              },
              {
                "computed": {
                  "expression": "$geom.lengthKm(clearedSites)"
                },
                "dataType": "number",
                "name": "calculatedDebrisRemovedKm",
                "units": "km"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "calculatedDebrisRemovedHa"
                },
                "dataType": "number",
                "units": "ha",
                "name": "debrisRemovedHa",
                "validate": "required,min[0]"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "calculatedDebrisRemovedKm"
                },
                "dataType": "number",
                "units": "km",
                "name": "debrisRemovedKm",
                "validate": "required,min[0]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "validate": "required",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(debrisRemovedHa, calculatedDebrisRemovedHa, 0.1)) or roundTo(debrisRemovedHa, 2) != roundTo(areaOfRemovedDebrisInvoicedHa, 2)",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedDebrisRemovedHa, debrisRemovedHa, 0.1))",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "validate": "required,maxSize[300]",
                "behaviour": [
                  {
                    "type": "visible",
                    "condition": "\"Other\" == mappingNotAlignedReason"
                  }
                ]
              },
              {
                "dataType": "number",
                "units": "ha",
                "name": "areaOfRemovedDebrisInvoicedHa",
                "validate": [
                  {
                    "rule": "min[0]"
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "debrisRemovedHa"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "roundTo(debrisRemovedHa, 2) != roundTo(areaOfRemovedDebrisInvoicedHa, 2)",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "type": "visible",
                    "condition": "\"Other\" == invoicedNotActualReason"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "debrisType",
                "description": "",
                "constraints": [
                  "Building & Industrial waste",
                  "Domestic waste",
                  "Green waste",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherDebrisType",
                "description": "if Other",
                "behaviour": [
                  {
                    "condition": "debrisType == \"Other\"",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "validated": "required,min[0]",
                "dataType": "number",
                "name": "weightOfDebrisTonnes",
                "units": "tonnes"
              },
              {
                "validated": "required,min[0]",
                "dataType": "number",
                "name": "volumeRemovedM3",
                "units": "m3"
              }
            ],
            "dataType": "list",
            "name": "debrisRemovalDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Debris removal",
        "title": "Debris removal",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "10%",
                    "source": "initialOrFollowup",
                    "title": "Initial or follow-up activity?",
                    "type": "selectOne"
                  },
                  {
                    "width": "20%",
                    "title": "Site/s where debris removal was implemented",
                    "type": "col",
                    "items": [
                      {
                        "type": "feature",
                        "source": "clearedSites"
                      },
                      {
                        "source": "calculatedDebrisRemovedHa",
                        "readonly": "readonly",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "calculatedDebrisRemovedKm",
                        "readonly": "readonly",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "15%",
                    "type": "col",
                    "title": "Actual area (ha) / length (km) of debris removed",
                    "helpText": "Enter the amount which were actually removed during this reporting period.",
                    "items": [
                      {
                        "source": "debrisRemovedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "debrisRemovedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "15%",
                    "type": "col",
                    "title": "Invoiced area (ha) of debris removed",
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "items": [
                      {
                        "source": "areaOfRemovedDebrisInvoicedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "20%",
                    "title": "Type of debris removed",
                    "type": "col",
                    "validate": "required",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "debrisType",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "source": "otherDebrisType",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "width": "10%",
                    "source": "weightOfDebrisTonnes",
                    "title": "Weight (tonnes) of debris removed",
                    "type": "number"
                  },
                  {
                    "width": "10%",
                    "source": "volumeRemovedM3",
                    "title": "Volume (m3) of debris removed",
                    "type": "number"
                  }
                ],
                "userAddedRows": true,
                "source": "debrisRemovalDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpDebrisRemoval",
      "title": "Debris removal"
    },
    {

      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Erosion Management",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "feature",
                "name": "existingErosionSites"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(existingErosionSites)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "existingErosionAreaHa",
                "units": "ha",
                "validate": "min[0]"
              },
              {
                "dataType": "feature",
                "name": "sitesManaged"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesManaged)"
                },
                "dataType": "number",
                "name": "calculatedAreaOfErosionControlHa",
                "units": "ha"
              },
              {
                "computed": {
                  "expression": "$geom.lengthKm(sitesManaged)"
                },
                "dataType": "number",
                "name": "calculatedLengthOfErosionControlKm",
                "units": "km"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(areaOfErosionControlHa, calculatedAreaOfErosionControlHa, 0.1) and within(lengthOfErosionControlKm, calculatedLengthOfErosionControlKm, 0.1)) or roundTo(areaOfErosionControlHa, 2) != roundTo(areaOfErosionControlInvoicedHa, 2) or roundTo(lengthOfErosionControlKm, 2) != roundTo(lengthOfErosionControlInvoicedKm, 2)",
                    "type": "visible"
                  }
                ],
                "validate": "required"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesManaged)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaOfErosionControlHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "defaultValue": {
                  "expression": "$geom.lengthKm(sitesManaged)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "lengthOfErosionControlKm",
                "units": "km",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "areaOfErosionControlInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaOfErosionControlHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "number",
                "name": "lengthOfErosionControlInvoicedKm",
                "units": "km",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "lengthOfErosionControlKm",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not (within(areaOfErosionControlHa, calculatedAreaOfErosionControlHa, 0.1) and within(lengthOfErosionControlKm, calculatedLengthOfErosionControlKm, 0.1))",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaOfErosionControlHa, 2) != roundTo(areaOfErosionControlInvoicedHa, 2) or roundTo(lengthOfErosionControlKm, 2) != roundTo(lengthOfErosionControlInvoicedKm, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "number",
                "name": "numberInstalled",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "erosionManagementMethod",
                "constraints": [
                  "Alternative watering point",
                  "Erosion control structures",
                  "Farming practice change",
                  "Fencing",
                  "Revegetation",
                  "Terracing",
                  "Vegetated waterway (bioswale)",
                  "Windbreaks",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherErosionManagementMethod",
                "behaviour": [
                  {
                    "condition": "erosionManagementMethod == \"Other\"",
                    "type": "visible"
                  }
                ],
                "validate": "required,max[300]"
              },
              {
                "dataType": "feature",
                "name": "sitesBenefittingFromErosionControl"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesBenefittingFromErosionControl)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaBenefitingHa",
                "units": "ha"
              },
              {
                "dataType": "text",
                "name": "evidenceOfBenefit",
                "validate": "maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "erosionManagementDetails",
            "minSize": 0
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Erosion Management",
        "title": "Erosion management",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "10%",
                    "source": "initialOrFollowup",
                    "title": "Initial or follow-up activity?",
                    "type": "selectOne"
                  },
                  {
                    "width": "5%",
                    "title": "Site/s where erosion is evident",
                    "type": "col",
                    "items": [
                      {
                        "source": "existingErosionSites",
                        "type": "feature"
                      },
                      {
                        "source": "existingErosionAreaHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      }
                    ]
                  },
                  {
                    "width": "6%",
                    "type": "col",
                    "title": "Site/s of erosion control",
                    "items": [
                      {
                        "source": "sitesManaged",
                        "type": "feature"
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedAreaOfErosionControlHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedLengthOfErosionControlKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Manually enter correct figure for this reporting period if different to mapped value.",
                    "width": "17%",
                    "type": "col",
                    "title": "Actual area (ha) / length (km) of erosion control",
                    "items": [
                      {
                        "source": "areaOfErosionControlHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthOfErosionControlKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "17%",
                    "type": "col",
                    "title": "Invoiced area (ha) / length (km) of erosion control",
                    "items": [
                      {
                        "source": "areaOfErosionControlInvoicedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthOfErosionControlInvoicedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "5%",
                    "source": "numberInstalled",
                    "title": "Number of erosion control structures installed",
                    "type": "number"
                  },
                  {
                    "width": "20%",
                    "type": "col",
                    "title": "Type of treatment method",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "erosionManagementMethod",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "otherErosionManagementMethod",
                            "placeholder": "Type of treatment method",
                            "type": "textarea"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "20%",
                    "title": "Please map any off-site area/s if they benefitted from this erosion management activity",
                    "type": "col",
                    "items": [
                      {
                        "source": "sitesBenefittingFromErosionControl",
                        "type": "feature"
                      },
                      {
                        "source": "areaBenefitingHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "evidenceOfBenefit",
                            "placeholder": "Please describe evidence of off-site benefits",
                            "type": "textarea"
                          }
                        ]
                      }
                    ]
                  }
                ],
                "userAddedRows": true,
                "source": "erosionManagementDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpErosionManagement",
      "title": "Erosion management"
    },
    {

      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Maintaining feral free enclosures",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "newOrMaintained",
                "constraints": [
                  "Newly established",
                  "Maintained"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfEnclosures",
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "daysSpentOnMaintenanceOfEnclosures",
                "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)",
                "validate": "min[0]"
              },
              {
                "dataType": "feature",
                "name": "siteOfEnclosures"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(siteOfEnclosures)"
                },
                "dataType": "number",
                "name": "calculatedAreaOfEnclosuresHa",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(siteOfEnclosures)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaOfEnclosuresHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaOfEnclosuresHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not within(areaOfEnclosuresHa, calculatedAreaOfEnclosuresHa, 0.1)",
                    "type": "if"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaOfEnclosuresHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not within(areaOfEnclosuresHa, calculatedAreaOfEnclosuresHa, 0.1) or roundTo(areaOfEnclosuresHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "if"
                  }
                ],
                "validate": "required"
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "protectedSpecies",
                    "dwcAttribute": "scientificName",
                    "description": "The threatened species protected by the enclosure",
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "targetFeralSpecies",
                    "description": "",
                    "validate": "required,maxSize[300]"
                  },
                  {
                    "dataType": "text",
                    "name": "individualsOrPopulations",
                    "constraints": [
                      "Individuals",
                      "Populations"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfPopulationsOrIndividualsProtected",
                    "validate": "required,min[0]"
                  }
                ],
                "dataType": "list",
                "name": "speciesProtected"
              }
            ],
            "dataType": "list",
            "name": "enclosureDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Maintaining feral free enclosures",
        "title": "Establishing and maintaining feral-free enclosures",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "Add a new feral free area",
                "userAddedRows": true,
                "source": "enclosureDetails",
                "type": "repeat",
                "items": [
                  {
                    "css": "border-bottom",
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Newly established or maintained feral free enclosure?",
                        "css": "span4",
                        "source": "newOrMaintained",
                        "type": "selectOne"
                      },
                      {
                        "preLabel": "Number of feral free enclosures",
                        "css": "span3",
                        "source": "numberOfEnclosures",
                        "type": "number"
                      },
                      {
                        "preLabel": "Number of days maintaining feral-free enclosures",
                        "css": "span3",
                        "source": "daysSpentOnMaintenanceOfEnclosures",
                        "type": "number"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "css": "span3 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Site/s of feral free enclosures",
                                "source": "siteOfEnclosures",
                                "type": "feature"
                              }
                            ]
                          },
                          {
                            "readonly": "readonly",
                            "source": "calculatedAreaOfEnclosuresHa",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Please attach mapping details",
                                "source": "extraMappingDetails",
                                "type": "document"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Actual area (ha) of feral-free enclosures",
                                "source": "areaOfEnclosuresHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for actual being different to mapped amount",
                                "source": "mappingNotAlignedReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "mappingNotAlignedComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Invoiced area (ha) of feral-free enclosures",
                                "source": "areaInvoicedHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for invoiced amount being different to actual amount",
                                "source": "invoicedNotActualReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "invoicedNotActualComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "addRowText": "Add a species",
                    "columns": [
                      {
                        "width": "35%",
                        "source": "protectedSpecies",
                        "title": "Targeted species being protected",
                        "type": "speciesSelect"
                      },
                      {
                        "width": "40%",
                        "source": "targetFeralSpecies",
                        "title": "Targeted feral species being controlled",
                        "type": "text"
                      },
                      {
                        "width": "15%",
                        "source": "individualsOrPopulations",
                        "title": "Individuals or populations?",
                        "type": "selectOne"
                      },
                      {
                        "width": "10%",
                        "source": "numberOfPopulationsOrIndividualsProtected",
                        "title": "Number of populations (or individuals) protected within feral free enclosures",
                        "type": "number"
                      }
                    ],
                    "userAddedRows": true,
                    "source": "speciesProtected",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpFeralFreeEnclosures",
      "title": "Establishing and maintaining feral-free enclosures"
    },
    {

      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Establishing ex-situ breeding programs",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "inSituExSitu",
                "constraints": [
                  "Ex-situ",
                  "In-situ"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "newOrMaintained",
                "constraints": [
                  "Newly established",
                  "Maintained"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfSitesCreated",
                "validate": "required,min[1]"
              },
              {
                "dataType": "number",
                "name": "numberOfDaysMaintainingBreedingPrograms",
                "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)",
                "validate": "required,min[0]"
              },
              {
                "dataType": "feature",
                "name": "sitesOfBreedingProgram",
                "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.areaHa(sitesOfBreedingProgram)"
                },
                "dataType": "number",
                "name": "areaOfEnclosureHa",
                "validate": [
                  {
                    "rule": "min",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(sitesOfBreedingProgram)*0.9"
                    }
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(sitesOfBreedingProgram)*1.1"
                    }
                  }
                ]
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "targetSpecies",
                    "dwcAttribute": "scientificName",
                    "description": "The threatened species targeted by the breeding program",
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "breedingTechnique",
                    "constraints": [
                      "Seed bank or captive breeding",
                      "Seed orchard",
                      "Seed nursery",
                      "Propagation",
                      "Seed viability testing",
                      "Seed genetic testing",
                      "Fauna captive breeding program",
                      "Fauna wild breeding program",
                      "Other"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "otherBreedingTechnique",
                    "description": "",
                    "behaviour": [
                      {
                        "condition": "breedingTechnique == \"Other\"",
                        "type": "enable"
                      }
                    ],
                    "validate": "required,maxSize[300]"
                  },
                  {
                    "dataType": "text",
                    "name": "individualsOrGroups",
                    "constraints": [
                      "Individuals",
                      "Groups"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfIndividualsOrGroups",
                    "validate": "required,min[0]"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfIndividualsReleased",
                    "validate": "required,min[0]"
                  }
                ],
                "dataType": "list",
                "name": "speciesInBreedingProgram"
              }
            ],
            "dataType": "list",
            "name": "breedingProgramDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Establishing ex-situ breeding programs",
        "title": "Establishing and maintaining breeding programs",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "Add a new breeding area",
                "userAddedRows": true,
                "source": "breedingProgramDetails",
                "type": "repeat",
                "items": [
                  {
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Ex-situ / In-situ",
                        "css": "span3",
                        "source": "inSituExSitu",
                        "type": "selectOne"
                      },
                      {
                        "preLabel": "Is this a newly established or maintained breeding program?",
                        "css": "span3",
                        "source": "newOrMaintained",
                        "type": "selectOne"
                      },
                      {
                        "preLabel": "Number of breeding sites created",
                        "css": "span3",
                        "source": "numberOfSitesCreated",
                        "type": "number"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Number of days maintaining breeding program",
                        "css": "span3",
                        "source": "numberOfDaysMaintainingBreedingPrograms",
                        "type": "number"
                      },
                      {
                        "preLabel": "Site/s of breeding program",
                        "css": "span3",
                        "source": "sitesOfBreedingProgram",
                        "type": "feature"
                      },
                      {
                        "preLabel": "Area (ha) of feral-free enclosures established or maintained",
                        "css": "span3",
                        "source": "areaOfEnclosureHa",
                        "type": "number"
                      }
                    ]
                  },
                  {
                    "addRowText": "Add a species",
                    "columns": [
                      {
                        "width": "30%",
                        "source": "targetSpecies",
                        "title": "Targeted threatened species",
                        "type": "speciesSelect"
                      },
                      {
                        "width": "15%",
                        "source": "breedingTechnique",
                        "type": "select2",
                        "title": "Technique of breeding program"
                      },
                      {
                        "width": "20%",
                        "source": "otherBreedingTechnique",
                        "type": "text",
                        "title": "Technique of breeding program (if Other)"
                      },
                      {
                        "width": "15%",
                        "source": "individualsOrGroups",
                        "type": "selectOne",
                        "title": "Individuals or groups?"
                      },
                      {
                        "width": "10%",
                        "source": "numberOfIndividualsOrGroups",
                        "title": "Number of groups / individuals in breeding program",
                        "type": "number"
                      },
                      {
                        "width": "10%",
                        "source": "numberOfIndividualsReleased",
                        "title": "Number of individuals released or established in the wild",
                        "type": "number"
                      }
                    ],
                    "userAddedRows": true,
                    "source": "speciesInBreedingProgram",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpExSituBreedingSites",
      "title": "Establishing ex-situ breeding program"
    },
    {

      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Establishing Agreements",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "agreementType",
                "description": "",
                "constraints": [
                  "On title in perpetuity (e.g. conservation convenant)",
                  "Binding agreement not on title in perpetuity (e.g. property vegetation plan)",
                  "Termed agreement not on title - binding (e.g. land management agreement)",
                  "Not on title - non-binding (e.g. Wildlife Refuge)",
                  "No protection mechanism applicable",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherAgreementType",
                "description": "",
                "behaviour": [
                  {
                    "condition": "agreementType == \"Other\"",
                    "type": "enable"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "establishedOrMaintained",
                "constraints": [
                  "Established",
                  "Maintained"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfAgreements",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "numberOfDaysMaintainingAgreements",
                "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)",
                "validate": "required,min[0]"
              },
              {
                "dataType": "feature",
                "name": "agreementSites"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(agreementSites)"
                },
                "dataType": "number",
                "name": "calculatedAreaCoveredByAgreementsHa",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "expression": "calculatedAreaCoveredByAgreementsHa",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaCoveredByAgreementsHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not (within(areaCoveredByAgreementsHa, calculatedAreaCoveredByAgreementsHa, 0.1))",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "number",
                "name": "areaOfCoveredByAgreementsInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaCoveredByAgreementsHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaCoveredByAgreementsHa, areaCoveredByAgreementsHa, 0.1)) or roundTo(areaCoveredByAgreementsHa, 2) != roundTo(areaOfCoveredByAgreementsInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaOfCoveredByAgreementsInvoicedHa, 2) != roundTo(areaCoveredByAgreementsHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "agreements"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Establishing Agreements",
        "title": "Establishing and maintaining agreements",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "20%",
                    "title": "Agreement type",
                    "type": "col",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "agreementType",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "otherAgreementType",
                            "title": "Other agreement type",
                            "type": "textarea"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "10%",
                    "source": "establishedOrMaintained",
                    "type": "selectOne",
                    "title": "Established or maintained?"
                  },
                  {
                    "width": "10%",
                    "source": "numberOfAgreements",
                    "type": "number",
                    "title": "Number of agreements"
                  },
                  {
                    "width": "10%",
                    "source": "numberOfDaysMaintainingAgreements",
                    "type": "number",
                    "title": "Number of days maintaining agreements (if applicable)"
                  },
                  {
                    "width": "20%",
                    "title": "Site/s where agreements were established",
                    "type": "col",
                    "items": [
                      {
                        "source": "agreementSites",
                        "type": "feature"
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedAreaCoveredByAgreementsHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the actual amount during this reporting period.",
                    "width": "15%",
                    "type": "col",
                    "title": "Actual area (ha) of site/s agreements",
                    "items": [
                      {
                        "source": "areaCoveredByAgreementsHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual amount being different to aligned amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the actual didn't align with the agreed amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "15%",
                    "type": "col",
                    "title": "Invoiced area (ha) of site/s agreements",
                    "items": [
                      {
                        "source": "areaOfCoveredByAgreementsInvoicedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  }
                ],
                "userAddedRows": true,
                "source": "agreements",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpEstablishingAgreements",
      "title": "Establishing and maintaining agreements"
    },
    {

      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Establishing monitoring regimes",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "title": "Establishing monitoring regimes",
        "modelName": "RLP - Establishing monitoring regimes",
        "dataModel": [
          {
            "name": "monitoringRegimes",
            "dataType": "list",
            "columns": [
              {
                "dataType": "text",
                "name": "typeOfMonitoringRegime",
                "validate": "required",
                "constraints": [
                  "Ramsar",
                  "Threatened Species",
                  "World Heritage",
                  "Threatened Ecological Communities",
                  "Soil, biodiversity & vegetation",
                  "Climate change & market demands"
                ]
              },
              {
                "dataType": "text",
                "name": "establishedOrMaintained",
                "validate": "required",
                "constraints": [
                  "Established",
                  "Maintained"
                ]
              },
              {
                "dataType": "number",
                "name": "numberMonitoringRegimesEstablished",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "numberOfDaysMaintainingMonitoringRegimes",
                "validate": "required,min[0]",
                "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)"
              },
              {
                "dataType": "text",
                "name": "monitoringRegimeObjective",
                "validate": "required,maxSize[500]",
                "description": "What type of monitoring and reporting is being established/maintained? What information will these monitoring regimes capture?"
              }
            ]
          },
          {
            "name": "photographicEvidence",
            "dataType": "image"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "viewModel": [
          {
            "items": [
              {
                "type": "table",
                "userAddedRows": true,
                "source": "monitoringRegimes",
                "columns": [
                  {
                    "source": "typeOfMonitoringRegime",
                    "type": "selectOne",
                    "title": "Type of monitoring regime",
                    "width": "20%"
                  },
                  {
                    "source": "establishedOrMaintained",
                    "type": "selectOne",
                    "title": "Established or maintained?",
                    "width": "15%"
                  },
                  {
                    "source": "numberMonitoringRegimesEstablished",
                    "title": "Number of monitoring regimes",
                    "type": "number",
                    "width": "10%"
                  },
                  {
                    "source": "numberOfDaysMaintainingMonitoringRegimes",
                    "title": "Number of days maintaining monitoring regimes",
                    "type": "number",
                    "width": "10%"
                  },
                  {
                    "source": "monitoringRegimeObjective",
                    "title": "Monitoring regimes objective",
                    "type": "textarea",
                    "rows": 3,
                    "width": "55%"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "type": "image",
                    "source": "photographicEvidence",
                    "preLabel": "Optionally attach photos"
                  }
                ]
              }
            ],
            "type": "section"
          },
          {
            "type": "row",
            "items": [
              {
                "preLabel": "Auditable Evidence",
                "source": "projectAssuranceDetails",
                "type": "textarea",
                "rows": 4,
                "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
              }
            ]
          }
        ]
      },
      "templateName": "rlpMonitoringRegimes",
      "title": "Establishing monitoring regimes"
    },
    {

      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Farm Management Survey",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "title": "Farm management surveys",
        "modelName": "RLP - Farm Management Survey",
        "dataModel": [
          {
            "dataType": "list",
            "name": "farmManagementSurveys",
            "columns": [
              {
                "dataType": "text",
                "description": "",
                "name": "baselineOrIndicatorSurvey",
                "constraints": [
                  "Baseline",
                  "Indicator"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfFarmManagementSurveys",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "numberOfDaysConductingSurveys",
                "validate": "required,min[0]",
                "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)"
              },
              {
                "dataType": "text",
                "name": "surveyPurpose",
                "validate": "required,maxSize[500]",
                "description": "What will the survey aim to capture?"
              }
            ]
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "viewModel": [
          {
            "items": [
              {
                "source": "farmManagementSurveys",
                "columns": [
                  {
                    "title": "Baseline survey or indicator (follow-up) survey?",
                    "source": "baselineOrIndicatorSurvey",
                    "type": "selectOne",
                    "width": "25%"
                  },
                  {
                    "title": "Number of farm management surveys conducted",
                    "source": "numberOfFarmManagementSurveys",
                    "type": "number",
                    "width": "10%"
                  },
                  {
                    "title": "Number of days spent on these farm management surveys",
                    "source": "numberOfDaysConductingSurveys",
                    "type": "number",
                    "width": "10%"
                  },
                  {
                    "title": "Survey purpose",
                    "type": "textarea",
                    "rows": 3,
                    "source": "surveyPurpose",
                    "width": "55%"
                  }
                ],
                "userAddedRows": true,
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ],
            "type": "section"
          }
        ]
      },
      "templateName": "rlpFarmManagementSurvey",
      "title": "Farm management survey"
    },
    {

      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Fauna survey",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "baselineOrIndicatorSurvey",
                "description": "",
                "constraints": [
                  "Baseline",
                  "Indicator"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfFaunaSurveys",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "dateRange",
                "description": "What time of year (eg. Dates by dd/mm/yyyyy, Months, Season/s)",
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "feature",
                "name": "sitesSurveyed"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesSurveyed)"
                },
                "dataType": "number",
                "name": "siteCalculatedAreaHa",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesSurveyed)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaSurveyedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaSurveyedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1)",
                    "type": "if"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1) or roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "if"
                  }
                ],
                "validate": "required"
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "species",
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "surveyTechnique",
                    "description": "What/how will the survey capture the fauna data",
                    "validate": "required,maxSize[500]"
                  },
                  {
                    "dataType": "text",
                    "name": "individualsOrGroups",
                    "constraints": [
                      "Individuals",
                      "Groups"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfIndividualsOrGroups",
                    "validate": "required,min[0]"
                  }
                ],
                "dataType": "list",
                "name": "faunaSurveyDetails"
              }
            ],
            "dataType": "list",
            "name": "faunaSurveys",
            "minSize": 1
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Fauna survey",
        "title": "Fauna survey",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "New survey site",
                "userAddedRows": true,
                "source": "faunaSurveys",
                "type": "repeat",
                "items": [
                  {
                    "css": "border-bottom",
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Baseline survey or indicator (follow-up) survey?",
                        "css": "span3",
                        "source": "baselineOrIndicatorSurvey",
                        "type": "selectOne"
                      },
                      {
                        "preLabel": "Number of fauna surveys conducted",
                        "css": "span3",
                        "source": "numberOfFaunaSurveys",
                        "type": "number"
                      },
                      {
                        "preLabel": "Date range",
                        "css": "span3",
                        "source": "dateRange",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "css": "span3 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Site/s covered by fauna surveys",
                                "source": "sitesSurveyed",
                                "type": "feature"
                              }
                            ]
                          },
                          {
                            "readonly": true,
                            "source": "siteCalculatedAreaHa",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Please attach mapping details",
                                "source": "extraMappingDetails",
                                "type": "document"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Actual area (ha) covered by fauna surveys",
                                "helpText": "Manually enter correct figure for this reporting period if different to mapped value.",
                                "source": "areaSurveyedHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for actual being different to mapped amount",
                                "source": "mappingNotAlignedReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "mappingNotAlignedComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Invoiced area (ha) covered by fauna surveys",
                                "helpText": "Enter the amount you will invoice for during this reporting period.",
                                "source": "areaInvoicedHa",
                                "type": "number",
                                "validate": "required",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for invoiced amount being different to actual amount",
                                "source": "invoicedNotActualReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "invoicedNotActualComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "addRowText": "Add a species",
                    "columns": [
                      {
                        "width": "40%",
                        "source": "species",
                        "title": "Target species recorded",
                        "type": "speciesSelect"
                      },
                      {
                        "width": "35%",
                        "source": "surveyTechnique",
                        "title": "Survey technique",
                        "type": "text"
                      },
                      {
                        "width": "15%",
                        "source": "individualsOrGroups",
                        "title": "Individuals or groups?",
                        "type": "selectOne"
                      },
                      {
                        "width": "10%",
                        "source": "numberOfIndividualsOrGroups",
                        "title": "Number of groups / individuals in fauna survey",
                        "type": "number"
                      }
                    ],
                    "userAddedRows": true,
                    "source": "faunaSurveyDetails",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpFaunaSurvey",
      "title": "Fauna survey"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Fire management",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "feature",
                "name": "sitesTreated"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesTreated)"
                },
                "dataType": "number",
                "name": "calculatedAreaTreatedHa",
                "units": "ha"
              },
              {
                "computed": {
                  "expression": "$geom.lengthKm(sitesTreated)"
                },
                "dataType": "number",
                "name": "calculatedLengthTreatedKm",
                "units": "km"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "calculatedAreaTreatedHa"
                },
                "dataType": "number",
                "name": "areaTreatedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "calculatedLengthTreatedKm"
                },
                "dataType": "number",
                "name": "lengthTreatedKm",
                "units": "km",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaTreatedHa, areaTreatedHa, 0.1))",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "validate": "required,maxSize[300]",
                "behaviour": [
                  {
                    "type": "visible",
                    "condition": "\"Other\" == mappingNotAlignedReason"
                  }
                ]
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "validate": "required",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaTreatedHa, areaTreatedHa, 0.1)) or roundTo(areaTreatedHa, 2) != roundTo(areaInvoicedTreatedHa, 2)",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "number",
                "name": "areaInvoicedTreatedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "min[0]"
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "areaTreatedHa"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "roundTo(areaTreatedHa, 2) != roundTo(areaInvoicedTreatedHa, 2)",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "type": "visible",
                    "condition": "\"Other\" == invoicedNotActualReason"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.lengthKm(sitesTreated)"
                },
                "dataType": "number",
                "name": "lengthTreatedKm",
                "units": "km",
                "validate": [
                  {
                    "rule": "min",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.lengthKm(sitesTreated)*0.9"
                    }
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.lengthKm(sitesTreated)*1.1"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "fireManagementType",
                "description": "",
                "constraints": [
                  "Cultural burn",
                  "Ecological burn",
                  "Grading",
                  "Hazard reduction burn",
                  "Herbicide",
                  "Slashing",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherFireManagementType",
                "behaviour": [
                  {
                    "condition": "fireManagementType == \"Other\"",
                    "type": "enable"
                  }
                ],
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "feature",
                "name": "sitesBenefittedByFireAction"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.areaHa(sitesBenefittedByFireAction)"
                },
                "dataType": "number",
                "name": "areaBenefittedByFireActionHa",
                "validate": [
                  {
                    "rule": "min",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(sitesBenefittedByFireAction)*0.9"
                    }
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(sitesBenefittedByFireAction)*1.1"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "evidenceOfBenefit",
                "validate": "maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "fireManagementDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Fire management",
        "title": "Implementing fire management actions",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "10%",
                    "source": "initialOrFollowup",
                    "type": "selectOne",
                    "title": "Initial or follow-up control?"
                  },
                  {
                    "width": "10%",
                    "title": "Area (ha) treated by fire management action",
                    "type": "col",
                    "items": [
                      {
                        "source": "sitesTreated",
                        "type": "feature"
                      },
                      {
                        "source": "calculatedAreaTreatedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        },
                        "readonly": "readonly"
                      },
                      {
                        "source": "calculatedLengthTreatedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        },
                        "readonly": "readonly"
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "20%",
                    "type": "col",
                    "title": "Actual area (ha) / length (km) treated by managment action",
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "items": [
                      {
                        "source": "areaTreatedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthTreatedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "15%",
                    "type": "col",
                    "title": "Invoiced area (ha) treated by management action",
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "items": [
                      {
                        "source": "areaInvoicedTreatedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "15%",
                    "title": "Type of fire management action",
                    "type": "col",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "fireManagementType",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "source": "otherFireManagementType",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "width": "15%",
                    "type": "col",
                    "title": "Please map any off-site area/s if they benefitted from this fire management action",
                    "items": [
                      {
                        "source": "sitesBenefittedByFireAction",
                        "type": "feature",
                        "title": "Please map any off-site area/s if they benefitted from this fire management action"
                      },
                      {
                        "source": "areaBenefittedByFireActionHa",
                        "type": "number",
                        "readonly": "readonly",
                        "title": "Area (ha) protected by fire management action"
                      }
                    ]
                  },
                  {
                    "width": "15%",
                    "source": "evidenceOfBenefit",
                    "type": "textarea",
                    "rows": 3,
                    "title": "If off-site area was mapped please provide a description on the evidence available to reflect this benefit"
                  }
                ],
                "userAddedRows": true,
                "source": "fireManagementDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpFireManagement",
      "title": "Fire management actions"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Flora survey",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "baselineOrIndicatorSurvey",
                "description": "",
                "constraints": [
                  "Baseline",
                  "Indicator"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfFloraSurveys",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "dateRange",
                "description": "What time of year (eg. Dates by dd/mm/yyyyy, Months, Season/s)",
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "feature",
                "name": "sitesSurveyed"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesSurveyed)"
                },
                "dataType": "number",
                "name": "siteCalculatedAreaHa",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesSurveyed)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaSurveyedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaSurveyedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1)",
                    "type": "if"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1) or roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "if"
                  }
                ],
                "validate": "required"
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "species",
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "threatenedEcologicalCommunity",
                    "validate": "maxSize[300]"
                  },
                  {
                    "dataType": "text",
                    "name": "surveyTechnique",
                    "description": "What/how will the survey capture the flora data",
                    "validate": "required,maxSize[300]"
                  },
                  {
                    "dataType": "text",
                    "name": "individualsOrGroups",
                    "constraints": [
                      "Individuals",
                      "Groups"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfIndividualsOrGroups",
                    "validate": "required,min[0]"
                  }
                ],
                "dataType": "list",
                "name": "floraSurveyDetails"
              }
            ],
            "dataType": "list",
            "name": "floraSurveys",
            "minSize": 1
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Flora survey",
        "title": "Flora survey",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "New survey site",
                "userAddedRows": true,
                "source": "floraSurveys",
                "type": "repeat",
                "items": [
                  {
                    "css": "border-bottom",
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Baseline survey or indicator (follow-up) survey?",
                        "css": "span3",
                        "source": "baselineOrIndicatorSurvey",
                        "type": "selectOne"
                      },
                      {
                        "preLabel": "Number of flora surveys conducted",
                        "css": "span3",
                        "source": "numberOfFloraSurveys",
                        "type": "number"
                      },
                      {
                        "preLabel": "Date range",
                        "css": "span3",
                        "source": "dateRange",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "css": "span3 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Site/s covered by flora surveys",
                                "source": "sitesSurveyed",
                                "type": "feature"
                              }
                            ]
                          },
                          {
                            "readonly": true,
                            "source": "siteCalculatedAreaHa",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Please attach mapping details",
                                "source": "extraMappingDetails",
                                "type": "document"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Actual area (ha) covered by flora surveys",
                                "helpText": "Manually enter correct figure for this reporting period if different to mapped value.",
                                "source": "areaSurveyedHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for actual being different to mapped amount",
                                "source": "mappingNotAlignedReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "mappingNotAlignedComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Invoiced area (ha) covered by flora surveys",
                                "helpText": "Enter the amount you will invoice for during this reporting period.",
                                "source": "areaInvoicedHa",
                                "type": "number",
                                "validate": "required",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for invoiced amount being different to actual amount",
                                "source": "invoicedNotActualReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "invoicedNotActualComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "columns": [
                      {
                        "width": "30%",
                        "source": "species",
                        "title": "Target species recorded",
                        "type": "speciesSelect"
                      },
                      {
                        "width": "25%",
                        "source": "threatenedEcologicalCommunity",
                        "title": "Threatened ecological communities (if applicable)",
                        "type": "text"
                      },
                      {
                        "width": "20%",
                        "source": "surveyTechnique",
                        "title": "Survey technique",
                        "type": "text"
                      },
                      {
                        "width": "15%",
                        "source": "individualsOrGroups",
                        "title": "Individuals or groups?",
                        "type": "selectOne"
                      },
                      {
                        "width": "10%",
                        "source": "numberOfIndividualsOrGroups",
                        "title": "Number of groups / individuals in flora survey",
                        "type": "number"
                      }
                    ],
                    "userAddedRows": true,
                    "source": "floraSurveyDetails",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpFloraSurvey",
      "title": "Flora survey"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Habitat augmentation",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "feature",
                "name": "sitesOfAugmentation"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesOfAugmentation)"
                },
                "dataType": "number",
                "name": "calculatedAreaAugmentedHa",
                "units": "ha"
              },
              {
                "computed": {
                  "expression": "$geom.lengthKm(sitesOfAugmentation)"
                },
                "dataType": "number",
                "name": "calculatedLengthAugmentedKm",
                "units": "km"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "calculatedAreaAugmentedHa"
                },
                "dataType": "number",
                "name": "areaAugmentedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "calculatedLengthAugmentedKm"
                },
                "dataType": "number",
                "name": "lengthAugmentedKm",
                "units": "km",
                "validate": "required,min[0]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "validate": "required",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaAugmentedHa, areaAugmentedHa, 0.1)) or roundTo(areaAugmentedHa, 2) != roundTo(areaInvoicedAumentationHa, 2)",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaAugmentedHa, areaAugmentedHa, 0.1))",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "validate": "required,maxSize[300]",
                "behaviour": [
                  {
                    "type": "visible",
                    "condition": "\"Other\" == mappingNotAlignedReason"
                  }
                ]
              },
              {
                "dataType": "number",
                "name": "areaInvoicedAumentationHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "areaAugmentedHa"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "roundTo(areaAugmentedHa, 2) != roundTo(areaInvoicedAumentationHa, 2)",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "type": "visible",
                    "condition": "\"Other\" == invoicedNotActualReason"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "number",
                "name": "numberOfStructuresInstalled",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "habitatAugmentationType",
                "description": "",
                "constraints": [
                  "Artificial fauna movement devices",
                  "Artificial nesting or roosting habitat (incl. tiles, fence posts)",
                  "Environmental thinning",
                  "Improving fish passage",
                  "Natural features (rocks, logs)",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherHabitatAugmentationType",
                "description": "Please specify the habitat augmentation type if Other (specify in notes) was selected in the Type of habitat augmentation column.",
                "behaviour": [
                  {
                    "condition": "habitatAugmentationType == \"Other\"",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "text",
                "name": "habitatAugmentationObjective",
                "description": "",
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "feature",
                "name": "sitesBenefittedByHabitatAugmentation"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.areaHa(sitesBenefittedByHabitatAugmentation)"
                },
                "dataType": "number",
                "name": "areaBenefittedByHabitatAugmentationHa",
                "validate": [
                  {
                    "rule": "min",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(sitesBenefittedByHabitatAugmentation)*0.9"
                    }
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(sitesBenefittedByHabitatAugmentation)*1.1"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "evidenceOfBenefit",
                "validate": "maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "habitatAugmentationDetails"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Habitat augmentation",
        "title": "Habitat augmentation",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "10%",
                    "source": "initialOrFollowup",
                    "title": "Initial or follow-up control?",
                    "type": "selectOne"
                  },
                  {
                    "width": "10%",
                    "title": "Site/s of habitat augmentation",
                    "type": "col",
                    "items": [
                      {
                        "source": "sitesOfAugmentation",
                        "type": "feature"
                      },
                      {
                        "source": "calculatedAreaAugmentedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        },
                        "readonly": "readonly"
                      },
                      {
                        "source": "calculatedLengthAugmentedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        },
                        "readonly": "readonly"
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "10%",
                    "type": "col",
                    "title": "Actual area (ha) / length (km) of habitat augmentation",
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "items": [
                      {
                        "source": "areaAugmentedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthAugmentedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "10%",
                    "type": "col",
                    "title": "Invoiced area (ha) habitat augmentation",
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "items": [
                      {
                        "source": "areaInvoicedAumentationHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "5%",
                    "source": "numberOfStructuresInstalled",
                    "type": "number",
                    "title": "Number of structures installed"
                  },
                  {
                    "width": "15%",
                    "title": "Type of habitat augmentation / installed",
                    "type": "col",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "habitatAugmentationType",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "otherHabitatAugmentationType",
                            "type": "textarea"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "15%",
                    "source": "habitatAugmentationObjective",
                    "title": "Purpose of habitat augmentation",
                    "type": "textarea"
                  },
                  {
                    "width": "10%",
                    "title": "Please map any off-site area/s if they benefitted from this habitat augmentation",
                    "type": "col",
                    "items": [
                      {
                        "source": "sitesBenefittedByHabitatAugmentation",
                        "type": "feature"
                      },
                      {
                        "source": "areaBenefittedByHabitatAugmentationHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        },
                        "readonly": "readonly"
                      }
                    ]
                  },
                  {
                    "width": "15%",
                    "source": "evidenceOfBenefit",
                    "title": "If off-site area was mapped please provide a description on the evidence available to reflect this benefit",
                    "type": "textarea"
                  }
                ],
                "userAddedRows": true,
                "source": "habitatAugmentationDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpHabitatAugmentation",
      "title": "Habitat augmentation"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Identifying sites",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "title": "Identifying the location of potential sites",
        "modelName": "RLP - Identifying sites",
        "dataModel": [
          {
            "dataType": "number",
            "name": "numberSitesIdentified",
            "validate": "required,min[0]"
          },
          {
            "dataType": "text",
            "name": "sitesPurpose",
            "description": "Please start with the '[RLP Service name]:' for which the site has been identified for. Then a brief description of what work/s are required to fix the area.",
            "validate": "required,maxSize[500]"
          },
          {
            "name": "photographicEvidence",
            "dataType": "image"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "viewModel": [
          {
            "items": [
              {
                "type": "row",
                "items": [
                  {
                    "source": "numberSitesIdentified",
                    "preLabel": "Number of potential sites identified",
                    "type": "number",
                    "css": "span3"
                  },
                  {
                    "source": "sitesPurpose",
                    "preLabel": "What have these sites been identified for?",
                    "type": "textarea",
                    "rows": 5,
                    "css": "span9"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "type": "image",
                    "source": "photographicEvidence",
                    "preLabel": "Optionally attach photos"
                  }
                ]
              }
            ],
            "type": "section"
          },
          {
            "type": "row",
            "items": [
              {
                "preLabel": "Auditable Evidence",
                "source": "projectAssuranceDetails",
                "type": "textarea",
                "rows": 4,
                "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
              }
            ]
          }
        ]
      },
      "templateName": "rlpIdentifyingSites",
      "title": "Identifying the location of potential sites"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Improving hydrological regimes",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "installedOrMaintained",
                "description": "",
                "constraints": [
                  "Installed",
                  "Maintained"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfTreatmentsImplemented",
                "validate": "required,min[0]"
              },
              {
                "dataType": "feature",
                "name": "improvedSites"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(improvedSites)"
                },
                "dataType": "number",
                "name": "calculatedAreaCoveringRegimeChangeHa",
                "units": "ha"
              },
              {
                "computed": {
                  "expression": "$geom.lengthKm(improvedSites)"
                },
                "dataType": "number",
                "name": "calculatedLengthOfRegimeChangeKm",
                "units": "km"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "validate": "required",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaCoveringRegimeChangeHa, areaCoveringRegimeChangeHa, 0.1) and within(calculatedLengthOfRegimeChangeKm, lengthOfRegimeChangeKm, 0.1))",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaCoveringRegimeChangeHa, areaCoveringRegimeChangeHa, 0.1) and within(calculatedLengthOfRegimeChangeKm, lengthOfRegimeChangeKm, 0.1))",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "validate": "required,maxSize[300]",
                "behaviour": [
                  {
                    "type": "visible",
                    "condition": "\"Other\" == mappingNotAlignedReason"
                  }
                ]
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "calculatedAreaCoveringRegimeChangeHa"
                },
                "dataType": "number",
                "name": "areaCoveringRegimeChangeHa",
                "validate": "min[0]",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "calculatedLengthOfRegimeChangeKm"
                },
                "dataType": "number",
                "name": "lengthOfRegimeChangeKm",
                "validate": "min[0]",
                "units": "km"
              },
              {
                "dataType": "text",
                "name": "treatmentType",
                "description": "",
                "constraints": [
                  "Removing barriers (e.g fish barriers)",
                  "Structure instalment or modification (e.g. weirs, flow gauging stations, fords, culverts)",
                  "Resnagging",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherTreatmentType",
                "behaviour": [
                  {
                    "condition": "treatmentType == \"Other\"",
                    "type": "enable"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "treatmentObjective",
                "description": "Aim of the action - e.g. hydrological regime change from X to Y",
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "feature",
                "name": "sitesOfCatchmentManaged"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.areaHa(sitesOfCatchmentManaged)"
                },
                "dataType": "number",
                "name": "areaOfCatchmentManagedHa",
                "description": "Area improved by hydrological regime change",
                "validate": "min[0]"
              }
            ],
            "dataType": "list",
            "name": "hydrologicalRegimeDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Improving hydrological regimes",
        "title": "Improving hydrological regimes",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "15%",
                    "source": "installedOrMaintained",
                    "type": "selectOne",
                    "title": "Installed or maintained?"
                  },
                  {
                    "width": "6%",
                    "source": "numberOfTreatmentsImplemented",
                    "title": "Number of treatments implemented to improve water management",
                    "type": "number"
                  },
                  {
                    "width": "10%",
                    "type": "col",
                    "items": [
                      {
                        "type": "feature",
                        "source": "improvedSites"
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "type": "number",
                            "source": "calculatedAreaCoveringRegimeChangeHa",
                            "displayOptions": {
                              "displayUnits": true
                            },
                            "readonly": true
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "type": "number",
                            "source": "calculatedLengthOfRegimeChangeKm",
                            "displayOptions": {
                              "displayUnits": true
                            },
                            "readonly": true
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ],
                    "title": "Site/s where hydrological regimes are being improved"
                  },
                  {
                    "width": "10%",
                    "title": "Actual area (ha) / length (km) covering the hydrological regime change",
                    "type": "col",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "areaCoveringRegimeChangeHa",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "lengthOfRegimeChangeKm",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "25%",
                    "title": "Type of treatment implemented to improve water management",
                    "type": "col",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "treatmentType",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "source": "otherTreatmentType",
                        "placeholder": "Type of treatment implemented (if Other)",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "width": "25%",
                    "source": "treatmentObjective",
                    "title": "Hydrological treatment objective",
                    "type": "textarea"
                  },
                  {
                    "type": "col",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "type": "feature",
                            "source": "sitesOfCatchmentManaged"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "areaOfCatchmentManagedHa",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          }
                        ]
                      }
                    ],
                    "width": "10%",
                    "title": "Site/s of catchment being managed as a result of this management action"
                  }
                ],
                "userAddedRows": true,
                "source": "hydrologicalRegimeDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpImprovingHydrologicalRegimes",
      "title": "Improving hydrological regimes"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Improving land management practices",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "feature",
                "name": "implementationSite"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(implementationSite)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "calculatedAreaImplementedHa",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "expression": "$geom.lengthKm(implementationSite)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "calculatedLengthImplementedKm",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(implementationSite)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaImplementedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "defaultValue": {
                  "expression": "$geom.lengthKm(implementationSite)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "lengthImplementedKm",
                "units": "km",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaImplementedHa, areaImplementedHa, 0.1))",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaImplementedHa, areaImplementedHa, 0.1)) or roundTo(areaImplementedHa, 2) != roundTo(areaImplementedInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "areaImplementedInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaImplementedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaImplementedHa, 2) != roundTo(areaImplementedInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "practiceChangeType",
                "description": "",
                "constraints": [
                  "Fencing",
                  "Erosion management",
                  "Stocking rates",
                  "Watering arrangements",
                  "Paddock design",
                  "Rotation grazing",
                  "Permaculture",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherPracticeChangeType",
                "description": "Please specify the type of land management practice change if Other (specify in notes) was selected in the Type of land management practice change.",
                "behaviour": [
                  {
                    "condition": "practiceChangeType == \"Other\"",
                    "type": "enable"
                  }
                ],
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "text",
                "name": "industryType",
                "constraints": [
                  "Broad acre cropping",
                  "Dairy",
                  "Horticulture",
                  "Grazing",
                  "Fisheries",
                  "Aquaculture",
                  "Environment"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "practiceChangeObjective",
                "description": "How will the practice change/s contribute to the area",
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "feature",
                "name": "offSiteBenefitSites"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(offSiteBenefitSites)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "offSiteBenefitAreaHa",
                "validate": [
                  {
                    "param": {
                      "expression": "$geom.areaHa(offSiteBenefitSites)*0.9",
                      "type": "computed"
                    },
                    "rule": "min"
                  },
                  {
                    "param": {
                      "expression": "$geom.areaHa(offSiteBenefitSites)*1.1",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "evidenceOfBenefit",
                "validate": "maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "landManagementDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Improving land management practices",
        "title": "Improving land management practices",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "10%",
                    "source": "initialOrFollowup",
                    "type": "selectOne",
                    "title": "Initial or follow-up control?"
                  },
                  {
                    "width": "5%",
                    "type": "col",
                    "title": "Site/s covered by practice change",
                    "items": [
                      {
                        "source": "implementationSite",
                        "type": "feature"
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedAreaImplementedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedLengthImplementedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "15%",
                    "type": "col",
                    "title": "Actual area (ha) covered by practice change",
                    "items": [
                      {
                        "source": "areaImplementedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthImplementedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "15%",
                    "type": "col",
                    "title": "Invoiced area (ha) covered by practice change",
                    "items": [
                      {
                        "source": "areaImplementedInvoicedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "15%",
                    "title": "Type of action",
                    "type": "col",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "practiceChangeType",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "source": "otherPracticeChangeType",
                        "title": "Type of action (if Other)",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "width": "10%",
                    "source": "industryType",
                    "title": "Industry type",
                    "type": "selectOne"
                  },
                  {
                    "width": "15%",
                    "source": "practiceChangeObjective",
                    "title": "Purpose of improving land management practice",
                    "type": "textarea"
                  },
                  {
                    "width": "15%",
                    "title": "Please map any off-site area/s if they benefitted from this practice change",
                    "type": "col",
                    "items": [
                      {
                        "source": "offSiteBenefitSites",
                        "type": "feature"
                      },
                      {
                        "source": "offSiteBenefitAreaHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "evidenceOfBenefit",
                        "placeholder": "Please provide a description on the evidence available to reflect this benefit",
                        "type": "textarea"
                      }
                    ]
                  }
                ],
                "userAddedRows": true,
                "source": "landManagementDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpLandManagementPractices",
      "title": "Improving land management practices"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Disease management",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "feature",
                "name": "siteTreated"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(siteTreated)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "calculatedAreaTreatedHa",
                "units": "ha"
              },
              {
                "computed": {
                  "expression": "$geom.lengthKm(siteTreated)"
                },
                "dataType": "number",
                "name": "calculatedLengthTreatedKm",
                "units": "km"
              },
              {
                "defaultValue": {
                  "expression": "calculatedAreaTreatedHa",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaTreatedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "defaultValue": {
                  "expression": "calculatedLengthTreatedKm",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "lengthTreatedKm",
                "units": "km",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaTreatedHa, areaTreatedHa, 0.1))",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaTreatedHa, areaTreatedHa, 0.1)) or roundTo(areaTreatedHa, 2) != roundTo(areaTreatedInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "areaTreatedInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaTreatedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaTreatedHa, 2) != roundTo(areaTreatedInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "targetDisease",
                "description": "",
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "text",
                "name": "managementMethod",
                "dwcAttribute": "treatmentMethod",
                "constraints": [
                  "Biological control agents",
                  "Fumigation",
                  "Host destruction",
                  "Plant disease management - quarantine",
                  "Plant disease management - treatment",
                  "Plant disease management - hygiene",
                  "Positive competition",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherManagementMethod",
                "description": "Please specify the management method used if Other (specify in notes) was selected in the Management Method column.",
                "behaviour": [
                  {
                    "condition": "managementMethod == \"Other\"",
                    "type": "enable"
                  }
                ],
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "text",
                "name": "treatmentObjective",
                "description": "Please start with either part of the field heading [dash]. If reporting on both separate the information with a ';'. (eg. 'Management method -' and a brief description of method being used to fix the area; 'Treatment objective -' and a brief description of how the work will contribute to the area.",
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "feature",
                "name": "offSiteBenefitSites"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(offSiteBenefitSites)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "offSiteBenefitAreaHa",
                "units": "ha",
                "validate": "min[0]"
              },
              {
                "defaultValue": {
                  "expression": "$geom.lengthKm(offSiteBenefitSites)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "offSiteBenefitLengthKm",
                "units": "km",
                "validate": "min[0]"
              },
              {
                "dataType": "text",
                "name": "evidenceOfBenefit",
                "validate": "maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "diseaseManagementDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Disease management",
        "title": "Managing disease",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "5%",
                    "source": "initialOrFollowup",
                    "title": "Initial or follow-up treatment?",
                    "type": "selectOne"
                  },
                  {
                    "width": "5%",
                    "type": "col",
                    "title": "Site/s where disease managed",
                    "items": [
                      {
                        "source": "siteTreated",
                        "type": "feature"
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedAreaTreatedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedLengthTreatedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "15%",
                    "type": "col",
                    "title": "Actual area (ha) treated for disease",
                    "items": [
                      {
                        "source": "areaTreatedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthTreatedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "15%",
                    "type": "col",
                    "title": "Invoiced area (ha) treated for disease",
                    "items": [
                      {
                        "source": "areaTreatedInvoicedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "10%",
                    "source": "targetDisease",
                    "title": "Disease treated",
                    "type": "text"
                  },
                  {
                    "width": "12%",
                    "type": "col",
                    "title": "Type of management method / treatment",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "managementMethod",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "source": "otherManagementMethod",
                        "placeholder": "Type of management method / treatment (if other)",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "width": "12%",
                    "source": "treatmentObjective",
                    "title": "Management method / treatment objective",
                    "type": "textarea"
                  },
                  {
                    "width": "15%",
                    "type": "col",
                    "title": "Please map any off-site area/s if they have also benefitted from this disease management",
                    "items": [
                      {
                        "source": "offSiteBenefitSites",
                        "type": "feature"
                      },
                      {
                        "source": "offSiteBenefitAreaHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "offSiteBenefitLengthKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "evidenceOfBenefit",
                        "placeholder": "Please provide a description on the evidence available to reflect this benefit",
                        "type": "textarea"
                      }
                    ]
                  }
                ],
                "userAddedRows": true,
                "source": "diseaseManagementDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpDiseaseManagement",
      "title": "Managing disease"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Negotiations",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "typeOfGroup",
                "description": "If 'Other', please include type in 'Objective of negotiations'",
                "constraints": [
                  "Community",
                  "Landholders",
                  "Farmers",
                  "Traditional owners",
                  "Agricultural industry group",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfGroupsNegotiatedWith",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "numberOfIndividualsNegotiatedWith",
                "validate": "min[0]"
              },
              {
                "dataType": "text",
                "name": "negotiationObjective",
                "description": "Please provide a brief description of negotiations. Separate multiple with a ';'",
                "validate": "required,maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "negotiations"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Negotiations",
        "title": "Negotiating with the Community, landholders, Traditional Owner groups etc.",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "30%",
                    "source": "typeOfGroup",
                    "type": "select2",
                    "title": "Which sector does the group belong to?"
                  },
                  {
                    "width": "10%",
                    "source": "numberOfGroupsNegotiatedWith",
                    "type": "number",
                    "title": "Groups negotiated with",
                    "helpText": "Please note an individual can be considered a group for the purposes of reporting."
                  },
                  {
                    "width": "60%",
                    "source": "negotiationObjective",
                    "type": "textarea",
                    "rows": 3,
                    "title": "Objective of negotiation",
                    "placeholder": "Please include the objectives of the negotation or additional clarifying information"
                  }
                ],
                "userAddedRows": true,
                "source": "negotiations",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpNegotiations",
      "title": "Negotiating with the Community, Landholders, Farmers, Traditional Owner groups, Agriculture industry groups etc."
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Obtaining approvals",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "title": "Obtaining relevant approvals",
        "modelName": "RLP - Obtaining approvals",
        "dataModel": [
          {
            "dataType": "number",
            "name": "numberApprovalsObtained",
            "validate": "required,min[0]"
          },
          {
            "dataType": "text",
            "name": "approvalsObjective",
            "validate": "required,maxSize[300]",
            "description": "Please list why these approvals were required to be obtained for this program"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "viewModel": [
          {
            "items": [
              {
                "type": "row",
                "items": [
                  {
                    "source": "numberApprovalsObtained",
                    "preLabel": "Number of relevant approvals obtained",
                    "type": "number",
                    "css": "span3"
                  },
                  {
                    "source": "approvalsObjective",
                    "preLabel": "What were these approvals obtained for?",
                    "type": "textarea",
                    "rows": 3,
                    "css": "span9"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ],
            "type": "section"
          }
        ]
      },
      "templateName": "rlpObtainingApprovals",
      "title": "Obtaining relevant approvals"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Pest animal survey",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "baselineOrIndicatorSurvey",
                "description": "",
                "constraints": [
                  "Baseline",
                  "Indicator"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfPestAnimalSurveys",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "dateRange",
                "description": "What time of year (eg. Dates by dd/mm/yyyyy, Months, Season/s)",
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "feature",
                "name": "sitesSurveyed"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesSurveyed)"
                },
                "dataType": "number",
                "name": "siteCalculatedAreaHa",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesSurveyed)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaSurveyedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaSurveyedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1)",
                    "type": "if"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1) or roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "if"
                  }
                ],
                "validate": "required"
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "species",
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "surveyTechnique",
                    "description": "",
                    "constraints": [
                      "Spotlight count",
                      "Aerial survey",
                      "DNA sampling",
                      "Mark-recapture",
                      "Signs of presence",
                      "Camera trapping",
                      "Trap and release",
                      "Direct observation",
                      "Other"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "otherSurveyTechnique",
                    "description": "This field may be used to list multiple survey techniques. This list of survey techniques need to be separated with a ';'. You may also identify what/how the survey will capture the pest animal data",
                    "behaviour": [
                      {
                        "condition": "surveyTechnique == \"Other\"",
                        "type": "enable"
                      }
                    ],
                    "validate": "required,maxSize[300]"
                  },
                  {
                    "dataType": "text",
                    "name": "individualsOrGroups",
                    "constraints": [
                      "Individuals",
                      "Groups"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfIndividualsOrGroups",
                    "validate": "required,min[0]"
                  }
                ],
                "dataType": "list",
                "name": "pestAnimals"
              }
            ],
            "dataType": "list",
            "name": "pestAnimalSurveys"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Pest animal survey",
        "title": "Pest animal survey",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "New survey site",
                "userAddedRows": true,
                "source": "pestAnimalSurveys",
                "type": "repeat",
                "items": [
                  {
                    "css": "border-bottom",
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Baseline survey or indicator (follow-up) survey?",
                        "css": "span3",
                        "source": "baselineOrIndicatorSurvey",
                        "type": "selectOne"
                      },
                      {
                        "preLabel": "Number of surveys conducted",
                        "css": "span3",
                        "source": "numberOfPestAnimalSurveys",
                        "type": "number"
                      },
                      {
                        "preLabel": "Date range",
                        "css": "span3",
                        "source": "dateRange",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "css": "span3 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Site/s of surveyed pest animals",
                                "source": "sitesSurveyed",
                                "type": "feature"
                              }
                            ]
                          },
                          {
                            "readonly": true,
                            "source": "siteCalculatedAreaHa",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Please attach mapping details",
                                "source": "extraMappingDetails",
                                "type": "document"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Actual area (ha) surveyed for pest animals",
                                "helpText": "Manually enter correct figure for this reporting period if different to mapped value.",
                                "source": "areaSurveyedHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for actual being different to mapped amount",
                                "source": "mappingNotAlignedReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "mappingNotAlignedComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Invoiced area (ha) surveyed for pest animals",
                                "helpText": "Enter the amount you will invoice for during this reporting period.",
                                "source": "areaInvoicedHa",
                                "type": "number",
                                "validate": "required",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for invoiced amount being different to actual amount",
                                "source": "invoicedNotActualReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "invoicedNotActualComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "addRowText": "Add a species",
                    "columns": [
                      {
                        "width": "40%",
                        "source": "species",
                        "title": "Target species recorded",
                        "type": "speciesSelect"
                      },
                      {
                        "width": "15%",
                        "source": "surveyTechnique",
                        "title": "Survey technique",
                        "type": "select2"
                      },
                      {
                        "width": "20%",
                        "source": "otherSurveyTechnique",
                        "title": "Survey technique (if Other)",
                        "type": "text"
                      },
                      {
                        "width": "15%",
                        "source": "individualsOrGroups",
                        "title": "Individuals or groups?",
                        "type": "selectOne"
                      },
                      {
                        "width": "10%",
                        "source": "numberOfIndividualsOrGroups",
                        "title": "Number of groups / individuals",
                        "type": "number"
                      }
                    ],
                    "userAddedRows": true,
                    "source": "pestAnimals",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "source": "<i>Note: to upload results and methodology of survey, refer to the documents tab.</i>",
                    "type": "literal"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpPestAnimalSurvey",
      "title": "Pest animal survey"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Plant survival survey",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "baselineOrIndicatorSurvey",
                "description": "",
                "constraints": [
                  "Baseline",
                  "Indicator"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfPlantSurvivalSurveys",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "dateRange",
                "description": "What time of year (eg. Dates by dd/mm/yyyyy, Months, Season/s)",
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "feature",
                "name": "sitesSurveyed"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesSurveyed)"
                },
                "dataType": "number",
                "name": "siteCalculatedAreaHa",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesSurveyed)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaSurveyedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaSurveyedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1)",
                    "type": "if"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1) or roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "if"
                  }
                ],
                "validate": "required"
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "speciesRecorded",
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "surveyTechnique",
                    "description": "This field may be used to list multiple survey techniques. This list of survey techniques need to be separated with a ';'.  You may also identify 'What/how will the survey capture the plant survival data'",
                    "validate": "required,maxSize[300]"
                  },
                  {
                    "dataType": "text",
                    "name": "individualsOrGroups",
                    "constraints": [
                      "Individuals",
                      "Groups"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfSurvivingIndividualsOrGroups",
                    "validate": "required,min[0]"
                  },
                  {
                    "dataType": "number",
                    "name": "survivalRate",
                    "behaviour": [
                      {
                        "condition": "baselineOrIndicatorSurvey == \"Indicator\"",
                        "type": "enable"
                      }
                    ],
                    "validate": "required,min[0],max[100]"
                  }
                ],
                "dataType": "list",
                "name": "speciesSurveyed"
              }
            ],
            "dataType": "list",
            "name": "plantSurvivalSurveys"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Plant survival survey",
        "title": "Plant survival survey",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "Add survey site",
                "userAddedRows": true,
                "source": "plantSurvivalSurveys",
                "type": "repeat",
                "items": [
                  {
                    "css": "border-bottom",
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Baseline survey or indicator (follow-up) survey?",
                        "css": "span3",
                        "source": "baselineOrIndicatorSurvey",
                        "type": "selectOne"
                      },
                      {
                        "preLabel": "Number of plant survival surveys conducted",
                        "css": "span3",
                        "source": "numberOfPlantSurvivalSurveys",
                        "type": "number"
                      },
                      {
                        "preLabel": "Date range",
                        "css": "span3",
                        "source": "dateRange",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "css": "span3 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Site/s surveyed for plant survival",
                                "source": "sitesSurveyed",
                                "type": "feature"
                              }
                            ]
                          },
                          {
                            "readonly": true,
                            "source": "siteCalculatedAreaHa",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Please attach mapping details",
                                "source": "extraMappingDetails",
                                "type": "document"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Actual area (ha) surveyed for plant survival",
                                "helpText": "Manually enter correct figure for this reporting period if different to mapped value.",
                                "source": "areaSurveyedHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for actual being different to mapped amount",
                                "source": "mappingNotAlignedReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "mappingNotAlignedComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Invoiced area (ha) surveyed for plant survival",
                                "helpText": "Enter the amount you will invoice for during this reporting period.",
                                "source": "areaInvoicedHa",
                                "type": "number",
                                "validate": "required",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for invoiced amount being different to actual amount",
                                "source": "invoicedNotActualReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "invoicedNotActualComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "addRowText": "Add a species",
                    "columns": [
                      {
                        "width": "45%",
                        "source": "speciesRecorded",
                        "type": "speciesSelect",
                        "title": "Species recorded"
                      },
                      {
                        "width": "20%",
                        "source": "surveyTechnique",
                        "title": "Survey technique",
                        "type": "textarea"
                      },
                      {
                        "width": "15%",
                        "source": "individualsOrGroups",
                        "title": "Individuals or groups?",
                        "type": "selectOne"
                      },
                      {
                        "width": "10%",
                        "source": "numberOfSurvivingIndividualsOrGroups",
                        "title": "Number of individuals or groups surviving",
                        "type": "number"
                      },
                      {
                        "width": "10%",
                        "source": "survivalRate",
                        "title": "If follow-up (indicator) survey, what is the survival rate (%)",
                        "type": "number"
                      }
                    ],
                    "userAddedRows": true,
                    "source": "speciesSurveyed",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpPlantSurvivalSurvey",
      "title": "Plant survival survey"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Project planning",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "title": "Project planning and delivery of documents as required for the delivery of the Project Services and monitoring",
        "modelName": "RLP - Project planning",
        "dataModel": [
          {
            "dataType": "list",
            "name": "documents",
            "columns": [
              {
                "dataType": "number",
                "name": "numberPlanningDocuments",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "numberOfDaysAdministeringProjectPlans",
                "validate": "required,min[0]",
                "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)"
              },
              {
                "dataType": "text",
                "name": "purposeOfProjectPlans",
                "validate": "required,maxSize[300]",
                "description": "Please identify why these plans and/or documents were needed"
              }
            ]
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "viewModel": [
          {
            "items": [
              {
                "type": "table",
                "userAddedRows": true,
                "source": "documents",
                "columns": [
                  {
                    "source": "numberPlanningDocuments",
                    "title": "Number of planning and delivery documents for delivery of the project services and monitoring",
                    "type": "number",
                    "width": "15%"
                  },
                  {
                    "source": "numberOfDaysAdministeringProjectPlans",
                    "title": "Number of days administering project plans / delivery documents",
                    "type": "number",
                    "width": "15%"
                  },
                  {
                    "source": "purposeOfProjectPlans",
                    "title": "Purpose of these documents",
                    "type": "textarea",
                    "rows": 3,
                    "width": "70%"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ],
            "type": "section"
          }
        ]
      },
      "templateName": "rlpProjectPlanning",
      "title": "Project planning and delivery of documents as required for the delivery of the Project Services and monitoring"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Remediating riparian and aquatic areas",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "feature",
                "name": "sitesRemediated"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesRemediated)"
                },
                "dataType": "number",
                "name": "calculatedAreaRemediatedHa",
                "units": "ha"
              },
              {
                "computed": {
                  "expression": "$geom.lengthKm(sitesRemediated)"
                },
                "dataType": "number",
                "name": "calculatedLengthRemediatedKm",
                "units": "km"
              },
              {
                "defaultValue": {
                  "expression": "calculatedAreaRemediatedHa",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaRemediatedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "defaultValue": {
                  "expression": "calculatedLengthRemediatedKm",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "lengthRemediatedKm",
                "units": "km",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaRemediatedHa, areaRemediatedHa, 0.1) and within(calculatedLengthRemediatedKm, lengthRemediatedKm, 0.1))",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaRemediatedHa, areaRemediatedHa, 0.1) and within(calculatedLengthRemediatedKm, lengthRemediatedKm, 0.1)) or roundTo(areaRemediatedHa, 2) != roundTo(areaRemediatedInvoicedHa, 2) or roundTo(lengthRemediatedKm, 2) != roundTo(lengthRemediatedInvoicedKm, 2)",
                    "type": "visible"
                  }
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "areaRemediatedInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaRemediatedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "number",
                "name": "lengthRemediatedInvoicedKm",
                "units": "km",
                "validate": [
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "lengthRemediatedKm",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaRemediatedHa, 2) != roundTo(areaRemediatedInvoicedHa, 2) or roundTo(lengthRemediatedKm, 2) != roundTo(lengthRemediatedInvoicedKm, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "number",
                "name": "numberOfStructuresInstalled",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "remediationType",
                "description": "",
                "constraints": [
                  "Access control",
                  "Bank grooming",
                  "Flow gauging stations",
                  "Fords",
                  "Culverts",
                  "Revegetation",
                  "Weirs",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherRemediationType",
                "behaviour": [
                  {
                    "condition": "remediationType == \"Other\"",
                    "type": "enable"
                  }
                ],
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "feature",
                "name": "offSiteBenefitSites"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(offSiteBenefitSites)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "offSiteBenefitAreaHa",
                "units": "ha",
                "validate": "min[0]"
              },
              {
                "dataType": "text",
                "name": "evidenceOfBenefit",
                "validate": "maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "remediationDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Remediating riparian and aquatic areas",
        "title": "Remediating riparian and aquatic areas",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "10%",
                    "source": "initialOrFollowup",
                    "title": "Initial / Followup control",
                    "type": "selectOne"
                  },
                  {
                    "width": "10%",
                    "type": "col",
                    "title": "Site/s covered by remediation",
                    "items": [
                      {
                        "source": "sitesRemediated",
                        "type": "feature"
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedAreaRemediatedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedLengthRemediatedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "17%",
                    "type": "col",
                    "title": "Actual area (ha) / length (km) being remediated",
                    "items": [
                      {
                        "source": "areaRemediatedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthRemediatedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "17%",
                    "type": "col",
                    "title": "Invoiced area (ha) / length (km) being remediated",
                    "items": [
                      {
                        "source": "areaRemediatedInvoicedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthRemediatedInvoicedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "10%",
                    "source": "numberOfStructuresInstalled",
                    "type": "number",
                    "title": "Number of structures installed"
                  },
                  {
                    "width": "17%",
                    "type": "col",
                    "title": "Type of remediation",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "remediationType",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "source": "otherRemediationType",
                        "placeholder": "Type of remediation (if Other)",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "width": "17%",
                    "type": "col",
                    "title": "Please identify any area/s that have shown evidence of off-site benefits",
                    "items": [
                      {
                        "source": "offSiteBenefitSites",
                        "type": "feature"
                      },
                      {
                        "source": "offSiteBenefitAreaHa",
                        "title": "Area (ha) evident of improved remediation",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "evidenceOfBenefit",
                        "placeholder": "Please provide a description on the evidence available to reflect this benefit",
                        "type": "textarea"
                      }
                    ]
                  }
                ],
                "userAddedRows": true,
                "source": "remediationDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpRemediatingRiparianAndAquaticAreas",
      "title": "Remediating riparian and aquatic areas"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Weed treatment",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "feature",
                "name": "sitesTreated"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesTreated)"
                },
                "dataType": "number",
                "name": "siteCalculatedAreaHa",
                "units": "ha"
              },
              {
                "computed": {
                  "expression": "$geom.lengthKm(sitesTreated)"
                },
                "dataType": "number",
                "name": "siteCalculatedLengthKm",
                "units": "km"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesTreated)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaTreatedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "defaultValue": {
                  "expression": "$geom.lengthKm(sitesTreated)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "lengthTreatedKm",
                "units": "km",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaTreatedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "number",
                "name": "lengthInvoicedKm",
                "units": "km",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "lengthTreatedKm",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not (within(areaTreatedHa, siteCalculatedAreaHa, 0.1) and within(lengthTreatedKm, siteCalculatedLengthKm, 0.1))",
                    "type": "if"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaTreatedHa, 2) != roundTo(areaInvoicedHa, 2) or roundTo(lengthTreatedKm, 2) != roundTo(lengthInvoicedKm, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(areaTreatedHa, siteCalculatedAreaHa, 0.1) and within(lengthTreatedKm, siteCalculatedLengthKm, 0.1)) or roundTo(areaTreatedHa, 2) != roundTo(areaInvoicedHa, 2) or roundTo(lengthTreatedKm, 2) != roundTo(lengthInvoicedKm, 2)",
                    "type": "if"
                  }
                ],
                "validate": "required"
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "weedTargetSpecies",
                    "dwcAttribute": "scientificName",
                    "description": "Weed species targeted for treatment (start typing a  scientific or common name for a species)",
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "threatenedEcologicalCommunity",
                    "validate": "maxSize[100]"
                  },
                  {
                    "dataType": "text",
                    "name": "treatmentMethod",
                    "description": "The primary method used to treat the patch of the target species",
                    "constraints": [
                      "Basal bark spraying",
                      "Biological agents",
                      "Cut stump",
                      "Cut and swab",
                      "Dozing",
                      "Felling",
                      "Fire",
                      "Foliar spraying",
                      "Grubbing / chipping",
                      "Hand pulling",
                      "Moisture and nutrient control",
                      "Mowing",
                      "Overplanting",
                      "Pushing",
                      "Slashing",
                      "Spot spraying",
                      "Splatter gun",
                      "Stem injection",
                      "Stem scraper",
                      "Wick applicators",
                      "Other"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "otherTreatmentMethod",
                    "description": "Please specify the method of treatment used if Other was selected in the Type of treatment column.",
                    "behaviour": [
                      {
                        "condition": "treatmentMethod == \"Other\"",
                        "type": "enable"
                      }
                    ],
                    "validate": "required,maxSize[100]"
                  },
                  {
                    "dataType": "text",
                    "name": "treatmentObjective",
                    "description": "How will the work contribute to protecting the area",
                    "validate": "required,maxSize[300]"
                  }
                ],
                "dataType": "list",
                "name": "weedSpeciesTreated"
              }
            ],
            "dataType": "list",
            "name": "weedTreatmentSites"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Weed treatment",
        "title": "Removing weeds",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "New weed removal site",
                "userAddedRows": true,
                "source": "weedTreatmentSites",
                "type": "repeat",
                "items": [
                  {
                    "css": "border-bottom",
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Initial or follow-up treatment",
                        "css": "span3",
                        "source": "initialOrFollowup",
                        "type": "selectOne"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "css": "span3 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Site/s where weed treatment was undertaken",
                                "source": "sitesTreated",
                                "type": "feature"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "readonly": true,
                                "source": "siteCalculatedAreaHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "readonly": true,
                                "source": "siteCalculatedLengthKm",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Please attach mapping details",
                                "source": "extraMappingDetails",
                                "type": "document"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Actual area (ha) / length (km) treated for weed removal",
                                "helpText": "Manually enter correct figure for this reporting period if different to mapped value.",
                                "source": "areaTreatedHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "source": "lengthTreatedKm",
                                "type": "number",
                                "validate": "required",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for actual being different to mapped amount",
                                "source": "mappingNotAlignedReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "mappingNotAlignedComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Invoiced area (ha) / length (km) treated for weed removal",
                                "helpText": "Enter the amount you will invoice for during this reporting period.",
                                "source": "areaInvoicedHa",
                                "type": "number",
                                "validate": "required",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "source": "lengthInvoicedKm",
                            "type": "number",
                            "validate": "required",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for invoiced amount being different to actual amount",
                                "source": "invoicedNotActualReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "invoicedNotActualComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "columns": [
                      {
                        "width": "20%",
                        "source": "weedTargetSpecies",
                        "title": "Target weed species",
                        "type": "speciesSelect"
                      },
                      {
                        "width": "22%",
                        "source": "threatenedEcologicalCommunity",
                        "title": "Threatened Ecological Community (if applicable)",
                        "type": "text"
                      },
                      {
                        "width": "15%",
                        "source": "treatmentMethod",
                        "title": "Type of treatment",
                        "type": "select2"
                      },
                      {
                        "width": "20%",
                        "source": "otherTreatmentMethod",
                        "title": "Type of treatment (if other)",
                        "type": "text"
                      },
                      {
                        "width": "23%",
                        "source": "treatmentObjective",
                        "title": "Treatment objective",
                        "type": "textarea"
                      }
                    ],
                    "userAddedRows": true,
                    "source": "weedSpeciesTreated",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpWeedTreatment",
      "title": "Removing weeds"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Revegetating habitat",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrMaintenance",
                "constraints": [
                  "Initial",
                  "Maintenance"
                ],
                "validate": "required"
              },
              {
                "dataType": "feature",
                "name": "sitesRevegetated"
              },
              {
                "dataType": "number",
                "name": "siteCalculatedAreaHa",
                "computed": {
                  "expression": "$geom.areaHa(sitesRevegetated)"
                },
                "units": "ha"
              },
              {
                "dataType": "number",
                "name": "siteCalculatedLengthKm",
                "computed": {
                  "expression": "$geom.lengthKm(sitesRevegetated)"
                },
                "units": "km"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "siteCalculatedAreaHa"
                },
                "dataType": "number",
                "name": "areaRevegetatedHa",
                "validate": "required,min[0]",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "siteCalculatedLengthKm"
                },
                "dataType": "number",
                "name": "lengthRevegetatedKm",
                "validate": "required,min[0]",
                "units": "km"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "areaRevegetatedHa"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "not within(areaRevegetatedHa, siteCalculatedAreaHa, 0.1)",
                    "type": "if"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "validate": "required,maxSize[300]",
                "behaviour": [
                  {
                    "type": "if",
                    "condition": "\"Other\" == mappingNotAlignedReason"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required",
                "behaviour": [
                  {
                    "condition": "roundTo(areaRevegetatedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "visible"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "type": "if",
                    "condition": "\"Other\" == invoicedNotActualReason"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "validate": "required",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not within(areaRevegetatedHa, siteCalculatedAreaHa, 0.1) or roundTo(areaRevegetatedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "if"
                  }
                ]
              },
              {
                "dataType": "feature",
                "name": "offSiteBenefitSites"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.areaHa(offSiteBenefitSites)"
                },
                "dataType": "number",
                "name": "offSiteBenefitAreaHa",
                "validate": [
                  {
                    "rule": "min",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(offSiteBenefitSites)*0.9"
                    }
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(offSiteBenefitSites)*1.1"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "evidenceOfBenefit",
                "validate": "maxSize[300]"
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "species",
                    "dwcAttribute": "scientificName",
                    "description": "",
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "typeOfRevegetationActivity",
                    "validate": "required,maxSize[100]"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfDaysCollectingSeed",
                    "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)",
                    "validate": "required,min[0]"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfDaysPropagatingPlants",
                    "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)",
                    "validate": "required,min[0]"
                  },
                  {
                    "dataType": "text",
                    "name": "revegetationMethod",
                    "dwcAttribute": "establishmentMeans",
                    "description": "If 'Other', please identify in 'Type of revegetation activity' field",
                    "constraints": [
                      "Direct seeding",
                      "Tubestock planting",
                      "Both",
                      "Other"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "threatenedEcologicalCommunity",
                    "description": "This free text field allows multiple TECs to be entered. They should be written as listed in EPBC, and separated by ';'",
                    "validate": "maxSize[100]"
                  },
                  {
                    "dataType": "text",
                    "name": "individualsOrKilogramsOfSeed",
                    "constraints": [
                      "Individuals",
                      "Kilograms of seed"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "number",
                    "name": "numberPlanted",
                    "validate": "required,min[0]"
                  },
                  {
                    "dataType": "text",
                    "name": "revegetationObjective",
                    "validate": "required,maxSize[300]"
                  }
                ],
                "dataType": "list",
                "name": "revegetationDetails"
              }
            ],
            "dataType": "list",
            "name": "revegetationArea"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Revegetating habitat",
        "title": "Revegetating habitat",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "New area of revegetation",
                "userAddedRows": true,
                "source": "revegetationArea",
                "type": "repeat",
                "items": [
                  {
                    "type": "row",
                    "css": "border-bottom",
                    "items": [
                      {
                        "preLabel": "Initial or maintenance activity?",
                        "css": "span3",
                        "source": "initialOrMaintenance",
                        "type": "selectOne"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "css": "border-bottom",
                    "items": [
                      {
                        "type": "col",
                        "css": "span3 col-border-right",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Site/s being revegetated",
                                "source": "sitesRevegetated",
                                "type": "feature"
                              }
                            ]
                          },
                          {
                            "source": "siteCalculatedAreaHa",
                            "type": "number",
                            "readonly": true,
                            "displayOptions": {
                              "displayUnits": true
                            }
                          },
                          {
                            "source": "siteCalculatedLengthKm",
                            "type": "number",
                            "readonly": true,
                            "displayOptions": {
                              "displayUnits": true
                            }
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Please attach mapping details",
                                "source": "extraMappingDetails",
                                "type": "document"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "col",
                        "css": "span4 col-border-right",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Actual area (ha) / length (km) of habitat revegetated",
                                "helpText": "Manually enter correct figure for this reporting period if different to mapped value.",
                                "source": "areaRevegetatedHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "source": "lengthRevegetatedKm",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for actual being different to mapped amount",
                                "source": "mappingNotAlignedReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "mappingNotAlignedComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "col",
                        "css": "span4",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Invoiced area (ha) of habitat revegetated",
                                "helpText": "Enter the amount you will invoice for during this reporting period.",
                                "source": "areaInvoicedHa",
                                "type": "number",
                                "validate": "required",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for invoiced amount being different to actual amount",
                                "source": "invoicedNotActualReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "invoicedNotActualComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Please map any off-site area/s if they benefitted from this  revegetation activity",
                        "css": "span3",
                        "source": "offSiteBenefitSites",
                        "type": "feature"
                      },
                      {
                        "preLabel": "Area (ha) benefitting from revegetation activity",
                        "css": "span2",
                        "source": "offSiteBenefitAreaHa",
                        "type": "number"
                      },
                      {
                        "preLabel": "If off-site area was mapped please provide a description on the evidence available to reflect this benefit.",
                        "css": "span6",
                        "source": "evidenceOfBenefit",
                        "type": "textarea"
                      }
                    ]
                  },
                  {
                    "addRowText": "Add a species",
                    "columns": [
                      {
                        "width": "20%",
                        "source": "species",
                        "title": "Species",
                        "type": "speciesSelect"
                      },
                      {
                        "width": "5%",
                        "source": "numberOfDaysCollectingSeed",
                        "title": "Number of days collecting seed",
                        "type": "number"
                      },
                      {
                        "width": "5%",
                        "source": "numberOfDaysPropagatingPlants",
                        "title": "Number of days propagating plants",
                        "type": "number"
                      },
                      {
                        "width": "15%",
                        "source": "revegetationMethod",
                        "title": "Planting method",
                        "type": "selectOne"
                      },
                      {
                        "width": "15%",
                        "source": "typeOfRevegetationActivity",
                        "title": "Type of revegetation activity",
                        "type": "text"
                      },
                      {
                        "width": "15%",
                        "source": "threatenedEcologicalCommunity",
                        "title": "Threatened ecological community (if applicable)",
                        "type": "text"
                      },
                      {
                        "width": "10%",
                        "source": "individualsOrKilogramsOfSeed",
                        "title": "Individuals / kilograms",
                        "type": "selectOne"
                      },
                      {
                        "width": "10%",
                        "source": "numberPlanted",
                        "title": "Number planted",
                        "type": "number"
                      },
                      {
                        "width": "20%",
                        "source": "revegetationObjective",
                        "title": "Objective of revegetation activity",
                        "type": "textarea"
                      }
                    ],
                    "userAddedRows": true,
                    "source": "revegetationDetails",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpRevegetatingHabitat",
      "title": "Revegetating habitat"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Site preparation",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "feature",
                "name": "sitesPrepared"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesPrepared)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "calculatedAreaPreparedHa",
                "units": "ha"
              },
              {
                "computed": {
                  "expression": "$geom.lengthKm(sitesPrepared)"
                },
                "dataType": "number",
                "name": "calculatedLengthPreparedKm",
                "units": "km"
              },
              {
                "defaultValue": {
                  "expression": "calculatedAreaPreparedHa",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaPreparedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "defaultValue": {
                  "expression": "calculatedLengthPreparedKm",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "lengthPreparedKm",
                "units": "km",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaPreparedHa, areaPreparedHa, 0.1))",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not (within(calculatedAreaPreparedHa, areaPreparedHa, 0.1)) or roundTo(areaPreparedHa, 2) != roundTo(areaPreparedInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "areaPreparedInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaPreparedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaPreparedHa, 2) != roundTo(areaPreparedInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "visible"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "number",
                "name": "numberOfDaysPreparingSite",
                "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)",
                "validate": "required,min[0]"
              },
              {
                "dataType": "stringList",
                "name": "industryType",
                "constraints": [
                  "Broad acre cropping",
                  "Dairy",
                  "Environmental",
                  "Horticulture",
                  "Grazing",
                  "Fisheries",
                  "Aquaculture",
                  "Other"
                ]
              },
              {
                "dataType": "text",
                "name": "actionType",
                "description": "",
                "constraints": [
                  "Basal bark spraying",
                  "Biological agents",
                  "Cut stump",
                  "Cut and swab",
                  "Dozing",
                  "Felling",
                  "Fire",
                  "Foliar spraying",
                  "Grubbing/chipping",
                  "Hand pulling",
                  "Moisture and nutrient control",
                  "Mowing",
                  "Other earthworks",
                  "Overplanting",
                  "Pushing",
                  "Slashing",
                  "Spot spraying",
                  "Splatter gun",
                  "Stem injection",
                  "Stem scraper",
                  "Wick applicators",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "otherActionType",
                "description": "This field may be used to list multiple preparation activities. This list of activities need to be separated with a ';'",
                "behaviour": [
                  {
                    "condition": "actionType == \"Other\"",
                    "type": "enable"
                  }
                ],
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "text",
                "name": "purposeOfSitePreparation",
                "description": "Please provide a brief description of how the work will benefit the area",
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "threatenedEcologicalCommunity",
                "description": "This free text field allows multiple TECs to be entered. They should be written as listed in EPBC, and separated by commas",
                "validate": "maxSize[100]"
              }
            ],
            "dataType": "list",
            "name": "sitePreparationDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Site preparation",
        "title": "Site preparation",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "10%",
                    "type": "col",
                    "title": "Site/s where preparation was undertaken",
                    "items": [
                      {
                        "source": "sitesPrepared",
                        "type": "feature"
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedAreaPreparedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "readonly": "readonly",
                        "source": "calculatedLengthPreparedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Please attach mapping details",
                            "source": "extraMappingDetails",
                            "type": "document"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "15%",
                    "type": "col",
                    "title": "Actual area (ha) / length (km) of site preparation",
                    "items": [
                      {
                        "source": "areaPreparedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "source": "lengthPreparedKm",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for actual being different to mapped amount",
                            "source": "mappingNotAlignedReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "mappingNotAlignedComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "helpText": "Enter the amount you will invoice for during this reporting period.",
                    "width": "15%",
                    "type": "col",
                    "title": "Invoiced area (ha) of site preparation",
                    "items": [
                      {
                        "source": "areaPreparedInvoicedHa",
                        "type": "number",
                        "displayOptions": {
                          "displayUnits": true
                        }
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "preLabel": "Reason for invoiced amount being different to actual amount",
                            "source": "invoicedNotActualReason",
                            "type": "selectOne"
                          }
                        ]
                      },
                      {
                        "type": "row",
                        "items": [
                          {
                            "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                            "source": "invoicedNotActualComments",
                            "type": "textarea",
                            "rows": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "width": "10%",
                    "source": "numberOfDaysPreparingSite",
                    "title": "Number of days in preparing site",
                    "type": "number"
                  },
                  {
                    "width": "10%",
                    "source": "industryType",
                    "title": "Industry type",
                    "type": "select2"
                  },
                  {
                    "width": "15%",
                    "type": "col",
                    "title": "Type of action",
                    "items": [
                      {
                        "type": "row",
                        "items": [
                          {
                            "source": "actionType",
                            "type": "select2"
                          }
                        ]
                      },
                      {
                        "source": "otherActionType",
                        "placeholder": "Type of action (if Other)",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "width": "15%",
                    "source": "purposeOfSitePreparation",
                    "title": "Aim of site preparation",
                    "type": "textarea"
                  },
                  {
                    "width": "15%",
                    "source": "threatenedEcologicalCommunity",
                    "title": "Threatened ecological community (if applicable)",
                    "type": "text"
                  }
                ],
                "userAddedRows": true,
                "source": "sitePreparationDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpSitePreparation",
      "title": "Site preparation"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Skills and knowledge survey",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "title": "Skills and knowledge survey",
        "modelName": "RLP - Skills and knowledge survey",
        "dataModel": [
          {
            "dataType": "list",
            "name": "skillsAndKnowledgeSurveys",
            "columns": [
              {
                "dataType": "text",
                "description": "",
                "name": "baselineOrIndictorSurvey",
                "constraints": [
                  "Baseline",
                  "Indicator"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfSkillsAndKnowledgeSurveys",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "dateRange",
                "validate": "required,maxSize[100]",
                "description": "What time of year (eg. Dates by dd/mm/yyyyy, Months, Season/s)"
              },
              {
                "dataType": "number",
                "name": "numberOfParticipants",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "surveyTechnique",
                "validate": "required,maxSize[300]",
                "constraints": [
                  "Other"
                ],
                "description": "What/How will these survey/s capture information"
              },
              {
                "dataType": "text",
                "name": "surveyObjective",
                "validate": "required,maxSize[300]",
                "description": "How will the information obtained from the surveys be used"
              },
              {
                "dataType": "number",
                "name": "numberOfDaysAdministeringSurveys",
                "validate": "required,min[0]",
                "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)"
              }
            ]
          },
          {
            "name": "photographicEvidence",
            "dataType": "image"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "viewModel": [
          {
            "items": [
              {
                "source": "skillsAndKnowledgeSurveys",
                "columns": [
                  {
                    "title": "Baseline survey or indicator (follow-up) survey?",
                    "source": "baselineOrIndictorSurvey",
                    "type": "selectOne",
                    "width": "15%"
                  },
                  {
                    "title": "Number of skills and knowledge surveys conducted",
                    "source": "numberOfSkillsAndKnowledgeSurveys",
                    "type": "number",
                    "width": "10%"
                  },
                  {
                    "title": "Date range",
                    "type": "text",
                    "source": "dateRange",
                    "width": "10%"
                  },
                  {
                    "title": "Number of people completing survey",
                    "source": "numberOfParticipants",
                    "type": "number",
                    "width": "10%"
                  },
                  {
                    "title": "Survey technique",
                    "type": "textarea",
                    "source": "surveyTechnique",
                    "width": "22%",
                    "rows": 3
                  },
                  {
                    "title": "Survey objective",
                    "type": "textarea",
                    "source": "surveyObjective",
                    "width": "23%",
                    "rows": 3
                  },
                  {
                    "title": "Number of days spent on administering survey/s",
                    "source": "numberOfDaysAdministeringSurveys",
                    "type": "number",
                    "width": "10%"
                  }
                ],
                "userAddedRows": true,
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "type": "image",
                    "source": "photographicEvidence",
                    "preLabel": "Optionally attach photos"
                  }
                ]
              }
            ],
            "type": "section"
          },
          {
            "type": "row",
            "items": [
              {
                "preLabel": "Auditable Evidence",
                "source": "projectAssuranceDetails",
                "type": "textarea",
                "rows": 4,
                "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
              }
            ]
          }
        ]
      },
      "templateName": "rlpSkillsAndKnowledgeSurvey",
      "title": "Skills and knowledge survey"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Soil testing",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfSoilTests",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "dateRange",
                "description": "What time of year (eg. Dates by dd/mm/yyyyy, Months, Season/s)",
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "feature",
                "name": "sitesTested"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.areaHa(sitesTested)"
                },
                "dataType": "number",
                "name": "areaTestedHa",
                "validate": [
                  {
                    "rule": "min",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(sitesTested)*0.9"
                    }
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(sitesTested)*1.1"
                    }
                  }
                ]
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.lengthKm(sitesTested)"
                },
                "dataType": "number",
                "name": "lengthTestedKm",
                "validate": [
                  {
                    "rule": "min",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.lengthKm(sitesTested)*0.9"
                    }
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.lengthKm(sitesTested)*1.1"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "testingTechnique",
                "description": "What/How will these tests capture information",
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "text",
                "name": "testingObjective",
                "description": "How will the infromation obtained from the tests be used",
                "validate": "required,maxSize[300]"
              }
            ],
            "dataType": "list",
            "name": "soilTestingDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Soil testing",
        "title": "Soil testing",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "columns": [
                  {
                    "width": "15%",
                    "source": "initialOrFollowup",
                    "title": "Initial or follow-up activity?",
                    "type": "selectOne"
                  },
                  {
                    "width": "10%",
                    "source": "numberOfSoilTests",
                    "type": "number",
                    "title": "Number of soil tests conducted in targeted areas"
                  },
                  {
                    "width": "10%",
                    "source": "dateRange",
                    "title": "Date range",
                    "type": "text"
                  },
                  {
                    "width": "5%",
                    "source": "sitesTested",
                    "type": "feature",
                    "title": "Project site/s where soil tests were conducted"
                  },
                  {
                    "width": "10%",
                    "source": "areaTestedHa",
                    "type": "number",
                    "title": "Area (ha) where soil tests were conducted"
                  },
                  {
                    "width": "10%",
                    "source": "lengthTestedKm",
                    "type": "number",
                    "title": "Length (km) where soil tests were conducted"
                  },
                  {
                    "width": "18%",
                    "source": "testingTechnique",
                    "title": "Testing technique",
                    "type": "textarea"
                  },
                  {
                    "width": "22%",
                    "source": "testingObjective",
                    "title": "Testing objective",
                    "type": "textarea"
                  }
                ],
                "userAddedRows": true,
                "source": "soilTestingDetails",
                "type": "table"
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpSoilTesting",
      "title": "Soil testing"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Emergency Interventions",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "initialOrFollowup",
                "constraints": [
                  "Initial",
                  "Follow-up"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfInterventions",
                "validate": "required,min[0]"
              },
              {
                "dataType": "feature",
                "name": "siteOfIntervention"
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.areaHa(siteOfIntervention)"
                },
                "dataType": "number",
                "name": "areaOfInterventionHa",
                "validate": [
                  {
                    "rule": "min",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(siteOfIntervention)*0.9"
                    }
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.areaHa(siteOfIntervention)*1.1"
                    }
                  }
                ]
              },
              {
                "defaultValue": {
                  "type": "computed",
                  "expression": "$geom.lengthKm(siteOfIntervention)"
                },
                "dataType": "number",
                "name": "lengthOfInterventionKm",
                "validate": [
                  {
                    "rule": "min",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.lengthKm(siteOfIntervention)*0.9"
                    }
                  },
                  {
                    "rule": "max",
                    "param": {
                      "type": "computed",
                      "expression": "$geom.lengthKm(siteOfIntervention)*1.1"
                    }
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "purposeOfIntervention",
                "description": "This field may be used to list What type of intervention is required. A list of multiple interventions need to be separated with a ';'.",
                "validate": "required,maxSize[500]"
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "species",
                    "validate": "required"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfIndividualsInvolved",
                    "validate": "required,min[0]"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfDaysPerformingInterventions",
                    "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)",
                    "validate": "required,min[0]"
                  },
                  {
                    "dataType": "feature",
                    "name": "relocationSite",
                    "description": "If translocation is required please map site"
                  },
                  {
                    "defaultValue": {
                      "type": "computed",
                      "expression": "$geom.areaHa(relocationSite)"
                    },
                    "dataType": "number",
                    "name": "areaOfRelocationSiteHa",
                    "validate": [
                      {
                        "rule": "min",
                        "param": {
                          "type": "computed",
                          "expression": "$geom.areaHa(relocationSite)*0.9"
                        }
                      },
                      {
                        "rule": "max",
                        "param": {
                          "type": "computed",
                          "expression": "$geom.areaHa(relocationSite)*1.1"
                        }
                      }
                    ]
                  },
                  {
                    "dataType": "text",
                    "name": "comment",
                    "validate": "maxSize[300]"
                  }
                ],
                "dataType": "list",
                "name": "interventionSpecies"
              }
            ],
            "dataType": "list",
            "name": "interventionDetails"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Emergency Interventions",
        "title": "Undertaking emergency interventions to prevent extinctions",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "Add intervention site",
                "userAddedRows": true,
                "source": "interventionDetails",
                "type": "repeat",
                "items": [
                  {
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Initial or follow-up activity?",
                        "css": "span3",
                        "source": "initialOrFollowup",
                        "type": "selectOne"
                      },
                      {
                        "preLabel": "Number of interventions",
                        "css": "span2",
                        "source": "numberOfInterventions",
                        "type": "number"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Site/s where emergency interventions were undertaken",
                        "css": "span3",
                        "source": "siteOfIntervention",
                        "type": "feature"
                      },
                      {
                        "preLabel": "Area (ha) where emergency interventions were undertaken",
                        "css": "span2",
                        "source": "areaOfInterventionHa",
                        "type": "number"
                      },
                      {
                        "preLabel": "Type and goal or intervention",
                        "css": "span5",
                        "source": "purposeOfIntervention",
                        "type": "textarea",
                        "rows": 3
                      }
                    ]
                  },
                  {
                    "columns": [
                      {
                        "width": "30%",
                        "source": "species",
                        "title": "Targeted species",
                        "type": "speciesSelect"
                      },
                      {
                        "width": "10%",
                        "source": "numberOfIndividualsInvolved",
                        "type": "number",
                        "title": "Number of individuals involved"
                      },
                      {
                        "width": "10%",
                        "source": "numberOfDaysPerformingInterventions",
                        "type": "number",
                        "title": "Time (days) of intervention"
                      },
                      {
                        "width": "10%",
                        "source": "relocationSite",
                        "type": "feature",
                        "title": "Site/s where emergency interventions were relocated to"
                      },
                      {
                        "width": "10%",
                        "source": "areaOfRelocationSiteHa",
                        "type": "number",
                        "title": "Area (ha) where emergency interventions were relocated to"
                      },
                      {
                        "width": "30%",
                        "source": "comment",
                        "type": "textarea",
                        "title": "Comments",
                        "rows": 3
                      }
                    ],
                    "userAddedRows": true,
                    "source": "interventionSpecies",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpEmergencyInterventions",
      "title": "Undertaking emergency interventions to prevent extinctions"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Water quality survey",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "baselineOrIndicator",
                "description": "",
                "constraints": [
                  "Baseline",
                  "Indicator"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfSurveysConducted",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "dateRange",
                "description": "What time of year (eg. Dates by dd/mm/yyyyy, Months, Season/s)",
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "feature",
                "name": "sitesSurveyed"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesSurveyed)"
                },
                "dataType": "number",
                "name": "siteCalculatedAreaHa",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesSurveyed)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaSurveyedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaSurveyedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1)",
                    "type": "if"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1) or roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "if"
                  }
                ],
                "validate": "required"
              },
              {
                "columns": [
                  {
                    "dataType": "text",
                    "name": "waterBodyType",
                    "constraints": [
                      "Estuary",
                      "Freshwater stream",
                      "Freshwater lake",
                      "Saline stream",
                      "Saline lake",
                      "Other"
                    ],
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "otherWaterBodyType",
                    "behaviour": [
                      {
                        "condition": "waterBodyType == \"Other\"",
                        "type": "enable"
                      }
                    ],
                    "validate": "required,maxSize[300]"
                  },
                  {
                    "dataType": "number",
                    "name": "numberOfDaysConductingSurveys",
                    "description": "Number of days should be calculated as number of days by number of people (eg. 4.5 days by 3 people is 13.5 days)",
                    "validate": "required,min[0]"
                  },
                  {
                    "dataType": "text",
                    "name": "surveyTechnique",
                    "description": "What/How will these survey/s capture information",
                    "validate": "required,maxSize[300]"
                  },
                  {
                    "dataType": "text",
                    "name": "surveyObjective",
                    "description": "How will the information obtained from the surveys be used",
                    "validate": "required,maxSize[300]"
                  }
                ],
                "dataType": "list",
                "name": "waterBodyDetails"
              }
            ],
            "dataType": "list",
            "name": "waterQualitySurveySites"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Water quality survey",
        "title": "Water quality survey",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "New survey site",
                "userAddedRows": true,
                "source": "waterQualitySurveySites",
                "type": "repeat",
                "items": [
                  {
                    "css": "border-bottom",
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Baseline survey or indicator (follow-up) survey?",
                        "css": "span3",
                        "source": "baselineOrIndicator",
                        "type": "selectOne"
                      },
                      {
                        "preLabel": "Number of water quality surveys conducted",
                        "css": "span2",
                        "source": "numberOfSurveysConducted",
                        "type": "number"
                      },
                      {
                        "preLabel": "Date range",
                        "css": "span4",
                        "source": "dateRange",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "css": "span3 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Site/s where water quality surveys were conducted",
                                "source": "sitesSurveyed",
                                "type": "feature"
                              }
                            ]
                          },
                          {
                            "readonly": true,
                            "source": "siteCalculatedAreaHa",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Please attach mapping details",
                                "source": "extraMappingDetails",
                                "type": "document"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Actual area (ha) covered by water quality surveys",
                                "helpText": "Manually enter correct figure for this reporting period if different to mapped value.",
                                "source": "areaSurveyedHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for actual being different to mapped amount",
                                "source": "mappingNotAlignedReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "mappingNotAlignedComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Invoiced area (ha) covered by water quality surveys",
                                "helpText": "Enter the amount you will invoice for during this reporting period.",
                                "source": "areaInvoicedHa",
                                "type": "number",
                                "validate": "required",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for invoiced amount being different to actual amount",
                                "source": "invoicedNotActualReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "invoicedNotActualComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "columns": [
                      {
                        "width": "15%",
                        "source": "waterBodyType",
                        "type": "select2",
                        "title": "Type of water body"
                      },
                      {
                        "width": "20%",
                        "source": "otherWaterBodyType",
                        "type": "textarea",
                        "title": "Type of water body (if Other)"
                      },
                      {
                        "width": "5%",
                        "source": "numberOfDaysConductingSurveys",
                        "type": "number",
                        "title": "Number of days spent on administering survey/s"
                      },
                      {
                        "width": "30%",
                        "source": "surveyTechnique",
                        "title": "Survey technique",
                        "type": "textarea"
                      },
                      {
                        "width": "30%",
                        "source": "surveyObjective",
                        "title": "Survey objective",
                        "type": "textarea",
                        "rows": 3
                      }
                    ],
                    "userAddedRows": true,
                    "source": "waterBodyDetails",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpWaterQualitySurvey",
      "title": "Water quality survey"
    },
    {
      "class": "au.org.ala.ecodata.FormSection",
      "id": null,
      "collapsedByDefault": false,
      "modelName": null,
      "name": "RLP - Weed distribution survey",
      "optional": true,
      "optionalQuestionText": null,
      "template": {
        "dataModel": [
          {
            "columns": [
              {
                "dataType": "text",
                "name": "baselineOrIndicator",
                "description": "",
                "constraints": [
                  "Baseline",
                  "Indicator"
                ],
                "validate": "required"
              },
              {
                "dataType": "number",
                "name": "numberOfSurveysConducted",
                "validate": "required,min[0]"
              },
              {
                "dataType": "text",
                "name": "dateRange",
                "description": "What time of year (eg. Dates by dd/mm/yyyyy, Months, Season/s)",
                "validate": "required,maxSize[100]"
              },
              {
                "dataType": "feature",
                "name": "sitesSurveyed"
              },
              {
                "computed": {
                  "expression": "$geom.areaHa(sitesSurveyed)"
                },
                "dataType": "number",
                "name": "siteCalculatedAreaHa",
                "units": "ha"
              },
              {
                "defaultValue": {
                  "expression": "$geom.areaHa(sitesSurveyed)",
                  "type": "computed"
                },
                "dataType": "number",
                "name": "areaSurveyedHa",
                "units": "ha",
                "validate": "required,min[0]"
              },
              {
                "dataType": "number",
                "name": "areaInvoicedHa",
                "units": "ha",
                "validate": [
                  {
                    "rule": "required"
                  },
                  {
                    "rule": "min[0]"
                  },
                  {
                    "param": {
                      "expression": "areaSurveyedHa",
                      "type": "computed"
                    },
                    "rule": "max"
                  }
                ]
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedReason",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1)",
                    "type": "if"
                  }
                ],
                "constraints": [
                  "Mapped area simplifies more complex area/s where work was undertaken during this period",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "mappingNotAlignedComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == mappingNotAlignedReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualReason",
                "behaviour": [
                  {
                    "condition": "roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "visible"
                  }
                ],
                "constraints": [
                  "Work was undertaken over a greater area than will be invoiced for",
                  "Other"
                ],
                "validate": "required"
              },
              {
                "dataType": "text",
                "name": "invoicedNotActualComments",
                "behaviour": [
                  {
                    "condition": "\"Other\" == invoicedNotActualReason",
                    "type": "if"
                  }
                ],
                "validate": "required,maxSize[300]"
              },
              {
                "dataType": "document",
                "name": "extraMappingDetails",
                "description": "Please fill in the Mapped/Actual/Invoice fields before attaching a document here. If those fields match this field will be void. <br/>If any of these fields differ please attach your organisation's detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).",
                "behaviour": [
                  {
                    "condition": "not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1) or roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2)",
                    "type": "if"
                  }
                ],
                "validate": "required"
              },
              {
                "columns": [
                  {
                    "dataType": "species",
                    "name": "targetWeedSpecies",
                    "dwcAttribute": "scientificName",
                    "validate": "required"
                  },
                  {
                    "dataType": "text",
                    "name": "surveyTechnique",
                    "description": "What/How will these survey/s capture information",
                    "validate": "required,maxSize[300]"
                  },
                  {
                    "dataType": "text",
                    "name": "surveyObjective",
                    "description": "How will the information obtained from the surveys be used",
                    "validate": "required,maxSize[300]"
                  },
                  {
                    "dataType": "number",
                    "name": "estimatedCoverPercent",
                    "validate": "required,min[0],max[100]"
                  }
                ],
                "dataType": "list",
                "name": "weedDistributionSurveyDetails"
              }
            ],
            "dataType": "list",
            "name": "weedDistributionSurveySites"
          },
          {
            "dataType": "image",
            "name": "photographicEvidence"
          },
          {
            "dataType": "text",
            "name": "projectAssuranceDetails",
            "validate": "required",
            "description": "Refer to [insert URL for: RLP Project Services – evidence guide] for details of the types of acceptable evidence."
          }
        ],
        "modelName": "RLP - Weed distribution survey",
        "title": "Weed distribution survey",
        "viewModel": [
          {
            "type": "section",
            "items": [
              {
                "addRowText": "Add survey site",
                "userAddedRows": true,
                "source": "weedDistributionSurveySites",
                "type": "repeat",
                "items": [
                  {
                    "css": "border-bottom",
                    "type": "row",
                    "items": [
                      {
                        "preLabel": "Baseline survey or indicator (follow-up) survey?",
                        "css": "span3",
                        "source": "baselineOrIndicator",
                        "type": "selectOne"
                      },
                      {
                        "preLabel": "Number of weed distribution surveys conducted",
                        "css": "span2",
                        "source": "numberOfSurveysConducted",
                        "type": "number"
                      },
                      {
                        "preLabel": "Date range",
                        "css": "span4",
                        "source": "dateRange",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "type": "row",
                    "items": [
                      {
                        "css": "span3 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Site/s surveyed for weed distribution",
                                "source": "sitesSurveyed",
                                "type": "feature"
                              }
                            ]
                          },
                          {
                            "readonly": true,
                            "source": "siteCalculatedAreaHa",
                            "type": "number",
                            "displayOptions": {
                              "displayUnits": true
                            }
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Please attach mapping details",
                                "source": "extraMappingDetails",
                                "type": "document"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4 col-border-right",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Actual area (ha) surveyed for weed distribution",
                                "helpText": "Manually enter correct figure for this reporting period if different to mapped value.",
                                "source": "areaSurveyedHa",
                                "type": "number",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for actual being different to mapped amount",
                                "source": "mappingNotAlignedReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "mappingNotAlignedComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "css": "span4",
                        "type": "col",
                        "items": [
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Invoiced area (ha) surveyed for weed distribution",
                                "helpText": "Enter the amount you will invoice for during this reporting period.",
                                "source": "areaInvoicedHa",
                                "type": "number",
                                "validate": "required",
                                "displayOptions": {
                                  "displayUnits": true
                                }
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "preLabel": "Reason for invoiced amount being different to actual amount",
                                "source": "invoicedNotActualReason",
                                "type": "selectOne"
                              }
                            ]
                          },
                          {
                            "type": "row",
                            "items": [
                              {
                                "placeholder": "Please enter the reason/s the mapping didn't align with the invoiced amount",
                                "source": "invoicedNotActualComments",
                                "type": "textarea",
                                "rows": 5
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "columns": [
                      {
                        "width": "40%",
                        "source": "targetWeedSpecies",
                        "type": "speciesSelect",
                        "title": "Target weed species recorded"
                      },
                      {
                        "width": "25%",
                        "source": "surveyTechnique",
                        "title": "Survey technique",
                        "type": "textarea"
                      },
                      {
                        "width": "25%",
                        "source": "surveyObjective",
                        "title": "Survey objective",
                        "type": "textarea"
                      },
                      {
                        "width": "10%",
                        "source": "estimatedCoverPercent",
                        "title": "Estimated weed cover (%)",
                        "type": "number",
                        "rows": 3
                      }
                    ],
                    "userAddedRows": true,
                    "source": "weedDistributionSurveyDetails",
                    "type": "table"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Optionally attach photos",
                    "source": "photographicEvidence",
                    "type": "image"
                  }
                ]
              },
              {
                "type": "row",
                "items": [
                  {
                    "preLabel": "Auditable Evidence",
                    "source": "projectAssuranceDetails",
                    "type": "textarea",
                    "rows": 4,
                    "placeholder": "List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes."
                  }
                ]
              }
            ]
          }
        ]
      },
      "templateName": "rlpWeedDistributionSurvey",
      "title": "Weed distribution survey"
    }
  ],
  "status": "active",
  "supportsPhotoPoints": false,
  "supportsSites": true,
  "type": "Report"
}

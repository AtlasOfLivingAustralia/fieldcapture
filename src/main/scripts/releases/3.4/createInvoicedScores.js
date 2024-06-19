load('../../utils/audit.js');
let adminUserId = '1493'
let scores = [
  {
    scoreId: '9c3991c4-50d9-42cf-9b91-44a8f48690c8',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Collecting, or synthesising baseline data',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of baseline datasets synthesised and finalised',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Baseline data',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNumberBaselineDatasetsInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('64a23d9a4cad5a11560e684d'),
    scoreId: 'c3276929-b8a9-4985-a329-49b86f14018c',
    label: 'Number of baseline datasets synthesised and finalised',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    outputType: 'Collecting, or synthesising baseline data',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Baseline data',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNumberBaselineDatasets',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-07-03T03:16:42.449Z'),
    lastUpdated: ISODate('2023-07-03T03:16:42.449Z'),
    serviceId: 1,
    tags: [
      'Survey',
      'Baseline',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '9c3991c4-50d9-42cf-9b91-44a8f48690c8'
      }
    ]
  }
  ,
  {
    scoreId: 'd13389e9-ae24-4aab-9845-075719f070d6',
    entityTypes: [
      'RLP Output Report'
    ],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Communication materials',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of communication materials published',
    description: '',
    configuration: {
      childAggregations: [

        {
          filter: {
            filterValue: 'NHT - Communication materials',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalMaterialsPublishedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('607cde76a291e30890b60fd8'),
    configuration: {
      label: 'Number of communication materials published',
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: '69deaaf9-cdc2-439a-b684-4cffdc7f224e',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Communication materials',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.communicationMaterials.numberOfCommunicationMaterialsPublished',
              type: 'SUM'
            }
          ]
        },
        {
          filter: {
            filterValue: 'Communication materials',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.communicationMaterials.numberOfCommunicationMaterialsPublished',
              type: 'SUM'
            }
          ]
        },
        {
          filter: {
            filterValue: 'NHT - Communication materials',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalMaterialsPublished',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    outputType: 'Communication materials',
    entityTypes: [
      'RLP Output Report'
    ],
    label: 'Number of communication materials published',
    units: '',
    category: 'RLP and Bushfire Recovery',
    isOutputTarget: true,
    status: 'active',
    scoreId: '69deaaf9-cdc2-439a-b684-4cffdc7f224e',
    displayType: '',
    entity: 'Activity',
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'd13389e9-ae24-4aab-9845-075719f070d6'
      }
    ]
  }
  ,
  {
    scoreId: '6f53876e-bf3a-46b4-940d-9e470dc38406',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Community/stakeholder engagement',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of engagement events',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            filterValue: 'NHT - Community engagement',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNumberEngagementHeldInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6551af32b186d711a8f38861'),
    entityTypes: [],
    tags: [],
    displayType: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: '06514e13-3aa4-4f3e-805a-16c7b67d3524',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Community engagement',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.events.numberOfEvents',
              type: 'SUM'
            }
          ]
        },
        {
          filter: {
            filterValue: 'Community engagement',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.events.numberOfEvents',
              type: 'SUM'
            }
          ]
        },
        {
          filter: {
            filterValue: 'NHT - Community engagement',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNumberEngagementHeld',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    entity: 'Activity',
    outputType: 'Community/stakeholder engagement',
    scoreId: 'f9c85612-602e-465c-89e0-e155b34b1f31',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    status: 'active',
    label: 'Number of engagement events',
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '6f53876e-bf3a-46b4-940d-9e470dc38406'
      }
    ]
  }
  ,
  {
    scoreId: '2d188a0e-91b6-4f5a-9d25-37a06ab01b15',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Controlling access',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of structures installed that control access',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Controlling access',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaStructuresInstalledInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('64c84be67e61d8934b42b819'),
    scoreId: 'a9d98baa-b2ab-4428-82cf-d96185e63aa6',
    label: 'Area (ha) of structures installed that control access',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    outputType: 'Controlling access',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Controlling access',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaStructuresInstalled',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-08-01T00:03:50.613Z'),
    lastUpdated: ISODate('2023-08-01T00:03:50.613Z'),
    serviceId: 4,
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '2d188a0e-91b6-4f5a-9d25-37a06ab01b15'
      }
    ]
  }
  ,
  {
    scoreId: 'eb933c99-39fd-4f2c-9d53-d3f80cc474da',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Controlling access',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) of structures installed that control access',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Controlling access',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthStructuresInstalledInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('64c84be67e61d8934b42b81a'),
    scoreId: 'c4ea5ce3-4a70-4df8-aff7-ffa929e7df61',
    label: 'Length (km) of structures installed that control access',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    outputType: 'Controlling access',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Controlling access',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthStructuresInstalled',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-08-01T00:03:50.615Z'),
    lastUpdated: ISODate('2023-08-01T00:03:50.615Z'),
    serviceId: 4,
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'eb933c99-39fd-4f2c-9d53-d3f80cc474da'
      }
    ]
  }
  ,
  {
    scoreId: '91db2553-d83c-4241-ae5f-cd9ab7788ba0',
    entityTypes: [
      'RLP Output Report'
    ],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Controlling access',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of structures installed that control access',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            filterValue: 'NHT - Controlling access',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalStructuresInstalledInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('655179985ee873c3c6bf3f32'),
    configuration: {
      label: 'Number of structures installed',
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: '821a8812-32ab-4317-b4ae-6cf46c279981',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Controlling access',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.accessControlDetails.numberInstalled',
              type: 'SUM'
            }
          ]
        },
        {
          filter: {
            filterValue: 'Controlling access',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.accessControlDetails.numberInstalled',
              type: 'SUM'
            }
          ]
        },
        {
          filter: {
            filterValue: 'NHT - Controlling access',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalStructuresInstalled',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    outputType: 'Controlling access',
    entityTypes: [
      'RLP Output Report'
    ],
    label: 'Number of structures installed that control access',
    units: '',
    category: 'RLP and Bushfire Recovery',
    isOutputTarget: true,
    status: 'active',
    scoreId: 'dcf917dc-eaf7-49e2-ae7b-abf65edeedae',
    serviceId: 4,
    tags: [],
    displayType: '',
    entity: 'Activity',
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '91db2553-d83c-4241-ae5f-cd9ab7788ba0'
      }
    ]
  }
  ,
  {
    scoreId: '9083be29-ef2d-4133-944a-4ee315852e0a',
    entityTypes: [
      'RLP Output Report'
    ],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Controlling pest animals',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) treated for pest animals - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            filterValue: 'NHT - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaPestAnimalsTreatedInitialInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('607cde76a291e30890b60fc8'),
    configuration: {
      label: 'Area (ha) treated for pest animals - initial',
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: '55d76c03-c89d-40fe-867b-93f7a48ff9c1',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Initial',
                property: 'data.areasControlled.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.areasControlled.areaControlledHa',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Initial',
                property: 'data.areasControlled.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.areasControlled.areaControlledHa',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'NHT - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaPestAnimalsTreatedInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    outputType: 'Controlling pest animals',
    entityTypes: [
      'RLP Output Report'
    ],
    label: 'Area (ha) treated for pest animals - initial',
    units: '',
    category: 'RLP and Bushfire Recovery',
    isOutputTarget: true,
    status: 'active',
    scoreId: '55d76c03-c89d-40fe-867b-93f7a48ff9c1',
    displayType: '',
    entity: 'Activity',
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '9083be29-ef2d-4133-944a-4ee315852e0a'
      }
    ]
  }
  ,
  {
    scoreId: '4bc5631b-b999-4488-852e-b7863e4383d2',
    entityTypes: [
      'RLP Output Report'
    ],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Controlling pest animals',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) treated for pest animals - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            filterValue: 'NHT - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaPestAnimalsTreatedFollowUpInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('607cde76a291e30890b60fc9'),
    category: 'RLP and Bushfire Recovery',
    configuration: {
      label: 'Area (ha) treated for pest animals - follow-up',
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: '3cbf653f-f74c-4066-81d2-e3f78268185c',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Follow-up',
                property: 'data.areasControlled.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.areasControlled.areaInvoicedHa',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Follow-up',
                property: 'data.areasControlled.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.areasControlled.areaInvoicedHa',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'NHT - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaPestAnimalsTreatedFollowUp',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    displayType: '',
    entity: 'Activity',
    entityTypes: [
      'RLP Output Report'
    ],
    isOutputTarget: true,
    label: 'Area (ha) treated for pest animals - follow-up',
    outputType: 'Controlling pest animals',
    scoreId: '3cbf653f-f74c-4066-81d2-e3f78268185c',
    status: 'active',
    units: '',
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '4bc5631b-b999-4488-852e-b7863e4383d2'
      }
    ]
  }
  ,
  {
    scoreId: '4c9399be-1319-4ddc-87f5-a8912b138537',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Controlling pest animals',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) treated for pest animals - follow-up',
    description: '',
    configuration: {
      childAggregations: [

        {
          filter: {
            filterValue: 'NHT - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthPestAnimalsTreatedFollowUpInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('607cde76a291e30890b60fc3'),
    category: 'RLP and Bushfire Recovery',
    configuration: {
      label: 'Length (km) treated for pest animals - follow-up',
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: '3855d565-3b77-497b-90af-addb271aa598',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Follow-up',
                property: 'data.areasControlled.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.areasControlled.lengthInvoicedKm',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Follow-up',
                property: 'data.areasControlled.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.areasControlled.lengthControlledKm',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'NHT - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthPestAnimalsTreatedFollowUp',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    isOutputTarget: true,
    label: 'Length (km) treated for pest animals - follow-up',
    outputType: 'Controlling pest animals',
    scoreId: '3855d565-3b77-497b-90af-addb271aa598',
    status: 'active',
    units: '',
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '4c9399be-1319-4ddc-87f5-a8912b138537'
      }
    ]
  }
  ,
  {
    scoreId: '9b38bd34-afd6-4164-ba89-a14998cc594f',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Controlling pest animals',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) treated for pest animals - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            filterValue: 'NHT - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthPestAnimalsTreatedInitialInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('607cde76a291e30890b60fc1'),
    category: 'RLP and Bushfire Recovery',
    configuration: {
      label: 'Length (km) treated for pest animals - initial',
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: '5dbfb32a-5933-4d8a-9937-41f350fb5f75',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Initial',
                property: 'data.areasControlled.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.areasControlled.lengthInvoicedKm',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Initial',
                property: 'data.areasControlled.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.areasControlled.lengthInvoicedKm',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'NHT - Pest animal management',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthPestAnimalsTreatedInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    isOutputTarget: true,
    label: 'Length (km) treated for pest animals - initial',
    outputType: 'Controlling pest animals',
    scoreId: '5dbfb32a-5933-4d8a-9937-41f350fb5f75',
    status: 'active',
    units: 'km',
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '9b38bd34-afd6-4164-ba89-a14998cc594f'
      }
    ]
  }
  ,
  {
    scoreId: '374ebb0f-0f93-410a-a08a-93a053b5a66e',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Erosion management',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of erosion control - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Erosion Management',
            type: 'filter'
          },
          childAggregations: [

            {
              property: 'data.totalAreaErosionControlInvoicedInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490f44038e4aa85a93f20a7'),
    scoreId: '22771c0d-8403-433b-b468-e36dc16a1d21',
    label: 'Area (ha) of erosion control - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Erosion Management',
            type: 'filter'
          },
          childAggregations: [

            {
              property: 'data.totalAreaErosionControlInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-20T00:35:12.724Z'),
    lastUpdated: ISODate('2023-06-20T00:35:12.724Z'),
    serviceId: 7,
    outputType: 'Erosion management',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '374ebb0f-0f93-410a-a08a-93a053b5a66e'
      }
    ]
  }
  ,
  {
    scoreId: 'ecd6e037-252f-48e8-bc74-59d8f6c11752',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Erosion management',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of erosion control - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Erosion Management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaErosionControlInvoicedFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490f44038e4aa85a93f20a8'),
    scoreId: '675cc878-eb80-435f-a841-d89b657fb2e3',
    label: 'Area (ha) of erosion control - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Erosion Management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaErosionControlFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-20T00:35:12.725Z'),
    lastUpdated: ISODate('2023-06-20T00:35:12.725Z'),
    serviceId: 7,
    outputType: 'Erosion management',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'ecd6e037-252f-48e8-bc74-59d8f6c11752'
      }
    ]
  }
  ,
  {
    scoreId: '6abd5814-4a40-40fc-9693-b1071b6c329c',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Erosion management',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) of stream/coastline treated for erosion - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Erosion Management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthStreamCoastlineInitialInvoice',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd286'),
    scoreId: 'dd9f8fd4-b6c7-4f09-bbbf-5d721afc7677',
    label: 'Length (km) of stream/coastline treated for erosion - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Erosion Management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthStreamCoastlineInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.521Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.521Z'),
    serviceId: 7,
    outputType: 'Erosion management',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '6abd5814-4a40-40fc-9693-b1071b6c329c'
      }
    ]
  }
  ,
  {
    scoreId: '68105a3e-fd17-4384-9474-2f54b77da6da',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Erosion management',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) of stream/coastline treated for erosion - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Erosion Management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthStreamCoastlineInvoicedFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd287'),
    scoreId: '6f3cb6ab-5c6a-49be-9af9-9226fa751725',
    label: 'Length (km) of stream/coastline treated for erosion - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Erosion Management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthStreamCoastlineFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.522Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.522Z'),
    serviceId: 7,
    outputType: 'Erosion management',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '68105a3e-fd17-4384-9474-2f54b77da6da'
      }
    ]
  }
  ,
  {
    scoreId: '849c15f0-8b79-4444-b7e4-7afc36aaf4a0',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Establishing and maintaining agreements',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) covered by conservation agreements established',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Establishing Agreements',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaConservationAgreementsInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd288'),
    scoreId: 'e0b4cc3e-e94a-4c97-81dc-a4cb868c2cc3',
    label: 'Area (ha) covered by conservation agreements established',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Establishing Agreements',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaConservationAgreements',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.523Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.523Z'),
    serviceId: 8,
    outputType: 'Establishing and maintaining agreements',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '849c15f0-8b79-4444-b7e4-7afc36aaf4a0'
      }
    ]
  }
  ,
  {
    scoreId: '1dbf676b-6db2-4951-95ea-97b63fd5b21e',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Establishing and maintaining agreements',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) where implementation activities conducted (implementation/stewardship)',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Establishing Agreements',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaActivitiesConductedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd289'),
    scoreId: 'b0bcfc54-76fa-4659-accf-276c18b50c31',
    label: 'Area (ha) where implementation activities conducted (implementation/stewardship)',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Establishing Agreements',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaActivitiesConducted',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.523Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.523Z'),
    serviceId: 8,
    outputType: 'Establishing and maintaining agreements',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '1dbf676b-6db2-4951-95ea-97b63fd5b21e'
      }
    ]
  }
  ,
  {
    scoreId: '0c20d32c-991c-4e26-bb5b-f3a45a7116b3',
    entityTypes: undefined,
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Establishing and maintaining feral-free enclosures',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of pest animal-free enclosures - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Maintaining feral free enclosures',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNoPestFreeSurveyEstablishedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd28a'),
    scoreId: '9416c9f4-48ca-4bd1-8822-cd45ebb56c58',
    label: 'Number of pest animal-free enclosures - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Maintaining feral free enclosures',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNoPestFreeSurveyEstablished',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.524Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.524Z'),
    serviceId: 9,
    outputType: 'Establishing and maintaining feral-free enclosures',
    tags: null,
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '0c20d32c-991c-4e26-bb5b-f3a45a7116b3'
      }
    ]
  }
  ,
  {
    scoreId: '3f3d64b3-301b-4538-b598-5822eec89845',
    entityTypes: undefined,
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Establishing and maintaining feral-free enclosures',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of pest animal-free enclosures - maintained',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Maintaining feral free enclosures',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNoPestFreeSurveyMaintainedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd28b'),
    scoreId: '2409e649-2ee2-47fd-9e76-ef2ffa07a5e7',
    label: 'Number of pest animal-free enclosures - maintained',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Maintaining feral free enclosures',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNoPestFreeSurveyMaintained',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.525Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.525Z'),
    serviceId: 9,
    outputType: 'Establishing and maintaining feral-free enclosures',
    tags: null,
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '3f3d64b3-301b-4538-b598-5822eec89845'
      }
    ]
  }
  ,
  {
    scoreId: '55d1b45a-46d6-46c3-bb56-ab15e53bc28a',
    entityTypes: undefined,
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Establishing and maintaining feral-free enclosures',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of days maintaining pest animal-free enclosures',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Maintaining feral free enclosures',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNoDaysMaintainingPestFreeInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd28c'),
    scoreId: 'd58f8dba-109d-4179-b130-a888cd3d303c',
    label: 'Number of days maintaining pest animal-free enclosures',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Maintaining feral free enclosures',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNoDaysMaintainingPestFree',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.526Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.526Z'),
    serviceId: 9,
    outputType: 'Establishing and maintaining feral-free enclosures',
    tags: null,
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '55d1b45a-46d6-46c3-bb56-ab15e53bc28a'
      }
    ]
  }
  ,
  {
    scoreId: 'c737b891-eee8-4142-8a98-26ab0e5f9703',
    entityTypes: undefined,
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Establishing and maintaining feral-free enclosures',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of pest animal-free enclosure',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Maintaining feral free enclosures',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaPestFreeSurveyInitialInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd28d'),
    scoreId: '01686d38-9165-4497-9648-627ef81945a7',
    label: 'Area (ha) of pest animal-free enclosure',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Maintaining feral free enclosures',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaPestFreeSurveyInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.526Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.526Z'),
    serviceId: 9,
    outputType: 'Establishing and maintaining feral-free enclosures',
    tags: null,
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'c737b891-eee8-4142-8a98-26ab0e5f9703'
      }
    ]
  }
  ,
  {
    scoreId: '8cc4cd16-b7ed-4a24-bfc5-ed580bfbb4b9',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Establishing and maintaining breeding programs',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of captive breeding and release, translocation, or re-introduction programs established',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Establishing ex-situ breeding programs',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalCaptiveBreedingEstablishedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd280'),
    scoreId: '0e2f8d61-b7b4-4d2d-b07c-4fc20bbe326a',
    label: 'Number of captive breeding and release, translocation, or re-introduction programs established',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Establishing ex-situ breeding programs',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalCaptiveBreedingEstablished',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.513Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.513Z'),
    serviceId: 10,
    outputType: 'Establishing and maintaining breeding programs',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '8cc4cd16-b7ed-4a24-bfc5-ed580bfbb4b9'
      }
    ]
  }
  ,
  {
    scoreId: 'cb37ef77-b2f5-4520-a687-29a9d854bc54',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Establishing and maintaining breeding programs',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of captive breeding and release, translocation, or re-introduction programs maintained',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Establishing ex-situ breeding programs',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalCaptiveBreedingMaintainedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd281'),
    scoreId: 'bb506258-e907-43d3-99bd-0fe0400f654e',
    label: 'Number of captive breeding and release, translocation, or re-introduction programs maintained',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Establishing ex-situ breeding programs',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalCaptiveBreedingMaintained',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.516Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.516Z'),
    serviceId: 10,
    outputType: 'Establishing and maintaining breeding programs',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'cb37ef77-b2f5-4520-a687-29a9d854bc54'
      }
    ]
  }
  ,
  {
    scoreId: '6c51587c-6b32-4373-98d8-aced7ca96553',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Farm management survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of farm management surveys conducted - baseline',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Farm Management Survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaselineInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd28e'),
    scoreId: '3c83e639-9c19-4b31-a86f-9d2d5e78123b',
    label: 'Number of farm management surveys conducted - baseline',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Farm Management Survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaseline',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.527Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.527Z'),
    serviceId: 12,
    outputType: 'Farm management survey',
    tags: [
      'Survey',
      'Baseline'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '6c51587c-6b32-4373-98d8-aced7ca96553'
      }
    ]
  }
  ,
  {
    scoreId: '2610d4e3-ccb1-4084-945c-4398bca2c4d5',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Farm management survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of farm management surveys conducted - indicator',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Farm Management Survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicatorInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd28f'),
    scoreId: 'e901be5e-8336-432e-b164-f278abd7430b',
    label: 'Number of farm management surveys conducted - indicator',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Farm Management Survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicator',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.528Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.528Z'),
    serviceId: 12,
    outputType: 'Farm management survey',
    tags: [
      'Survey',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '2610d4e3-ccb1-4084-945c-4398bca2c4d5'
      }
    ]
  }
  ,
  {
    scoreId: 'fab2d1ad-cb98-4da1-86b9-7a3b9cdbff59',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Fauna survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of fauna surveys conducted - baseline',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Fauna survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaselineInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd290'),
    scoreId: '5557288b-190e-4a3f-a60b-4bdff6ca8fe8',
    label: 'Number of fauna surveys conducted - baseline',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Fauna survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaseline',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.528Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.528Z'),
    serviceId: 13,
    outputType: 'Fauna survey',
    tags: [
      'Survey',
      'Baseline'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'fab2d1ad-cb98-4da1-86b9-7a3b9cdbff59'
      }
    ]
  }
  ,
  {
    scoreId: '4380f303-e7e0-43ee-acec-ec3fb93469b4',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Fauna survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of fauna surveys conducted - indicator',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Fauna survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicatorInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd291'),
    scoreId: '902df7a8-92f6-420d-9544-47d4b8cf31ca',
    label: 'Number of fauna surveys conducted - indicator',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Fauna survey',
            type: 'filter'
          },

          childAggregations: [
            {
              property: 'data.totalSurveyIndicator',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.529Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.529Z'),
    serviceId: 13,
    outputType: 'Fauna survey',
    tags: [
      'Survey',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '4380f303-e7e0-43ee-acec-ec3fb93469b4'
      }
    ]
  }
  ,
  {
    scoreId: 'f09e1565-9b9f-4f5d-aeef-c74443f6858f',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Fire management actions',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) treated by fire management action/s - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Fire management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaTreatedFireMgmtInitialInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd29b'),
    scoreId: '9deb3edf-50c7-4b04-a1fb-d1451eadf641',
    label: 'Area (ha) treated by fire management action/s - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Fire management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaTreatedFireMgmtInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.537Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.537Z'),
    serviceId: 14,
    outputType: 'Fire management actions',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'f09e1565-9b9f-4f5d-aeef-c74443f6858f'
      }
    ]
  }
  ,
  {
    scoreId: '83a6a963-41a0-447b-9348-0c78ab18c0d3',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Fire management actions',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) treated by fire management action/s - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Fire management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaTreatedFireMgmtFollowupInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd29c'),
    scoreId: '360c8b86-360c-4ca3-b1aa-626be56f2b11',
    label: 'Area (ha) treated by fire management action/s - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Fire management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaTreatedFireMgmtFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.538Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.538Z'),
    serviceId: 14,
    outputType: 'Fire management actions',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '83a6a963-41a0-447b-9348-0c78ab18c0d3'
      }
    ]
  }
  ,
  {
    scoreId: '126a2274-b28f-4ba5-bd21-94b9769951ca',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Flora survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of flora surveys conducted - baseline',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Flora survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaselineInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd292'),
    scoreId: '7c30bc26-829e-4080-8059-27af9285113b',
    label: 'Number of flora surveys conducted - baseline',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Flora survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaseline',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.530Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.530Z'),
    serviceId: 15,
    outputType: 'Flora survey',
    tags: [
      'Survey',
      'Baseline'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '126a2274-b28f-4ba5-bd21-94b9769951ca'
      }
    ]
  }
  ,
  {
    scoreId: '3e44115b-9807-4b32-9918-8120e7002225',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Flora survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of flora surveys conducted - indicator',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Flora survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicatorInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd293'),
    scoreId: '158a5544-78e3-4d00-9f1b-62a85a938268',
    label: 'Number of flora surveys conducted - indicator',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Flora survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicator',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.531Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.531Z'),
    serviceId: 15,
    outputType: 'Flora survey',
    tags: [
      'Survey',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '3e44115b-9807-4b32-9918-8120e7002225'
      }
    ]
  }
  ,
  {
    scoreId: 'f03133ee-3131-442b-a1ce-6c8482587366',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Habitat augmentation',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of augmentation - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat augmentation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaAugmentationInitialInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd294'),
    scoreId: '4aa201ec-2066-40e1-a457-99daa569c8e2',
    label: 'Area (ha) of augmentation - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat augmentation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaAugmentationInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.532Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.532Z'),
    serviceId: 16,
    outputType: 'Habitat augmentation',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'f03133ee-3131-442b-a1ce-6c8482587366'
      }
    ]
  }
  ,
  {
    scoreId: 'c6765e3e-1793-4728-a4c1-0f8a6ea0562d',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Habitat augmentation',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of augmentation - maintained',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat augmentation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaAugmentationMaintainedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd295'),
    scoreId: 'f46f096a-a274-426b-adad-702e7cf8fab7',
    label: 'Area (ha) of augmentation - maintained',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat augmentation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaAugmentationMaintained',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.532Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.532Z'),
    serviceId: 16,
    outputType: 'Habitat augmentation',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'c6765e3e-1793-4728-a4c1-0f8a6ea0562d'
      }
    ]
  }
  ,
  {
    scoreId: 'c44db1d2-b04a-4347-9b64-41642288c169',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Habitat augmentation',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of locations where structures installed - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat augmentation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalStructuresInstalledInitialInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd296'),
    scoreId: '3b1403f3-139a-4206-b325-62ebfe05ddc4',
    label: 'Number of locations where structures installed - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat augmentation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalStructuresInstalledInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.533Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.533Z'),
    serviceId: 16,
    outputType: 'Habitat augmentation',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'c44db1d2-b04a-4347-9b64-41642288c169'
      }
    ]
  }
  ,
  {
    scoreId: 'eb0277b3-f12a-4dc9-8632-bebe8889eff3',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Habitat augmentation',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of locations where structures installed - maintained',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat augmentation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalStructuresInstalledMaintainedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd297'),
    scoreId: '7cb13c22-3dcd-43e7-808d-e0e26f5c090d',
    label: 'Number of locations where structures installed - maintained',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat augmentation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalStructuresInstalledMaintained',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.534Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.534Z'),
    serviceId: 16,
    outputType: 'Habitat augmentation',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'eb0277b3-f12a-4dc9-8632-bebe8889eff3'
      }
    ]
  }
  ,
  {
    scoreId: '43c1eec9-7d53-4e59-9989-a9d1a0fab180',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Improving hydrological regimes',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of treatments implemented to improve site eco-hydrology - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Improving hydrological regimes',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalHydroTreatmentsInitialInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd29d'),
    scoreId: '5c6db4c1-7fde-452e-8735-e52842fe6217',
    label: 'Number of treatments implemented to improve site eco-hydrology - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Improving hydrological regimes',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalHydroTreatmentsInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.539Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.539Z'),
    serviceId: 18,
    outputType: 'Improving hydrological regimes',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '43c1eec9-7d53-4e59-9989-a9d1a0fab180'
      }
    ]
  }
  ,
  {
    scoreId: '392af967-fc01-42ce-a613-ab9879bf33a9',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Improving hydrological regimes',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of treatments implemented to improve site eco-hydrology - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Improving hydrological regimes',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalHydroTreatmentsFollowupInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd29e'),
    scoreId: '41cb1e2c-59bc-4639-8bf7-fe0f528e006e',
    label: 'Number of treatments implemented to improve site eco-hydrology - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Improving hydrological regimes',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalHydroTreatmentsFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.540Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.540Z'),
    serviceId: 18,
    outputType: 'Improving hydrological regimes',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '392af967-fc01-42ce-a613-ab9879bf33a9'
      }
    ]
  }
  ,
  {
    scoreId: 'cdec139d-af71-4332-9670-73e569707c67',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Habitat Condition Assessment Survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of habitat condition assessment surveys conducted - baseline',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat condition assessment',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaselineInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd298'),
    scoreId: '4f71e00a-2d80-488d-9ce4-947e60589149',
    label: 'Number of habitat condition assessment surveys conducted - baseline',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat condition assessment',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaseline',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.535Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.535Z'),
    serviceId: 42,
    outputType: 'Habitat Condition Assessment Survey',
    tags: [
      'Survey',
      'Baseline'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'cdec139d-af71-4332-9670-73e569707c67'
      }
    ]
  }
  ,
  {
    scoreId: 'dd1e9f51-ecf1-48d6-b0b1-fc0fa54dd76d',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Habitat Condition Assessment Survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of habitat condition assessment surveys conducted - indicator',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat condition assessment',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicatorInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd299'),
    scoreId: '69a2ffba-41e9-406e-8ea4-5bdeee92cbde',
    label: 'Number of habitat condition assessment surveys conducted - indicator',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Habitat condition assessment',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicator',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.535Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.535Z'),
    serviceId: 42,
    outputType: 'Habitat Condition Assessment Survey',
    tags: [
      'Survey',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'dd1e9f51-ecf1-48d6-b0b1-fc0fa54dd76d'
      }
    ]
  }
  ,
  {
    scoreId: '30130054-c05b-41d6-b315-8f81349d6081',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Identifying the location of potential sites',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of potential sites assessed',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Identifying sites',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalPotentialSitesInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd29a'),
    scoreId: '26ea592f-ee39-4e6e-b6af-5b53fb1a5675',
    label: 'Number of potential sites assessed',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Identifying sites',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalPotentialSites',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.536Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.536Z'),
    serviceId: 17,
    outputType: 'Identifying the location of potential sites',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '30130054-c05b-41d6-b315-8f81349d6081'
      }
    ]
  }
  ,
  {
    scoreId: '565fc402-fddd-47a4-8092-bc80ca0a2a28',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Improving land management practices',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) covered by practice change - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Improving land management practices',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaPracticeChangeInitialInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd29f'),
    scoreId: '3587a984-68f9-4db3-b5af-49f265d853e0',
    label: 'Area (ha) covered by practice change - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Improving land management practices',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaPracticeChangeInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.540Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.540Z'),
    serviceId: 19,
    outputType: 'Improving land management practices',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '565fc402-fddd-47a4-8092-bc80ca0a2a28'
      }
    ]
  }
  ,
  {
    scoreId: '9fe05275-aa39-4c17-bd08-21a6d054e13a',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Improving land management practices',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) covered by practice change - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Improving land management practices',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaPracticeChangeInvoicedFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2a0'),
    scoreId: '9d2d01be-b517-4be2-a225-8b1c887e016e',
    label: 'Area (ha) covered by practice change - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Improving land management practices',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaPracticeChangeFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.541Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.541Z'),
    serviceId: 19,
    outputType: 'Improving land management practices',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '9fe05275-aa39-4c17-bd08-21a6d054e13a'
      }
    ]
  }
  ,
  {
    scoreId: '4d7bd9aa-245f-4bc5-b67b-92717ffbe5cd',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Managing disease',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) for disease treatment/prevention - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Disease management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaDiseaseManagementInitialInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2a1'),
    scoreId: 'd0516817-5acb-46bd-9871-2696c245bad0',
    label: 'Area (ha) for disease treatment/prevention - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Disease management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaDiseaseManagementInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.542Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.542Z'),
    serviceId: 20,
    outputType: 'Managing disease',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '4d7bd9aa-245f-4bc5-b67b-92717ffbe5cd'
      }
    ]
  }
  ,
  {
    scoreId: '562c421a-e321-4304-a3c0-17fea1dcfe1c',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Managing disease',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) for disease treatment/prevention - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Disease management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaDiseaseManagementInvoicedFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2a2'),
    scoreId: '7fed132d-6a38-448c-b519-381ab9e1e027',
    label: 'Area (ha) for disease treatment/prevention - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Disease management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaDiseaseManagementFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.543Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.543Z'),
    serviceId: 20,
    outputType: 'Managing disease',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '562c421a-e321-4304-a3c0-17fea1dcfe1c'
      }
    ]
  }
  ,
  {
    scoreId: 'bbac023f-2496-4354-a07c-37211358d5fc',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Managing disease',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) for disease treatment/prevention - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Disease management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthDiseaseManagementInvoicedInitial',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2a3'),
    scoreId: 'e08dda14-360c-4b66-b8c5-eb0269c5aa44',
    label: 'Length (km) for disease treatment/prevention - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Disease management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthDiseaseManagementInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.543Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.543Z'),
    serviceId: 20,
    outputType: 'Managing disease',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'bbac023f-2496-4354-a07c-37211358d5fc'
      }
    ]
  }
  ,
  {
    scoreId: '5bf39f8a-dc05-449f-977e-26fd4db54811',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Managing disease',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) for disease treatment/prevention - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Disease management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthDiseaseManagementInvoicedFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2a4'),
    scoreId: 'f3671aa7-773f-447d-9649-ba7f11dbe97a',
    label: 'Length (km) for disease treatment/prevention - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Disease management',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthDiseaseManagementFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.544Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.544Z'),
    serviceId: 20,
    outputType: 'Managing disease',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '5bf39f8a-dc05-449f-977e-26fd4db54811'
      }
    ]
  }
  ,
  {
    scoreId: '1bd3736c-70a7-4489-a58b-6bbb92a9634a',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Pest animal survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of pest animal surveys conducted - baseline',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Pest animal survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaselineInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2a5'),
    scoreId: '5ab2b539-a5b4-40da-a556-a2c18066345b',
    label: 'Number of pest animal surveys conducted - baseline',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Pest animal survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaseline',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.545Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.545Z'),
    serviceId: 23,
    outputType: 'Pest animal survey',
    tags: [
      'Survey',
      'Baseline'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '1bd3736c-70a7-4489-a58b-6bbb92a9634a'
      }
    ]
  }
  ,
  {
    scoreId: '7dfe196b-1a76-4ad2-a9c2-6177209a6744',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Pest animal survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of pest animal surveys conducted - indicator',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Pest animal survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicatorInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2a6'),
    scoreId: '36410625-05f3-42d3-b04f-a3b268498ee1',
    label: 'Number of pest animal surveys conducted - indicator',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Pest animal survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicator',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.546Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.546Z'),
    serviceId: 23,
    outputType: 'Pest animal survey',
    tags: [
      'Survey',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '7dfe196b-1a76-4ad2-a9c2-6177209a6744'
      }
    ]
  }
  ,
  {
    scoreId: '962485dd-00bb-4bd2-a4ce-3471cf15f189',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Plant survival survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of seed germination/plant survival surveys completed - indicator',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Plant survival survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicatorInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2b0'),
    scoreId: '0162246b-13fd-40c9-ae26-fb767eee76f8',
    label: 'Number of seed germination/plant survival surveys completed - indicator',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Plant survival survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicator',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.553Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.553Z'),
    serviceId: 24,
    outputType: 'Plant survival survey',
    tags: [
      'Survey',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '962485dd-00bb-4bd2-a4ce-3471cf15f189'
      }
    ]
  }
  ,
  {
    scoreId: '1793dbab-f595-4bdc-ae36-75918bdd6015',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Remediating riparian and aquatic areas',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of remediation of riparian/aquatic areas - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Remediating riparian and aquatic areas',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaRemediationInitialInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2a8'),
    scoreId: 'b9e710e4-7dd3-4acc-ac2c-c69f4bcb9787',
    label: 'Area (ha) of remediation of riparian/aquatic areas - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Remediating riparian and aquatic areas',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaRemediationInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.547Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.547Z'),
    serviceId: 26,
    outputType: 'Remediating riparian and aquatic areas',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '1793dbab-f595-4bdc-ae36-75918bdd6015'
      }
    ]
  }
  ,
  {
    scoreId: '2442f765-8d17-4258-ad02-5f7590d4c0e9',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Remediating riparian and aquatic areas',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of remediation of riparian/aquatic areas - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Remediating riparian and aquatic areas',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaRemediationFollowupInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2a9'),
    scoreId: '00934509-f102-4d39-a043-7547a8ab9ac8',
    label: 'Area (ha) of remediation of riparian/aquatic areas - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Remediating riparian and aquatic areas',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaRemediationFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.548Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.548Z'),
    serviceId: 26,
    outputType: 'Remediating riparian and aquatic areas',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '2442f765-8d17-4258-ad02-5f7590d4c0e9'
      }
    ]
  }
  ,
  {
    scoreId: 'ea6b21da-a9c4-4ae4-9fe3-63e1ecb8d1b1',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Remediating riparian and aquatic areas',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) of remediation of riparian/aquatic areas - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Remediating riparian and aquatic areas',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthRemediationInitialInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2aa'),
    scoreId: '1021bec7-3836-4b33-90b4-76701efd4fe3',
    label: 'Length (km) of remediation of riparian/aquatic areas - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Remediating riparian and aquatic areas',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthRemediationInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.548Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.548Z'),
    serviceId: 26,
    outputType: 'Remediating riparian and aquatic areas',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'ea6b21da-a9c4-4ae4-9fe3-63e1ecb8d1b1'
      }
    ]
  }
  ,
  {
    scoreId: '0fe1e877-e829-4132-8f43-89bec60bc19b',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Remediating riparian and aquatic areas',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) of remediation of riparian/aquatic areas - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Remediating riparian and aquatic areas',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthRemediationFollowupInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2ab'),
    scoreId: '4dad393e-cbf7-43dd-87bb-62ea8f8afcdd',
    label: 'Length (km) of remediation of riparian/aquatic areas - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Remediating riparian and aquatic areas',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthRemediationFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.549Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.549Z'),
    serviceId: 26,
    outputType: 'Remediating riparian and aquatic areas',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '0fe1e877-e829-4132-8f43-89bec60bc19b'
      }
    ]
  }
  ,
  {
    scoreId: '760c9924-c926-47d0-8c35-5f233603b84a',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Remediating riparian and aquatic areas',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of structures installed to promote aquatic health',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Remediating riparian and aquatic areas',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalStructuresInstalledInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2a7'),
    scoreId: '7186117e-ac17-4ed9-8c9c-8ee1c3bf473b',
    label: 'Number of structures installed to promote aquatic health',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Remediating riparian and aquatic areas',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalStructuresInstalled',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.546Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.546Z'),
    serviceId: 26,
    outputType: 'Remediating riparian and aquatic areas',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '760c9924-c926-47d0-8c35-5f233603b84a'
      }
    ]
  }
  ,
  {
    scoreId: '6505fd89-011b-4e83-a1d0-99c48303a831',
    entityTypes: [
      'RLP Output Report'
    ],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Removing weeds',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) treated for weeds - initial',
    description: '',
    configuration: {
      label: 'Area (ha) treated for weeds - initial',
      childAggregations: [
        {
          filter: {
            filterValue: 'NHT - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaWeedsTreatedInitialInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('607cde76a291e30890b60fca'),
    category: 'RLP and Bushfire Recovery',
    configuration: {
      label: 'Area (ha) treated for weeds - initial',
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'a516c78d-740f-463b-a1ce-5b02b8c82dd3',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Initial',
                property: 'data.weedTreatmentSites.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.weedTreatmentSites.areaTreatedHa',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Initial',
                property: 'data.weedTreatmentSites.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.weedTreatmentSites.areaTreatedHa',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'NHT - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaWeedsTreatedInitial',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    displayType: '',
    entity: 'Activity',
    entityTypes: [
      'RLP Output Report'
    ],
    isOutputTarget: true,
    label: 'Area (ha) treated for weeds - initial',
    outputType: 'Removing weeds',
    scoreId: 'a516c78d-740f-463b-a1ce-5b02b8c82dd3',
    status: 'active',
    units: '',
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '6505fd89-011b-4e83-a1d0-99c48303a831'
      }
    ]
  }
  ,
  {
    scoreId: '299fc599-ac5b-46a6-a90d-165eb953c315',
    entityTypes: [
      'RLP Output Report'
    ],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Removing weeds',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) treated for weeds - follow-up',
    description: '',
    configuration: {
      label: 'Area (ha) treated for weeds - follow-up',
      childAggregations: [

        {
          filter: {
            filterValue: 'NHT - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaWeedsTreatedInvoicedFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('607cde76a291e30890b60fcb'),
    category: 'RLP and Bushfire Recovery',
    configuration: {
      label: 'Area (ha) treated for weeds - follow-up',
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: '4cbcb2b5-45cd-42dc-96bf-a9a181a4865b',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Follow-up',
                property: 'data.weedTreatmentSites.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.weedTreatmentSites.areaTreatedHa',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Follow-up',
                property: 'data.weedTreatmentSites.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.weedTreatmentSites.areaTreatedHa',
                  type: 'SUM'
                }
              ]
            }
          ]
        },

        {
          filter: {
            filterValue: 'NHT - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaWeedsTreatedFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    displayType: '',
    entity: 'Activity',
    entityTypes: [
      'RLP Output Report'
    ],
    isOutputTarget: true,
    label: 'Area (ha) treated for weeds - follow-up',
    outputType: 'Removing weeds',
    scoreId: '4cbcb2b5-45cd-42dc-96bf-a9a181a4865b',
    status: 'active',
    units: '',
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '299fc599-ac5b-46a6-a90d-165eb953c315'
      }
    ]
  }
  ,
  {
    scoreId: 'b8107209-5155-4257-a241-16add7f30df9',
    entityTypes: [
      'RLP Output Report'
    ],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Removing weeds',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) treated for weeds - initial',
    description: '',
    configuration: {
      label: 'Length (km) treated for weeds - initial',
      childAggregations: [
        {
          filter: {
            filterValue: 'NHT - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthWeedsTreatedInvoicedInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('607cde76a291e30890b60fcd'),
    category: 'RLP and Bushfire Recovery',
    configuration: {
      label: 'Length (km) treated for weeds - initial',
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'fbc45154-1d60-4f5e-a484-fdff514f9d51',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Initial',
                property: 'data.weedTreatmentSites.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.weedTreatmentSites.lengthTreatedKm',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Initial',
                property: 'data.weedTreatmentSites.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.weedTreatmentSites.lengthTreatedKm',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'NHT - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthWeedsTreatedInitial',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    displayType: '',
    entity: 'Activity',
    entityTypes: [
      'RLP Output Report'
    ],
    isOutputTarget: true,
    label: 'Length (km) treated for weeds - initial',
    outputType: 'Removing weeds',
    scoreId: 'fbc45154-1d60-4f5e-a484-fdff514f9d51',
    status: 'active',
    units: '',
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'b8107209-5155-4257-a241-16add7f30df9'
      }
    ]
  }
  ,
  {
    scoreId: 'fd3944de-e050-41ee-9a95-0f95c9c4bd29',
    entityTypes: [
      'RLP Output Report'
    ],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Removing weeds',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) treated for weeds - follow-up',
    description: '',
    configuration: {
      label: 'Length (km) treated for weeds - follow-up',
      childAggregations: [
        {
          filter: {
            filterValue: 'NHT - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthWeedsTreatedInvoicedFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('607cde76a291e30890b60fce'),
    category: 'RLP and Bushfire Recovery',
    configuration: {
      label: 'Length (km) treated for weeds - follow-up',
      childAggregations: [
        {
          filter: {
            filterValue: 'RLP - Output Report Adjustment',
            type: 'filter',
            property: 'name'
          },
          childAggregations: [
            {
              filter: {
                filterValue: '85191c99-f56d-46e6-9311-a58c1f37965d',
                type: 'filter',
                property: 'data.adjustments.scoreId'
              },
              childAggregations: [
                {
                  property: 'data.adjustments.adjustment',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'RLP - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Follow-up',
                property: 'data.weedTreatmentSites.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.weedTreatmentSites.lengthTreatedKm',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              filter: {
                filterValue: 'Follow-up',
                property: 'data.weedTreatmentSites.initialOrFollowup',
                type: 'filter'
              },
              childAggregations: [
                {
                  property: 'data.weedTreatmentSites.lengthTreatedKm',
                  type: 'SUM'
                }
              ]
            }
          ]
        },
        {
          filter: {
            filterValue: 'NHT - Weed treatment',
            property: 'name',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthWeedsTreatedFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    displayType: '',
    entity: 'Activity',
    entityTypes: [
      'RLP Output Report'
    ],
    isOutputTarget: true,
    label: 'Length (km) treated for weeds - follow-up',
    outputType: 'Removing weeds',
    scoreId: '85191c99-f56d-46e6-9311-a58c1f37965d',
    status: 'active',
    units: '',
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'fd3944de-e050-41ee-9a95-0f95c9c4bd29'
      }
    ]
  }
  ,
  {
    scoreId: 'decdd229-fb46-473e-8dc9-f9683349ba44',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Revegetating habitat',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of habitat revegetated - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Revegetating habitat',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaWeedsTreatedInitialInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2ac'),
    scoreId: '3cfa82aa-0b38-49c0-be37-0fa61b5b6e3c',
    label: 'Area (ha) of habitat revegetated - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Revegetating habitat',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaWeedsTreatedInitial',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.550Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.550Z'),
    serviceId: 28,
    outputType: 'Revegetating habitat',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'decdd229-fb46-473e-8dc9-f9683349ba44'
      }
    ]
  }
  ,
  {
    scoreId: 'c86f230a-11cd-4830-8baa-3a33ade7b80d',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Revegetating habitat',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of habitat revegetated - maintained',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Revegetating habitat',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaWeedsTreatedInvoicedFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2ad'),
    scoreId: '91e90861-3ba7-4257-a765-6cab24c6f58a',
    label: 'Area (ha) of habitat revegetated - maintained',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Revegetating habitat',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaWeedsTreatedFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.551Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.551Z'),
    serviceId: 28,
    outputType: 'Revegetating habitat',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'c86f230a-11cd-4830-8baa-3a33ade7b80d'
      }
    ]
  }
  ,
  {
    scoreId: 'b8206136-8022-4886-8855-578744370edc',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Skills and knowledge survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of skills and knowledge surveys conducted - baseline',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Skills and knowledge survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaselineInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2ba'),
    scoreId: '96be68cf-783d-452a-b8fd-3832163f95db',
    label: 'Number of skills and knowledge surveys conducted - baseline',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Skills and knowledge survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaseline',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.562Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.562Z'),
    serviceId: 29,
    outputType: 'Skills and knowledge survey',
    tags: [
      'Survey',
      'Baseline'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'b8206136-8022-4886-8855-578744370edc'
      }
    ]
  }
  ,
  {
    scoreId: '96c0590e-f50e-4a69-b557-d84e50f45c98',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Skills and knowledge survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of skills and knowledge surveys conducted - indicator',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Skills and knowledge survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicatorInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2bb'),
    scoreId: 'e70c70fd-4f31-41dc-a4b4-07f79efc3055',
    label: 'Number of skills and knowledge surveys conducted - indicator',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Skills and knowledge survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicator',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.563Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.563Z'),
    serviceId: 29,
    outputType: 'Skills and knowledge survey',
    tags: [
      'Survey',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '96c0590e-f50e-4a69-b557-d84e50f45c98'
      }
    ]
  }
  ,
  {
    scoreId: '35a4da26-b1c1-4210-b67d-7b7fa96d482e',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Soil testing',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of soil tests conducted - baseline',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Soil testing',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaselineInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2b8'),
    scoreId: '598bd978-0907-4cad-a7a6-ec5a8a8bbdc4',
    label: 'Number of soil tests conducted - baseline',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Soil testing',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaseline',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.558Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.558Z'),
    serviceId: 30,
    outputType: 'Soil testing',
    tags: [
      'Survey',
      'Baseline'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '35a4da26-b1c1-4210-b67d-7b7fa96d482e'
      }
    ]
  }
  ,
  {
    scoreId: '31b25a0c-0ce7-47dd-add6-4ce1119b7f46',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Soil testing',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of soil tests conducted - indicator',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Soil testing',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicatorInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2b9'),
    scoreId: 'd29bd931-1dd1-47c4-b456-c175099ff1df',
    label: 'Number of soil tests conducted - indicator',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Soil testing',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicator',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.559Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.559Z'),
    serviceId: 30,
    outputType: 'Soil testing',
    tags: [
      'Survey',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '31b25a0c-0ce7-47dd-add6-4ce1119b7f46'
      }
    ]
  }
  ,
  {
    scoreId: 'dcf33b3c-6a5d-43dd-b29c-631023ccca3c',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Undertaking emergency interventions to prevent extinctions',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of interventions - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Emergency Interventions',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNumberInterventionsInitialInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2b6'),
    scoreId: '6db1ebd7-92c5-49f2-98b7-2faa700fd752',
    label: 'Number of interventions - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Emergency Interventions',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNumberInterventionsInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.557Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.557Z'),
    serviceId: 31,
    outputType: 'Undertaking emergency interventions to prevent extinctions',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'dcf33b3c-6a5d-43dd-b29c-631023ccca3c'
      }
    ]
  }
  ,
  {
    scoreId: '3ae0b103-b781-4733-b7d5-84c8676f1318',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Undertaking emergency interventions to prevent extinctions',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of interventions - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Emergency Interventions',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNumberInterventionsFollowUpInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2b7'),
    scoreId: '524d93b4-5cd1-4d0d-b1f8-d393028220ad',
    label: 'Number of interventions - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Emergency Interventions',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNumberInterventionsFollowUp',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.558Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.558Z'),
    serviceId: 31,
    outputType: 'Undertaking emergency interventions to prevent extinctions',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '3ae0b103-b781-4733-b7d5-84c8676f1318'
      }
    ]
  }
  ,
  {
    scoreId: 'ab95dfdb-1a87-47c2-9a3e-8b7df238c36e',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Water quality survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of water quality surveys conducted - baseline',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Water quality survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaselineInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2b2'),
    scoreId: '8040931a-2e6c-41be-9e92-f1035093b2ac',
    label: 'Number of water quality surveys conducted - baseline',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Water quality survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaseline',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.554Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.554Z'),
    serviceId: 32,
    outputType: 'Water quality survey',
    tags: [
      'Survey',
      'Baseline'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'ab95dfdb-1a87-47c2-9a3e-8b7df238c36e'
      }
    ]
  }
  ,
  {
    scoreId: '6e8e4b7c-753c-4295-a022-112115fa4c7f',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Water quality survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of water quality surveys conducted - indicator',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Water quality survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicatorInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2b3'),
    scoreId: '5d652e6e-b719-45bf-8ae6-e9f293c24a92',
    label: 'Number of water quality surveys conducted - indicator',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Water quality survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicator',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.555Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.555Z'),
    serviceId: 32,
    outputType: 'Water quality survey',
    tags: [
      'Survey',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '6e8e4b7c-753c-4295-a022-112115fa4c7f'
      }
    ]
  }
  ,
  {
    scoreId: 'e1010c61-e2d3-4481-8f83-58a5cf792825',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Weed distribution survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of weed distribution surveys conducted - baseline',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Weed distribution survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaselineInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2b4'),
    scoreId: 'f74182bd-7a53-4157-aeb9-eda281bb0234',
    label: 'Number of weed distribution surveys conducted - baseline',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Weed distribution survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyBaseline',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.555Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.555Z'),
    serviceId: 33,
    outputType: 'Weed distribution survey',
    tags: [
      'Survey',
      'Baseline'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'e1010c61-e2d3-4481-8f83-58a5cf792825'
      }
    ]
  }
  ,
  {
    scoreId: 'bb012a44-a2e3-4d0e-b669-e39f123282a0',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Weed distribution survey',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of weed distribution surveys conducted - indicator',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Weed distribution survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicatorInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2b5'),
    scoreId: 'e7b7bb1e-66c2-4140-90f9-9534aa46ffa3',
    label: 'Number of weed distribution surveys conducted - indicator',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Weed distribution survey',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalSurveyIndicator',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.556Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.556Z'),
    serviceId: 33,
    outputType: 'Weed distribution survey',
    tags: [
      'Survey',
      'Indicator'
    ],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'bb012a44-a2e3-4d0e-b669-e39f123282a0'
      }
    ]
  }
  ,
  {
    scoreId: '0e714549-1a7a-461e-9c59-d41bfe500774',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Debris removal',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of debris removal - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Debris removal',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaDebrisRemovedInitialInvoiced',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd282'),
    scoreId: '15615a70-ee60-46b8-b5e9-b33d4d88de6b',
    label: 'Area (ha) of debris removal - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Debris removal',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaDebrisRemovedInitial',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.517Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.517Z'),
    serviceId: 34,
    outputType: 'Debris removal',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '0e714549-1a7a-461e-9c59-d41bfe500774'
      }
    ]
  }
  ,
  {
    scoreId: '4ac68683-82e6-4cbd-8b63-0d0eecb1e0aa',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Debris removal',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of debris removal - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Debris removal',
            type: 'filter'
          },

          childAggregations: [
            {
              property: 'data.totalAreaDebrisRemovedInvoicedFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd283'),
    scoreId: 'd8dc153b-da23-4f7b-947a-89bc98338d6d',
    label: 'Area (ha) of debris removal - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Debris removal',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaDebrisRemovedFollowup',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.519Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.519Z'),
    serviceId: 34,
    outputType: 'Debris removal',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '4ac68683-82e6-4cbd-8b63-0d0eecb1e0aa'
      }
    ]
  }
  ,
  {
    scoreId: 'f43d7737-89fc-4b4e-840c-0604087b41c2',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Debris removal',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) of debris removal - initial',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Debris removal',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthDebrisRemovedInvoicedInitial',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd284'),
    scoreId: '5f762c6d-4f42-4458-9855-03c6896959c1',
    label: 'Length (km) of debris removal - initial',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Debris removal',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthDebrisRemovedInitial',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.520Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.520Z'),
    serviceId: 34,
    outputType: 'Debris removal',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'f43d7737-89fc-4b4e-840c-0604087b41c2'
      }
    ]
  }
  ,
  {
    scoreId: '31f042f0-f1e2-4505-828f-3590c975573f',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Debris removal',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) of debris removal - follow-up',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Debris removal',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthDebrisRemovedInvoicedFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd285'),
    scoreId: '5885f105-fc7d-43fd-8c26-c72938a95b76',
    label: 'Length (km) of debris removal - follow-up',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Debris removal',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthDebrisRemovedFollowup',
              type: 'SUM'
            }
          ]

        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.520Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.520Z'),
    serviceId: 34,
    outputType: 'Debris removal',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '31f042f0-f1e2-4505-828f-3590c975573f'
      }
    ]
  }
  ,
  {
    scoreId: 'd3a6292f-0c44-4f1f-b569-281d339d5775',
    entityTypes: [
      'RLP Output Report'
    ],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Site preparation',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced area (ha) of site preparation',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Site preparation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaSitePreparationInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('607cde76a291e30890b61007'),
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Site preparation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAreaSitePreparation',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    outputType: 'Site preparation',
    entityTypes: [
      'RLP Output Report'
    ],
    label: 'Area (ha) of site preparation',
    units: '',
    category: 'RLP and Bushfire Recovery',
    isOutputTarget: true,
    status: 'active',
    scoreId: 'dea1ff8b-f4eb-4987-8073-500bbbf97fcd',
    serviceId: 35,
    tags: [],
    displayType: '',
    entity: 'Activity',
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'd3a6292f-0c44-4f1f-b569-281d339d5775'
      }
    ]
  }
  ,
  {
    scoreId: '7fb32d8c-19f1-4524-852a-765782509527',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Site preparation',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced length (km) of site preparation',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Site preparation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthSitePreparationInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2b1'),
    scoreId: 'fba17df1-d5cb-4643-987f-0626055b3c78',
    label: 'Length (km) of site preparation',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Site preparation',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalLengthSitePreparation',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.553Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.553Z'),
    serviceId: 35,
    outputType: 'Site preparation',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '7fb32d8c-19f1-4524-852a-765782509527'
      }
    ]
  }
  ,
  {
    scoreId: '9448d597-9023-4c4e-9bec-08f445bd1b5e',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Seed collection',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced amount (grams)/number of seeds/cuttings collected',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Seed Collection',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAmountSeedsCuttingsCollectedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490f44038e4aa85a93f20a9'),
    scoreId: '3ec07754-4a7a-46fb-a76d-553921781716',
    label: 'Amount (grams)/number of seeds/cuttings collected',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Seed Collection',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAmountSeedsCuttingsCollected',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-20T00:35:12.750Z'),
    lastUpdated: ISODate('2023-06-20T00:35:12.750Z'),
    serviceId: 36,
    outputType: 'Seed collection',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '9448d597-9023-4c4e-9bec-08f445bd1b5e'
      }
    ]
  }
  ,
  {
    scoreId: '81fde70c-77c9-4b32-acc7-e3aae7e20b4f',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Seed collection',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of days propagating',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Seed Collection',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalDaysPropagatingInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6490cd72fd6c7ab6c10dd2af'),
    scoreId: 'fbc2dab8-7454-40f9-94f6-6bf258fcefff',
    label: 'Number of days propagating',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Seed Collection',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalDaysPropagating',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-06-19T21:49:38.552Z'),
    lastUpdated: ISODate('2023-06-19T21:49:38.552Z'),
    serviceId: 36,
    outputType: 'Seed collection',
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '81fde70c-77c9-4b32-acc7-e3aae7e20b4f'
      }
    ]
  }
  ,
  {
    scoreId: '5cca7b07-e5ed-452c-afa6-e7da98082546',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Seed collection',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of plants propagated',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Seed Collection',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalPlantsPropagatedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('609c9639071f113bc569a5f2'),
    entityTypes: [],
    displayType: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Seed Collection',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalPlantsPropagated',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    entity: 'Activity',
    outputType: 'Seed collection',
    scoreId: '7186e284-0cb2-418e-a8cc-4343eb618140',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    status: 'active',
    label: 'Number of plants propagated',
    description: 'Number of plants propagated',
    serviceId: 36,
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '5cca7b07-e5ed-452c-afa6-e7da98082546'
      }
    ]
  }
  ,
  {
    scoreId: '483949d3-ccec-49d5-a8d2-8b67fd8a14e4',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Seed Collection',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of days collecting seeds/cuttings',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Seed Collection',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalDaysSeedsCuttingsCollectedInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('6578ddc19423ac4acae776a4'),
    scoreId: 'c7d0963e-2847-4f5f-8a1c-e149dfa4c9d1',
    label: 'Number of days collecting seeds/cuttings',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    outputType: 'Seed Collection',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Seed Collection',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalDaysSeedsCuttingsCollected',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-12-12T22:25:05.240Z'),
    lastUpdated: ISODate('2023-12-12T22:25:05.240Z'),
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    tags: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '483949d3-ccec-49d5-a8d2-8b67fd8a14e4'
      }
    ]
  }
  ,
  {
    scoreId: '22d1e57b-491d-42e1-ac82-3fe00485af47',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Sustainable Agriculture Facilitators',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of SAF FTEs invoiced for',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Sustainable agriculture facilitators',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAnnualFtesInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('64d9a9c767a2ede181c9eacf'),
    scoreId: '3d06b150-bb86-47dc-8ad8-c33a51c3e3b3',
    label: 'Number of SAF FTEs invoiced for',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    outputType: 'Sustainable Agriculture Facilitators',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Sustainable agriculture facilitators',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalAnnualFtes',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-08-14T04:12:55.415Z'),
    lastUpdated: ISODate('2023-08-14T04:12:55.415Z'),
    serviceId: 43,
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '22d1e57b-491d-42e1-ac82-3fe00485af47'
      }
    ]
  }
  ,
  {
    scoreId: '10dd51b7-0ebf-49f4-a069-08254ebb2692',
    entityTypes: [],
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'First Nations Australians Cultural Practices',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of days conducting cultural practices',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - First nations australians cultural practices',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNoDaysCulturalPracticesInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('64d9a9c767a2ede181c9ead0'),
    scoreId: 'b8304577-afd8-45e0-8ef4-b71ae10998f5',
    label: 'Number of days conducting cultural practices',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    outputType: 'First Nations Australians Cultural Practices',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - First nations australians cultural practices',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.totalNoDaysCulturalPractices',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2023-08-14T04:12:55.416Z'),
    lastUpdated: ISODate('2023-08-14T04:12:55.416Z'),
    serviceId: 44,
    tags: [],
    displayType: '',
    entity: 'Activity',
    entityTypes: [],
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: '10dd51b7-0ebf-49f4-a069-08254ebb2692'
      }
    ]
  }
  ,
  {
    scoreId: 'a02172d9-3d9a-407c-aacb-f14b9b96bbf6',
    entityTypes: undefined,
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Research and Development',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of days conducting research and development',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Research and development',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.noDaysConductingResearchAndDevelopmentInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('664c25abb61a6108c799ea73'),
    scoreId: '9ed0ab84-6d04-4926-ae36-c75a8763e09b',
    label: 'Number of days conducting research and development',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    outputType: 'Research and Development',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Research and development',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.noDaysConductingResearchAndDevelopment',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2024-05-21T04:40:11.160Z'),
    lastUpdated: ISODate('2024-05-21T04:40:11.160Z'),
    relatedScores: [
      {
        description: 'Invoiced by',
        scoreId: 'a02172d9-3d9a-407c-aacb-f14b9b96bbf6'
      }
    ]
  }];


for (let i=0; i<scores.length; i+=2) {
  let invoiced = scores[i];
  let delivered = scores[i+1];

  let savedInvoiced = db.score.findOne({scoreId: invoiced.scoreId});
  if (!savedInvoiced) {
    audit(invoiced, invoiced.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Insert');
    db.score.insertOne(invoiced);
  }
  else {
    savedInvoiced.configuration = invoiced.configuration;
    db.score.replaceOne({scoreId: invoiced.scoreId}, savedInvoiced);
    audit(savedInvoiced, savedInvoiced.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Update');

  }

  //Audit the old score as there is a good chance it wasn't audited on insert unless updated manually
  audit(delivered, delivered.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Update');
  // Can't use scoreId/_id for delivered as the ids can be different between environments.
  db.score.updateOne({label: delivered.label}, {$set:{relatedScores:delivered.relatedScores, configuration:delivered.configuration}});

  // Audit the updated score.
  delivered = db.score.findOne({scoreId:delivered.scoreId});
  audit(delivered, delivered.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Update');
}
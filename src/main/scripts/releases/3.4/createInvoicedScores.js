let scores = [
{
  scoreId: '0390f66e-0d5d-4a04-9bb5-9fd4b3aff000',
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
  scoreId: 'c33bf92e-d1b4-4dff-b219-994d07fe1e04',
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
  scoreId: 'e8517313-86f7-44ef-96d7-855b148264a3',
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
    label: 'Number of field days',
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
  scoreId: '2ac9aebe-ace9-4e9f-8cac-dbe3705c910d',
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
  scoreId: '4e92ae90-675f-4817-81a0-1bb992e80366',
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
  scoreId: '8a751abc-e145-48d5-b9ae-688537bb7c5a',
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
  scoreId: '2d70b381-9b1d-4361-88cd-220676dab9e7',
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
            filter: {
              filterValue: 'Initial',
              property: 'data.areasControlled.initialOrFollowup',
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
    ]
  }
}
,
{
  scoreId: 'fded8f07-32f1-4ac9-ba30-bf56bf8ad2dd',
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
            filter: {
              filterValue: 'Follow-up',
              property: 'data.areasControlled.initialOrFollowup',
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
    ]
  }
}
,
{
  scoreId: 'd787328f-807e-4f02-adf5-068fae85cbfe',
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
            filter: {
              filterValue: 'Follow-up',
              property: 'data.areasControlled.initialOrFollowup',
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
    ]
  }
}
,
{
  scoreId: 'bac654ab-d16f-4219-aaca-1084d8e8ae74',
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
            filter: {
              filterValue: 'Initial',
              property: 'data.areasControlled.initialOrFollowup',
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
    ]
  }
}
,
{
  scoreId: '93a0211e-9ee4-4f5d-8d18-70cc3d73ab1a',
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
            filter: {
              property: 'data.erosionManagementAreasControlled.initialOrFollowup',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: '47c60d4d-76b3-4033-b0bb-b5609f2f05de',
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
            filter: {
              property: 'data.erosionManagementAreasControlled.initialOrFollowup',
              filterValue: 'Follow-up',
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
    ]
  }
}
,
{
  scoreId: 'e752e82a-62b3-4301-a561-6fe097d8c77d',
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
            filter: {
              property: 'data.erosionManagementAreasControlled.initialOrFollowup',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: '44df8c91-6806-4691-a2dc-bc7f1a1dcb45',
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
            filter: {
              property: 'data.erosionManagementAreasControlled.initialOrFollowup',
              filterValue: 'Follow-up',
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
    ]
  }
}
,
{
  scoreId: 'ad7282b0-e7d2-4b53-8cee-926475dad128',
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
            filter: {
              property: 'data.conservationAgreementsControlled.establishedOrImplementation',
              filterValue: 'Established',
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
    ]
  }
}
,
{
  scoreId: '119ef081-7109-4a9e-9f02-4d482f6dc034',
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
            filter: {
              property: 'data.conservationAgreementsControlled.establishedOrImplementation',
              filterValue: 'Implementation',
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
    ]
  }
}
,
{
  scoreId: '14ddc151-ce69-44d5-b908-4572cdeffccf',
  entityTypes: [],
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
            filter: {
              property: 'data.enclosureDetails.newOrMaintained',
              filterValue: 'Newly established',
              type: 'filter'
            },
            childAggregations: [
              {
                property: 'data.enclosureDetails.numberOfEnclosures',
                type: 'SUM'
              }
            ]
          }
        ]
      }
    ]
  }
}
,
{
  scoreId: 'da1e630d-9c6f-44f7-9f9e-a132f97d198e',
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
            filter: {
              property: 'data.enclosureDetails.newOrMaintained',
              filterValue: 'Maintained',
              type: 'filter'
            },
            childAggregations: [
              {
                property: 'data.enclosureDetails.numberOfEnclosures',
                type: 'SUM'
              }
            ]
          }
        ]
      }
    ]
  }
}
,
{
  scoreId: 'e0aad8e3-aa65-4a5b-af9d-1a01ae4e7951',
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
            property: 'data.enclosureDetails.daysSpentOnMaintenanceOfEnclosures',
            type: 'SUM'
          }
        ]
      }
    ]
  }
}
,
{
  scoreId: '4af600c4-c332-401c-bdc6-3b16e0c920ba',
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
  scoreId: '2bef448b-d0f2-4f0f-94bd-d1ba712b7fb3',
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
  scoreId: '4ba4ed1d-038a-4724-a887-8f8ec77b8566',
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
  scoreId: '6f6f6d97-09ee-4fb3-a70b-f7556acf0ce6',
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
  scoreId: 'd9ac261d-6b53-482c-b44b-6bf57a4c98dd',
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
  scoreId: '52f99d64-75af-425b-9b71-8ca0edba4dff',
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
  scoreId: 'a2287259-dea4-4760-86a9-eb0d8448293e',
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
  scoreId: 'ee0e2da1-c4e1-4969-8572-9356d3f10b92',
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
  scoreId: '15b7e9c5-f476-4920-a0be-458427b001c7',
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
  scoreId: 'd732c143-928b-48b5-8c58-19e9f233e9b9',
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
  scoreId: 'c9bd837b-383a-42ac-8eb8-8126fb2b747e',
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
  scoreId: '699ce9e5-6a1b-414c-af36-33706da2d30f',
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
  scoreId: '1d2c0878-d0a8-4f08-a8b0-2c23926ddb8d',
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
  scoreId: 'ab383864-cc41-4e89-b796-3213f84ae4eb',
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
  scoreId: 'd8112459-6a43-421a-9053-1e490d7724aa',
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
  scoreId: '7b800c62-ff8d-4754-bbe4-da0e6bed2a1a',
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
  scoreId: 'e889736b-f264-4879-a6e0-65bc61ef43cd',
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
  scoreId: '238823ad-fcd9-4730-94a0-259fcff3978f',
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
            filter: {
              property: 'data.habitatConditionSurveys.baselineOrIndicatorSurvey',
              filterValue: 'Baseline',
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
    ]
  }
}
,
{
  scoreId: '14a7a124-23ac-499b-bdb4-e17729d052e4',
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
            filter: {
              property: 'data.habitatConditionSurveys.baselineOrIndicatorSurvey',
              filterValue: 'Indicator',
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
    ]
  }
}
,
{
  scoreId: '767ba34f-4d87-4afb-b12c-27b1e5c060fe',
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
  scoreId: '60616f98-4dfc-4384-a66a-fa253ca54a29',
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
            filter: {
              property: 'data.landManagementAreasControlled.initialOrFollowup',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: '515d96a6-66c6-416b-b293-4176678c1b21',
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
            filter: {
              property: 'data.landManagementAreasControlled.initialOrFollowup',
              filterValue: 'Follow-up',
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
    ]
  }
}
,
{
  scoreId: 'ce7c6673-73d1-4439-ab1d-48dde80da9a7',
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
            filter: {
              property: 'data.diseaseManagementAreasControlled.initialOrFollowup',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: '59f8f947-70c0-4996-86c9-aae446fcce4c',
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
            filter: {
              property: 'data.diseaseManagementAreasControlled.initialOrFollowup',
              filterValue: 'Follow-up',
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
    ]
  }
}
,
{
  scoreId: 'fbc7d0af-67cb-4022-8dd9-3822db636eac',
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
            filter: {
              property: 'data.diseaseManagementAreasControlled.initialOrFollowup',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: 'fa85d85f-f2bf-487f-a7ec-8c8979a0c37f',
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
            filter: {
              property: 'data.diseaseManagementAreasControlled.initialOrFollowup',
              filterValue: 'Follow-up',
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
    ]
  }
}
,
{
  scoreId: '447cb7a7-cce2-4386-a3b5-4e674bc6cecc',
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
            filter: {
              property: 'data.pestAnimalSurveys.baselineOrIndicatorSurvey',
              filterValue: 'Baseline',
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
    ]
  }
}
,
{
  scoreId: 'ccef90a9-fb22-4ab9-b6a1-014181a3173b',
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
            filter: {
              property: 'data.pestAnimalSurveys.baselineOrIndicatorSurvey',
              filterValue: 'Indicator',
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
    ]
  }
}
,
{
  scoreId: '4433698b-c7da-48de-af2f-ed6e60b46159',
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
  scoreId: '38a19646-24d0-41ce-b770-a18a74561e88',
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
            filter: {
              property: 'data.remediatingAreas.initialOrFollowup',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: '2a8fc96d-fbe5-44f5-b5c5-b3df35761b26',
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
            filter: {
              property: 'data.remediatingAreas.initialOrFollowup',
              filterValue: 'Follow-up',
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
    ]
  }
}
,
{
  scoreId: 'fc3befcb-1b91-4fc0-b0a5-09ff15e96034',
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
            filter: {
              property: 'data.remediatingAreas.initialOrFollowup',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: '42eb42aa-fe23-4f87-92a1-43ed08ee60c8',
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
            filter: {
              property: 'data.remediatingAreas.initialOrFollowup',
              filterValue: 'Follow-up',
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
    ]
  }
}
,
{
  scoreId: 'f968ebc2-f3fd-4e00-893a-a2b6da8655d7',
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
  scoreId: '6799212b-acc0-4ca0-8a54-1e101019ac51',
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
          property: 'name',
          filterValue: 'RDP - Weed treatment',
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
            filter: {
              filterValue: 'Initial',
              property: 'data.weedTreatmentAreasControlled.initialOrFollowup',
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
    ]
  }
}
,
{
  scoreId: '2c77ee77-b238-44c3-8408-140add878f15',
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
          property: 'name',
          filterValue: 'RDP - Weed treatment',
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
            filter: {
              filterValue: 'Follow-up',
              property: 'data.weedTreatmentAreasControlled.initialOrFollowup',
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
    ]
  }
}
,
{
  scoreId: 'ce65e5ad-b046-4040-83eb-ed8118bc22b4',
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
          property: 'name',
          filterValue: 'RDP - Weed treatment',
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
            filter: {
              filterValue: 'Initial',
              property: 'data.weedTreatmentAreasControlled.initialOrFollowup',
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
    ]
  }
}
,
{
  scoreId: 'a220ba03-7d1f-4f1b-938f-70cb8848a14f',
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
          property: 'name',
          filterValue: 'RDP - Weed treatment',
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
            filter: {
              filterValue: 'Follow-up',
              property: 'data.weedTreatmentAreasControlled.initialOrFollowup',
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
    ]
  }
}
,
{
  scoreId: 'dc875711-44ef-4c45-8b8c-6fae60341ab5',
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
            filter: {
              property: 'data.revegetationAreasControlled.initialOrMaintenance',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: '2fcd0728-744e-411e-a8de-04cf37210937',
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
            filter: {
              property: 'data.revegetationAreasControlled.initialOrMaintenance',
              filterValue: 'Maintenance',
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
    ]
  }
}
,
{
  scoreId: '31b04a8f-d534-4a45-a548-f5abd55bc632',
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
            filter: {
              property: 'data.skillsAndKnowledgeSurveys.baselineOrIndicatorSurvey',
              filterValue: 'Baseline',
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
    ]
  }
}
,
{
  scoreId: 'a757a29e-f58e-40dd-9d93-712d112f941f',
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
            filter: {
              property: 'data.skillsAndKnowledgeSurveys.baselineOrIndicatorSurvey',
              filterValue: 'Indicator',
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
    ]
  }
}
,
{
  scoreId: '1282273f-420b-4e83-8d45-c2e550a71acf',
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
            filter: {
              property: 'data.soilSurveys.baselineOrIndicatorSurvey',
              filterValue: 'Baseline',
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
    ]
  }
}
,
{
  scoreId: 'cad46cd5-29da-4fb2-a064-8c4d8f2b66a3',
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
            filter: {
              property: 'data.soilSurveys.baselineOrIndicatorSurvey',
              filterValue: 'Indicator',
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
    ]
  }
}
,
{
  scoreId: 'b40629b0-40b1-4d37-8e7f-32e59dc78bce',
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
            filter: {
              property: 'data.interventionDetails.initialOrFollowup',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: '12943287-7101-40d7-8a03-a1c6ebfe3dc5',
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
            filter: {
              property: 'data.interventionDetails.initialOrFollowup',
              filterValue: 'Follow-up',
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
    ]
  }
}
,
{
  scoreId: 'af245159-3e14-4f77-aa6c-016e4a986e3a',
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
            filter: {
              property: 'data.waterQualitySurveys.baselineOrIndicatorSurvey',
              filterValue: 'Baseline',
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
    ]
  }
}
,
{
  scoreId: '9c55002d-4e7d-4860-b5bd-129ac9aafe3b',
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
            filter: {
              property: 'data.waterQualitySurveys.baselineOrIndicatorSurvey',
              filterValue: 'Indicator',
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
    ]
  }
}
,
{
  scoreId: 'bc5de3e2-47b1-4b33-8dab-de4fdda3fbf9',
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
            filter: {
              property: 'data.weedSurveys.baselineOrIndicatorSurvey',
              filterValue: 'Baseline',
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
    ]
  }
}
,
{
  scoreId: '47f12adb-055c-4a11-8545-cf442c727302',
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
            filter: {
              property: 'data.weedSurveys.baselineOrIndicatorSurvey',
              filterValue: 'Indicator',
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
    ]
  }
}
,
{
  scoreId: '0a2131ab-3488-41cb-a9db-f098fed777a0',
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
            filter: {
              property: 'data.debrisRemovalAreasControlled.initialOrFollowup',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: '215dce47-887d-4fa0-83b9-de742693b137',
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
            filter: {
              property: 'data.debrisRemovalAreasControlled.initialOrFollowup',
              filterValue: 'Follow-up',
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
    ]
  }
}
,
{
  scoreId: 'b91b04d0-261d-4af5-a2af-4a48f67312fe',
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
            filter: {
              property: 'data.debrisRemovalAreasControlled.initialOrFollowup',
              filterValue: 'Initial',
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
    ]
  }
}
,
{
  scoreId: '95a2a8e2-8453-4bb3-97fe-554a66cd14bf',
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
            filter: {
              property: 'data.debrisRemovalAreasControlled.initialOrFollowup',
              filterValue: 'Follow-up',
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
    ]
  }
}
,
{
  scoreId: 'd3fda0c0-331b-44d8-8851-2e31b922ffc4',
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
  scoreId: '082ffdf5-5a4b-415a-9249-58cdb0dca74f',
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
  scoreId: 'd06368ed-4b0a-4c20-abf3-026b7be35bc1',
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
  scoreId: '04e37aff-a420-44a6-9456-57c58efd4c90',
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
  scoreId: '2d1bdd6c-4d14-496e-825d-f1fb03415249',
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
  scoreId: '4429fbf6-dfc8-43a9-a811-a0359bfee8fa',
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
  scoreId: '5c079adf-0f79-469f-9394-02064fc37d0c',
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
  scoreId: '2a76954a-8deb-4eb0-aa12-27e73d005edb',
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
];

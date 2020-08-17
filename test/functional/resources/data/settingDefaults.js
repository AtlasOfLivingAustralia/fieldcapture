var settingValue = {
    "statistics": {
        "ts1": {      "config": "5",      "title": "Threatened Species Strategy",      "label": "Protecting threatened species",      "units": "Projects",      "type": "projectCount",      "projectFilter": [        "meriPlanAssetFacet:Threatened Species"      ]    },
        "nlp1": {      "config": "5",      "title": "National Landcare Programme",      "label": "Supporting sustainable agriculture",      "units": "Projects",      "type": "investmentProjectCount",      "projectFilter": [        "associatedProgramFacet:National Landcare Programme"      ],      "investmentTypeFilter": "Farmers and fishers are increasing their long term returns through better management of the natural resource base"    },
        "nlp7": {      "config": "6",      "title": "National Landcare Programme",      "label": "That support World Heritage Areas",      "units": "Projects",      "type": "projectCount",      "projectFilter": [        "associatedProgramFacet:National Landcare Programme",        "meriPlanAssetFacet:World Heritage area"      ]    },
        "nlp9": {      "config": "2",      "title": "National Landcare Programme",      "label": "Targeted for weed control",      "units": "Ha",      "type": "outputTarget",      "projectFilter": [        "associatedProgramFacet:National Landcare Programme"      ],      "scoreLabel":"Total new area treated for weeds (Ha)"    },
        "nlp13": {      "config": "6",      "title": "National Landcare Programme",      "label": "Targeted for pest animal control",      "units": "Ha",      "type": "outputTarget",      "projectFilter": [        "associatedProgramFacet:National Landcare Programme"      ],      "scoreLabel": "Area covered (Ha) by pest treatment actions"    },
        "all1": {      "config": "3",      "title": "All programmes",      "label": "Managed for invasive weeds",      "units": "Ha",      "type": "score",      "scoreLabel": "Total new area treated for weeds (Ha)"    }},
    "groups": [ [      "ts1",      "nlp1",      "nlp7",      "nlp9",      "nlp13",      "all1"    ]  ]
}


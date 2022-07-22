load('../../utils/uuid.js');
load('../../utils/program.js');

var esp = createOrFindProgram('Environmental Stewardship');

var subprograms = ['LMCW1', 'LHQS-QLD', 'LM1', 'LM2', 'MEC1', 'MEC 2', 'LHQS-NSW'];
var config = {
    "projectReports": [
        {
            reportType:'Activity',
            reportingPeriodInMonths: 12,
            "reportsAlignedToCalendar": false,
            reportNameFormat: "Stage %1d",
            reportDescriptionFormat: "Stage %1d for ${project.name}"
        }
    ],
    excludes:["DATA_SETS", "MERI_PLAN", "RISKS_AND_THREATS"],
    "speciesFieldsSettings": {
        "surveysConfig": [
            {
                "speciesFields": [
                    {
                        "output": "ESP Weed management",
                        "dataFieldName": "species",
                        "context": "",
                        "label": "Species:",
                        "config": {
                            "speciesLists": [{"dataResourceUid": "dr7394"}],
                            "type": "GROUP_OF_SPECIES",
                            "speciesDisplayFormat": "SCIENTIFICNAME(COMMONNAME)"
                        }
                    },
                    {
                        "output": "ESP Feral animal management",
                        "dataFieldName": "species",
                        "context": "",
                        "label": "Species:",
                        "config": {
                            "speciesLists": [{"dataResourceUid": "dr7484"}],
                            "type": "GROUP_OF_SPECIES",
                            "speciesDisplayFormat": "SCIENTIFICNAME(COMMONNAME)"
                        }
                    }
                ],
                "name": "ESP PMU or Zone reporting"
            },
            {
                "speciesFields": [
                    {
                        "output": "ESP Weed management",
                        "dataFieldName": "species",
                        "context": "",
                        "label": "Species:",
                        "config": {
                            "speciesLists": [{"dataResourceUid": "dr7394"}],
                            "type": "GROUP_OF_SPECIES",
                            "speciesDisplayFormat": "SCIENTIFICNAME(COMMONNAME)"
                        }
                    },
                    {
                        "output": "ESP Feral animal management",
                        "dataFieldName": "species",
                        "context": "",
                        "label": "Species:",
                        "config": {
                            "speciesLists": [{"dataResourceUid": "dr7484"}],
                            "type": "GROUP_OF_SPECIES",
                            "speciesDisplayFormat": "SCIENTIFICNAME(COMMONNAME)"
                        }
                    }
                ],
                "name": "ESP SMU Reporting"
            }
        ],
        "defaultSpeciesConfig": {
            "type": "ALL_SPECIES",
            "speciesDisplayFormat": "SCIENTIFICNAME(COMMONNAME)"
        }
    },
    "projectTemplate": "esp",
    "activities": [
        {name:"ESP Overview"},
        {name:"ESP PMU or Zone reporting"},
        {name:"ESP SMU Reporting"},
        {name:"ESP Species"}
    ],
    "activityNavigationMode": "returnToProject",
    "banner": {
        "public":false,
        "fontSize":"1.4em",
        "message":"**ESP reports are currently being updated and are in READ ONLY mode. The new templates will be released for completion at the end of September 2022. Please send enquiries to EnviroStewarship@environment.gov.au**"
    }
};

for (var i=0; i<subprograms.length; i++) {
    var sub = createOrFindProgram(subprograms[i], esp._id);
    sub.config = config;
    db.program.save(sub);

    db.project.update({associatedSubProgram:sub.name}, {$set:{programId:sub.programId}}, {multi:true});
}
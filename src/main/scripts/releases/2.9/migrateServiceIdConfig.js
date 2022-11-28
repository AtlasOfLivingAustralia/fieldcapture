load('../../utils/audit.js');

let programs = db.program.find({status: {$ne: 'deleted'}});
let adminUserId = 'ecodata';

const serviceForms = ['RLP Output Report'];
const services = [
    {
        "output": "RLP - Baseline data",
        "name": "Collecting, or synthesising baseline data",
        "id": 1,
        "categories": ["Project initiation activities"]
    },
    {
        "output": "RLP - Communication materials",
        "name": "Communication materials",
        "id": 2,
        "categories": ["Complimentary"]
    },
    {
        "output": "RLP - Community engagement",
        "name": "Community/stakeholder engagement",
        "id": 3,
        "categories": ["Complimentary"]
    },
    {
        "output": "RLP - Controlling access",
        "name": "Controlling access",
        "id": 4,
        "categories": [
            "Managing threats",
            "Improve habitat",
            "Restore site condition"
        ]
    },
    {
        "output": "RLP - Pest animal management",
        "name": "Controlling pest animals",
        "id": 5,
        "categories": ["Managing threats"]
    },
    {
        "output": "RLP - Debris removal",
        "name": "Debris removal",
        "id": 34,
        "categories": ["Restoring condition"]
    },
    {
        "output": "RLP - Management plan development",
        "name": "Developing farm/project/site management plan",
        "id": 6,
        "categories": ["Complimentary"]
    },
    {
        "output": "RLP - Erosion Management",
        "name": "Erosion management",
        "id": 7,
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "output": "RLP - Establishing Agreements",
        "name": "Establishing and maintaining agreements",
        "id": 8,
        "categories": ["Project initiation activities"]
    },
    {
        "output": "RLP - Maintaining feral free enclosures",
        "name": "Establishing and maintaining feral-free enclosures",
        "id": 9,
        "categories": ["Create safe havens"]
    },
    {
        "output": "RLP - Establishing ex-situ breeding programs",
        "name": "Establishing and maintaining breeding programs",
        "id": 10,
        "categories": ["Create safe havens"]
    },
    {
        "output": "RLP - Establishing monitoring regimes",
        "name": "Establishing and maintaining monitoring regimes",
        "id": 11,
        "categories": ["Project initiation activities"]
    },
    {
        "output": "RLP - Farm Management Survey",
        "name": "Farm management survey",
        "id": 12,
        "categories": ["Monitoring activities"]
    },
    {
        "output": "RLP - Fauna survey",
        "name": "Fauna survey",
        "id": 13,
        "categories": ["Monitoring activities"]
    },
    {
        "output": "RLP - Fire management",
        "name": "Fire management actions",
        "id": 14,
        "categories": [
            "Managing threats",
            "Imroving habitat"
        ]
    },
    {
        "output": "RLP - Flora survey",
        "name": "Flora survey",
        "id": 15,
        "categories": ["Monitoring activities"]
    },
    {
        "output": "RLP - Habitat augmentation",
        "name": "Habitat augmentation",
        "id": 16,
        "categories": ["Improving habitat"]
    },
    {
        "output": "RLP - Identifying sites",
        "name": "Identifying the location of potential sites",
        "id": 17,
        "categories": ["Project initiation activities"]
    },
    {
        "output": "RLP - Improving hydrological regimes",
        "name": "Improving hydrological regimes",
        "id": 18,
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "output": "RLP - Improving land management practices",
        "name": "Improving land management practices",
        "id": 19,
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "output": "RLP - Disease management",
        "name": "Managing disease",
        "id": 20,
        "categories": ["Managing threats"]
    },
    {
        "output": "RLP - Negotiations",
        "name": "Negotiating with the Community, Landholders, Farmers, Traditional Owner groups, Agriculture industry groups etc.",
        "id": 21,
        "categories": ["Project initiation activities"]
    },
    {
        "output": "RLP - Obtaining approvals",
        "name": "Obtaining relevant approvals",
        "id": 22,
        "categories": ["Project initiation activities"]
    },
    {
        "output": "RLP - Pest animal survey",
        "name": "Pest animal survey",
        "id": 23,
        "categories": ["Monitoring activities"]
    },
    {
        "output": "RLP - Plant survival survey",
        "name": "Plant survival survey",
        "id": 24,
        "categories": ["Monitoring activities"]
    },
    {
        "output": "RLP - Project planning",
        "name": "Project planning and delivery of documents as required for the delivery of the Project Services and monitoring",
        "id": 25,
        "categories": ["Project initiation activities"]
    },
    {
        "output": "RLP - Remediating riparian and aquatic areas",
        "name": "Remediating riparian and aquatic areas",
        "id": 26,
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "output": "RLP - Weed treatment",
        "name": "Removing weeds",
        "id": 27,
        "categories": ["Managing threats"]
    },
    {
        "output": "RLP - Revegetating habitat",
        "name": "Revegetating habitat",
        "id": 28,
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "output": "Seed Collecting - Bushfire Program",
        "name": "Seed collection",
        "id": 36,
        "categories": []
    },
    {
        "output": "RLP - Site preparation",
        "name": "Site preparation",
        "id": 35,
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "output": "RLP - Skills and knowledge survey",
        "name": "Skills and knowledge survey",
        "id": 29,
        "categories": ["Monitoring activities"]
    },
    {
        "output": "RLP - Soil testing",
        "name": "Soil testing",
        "id": 30,
        "categories": ["Monitoring activities"]
    },
    {
        "output": "RLP - Emergency Interventions",
        "name": "Undertaking emergency interventions to prevent extinctions",
        "id": 31,
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "output": "RLP - Water quality survey",
        "name": "Water quality survey",
        "id": 32,
        "categories": ["Monitoring activities"]
    },
    {
        "output": "RLP - Weed distribution survey",
        "name": "Weed distribution survey",
        "id": 33,
        "categories": ["Monitoring activities"]
    },
    {
        "output": "Cultural value survey and/or assessment",
        "name": "Cultural value survey and/or assessment",
        "id": 37
    },
    {
        "output": "Cultural Site Management",
        "name": "Cultural Site Management",
        "id": 38
    },
    {
        "output": "On Country Visits",
        "name": "On Country Visits",
        "id": 39
    },
    {
        "output": "Cultural Practices",
        "name": "Cultural Practices",
        "id": 40
    },
    {
        "output": "Developing/updating Guidelines/Protocols/Plans",
        "name": "Developing/updating Guidelines/Protocols/Plans",
        "id": 41
    }
];

var scoresByFormSection = {
    "RLP - Output WHS": [],
    "RLP - Change Management": [],
    "RLP - Baseline data": [
        "Number of baseline data sets collected and/or synthesised"
    ],
    "RLP - Communication materials": [
        "Number of communication materials published"
    ],
    "RLP - Community engagement": [
        "Number of field days",
        "Number of training / workshop events",
        "Number of conferences / seminars",
        "Number of one-on-one technical advice interactions",
        "Number of on-ground trials / demonstrations",
        "Number of on-ground works"
    ],
    "RLP - Controlling access": [
        "Number of structures installed",
        "Length (km) installed",
        "Area (ha) where access has been controlled"
    ],
    "RLP - Pest animal management": [
        "Area (ha) treated for pest animals - initial",
        "Area (ha) treated for pest animals - follow-up",
        "Length (km) treated for pest animals - follow-up",
        "Length (km) treated for pest animals - initial"
    ],
    "RLP - Management plan development": [
        "Number of farm/project/site plans developed",
        "Area (ha) covered by plan"
    ],
    "RLP - Debris removal": [
        "Area (ha) of debris removal"
    ],
    "RLP - Erosion Management": [
        "Area (ha) of erosion control",
        "Length (km) of stream/coastline treated for erosion"
    ],
    "RLP - Maintaining feral free enclosures": [
        "Number of feral free enclosures",
        "Area (ha) of feral-free enclosure",
        "Number of days maintaining feral-free enclosures"
    ],
    "RLP - Establishing ex-situ breeding programs": [
        "Number of breeding sites and/or populations",
        "Number of days maintaining breeding programs"
    ],
    "RLP - Establishing Agreements": [
        "Number of agreements",
        "Area (ha) covered by agreements",
        "Number of days maintaining agreements"
    ],
    "RLP - Establishing monitoring regimes": [
        "Number of monitoring regimes established",
        "Number of days maintaining monitoring regimes"
    ],
    "RLP - Farm Management Survey": [
        "Number of farm management surveys conducted"
    ],
    "RLP - Fauna survey": [
        "Area surveyed (ha) (fauna)",
        "Number of fauna surveys conducted"
    ],
    "RLP - Fire management": [
        "Area (ha) treated by fire management action"
    ],
    "RLP - Flora survey": [
        "Area surveyed (ha) (flora)",
        "Number of flora surveys conducted"
    ],
    "RLP - Habitat augmentation": [
        "Area (ha) of augmentation",
        "Number of structures or installations"
    ],
    "RLP - Identifying sites": [
        "Number of potential sites identified"
    ],
    "RLP - Improving hydrological regimes": [
        "Number of treatments implemented to improve water management",
        "Area (ha) of catchment being managed as a result of this management action"
    ],
    "RLP - Improving land management practices": [
        "Area (ha) covered by practice change"
    ],
    "RLP - Disease management": [
        "Area (ha) treated for disease"
    ],
    "RLP - Negotiations": [
        "Number of groups negotiated with"
    ],
    "RLP - Obtaining approvals": [
        "Number of relevant approvals obtained"
    ],
    "RLP - Pest animal survey": [
        "Area (ha) surveyed for pest animals",
        "Number of pest animal surveys conducted"
    ],
    "RLP - Plant survival survey": [
        "Area surveyed (ha) for plant survival",
        "Number of plant survival surveys conducted"
    ],
    "RLP - Project planning": [
        "Number of planning and delivery documents for delivery of the project services and monitoring",
        "Number of days project planning / preparation"
    ],
    "RLP - Remediating riparian and aquatic areas": [
        "Area (ha) remediated",
        "Length (km) remediated"
    ],
    "RLP - Weed treatment": [
        "Area (ha) treated for weeds - initial",
        "Area (ha) treated for weeds - follow-up",
        "Length (km) treated for weeds - initial",
        "Length (km) treated for weeds - follow-up"
    ],
    "RLP - Revegetating habitat": [
        "Area of habitat revegetated (ha)",
        "Number of days collecting seed",
        "Number of days propagating plants",
        "Area (ha) of revegetated habitat maintained"
    ],
    "Seed Collecting - Bushfire Program": [
        "Amount (kg) seed collected",
        "Number of plants propagated",
        "Number of seeds collected"
    ],
    "RLP - Site preparation": [
        "Area (ha) of site preparation",
        "Number of days preparing site/s"
    ],
    "RLP - Skills and knowledge survey": [
        "Number of skills and knowledge surveys conducted"
    ],
    "RLP - Soil testing": [
        "Number of soil tests conducted in targeted areas"
    ],
    "RLP - Emergency Interventions": [
        "Number of interventions"
    ],
    "RLP - Water quality survey": [
        "Area (ha) surveyed for water quality",
        "Number of water quality surveys"
    ],
    "RLP - Weed distribution survey": [
        "Area (ha) surveyed for weeds",
        "Number of weed distribution surveys conducted"
    ]
}

while (programs.hasNext()) {
    let program = programs.next();

    let config = program.config;

    if (config && config.supportedServiceIds) {

        let serviceFormName = null;
        for (let i = 0; i < config.projectReports.length; i++) {
            if (serviceForms.indexOf(config.projectReports[i].activityType) >= 0) {
                serviceFormName = config.projectReports[i].activityType;
                break;
            }
        }

        config.programServiceConfig = {serviceFormName: serviceFormName, programServices: []};

        for (let i = 0; i < config.supportedServiceIds.length; i++) {
            const serviceId = config.supportedServiceIds[i];
            const service = services.find(s => s.id == serviceId);
            const scoreNames = scoresByFormSection[service.output];
            let scoreIds = [];

            if (scoreNames) {
                for (let j=0; j<scoreNames.length; j++) {
                    const scoreId = db.score.findOne({label:scoreNames[j]}).scoreId;
                    scoreIds.push(scoreId);
                }
            }

            const programService = {
                serviceId: serviceId,
                formSectionName: service.output,
                serviceTargets: scoreIds
            }
            config.programServiceConfig.programServices.push(programService);
        }
        // delete program.config.supportedServiceIds
        db.program.replaceOne({_id:program._id}, program);
        audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId);
    }
}

const filterableActivityForm = 'Wildlife Recovery Progress Report - WRR';
const activityBasedPrograms = db.program.find({'config.projectReports.activityType':filterableActivityForm});
while (activityBasedPrograms.hasNext()) {
    let program = activityBasedPrograms.next();
    program.config.programServiceConfig = {serviceFormName: filterableActivityForm, programServices: []};
    db.program.replaceOne({_id:program._id}, program);
    audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId);
}
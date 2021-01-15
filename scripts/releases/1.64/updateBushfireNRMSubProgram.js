load("uuid.js");

var name = 'Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - NRM';

var program = db.program.find({name: name}).next();

program.config.meriPlanContents =  [
    {
        "template": "programOutcome",
        "model": {
            "maximumPriorities": "1000",
            "helpTextHeading": "Bushfire program outcomes are listed in the secondary outcomes"
        }
    },
    {
        "template": "additionalOutcomes",
        "model": {
            "maximumPriorities": 1000,
            "maxAdditionalOutcomes": 15
        }
    },
    {
        "template": "assets",
        "model": {
            "priorityCategories": [
                "Priority Vertebrate Animals",
                "Additional Priority Species",
                "Priority Invertebrate Species",
                "Priority Natural Asset",
                "Priority Plants",
                "Additional Priority Plants",
                "Threatened Ecological Community",
                "Additional Priority Natural Asset",
                "Additional Threatened Ecological Community"
            ],
            "assetHeading": "Asset",
            "viewExplanation": "Species, ecological community or environmental asset(s) the project is targeting",
            "useCategorySelection": true,
            "explanation": "List the natural assets within the bushfire region that will benefit from this project",
            "fromPriorities": true,
            "placeHolder": "Please select",
            "assetCategoryHelpText": "As identified within the regional workshop reports.  Types with no assets are not selectable",
            "assetHelpText": "scientific and/or common name"
        }
    },
    {
        "template": "outcomeStatements",
        "model": {
            "subtitle": "Please provide outcome statements. Outcomes statements should: <br/>- outline the degree of impact having undertaken the actions within the project timeframe;<br/>- be expressed as a SMART statement (Specific, Measurable, Attainable, Realistic and Time-bound); and<br/>- ensure the outcomes are measurable with consideration to the monitoring methodology provided below.",
            "placeholder": "By 30 June 2021, [Free text]",
            "title": "Outcome statements"
        }
    },
    {
        "template": "sectionHeading",
        "model": {
            "heading": "Project Details"
        }
    },
    {
        "template": "name",
        "model": {
            "tableFormatting": true,
            "placeHolder": "[150 characters]"
        }
    },
    {
        "template": "description",
        "model": {
            "helpTextHeading":"A succinct overview of the project: (i) what will be done and (ii) why it will be done",
            "tableFormatting": true,
            "maxSize": "1000",
            "placeholder": "Please provide a short description of this project. This project description will be visible on the project overview page in MERIT [Free text; limit response to 1000 characters (approx. 150 words)]"
        }
    },
    {
        "template": "projectPartnerships",
        "model": {
            "helpTextPartnerNature":"If partnership with an organisation: provide the name of the organisation and the role they will play/how you will support them. If partnering with community groups or members of the public: indicate each group or individual you will engage with",
            "namePlaceHolder": "[Free text]",
            "partnershipPlaceHolder": "[Free text]"
        }
    },
    {
        "template": "keyThreats",
        "model": {
            "interventionHelpText": "Describe the proposed interventions to address the threat and how this will deliver on the project outcome"
        }
    },
    {
        "template": "projectMethodology",
        "model": {
            "maxSize": "4000",
            "title": "Project methodology",
            "tableHeading": "Please describe the methodology that will be used to achieve the project's outcome statements. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification)",
            "placeHolder": "[Free text; limit response to 4000 characters (approx. 650 words)]"
        }
    },
    {
        "template": "monitoringBaseline",
        "model": {
            "titleHelpText":"Describe the project baseline(s) units of measure or data which will be used to report progress towards this project’s outcomes and the monitoring design. Refer to the Regional Land Partnerships Evaluation Plan which provides guidance on baselines and the monitoring indicators for each outcome. Note, other monitoring indicators can also be used.",
            "baselineMethodHelpText":"Describe the project baseline (s) units of measure or data which will be used to report progress towards this project’s outcome and the monitoring design"
        }
    },
    {
        "template": "monitoringIndicators",
        "model": {
            "approachHeading": "Describe the project monitoring indicator(s) approach",
            "indicatorHeading": "Project monitoring indicators",
            "indicatorHelpText": "List the measurable indicators of project success that will be monitored. Indicators should link back to the outcome statements and have units of measure. Indicators should measure both project outputs (e.g. area (ha) of rabbit control, length (km) of predator proof fencing) and change the project is aiming to achieve (e.g. Change in abundance of X threatened species at Y location, Change in vegetation cover (%), etc).",
            "approachHelpText": "How will the indicator be monitored? Briefly describe the method to be used to monitor the indicator (including timing of monitoring, who will collect/collate / analyse data, etc)",
            "indicatorPlaceHolder": "[Free text]",
            "approachPlaceHolder": "[Free text]"
        }
    },
    {
        "template": "projectReview"
    },
    {
        "template": "nationalAndRegionalPlans"
    },
    {
        "template": "serviceTargets",
        "model": {
            "title": "Services and Targets Table",
            "serviceName": "Service"
        }
    }
];

db.program.save(program);

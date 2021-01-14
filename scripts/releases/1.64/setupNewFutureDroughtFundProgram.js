load("uuid.js");

let outcomes = [
    {
        "priorities": [
            {
                "category": "Land Management"
            }
        ],
        "targeted": true,
        "shortDescription": "Soil Condition",
        "supportsMultiplePrioritiesAsPrimary": true,
        "type": "primary",
        "category": "agriculture",
        "outcome": "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
    },
    {
        "priorities": [
            {
                "category": "Sustainable Agriculture"
            }
        ],
        "shortDescription": "Climate / Weather Adaption",
        "supportsMultiplePrioritiesAsPrimary": true,
        "type": "primary",
        "category": "agriculture",
        "outcome": "6. By 2023, there is an increase in the capacity of agriculture systems to adapt to significant changes in climate and market demands for information on provenance and sustainable production."
    },
    {
        "priorities": [
            {
                "category": "Bushfires"
            }
        ],
        "shortDescription": "Bushfire Recovery",
        "type": "secondary",
        "category": "bushfires",
        "outcome": "Enhance the recovery and maximise the resilience of fire affected priority species, ecological communities and other natural assets within the seven regions impacted by the 2019-20 bushfires",
        "supportsMultiplePrioritiesAsSecondary": true
    }
];

let config = {
    "meriPlanContents": [
        {
            "template": "programOutcome",
            "model": {
                "maximumPriorities": "1000"
            }
        },
        {
            "template": "fdFund"
        },
        {
            "template": "outcomeStatements",
            "model": {
                "helpText": "Short term outcomes statements should: <br/><ul> <li>Contribute to the 5-year Outcome (e.g. what degree of impact are you expecting from the Project's interventions )</li> <li>Outline the degree of impact having undertaken the Services for  up to 3 years, for example 'area of relevant vegetation type has increased'.</li><li>Be expressed as a SMART statement. SMART stands for Specific, Measurable, Attainable, Realistic, and Time-bound. Ensure the outcomes are measurable with consideration to the baseline and proposed monitoring regime.</li></ul><b>Please Note: </b> for Project three years or less in duration, a short-term Project outcome achievable at the Project's completion must be set.",
                "subtitle": "Short-terms outcome statement/s",
                "title": "Project Outcomes"
            }
        },
        {
            "template": "mediumTermOutcomes"
        },
        {
            "template": "sectionHeading",
            "model": {
                "heading": "Project Details"
            }
        },
        {
            "template": "description",
            "model": {
                "tableFormatting": true,
                "maxSize": "1000",
                "placeholder": "Please provide a short description of this project. This project description will be visible on the project overview page in MERIT [Free text; limit response to 1000 characters (approx. 150 words)]"
            }
        },
        {
            "template": "sectionHeading",
            "model": {
                "heading": "Agriculture projects only (Primary outcomes 5 or 6)"
            }
        },
        {
            "template": "rationale",
            "model": {
                "tableFormatting": true,
                "rationaleHelpText": "Provide a rationale of why the targeted investment priorities are being addressed and explain (using evidence) how the methodology will address them. This includes why the area / stakeholders are being targeted and how the project activities chosen will contribute to achieving the 5 year outcomes. ",
                "maxSize": "3000",
                "title": "Project Rationale  (3000 character limit [approximately 500 words])"
            }
        },
        {
            "template": "projectMethodology",
            "model": {
                "helpText": "Describe the methodology that will be used to achieve the project outcomes. To help demonstrate best practice delivery approaches and cost effectiveness of methodologies used, include details of the specific delivery mechanisms to leverage change (e.g. delivery method, approach and justification, and any assumptions).",
                "maxSize": "4000",
                "tableHeading": "Project methodology (4000 character limit [approx. 650 words])"
            }
        },
        {
            "template": "monitoringBaseline"
        },
        {
            "template": "monitoringIndicators",
            "model": {
                "approachHeading": "Describe the project monitoring indicator(s) approach",
                "monitoringValidation": true,
                "indicatorHeading": "Project monitoring indicators",
                "indicatorPlaceHolder": "[Free text]",
                "approachPlaceHolder": "[Free text]"
            }
        },
        {
            "template": "projectReview",
            "model": {
                "title": "Project review, evaluation and improvement methodology and approach (3000 character limit [approximately 500 words])"
            }
        },
        {
            "template": "nationalAndRegionalPlans"
        },
        {
            "template": "serviceTargets",
            "model": {
                "title": "Project services and minimum targets",
                "serviceName": "Service"
            }
        }
    ],
    "excludes": [],
    "visibility": "public",
    "organisationRelationship": "Service Provider",
    "excludeFinancialYearData": true,
    "requiresActivityLocking": true,
    "nrm": [
        {
            "name": "More primary producers adopt whole-of-system approaches to NRM to improve the natural resource base, for long-term productivity and landscape health (also and FDF Outcome)"
        },
        {
            "name": "Partnerships and engagement is built between stakeholders responsible for managing natural resources"
        },
        {
            "name": "More primary producers and agricultural communities are experimenting with adaptive or transformative NRM practices, systems and approaches that link and contribute to building drought resilience"
        },
        {
            "name": "Improved NRM in agricultural landscapes for increased capacity to prepare and respond to drought"
        }
    ],
    "fdf": [
        {
            "name": "More primary producers preserve natural capital while also improving productivity and profitability"
        },
        {
            "name": "More primary producers adopt risk management practices to improve their sustainability and resilience"
        },
        {
            "name": "More primary producers adopt whole-of-system approaches to NRM to improve the natural resource base, for long-term productivity and landscape health"
        }
    ],
    "projectTemplate": "rlp",
    "activityPeriodDescriptor": "Outputs report #",
    "meriPlanTemplate": "configurableMeriPlan",
    "riskAndThreatTypes": [
        "Performance",
        "Work Health and Safety",
        "People resources",
        "Financial",
        "External stakeholders",
        "Natural Environment"
    ],
    "navigationMode": "returnToProject"
};

let name = "Future Drought Fund";
var program = db.program.find({name: name});
var now = ISODate();
var p = {
    name: name, programId: UUID.generate(), dateCreated: now, lastUpdate: now
}
if (!program.hasNext()) {
    db.program.insert(p);
}else{
    print("Program Already Exist: " + name)
}

name = "Natural Resource Management - Landscape"

var program = db.program.find({name: name});
var parent = db.program.find({name: "Future Drought Fund"}).next();
var now = ISODate();
var p = {
    name: name, programId: UUID.generate(), dateCreated: now, lastUpdate: now, parent: parent._id
}
if (!program.hasNext()) {
    db.program.insert(p);
}else{
    print("Program Already Exist: " + name)
}
print("Adding config data into program:  " + name)
var program = db.program.find({name: name});
while(program.hasNext()){
    var p = program.next();
    p.config = config;
    p.outcomes = outcomes;
    db.program.save(p);
}

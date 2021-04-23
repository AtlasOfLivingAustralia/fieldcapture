load('uuid.js');


var scores = [{
        "category": "Indigenous Consultations and Participation",
        "configuration": {
            "label": "Number of surveys and/or assessments",
            "childAggregations": [{
                "filter": {
                    "filterValue": "Cultural value survey and/or assessment",
                    "property": "name",
                    "type": "filter"
                },
                "childAggregations": [{
                    "property": "data.culturalValueSurveysAndAssessments.numberOfActivitiesConducted",
                    "type": "SUM"
                }]
            }]
        },
        "description": "Number of surveys and/or assessments",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": true,
        "label": "Number of surveys and/or assessments",
        "outputType": "Cultural value survey and/or assessment",
        "scoreId": UUID.generate(),
        "status": "active"
    },
    {
        "category": "Indigenous Consultations and Participation",
        "configuration": {
            "label": "Number of sites managed",
            "childAggregations": [{
                "filter": {
                    "filterValue": "Cultural Site Management",
                    "property": "name",
                    "type": "filter"
                },
                "childAggregations": [{
                    "property": "data.culturalSites.numberOfSitesWhereWorkHasOccurred",
                    "type": "SUM"
                }]
            }]
        },
        "description": "Number of sites managed",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": true,
        "label": "Number of sites managed",
        "outputType": "Cultural Site Management",
        "scoreId": UUID.generate(),
        "status": "active"
    },
    {
        "category": "Indigenous Consultations and Participation",
        "configuration": {
            "label": "Area (ha) covered by site management works or plan",
            "childAggregations": [{
                "filter": {
                    "filterValue": "Cultural Site Management",
                    "property": "name",
                    "type": "filter"
                },
                "childAggregations": [{
                    "property": "data.culturalSites.actualAreaHa",
                    "type": "SUM"
                }]
            }]
        },
        "description": "Area (ha) covered by site management works or plan",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": true,
        "label": "Area (ha) covered by site management works or plan",
        "outputType": "Cultural Site Management",
        "scoreId": UUID.generate(),
        "status": "active"
    },
    {
        "category": "Indigenous Consultations and Participation",
        "configuration": {
            "label": "Number of on country visits",
            "childAggregations": [{
                "filter": {
                    "filterValue": "On Country Visits",
                    "property": "name",
                    "type": "filter"
                },
                "childAggregations": [{
                    "property": "data.onCountryVisits.numberOfVisits",
                    "type": "SUM"
                }]
            }]
        },
        "description": "Number of on country visits",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": true,
        "label": "Number of on country visits",
        "outputType": "On Country Visits",
        "scoreId": UUID.generate(),
        "status": "active"
    },
    {
        "category": "Indigenous Consultations and Participation",
        "configuration": {
            "label": "Area visited during on country visits",
            "childAggregations": [{
                "filter": {
                    "filterValue": "On Country Visits",
                    "property": "name",
                    "type": "filter"
                },
                "childAggregations": [{
                    "property": "data.onCountryVisits.actualAreaHa",
                    "type": "SUM"
                }]
            }]
        },
        "description": "Area visited during on country visits",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": true,
        "label": "Area visited during on country visits",
        "outputType": "On Country Visits",
        "scoreId": UUID.generate(),
        "status": "active"
    },
    {
        "category": "Indigenous Consultations and Participation",
        "configuration": {
            "label": "Number of cultural practices conducted",
            "childAggregations": [{
                "filter": {
                    "filterValue": "Cultural Practices",
                    "property": "name",
                    "type": "filter"
                },
                "childAggregations": [{
                    "property": "data.culturalPractices.numberOfCulturalPractices",
                    "type": "SUM"
                }]
            }]
        },
        "description": "Number of cultural practice/s conducted",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": true,
        "label": "Number of cultural practices conducted",
        "outputType": "Cultural Practices",
        "scoreId": UUID.generate(),
        "status": "active"
    },
    {
        "category": "Indigenous Consultations and Participation",
        "configuration": {
            "label": "Area (ha) covered by cultural practices",
            "childAggregations": [{
                "filter": {
                    "filterValue": "Cultural Practices",
                    "property": "name",
                    "type": "filter"
                },
                "childAggregations": [{
                    "property": "data.culturalPractices.actualAreaHa",
                    "type": "SUM"
                }]
            }]
        },
        "description": "Area (ha) covered by cultural practices",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": true,
        "label": "Area (ha) covered by cultural practices",
        "outputType": "Cultural Practices",
        "scoreId": UUID.generate(),
        "status": "active"
    },
    {
        "category": "Indigenous Consultations and Participation",
        "configuration": {
            "label": "Number of guidelines/protocols/plans for delivery of the project services and monitoring",
            "childAggregations": [{
                "filter": {
                    "filterValue": "Developing/updating Guidelines/Protocols/Plans",
                    "property": "name",
                    "type": "filter"
                },
                "childAggregations": [{
                    "property": "data.guidelinesProtocolsAndPlans.numberOfDocuments",
                    "type": "SUM"
                }]
            }]
        },
        "description": "Number of guidelines/protocols/plans for delivery of the project services and monitoring",
        "displayType": "",
        "entity": "Activity",
        "entityTypes": [],
        "isOutputTarget": true,
        "label": "Number of guidelines/protocols/plans for delivery of the project services and monitoring",
        "outputType": "Developing/updating Guidelines/Protocols/Plans",
        "scoreId": UUID.generate(),
        "status": "active"
    }
];

for (var i=0; i<scores.length; i++) {
    var existing = db.score.find({label:scores[i].label});
    if (existing.hasNext()) {
        var existingScore = existing.next();
        existingScore.configuration = scores[i].configuration;
        db.score.save(existingScore);
        print("Updating score: "+existingScore.label);
    }
    else {
        db.score.insert(scores[i]);
        print("Inserting score: "+scores[i].label);
    }

}
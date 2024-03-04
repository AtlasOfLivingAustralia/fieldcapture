var protocolConfig = {
    // Vegetation Mapping Survey
    'cd2cbbc7-2f17-4b0f-91b4-06f46e9c90f2': {
        apiEndpoint: 'vegetation-mapping-observations',
        usesPlotLayout: false,
        geometryType: 'Point',
        geometryPath: 'attributes.position',
        startDatePath: 'attributes.vegetation_mapping_survey.data.attributes.start_date_time',
        endDatePath: null,
        surveyIdPath: 'attributes.vegetation_mapping_survey.data.attributes.surveyId'
    },
    'floristics-veg-survey-lite': {
        apiEndpoint: 'floristics-veg-survey-lites',
        usesPlotLayout: true,
        startDatePath: 'attributes.start_date_time',
        endDatePath: 'attributes.end_date_time',
        surveyIdPath: 'attributes.surveyId'
    },
    'floristics-veg-survey-fulls': {
        apiEndpoint: 'floristics-veg-survey-fulls',
        usesPlotLayout: true,
        startDatePath: 'attributes.start_date_time',
        endDatePath: 'attributes.end_date_time',
        surveyIdPath: 'attributes.surveyId'
    },
    'photopoints-survey': {
        apiEndpoint: 'photopoints-surveys',
        usesPlotLayout: true,
        startDatePath: 'attributes.start_date_time',
        endDatePath: 'attributes.end_date_time',
        surveyIdPath: 'attributes.surveyId'
    },
    // Pest Fauna Control Activities
    '80360ceb-bd6d-4ed4-b2ea-9bd45d101d0e': {
        apiEndpoint: 'pest-fauna-control-activities',
        usesPlotLayout: false,
        startDatePath: 'attributes.start_time',
        endDatePath: 'attributes.end_time',
        geometryType: "LineString",
        point1: "attributes.start_location", // Type string: format: Lat: -35.2592426, Lng: 149.0651714
        point2: "attributes.end_location" // Format: Lat: -35.2592426, Lng: 149.0651714

    },
    // Basal Area DBH
    '5005b0af-4360-4a8c-a203-b2c9e440547e': {
        apiEndpoint: 'basal-area-dbh-measure-surveys',
        usesPlotLayout: true,
        startDatePath: 'attributes.start_date',
        endDatePath: 'attributes.start_date',
    }
};

var protocols = {
    "068d17e8-e042-ae42-1e42-cff4006e64b0":
        {"name": "Opportune", "usesPlotLayout": false, "tags": ["survey"]},
    "cd2cbbc7-2f17-4b0f-91b4-06f46e9c90f2": {"name": "Vegetation Mapping", "usesPlotLayout": false, "tags": ["survey"]},
    "a9cb9e38-690f-41c9-8151-06108caf539d":
        {"name": "Plot Selection", "usesPlotLayout": false, "tags": ["site"]},
    "d7179862-1be3-49fc-8ec9-2e219c6f3854": {
        "name": "Plot Layout and Visit",
        "usesPlotLayout": false,
        "tags": ["site"]
    },
    "617df00c-0e4f-4267-9efc-9ca9eae19686": {
        "name": "Plot Description(enhanced)",
        "usesPlotLayout": false,
        "tags": ["site"]
    },
    "dc10f902-e310-45eb-b82a-bebab050b46b": {
        "name": "Plot Description(standard)",
        "usesPlotLayout": false,
        "tags": ["site"]
    },
    "3cbc5277-45fb-4e7a-8f33-19d9bff4cd78": {"name": "Drone Survey", "usesPlotLayout": false, "tags": ["survey"]},
    "3d2eaa76-a610-4575-ac30-abf40e57b68a": {"name": "Dev sandbox", "usesPlotLayout": false, "tags": ["development"]},
    "5fd206b5-25cb-4371-bd90-7b2e8801ea25": {
        "name": "Photopoints - DSLR Panorama",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "383fa013-c52d-4186-911b-35e9b2375653": {
        "name": "Photopoints - Compact Panorama",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "2dbb595b-3541-46bd-b200-13db3a823b74": {
        "name": "Photopoints - Device Panorama",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "e15db26f-55de-4459-841b-d7ef87dea5cd": {
        "name": "Floristics - Enhanced",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "bbd550c0-04c5-4a8c-ae39-cc748e920fd4": {
        "name": "Floristics - Standard",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "b92005b0-f418-4208-8671-58993089f587": {
        "name": "Plant Tissue Vouchering - Enhanced",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "f01e0673-a29d-48bb-b6ce-cf1c0f0de345": {
        "name": "Plant Tissue Vouchering - Standard",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "93e65339-4bce-4ca1-a323-78977865ef93": {"name": "Cover - Enhanced", "usesPlotLayout": false, "tags": ["survey"]},
    "37a3b018-3779-4c4f-bfb3-d38eb53a2568": {"name": "Cover - Standard", "usesPlotLayout": false, "tags": ["survey"]},
    "8c47b1f8-fc58-4510-a138-e5592edd2dbc": {
        "name": "Cover + Fire - Enhanced",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "58f2b4a6-6ce1-4364-9bae-f96fc3f86958": {
        "name": "Cover + Fire - Standard",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "36e9d224-a51f-47ea-9442-865e80144311": {"name": "Fire Survey", "usesPlotLayout": false, "tags": ["survey"]},
    "5005b0af-4360-4a8c-a203-b2c9e440547e": {"name": "Basal Area - DBH", "usesPlotLayout": false, "tags": ["survey"]},
    "4b8b35c7-15ef-4abd-a7b2-2f4e24509b52": {
        "name": "Basal Area - Basal Wedge",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "6e613128-92e8-4525-854c-4021f1d4d02f": {
        "name": "Coarse Woody Debris",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "a05f8914-ef4f-4a46-8cf1-d035c9c46d4d": {
        "name": "Recruitment - Age Structure",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "db841be3-dfb7-4860-9474-a131f4de5954": {
        "name": "Recruitment - Survivorship",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "1dd7d3ff-11b5-4690-8167-d8fe148656b9": {
        "name": "Soil Sub-pit and Metagenomics",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "15ea86ab-22f6-43fa-8cd5-751eab2347ad": {"name": "Soil Sample Pit", "usesPlotLayout": false, "tags": ["survey"]},
    "1de5eed1-8f97-431c-b7ca-a8371deb3c28": {
        "name": "Soil Site Observation and Pit Characterisation",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "39da41f1-dd45-4838-ae57-ea50588fd2bc": {
        "name": "Soils - Bulk Density",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "c1b38b0f-a888-4f28-871b-83da2ac1e533": {
        "name": "Vertebrate Fauna - Bird Survey",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "ab990a3a-a972-45d2-a384-13c3b01e9c7b": {
        "name": "Vertebrate Fauna - Trapping Survey Closure",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "82463b77-aac2-407c-a03c-8669bd73baf0": {
        "name": "Invertebrate Fauna - Malaise Trapping",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "8041a1a4-3e19-4fd2-86b9-d453023b5592": {
        "name": "Invertebrate Fauna - Active Search",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "7f95710a-2003-4119-a2c6-41ce4e34d12a": {
        "name": "Condition - Attributes",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "aae4dbd8-845a-406e-b682-ef01c3497711": {
        "name": "Dev Sandbox Bulk Survey",
        "usesPlotLayout": false,
        "tags": ["development"]
    },
    "6000cb5f-ad75-41e2-9e3e-c070c527453a": {
        "name": "Metadata Collection",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "949ae38f-c047-42a7-8164-38c24ede35d5": {
        "name": "Camera Trap Reequipping",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "90c0f4cc-a22a-4820-9a8b-a01564bc197a": {
        "name": "Fauna Aerial Survey",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "2c5bb8d7-b624-4dc4-93d7-3f1276e65ad5": {
        "name": "Vertebrate Fauna - Trapping Survey Setup",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "70fbd236-9e51-47a8-93da-125a18a13acc": {
        "name": "Vertebrate Fauna - Identify, Measure and Release",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "9d2c3fcf-881b-41df-944d-33bb6ef8ac51": {
        "name": "Vertebrate Fauna - Active and Passive Search",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "0628e486-9b33-4d86-98db-c6d3f10f7744": {
        "name": "Vertebrate Fauna - Acoustic and Ultrasonic Recordings",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "9e75385a-4783-4911-8870-cca78b44d781": {
        "name": "Invertebrate Fauna - Wet Pitfall Trapping",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "7dc49039-4999-43f6-8896-e33d7b28a934": {
        "name": "Invertebrate Fauna - Rapid Ground Trapping",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "7b0e4526-726e-4292-a897-238f336ce51e": {
        "name": "Invertebrate Fauna - Pan Trapping",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "aa64fd4d-2c5a-4f84-a197-9f3ce6409152": {
        "name": "Invertebrate Fauna - Post-field Sampling Curation",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "08adf0ff-43c1-4f19-b2c4-f5da667baf65": {
        "name": "Interventions - Data Collection",
        "usesPlotLayout": false,
        "tags": ["intervention"]
    },
    "ad088dbe-02b2-472a-901f-bd081e590bcf": {
        "name": "Camera Trap Deployment",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "3db7f7b6-a96d-495a-9981-5d6170a7458d": {
        "name": "Camera Trap Retrieval",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "648d545a-cdae-4c19-bc65-0c9f93d9c0eb": {
        "name": "Sign-based Fauna Surveys - Within-plot Belt Transect",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "2cd7b489-b582-41f6-9dcc-264f6ea7801a": {
        "name": "Sign-based Fauna Surveys - Off-plot Belt Transect",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "0c5d1d14-c71b-467f-aced-abe1c83c15d3": {
        "name": "Sign-based Fauna - Vehicle Track",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "a76dac21-94f4-4851-af91-31f6dd00750f": {
        "name": "Fauna Ground Counts Transects",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "80360ceb-bd6d-4ed4-b2ea-9bd45d101d0e": {
        "name": "Pest Fauna - Control Activities",
        "usesPlotLayout": false,
        "tags": ["intervention"]
    },
    "228e5e1e-aa9f-47a3-930b-c1468757f81d": {
        "name": "Herbivory and Physical Damage - Active Plot Search",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "cc826a19-a1e7-4dfe-8d6e-f135d258d7f9": {
        "name": "Sign-based Fauna - Plot Sign Search",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "685b5e9b-20c2-4688-9b04-b6caaf084aad": {
        "name": "Sign-based Fauna - Track Station",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "d706fd34-2f05-4559-b738-a65615a3d756": {
        "name": "Fauna Ground Counts Vantage Point",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "06cd903e-b8b3-40a5-add4-f779739cce35": {
        "name": "Herbivory and Physical Damage - Within-plot Belt Transect",
        "usesPlotLayout": false,
        "tags": ["survey"]
    },
    "49d02f5d-b148-4b5b-ad6a-90e48c81b294": {
        "name": "Herbivory and Physical Damage - Off-plot Transect",
        "usesPlotLayout": false,
        "tags": ["survey"]
    }
};


var key = 'paratoo.surveyData.mapping';
var setting = {
    key: key,
    value: JSON.stringify(protocols),
    dateCreated: ISODate(),
    lastUpdated: ISODate()
};
if (db.setting.findOne({key: key})) {
    db.setting.replaceOne({key: key}, setting);
} else {
    db.setting.insertOne(setting);
}


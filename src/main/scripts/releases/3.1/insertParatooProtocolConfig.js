var protocolConfig = {
    // Vegetation Mapping Survey
    'cd2cbbc7-2f17-4b0f-91b4-06f46e9c90f2': {
        apiEndpoint:'vegetation-mapping-observations',
        usesPlotLayout:false,
        geometryType:'Point',
        geometryPath:'attributes.position',
        startDatePath:'attributes.vegetation_mapping_survey.data.attributes.start_date_time',
        endDatePath: null,
        surveyIdPath: 'attributes.vegetation_mapping_survey.data.attributes.surveyId'
    },
    'floristics-veg-survey-lite': {
        apiEndpoint:'floristics-veg-survey-lites',
        usesPlotLayout:true,
        startDatePath: 'attributes.start_date_time',
        endDatePath: 'attributes.end_date_time',
        surveyIdPath: 'attributes.surveyId'
    },
    'floristics-veg-survey-fulls': {
        apiEndpoint:'floristics-veg-survey-fulls',
        usesPlotLayout:true,
        startDatePath: 'attributes.start_date_time',
        endDatePath: 'attributes.end_date_time',
        surveyIdPath: 'attributes.surveyId'
    },
    'photopoints-survey': {
        apiEndpoint:'photopoints-surveys',
        usesPlotLayout:true,
        startDatePath: 'attributes.start_date_time',
        endDatePath: 'attributes.end_date_time',
        surveyIdPath: 'attributes.surveyId'
    },
    // Pest Fauna Control Activities
    '80360ceb-bd6d-4ed4-b2ea-9bd45d101d0e': {
        apiEndpoint:'pest-fauna-control-activities',
        usesPlotLayout:false,
        startDatePath: 'attributes.start_time',
        endDatePath: 'attributes.end_time',
        geometryType: "LineString",
        point1: "attributes.start_location", // Type string: format: Lat: -35.2592426, Lng: 149.0651714
        point2: "attributes.end_location" // Format: Lat: -35.2592426, Lng: 149.0651714

    },
    // Basal Area DBH
    '5005b0af-4360-4a8c-a203-b2c9e440547e': {
        apiEndpoint:'basal-area-dbh-measure-surveys',
        usesPlotLayout:true,
        startDatePath: 'attributes.start_date',
        endDatePath: 'attributes.start_date',
    }
};

var key = 'paratoo.surveyData.mapping';
var setting = {
    key: key,
    value: JSON.stringify(protocolConfig),
    dateCreated: ISODate(),
    lastUpdated: ISODate()
};
if (db.setting.findOne({key: key})) {
    db.setting.replaceOne({key: key}, setting);
}
else {
    db.setting.insertOne(setting);
}

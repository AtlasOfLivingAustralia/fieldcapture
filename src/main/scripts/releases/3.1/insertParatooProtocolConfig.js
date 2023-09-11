var protocolConfig = {
    'cd2cbbc7-2f17-4b0f-91b4-06f46e9c90f2': {
        apiEndpoint:'vegetation-mapping-observations',
        usesPlotLayout:false,
        geometryType:'Point',
        geometryPath:'attributes.position',
        startDatePath:'attributes.vegetation_mapping_survey.data.attributes.start_date_time',
        endDatePath: null,
        surveyIdPath: 'attributes.vegetation_mapping_survey.data.attributes.surveyId'
    }
};

var key = 'paratoo.surveyData.mapping';
var setting = {
    key: key,
    value: JSON.stringify(protocolConfig),
    dateCreated: ISODate(),
    lastUpdated: ISODate()
};
db.setting.insertOne(setting);
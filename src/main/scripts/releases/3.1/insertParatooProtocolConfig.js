var protocolConfig = {
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
package au.org.ala.fieldcapture

class MetadataService {

    def grailsApplication, webService, cacheService

    def activitiesModel() {
        return cacheService.get('activity-model',{
            webService.getJson(grailsApplication.config.ecodata.baseUrl +
                'metadata/activitiesModel')
        })
    }

    def updateActivitiesModel(model) {
        def result = webService.doPost(grailsApplication.config.ecodata.baseUrl +
                'metadata/updateActivitiesModel', [model: model])
        cacheService.clear('activity-model')
        result
    }

    def programsModel() {
        return cacheService.get('programs-model',{
            webService.getJson(grailsApplication.config.ecodata.baseUrl +
                'metadata/programsModel')
        })
    }

    def updateProgramsModel(model) {
        def result = webService.doPost(grailsApplication.config.ecodata.baseUrl +
                'metadata/updateProgramsModel', [model: model])
        cacheService.clear('programs-model')
        result
    }

    def getThemesForProject(project) {
        def programMD = programsModel().programs.find { it.name == project.associatedProgram }
        if (programMD) {
            def subprogramMD = programMD.subprograms.find {it.name == project.associatedSubProgram }
            if (subprogramMD) {
                return subprogramMD.themes
            }
        }
        return []
    }

    def getActivityModel(name) {
        return activitiesModel().activities.find { it.name == name }
    }

    def getMainScoresForActivity(name) {
        return activitiesModel().find({ it.name = name })?.outputs?.collect { it.scoreName }
    }

    def getDataModelFromOutputName(outputName) {
        def activityName = getActivityModelName(outputName)
        return activityName ? getDataModel(activityName) : null
    }

    def getDataModel(template) {
        return cacheService.get(template + '-model',{
            webService.getJson(grailsApplication.config.ecodata.baseUrl +
                    "metadata/dataModel/${template}")
        })
    }

    def updateOutputDataModel(model, template) {
        log.debug "updating template ${template}"
        //log.debug "model class is ${model.getClass()}"
        def result = webService.doPost(grailsApplication.config.ecodata.baseUrl +
                'metadata/updateOutputDataModel/' + template, [model: model])
        cacheService.clear(template + '-model')
        result
    }

    def getActivityModelName(outputName) {
        return activitiesModel().outputs.find({it.name == outputName})?.template
    }

    def getModelNameFromType(type) {
        log.debug "Getting model name for ${type}"
        log.debug activitiesModel()
        return activitiesModel().activities.find({it.name == type})?.template
    }

    def activityTypesList() {
        cacheService.get('activitiesSelectList', {
            def acts = activitiesModel().activities
            [
                [name:'Activities', list: acts.findAll({it.type == 'Activity'}).collect {[name:it.name]}],
                [name:'Assessments', list: acts.findAll({it.type == 'Assessment'}).collect {[name:it.name]}]
            ]

        })
    }

    /**
     * Returns a Map with key: activityName and value: <list of score definitions for the outputs that make up the activity>
     * Used to support the nomination of project output targets for various activity types.
     */
    def getOutputTargetsByActivity() {
        def activityScores = [:]
        def activitiesModel = activitiesModel()

        activitiesModel.activities.each { activity ->
            def scores = []

            activityScores[activity.name] = scores
            activity.outputs.each { outputName ->
                def matchedOutput = activitiesModel.outputs.find {
                    output -> outputName == output.name
                }
                if (matchedOutput && matchedOutput.scores) {
                    matchedOutput.scores.each {
                        if (it.isOutputTarget) {
                            scores << (it << [outputName : outputName])
                        }
                    }
                }
            }
        }
        return activityScores
    }



    def clearEcodataCache() {
        webService.get(grailsApplication.config.ecodata.baseUrl + "admin/clearMetadataCache")
    }

    def outputTypesList() {
        outputTypes
    }

    def getInstitutionName(uid) {
        def institutions = institutionList()
        // The result of the service call will be a JSONArray if it's successful
        return uid ? institutions.find({ it.uid == uid })?.name : ''
    }

    def institutionList() {
        return cacheService.get('institutions',{
            webService.getJson(grailsApplication.config.collectory.baseURL + '/ws/institution')
        })
    }

    def getAccessLevels() {
        return cacheService.get('accessLevels',{
            webService.getJson(grailsApplication.config.ecodata.baseUrl +
                    "permissions/getAllAccessLevels")
        })
    }

    def getLocationMetadataForPoint(lat, lng) {
        cacheService.get("spatial-point-${lat}-${lng}", {
            def url = grailsApplication.config.spatial.baseURL + "ws/intersect/cl22,cl916/${lat}/${lng}"
            def features = webService.getJson(url)
            [state: features.find({it.field == 'cl22'})?.value,
                    nrm: features.find({it.field == 'cl916'})?.value]
        })
    }

    static outputTypes = [
            [name: 'Fence erected', unit: 'Km', dataType: 'Decimal'],
            [name: 'Vegetation units planted', unit: 'No.', dataType: 'Int'],
            [name: 'Habitat quality', unit: 'Index Value', dataType: 'Text'],
            [name: 'Connectivity Index', unit: 'Index Value', dataType: 'Text'],
            [name: 'Condition Index', unit: 'Index Value', dataType: 'Text'],
            [name: 'No. of actions implemented', unit: 'No.', dataType: 'Int'],
            [name: 'No. of person hours', unit: 'Person Hrs', dataType: 'Decimal'],
            [name: 'Vegetation cleared', unit: 'Ha', dataType: 'Decimal'],
            [name: 'Community education event', unit: 'No.', dataType: 'Int'],
            [name: 'Indigenous communities engaged', unit: 'No.', dataType: 'Int'],
            [name: 'Habitat protection works', unit: 'No. of landholders', dataType: 'Int'],
            [name: 'Habitat protection works', unit: 'No. of sites', dataType: 'Int'],
            [name: 'Habitat protection works', unit: 'Private/Public land', dataType: 'Boolean'],
            [name: 'Habitat protection works', unit: 'Km', dataType: 'Decimal'],
            [name: 'Habitat protection works', unit: 'Ha', dataType: 'Decimal'],
            [name: 'Site management plans - Preparation', unit: 'No. of sites', dataType: 'Int'],
            [name: 'Site management plans - Implementation', unit: 'No. of sites', dataType: 'Int'],
            [name: 'Community education events', unit: 'No.', dataType: 'Int'],
            [name: 'Surveys undertaken', unit: 'No. of surveys', dataType: 'Int'],
            [name: 'Surveys undertaken', unit: 'Type of surveys', dataType: 'Text'],
            [name: 'Conservation Agreements formalised', unit: 'No.', dataType: 'Int'],
            [name: 'Habitat restoration works', unit: 'No. of Landholders', dataType: 'Int'],
            [name: 'Habitat restoration works', unit: 'No. of sites', dataType: 'Int'],
            [name: 'Habitat restoration works', unit: 'Private/Public land', dataType: 'Boolean'],
            [name: 'Habitat restoration works', unit: 'Km', dataType: 'Decimal'],
            [name: 'Habitat restoration works', unit: 'Ha', dataType: 'Decimal'],
            [name: "PMP's - Prepared", unit: 'No.', dataType: 'Int'],
            [name: "PMP's - Prepared", unit: 'Indigenous (yes/no)', dataType: 'Boolean'],
            [name: "PMP's - Works implementation", unit: "No.", dataType: "Int"],
            [name: "PMP's - Works implementation", unit: "Indigenous (yes/no)", dataType: "Boolean"],
            [name: 'Weed control', unit: "Ha", dataType: "Decimal"],
            [name: 'Pest control', unit: "Ha", dataType: "Decimal"]
    ]

    static activityTypes = [
            [name:'Site condition survey', key: 'scs', list: [
                    [key:'', name:'DECCW vegetation assessment'],
                    [key:'', name:'Feral animal assessment']
            ]],
            [name:'Biological survey', key: 'bs', list: [
                    [key:'birdSurvey', name:'Bird survey'],
                    [key:'reptileSurvey', name:'Reptile survey'],
                    [key:'insectSurvey', name:'Insect survey'],
                    [key:'smallMammalSurvey', name:'Small mammal survey'],
                    [key:'batSurvey', name:'Bat survey'],
                    [key:'koalaSurvey', name:'Koala survey'],
                    [key:'floraSurvey', name:'Flora survey'],
                    [key:'rapidAssessment', name:'Rapid assessment']
            ]],
            [name: 'Other', key: 'other', list: [
                    [key:'speciesObservation', name:'Species observation'],
                    [key:'weedControl', name:'Weed control'],
                    [key:'pestControl', name:'Pest control'],
                    [key:'planting', name:'Planting']
            ]]
    ]

    static activityTypesNoKey = [
            [name:'Site condition survey', list: [
                    [name:'DECCW vegetation assessment'],
                    [name:'Feral animal assessment']
            ]],
            [name:'Biological survey', list: [
                    [name:'Bird survey'],
                    [name:'Reptile survey'],
                    [name:'Insect survey'],
                    [name:'Small mammal survey'],
                    [name:'Bat survey'],
                    [name:'Koala survey'],
                    [name:'Flora survey'],
                    [name:'Rapid assessment']
            ]],
            [name: 'Other', list: [
                    [name:'Species observation'],
                    [name:'Weed control'],
                    [name:'Pest control'],
                    [name:'Revegetation'],
                    [name:'Planting']
            ]]
    ]

    static activityTypesFlat = [
            [key:'', name:'DECCW vegetation assessment', group: 'Site condition survey'],
            [key:'birdSurvey', name:'Bird survey', group: 'Biological survey'],
            [key:'reptileSurvey', name:'Reptile survey', group: 'Biological survey'],
            [key:'insectSurvey', name:'Insect survey', group: 'Biological survey'],
            [key:'smallMammalSurvey', name:'Small mammal survey', group: 'Biological survey'],
            [key:'batSurvey', name:'Bat survey', group: 'Biological survey'],
            [key:'koalaSurvey', name:'Koala survey', group: 'Biological survey'],
            [key:'floraSurvey', name:'Flora survey', group: 'Biological survey'],
            [key:'rapidAssessment', name:'Rapid assessment', group: 'Biological survey'],
            [key:'speciesObservation', name:'Species observation', group: 'Other'],
            [key:'weedControl', name:'Weed control', group: 'Other'],
            [key:'pestControl', name:'Pest control', group: 'Other'],
            [key:'planting', name:'Planting', group: 'Other']
    ]

}

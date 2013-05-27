package au.org.ala.fieldcapture

import grails.converters.JSON

class MetadataService {

    def grailsApplication, webService, cacheService

    def getDataModel(name) {
        String filename = (grailsApplication.config.app.external.model.dir as String) + name + '/dataModel.json'
        //log.debug filename
        def jsonStr = new File(filename).text
        JSON.parse(jsonStr)
    }

    def getModelName(output, type) {
        return output.template ?: getModelNameFromType(type)
    }

    def getModelNameFromType(type) {
        //log.debug "Getting model name for ${type}"
        switch (type) {
            case "Feral animal assessment": return "feralAnimalAbundanceScore"
            case "DECCW vegetation assessment": return "weedAbundanceAndThreatScore"
            default: return ""
        }
    }

    def activityTypesList() {
        activityTypesNoKey
    }

    def outputTypesList() {
        outputTypes
    }

    def getInstitutionName(uid) {
        return uid ? institutionList().find({ it.uid == uid })?.name : ''
    }

    def institutionList() {
        return cacheService.get('institutions',{
            webService.getJson(grailsApplication.config.collectory.baseURL + '/ws/institution')
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

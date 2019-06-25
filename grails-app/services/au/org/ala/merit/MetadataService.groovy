package au.org.ala.merit

import grails.converters.JSON
import grails.plugin.cache.GrailsCacheManager
import org.codehaus.groovy.grails.web.json.JSONArray

class MetadataService {

    def grailsApplication, webService, cacheService

    GrailsCacheManager grailsCacheManager
    SettingService settingService

    static final String PROJECT_SERVICES_CACHE_REGION = 'projectServices'
    static final String PROJECT_SERVICES_KEY = 'projectServices'



    def activitiesModel() {
        return cacheService.get('activity-model',{
            webService.getJson(grailsApplication.config.ecodata.baseUrl +
                'metadata/activitiesModel')
        })
    }

    def annotatedOutputDataModel(type) {
        return cacheService.get('annotated-output-model'+type,{
            Collections.unmodifiableList(webService.getJson(grailsApplication.config.ecodata.baseUrl +
                    'metadata/annotatedOutputDataModel?type='+type.encodeAsURL()))
        })
    }

    def programsModel() {
        def allPrograms = cacheService.get('programs-model',{
            webService.getJson(grailsApplication.config.ecodata.baseUrl +
                'metadata/programsModel')
        })

        def programs = [programs:allPrograms.programs.findAll{it.isMeritProgramme}]
        programs

    }

    Map getProgramConfiguration(String programName, String subProgramName = null) {
        def program = programModel(programName)
        if (!program) {
            throw new IllegalArgumentException("No program exists with name ${programName}")
        }
        def config = new HashMap(program)
        config.remove('subprograms')

        if (subProgramName) {
            def subProgram = program.subprograms?.find{it.name == subProgramName}
            if (!subProgram) {
                throw new IllegalArgumentException("No subprogram exists for program ${programName} with name ${subProgramName}")
            }

            if (subProgram.overridesProgramData) {
                config.putAll(subProgram)
            }
            config.themes = subProgram.themes ?: [] // Themes are only configured on subprograms at the moment.

        }

        config
    }

    def programModel(program) {
        return programsModel().programs.find {it.name == program}
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

    /**
     * Returns a map containing both the activity model and the output model templates for the specified activity type.
     * @param activityType the type of activity
     */
    Map getActivityMetadata(String activityType) {
        Map model = [:]
        // the activity meta-model
        model.metaModel = getActivityModel(activityType)
        // the array of output models
        model.outputModels = model.metaModel?.outputs?.collectEntries {
            [ it, getDataModelFromOutputName(it)] }

        model
    }

    def getActivityModelName(outputName) {
        return activitiesModel().outputs.find({it.name == outputName})?.template
    }

    def activityTypesList(program = '', subprogram='') {
        cacheService.get('activitiesSelectList'+program+'-'+subprogram, {
            String url = grailsApplication.config.ecodata.baseUrl + 'metadata/activitiesList'
            if (program) {
                url += '?program='+program.encodeAsURL()
                if (subprogram) {
                    url += '&subprogram='+subprogram.encodeAsURL()
                }
            }

            def activityTypes = webService.getJson(url)
            activityTypes.collect {key, value -> [name:key, list:value]}.sort{it.name}

        })
    }

    boolean isOptionalContent(String contentName, Map config) {
        return contentName in (config.optionalProjectContent?:[])
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

    /**
     * Returns a 3 level hierarchy given by:
     *  a map keyed by activityName where each value is:
     *      a map keyed by outputName where each value is:
     *          a list of score definitions that are output targets
     * Only includes activities and outputs if they contain output targets.
     * Used to support the nomination of project output targets for various activity types.
     */
    def getOutputTargetsByOutputByActivity() {
        def outputTargetMetadata = [:]
        def activitiesModel = activitiesModel()

        activitiesModel.activities.each { activity ->
            def outputs = [:]

            activity.outputs.each { outputName ->
                def scores = []

                def matchedOutput = activitiesModel.outputs.find {
                    output -> outputName == output.name
                }
                if (matchedOutput && matchedOutput.scores) {
                    matchedOutput.scores.each {
                        if (it.isOutputTarget && (it.aggregationType in ['SUM', 'AVERAGE', 'COUNT'])) {
                            scores << it
                        }
                    }
                    // only add the output if it has targets
                    if (scores) {
                        outputs[outputName] = scores
                    }
                }
            }
            // only add the activity if it has outputs that have targets
            if (outputs) {
                outputTargetMetadata[activity.name] = outputs
            }
        }
        return outputTargetMetadata
    }

    def clearCache(boolean clearEcodataCache = true) {
        cacheService.clear()
        if (clearEcodataCache) {
            this.clearEcodataCache()
        }


    }

    def clearEcodataCache() {
        webService.get(grailsApplication.config.ecodata.baseUrl + "admin/clearMetadataCache")
    }

    def outputTypesList() {
        outputTypes
    }

    def organisationList() {
        return cacheService.get('organisations',{
            Map result = webService.getJson(grailsApplication.config.ecodata.baseUrl + "organisation")

            List reducedList = result?.list?.collect {[name:it.name, organisationId:it.organisationId]}
            [list:reducedList?:[]]
        })
    }

    def clearOrganisationList() {
        cacheService.clear('organisations')
    }

    def getAccessLevels() {
        return cacheService.get('accessLevels',{
            webService.getJson(grailsApplication.config.ecodata.baseUrl +  "permissions/getAllAccessLevels")
        })
    }

    def getLocationMetadataForPoint(lat, lng) {
        cacheService.get("spatial-point-${lat}-${lng}", {
            webService.getJson(grailsApplication.config.ecodata.baseUrl + "metadata/getLocationMetadataForPoint?lat=${lat}&lng=${lng}")
        })
    }

    def getReportCategories() {
        return cacheService.get('report-categories',{
            def categories = new LinkedHashSet()
            activitiesModel().outputs.each { output ->
                output.scores.each { score ->
                    def cat = score.category?.trim()
                    if (cat) {
                        categories << cat
                    }
                }
            }
            categories
        })
    }

    List<Map> getScores(boolean includeConfig) {
        cacheService.get("scores-${includeConfig}", {
            String url = grailsApplication.config.ecodata.baseUrl + "metadata/scores"
            if (includeConfig) {
                url+='?view=config'
            }
            webService.getJson(url)
        })
    }

    List<Map> getOutputTargetScores() {
        cacheService.get('output-targets', {
            List<Map> scores = getScores(false)
            scores.findAll { it.isOutputTarget }.collect {
                [scoreId: it.scoreId, label: it.label, entityTypes: it.entityTypes, description: it.description, outputType: it.outputType, externalId: it.externalId, isOutputTarget:it.isOutputTarget]
            }
        })
    }

    def getGeographicFacetConfig() {
        cacheService.get("geographic-facets", {

            def results = [:].withDefault{[:]}

            def facetConfig = webService.getJson(grailsApplication.config.ecodata.baseUrl + "metadata/getGeographicFacetConfig")
            facetConfig.grouped.each { k, v ->
                v.each { name, fid ->
                    def objects = webService.getJson(grailsApplication.config.spatial.baseUrl + '/ws/objects/'+fid)
                    results[k] << [(objects[0].fieldname):objects[0]] // Using the fieldname instead of the name for grouped facets is a temp workaround for the GER.
                }

            }

            facetConfig.contextual.each { name, fid ->
                def objects = webService.getJson(grailsApplication.config.spatial.baseUrl + '/ws/objects/'+fid)
                objects.each {
                    results[name] << [(it.name):it]
                }
            }

            results
        })
    }

    List<Map> getProjectServices() {
        cacheService.get(PROJECT_SERVICES_KEY, {
            List services
            String servicesJson = settingService.getSettingText(SettingPageType.SERVICES)
            if (servicesJson) {
                services = JSON.parse(servicesJson)
            }
            else {
                services = JSON.parse(getClass().getResourceAsStream('/services.json'), 'UTF-8')
            }

            List scores = getScores(false)
            services.each { service ->
                service.scores = new JSONArray(scores.findAll{it.outputType == service.output})
            }

            services
        })
    }

    Map findByName(String name, List model) {
        Map result = model.find{it.name == name}
        if (!result) {
            List nested = model.findAll{it.columns}

            nested.find {
                result = findByName(name, it.columns)
            }
        }

        result
    }


}

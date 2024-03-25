package au.org.ala.merit

import au.org.ala.merit.PreAuthorise
import au.org.ala.merit.ProjectService
import au.org.ala.merit.config.ProgramConfig
import grails.converters.JSON
import org.springframework.http.HttpStatus

class DataSetController {

    static allowedMethods = [create:'GET', edit:'GET', save:'POST', delete:'POST']

    ProjectService projectService

    // Note that authorization is done against a project, so the project id must be supplied to the method.
    @PreAuthorise(accessLevel = 'editor')
    def create(String id) {
        Map model = projectData(id)
        if (!model.project) {
            render status:404
        }
        else {
            model
        }
    }

    Map projectData(String projectId) {
        Map project = projectService.get(projectId)
        if (!project) {
            return [projectId:projectId, project: null]
        }
        ProgramConfig config = projectService.getProgramConfiguration(project)
        String programName = config.program?.name ?: project.associatedSubProgram
        List outcomes = projectService.getAllProjectOutcomes(project)
        if (!outcomes) {
            outcomes = config.outcomes?.collect{it.outcome}
        }
        if (!outcomes) {
           outcomes = ['n/a']
        }
        List priorities = projectService.listProjectInvestmentPriorities(project)
        if (!priorities) {
            priorities = projectService.listProjectAssets(project)
        }
        if (!priorities) {
            priorities = config.priorities?.collect{it.priority}
        }
        if (!priorities) {
            priorities = ['n/a']
        }


        List outcomeGroups = []
        List projectServices = projectService.getProjectServices(project)
        project.outputTargets?.each { Map outputTarget ->
            if (outputTarget.outcomeTargets) {

                Map service = projectServices.find{it.scores?.find{score -> score.scoreId == outputTarget.scoreId}}
                if (service) {
                    Map score = service.scores.find{it.scoreId == outputTarget.scoreId}
                    outputTarget.outcomeTargets.each {
                        outcomeGroups << [
                                serviceId: service.id,
                                service: service.name,
                                outcomes:it.relatedOutcomes,
                                label:service.name+" "+it.relatedOutcomes,
                                projectTags:score.tags,
                                allTags: service.scores?.collect{it.tags}?.flatten()?.unique()
                        ]
                    }
                }
                else {
                    log.warn("No service found for scoreId ${outputTarget.scoreId} in project ${project.projectId}")
                }
            }
        }

        Map outcomeGroupsByServiceId = outcomeGroups.groupBy{it.serviceId}
        outcomeGroups = outcomeGroups.unique{it.label}.sort{it.label}
        Map serviceBaselineIndicatorOptions = [:]
        outcomeGroupsByServiceId.each { int serviceId, List groups ->
            List tags = groups.collect{it.allTags}.flatten().unique()
            if (tags?.contains('Survey')) {
                serviceBaselineIndicatorOptions[serviceId] = [:]
                if (!tags?.contains('Baseline')) {
                    serviceBaselineIndicatorOptions[serviceId].disableBaseline = true
                }
                if (!tags?.contains('Indicator')) {
                    serviceBaselineIndicatorOptions[serviceId].disableIndicator = true
                }
            }
        }

        List projectBaselines = projectService.listProjectBaselines(project)
        projectBaselines = projectBaselines?.collect{
            // Only projects used the 2023 revision of the MERI plan will have a code attribute for their baselines
            String label = it.code ? it.code + ' - '+ it.baseline : it.baseline
            String value = it.code ?: it.baseline
            [label:label, value: value]
        }

        List projectProtocols = projectService.listProjectProtocols(project).collect{
            [label:it.name, value:it.externalId]
        }
        projectProtocols << [label:'Other', value:'other']

        List dataSetNames = project.custom?.dataSets?.collect{it.name}

        [projectId:projectId, programName:programName, supportsOutcomeTargets:config.supportsOutcomeTargets(),
         priorities:priorities, outcomes: outcomes, project:project, projectOutcomes:outcomeGroups,
         projectBaselines:projectBaselines, projectProtocols:projectProtocols, dataSetNames:dataSetNames,
        serviceBaselineIndicatorOptions: serviceBaselineIndicatorOptions]
    }

    // Note that authorization is done against a project, so the project id must be supplied to the method.
    @PreAuthorise(accessLevel = 'editor')
    def edit(String id, String dataSetId) {

        Map projectData = projectData(id)
        Map dataSet = projectData.project?.custom?.dataSets?.find{it.dataSetId == dataSetId}
        if (dataSet) {
            projectData.dataSetNames?.remove(dataSet.name)
        }

        if (!dataSet) {
            render status: HttpStatus.NOT_FOUND
        }
        else {
            projectData.dataSet = dataSet
            projectData
        }

    }

    @PreAuthorise(accessLevel = 'readOnly')
    def view(String id, String dataSetId) {

        Map projectData = projectData(id)
        Map dataSet = projectData.project?.custom?.dataSets?.find{it.dataSetId == dataSetId}
        if (!dataSet) {
            render status: HttpStatus.NOT_FOUND
        }
        else {
            projectData.dataSet = dataSet
            projectData
        }

    }

    @PreAuthorise(accessLevel = 'editor')
    def save(String id) {

        Map dataSet = request.JSON

        Map response = projectService.saveDataSet(id, dataSet)
        render response as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def delete(String id) {

        Map dataSet = request.JSON
        String dataSetId = dataSet.dataSetId
        if (!dataSetId) {
            render status:HttpStatus.NOT_FOUND, text:"A dataSetId must be supplied"
        }

        Map response = projectService.deleteDataSet(id, dataSetId)
        render response as JSON

    }
}

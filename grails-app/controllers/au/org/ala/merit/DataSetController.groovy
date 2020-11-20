package au.org.ala.merit

import au.org.ala.merit.PreAuthorise
import au.org.ala.merit.ProjectService
import grails.converters.JSON
import org.springframework.http.HttpStatus

class DataSetController {

    static allowedMethods = [create:'GET', edit:'GET', save:'POST', delete:'POST']

    ProjectService projectService
    ProgramService programService

    // Note that authorization is done against a project, so the project id must be supplied to the method.
    @PreAuthorise(accessLevel = 'editor')
    def create(String id) {
        projectData(id)
    }

    Map projectData(String projectId) {
        Map project = projectService.get(projectId)
        Map config = projectService.getProgramConfiguration(project)
        String programName = config.program?.name ?: project.associatedSubProgram
        List outcomes = projectService.getAllProjectOutcomes(project)
        List priorities = projectService.listProjectInvestmentPriorities(project)

        [projectId:projectId, programName:programName, priorities:priorities, outcomes: outcomes, project:project]
    }

    // Note that authorization is done against a project, so the project id must be supplied to the method.
    @PreAuthorise(accessLevel = 'editor')
    def edit(String id, String dataSetId) {

        Map projectData = projectData(id)
        Map dataSet = projectData.project?.custom?.dataSets?.find{it.dataSetId = dataSetId}
        if (!dataSet) {
            respond status: HttpStatus.NOT_FOUND
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
            respond status:400, text:"A dataSetId must be supplied"
        }

        Map response = projectService.deleteDataSet(id, dataSetId)
        render response as JSON

    }
}

package au.org.ala

import au.org.ala.merit.PreAuthorise
import au.org.ala.merit.ProjectService
import org.springframework.http.HttpStatus

class DataSetController {

    static allowedMethods = [create:'GET', edit:'GET', save:'POST', delete:'POST']

    ProjectService projectService

    // Note that authorization is done against a project, so the project id must be supplied to the method.
    @PreAuthorise(accessLevel = 'editor')
    def create(String id) {

        [projectId:id]
    }

    // Note that authorization is done against a project, so the project id must be supplied to the method.
    @PreAuthorise(accessLevel = 'editor')
    def edit(String id, String dataSetId) {

        Map project = projectService.get(id)
        if (!project) {
            respond status: HttpStatus.NOT_FOUND
        }
        else {
            [projectId:id, dataSet:project.custom?.dataSets?.find{it.dataSetId == dataSetId}]
        }

    }

    @PreAuthorise(accessLevel = 'editor')
    def save(String id) {

        Map dataSet = request.JSON

        projectService.saveDataSet(id, dataSet)

    }

    @PreAuthorise(accessLevel = 'editor')
    def delete(String id) {

        Map dataSet = request.JSON
        String dataSetId = dataSet.dataSetId
        if (!dataSetId) {
            respond status:400, text:"A dataSetId must be supplied"
        }

        projectService.deleteDataSet(id, dataSetId)

    }
}

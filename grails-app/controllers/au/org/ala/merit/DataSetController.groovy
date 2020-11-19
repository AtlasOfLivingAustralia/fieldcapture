package au.org.ala.merit

import au.org.ala.merit.PreAuthorise
import au.org.ala.merit.ProjectService
import grails.converters.JSON
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
        Map dataSet = project?.custom?.dataSets?.find{it.dataSetId = dataSetId}
        if (!dataSet) {
            respond status: HttpStatus.NOT_FOUND
        }
        else {
            [projectId:id, dataSet:dataSet]
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

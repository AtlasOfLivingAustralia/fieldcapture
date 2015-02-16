package au.org.ala.merit

import grails.converters.JSON

/**
 * Extends the plugin OrganisationController to support Green Army project reporting.
 */
class OrganisationController extends au.org.ala.fieldcapture.OrganisationController {

    def activityService, metadataService

    def report(String id) {

        def organisation = organisationService.get(id, 'all')
        def activityType = params.type

        def activityModel = metadataService.getActivityModel(activityType)
        def outputModels = activityModel.outputs.collect {
            [name:it, annotatedModel:metadataService.annotatedOutputDataModel(it), dataModel:metadataService.getDataModelFromOutputName(it)]
        }

        def criteria = [type:activityType, projectId:organisation.projects.collect{it.projectId}, dateProperty:'plannedEndDate', startDate:params.plannedStartDate, endDate:params.plannedEndDate]

        def activityResp = activityService.search(criteria)
        def activities = activityResp?.resp.activities

        // augment each activity with project name so we can display it.
        activities.each { activity ->
            def project = organisation.projects.find{it.projectId == activity.projectId}
            activity.projectName = project?.name
            activity.grantId = project?.grantId
            activity.externalId = project?.externalId
        }
        activities?.sort{a,b -> (a.plannedEndDate <=> b.plannedEndDate) ?: (a.grantId <=> b.grantId) ?: (a.externalId <=> b.externalId) ?: (a.activityId <=> b.activityId)}

        render view: '/activity/bulkEdit', model:[organisation:organisation, type:activityType,
                       title:activityService.defaultDescription([type:activityType, plannedStartDate:params.plannedStartDate, plannedEndDate:params.plannedEndDate]),
                       activities:activities,
                       outputModels:outputModels]
    }


    def getAdHocReportTypes(String projectId) {

        def supportedTypes = organisationService.getSupportedAdHocReports(projectId)
        render supportedTypes as JSON

    }

    def createAdHocReport() {
        def supportedTypes = organisationService.getSupportedAdHocReports(params.projectId)

        if (params.type in supportedTypes) {

            def activity = [projectId: params.projectId, type: params.type, description: params.type, plannedStartDate: params.plannedStartDate, plannedEndDate: params.plannedEndDate]

            def response = activityService.create(activity)
            if (response.resp.activityId) {
                chain(controller: 'activity', action: 'enterData', id: response.resp.activityId, params:[returnTo:params.returnTo])
            }
        }
        else {
            // Go back to where we were before.
            render ''
        }
    }
}

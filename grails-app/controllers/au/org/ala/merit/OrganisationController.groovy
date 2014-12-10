package au.org.ala.merit

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
            [name:it, dataModel:metadataService.annotatedOutputDataModel(it)]
        }

        def criteria = [type:activityType, projectId:organisation.projects.collect{it.projectId}, plannedStartDate:params.plannedStartDate, plannedEndDate:params.plannedEndDate]

        def activityResp = activityService.search(criteria)
        def activities = activityResp?.resp.activities

        // augment each activity with project name so we can display it.
        activities.each { activity ->
            activity.projectName = organisation.projects.find{it.projectId == activity.projectId}.name
        }

        render view: '/activity/bulkEdit', model:[organisation:organisation, title:activityService.defaultDescription([type:activityType, plannedStartDate:params.plannedStartDate, plannedEndDate:params.plannedEndDate]), activities:activities, outputModels:outputModels]

    }
}

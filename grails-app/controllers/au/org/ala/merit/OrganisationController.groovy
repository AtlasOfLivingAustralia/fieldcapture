package au.org.ala.merit

import grails.converters.JSON
import org.joda.time.Period

/**
 * Extends the plugin OrganisationController to support Green Army project reporting.
 */
class OrganisationController extends au.org.ala.fieldcapture.OrganisationController {

    def activityService, metadataService, projectService

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

    /** Temporary method to prepopulate Green Army projects and reporting activities */
    def prepopGreenArmy() {


        def resp = projectService.search([associatedProgram:'Green Army', view:'flat'])

        if (resp?.resp?.projects) {
            def projects = resp.resp.projects
            def projectsByOrg = projects.groupBy{it.serviceProviderName}

            projectsByOrg.each{org, orgProjects ->
                if (!org) {
                    return
                }
                def reportProjectName = org+' Green Army Reporting'
                def orgReportProject = orgProjects.find{ it.name == reportProjectName }
                if (!orgReportProject) {
                    orgReportProject = [
                            externalId:org+'-Report',
                            name:reportProjectName,
                            plannedStartDate:orgProjects.min{it.plannedStartDate}.plannedStartDate,
                            plannedEndDate:orgProjects.max{it.plannedEndDate}.plannedEndDate,
                            associatedProgram:'Green Army',
                            description:'This project is to support the reporting requirements of the Green Army Programme',
                            organisationName:org,
                            serviceProviderName:org
                    ]
                    def result = projectService.create(orgReportProject)
                    orgReportProject.projectId = result.resp.projectId

                }
                projectService.createReportingActivitiesForProject(orgReportProject.projectId, [[period: Period.months(3), type:'Green Army - Quarterly project report']])

                orgProjects.each { project ->
                    if (project.projectId == orgReportProject.projectId) {
                        return
                    }

                    projectService.createReportingActivitiesForProject(project.projectId, [[period: Period.months(1), type:'Green Army - Monthly project status report']])
                }
            }


            render projectsByOrg as JSON
        }


    }
}

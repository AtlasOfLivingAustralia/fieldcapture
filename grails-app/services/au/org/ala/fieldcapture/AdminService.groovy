package au.org.ala.fieldcapture

/**
 * A delegate to the ecodata admin services.
 */
class AdminService {

    def grailsApplication,webService,projectService, siteService, userService, activityService, documentService

    /**
     * Triggers a full site re-index.
     */
    def reIndexAll() {
        webService.getJson(grailsApplication.config.ecodata.baseUrl + 'admin/reIndexAll')
    }

    /** One shot migration exercise, easier to do in grails than in javascript */
    def doNlpMigration() {


    }

    private static def NLP_CHANGE_OVER_DATE = '2014-12-31T14:00:00Z';
    def migrateToNlp(projectId) {
        def project = projectService.get(projectId, 'all')

        def sites = project.remove('sites')
        def activities = project.remove('activities')
        def documents = project.remove('documents')
        def users = projectService.getMembersForProjectId(projectId)

        project.remove('projectId')
        project.remove('outputTargets')
        def timeline = project.remove('timeline')

        def oldPrjTimeline = []
        def newPrjTimeline = []
        int newStage = 1
        timeline.each {
            if (it.toDate <= NLP_CHANGE_OVER_DATE) {
                oldPrjTimeline << it
            }
            else {
                it.name = "Stage ${newStage}"
                newPrjTimeline << it
                newStage ++
            }
        }

        def toUpdate = [plannedEndDate:NLP_CHANGE_OVER_DATE, timeline:oldPrjTimeline]
        projectService.update(projectId, toUpdate)

        // New project.
        project.timeline = newPrjTimeline
        project.originalProjectId = projectId // In case we need this later.
        project.grantId = ''
        project.externalId = ''
        project.funding = 0
        project.plannedStartDate = NLP_CHANGE_OVER_DATE
        project.associatedProgram = 'National Landcare Programme'
        project.associatedSubProgram = 'Regional Delivery'

        // Save the new project.
        def newId = projectService.update('', project).resp.projectId

        // Add the existing sites to the new project.
        def sitesToUpdate = sites.collect{it.siteId}
        siteService.updateProjectAssociations([projectId:newId, sites:sitesToUpdate])

        // Add existing users to new projects
        users.each {
            userService.addUserAsRoleToProject(it.userId, newId, it.role)
        }

        documents.each { document ->
            document.documentId = ''
            document.projectId = newId
            documentService.updateDocument(document)
        }

        def nlpActivities = []
        activities.each {
            if (it.plannedEndDate >= NLP_CHANGE_OVER_DATE) {
                nlpActivities << it
            }
        }
        def activitiesToUpdate = nlpActivities.collect{it.activityId}
        activityService.bulkUpdateActivities(activitiesToUpdate, [projectId:newId])

        [origProject:toUpdate, newProject:project, sites:sitesToUpdate, activities:activitiesToUpdate]
    }
}

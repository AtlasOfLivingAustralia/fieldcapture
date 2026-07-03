package au.org.ala.merit.reports


import au.org.ala.merit.OutputService
import au.org.ala.merit.PublicationStatus
import org.springframework.beans.factory.annotation.Autowired

class GrantsReportLifecycleListener extends NHTOutputReportLifecycleListener {
    @Autowired
    OutputService outputService

    @Override
    Map getContextData(Map project, Map report, Map activity) {
        Map contextData = super.getContextData(project, report, activity)

        // Find reports older than this one that have the same activity type and are not cancelled
        List previousReports = project.reports?.findAll {
            it.toDate < report.toDate && it.activityType == report.activityType && it.publicationStatus != PublicationStatus.CANCELLED
        }

        List previouslyReportedProjectOutcomes = []
        if (previousReports) {
            // We are only interested in the first section of the report.
            Map criteria = [name: 'Overview Output Report', activityId: previousReports*.activityId]
            Map results = outputService.search(criteria)
            List outputs = results?.resp?.outputs ?: [] // The query should return at most a single output
            previouslyReportedProjectOutcomes = outputs.collect {
                [reportName: previousReports.find{it.activityId == it.activityId}?.name ?: 'Unknown report',
                projectOutcomes: it.data?.projectOutcomes]
            }
        }
        contextData.previouslyReportedProjectOutcomes = previouslyReportedProjectOutcomes
        contextData.outcomeTargets = projectService.getOutcomeTargetsForProject(project, report, activity)

        return contextData
    }


}

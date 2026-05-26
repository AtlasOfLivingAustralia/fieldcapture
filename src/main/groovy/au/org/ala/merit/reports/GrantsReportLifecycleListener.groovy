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
        Map previousReport = previousReports?.max { it.toDate }

        Map progressSectionFromPreviousReport = null
        if (previousReport) {
            // We are only interested in the first section of the report.
            Map criteria = [name: 'Overview Output Report', activityId: previousReport.activityId]
            Map results = outputService.search(criteria)
            Map output = results?.outputs ? results.outputs[0] : [] // The query should return at most a single output
            progressSectionFromPreviousReport = output?.data?.progressSection
        }
        contextData.progressSectionFromPreviousReport = progressSectionFromPreviousReport

        Map targetsForThisReport = project.outputTargets?.findAll {
            it.periodEnd == report.toDate
        }

        contextData.targetsForThisReport = targetsForThisReport

        return contextData
    }
}

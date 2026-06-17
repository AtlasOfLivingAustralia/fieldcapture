package au.org.ala.merit.reports

import au.org.ala.merit.OutputService
import au.org.ala.merit.PublicationStatus
import au.org.ala.merit.Score
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

        List targetsForThisReport = targetsForReportingPeriod(project, report)

        contextData.outcomeTargets = targetsForThisReport

        Map result = projectService.getServiceDashboardData(project.projectId, false)
        result.services.each { Map service ->
            service.scores?.each { Score score ->
                Map byOutcome = score.relatedScores.find{it.description == 'By outcome'}
                if (byOutcome) {
                    Score outcomeScore = byOutcome.score
                    outcomeScore?.result?.groups?.each { Map group ->
                        String outcomeGroup = group.group
                        def outcomeDelivered = group.results?[0]?.result

                        Map outcome = targetsForThisReport.find{it.relatedOutcomes == outcomeGroup}
                        Map outcomeTarget = outcome?.deliveredAgainstOutcomes?.find{it.scoreId == score.scoreId}
                        if (outcomeTarget) {
                            outcomeTarget.deliveredApproved = outcomeDelivered ?: 0
                        }
                    }
                }
            }
        }

        return contextData
    }

    private List<Map> targetsForReportingPeriod(Map project, Map report) {
        List<Map> outcomeTargetsForReport = []
        List scoresForProject =  projectService.getProjectServices(project)
        project.outputTargets?.each { Map outputTarget ->

            outputTarget.outcomeTargets?.each { Map outcomeTarget ->

                String outcomeTargetKey = new ArrayList(outcomeTarget.relatedOutcomes)?.join(',')
                Map outcome = outcomeTargetsForReport.find{it.relatedOutcomes == outcomeTargetKey}
                if (!outcome) {
                    List outcomeStatements = project.custom?.details?.outcomes?.projectTermOutcomes?.findAll { it.code in outcomeTarget.relatedOutcomes }?.collect { it.description }
                    outcome = [relatedOutcomes: new ArrayList(outcomeTarget.relatedOutcomes)?.join(', '), outcomeStatements: outcomeStatements?.join(','), deliveredAgainstOutcomes: []]
                    outcomeTargetsForReport << outcome
                }

                Map periodTarget = outcomeTarget.periodTargets?.find { Map periodTarget ->
                    periodTarget.periodStart < report.toDate && periodTarget.periodEnd >= report.toDate
                }
                String label = null
                scoresForProject.find { Map service ->
                    Map score = service.scores?.find{it.scoreId == outputTarget.scoreId }
                    if (score) {
                        label = service.name + ' - ' + score.label
                    }
                    score
                }

                outcome.deliveredAgainstOutcomes << [scoreId: outputTarget.scoreId, targetMeasureLabel: label ?: outputTarget.scoreId, target: outcomeTarget.target, periodTarget: periodTarget?.target ?: 0]

            }
        }
        outcomeTargetsForReport.sort { it.relatedOutcomes }
        outcomeTargetsForReport.each {
            it.deliveredAgainstOutcomes.sort { it.targetMeasureLabel }
        }
        outcomeTargetsForReport
    }
}

package au.org.ala.merit.reports

import au.org.ala.merit.ProjectConfigurationService
import au.org.ala.merit.PublicationStatus
import au.org.ala.merit.config.ProgramConfig
import org.springframework.beans.factory.annotation.Autowired

class NHTOutcomes2ReportLifecycleListener extends ReportLifecycleListener {

    static final String OUTCOMES_1_REPORT_TYPE = "NHT Outcomes 1 Report"

    @Autowired
    ProjectConfigurationService projectConfigurationService

    @Override
    Map getContextData(Map project, Map report, Map activity) {

        ProgramConfig config = projectConfigurationService.getProjectConfiguration(project)
        // If outcomes report 1 has been marked as not required, by default any short term outcomes will
        // have to be reported on in outcomes report 2.  This behaviour can be overwritten in the program
        // configuration using the excludeShortTermOutcomesIfReportNotRequired setting.
        boolean hasReportedOnShortTermOutcomes = project.reports?.find{
            it.activityType == OUTCOMES_1_REPORT_TYPE && (config.excludeShortTermOutcomesIfReportNotRequired() || it.publicationStatus != PublicationStatus.CANCELLED) } != null
        List<Map> outcomesToReportOn = []
        List shortTermOutcomes = project.custom?.details?.outcomes?.shortTermOutcomes
        if (!hasReportedOnShortTermOutcomes && shortTermOutcomes) {
            outcomesToReportOn.addAll(shortTermOutcomes)
        }
        List midTermOutcomes = project.custom?.details?.outcomes?.midTermOutcomes
        if (midTermOutcomes) {
            outcomesToReportOn.addAll(midTermOutcomes)
        }

        [projectOutcomes: outcomesToReportOn]
    }
}

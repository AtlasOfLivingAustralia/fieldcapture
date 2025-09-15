package au.org.ala.merit.reports

import au.org.ala.merit.PublicationStatus

class NHTOutcomes2ReportLifecycleListener extends ReportLifecycleListener {

    static final String OUTCOMES_1_REPORT_TYPE = "NHT Outcomes 1 Report"

    @Override
    Map getContextData(Map project, Map report, Map activity) {

        boolean hasReportedOnShortTermOutcomes = project.reports?.find{it.activityType == OUTCOMES_1_REPORT_TYPE && it.publicationStatus != PublicationStatus.CANCELLED} != null
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

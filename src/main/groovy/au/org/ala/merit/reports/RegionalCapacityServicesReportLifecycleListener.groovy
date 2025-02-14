package au.org.ala.merit.reports

import au.org.ala.merit.MetadataService
import au.org.ala.merit.OrganisationService
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired

@Slf4j
class RegionalCapacityServicesReportLifecycleListener extends ReportLifecycleListener {

    @Autowired
    OrganisationService organisationService

    @Autowired
    MetadataService metadataService

    private static String TOTAL_REPORTED_VALUE_SCORE_NAME = 'totalValueServicesContractedToFirstNations'

    Map getContextData(Map organisation, Map report, Map activity) {
        List outputTargets = organisation.custom?.details?.services?.targets
        Map periodTargets = getTargetsForReportPeriod(report, outputTargets)
        def funding = getFundingForPeriod(organisation, report)
        def reportedFundingExcludingThisReport = getReportedFundingToDate(organisation, activity)
        [periodTargets:periodTargets, totalContractValue:funding, reportedFundingExcludingThisReport:reportedFundingExcludingThisReport]
    }

    private double getFundingForPeriod(Map organisation, Map report) {
        String endDate = report.toDate
        organisationService.getRcsFundingForPeriod(organisation, endDate)

    }

    private double getReportedFundingToDate(Map organisation, Map activity) {
        Map score = metadataService.findScoreByName(TOTAL_REPORTED_VALUE_SCORE_NAME)
        if (!score) {
            log.error("No score found for organisation ${organisation.id} and score name ${TOTAL_REPORTED_VALUE_SCORE_NAME}")
            return 0
        }
        List scoreData = organisationService.scoresForOrganisation(organisation, [score.scoreId], false)

        double firstNationsServicesTotal = 0
        Map firstNationsServicesScore = scoreData[0]
        if (firstNationsServicesScore) {
            firstNationsServicesTotal = firstNationsServicesScore.result?.result ?: 0
            String amountReportedThisPeriod = activity?.outputs?[0]?.data?.servicesContractedValueFirstNations
            double reportedAmountThisReport = amountReportedThisPeriod ? Double.valueOf(amountReportedThisPeriod) : 0

            firstNationsServicesTotal -= reportedAmountThisReport
        }
        return firstNationsServicesTotal
    }
}

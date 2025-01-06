package au.org.ala.merit.reports

import au.org.ala.merit.OrganisationService
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired

@Slf4j
class RegionalCapacityServicesReportLifecycleListener extends ReportLifecycleListener {

    @Autowired
    OrganisationService organisationService

    Map getContextData(Map organisation, Map report) {
        List outputTargets = organisation.custom?.details?.services?.targets
        Map periodTargets = getTargetsForReportPeriod(report, outputTargets)
        def funding = getFundingForPeriod(organisation, report)
        [periodTargets:periodTargets, totalContractValue:funding]
    }

    private static def getFundingForPeriod(Map organisation, Map report) {
        String endDate = report.toDate
        String previousPeriod = ''
        def index = organisation.custom?.details?.funding?.headers?.findIndexOf {
            String period = it.data.value
            boolean result = previousPeriod < endDate && period >= endDate
            previousPeriod = period
            result
        }
        index >= 0 ? organisation.custom?.details?.funding?.rows[0].costs[index].dollar : 0

    }
}

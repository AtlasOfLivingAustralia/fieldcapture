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
        BigDecimal budget = new BigDecimal(0) // TODO get budget from the correct period of the budget table
        [periodTargets:periodTargets, budget:budget]
    }
}

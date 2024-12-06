import au.org.ala.merit.CheckRisksAndThreatsTask
import au.org.ala.merit.MeritServletContextConfig
import au.org.ala.merit.StatisticsFactory
import au.org.ala.merit.hub.HubAwareLinkGenerator
import au.org.ala.merit.reports.NHTOutputReportLifecycleListener
import au.org.ala.merit.reports.RegionalCapacityServicesReportLifecycleListener
import au.org.ala.merit.util.ProjectGroupingHelper

// Place your Spring DSL code here
beans = {
    xmlns task: "http://www.springframework.org/schema/task"
    task.'annotation-driven'('proxy-target-class': true)

    // Overriding the default grailsLinkGenerator with our class that can include the hub path in generated URLs
    grailsLinkGenerator(HubAwareLinkGenerator, grailsApplication.config.getProperty('grails.serverURL'))

    statisticsFactory(StatisticsFactory)

    checkForRisksAndThreatsTask(CheckRisksAndThreatsTask)

    projectGroupingHelper(ProjectGroupingHelper)

    // The non-standard case is used because the name is derived from the activity type
    NHTOutputReport(NHTOutputReportLifecycleListener)
    GrantsandOthersProgressReport(NHTOutputReportLifecycleListener)
    ProcurementOutputReport(NHTOutputReportLifecycleListener)
    RegionalCapacityServicesReport(RegionalCapacityServicesReportLifecycleListener)

    meritServletContextConfig(MeritServletContextConfig)
}

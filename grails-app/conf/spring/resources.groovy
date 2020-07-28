
import au.org.ala.merit.hub.HubAwareLinkGenerator
import au.org.ala.merit.StatisticsFactory
import au.org.ala.merit.CheckRisksAndThreatsTask

// Place your Spring DSL code here
beans = {
    xmlns task: "http://www.springframework.org/schema/task"
    task.'annotation-driven'('proxy-target-class': true)

    // Overriding the default grailsLinkGenerator with our class that can include the hub path in generated URLs
    grailsLinkGenerator(HubAwareLinkGenerator, grailsApplication.config.grails.serverURL)

    statisticsFactory(StatisticsFactory)

    checkForRisksAndThreatsTask(CheckRisksAndThreatsTask)
}

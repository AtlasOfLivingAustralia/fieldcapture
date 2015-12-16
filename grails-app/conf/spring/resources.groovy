import au.org.ala.fieldcapture.hub.HubAwareLinkGenerator
import au.org.ala.merit.StatisticsFactory

// Place your Spring DSL code here
beans = {
    // Overriding the default grailsLinkGenerator with our class that can include the hub path in generated URLs
    grailsLinkGenerator(HubAwareLinkGenerator, grailsApplication.config.grails.serverURL)

    statisticsFactory(StatisticsFactory)
}

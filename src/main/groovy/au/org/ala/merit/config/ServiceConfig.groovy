package au.org.ala.merit.config


/**
 * Describes the relationship between a Service and the FormSection and Scores that are used
 * to collect and measure data for that Service.
 */
class ServiceConfig {

    /** The id of the service */
    Integer serviceId

    /** The FormSection of the service form that collects data for this Service */
    String formSectionName

    /** List of scoreIds describing the targets allowed to be selected for this service */
    List<String> serviceTargets

}

/** Describes how a Program collects and measures data for the set of available Services */
class ProgramServiceConfig {
    String serviceFormName
    List<ServiceConfig> programServices
}

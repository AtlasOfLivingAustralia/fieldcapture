package au.org.ala.merit.reports

/**
 * Responsible for obtaining report specific data to render into a report template.
 * Report config beans are looked up in the applicationContext by name based on the report type and the
 * program configuration.
 */
class ReportData {
    Map getContextData(Map context) { [:] }
    Map getOutputData(Map context, Map outputConfig) { [:] }
}

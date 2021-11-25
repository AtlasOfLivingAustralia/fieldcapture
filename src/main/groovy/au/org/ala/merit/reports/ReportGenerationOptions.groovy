package au.org.ala.merit.reports

import groovy.transform.EqualsAndHashCode

@EqualsAndHashCode
class ReportGenerationOptions {
    boolean updateActivities = false
    boolean includeSubmittedAndApprovedReports = false
    boolean keepExistingReportDates = false
    String dateChangeReason
}

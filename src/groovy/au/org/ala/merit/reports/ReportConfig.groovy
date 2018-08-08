package au.org.ala.merit.reports

import au.org.ala.merit.DateUtils
import org.joda.time.DateTime
import org.joda.time.Period

/**
 * Parameters that specify how a sequence of reports should be generated.
 */
class ReportConfig {

    int minimumReportDurationInDays = 7

    /** The date the first reporting period should end.  Used to align reports across programs */
    String firstReportingPeriodEnd = null

    /** The period between the start and end date of generated reports */
    Integer reportingPeriodInMonths = 6

    /** True if the start and end dates for generated reports should be aligned from January 1 */
    boolean reportsAlignedToCalendar = false

    /**
     * Template for the generated report name as per java.text.Format pattern.  Parameters passed
     * when evaluating the format are: index (the sequence number of this report in the list of reports of
     * the same type), report start date, report end date, owner name
     */
    String reportNameFormat = null

    /**
     * Template for the generated report description as per java.text.Format pattern.  Parameters passed
     * when evaluating the format are: index (the sequence number of this report in the list of reports of
     * the same type), report start date, report end date, owner name
     */
    String reportDescriptionFormat = null

    /** Nullable, if specified an activity will be created and kept in sync with changes to this report */
    String activityType = null

    /** Type of report.  "Activity" or "Administrative" */
    String reportType = null

    /** Specifies a due date for the report after the end of the reporting period */
    Integer weekDaysToCompleteReport = 0

    String category = null

    /** Short description of this type of report */
    String description = null

    /** Multiple reports should be generated from this configuration if they fit into the owner's time constraints.
     * If this value is false, the single report will be aligned with the owners time constraints */
    boolean multiple = true

    /**
     * For reports with multiple=false and no reportingPeriodInMonths supplied, this property acts to suppress
     * the creation of reports for owners with durations less than this value.
     */
    Integer minimumPeriodInMonths = null


    DateTime getFirstReportingPeriodEnd() {
        firstReportingPeriodEnd ? DateUtils.parse(firstReportingPeriodEnd) : null
    }

    Period getReportingPeriod() {
        Period.months(reportingPeriodInMonths)
    }
}

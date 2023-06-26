package au.org.ala.merit.config

import au.org.ala.merit.DateUtils
import au.org.ala.merit.reports.ReportOwner
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.joda.time.Period

/**
 * Parameters that specify how a sequence of reports should be generated.
 */
class ReportConfig {

    int minimumReportDurationInDays = 7

    /** The date the first reporting period should end.  Used to align reports across programs */
    String firstReportingPeriodEnd = null

    /** The generate report before.  Used to align reports across programs */
    String onlyGenerateReportsForDatesBefore = null
    /** Allows reporting dates to be explicitly specified if they are not periodic */
    List<String> endDates

    /** The period between the start and end date of generated reports */
    Integer reportingPeriodInMonths = 6

    /**
     * Used only with periodic reports, set to true to not generate the last report in the series. The use
     * case for this is having a periodic progress report, with a final report containing extra / more / different
     * fields.
     */
    boolean skipFinalPeriod = false

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

    /**
     * A banner to display important information about a report. e.g. to inform users that reports are
     * not currently available due to a planned redesign / modification to the report
     */
    String banner = null

    /** Multiple reports should be generated from this configuration if they fit into the owner's time constraints.
     * If this value is false, the single report will be aligned with the owners time constraints */
    boolean multiple = true

    /**
     * Only used for reports with multiple = false, determines whether the report should be generated such that
     * it starts at the start of the owners date range.
     */
    boolean alignToOwnerStart = true

    /**
     * Only used for reports with multiple = false, determines whether the report should be generated such that
     * it ends at the end of the owners date range.
     */
    boolean alignToOwnerEnd = false

    boolean canSubmitDuringReportingPeriod = false

    /** Identifier attached to generated reports to identify this configuration */
    String label = null

    /**
     * For reports with multiple=false and no reportingPeriodInMonths supplied, this property acts to suppress
     * the creation of reports for owners with durations less than this value.
     */
    Integer minimumPeriodInMonths = null

    /**
     * List of reasons to display when a report generated from this config is returned for rework.
     * If null, no reasons will be displayed, only a free text field.
     */
    List rejectionReasonCategoryOptions


    DateTime getFirstReportingPeriodEnd() {
        DateTime end = null
        if (firstReportingPeriodEnd) {
            end = DateUtils.parse(firstReportingPeriodEnd)
        }
        else if (endDates) {
            end = DateUtils.parse(endDates[0])
        }
        end
    }

    List<DateTime> getReportEndDates() {
        endDates.collect {
            DateUtils.parse(it)
        }
    }

    Period getReportingPeriod() {
        Period.months(reportingPeriodInMonths)
    }

    String getLabel() {
        label ?: category
    }

    /** Specifies the type of activity to be used if an adjustment to this report is required */
    String adjustmentActivityType

    /**
     * An adjustable report specifies an activity type (adjustmentActivityType) that can be used to adjust the
     * contents of the report described by this configuration after it has been approved.
     */
    boolean isAdjustable() {
        return adjustmentActivityType != null
    }

    DateTime getOnlyGenerateReportsForDatesBefore() {
        DateTime beforeDate = null
        if (onlyGenerateReportsForDatesBefore){
            beforeDate =  DateUtils.parse(onlyGenerateReportsForDatesBefore)
        }
        beforeDate
    }

    /** The first date any reports generated by this config can cover.  If null the ReportOwner periodStart will be used. */
    String periodStart

    /** The last date any reports generated by this config can cover. If null the ReportOwner periodStart will be used. */
    String periodEnd

    DateTime getPeriodStart(ReportOwner reportOwner) {
        return periodStart ? DateUtils.parse(periodStart) : reportOwner.getPeriodStart()
    }

    DateTime getPeriodEnd(ReportOwner reportOwner) {
        return periodEnd ? DateUtils.parse(periodEnd) : reportOwner.getPeriodEnd()
    }

}

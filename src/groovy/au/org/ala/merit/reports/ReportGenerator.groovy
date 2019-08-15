package au.org.ala.merit.reports

import au.org.ala.merit.DateUtils
import org.apache.commons.logging.LogFactory
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.joda.time.Interval
import org.joda.time.Period
import org.joda.time.PeriodType


/** Responsible for generating a list of reports for an entity from configuration (e.g. Project, Organisation, Program */
class ReportGenerator {

    private static final log = LogFactory.getLog(ReportGenerator)
    /**
     * Fudge factor applied to date calculations.  This is required because date intervals for reports
     * start and end at the same instant to avoid gaps.
     * A report will often start and end at midnight on the first day of a month, but when determining the
     * month or year the report falls into, we normally want to display the previous day.
     * e.g. a report from 2018-06-30T14:00:00Z (2018-07-01T00:00:00 AEST) to 2018-09-30T14:00:00Z (2018-10-01T00:00:00 AEST)
     * would normally be displayed as 1st July - 30 September
     * and similarly, a report from 2019-03-31T13:00:00Z to 2019-06-30T14:00:00Z would be displayed as
     * 1st March - 30 June and fall into the 2018/2019 financial year, despite date arithmetic on the end date
     * normally placing it on July 1 2019.
     */
    private int DATE_FUDGE_FACTOR = 1

    /**
     * Generates a list of reports according to the supplied configuration.
     * @param reportConfig Describes the frequency and properties of generated reports.
     * @param reportOwner Constrains the configuration to a particular date range and supplies properties for generated reports
     * @param startingSequenceNo the sequence number for the first report.  Required for name generation in the case that not
     * all reports are being regenerated.
     */
    List<Map> generateReports(ReportConfig reportConfig, ReportOwner reportOwner, int startingSequenceNo, DateTime latestApprovedReportPeriodEnd) {

        Period period = Period.months(reportConfig.reportingPeriodInMonths)

        DateTime endDate = reportOwner.periodEnd.withZone(DateTimeZone.default)

        int sequenceNo = startingSequenceNo

        List<Map> reports = []

        if (reportConfig.multiple) {
            Interval reportInterval = determineFirstReportInterval(reportConfig, reportOwner, latestApprovedReportPeriodEnd)

            log.info "Regenerating reports starting at sequence: "+sequenceNo+" from: "+reportInterval.start+" ending at: "+reportInterval.end

            while (reportInterval.start < endDate.minusDays(DATE_FUDGE_FACTOR)) {

                reports << createReport(reportConfig, reportOwner, sequenceNo, reportInterval)
                sequenceNo++
                reportInterval = new Interval(reportInterval.end, reportInterval.end.plus(period))
            }
        }
        else {

            // Single reports are aligned with the owner dates.
            DateTime start = reportOwner.periodStart.withZone(DateTimeZone.default)

            DateTime end = endDate
            if (reportConfig.getFirstReportingPeriodEnd()) {
                end = reportConfig.getFirstReportingPeriodEnd()
            }
            else if (reportConfig.reportingPeriodInMonths) {
                end = start.plus(period)
            }
            Interval reportInterval = new Interval(start, end)

            // If the report minimumPeriodInMonths has been specified, only create the report if the owner duration
            // is greater than the minimum period.
            if (!reportConfig.minimumPeriodInMonths || reportInterval.toPeriod(PeriodType.months()).getMonths() >= reportConfig.minimumPeriodInMonths) {
                log.info("Regenerating a single report from "+reportInterval.start+" to "+reportInterval.end)
                reports << createReport(reportConfig, reportOwner, 1, reportInterval)
            }
            else{
                log.info("Not regenerating report "+reportConfig.category+" because owner duration too short: "+reportInterval.toPeriod(PeriodType.months()).getMonths() +" < "+reportConfig.minimumPeriodInMonths)
            }

        }
        alignEndDates(reports, reportOwner.periodEnd, reportConfig)

        reports
    }

    /**
     * It will normally make sense to align the final report with the end date of the report owner.
     * The only case this currently won't be done is for single reports that finish before the project end.
     * @param reports reports to check
     * @param ownerEndDate the end date of the report owner (e.g project / program etc)
     * @param reportConfig the configuration used to generate the reports
     */
    private void alignEndDates(List<Map> reports, DateTime ownerEndDate, ReportConfig reportConfig) {
        if (reports) {
            String finalToDate = DateUtils.format(ownerEndDate.withZone(DateTimeZone.UTC))

            // Don't align the end date if there is only one report and it finishes before the owner end date.
            // This is to support single reports due on year 3 of the project (specifically the RLP Outcomes 1 Report)
            if (reports.size() > 1 || reports[-1].toDate > finalToDate) {
                reports[-1].toDate = finalToDate

                if (!reportConfig.canSubmitDuringReportingPeriod) {
                    reports[-1].submissionDate = finalToDate
                }

            }

        }
    }

    private Map createReport(ReportConfig reportConfig, ReportOwner reportOwner, int sequenceNo, Interval reportInterval) {

        DateTime startDate = reportInterval.start
        DateTime endDate = reportInterval.end
        String toDate = DateUtils.format(endDate.withZone(DateTimeZone.UTC))
        String fromDate = DateUtils.format(startDate.withZone(DateTimeZone.UTC))
        Map report = [
                fromDate:fromDate,
                toDate:toDate,
                name:format(reportConfig.reportNameFormat, reportConfig, reportOwner, sequenceNo, startDate, endDate),
                description:format(reportConfig.reportDescriptionFormat, reportConfig, reportOwner, sequenceNo, startDate, endDate),
                category:reportConfig.category,
                type:reportConfig.reportType,
                submissionDate:reportConfig.canSubmitDuringReportingPeriod ? fromDate : toDate
        ]
        if (reportConfig.activityType) {
            report.activityType = reportConfig.activityType
        }
        report.putAll(reportOwner.id)


        if (reportConfig.weekDaysToCompleteReport) {
            report.dueDate = DateUtils.format(endDate.plusDays(reportConfig.weekDaysToCompleteReport).withZone(DateTimeZone.UTC))
        }

        report
    }

    /**
     * This method will determine the st
     * art and end dates for the first report to be generated based on the supplied contextual information.
     * The rules are:
     * * Report generation must start after any approved or submitted reports.
     * * The reports must fit within the report owners time constraints.
     * * The configuration can supply the end of the first reporting period directly or specifiy that reports should align to the
     * calendar year.
     */
    private Interval determineFirstReportInterval(ReportConfig reportConfig, ReportOwner reportOwner, DateTime periodStart) {

        DateTime startConstraint = periodStart && periodStart > reportOwner.periodStart ? periodStart : reportOwner.periodStart
        startConstraint = startConstraint.withZone(DateTimeZone.default)

        Period period = reportConfig.getReportingPeriod()

        // If the reporting config specifies the end date of the first period, start with that.
        DateTime firstReportPeriodEnd = reportConfig.getFirstReportingPeriodEnd()
        if (firstReportPeriodEnd) {
            firstReportPeriodEnd = firstReportPeriodEnd.withZone(DateTimeZone.default)
            // It is possible that the first report period end is before the constrained reporting start.  This could happen with
            // approved reports or in the case of program aligned reporting.  (e.g the first report date is specified at a program level
            // and projects that start after the beginning of the program need to align to the dates)
            while (firstReportPeriodEnd < startConstraint.plusDays(reportConfig.minimumReportDurationInDays)) {
                firstReportPeriodEnd = firstReportPeriodEnd.plus(period)
            }
        }
        else {
            // Otherwise we align the reports to the owners reporting time constraints
            if (reportConfig.reportsAlignedToCalendar) {
                DateTime alignedStartDate = DateUtils.alignToPeriod(startConstraint, period)
                firstReportPeriodEnd = alignedStartDate.plus(period)
            }
            else {
                firstReportPeriodEnd = startConstraint.plus(period)
            }
        }

        return new Interval(startConstraint, firstReportPeriodEnd)
    }

    /**
     * Formats a report name or description allowing for a range of different parameters and format options.
     * @param pattern the (java.util.Formatter) pattern that specifies the format
     * @param config the report config
     * @param owner the report owner
     * @param sequenceNo the sequence number of the report being generated
     * @param fromDate the date from which the report period starts
     * @param toDate the date at which the report period ends
     * @return a formatted string.
     */
    private String format(String pattern, ReportConfig config, ReportOwner owner, int sequenceNo, DateTime fromDate, DateTime toDate) {

        DateTime endOfReport = toDate.withZone(DateTimeZone.default).minusDays(DATE_FUDGE_FACTOR)
        int financialYearEnd = DateUtils.alignToFinancialYear(endOfReport).getYear()
        String financialYear = "${financialYearEnd}/${financialYearEnd+1}"
        String period = config.reportingPeriodInMonths+"M"
        // month of year is 0 based, and we are offsetting by 6 months to align with the financial year to get
        // the sequence number of this report based on "number of reports per financial year"
        int sequenceInFinancialYear = config.reportingPeriodInMonths ? Math.floor(((endOfReport.getMonthOfYear()+5)%12)/config.reportingPeriodInMonths)+1 : 1

        return sprintf(pattern, sequenceNo, fromDate.toDate(), toDate.toDate(), owner.name, financialYear, period, sequenceInFinancialYear)
    }
}

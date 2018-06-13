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
     * Generates a list of reports according to the supplied configuration.
     * @param reportConfig Describes the frequency and properties of generated reports.
     * @param reportOwner Constrains the configuration to a particular date range and supplies properties for generated reports
     * @param startingSequenceNo the sequence number for the first report.  Required for name generation in the case that not
     * all reports are being regenerated.
     */
    List<Map> generateReports(ReportConfig reportConfig, ReportOwner reportOwner, int startingSequenceNo, DateTime latestApprovedReportPeriodEnd) {

        int DATE_FUDGE_FACTOR = 1; // allow dates to not line up exactly to deal with time zone differences.

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
            if (reportConfig.reportingPeriodInMonths) {
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

        // Align the report end dates to the owning entities date constraints
        if (reports) {
            reports[-1].toDate = DateUtils.format(reportOwner.periodEnd.withZone(DateTimeZone.UTC))
        }

        reports
    }

    private Map createReport(ReportConfig reportConfig, ReportOwner reportOwner, int sequenceNo, Interval reportInterval) {

        DateTime startDate = reportInterval.start
        DateTime endDate = reportInterval.end
        Map report = [
                fromDate:DateUtils.format(startDate.withZone(DateTimeZone.UTC)),
                toDate:DateUtils.format(endDate.withZone(DateTimeZone.UTC)),
                name:sprintf(reportConfig.reportNameFormat, sequenceNo, startDate.toDate(), endDate.toDate(), reportOwner.name),
                description:sprintf(reportConfig.reportDescriptionFormat, sequenceNo, startDate.toDate(), endDate.toDate(), reportOwner.name),
                category:reportConfig.category,
                type:reportConfig.reportType,
                activityType:reportConfig.activityType
        ]
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
    private Interval determineFirstReportInterval(ReportConfig reportConfig, ReportOwner reportOwner, DateTime latestApprovedReportPeriodEnd) {

        DateTime startConstraint = latestApprovedReportPeriodEnd && latestApprovedReportPeriodEnd > reportOwner.periodStart ? latestApprovedReportPeriodEnd : reportOwner.periodStart
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
}

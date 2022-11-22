package au.org.ala.merit.reports

import au.org.ala.merit.DateUtils
import au.org.ala.merit.config.ReportConfig
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

    private static final String REPORT_NOT_APPROVED = 'unpublished'

    /**
     * Generates a list of reports according to the supplied configuration.
     * @param reportConfig Describes the frequency and properties of generated reports.
     * @param reportOwner Constrains the configuration to a particular date range and supplies properties for generated reports
     * @param startingSequenceNo the sequence number for the first report.  Required for name generation in the case that not
     * all reports are being regenerated.
     */
    List<Map> generateReports(ReportConfig reportConfig, ReportOwner reportOwner, int startingSequenceNo, DateTime latestApprovedReportPeriodEnd, List existingReports = null) {

        Period period = Period.months(reportConfig.reportingPeriodInMonths)

        // We truncate the time to midnight to account for the fact that some older projects were
        // loaded at UTC midnight (newer ones use AEST/ADST) which causes issues with the new requirement the reports must be
        // able to be generated to a single day precision.
        DateTime endDate = reportOwner.periodEnd.withZone(DateTimeZone.default).withTimeAtStartOfDay()
        DateTime onlyGenerateReportsForDatesBefore = reportConfig.onlyGenerateReportsForDatesBefore

        List<Map> reports
        if (!onlyGenerateReportsForDatesBefore || reportOwner.periodStart.isBefore(onlyGenerateReportsForDatesBefore)) {
            if (reportConfig.multiple && !reportConfig.endDates) {
                reports = generatePeriodicReports(reportConfig, reportOwner, latestApprovedReportPeriodEnd, startingSequenceNo, endDate, period)
            } else if (reportConfig.endDates) {
                reports = generateNonPeriodicReportsByDate(latestApprovedReportPeriodEnd, reportOwner, reportConfig, endDate, startingSequenceNo)
            } else {
                reports = generateSingleReport(reportOwner, endDate, reportConfig, period, existingReports)
            }
            alignEndDates(reports, reportOwner.periodEnd, reportConfig)
        }
        reports
    }

    private List<Map> generateSingleReport(ReportOwner reportOwner, DateTime endDate, ReportConfig reportConfig, Period period, List existingReports) {
        List<Map> reports = []
        // Single reports are aligned with the owner dates.
        DateTime ownerStart = reportOwner.periodStart.withZone(DateTimeZone.default)
        DateTime end
        DateTime start

        if (reportConfig.alignToOwnerStart && reportConfig.alignToOwnerEnd) {
            end = endDate
            start = ownerStart
        }
        else if (reportConfig.alignToOwnerStart) {
            start = ownerStart
            if (reportConfig.getFirstReportingPeriodEnd()) {
                end = reportConfig.getFirstReportingPeriodEnd()
            }
            else if (reportConfig.reportingPeriodInMonths) {
                end = start.plus(period)
            }
        }
        else {
            end = endDate
            if (reportConfig.reportsAlignedToCalendar) {

                // We add a day onto end dates because projects are generally loaded such that they end at
                // midnight on the last day of the month
                DateTime fudgedEndDate = endDate.plusDays(DATE_FUDGE_FACTOR)
                // This is the first period after the end date that matches the requested alignment (e.g. quarterly / semesterly / monthly)
                DateTime alignedDate = DateUtils.alignToPeriod(fudgedEndDate, reportConfig.reportingPeriod).minus(reportConfig.reportingPeriod)
                Interval interval = new Interval(alignedDate, fudgedEndDate)
                while (interval.toPeriod(PeriodType.months()).getMonths() < reportConfig.reportingPeriodInMonths) {
                    alignedDate = alignedDate.minus(reportConfig.reportingPeriod)
                    interval = new Interval(alignedDate, fudgedEndDate)
                }
                start = interval.start
            }
            else {
                start = endDate.minus(reportConfig.reportingPeriod)
            }
        }

        // Clip the report dates to the owner dates if the report falls outside the owner time range
        if (start < ownerStart) {
            start = ownerStart
        }
        if (endDate < end) {
            end = endDate
        }

        if (end >= start) {
            //validates the latest approved report to avoid creation of duplicate report
            if (existingReports && existingReports[0].publicationStatus != REPORT_NOT_APPROVED) {
                log.info("Not regenerating report " + reportConfig.category + " to avoid creating duplicate reports")
            } else {
                Interval reportInterval = new Interval(start, end)
                // If the report minimumPeriodInMonths has been specified, only create the report if the owner duration
                // is greater than the minimum period.
                if (!reportConfig.minimumPeriodInMonths || reportInterval.toPeriod(PeriodType.months()).getMonths() >= reportConfig.minimumPeriodInMonths) {
                    log.info("Regenerating a single report from " + reportInterval.start + " to " + reportInterval.end)
                    reports << createReport(reportConfig, reportOwner, 1, reportInterval)
                } else {
                    log.info("Not regenerating report " + reportConfig.category + " because owner duration too short: " + reportInterval.toPeriod(PeriodType.months()).getMonths() + " < " + reportConfig.minimumPeriodInMonths)
                }
            }
        } else {
            log.warn("Not regenerating report " + reportConfig.category + " because report end date " + end +  " must be greater than or equal to project start date " + start)
        }
        reports
    }

    private List<Map> generatePeriodicReports(ReportConfig reportConfig, ReportOwner reportOwner, DateTime latestApprovedReportPeriodEnd, int startingSequenceNo, DateTime endDate, Period period) {
        int sequenceNo = startingSequenceNo
        List<Map> reports = []
        Interval reportInterval = determineFirstReportInterval(reportConfig, reportOwner, latestApprovedReportPeriodEnd)

        if (reportConfig.skipFinalPeriod) {
            // If the configuration specifies the skipFinalPeriod, work out the date we need to finish generating
            // the reports so that the final period is a minimum of reportingPeriodInMonths long, but less than
            // 2 * reportingPeriodInMonths
            DateTime start = reportInterval.end // This is to handle aligning reports to the calendar
            Interval finalPeriod = new Interval(start, endDate.plusDays(DATE_FUDGE_FACTOR))
            while (finalPeriod.toPeriod(PeriodType.months()).months >= reportConfig.reportingPeriodInMonths) {
                start = start.plusMonths(reportConfig.reportingPeriodInMonths)
                finalPeriod = new Interval(start, finalPeriod.end)
            }
            endDate = finalPeriod.start.minusMonths(reportConfig.reportingPeriodInMonths)
        }
        log.info "Regenerating reports for ${reportOwner.id} at sequence: " + sequenceNo + " from: " + reportInterval.start + " ending at: " + reportInterval.end

        // We aren't using the DATE_FUDGE_FACTOR for the project end date because the way they are normally
        // recorded is by entering the last day of a month (e.g 30/06/2023) in the UI which, after
        // truncating time, translates to midnight on the morning of the 30th of June (rather than 11:59pm
        // of the 30/06/2023) which essentially makes it almost a full day earlier than the normal end
        // period of a report, which is aligned to the start date of the next report, which in this case
        // would be midnight on the 1st of July 2023.
        DateTime end = endDate.plusDays(1).minusDays(reportConfig.minimumReportDurationInDays - 1)
        while (reportInterval.start < end) {

            reports << createReport(reportConfig, reportOwner, sequenceNo, reportInterval)
            sequenceNo++
            reportInterval = new Interval(reportInterval.end, reportInterval.end.plus(period))
        }
        reports
    }

    private List<Map> generateNonPeriodicReportsByDate(DateTime latestApprovedReportPeriodEnd, ReportOwner reportOwner, ReportConfig reportConfig, DateTime endDate, int startingSequenceNo) {
        int sequenceNo = startingSequenceNo
        List<Map> reports = []
        DateTime startConstraint = latestApprovedReportPeriodEnd && latestApprovedReportPeriodEnd > reportOwner.periodStart ? latestApprovedReportPeriodEnd : reportOwner.periodStart
        startConstraint = startConstraint.withZone(DateTimeZone.default)

        List<DateTime> reportEndDates = reportConfig.reportEndDates.collect { it.withZone(DateTimeZone.default) }
        DateTime start = startConstraint
        int index = 0
        while (index < reportEndDates.size() && start.isBefore(endDate.minusDays(DATE_FUDGE_FACTOR))) {
            if (reportEndDates[index].isAfter(startConstraint)) {
                Interval reportInterval = new Interval(start, reportEndDates[index])
                reports << createReport(reportConfig, reportOwner, sequenceNo, reportInterval)
                sequenceNo++
                start = reportInterval.end
            }
            index++
        }
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
            if ((reports.size() > 1 && !reportConfig.endDates && !reportConfig.skipFinalPeriod) || reports[-1].toDate > finalToDate) {
                reports[-1].toDate = finalToDate

                // This compensates for the situation where an extra report is added after the end date
                // because of the "minimumReportDurationInDays" algorithm
                if (reports[-1].toDate < reports[-1].fromDate) {
                    reports.remove(reports.size()-1)
                }
                else {
                    if (!reportConfig.canSubmitDuringReportingPeriod) {
                        reports[-1].submissionDate = finalToDate
                    }
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
                submissionDate:reportConfig.canSubmitDuringReportingPeriod ? fromDate : toDate,
                generatedBy:reportConfig.label
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
                // It is possible that the first report period end is before the constrained reporting start.  This could happen with
                // approved reports or in the case of program aligned reporting.  (e.g the first report date is specified at a program level
                // and projects that start after the beginning of the program need to align to the dates)
                while (firstReportPeriodEnd < startConstraint.plusDays(reportConfig.minimumReportDurationInDays)) {
                    firstReportPeriodEnd = firstReportPeriodEnd.plus(period)
                }
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

        int periodInMonths = config.reportingPeriodInMonths ?: 0
        String period = config.reportingPeriodInMonths+"M"
        String periodDescription = ''
        switch (periodInMonths) {
            case 0:
                periodDescription = ""
                break
            case 3:
                periodDescription = "Quarter"
                break
            case 6:
                periodDescription = "Semester"
                break
            default:
                periodDescription = period
                break
        }
        // month of year is 0 based, and we are offsetting by 6 months to align with the financial year to get
        // the sequence number of this report based on "number of reports per financial year"
        int sequenceInFinancialYear = periodInMonths ? Math.floor(((endOfReport.getMonthOfYear()+5)%12)/config.reportingPeriodInMonths)+1 : 1

        return sprintf(pattern, sequenceNo, fromDate.toDate(), toDate.toDate(), owner.name, financialYear, periodDescription, sequenceInFinancialYear)
    }
}

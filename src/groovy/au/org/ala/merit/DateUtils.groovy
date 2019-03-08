package au.org.ala.merit

import org.joda.time.*
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter
import org.joda.time.format.ISODateTimeFormat

import java.text.SimpleDateFormat

/**
 * Utilities for working with fieldcapture / ecodata ISO8601 dates.
 */
class DateUtils {

    /** Fieldcapture / Ecodata work with ISO8601 formatted dates */
    private static DateTimeFormatter DATE_PARSER = ISODateTimeFormat.dateTimeParser().withZoneUTC()
    private static DateTimeFormatter DATE_FORMATTER = ISODateTimeFormat.dateTimeNoMillis() //DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ssZ").withZoneUTC()
    private static DateTimeFormatter DISPLAY_DATE_FORMATTER = DateTimeFormat.forPattern("dd-MM-yyyy").withZone(DateTimeZone.default)
    private static DateTimeFormatter DISPLAY_DATE_FORMATTER_WITH_TIME = DateTimeFormat.forPattern("dd-MM-yyyy h:mm:ss aa").withZone(DateTimeZone.default)
    private static DateTimeFormatter DISPLAY_DATE_FORMATTER_WITH_TIME_NOSPACE = DateTimeFormat.forPattern("yyyyMMddHHmmss").withZone(DateTimeZone.default)
    private static DateTimeFormatter MONTH_ONLY_FORMATTER = DateTimeFormat.forPattern('MMMMM yyyy')
    private static DateTimeFormatter LOCAL_DATE_ISO_FORMAT = ISODateTimeFormat.date().withZone(DateTimeZone.default)


    /**
     * Aligns the supplied DateTime to the start date of the period it falls into.
     * The period is defined relative to the Calendar year.
     * For example, a date of 03/1/2014 aligned to a 3 month period falls into the Jan - March period so
     * 01/01/2014 will be returned.
     * @param toAlign the date to align
     * @param period the period to align to.
     * @return the start date of the period the date falls into.
     */
    static DateTime alignToPeriod(DateTime toAlign, Period period) {

        DateTime periodStart = new DateTime(toAlign.year().get(), DateTimeConstants.JANUARY, 1, 0, 0, toAlign.getZone())

        Interval interval = new Interval(periodStart, period)

        // We allow periods one day before the period end to support time zone differences in comparisons (e.g. period in UTC, start date in AEST)
        // Otherwise we get dates like 2015-06-30T14:00 falling into 2015-01-01.
        while (Days.daysBetween(interval.getEnd(), toAlign).days > -1) {
            interval = new Interval(interval.getEnd(), period)
        }

        return interval.getStart()
    }

    /**
     * Returns a DateTime representing the start the of financial year which the supplied date falls into.
     * e.g. if the toAlign date is after June 30 it will return July 1 of the same year, otherwise it returns
     * July 1 of the previous year.
     * @param toAlign the date to align to a financial year.
     */
    static DateTime alignToFinancialYear(DateTime toAlign) {
        DateTime financialYear = new DateTime(toAlign.year().get(), DateTimeConstants.JULY, 1, 0, 0, toAlign.getZone())
        if (toAlign.isBefore(financialYear)) {
            financialYear = financialYear.minusYears(1)
        }
        financialYear
    }

    /**
     * Parses a String formatted as approximately ISO8601.  The Java 6/7 time zone offset format of +0000 is supported
     * as well as the ISO8601 +00:00
     *
     * @param dateString the string to parse.
     * @return a new Joda Time DateTime instance, with the UTC time zone.
     */
    static DateTime parse(String dateString) {
        if (dateString =~ /\+[0-9]{4}/) {
            // This is a java formatted time which is not ISO8901 compatible.
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ssZ")
            return new DateTime(dateFormat.parse(dateString)).withZone(DateTimeZone.UTC)
        }
        return DATE_PARSER.parseDateTime(dateString)
    }

    static DateTime parseDisplayDate(String displayDateString) {
        return DISPLAY_DATE_FORMATTER.parseDateTime(displayDateString)
    }

    static DateTime now() {
        return new DateTime()
    }

    static int daysRemaining(DateTime start, DateTime end) {
        if (end < start) return 0
        return 1 + Days.daysBetween(start.toLocalDate(), end.toLocalDate()).getDays()
    }

    /**
     * @return the first year in the current financial year (July-June).  e.g. if we are in 2014/2015 this method will
     * return 2014
     */
    static int currentFinancialYear() {
        return now().minusMonths(6).year
    }

    static String format(Date date) {
        return DATE_FORMATTER.print(new DateTime(date))
    }

    static String format(DateTime date) {
        return DATE_FORMATTER.print(date)
    }

    static String format(DateTime date, String formatString) {
        DateTimeFormatter formatter = DateTimeFormat.forPattern(formatString).withZone(date.getZone())
        return formatter.print(date)
    }


    static String displayFormat(DateTime date) {
        return DISPLAY_DATE_FORMATTER.print(date)
    }

    static String displayFormatWithTime(String isoDate) {
        return DISPLAY_DATE_FORMATTER_WITH_TIME.print(parse(isoDate))
    }
    static String displayFormatWithTimeNoSpace(String isoDate) {
        return DISPLAY_DATE_FORMATTER_WITH_TIME_NOSPACE.print(parse(isoDate))
    }

    static String dayBefore(String isoDate) {
        DateTime date = parse(isoDate)
        date = date.minusDays(1)
        return format(date)
    }

    /**
     * Formats the supplied ISO date string into local time with format of yyyy-MM-dd.  Used by the jquery validation
     * engine date validation routine.
     * @param isoDate the date to format.
     * @return a date String in the format yyyy-MM-dd
     */
    static String validatorFormat(String isoDate) {
        String blah = LOCAL_DATE_ISO_FORMAT.print(parse(isoDate))
        blah
    }

    static String isoToDisplayFormat(String isoDate) {
        return displayFormat(parse(isoDate))
    }

    static String displayToIsoFormat(String displayDate) {
        return format(parseDisplayDate(displayDate).withZone(DateTimeZone.UTC))
    }

    /**
     * Groups the supplied data into time intervals defined by the supplied start date and period.
     * If no start date is supplied, it will be set to the earliest date in the supplied data.
     * @param data the data to group.
     * @param dateAccessor closure that returns a date String from an item of the data List.
     * @param period the period of each grouping.
     * @param startDate the start date of the first group.  Items of the data list before this date will not be returned.
     * @param endDate the end date. Items that occur after the end date of the period containing this date will not be included.
     *
     * @return a LinkedHashMap (keys in chronological order) containing the intervals and grouped data.
     */
    static LinkedHashMap<Interval, List> groupByDateRange(List data, Closure dateAccessor, Period period, DateTime startDate = null, DateTime endDate = null) {

        def results = new LinkedHashMap()

        if ((!startDate || !endDate) && !data) {

            return results
        }

        if (!startDate) {
            def start = dateAccessor(data.min(dateAccessor))
            startDate = parse(start)
        }
        if (!endDate) {
            def end = dateAccessor(data.max(dateAccessor))
            endDate = parse(end)
        }


        Interval interval = new Interval(startDate, period)
        while (interval.isBefore(endDate) || interval.contains(endDate)) {
            def periodData = data.findAll {
                interval.contains(parse(dateAccessor(it)))
            }

            results << [(interval): periodData]
            interval = new Interval(interval.start.plus(period), period)
        }
        results
    }

    static String formatSingleMonthInterval(Interval interval) {

        return MONTH_ONLY_FORMATTER.print(interval.getStart())
    }
}

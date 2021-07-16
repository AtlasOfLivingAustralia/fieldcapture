package au.org.ala.merit.reports

import au.org.ala.merit.DateUtils
import au.org.ala.merit.SettingPageType
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.joda.time.Period
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter


/**
 * The Reef 2050 Plan action reporting currently has three different report types, depending on the period being
 * reported on.
 * This class manages the configuration for those reports.
 */
@grails.validation.Validateable
class Reef2050PlanActionReportConfig {

    static String SETTINGS_TEXT_REPORT = 'settings'

    public static Period REPORTING_PERIOD = Period.months(6)
    private static DateTimeFormatter LABEL_FORMATTER = DateTimeFormat.forPattern("dd MMMM yyyy").withZone(DateTimeZone.default)

    public static final String REEF_2050_PLAN_ACTION_REPORTING_ACTIVITY_TYPE = 'Reef 2050 Plan Action Reporting'
    public static final String REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE = 'Reef 2050 Plan Action Reporting 2018'
    public static final String REEF_2050_PLAN_FINAL_ACTION_REPORT = 'final_Report'


    String type
    String periodEnd
    String periodStart

    static constraints = {
        periodEnd nullable: false
        periodStart nullable: true
        type inList: [REEF_2050_PLAN_ACTION_REPORTING_ACTIVITY_TYPE, REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE, SETTINGS_TEXT_REPORT, REEF_2050_PLAN_FINAL_ACTION_REPORT]
    }


    String getLabel() {

        if (!periodEnd) {
            return null
        }
        DateTime labelPeriodStart
        DateTime labelPeriodEnd = DateUtils.parse(periodEnd).withZone(DateTimeZone.default)
        if (!periodStart){
        // To produce the labels we have to work with our local time zone because MERIT stores things as
        // UTC end dates will typically be yyyy-12-31T13:00:00Z / yyyy-06-30T14:00:00Z.  If we subtract 6 months
        // from June 30 we get December 30 for the start period, when we want January 1.  Converting to australian
        // timezones puts these dates to the 1st of each month which makes subtracting 6 months more predictable.

            labelPeriodStart = labelPeriodEnd.minus(REPORTING_PERIOD)
            labelPeriodStart = labelPeriodStart.plusHours(11)
            return LABEL_FORMATTER.print(labelPeriodStart.plusHours(11)) + " - " + LABEL_FORMATTER.print(labelPeriodEnd.minusHours(11))
        } else {
            labelPeriodStart = DateUtils.parse(periodStart).withZone(DateTimeZone.default)
            return LABEL_FORMATTER.print(labelPeriodStart.plusHours(11)) + " - " + LABEL_FORMATTER.print(labelPeriodEnd.minusHours(11))
        }
    }

    String settingsPageKey() {
        if (type == SETTINGS_TEXT_REPORT) {
            return SettingPageType.REEF_2050_PLAN_REPORT.key
        } else if (type == REEF_2050_PLAN_FINAL_ACTION_REPORT) {
            SettingPageType.REEF_2050_FINAL_REPORT.key
        } else {
            return null
        }
    }

    String periodStart() {
        DateTime periodEndDate = DateUtils.parse(periodEnd).withZone(DateTimeZone.default)
        DateTime startDate = DateUtils.alignToPeriod(periodEndDate.minus(REPORTING_PERIOD), REPORTING_PERIOD)
        DateUtils.format(startDate.withZone(DateTimeZone.UTC))
    }

    void setPeriodEnd(String periodEnd) {
        this.periodEnd = DateUtils.alignToPeriodEnd(periodEnd, REPORTING_PERIOD)
    }

    String getPeriodEnd() {
        periodEnd
    }

    Map toMap() {
        return [type:type, periodEnd:periodEnd, label:label]
    }

}

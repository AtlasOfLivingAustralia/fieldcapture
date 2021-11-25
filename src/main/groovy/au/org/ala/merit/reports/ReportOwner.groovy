package au.org.ala.merit.reports

import au.org.ala.merit.DateUtils
import org.joda.time.DateTime

class ReportOwner {

    /** The first date any reporting period can cover */
    String periodStart

    /** The last date any reporting period can cover */
    String periodEnd

    /** Used as a parameter for report name and description generation */
    String name

    /** Attached to any generated reports e.g projectId:'12345' or programId:'1234' */
    Map id


    DateTime getPeriodStart() {
        return DateUtils.parse(periodStart)
    }

    DateTime getPeriodEnd() {
        return DateUtils.parse(periodEnd)
    }
}

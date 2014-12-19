package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils
import au.org.ala.fieldcapture.GmsMapper
import org.joda.time.DateTime
import org.joda.time.Period

class ReportController extends au.org.ala.fieldcapture.ReportController {

    static defaultAction = "dashboard"


    def gmsExportSummary() {

        if (!params.query) {
            params.query = '*'
        }
        params.type = 'outputSummary'
        def results = searchService.projectReports(params)

        GmsMapper mapper = new GmsMapper()

        response.setContentType('text/csv')
        mapper.toCsv(results.resp, response.getWriter())

        response.getWriter().flush()

    }

    def greenArmyReport() {

        DateTime date = new DateTime(2014, 1, 1, 0, 0, 0)
        Period period = Period.months(1)

        DateTime end = new DateTime(2015, 6, 1, 0, 0, 0)

        def dateRanges = []

        while (date.isBefore(end)) {
            dateRanges << DateUtils.format(date)
            date = date.plus(period)
        }

        params.dates = dateRanges

        def results = searchService.report(params)


        render view:'_greenArmy', model:[report:results]

    }

}

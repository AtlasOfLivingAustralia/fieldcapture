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

    def loadReport() {
        switch (params.report) {
            case 'greenArmy' :
                forward action: 'greenArmyReport', params:params
                break
            default:
                forward action: 'dashboardReport', params:params
                break
        }
    }

    def greenArmyReport() {

        DateTime date = new DateTime(2014, 8, 1, 0, 0, 0)
        Period period = Period.months(1)

        DateTime end = new DateTime(2015, 2, 1, 0, 0, 0)

        def dateRanges = []

        while (date.isBefore(end)) {
            dateRanges << DateUtils.format(date)
            date = date.plus(period)
        }

        params.dates = dateRanges

        def results = searchService.report(params)

        // Remove the overflow buckets for now.  TODO may need to make this configurable or check for no data.
        if (results.outputData && results.outputData[0].group.startsWith("Before")) {
            results.outputData.remove(0)
        }

        if (results.outputData && results.outputData[results.outputData.size()-1].group.startsWith("After")) {
            results.outputData.remove(results.outputData.size()-1)
        }


        render view:'_greenArmy', model:[report:results]

    }

}

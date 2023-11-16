package au.org.ala.merit

import grails.testing.web.controllers.ControllerUnitTest
import org.apache.http.HttpStatus
import spock.lang.Specification

class ReportControllerSpec extends Specification implements ControllerUnitTest<ReportController> {
    ReportService reportService = Mock(ReportService)
    UserService userService = Mock(UserService)

    def setup() {
        controller.reportService = reportService
        controller.userService = userService
    }

    def "The controller delegates to the reportService to produce reports"() {
        setup:
        String fromDate = '01-07-2020'
        String toDate = '31-12-2020'

        when:
        params.fromDate = fromDate
        params.toDate = toDate
        controller.generateReportsInPeriod()

        then:
        1 * userService.getUser() >> [userName:'test@test.com']
        1 * reportService.generateReports(fromDate, toDate, _) >> [status: HttpStatus.SC_OK]
        response.json == [status:HttpStatus.SC_OK]
    }

}

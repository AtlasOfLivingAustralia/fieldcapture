package au.org.ala.fieldcapture

import pages.ReportPage
import pages.RlpProjectPage
import spock.lang.Stepwise

@Stepwise
class ProgressReportSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset3')
    }

    def cleanup() {
        logout(browser)
    }

    private void regenerateReportsAsMeritAdmin(String projectId) {
        loginAsMeritAdmin(browser)
        to RlpProjectPage, projectId
        regenerateReports()
    }

    def "Test the field limits in the progress reports"() {

        setup: "Generate the reports for the project, then login as a project admin user"
        String projectId = 'meri2'
        regenerateReportsAsMeritAdmin(projectId)
        logout(browser)

        loginAsUser('1', browser)

        when:
        to RlpProjectPage, projectId
        displayReportingTab()
        projectReports.reports[0].edit()

        then:
        waitFor { at ReportPage }

        when:
        def report = getReport()

        then:
        report != null

        when:
        report.example2TextField = "12345"
        report.exampleTextField.click()

        waitFor { save() }

        then:
        waitFor { at ReportPage }

        when:
        def savedReport = getReport()

        then:
        savedReport != null
        savedReport.example2TextField == "12345"

        when:
        report.example2TextField = "123456"
        report.exampleTextField.click()

        waitFor { save() }

        then:
        waitFor { at ReportPage }

        when:
        def savedReport2 = getReport()

        then:
        savedReport2 != null
        savedReport2.example2TextField != "123456"

    }
}

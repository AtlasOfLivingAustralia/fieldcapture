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


    def "Test the field limits in the progress reports"() {

        setup:
        String projectId = 'meri2'
        login([userId: '1', role: "ROLE_FC_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        adminTab.click()

        then:
        waitFor { adminContent.displayed }

        when: "Click on the project settings"
        adminContent.projectSettingsTab.click()

        then:
        waitFor { adminContent.projectSettings.displayed }

        when:
        adminContent.projectSettings.regenerateReports()

        then:
        waitFor { at RlpProjectPage }

        when:
        reportingTab.click()


        then:
        waitFor { projectReports.displayed }

        when:
        waitFor { projectReports.reports[0].edit() }

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

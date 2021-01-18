package au.org.ala.fieldcapture

import pages.RlpProjectPage
import pages.ReportPage
import spock.lang.Stepwise

@Stepwise
class RlpReportingSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset2')
    }

    def cleanup() {
        logout(browser)
    }


    def "the reports can be regenerated by an FC_ADMIN"() {

        setup:
        String projectId = '1'
        login([userId: '1', role: "ROLE_FC_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when: "Display the admin tab, navigate to the settings section then press the re-generate reports button"
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

        and: "The new reports are displayed"

        waitFor {
            projectReports.reports.size() == 16
            projectReports.reports[1].name != ""
        }
        projectReports.reports[0].name == "Year 2018/2019 - Quarter 1 Outputs Report"
        projectReports.reports[0].fromDate == "01-07-2018"
        projectReports.reports[0].toDate == "30-09-2018"

        and: "The end date of the report finishing on the same day of the project is not the day before like other reports"
        projectReports.reports[15].name == "Outcomes Report 2 for Project 1"
        projectReports.reports[15].fromDate == "01-07-2018"
        projectReports.reports[15].toDate == "01-07-2023"

    }

    def "A project editor can edit the report"() {
        setup:
        String projectId = '1'
        login([userId: '1', role: "ROLE_FC_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        reportingTab.click()

        then:
        waitFor { projectReports.displayed }

        when:
        projectReports.reports[0].edit()

        then:
        waitFor { at ReportPage }

        when:
        exitReport()

        then:
        waitFor { at RlpProjectPage }

    }


}

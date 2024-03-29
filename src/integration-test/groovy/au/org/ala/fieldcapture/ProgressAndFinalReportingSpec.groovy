package au.org.ala.fieldcapture


import pages.RlpProjectPage
import pages.modules.ReportCategory
import spock.lang.Stepwise

@Stepwise
class ProgressAndFinalReportingSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset3')
    }

    def cleanup() {
        waitFor {
            logout(browser)
        }
    }


    def "the reports can be regenerated by a MERIT administrator"() {

        setup:
        String projectId = 'p3'
        loginAsMeritAdmin(browser)

        when: "Display the admin tab, navigate to the settings section then press the re-generate reports button"
        to RlpProjectPage, projectId
        adminTab.click()
        waitFor { adminContent.displayed }
        adminContent.projectSettingsTab.click()
        waitFor { adminContent.projectSettings.displayed }
        adminContent.projectSettings.regenerateReports()

        then:
        waitFor { hasBeenReloaded() }

        when:
        reportingTab.click()

        then:
        waitFor { projectReports.displayed }
        waitFor {
            projectReports.reportCategories == ["Progress Reports", "Final Report"]
        }

        when: "We ensure all of the reports are displayed"
        displayReportingTab()
        projectReports.reportsByCategory.each { ReportCategory reportCategory ->
            if (reportCategory.showAllReportsCheckbox.displayed) {
                reportCategory.showAllReports()
            }
        }

        then: "The correct number of reports have been generated for each category"
        waitFor {
            // 5 years of quarterly reports but no final report
            projectReports.getReportsForCategory("Progress Reports").size() == 11

            // Only one final report
            projectReports.getReportsForCategory("Final Report").size() == 1
        }

        projectReports.getReportsForCategory("Progress Reports").toDate == ["30-09-2020", "31-12-2020", "31-03-2021", "30-06-2021", "30-09-2021", "31-12-2021", "31-03-2022", "30-06-2022", "30-09-2022", "31-12-2022", "31-03-2023"]
        projectReports.getReportsForCategory("Final Report").fromDate == ["01-04-2023"]
        projectReports.getReportsForCategory("Final Report").toDate == ["30-06-2023"]
    }

}

package au.org.ala.fieldcapture

import pages.ReportPage
import pages.RlpProjectPage
import spock.lang.Stepwise

@Stepwise
class ReportActivityFilteringSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset3')
    }

    def cleanup() {
        logout(browser)
    }


    def "the reports can be regenerated by an FC_ADMIN"() {

        setup:
        String projectId = 'meri2'
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
            projectReports.reports.size() == 7
            projectReports.reports[1].name != ""
        }
        projectReports.reports[0].name == "Year 2018/2019 - Semester 1 Progress Report"
        projectReports.reports[0].fromDate == "01-07-2018"
        projectReports.reports[0].toDate == "30-09-2018"


    }

    def "When no activities are selected in the MERI plan all activities will be shown on the progress report"() {
        setup:
        String projectId = 'meri2'
        login([userId: '1', role: "USER", email: 'editor@nowhere.com', firstName: "MERIT", lastName: 'Editor'], browser)

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

        and: "All of the output sections are displayed."
        $('#koMandatory_section_1').displayed
        $('#koOutput_1').displayed
        $('#koOutput_2').displayed


    }

    def "When activities are selected in the MERI plan only mandatory and selected activities will be shown on the progress report"() {
        setup:
        String projectId = 'meri2'
        login([userId: '1', role: "USER", email: 'editor@nowhere.com', firstName: "MERIT", lastName: 'Editor'], browser)

        when: "select activity 2 on the MERI plan"
        to RlpProjectPage, projectId

        waitFor { at RlpProjectPage }
        def meriPlan = openMeriPlanEditTab()
        meriPlan.checkActivity('activity 2')
        meriPlan.save()

        and: "open the report"
        reportingTab.click()
        waitFor { projectReports.displayed }
        projectReports.reports[0].edit()

        then:
        waitFor { at ReportPage }

        and: "Only the mandatory and selected activities are displayed."
        $('#koMandatory_section_1').displayed
        !$('#koOutput_1').displayed
        $('#koOutput_2').displayed


    }

}

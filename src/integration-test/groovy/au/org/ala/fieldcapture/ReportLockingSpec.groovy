package au.org.ala.fieldcapture

import pages.ReportPage
import pages.RlpProjectPage
import pages.ViewReportPage
import spock.lang.Stepwise

@Stepwise
class ReportLockingSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset2')
    }

    def cleanup() {
        logout(browser)
    }

    private editFirstReport(String projectId) {
        to RlpProjectPage, projectId
        waitFor { at RlpProjectPage }
        reportingTab.click()
        waitFor { projectReports.displayed }
        projectReports.reports[0].edit()
    }

    private void regenerateReports(String projectId) {
        to RlpProjectPage, projectId
        waitFor { at RlpProjectPage }
        adminTab.click()
        waitFor { adminContent.displayed }
        adminContent.projectSettingsTab.click()
        waitFor { adminContent.projectSettings.displayed }
        adminContent.projectSettings.regenerateReports()
        waitFor { hasBeenReloaded() }
    }

    def "A user obtains a lock on a report"() {

        setup: "Login as an admin, regenerate the reports as the test data doesn't load reports"
        String projectId = '1'
        loginAsMeritAdmin(browser)
        regenerateReports(projectId)

        when: "We open a report for editing"
        reportingTab.click()
        waitFor { projectReports.displayed }
        projectReports.reports[0].edit()

        then: "The edit page is opened and a lock obtained"
        // N.B The lock check is in the next spec as the best way to test this is
        // to login as a different user and we don't want to navigate away from this page
        // with this user as it will clear the lock.
        waitFor { at ReportPage }
    }

    def "A new user should not be able to edit the report"() {
        setup: "Login as a project editor"
        String projectId = '1'
        loginAsUser('10', browser)

        when: "a new user opens the same report as the one already being edited"
        editFirstReport(projectId)

        then: "we are redirected to the view page with a message"
        at ViewReportPage
        reportLockedMessage.displayed
    }

    def "A user releases the lock on a report"() {
        setup: "Login as a project admin"
        String projectId = '1'
        loginAsUser('1', browser)

        when:
        editFirstReport(projectId)

        then: "Because the user already holds the lock, they can continue editing"
        at ReportPage

        when: "The user exits the report"
        exitReport()

        then: "The lock is released and the user is returned to the project page"
        waitFor { at RlpProjectPage }
    }

    def "The new user can now edit the report"() {
        setup: "Login as a user who doesn't hold a lock"
        String projectId = '1'
        loginAsUser('10', browser)

        when: "a new user opens the same report the previous user just exited"
        editFirstReport(projectId)

        then: "they can edit the report as the lock has been released"
        at ReportPage
    }
}

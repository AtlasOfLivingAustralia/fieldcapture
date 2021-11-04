package au.org.ala.fieldcapture

import pages.*
import spock.lang.Stepwise

@Stepwise
class ActivityLockingSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset3')
    }

    def cleanup() {
        logout(browser)
    }

    /** The project we are working with in this spec */
    String projectId = 'p1'

    private void editFirstActivity() {
        to ProjectIndex, projectId
        openActivitiesTab()
        plansAndReports.activities[0].edit()
    }


    def "A user obtains a lock on an activity"() {

        setup: "Login as a project admin and open the activity"
        loginAsUser('1', browser)

        when: "We open a report for editing"
        editFirstActivity()

        then: "The edit (enterData.gsp) page is opened and a lock obtained"
        // N.B The lock check is in the next spec as the best way to test this is
        // to login as a different user and we don't want to navigate away from this page
        // with this user as it will clear the lock.
        waitFor { at ReportPage }
    }

    def "A new user should not be able to edit the report"() {
        setup: "Login another admin user for the project"

        loginAsUser('2', browser)

        when: "a new user opens the same report as the one already being edited"
        editFirstActivity()

        then: "we are redirected to the view page with a message"
        at ViewReportPage
        reportLockedMessage.displayed
    }

    def "A user releases the lock on a report"() {
        setup: "Login as a project admin and open the activity"
        loginAsUser('1', browser)

        when: "We open a report for editing"
        editFirstActivity()

        then: "The edit (enterData.gsp) page is opened and a lock obtained"
        waitFor { at ReportPage }

        when: "The user exits the report"
        exitReport()

        then: "The lock is released and the user is returned to the project page"
        waitFor { at ProjectIndex }
    }

    def "The new user can now edit the report"() {
        setup: "Login another admin user for the project"

        loginAsUser('2', browser)

        when: "a new user opens the same report as the one already being edited"
        editFirstActivity()

        then: "they can edit the report as the lock has been released"
        at ReportPage
    }
}

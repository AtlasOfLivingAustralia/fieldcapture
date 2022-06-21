package au.org.ala.fieldcapture

import com.icegreen.greenmail.junit.GreenMailRule
import com.icegreen.greenmail.util.GreenMailUtil
import com.icegreen.greenmail.util.ServerSetup
import com.icegreen.greenmail.util.ServerSetupTest
import org.junit.Rule
import pages.ManagementUnitPage
import pages.ReportPage
import pages.ViewReportPage
import spock.lang.Stepwise

import javax.mail.internet.MimeMessage

@Stepwise
class ManagementUnitReportingSpec extends StubbedCasSpec {

    @Rule
    public final GreenMailRule greenMail = new GreenMailRule(ServerSetup.verbose(ServerSetupTest.SMTP))

    def setupSpec() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        waitFor {
            logout(browser)
        }
    }


    def "MU reports are displayed correctly on the MU Reporting tab"() {

        setup:
        String managementUnitId = 'test_mu'
        loginAsUser('1', browser)

        when: "Display the reporting tab"
        to ManagementUnitPage, managementUnitId
        reportsTab.click()

        then:
        waitFor { reportsTabPane.displayed }

    }

    def "We can specify the core services reporting frequency"() {
        setup:
        String managementUnitId = 'test_mu'
        loginAsGrantManager(browser)

        when: "Display the reporting tab"
        to ManagementUnitPage, managementUnitId
        adminTab.click()

        then:
        waitFor { adminTabPane.displayed }

        when:
        def reportingSection = adminTabPane.viewReportingSection()
        reportingSection.coreServicesGroup = "Monthly (First period ends 31 July 2018)"
        reportingSection.saveReportingGroups()

        then:
        waitFor 20,{
            hasBeenReloaded()
        }

        when:
        reportsTab.click()

        then:
        waitFor { reportsTabPane.displayed }
        reportsTabPane.reports.size() > 0 // how many are displayed depends on the current date

    }

    def "A user with the MU admin role can complete MU reports,and submit them"() {
        setup:
        String managementUnitId = 'test_mu'
        loginAsUser('1', browser)

        when: "Display the reporting tab and edit the first report"
        to ManagementUnitPage, managementUnitId
        displayReportsTab()
        reportsTabPane.reports[0].edit()

        then:
        waitFor { at ReportPage }

        when: "Complete the report and mark as complete"
        field("coreServicesRequirementsMet").value('Met Core Services requirements')
        field("whsRequirementsMet").value('Met requirements')
        markAsComplete()
        save()
        exitReport()

        then:
        waitFor {
            at ManagementUnitPage
        }

        when:
        displayReportsTab()

        then:
        reportsTabPane.reports[0].markedAsComplete()
        reportsTabPane.reports[0].canBeSubmitted()

        when:
        reportsTabPane.reports[0].submit()

        then:
        reportsTabPane.reportDeclaration.displayed

        when:
        reportsTabPane.acceptTerms()
        reportsTabPane.submitDeclaration()

        then:
        waitFor { hasBeenReloaded() }

        when:
        reportsTab.click()
        waitFor { reportsTabPane.displayed }

        then:
        reportsTabPane.reports[0].isSubmitted()

        waitFor 20, {
            MimeMessage[] messages = greenMail.getReceivedMessages()
            messages?.length == 1
            messages[0].getSubject() == "Report submitted subject"
            GreenMailUtil.getBody(messages[0]) == "<p>Report submitted body</p>"
        }
    }

    def "A user with the MU grant manager role can approve and return MU reports"() {
        setup:
        String managementUnitId = 'test_mu'
        loginAsGrantManager(browser)

        when: "Display the reporting tab"
        to ManagementUnitPage, managementUnitId
        displayReportsTab()

        then: "The first report is marked as submitted"
        reportsTabPane.reports[0].isSubmitted()

        when:
        reportsTabPane.reports[0].approve()

        then:
        waitFor {hasBeenReloaded()}

        when:
        reportsTab.click()
        waitFor { reportsTabPane.displayed }

        then:
        reportsTabPane.reports[0].isApproved()

    }

    def "A user with the MERIT siteReadOnly role can view, but not edit management unit reports"() {
        String managementUnitId = 'test_mu'
        loginAsReadOnlyUser(browser)

        when: "Display the reporting tab, then view the approved report"
        to ManagementUnitPage, managementUnitId
        displayReportsTab()
        reportsTabPane.reports[0].view()

        then: "The report view page should be displayed"
        waitFor { at ViewReportPage }

        when: "The user exits the report view page"
        exitReport()

        then: "The user should be returned to the management unit page"
        waitFor { at ManagementUnitPage }

        when: "The user attempts to edit the second report"
        displayReportsTab()
        reportsTabPane.reports[1].edit()

        then: "The user should be returned to the management unit page"
        waitFor {hasBeenReloaded()}

    }

    def "The not required button is not visible to a MU Admin user"() {
        setup:
        String managementUnitId = 'test_mu'
        loginAsUser('1', browser)

        when: "Display the reporting tab"
        to ManagementUnitPage, managementUnitId
        displayReportsTab()

        then: "The first report is marked as submitted"
        reportsTabPane.reports[0].isSubmitted()

        and:"The not required button is not visible"
        !reportsTabPane.reports[1].notRequired()

    }

    def "The not required button is visible to a Site Admin user"() {
        setup:
        String managementUnitId = 'test_mu'
        loginAsMeritAdmin(browser)

        when: "Display the reporting tab"
        to ManagementUnitPage, managementUnitId
        displayReportsTab()

        then: "The first report is marked as submitted"
        reportsTabPane.reports[0].isSubmitted()

        and:"The not required button is not visible"
        reportsTabPane.reports[1].notRequired()

    }
}

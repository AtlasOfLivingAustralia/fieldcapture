package au.org.ala.fieldcapture

import com.icegreen.greenmail.junit.GreenMailRule
import com.icegreen.greenmail.util.GreenMailUtil
import com.icegreen.greenmail.util.ServerSetup
import com.icegreen.greenmail.util.ServerSetupTest
import org.junit.Rule
import pages.ManagementUnitPage
import pages.ReportPage
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
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'Admin'], browser)

        when: "Display the reporting tab"
        to ManagementUnitPage, managementUnitId
        reportsTab.click()

        then:
        waitFor { reportsTabPane.displayed }

    }

    def "We can specify the core services reporting frequency"() {
        setup:
        String managementUnitId = 'test_mu'
        login([userId: '3', role: "ROLE_FC_OFFICER", email: 'fc_officer@nowhere.com', firstName: "MERIT", lastName: 'FC_OFFICER'], browser)

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
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MU", lastName: 'Admin'], browser)

        when: "Display the reporting tab and edit the first report"
        to ManagementUnitPage, managementUnitId
        reportsTab.click()
        waitFor { reportsTabPane.displayed }
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
        reportsTab.click()
        waitFor { reportsTabPane.displayed }

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
        login([userId: '3', role: "ROLE_FC_OFFICER", email: 'fc_officer@nowhere.com', firstName: "MERIT", lastName: 'FC_OFFICER'], browser)

        when: "Display the reporting tab"
        to ManagementUnitPage, managementUnitId
        reportsTab.click()
        waitFor { reportsTabPane.displayed }

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
}

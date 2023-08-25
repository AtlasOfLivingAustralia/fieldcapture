package au.org.ala.fieldcapture

import com.icegreen.greenmail.util.GreenMail
import com.icegreen.greenmail.util.GreenMailUtil
import geb.module.FormElement
import pages.AdminTools
import pages.Organisation
import pages.OrganisationDownloadReport
import pages.ReportPage
import pages.ViewReportPage
import spock.lang.Shared

import javax.mail.Message
import javax.mail.internet.MimeMessage

class OrganisationReportingSpec extends StubbedCasSpec {

    @Shared
    GreenMail greenMail = new GreenMail()

    def orgId = "test_organisation"

    def setupSpec(){
        useDataSet("dataset_mu")

        loginAsAlaAdmin(browser)
        to AdminTools
        clearMetadata()
    }

    def cleanupSpec() {
        waitFor {
            logout(browser)
        }
        greenMail.stop()

    }

    def cleanup() {
        greenMail.stop() // Clear message buffer
    }

    def "Organisation reports are displaying in the reporting tab"() {

        setup:
        loginAsUser('1', browser)

        when:
        to Organisation, orgId
        displayReportsTab()

        then:
        reportsTabPane.reports.size() > 0

    }

    def "We can enable reporting for an organisation and specify dates"() {
        setup:
        loginAsMeritAdmin(browser)

        when: "Display the reporting tab"
        to Organisation, orgId

        then:
        waitFor 60, {at Organisation}

        when:
        openAdminTab()
        def reportingSection = adminTabContent.viewReportingSection()

        then:
        reportingSection.enableButton.module(FormElement).disabled
        reportingSection.startDate.value() == '01-07-2023'
        reportingSection.endDate.value() == '30-06-2028'

        when:
        reportingSection.startDate.value('30-07-2022')
        reportingSection.saveReportingConfiguration()

        then:
        waitFor 20,{
            hasBeenReloaded()
        }

        when:
        openAdminTab()
        reportingSection = adminTabContent.viewReportingSection()

        then:
        reportingSection.startDate.value() == '30-07-2022'

        when: "We regenerate the annual reports"
        reportingSection.clickEnableRegeneration(0)
        reportingSection.clickEnableRegeneration(1)
        reportingSection.generateReports()

        then:
        waitFor 20,{
            hasBeenReloaded()
        }

        when:
        displayReportsTab()

        then:
        reportsTabPane.reports.size() > 0

    }

    def "A user with the editor role can complete Organisation reports, but not submit them"() {
        setup:
        loginAsUser('4', browser)
        greenMail.start()

        when:
        to Organisation, orgId
        displayReportsTab()
        reportsTabPane.reports[1].edit()

        then:
        waitFor { at ReportPage }

        when: "Complete the report and mark as complete"
        field("coreServicesRequirementsMet").value('Met Core Services requirements')
        field("whsRequirementsMet").value('Met requirements')
        markAsComplete()
        save()
        exitReport()

        then:
        waitFor 60, {at Organisation}

        then:
        waitFor { reportsTabPane.displayed }

        then:
        waitFor 30, {
            reportsTabPane.reports[1].markedAsComplete()
            !reportsTabPane.reports[1].canBeSubmitted()
        }
    }

    def "A user with the admin role can complete Organisation reports,and submit them"() {
        setup:
        loginAsUser('1', browser)
        greenMail.start()

        when:
        to Organisation, orgId
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
        waitFor 60, {at Organisation}

        then:
        waitFor { reportsTabPane.displayed }

        then:
        waitFor 30, {
            reportsTabPane.reports[0].markedAsComplete()
            reportsTabPane.reports[0].canBeSubmitted()
        }

        when:
        reportsTabPane.reports[0].submit()

        then:
        reportDeclaration.displayed
        acceptTerms()
        submitDeclaration()

        then:
        waitFor { hasBeenReloaded() }

        when:

        waitFor { reportsTabPane.displayed }

        then:
        reportsTabPane.reports[0].isSubmitted()

        waitFor 20, {
            MimeMessage[] messages = greenMail.getReceivedMessages()
            messages?.length == 1
            messages[0].getSubject() == "Organisation report submitted subject"
            GreenMailUtil.getBody(messages[0]) == "<p>Organisation report submitted body</p>"
        }

    }

    def "A PDF can be generated from report tab"() {
        setup:
        loginAsReadOnlyUser(browser)

        when:
        to Organisation, orgId

        waitFor {
            reportingTab.click()
        }

        then:
        waitFor { reportsTabPane.displayed }

        when:
        reportsTabPane.reports[0].downloadReport()

        then:
        withWindow("print-report", {
            at OrganisationDownloadReport
            waitFor {
                printInstructions.displayed
            }
            closePrintInstructions()
            waitFor {
                !printInstructions.displayed
            }
        })
    }

    def "A user with the grant manager role can approve and return reports"() {
        setup:
        loginAsGrantManager(browser)
        greenMail.start()

        when:
        to Organisation, orgId
        displayReportsTab()

        then: "The first report is marked as submitted"
        reportsTabPane.reports[0].isSubmitted()

        when:
        reportsTabPane.reports[0].approve()

        then:
        waitFor {hasBeenReloaded()}

        when:
        displayReportsTab()

        then:
        reportsTabPane.reports[0].isApproved()
        waitFor 20, {
            MimeMessage[] messages = greenMail.getReceivedMessages()
            messages?.length == 2 // Email is sent to user and copied to grant manager
            messages[0].getSubject() == "Organisation report approved subject"
            GreenMailUtil.getBody(messages[0]) == "<p>Organisation report approved body</p>"
        }

    }

    def "A user with the MERIT siteReadOnly role can view, but not edit reports"() {
        loginAsReadOnlyUser(browser)

        when: "Display the reporting tab, then view the approved report"
        to Organisation, orgId

        waitFor {
            reportingTab.click()
        }

        then:
        waitFor { reportsTabPane.displayed }

        when:
        reportsTabPane.reports[0].view()

        then: "The report view page should be displayed"
        waitFor { at ViewReportPage }

        when: "The user exits the report view page"
        exitReport()

        then: "The user should be returned to the organisation page"
        waitFor { at Organisation }
    }

    def "The not required button is not visible to a MU Admin user"() {
        setup:
        loginAsUser('1', browser)

        when: "Display the reporting tab, then view the approved report"
        to Organisation, orgId
        displayReportsTab()

        then: "The first report is marked as submitted"
        reportsTabPane.reports[0].isSubmitted()

        and:"The not required button is not visible"
        !reportsTabPane.reports[0].notRequired()

    }

    def "The withdraw approval button is visible to a Site Admin user"() {
        setup:
        loginAsMeritAdmin(browser)

        when: "Display the reporting tab, then view the approved report"
        to Organisation, orgId
        displayReportsTab()

        then: "The first report is marked as submitted"
        reportsTabPane.reports[0].isSubmitted()

        and:"The withdraw approval button is visible"
        reportsTabPane.reports[0].hasWithdrawApprovalButton()

        and:"The not required button is not visible"
        !reportsTabPane.reports[0].notRequired()

    }

    def "A report can be marked as Not Required"() {
        setup:
        loginAsMeritAdmin(browser)

        when: "Display the reporting tab, then view the approved report"
        to Organisation, orgId
        displayReportsTab()
        reportsTabPane.reports[2].cancelReport()

        then:
        waitFor {
            reportsTabPane.reasonModal.displayed
        }

        when: "the site admin enters the reason and confirm the cancellation"
        reportsTabPane.cancellationReason("Test reason")
        reportsTabPane.confirmCancellation()


        then:
        waitFor { hasBeenReloaded() }

        and:
        reportsTabPane.reports[2].isCancelled()
    }

}


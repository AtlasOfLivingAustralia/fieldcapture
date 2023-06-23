package au.org.ala.fieldcapture

import com.icegreen.greenmail.util.GreenMail
import com.icegreen.greenmail.util.GreenMailUtil
import pages.Organisation
import pages.ReportPage
import pages.ViewReportPage
import spock.lang.Shared

import javax.mail.internet.MimeMessage

class OrganisationReportingSpec extends StubbedCasSpec {

    @Shared
    GreenMail greenMail = new GreenMail()

    def orgId = "test_organisation"

    def setupSpec(){
        useDataSet("dataset_mu")
        greenMail.start()
    }

    def cleanup() {
        waitFor {
            logout(browser)
        }
        greenMail.stop()

    }

    def "Organisation reports are displaying in the reporting tab"() {

        setup:
        loginAsMeritAdmin(browser)

        when:
        to Organisation, orgId
        displayReportsTab()

        then:
        reportsTabPane.reports.size() > 0

    }

    def "We can specify the core services reporting frequency"() {
        setup:
        loginAsMeritAdmin(browser)

        when: "Display the reporting tab"
        to Organisation, orgId

        then:
        waitFor 60, {at Organisation}

        waitFor 60, {
            adminTab.click()
        }

        then:
        waitFor 20, { adminTabContent.displayed }

        when:
        def reportingSection = adminTabContent.viewReportingSection()
//        reportingSection.coreServicesGroup = "Quarterly (First period ends 30 September 2023)"
        reportingSection.coreServicesGroup = "Quarterly - A (First period ends 31 March 2023)"

        reportingSection.saveReportingGroups()

        then:
        waitFor 20,{
            hasBeenReloaded()
        }

        when:
        displayReportsTab()

        then:
        reportsTabPane.reports.size() > 0

    }

    def "A user with the admin role can complete Organisation reports,and submit them"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to Organisation, orgId

        waitFor 20 ,{
            reportingTab.click()
        }

        then:
        waitFor 60, { reportsTabPane.displayed }

        when:
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

//        temp comment out, still investigating the issue
//        waitFor 20, {
//            MimeMessage[] messages = greenMail.getReceivedMessages()
//            messages?.length == 1
//            messages[0].getSubject() == "Report submitted subject"
//            GreenMailUtil.getBody(messages[0]) == "<p>Report submitted body</p>"
//        }

    }

    def "A user with the grant manager role can approve and return reports"() {
        setup:
        loginAsGrantManager(browser)

        when:
        to Organisation, orgId

        waitFor 20, {
            reportingTab.click()
        }

        then:
        waitFor { reportsTabPane.displayed }

        when: "The first report is marked as submitted"
        reportsTabPane.reports[0].isSubmitted()

        and:
        reportsTabPane.reports[0].approve()

        then:
        waitFor {hasBeenReloaded()}

        when:
        reportingTab.click()
        waitFor { reportsTabPane.displayed }

        then:
        reportsTabPane.reports[0].isApproved()

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

        waitFor {
            reportingTab.click()
        }

        then: "The first report is marked as submitted"
        reportsTabPane.reports[0].isSubmitted()

        and:"The not required button is not visible"
        !reportsTabPane.reports[1].notRequired()

    }

    def "The not required button is visible to a Site Admin user"() {
        setup:
        loginAsMeritAdmin(browser)

        when: "Display the reporting tab, then view the approved report"
        to Organisation, orgId

        waitFor {
            reportingTab.click()
        }

        then:
        waitFor { reportsTabPane.displayed }

        when: "The first report is marked as submitted"
        reportsTabPane.reports[0].isSubmitted()

        then:"The not required button is not visible"
        reportsTabPane.reports[1].notRequired()

    }

}


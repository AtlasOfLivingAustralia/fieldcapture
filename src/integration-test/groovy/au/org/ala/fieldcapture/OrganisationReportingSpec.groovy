package au.org.ala.fieldcapture

import com.icegreen.greenmail.util.GreenMail
import pages.Organisation
import spock.lang.Shared

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
        loginAsUser('1', browser)

        when:
        to Organisation, orgId

        then:
        waitFor {at Organisation}
        reportingTab.click()

        then:
        waitFor { reportsTabPane.displayed }
        reportsTabPane.reports.size() > 0

    }

    def "We can specify the core services reporting frequency"() {
        setup:
        loginAsGrantManager(browser)

        when: "Display the reporting tab"
        to Organisation, orgId

        waitFor 20, {
            adminTab.click()
        }


        then:
        waitFor 10, { adminTabContent.displayed }

        when:
        def reportingSection = adminTabContent.viewReportingSection()
        reportingSection.coreServicesGroup = "Quarterly (First period ends 30 September 2023)"

        reportingSection.saveReportingGroups()

        then:
        waitFor 20,{
            hasBeenReloaded()
        }

        then:
        waitFor 30, {
            reportingTab.click()
        }


        then:
        waitFor 60, { reportsTabPane.displayed }
        reportsTabPane.reports.size() > 0

    }


}


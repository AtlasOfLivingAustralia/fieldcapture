package au.org.ala.fieldcapture

import com.icegreen.greenmail.util.GreenMail
import pages.CreateOrganisation
import pages.EditOrganisation
import pages.Organisation
import pages.OrganisationList
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

}


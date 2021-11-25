package au.org.ala.fieldcapture

import pages.CreateOrganisation
import pages.Organisation
import pages.EditOrganisation
import pages.OrganisationList

class CreateOrEditOrganisationSpec extends StubbedCasSpec {

    def orgId = "test_organisation"
    def setupSpec(){
        useDataSet("dataset_mu")
    }

    def cleanup() {
        logout(browser)
    }

    def "Create Organisation"(){
        setup: "Only MERIT administrators can create organisations in MERIT"
        loginAsMeritAdmin(browser)

        when:
        to OrganisationList

        and:
        waitFor {at OrganisationList}
        createOrganisation.click()

        then:
        waitFor {
            at CreateOrganisation
        }
        when:
        details.abn = "11111111111"
        waitFor {details.prePopulateABN.displayed}
        details.prePopulateABN.click()
        waitFor { details.name.displayed}
        details.description = "Test Organisation Description test"
        details.save()

        then:
        waitFor (10){ at Organisation}
        aboutTab.click()
        orgName.text() == "THE TRUSTEE FOR PSS FUND Test"
        waitFor {orgDescription.displayed }
        orgDescription.text() == "Test Organisation Description test"
        waitFor {orgAbn.displayed }
        orgAbn.text() == "11111111111"

    }

    def "As a user with admin permissions, I can edit a organisation"() {
        setup: "log in as userId=1 who is a  admin for the organisation with organisationId=test_organisation"
        loginAsUser('1', browser)

        when:
        to Organisation, orgId

        and:
        edit()

        then:
        waitFor  {at EditOrganisation}
        and: "The organisation name is not editable by normal users"
        details.isNameReadOnly() == true

        when:

        details.abn = "66666666666"
        waitFor {details.prePopulateABN.displayed}
        details.description = "Test Organisation Description test"
        details.save()

        then:
        waitFor (10){ at Organisation}
        aboutTab.click()
        waitFor {orgDescription.displayed }
        orgDescription.text() == "Test Organisation Description test"
        waitFor {orgAbn.displayed }
        orgAbn.text() == "66666666666"
    }


    def "Checking Security Vulnerability after injecting Script tag in Edit organisation page"() {
        setup: "login as a merit admin so the organisation name is editable"
        loginAsMeritAdmin(browser)

        when:
        to Organisation, orgId

        and:
        edit()

        then:
        waitFor 20, {at EditOrganisation}

        when:
        details.abn = "33333333333"
        waitFor {details.prePopulateABN.displayed}
        details.prePopulateABN.click()
        waitFor { details.name.displayed}
        details.name = "Test Organisation Test 2 <script>alert('Test')</script>"
        details.description = "Test Organisation Description test"
        details.save()

        then:
        waitFor { at Organisation}
        aboutTab.click()
        orgName.text() == "Test Organisation Test 2 <script>alert('Test')</script>"
        waitFor {orgDescription.displayed }
        orgDescription.text() == "Test Organisation Description test"
        waitFor {orgAbn.displayed }
        orgAbn.text() == "33333333333"
    }
}

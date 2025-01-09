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
        details.abnStatus = "Active"
        details.abn = "51824753556"
        waitFor {details.prePopulateABN.displayed}
        details.prePopulateABN.click()
        waitFor { details.name.displayed}
        details.description = "Test Organisation Description test"
        details.save()

        then:
        waitFor (10){ at Organisation}

        when:
        openAboutTab()

        then:
        orgName.text() == "The Trustee for Pss Fund Test"
        waitFor {orgDescription.displayed }
        orgDescription.text() == "Test Organisation Description test"
        waitFor {orgAbn.displayed }
        orgAbn.text() == "51824753556"

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

        when:
        details.description = "Test Organisation Description test"
        details.save()

        then:
        waitFor (10){ at Organisation}

        when:
        openAboutTab()

        then:
        orgDescription.text() == "Test Organisation Description test"
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
        details.abnStatus = "Active"
        details.abn = "98434926368"
        waitFor {details.prePopulateABN.displayed}
        details.prePopulateABN.click()
        waitFor { details.name.displayed}
        details.name = "Test Organisation Test 2 <script>alert('Test')</script>"
        details.description = "Test Organisation Description test"
        details.save()

        then:
        waitFor { at Organisation}

        when:
        openAboutTab()

        then:
        orgName.text() == "Test Organisation Test 2 <script>alert('Test')</script>"
        waitFor {orgDescription.displayed }
        orgDescription.text() == "Test Organisation Description test"
        waitFor {orgAbn.displayed }
        orgAbn.text() == "98434926368"
    }
}


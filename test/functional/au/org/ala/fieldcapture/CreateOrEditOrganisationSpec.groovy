package au.org.ala.fieldcapture

import pages.CreateOrganisation
import pages.Organisation
import pages.EditOrganisation
import pages.OrganisationList

class CreateOrEditOrganisationSpec extends StubbedCasSpec {

    def orgId = "test_organisation"
    def setup(){
        useDataSet("dataset_mu")
    }

    def cleanup() {
        logout(browser)
    }

    def "Create Organisation"(){
        setup: "log in as userId=1 who is a  admin for the organisation with organisationId=test_program"
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

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
        setup: "log in as userId=1 who is a  admin for the organisation with organisationId=test_program"
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to Organisation, orgId

        and:
        edit()

        then:
        waitFor  {at EditOrganisation}

        when:

        details.abn = "11111111111"
        waitFor {details.prePopulateABN.displayed}
        details.prePopulateABN.click()
        waitFor { details.name.displayed}
        details.name.value("Test Organisation Test 2")
        details.description = "Test Organisation Description test"
        details.save()

        then:
        waitFor (10){ at Organisation}
        aboutTab.click()
        orgName.text() == "Test Organisation Test 2"
        waitFor {orgDescription.displayed }
        orgDescription.text() == "Test Organisation Description test"
        waitFor {orgAbn.displayed }
        orgAbn.text() == "11111111111"
    }


    def "Checking Security Vulnerability after injecting Script tag in Edit organisation page"() {
        setup: "log in as userId=1 who is a  admin for the organisation with organisationId=test_program"
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to Organisation, orgId

        then:
        waitFor {adminTab.displayed}

        when:
        adminTab.click()

        then:
        waitFor 10, { adminTabContent.displayed }
        waitFor 10, { adminTabContent.editButton.displayed }

        when:
        adminTabContent.editButton.click()

        then:
        waitFor 20, {at EditOrganisation}

        when:
        details.abn = "11111111111"
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
        orgAbn.text() == "11111111111"
    }
}

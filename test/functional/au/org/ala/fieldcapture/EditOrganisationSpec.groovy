package au.org.ala.fieldcapture

import pages.Organisation
import pages.EditOrganisation

class EditOrganisationSpec extends StubbedCasSpec {

    def setup(){
        useDataSet("dataset_mu")
    }

    def cleanup() {
        logout(browser)
    }

    def "As a user with admin permissions, I can edit a program"() {
        setup: "log in as userId=1 who is a program admin for the program with programId=test_program"
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to Organisation

        and:
        edit()

        then:
        waitFor  {at EditOrganisation}

        when:
        details.name= "Test Organisation Test 2"
        details.abn = "12345678910"
        details.description = "Test  Organisation Description test"

        then:
        details.save()

    }

}

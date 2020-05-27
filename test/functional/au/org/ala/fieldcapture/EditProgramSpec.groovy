package au.org.ala.fieldcapture

import pages.EditProgram
import pages.RLPProgramPage

class EditProgramSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "As a user with admin permissions, I can edit a program"() {
        setup: "log in as userId=1 who is a program admin for the program with programId=test_program"
        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to RLPProgramPage

        and:
        edit()

        then:
        waitFor { at EditProgram }

        when:
        details.description= "Testing"
        details.url = "http://ala.org.au"
        details.save()


        then:
        at RLPProgramPage
        overviewTab.click()
        overviewTab.displayed
        description.text() == "Testing"
        visitUs.text() == "http://ala.org.au"

        and:
        "The program details have been updated"
    }

}

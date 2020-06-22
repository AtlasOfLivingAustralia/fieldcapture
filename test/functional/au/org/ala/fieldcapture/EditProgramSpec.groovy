package au.org.ala.fieldcapture

import pages.EditProgram
import pages.RLPEditPageWithNoParent
import pages.RLPProgramPage

class EditProgramSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "As a user with admin permissions, I can edit a program with parent id"() {
        setup: "log in as userId=1 who is a program admin for the program with programId=test_program"
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to RLPProgramPage

        and:
        edit()

        then:
        waitFor { at EditProgram }

        when:
        details.newParentProgramId.click()
        details.newParentProgramId.find("span").find{it.text() == "No Parent"}.click()
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

    def "As a user with admin permissions, I can edit a program with No parent"() {
        setup: "log in as userId=1 who is a program admin for the program with programId=test_programId"
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to RLPEditPageWithNoParent

        and:
        edit()

        then:
        waitFor { at EditProgram }

        when:
        details.newParentProgramId.click()
        details.newParentProgramId.find("span").find{it.text() == "No Parent"}.click()
        details.description= "Testing"
        details.url = "http://ala.org.au"
        details.save()


        then:
        at RLPEditPageWithNoParent
        overviewTab.click()
        overviewTab.displayed
        description.text() == "Testing"
        visitUs.text() == "http://ala.org.au"

        and:
        "The program details have been updated"
    }
}

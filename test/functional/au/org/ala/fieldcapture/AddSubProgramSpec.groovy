package au.org.ala.fieldcapture

import pages.AddSubProgram
import pages.RLPProgramPage

class AddSubProgramSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "I can create a Sub program as an FC_ADMIN"() {

        setup: "log in as userId=1 who is a program admin for the program with programId=test_program"
        login([userId: '1', role: "ROLE_USER", email: 'user@nowhere.com', firstName: "MERIT", lastName: 'User'], browser)

        when:
        to RLPProgramPage

        and:
        addSubProgram()

        then:
        waitFor( 10, { at AddSubProgram }) // This has occasionally timed out.

        when:
        program.name = "A test program"
        program.description = "A test description"
        program.save()


        then:
        at RLPProgramPage


        when:
        overviewTab.click()

        then:
        waitFor{overviewTab.displayed}

        when:
        subProgramTabContent.subProgramTitle.click()

        then:
        waitFor( 10,{subProgramTabContent.displayed})

        and:
        subProgramTabContent.subProgramName.text() == "A test program"
        subProgramTabContent.subProgramDescription.text() == "A test description"

    }
}
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
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to RLPProgramPage

        and:
        addSubProgram()

        then:
        waitFor{ at AddSubProgram } // This has occasionally timed out.

        when:
        program.name = "add new sub program"
        program.description = "A test description"
        program.save()


        then:
        at RLPProgramPage


        when:
        overviewTab.click()

        then:
        waitFor{overviewTab.displayed}

        when:
        def subContent = subProgramTabContent

        then:
        subContent !=null
        waitFor {subContent[0].subProgramTitle.text() == "add new sub program"}

        when:
        subContent[0].subProgramTitle.click()

        then:
        waitFor( 10,{subContent.displayed})

        and:
        subContent[0].subProgramName.text() == "add new sub program"
        subContent[0].subProgramDescription.text() == "A test description"

    }
}

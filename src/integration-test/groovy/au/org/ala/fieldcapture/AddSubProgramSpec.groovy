package au.org.ala.fieldcapture

import pages.AddSubProgram
import pages.ProgramPage

class AddSubProgramSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "I can create a Sub program as an ALA administrator"() {

        setup: "log in as userId=1 who is a program admin for the program with programId=test_program"
        loginAsAlaAdmin(browser)

        when:
        to ProgramPage, 'test_program'

        and:
        addSubProgram()

        then:
        waitFor{ at AddSubProgram } // This has occasionally timed out.

        when:
        program.name = "add new sub program"
        program.description = "A test description"
        program.save()


        then:
        waitFor { at ProgramPage }


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

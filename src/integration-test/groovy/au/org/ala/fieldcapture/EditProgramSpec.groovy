package au.org.ala.fieldcapture

import pages.EditProgram
import pages.ProgramPage

class EditProgramSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "As a user with admin permissions, I can edit a program with parent id"() {
        setup: "log in as userId=1 who is a program admin for the program with programId=test_program"
        loginAsMeritAdmin(browser)

        when:
        to ProgramPage, 'test_program'

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
        waitFor {at ProgramPage}
        overviewTab.click()
        overviewTab.displayed
        description.text() == "Testing"
        visitUs.text() == "http://ala.org.au"

        and:
        "The program details have been updated"
    }

    def "As a user with admin permissions, I can edit a program with No parent"() {
        setup: "log in as userId=1 who is a program admin for the program with programId=test_programId"
        loginAsMeritAdmin(browser)

        when:
        to ProgramPage, 'test_program'

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
        waitFor {at ProgramPage}
        overviewTab.click()
        overviewTab.displayed
        description.text() == "Testing"
        visitUs.text() == "http://ala.org.au"

        and:
        "The program details have been updated"
    }

    def "As a user with admin permissions, can edit program and insert script injection"() {
        setup: "log in as userId=1 who is a program admin for the program with programId=test_programId"
        loginAsMeritAdmin(browser)

        when:
        to ProgramPage, 'test_program'

        and:
        edit()

        then:
        waitFor { at EditProgram }

        when:
        details.newParentProgramId.click()
        details.newParentProgramId.find("span").find{it.text() == "No Parent"}.click()
        details.name= "Testing <script>alert('Test')</script>"
        details.description= "Testing"
        details.url = "http://ala.org.au"
        details.save()


        then:
        waitFor { at ProgramPage }
        overviewTab.click()
        overviewTab.displayed
        description.text() == "Testing"
        visitUs.text() == "http://ala.org.au"

        and:
        "The program details have been updated"
    }
}

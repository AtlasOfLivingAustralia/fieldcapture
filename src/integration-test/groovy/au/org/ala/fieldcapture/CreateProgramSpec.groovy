package au.org.ala.fieldcapture


import pages.AddProgram
import pages.ProgramPage

class CreateProgramSpec extends StubbedCasSpec {


    def setup() {
        useDataSet('dataset1')
    }
    def "I can create a program as an FC_ADMIN"() {

        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to AddProgram

        then:
        waitFor 10, {at AddProgram} // This has occasionally timed out.

        when:
        program.name = "A test program"
        program.description = "A test description"
        program.save()

        then:
        waitFor 30, {at ProgramPage}

        when:
        overviewTab.click()

        then:
        name.text() == "A test program"
        waitFor {description.text().contains('A test description')} // markdowntohtml wrap this in <p> tags
    }

}

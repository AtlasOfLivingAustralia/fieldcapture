package au.org.ala.fieldcapture


import pages.AddProgram
import pages.ProgramPage

class CreateProgramSpec extends StubbedCasSpec {

    def "I can create a program as an FC_ADMIN"() {

        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to AddProgram

        then:
        at AddProgram

        when:
        program.name = "A test program"
        program.description = "A test description"
        program.save()

        then:
        at ProgramPage
    }

}

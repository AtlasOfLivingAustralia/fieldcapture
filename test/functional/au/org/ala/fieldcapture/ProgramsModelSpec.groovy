package au.org.ala.fieldcapture

import pages.EntryPage
import pages.ProgramsModel
import spock.lang.Stepwise

/**
 * Specifications for the Programs Model page
 */
@Stepwise
class ProgramsModelSpec extends FieldcaptureFunctionalTest {

    def setupSpec() {
        useDataSet('data-set-1')
    }

    def "the programs model page should only be displayed to admins"() {
        logout(browser)

        when:
        via ProgramsModel

        then:
        at EntryPage
    }

    def "the list of programs should be displayed"() {
        logout(browser)
        loginAsAlaAdmin(browser)

        when:
        to ProgramsModel

        then:
        at ProgramsModel
        def programCount = programs.size()
        programCount > 0 // Don't want to hard code this as it changes.
    }

    def "a new program can be added"() {

        when: "A new program is added"
        to ProgramsModel
        def programCount = programs.size()

        addProgram()
        def program = programs[programs.size()-1]
        program.nameInput = 'Test'
        program.select()


        then:
        programs.size() == programCount + 1

        when: "The new program is saved"
        save()
        to ProgramsModel

        then: "The program persists"
        at ProgramsModel

        programs.size() == programCount + 1
    }

    def "a program can be deleted"() {
        logout(browser)
        loginAsAlaAdmin(browser)

        when: "The new program is deleted"
        to ProgramsModel

        def programCount = programs.size()
        def program = programs().find { it.name == 'Test'}
        program.select()

        program.delete()

        save()
        to ProgramsModel // Refresh the page

        then: "The program has been deleted"

        programs.size() == programCount - 1

        programs().find { it.name == 'Test'} == null

    }

}

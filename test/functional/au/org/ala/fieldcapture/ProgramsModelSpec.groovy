package au.org.ala.fieldcapture

import pages.EntryPage
import pages.ProgramsModel
import pages.ProjectIndex
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
        deleteProgramByName('Test')

        save()
        to ProgramsModel // Refresh the page

        then: "The program has been deleted"

        programs.size() == programCount - 1

        programs().find { it.name == 'Test'} == null

    }

    def "the default visibility for project attributes is all visible" () {
        logout(browser)
        loginAsAlaAdmin(browser)

        when: "Add a new program with the attributes we want"
        to ProgramsModel
        addProgram()
        def program = programs[programs.size() - 1]
        program.nameInput = 'Test'
        program.select()

        then: "Defaults for a new program is all content is required"

        program.optionalProjectContent.each { println it.value() }

    }

    def "the programs model can specify the visibility of various aspects of a project" () {
        logout(browser)
        loginAsAlaAdmin(browser)

        def newProgramName = 'Test'

        when: "Setup details for the program using defaults"
        to ProgramsModel
        addProgram()
        def program = programs[programs.size() - 1]
        program.nameInput = newProgramName
        program.select()

        program.reportsViaMERIT = true
        program.projectsStartOnContractDates = true
        def meriPlan = program.optionalProjectContent.find{ it.value() == 'MERI Plan'}

        save()


        def projectId = "cb5497a9-0f36-4fef-9f6a-9ea832c5b68c"
        waitFor {to ProjectIndex, projectId}

        then: "the optional content is displayed"
        meriPlanTab.displayed == true
        activitiesTab.click()
        waitFor {plansAndReports.displayed}
        plansAndReports.risksAndThreats.displayed == true


        when: "Configure the program to hide the MERI plan"
        to ProgramsModel

        program = selectProgramByName(newProgramName)
        def meriPlanVisible = program.optionalProjectContent.find {it.value() == 'MERI Plan'}
        meriPlanVisible.value(false)

        save()

        waitFor {to ProjectIndex, projectId}

        then: "The MERI plan should be hidden"

        meriPlanTab.empty == true
        activitiesTab.click()
        waitFor{plansAndReports.displayed}
        plansAndReports.risksAndThreats.displayed == true


        when: "Configure the program to hide the risks and threats"
        to ProgramsModel

        program = selectProgramByName(newProgramName)
        def risksAndThreatsVisible = program.optionalProjectContent.find {it.value() == 'Risks and Threats'}
        risksAndThreatsVisible.value(false)
        save()

        waitFor {to ProjectIndex, projectId}

        then: "The risks and threats should be hidden"
        meriPlanTab.empty == true
        activitiesTab.click()
        waitFor{plansAndReports.displayed}

        plansAndReports.risksAndThreats.empty == true


        // Delete the program - tidy up.
        to ProgramsModel
        deleteProgramByName(newProgramName)
    }

}

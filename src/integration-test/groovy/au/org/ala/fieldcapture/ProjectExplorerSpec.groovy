package au.org.ala.fieldcapture

import groovy.util.logging.Slf4j
import pages.Facet
import pages.ProjectExplorer
import spock.lang.Stepwise

@Slf4j
@Stepwise
class ProjectExplorerSpec extends StubbedCasSpec {

    void setup() {
        useDataSet('dataset2')
    }

    void "The project explorer displays a list of projects"() {

        setup:
        loginAsAlaAdmin(browser)
        def expectedProjects = new HashSet((1..9).collect{"Project $it"})
        expectedProjects.add("Configurable MERI plan project")
        expectedProjects.add("Default outcome project")
        expectedProjects.add("project completed")
        expectedProjects.add("project active")
        expectedProjects.add("Grants project")
        expectedProjects.add("project application")


        when: "Reindex to ensure the project explorer will have predictable data"
        to AdminTools
        reindex()

        and: "Logout so the rest of the test is run as an unauthenticated user"
        logout(browser)
        to ProjectExplorer
        waitForIndexing()

        then: "The downloads accordion is not visible to unauthenticated users"
        downloadsToggle.empty == true

        when: "collapse the map section"
        if (map.displayed == true){
            waitFor {
                map.displayed
            }
            mapToggle.click()
        }

        then:
        waitFor { map.displayed == false }

        when: "expand the projects section"
        displayProjectList()

        then:
        waitFor 20, {
            projects.size() == 15
            facets.size() == 12
            chooseMoreFacetTerms.size() == 0
        }

        new HashSet(projects.collect{it.name}) == expectedProjects

        when: "We filter project by dates"
        dateFacet.click()

        then:
        waitFor 10, {
            clearDatesBtn.displayed
        }

        when:
        at ProjectExplorer // reset timer
        setFromDate("01/06/2015")

        then:
        waitFor {hasBeenReloaded()}
        waitFor 10, {
            clearDatesBtn.displayed
        }
        waitFor 20, {
            projects.size() == 15
        }

        when: "We filter project by dates"
        at ProjectExplorer // reset timer
        setToDate("02/07/2018")

        then:
        waitFor {hasBeenReloaded()}
        waitFor 10, {
            clearDatesBtn.displayed
        }
        waitFor 20, {
            projects.size() == 14
        }

        when: "We filter project by dates"
        at ProjectExplorer
        dateOption.click()

        then:
        waitFor {hasBeenReloaded()}
        waitFor 20, {
            clearDatesBtn.displayed
        }
        waitFor 20, {
            projects.size() == 1
        }

        when: "We clear dates"
        at ProjectExplorer
        clearDatesBtn.click()

        then:
        waitFor {hasBeenReloaded()}
        waitFor 10, {
            clearDatesBtn.displayed
        }
        waitFor 20, {
            projects.size() == 15
            facets.size() == 12
            chooseMoreFacetTerms.size() == 0
        }

        when:
        Facet projectStatus = findFacetByName("Project Status")
        projectStatus.expand()

        then:
        projectStatus.items*.name == ['Active', 'Application', 'Completed']

        when:
        projectStatus.findItemByName("Application").select()

        then:
        waitFor { hasBeenReloaded() }
        waitFor { projects.size() == 1 }

        when: "We expand the project to view the details"
        projects[0].toggle()

        then:
        projects[0].description() == "Project 1 description"

        and: "The downloads are not visible as the user is not an MERIT administrator"
        !projects[0].downloadXlsx.displayed
        !projects[0].downloadJson.displayed
    }

    def "MERIT administrators can download project information via the project explorer"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProjectExplorer
        displayProjectList()
        projects[0].toggle()

        then:
        projects[0].downloadXlsx.displayed
        projects[0].downloadJson.displayed

        when:
        def xlsx = downloadBytes(projects[0].downloadXlsx.@href)

        then:
        xlsx != null
    }

}

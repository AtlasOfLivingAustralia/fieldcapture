package au.org.ala.fieldcapture

import pages.AdminTools
import pages.ProjectExplorer
import spock.lang.Stepwise

@Stepwise
class ProjectExplorerSpec extends StubbedCasSpec {

    void setup() {
        useDataSet('dataset2')
    }

    void "The project explorer displays a list of projects"() {

        setup:
        login([userId: '2', role: "ROLE_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'ALA_ADMIN'], browser)

        when:
        to AdminTools

        then:
        at AdminTools

        when: "Reindex to ensure the project explorer will have predictable data"
        reindex()
        logout(browser)

        boolean empty = true
        while (empty) {
            to ProjectExplorer
            empty = emptyIndex()
        }


        then: "The downloads accordion is not visible to unauthenticated users"
        Thread.sleep(2000) // there are some animations that make this difficult to do waiting on conditions.
        downloadsToggle.empty == true

        when: "collapse the map section"
        if(map.displayed == true){
            waitFor {
                map.displayed
            }
            mapToggle.click()
        }

        then:
        waitFor { map.displayed == false }

        when: "expand the projects section"
        def expectedProjects = new HashSet((1..9).collect{"Project $it"})
        expectedProjects.add("Configurable MERI plan project")
        projectsToggle.click()
        waitFor { projectPagination.displayed }

        then:
        waitFor 20, {

            to ProjectExplorer
            waitFor { projectPagination.displayed }

            projects.size() == 10
            facets.size() == 14
            chooseMoreFacetTerms.size() == 0
        }

        new HashSet(projects.collect{it.name}) == expectedProjects

        when:
        facetAccordion.eq(1).click()
        waitFor {
            facetTerms.eq(0).displayed
        }

        facetTerms.eq(0).click()

        then:
        waitFor {at ProjectExplorer}

    }
}

package au.org.ala.fieldcapture

import pages.AdminTools
import pages.Facet
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
        def expectedProjects = new HashSet((1..9).collect{"Project $it"})
        expectedProjects.add("Configurable MERI plan project")
        expectedProjects.add("Default outcome project")
        expectedProjects.add("project completed")
        expectedProjects.add("project active")
        expectedProjects.add("Grants project")
        expectedProjects.add("project application")

        when:
        to AdminTools

        then:
        at AdminTools

        when: "Reindex to ensure the project explorer will have predictable data"
        reindex()
        waitFor {
            logout(browser)
        }

        boolean empty = true
        while (empty) {
            to ProjectExplorer
            empty = emptyIndex()
        }


        then: "The downloads accordion is not visible to unauthenticated users"
        Thread.sleep(2000) // there are some animations that make this difficult to do waiting on conditions.
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

        when:
        Facet projectStatus = findFacetByName("Project Status")
        projectStatus.expand()

        then:
        projectStatus.items*.name == ['Active', 'Application', 'Completed']

        when:
        projectStatus.findItemByName("Application").select()

        then:
        waitFor { hasBeenReloaded() }
        projects.size() == 1

        when: "We expand the project to view the details"
        projects[0].toggle()

        then:
        projects[0].description() == "Project 1 description"

        and: "The downloads are not visible as the user is not an FC_ADMIN"
        !projects[0].downloadXlsx.displayed
        !projects[0].downloadJson.displayed
    }

    def "FC_ADMINs can download project information via the project explorer"() {
        setup:
        login([userId: '22', role: "ROLE_FC_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

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

package au.org.ala.fieldcapture

import pages.AdminTools
import pages.ProjectExplorer

class SearchSpec extends StubbedCasSpec {

    void setup(){
        useDataSet("data_static_score")
    }

    void cleanup() {
        logout(browser)
    }

    def "Search project using search bar in header"(){
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

        inputText = '"Project 5"' // searching a specific project

        then:
        searchProject() == null

        Thread.sleep(2000) // there are some animations that make this difficult to do waiting on conditions.
        downloadsToggle.empty == true

        when: "collapse the map section"
        waitFor {
            map.displayed
        }
        mapToggle.click()

        then:
        waitFor { map.displayed == false }

        when: "expand the projects section"
        def expectedProjects = new HashSet((5).collect{"project $it"})
        projectsToggle.click()
        waitFor { projectPagination.displayed }

        then:
        new HashSet(projects.collect{it.name}) == expectedProjects
    }
}

package au.org.ala.fieldcapture

import pages.AdminTools
import pages.ProjectExplorer

class ProjectExplorerCrossSiteInjectionSpec  extends StubbedCasSpec{
    void setup() {
        useDataSet('dataset_crossSite')
    }

    void "Project Explorer Cross Site Injecting check "() {

        setup:
        login([userId: '2', role: "ROLE_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'ALA_ADMIN'], browser)

        when:
        to AdminTools

        then:
        at AdminTools

        when: "Reindex to ensure the project explorer will have predictable data"
        reindex()
        waitFor {
            logout(browser)
        }
        to ProjectExplorer

//        boolean empty = true
//        while (empty) {
//            to ProjectExplorer
//            empty = emptyIndex()
//        }


        then: "The downloads accordion is not visible to unauthenticated users"
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
        def expectedProjects = new HashSet()
        expectedProjects.add("Project Script Injection <script>alert('Test')</script>")
        projectsToggle.click()

        then:
        waitFor 20, {

            to ProjectExplorer
        }
        waitFor(10) {projects.displayed}
        def projectList = projects

        and:
        waitFor(20){projectList}
        projectList.name[0] =="Project Script Injection <script>alert('Test')</script>"
        projectList.managementUnit[0] == 'test mu <script>alert("MU")</script>'
    }
}

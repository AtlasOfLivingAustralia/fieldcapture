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
        logout(browser)
        to ProjectExplorer

//        boolean empty = true
//        while (empty) {
//            to ProjectExplorer
//            empty = emptyIndex()
//        }


        then: "The downloads accordion is not visible to unauthenticated users"
        Thread.sleep(2000) // there are some animations that make this difficult to do waiting on conditions.
        downloadsToggle.empty == true

        when: "expand the projects section"
        displayProjectList()

        then:
        projects.name[0] =="Project Script Injection <script>alert('Test')</script>"
        projects.managementUnit[0] == 'test mu <script>alert("MU")</script>'
    }
}

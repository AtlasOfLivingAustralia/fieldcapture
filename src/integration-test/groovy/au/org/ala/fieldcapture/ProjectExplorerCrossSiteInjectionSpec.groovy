package au.org.ala.fieldcapture

import pages.AdminTools
import pages.ProjectExplorer

class ProjectExplorerCrossSiteInjectionSpec  extends StubbedCasSpec{
    void setup() {
        useDataSet('dataset_crossSite')
    }

    void "Project Explorer Cross Site Injecting check "() {

        setup:
        loginAsAlaAdmin(browser)
        to AdminTools
        reindex()
        logout(browser)

        when:
        to ProjectExplorer
        waitForIndexing()

        then: "The downloads accordion is not visible to unauthenticated users"
        downloadsToggle.empty == true

        when: "expand the projects section"
        displayProjectList()

        then:
        projects.name[0] =="Project Script Injection <script>alert('Test')</script>"
        projects.managementUnit[0] == 'test mu <script>alert("MU")</script>'
    }
}

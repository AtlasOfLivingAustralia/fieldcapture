package au.org.ala.fieldcapture

import pages.AdminTools
import pages.ProjectExplorer

class ProjectExplorerMapTabSpec extends StubbedCasSpec {

    void setup(){
        useDataSet("dataset_project_sites")
    }

    void "The project explorer displays a list of projects"() {

        setup:"Reindex to ensure the project explorer will have predictable data"
        loginAsAlaAdmin(browser)
        to AdminTools
        reindex()
        logout(browser)

        when:
        to ProjectExplorer
        waitForIndexing()

        then: "The downloads accordion is not visible to unauthenticated users"
        downloadsToggle.empty == true

        when: "open the map section"
        if(map.displayed == false) {
            mapToggle.click()
            waitFor {
                map.displayed
            }
        }

        then:
        waitFor { map.displayed == true }

        and:
        waitFor 10, {
            $('#mapView img[src*="measle"]').size() ==  1
        }


    }

}

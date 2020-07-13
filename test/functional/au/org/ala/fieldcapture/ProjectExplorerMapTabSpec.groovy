package au.org.ala.fieldcapture

import pages.AdminTools
import pages.ProjectExplorer

class ProjectExplorerMapTabSpec extends StubbedCasSpec {

    void setup(){
        useDataSet("dataset_project_sites")
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

        when: "open the map section"
        if(map.displayed == false){
            waitFor {
                map.displayed
            }
            mapToggle.click()
        }

        then:
        waitFor { map.displayed == true }

        and:
        $('#mapView img[src*="measle"]').size() ==  2

    }

}

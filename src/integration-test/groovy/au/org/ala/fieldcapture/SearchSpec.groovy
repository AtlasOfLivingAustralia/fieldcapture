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

//    def "Search project using search bar in header"(){
//        setup:
//        loginAsAlaAdmin(browser)
//
//        when:
//        to AdminTools
//
//        then:
//        at AdminTools
//
//        when: "Reindex to ensure the project explorer will have predictable data"
//        reindex()
//        waitFor {
//            logout(browser)
//        }
//
//        boolean empty = true
//        while (empty) {
//            to ProjectExplorer
//            empty = emptyIndex()
//        }
//
//        inputText = '"Project 5"' // searching a specific project
//
//        then:
////        waitFor { $(".search").displayed }
//        $("input.search.button").click()
//
//        Thread.sleep(2000) // there are some animations that make this difficult to do waiting on conditions.
//        downloadsToggle.empty == true
//
//        when: "collapse the map section"
//        if(map.displayed == true){
//            waitFor {
//                map.displayed
//            }
//            mapToggle.click()
//        }
//
//        then:
//        waitFor { map.displayed == false }
//
//        when: "expand the projects section"
//        def expectedProjects = new HashSet((5).collect{"project $it"})
//        projectsToggle.click()
//        waitFor 30, { projectPagination.displayed }
//
//        then:
//        new HashSet(projects.collect{it.name}) == expectedProjects
//    }
}

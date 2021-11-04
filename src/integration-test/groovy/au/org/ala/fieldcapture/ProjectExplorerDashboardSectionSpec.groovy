package au.org.ala.fieldcapture

import pages.AdminTools
import pages.ProjectExplorer

class ProjectExplorerDashboardSectionSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet("data_static_score")
    }

    void cleanup() {
        logout(browser)
    }

    def "The Project Explorer Dashboard display the output programme  and activity"(){

        setup: "Clear the cache to make the data reflect the dataset, then reindex"
        loginAsAlaAdmin(browser)

        to AdminTools
        clearCache()
        waitFor { hasBeenReloaded() }
        at AdminTools // Reset the at check for the next reload with the reindex call.
        reindex()
        logout(browser)

        when:
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
        dashboardToggle.click()
        waitFor {reportView.displayed}
        waitFor (5){dashboardContent.displayed}


        and:
        waitFor {dashboardContentList.size() == 3}
    }

    def "Reef 2050 Final Plan Action Report for July 2020 to June 2021 "() {
        when:
        to ProjectExplorer

        then: "The dashboard toggle will be remembered from the previous test"
        waitFor { viewReef2050PlanReport.displayed }
        waitFor { viewReef2050PlanReport.dashboardType.displayed }

        when:
        viewReef2050PlanReport.dashboardType.click()
        viewReef2050PlanReport.dashboardType.find("option").find{ it.value() == "reef2050PlanActionSelection" }.click()

        then:
        waitFor 10, {
            $("#selectPeriod").displayed
        }

        when:
        $("#selectPeriod").find("option").find{it.text()=="01 January 2018 - 30 June 2018"}.click()

        then:
        waitFor 10, { viewReef2050PlanReport.reefReportContent.displayed }

        and:
        viewReef2050PlanReport.reefReportContent.text() == "This is a dummy text"
    }
}

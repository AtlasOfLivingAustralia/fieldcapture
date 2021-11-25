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
        to ProjectExplorer
        waitForIndexing()

        then: "The downloads accordion is not visible to unauthenticated users"
        downloadsToggle.empty == true

        when: "collapse the map section"
        displayDashboardSection()

        then:
        waitFor {dashboardContentList.size() == 3}
    }

    def "Reef 2050 Final Plan Action Report for July 2020 to June 2021 "() {
        when:
        to ProjectExplorer
        displayDashboardSection()

        then:
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

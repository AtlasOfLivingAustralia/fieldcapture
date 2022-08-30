package au.org.ala.fieldcapture

import pages.AdminTools
import pages.ProjectExplorer
import pages.ProjectIndex

class ProjectDashboardTabSpec extends StubbedCasSpec {

    def projectId = 'project_10'

    void setup() {
        useDataSet('data_static_score')
    }

    void cleanup() {
        waitFor {
            logout(browser)
        }
    }
    def"I can view Project Dashboard tab as a MERIT administrator"(){
        setup: "log in as userId=1 who is a program admin for the program with programId=test_program"
        loginAsAlaAdmin(browser)


        when: "clearing the homepage static cache"
        to AdminTools

        then:
        at AdminTools
        waitFor {$("#btnClearMetadataCache").displayed}
        $("#btnClearMetadataCache").click()

        when:
        to AdminTools

        then:
        at AdminTools


        when: "Reindex to ensure the project explorer will have predictable data"
        reindex()
        to ProjectIndex, projectId

        then:
        at ProjectIndex

        and:
        waitFor {dashboardTab.displayed}
        dashboardTab.click()

        then:
        waitFor{ dashboardTab.displayed }
        waitFor 20,{dashboard.size() == 3}
        def dashboardList = dashboard

        and:
        dashboardList[0].serviceTitle.text() == "Collecting, or synthesising baseline data"
        dashboardList[0].serviceHelpText.text() == "Number of baseline data sets collected and/or synthesised"
        dashboardList[0].progresslabel.text() =="2/8"
        dashboardList[1].serviceTitle.text() == "Communication materials"
        dashboardList[1].serviceHelpText.text() == "Number of communication materials published"
        dashboardList[1].progresslabel.text() =="2/8"
        dashboardList[2].serviceTitle.text() == "Weed distribution survey"
        dashboardList[2].serviceHelpText.text() == "Area (ha) surveyed for weeds"
        dashboardList[2].progresslabel.text() =="15/10"


    }

}

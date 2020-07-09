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
        logout(browser)
    }
    def"I can view Project Dashboard tab as FC_ADMIN "(){
        setup: "log in as userId=1 who is a program admin for the program with programId=test_program"
        login([userId: '2', role: "ROLE_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'ALA_ADMIN'], browser)

        when:
        to AdminTools

        then:
        at AdminTools
     //   reindex()

        when: "Reindex to ensure the project explorer will have predictable data"
        reindex()
        logout(browser)

        boolean empty = true
        while (empty) {
            to ProjectExplorer
            empty = emptyIndex()
        }
        login([userId: '2', role: "ROLE_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'ALA_ADMIN'], browser)
        to ProjectIndex, projectId

        then:
        at ProjectIndex

        and:
        waitFor {dashboardTab.displayed}
        dashboardTab.click()

        then:
        waitFor{ dashboardTab.displayed }
        waitFor{ dashboard.displayed }

        and:
        dashboard[0].serviceTitle.text() == "Collecting, or synthesising baseline data"
        dashboard[0].serviceHelpText.text() == "Number of baseline data sets collected and/or synthesised"
        dashboard[0].progresslabel.text() =="2/8"

        dashboard[1].serviceTitle.text() == "Communication materials"
        dashboard[1].serviceHelpText.text() == "Number of communication materials published"
        dashboard[1].progresslabel.text() =="2/8"

        dashboard[2].serviceTitle.text() == "Weed distribution survey"
        dashboard[2].serviceHelpText.text() == "Area (ha) surveyed for weeds"
        dashboard[2].progresslabel.text() =="15/400"


    }

}

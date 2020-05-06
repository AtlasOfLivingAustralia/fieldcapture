package au.org.ala.fieldcapture

import pages.RlpProjectPage

class ProjectContentConfigurationSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset3')
    }

    def cleanup() {
        println "Logout"
        logout(browser)
        println "Logged out"
    }

    def "The program configuration can exclude content from the project template"() {
        setup:
        String projectId = 'excludedContent'
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        and:
        overviewTab.displayed == true
        dashboardTab.displayed == false
        documentsTab.displayed == false
        meriPlanTab.displayed == false
        sitesTab.displayed == false
        reportingTab.displayed == true
        adminTab.displayed == true

    }


}

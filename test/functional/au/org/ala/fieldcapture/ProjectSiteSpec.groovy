package au.org.ala.fieldcapture

import pages.ProjectPage
import pages.CreateSitesForProjects

class ProjectSiteSpec extends StubbedCasSpec {

    void setup() {
        useDataSet('data_static_score')
    }

    void cleanup() {
        logout(browser)
    }

    def"I can Sites point in the projects as FC_ADMIN "() {
        setup:
        login([userId: '2', role: "ROLE_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'ALA_ADMIN'], browser)

        when:
        to ProjectPage

        then:
        overviewTab.click()
        siteTab.click()
        waitFor {siteTabContents.displayed}
        def tableContent = tableContents
        and:
        tableContent[2].siteName.text() == "Site area for project"
        mapMarker.size() == 1
    }
}
